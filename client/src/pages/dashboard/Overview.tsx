import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Users, MessageCircle, PhoneCall, Clock, IndianRupee, Bot, Settings, PlayCircle, PauseCircle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import api from '../../api/client';

const sparklineData = Array.from({ length: 15 }, () => ({ value: Math.floor(Math.random() * 50) + 10 }));
const sparklineDataUp = Array.from({ length: 15 }, (_, i) => ({ value: i * 5 + Math.floor(Math.random() * 20) }));

const MetricCard = ({ title, value, delta, isUp, icon: Icon, colorClass, borderClass, showSparkline = false }: any) => {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const isCurrency = value.includes('₹');
  const isHour = value.includes('h');

  useEffect(() => {
    if (targetValue === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const duration = 1500;
    const increment = targetValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [targetValue]);

  const displayValue = isCurrency
    ? `₹${count.toLocaleString('en-IN')}`
    : isHour
      ? `${count}h`
      : count.toLocaleString('en-IN');

  return (
    <div className={`bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-5 hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col justify-between h-36`}>
      <div className="flex justify-between items-start z-10">
        <div className={`p-2 rounded ${colorClass.replace('text-', 'bg-')} ${colorClass}`}>
          <Icon size={18} />
        </div>
        {delta && (
          <div className={`flex items-center gap-1 font-mono text-[10px] ${isUp ? 'text-[var(--accent2)]' : 'text-[var(--accent3)]'}`}>
            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {delta}
          </div>
        )}
      </div>
      <div className="z-10 mt-2">
        <h3 className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{title}</h3>
        <div className="font-syne font-extrabold text-3xl">{displayValue}</div>
      </div>
      {showSparkline && (
        <div className="absolute bottom-0 left-0 w-full h-12 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={isUp ? sparklineDataUp : sparklineData}>
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
              <Area type="monotone" dataKey="value" stroke="none" fill={isUp ? 'var(--accent2)' : 'var(--accent)'} fillOpacity={1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default function Overview() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/deployments').then(res => {
      setDeployments(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const liveCount = deployments.filter(d => d.status === 'LIVE').length;
  const totalActions = deployments.reduce((acc: number, d: any) => {
    const m = JSON.parse(d.metrics || '{}');
    return acc + (m.calls || m.msgs || 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Active Agents" value={String(liveCount || 0)} delta={liveCount > 0 ? `${liveCount} deployed` : undefined} isUp={true} icon={Bot} colorClass="text-[var(--accent)]" borderClass="border-[var(--accent)]" />
        <MetricCard title="Total Deployments" value={String(deployments.length || 0)} delta={deployments.length > 0 ? `${deployments.length} agents` : undefined} isUp={true} icon={Activity} colorClass="text-[var(--accent2)]" borderClass="border-[var(--accent2)]" />
        <MetricCard title="Lifetime Actions" value={totalActions.toLocaleString('en-IN') || '0'} delta="across all agents" isUp={true} icon={PhoneCall} colorClass="text-[var(--text)]" borderClass="border-[var(--text-muted)]" />
      </div>

      {/* Live Agents Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-bold text-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent2)] animate-pulse" />
            My Deployed Agents
          </h2>
          <Link to="/dashboard/agents" className="font-mono text-xs text-[var(--accent)] hover:underline">Manage All →</Link>
        </div>

        {loading ? (
          <div className="p-16 text-center font-mono animate-pulse text-[var(--text-muted)]">LOADING_DEPLOYMENTS...</div>
        ) : deployments.length === 0 ? (
          <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-16 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-syne font-bold text-xl mb-2">No agents deployed yet</h3>
            <p className="text-[var(--text-muted)] text-sm mb-6">Browse the marketplace and deploy your first AI agent to get started.</p>
            <Link to="/agents" className="inline-block px-6 py-3 bg-[var(--accent)] text-black font-bold rounded hover:shadow-[0_0_15px_var(--border-glow)]">Browse Agent Marketplace →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {deployments.slice(0, 3).map((dep: any, i: number) => {
              const isLive = dep.status === 'LIVE';
              const metrics = JSON.parse(dep.metrics || '{}');

              return (
                <div key={i} className={`bg-[var(--surface2)] border rounded-xl overflow-hidden flex flex-col relative ${isLive ? 'border-[var(--accent2)]/30 shadow-[0_0_15px_rgba(0,255,136,0.05)]' : 'border-[var(--border)]'}`}>
                  <div className="p-4 border-b border-[var(--border)] flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${isLive ? 'bg-[var(--accent2)]/10 text-[var(--accent2)]' : 'bg-[var(--surface)] text-[var(--text-muted)]'}`}>
                        <Bot size={18} />
                      </div>
                      <div>
                        <div className="font-syne font-bold text-sm">{dep.agent?.name || 'Agent'}</div>
                        <div className="font-mono text-[10px] text-[var(--text-dim)] uppercase">{dep.agent?.category || '—'}</div>
                      </div>
                    </div>
                    <span className={isLive ? 'status-live animate-pulse' : 'status-idle'}>{dep.status}</span>
                  </div>

                  <div className="p-4 bg-[#050810] flex-1">
                    <div className="font-mono text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-dim)]">Actions</span>
                        <span className="text-[var(--text)]">{metrics.calls || metrics.msgs || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-dim)]">Hours Saved</span>
                        <span className="text-[var(--accent2)]">{metrics.hours_saved || 0}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-dim)]">Deployed</span>
                        <span className="text-[var(--text-muted)]">{dep.deployed_at ? new Date(dep.deployed_at).toLocaleDateString('en-IN') : 'Pending'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between">
                    <Link to={`/dashboard/agents/${dep.id}/logs`} className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1">
                      <Settings size={14} /> Logs
                    </Link>
                    <button className="text-xs font-medium flex items-center gap-1 text-[var(--accent3)] hover:text-red-400">
                      {isLive ? <><PauseCircle size={14} /> Pause</> : <><PlayCircle size={14} /> Resume</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}