import React, { useEffect, useState } from 'react';
import { Users, Loader2, Search, Shield, Trash2 } from 'lucide-react';
import api from '../../api/client';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  company_name: string | null;
  created_at: string;
  _count: {
    deployments: number;
    subscriptions: number;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users')
      .then(res => { setUsers(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.company_name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-red-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-3xl text-white mb-2">Users</h1>
          <p className="text-gray-400 text-sm">Manage platform users and roles.</p>
        </div>
        <div className="text-sm text-gray-400">{users.length} total users</div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search users by name, email, or company..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-red-400 focus:outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-950">
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">User</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Company</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Role</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Deployments</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Joined</th>
              <th className="p-4 font-mono text-xs text-gray-600 font-normal uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4">
                  <div className="text-sm text-white font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                </td>
                <td className="p-4 text-sm text-gray-400">{user.company_name || '—'}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-bold border ${
                      user.role === 'ADMIN'
                        ? 'bg-red-400/10 text-red-400 border-red-400/30'
                        : 'bg-blue-400/10 text-blue-400 border-blue-400/30'
                    }`}
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-400">{user._count.deployments}</span>
                </td>
                <td className="p-4 text-xs text-gray-500 font-mono">
                  {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    title="Delete user"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 text-sm">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
