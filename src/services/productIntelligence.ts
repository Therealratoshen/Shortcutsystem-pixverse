import type { ProductCategory, ProductStyle } from '../types';

export interface ProductFeatures {
  category: ProductCategory;
  color: string[];
  material: string[];
  style: ProductStyle[];
  features: string[];
  keywords: string[];
  productName: string;
}

interface SmartPrompt {
  mainPrompt: string;
  sellingPoints: string[];
  videoStyle: 'runway' | 'product_showcase' | 'lifestyle' | 'campaign' | 'street' | 'editorial';
  shots: number;
  durationPerShot: number;
  totalDuration: number;
  recommendedAspectRatio: '9:16' | '1:1' | '16:9';
  recommendedQuality: '360p' | '540p' | '720p' | '1080p';
  useCase: 'social' | 'presentation' | 'ecommerce';
}

const productCategories: Record<string, string[]> = {
  bag: ['crossbody bag', 'shoulder bag', 'tote bag', 'handbag', 'clutch', 'satchel', 'purse', 'wallet', 'pouch', 'crossbody', 'tote', 'bag', 'bags'],
  shoes: ['sandals', 'sneakers', 'boots', 'heels', 'slippers', 'loafers', 'flats', 'mules', 'slides', 'shoes', 'shoe', 'sandal', 'boot', 'sneaker', 'heel', 'slipper', 'loafer', 'footwear'],
  dress: ['maxi dress', 'mini dress', 'midi dress', 'jumpsuit', 'romper', 'gown', 'robe', 'dress', 'dresses', 'maxi', 'midi'],
  top: ['blouse', 'cardigan', 'sweater', 'jacket', 'coat', 'vest', 'sweatshirt', 'hoodie', 'polo', 'shirt', 'top', 'tops', 't-shirt'],
  bottom: ['shorts', 'jeans', 'leggings', 'culottes', 'trousers', 'pants', 'pant', 'skirt', 'short', 'legging'],
  accessories: ['sunglasses', 'bracelet', 'necklace', 'earrings', 'watch', 'jewelry', 'scarf', 'hat', 'belt', 'ring', 'accessory', 'accessories', 'sunglass', 'earring'],
};

const materialKeywords: Record<string, string[]> = {
  leather: ['leather', 'genuine leather', 'faux leather', 'suede', 'nubuck', 'patent leather'],
  fabric: ['cotton', 'silk', 'linen', 'polyester', 'denim', 'velvet', 'knit', 'woven', 'canvas', 'jersey'],
  metal: ['gold', 'silver', 'metal', 'chain', 'hardware', 'brass', 'rose gold'],
  casual: ['canvas', 'nylon', 'mesh', 'rubber', 'espadrille', 'woven'],
  eco: ['vegan leather', 'recycled', 'sustainable', 'cork', 'bamboo', 'eco-friendly'],
};

const colorKeywords: Record<string, string[]> = {
  black: ['black', 'noir', 'jet black', 'charcoal', 'jet-black'],
  white: ['white', 'ivory', 'cream', 'off-white', 'pearl', 'offwhite'],
  brown: ['brown', 'tan', 'cognac', 'caramel', 'mocha', 'chocolate', 'saddle', 'tan'],
  red: ['red', 'burgundy', 'maroon', 'wine', 'crimson', 'cherry', 'ruby'],
  blue: ['blue', 'navy', 'denim', 'cobalt', 'royal blue', 'indigo', 'navy blue'],
  pink: ['pink', 'rose', 'blush', 'fuchsia', 'coral', 'salmon', 'rose gold'],
  green: ['green', 'emerald', 'olive', 'sage', 'mint', 'forest', 'kelly green'],
  neutral: ['beige', 'nude', 'taupe', 'gray', 'grey', 'sand', 'nude', 'blush', 'champagne'],
  gold: ['gold', 'golden', 'metallic gold', 'champagne', 'bronz', 'bronze'],
  silver: ['silver', 'metallic silver', 'gunmetal', 'chrome', 'platinum'],
};

