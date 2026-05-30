import { Sparkles, Palette, Layers, Tag, Zap } from 'lucide-react';

interface ProductInsightsProps {
  productName: string;
  category: string;
  color: string[];
  material: string[];
  style: string[];
  features: string[];
  isAiGenerated?: boolean;
}

export default function ProductInsights({
  productName,
  color,
  material,
  style,
  features,
  isAiGenerated = false,
}: ProductInsightsProps) {
  return (
    <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h4 className="font-semibold text-sm">Product Insights</h4>
        </div>
        {isAiGenerated && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10">
            <Zap className="w-3 h-3 text-accent" />
            <span className="text-xs font-medium text-accent">AI Detected</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Tag className="w-4 h-4 text-text-muted mt-0.5" />
            <div>
              <p className="text-xs text-text-muted">Product</p>
              <p className="font-medium capitalize">{productName}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Palette className="w-4 h-4 text-text-muted mt-0.5" />
            <div>
              <p className="text-xs text-text-muted">Color</p>
              <p className="font-medium capitalize">{color.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Layers className="w-4 h-4 text-text-muted mt-0.5" />
            <div>
              <p className="text-xs text-text-muted">Material</p>
              <p className="font-medium capitalize">{material.join(', ')}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-text-muted mt-0.5" />
            <div>
              <p className="text-xs text-text-muted">Style</p>
              <p className="font-medium capitalize">{style.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>

      {features.length > 0 && (
        <div className="mt-3 pt-3 border-t border-accent/10">
          <p className="text-xs text-text-muted mb-2">Key Features:</p>
          <div className="flex flex-wrap gap-1">
            {features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded bg-accent/10 text-accent"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-text-muted mt-3 italic">
        {isAiGenerated
          ? 'Video prompt automatically optimized with AI-detected insights'
          : 'Video prompt automatically optimized for this product'}
      </p>
    </div>
  );
}
