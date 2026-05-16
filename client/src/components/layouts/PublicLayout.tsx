import React, { useEffect, useState, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Terminal, Activity, Zap } from 'lucide-react';
import clsx from 'clsx';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mx - 5}px`;
        cursorRef.current.style.top = `${my - 5}px`;
      }
    };

    const animRing = () => {
      rx += (mx - rx - 18) * 0.15;
      ry += (my - ry - 18) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      animationFrameId = requestAnimationFrame(animRing);
    };

    document.addEventListener('mousemove', onMouseMove);
    animRing();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed w-[10px] h-[10px] bg-[var(--accent)] rounded-full pointer-events-none z-[9999] mix-blend-screen"
      />
      <div 
        ref={ringRef} 
        className="fixed w-[36px] h-[36px] border border-[var(--accent)] rounded-full pointer-events-none z-[9998] mix-blend-screen transition-transform duration-100 ease-out"
      />
    </>
  );
};

const LiveTicker = () => {
  return (
    <div className="w-full bg-[var(--surface2)] border-b border-[var(--accent2)] border-opacity-30 flex items-center h-8 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 px-4 bg-[var(--surface2)] z-10 flex items-center gap-2 border-r border-[var(--border)]">
        <div className="w-2 h-2 rounded-full bg-[var(--accent2)] animate-pulse" />
        <span className="font-mono text-xs font-bold tracking-wider text-[var(--accent2)]">SYSTEM LIVE</span>
      </div>
      <div className="whitespace-nowrap flex pl-[150px]">
        <div className="animate-[ticker_30s_linear_infinite] flex gap-12 font-mono text-xs text-[var(--text-muted)]">
          <span><span className="text-[var(--accent)]">[VOICE]</span> AI called RealEstate Co lead — qualified in 38s</span>
          <span><span className="text-[var(--accent2)]">[WHATSAPP]</span> 47 follow-ups sent — Apollo Clinic</span>
          <span><span className="text-[var(--accent3)]">[RECOVERY]</span> ₹18,400 cart recovered — StyleHub</span>
          <span><span className="text-[var(--accent4)]">[BOOKED]</span> 12 appointments confirmed — Dr. Mehta</span>
          <span><span className="text-[var(--accent)]">[VOICE]</span> AI called RealEstate Co lead — qualified in 38s</span>
          <span><span className="text-[var(--accent2)]">[WHATSAPP]</span> 47 follow-ups sent — Apollo Clinic</span>
        </div>
      </div>
    </div>
  );
};

const ActivityToasts = () => {
  const [toasts, setToasts] = useState<number[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setToasts(prev => {
        const nextId = Date.now();
        const next = [...prev, nextId].slice(-2);
        
        // Auto remove
        setTimeout(() => {
          setToasts(current => current.filter(id => id !== nextId));
        }, 3500);
        
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map(id => (
        <div key={id} className="bg-[var(--surface2)] border border-[var(--border)] p-3 rounded-lg shadow-xl shadow-black/50 flex items-start gap-3 w-72 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="p-2 bg-[var(--accent)] bg-opacity-10 rounded-md text-[var(--accent)]">
            <Zap size={16} />
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] mb-1">Live Activity</p>
            <p className="text-sm font-medium">Voice Agent — RealTech | Lead qualified → booked</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Navbar = () => (
  <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--bg)]/80 border-b border-[var(--border)]">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <Activity className="text-[var(--accent)]" size={24} />
        <span className="font-syne font-extrabold text-2xl tracking-tight">Neuron<span className="text-[var(--accent)]">Flow</span></span>
      </Link>
      <div className="hidden md:flex gap-8">
        <Link to="/agents" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Agents</Link>
        <Link to="/#how-it-works" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">How it Works</Link>
        <Link to="/#roi" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">ROI</Link>
        <Link to="/pricing" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Pricing</Link>
      </div>
      <div>
        <Link to="/contact" className="px-5 py-2.5 bg-[var(--accent)] text-black font-semibold rounded hover:shadow-[0_0_15px_var(--border-glow)] transition-all">
          Book Free Audit →
        </Link>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-12 mt-20">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-[var(--accent)]" size={20} />
          <span className="font-syne font-bold text-xl">Neuron<span className="text-[var(--accent)]">Flow</span></span>
        </div>
        <p className="text-[var(--text-muted)] text-sm mb-2">Your Business. Running on Autopilot.</p>
        <p className="text-[var(--text-dim)] text-xs font-mono">GSTIN: 27AAAAA0000A1Z5</p>
      </div>
      <div className="flex gap-12 md:justify-end">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-[var(--text-dim)] uppercase">Platform</span>
          <Link to="/agents" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">Agents</Link>
          <Link to="/pricing" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">Pricing</Link>
          <Link to="/login" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">Dashboard Login</Link>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-[var(--text-dim)] uppercase">Company</span>
          <Link to="/about" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">About</Link>
          <Link to="/contact" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">Contact</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default function PublicLayout() {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Global Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent)]/10 blur-[120px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent2)]/10 blur-[120px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      
      <CustomCursor />
      <LiveTicker />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      
      <Footer />
      <ActivityToasts />
    </div>
  );
}
