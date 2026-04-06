from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.ingestion.loader import load_documents
from app.ingestion.splitter import split_documents
from app.retrieval.vector_store import create_vector_store, load_vector_store
from app.retrieval.query import get_qa_chain
from pydantic import BaseModel
from app.retrieval.chat import create_chat_chain

class QueryRequest(BaseModel):
    question: str
    
class ChatRequest(BaseModel):
    session_id: str
    question: str

router = APIRouter()

chat_sessions = {}

VECTOR_DB_PATH = "db"

# Global cache (simple version)
vectorstore = None
qa_chain = None


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global vectorstore, qa_chain

    file_path = f"data/{file.filename}"

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process
    docs = load_documents(file_path)
    chunks = split_documents(docs)

    for i, chunk in enumerate(chunks):
        if not isinstance(chunk.metadata, dict):
            chunk.metadata = {}
        chunk.metadata["chunk_id"] = i
        chunk.metadata.setdefault("source", os.path.basename(file_path))
        chunk.metadata.setdefault("topic", os.path.splitext(os.path.basename(file_path))[0])

    vectorstore = create_vector_store(chunks)
    qa_chain = get_qa_chain(vectorstore)

    return {"message": "File uploaded and processed successfully"}



@router.post("/ask")
def ask_question(request: QueryRequest):
    global vectorstore, qa_chain

    if qa_chain is None:
        vectorstore = load_vector_store()
        qa_chain = get_qa_chain(vectorstore)

    response = qa_chain.invoke({"query": request.question})
    sources = [doc.metadata for doc in response.get("source_documents", [])]

    return {
        "answer": response.get("result") or response.get("answer"),
        "sources": sources
    }

@router.post("/chat")
def chat(request: ChatRequest):
    session_id = request.session_id

    if session_id not in chat_sessions:
        chat_sessions[session_id] = create_chat_chain()

    chat_chain = chat_sessions[session_id]

    response = chat_chain.invoke({
        "query": request.question
    })
    sources = [doc.metadata for doc in response.get("source_documents", [])]

    return {
        "answer": response.get("result") or response.get("answer"),
        "sources": sources
    }