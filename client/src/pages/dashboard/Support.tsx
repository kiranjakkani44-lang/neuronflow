import React, { useState, useEffect } from 'react';
import { MessageCircle, Mail, Phone, Clock, CheckCircle, Send, FileText, Zap, Plus, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/client';

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  response: string | null;
  created_at: string;
  updated_at: string;
}

const faqs = [
  { q: 'How do I deploy an AI agent?', a: 'Go to the Agent Marketplace, select an agent, and click "Deploy". You\'ll be guided through a quick setup process.' },
  { q: 'What happens if I exceed my monthly interactions?', a: "You'll be notified at 80% usage. Additional interactions are billed at ₹0.50 each or you can upgrade your plan." },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes! Cancel anytime from Billing settings. Your access continues until the end of your billing period.' },
  { q: 'How do I contact support?', a: 'Use the chat below, email us at support@neuronflow.com, or schedule a call. Enterprise plans get 24/7 dedicated support.' },
];

export default function Support() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    api.get('/tickets')
      .then(res => { setTickets(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/tickets', newTicket);
      setTickets(prev => [data, ...prev]);
      setNewTicket({ subject: '', message: '' });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim()) return;
    try {
      const { data } = await api.post(`/tickets/${ticketId}/reply`, { message: replyText });
      setTickets(prev => prev.map(t => t.id === ticketId ? data : t));
      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-400/10 text-blue-400 border-blue-400/30';
      case 'IN_PROGRESS': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30';
      case 'RESOLVED': return 'bg-green-400/10 text-green-400 border-green-400/30';
      default: return 'bg-gray-800 text-gray-500 border-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-3xl mb-2">Support</h1>
          <p className="text-[var(--text-muted)] text-sm">Get help from our team or browse common questions.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
        >
          <Plus size={16} /> New Ticket
        </button>
      </div>

      {/* New Ticket Form */}
      {showForm && (
        <div className="bg-[var(--surface2)] border border-[var(--accent)]/30 rounded-xl p-8">
          <h2 className="font-syne font-bold text-lg mb-4">Create Support Ticket</h2>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1 uppercase">Subject</label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1 uppercase">Details</label>
              <textarea
                value={newTicket.message}
                onChange={e => setNewTicket({ ...newTicket, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={4}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none resize-none"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] rounded-lg hover:border-[var(--accent)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: FileText, label: 'Documentation', desc: 'Browse guides & tutorials' },
          { icon: Zap, label: 'Quick Fixes', desc: 'Common issues resolved' },
          { icon: MessageCircle, label: 'Community', desc: 'Join our Discord' },
        ].map((action, i) => (
          <button key={i} className="flex items-center gap-4 p-6 bg-[var(--surface2)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-colors text-left">
            <action.icon size={24} className="text-[var(--accent)]" />
            <div>
              <div className="font-syne font-bold">{action.label}</div>
              <div className="text-xs text-[var(--text-muted)]">{action.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAQ */}
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-8">
          <h2 className="font-syne font-bold text-lg mb-6 flex items-center gap-2">
            <FileText size={18} className="text-[var(--accent)]" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <span className="text-[var(--text-muted)] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-[var(--text-muted)] border-t border-[var(--border)] pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div className="space-y-4">
          <h2 className="font-syne font-bold text-lg">Other Ways to Reach Us</h2>
          {[
            { icon: Mail, title: 'Email Support', desc: 'Response within 2 hours', contact: 'support@neuronflow.com', action: 'mailto:support@neuronflow.com' },
            { icon: Phone, title: 'Phone Support', desc: 'Mon-Fri, 9am-6pm IST', contact: '+91 98765 43210', action: 'tel:+919876543210' },
            { icon: Clock, title: 'Schedule a Call', desc: '30-min free consultation', contact: 'Book Now', action: '#' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-[var(--surface2)] border border-[var(--border)] rounded-lg">
              <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <item.icon size={20} className="text-[var(--accent)]" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-[var(--text-muted)]">{item.desc}</div>
              </div>
              <a href={item.action} className="text-[var(--accent)] text-sm hover:underline font-medium">{item.contact}</a>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket History */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="font-syne font-bold text-lg">Your Tickets</h3>
        </div>

        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="animate-spin text-[var(--accent)]" size={24} />
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)]">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">No tickets yet. Click "New Ticket" to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-6 hover:bg-[var(--surface)]/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm">{ticket.subject}</h4>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-bold border ${statusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>

                {ticket.response && (
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 mb-3">
                    <div className="text-xs font-mono text-[var(--accent)] mb-1">Support Response:</div>
                    <p className="text-sm text-[var(--text-muted)]">{ticket.response}</p>
                  </div>
                )}

                {/* Reply section */}
                {replyingTo === ticket.id ? (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
                      onKeyDown={e => { if (e.key === 'Enter') handleReply(ticket.id); }}
                    />
                    <button
                      onClick={() => handleReply(ticket.id)}
                      className="px-3 py-2 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
                    >
                      <Send size={14} />
                    </button>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(''); }}
                      className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                    <button
                      onClick={() => setReplyingTo(ticket.id)}
                      className="text-xs text-[var(--accent)] hover:underline font-medium mt-2"
                    >
                      Reply to this ticket →
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
