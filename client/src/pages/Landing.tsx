import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const [activeConsoleIndex, setActiveConsoleIndex] = useState(0);
  const [teamSize, setTeamSize] = useState(12);
  const [hoursWasted, setHoursWasted] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(500);
  const [leadsLost, setLeadsLost] = useState(45);

  const [activeIndustry, setActiveIndustry] = useState('real-estate');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeStack, setActiveStack] = useState('shopify');

  const opsSavings = teamSize * hoursWasted * hourlyCost * 4.33;
  const leadRecovery = leadsLost * 2500;
  const efficiencyGain = teamSize * 3000;
  const totalSavings = Math.round(opsSavings + leadRecovery + efficiencyGain);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConsoleIndex(prev => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const consoleLines = [
    "[VOICE] agents.voice.inbound → on_call(lead_id=3847)",
    "[WHATSAPP] whatsapp.send_followup(batch=312, status=✓)",
    "[AUTOMATION] n8n.trigger(webhook=shopify_order)",
    "[MARKETING] fb_ads.optimize(campaign='summer_sale')",
    "[ANALYTICS] pricing.adjust(sku='x-100', margin=+2.4%)"
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Copy */}
        <div className="flex flex-col items-start z-10">
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-[var(--accent)] mb-8 flex items-center gap-2 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[var(--accent2)] animate-pulse" />
            <span className="font-mono text-xs tracking-wider text-[var(--text)]">18 AI AGENTS RUNNING LIVE</span>
          </div>
          
          <h1 className="font-syne font-extrabold text-5xl lg:text-7xl leading-[1.1] tracking-[-0.03em] mb-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Your Business.</motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]">Running on Autopilot.</motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[var(--text-muted)]">Starting Day 7.</motion.div>
          </h1>
          
          <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-[460px] mb-10 leading-relaxed font-light">
            We build and deploy autonomous AI agents that handle your sales, support, and operations 24/7. Stop trading time for money.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to="/contact" className="px-8 py-4 bg-[var(--accent)] text-black font-bold rounded hover:shadow-[0_0_25px_var(--border-glow)] hover:-translate-y-1 transition-all text-center">
              Book Free Audit →
            </Link>
            <Link to="/agents" className="px-8 py-4 bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] font-semibold rounded hover:bg-white/10 hover:-translate-y-1 transition-all text-center">
              Explore Agents ↓
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 w-full border-t border-[var(--border)] pt-8">
            <div>
              <div className="font-syne font-extrabold text-2xl md:text-3xl text-[var(--text)] mb-1">8,420+</div>
              <div className="font-mono text-[10px] md:text-xs text-[var(--text-dim)] uppercase">Leads Captured</div>
            </div>
            <div>
              <div className="font-syne font-extrabold text-2xl md:text-3xl text-[var(--text)] mb-1">14,500h</div>
              <div className="font-mono text-[10px] md:text-xs text-[var(--text-dim)] uppercase">Hours Saved</div>
            </div>
            <div>
              <div className="font-syne font-extrabold text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] mb-1">₹2.4Cr</div>
              <div className="font-mono text-[10px] md:text-xs text-[var(--text-dim)] uppercase">Value Recovered</div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Console */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-[#050810] rounded-xl border border-[var(--border)] overflow-hidden shadow-2xl z-10"
        >
          {/* Mac Header */}
          <div className="h-10 bg-[#0a101a] border-b border-[var(--border)] flex items-center px-4 justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="font-mono text-[10px] text-[var(--text-dim)]">neuronflow / agent-hub / live</div>
            <div className="status-live animate-pulse">LIVE</div>
          </div>
          
          {/* Agent Rows */}
          <div className="p-2 flex flex-col gap-1">
            {[
              { icon: '🎙️', name: 'Inbound Sales', act: 'Handling Call', status: 'live' },
              { icon: '💬', name: 'WhatsApp Bot', act: 'Replying to FAQs', status: 'busy' },
              { icon: '⚡', name: 'Lead Routing', act: 'Waiting for webhook', status: 'idle' },
              { icon: '🛒', name: 'Cart Recovery', act: 'Sending discounts', status: 'busy' },
              { icon: '📅', name: 'Booking Agent', act: 'Syncing Calendar', status: 'idle' }
            ].map((agent, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded bg-white/[0.02] border transition-colors ${i === activeConsoleIndex ? 'border-[var(--accent2)] bg-[var(--accent2)]/5' : 'border-transparent'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{agent.icon}</span>
                  <div>
                    <div className="font-syne text-sm font-bold text-[var(--text)]">{agent.name}</div>
                    <div className="font-mono text-[10px] text-[var(--text-muted)]">{agent.act}</div>
                  </div>
                </div>
                <div className={`status-${agent.status}`}>{agent.status}</div>
              </div>
            ))}
          </div>
          
          {/* Footer Terminal */}
          <div className="bg-black p-4 border-t border-[var(--border)] font-mono text-xs text-[var(--text-muted)] flex items-center gap-2">
            <span className="text-[var(--accent)]">❯</span>
            <span>{consoleLines[activeConsoleIndex]}</span>
            <span className="w-1.5 h-4 bg-[var(--text)] animate-pulse" />
          </div>
        </motion.div>
      </section>
      
      {/* PAIN POINTS */}
      <section className="w-full bg-[var(--surface)] border-y border-[var(--border)] py-24" id="pain-points">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="font-mono text-xs text-[var(--text-dim)] mb-4 uppercase tracking-widest">// THE_PROBLEM</div>
            <h2 className="font-syne font-extrabold text-3xl md:text-5xl text-[var(--text)] max-w-2xl">Where your business bleeds revenue daily.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: '01 / 03', icon: '🥶', title: 'Leads going cold while you sleep', desc: 'A lead generated at 2 AM expects a response at 2 AM. By 9 AM, theyve already bought from your competitor.', stat: '⚡ 78% of customers buy from whoever responds first' },
              { id: '02 / 03', icon: '⏳', title: '30+ hours wasted on manual tasks', desc: 'Your highly-paid team is copying data between CRMs, sending invoices, and answering the same 5 questions repeatedly.', stat: '📉 Manual data entry costs companies 20-30% in revenue' },
              { id: '03 / 03', icon: '🛒', title: 'Website visitors leaving without buying', desc: '100 people visit your site. 98 leave without doing anything because there was no one to engage them immediately.', stat: '💰 E-commerce loses $18B yearly to abandoned carts' }
            ].map((p, i) => (
              <div key={i} className="bg-[var(--surface2)] border border-[var(--border)] p-8 rounded-xl hover:-translate-y-2 hover:border-[var(--accent3)] transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent3)] to-transparent opacity-50" />
                <div className="font-mono text-[10px] text-[var(--text-dim)] mb-6">{p.id}</div>
                <div className="text-4xl mb-6">{p.icon}</div>
                <h3 className="font-syne font-bold text-xl mb-4">{p.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">{p.desc}</p>
                <div className="bg-[var(--accent3)]/10 text-[var(--accent3)] text-xs font-mono p-3 rounded border border-[var(--accent3)]/20 mt-auto">
                  {p.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* AGENT SHOWCASE / MARKETPLACE */}
      <section className="w-full bg-[var(--surface)] py-24" id="agents">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="font-mono text-xs text-[var(--text-dim)] mb-4 uppercase tracking-widest">// THE_SOLUTION</div>
              <h2 className="font-syne font-extrabold text-3xl md:text-5xl text-[var(--text)]">Hire your AI workforce.</h2>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full">
              {['All', 'Voice', 'WhatsApp', 'Automation', 'Marketing'].map((tab, i) => (
                <button key={i} className={`shrink-0 px-4 py-2 rounded font-mono text-xs whitespace-nowrap transition-colors ${i === 0 ? 'bg-[var(--accent)] text-black font-bold' : 'bg-[var(--surface2)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Agent Card 1 */}
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6 group hover:-translate-y-1 transition-transform relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),rgba(99,202,255,0.08)_0%,transparent_50%)] pointer-events-none" />
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-2xl">🎙️</div>
                <div className="status-live animate-pulse">LIVE</div>
              </div>
              <h3 className="font-syne font-bold text-lg mb-2">AI Voice Agent (Inbound)</h3>
              <p className="text-[var(--text-muted)] text-xs mb-6 min-h-[3rem]">An intelligent voice agent that answers every inbound call, qualifies leads, and transfers them to your CRM.</p>
              
              <div className="bg-[var(--accent2)]/10 border border-[var(--accent2)]/20 p-3 rounded font-mono text-xs text-[var(--accent2)] mb-6">
                ✦ Never miss an inbound call again, 24/7
              </div>
              
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                <div className="font-syne font-bold">₹45,000</div>
                <Link to="/agents/ai-voice-inbound" className="text-xs font-bold px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">Deploy →</Link>
              </div>
            </div>
            
            {/* Agent Card 2 */}
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6 group hover:-translate-y-1 transition-transform relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent2)]/10 text-[var(--accent2)] flex items-center justify-center text-2xl">💬</div>
                <div className="status-live animate-pulse">LIVE</div>
              </div>
              <h3 className="font-syne font-bold text-lg mb-2">WhatsApp Automation</h3>
              <p className="text-[var(--text-muted)] text-xs mb-6 min-h-[3rem]">Engage customers where they already are. Automate FAQs, provide order updates, and capture leads directly through WhatsApp.</p>
              
              <div className="bg-[var(--accent2)]/10 border border-[var(--accent2)]/20 p-3 rounded font-mono text-xs text-[var(--accent2)] mb-6">
                ✦ Reply to every customer in under 60 seconds
              </div>
              
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                <div className="font-syne font-bold">₹35,000</div>
                <Link to="/agents/whatsapp-automation" className="text-xs font-bold px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">Deploy →</Link>
              </div>
            </div>
            
             {/* Agent Card 3 */}
             <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6 group hover:-translate-y-1 transition-transform relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent4)]/10 text-[var(--accent4)] flex items-center justify-center text-2xl">⚡</div>
                <div className="status-live animate-pulse">LIVE</div>
              </div>
              <h3 className="font-syne font-bold text-lg mb-2">AI Lead Qualification</h3>
              <p className="text-[var(--text-muted)] text-xs mb-6 min-h-[3rem]">Stop wasting time on unqualified prospects. This agent engages every new lead, asks qualifying questions, and scores them.</p>
              
              <div className="bg-[var(--accent2)]/10 border border-[var(--accent2)]/20 p-3 rounded font-mono text-xs text-[var(--accent2)] mb-6">
                ✦ Only talk to leads ready to buy
              </div>
              
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                <div className="font-syne font-bold">₹40,000</div>
                <Link to="/agents/lead-qualification" className="text-xs font-bold px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">Deploy →</Link>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/agents" className="inline-block text-sm font-bold text-[var(--text)] border-b border-[var(--accent)] pb-1 hover:text-[var(--accent)] transition-colors">
              View All 18 Agents →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full py-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <div className="font-mono text-xs text-[var(--text-dim)] mb-4 uppercase tracking-widest">// DEPLOYMENT</div>
             <h2 className="font-syne font-extrabold text-3xl md:text-5xl">Live in 30 days. Guaranteed.</h2>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-9 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-20 hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              {[
                { num: 1, title: 'Book Free Audit', desc: 'We analyze your business bottlenecks.', color: 'var(--accent)' },
                { num: 2, title: 'Map Workflows', desc: 'We design the exact AI automation paths.', color: 'var(--accent2)' },
                { num: 3, title: 'Build & Deploy', desc: 'Our engineers build your custom agents.', color: 'var(--accent4)' },
                { num: 4, title: 'See ROI', desc: 'Watch your metrics improve in real-time.', color: 'var(--accent3)' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left group">
                  <div 
                    className="w-18 h-18 rounded-full flex items-center justify-center font-syne font-bold text-2xl mb-6 border-2 transition-transform group-hover:scale-110 bg-[var(--bg)]"
                    style={{ borderColor: step.color, color: step.color, boxShadow: `0 0 20px ${step.color}20` }}
                  >
                    0{step.num}
                  </div>
                  <h3 className="font-syne font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="w-full bg-[var(--surface)] border-y border-[var(--border)] py-24" id="roi">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="font-mono text-xs text-[var(--text-dim)] mb-4 uppercase tracking-widest">// ROI_CALCULATOR</div>
            <h2 className="font-syne font-extrabold text-3xl md:text-5xl mb-8">How much are you losing?</h2>
            
            <div className="flex flex-col gap-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Team Size (People)</span>
                  <span className="font-syne font-bold text-[var(--accent)]">{teamSize}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  className="w-full accent-[var(--accent)] h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Manual Hours Wasted / Week (per person)</span>
                  <span className="font-syne font-bold text-[var(--accent)]">{hoursWasted}h</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={hoursWasted}
                  onChange={(e) => setHoursWasted(parseInt(e.target.value))}
                  className="w-full accent-[var(--accent)] h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Average Hourly Cost (₹)</span>
                  <span className="font-syne font-bold text-[var(--accent)]">₹{hourlyCost}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={hourlyCost}
                  onChange={(e) => setHourlyCost(parseInt(e.target.value))}
                  className="w-full accent-[var(--accent)] h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Leads Lost / Month</span>
                  <span className="font-syne font-bold text-[var(--accent)]">{leadsLost}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={leadsLost}
                  onChange={(e) => setLeadsLost(parseInt(e.target.value))}
                  className="w-full accent-[var(--accent)] h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--surface2)] border border-[var(--accent2)]/30 rounded-xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.05)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent2)]/10 blur-[50px] rounded-full" />
            <div className="font-mono text-xs text-[var(--accent2)] mb-4 tracking-widest">ESTIMATED MONTHLY SAVINGS</div>
            <div className="font-syne font-extrabold text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent2)] to-[var(--accent)] mb-2">
              ₹{totalSavings.toLocaleString('en-IN')}
            </div>
            <div className="text-[var(--text-muted)] text-sm mb-8">per month in recovered value</div>
            
            <div className="flex flex-col gap-3 font-mono text-xs mb-8">
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[var(--text-muted)]">Operations Savings:</span>
                <span>₹{Math.round(opsSavings).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[var(--text-muted)]">Lead Recovery:</span>
                <span>₹{Math.round(leadRecovery).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[var(--text-muted)]">Efficiency Gain:</span>
                <span>₹{Math.round(efficiencyGain).toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <Link
              to={`/contact?savings=${totalSavings}&team=${teamSize}&hours=${hoursWasted}&cost=${hourlyCost}&leads=${leadsLost}`}
              className="block w-full py-4 text-center bg-white/5 border border-[var(--accent2)]/50 text-[var(--accent2)] font-bold rounded hover:bg-[var(--accent2)] hover:text-black transition-colors"
            >
              Lock In These Savings →
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="w-full py-24" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="font-syne font-extrabold text-3xl md:text-5xl mb-4">Simple, transparent pricing.</h2>
             <p className="text-[var(--text-muted)]">One-time setup fee + affordable monthly maintenance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-[var(--surface2)] border border-[var(--border)] p-8 rounded-xl flex flex-col hover:-translate-y-2 transition-transform">
              <h3 className="font-syne font-bold text-xl mb-2">Starter</h3>
              <p className="text-[var(--text-muted)] text-sm h-10">Perfect for small businesses starting their automation journey.</p>
              <div className="my-8">
                <div className="text-3xl font-syne font-bold mb-1">₹4,999<span className="text-sm font-sans text-[var(--text-muted)] font-normal">/mo</span></div>
                <div className="text-xs font-mono text-[var(--text-dim)]">+ ₹14,999 setup fee</div>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-[var(--text-muted)] mb-8 flex-1">
                <li className="flex items-center gap-2"><span className="text-[var(--accent)]">✓</span> 1 Active Agent</li>
                <li className="flex items-center gap-2"><span className="text-[var(--accent)]">✓</span> Standard Support</li>
                <li className="flex items-center gap-2"><span className="text-[var(--accent)]">✓</span> Basic Analytics</li>
                <li className="flex items-center gap-2"><span className="text-[var(--accent)]">✓</span> Email & WhatsApp Logs</li>
              </ul>
              <Link to="/contact" className="block text-center w-full py-3 border border-[var(--border)] rounded font-semibold hover:bg-[var(--surface)] transition-colors">Get Started</Link>
            </div>
            
            {/* Growth */}
            <div className="bg-[#0a101a] border border-[var(--accent)] p-8 rounded-xl flex flex-col relative shadow-[0_0_30px_rgba(99,202,255,0.1)] -translate-y-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-black px-3 py-1 rounded-full text-xs font-bold tracking-wide">MOST POPULAR</div>
              <h3 className="font-syne font-bold text-xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]">Growth</h3>
              <p className="text-[var(--text-muted)] text-sm h-10">For scaling operations needing multiple interconnected agents.</p>
              <div className="my-8">
                <div className="text-3xl font-syne font-bold mb-1">₹14,999<span className="text-sm font-sans text-[var(--text-muted)] font-normal">/mo</span></div>
                <div className="text-xs font-mono text-[var(--text-dim)]">+ ₹49,999 setup fee</div>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-[var(--text-muted)] mb-8 flex-1">
                <li className="flex items-center gap-2"><span className="text-[var(--accent2)]">✓</span> 5 Active Agents</li>
                <li className="flex items-center gap-2"><span className="text-[var(--accent2)]">✓</span> Priority Support (SLA)</li>
                <li className="flex items-center gap-2"><span className="text-[var(--accent2)]">✓</span> Advanced Custom Workflows</li>
                <li className="flex items-center gap-2"><span className="text-[var(--accent2)]">✓</span> CRM Integrations</li>
                <li className="flex items-center gap-2"><span className="text-[var(--accent2)]">✓</span> Custom ROI Dashboards</li>
              </ul>
              <Link to="/contact" className="block text-center w-full py-3 bg-[var(--accent)] text-black rounded font-bold hover:shadow-[0_0_15px_var(--border-glow)] transition-shadow">Deploy Growth Plan</Link>
            </div>
            
            {/* Enterprise */}
            <div className="bg-[var(--surface2)] border border-[var(--border)] p-8 rounded-xl flex flex-col hover:-translate-y-2 transition-transform">
              <h3 className="font-syne font-bold text-xl mb-2">Enterprise</h3>
              <p className="text-[var(--text-muted)] text-sm h-10">Full operational takeover with unlimited custom AI agents.</p>
              <div className="my-8">
                <div className="text-3xl font-syne font-bold mb-1">Custom</div>
                <div className="text-xs font-mono text-[var(--text-dim)]">Custom setup fee</div>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-[var(--text-muted)] mb-8 flex-1">
                <li className="flex items-center gap-2"><span className="text-[var(--text)]">✓</span> Unlimited Agents</li>
                <li className="flex items-center gap-2"><span className="text-[var(--text)]">✓</span> Dedicated Account Manager</li>
                <li className="flex items-center gap-2"><span className="text-[var(--text)]">✓</span> Custom Model Fine-Tuning</li>
                <li className="flex items-center gap-2"><span className="text-[var(--text)]">✓</span> On-Premise Deployment options</li>
              </ul>
              <Link to="/contact" className="block text-center w-full py-3 border border-[var(--border)] rounded font-semibold hover:bg-[var(--surface)] transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES TABS */}
      <section className="w-full py-24 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono text-xs text-[var(--accent)] mb-4 tracking-widest uppercase">// SUCCESS_STORIES</div>
            <h2 className="font-syne font-extrabold text-3xl md:text-5xl mb-4">Proven Real-World Impact</h2>
            <p className="text-[var(--text-muted)]">Select an industry to see how AI agents compare to traditional manual work.</p>

            <div className="flex justify-center gap-3 mt-8 flex-wrap">
              {[
                { id: 'real-estate', label: 'Real Estate' },
                { id: 'clinics', label: 'Healthcare & Clinics' },
                { id: 'ecommerce', label: 'E-commerce & Retail' }
              ].map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(ind.id)}
                  className={`px-6 py-2.5 rounded font-mono text-xs transition-all ${activeIndustry === ind.id ? 'bg-[var(--accent)] text-black font-bold shadow-[0_0_15px_rgba(99,202,255,0.3)]' : 'bg-[var(--surface2)] text-[var(--text-muted)] border border-[var(--border)] hover:text-white'}`}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Before (Manual) */}
            <div className="bg-[var(--surface2)] border border-red-500/20 rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-red-500/10 text-red-400 font-mono text-[10px] uppercase tracking-widest rounded-bl border-l border-b border-red-500/20">MANUAL_FLOW</div>
              <div>
                <h3 className="font-syne font-bold text-xl text-red-400 mb-6">The Old Manual Bottleneck</h3>
                <ul className="space-y-4 font-mono text-xs text-[var(--text-muted)]">
                  {activeIndustry === 'real-estate' && (
                    <>
                      <li className="flex gap-2"><span>✕</span> <span>Inquiries booked manually, average response delay is 6-8 hours</span></li>
                      <li className="flex gap-2"><span>✕</span> <span>Sales reps spend 60% of time cold-calling dead numbers</span></li>
                      <li className="flex gap-2"><span>✕</span> <span>Leads received during night hours are completely lost</span></li>
                    </>
                  )}
                  {activeIndustry === 'clinics' && (
                    <>
                      <li className="flex gap-2"><span>✕</span> <span>Receptionist flooded during rush hours, calls go unanswered</span></li>
                      <li className="flex gap-2"><span>✕</span> <span>No systematic WhatsApp appointment reminders, 25% no-show rate</span></li>
                      <li className="flex gap-2"><span>✕</span> <span>Patient details and symptoms scribbled on paper files</span></li>
                    </>
                  )}
                  {activeIndustry === 'ecommerce' && (
                    <>
                      <li className="flex gap-2"><span>✕</span> <span>Customer queries on WhatsApp answered manually, long queue queues</span></li>
                      <li className="flex gap-2"><span>✕</span> <span>Abandoned carts recovered via batch emails with less than 2% conversion</span></li>
                      <li className="flex gap-2"><span>✕</span> <span>No automated shipping or order tracking updates on chat</span></li>
                    </>
                  )}
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-[var(--border)] font-syne text-sm text-[var(--text-dim)] uppercase tracking-wider">
                Average Cost: <span className="text-red-400 font-bold">₹40,000 - ₹75,000 / month</span>
              </div>
            </div>

            {/* After (NeuronFlow AI) */}
            <div className="bg-[var(--surface2)] border border-[var(--accent2)]/30 rounded-xl p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.03)]">
              <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--accent2)]/10 text-[var(--accent2)] font-mono text-[10px] uppercase tracking-widest rounded-bl border-l border-b border-[var(--accent2)]/20">NEURONFLOW_AI</div>
              <div>
                <h3 className="font-syne font-bold text-xl text-[var(--accent2)] mb-6">AI-Driven Automation</h3>
                <ul className="space-y-4 font-mono text-xs text-[var(--text-muted)]">
                  {activeIndustry === 'real-estate' && (
                    <>
                      <li className="flex gap-2"><span className="text-[var(--accent2)]">✓</span> <span>AI Outbound dialer calls new portal leads within 45 seconds</span></li>
                      <li className="flex gap-2"><span className="text-[var(--accent2)]">✓</span> <span>Only qualified leads with verified budgets are pushed to CRM</span></li>
                      <li className="flex gap-2"><span className="text-[var(--accent2)]">✓</span> <span>24/7 coverage captures out-of-office bookings automatically</span></li>
                    </>
                  )}
                  {activeIndustry === 'clinics' && (
                    <>
                      <li className="flex gap-2"><span className="text-[var(--accent2)]">✓</span> <span>AI receptionist handles unlimited simultaneous calls, never misses</span></li>
                      <li className="flex gap-2"><span className="text-[var(--accent2)]">✓</span> <span>Automated pre-appt WhatsApp forms reduce no-show rate to under 5%</span></li>
                      <li className="flex gap-2"><span className="text-[var(--accent2)]">✓</span> <span>Structured symptoms sent to doctor before patient walks in</span></li>
                    </>
                  )}
                  {activeIndustry === 'ecommerce' && (
                    <>
                      <li className="flex gap-2"><span className="text-[var(--accent2)]">✓</span> <span>WhatsApp AI Agent answers 90% of order & stock FAQs instantly</span></li>
                      <li className="flex gap-2"><span className="text-[var(--accent2)]">✓</span> <span>Instant abandoned cart recovery flows recover 22% of unpaid checkouts</span></li>
                      <li className="flex gap-2"><span className="text-[var(--accent2)]">✓</span> <span>Customers check tracking status dynamically inside chat portal</span></li>
                    </>
                  )}
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-[var(--border)] font-syne text-sm text-[var(--text-dim)] uppercase tracking-wider">
                Average Value: <span className="text-[var(--accent2)] font-bold">18% - 35% revenue recovery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPATIBILITY STACK GRID */}
      <section className="w-full py-24 bg-[var(--bg)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <div className="font-mono text-xs text-[var(--accent)] mb-4 tracking-widest uppercase">// INTEGRATIONS</div>
              <h2 className="font-syne font-extrabold text-3xl md:text-4xl mb-6">Works with Your Current Stack</h2>
              <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed">Our AI agents operate inside the business software you already use. No migration, no data loss, and zero friction.</p>
              <div className="font-mono text-xs text-[var(--text-dim)] uppercase tracking-wider">
                Active Integration: <span className="text-[var(--accent2)] font-bold font-mono">{activeStack.toUpperCase()}</span>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: 'shopify', label: 'Shopify', desc: 'Shopify Store' },
                  { id: 'hubspot', label: 'HubSpot', desc: 'CRM Hub' },
                  { id: 'zoho', label: 'Zoho', desc: 'Zoho CRM' },
                  { id: 'sheets', label: 'Sheets', desc: 'Google Sheets' },
                  { id: 'slack', label: 'Slack', desc: 'Slack Alerting' },
                  { id: 'salesforce', label: 'Salesforce', desc: 'Salesforce CRM' }
                ].map((stack) => (
                  <button
                    key={stack.id}
                    onClick={() => setActiveStack(stack.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${activeStack === stack.id ? 'bg-[var(--surface2)] border-[var(--accent)] shadow-[0_0_15px_rgba(0,188,212,0.15)] scale-105' : 'bg-[var(--surface)] border-[var(--border)] hover:border-zinc-700'}`}
                  >
                    <span className="text-xl font-bold font-syne">
                      {stack.id === 'shopify' ? '🛒' : stack.id === 'hubspot' ? '🧡' : stack.id === 'zoho' ? '💼' : stack.id === 'sheets' ? '📊' : stack.id === 'slack' ? '💬' : '⚡'}
                    </span>
                    <span className="text-[10px] font-mono font-bold tracking-wider">{stack.label}</span>
                  </button>
                ))}
              </div>

              {/* Integration Detail Card */}
              <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-6 flex flex-col justify-between font-mono text-xs">
                <div>
                  <div className="text-[var(--accent)] font-bold mb-3 uppercase tracking-wider font-syne flex items-center gap-2">
                    <span>⚡</span> {activeStack === 'shopify' ? 'Shopify Integration' : activeStack === 'hubspot' ? 'HubSpot CRM Sync' : activeStack === 'zoho' ? 'Zoho Pipeline Automation' : activeStack === 'sheets' ? 'Google Sheets logger' : activeStack === 'slack' ? 'Slack Real-time Alerts' : 'Salesforce Integration'}
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed text-xs">
                    {activeStack === 'shopify' && "Automates WhatsApp checkout recovery sequences instantly upon cart abandonment. Pulls stock details, checks catalog sizes, and logs discount utilization metrics automatically."}
                    {activeStack === 'hubspot' && "Creates contacts automatically when incoming voice calls are answered by AI. Richly populates lead details, records logs, and assigns deal stages without manual sales rep work."}
                    {activeStack === 'zoho' && "Validates client budgets and intent dynamically via outbound dialers. Advancing opportunity stages in Zoho CRM automatically to prompt sales closers."}
                    {activeStack === 'sheets' && "Pushes all structured client symptom surveys, pricing parameters, and transcripts into a central dashboard spreadsheet in real time."}
                    {activeStack === 'slack' && "Alerts channels in real time using Slack bot notifications when hot, high-value leads are captured, so key account managers can step in immediately."}
                    {activeStack === 'salesforce' && "Synchronizes enterprise deals, custom business intelligence fields, and coordinates meeting handoffs to dedicated account executives."}
                  </p>
                </div>
                <div className="border-t border-zinc-800 pt-4 mt-6 text-[10px] text-[var(--text-dim)] uppercase tracking-wider">
                  Deployment complexity: <span className="text-[var(--accent2)]">plug_and_play</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="w-full py-24 bg-[var(--surface)] border-t border-[var(--border)]" id="faq">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono text-xs text-[var(--accent)] mb-4 tracking-widest uppercase">// KNOWLEDGE_BASE</div>
            <h2 className="font-syne font-extrabold text-3xl md:text-5xl">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How long does the setup process take?",
                a: "Our pre-built agents can be fully customized, loaded with your knowledge base, and deployed to your channels (WhatsApp, Web, or Phone) within 5 to 7 business days."
              },
              {
                q: "Which software systems and CRMs do you support?",
                a: "We support integrations out-of-the-box with Zoho CRM, HubSpot, Shopify, Tally, Google Sheets, Salesforce, Slack, and custom REST API endpoints."
              },
              {
                q: "Do I need technical knowledge to manage these agents?",
                a: "Not at all. We handle 100% of the setup, hosting, optimization, and training. Once launched, the agents work entirely in the background, pushing hot leads directly to you."
              },
              {
                q: "Is my customer and business data secure?",
                a: "Absolutely. All communication channels are encrypted end-to-end, and customer details are stored and routed according to industry security best practices to protect your data."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-[var(--border)] rounded-lg bg-[var(--surface2)] overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-syne font-bold text-sm md:text-base flex justify-between items-center hover:text-[var(--accent)] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-[var(--accent)] transition-transform duration-300 font-mono text-lg">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === idx ? 'max-h-[150px] border-t border-[var(--border)]' : 'max-h-0'}`}
                >
                  <p className="p-5 font-mono text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--surface)]">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA SECTION */}
      <section className="w-full py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--accent)] opacity-[0.03] pattern-grid" />
        <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
          <h2 className="font-syne font-extrabold text-4xl md:text-6xl mb-6">Stop losing leads to your competitors.</h2>
          <p className="text-xl text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">Get a custom deployment plan showing exactly which agents will generate the highest ROI for your specific business.</p>
          <Link to="/contact" className="inline-block px-10 py-5 bg-[var(--accent)] text-black font-bold text-lg rounded-lg hover:shadow-[0_0_30px_var(--border-glow)] hover:-translate-y-1 transition-all">
            Book Your Free Audit →
          </Link>
          <p className="mt-4 font-mono text-xs text-[var(--text-dim)] uppercase">No obligation. No pitch. Just clarity.</p>
        </div>
      </section>
    </div>
  );
}
