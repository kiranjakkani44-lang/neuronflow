import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

const AgentSimulator = ({ category, name }: { category: string; name: string }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Voice Simulation Transcript
  const voiceTranscript = [
    { speaker: "ai", text: `Hello! Thank you for calling Apollo Clinic. I am your AI Assistant. How can I help you today?` },
    { speaker: "user", text: `Hi! I'd like to book an appointment with Dr. Mehta for tomorrow.` },
    { speaker: "ai", text: `I can certainly help you with that! Dr. Mehta is available tomorrow at 10:00 AM or 2:30 PM. Which one would you prefer?` },
    { speaker: "user", text: `2:30 PM works best.` },
    { speaker: "ai", text: `Great! Could you please tell me your full name and the main reason for your visit?` },
    { speaker: "user", text: `Rahul Sharma, regular consultation.` },
    { speaker: "ai", text: `Perfect, Rahul! I have reserved your slot for 2:30 PM tomorrow with Dr. Mehta. I've also sent a WhatsApp confirmation to this number. Is there anything else?` },
    { speaker: "user", text: `No, that's all. Thank you!` },
    { speaker: "ai", text: `You're welcome, Rahul! Have a wonderful day. Goodbye!` }
  ];

  // WhatsApp Simulation Messages
  const whatsappMessages = [
    { sender: "ai", text: "Hello! Welcome to Apollo Clinic. 🏥 How can we assist you today?\n\n1. Book appointment 🗓️\n2. Clinic timings 🕒\n3. Contact Support 📞" },
    { sender: "user", text: "1. Book appointment" },
    { sender: "ai", text: "Excellent! I can book that for you. Which doctor would you like to see?\n\n- Dr. Mehta (Cardiology)\n- Dr. Patel (Pediatrics)\n- Dr. Sen (General Medicine)" },
    { sender: "user", text: "Dr. Mehta" },
    { sender: "ai", text: "Perfect choice! Dr. Mehta has an open slot tomorrow at 10:00 AM. Does that work for you?" },
    { sender: "user", text: "Yes, it works." },
    { sender: "ai", text: "Great! Please reply with your full name to confirm." },
    { sender: "user", text: "Rahul Sharma" },
    { sender: "ai", text: "Booking confirmed! ✅\n\nAppt: Dr. Mehta\nTime: Tomorrow, 10:00 AM\n\nWe have sent your confirmation card. See you tomorrow!" }
  ];

  // Terminal Automation Simulator Logs
  const automationLogs = [
    `[SYSTEM] Initializing Lead Enrichment Pipeline...`,
    `[INBOUND] Detected web webhook trigger: 'lead_form_submitted'`,
    `[CAPTURE] Extracted data: { name: 'Rahul Sharma', email: 'rahul@propertygroup.in', phone: '9876543210' }`,
    `[ENRICH] Querying Apollo API for domain 'propertygroup.in'...`,
    `[ENRICH] Company found: 'Property Group Ltd' (Real Estate, 15-50 employees, Series A)`,
    `[ANALYZE] Triggering custom AI lead scoring model...`,
    `[SCORE] Category matched: HIGH_INTENT. Raw score: 96/100`,
    `[ACTION] Launching automated WhatsApp introductory sequences...`,
    `[WHATSAPP] Sent message: 'Hi Rahul! Thanks for your inquiry regarding our prime commercial listings...'`,
    `[CRM] Synchronizing contact properties with Salesforce CRM...`,
    `[ROUTING] Pushing Slack alert to #sales-team: ⚡ 'Hot lead: Rahul Sharma (Property Group Ltd) qualified!'`,
    `[SUCCESS] Automation cycle completed in 1.87 seconds. Saved ~40 minutes manual validation.`
  ];

  // Reset simulator when category changes
  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
    setTerminalLogs([]);
  }, [category]);

  const advanceVoice = () => {
    if (step < voiceTranscript.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setStep(prev => prev + 1);
        setIsTyping(false);
      }, 1000);
    } else {
      setStep(0);
    }
  };

  const advanceWhatsApp = () => {
    if (step < whatsappMessages.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setStep(prev => prev + 1);
        setIsTyping(false);
      }, 800);
    } else {
      setStep(0);
    }
  };

  const triggerAutomation = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setTerminalLogs([]);
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < automationLogs.length) {
        setTerminalLogs(prev => [...prev, automationLogs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 600);
  };

  return (
    <div className="mt-12 border border-[var(--border)] bg-[var(--surface)] p-6 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-[40px] pointer-events-none" />
      <h3 className="font-syne font-bold text-xl mb-2 flex items-center gap-2">
        <span className="text-[var(--accent)]">✦</span> Interactive Agent Simulator
      </h3>
      <p className="text-xs text-[var(--text-muted)] font-mono mb-6 uppercase tracking-wider">
        Status: SIMULATION_READY // Category: {category}
      </p>

      {category === "VOICE" && (
        <div className="space-y-4">
          <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-5 min-h-[180px] flex flex-col justify-between font-mono text-xs">
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
              {voiceTranscript.slice(0, step + 1).map((t, idx) => (
                <div key={idx} className={`flex items-start gap-2 ${t.speaker === 'ai' ? 'text-[var(--accent)]' : 'text-white'}`}>
                  <span className="opacity-50 uppercase tracking-widest">{t.speaker === 'ai' ? 'AGENT:' : 'PROSPECT:'}</span>
                  <p>{t.text}</p>
                </div>
              ))}
              {isTyping && (
                <div className="text-[var(--text-dim)] animate-pulse flex items-center gap-1 font-mono uppercase tracking-widest text-[10px]">
                  <span>AI IS TALKING</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-[var(--border)]">
              <button
                onClick={advanceVoice}
                disabled={isTyping}
                className="px-4 py-2 bg-[var(--accent)] text-black rounded font-bold hover:shadow-[0_0_15px_var(--border-glow)] transition-shadow text-[11px]"
              >
                {step === 0 ? "Start Call Simulation" : step === voiceTranscript.length - 1 ? "Restart Simulation" : "Next Conversation Node →"}
              </button>
              {step > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--accent2)] animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent2)]" />
                  <span>SIMULATED VOICE LINE ACTIVE</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {category === "WHATSAPP" && (
        <div className="space-y-4">
          <div className="max-w-[340px] mx-auto bg-black border-4 border-zinc-800 rounded-[28px] overflow-hidden shadow-2xl relative">
            <div className="h-10 bg-zinc-900 px-4 flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)] border-b border-zinc-800">
              <span>9:41 AM</span>
              <span className="text-[var(--accent2)]">● WHATSAPP_LIVE</span>
            </div>
            
            <div className="p-4 bg-zinc-950 min-h-[320px] max-h-[380px] overflow-y-auto space-y-3 font-sans text-xs flex flex-col justify-end">
              {whatsappMessages.slice(0, step + 1).map((m, idx) => (
                <div key={idx} className={`max-w-[80%] p-3 rounded-lg ${m.sender === 'ai' ? 'bg-zinc-800 text-white mr-auto rounded-tl-none' : 'bg-[var(--accent2)]/10 text-[var(--accent2)] border border-[var(--accent2)]/20 ml-auto rounded-tr-none'}`}>
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                </div>
              ))}
              {isTyping && (
                <div className="bg-zinc-800 text-[var(--text-dim)] p-2 rounded-lg rounded-tl-none mr-auto max-w-[80px] flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex justify-center">
              <button
                onClick={advanceWhatsApp}
                disabled={isTyping}
                className="w-full py-2 bg-[var(--accent2)] text-black rounded font-bold hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-shadow text-[11px] text-center"
              >
                {step === 0 ? "Simulate WhatsApp Chat" : step === whatsappMessages.length - 1 ? "Reset Chat" : "Reply To Agent →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {category !== "VOICE" && category !== "WHATSAPP" && (
        <div className="space-y-4">
          <div className="bg-black border border-[var(--border)] rounded-lg p-4 min-h-[200px] font-mono text-[11px] text-zinc-300 flex flex-col justify-between">
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
              {terminalLogs.length === 0 ? (
                <span className="text-[var(--text-dim)]">// Logs are empty. Click "Trigger Workflow Pipeline" to run the agent live simulation.</span>
              ) : (
                terminalLogs.map((log, idx) => {
                  let colorClass = "text-zinc-300";
                  if (log.includes("[INBOUND]")) colorClass = "text-cyan-400";
                  if (log.includes("[SCORE]")) colorClass = "text-amber-400";
                  if (log.includes("[ACTION]") || log.includes("[WHATSAPP]")) colorClass = "text-[var(--accent2)]";
                  if (log.includes("[SUCCESS]")) colorClass = "text-[var(--accent)] font-bold";
                  return <div key={idx} className={colorClass}>{log}</div>;
                })
              )}
              {isPlaying && (
                <div className="text-[var(--accent)] animate-pulse flex items-center gap-1.5 text-[10px] mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                  <span>AGENT PROCESSING...</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center">
              <button
                onClick={triggerAutomation}
                disabled={isPlaying}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-[var(--accent)] border border-[var(--accent)]/30 rounded font-bold text-[11px] disabled:opacity-50"
              >
                {isPlaying ? "Simulating Workflow..." : "Trigger Workflow Pipeline"}
              </button>
              {isPlaying && (
                <span className="text-[10px] text-[var(--text-dim)]">Execution speed: 120ms / cycle</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AgentDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/agents/${slug}`).then(res => {
      setAgent(res.data);
      setLoading(false);
    });
  }, [slug]);

  const handleDeploy = () => {
    if (agent) {
      navigate(`/contact?agent=${encodeURIComponent(agent.name)}`);
    } else {
      navigate('/contact');
    }
  };

  if (loading) return <div className="p-24 text-center font-mono animate-pulse">LOADING_AGENT_DATA...</div>;
  if (!agent) return <div className="p-24 text-center font-mono text-red-500">AGENT_NOT_FOUND</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <Link to="/agents" className="text-[var(--text-muted)] hover:text-white font-mono text-xs mb-8 inline-block">← Back to Marketplace</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 rounded font-mono text-xs">{agent.category}</span>
            <span className="status-live animate-pulse">READY TO DEPLOY</span>
          </div>
          <h1 className="font-syne font-extrabold text-4xl mb-4">{agent.name}</h1>
          <p className="text-[var(--text-muted)] text-lg mb-8 leading-relaxed">{agent.description}</p>

          <div className="bg-[var(--surface2)] border border-[var(--accent2)]/30 p-6 rounded-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent2)]/10 blur-[50px]" />
            <h3 className="font-mono text-xs text-[var(--text-dim)] mb-2 uppercase tracking-wider">ROI Guarantee</h3>
            <p className="font-syne font-bold text-xl text-[var(--accent2)]">{agent.roi_promise}</p>
          </div>

          <h3 className="font-syne font-bold text-xl mb-4">Core Capabilities</h3>
          <ul className="space-y-4 mb-10">
            {(agent.features || []).map((f: any, i: number) => (
              <li key={i} className="flex gap-4 p-4 border border-[var(--border)] rounded-lg bg-[var(--surface2)]">
                <div className="text-[var(--accent)] mt-1">✓</div>
                <div>
                  <div className="font-bold text-sm mb-1">{f.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          {/* Interactive Agent Simulator */}
          <AgentSimulator category={agent.category} name={agent.name} />
        </div>

        <div>
          <div className="sticky top-24 bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-8">
            <h3 className="font-mono text-xs text-[var(--text-dim)] mb-2 tracking-widest">DEPLOYMENT COST</h3>
            <div className="font-syne font-extrabold text-5xl mb-2">₹{agent.price_one_time.toLocaleString('en-IN')}</div>
            <div className="text-[var(--text-muted)] text-sm border-b border-[var(--border)] pb-6 mb-6">One-time setup fee</div>

            <ul className="space-y-3 mb-8 text-sm text-[var(--text-muted)]">
              <li className="flex justify-between"><span>Setup Time</span><span className="text-white font-mono">{agent.setup_time_days} days</span></li>
              <li className="flex justify-between"><span>Maintenance</span><span className="text-white font-mono">from ₹4,999/mo</span></li>
              <li className="flex justify-between"><span>Compute</span><span className="text-white font-mono">Billed at cost</span></li>
            </ul>

            <button
              onClick={handleDeploy}
              className="block text-center w-full py-4 bg-[var(--accent)] text-black font-bold rounded hover:shadow-[0_0_20px_var(--border-glow)] transition-all mb-4"
            >
              Deploy This Agent →
            </button>

            <p className="text-center font-mono text-[10px] text-[var(--text-dim)]">Requires consultation to verify systems compatibility.</p>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <p className="text-center font-mono text-[10px] text-[var(--text-dim)] mb-3">Or book a free audit first:</p>
              <Link to="/contact" className="block text-center w-full py-3 bg-[var(--surface)] border border-[var(--border)] rounded font-semibold hover:bg-[var(--surface2)] transition-colors text-sm">
                Book Free Audit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}