import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold">
              Shortcut<span className="gradient-text">Sistem</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Support</a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-text-muted">
            © 2026 ShortcutSistem. TRAE Hackathon Project.
          </div>
        </div>
      </div>
    </footer>
  );
}
