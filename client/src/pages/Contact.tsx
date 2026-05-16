import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', industry: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/audit', form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--surface2)] border border-[var(--accent2)]/30 rounded-xl p-12">
          <div className="text-5xl mb-6">✅</div>
          <h1 className="font-syne font-extrabold text-3xl mb-4">Request Received!</h1>
          <p className="text-[var(--text-muted)] mb-8">Our team will reach out within 24 hours to schedule your free audit call.</p>
          <a href="/" className="inline-block px-6 py-3 bg-[var(--accent)] text-black font-bold rounded">Back to Home</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-mono text-xs text-[var(--text-dim)] mb-4 uppercase tracking-widest">// FREE_AUDIT</div>
        <h1 className="font-syne font-extrabold text-4xl md:text-5xl mb-4">Book Your Free Audit</h1>
        <p className="text-[var(--text-muted)] text-lg mb-12 max-w-xl">Tell us about your business. We'll analyze where AI agents can recover the most revenue and create a custom deployment plan for you.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-mono text-xs text-[var(--text-dim)] mb-2 block uppercase tracking-wider">Your Name *</label>
            <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none transition-colors" placeholder="Rahul Sharma" />
          </div>
          <div>
            <label className="font-mono text-xs text-[var(--text-dim)] mb-2 block uppercase tracking-wider">Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none transition-colors" placeholder="rahul@company.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-mono text-xs text-[var(--text-dim)] mb-2 block uppercase tracking-wider">Phone *</label>
            <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none transition-colors" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="font-mono text-xs text-[var(--text-dim)] mb-2 block uppercase tracking-wider">Company Name *</label>
            <input required type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none transition-colors" placeholder="Acme Solutions Pvt Ltd" />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[var(--text-dim)] mb-2 block uppercase tracking-wider">Industry</label>
          <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none transition-colors">
            <option value="">Select your industry</option>
            <option>E-commerce / Retail</option>
            <option>Healthcare</option>
            <option>Real Estate</option>
            <option>Education / EdTech</option>
            <option>Financial Services</option>
            <option>Manufacturing</option>
            <option>Logistics / Supply Chain</option>
            <option>Professional Services</option>
            <option>Hospitality</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="font-mono text-xs text-[var(--text-dim)] mb-2 block uppercase tracking-wider">What's your biggest challenge? (optional)</label>
          <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-none" placeholder="Tell us about your current bottlenecks, team size, and what you'd like to automate..." />
        </div>

        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 font-mono text-sm">Something went wrong. Please try again or email us directly.</div>
        )}

        <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-[var(--accent)] text-black font-bold text-lg rounded-lg hover:shadow-[0_0_25px_var(--border-glow)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {status === 'loading' ? 'Submitting...' : 'Request Free Audit →'}
        </button>

        <p className="text-center font-mono text-[10px] text-[var(--text-dim)]">No spam. No sales pressure. Just a focused 30-min call to map your automation roadmap.</p>
      </form>
    </div>
  );
}