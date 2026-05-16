import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Bot, Users, CreditCard, Settings, HelpCircle, Bell, LogOut } from 'lucide-react';
import api from '../../api/client';

const SidebarItem = ({ icon: Icon, label, to }: { icon: any, label: string, to: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${
        isActive
          ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-l-2 border-[var(--accent)]'
          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)] border-l-2 border-transparent'
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    api.get('/auth/me').then(res => {
      setUser(res.data);
      setLoading(false);
    }).catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
      }
    } catch (err) {
      // Proceed with local logout even if server call fails
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center font-mono text-[var(--accent)]">
        VERIFYING_ACCESS...
      </div>
    );
  }

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="text-[var(--accent)]" size={20} />
            <span className="font-syne font-bold text-xl tracking-tight">Neuron<span className="text-[var(--accent)]">Flow</span></span>
          </Link>
        </div>

        <div className="flex-1 py-6 px-2 flex flex-col gap-1 overflow-y-auto">
          <span className="px-4 text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider mb-2">Operations Center</span>
          <SidebarItem icon={LayoutDashboard} label="Overview" to="/dashboard" />
          <SidebarItem icon={Bot} label="My Agents" to="/dashboard/agents" />
          <SidebarItem icon={Users} label="Leads" to="/dashboard/leads" />

          <span className="px-4 text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider mt-6 mb-2">Account</span>
          <SidebarItem icon={CreditCard} label="Billing" to="/dashboard/billing" />
          <SidebarItem icon={Settings} label="Settings" to="/dashboard/settings" />
          <SidebarItem icon={HelpCircle} label="Support" to="/dashboard/support" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/5 border-l-2 border-transparent mt-auto"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center font-bold text-[var(--accent)]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--text)] truncate">{user?.name || 'User'}</p>
              <p className="text-xs font-mono text-[var(--accent)] truncate">{user?.company_name || user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] px-8 flex items-center justify-between z-10">
          <div>
            <h1 className="text-lg font-medium text-[var(--text)]">{greeting}, {user?.name?.split(' ')[0] || 'there'}</h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-2 font-mono text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--accent2)] animate-pulse" /> Agents Running: —</span>
              <span className="text-[var(--border)]">|</span>
              <span>Leads Today: —</span>
              <span className="text-[var(--border)]">|</span>
              <span className="text-[var(--accent)]">Hours Saved: —</span>
            </div>

            <button className="relative text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[var(--accent3)]" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}