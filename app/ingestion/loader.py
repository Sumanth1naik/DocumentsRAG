import os

try:
    from langchain_community.document_loaders import TextLoader, PyPDFLoader
except ModuleNotFoundError:
    from langchain.document_loaders import TextLoader, PyPDFLoader


def _is_pdf(file_path: str) -> bool:
    with open(file_path, "rb") as f:
        return f.read(5) == b"%PDF-"


def load_documents(file_path: str):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} not found")

    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        if not _is_pdf(file_path):
            raise ValueError(f"{file_path} is not a valid PDF")
        loader = PyPDFLoader(file_path)
        docs = loader.load()
    elif ext == ".txt":
        loader = TextLoader(file_path, encoding="utf-8")
        docs = loader.load()
    else:
        raise ValueError("Unsupported file type. Use .pdf or .txt")

    source_name = os.path.basename(file_path)
    topic = os.path.splitext(source_name)[0]

    for doc in docs:
        if not isinstance(doc.metadata, dict):
            doc.metadata = {}
        doc.metadata["source"] = source_name
        doc.metadata["topic"] = topic
        if "page" not in doc.metadata and "page_number" in doc.metadata:
            doc.metadata["page"] = doc.metadata["page_number"]

    return docs