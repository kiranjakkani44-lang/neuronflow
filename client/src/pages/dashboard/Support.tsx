import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, Clock, CheckCircle, Send, FileText, Zap } from 'lucide-react';

const faqs = [
  { q: 'How do I deploy an AI agent?', a: 'Go to the Agent Marketplace, select an agent, and click "Deploy". You\'ll be guided through a quick setup process.' },
  { q: 'What happens if I exceed my monthly interactions?', a: "You'll be notified at 80% usage. Additional interactions are billed at ₹0.50 each or you can upgrade your plan." },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes! Cancel anytime from Billing settings. Your access continues until the end of your billing period.' },
  { q: 'How do I contact support?', a: 'Use the chat below, email us at support@neuronflow.com, or schedule a call. Enterprise plans get 24/7 dedicated support.' },
];

export default function Support() {
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: '👋 Hi! I\'m your NeuronFlow assistant. How can I help you today?' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const quickActions = [
    { icon: FileText, label: 'Documentation', desc: 'Browse guides & tutorials' },
    { icon: Zap, label: 'Quick Fixes', desc: 'Common issues resolved' },
    { icon: MessageCircle, label: 'Community', desc: 'Join our Discord' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, { from: 'user', text: chatInput }]);
    const input = chatInput;
    setChatInput('');

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! Let me check that for you...",
        "Great question! Here's what I found...",
        "I've forwarded this to our team. You'll hear back within 2 hours.",
        "You can find detailed info about this in our documentation.",
      ];
      setChatMessages(prev => [
        ...prev,
        { from: 'bot', text: responses[Math.floor(Math.random() * responses.length)] }
      ]);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-syne font-bold text-3xl mb-2">Support</h1>
        <p className="text-[var(--text-muted)] text-sm">Get help from our team or browse common questions.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, i) => (
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

        {/* Live Chat */}
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl flex flex-col" style={{ minHeight: '400px' }}>
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="font-syne font-bold text-lg flex items-center gap-2">
              <MessageCircle size={18} className="text-[var(--accent)]" />
              Chat with Support
              <span className="ml-2 px-2 py-1 bg-[var(--accent2)]/10 text-[var(--accent2)] text-xs font-mono rounded flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--accent2)] animate-pulse" /> Online
              </span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-xl ${
                  msg.from === 'user'
                    ? 'bg-[var(--accent)] text-black'
                    : 'bg-[var(--surface)] border border-[var(--border)]'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-[var(--border)] flex gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Contact Options */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="font-syne font-bold text-lg mb-6">Other Ways to Reach Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
            <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
              <Mail size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <div className="font-medium text-sm">Email Support</div>
              <div className="text-xs text-[var(--text-muted)]">response within 2 hours</div>
              <a href="mailto:support@neuronflow.com" className="text-[var(--accent)] text-sm hover:underline">support@neuronflow.com</a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
            <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
              <Phone size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <div className="font-medium text-sm">Phone Support</div>
              <div className="text-xs text-[var(--text-muted)]">Mon-Fri, 9am-6pm IST</div>
              <span className="text-[var(--accent)] text-sm">+91 98765 43210</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
            <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
              <Clock size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <div className="font-medium text-sm">Schedule a Call</div>
              <div className="text-xs text-[var(--text-muted)]">30-min free consultation</div>
              <button className="text-[var(--accent)] text-sm hover:underline">Book Now →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket History */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="font-syne font-bold text-lg">Recent Tickets</h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {[
            { id: 'TKT-001', subject: 'Agent deployment issue', status: 'Resolved', date: 'May 14' },
            { id: 'TKT-002', subject: 'Billing inquiry', status: 'Resolved', date: 'May 10' },
          ].map(ticket => (
            <div key={ticket.id} className="flex items-center justify-between p-4 hover:bg-[var(--surface)] transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[var(--text-muted)]">{ticket.id}</span>
                <span className="text-sm">{ticket.subject}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--text-muted)]">{ticket.date}</span>
                <span className="px-3 py-1 bg-[var(--accent2)]/10 text-[var(--accent2)] text-xs font-mono rounded flex items-center gap-1">
                  <CheckCircle size={12} /> {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}