# 🧠 RAG-Based Intelligent Chatbot

An advanced **Retrieval-Augmented Generation (RAG)** chatbot that interacts with domain-specific data and provides accurate, context-aware answers using LLMs.

---

## 🚀 Features

- 📄 Document ingestion (PDF, DOCX, text)
- 🔍 Semantic search using vector embeddings
- 💬 Conversational chatbot with memory
- 🎯 Context-aware answers grounded in user data
- 📚 Source attribution for responses
- ⚡ Fast retrieval using vector databases (Chroma / FAISS)

---

## 🏗️ Architecture
User (Angular UI)
↓
Backend API (Django / FastAPI)
↓
Embedding Model
↓
Vector Database (Chroma / FAISS)
↓
Retriever + LLM
↓
Response


---

## 🛠️ Tech Stack

- **Backend:** Python (FastAPI / Django)
- **Frontend:** Angular
- **LLM Framework:** LangChain
- **Vector DB:** Chroma / FAISS
- **LLM Provider:** OpenAI / Ollama (local)

---

## ⚙️ Setup Instructions

### 1. Clone the repository
git clone https://github.com/your-username/DocumentsRAG.git
cd DocumentsRAG

### 2. Create virtual environment
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
## 3. Install dependencies
pip install -r requirements.txt
### 4. Setup environment variables
Create a .env file:

OPENAI_API_KEY=your_api_key_here
▶️ Running the Application
Start backend (FastAPI)
uvicorn main:app --reload
Start Django (if used)
python manage.py runserver
Start Angular frontend
ng serve