import { Zap, Clock, Download, Shield, Palette, Layers } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered',
    description: 'PixVerse V6 model generates stunning fashion videos automatically',
  },
  {
    icon: Clock,
    title: '30+ Seconds',
    description: 'Multi-clip videos perfect for TikTok, Shopee & Instagram Reels',
  },
  {
    icon: Download,
    title: 'Multi-Format',
    description: 'Export to 9:16, 1:1, or 16:9 for any platform',
  },
  {
    icon: Shield,
    title: 'No Skills Needed',
    description: 'Template-first approach - anyone can create professional videos',
  },
  {
    icon: Palette,
    title: '6+ Styles',
    description: 'Runway, Street Style, Editorial, Campaign & more',
  },
  {
    icon: Layers,
    title: 'E-commerce Ready',
    description: 'Optimized for fashion sellers on major platforms',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Go Viral</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Professional fashion videos without the professional equipment or skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-primary border border-border hover:border-accent/30 transition-all hover-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
