import type { ProductCategory, ProductStyle } from '../types';

export interface ProductInsightsResult {
  productName: string;
  category: ProductCategory;
  color: string[];
  material: string[];
  style: ProductStyle[];
  features: string[];
  keywords: string[];
  confidence: number;
}

export interface MiniMaxAnalysisResult {
  success: boolean;
  insights?: ProductInsightsResult;
  error?: string;
  processingTime?: number;
}

const MINIMAX_API_URL = 'https://api.minimax.io/v1';

export async function analyzeProductWithMiniMax(
  imageUrl: string,
  apiKey: string
): Promise<MiniMaxAnalysisResult> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${MINIMAX_API_URL}/vision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
              {
                type: 'text',
                text: `Analyze this fashion product image and extract detailed product insights for e-commerce video generation. Return a JSON object with the following structure:
{
  "productName": "specific product name (e.g., leather crossbody bag)",
  "category": "one of: bag, shoes, dress, top, bottom, accessories",
  "color": ["primary color", "secondary color if visible"],
  "material": ["material type(s) visible"],
  "style": ["style descriptor(s)"],
  "features": ["distinctive feature 1", "feature 2"],
  "keywords": ["search keyword 1", "keyword 2", "keyword 3"]
}

Focus on fashion/e-commerce attributes. Be specific about product type, materials, colors, and style.`,
              },
            ],
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'MiniMax API request failed');
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No analysis content returned from MiniMax');
    }

    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse MiniMax response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const insights: ProductInsightsResult = {
      productName: parsed.productName || 'fashion item',
      category: normalizeCategory(parsed.category),
      color: Array.isArray(parsed.color) ? parsed.color : [parsed.color || 'neutral'],
      material: Array.isArray(parsed.material) ? parsed.material : [parsed.material || 'fabric'],
      style: normalizeStyle(parsed.style),
      features: Array.isArray(parsed.features) ? parsed.features : [parsed.features || 'premium quality'],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [parsed.productName || 'fashion'],
      confidence: 0.9,
    };

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      insights,
      processingTime,
    };
  } catch (error) {
    console.error('MiniMax analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze product',
      processingTime: Date.now() - startTime,
    };
  }
}

export async function analyzeProductImageFile(
  file: File,
  _apiKey: string
): Promise<MiniMaxAnalysisResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;

      try {
        console.log('[MiniMax Service] Calling backend endpoint...');
        console.log('[MiniMax Service] Backend URL: /api/analyze-image');

        const API_BASE_URL = import.meta.env.VITE_API_URL || '';

        const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: base64Image
          }),
        });

        console.log('[MiniMax Service] Response status:', response.status);
        const data = await response.json();
        console.log('[MiniMax Service] Response data:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to analyze image');
        }

        if (!data.success || !data.insights) {
          throw new Error(data.error || 'No insights returned');
        }

        const insights: ProductInsightsResult = {
          productName: data.insights.productName || 'fashion item',
          category: normalizeCategory(data.insights.category),
          color: Array.isArray(data.insights.color) ? data.insights.color : [data.insights.color || 'neutral'],
          material: Array.isArray(data.insights.material) ? data.insights.material : [data.insights.material || 'fabric'],
          style: normalizeStyle(data.insights.style),
          features: Array.isArray(data.insights.features) ? data.insights.features : [data.insights.features || 'premium quality'],
          keywords: Array.isArray(data.insights.keywords) ? data.insights.keywords : [data.insights.productName || 'fashion'],
          confidence: 0.9,
        };

        resolve({
          success: true,
          insights,
          processingTime: 3000,
        });
      } catch (error) {
        console.error('MiniMax analysis error:', error);
        resolve({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to analyze product',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read image file',
      });
    };

    reader.readAsDataURL(file);
  });
}

function normalizeCategory(category: string): ProductCategory {
  const categoryLower = (category || '').toLowerCase();

  if (categoryLower.includes('bag') || categoryLower.includes('purse') || categoryLower.includes('wallet')) {
    return 'bag';
  }
  if (categoryLower.includes('shoe') || categoryLower.includes('sneaker') || categoryLower.includes('heel') || categoryLower.includes('boot') || categoryLower.includes('sandal')) {
    return 'shoes';
  }
  if (categoryLower.includes('dress') || categoryLower.includes('gown') || categoryLower.includes('jumpsuit')) {
    return 'dress';
  }
  if (categoryLower.includes('top') || categoryLower.includes('blouse') || categoryLower.includes('shirt') || categoryLower.includes('jacket') || categoryLower.includes('coat')) {
    return 'top';
  }
  if (categoryLower.includes('pant') || categoryLower.includes('skirt') || categoryLower.includes('jeans') || categoryLower.includes('short')) {
    return 'bottom';
  }
  if (categoryLower.includes('watch') || categoryLower.includes('jewelry') || categoryLower.includes('sunglasses') || categoryLower.includes('necklace') || categoryLower.includes('bracelet')) {
    return 'accessories';
  }

  return 'top';
}

function normalizeStyle(style: string | string[]): ProductStyle[] {
  const styles = Array.isArray(style) ? style : [style];
  const normalized: ProductStyle[] = [];

  const styleMap: Record<string, ProductStyle> = {
    luxury: 'luxury',
    premium: 'luxury',
    casual: 'casual',
    relaxed: 'casual',
    streetwear: 'casual',
    sporty: 'sporty',
    athletic: 'sporty',
    classic: 'classic',
    vintage: 'classic',
    modern: 'modern',
    contemporary: 'modern',
    minimalist: 'modern',
    bohemian: 'bohemian',
    boho: 'bohemian',
    formal: 'formal',
  };

  for (const s of styles) {
    const styleLower = (s || '').toLowerCase();
    if (styleMap[styleLower]) {
      const normalizedStyle = styleMap[styleLower];
      if (!normalized.includes(normalizedStyle)) {
        normalized.push(normalizedStyle);
      }
    }
  }

  if (normalized.length === 0) {
    normalized.push('casual');
  }

  return normalized;
}

export async function batchAnalyzeProducts(
  images: Array<{ url: string; filename?: string }>,
  apiKey: string,
  onProgress?: (index: number, result: MiniMaxAnalysisResult) => void
): Promise<MiniMaxAnalysisResult[]> {
  const results: MiniMaxAnalysisResult[] = [];

  for (let i = 0; i < images.length; i++) {
    const result = await analyzeProductWithMiniMax(images[i].url, apiKey);
    results.push(result);
    onProgress?.(i, result);

    if (i < images.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}
