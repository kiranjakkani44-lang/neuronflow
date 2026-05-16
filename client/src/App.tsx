import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layouts/PublicLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Auth guard for admin route
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminLayout = () => (
  <div className="flex h-screen bg-gray-900">
    <div className="w-64 border-r border-gray-700 bg-gray-800 p-4">Admin Sidebar</div>
    <div className="flex-1 flex flex-col">
      <div className="h-16 border-b border-gray-700 bg-gray-800 p-4">Admin TopBar</div>
      <div className="p-6 flex-1 overflow-auto"><Outlet /></div>
    </div>
  </div>
);

// Lazy Loaded Pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Agents = React.lazy(() => import('./pages/Agents'));
const AgentDetail = React.lazy(() => import('./pages/AgentDetail'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Contact = React.lazy(() => import('./pages/Contact'));
const About = React.lazy(() => import('./pages/About'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const DashboardOverview = React.lazy(() => import('./pages/dashboard/Overview'));
const MyAgents = React.lazy(() => import('./pages/dashboard/MyAgents'));
const Leads = React.lazy(() => import('./pages/dashboard/Leads'));
const AgentLogs = React.lazy(() => import('./pages/dashboard/AgentLogs'));
const Billing = React.lazy(() => import('./pages/dashboard/Billing'));
const Settings = React.lazy(() => import('./pages/dashboard/Settings'));
const ChangePassword = React.lazy(() => import('./pages/dashboard/ChangePassword'));
const Support = React.lazy(() => import('./pages/dashboard/Support'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center font-mono text-[var(--accent)]">LOADING_SYSTEM...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/:slug" element={<AgentDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Dashboard Routes (auth-protected via DashboardLayout) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="agents" element={<MyAgents />} />
            <Route path="leads" element={<Leads />} />
            <Route path="agents/:id/logs" element={<AgentLogs />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/change-password" element={<ChangePassword />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Admin Routes (placeholder - requires auth) */}
          <Route path="/admin" element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }}>
            <Route index element={<div>Admin Area</div>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}