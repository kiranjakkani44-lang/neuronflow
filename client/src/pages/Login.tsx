import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const nav = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password: pass });
      const { token, user } = res.data;
      login(user, token);
      localStorage.setItem('user', JSON.stringify(user));
      nav('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-[var(--surface2)] border border-[var(--border)] p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Activity className="text-[var(--accent)]" size={24} />
          <span className="font-syne font-extrabold text-2xl tracking-tight">Neuron<span className="text-[var(--accent)]">Flow</span></span>
        </div>

        <h1 className="font-syne font-bold text-2xl mb-2 text-center">Operations Login</h1>
        <p className="text-[var(--text-muted)] text-sm text-center mb-8">Access your live agent dashboard.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="demo@neuronflow.com" required className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-3 text-sm focus:border-[var(--accent)] outline-none" />
          </div>
          <div>
            <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">PASSWORD</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-3 text-sm focus:border-[var(--accent)] outline-none" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--accent)] text-black font-bold rounded mt-4 hover:shadow-[0_0_15px_var(--border-glow)] transition-shadow disabled:opacity-50">
            {loading ? 'Authenticating...' : 'Initialize Console →'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[var(--border)] pt-6">
          <p className="text-sm text-[var(--text-muted)]">Don't have an account? <Link to="/register" className="text-[var(--accent)] hover:underline">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}