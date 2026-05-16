import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  React.useEffect(() => {
    api.get('/leads').then(res => {
      setLeads(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? leads : leads.filter((l: any) => l.status === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-syne font-bold text-3xl mb-2">Leads</h1>
          <p className="text-[var(--text-muted)] text-sm">All captured leads from your AI agents and forms.</p>
        </div>
        <div className="flex gap-2">
          {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded font-mono text-xs transition-colors ${filter === f ? 'bg-[var(--accent)] text-black font-bold' : 'bg-[var(--surface2)] text-[var(--text-muted)] border border-[var(--border)]'}`}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-24 text-center font-mono animate-pulse">LOADING_LEADS...</div>
      ) : leads.length === 0 ? (
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-16 text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-[var(--text-muted)]">No leads captured yet. Leads will appear here once your agents start running.</p>
        </div>
      ) : (
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[#050810]">
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Name</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Email</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Phone</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Source</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Status</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Captured</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead: any) => (
                <tr key={lead.id} className="border-b border-[var(--border)] hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-syne font-bold text-sm">{lead.name}</td>
                  <td className="p-4 font-mono text-xs text-[var(--text-muted)]">{lead.email}</td>
                  <td className="p-4 font-mono text-xs">{lead.phone || '—'}</td>
                  <td className="p-4 font-mono text-xs text-[var(--text-muted)] uppercase">{lead.source || '—'}</td>
                  <td className="p-4">
                    <span className={`font-mono text-xs px-2 py-1 rounded ${
                      lead.status === 'NEW' ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30' :
                      lead.status === 'QUALIFIED' ? 'bg-[var(--accent2)]/10 text-[var(--accent2)] border border-[var(--accent2)]/30' :
                      lead.status === 'CONVERTED' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                      'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]'
                    }`}>{lead.status}</span>
                  </td>
                  <td className="p-4 font-mono text-xs text-[var(--text-dim)]">{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}