import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Check, Zap, Loader2 } from 'lucide-react';
import api from '../../api/client';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  current_period_end?: string;
  created_at: string;
}

interface PaymentOrder {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  razorpay_payment_id?: string;
}

const planPrices: Record<string, string> = {
  Starter: '₹4,999',
  Growth: '₹14,999',
  Enterprise: '₹49,999',
};

const planFeatures: Record<string, string[]> = {
  Starter: ['2 Active Agents', 'Email Support', 'Basic Workflows', 'Monthly Reports'],
  Growth: ['5 Active Agents', 'Priority Support', 'Advanced Workflows', 'CRM Integrations', 'Custom Dashboards'],
  Enterprise: ['Unlimited Agents', 'Dedicated Manager', 'Custom Integrations', 'SLA Guarantee', 'White Label'],
};

export default function Billing() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/payments/subscription').catch(() => ({ data: null })),
      api.get('/payments/history').catch(() => ({ data: [] })),
    ]).then(([subRes, payRes]) => {
      setSubscription(subRes.data);
      setPayments(Array.isArray(payRes.data) ? payRes.data : []);
      setLoading(false);
    });
  }, []);

  const handleCreateOrder = async (plan: string) => {
    try {
      const { data } = await api.post('/payments/order', { plan });
      if (data.order_id) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: data.amount,
          currency: data.currency,
          name: 'NeuronFlow',
          description: `${plan} Plan`,
          order_id: data.order_id,
          handler: () => window.location.reload(),
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'Starter';
  const isActive = subscription?.status === 'ACTIVE';
  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No active subscription';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-syne font-bold text-3xl mb-2">Billing</h1>
        <p className="text-[var(--text-muted)] text-sm">Manage your subscription and payment history.</p>
      </div>

      {/* Current Plan */}
      <div className={`bg-[var(--surface2)] border rounded-xl p-8 relative overflow-hidden ${isActive ? 'border-[var(--accent)]/30' : 'border-[var(--border)]'}`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent)]/10 blur-[80px] rounded-full" />
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 font-bold text-xs rounded-full ${isActive ? 'bg-[var(--accent)] text-black' : 'bg-[var(--border)] text-[var(--text-muted)]'}`}>
                {isActive ? 'CURRENT PLAN' : 'NO PLAN'}
              </span>
              <span className={`status-live ${isActive ? 'animate-pulse' : ''}`}>{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
            <h2 className="font-syne font-extrabold text-2xl">{currentPlan}</h2>
          </div>
          <div className="text-right">
            <div className="font-syne font-bold text-2xl">{planPrices[currentPlan] || '₹0'}<span className="text-sm font-sans text-[var(--text-muted)] font-normal">/mo</span></div>
            <div className="font-mono text-[10px] text-[var(--text-dim)]">{isActive ? `Next billing: ${periodEnd}` : periodEnd}</div>
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          {(planFeatures[currentPlan] || planFeatures.Starter).map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Check size={14} className="text-[var(--accent2)]" /> {f}
            </div>
          ))}
        </div>

        {!isActive && (
          <div className="flex gap-3">
            {['Starter', 'Growth', 'Enterprise'].map(plan => (
              <button
                key={plan}
                onClick={() => handleCreateOrder(plan)}
                className="px-4 py-2 bg-[var(--accent)] text-black font-bold text-sm rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
              >
                Choose {plan}
              </button>
            ))}
          </div>
        )}
        {isActive && (
          <Link to="/pricing" className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline font-medium">
            Upgrade Plan → <Zap size={14} />
          </Link>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="font-syne font-bold text-lg">Payment History</h3>
        </div>
        {payments.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)] text-sm">No payment history yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[#050810]">
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Date</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Description</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Amount</th>
                <th className="p-4 font-mono text-xs text-[var(--text-dim)] font-normal uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)]">
                  <td className="p-4 font-mono text-xs text-[var(--text-muted)]">{new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="p-4 text-sm">{row.plan} Plan</td>
                  <td className="p-4 font-syne font-bold">{row.currency === 'INR' ? '₹' : ''}{(row.amount / 100).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`border px-2 py-1 rounded font-mono text-xs ${
                      row.status === 'PAID' ? 'bg-[var(--accent2)]/10 text-[var(--accent2)] border-[var(--accent2)]/30' :
                      row.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                      'bg-[var(--border)] text-[var(--text-muted)] border-[var(--border)]'
                    }`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
