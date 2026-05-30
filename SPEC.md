# ShortcutSistem - AI Fashion Video Platform for E-commerce Sellers

## Project Overview

**ShortcutSistem** is a web platform that helps online fashion sellers create AI-generated marketing videos using PixVerse to sell more products on platforms like Shopee, TikTok, Instagram, and Lazada.

Built for the **TRAE x PixVerse Video Generation Track Hackathon** (May 30, 2026, Jakarta).

## Hackathon Requirements
- Must use **PixVerse API** for AI video generation
- Video must be at least **30 seconds** total
- App must have functionality **beyond playback** (e-commerce features)
- Target domain: Marketing/E-commerce for fashion sellers
- Evaluation: Video Quality (40%), App Completeness (30%), TRAE Usage (30%)

## Core Value Proposition

Help fashion sellers who:
- Don't have video editing skills
- Need affordable video content
- Want to scale their e-commerce business
- Need content for multiple platforms (Shopee, TikTok, Instagram, Lazada)

## User Tier System

### New Users (Beginner/Guided)
- Step-by-step wizard with 5 steps: Upload → Select Template → Preview → Export
- Pre-built prompts (AI suggests optimal prompts)
- Template-first approach (10+ ready-made templates)
- Smart defaults (best settings pre-selected)
- In-app tutorials and tooltips
- Limited: 5 free videos/month

### Pro Users (Advanced/Full Control)
- Custom prompt builder (write detailed prompts)
- Advanced settings: motion, camera, lighting, transitions
- Batch generation (50+ products at once)
- API access and integrations
- Team collaboration
- Analytics dashboard
- Priority processing

## Visual Design

### Design Language
- **Aesthetic**: Modern, clean, fashion-forward - Linear-style restraint
- **Mood**: Premium, sophisticated, professional
- **Energy**: Efficient, empowering, accessible

### Color Palette
```
Primary Background: #0A0A0A (Deep black)
Secondary Background: #171717 (Dark gray)
Accent Primary: #D4AF37 (Gold)
Accent Secondary: #B8860B (Dark gold)
Text Primary: #FFFFFF (White)
Text Secondary: #A3A3A3 (Gray)
Text Muted: #737373 (Muted gray)
Success: #22C55E (Green)
Error: #EF4444 (Red)
Border: #262626 (Subtle border)
```

### Typography
- **Headlines**: Inter (700 weight) - clean, modern
- **Body**: Inter (400/500 weight)
- **Accent**: System UI fallback
- Font sizes: 14px base, scale: 1.25

### Layout & Spacing
- Generous whitespace
- Video-first approach
- Minimal distractions
- 8px grid system
- Sections: 80px vertical padding desktop, 48px mobile

### Motion
- Entrance: fade-in + subtle translate (300ms ease-out)
- Hover: scale 1.02 + shadow lift (150ms)
- Loading: pulse animation with gold accent
- Transitions: smooth state changes (200ms)

## Page Structure

### 1. Landing Page (Home)
**Hero Section:**
- Full-bleed background with gradient overlay
- Brand name prominent: "ShortcutSistem"
- Value proposition: "AI Fashion Videos That Sell"
- CTA: "Start Creating" / "Try Free"
- Visual: Fashion video showcase loop

**Support Section:**
- Feature grid: 3 key benefits
- Icons with descriptions
- Platform logos (Shopee, TikTok, Instagram, Lazada)

**Workflow Section:**
- 4-step visual flow
- Upload → Select → Generate → Export
- Minimal copy, strong visual

**Templates Preview:**
- Horizontal scroll of template cards
- Categories: Runway, Street, Editorial, Campaign

**User Tier Section:**
- Two-column comparison
- New User vs Pro User features
- Clear CTA for each tier

**Final CTA:**
- "Start Your Free Trial"
- Trust signals

**Footer:**
- Links, social, copyright

### 2. Video Creation Wizard (5-step flow)

**Step 1: Upload Product Image**
- Drag & drop zone
- File browser button
- Preview of uploaded image
- Supported: JPG, PNG, WebP (max 10MB)
- Size recommendations shown

**Step 2: Select Template**
- Grid of template cards (6 templates)
- Categories filter
- Template preview thumbnails
- Hover: description tooltip
- Click: select with visual feedback

**Step 3: Customize (New User: AI Suggest, Pro User: Custom Builder)**
- New User: AI-suggested prompt displayed
- Pro User: Full prompt editor
- Advanced settings (Pro only): motion_mode, quality, aspect ratio
- Duration selector: 5-15 seconds per clip

