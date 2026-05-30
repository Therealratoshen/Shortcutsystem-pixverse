import type { Template, Platform } from '../types';

const generatePlaceholderSvg = (category: string, name: string) => {
  const colors = {
    runway: ['#1a1a2e', '#16213e'],
    street: ['#2d3436', '#636e72'],
    editorial: ['#2c3e50', '#34495e'],
    campaign: ['#c0392b', '#e74c3c'],
    lifestyle: ['#27ae60', '#2ecc71'],
  };
  
  const [color1, color2] = colors[category as keyof typeof colors] || ['#1a1a1a', '#2d2d2d'];
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${name}</text>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" opacity="0.7">Fashion Template</text>
    </svg>
  `)}`;
};

export const templates: Template[] = [
  {
    id: 'runway-walk',
    name: 'Runway Walk',
    description: 'Elegant model walking with product, perfect for fashion shows and brand campaigns',
    category: 'runway',
    thumbnail: generatePlaceholderSvg('runway', 'Runway Walk'),
    prompt: 'Fashion model walking confidently on runway, wearing elegant garment, professional lighting, dramatic atmosphere, slow motion, 16:9 aspect ratio, high-end fashion photography style, white studio background',
    motionMode: 'cinematic',
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: '360° rotation with zoom effects to highlight product features',
    category: 'campaign',
    thumbnail: generatePlaceholderSvg('campaign', 'Product Showcase'),
    prompt: 'Product rotating slowly on turntable, 360 degree view, soft diffused lighting, shallow depth of field, premium texture detail, fashion catalog style, clean white background',
    motionMode: 'dynamic',
  },
  {
    id: 'lifestyle-scene',
    name: 'Lifestyle Scene',
    description: 'Model wearing product in daily life for relatable content',
    category: 'lifestyle',
    thumbnail: generatePlaceholderSvg('lifestyle', 'Lifestyle Scene'),
    prompt: 'Model in casual outdoor setting, natural sunlight, wearing stylish outfit, candid street style photography, warm tones, lifestyle content, authentic moment, 16:9 aspect ratio',
    motionMode: 'normal',
  },
  {
    id: 'campaign-style',
    name: 'Campaign Style',
    description: 'Cinematic, high-fashion look for brand campaigns',
    category: 'campaign',
    thumbnail: generatePlaceholderSvg('campaign', 'Campaign Style'),
    prompt: 'Cinematic fashion shot, dramatic lighting, model in editorial pose, high contrast, film grain, luxury brand aesthetic, Vogue magazine style, moody atmosphere, 16:9 aspect ratio',
    motionMode: 'dramatic',
  },
  {
    id: 'street-style',
    name: 'Street Style',
    description: 'Urban, casual fashion for streetwear brands',
    category: 'street',
    thumbnail: generatePlaceholderSvg('street', 'Street Style'),
    prompt: 'Urban street style photography, model in city environment, casual fashion, natural lighting, street fashion influencer aesthetic, vibrant colors, 16:9 aspect ratio, energetic atmosphere',
    motionMode: 'dynamic',
  },
  {
    id: 'editorial-look',
    name: 'Editorial Look',
    description: 'Fashion magazine editorial style for luxury brands',
    category: 'editorial',
    thumbnail: generatePlaceholderSvg('editorial', 'Editorial Look'),
    prompt: 'Fashion editorial photography, model in artistic pose, dramatic studio lighting, magazine spread style, sophisticated look, clean aesthetic, fashion week vibes, 16:9 aspect ratio',
    motionMode: 'cinematic',
  },
];

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

export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === 'all') return templates;
  return templates.filter((t) => t.category === category);
};

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((t) => t.id === id);
};
