'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function VinylPlayer() {
  const [isHovered, setIsHovered] = useState(false);
  const [bounceCount, setBounceCount] = useState(0);

  const handleClick = () => {
    setBounceCount(prev => prev + 1);
  };

  return (
    <div className="relative w-40 h-40 mx-auto select-none flex items-center justify-center bg-transparent">
      <motion.div
        key={bounceCount}
        initial={{ scale: 1 }}
        animate={bounceCount > 0 ? { scale: [1, 0.85, 1.1, 1] } : {}}
        transition={{ type: 'spring', duration: 0.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        className="cursor-pointer relative flex items-center justify-center"
      >
        {/* Jukebox turntable casing */}
        <div className="absolute inset-0 w-44 h-44 rounded-md bg-[#1A2340] border-2 border-[#D4A574] -z-10 shadow-[4px_4px_0px_#0A0E1A]" />
        
        {/* Vinyl Record */}
        <div
          className={`
            w-36 h-36 rounded-full bg-neutral-900 border-4 border-black
            flex items-center justify-center relative
            shadow-inner
            ${isHovered ? 'animate-[spin_2.5s_linear_infinite]' : 'animate-[spin_8s_linear_infinite]'}
          `}
        >
          {/* Vinyl Grooves (subtle lines) */}
          <div className="absolute w-28 h-28 rounded-full border border-neutral-800" />
          <div className="absolute w-24 h-24 rounded-full border border-neutral-800" />
          <div className="absolute w-20 h-20 rounded-full border border-neutral-800" />
          <div className="absolute w-16 h-16 rounded-full border border-neutral-700" />

          {/* Vinyl Sticker Center */}
          <div className="w-12 h-12 rounded-full bg-[#E8C77A] border-2 border-black flex items-center justify-center">
            {/* Center Spindle Hole */}
            <div className="w-3 h-3 rounded-full bg-[#1A2340] border border-black" />
          </div>

          {/* Shine reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full pointer-events-none" />
        </div>

        {/* Tone Arm */}
        <svg
          viewBox="0 0 100 100"
          className="absolute -top-4 -right-4 w-20 h-20 pointer-events-none z-20"
        >
          {/* Spindle head */}
          <circle cx="80" cy="20" r="6" fill="#D4A574" stroke="#1A2340" strokeWidth="2" />
          {/* Arm wire */}
          <path
            d="M 80 20 Q 50 30 45 60 L 40 70"
            fill="none"
            stroke="#F4EAD5"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Needle cartridge */}
          <rect x="36" y="66" width="8" height="12" rx="2" fill="#D4A574" transform="rotate(-15 40 72)" />
        </svg>
      </motion.div>
    </div>
  );
}
