import { Upload, Wand2, Sparkles, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload',
    description: 'Add your product image',
  },
  {
    number: '02',
    icon: Wand2,
    title: 'Select',
    description: 'Choose a video template',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Generate',
    description: 'AI creates your video',
  },
  {
    number: '04',
    icon: Download,
    title: 'Export',
    description: 'Download & share anywhere',
  },
];

export default function WorkflowSection() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Create in <span className="gradient-text">4 Simple Steps</span>
          </h2>
          <p className="text-text-secondary text-lg">
            From image to viral video in under 5 minutes
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary border-2 border-accent/30 flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
                      <Icon className="w-8 h-8 text-accent" />
                      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-primary text-sm font-bold flex items-center justify-center">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-text-secondary text-sm">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
