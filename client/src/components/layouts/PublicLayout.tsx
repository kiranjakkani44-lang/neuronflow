import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../Nav';

const FloatingOnboardingChat: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <a
      href="https://wa.me/917780379949?text=Hi!%20I'm%20interested%20in%20NeuronFlow%20AI%20automation%20agents."
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => setChatOpen(true)}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[999] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white p-3.5 sm:p-4 rounded-full shadow-[0_8px_24px_var(--glow-purple)] transition-all flex items-center gap-2 group"
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
        className="w-5 h-5 sm:w-5 sm:h-5"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-300 font-display text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100">
        Chat now
      </span>
    </a>
  );
};

export default function PublicLayout() {
  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden w-full">
      <Navbar />
      <main className="flex-1 relative z-10 pb-24 sm:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingOnboardingChat />
    </div>
  );
}
