import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class LLMService {
  private baseUrl: string;
  private apiKey: string;
  private model: string;
  private provider: string;

  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'mock';
    this.baseUrl = process.env.LLM_BASE_URL || 'http://localhost:8317/v1';
    this.apiKey = process.env.LLM_API_KEY || '';
    this.model = process.env.LLM_MODEL || 'gemini-3.1-pro-low';
  }

  async generate(prompt: string, system?: string): Promise<string> {
    // If configured to use a real LLM
    if (this.provider === 'openai-compatible' && this.apiKey) {
      try {
        const messages: any[] = [];
        if (system) messages.push({ role: 'system', content: system });
        messages.push({ role: 'user', content: prompt });

        const res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`[LLM] API error (${res.status}):`, errText.substring(0, 200));
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || '';
      } catch (err) {
        console.warn('[LLM] Request failed, falling back to mock:', err);
      }
    }

    return this.mockResponse(prompt);
  }

  private mockResponse(prompt: string): string {
    const lower = prompt.toLowerCase();

    if (lower.includes('qualif') || lower.includes('lead')) {
      const score = Math.floor(Math.random() * 30) + 65;
      const tier = score > 80 ? 'HOT' : score > 65 ? 'WARM' : 'COLD';
      return JSON.stringify({
        score,
        tier,
        summary: `Lead analyzed: ${tier} tier with score ${score}. ${score > 80 ? 'Strong buying intent detected.' : 'Needs further nurturing.'}`,
        next_action: score > 80 ? 'Schedule immediate demo call' : 'Send educational email sequence',
        concerns: []
      });
    }

    if (lower.includes('whatsapp') || lower.includes('reply')) {
      return JSON.stringify({
        response: `Hi there! Thanks for reaching out to NeuronFlow. Our AI team can help automate your sales, support, and operations. How can we assist you today?`,
        intent: 'general_inquiry',
        sentiment: 'positive'
      });
    }

    if (lower.includes('support') || lower.includes('help')) {
      return JSON.stringify({
        category: 'general',
        response: 'Thank you for contacting NeuronFlow Support. A team member will get back to you within 2 hours. For urgent matters, please call our support line.',
        escalate: false
      });
    }

    if (lower.includes('content') || lower.includes('social') || lower.includes('post')) {
      return JSON.stringify({
        content: `🚀 Is your business running on autopilot yet?\n\nAt NeuronFlow, we build AI agents that handle your sales, support, and operations 24/7. No more missed leads. No more manual follow-ups.\n\n👉 Book your free audit today and discover how much revenue AI can recover for your business.\n\n#AIAutomation #BusinessGrowth #NeuronFlow`,
        platform: 'linkedin',
        hashtags: ['#AI', '#Automation', '#BusinessGrowth', '#NeuronFlow']
      });
    }

    if (lower.includes('voice') || lower.includes('call')) {
      return JSON.stringify({
        summary: 'Call handled successfully. Lead showed interest in AI automation services.',
        qualified: Math.random() > 0.4,
        action: 'follow_up_required',
        call_duration: Math.floor(Math.random() * 180) + 60
      });
    }

    if (lower.includes('appointment') || lower.includes('booking')) {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      return JSON.stringify({
        booking_confirmed: true,
        appointment_time: tomorrow,
        customer: prompt.match(/Customer:\s*(\S+)/i)?.[1] || 'Valued Customer',
        service: 'Free Consultation',
        reminder_sent: true
      });
    }

    return JSON.stringify({ response: 'Processed successfully', status: 'ok' });
  }

  // Validate that LLM is configured and reachable
  async checkHealth(): Promise<{ ok: boolean; provider: string; model: string; message: string }> {
    if (this.provider === 'mock') {
      return { ok: true, provider: 'mock', model: 'fallback', message: 'Using mock responses (no real LLM configured)' };
    }

    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (res.ok) {
        return { ok: true, provider: this.provider, model: this.model, message: 'LLM connected' };
      }
      return { ok: false, provider: this.provider, model: this.model, message: `LLM unreachable: ${res.status}` };
    } catch (err) {
      return { ok: false, provider: this.provider, model: this.model, message: `LLM unreachable: ${err}` };
    }
  }
}

export const llm = new LLMService();
export { prisma };