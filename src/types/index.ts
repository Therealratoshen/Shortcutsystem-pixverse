// User tier types
export type UserTier = 'new' | 'pro';

// Video generation status
export type VideoStatus = 'idle' | 'uploading' | 'generating' | 'processing' | 'completed' | 'failed';

// Template categories
export type TemplateCategory = 'runway' | 'street' | 'editorial' | 'campaign' | 'lifestyle' | 'comparison';

// Product categories for insights
export type ProductCategory = 'bag' | 'shoes' | 'dress' | 'top' | 'bottom' | 'accessories';

// Product styles
export type ProductStyle = 'luxury' | 'casual' | 'sporty' | 'classic' | 'modern' | 'bohemian' | 'formal';

// Video aspect ratio for export
export type AspectRatio = '9:16' | '1:1' | '16:9';

// PixVerse model versions
export type PixVerseModel = 'v3.5' | 'v4' | 'v4.5' | 'v5' | 'v5.5' | 'v5.6' | 'v6' | 'c1';

// Video quality options
export type VideoQuality = '360p' | '540p' | '720p' | '1080p';

// Motion modes
export type MotionMode = 'normal' | 'cinematic' | 'dramatic' | 'dynamic';

// Template interface
export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;
  prompt: string;
  motionMode: MotionMode;
}

// Uploaded image
export interface UploadedImage {
  id: string;
  url: string;
  file: File;
  name: string;
  size: number;
  timestamp: number;
}

// Generated video
export interface GeneratedVideo {
  id: string;
  videoId: string; // PixVerse video ID
  url: string;
  thumbnail?: string;
  status: VideoStatus;
  prompt: string;
  duration: number;
  quality: VideoQuality;
  model: PixVerseModel;
  aspectRatio: AspectRatio;
  templateId: string;
  createdAt: number;
  clips: VideoClip[];
}

// Individual video clip
export interface VideoClip {
  id: string;
  videoId: string;
  url: string;
  status: VideoStatus;
  prompt: string;
  duration: number;
  order: number;
}

// Video generation settings
export interface VideoSettings {
  duration: number;
  quality: VideoQuality;
  model: PixVerseModel;
  motionMode: MotionMode;
  aspectRatio: AspectRatio;
  prompt: string;
  negativePrompt?: string;
}

// User statistics
export interface UserStats {
  videosGenerated: number;
  videosThisMonth: number;
  clipsGenerated: number;
  storageUsed: number;
}

// User profile
export interface UserProfile {
  tier: UserTier;
  name: string;
  email?: string;
  avatar?: string;
  stats: UserStats;
  videosRemaining: number;
  joinedAt: number;
}

// Wizard step
export type WizardStep = 'upload' | 'template' | 'customize' | 'preview' | 'generate' | 'export';

// API response types
export interface PixVerseUploadResponse {
  ErrCode: number;
  ErrMsg: string;
  Resp: {
    img_id: number;
    img_url: string;
  };
}

export interface PixVerseGenerateResponse {
  ErrCode: number;
  ErrMsg: string;
  Resp: {
    video_id: number;
  };
}

export interface PixVerseStatusResponse {
  ErrCode: number;
  ErrMsg: string;
  Resp: {
    create_time: string;
    id: number;
    modify_time: string;
    negative_prompt?: string;
    outputHeight: number;
    outputWidth: number;
    prompt: string;
    resolution_ratio: number;
    seed: number;
    size: number;
    status: 1 | 5 | 7 | 8; // 1: success, 5: processing, 7: moderation, 8: failed
    style: string;
    url?: string;
  };
}

// Favorite video
export interface FavoriteVideo {
  id: string;
  videoId: string;
  thumbnail: string;
  title: string;
  category: TemplateCategory;
  addedAt: number;
}

// App state
export interface AppState {
  currentView: 'landing' | 'login' | 'create' | 'gallery' | 'dashboard';
  wizardStep: WizardStep;
  selectedTemplate: Template | null;
  uploadedImage: UploadedImage | null;
  generatedVideos: GeneratedVideo[];
  favorites: FavoriteVideo[];
  user: UserProfile;
  isGenerating: boolean;
  generationProgress: number;
  error: string | null;
}

// Platform info
export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
}