const styleKeywords: Record<string, string[]> = {
  luxury: ['luxury', 'premium', 'high-end', 'designer', 'elegant', 'sophisticated', 'luxurious'],
  casual: ['casual', 'relaxed', 'everyday', 'streetwear', 'urban', 'comfortable', 'laid-back'],
  sporty: ['sporty', 'athletic', 'active', 'performance', 'fitness', 'running', 'training'],
  classic: ['classic', 'timeless', 'vintage', 'retro', 'traditional', 'heritage', 'old-school'],
  modern: ['modern', 'contemporary', 'sleek', 'minimalist', 'chic', 'trendy', 'stylish'],
  bohemian: ['boho', 'bohemian', 'artistic', 'free-spirited', 'boho-chic', 'bohemian'],
  summer: ['summer', 'beach', 'vacation', 'tropical', 'outdoor'],
  formal: ['formal', 'elegant', 'dressy', 'office', 'business'],
};

export function analyzeProductImage(imageUrl: string, filename?: string): ProductFeatures {
  const features: ProductFeatures = {
    category: 'shoes',
    color: ['neutral'],
    material: ['casual'],
    style: ['casual'],
    features: [],
    keywords: [],
    productName: 'fashion item',
  };

  const filenameLower = (filename || '').toLowerCase();
  const urlLower = imageUrl.toLowerCase();
  const combined = filenameLower + ' ' + urlLower;

  for (const [category, keywords] of Object.entries(productCategories)) {
    for (const keyword of keywords) {
      if (combined.includes(keyword)) {
        features.category = category as ProductCategory;
        if (!features.keywords.includes(keyword)) {
          features.keywords.push(keyword);
        }
        if (!features.productName || features.productName === 'fashion item') {
          features.productName = keyword;
        }
        break;
      }
    }
  }

  for (const [material, keywords] of Object.entries(materialKeywords)) {
    for (const keyword of keywords) {
      if (combined.includes(keyword)) {
        if (!features.material.includes(material)) {
          features.material.push(material);
        }
        break;
      }
    }
  }

  for (const [color, keywords] of Object.entries(colorKeywords)) {
    for (const keyword of keywords) {
      if (combined.includes(keyword)) {
        if (!features.color.includes(color)) {
          features.color.push(color);
        }
        break;
      }
    }
  }

  for (const [style, keywords] of Object.entries(styleKeywords)) {
    for (const keyword of keywords) {
      if (combined.includes(keyword)) {
        if (!features.style.includes(style as ProductStyle)) {
          features.style.push(style as ProductStyle);
        }
        break;
      }
    }
  }

  if (features.features.length === 0) {
    features.features = getFeaturesForCategory(features.category, features.material, features.style);
  }

  return features;
}

function getFeaturesForCategory(category: string, _materials: string[], _styles: string[]): string[] {
  const featuresMap: Record<string, string[]> = {
    shoes: ['comfortable', 'versatile', 'stylish', 'everyday-ready'],
    bag: ['spacious', 'organized', 'stylish', 'practical'],
    dress: ['elegant', 'flattering', 'versatile', 'occasion-ready'],
    top: ['comfortable', 'stylish', 'versatile', 'wardrobe-essential'],
    bottom: ['comfortable', 'flattering', 'versatile', 'style-essential'],
    accessories: ['stylish', 'versatile', 'statement-piece', 'finishing-touch'],
  };

  return featuresMap[category] || ['premium-quality', 'stylish', 'versatile'];
}

