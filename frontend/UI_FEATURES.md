# Angular UI Features & Walkthrough

## 🎨 UI Overview

### Layout Architecture
```
┌─────────────────────────────────────────────────────┐
│                                                       │
│  ┌──────────────┐        ┌─────────────────────┐   │
│  │   SIDEBAR    │        │   CHAT INTERFACE    │   │
│  │ (360px)      │        │   (Flex: 1)         │   │
│  │              │        │                     │   │
│  │ • Logo       │        │  ┌─────────────┐   │   │
│  │ • Upload     │        │  │ Messages    │   │   │
│  │ • Files List │        │  │             │   │   │
│  │ • Footer     │        │  └─────────────┘   │   │
│  │              │        │  ┌─────────────┐   │   │
│  │              │        │  │ Input Area  │   │   │
│  │              │        │  └─────────────┘   │   │
│  └──────────────┘        └─────────────────────┘   │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 📤 File Upload Component

### Features
- **Drag & Drop** - Drag files directly onto the zone
- **Click to Browse** - Traditional file picker
- **Progress Tracking** - Real-time upload percentage
- **File Validation** - Only accept PDF, TXT, DOCX
- **Status Indicators** - Pending, Uploading, Success, Error
- **Remove Files** - Delete from list with X button
- **Clear All** - Remove all file records

### Upload Flow
```
1. User selects file
   ↓
2. Validate file type
   ↓
3. Show uploading state (⏳)
   ↓
4. Upload with progress bar
   ↓
5. Show success (✅) or error (❌)
```

### Supported File Types
- 📄 **PDF** - `application/pdf`
- 📝 **TXT** - `text/plain`
- 📋 **DOCX** - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- 📊 **DOC** - `application/msword`

### Visual States
```
Success State:
✅ filename.pdf
   📋 Processed
   
Uploading State:
⏳ filename.pdf
   [████░░░░░] 50%
   
Error State:
❌ filename.pdf
   ❌ Unsupported file type
```

---

## 💬 Chat Component

### Features
- **Real-time Messaging** - Send and receive messages instantly
- **Session Management** - Unique session ID per conversation
- **Loading Indicators** - "Thinking..." spinner while processing
- **Source Attribution** - Clickable sources with document details
- **Message History** - Persistent chat history in session
- **Clear Chat** - Start new conversation
- **Timestamps** - Each message timestamped

### Message Flow
```
1. User types question
   ↓
2. Press Enter or click Send
   ↓
3. Message added to chat (blue)
   ↓
4. Loading indicator appears (⏳)
   ↓
5. API processes question
   ↓
6. Response appears (white)
   ↓
7. User can view sources (📄)
```

### Message Types

**User Message:**
```
┌─────────────────────┐
│ Your question here  │ (Blue, right-aligned)
│ 2:34 PM             │
└─────────────────────┘
```

**Assistant Message:**
```
┌─────────────────────┐
│ AI response text    │ (White, left-aligned)
│ 📄 2 Source(s) ▶   │ (Expandable)
│ 2:34 PM             │
└─────────────────────┘
```

**Loading State:**
```
┌─────────────────────┐
│ ⏳ Thinking...      │
└─────────────────────┘
```

### Source Details
When user clicks "📄 Sources", expands to show:
```
Sources:
┌──────────────────────────────┐
│ 📄 document.pdf              │
│   Chunk #5 | Page 2          │
├──────────────────────────────┤
│ 📄 report.txt                │
│   Chunk #12                  │
└──────────────────────────────┘
```

---

## 🎯 User Workflows

### Workflow 1: Ask Question About Document

```
1. Upload Document
   └─ Drag PDF onto upload zone
   └─ See progress: [████████░░] 80%
   └─ See success: ✅ document.pdf - ✓ Processed

2. Ask Question
   └─ Type: "Summarize this document"
   └─ Press Enter

3. Get Response
   └─ See message: "This document discusses..."
   └─ Click "📄 2 Source(s)" to see where answer came from

4. Follow Up
   └─ Type: "Tell me more about section 2"
   └─ Continue conversation
```

### Workflow 2: Multi-Document Chat

```
1. Upload First Document
   └─ Drag paper.pdf
   └─ See ✅ paper.pdf

2. Upload Second Document
   └─ Drag report.txt
   └─ See ✅ report.txt

3. Ask Cross-Document Question
   └─ Type: "Compare these two documents"
   └─ Response pulls from both sources

4. View Sources
   └─ See sources from both files
   └─ Understand connections between documents
```

### Workflow 3: Troubleshooting

```
1. Upload File (Wrong Type)
   └─ Drag video.mp4
   └─ See ❌ video.mp4 - Unsupported file type

2. Remove and Retry
   └─ Click X icon to remove
   └─ Upload correct file type: document.pdf
   └─ See ✅ document.pdf

3. Ask Question
   └─ Type question
   └─ Receive response with sources
