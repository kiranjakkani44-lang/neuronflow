import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PublicLayout from './components/layouts/PublicLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import AdminLayout from './components/layouts/AdminLayout';

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
const Analytics = React.lazy(() => import('./pages/dashboard/Analytics'));
const AdminOverview = React.lazy(() => import('./pages/admin/Overview'));
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));
const AdminAgents = React.lazy(() => import('./pages/admin/Agents'));
const AdminAudits = React.lazy(() => import('./pages/admin/Audits'));
const AdminLeads = React.lazy(() => import('./pages/admin/Leads'));

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

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="agents" element={<MyAgents />} />
            <Route path="leads" element={<Leads />} />
            <Route path="agents/:id/logs" element={<AgentLogs />} />
            <Route path="billing" element={<Billing />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/change-password" element={<ChangePassword />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="agents" element={<AdminAgents />} />
            <Route path="audits" element={<AdminAudits />} />
            <Route path="leads" element={<AdminLeads />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
