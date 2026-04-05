try:
    from langchain_community.llms import Ollama as ChatOpenAI
except ImportError:
    try:
        from langchain_ollama import OllamaLLM as ChatOpenAI
    except ImportError:
        from langchain_classic.chat_models import ChatOpenAI

try:
    from langchain.chains import RetrievalQA
except ImportError:
    from langchain_classic.chains import RetrievalQA

def get_qa_chain(vectorstore):
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    llm = ChatOpenAI(model="tinyllama")

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever
    )

    return qa_chain