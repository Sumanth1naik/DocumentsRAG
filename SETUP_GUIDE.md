# DocumentsRAG - Full Stack Setup & Deployment

Complete guide for setting up and deploying the DocumentsRAG project with Angular frontend and FastAPI backend.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running Together](#running-together)
5. [Deployment](#deployment)

---

## Prerequisites

### Required Software

- **Python 3.9+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **npm** - Package manager
- **Git** - Version control

### Optional Tools

- **Docker** - For containerization
- **pm2** - Process manager for production

### System Requirements

- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB minimum
- **Network**: Stable internet for API calls and model downloads

---

## Backend Setup

### 1. Frontend Prerequisites (First Time Only)

If you haven't set up the Python environment yet:

```bash
# Navigate to project root
cd c:\MY_Projects\DocumentsRAG

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Python Dependencies

```bash
# Make sure you're in the virtual environment
pip install -r requirements.txt

# Verify installation
pip list
```

### 3. Download LLM Model (One-time)

The first run will download the embedding model (1-2 GB):

```bash
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-mpnet-base-v2')"
```

### 4. Set Environment Variables

Create a `.env` file in the project root:

```bash
# .env
OPENAI_API_KEY=your_api_key_here
PYTHON_ENV=development
```

### 5. Start Backend Server

```bash
# From project root with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Output:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# INFO:     Application startup complete
```

**Backend is now running at**: `http://localhost:8000`

**API Documentation**: `http://localhost:8000/docs` (Swagger UI)

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Node Dependencies

```bash
npm install

# This may take 2-3 minutes
```

### 3. Configure API URL (Optional)

If your backend is on a different host/port, edit:

```bash
# src/app/services/rag-api.service.ts
private apiUrl = 'http://your-backend-url:8000';
```

### 4. Start Development Server

```bash
npm start

# Output:
# ✔ Compiled successfully.
# ✔ Built and served in 5.234 seconds
# 
# Application bundle generates:
# ...
# ★ Open browser to http://localhost:4200
```

**Frontend is now running at**: `http://localhost:4200`

---

## Running Together

### Option 1: Two Terminal Windows (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd c:\MY_Projects\DocumentsRAG
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd c:\MY_Projects\DocumentsRAG\frontend
npm start
```

### Option 2: Single Terminal with Background Process

```bash
# Terminal 1: Start backend
cd c:\MY_Projects\DocumentsRAG
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Then in Terminal 2: Start frontend
cd c:\MY_Projects\DocumentsRAG\frontend
npm start
```

### Option 3: Using PowerShell (Windows)

```powershell
# Terminal 1
cd c:\MY_Projects\DocumentsRAG
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2
cd c:\MY_Projects\DocumentsRAG\frontend
npm start
```

---

## Testing the Integration

### 1. Open Browser

Navigate to: **http://localhost:4200**

You should see:
- Upload panel on the left (file upload area)
- Chat interface in the center
- Welcome message

### 2. Test File Upload

1. Click "Browse Files" or drag-and-drop a PDF/TXT file
2. Wait for upload progress to complete
3. Check backend terminal for processing logs

### 3. Test Chat

1. Type a question in the chat input
2. Press Enter or click Send
3. Observe loading indicator
4. View AI response with sources

---

## Troubleshooting

### Backend Won't Start

```bash
# Check if port 8000 is already in use
netstat -ano | findstr :8000

# If port in use, terminate process or use different port
uvicorn app.main:app --reload --port 8001
```

### Frontend Build Fails

```bash
# Clear npm cache and reinstall
rm -r node_modules package-lock.json
npm install
npm start
```

### CORS Errors in Browser

Ensure backend has CORS enabled (already configured in `app/main.py`):
- Verify backend is running
- Check browser console for exact error
- Try incognito/private window

### API Connection Issues

```bash
# Test API connectivity from frontend console
curl http://localhost:8000/docs

# Should return Swagger UI HTML
```

---

## Production Deployment

### 1. Build Frontend

```bash
cd frontend
npm run build:prod

# Creates optimized build in dist/
```

### 2. Serve Frontend (Options)

#### Option A: Using Python
```bash
cd dist/rag-chatbot
python -m http.server 80
```

#### Option B: Using Node (http-server)
```bash
npm install -g http-server
cd dist/rag-chatbot
http-server -p 80
```

#### Option C: Using Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dist/rag-chatbot;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-backend:8000;
    }
}
```

### 3. Deploy Backend

```bash
# Using Gunicorn (recommended for production)
pip install gunicorn

# Start with gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app

# Or with uvicorn workers
uvicorn app.main:app --workers 4 --host 0.0.0.0 --port 8000
```

### 4. Environment Variables (Production)

Create `.env.production`:
```bash
OPENAI_API_KEY=production_key
ENVIRONMENT=production
FRONTEND_URL=https://your-domain.com
DATABASE_URL=postgresql://...
```

---

## Docker Deployment (Optional)

### Backend Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/dist/rag-chatbot /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run

```bash
# Backend
docker build -t rag-backend ./
docker run -p 8000:8000 rag-backend

# Frontend
cd frontend
docker build -t rag-frontend ./
docker run -p 80:80 rag-frontend
```

---

## Performance Optimization

### Backend
- Use Gunicorn/Uvicorn with multiple workers
- Enable caching for vector store
- Use async operations where possible

### Frontend
- Enable production build optimization
- Use CDN for static assets
- Implement service workers for offline support

### General
- Enable gzip compression
- Use SSL/TLS (HTTPS)
- Monitor API response times
- Set up error logging (Sentry, etc.)

---

## Security Considerations

1. **API Key Management**
   - Never commit `.env` files
   - Use environment variables
   - Rotate keys regularly

2. **CORS Configuration**
   - Limit to specific origins in production
   - Avoid wildcard (*) in production

3. **API Rate Limiting**
   - Implement rate limiting on backend
   - Add request throttling on frontend

4. **File Upload Security**
   - Validate file types on backend
   - Scan for malware
   - Limit file size
   - Store uploads securely

5. **Authentication**
   - Consider adding user authentication
   - Implement API key validation
   - Use JWT tokens for sessions

---

## Monitoring & Logging

### Backend Logs
```bash
# Enable verbose logging
LOGLEVEL=debug uvicorn app.main:app --reload
```

### Frontend Debugging
- Open DevTools (F12)
- Check Console tab for errors
- Use Network tab to inspect API calls

### Production Monitoring
- Set up error tracking (Sentry, Rollbar)
- Monitor API performance
- Track user analytics
- Alert on failures

---

## Maintenance

### Regular Updates
```bash
# Backend
pip install -U -r requirements.txt

# Frontend
npm update
npm audit fix
```

### Backup Strategy
- Regular database backups
- Vector store snapshots
- Document storage backups

### Cleanup Scripts
```bash
# Remove old uploads
find data/ -type f -mtime +30 -delete

# Clear vector store cache
rm -rf db/
```

---

## Support & Resources

- **Frontend Issues**: See [frontend/README.md](frontend/README.md)
- **Backend Issues**: Check FastAPI docs
- **API Documentation**: http://localhost:8000/docs
- **Angular Docs**: https://angular.io
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

## Next Steps

1. ✅ Setup is complete! Now you can:
   - Upload documents
   - Ask questions
   - View sources
   - Deploy to production

2. 🚀 To extend the project:
   - Add user authentication
   - Implement admin panel
   - Add more storage backends
   - Create mobile app

3. 📊 Monitor and optimize:
   - Track usage metrics
   - Optimize performance
   - Gather user feedback

---

Happy building! 🎉
