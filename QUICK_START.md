# DocumentsRAG - Quick Start Guide

Get DocumentsRAG running in 5 minutes!

## ⚡ Quick Start (5 Minutes)

### 1. Start Backend (Terminal 1)
```bash
cd c:\MY_Projects\DocumentsRAG
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If you don't have venv set up yet:
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### 2. Start Frontend (Terminal 2)
```bash
cd c:\MY_Projects\DocumentsRAG\frontend
npm install  # Only first time
npm start
```

**Expected output:**
```
✔ Compiled successfully.
✔ Application bundle generated successfully.
✔ Open browser to http://localhost:4200
```

### 3. Open Your Browser
Go to: **http://localhost:4200**

## 🎮 First Steps

1. **Upload a Document**
   - Click "Browse Files" in the left panel
   - Or drag-and-drop a PDF/TXT file
   - Wait for the "✓ Processed" status

2. **Ask a Question**
   - Type in the chat: "What is this document about?"
   - Press Enter and wait for response
   - Click "📄 Sources" to see where answer came from

3. **Keep Chatting**
   - Ask follow-up questions
   - Upload more documents
   - Use "Clear Chat" to start fresh

## ✅ Verification Checklist

- [ ] Backend running at http://localhost:8000/docs
- [ ] Frontend running at http://localhost:4200
- [ ] Can upload files without errors
- [ ] Chat responds to questions
- [ ] Sources display correctly

## 🔧 If Something Goes Wrong

### Backend won't start
```bash
# Make sure virtual environment is activated
venv\Scripts\activate

# Install dependencies if missing
pip install -r requirements.txt

# Try different port if 8000 is in use
uvicorn app.main:app --reload --port 8001
```

### Frontend won't start
```bash
# Navigate to frontend folder
cd frontend

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Start again
npm start
```

### Port Already in Use
```bash
# Find process using port 8000 (Windows)
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F

# Or use different port
uvicorn app.main:app --reload --port 8001
```

### Can't connect to API
- Check both backend and frontend are running
- Backend should show "Uvicorn running on http://127.0.0.1:8000"
- Frontend should show "Application bundle generated"
- Try opening DevTools (F12) → Network tab to see API calls

## 📖 Full Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Detailed setup instructions
- **[Frontend README](frontend/README.md)** - Angular UI documentation
- **[Backend README](README.md)** - API and backend documentation
- **[API Docs](http://localhost:8000/docs)** - Interactive Swagger UI

## 🚀 Next Steps

1. **Customize the UI** - Edit colors in `frontend/src/styles.scss`
2. **Add More Features** - Check component files in `frontend/src/app/components/`
3. **Deploy** - Follow deployment section in [SETUP_GUIDE.md](SETUP_GUIDE.md)
4. **Scale Up** - Add authentication, databases, etc.

## 💡 Pro Tips

- **API Documentation**: http://localhost:8000/docs - Test endpoints here
- **Browser DevTools**: Press F12 to see API responses and logs
- **Auto-reload**: Both backend and frontend support hot-reload
- **Clear Cache**: If files don't update, clear browser cache (Ctrl+Shift+R)

## 📞 Need Help?

1. Check the full [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Review component README files
3. Check backend/frontend console logs
4. Verify ports aren't in use
5. Ensure all dependencies installed

---

**You're all set! Happy building! 🎉**
