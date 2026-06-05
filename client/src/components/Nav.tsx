import React from 'react';
import { Link } from 'react-router-dom';

type IconProps = { size?: number; className?: string };
const XIcon = ({ size = 18, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Logo: React.FC<{ className?: string; showText?: boolean }> = ({ className = '', showText = true }) => (
  <Link to="/" className={`flex items-center gap-2 shrink-0 ${className}`}>
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="url(#logo-grad)" strokeWidth="2" />
      <rect x="10" y="10" width="20" height="20" rx="4" fill="url(#logo-grad)" />
    </svg>
    {showText && (
      <span className="font-display font-extrabold text-lg tracking-tight text-white">NeuronFlow</span>
    )}
  </Link>
);

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">Home</Link>
          <Link to="/agents" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">Agents</Link>
          <Link to="/about" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/contact" className="btn-primary hidden! md:inline-flex!">
            Book a call
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white w-10 h-10 flex items-center justify-center"
            aria-label="Menu"
          >
            {isOpen ? <XIcon /> : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 h-[calc(100vh-4rem)] bg-black/95 backdrop-blur-xl border-t border-[var(--border)] p-6 flex flex-col">
          <Link onClick={() => setIsOpen(false)} to="/" className="block text-lg font-medium text-white py-4 border-b border-[var(--border)]">Home</Link>
          <Link onClick={() => setIsOpen(false)} to="/agents" className="block text-lg font-medium text-white py-4 border-b border-[var(--border)]">Agents</Link>
          <Link onClick={() => setIsOpen(false)} to="/about" className="block text-lg font-medium text-white py-4 border-b border-[var(--border)]">About</Link>
          <Link onClick={() => setIsOpen(false)} to="/contact" className="block text-lg font-medium text-white py-4">Contact</Link>
          <div className="mt-auto pt-6">
            <Link onClick={() => setIsOpen(false)} to="/contact" className="btn-primary w-full">
              Book a call
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-[var(--surface)] border-t border-[var(--border)] pt-16 pb-12 mt-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <Logo className="mb-4" />
          <p className="text-[var(--text-muted)] text-sm max-w-sm mb-6">
            AI automation that takes your business to the next level. We design, develop, and deploy intelligent agents.
          </p>
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="text-xs font-mono text-[var(--text-muted)]">All systems operational</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-display text-xs uppercase tracking-widest text-[var(--text-faint)] mb-1">Platform</span>
          <Link to="/agents" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Agents</Link>
          <Link to="/about" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Contact</Link>
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-display text-xs uppercase tracking-widest text-[var(--text-faint)] mb-1">Connect</span>
          <a href="mailto:hello@neuronflow.ai" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">hello@neuronflow.ai</a>
          <a href="https://wa.me/917780379949" target="_blank" rel="noopener" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">WhatsApp</a>
          <Link to="/contact" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Book a call</Link>
        </div>
      </div>
      <div className="divider-fade mb-6" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-faint)] font-mono">
        <span>© 2026 NeuronFlow. All rights reserved.</span>
        <span>Built for Indian SMBs.</span>
      </div>
    </div>
  </footer>
);
