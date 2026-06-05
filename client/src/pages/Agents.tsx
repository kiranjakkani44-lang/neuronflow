import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const Arrow = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export default function Agents() {
  const [agents, setAgents] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  
  useEffect(() => {
    api.get('/agents').then(res => setAgents(res.data)).catch(console.error);
  }, []);

  const filtered = filter === 'All' ? agents : agents.filter(a => a.category === filter.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-14 sm:py-20 md:py-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 md:gap-6 mb-10 md:mb-12">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-3 tracking-tight">Agent Marketplace</h1>
          <p className="text-[var(--text-muted)] text-sm sm:text-base">Deploy autonomous workers to scale your operations.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto md:max-w-md">
          {['All', 'Voice', 'WhatsApp', 'Automation', 'Marketing', 'Analytics', 'Operations'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`shrink-0 px-3 sm:px-4 py-2 rounded-full text-xs font-display font-medium transition-colors whitespace-nowrap ${filter === t ? 'bg-[var(--accent)] text-white' : 'pill-badge hover:border-[var(--border-bright)]'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map(agent => (
          <div key={agent.id} className="card-base p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between mb-4">
                <div className="text-2xl p-2 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20">🤖</div>
                <span className="pill-badge pill-badge-sm">
                  <span className="live-dot" /> Live
                </span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-white">{agent.name}</h3>
              <p className="text-[var(--text-muted)] text-sm mb-4 min-h-[3.5rem]">{agent.short_description}</p>
              <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent-bright)] p-2.5 rounded text-xs font-mono mb-4">✦ {agent.roi_promise}</div>
            </div>
            <div className="flex items-center justify-center border-t border-[var(--border)] pt-4 mt-auto">
              <Link to={`/agents/${agent.slug}`} className="btn-secondary text-xs">Details <Arrow size={12} /></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
