import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const plans = [
  {
    name: 'Starter',
    price: '₹4,999',
    period: '/month',
    description: 'Perfect for small businesses just getting started with AI automation.',
    features: [
      '1 AI Agent Deployment',
      '500 AI Interactions/mo',
      'Email Support',
      'Basic Analytics',
      'WhatsApp Integration'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Growth',
    price: '₹14,999',
    period: '/month',
    description: 'For growing businesses that need more power and flexibility.',
    features: [
      '5 AI Agent Deployments',
      '2,500 AI Interactions/mo',
      'Priority Support',
      'Advanced Analytics',
      'CRM Integration',
      'Voice Agent Support',
      'Custom Workflows'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '₹49,999',
    period: '/month',
    description: 'Full AI automation suite for enterprises with complex needs.',
    features: [
      'Unlimited AI Agents',
      'Unlimited AI Interactions',
      '24/7 Dedicated Support',
      'Custom Analytics Dashboard',
      'API Access',
      'White-label Options',
      'Multi-location Support',
      'Custom Integrations'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function Pricing() {
  const [agents, setAgents] = useState<any[]>([]);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    api.get('/agents').then(res => setAgents(res.data)).catch(console.error);
  }, []);

  const featuredAgents = agents.filter(a => a.is_featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="font-syne font-extrabold text-5xl mb-6">
          Choose Your AI Automation Plan
        </h1>
        <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto mb-10">
          Start free, scale as you grow. No hidden fees, no lock-in. Cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm ${billing === 'monthly' ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>Monthly</span>
          <button
            onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-14 h-7 bg-[var(--surface2)] rounded-full border border-[var(--border)]"
          >
            <div className={`absolute top-1 w-5 h-5 bg-[var(--accent)] rounded-full transition-all ${billing === 'yearly' ? 'left-8' : 'left-1'}`} />
          </button>
          <span className={`text-sm ${billing === 'yearly' ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
            Yearly <span className="text-[var(--accent2)] font-bold">-20%</span>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative bg-[var(--surface2)] border rounded-2xl p-8 ${
                plan.popular
                  ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/20'
                  : 'border-[var(--border)]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--accent)] text-black text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="font-syne font-bold text-xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-syne font-extrabold text-4xl">{plan.price}</span>
                  <span className="text-[var(--text-muted)] text-sm">{plan.period}</span>
                </div>
                <p className="text-[var(--text-muted)] text-sm mt-4">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <span className="text-[var(--accent2)]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.name === 'Enterprise' ? '/contact' : '/register'}
                className={`block text-center py-3 rounded-lg font-bold transition-colors ${
                  plan.popular
                    ? 'bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90'
                    : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* AI Agents Section */}
        <div className="mb-20">
          <h2 className="font-syne font-extrabold text-3xl mb-4">Add AI Agents à la Carte</h2>
          <p className="text-[var(--text-muted)] mb-10">Deploy specific AI agents on top of your plan. Pay only for what you use.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {featuredAgents.map(agent => (
              <div key={agent.id} className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-2xl">🤖</div>
                  <span className="text-[var(--accent2)] text-xs font-mono">+ AGENT</span>
                </div>
                <h3 className="font-syne font-bold text-lg mb-2">{agent.name}</h3>
                <p className="text-[var(--text-muted)] text-sm mb-4">{agent.short_description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <span className="font-syne font-bold">₹{agent.price_one_time.toLocaleString('en-IN')}</span>
                  <Link
                    to={`/agents/${agent.slug}`}
                    className="text-xs font-bold text-[var(--accent)] hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <Link
            to="/agents"
            className="inline-block mt-8 text-[var(--accent)] font-bold hover:underline"
          >
            View all {agents.length} agents →
          </Link>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto text-left">
          <h2 className="font-syne font-extrabold text-3xl mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.'
              },
              {
                q: 'What happens if I exceed my monthly interactions?',
                a: "You'll be notified when you reach 80% of your limit. Additional interactions are billed at ₹0.50 each."
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! All plans come with a 14-day free trial. No credit card required.'
              },
              {
                q: 'Do you offer refunds?',
                a: "We offer a full refund within 30 days if you're not satisfied with our service."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6">
                <h4 className="font-syne font-bold mb-2">{faq.q}</h4>
                <p className="text-[var(--text-muted)] text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent2)]/10 border border-[var(--accent)]/20 rounded-2xl p-12">
          <h2 className="font-syne font-extrabold text-3xl mb-4">Ready to Automate Your Business?</h2>
          <p className="text-[var(--text-muted)] mb-8">Join 500+ businesses already using NeuronFlow AI agents.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="px-8 py-3 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent)]/90 transition-colors">
              Start Free Trial
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-[var(--surface)] border border-[var(--border)] font-bold rounded-lg hover:border-[var(--accent)] transition-colors">
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}