import type { Template, Platform } from '../types';

// Fashion video templates with prompts optimized for e-commerce
export const templates: Template[] = [
  {
    id: 'runway-walk',
    name: 'Runway Walk',
    description: 'Elegant model walking with product, perfect for fashion shows and brand campaigns',
    category: 'runway',
    thumbnail: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=600&fit=crop',
    prompt: 'Fashion model walking confidently on runway, wearing elegant garment, professional lighting, dramatic atmosphere, slow motion, 16:9 aspect ratio, high-end fashion photography style, white studio background',
    motionMode: 'cinematic',
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: '360° rotation with zoom effects to highlight product features',
    category: 'campaign',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
    prompt: 'Product rotating slowly on turntable, 360 degree view, soft diffused lighting, shallow depth of field, premium texture detail, fashion catalog style, clean white background',
    motionMode: 'dynamic',
  },
  {
    id: 'lifestyle-scene',
    name: 'Lifestyle Scene',
    description: 'Model wearing product in daily life for relatable content',
    category: 'lifestyle',
    thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop',
    prompt: 'Model in casual outdoor setting, natural sunlight, wearing stylish outfit, candid street style photography, warm tones, lifestyle content, authentic moment, 16:9 aspect ratio',
    motionMode: 'normal',
  },
  {
    id: 'campaign-style',
    name: 'Campaign Style',
    description: 'Cinematic, high-fashion look for brand campaigns',
    category: 'campaign',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop',
    prompt: 'Cinematic fashion shot, dramatic lighting, model in editorial pose, high contrast, film grain, luxury brand aesthetic, Vogue magazine style, moody atmosphere, 16:9 aspect ratio',
    motionMode: 'dramatic',
  },
  {
    id: 'street-style',
    name: 'Street Style',
    description: 'Urban, casual fashion for streetwear brands',
    category: 'street',
    thumbnail: 'https://images.unsplash.com/photo-1529139391626-1f0cb8f0f25e?w=400&h=600&fit=crop',
    prompt: 'Urban street style photography, model in city environment, casual fashion, natural lighting, street fashion influencer aesthetic, vibrant colors, 16:9 aspect ratio, energetic atmosphere',
    motionMode: 'dynamic',
  },
  {
    id: 'editorial-look',
    name: 'Editorial Look',
    description: 'Fashion magazine editorial style for luxury brands',
    category: 'editorial',
    thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop',
    prompt: 'Fashion editorial photography, model in artistic pose, dramatic studio lighting, magazine spread style, sophisticated look, clean aesthetic, fashion week vibes, 16:9 aspect ratio',
    motionMode: 'cinematic',
  },
];

// Fashion video prompts for multi-clip generation (6 shots × 6 seconds = 36 seconds)
export const fashionPrompts = {
  silkBlouse: [
    'Fashion model entering frame, wearing elegant silk blouse, dramatic studio lighting, cinematic slow motion, 16:9 aspect ratio, high-end fashion photography style, bright white studio background',
    'Close-up of model touching the silk fabric, soft diffused lighting, shallow depth of field, premium texture detail, fashion editorial look, 16:9',
    'Model walking forward, flowing silk blouse, minimal white studio, professional lighting, confident stride, 16:9 fashion commercial',
    'Model in casual outdoor setting, natural sunlight, wearing the silk blouse, candid street style photography, warm tones, 16:9',
    'Model rotating slowly, showing all angles of the silk blouse, studio lighting, fashion catalog style, 16:9',
    'Close-up of silk blouse detail, bokeh background, elegant typography space, luxury fashion brand aesthetic, 16:9',
  ],
  denimJacket: [
    'Model entering frame wearing stylish denim jacket, urban fashion, studio lighting, confident pose, 16:9 aspect ratio',
    'Close-up detail shot of denim texture, premium fabric quality, soft lighting, shallow depth of field, 16:9',
    'Model walking in city street wearing denim jacket, natural lighting, street style, confident energy, 16:9',
    'Model adjusting denim jacket, casual outdoor setting, warm afternoon light, lifestyle content, 16:9',
    'Full body shot of model showcasing denim jacket, urban backdrop, streetwear aesthetic, 16:9',
    'Close-up of jacket buttons and stitching detail, luxury denim quality, bokeh background, 16:9',
  ],
  summerDress: [
    'Model in flowy summer dress entering frame, bright natural lighting, cheerful atmosphere, 16:9 aspect ratio',
    'Close-up of flowing fabric movement, summer dress details, soft breeze effect, romantic mood, 16:9',
    'Model walking in garden setting wearing summer dress, natural sunlight, flowers in background, 16:9',
    'Full outfit reveal, model spinning in summer dress, playful movement, light and airy feel, 16:9',
    'Model sitting casually, summer dress flowing, outdoor cafe setting, lifestyle content, 16:9',
    'Final pose, model looking at camera, summer dress detail, warm golden hour lighting, 16:9',
  ],
};

// E-commerce platforms
export const platforms: Platform[] = [
  {
    id: 'shopee',
    name: 'Shopee',
    icon: 'shopping-bag',
    color: '#EE4D2D',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'video',
    color: '#00F2EA',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'camera',
    color: '#E4405F',
  },
  {
    id: 'lazada',
    name: 'Lazada',
    icon: 'shopping-cart',
    color: '#0057D8',
  },
];

// Get templates by category
export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === 'all') return templates;
  return templates.filter((t) => t.category === category);
};

// Get template by ID
export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((t) => t.id === id);
};
