import { VideoProvider, useVideo } from './contexts/VideoContext';
import { UserTierProvider } from './contexts/UserTierContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Header from './components/layout/Header';
import HeroSection from './components/landing/HeroSection';
import FeaturesSection from './components/landing/FeaturesSection';
import WorkflowSection from './components/landing/WorkflowSection';
import VideoCreationWizard from './components/wizard/VideoCreationWizard';
import VideoGallery from './components/gallery/VideoGallery';
import UserDashboard from './components/dashboard/UserDashboard';
import Footer from './components/layout/Footer';
import LoginPage from './components/auth/LoginPage';

function AppContent() {
  const { state } = useVideo();

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      
      {/* Main Content */}
      <main>
        {state.currentView === 'landing' && (
          <>
            <HeroSection />
            <FeaturesSection />
            <WorkflowSection />
            <TemplatesPreview />
            <CTASection />
          </>
        )}
        
        {state.currentView === 'login' && <LoginPage />}
        {state.currentView === 'create' && <VideoCreationWizard />}
        {state.currentView === 'gallery' && <VideoGallery />}
        {state.currentView === 'dashboard' && <UserDashboard />}
      </main>
      
      <Footer />
    </div>
  );
}

function TemplatesPreview() {
  const { setView } = useVideo();

  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Video Templates</span>
          </h2>
          <p className="text-text-secondary text-lg">
            Professional templates designed for fashion content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              name: 'Runway Walk',
              desc: 'Elegant model walking with product',
              img: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=500&fit=crop',
            },
            {
              name: 'Street Style',
              desc: 'Urban, casual fashion',
              img: 'https://images.unsplash.com/photo-1529139391626-1f0cb8f0f25e?w=400&h=500&fit=crop',
            },
            {
              name: 'Editorial',
              desc: 'Fashion magazine style',
              img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
            },
          ].map((template, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
            >
              <img
                src={template.img}
                alt={template.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{template.name}</h3>
                <p className="text-sm text-white/70">{template.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setView('create')}
            className="px-8 py-3 bg-accent hover:bg-accent-dark text-primary font-semibold rounded-xl transition-all"
          >
            Start Creating
          </button>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Create <span className="gradient-text">Amazing Videos</span>?
        </h2>
        <p className="text-text-secondary text-lg mb-8">
          Join fashion sellers who are already creating viral content with AI
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
            <span className="text-accent">✓</span>
            <span className="text-sm text-text-secondary">5 free videos</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
            <span className="text-accent">✓</span>
            <span className="text-sm text-text-secondary">No credit card needed</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
            <span className="text-accent">✓</span>
            <span className="text-sm text-text-secondary">Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <UserTierProvider>
      <VideoProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </VideoProvider>
    </UserTierProvider>
  );
}
