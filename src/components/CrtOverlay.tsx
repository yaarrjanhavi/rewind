'use strict';
import React from 'react';

interface CrtOverlayProps {
  children: React.ReactNode;
  enabled: boolean;
}

export default function CrtOverlay({ children, enabled }: CrtOverlayProps) {
  if (!enabled) return <div className="min-h-screen bg-[#1A2340] text-[#F4EAD5] font-mono">{children}</div>;

  return (
    <div className="relative min-h-screen bg-[#1A2340] text-[#F4EAD5] font-mono overflow-hidden select-none">
      {/* CRT curvature frame */}
      <div className="crt-screen pointer-events-none absolute inset-0 z-50 pointer-events-none border-[12px] border-[#0A0E1A] rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]" />

      {/* Screen Glare and Curvature Glass Reflection */}
      <div className="pointer-events-none absolute inset-0 z-40 bg-radial-gradient from-transparent to-black/35 opacity-40 mix-blend-overlay" />

      {/* Moving Scanlines */}
      <div className="pointer-events-none absolute inset-0 z-45 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] opacity-90 animate-scanline" />

      {/* Screen Flicker Effect */}
      <div className="pointer-events-none absolute inset-0 z-40 bg-[rgba(212,165,116,0.015)] opacity-95 animate-flicker" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full min-h-screen p-4 flex flex-col md:p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
