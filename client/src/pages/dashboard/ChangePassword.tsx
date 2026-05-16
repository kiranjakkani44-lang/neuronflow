import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Check, X } from 'lucide-react';

export default function ChangePassword() {
  const [form, setForm] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const requirements = [
    { label: 'At least 8 characters', met: form.new.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(form.new) },
    { label: 'One number', met: /\d/.test(form.new) },
    { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(form.new) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.new !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    if (!requirements.every(r => r.met)) {
      setError('Password does not meet requirements');
      return;
    }

    setSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setSuccess(true);
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link
        to="/dashboard/settings"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Settings
      </Link>

      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
            <Lock className="text-[var(--accent)]" size={20} />
          </div>
          <div>
            <h1 className="font-syne font-bold text-2xl">Change Password</h1>
            <p className="text-xs text-[var(--text-muted)]">Update your account password</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--accent2)]/10 flex items-center justify-center mx-auto mb-4">
              <Check className="text-[var(--accent2)]" size={32} />
            </div>
            <h2 className="font-syne font-bold text-xl mb-2">Password Updated!</h2>
            <p className="text-[var(--text-muted)] text-sm mb-6">Your password has been successfully changed.</p>
            <Link
              to="/dashboard/settings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
            >
              Back to Settings
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                Current Password
              </label>
              <input
                type="password"
                value={form.current}
                onChange={e => setForm({ ...form, current: e.target.value })}
                required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                value={form.new}
                onChange={e => setForm({ ...form, new: e.target.value })}
                required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
                placeholder="Enter new password"
              />
              <div className="mt-3 space-y-2">
                {requirements.map((req, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs ${req.met ? 'text-[var(--accent2)]' : 'text-[var(--text-dim)]'}`}>
                    {req.met ? <Check size={12} /> : <X size={12} />}
                    {req.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
                placeholder="Confirm new password"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}