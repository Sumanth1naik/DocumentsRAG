# DocumentsRAG Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER BROWSER                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Angular 18 Frontend                      │ │
│  │  ┌──────────────┬──────────────────────────────────────┐  │ │
│  │  │   SIDEBAR    │        MAIN CHAT AREA               │  │ │
│  │  │              │                                      │  │ │
│  │  │ ┌──────────┐ │  ┌────────────────────────────────┐ │  │ │
│  │  │ │ Upload   │ │  │  Message History (scrollable) │ │  │ │
│  │  │ │ Panel    │ │  │                                │ │  │ │
│  │  │ └──────────┘ │  │  [User] Your question...       │ │  │ │
│  │  │              │  │                                │ │  │ │
│  │  │ ┌──────────┐ │  │  [Bot] AI Response...          │ │  │ │
│  │  │ │ File     │ │  │  📄 Sources ▶                 │ │  │ │
│  │  │ │ History  │ │  │                                │ │  │ │
│  │  │ └──────────┘ │  └────────────────────────────────┘ │  │ │
│  │  │              │  ┌────────────────────────────────┐ │  │ │
│  │  │              │  │ [Input] Your question...       │ │  │ │
│  │  │              │  │                        [Send] │ │  │ │
│  │  │              │  └────────────────────────────────┘ │  │ │
│  │  └──────────────┴──────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Angular Services (RxJS)                       │ │
│  │                                                            │ │
│  │  ┌─────────────────────┐    ┌──────────────────────────┐ │ │
│  │  │  RagApiService      │    │  UtilService             │ │ │
│  │  │  - uploadFile()     │    │  - generateId()          │ │ │
│  │  │  - chat()           │    │  - debounce()            │ │ │
│  │  │  - askQuestion()    │    │  - formatBytes()         │ │ │
│  │  └─────────────────────┘    └──────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    ┌───▼──┐           ┌──────▼──────┐        ┌────▼────┐
    │ POST │           │   POST      │        │  POST   │
    │/chat │           │   /upload   │        │  /ask   │
    └───┬──┘           └──────┬──────┘        └────┬────┘
        │                     │                     │
