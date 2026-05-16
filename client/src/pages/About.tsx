import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, Zap, Award, Globe, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 lg:py-28 text-center">
        <div className="font-mono text-xs text-[var(--text-dim)] mb-4 uppercase tracking-widest">// ABOUT</div>
        <h1 className="font-syne font-extrabold text-4xl md:text-6xl mb-6">
          We build the agents that run your business.
        </h1>
        <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          NeuronFlow is a team of AI engineers, automation specialists, and growth strategists obsessed with one thing — making businesses run without them.
        </p>
      </section>

      {/* Story */}
      <section className="w-full bg-[var(--surface)] border-y border-[var(--border)] py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="font-mono text-xs text-[var(--text-dim)] mb-4 uppercase tracking-widest">// THE_STORY</div>
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl mb-6">Started because we were tired of the same problems.</h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              We built NeuronFlow after spending years watching businesses lose leads at 2 AM, watch their teams burn out on repetitive tasks, and bleed revenue to competitors who simply responded faster.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              The solution wasn't more hires. It was smarter systems. AI agents that work 24/7, never take a day off, and never make a typo.
            </p>
          </div>
          <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-[var(--accent)]" size={28} />
              <span className="font-syne font-bold text-xl">NeuronFlow</span>
            </div>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-[var(--border)] pb-3">
                <span className="text-[var(--text-muted)]">Founded</span>
                <span className="text-[var(--text)]">2024</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-3">
                <span className="text-[var(--text-muted)]">Team</span>
                <span className="text-[var(--text)]">12 people</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-3">
                <span className="text-[var(--text-muted)]">Headquarters</span>
                <span className="text-[var(--text)]">Mumbai, India</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-3">
                <span className="text-[var(--text-muted)]">Clients</span>
                <span className="text-[var(--text)]">50+ businesses</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Focus</span>
                <span className="text-[var(--accent)]">AI Automation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono text-xs text-[var(--text-dim)] mb-4 uppercase tracking-widest">// VALUES</div>
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl">How we operate.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Customer Obsession', desc: 'Every decision starts with "does this help our clients recover more revenue?" If it doesn\'t, we don\'t do it.' },
              { icon: Zap, title: 'Ship Fast', desc: 'We deploy in 30 days, not 6 months. The fastest ROI is the best ROI.' },
              { icon: Award, title: 'No Junk', desc: 'We don\'t sell AI theater. If a chatbot can solve it, we say so. If a full agent is needed, we build that.' },
              { icon: Globe, title: 'Made for India', desc: 'Built for Indian businesses — regional language support, WhatsApp-first, GST-compliant.' },
              { icon: Heart, title: 'Long-term Partner', desc: 'We don\'t disappear after deployment. We monitor, optimize, and grow with you.' },
              { icon: Activity, title: 'Transparent', desc: 'Clear pricing. Honest timelines. Real ROI metrics. No vanity numbers.' }
            ].map((v, i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl">
                <v.icon className="text-[var(--accent)] mb-4" size={24} />
                <h3 className="font-syne font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-syne font-extrabold text-3xl mb-4">Ready to automate?</h2>
          <p className="text-[var(--text-muted)] mb-8">Book a free audit and we'll map out exactly which agents will recover the most revenue for your business.</p>
          <Link to="/contact" className="inline-block px-8 py-4 bg-[var(--accent)] text-black font-bold rounded hover:shadow-[0_0_25px_var(--border-glow)] hover:-translate-y-1 transition-all">
            Book Free Audit →
          </Link>
        </div>
      </section>
    </div>
  );
}
