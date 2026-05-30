import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RefreshCw, Terminal, ExternalLink } from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';
import type { VideoSettings, WizardStep } from '../../types';
import UploadZone from './UploadZone';
import TemplateSelector from './TemplateSelector';
import PromptBuilder from './PromptBuilder';
import CLIWorkflow from './CLIWorkflow';

const steps: { id: WizardStep; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'template', label: 'Template' },
  { id: 'customize', label: 'Customize' },
  { id: 'cli', label: 'CLI Workflow' },
  { id: 'export', label: 'Export' },
];

export default function VideoCreationWizard() {
  const { state, setWizardStep, setTemplate, setUploadedImage, resetWizard } = useVideo();

  const [settings, setSettings] = useState<VideoSettings>({
    duration: 6,
    quality: '720p',
    model: 'v6',
    motionMode: 'normal',
    aspectRatio: '9:16',
    prompt: '',
    negativePrompt: '',
  });

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

  const handleGoToCLI = () => {
    goNext();
  };

  const handleStartOver = () => {
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
              <div className="pt-6 border-t border-border flex justify-between">
                <div />
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
                  onClick={handleGoToCLI}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Terminal className="w-5 h-5" />
                  Get CLI Commands
                </button>
              </div>
            </div>
          )}

          {/* CLI Workflow Step */}
          {state.wizardStep === 'cli' && (
            <CLIWorkflow
              uploadedImage={state.uploadedImage}
              selectedTemplate={state.selectedTemplate}
              settings={settings}
            />
          )}

          {/* Export Step */}
          {state.wizardStep === 'export' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Video Ready!</h2>
                <p className="text-text-secondary">
                  After generating with PixVerse CLI, you can manage your videos here
                </p>
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-xl bg-primary border border-border">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://platform.pixverse.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-primary font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open PixVerse Platform
                  </a>
                  <button
                    onClick={handleStartOver}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Create Another Video
                  </button>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4 rounded-xl bg-primary border border-border">
                <h3 className="font-semibold mb-3">Your Video Settings</h3>
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

              {/* Help */}
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-text-secondary mb-3">
                  If you haven't run the PixVerse CLI commands yet, go back to the CLI Workflow step.
                </p>
                <button
                  onClick={() => setWizardStep('cli')}
                  className="flex items-center gap-2 text-sm text-accent hover:text-accent-dark transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to CLI Workflow
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
