import { useState } from 'react';
import { Menu, X, Sparkles, Video, Grid3X3, LayoutDashboard, LogIn } from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';
import { useUserTier } from '../../contexts/UserTierContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state, setView } = useVideo();
  const { user } = useUserTier();

  const navItems = [
    { id: 'landing' as const, label: 'Home', icon: Sparkles },
    { id: 'create' as const, label: 'Create', icon: Video },
    { id: 'gallery' as const, label: 'Gallery', icon: Grid3X3 },
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-primary text-sm">
              SS
            </div>
            <span className="text-xl font-bold tracking-tight">
              Shortcut<span className="gradient-text">Sistem</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Tier Badge & Login */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setView('login')}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-primary font-medium rounded-lg transition-all"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                user.tier === 'pro'
                  ? 'bg-gradient-to-r from-accent to-accent-dark text-primary'
                  : 'bg-white/10 text-text-secondary'
              }`}
            >
              {user.tier === 'pro' ? '⚡ Pro' : '✨ New User'}
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-border">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-border">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  user.tier === 'pro'
                    ? 'bg-gradient-to-r from-accent to-accent-dark text-primary'
                    : 'bg-white/10 text-text-secondary'
                }`}
              >
                {user.tier === 'pro' ? '⚡ Pro User' : '✨ New User'}
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
