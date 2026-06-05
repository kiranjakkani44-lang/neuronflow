import React from 'react';

export const PillBadge: React.FC<{
  children: React.ReactNode;
  size?: 'sm' | 'md';
  variant?: 'default' | 'outline' | 'glow';
  className?: string;
}> = ({ children, size = 'md', variant = 'default', className = '' }) => {
  const sizeCls = size === 'sm' ? 'pill-badge-sm' : '';
  const variantCls = variant === 'outline' ? 'pill-badge-outline' : '';
  return (
    <span className={`pill-badge ${sizeCls} ${variantCls} ${className}`}>
      {children}
    </span>
  );
};

export const SectionEyebrow: React.FC<{ children: React.ReactNode; live?: boolean }> = ({
  children,
  live = false,
}) => (
  <span className="section-eyebrow">
    {live && <span className="live-dot" />}
    {children}
  </span>
);

export const SectionHeader: React.FC<{
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}> = ({ eyebrow, title, subtitle, align = 'center', className = '' }) => {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col ${alignCls} gap-3 sm:gap-4 mb-10 md:mb-16 ${className}`}>
      {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
      <h2 className="section-title text-[clamp(1.75rem,5vw,3.25rem)] max-w-3xl">{title}</h2>
      {subtitle && <p className="section-subtitle text-sm sm:text-base">{subtitle}</p>}
    </div>
  );
};
