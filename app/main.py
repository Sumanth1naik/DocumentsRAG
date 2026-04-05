import os
from dotenv import load_dotenv

from ingestion.loader import load_documents
from ingestion.splitter import split_documents
from retrieval.vector_store import create_vector_store
from retrieval.query import get_qa_chain

load_dotenv()

def main():
    file_path = "data/google.txt"

    print("Loading documents...")
    try:
        docs = load_documents(file_path)
    except Exception as exc:
        print("Error loading documents:", exc)
        return

    print("Splitting documents...")
    chunks = split_documents(docs)

    print("Creating vector store...")
    vectorstore = create_vector_store(chunks)

    print("Setting up QA system...")
    qa_chain = get_qa_chain(vectorstore)

    while True:
        query = input("\nAsk a question (or type 'exit'): ")

        if query.lower() == "exit":
            break

        response = qa_chain.run(query)
        print("\nAnswer:", response)


if __name__ == "__main__":
    main()