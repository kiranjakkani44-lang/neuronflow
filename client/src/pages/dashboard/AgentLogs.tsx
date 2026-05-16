import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';

export default function AgentLogs() {
  const { id } = useParams();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/deployments/${id}/logs`).then(res => {
      setLogs(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/agents" className="font-mono text-xs text-[var(--text-muted)] hover:text-white">← Back to My Agents</Link>
      </div>

      <div>
        <h1 className="font-syne font-bold text-3xl mb-2">Agent Logs</h1>
        <p className="text-[var(--text-muted)] text-sm">Real-time activity logs from your deployed agents.</p>
      </div>

      {loading ? (
        <div className="p-24 text-center font-mono animate-pulse">LOADING_LOGS...</div>
      ) : logs.length === 0 ? (
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-16 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-[var(--text-muted)]">No logs yet. Logs will appear once your agent starts running.</p>
        </div>
      ) : (
        <div className="bg-[#050810] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] bg-[#0a101a] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent2)] animate-pulse" />
            <span className="font-mono text-xs text-[var(--text-dim)]">LIVE LOG STREAM</span>
          </div>
          <div className="p-4 space-y-2 font-mono text-xs max-h-[600px] overflow-y-auto">
            {logs.map((log: any) => (
              <div key={log.id} className="flex gap-4 items-start">
                <span className="text-[var(--text-dim)] shrink-0">{new Date(log.created_at).toLocaleTimeString('en-IN')}</span>
                <span className={`shrink-0 ${
                  log.level === 'ERROR' ? 'text-red-400' :
                  log.level === 'WARN' ? 'text-yellow-400' :
                  log.level === 'INFO' ? 'text-[var(--accent2)]' :
                  'text-[var(--text-muted)]'
                }`}>[{log.level}]</span>
                <span className="text-[var(--text)]">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}