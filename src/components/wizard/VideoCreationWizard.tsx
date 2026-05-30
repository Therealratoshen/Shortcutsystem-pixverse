import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, RefreshCw, Sparkles } from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';
import { useUserTier } from '../../contexts/UserTierContext';
import type { VideoSettings, WizardStep, VideoQuality } from '../../types';
import { analyzeProductImage, generateSmartPrompt, getProductRecommendations, generateMiniMaxEnhancedPrompt } from '../../services/productIntelligence';
import { analyzeProductImageFile } from '../../services/minimax';
import UploadZone from './UploadZone';
import TemplateSelector from './TemplateSelector';
import PromptBuilder from './PromptBuilder';
import ProductInsights from './ProductInsights';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface ProductInsightsData {
  productName: string;
  category: string;
  color: string[];
  material: string[];
  style: string[];
  features: string[];
  isAiGenerated?: boolean;
}

const steps: { id: WizardStep; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'template', label: 'Template' },
  { id: 'customize', label: 'Customize' },
  { id: 'generate', label: 'Generate' },
  { id: 'export', label: 'Export' },
];

type GenerationStatus = 'idle' | 'starting' | 'generating' | 'completed' | 'failed';

export default function VideoCreationWizard() {
  const { state, setWizardStep, setTemplate, setUploadedImage, addGeneratedVideo, resetWizard } = useVideo();
  const { incrementVideosGenerated, decrementVideosRemaining } = useUserTier();

  const [settings, setSettings] = useState<VideoSettings>({
    duration: 6,
    quality: '720p',
    model: 'v6',
    motionMode: 'normal',
    aspectRatio: '9:16',
    prompt: '',
    negativePrompt: '',
  });

  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string>('processing');
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [productInsights, setProductInsights] = useState<ProductInsightsData | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.wizardStep === 'export' && currentTaskId && videoStatus === 'processing') {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/video-status/${currentTaskId}`);
          const data = await response.json();
          
          if (data.status === 'completed') {
            setVideoStatus('completed');
            setVideoUrl(data.videoUrl || data.outputPath);
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
          } else if (data.status === 'failed') {
            setVideoStatus('failed');
            setErrorMessage(data.error || 'Video generation failed');
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
          } else {
            setVideoStatus('processing');
          }
        } catch (error) {
          console.error('Error polling video status:', error);
        }
      }, 5000);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [state.wizardStep, currentTaskId, videoStatus]);

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
        // Check both settings.prompt and fallback to selectedTemplate.prompt
        const currentPrompt = settings.prompt || state.selectedTemplate?.prompt || '';
        return !!(currentPrompt && currentPrompt.trim().length > 0);
      default:
        return true;
    }
  };

  const handleImageUpload = async (image: any) => {
    setIsAnalyzingImage(true);
    setAnalysisError(null);

    
    

    if (image.file) {
      try {
        
        const result = await analyzeProductImageFile(image.file, '');

        if (result.success && result.insights) {
          

          const miniMaxInsights: ProductInsightsData = {
            productName: result.insights.productName,
            category: result.insights.category,
            color: result.insights.color,
            material: result.insights.material,
            style: result.insights.style,
            features: result.insights.features,
            isAiGenerated: true,
          };

          setProductInsights(miniMaxInsights);
          const recommendations = getProductRecommendations(miniMaxInsights.category);

          const productFeaturesForPrompt = {
            category: result.insights.category,
            color: result.insights.color,
            material: result.insights.material,
            style: result.insights.style,
            features: result.insights.features,
            keywords: result.insights.keywords,
            productName: result.insights.productName,
          };

          const enhancedPrompt = generateMiniMaxEnhancedPrompt(productFeaturesForPrompt, 'product_showcase');

          setSettings(prev => ({
            ...prev,
            duration: recommendations.totalDuration,
            aspectRatio: recommendations.aspectRatio as any,
            quality: recommendations.quality as VideoQuality,
            prompt: enhancedPrompt,
          }));

          setIsAnalyzingImage(false);
          goNext();
          return;
        } else {
          
          setAnalysisError(result.error || 'AI analysis failed');
        }
      } catch (error) {
        console.error('[MiniMax] Error:', error);
        setAnalysisError('AI analysis error');
      }
    } else {
      
    }

    
    const productFeatures = analyzeProductImage(image.url, image.name);
    const recommendations = getProductRecommendations(productFeatures.category);

    setProductInsights({
      productName: productFeatures.productName,
      category: productFeatures.category,
      color: productFeatures.color,
      material: productFeatures.material,
      style: productFeatures.style,
      features: productFeatures.features,
      isAiGenerated: false,
    });

    setSettings(prev => ({
      ...prev,
      duration: recommendations.totalDuration,
      aspectRatio: recommendations.aspectRatio as any,
      quality: recommendations.quality as VideoQuality,
    }));

    setIsAnalyzingImage(false);
    goNext();
  };

  const handleTemplateSelect = (template: any) => {
    setTemplate(template);
    
    let finalPrompt = template.prompt;
    let recommendedSettings = { shots: 6, durationPerShot: 5, totalDuration: 30 };
    
    // Always generate product-aware prompt if we have product insights
    if (productInsights && productInsights.productName) {
       const productFeatures = {
         category: productInsights.category as any,
         productName: productInsights.productName,
         color: productInsights.color || [],
         material: productInsights.material || [],
         style: productInsights.style as any || [],
         features: productInsights.features || [],
         keywords: [],
       };
      
      const smartPrompt = generateSmartPrompt(productFeatures, template.category as any);
      finalPrompt = smartPrompt.mainPrompt;
      recommendedSettings = {
        shots: smartPrompt.shots,
        durationPerShot: smartPrompt.durationPerShot,
        totalDuration: smartPrompt.totalDuration,
      };
    }
    
    console.log('[DEBUG] Template:', template.name);
    console.log('[DEBUG] Product:', productInsights?.productName);
    console.log('[DEBUG] Prompt:', finalPrompt?.substring(0, 80));
    
    setSettings(prev => ({ 
      ...prev, 
      prompt: finalPrompt, 
      motionMode: template.motionMode,
      duration: recommendedSettings.totalDuration,
    }));
    
    goNext();
  };

  const handleSettingsChange = (newSettings: Partial<VideoSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleGenerateVideo = async () => {
    
    
    
    
    
    if (!state.uploadedImage || !settings.prompt.trim()) {
      
      return;
    }

    
    setIsGenerating(true);
    setGenerationStatus('starting');
    setErrorMessage(null);
    setWizardStep('generate');

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            prompt: settings.prompt,
            duration: settings.duration,
            model: settings.model,
            quality: settings.quality,
            aspectRatio: settings.aspectRatio,
            imageUrl: state.uploadedImage.url,
            templateId: state.selectedTemplate?.id || null,
            templateName: state.selectedTemplate?.name || null,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to start video generation');
      }

      setGenerationStatus('generating');
      setCurrentTaskId(data.taskId);

      const video = {
        id: crypto.randomUUID(),
        videoId: data.taskId,
        url: state.uploadedImage.url,
        thumbnail: state.uploadedImage.url,
        status: 'generating' as const,
        prompt: settings.prompt,
        duration: settings.duration,
        quality: settings.quality,
        model: settings.model,
        aspectRatio: settings.aspectRatio,
        templateId: state.selectedTemplate?.id || '',
        createdAt: Date.now(),
        clips: [],
      };

      addGeneratedVideo(video);
      incrementVideosGenerated();
      decrementVideosRemaining();

    } catch (error) {
      setGenerationStatus('failed');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartOver = () => {
    setGenerationStatus('idle');
    setErrorMessage(null);
    setVideoUrl(null);
    setVideoStatus('processing');
    setCurrentTaskId(null);
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
                <p className="text-xs text-accent mt-2">
                  ✨ Powered by MiniMax M.2.7 for AI-powered insights
                </p>
              </div>

              {isAnalyzingImage && (
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="font-medium text-sm">Analyzing with MiniMax M.2.7</p>
                      <p className="text-xs text-text-muted">Detecting product insights...</p>
                    </div>
                  </div>
                </div>
              )}

              {analysisError && (
                <div className="p-4 rounded-xl bg-error/5 border border-error/20">
                  <p className="text-sm text-error">
                    ⚠️ {analysisError} - Using fallback analysis
                  </p>
                </div>
              )}

              <UploadZone onUpload={handleImageUpload} />

              <div className="pt-6 border-t border-border flex justify-between">
                <div />
                <button
                  onClick={goNext}
                  disabled={!canProceed() || isAnalyzingImage}
                  className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent-dark text-primary font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
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
              <div className="pt-6 border-t border-border flex justify-between">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
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
            </div>
          )}

          {/* Customize Step */}
          {state.wizardStep === 'customize' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Customize Your Video</h2>
                <p className="text-text-secondary">
                  {state.selectedTemplate?.name || 'Custom'} template selected
                </p>
              </div>
              
              {productInsights && (
                <ProductInsights
                  productName={productInsights.productName}
                  category={productInsights.category}
                  color={productInsights.color}
                  material={productInsights.material}
                  style={productInsights.style}
                  features={productInsights.features}
                  isAiGenerated={productInsights.isAiGenerated}
                />
              )}
              
              <PromptBuilder
                templatePrompt={settings.prompt || state.selectedTemplate?.prompt || ''}
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
                  onClick={handleGenerateVideo}
                  disabled={!canProceed() || isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? 'Starting...' : 'Generate Video'}
                </button>
              </div>
            </div>
          )}

          {/* Generate Step */}
          {state.wizardStep === 'generate' && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className={`w-10 h-10 text-accent ${isGenerating ? 'animate-pulse' : ''}`} />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                {generationStatus === 'starting' && 'Starting Generation...'}
                {generationStatus === 'generating' && 'Generating Your Video'}
                {generationStatus === 'failed' && 'Generation Failed'}
              </h2>
              
              {generationStatus === 'failed' ? (
                <div className="space-y-4">
                  <p className="text-error">{errorMessage}</p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setGenerationStatus('idle');
                        setWizardStep('customize');
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Customize
                    </button>
                    <button
                      onClick={handleGenerateVideo}
                      className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent-dark text-primary font-medium rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-text-secondary mb-8">
                    {generationStatus === 'starting' && 'Preparing your fashion video...'}
                    {generationStatus === 'generating' && 'Creating your fashion video with AI. This may take a few minutes.'}
                  </p>

                  <div className="p-6 rounded-xl bg-primary border border-border text-left max-w-md mx-auto mb-6">
                    <h3 className="font-semibold mb-3 text-sm">Video Details:</h3>
                    <div className="text-sm text-text-secondary space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted">Template:</span>
                        <span className="font-medium">{state.selectedTemplate?.name || 'Custom'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted">Duration:</span>
                        <span className="font-medium">{settings.duration}s per clip</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted">Total Length:</span>
                        <span className="font-medium">
                          {settings.duration}s ({Math.floor(settings.duration / 60)}m {settings.duration % 60}s)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted">Quality:</span>
                        <span className="font-medium">{settings.quality}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted">Format:</span>
                        <span className="font-medium">{settings.aspectRatio}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted">AI Model:</span>
                        <span className="font-medium">{settings.model}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-text-muted">
                    Your video will be ready in the next step
                  </p>
                </>
              )}
            </div>
          )}

          {/* Export Step */}
          {state.wizardStep === 'export' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                {videoStatus === 'completed' ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="w-8 h-8 text-success" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Video Ready!</h2>
                    <p className="text-text-secondary">
                      Your fashion video has been generated successfully
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Generating Your Video</h2>
                    <p className="text-text-secondary">
                      Please wait while PixVerse creates your fashion video...
                    </p>
                  </>
                )}
              </div>

              {/* Video Player */}
              {videoStatus === 'completed' && videoUrl && (
                <div className="rounded-xl overflow-hidden bg-black">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full aspect-video"
                    poster={state.uploadedImage?.url}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Status Card */}
              <div className="p-6 rounded-xl bg-primary border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Generation Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    videoStatus === 'completed' 
                      ? 'bg-success/20 text-success' 
                      : videoStatus === 'failed'
                      ? 'bg-error/20 text-error'
                      : 'bg-accent/20 text-accent'
                  }`}>
                    {videoStatus === 'completed' ? 'Completed' : videoStatus === 'failed' ? 'Failed' : 'In Progress'}
                  </span>
                </div>
                
                {videoStatus === 'processing' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-accent border-t-transparent rounded-full"></div>
                      <span className="text-sm text-text-secondary">
                        Creating your fashion video with AI...
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">
                      This usually takes 1-3 minutes
                    </p>
                  </div>
                )}

                {videoStatus === 'failed' && errorMessage && (
                  <p className="text-sm text-error">
                    Error: {errorMessage}
                  </p>
                )}

                {videoStatus === 'completed' && (
                  <p className="text-sm text-success">
                    Video generated successfully!
                  </p>
                )}
              </div>

              {/* Video Info */}
              <div className="p-4 rounded-xl bg-primary border border-border">
                <h3 className="font-semibold mb-3">Video Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-text-muted">Template:</span>
                    <span className="ml-2 font-medium">{state.selectedTemplate?.name || 'Custom'}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Duration:</span>
                    <span className="ml-2 font-medium">{settings.duration}s</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Quality:</span>
                    <span className="ml-2 font-medium">{settings.quality}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Model:</span>
                    <span className="ml-2 font-medium">{settings.model}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {videoStatus === 'completed' && videoUrl && (
                  <a
                    href={videoUrl}
                    download
                    className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-semibold rounded-xl transition-all"
                  >
                    Download Video
                  </a>
                )}
                <button
                  onClick={handleStartOver}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
