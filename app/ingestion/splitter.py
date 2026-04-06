try:
    from langchain.text_splitters import RecursiveCharacterTextSplitter
except ModuleNotFoundError:
    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
    except ModuleNotFoundError:
        from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=400,
        chunk_overlap=100
    )

    chunks = splitter.split_documents(documents)

    # ✅ Add metadata to each chunk
    for i, doc in enumerate(chunks):
        doc.metadata["chunk_id"] = i
        doc.metadata["source"] = doc.metadata.get("source", "uploaded_file")
        doc.metadata["page"] = doc.metadata.get("page", None)

    return chunks