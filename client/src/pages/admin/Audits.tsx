import React, { useEffect, useState } from 'react';
import { ClipboardList, Loader2, Check, X } from 'lucide-react';
import api from '../../api/client';

interface Audit {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  message: string | null;
  status: string;
  created_at: string;
}

export default function AdminAudits() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/audit')
      .then(res => { setAudits(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/audit/${id}`, { status });
      setAudits(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-red-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-syne font-bold text-3xl text-white mb-2">Audit Requests</h1>
        <p className="text-gray-400 text-sm">Review and manage AI readiness audit requests.</p>
      </div>

      {/* Audit Cards */}
      <div className="space-y-4">
        {audits.map(audit => (
          <div key={audit.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-medium">{audit.name}</h3>
                <p className="text-sm text-gray-500">{audit.company} · {audit.industry}</p>
                <p className="text-xs text-gray-600 font-mono mt-1">{audit.email} · {audit.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded text-xs font-bold border ${
                  audit.status === 'NEW' ? 'bg-blue-400/10 text-blue-400 border-blue-400/30' :
                  audit.status === 'CONTACTED' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30' :
                  audit.status === 'COMPLETED' ? 'bg-green-400/10 text-green-400 border-green-400/30' :
                  'bg-gray-800 text-gray-500 border-gray-700'
                }`}>{audit.status}</span>
                <span className="text-xs text-gray-600 font-mono">
                  {new Date(audit.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            {audit.message && (
              <p className="text-sm text-gray-400 bg-gray-800/50 rounded-lg p-3 mb-4">{audit.message}</p>
            )}

            <div className="flex gap-2">
              {audit.status === 'NEW' && (
                <>
                  <button onClick={() => updateStatus(audit.id, 'CONTACTED')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-400/10 border border-blue-400/30 text-blue-400 rounded text-xs font-bold hover:bg-blue-400/20">
                    <Check size={14} /> Mark Contacted
                  </button>
                  <button onClick={() => updateStatus(audit.id, 'COMPLETED')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-400/10 border border-green-400/30 text-green-400 rounded text-xs font-bold hover:bg-green-400/20">
                    <Check size={14} /> Mark Completed
                  </button>
                </>
              )}
              {audit.status === 'CONTACTED' && (
                <button onClick={() => updateStatus(audit.id, 'COMPLETED')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-400/10 border border-green-400/30 text-green-400 rounded text-xs font-bold hover:bg-green-400/20">
                  <Check size={14} /> Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
        {audits.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-500">
            No audit requests yet.
          </div>
        )}
      </div>
    </div>
  );
}