┌───────┴──────────────────────┴──────────────────────┴─────────┐
│                  FastAPI Backend (Port 8000)                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  CORS Middleware                                       │  │
│  │  (Allows http://localhost:4200)                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  API Routes                                            │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ POST /upload - Upload & Process Documents        │ │  │
│  │  │   1. Save file to data/                          │ │  │
│  │  │   2. Load & split document                       │ │  │
│  │  │   3. Create vector embeddings                    │ │  │
│  │  │   4. Store in vector DB (ChromaDB)              │ │  │
│  │  │   5. Return success response                     │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ POST /chat - Chat with Session Management        │ │  │
│  │  │   1. Get or create chat chain (session)          │ │  │
│  │  │   2. Retrieve relevant documents (RAG)          │ │  │
│  │  │   3. Call LLM (OpenAI) with context            │ │  │
│  │  │   4. Extract sources from documents            │ │  │
│  │  │   5. Return response + sources                  │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ POST /ask - Direct Question Answering            │ │  │
│  │  │   1. Query vector store for relevant docs        │ │  │
│  │  │   2. Pass to QA chain                            │ │  │
│  │  │   3. Get LLM response with sources              │ │  │
│  │  │   4. Return answer + source chunks              │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  LangChain RAG Pipeline                              │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ 1. Document Loader (PDF, TXT, DOCX)             │ │  │
│  │  │ 2. Text Splitter (Chunks with overlap)          │ │  │
│  │  │ 3. Embeddings (Sentence Transformers)           │ │  │
│  │  │ 4. Vector Store (ChromaDB, FAISS)               │ │  │
│  │  │ 5. Retriever (Semantic search)                  │ │  │
│  │  │ 6. LLM (OpenAI API)                             │ │  │
│  │  │ 7. QA Chain (Prompt + Context + LLM)            │ │  │
│  │  │ 8. Chat Chain (Session memory)                  │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
        │                   │                   │
        │                   │                   │
    ┌───▼────┐         ┌────▼───┐          ┌───▼────┐
    │  data/ │         │   db/  │          │External│
    │(files) │         │(vector)│          │(OpenAI)│
    └────────┘         └────────┘          └────────┘
```

---

## 🔄 Data Flow Diagrams

### Upload Workflow
```
User selects file
    │
    ▼
┌───────────────────┐
│ Frontend Validates│
│ File Type         │
└───────────────────┘
    │
    ▼
┌───────────────────┐
│ Show Progress Bar │
│ (0% to 100%)      │
└───────────────────┘
    │
    ▼
┌───────────────────┐
│ POST /upload      │
│ FormData: {file}  │
└───────────────────┘
    │
    ▼
┌───────────────────────────┐
│ Backend:                  │
│ 1. Save file to data/     │
│ 2. Load & split text      │
│ 3. Generate embeddings    │
│ 4. Store in vector DB     │
└───────────────────────────┘
    │
    ▼
┌───────────────────┐
│ Return {message}  │
│ "File processed"  │
└───────────────────┘
    │
    ▼
Show ✅ Success Status
```

### Chat Workflow
```
User types message
    │
    ▼
┌──────────────────────┐
│ Create user message  │
│ in chat history      │
│ (blue, right-align)  │
└──────────────────────┘
    │
    ▼
┌──────────────────────┐
│ Show loading spinner │
│ "⏳ Thinking..."     │
└──────────────────────┘
    │
    ▼
┌──────────────────────┐
│ POST /chat           │
│ {session_id, query}  │
└──────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Backend:                        │
│ 1. Get session chat chain       │
│ 2. Search vector store for docs │
│ 3. Call LLM with context        │
│ 4. Extract sources              │
│ 5. Return response              │
└─────────────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│ Return {answer, sources} │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│ Display assistant message│
│ (white, left-align)      │
│ with Sources (📄)        │
└──────────────────────────┘
```

---

## 📊 Component Hierarchy

```
AppComponent (Root)
│
├─── Sidebar
│    └─── FileUploadComponent
│         ├─── Drop Zone
│         ├─── File Input
│         ├─── Progress Bar
│         └─── File List
│
└─── Main Content
     └─── ChatComponent
          ├─── Chat Header
          │    ├─── Title
          │    └─── Clear Button
          │
          ├─── Messages Container
          │    └─── Message Items (forEach message)
          │         ├─── Message Content
          │         ├─── Sources Toggle
          │         ├─── Sources List (if expanded)
          │         └─── Timestamp
          │
          └─── Input Area
               ├─── Text Input
               └─── Send Button
```

---

## 🔐 State & Session Management

### Frontend State (per session)
```typescript
- sessionId: string (UUID v4)
  └─ Unique per browser tab/session
  
- messages: Message[]
  ├─ id: string (UUID)
  ├─ text: string (message content)
  ├─ sender: 'user' | 'assistant'
  ├─ timestamp: Date
  ├─ sources: Source[]
  └─ isLoading: boolean
  
- uploadedFiles: UploadedFile[]
  ├─ name: string
  ├─ status: 'pending' | 'uploading' | 'success' | 'error'
  ├─ progress: number (0-100)
  └─ error?: string
```

### Backend State (per session)
```python
chat_sessions = {
    "session_id_1": ConversationChain(...),
    "session_id_2": ConversationChain(...),
    # ...
}

Global cache:
- vectorstore: VectorStore (ChromaDB/FAISS)
- qa_chain: RetrievalQA
```

---

## 🔌 API Contract

### Request/Response Flow

**1. Upload File**
```
→ POST /upload
  Content-Type: multipart/form-data
  Body: { file: Binary }

← 200 OK
  { "message": "File uploaded and processed successfully" }
```

**2. Chat Message**
```
→ POST /chat
  Content-Type: application/json
  Body: {
    "session_id": "uuid-string",
    "question": "user question"
  }

← 200 OK
  {
    "answer": "AI response text",
    "sources": [
      {
        "source": "filename.pdf",
        "chunk_id": 5,
        "page": 2
      },
      ...
    ]
  }
```

**3. Ask Question**
```
→ POST /ask
  Content-Type: application/json
  Body: { "question": "user question" }

← 200 OK
  {
    "answer": "AI response",
    "sources": [...]
  }
```

---

## 🚀 Deployment Architecture

### Development
```
Developer Machine
├─ http://localhost:4200 (Frontend Dev Server)
└─ http://localhost:8000 (Backend Dev Server)
```

### Production
```
Web Domain (e.g., documentsrag.com)
│
├─ Nginx/CDN (Static Serve Frontend)
│  └─ /dist/rag-chatbot (Build output)
│
└─ API Server (Backend)
   └─ :8000/api/* (API endpoints)
   
Optionally:
- Docker containers
- Load balancers
- Caching layer (Redis)
- Database server
```

---

## 📈 Scalability

### Current Implementation
- Single instance backend
- In-memory session storage
- Local file storage
- Local vector DB (FAISS/ChromaDB)

### Scalable Implementation
```
Frontend:
├─ CDN (CloudFront, Cloudflare)
├─ Static S3 bucket
└─ Multi-region deployment

Backend:
├─ Horizontal scaling (Kubernetes)
├─ Redis for session storage
├─ PostgreSQL with pgvector for vectors
├─ S3 for document storage
└─ Load balancer (AWS ALB, etc.)

Database:
├─ Vector DB (Pinecone, Weaviate)
├─ Document storage (S3, GCS)
└─ Session cache (Redis)
```

---

## 🔍 Performance Characteristics

| Component | Load Time | Processing | Notes |
|-----------|-----------|-----------|-------|
| Frontend Load | < 3s | Initial load | Gzipped bundle ~200KB |
| File Upload | Varies | 1-60s | Depends on file size |
| Chat Response | 1-30s | LLM processing | AI model inference |
| Vector Search | < 500ms | Retrieval | Semantic similarity |
| Message Display | < 100ms | Rendering | DOM update |

---

## 🔒 Security Layers

```
Frontend:
├─ Input validation
├─ XSS prevention (Angular sanitization)
├─ CSRF tokens (if needed)
└─ Session IDs (no sensitive data)

Backend:
├─ CORS validation
├─ Rate limiting
├─ Input validation
├─ API key management
└─ File upload validation

Network:
├─ HTTPS/TLS
├─ API gateway
└─ Firewall rules
```

---

## 📚 Technology Stack Summary

```
Frontend:
├─ Angular 18 (Web Framework)
├─ TypeScript 5.4 (Language)
├─ RxJS 7.8 (Async)
├─ SCSS (Styling)
└─ HttpClient (HTTP)

Backend:
├─ FastAPI (API Framework)
├─ LangChain (RAG Framework)
├─ ChromaDB (Vector Storage)
├─ FAISS (Vector Index)
├─ OpenAI (LLM)
└─ SentenceTransformers (Embeddings)

Infrastructure:
├─ Node.js 18+ (Frontend Runtime)
├─ Python 3.9+ (Backend Runtime)
├─ npm (Package Manager)
└─ Docker (Optional Containers)
```

---

This architecture provides a modern, scalable, and maintainable foundation for the DocumentsRAG application! 🚀
