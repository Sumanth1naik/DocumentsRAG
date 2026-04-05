try:
    from langchain.text_splitters import RecursiveCharacterTextSplitter
except ModuleNotFoundError:
    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
    except ModuleNotFoundError:
        from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    return splitter.split_documents(documents)