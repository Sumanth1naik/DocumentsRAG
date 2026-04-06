import os

# Import embeddings safely
try:
    from langchain_huggingface import HuggingFaceEmbeddings
except ImportError:
    try:
        from langchain_community.embeddings import HuggingFaceEmbeddings
    except ImportError:
        from langchain_classic.embeddings import HuggingFaceEmbeddings

# Import FAISS safely
try:
    from langchain_community.vectorstores import FAISS
except ImportError:
    from langchain.vectorstores import FAISS


DB_PATH = "db/faiss_index"


def get_embedding_model():
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


def create_vector_store(chunks):
    embedding = get_embedding_model()

    vectorstore = FAISS.from_documents(chunks, embedding)

    # ✅ Save to disk
    os.makedirs("db", exist_ok=True)
    vectorstore.save_local(DB_PATH)

    return vectorstore


def load_vector_store():
    embedding = get_embedding_model()

    if not os.path.exists(DB_PATH):
        raise ValueError("Vector store not found. Please upload documents first.")

    # ✅ Load from disk
    vectorstore = FAISS.load_local(DB_PATH, embedding, allow_dangerous_deserialization=True)

    return vectorstore

def get_retriever(vectorstore):
    return vectorstore.as_retriever(
        search_type="mmr",  # ✅ improves diversity
        search_kwargs={
            "k": 5,         # final chunks returned
            "fetch_k": 10   # candidates before filtering
        }
    )