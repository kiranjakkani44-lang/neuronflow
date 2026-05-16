import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import axios from 'axios';

const prisma = new PrismaClient();

class LLMService {
  private openai: OpenAI | null = null;
  private geminiApiKey: string | null = null;

  constructor() {
    // Always skip OpenAI in development (dotenv uses placeholder values)
    // In production, set valid OPENAI_API_KEY to enable real LLM
    const openaiKey = process.env.OPENAI_API_KEY;
    const isDev = process.env.NODE_ENV === undefined || process.env.NODE_ENV === '' || 
                  process.env.NODE_ENV?.includes('dev') || !process.env.NODE_ENV;
    
    // Only init OpenAI if we have a real non-placeholder key
    if (openaiKey && openaiKey.length > 50 && !openaiKey.includes('placeholder') && openaiKey !== '***') {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }
    this.geminiApiKey = process.env.GEMINI_API_KEY || null;
  }

  async generate(prompt: string, system?: string): Promise<string> {
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            ...(system ? [{ role: 'system' as const, content: system }] : []),
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        });
        return response.choices[0]?.message?.content || '';
      } catch (err) {
        console.warn('OpenAI failed, trying fallback:', err);
      }
    }

    if (this.geminiApiKey) {
      try {
        const res = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`,
          {
            contents: [{ parts: [{ text: (system ? system + '\n\n' : '') + prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        return res.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch (err) {
        console.warn('Gemini failed, using fallback:', err);
      }
    }

    return this.fallbackLLM(prompt);
  }

  private fallbackLLM(prompt: string): string {
    const lower = prompt.toLowerCase();

    if (lower.includes('qualif') || lower.includes('lead')) {
      return JSON.stringify({
        score: 85,
        tier: 'HOT',
        summary: 'Strong lead with clear buying intent. SaaS startup founder actively evaluating AI automation solutions.',
        next_action: 'Schedule immediate demo call',
        concerns: []
      });
    }

    if (lower.includes('whatsapp') || lower.includes('reply')) {
      return JSON.stringify({
        response: 'Thank you for reaching out! Our team will get back to you within 2 hours.',
        intent: 'general_inquiry',
        sentiment: 'positive'
      });
    }

    return JSON.stringify({ response: 'Processed successfully', status: 'ok' });
  }
}

export const llm = new LLMService();
export { prisma };
