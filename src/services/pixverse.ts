import type {
  PixVerseUploadResponse,
  PixVerseGenerateResponse,
  PixVerseStatusResponse,
  VideoSettings,
  PixVerseModel,
} from '../types';

// PixVerse API configuration
const API_BASE_URL = 'https://app-api.pixverse.ai';

// Generate unique trace ID for each request
const generateTraceId = (): string => {
  return crypto.randomUUID();
};

// API headers helper
const getHeaders = (traceId: string) => ({
  'API-KEY': import.meta.env.VITE_PIXVERSE_API_KEY || '',
  'Ai-trace-id': traceId,
  'Content-Type': 'application/json',
});

// Upload image to PixVerse
export const uploadImage = async (file: File): Promise<{ imgId: number; imgUrl: string }> => {
  const traceId = generateTraceId();
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/openapi/v2/image/upload`, {
    method: 'POST',
    headers: {
      'API-KEY': import.meta.env.VITE_PIXVERSE_API_KEY || '',
      'Ai-trace-id': traceId,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.ErrMsg || 'Failed to upload image');
  }

  const data: PixVerseUploadResponse = await response.json();

  if (data.ErrCode !== 0) {
    throw new Error(data.ErrMsg || 'Image upload failed');
  }

  return {
    imgId: data.Resp.img_id,
    imgUrl: data.Resp.img_url,
  };
};

// Generate video from uploaded image
export const generateVideo = async (
  imgId: number,
  settings: VideoSettings
): Promise<number> => {
  const traceId = generateTraceId();

  const payload = {
    duration: settings.duration,
    img_id: imgId,
    model: settings.model,
    motion_mode: settings.motionMode,
    prompt: settings.prompt,
    quality: settings.quality,
    negative_prompt: settings.negativePrompt || '',
  };

  const response = await fetch(`${API_BASE_URL}/openapi/v2/video/img/generate`, {
    method: 'POST',
    headers: getHeaders(traceId),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.ErrMsg || 'Failed to generate video');
  }

  const data: PixVerseGenerateResponse = await response.json();

  if (data.ErrCode !== 0) {
    throw new Error(data.ErrMsg || 'Video generation failed');
  }

  return data.Resp.video_id;
};

// Get video generation status
export const getVideoStatus = async (videoId: number): Promise<{
  status: 1 | 5 | 7 | 8;
  url?: string;
  prompt: string;
  outputHeight: number;
  outputWidth: number;
}> => {
  const traceId = generateTraceId();

  const response = await fetch(`${API_BASE_URL}/openapi/v2/video/result/${videoId}`, {
    method: 'GET',
    headers: getHeaders(traceId),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.ErrMsg || 'Failed to get video status');
  }

  const data: PixVerseStatusResponse = await response.json();

  if (data.ErrCode !== 0) {
    throw new Error(data.ErrMsg || 'Status check failed');
  }

  return {
    status: data.Resp.status,
    url: data.Resp.url,
    prompt: data.Resp.prompt,
    outputHeight: data.Resp.outputHeight,
    outputWidth: data.Resp.outputWidth,
  };
};

// Poll video status until complete
export const pollVideoStatus = async (
  videoId: number,
  onProgress?: (status: string) => void,
  maxAttempts: number = 60, // 5 minutes max (60 * 5 seconds)
  intervalMs: number = 5000
): Promise<{ url: string; outputHeight: number; outputWidth: number }> => {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        attempts++;
        const result = await getVideoStatus(videoId);

        switch (result.status) {
          case 1: // Success
            if (result.url) {
              onProgress?.('completed');
              resolve({
                url: result.url,
                outputHeight: result.outputHeight,
                outputWidth: result.outputWidth,
              });
            } else {
              reject(new Error('Video URL not available'));
            }
            return;

          case 5: // Processing
            onProgress?.(`Generating video... (${attempts}/${maxAttempts})`);
            break;

          case 7: // Moderation failed
            reject(new Error('Content moderated: Video did not pass content guidelines'));
            return;

          case 8: // Generation failed
            reject(new Error('Video generation failed. Please try again.'));
            return;

          default:
            reject(new Error(`Unknown status: ${result.status}`));
            return;
        }

        if (attempts >= maxAttempts) {
          reject(new Error('Video generation timeout. Please try again.'));
          return;
        }

        // Schedule next poll
        setTimeout(poll, intervalMs);
      } catch (error) {
        reject(error);
      }
    };

    onProgress?.('Starting...');
    poll();
  });
};

// Generate multiple clips for longer video
export const generateVideoClips = async (
  imgId: number,
  prompts: string[],
  settings: Omit<VideoSettings, 'prompt'>,
  onClipProgress?: (clipIndex: number, status: string) => void
): Promise<Array<{ url: string; prompt: string }>> => {
  const clips: Array<{ url: string; prompt: string }> = [];

  for (let i = 0; i < prompts.length; i++) {
    onClipProgress?.(i, 'Starting...');

    // Generate video for this clip
    const videoId = await generateVideo(imgId, {
      ...settings,
      prompt: prompts[i],
    });

    // Poll for completion
    const result = await pollVideoStatus(
      videoId,
      (status) => onClipProgress?.(i, status)
    );

    clips.push({
      url: result.url,
      prompt: prompts[i],
    });
  }

  return clips;
};

// Check API connection and balance
export const checkBalance = async (): Promise<{
  balance: number;
  currency: string;
}> => {
  const traceId = generateTraceId();

  const response = await fetch(`${API_BASE_URL}/openapi/v2/user/credit/balance`, {
    method: 'GET',
    headers: getHeaders(traceId),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.ErrMsg || 'Failed to check balance');
  }

  const data = await response.json();

  return {
    balance: data.Resp?.balance || 0,
    currency: data.Resp?.currency || 'USD',
  };
};

// Get supported model versions
export const getModelInfo = (): { model: PixVerseModel; description: string }[] => [
  { model: 'v6', description: 'Latest model - Best quality & motion (1-15s)' },
  { model: 'v5.6', description: 'High quality - Great for fashion (5-10s)' },
  { model: 'v5.5', description: 'High quality - Good value (5-10s)' },
  { model: 'c1', description: 'Fast generation - Speed priority (1-15s)' },
];

// Validate settings
export const validateSettings = (settings: VideoSettings): string[] => {
  const errors: string[] = [];

  if (settings.duration < 1 || settings.duration > 15) {
    errors.push('Duration must be between 1 and 15 seconds');
  }

  if (!settings.prompt || settings.prompt.trim().length === 0) {
    errors.push('Prompt is required');
  }

  if (settings.prompt.length > 5000) {
    errors.push('Prompt must be less than 5000 characters');
  }

  return errors;
};