**Step 4: Generate Video**
- Progress indicator
- Status updates
- Preview thumbnail generation
- Error handling with retry

**Step 5: Preview & Export**
- Video player with controls
- Regenerate option
- Format selection: 9:16, 1:1, 16:9
- Download button
- Share options

### 3. Video Gallery
- Grid of generated videos
- Filter by category
- Sort by date/name
- Like/save functionality
- Video thumbnails with play overlay

### 4. User Dashboard
- Videos generated count
- Usage statistics
- Account tier info
- Settings access

## Features Implementation

### Video Templates (Pre-built)

| Template | Description | Use Case |
|----------|-------------|----------|
| Runway Walk | Model walking with product | Fashion shows |
| Product Showcase | 360° rotation, zoom | Product details |
| Lifestyle Scene | Daily life context | Relatable content |
| Campaign Style | Cinematic, high-fashion | Brand campaigns |
| Street Style | Urban, casual | Streetwear brands |
| Comparison | Before/after | Product comparison |

### PixVerse API Integration

**Endpoints Used:**
1. `POST /openapi/v2/image/upload` - Upload product image
2. `POST /openapi/v2/video/img/generate` - Generate video from image
3. `GET /openapi/v2/video/result/{video_id}` - Get generation status

**API Parameters:**
```
duration: 5-15 (seconds per clip)
model: "v6" (recommended for fashion)
quality: "720p" or "1080p"
prompt: Fashion description (≤5000 chars)
motion_mode: "normal" | "cinematic" | etc.
```

**Status Polling:**
- Poll every 5 seconds
- Status codes: 1 (success), 5 (processing), 7 (moderation), 8 (failed)
- Auto-retry on failure

### Export Options
- 9:16 (TikTok, Shopee Video, Instagram Reels)
- 1:1 (Instagram Post)
- 16:9 (YouTube, general)

## Technical Architecture

### Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React Context + useReducer
- **Video**: HTML5 video player
- **HTTP**: Fetch API

### Project Structure
```
shortcutsistem/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   ├── landing/            # Landing page sections
│   │   ├── wizard/             # Video creation wizard
│   │   ├── gallery/            # Video gallery
│   │   └── dashboard/          # User dashboard
│   ├── contexts/
│   │   ├── UserTierContext.tsx
│   │   ├── VideoContext.tsx
│   │   └── FavoritesContext.tsx
│   ├── services/
│   │   └── pixverse.ts         # PixVerse API integration
│   ├── data/
│   │   ├── templates.ts
│   │   └── prompts.ts
│   ├── types/
│   │   └── index.ts
│   ├── hooks/
│   │   └── useVideoGeneration.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Component Specifications

### Header
- Fixed/sticky at top
- Logo (left)
- Navigation (center): Home, Create, Gallery, Dashboard
- User tier badge (right)
- Mobile: hamburger menu

### Hero Section
- Full viewport height
- Video background (muted, looped)
- Gradient overlay (bottom to top)
- Centered content column
- Animated entrance

### Template Card
- Thumbnail image
- Template name
- Category tag
- Hover: scale + shadow + description
- Selected: gold border

### Video Player
- Custom controls
- Play/pause overlay
- Progress bar
- Fullscreen option
- Quality indicator

### Wizard Progress
- Horizontal step indicator
- Step labels
- Active/completed states
- Clickable for completed steps

### Upload Zone
- Dashed border
- Icon center
- Drag state: border solid, background change
- Preview: image thumbnail

## Interaction Patterns

### Animations
```css
/* Entrance */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hover */
.hover-lift { transition: transform 150ms, box-shadow 150ms; }
.hover-lift:hover { transform: translateY(-2px); shadow: 0 8px 30px rgba(0,0,0,0.3); }

/* Loading */
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.loading-pulse { animation: pulse 2s ease-in-out infinite; }
```

### Feedback States
- Success: Green checkmark + message
- Error: Red warning + retry button
- Loading: Spinner + progress text
- Empty: Illustration + helpful message

## Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Success Metrics
- Video generation: 30+ seconds total (6 clips × 5-8 sec)
- PixVerse integration working with real API
- Export to multiple formats
- User can complete full flow from upload to download
- Mobile responsive

## Accessibility
- Keyboard navigation
- ARIA labels
- Focus states
- Color contrast ratio > 4.5:1
- Screen reader friendly

## Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Performance: > 90
