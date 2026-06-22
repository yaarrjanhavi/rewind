'use client';
import React, { useState } from 'react';
import { CompareResult } from '../types';
import { ArrowLeftRight } from 'lucide-react';

interface CompareWindowsProps {
  onSearchCompare: (yA: number, yB: number) => void;
  result: CompareResult | null;
  loading: boolean;
}

export default function CompareWindows({ onSearchCompare, result, loading }: CompareWindowsProps) {
  const [yearAInput, setYearAInput] = useState('1980');
  const [yearBInput, setYearBInput] = useState('2000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ya = parseInt(yearAInput, 10);
    const yb = parseInt(yearBInput, 10);
    const curr = new Date().getFullYear();
    if (isNaN(ya) || ya < 1900 || ya > curr || isNaN(yb) || yb < 1900 || yb > curr) {
      alert(`Please enter valid years between 1900 and ${curr}`);
      return;
    }
    onSearchCompare(ya, yb);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Comparison Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-[#1A2340] p-3 border border-[#D4A574]/30"
      >
        <div className="flex items-center space-x-2">
          <label className="font-press-start text-[9px] text-[#E8C77A]">YEAR A:</label>
          <input
            type="number"
            value={yearAInput}
            onChange={(e) => setYearAInput(e.target.value)}
            className="w-16 bg-[#243054] text-[#F4EAD5] border-2 border-b-[#F4EAD5] border-r-[#F4EAD5] border-t-[#1A2340] border-l-[#1A2340] p-1 font-vt323 text-xl text-center outline-none"
            min="1900"
            max="2026"
          />
        </div>

        <ArrowLeftRight size={18} className="text-[#D4A574] hidden sm:block" />

        <div className="flex items-center space-x-2">
          <label className="font-press-start text-[9px] text-[#E8C77A]">YEAR B:</label>
          <input
            type="number"
            value={yearBInput}
            onChange={(e) => setYearBInput(e.target.value)}
            className="w-16 bg-[#243054] text-[#F4EAD5] border-2 border-b-[#F4EAD5] border-r-[#F4EAD5] border-t-[#1A2340] border-l-[#1A2340] p-1 font-vt323 text-xl text-center outline-none"
            min="1900"
            max="2026"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1 font-press-start text-[9px] bg-[#243054] text-[#F4EAD5] border-2 border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340] hover:bg-[#D4A574]/10 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'COMPARING...' : 'COMPARE YEARS'}
        </button>
      </form>

      {/* Comparison Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-8 space-y-3">
          <div className="w-8 h-8 border-4 border-t-[#D4A574] border-l-[#D4A574] border-r-transparent border-b-transparent animate-spin" />
          <span className="font-press-start text-[9px] text-[#E8C77A] animate-pulse">
            LOADING COMPARISON ARCHIVES...
          </span>
        </div>
      )}

      {/* Comparison Results */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Comparative Narrative Box */}
          <div className="bg-[#1A2340] border-2 border-[#D4A574] p-4 text-left shadow-[inset_0_0_10px_black]">
            <div className="font-press-start text-[10px] text-[#E8C77A] border-b border-[#D4A574]/30 pb-2 mb-2 uppercase flex items-center space-x-2">
              <span>MILLENNIAL REPORT:</span>
              <span className="text-[#F4EAD5]">
                {result.yearA} VS {result.yearB}
              </span>
            </div>
            <p className="font-vt323 text-lg md:text-xl text-[#F4EAD5] leading-relaxed">
              {result.comparisonNarrative}
            </p>
          </div>

          {/* Double Windows Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Year A Box */}
            <div className="bg-[#243054] border-2 border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340] p-3 shadow-[2px_2px_0px_#1A2340]">
              <div className="bg-[#1A2340] text-[#D4A574] p-2 mb-3 border border-[#D4A574]/30 text-center font-press-start text-xs font-bold uppercase">
                YEAR: {result.yearA}
              </div>
              <div className="space-y-4 font-vt323 text-lg">
                <div>
                  <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-1">CULTURAL ATMOSPHERE:</h4>
                  <p className="text-[#F4EAD5]/80 italic">"{result.narrativeA}"</p>
                </div>

                <div className="border-t border-[#D4A574]/20 pt-2">
                  <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-1">DOMINANT SOUNDS:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.musicA.genres.slice(0, 3).map((g) => (
                      <li key={g.name}>
                        {g.name} <span className="text-[#D4A574]">({g.popularity}%)</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#D4A574]/20 pt-2">
                  <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-1">KEY RELEASES:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.musicA.albums.slice(0, 3).map((alb, i) => (
                      <li key={i} className="truncate">
                        "{alb.title}" by {alb.artist}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#D4A574]/20 pt-2">
                  <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-1">LIFESTYLE & TECH:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Salary: {result.capsuleA.averageSalary}</li>
                    <li>Tech: {result.capsuleA.technology.slice(0, 2).join(', ')}</li>
                    <li>Jobs: {result.capsuleA.popularJobs.slice(0, 2).join(', ')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Year B Box */}
            <div className="bg-[#243054] border-2 border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340] p-3 shadow-[2px_2px_0px_#1A2340]">
              <div className="bg-[#1A2340] text-[#D4A574] p-2 mb-3 border border-[#D4A574]/30 text-center font-press-start text-xs font-bold uppercase">
                YEAR: {result.yearB}
              </div>
              <div className="space-y-4 font-vt323 text-lg">
                <div>
                  <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-1">CULTURAL ATMOSPHERE:</h4>
                  <p className="text-[#F4EAD5]/80 italic">"{result.narrativeB}"</p>
                </div>

                <div className="border-t border-[#D4A574]/20 pt-2">
                  <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-1">DOMINANT SOUNDS:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.musicB.genres.slice(0, 3).map((g) => (
                      <li key={g.name}>
                        {g.name} <span className="text-[#D4A574]">({g.popularity}%)</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#D4A574]/20 pt-2">
                  <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-1">KEY RELEASES:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.musicB.albums.slice(0, 3).map((alb, i) => (
                      <li key={i} className="truncate">
                        "{alb.title}" by {alb.artist}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#D4A574]/20 pt-2">
                  <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-1">LIFESTYLE & TECH:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Salary: {result.capsuleB.averageSalary}</li>
                    <li>Tech: {result.capsuleB.technology.slice(0, 2).join(', ')}</li>
                    <li>Jobs: {result.capsuleB.popularJobs.slice(0, 2).join(', ')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
