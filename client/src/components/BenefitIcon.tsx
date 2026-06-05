import React from 'react';
import { Star, Zap, Shield, BarChart3, Clock, Users, type LucideIcon } from 'lucide-react';

export const BenefitIcon: React.FC<{ icon: LucideIcon; className?: string }> = ({ icon: Icon, className = '' }) => (
  <div className={`w-12 h-12 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-bright)] ${className}`}>
    <Icon size={22} strokeWidth={1.5} />
  </div>
);

export { Star, Zap, Shield, BarChart3, Clock, Users };
