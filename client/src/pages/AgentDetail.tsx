import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function AgentDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    api.get(`/agents/${slug}`).then(res => {
      setAgent(res.data);
      setLoading(false);
    });
  }, [slug]);

  const handleDeploy = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setDeploying(true);
    try {
      await api.post('/deployments', { agent_id: agent.id });
      navigate('/dashboard/agents');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to deploy. Please try again.');
      setDeploying(false);
    }
  };

  if (loading) return <div className="p-24 text-center font-mono animate-pulse">LOADING_AGENT_DATA...</div>;
  if (!agent) return <div className="p-24 text-center font-mono text-red-500">AGENT_NOT_FOUND</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <Link to="/agents" className="text-[var(--text-muted)] hover:text-white font-mono text-xs mb-8 inline-block">← Back to Marketplace</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 rounded font-mono text-xs">{agent.category}</span>
            <span className="status-live animate-pulse">READY TO DEPLOY</span>
          </div>
          <h1 className="font-syne font-extrabold text-4xl mb-4">{agent.name}</h1>
          <p className="text-[var(--text-muted)] text-lg mb-8 leading-relaxed">{agent.description}</p>

          <div className="bg-[var(--surface2)] border border-[var(--accent2)]/30 p-6 rounded-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent2)]/10 blur-[50px]" />
            <h3 className="font-mono text-xs text-[var(--text-dim)] mb-2 uppercase tracking-wider">ROI Guarantee</h3>
            <p className="font-syne font-bold text-xl text-[var(--accent2)]">{agent.roi_promise}</p>
          </div>

          <h3 className="font-syne font-bold text-xl mb-4">Core Capabilities</h3>
          <ul className="space-y-4">
            {(agent.features || []).map((f: any, i: number) => (
              <li key={i} className="flex gap-4 p-4 border border-[var(--border)] rounded-lg bg-[var(--surface2)]">
                <div className="text-[var(--accent)] mt-1">✓</div>
                <div>
                  <div className="font-bold text-sm mb-1">{f.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="sticky top-24 bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-8">
            <h3 className="font-mono text-xs text-[var(--text-dim)] mb-2 tracking-widest">DEPLOYMENT COST</h3>
            <div className="font-syne font-extrabold text-5xl mb-2">₹{agent.price_one_time.toLocaleString('en-IN')}</div>
            <div className="text-[var(--text-muted)] text-sm border-b border-[var(--border)] pb-6 mb-6">One-time setup fee</div>

            <ul className="space-y-3 mb-8 text-sm text-[var(--text-muted)]">
              <li className="flex justify-between"><span>Setup Time</span><span className="text-white font-mono">{agent.setup_time_days} days</span></li>
              <li className="flex justify-between"><span>Maintenance</span><span className="text-white font-mono">from ₹4,999/mo</span></li>
              <li className="flex justify-between"><span>Compute</span><span className="text-white font-mono">Billed at cost</span></li>
            </ul>

            <button
              onClick={handleDeploy}
              disabled={deploying}
              className="block text-center w-full py-4 bg-[var(--accent)] text-black font-bold rounded hover:shadow-[0_0_20px_var(--border-glow)] transition-all mb-4 disabled:opacity-50"
            >
              {deploying ? 'Deploying...' : 'Deploy This Agent →'}
            </button>

            <p className="text-center font-mono text-[10px] text-[var(--text-dim)]">Requires consultation to verify systems compatibility.</p>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <p className="text-center font-mono text-[10px] text-[var(--text-dim)] mb-3">Or book a free audit first:</p>
              <Link to="/contact" className="block text-center w-full py-3 bg-[var(--surface)] border border-[var(--border)] rounded font-semibold hover:bg-[var(--surface2)] transition-colors text-sm">
                Book Free Audit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}