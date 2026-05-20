import React, { useEffect, useState } from 'react';
import { Users, Loader2, Search, ArrowLeftRight } from 'lucide-react';
import api from '../../api/client';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  industry: string | null;
  status: string;
  source: string | null;
  user_id: string | null;
  created_at: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [reassigning, setReassigning] = useState<string | null>(null);
  const [newOwnerId, setNewOwnerId] = useState('');

  useEffect(() => {
    fetchLeads();
    api.get('/admin/users').then(res => setUsers(res.data)).catch(() => {});
  }, [page, statusFilter]);

  const fetchLeads = () => {
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);
    
    api.get(`/admin/leads?${params}`)
      .then(res => {
        setLeads(res.data.leads);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleReassign = async (leadId: string) => {
    if (!newOwnerId) return;
    try {
      await api.put(`/admin/leads/${leadId}/owner`, { user_id: newOwnerId });
      setReassigning(null);
      setNewOwnerId('');
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.company || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-400/10 text-blue-400 border-blue-400/30';
      case 'CONTACTED': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30';
      case 'QUALIFIED': return 'bg-green-400/10 text-green-400 border-green-400/30';
      default: return 'bg-gray-800 text-gray-500 border-gray-700';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-3xl text-white mb-2">Leads</h1>
          <p className="text-gray-400 text-sm">Manage leads across all users.</p>
        </div>
        <div className="text-sm text-gray-400">{total} total leads</div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-red-400 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:border-red-400 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-950">
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Lead</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Company</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Status</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Source</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Created</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(lead => (
              <tr key={lead.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4">
                  <div className="text-sm text-white font-medium">{lead.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{lead.email}</div>
                </td>
                <td className="p-4 text-sm text-gray-400">{lead.company || '—'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${statusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-500 font-mono">{lead.source || '—'}</td>
                <td className="p-4 text-xs text-gray-500 font-mono">
                  {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td className="p-4">
                  {reassigning === lead.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={newOwnerId}
                        onChange={e => setNewOwnerId(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                      >
                        <option value="">Select user...</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                      <button onClick={() => handleReassign(lead.id)} className="text-xs text-green-400 hover:underline">Save</button>
                      <button onClick={() => { setReassigning(null); setNewOwnerId(''); }} className="text-xs text-gray-500 hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReassigning(lead.id)}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      title="Reassign lead"
                    >
                      <ArrowLeftRight size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 text-sm">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-gray-400 disabled:opacity-50 hover:border-red-400 hover:text-red-400 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-gray-400 disabled:opacity-50 hover:border-red-400 hover:text-red-400 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
