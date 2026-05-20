import React, { useEffect, useState } from 'react';
import { Bot, Plus, Edit2, Loader2 } from 'lucide-react';
import api from '../../api/client';

interface Agent {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  category: string;
  price_one_time: number;
  price_monthly: number | null;
  status: string;
  is_featured: boolean;
  sort_order: number;
}

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', short_description: '', description: '', category: '',
    icon_name: 'Bot', price_one_time: 0, price_monthly: null as number | null,
    industries: [] as string[], features: [] as string[], roi_promise: '',
    setup_time_days: 7, is_featured: false, sort_order: 0,
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = () => {
    api.get('/agents')
      .then(res => { setAgents(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const openCreate = () => {
    setForm({
      name: '', slug: '', short_description: '', description: '', category: '',
      icon_name: 'Bot', price_one_time: 0, price_monthly: null,
      industries: [], features: [], roi_promise: '',
      setup_time_days: 7, is_featured: false, sort_order: 0,
    });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (agent: Agent) => {
    setForm({
      name: agent.name, slug: agent.slug, short_description: agent.short_description,
      description: '', category: agent.category, icon_name: 'Bot',
      price_one_time: agent.price_one_time, price_monthly: agent.price_monthly,
      industries: [], features: [], roi_promise: '',
      setup_time_days: 7, is_featured: agent.is_featured, sort_order: agent.sort_order,
    });
    setEditing(agent);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/agents/${editing.id}`, form);
      } else {
        await api.post('/agents', form);
      }
      setShowForm(false);
      fetchAgents();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-3xl text-white mb-2">Agents</h1>
          <p className="text-gray-400 text-sm">Manage the agent marketplace.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-red-400/10 border border-red-400/30 text-red-400 rounded-lg text-sm font-bold hover:bg-red-400/20 transition-colors"
        >
          <Plus size={16} /> Add Agent
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="font-syne font-bold text-xl text-white mb-6">
              {editing ? 'Edit Agent' : 'Create Agent'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-red-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Slug</label>
                  <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-red-400 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Short Description</label>
                <input type="text" value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-red-400 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Category</label>
                  <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-red-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Price (One-time ₹)</label>
                  <input type="number" value={form.price_one_time} onChange={e => setForm({ ...form, price_one_time: parseInt(e.target.value) })} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-red-400 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Monthly Price (₹)</label>
                  <input type="number" value={form.price_monthly || ''} onChange={e => setForm({ ...form, price_monthly: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-red-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Setup Days</label>
                  <input type="number" value={form.setup_time_days} onChange={e => setForm({ ...form, setup_time_days: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-red-400 focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                    className="accent-red-400" /> Featured
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="px-6 py-2 bg-red-400 text-black font-bold rounded-lg hover:bg-red-400/90 transition-colors">
                  {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg hover:border-gray-600 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Agents Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-950">
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Agent</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Category</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Price</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Status</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4">
                  <div className="text-sm text-white font-medium">{agent.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{agent.slug}</div>
                </td>
                <td className="p-4 text-sm text-gray-400">{agent.category}</td>
                <td className="p-4 text-sm text-gray-400">₹{agent.price_one_time.toLocaleString()}{agent.price_monthly ? ` + ₹${agent.price_monthly}/mo` : ''}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                    agent.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400 border-green-400/30' : 'bg-gray-800 text-gray-500 border-gray-700'
                  }`}>{agent.status}</span>
                  {agent.is_featured && <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">FEATURED</span>}
                </td>
                <td className="p-4">
                  <button onClick={() => openEdit(agent)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
