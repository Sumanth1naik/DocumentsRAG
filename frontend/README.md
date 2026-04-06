# DocumentsRAG Angular Frontend

A modern, responsive Angular chat UI for the DocumentsRAG system. Features real-time chat, file uploads with drag-and-drop, loading states, and source attribution.

## 🎯 Features

- **💬 Real-time Chat UI** - Interactive message interface with typing indicators
- **📤 File Upload** - Drag-and-drop or click to upload PDFs, TXT, DOCX files
- **📊 Progress Indicators** - Visual feedback for uploads and message processing
- **📚 Source Attribution** - View document sources for each answer
- **🎨 Modern UI** - Beautiful gradient design with smooth animations
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🔄 Session Management** - Persistent chat sessions with unique IDs

## 🛠 Tech Stack

- **Angular 18** - Modern frontend framework
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **SCSS** - Advanced styling
- **Standalone Components** - Latest Angular architecture

## 📋 Prerequisites

- **Node.js** 18+ (with npm)
- **Angular CLI** 18+
- **Backend API** running on `http://localhost:8000`

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure API Endpoint

Edit [src/app/services/rag-api.service.ts](src/app/services/rag-api.service.ts) to update the API URL if needed:

```typescript
private apiUrl = 'http://localhost:8000';
```

### 3. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

## 🔧 Build for Production

```bash
npm run build:prod
```

Output will be in the `dist/` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── chat/                 # Chat UI component
│   │   │   │   ├── chat.component.ts
│   │   │   │   ├── chat.component.html
│   │   │   │   └── chat.component.scss
│   │   │   └── file-upload/          # File upload component
│   │   │       ├── file-upload.component.ts
│   │   │       ├── file-upload.component.html
│   │   │       └── file-upload.component.scss
│   │   ├── models/                   # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── services/                 # API & utility services
│   │   │   ├── rag-api.service.ts
│   │   │   └── util.service.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.component.scss
│   ├── main.ts                       # Application bootstrap
│   ├── index.html                    # HTML template
│   └── styles.scss                   # Global styles
├── angular.json                      # Angular configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

## 🎮 Usage

### Chat Interface

1. **Upload Documents** - Use the file upload panel on the left
   - Drag & drop files or click "Browse Files"
   - Supported formats: PDF, TXT, DOCX

2. **Ask Questions** - Type your question in the chat interface
   - Press Enter or click "Send"
   - Wait for the AI to process and respond

3. **View Sources** - Click "📄 Sources" to see document references
   - View source file names and chunk IDs
   - Understand where the answer came from

4. **Manage Chat** - Use the "Clear Chat" button to start fresh
   - Creates new session ID automatically
   - Clears message history

## 🔌 API Integration

The frontend connects to the FastAPI backend with these endpoints:

### POST `/upload`
Upload and process a document file.

**Request:**
```
multipart/form-data: file
```

**Response:**
```json
{
  "message": "File uploaded and processed successfully"
}
```

### POST `/chat`
Send a chat message with session management.

**Request:**
```json
{
  "session_id": "uuid",
  "question": "Your question here"
}
```

**Response:**
```json
{
  "answer": "AI response",
  "sources": [
    {
      "source": "filename.pdf",
      "chunk_id": 0,
      "page": 1
    }
  ]
}
```

### POST `/ask`
Ask a direct question (without session management).

**Request:**
```json
{
  "question": "Your question here"
}
```

**Response:**
```json
{
  "answer": "AI response",
  "sources": [...]
}
```

## 🎨 Customization

### Colors & Theme

Edit [src/styles.scss](src/styles.scss) and component SCSS files:

```scss
// Primary gradient
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// Modify any component's color scheme
.chat-header {
  background: $primary-gradient;
}
```

### Component Styling

Each component has its own SCSS file for easy customization:
- [chat.component.scss](src/app/components/chat/chat.component.scss)
- [file-upload.component.scss](src/app/components/file-upload/file-upload.component.scss)

## 🐛 Troubleshooting

### CORS Issues
If you see CORS errors, ensure the backend includes proper CORS headers:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Connection Failed
- Verify backend is running on `http://localhost:8000`
- Check network tab in browser DevTools
- Update API URL in [rag-api.service.ts](src/app/services/rag-api.service.ts)

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Update Angular CLI: `npm install -g @angular/cli@latest`

## 📦 Dependencies

- `@angular/animations@^18.0.0` - Animation support
- `@angular/common@^18.0.0` - Common directives
- `@angular/core@^18.0.0` - Core framework
- `@angular/forms@^18.0.0` - Form handling
- `@angular/platform-browser@^18.0.0` - Browser support
- `@angular/router@^18.0.0` - Routing
- `rxjs@^7.8.0` - Reactive programming
- `zone.js@^0.14.0` - Angular zone management

## 📝 Development Tips

### Add New Component

```bash
ng generate component new-component
```

### Generate Service

```bash
ng generate service services/new-service
```

### Run Tests

```bash
npm test
```

### Format Code

```bash
npm run lint
```

## 🚀 Performance Tips

1. **Lazy Loading** - Components are standalone and optimized
2. **Change Detection** - OnPush strategy used where applicable
3. **Bundle Analysis** - Run `ng build --stats-json` to analyze

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

Contributions welcome! Please ensure:
- Code follows Angular best practices
- Components are well-documented
- Styles are modular and reusable
- Types are properly defined

## 📞 Support

For issues or questions, please reference the [API documentation](../../README.md)

---

Built with ❤️ using Angular 18
