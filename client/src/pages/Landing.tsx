import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Mic, MessageCircle, Zap, Mail, Calendar, BarChart3, Send, Bot, Code2,
  ArrowUpRight, ArrowRight, Sparkles, Clock, TrendingUp, Shield, Users,
  CheckCircle2, Plus, Minus, ChevronLeft, ChevronRight, Phone, Briefcase,
  Target, Lightbulb, Cog
} from 'lucide-react';
import { Starfield, Nebula } from '../components/Starfield';
import { PillBadge, SectionHeader } from '../components/PillBadge';
import { BenefitIcon } from '../components/BenefitIcon';

/* ============================================
   3D TILT CARD
   ============================================ */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 639px)').matches || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX / rect.width - 0.5);
    y.set(e.clientY / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  if (isMobile) {
    return <div className={className}><div className="w-full h-full">{children}</div></div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: 'preserve-3d' }}
      className={className}
    >
      <div style={{ transform: 'translateZ(30px)' }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

/* ============================================
   ARROW ICON
   ============================================ */
const Arrow: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

/* ============================================
   HERO SECTION
   ============================================ */
const Hero: React.FC = () => (
  <section className="relative w-full overflow-hidden min-h-[80vh] sm:min-h-[92vh] flex items-center">
    {/* Starfield + Nebula background */}
    <div className="absolute inset-0 z-0">
      <Nebula size={900} intensity={0.55} />
      <Starfield density="high" />
    </div>

    <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-20 md:py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-5 sm:gap-6"
      >
        <PillBadge>
          <Sparkles size={12} className="text-[var(--accent-bright)]" />
          New · AI Agents for Indian SMBs
        </PillBadge>

        <h1 className="font-display font-extrabold text-[clamp(2.25rem,7vw,5rem)] leading-[1.05] tracking-[-0.04em] max-w-4xl">
          Intelligent Automation
          <br />
          <span className="text-gradient-purple">for Modern Businesses.</span>
        </h1>

        <p className="text-[var(--text-muted)] text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed px-2">
          NeuronFlow brings AI automation to your fingertips & streamlines tasks —
          from sales to support, running 24/7.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mt-4 w-full sm:w-auto px-4 sm:px-0">
          <Link to="/contact" className="btn-primary btn-lg w-full sm:w-auto justify-center">
            Get in touch
            <Arrow size={16} />
          </Link>
          <a href="#services" className="btn-secondary btn-lg w-full sm:w-auto justify-center">
            View services
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ============================================
   SOCIAL PROOF (Partner logos row)
   ============================================ */
const SocialProof: React.FC = () => {
  const logos = ['Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum'];
  return (
    <section className="py-12 border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-[var(--text-faint)] mb-8">
          Over 50+ businesses trust us
        </p>
        <div className="fade-mask-x flex items-center justify-center gap-12 overflow-hidden">
          {logos.map((l, i) => (
            <span key={i} className="text-xl font-display font-bold text-[var(--text-faint)] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap">
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SERVICES SECTION (Alternating 2-col)
   ============================================ */
const Services: React.FC = () => {
  const services = [
    {
      badge: 'Workflow Automation',
      title: 'Automate repetitive tasks',
      desc: 'We help you streamline internal operations by automating manual workflows like data entry, reporting, and approval chains — saving time and cutting down errors.',
      tags: ['Internal Task Bots', '100+ Automations'],
      mockup: 'tasks',
    },
    {
      badge: 'AI Assistant',
      title: 'Delegate Daily Tasks',
      desc: 'From managing calendars to drafting emails and summarizing meetings, our AI assistants work around the clock to keep your business running smarter and faster.',
      tags: ['Summaries', 'Scheduling', 'Many more'],
      mockup: 'chat',
    },
    {
      badge: 'Sales & Marketing',
      title: 'Accelerate Sales Growth',
      desc: 'AI tools for lead generation, personalized outreach, and automated content creation that scales your sales efforts and builds stronger brand presence.',
      tags: ['Leads', 'Content', 'Social post'],
      mockup: 'sales',
    },
    {
      badge: 'Custom Projects',
      title: 'Build Smarter Systems',
      desc: "Whether you're starting from scratch or enhancing an existing system, we offer strategic consulting and develop custom AI projects aligned with your unique goals.",
      tags: ['Strategy', 'Custom AI', 'Consulting'],
      mockup: 'dashboard',
    },
  ];

  const TaskMockup: React.FC = () => (
    <div className="card-glow p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="pill-badge pill-badge-sm">
          <span className="live-dot" /> Waiting for approval
        </span>
        <span className="text-xs font-mono text-[var(--text-faint)]">5 tasks</span>
      </div>
      <div className="space-y-2">
        {[
          { name: 'Payroll management', meta: 'Due on 2nd July', status: 'pending' },
          { name: 'Employee Tracking', meta: '2 days ago', status: 'done' },
          { name: 'Social media post', meta: 'Cancelled by user', status: 'cancel' },
          { name: 'Lead list', meta: '70% prepared', status: 'progress' },
          { name: 'Payment reminder', meta: 'Sent to clients', status: 'done' },
        ].map((t, i) => (
          <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-black/40 border border-[var(--border)] gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate">{t.name}</div>
              <div className="text-xs text-[var(--text-muted)] truncate">{t.meta}</div>
            </div>
            <div className={`shrink-0 w-2 h-2 rounded-full ${t.status === 'done' ? 'bg-green-500' : t.status === 'progress' ? 'bg-[var(--accent)]' : t.status === 'cancel' ? 'bg-red-500' : 'bg-yellow-500'}`} />
          </div>
        ))}
      </div>
    </div>
  );

  const ChatMockup: React.FC = () => (
    <div className="card-glow p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-glow-bright)] flex items-center justify-center shrink-0">
          <Bot size={18} className="text-white sm:hidden" />
          <Bot size={20} className="text-white hidden sm:block" />
        </div>
        <div>
          <div className="text-sm font-medium text-white">NeuronFlow Assistant</div>
          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <span className="live-dot" /> Always on
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-3 mb-4">
        <div className="bg-black/40 border border-[var(--border)] p-3 rounded-2xl rounded-tl-sm text-sm text-white/90 max-w-[90%]">
          What can I help with? Whether you want help in customer handling or make changes in your system — just give me a command.
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {['Add document', 'Analyze', 'Generate Image', 'Research', 'E-mail Sending', 'LinkedIn', 'IT services'].map((s) => (
            <span key={s} className="pill-badge pill-badge-sm">{s}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 p-3 rounded-xl bg-black/40 border border-[var(--border)]">
        <span className="text-[var(--text-faint)] text-sm">Ask me anything...</span>
      </div>
    </div>
  );

  const SalesMockup: React.FC = () => (
    <div className="card-glow p-4 sm:p-6 h-full">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        {[
          { label: 'Leads', val: '128', trend: '+24%' },
          { label: 'Deals', val: '37', trend: '+12%' },
          { label: 'Revenue', val: '₹4.2L', trend: '+38%' },
        ].map((s, i) => (
          <div key={i} className="p-2.5 sm:p-3 rounded-lg bg-black/40 border border-[var(--border)]">
            <div className="text-[10px] sm:text-xs text-[var(--text-muted)] mb-1">{s.label}</div>
            <div className="text-base sm:text-lg font-display font-bold text-white">{s.val}</div>
            <div className="text-[10px] sm:text-xs text-green-400">{s.trend}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-mono text-[var(--text-faint)] mb-2 uppercase tracking-widest">Recent Activity</div>
      <div className="space-y-2">
        {['New lead from Meta Ads', 'Outreach campaign sent (412)', 'Follow-up scheduled · 3pm'].map((line, i) => (
          <div key={i} className="flex items-center gap-2 p-2.5 rounded bg-black/40 border border-[var(--border)] text-sm">
            <CheckCircle2 size={14} className="text-[var(--accent-bright)]" />
            <span className="text-white/90">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const DashboardMockup: React.FC = () => (
    <div className="card-glow p-4 sm:p-6 h-full">
      <div className="mb-4">
        <div className="text-xs text-[var(--text-muted)] mb-1">Ongoing project</div>
        <div className="text-sm font-display font-bold text-white">Customer Support Chatbot</div>
        <div className="text-xs text-[var(--text-muted)] mt-2">90% Finished</div>
        <div className="mt-2 h-1.5 bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)]" style={{ width: '90%' }} />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mt-4">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-mono text-[var(--text-faint)] py-1">{d}</div>
        ))}
      </div>
      <div className="space-y-2 mt-3">
        {[
          { day: 'Mo', label: 'Discovery call', time: '10:00 – 10:30' },
          { day: 'Tu', label: 'Custom automation', time: '18:00 – 18:30' },
        ].map((e, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-3 p-2.5 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20">
            <div className="text-xs font-mono text-[var(--accent-bright)] shrink-0">{e.day}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{e.label}</div>
              <div className="text-xs text-[var(--text-muted)] truncate">{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const mockups: Record<string, React.FC> = {
    tasks: TaskMockup,
    chat: ChatMockup,
    sales: SalesMockup,
    dashboard: DashboardMockup,
  };

  return (
    <section id="services" className="py-14 md:py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <SectionHeader
          eyebrow="Our Services"
          title={<>AI Solutions That Take Your Business to the <span className="text-gradient-purple-bright">Next Level</span></>}
          subtitle="We design, develop, and implement automation tools that help you work smarter, not harder."
        />

        <div className="space-y-12 md:space-y-20">
          {services.map((s, i) => {
            const Mockup = mockups[s.mockup];
            const isReversed = i % 2 === 1;
            return (
              <div key={i} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start ${isReversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6 }}
                  className={isReversed ? 'lg:order-2' : ''}
                >
                  <TiltCard className="min-h-[380px] sm:min-h-[420px]">
                    <Mockup />
                  </TiltCard>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={isReversed ? 'lg:order-1' : ''}
                >
                  <PillBadge className="mb-6">{s.badge}</PillBadge>
                  <h3 className="font-display font-bold text-3xl md:text-4xl mb-4 tracking-tight">{s.title}</h3>
                  <p className="text-[var(--text-muted)] text-base leading-relaxed mb-6 max-w-md">{s.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <PillBadge key={t} size="sm">{t}</PillBadge>
                    ))}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   PROCESS SECTION
   ============================================ */
const Process: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Smart Analyzing',
      desc: 'We assess your needs and identify AI solutions to streamline workflows and improve efficiency.',
      icon: <Target size={20} />,
    },
    {
      num: '02',
      title: 'AI Development',
      desc: 'Our team builds intelligent automation systems tailored to your business processes.',
      icon: <Code2 size={20} />,
    },
    {
      num: '03',
      title: 'Seamless Integration',
      desc: 'We smoothly integrate AI solutions into your existing infrastructure with minimal disruption.',
      icon: <Cog size={20} />,
    },
    {
      num: '04',
      title: 'Continuous Optimization',
      desc: 'We refine performance, analyze insights, and enhance automation for long-term growth.',
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <section className="py-14 md:py-20 lg:py-32 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <SectionHeader
          eyebrow="Our Process"
          title={<>Our Simple, Smart, and Scalable Process</>}
          subtitle="We design, develop, and implement automation tools that help you work smarter, not harder."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-base p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent-bright)]">
                  {s.icon}
                </div>
                <span className="font-mono text-xs text-[var(--text-faint)]">{s.num}</span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-white">{s.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   BENEFITS SECTION
   ============================================ */
const Benefits: React.FC = () => {
  const benefits = [
    { icon: TrendingUp, title: 'Increased Productivity', desc: 'Gain actionable insights with AI-driven analytics to improve decision-making and strategy.' },
    { icon: Users, title: 'Better Customer Experience', desc: 'Personalized AI interactions improve response times, customer engagement, and overall satisfaction.' },
    { icon: Clock, title: '24/7 Availability', desc: 'AI-powered systems operate around the clock, ensuring seamless support and execution without downtime.' },
    { icon: Shield, title: 'Cost Reduction', desc: 'AI automation minimizes manual work, cuts operational costs, and optimizes resource allocation for better profitability.' },
    { icon: BarChart3, title: 'Data-Driven Insights', desc: 'Leverage AI to analyze vast data sets, identify trends, and make smarter, faster, and more accurate business decisions.' },
    { icon: Sparkles, title: 'Scalability & Growth', desc: 'AI adapts to your business needs, allowing you to scale efficiently without increasing workload or costs.' },
  ];

  return (
    <section className="py-14 md:py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <SectionHeader
          eyebrow="Benefits"
          title={<>The Key Benefits of AI for Your Business Growth</>}
          subtitle="Discover how AI automation enhances efficiency, reduces costs, and drives business growth with smarter, faster processes."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-base p-6 group"
            >
              <BenefitIcon icon={b.icon} className="mb-4 group-hover:scale-105 transition-transform" />
              <h3 className="font-display font-bold text-lg mb-2 text-white">{b.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   PRICING SECTION
   ============================================ */
const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      monthly: 37,
      desc: 'For small businesses getting started with AI automation.',
      cta: 'Choose this plan',
      features: ['Basic workflow automation', 'AI-powered personal assistant', 'Standard analytics & reporting', 'Email & chat support', 'Up to 3 AI integrations'],
      featured: false,
    },
    {
      name: 'Professional',
      monthly: 75,
      desc: 'For growing teams ready to scale sales & marketing.',
      cta: 'Choose this plan',
      features: ['Advanced workflow automation', 'AI-driven sales & marketing tools', 'Enhanced data analytics & insights', 'Priority customer support', 'Up to 10 AI integrations'],
      featured: true,
    },
    {
      name: 'Enterprise',
      monthly: null,
      desc: 'For organisations with custom needs and SLAs.',
      cta: 'Schedule a call',
      features: ['Fully customizable AI automation', 'Dedicated AI business consultant', 'Enterprise-grade compliance', '24/7 VIP support', 'Unlimited AI integrations'],
      featured: false,
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Pricing"
          title={<>The Best AI Automation,<br />at the <span className="text-gradient-purple-bright">Right Price</span></>}
          subtitle="Choose a plan that fits your business needs and start automating with AI."
        />

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-[var(--text-muted)]'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-12 h-6 rounded-full bg-[var(--card)] border border-[var(--border)] transition-colors"
            aria-label="Toggle billing period"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-[var(--accent)] transition-transform ${annual ? 'translate-x-6' : 'translate-x-0.5'}`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-[var(--text-muted)]'}`}>
            Annually <span className="text-[var(--accent-bright)] text-xs">−20%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={p.featured ? 'card-featured p-8' : 'card-base p-8'}
            >
              {p.featured && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)] text-white text-xs font-display font-semibold mb-4">
                  <Sparkles size={12} /> Popular
                </div>
              )}
              <h3 className="font-display font-bold text-xl mb-2 text-white">{p.name}</h3>
              <div className="mb-1">
                {p.monthly === null ? (
                  <span className="font-display font-extrabold text-4xl text-white">Custom</span>
                ) : (
                  <>
                    <span className="font-display font-extrabold text-4xl text-white">
                      ${annual ? Math.round(p.monthly * 0.8) : p.monthly}
                    </span>
                    <span className="text-[var(--text-muted)] text-sm">/month</span>
                  </>
                )}
              </div>
              <div className="divider-fade my-6" />
              <p className="text-sm text-[var(--text-muted)] mb-6">{p.desc}</p>
              <a
                href="/contact"
                className={p.featured ? 'btn-primary w-full mb-6' : 'btn-secondary w-full mb-6'}
              >
                {p.cta}
                <Arrow size={14} />
              </a>
              <div className="text-xs font-mono text-[var(--text-faint)] uppercase tracking-widest mb-3">What's included</div>
              <ul className="space-y-2.5">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <CheckCircle2 size={14} className="text-[var(--accent-bright)] mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   AGENTS SHOWCASE (kept brief, mirrors 18-agent catalog)
   ============================================ */
const AgentsShowcase: React.FC = () => {
  const [active, setActive] = useState(0);

  const agents = [
    { icon: Mic, name: 'AI Voice Agent', desc: 'Answers inbound calls 24/7, qualifies leads, books appointments.', tag: 'Voice' },
    { icon: MessageCircle, name: 'WhatsApp Bot', desc: 'Engage customers where they already are. Automate FAQs, lead capture.', tag: 'Chat' },
    { icon: Zap, name: 'Lead Qualification', desc: 'Engages every new lead, asks qualifying questions, scores them.', tag: 'Automation' },
    { icon: Mail, name: 'Email Automator', desc: 'Drafts contextual replies, filters spam, organizes your inbox.', tag: 'Email' },
    { icon: Calendar, name: 'Booking Agent', desc: 'Syncs calendars, schedules meetings, sends reminders.', tag: 'Voice' },
    { icon: BarChart3, name: 'Analytics Agent', desc: 'Real-time dashboards, anomaly detection, weekly reports.', tag: 'Automation' },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="The Solution"
          title={<>Hire your <span className="text-gradient-purple-bright">AI workforce</span></>}
          subtitle="Pre-built agents that plug into your business in days, not months."
        />

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8 justify-start md:justify-center -mx-5 sm:mx-0 px-5 sm:px-0">
          {['All', 'Voice', 'Chat', 'Email', 'Automation', 'Marketing'].map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-display font-medium transition-colors whitespace-nowrap ${
                i === active
                  ? 'bg-[var(--accent)] text-white'
                  : 'pill-badge hover:border-[var(--border-bright)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {agents.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="card-base p-6 group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent-bright)] group-hover:scale-105 transition-transform">
                    <Icon size={22} />
                  </div>
                  <PillBadge size="sm" variant="outline">
                    <span className="live-dot" />
                    Live
                  </PillBadge>
                </div>
                <h3 className="font-display font-bold text-lg mb-2 text-white">{a.name}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5 min-h-[3.5rem]">{a.desc}</p>
                <Link
                  to="/agents"
                  className="inline-flex items-center gap-1 text-xs font-display font-semibold text-[var(--accent-bright)] hover:text-white transition-colors"
                >
                  Details <ArrowRight size={12} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/agents" className="inline-flex items-center gap-2 text-sm font-display font-semibold text-white border-b border-[var(--accent)] pb-1 hover:text-[var(--accent-bright)] transition-colors">
            View All 18 Agents <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   TESTIMONIALS SECTION
   ============================================ */
const Testimonials: React.FC = () => {
  const reviews = [
    {
      quote: 'AI automation transformed our operations by eliminating repetitive tasks and improving efficiency. Scaling our workflow has never been easier!',
      name: 'James Carter',
      role: 'CEO at TechFlow Solutions',
    },
    {
      quote: 'With AI, we cut manual work and improved accuracy. Our team now focuses on high-impact tasks while automation handles the rest!',
      name: 'Sophia Martinez',
      role: 'Operations Manager at NexaCorp',
    },
    {
      quote: 'AI-driven insights doubled our sales efficiency. We now engage leads at the right time with smarter, data-backed decisions!',
      name: 'David Reynolds',
      role: 'Head of Sales at GrowthPeak',
    },
    {
      quote: 'Customer support is now seamless. Our response time improved drastically, and satisfaction levels are at an all-time high.',
      name: 'Emily Wong',
      role: 'Customer Success Lead at SupportHive',
    },
  ];

  return (
    <section className="py-14 md:py-20 lg:py-32 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <SectionHeader
          eyebrow="Testimonials"
          title={<>Why Businesses <span className="text-gradient-purple-bright">Love</span> Our AI Solutions</>}
          subtitle="Real businesses, real results with AI automation."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-base p-6"
            >
              <div className="flex gap-1 mb-4 text-[var(--accent-bright)]">
                {[...Array(5)].map((_, j) => (
                  <Sparkles key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-base text-white/90 leading-relaxed mb-6">"{r.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-glow-bright)] flex items-center justify-center font-display font-bold text-sm text-white">
                  {r.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-display font-semibold text-white">{r.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   FAQ SECTION
   ============================================ */
const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: 'How can AI automation help my business?', a: 'AI automation helps by reducing manual work, cutting operational costs, improving response times, and scaling your operations 24/7 without adding headcount.' },
    { q: 'Is AI automation difficult to integrate?', a: 'No. Our agents are designed to plug into your existing tools (CRM, WhatsApp, email, voice) with minimal disruption. Most deployments are live in 2–4 weeks.' },
    { q: 'What industries can benefit from AI automation?', a: 'Real estate, e-commerce, healthcare, financial services, education, hospitality, professional services — any business with repetitive workflows or customer conversations at scale.' },
    { q: 'Do I need technical knowledge to use AI automation?', a: 'Not at all. We handle the build, integration, and ongoing optimization. You get a dashboard and clear ROI reports — no engineering required on your side.' },
    { q: 'What kind of support do you offer?', a: 'We provide email, chat, and WhatsApp support on all plans. Professional and Enterprise plans include priority and 24/7 VIP support respectively.' },
  ];

  return (
    <section className="py-14 md:py-20 lg:py-32">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader
          eyebrow="FAQs"
          title={<>We've Got the Answers You're <span className="text-gradient-purple-bright">Looking For</span></>}
          subtitle="Quick answers to your AI automation questions."
        />

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="card-base overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-display font-semibold text-white">{f.q}</span>
                {open === i ? <Minus size={18} className="text-[var(--accent-bright)] shrink-0" /> : <Plus size={18} className="text-[var(--text-muted)] shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-[var(--text-muted)] leading-relaxed">{f.a}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   CTA SECTION
   ============================================ */
const CTA: React.FC = () => (
  <section className="py-14 md:py-20 lg:py-32">
    <div className="max-w-5xl mx-auto px-5 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="card-featured p-10 md:p-16 text-center relative"
      >
        <PillBadge className="mb-6">Get started</PillBadge>
        <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] tracking-tight leading-[1.05] mb-4 max-w-2xl mx-auto">
          Let AI do the Work so you can <span className="text-gradient-purple-bright">Scale Faster</span>
        </h2>
        <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto mb-8">
          Book a call today and start automating.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/contact" className="btn-primary btn-lg">
            Book a free call
            <Arrow size={16} />
          </Link>
          <Link to="/agents" className="btn-secondary btn-lg">
            View agents
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ============================================
   ROOT LANDING PAGE
   ============================================ */
export default function Landing() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <SocialProof />
      <Services />
      <Process />
      <AgentsShowcase />
      <Benefits />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}
