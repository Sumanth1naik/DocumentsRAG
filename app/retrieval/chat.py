try:
    from langchain_community.llms import Ollama as LLM
except ImportError:
    try:
        from langchain_ollama import OllamaLLM as LLM
    except ImportError:
        from langchain_classic.chat_models import ChatOpenAI as LLM

try:
    from langchain.chains import RetrievalQA
except ImportError:
    from langchain_classic.chains import RetrievalQA

try:
    from langchain_core.prompts import PromptTemplate
except ImportError:
    from langchain.prompts import PromptTemplate

from app.retrieval.vector_store import load_vector_store, get_retriever


def create_chat_chain():
    vectorstore = load_vector_store()

    # ✅ Use centralized retriever
    retriever = get_retriever(vectorstore)

    llm = LLM(model="tinyllama")

    # ✅ STRONG PROMPT (VERY IMPORTANT)
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
You are a helpful AI assistant.

Answer the question ONLY using the provided context.
- Do NOT make up information
- If answer is not in context, say "I don't know"

Context:
{context}

Question:
{question}

Answer:
"""
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt}
    )

    return qa_chain