export function generateSmartPrompt(
  productFeatures: ProductFeatures,
  category: 'runway' | 'product_showcase' | 'lifestyle' | 'campaign' | 'street' | 'editorial',
  isFinalOutput: boolean = false
): SmartPrompt {
  const productName = productFeatures.productName;
  const colors = productFeatures.color.join(', ');
  const materials = productFeatures.material.join(', ');
  const styles = productFeatures.style.join(' ');
  const features = productFeatures.features.join(', ');

  const shots = 6;
  const durationPerShot = 5;
  const totalDuration = 30;

  const useCase = category === 'lifestyle' || category === 'street' ? 'social'
    : category === 'runway' || category === 'editorial' ? 'presentation'
    : 'ecommerce';

  const aspectRatio = useCase === 'social' ? '9:16'
    : useCase === 'presentation' ? '16:9'
    : '1:1';

  const quality = isFinalOutput ? '1080p' : '720p';

  const promptTemplates = {
    runway: `Fashion model walking confidently on runway showcasing elegant ${colors} ${productName}, professional dramatic lighting, ${styles} atmosphere, slow motion walk highlighting the ${productName}, high-end fashion photography style, clean studio background, ${materials} construction detail visible, luxury fashion aesthetic`,

    product_showcase: `Professional ${productName} product showcase featuring ${colors} ${materials} design, soft studio lighting with elegant shadows, slow 360-degree rotation to highlight all angles and premium ${materials} texture, clean white background with subtle bokeh, luxury e-commerce commercial style, showcasing ${features} features, detail shots of craftsmanship, sophisticated and premium feel`,

    lifestyle: `Model wearing ${colors} ${productName} in stylish outdoor setting, natural sunlight with warm tones, candid lifestyle photography, authentic casual moment, ${styles} aesthetic, summer vibes, comfortable elegance, fashion-forward street style, aspirational lifestyle content, warm and inviting atmosphere`,

    campaign: `Cinematic fashion campaign featuring ${colors} ${productName}, dramatic professional lighting, high contrast moody atmosphere, luxury brand aesthetic, Vogue magazine editorial style, film grain effect, model showcasing ${productName} with artistic composition, sophisticated fashion photography, high-end brand campaign look`,

    street: `Urban street style photography, model wearing ${colors} ${productName} in city environment, natural daylight, street fashion influencer aesthetic, ${styles} vibe, vibrant urban colors, authentic streetwear moment, energetic city atmosphere, fashion-forward urban style, candid street photography`,

    editorial: `High-fashion editorial photography, model in artistic pose wearing ${colors} ${productName}, dramatic studio lighting, magazine spread composition, ${styles} sophisticated look, fashion week aesthetic, clean elegant styling, magazine editorial quality, fashion-forward artistic direction, professional fashion photography`,
  };

  const sellingPoints = [
    `Premium ${materials} quality ${productName}`,
    `Elegant ${colors} colorway`,
    `Features: ${features}`,
    `${styles.charAt(0).toUpperCase() + styles.slice(1)} design`,
    `Versatile styling options`,
    `Comfortable and fashionable`,
    `Perfect for multiple occasions`,
  ];

  return {
    mainPrompt: promptTemplates[category],
    sellingPoints,
    videoStyle: category,
    shots,
    durationPerShot,
    totalDuration,
    recommendedAspectRatio: aspectRatio,
    recommendedQuality: quality,
    useCase,
  };
}

export function enhanceUserPrompt(
  basePrompt: string,
  productFeatures: ProductFeatures
): string {
  const productName = productFeatures.productName;
  const colors = productFeatures.color.join(', ');
  const materials = productFeatures.material.join(', ');
  const styles = productFeatures.style.join(' ');
  const features = productFeatures.features.join(', ');

  const enhanced = `${basePrompt}

Enhanced with product details:
- Product: ${productName}
- Color: ${colors}
- Material: ${materials}
- Style: ${styles}
- Features: ${features || 'Premium craftsmanship'}`.replace(/\s+/g, ' ').trim();

  return enhanced;
}

