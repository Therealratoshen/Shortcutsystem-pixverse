# Shortcutsystem - AI Fashion Video Platform

An AI-powered platform for fashion e-commerce sellers to create marketing videos using **PixVerse V6**.

## 🚀 Hackathon: TRAE x PixVerse Video Generation Track

Built for the TRAE x PixVerse Video Generation Track Hackathon (May 30, 2026, Jakarta).

---

## ✨ Features

- **AI-Powered Video Generation** - Uses PixVerse V6 for high-quality fashion videos
- **6 Fashion Templates** - Runway Walk, Product Showcase, Lifestyle Scene, Campaign Style, Street Style, Editorial
- **Multi-Clip Videos** - Generate 30+ second videos from multiple short clips
- **Multi-Format Export** - 9:16 (TikTok), 1:1 (Instagram), 16:9 (YouTube)
- **User Tier System** - New users (guided) vs Pro users (full control)
- **Gallery & Dashboard** - Save favorites, track statistics

---

## 🛠️ Setup

### 1. Get PixVerse API Key

1. Sign up at [https://platform.pixverse.ai/](https://platform.pixverse.ai/)
2. Go to API Keys section
3. Create a new API key
4. Copy your API key

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_PIXVERSE_API_KEY=your_pixverse_api_key_here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

---

## 🎬 How It Works

### PixVerse V6 Integration

The app uses PixVerse V6 model for AI video generation:

1. **Upload Image** - Upload a fashion product image
2. **Select Template** - Choose from 6 fashion video templates
3. **Customize** - Adjust prompt, duration, quality settings
4. **Generate** - PixVerse V6 creates the video (5-15 seconds per clip)
5. **Export** - Download in multiple formats (9:16, 1:1, 16:9)

### API Flow

```
User Upload Image → PixVerse Image Upload API → Get img_id
                    ↓
User Generate Video → PixVerse Video Generate API → Get video_id
                    ↓
Poll Video Status → PixVerse Status API → Check (5/1/7/8)
                    ↓
Status = 1 (Success) → Get video URL → Display
```

### Status Codes

| Code | Meaning |
|------|---------|
| 5 | Processing |
| 1 | Success |
| 7 | Content Moderated |
| 8 | Generation Failed |

---

## 📁 Project Structure

```
shortcutsystem/
├── src/
│   ├── components/
│   │   ├── wizard/           # Video creation wizard
│   │   ├── landing/         # Landing page sections
│   │   ├── gallery/         # Video gallery
│   │   └── dashboard/       # User dashboard
│   ├── services/
│   │   └── pixverse.ts      # PixVerse API integration
│   ├── contexts/           # React contexts
│   ├── types/               # TypeScript types
│   └── data/                # Templates & prompts
├── SPEC.md                  # Full specification
└── README.md               # This file
```

---

## 🎨 Design

- **Colors**: Deep black (#0A0A0A) with gold accent (#D4AF37)
- **Typography**: Inter font family
- **Style**: Modern, fashion-forward, minimal

---

## 🔒 Security

- API keys are stored in environment variables
- Never commit `.env` files
- Keys are only used client-side for direct PixVerse API calls

---

## 📝 License

MIT License - TRAE Hackathon Project 2026
