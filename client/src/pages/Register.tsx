import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', company_name: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        company_name: form.company_name,
        password: form.password
      });
      const { token, user } = res.data;
      login(user, token);
      localStorage.setItem('user', JSON.stringify(user));
      nav('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-lg bg-[var(--surface2)] border border-[var(--border)] p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Activity className="text-[var(--accent)]" size={24} />
          <span className="font-syne font-extrabold text-2xl tracking-tight">Neuron<span className="text-[var(--accent)]">Flow</span></span>
        </div>

        <h1 className="font-syne font-bold text-2xl mb-2 text-center">Create Your Account</h1>
        <p className="text-[var(--text-muted)] text-sm text-center mb-8">Deploy AI agents and automate your business.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">YOUR NAME *</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-3 text-sm focus:border-[var(--accent)] outline-none" />
            </div>
            <div>
              <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">COMPANY NAME *</label>
              <input type="text" required value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="Acme Solutions" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-3 text-sm focus:border-[var(--accent)] outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">EMAIL *</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="rahul@company.com" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-3 text-sm focus:border-[var(--accent)] outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">PASSWORD *</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-3 text-sm focus:border-[var(--accent)] outline-none" />
            </div>
            <div>
              <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">CONFIRM PASSWORD *</label>
              <input type="password" required value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat password" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-3 text-sm focus:border-[var(--accent)] outline-none" />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--accent)] text-black font-bold rounded mt-4 hover:shadow-[0_0_15px_var(--border-glow)] transition-shadow disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">Already have an account? <Link to="/login" className="text-[var(--accent)] hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}