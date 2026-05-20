import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, Bot, ClipboardList, Settings, LogOut, Activity, TrendingUp } from 'lucide-react';
import api from '../../api/client';

const SidebarItem = ({ icon: Icon, label, to }: { icon: any, label: string, to: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${
        isActive
          ? 'bg-red-500/10 text-red-400 border-l-2 border-red-400'
          : 'text-gray-400 hover:text-white hover:bg-gray-800 border-l-2 border-transparent'
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
};

export default function AdminLayout() {
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
      if (res.data.role !== 'ADMIN') {
        navigate('/dashboard', { replace: true });
        return;
      }
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
      await api.post('/auth/logout');
    } catch {
      // proceed
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center font-mono text-red-400">
        VERIFYING_ADMIN_ACCESS...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 bg-gray-900 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link to="/admin" className="flex items-center gap-2">
            <Shield className="text-red-400" size={20} />
            <span className="font-syne font-bold text-xl tracking-tight text-white">Admin<span className="text-red-400">Panel</span></span>
          </Link>
        </div>

        <div className="flex-1 py-6 px-2 flex flex-col gap-1 overflow-y-auto">
          <span className="px-4 text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-2">Administration</span>
          <SidebarItem icon={LayoutDashboard} label="Overview" to="/admin" />
          <SidebarItem icon={Users} label="Users" to="/admin/users" />
          <SidebarItem icon={Bot} label="Agents" to="/admin/agents" />
          <SidebarItem icon={TrendingUp} label="Leads" to="/admin/leads" />
          <SidebarItem icon={ClipboardList} label="Audits" to="/admin/audits" />
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-red-400">
              {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs font-mono text-red-400 truncate">ADMIN</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded text-sm font-medium transition-colors text-gray-400 hover:text-red-400 hover:bg-red-400/5"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-800 bg-gray-900 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-white">Admin Control Center</h1>
            <p className="text-xs text-gray-500 font-mono">Platform Management & Monitoring</p>
          </div>
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Site
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
