import React from 'react';

export const Starfield: React.FC<{ density?: 'low' | 'medium' | 'high' }> = ({ density = 'medium' }) => {
  // Generate a random starfield once per mount
  const stars = React.useMemo(() => {
    const count = density === 'low' ? 60 : density === 'high' ? 200 : 120;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.7 + 0.2,
    }));
  }, [density]);

  return (
    <div className="starfield">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,${s.opacity * 0.6})`,
          }}
        />
      ))}
    </div>
  );
};

export const Nebula: React.FC<{ size?: number; intensity?: number }> = ({ size = 800, intensity = 0.5 }) => (
  <div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      background:
        'radial-gradient(ellipse at center, rgba(223,122,254,0.6) 0%, rgba(129,74,200,0.4) 30%, transparent 70%)',
      filter: 'blur(60px)',
      opacity: intensity,
    }}
  />
);
