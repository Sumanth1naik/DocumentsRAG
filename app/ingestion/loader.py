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
        return loader.load()

    if ext == ".txt":
        loader = TextLoader(file_path, encoding="utf-8")
        return loader.load()

    raise ValueError("Unsupported file type. Use .pdf or .txt")