```

---

## 🎨 UI Components Breakdown

### 1. Chat Header
```
┌────────────────────────────────────────┐
│ 📚 DocumentsRAG Chat      [Clear Chat] │
└────────────────────────────────────────┘
```
- Title with icon
- Clear Chat button (red)
- Single row, sticky to top

### 2. Messages Container
```
┌─────────────────────────────────────────────┐
│                                               │
│  User Message (right)                        │
│  ┌──────────────────┐                       │
│  │ Your question    │ 2:34 PM               │
│  └──────────────────┘                       │
│                                               │
│  Assistant Message (left)                    │
│  ┌────────────────────────────────────────┐ │
│  │ This is the AI response with lots of   │ │
│  │ information about the document.        │ │
│  │                                        │ │
│  │ 📄 1 Source(s) ▶  2:35 PM             │ │
│  └────────────────────────────────────────┘ │
│                                               │
└─────────────────────────────────────────────┘
```
- Scrollable area
- Messages fade in
- Sources expandable on click
- Auto-scroll to latest message

### 3. Message Input Area
```
┌─────────────────────────────────────────────┐
│  [Input field: Ask a question...] [Send ➤] │
└─────────────────────────────────────────────┘
```
- Text input with placeholder
- Send button (gradient)
- Disabled while loading
- Enter key to send

### 4. File Upload Panel
```
┌────────────────────────────┐
│ 📤 Upload Documents        │
│ PDF, TXT, DOCX supported   │
├────────────────────────────┤
│      ┌─────────────────┐   │
│      │ 📁              │   │
│      │ Drag & drop     │   │
│      │ or click        │   │
│      │ [Browse Files]  │   │
│      └─────────────────┘   │
├────────────────────────────┤
│ [████████░░] 75%           │
│                            │
│ 📋 Files (3)  [Clear All]  │
│ ✅ file1.pdf - Processed   │
│ ⏳ file2.txt - 60%         │
│ ❌ file3.mp4 - Error       │
└────────────────────────────┘
```
- Drop zone with hover effect
- Progress bar (global)
- File list with statuses
- Individual remove buttons

---

## 🎭 Visual States

### Loading States

**Upload Loading:**
- File appears with ⏳ icon
- Progress bar fills
- Percentage updates in real-time

**Chat Loading:**
- Spinner icon (spinning circle)
- "Thinking..." text
- Placeholder message

**Button Loading:**
- Disabled state (opacity: 0.6)
- Cursor changes to not-allowed
- Button text changes (e.g., ⏳ sending)

### Interaction States

**Hover States:**
```
Button:  Lighter shade + slight lift
Input:   Border highlight + glow
File:    Background color change
Link:    Color change + underline
```

**Active States:**
```
Send Button:  Slight push-down effect
Sources:      Dark blue background
```

**Error States:**
```
Input:    Red border + error message
Upload:   Red status + error text
Message:  Error icon + explanation
```

---

## 📱 Responsive Behavior

### Desktop (1200px+)
- Sidebar: 360px fixed
- Chat: Flex to fill remaining space
- Layout: Side-by-side

### Tablet (768px - 1199px)
- Sidebar: 300px
- Reduced gaps
- Adjusted font sizes

### Mobile (< 768px)
- Layout: Stacked vertically
- Sidebar: Top (40vh)
- Chat: Bottom (60vh)
- Full width components
- Touch-friendly buttons

---

## 🎨 Color Palette

```
Primary Gradient:
├─ Start: #667eea (Purple Blue)
└─ End: #764ba2 (Deep Purple)

Accent Colors:
├─ Success: #28a745 (Green)
├─ Error: #dc3545 (Red)
├─ Warning: #ffc107 (Yellow)
└─ Info: #667eea (Blue)

Backgrounds:
├─ Light: #f8f9fa (Light Gray)
├─ Medium: #f0f0f0 (Gray)
├─ Dark: #333 (Dark Gray)
└─ White: #ffffff (White)
```

---

## ✨ Animation Timings

```
Fast (0.2s):   Hover states, toggles
Normal (0.3s): Message slides, source expand
Slow (0.8s):   Loading spinner
```

---

## 🔧 Customization Points

### Easy Changes
1. **Colors** - Edit `src/styles.scss`
2. **Fonts** - Change in `index.html`
3. **Icons** - Replace emoji with custom icons
4. **Messages** - Edit component templates

### Moderate Changes
1. **Layout** - Modify component SCSS
2. **Animations** - Adjust keyframes
3. **Sizing** - Change dimensions in CSS

### Complex Changes
1. **Components** - Refactor TypeScript logic
2. **API Integration** - Modify service layer
3. **State Management** - Add RxJS subjects

---

## 📊 Performance Characteristics

- **Load Time** - < 3 seconds (prod build)
- **Upload Speed** - Depends on file size and network
- **Chat Response** - 1-30 seconds (AI model dependent)
- **Memory Usage** - ~50MB (browser)
- **Bundle Size** - ~200KB (gzipped)

---

Happy exploring! 🚀
