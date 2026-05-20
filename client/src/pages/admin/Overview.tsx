import React, { useEffect, useState } from 'react';
import { Users, Bot, Activity, ClipboardList, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import api from '../../api/client';

interface PlatformStats {
  users: number;
  agents: number;
  deployments: number;
  leads: number;
  audits: number;
  revenue: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-red-400" size={32} />
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats?.users || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Agents', value: stats?.agents || 0, icon: Bot, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Deployments', value: stats?.deployments || 0, icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Total Leads', value: stats?.leads || 0, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Audit Requests', value: stats?.audits || 0, icon: ClipboardList, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Revenue', value: `₹${((stats?.revenue || 0) / 100).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-syne font-bold text-3xl text-white mb-2">Platform Overview</h1>
        <p className="text-gray-400 text-sm">Real-time metrics and platform health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">{card.label}</span>
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
            <div className={`font-syne font-bold text-3xl ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="font-syne font-bold text-lg text-white mb-4">Quick Actions</h3>
        <div className="flex gap-4 flex-wrap">
          <a href="/admin/users" className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-red-400 hover:text-red-400 transition-colors">
            Manage Users
          </a>
          <a href="/admin/agents" className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-red-400 hover:text-red-400 transition-colors">
            Manage Agents
          </a>
          <a href="/admin/audits" className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-red-400 hover:text-red-400 transition-colors">
            Review Audits
          </a>
        </div>
      </div>
    </div>
  );
}
