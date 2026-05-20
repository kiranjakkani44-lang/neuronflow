import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Bot, DollarSign, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../../api/client';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/overview')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-[var(--text-muted)]">No analytics data available.</div>;
  }

  const funnelData = [
    { name: 'New', value: data.funnel.new, color: '#6366f1' },
    { name: 'Contacted', value: data.funnel.contacted, color: '#8b5cf6' },
    { name: 'Qualified', value: data.funnel.qualified, color: '#10b981' },
  ];

  const totalFunnel = funnelData.reduce((sum, d) => sum + d.value, 0);
  const conversionRate = totalFunnel > 0 ? ((data.funnel.qualified / totalFunnel) * 100).toFixed(1) : '0';

  const revenueTotal = data.revenue.reduce((sum: number, r: any) => sum + r.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-syne font-bold text-3xl mb-2">Analytics</h1>
        <p className="text-[var(--text-muted)] text-sm">Performance metrics and trends over the last 30 days.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--text-muted)]">Total Revenue</span>
            <DollarSign size={18} className="text-[var(--accent2)]" />
          </div>
          <div className="font-syne font-bold text-2xl">₹{(revenueTotal / 100).toLocaleString()}</div>
          <div className="text-xs text-[var(--accent2)] mt-1 flex items-center gap-1">
            <ArrowUpRight size={12} /> Last 30 days
          </div>
        </div>

        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--text-muted)]">Total Leads</span>
            <Users size={18} className="text-[var(--accent)]" />
          </div>
          <div className="font-syne font-bold text-2xl">{data.funnel.new + data.funnel.contacted + data.funnel.qualified}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Across all stages</div>
        </div>

        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--text-muted)]">Conversion Rate</span>
            <TrendingUp size={18} className="text-[var(--accent3)]" />
          </div>
          <div className="font-syne font-bold text-2xl">{conversionRate}%</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">New → Qualified</div>
        </div>

        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--text-muted)]">Agent Executions</span>
            <Bot size={18} className="text-[var(--accent)]" />
          </div>
          <div className="font-syne font-bold text-2xl">
            {data.agentLogs.reduce((sum: number, l: any) => sum + l.count, 0)}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Last 7 days</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-syne font-bold text-lg mb-4">Leads Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.leadsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="count" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Over Time */}
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-syne font-bold text-lg mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="amount" stroke="var(--accent2)" strokeWidth={2} dot={{ fill: 'var(--accent2)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Funnel */}
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-syne font-bold text-lg mb-4">Lead Conversion Funnel</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={funnelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {funnelData.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[var(--text-muted)]">{item.name}</span>
                  <span className="font-bold text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Log Distribution */}
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-syne font-bold text-lg mb-4">Agent Activity (7 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.agentLogs}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="level" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deployment Status */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="font-syne font-bold text-lg mb-4">Deployment Status</h3>
        <div className="flex gap-6 flex-wrap">
          {data.deploymentsByStatus.map((d: any) => (
            <div key={d.status} className="flex items-center gap-3 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                d.status === 'ACTIVE' ? 'bg-[var(--accent2)]' :
                d.status === 'PAUSED' ? 'bg-yellow-400' :
                d.status === 'PENDING' ? 'bg-blue-400' : 'bg-gray-500'
              }`} />
              <span className="text-sm font-mono text-[var(--text-muted)]">{d.status}</span>
              <span className="font-bold">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
