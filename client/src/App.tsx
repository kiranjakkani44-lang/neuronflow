import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import PublicLayout from './components/layouts/PublicLayout';

// ScrollToTop Component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Lazy Loaded Pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Agents = React.lazy(() => import('./pages/Agents'));
const AgentDetail = React.lazy(() => import('./pages/AgentDetail'));

const Contact = React.lazy(() => import('./pages/Contact'));
const About = React.lazy(() => import('./pages/About'));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center font-mono text-[var(--accent)]">LOADING_SYSTEM...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/:slug" element={<AgentDetail />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
