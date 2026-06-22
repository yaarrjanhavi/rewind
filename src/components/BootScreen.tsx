'use client';
import React, { useState, useEffect } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [bootPhase, setBootPhase] = useState<'text' | 'loading' | 'ready'>('text');

  const bootMessages = [
    "REWIND BIOS v4.51PG, An Energy Star Ally",
    "Copyright (C) 2026, Rewind Technologies Inc.",
    "==============================================",
    "CPU: Gemini-AI Clocked at 3.5GHz",
    "Memory Test: 1048576KB OK",
    "Detecting IDE primary master ... HDD 4.3GB",
    "Detecting IDE secondary master ... CD-ROM DRIVE (8X)",
    "Sound Blaster 16 Detected at Port 220, IRQ 5, DMA 1",
    "Loading REWIND OS Kernel ... Done.",
    "Mounting timeline archives ... Success.",
    "Connecting to MusicBrainz database ... Connected.",
    "Connecting to Wikipedia history ... Connected.",
    "Initializing retro interface ... Done.",
    "Boot sequence completed."
  ];

  useEffect(() => {
    let index = 0;
    const lineInterval = setInterval(() => {
      if (index < bootMessages.length) {
        setLines((prev) => [...prev, bootMessages[index]]);
        index++;
      } else {
        clearInterval(lineInterval);
        setBootPhase('loading');
      }
    }, 200);

    return () => clearInterval(lineInterval);
  }, []);

  useEffect(() => {
    if (bootPhase !== 'loading') return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setBootPhase('ready');
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, [bootPhase]);

  const handleBootComplete = () => {
    onComplete();
  };

  const getProgressBar = () => {
    const barsCount = Math.floor(progress / 5);
    const bars = '█'.repeat(barsCount);
    const spaces = ' '.repeat(20 - barsCount);
    return `[${bars}${spaces}] ${progress}%`;
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black text-[#D4A574] font-mono p-6 flex flex-col justify-between select-none">
      <div className="space-y-2 text-xs md:text-sm leading-relaxed overflow-y-auto max-h-[80vh]">
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap font-vt323 text-lg md:text-xl">
            {line}
          </div>
        ))}

        {bootPhase === 'loading' && (
          <div className="mt-4 font-press-start text-xs text-[#E8C77A]">
            <p className="mb-2">LOADING SYSTEM MEMORIES...</p>
            <p className="tracking-widest">{getProgressBar()}</p>
          </div>
        )}

        {bootPhase === 'ready' && (
          <div className="mt-8 font-press-start text-center animate-pulse text-green-400 text-xs md:text-sm">
            <button
              onClick={handleBootComplete}
              className="bg-[#243054] text-[#F4EAD5] border-2 border-[#D4A574] px-4 py-2 hover:bg-[#D4A574] hover:text-[#1A2340] active:translate-y-1 transition-all cursor-pointer font-press-start text-xs"
            >
              CLICK TO START REWIND OS
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between border-t border-zinc-800 pt-2 text-[10px] text-zinc-500 font-press-start mt-auto">
        <span>SYSTEM VERSION: 1.0.0</span>
        <span>2026-06-22</span>
      </div>
    </div>
  );
}
