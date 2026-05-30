# Shortcutsistem - AI Fashion Video Platform

An AI-powered platform for fashion e-commerce sellers to create marketing videos. **100% local solution** - no cloud servers needed!

## 🚀 Local Setup

This is a **complete local solution**:
- **Frontend**: React app running on your laptop
- **Backend**: Express server running on your laptop  
- **Video Generation**: PixVerse CLI (run automatically by backend)

**Users never see or interact with CLI commands** - everything happens behind the scenes!

---

## 🎯 Quick Start

### Prerequisites

1. **Node.js 18+** installed
2. **PixVerse CLI** installed (backend will use this)
3. **Internet connection** (for PixVerse API)

### Step 1: Install PixVerse CLI

```bash
npm install -g pixverse
```

### Step 2: Login to PixVerse (Backend Authentication)

```bash
pixverse auth login
```

Complete the browser authorization. Verify with:

```bash
pixverse auth status
```

You should see: `Logged in as your-email@gmail.com (Pro)`

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Run Both Server & Frontend

```bash
npm run dev:all
```

This will start:
- **Backend Server**: http://localhost:3001 
- **Frontend**: http://localhost:5173 (React app)

Or run them separately:

```bash
# Terminal 1: Start backend (runs CLI commands automatically)
npm run dev:server

# Terminal 2: Start frontend (user interface)
npm run dev
```

---

## 🎬 How to Use

1. **Open Frontend**: Go to http://localhost:5173
2. **Click "Start Creating"**
3. **Upload an image** (fashion product photo)
4. **Select a template** (Runway Walk, Product Showcase, etc.)
5. **Customize settings** (prompt, duration, quality)
6. **Click "Generate Video"**
7. **Watch the progress** - video player appears when ready!
8. **Download your video** or create another

---

## 🏗️ How It Works (Backend-Only CLI)

```
User Interface (Frontend)
    ↓ clicks "Generate Video"
Express Server (Backend)
    ↓ internally runs PixVerse CLI
PixVerse CLI → PixVerse Cloud API
    ↓ returns video URL
Frontend displays video player
    ↓
Video saved locally
```

**Key Point**: Users never see CLI commands. The backend automatically runs them!

---

## 📁 Project Structure

```
shortcutsistem/
├── server.js              # Backend: runs CLI commands automatically
├── generated-videos/      # Generated video files
├── tasks.json            # Task tracking database
├── src/
│   ├── components/
│   │   ├── wizard/       # Video creation wizard
│   │   ├── landing/      # Landing page
│   │   ├── gallery/      # Video gallery
│   │   └── dashboard/    # User dashboard
│   └── contexts/         # React state management
├── .env                  # Environment variables
└── package.json
```

---

## 🔌 API Endpoints (Backend Use Only)

These are used internally by the frontend - **not visible to users**:

### POST /api/generate-video
Start video generation

```json
{
  "settings": {
    "prompt": "Fashion model walking on runway",
    "duration": 6,
    "model": "v6",
    "quality": "720p",
    "aspectRatio": "9:16"
  }
}
```

### GET /api/video-status/:taskId
Check generation status

### GET /api/video/:taskId
Get completed video info

### GET /api/tasks
List all tasks

### GET /api/health
Health check

---

## 🎨 Features

- **6 Fashion Templates**: Runway Walk, Product Showcase, Lifestyle Scene, Campaign Style, Street Style, Editorial
- **Custom Prompts**: Write your own AI prompts
- **Multiple Formats**: 9:16 (TikTok), 1:1 (Instagram), 16:9 (YouTube)
- **Quality Settings**: 360p, 540p, 720p, 1080p
- **Model Selection**: v3.5, v4, v4.5, v5, v5.5, v5.6, v6, c1
- **Duration Control**: 1-15 seconds per clip
- **Real-time Updates**: Automatic status polling and video player
- **Download Ready**: Videos available for download immediately

---

## 🐛 Troubleshooting

### "Not logged in" error

Run: `pixverse auth login` and complete browser authorization

### Server won't start

Check if port 3001 is already in use:
```bash
lsof -i :3001
```

### Videos not generating

1. Check PixVerse CLI is installed: `pixverse --version`
2. Verify authentication: `pixverse auth status`
3. Check your internet connection
4. Check PixVerse API status at platform.pixverse.ai

### Frontend can't connect to server

1. Make sure backend is running on port 3001
2. Check CORS settings in server.js
3. Verify .env file exists

---

## 🚀 Hackathon Requirements Met

✅ Uses PixVerse API (via CLI - backend only)
✅ Video generation capability
✅ Beyond playback (e-commerce features)
✅ Target domain: Fashion/E-commerce
✅ Functional application
✅ 100% local solution

---

## 📝 License

MIT License - Hackathon Project

---

Built for **TRAE x PixVerse Video Generation Track Hackathon** (May 30, 2026, Jakarta) 🇮🇩

**Happy Video Creating!** 🎬✨
