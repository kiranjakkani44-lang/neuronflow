import React, { useEffect, useState } from 'react';
import { Bot, Plus, PlayCircle, PauseCircle, Settings, Activity, Terminal, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function MyAgents() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/deployments').then(res => {
      setDeployments(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handlePause = async (id: number) => {
    try {
      const res = await api.put(`/deployments/${id}`, { status: 'PAUSED' });
      setDeployments(prev => prev.map(d => d.id === id ? { ...d, status: 'PAUSED' } : d));
    } catch (err) {
      console.error('Failed to pause:', err);
    }
  };

  const handleResume = async (id: number) => {
    try {
      const res = await api.put(`/deployments/${id}`, { status: 'LIVE' });
      setDeployments(prev => prev.map(d => d.id === id ? { ...d, status: 'LIVE' } : d));
    } catch (err) {
      console.error('Failed to resume:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this deployment?')) return;
    try {
      await api.delete(`/deployments/${id}`);
      setDeployments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-syne font-bold text-3xl mb-2">My Workforce</h1>
          <p className="text-[var(--text-muted)] text-sm">Manage and monitor your deployed AI agents.</p>
        </div>
        <Link to="/agents" className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-black font-bold text-sm rounded hover:shadow-[0_0_15px_var(--border-glow)]">
          <Plus size={16} /> Deploy New Agent
        </Link>
      </div>

      {loading ? (
        <div className="p-24 text-center font-mono animate-pulse text-[var(--text-muted)]">LOADING_DEPLOYMENTS...</div>
      ) : deployments.length === 0 ? (
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-16 text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="font-syne font-bold text-xl mb-2">No agents deployed yet</h3>
          <p className="text-[var(--text-muted)] text-sm mb-6">Browse our marketplace and deploy your first AI agent to automate your business.</p>
          <Link to="/agents" className="inline-block px-6 py-3 bg-[var(--accent)] text-black font-bold rounded">Browse Marketplace →</Link>
        </div>
      ) : (
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[#050810]">
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Agent</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Status</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Performance</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((dep: any) => {
                const isLive = dep.status === 'LIVE';
                const metrics = JSON.parse(dep.metrics || '{}');

                return (
                  <tr key={dep.id} className="border-b border-[var(--border)] hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-[var(--surface)] border border-[var(--border)]">
                          <Bot size={18} className="text-[var(--accent)]" />
                        </div>
                        <div>
                          <div className="font-syne font-bold text-sm">{dep.agent?.name || 'Agent'}</div>
                          <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">{dep.agent?.category || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={isLive ? 'status-live animate-pulse inline-block' : 'status-idle inline-block'}>{dep.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] text-[var(--text-muted)]">ACTIONS</span>
                          <span className="font-mono text-sm">{metrics.calls || metrics.msgs || 0}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] text-[var(--text-muted)]">HOURS SAVED</span>
                          <span className="font-mono text-sm text-[var(--accent2)]">{metrics.hours_saved || 0}h</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] text-[var(--text-muted)]">DEPLOYED</span>
                          <span className="font-mono text-sm">{dep.deployed_at ? new Date(dep.deployed_at).toLocaleDateString('en-IN') : '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link to={`/dashboard/agents/${dep.id}/logs`} className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded hover:text-[var(--accent)] transition-colors" title="View Logs"><Terminal size={14} /></Link>
                        <button onClick={() => isLive ? handlePause(dep.id) : handleResume(dep.id)} className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded transition-colors" title={isLive ? 'Pause' : 'Resume'}>
                          {isLive ? <PauseCircle size={14} className="text-[var(--accent3)]" /> : <PlayCircle size={14} className="text-[var(--accent2)]" />}
                        </button>
                        <button onClick={() => handleDelete(dep.id)} className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded hover:text-red-400 transition-colors" title="Remove"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}