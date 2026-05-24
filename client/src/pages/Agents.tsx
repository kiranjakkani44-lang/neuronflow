import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Agents() {
  const [agents, setAgents] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  
  useEffect(() => {
    api.get('/agents').then(res => setAgents(res.data)).catch(console.error);
  }, []);

  const filtered = filter === 'All' ? agents : agents.filter(a => a.category === filter.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="font-syne font-extrabold text-4xl mb-4">Agent Marketplace</h1>
          <p className="text-[var(--text-muted)]">Deploy autonomous workers to scale your operations.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full max-w-full">
          {['All', 'Voice', 'WhatsApp', 'Automation', 'Marketing', 'Analytics', 'Operations'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`shrink-0 px-4 py-2 rounded text-xs font-mono transition-colors whitespace-nowrap ${filter === t ? 'bg-[var(--accent)] text-black font-bold' : 'bg-[var(--surface2)] text-[var(--text-muted)] border border-[var(--border)]'}`}>{t}</button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(agent => (
          <div key={agent.id} className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6 hover:-translate-y-1 transition-transform flex flex-col justify-between">
            <div>
              <div className="flex justify-between mb-4">
                <div className="text-2xl p-2 bg-white/5 rounded border border-[var(--border)]">🤖</div>
                <div className="status-live">AVAILABLE</div>
              </div>
              <h3 className="font-syne font-bold text-lg mb-2">{agent.name}</h3>
              <p className="text-[var(--text-muted)] text-sm mb-4 min-h-[4rem]">{agent.short_description}</p>
              <div className="bg-[var(--accent2)]/10 text-[var(--accent2)] p-2 rounded text-xs font-mono mb-4">✦ {agent.roi_promise}</div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-auto">
              <span className="font-syne font-bold">₹{agent.price_one_time.toLocaleString('en-IN')}</span>
              <Link to={`/agents/${agent.slug}`} className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-black rounded text-xs font-bold transition-colors">Details →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
