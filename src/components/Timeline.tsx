'use client';
import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineProps {
  currentYear: number;
  onChangeYear: (year: number) => void;
}

export default function Timeline({ currentYear, onChangeYear }: TimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const startYear = 1900;
  const endYear = 2026;
  const decades = [1900, 1920, 1940, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

  // Enable global keyboard arrow keys to navigate years
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input boxes
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onChangeYear(Math.max(startYear, currentYear - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onChangeYear(Math.min(endYear, currentYear + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentYear, onChangeYear]);

  // Autoscroll the selected year into view in the timeline row
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const selectedBtn = container.querySelector(`[data-year="${currentYear}"]`);
    if (selectedBtn) {
      const btnLeft = (selectedBtn as HTMLElement).offsetLeft;
      const btnWidth = (selectedBtn as HTMLElement).offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: btnLeft - containerWidth / 2 + btnWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [currentYear]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeYear(parseInt(e.target.value, 10));
  };

  return (
    <div className="bg-[#243054] text-[#F4EAD5] p-3 border-2 border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340] shadow-[2px_2px_0px_#1A2340] space-y-3 font-mono">
      {/* Decades Shortcuts */}
      <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
        <span className="font-press-start text-[8px] text-[#D4A574] self-center mr-2 uppercase">Decades:</span>
        {decades.map((dec) => {
          const isCurrentDecade = currentYear >= dec && currentYear < dec + 10;
          return (
            <button
              key={dec}
              onClick={() => onChangeYear(dec)}
              className={`
                px-2 py-1 font-press-start text-[8px] border cursor-pointer transition-all
                ${isCurrentDecade
                  ? 'bg-[#D4A574] text-[#1A2340] border-[#E8C77A]'
                  : 'bg-[#1A2340] text-[#F4EAD5] border-[#D4A574]/40 hover:bg-[#D4A574]/20'
                }
                active:translate-y-0.5
              `}
            >
              {dec}s
            </button>
          );
        })}
      </div>

      {/* Main slider and manual incremental buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onChangeYear(Math.max(startYear, currentYear - 1))}
          className="p-1.5 bg-[#1A2340] hover:bg-[#D4A574]/20 border border-[#D4A574]/60 text-[#F4EAD5] cursor-pointer active:translate-y-0.5"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Retro style Range Input Slider */}
        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min={startYear}
            max={endYear}
            value={currentYear}
            onChange={handleSliderChange}
            className="w-full h-4 bg-[#1A2340] border-2 border-b-[#F4EAD5] border-r-[#F4EAD5] border-t-[#1A2340] border-l-[#1A2340] outline-none appearance-none cursor-ew-resize slider-thumb-retro"
          />
        </div>

        <button
          onClick={() => onChangeYear(Math.min(endYear, currentYear + 1))}
          className="p-1.5 bg-[#1A2340] hover:bg-[#D4A574]/20 border border-[#D4A574]/60 text-[#F4EAD5] cursor-pointer active:translate-y-0.5"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Scrolling year digits */}
      <div
        ref={scrollContainerRef}
        className="flex items-center space-x-1.5 overflow-x-auto py-2 px-1 border-2 border-b-[#F4EAD5] border-r-[#F4EAD5] border-t-[#1A2340] border-l-[#1A2340] bg-[#1A2340] scrollbar-thin scrollbar-thumb-retro scroll-smooth"
      >
        {Array.from({ length: endYear - startYear + 1 }).map((_, i) => {
          const yr = startYear + i;
          const isSelected = yr === currentYear;
          return (
            <button
              key={yr}
              data-year={yr}
              onClick={() => onChangeYear(yr)}
              className={`
                px-3 py-1 font-vt323 text-xl transition-all cursor-pointer flex-shrink-0
                ${isSelected
                  ? 'bg-[#E8C77A] text-[#1A2340] font-bold border-2 border-[#D4A574] shadow-[glow]'
                  : 'text-[#F4EAD5]/50 hover:text-[#F4EAD5] hover:bg-[#243054]'
                }
              `}
            >
              {yr}
            </button>
          );
        })}
      </div>
      
      {/* Hotkey Tip */}
      <div className="text-center font-vt323 text-sm text-[#E8C77A]/60 flex items-center justify-center space-x-1">
        <span>TIP: Use Keyboard</span>
        <span className="bg-[#1A2340] px-1 border border-[#D4A574]/40 font-mono text-xs">←</span>
        <span>and</span>
        <span className="bg-[#1A2340] px-1 border border-[#D4A574]/40 font-mono text-xs">→</span>
        <span>arrows to explore year by year</span>
      </div>
    </div>
  );
}
