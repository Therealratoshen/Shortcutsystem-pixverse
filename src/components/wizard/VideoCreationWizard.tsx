import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Check, Play, RefreshCw } from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';
import { useUserTier } from '../../contexts/UserTierContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import type { VideoSettings, GeneratedVideo, WizardStep } from '../../types';
import UploadZone from './UploadZone';
import TemplateSelector from './TemplateSelector';
import PromptBuilder from './PromptBuilder';
import VideoPlayer from '../ui/VideoPlayer';

const steps: { id: WizardStep; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'template', label: 'Template' },
  { id: 'customize', label: 'Customize' },
  { id: 'generate', label: 'Generate' },
  { id: 'export', label: 'Export' },
];

export default function VideoCreationWizard() {
  const { state, setWizardStep, setTemplate, setUploadedImage, addGeneratedVideo, resetWizard, setGenerating, setProgress, setError } = useVideo();
  const { incrementVideosGenerated, decrementVideosRemaining } = useUserTier();
  const { addFavorite } = useFavorites();

  const [settings, setSettings] = useState<VideoSettings>({
    duration: 6,
    quality: '720p',
    model: 'v6',
    motionMode: 'normal',
    aspectRatio: '9:16',
    prompt: '',
    negativePrompt: '',
  });

  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentStepIndex = steps.findIndex(s => s.id === state.wizardStep);

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setWizardStep(steps[currentStepIndex + 1].id);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setWizardStep(steps[currentStepIndex - 1].id);
    }
  };

  const canProceed = () => {
    switch (state.wizardStep) {
      case 'upload':
        return !!state.uploadedImage;
      case 'template':
        return !!state.selectedTemplate;
      case 'customize':
        return !!settings.prompt.trim();
      default:
        return true;
    }
  };

  const handleImageUpload = (image: any) => {
    setUploadedImage(image);
    goNext();
  };

  const handleTemplateSelect = (template: any) => {
    setTemplate(template);
    setSettings(prev => ({ ...prev, prompt: template.prompt, motionMode: template.motionMode }));
    goNext();
  };

  const handleSettingsChange = (newSettings: Partial<VideoSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const generateVideo = async () => {
    if (!state.uploadedImage) return;

    setIsGenerating(true);
    setGenerating(true);
    setWizardStep('generate');

    try {
      // Simulate video generation (in production, use real PixVerse API)
      setGenerationStatus('Uploading image to PixVerse...');
      setProgress(10);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(20);
      setGenerationStatus('Image uploaded successfully');

      // Simulate video generation (in production, call PixVerse API)
      setGenerationStatus('Generating video clips (1/6)...');
      
      for (let i = 1; i <= 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProgress(20 + (i * 12));
        setGenerationStatus(`Generating video clips (${i}/6)...`);
      }

      setGenerationStatus('Finalizing video...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create generated video object (use demo URL in production)
      const video: GeneratedVideo = {
        id: crypto.randomUUID(),
        videoId: `pix_${Date.now()}`,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Demo video
        thumbnail: state.uploadedImage.url,
        status: 'completed',
        prompt: settings.prompt,
        duration: settings.duration * 6,
        quality: settings.quality,
        model: settings.model,
        aspectRatio: settings.aspectRatio,
        templateId: state.selectedTemplate?.id || '',
        createdAt: Date.now(),
        clips: [],
      };

      setGeneratedVideo(video);
      addGeneratedVideo(video);
      incrementVideosGenerated();
      decrementVideosRemaining();

      setProgress(100);
      setGenerationStatus('Video generated successfully!');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setWizardStep('export');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate video');
      setGenerationStatus('Error: Failed to generate video');
    } finally {
      setIsGenerating(false);
      setGenerating(false);
    }
  };

  const handleSaveToFavorites = () => {
    if (generatedVideo) {
      addFavorite({
        id: crypto.randomUUID(),
        videoId: generatedVideo.videoId,
        thumbnail: generatedVideo.thumbnail || '',
        title: `Fashion Video - ${state.selectedTemplate?.name}`,
        category: state.selectedTemplate?.category || 'campaign',
        addedAt: Date.now(),
      });
    }
  };

  const handleStartOver = () => {
    setGeneratedVideo(null);
    setSettings({
      duration: 6,
      quality: '720p',
      model: 'v6',
      motionMode: 'normal',
      aspectRatio: '9:16',
      prompt: '',
      negativePrompt: '',
    });
    resetWizard();
    setTemplate(null);
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isCompleted
                          ? 'bg-accent text-primary'
                          : isActive
                          ? 'bg-accent/20 text-accent border-2 border-accent'
                          : 'bg-secondary text-text-muted'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className={`text-xs mt-2 ${isActive ? 'text-accent' : 'text-text-muted'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 sm:w-20 h-0.5 mx-2 ${
                        index < currentStepIndex ? 'bg-accent' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-secondary rounded-2xl p-6 sm:p-8">
          {/* Upload Step */}
          {state.wizardStep === 'upload' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Upload Your Product Image</h2>
                <p className="text-text-secondary">
                  Start by uploading a clear image of your fashion product
                </p>
              </div>
              <UploadZone onUpload={handleImageUpload} />
            </div>
          )}

          {/* Template Step */}
          {state.wizardStep === 'template' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Choose a Video Template</h2>
                <p className="text-text-secondary">
                  Select the style that best fits your fashion content
                </p>
              </div>
              <TemplateSelector
                selectedTemplate={state.selectedTemplate}
                onSelect={handleTemplateSelect}
              />
            </div>
          )}

          {/* Customize Step */}
          {state.wizardStep === 'customize' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Customize Your Video</h2>
                <p className="text-text-secondary">
                  {state.selectedTemplate?.name} template selected
                </p>
              </div>
              <PromptBuilder
                templatePrompt={state.selectedTemplate?.prompt || ''}
                settings={settings}
                onSettingsChange={handleSettingsChange}
              />
              <div className="pt-6 border-t border-border flex justify-between items-center">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={generateVideo}
                  disabled={!canProceed() || isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? 'Generating...' : 'Generate Video'}
                </button>
              </div>
            </div>
          )}

          {/* Generate Step */}
          {state.wizardStep === 'generate' && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-accent animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Generating Your Video</h2>
              <p className="text-text-secondary mb-8">{generationStatus}</p>
              
              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${state.generationProgress}%` }}
                  />
                </div>
                <p className="text-sm text-text-muted mt-2">
                  {state.generationProgress}% complete
                </p>
              </div>
            </div>
          )}

          {/* Export Step */}
          {state.wizardStep === 'export' && generatedVideo && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your Video is Ready!</h2>
                <p className="text-text-secondary">
                  Duration: {generatedVideo.duration} seconds • Quality: {generatedVideo.quality}
                </p>
              </div>

              {/* Video Preview */}
              <VideoPlayer url={generatedVideo.url} />

              {/* Export Options */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { ratio: '9:16', label: 'TikTok / Reels', color: 'from-pink-500 to-purple-500' },
                  { ratio: '1:1', label: 'Instagram Post', color: 'from-orange-500 to-yellow-500' },
                  { ratio: '16:9', label: 'YouTube', color: 'from-red-500 to-pink-500' },
                ].map((opt) => (
                  <div
                    key={opt.ratio}
                    className={`p-4 rounded-xl bg-gradient-to-br ${opt.color} bg-opacity-10 border border-white/10 text-center cursor-pointer hover:scale-105 transition-transform`}
                  >
                    <div className="font-bold text-lg">{opt.ratio}</div>
                    <div className="text-xs opacity-75">{opt.label}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-4 pt-6 border-t border-border">
                <button
                  onClick={handleSaveToFavorites}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save to Favorites
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary transition-colors">
                  <Play className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={handleStartOver}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Create Another
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-semibold rounded-xl transition-colors">
                  Download Video
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons (for non-generate steps) */}
          {state.wizardStep !== 'generate' && state.wizardStep !== 'export' && (
            <div className="pt-6 border-t border-border flex justify-between">
              <button
                onClick={goBack}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent-dark text-primary font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
