'use client';
import React from 'react';

interface CassetteTapeProps {
  speed?: 'idle' | 'play' | 'fast';
}

export default function CassetteTape({ speed = 'idle' }: CassetteTapeProps) {
  // Determine animation speed class
  let spinClass = '';
  if (speed === 'play') {
    spinClass = 'animate-[spin_4s_linear_infinite]';
  } else if (speed === 'fast') {
    spinClass = 'animate-[spin_0.8s_linear_infinite]';
  }

  return (
    <div className="relative w-48 h-32 mx-auto flex items-center justify-center bg-transparent select-none">
      {/* Cassette Outer Shell */}
      <svg
        viewBox="0 0 160 100"
        className="w-full h-full drop-shadow-[4px_4px_0px_#1A2340]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer casing */}
        <rect x="5" y="5" width="150" height="90" rx="6" fill="#243054" stroke="#D4A574" strokeWidth="4" />
        {/* Inner sticker background */}
        <rect x="15" y="15" width="130" height="50" rx="3" fill="#D4A574" stroke="#E8C77A" strokeWidth="2" />
        
        {/* Cassette text details */}
        <text x="22" y="30" fill="#1A2340" fontFamily="Press Start 2P" fontSize="6" fontWeight="bold">
          REWIND C90
        </text>
        <text x="120" y="30" fill="#1A2340" fontFamily="Press Start 2P" fontSize="8" fontWeight="bold">
          A
        </text>

        {/* Tape window cutout */}
        <rect x="40" y="38" width="80" height="20" rx="2" fill="#1A2340" stroke="#F4EAD5" strokeWidth="1.5" />
        {/* Tape reels */}
        <g className={spinClass} style={{ transformOrigin: '60px 48px' }}>
          {/* Left Hub */}
          <circle cx="60" cy="48" r="9" fill="#F4EAD5" />
          <circle cx="60" cy="48" r="4" fill="#1A2340" />
          {/* Spikes */}
          <path d="M60 39 V57 M51 48 H69" stroke="#1A2340" strokeWidth="1.5" />
        </g>

        <g className={spinClass} style={{ transformOrigin: '100px 48px' }}>
          {/* Right Hub */}
          <circle cx="100" cy="48" r="9" fill="#F4EAD5" />
          <circle cx="100" cy="48" r="4" fill="#1A2340" />
          {/* Spikes */}
          <path d="M100 39 V57 M91 48 H109" stroke="#1A2340" strokeWidth="1.5" />
        </g>

        {/* Tape lines details */}
        <path d="M30 75 H130 M30 80 H130" stroke="#E8C77A" strokeWidth="1.5" />
        
        {/* Screw holes */}
        <circle cx="10" cy="10" r="1.5" fill="#1A2340" />
        <circle cx="150" cy="10" r="1.5" fill="#1A2340" />
        <circle cx="10" cy="90" r="1.5" fill="#1A2340" />
        <circle cx="150" cy="90" r="1.5" fill="#1A2340" />

        {/* Trailing tape visible in center window */}
        <rect x="52" y="46" width="56" height="4" fill="#E8C77A" opacity="0.6" />
      </svg>
      
      {/* Decorative details */}
      <div className="absolute top-[80px] left-[55px] right-[55px] h-[6px] bg-[#1A2340] border border-[#D4A574]" />
    </div>
  );
}