export function generateMiniMaxEnhancedPrompt(
  productFeatures: ProductFeatures,
  category: 'runway' | 'product_showcase' | 'lifestyle' | 'campaign' | 'street' | 'editorial'
): string {
  const productName = productFeatures.productName;
  const colors = productFeatures.color.join(', ');
  const materials = productFeatures.material.join(', ');
  const styles = productFeatures.style.join(', ');
  const features = productFeatures.features.join(', ');
  const keywords = productFeatures.keywords.join(', ');

  const templates: Record<string, string> = {
    runway: `Fashion model walking confidently on runway showcasing elegant ${colors} ${productName}, professional dramatic lighting, ${styles} atmosphere, slow motion walk highlighting the ${productName}, high-end fashion photography style, clean studio background, ${materials} construction detail visible, luxury fashion aesthetic`,

    product_showcase: `Professional ${productName} product showcase featuring ${colors} ${materials} design, soft studio lighting with elegant shadows, slow 360-degree rotation to highlight all angles and premium ${materials} texture, clean white background with subtle bokeh, luxury e-commerce commercial style, showcasing ${features} features, detail shots of craftsmanship, sophisticated and premium feel`,

    lifestyle: `Model wearing ${colors} ${productName} in stylish outdoor setting, natural sunlight with warm tones, candid lifestyle photography, authentic casual moment, ${styles} aesthetic, summer vibes, comfortable elegance, fashion-forward street style, aspirational lifestyle content, warm and inviting atmosphere`,

    campaign: `Cinematic fashion campaign featuring ${colors} ${productName}, dramatic professional lighting, high contrast moody atmosphere, luxury brand aesthetic, Vogue magazine editorial style, film grain effect, model showcasing ${productName} with artistic composition, sophisticated fashion photography, high-end brand campaign look`,

    street: `Urban street style photography, model wearing ${colors} ${productName} in city environment, natural daylight, street fashion influencer aesthetic, ${styles} vibe, vibrant urban colors, authentic streetwear moment, energetic city atmosphere, fashion-forward urban style, candid street photography`,

    editorial: `High-fashion editorial photography, model in artistic pose wearing ${colors} ${productName}, dramatic studio lighting, magazine spread composition, ${styles} sophisticated look, fashion week aesthetic, clean elegant styling, magazine editorial quality, fashion-forward artistic direction, professional fashion photography`,
  };

  const enhancedPrompt = templates[category] || templates.product_showcase;

  const additionalDetails = `
Keywords: ${keywords}
Style: ${styles}
Key Features: ${features}
`.trim();

  return `${enhancedPrompt}\n\n${additionalDetails}`.replace(/\s+/g, ' ').trim();
}

export function getProductRecommendations(
  category: string,
  isFinalOutput: boolean = false
): {
  shots: number;
  durationPerShot: number;
  totalDuration: number;
  aspectRatio: string;
  quality: string;
  template: string;
  useCase: string;
} {
  const quality = isFinalOutput ? '1080p' : '720p';

  const recommendations: Record<string, any> = {
    shoes: {
      shots: 6,
      durationPerShot: 5,
      totalDuration: 30,
      aspectRatio: '9:16',
      quality,
      template: 'lifestyle',
      useCase: 'social',
    },
    bag: {
      shots: 6,
      durationPerShot: 5,
      totalDuration: 30,
      aspectRatio: '1:1',
      quality,
      template: 'product_showcase',
      useCase: 'ecommerce',
    },
    dress: {
      shots: 6,
      durationPerShot: 5,
      totalDuration: 30,
      aspectRatio: '9:16',
      quality,
      template: 'runway',
      useCase: 'social',
    },
    top: {
      shots: 6,
      durationPerShot: 5,
      totalDuration: 30,
      aspectRatio: '9:16',
      quality,
      template: 'campaign',
      useCase: 'social',
    },
    bottom: {
      shots: 6,
      durationPerShot: 5,
      totalDuration: 30,
      aspectRatio: '9:16',
      quality,
      template: 'campaign',
      useCase: 'social',
    },
    accessories: {
      shots: 6,
      durationPerShot: 5,
      totalDuration: 30,
      aspectRatio: '1:1',
      quality,
      template: 'product_showcase',
      useCase: 'ecommerce',
    },
    default: {
      shots: 6,
      durationPerShot: 5,
      totalDuration: 30,
      aspectRatio: '1:1',
      quality,
      template: 'product_showcase',
      useCase: 'ecommerce',
    },
  };

  return recommendations[category] || recommendations.default;
}

export function getVideoRequirements(): {
  minShots: number;
  maxShots: number;
  minDurationPerShot: number;
  maxDurationPerShot: number;
  minTotalDuration: number;
  maxTotalDuration: number;
  draftQuality: string[];
  finalQuality: string[];
  socialFormats: string[];
  presentationFormats: string[];
  ecommerceFormats: string[];
} {
  return {
    minShots: 4,
    maxShots: 8,
    minDurationPerShot: 5,
    maxDurationPerShot: 8,
    minTotalDuration: 30,
    maxTotalDuration: 64,
    draftQuality: ['360p', '540p', '720p'],
    finalQuality: ['720p', '1080p'],
    socialFormats: ['9:16'],
    presentationFormats: ['16:9'],
    ecommerceFormats: ['1:1', '9:16'],
  };
}
