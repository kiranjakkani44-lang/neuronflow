import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, Key, Bell, Shield, Trash2, Check, Loader2 } from 'lucide-react';
import api from '../../api/client';

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    industry: '',
  });
  const [notifications, setNotifications] = useState({
    email_alerts: true,
    sms_alerts: false,
    weekly_report: true,
    agent_updates: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get('/auth/me').then(res => {
      setProfile({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        company_name: res.data.company_name || '',
        industry: res.data.industry || '',
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', {
        name: profile.name,
        phone: profile.phone,
        company_name: profile.company_name,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all data.')) return;
    const confirm2 = window.confirm('This action cannot be undone. Type OK to confirm.');
    if (!confirm2) return;
    setDeleting(true);
    try {
      await api.delete('/auth/account');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Section */}
      <div>
        <h1 className="font-syne font-bold text-3xl mb-2">Settings</h1>
        <p className="text-[var(--text-muted)] text-sm">Manage your account settings and preferences.</p>
      </div>

      {/* Profile */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-black font-bold text-xl">
            {profile.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-syne font-bold">{profile.name || 'User'}</h3>
            <p className="text-xs text-[var(--text-muted)] font-mono">CLIENT</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">
              <User size={12} className="inline mr-1" /> Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">
              <Mail size={12} className="inline mr-1" /> Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm opacity-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">
              <Phone size={12} className="inline mr-1" /> Phone
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">
              <Building size={12} className="inline mr-1" /> Company Name
            </label>
            <input
              type="text"
              value={profile.company_name}
              onChange={e => setProfile({ ...profile, company_name: e.target.value })}
              placeholder="Your Company Ltd"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50"
            >
              {saved ? <><Check size={16} /> Saved!</> : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <Bell size={18} className="text-[var(--accent)]" />
          <h3 className="font-syne font-bold text-lg">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: 'email_alerts', label: 'Email Alerts', desc: 'Receive important updates via email' },
            { key: 'sms_alerts', label: 'SMS Alerts', desc: 'Get urgent notifications via SMS' },
            { key: 'weekly_report', label: 'Weekly Report', desc: 'Receive weekly performance summaries' },
            { key: 'agent_updates', label: 'Agent Updates', desc: 'Notifications about agent activities' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-[var(--text-muted)]">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={18} className="text-[var(--accent)]" />
          <h3 className="font-syne font-bold text-lg">Security</h3>
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard/settings/change-password"
            className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Key size={18} className="text-[var(--text-muted)]" />
              <div>
                <div className="font-medium text-sm">Change Password</div>
                <div className="text-xs text-[var(--text-muted)]">Update your account password</div>
              </div>
            </div>
            <span className="text-[var(--accent)] text-sm">→</span>
          </Link>

          <div className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-[var(--text-muted)]" />
              <div>
                <div className="font-medium text-sm">Two-Factor Authentication</div>
                <div className="text-xs text-[var(--text-muted)]">Add an extra layer of security</div>
              </div>
            </div>
            <span className="px-4 py-2 bg-[var(--accent2)]/10 border border-[var(--accent2)]/30 text-[var(--accent2)] rounded-lg text-xs font-bold">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[var(--surface2)] border border-red-500/30 rounded-xl p-8">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 size={18} className="text-red-500" />
          <h3 className="font-syne font-bold text-lg text-red-500">Danger Zone</h3>
        </div>

        <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg">
          <div>
            <div className="font-medium text-sm">Delete Account</div>
            <div className="text-xs text-[var(--text-muted)]">Permanently delete your account and all data</div>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
