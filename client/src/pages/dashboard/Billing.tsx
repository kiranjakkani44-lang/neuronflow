import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Check, Zap } from 'lucide-react';

export default function Billing() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-syne font-bold text-3xl mb-2">Billing</h1>
        <p className="text-[var(--text-muted)] text-sm">Manage your subscription and payment methods.</p>
      </div>

      {/* Current Plan */}
      <div className="bg-[var(--surface2)] border border-[var(--accent)]/30 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent)]/10 blur-[80px] rounded-full" />
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-[var(--accent)] text-black font-bold text-xs rounded-full">CURRENT PLAN</span>
              <span className="status-live animate-pulse">ACTIVE</span>
            </div>
            <h2 className="font-syne font-extrabold text-2xl">Growth</h2>
          </div>
          <div className="text-right">
            <div className="font-syne font-bold text-2xl">₹14,999<span className="text-sm font-sans text-[var(--text-muted)] font-normal">/mo</span></div>
            <div className="font-mono text-[10px] text-[var(--text-dim)]">Next billing: Jun 15, 2026</div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          {['5 Active Agents', 'Priority Support', 'Advanced Workflows', 'CRM Integrations', 'Custom Dashboards'].map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Check size={14} className="text-[var(--accent2)]" /> {f}
            </div>
          ))}
        </div>

        <Link to="/pricing" className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline font-medium">
          Upgrade Plan → <Zap size={14} />
        </Link>
      </div>

      {/* Payment History */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="font-syne font-bold text-lg">Payment History</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[#050810]">
              <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Date</th>
              <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Description</th>
              <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Amount</th>
              <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Status</th>
              <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: 'May 15, 2026', desc: 'Growth Plan - Monthly', amount: '₹14,999', status: 'PAID' },
              { date: 'Apr 15, 2026', desc: 'Growth Plan - Monthly', amount: '₹14,999', status: 'PAID' },
              { date: 'Mar 15, 2026', desc: 'Growth Plan - Monthly', amount: '₹14,999', status: 'PAID' },
            ].map((row, i) => (
              <tr key={i} className="border-b border-[var(--border)]">
                <td className="p-4 font-mono text-xs text-[var(--text-muted)]">{row.date}</td>
                <td className="p-4 text-sm">{row.desc}</td>
                <td className="p-4 font-syne font-bold">{row.amount}</td>
                <td className="p-4"><span className="bg-[var(--accent2)]/10 text-[var(--accent2)] border border-[var(--accent2)]/30 px-2 py-1 rounded font-mono text-xs">{row.status}</span></td>
                <td className="p-4"><button className="font-mono text-xs text-[var(--accent)] hover:underline">↓ PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Method */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-syne font-bold text-lg flex items-center gap-2"><CreditCard size={18} /> Payment Method</h3>
          <button className="text-xs font-medium text-[var(--accent)] hover:underline">+ Add New</button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
          <div>
            <div className="font-mono text-sm">•••• •••• •••• 4242</div>
            <div className="text-xs text-[var(--text-muted)]">Expires 12/27</div>
          </div>
          <div className="ml-auto"><span className="bg-[var(--accent2)]/10 text-[var(--accent2)] border border-[var(--accent2)]/30 px-2 py-1 rounded font-mono text-xs">DEFAULT</span></div>
        </div>
      </div>
    </div>
  );
}