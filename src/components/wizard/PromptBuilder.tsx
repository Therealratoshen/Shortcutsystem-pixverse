import { useState, useEffect } from 'react';
import { Sparkles, Wand2, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useUserTier } from '../../contexts/UserTierContext';
import type { VideoSettings, PixVerseModel, VideoQuality, MotionMode, AspectRatio } from '../../types';

interface PromptBuilderProps {
  templatePrompt: string;
  settings: VideoSettings;
  onSettingsChange: (settings: Partial<VideoSettings>) => void;
}

const modelOptions: { value: PixVerseModel; label: string; desc: string }[] = [
  { value: 'v6', label: 'V6 (Latest)', desc: 'Best quality & motion' },
  { value: 'v5.6', label: 'V5.6', desc: 'High quality' },
  { value: 'c1', label: 'C1 (Fast)', desc: 'Speed priority' },
];

const qualityOptions: { value: VideoQuality; label: string }[] = [
  { value: '720p', label: '720p (Recommended)' },
  { value: '1080p', label: '1080p (High quality)' },
  { value: '540p', label: '540p (Faster)' },
];

const motionOptions: { value: MotionMode; label: string; desc: string }[] = [
  { value: 'normal', label: 'Normal', desc: 'Standard motion' },
  { value: 'cinematic', label: 'Cinematic', desc: 'Smooth, dramatic' },
  { value: 'dynamic', label: 'Dynamic', desc: 'Fast-paced action' },
  { value: 'dramatic', label: 'Dramatic', desc: 'High contrast, intense' },
];

const aspectOptions: { value: AspectRatio; label: string; platforms: string }[] = [
  { value: '9:16', label: '9:16 Vertical', platforms: 'TikTok, Reels, Shopee Video' },
  { value: '1:1', label: '1:1 Square', platforms: 'Instagram Feed, Posts' },
  { value: '16:9', label: '16:9 Horizontal', platforms: 'YouTube, Facebook' },
];

export default function PromptBuilder({ templatePrompt, settings, onSettingsChange }: PromptBuilderProps) {
  const { user } = useUserTier();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [prompt, setPrompt] = useState(templatePrompt);

  useEffect(() => {
    if (settings.prompt && settings.prompt !== prompt) {
      setPrompt(settings.prompt);
    } else if (templatePrompt && templatePrompt !== prompt) {
      setPrompt(templatePrompt);
    }
  }, [settings.prompt, templatePrompt]);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    onSettingsChange({ prompt: newPrompt });
  };

  const useAiSuggestion = () => {
    handlePromptChange(templatePrompt);
  };

  return (
    <div className="space-y-6">
      {/* Prompt Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-secondary">
            Video Prompt
          </label>
          {user.tier === 'new' && (
            <button
              onClick={useAiSuggestion}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Use AI Suggestion
            </button>
          )}
        </div>
        
        <textarea
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Describe your fashion video..."
          className="w-full h-40 p-4 rounded-xl bg-secondary border border-border text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent transition-colors"
          maxLength={5000}
        />
        
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>{prompt.length} / 5000 characters</span>
          {user.tier === 'new' && (
            <span className="flex items-center gap-1">
              <Wand2 className="w-3 h-3" />
              AI suggestion optimized for your template
            </span>
          )}
        </div>
      </div>

      {/* Quick Settings */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Duration - Fixed at 30s */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">
            Video Duration
          </label>
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-accent">30s</p>
                <p className="text-xs text-text-muted mt-1">
                  6 shots × 5s per shot
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs rounded bg-accent/10 text-accent">
                  Fixed
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="px-2 py-1 text-xs rounded bg-accent/10 text-accent">
                Minimum 30s ✓
              </span>
              <span className="px-2 py-1 text-xs rounded bg-secondary text-text-muted">
                4-8 shots
              </span>
            </div>
          </div>
        </div>

        {/* Model */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">
            AI Model
          </label>
          <select
            value={settings.model}
            onChange={(e) => onSettingsChange({ model: e.target.value as PixVerseModel })}
            className="w-full p-3 rounded-xl bg-secondary border border-border text-text-primary focus:outline-none focus:border-accent"
          >
            {modelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} - {opt.desc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Settings (Pro Only) */}
      {user.tier === 'pro' && (
        <div className="border-t border-border pt-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <Settings className="w-4 h-4" />
            Advanced Settings
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="mt-4 grid md:grid-cols-2 gap-6">
              {/* Quality */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  Video Quality
                </label>
                <div className="flex flex-wrap gap-2">
                  {qualityOptions.map((opt) => {
                    const isDraft = ['360p', '540p', '720p'].includes(opt.value);
                    const isFinal = opt.value === '1080p';
                    
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onSettingsChange({ quality: opt.value })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          settings.quality === opt.value
                            ? 'bg-accent text-primary'
                            : 'bg-secondary text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {opt.label}
                        {isDraft && <span className="ml-1 text-xs opacity-70">(Draft)</span>}
                        {isFinal && <span className="ml-1 text-xs opacity-70">(Final)</span>}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-text-muted">
                  Draft: 720p (use fewer credits) | Final: 1080p (best quality)
                </p>
              </div>

              {/* Motion Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  Motion Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {motionOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onSettingsChange({ motionMode: opt.value })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        settings.motionMode === opt.value
                          ? 'bg-accent text-primary'
                          : 'bg-secondary text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-text-secondary">
                  Aspect Ratio (Export Format)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {aspectOptions.map((opt) => {
                    const isSocial = opt.value === '9:16';
                    const isPresentation = opt.value === '16:9';
                    const isEcommerce = opt.value === '1:1';
                    
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onSettingsChange({ aspectRatio: opt.value })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          settings.aspectRatio === opt.value
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs text-text-muted mt-1">{opt.platforms}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {isSocial && (
                            <span className="px-2 py-0.5 text-xs rounded bg-purple-500/10 text-purple-600">
                              Social
                            </span>
                          )}
                          {isPresentation && (
                            <span className="px-2 py-0.5 text-xs rounded bg-blue-500/10 text-blue-600">
                              Presentation
                            </span>
                          )}
                          {isEcommerce && (
                            <span className="px-2 py-0.5 text-xs rounded bg-green-500/10 text-green-600">
                              E-commerce
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-text-muted mt-2">
                  9:16 for TikTok/Reels | 16:9 for YouTube/presentations | 1:1 for Instagram/catalogs
                </p>
              </div>

              {/* Negative Prompt */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-text-secondary">
                  Negative Prompt (things to avoid)
                </label>
                <input
                  type="text"
                  value={settings.negativePrompt || ''}
                  onChange={(e) => onSettingsChange({ negativePrompt: e.target.value })}
                  placeholder="blurry, low quality, distorted..."
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {user.tier === 'new' && (
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
          <p className="text-sm text-accent">
            💡 <strong>Pro Tip:</strong> Upgrade to Pro for advanced settings like quality control, motion modes, and custom aspect ratios.
          </p>
        </div>
      )}
    </div>
  );
}
