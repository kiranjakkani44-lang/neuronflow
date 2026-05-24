import React, { useEffect, useState, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Terminal, Activity, Zap, Menu, X } from 'lucide-react';
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


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--bg)]/80 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Activity className="text-[var(--accent)]" size={24} />
          <span className="font-syne font-extrabold text-xl md:text-2xl tracking-tight">Neuron<span className="text-[var(--accent)]">Flow</span></span>
        </Link>
        <div className="hidden md:flex gap-8">
          <Link to="/agents" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Agents</Link>
          <Link to="/#how-it-works" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">How it Works</Link>
          <Link to="/pricing" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/contact" className="px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm bg-[var(--accent)] text-black font-semibold rounded hover:shadow-[0_0_15px_var(--border-glow)] transition-all whitespace-nowrap">
            <span className="hidden sm:inline">Book Free Audit →</span>
            <span className="sm:hidden">Book Audit</span>
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[var(--text)] p-1 hover:text-[var(--accent)] transition-colors">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#050810] border-b border-[var(--border)] p-4 flex flex-col shadow-xl">
          <Link onClick={() => setIsOpen(false)} to="/agents" className="block text-sm font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors py-3 border-b border-white/5">Agents</Link>
          <Link onClick={() => setIsOpen(false)} to="/#how-it-works" className="block text-sm font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors py-3 border-b border-white/5">How it Works</Link>
          <Link onClick={() => setIsOpen(false)} to="/pricing" className="block text-sm font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors py-3">Pricing</Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-[var(--surface)] border-t border-[var(--border)] pt-12 pb-32 mt-20">
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
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; options?: string[] }>>([
    {
      sender: 'ai',
      text: "Hi there! I am the NeuronFlow Onboarding Assistant. 🤖 Which business operation would you like to automate first?",
      options: ["Qualify Leads", "Customer Support", "Booking Appointments"]
    }
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const handleChatOption = (option: string) => {
    // Add user response
    setChatMessages(prev => [...prev, { sender: 'user', text: option }]);
    setIsBotTyping(true);

    setTimeout(() => {
      setIsBotTyping(false);
      if (chatStep === 0) {
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `Excellent choice! Automating "${option}" typically saves our clients 15-20 hours per week.\n\nWhat industry is your business in?`,
            options: ["E-commerce", "Real Estate", "Healthcare / Clinics", "Other"]
          }
        ]);
        setChatStep(1);
      } else if (chatStep === 1) {
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `Perfect! Business operations in your sector scale beautifully with AI. \n\nWould you like to schedule a free 30-min custom audit to outline your AI deployment roadmap?`,
            options: ["Yes, Book Free Audit →", "No, just exploring"]
          }
        ]);
        setChatStep(2);
      } else if (chatStep === 2) {
        if (option.includes("Yes")) {
          setChatMessages(prev => [
            ...prev,
            {
              sender: 'ai',
              text: "Fantastic! Closing chat and redirecting you to our Booking page now..."
            }
          ]);
          setTimeout(() => {
            setChatOpen(false);
            navigate(`/contact?agent=${encodeURIComponent("Onboarding-AI")}`);
          }, 1500);
        } else {
          setChatMessages(prev => [
            ...prev,
            {
              sender: 'ai',
              text: "No worries! Let me know if you change your mind. You can explore our pre-built agents inside the Marketplace!"
            }
          ]);
          setChatStep(0);
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden w-full">
      {/* Global Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent)]/10 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent2)]/10 blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      </div>
      
      <CustomCursor />
      <LiveTicker />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      
      <Footer />

      {/* Floating Onboarding Chatbot */}
      <div className="fixed bottom-6 left-6 z-[999]">
        {/* Chat Toggle Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-[var(--accent)] hover:bg-[#00a8c2] text-black p-4 rounded-full shadow-[0_0_20px_rgba(0,188,212,0.4)] hover:shadow-[0_0_30px_rgba(0,188,212,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center border border-white/10"
          title="Try AI Agent Onboarding Demo"
        >
          {chatOpen ? (
            <span className="font-mono text-xs font-bold leading-none px-1">✕ CLOSE</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm">🤖</span>
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase">TRY_AI_DEMO</span>
            </div>
          )}
        </button>

        {/* Chat Window Panel */}
        {chatOpen && (
          <div className="absolute bottom-16 left-0 w-[85vw] sm:w-[320px] bg-zinc-950 border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden font-sans text-xs animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-zinc-900 border-b border-[var(--border)] p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="font-syne font-bold text-white">NeuronFlow Assistant</span>
              </div>
              <span className="font-mono text-[9px] text-[var(--accent)] bg-[var(--accent)]/10 px-1.5 py-0.5 rounded border border-[var(--accent)]/20 uppercase tracking-widest">AGENT_01</span>
            </div>

            {/* Conversation Messages */}
            <div className="p-4 h-[260px] overflow-y-auto space-y-3 flex flex-col justify-end bg-zinc-950">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] p-3 rounded-lg leading-relaxed ${m.sender === 'ai' ? 'bg-zinc-900 text-zinc-200 mr-auto rounded-tl-none border border-zinc-800' : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 ml-auto rounded-tr-none'}`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              ))}
              {isBotTyping && (
                <div className="bg-zinc-900 text-[var(--text-dim)] p-2 rounded-lg rounded-tl-none mr-auto max-w-[80px] flex items-center justify-center gap-1 border border-zinc-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Options Panel */}
            <div className="p-3 bg-zinc-900 border-t border-[var(--border)]">
              {chatMessages[chatMessages.length - 1]?.options && !isBotTyping && (
                <div className="flex flex-col gap-2">
                  {chatMessages[chatMessages.length - 1].options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleChatOption(opt)}
                      className="w-full py-2 px-3 bg-zinc-950 hover:bg-zinc-800 border border-[var(--border)] hover:border-zinc-700 text-left text-zinc-300 hover:text-[var(--accent)] rounded font-semibold transition-colors text-[11px]"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {(!chatMessages[chatMessages.length - 1]?.options || isBotTyping) && (
                <div className="text-center font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-wider py-1.5">
                  AI Agent is processing...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating WhatsApp Widget */}
      <a
        href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20NeuronFlow%20AI%20automation%20agents."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[999] bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all group flex items-center gap-2 border border-white/10"
        title="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-300 ease-out font-mono text-xs font-bold tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 pl-0 group-hover:pl-1">
          WHATSAPP_LIVE
        </span>
      </a>
    </div>
  );
}
