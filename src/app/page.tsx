'use client';
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Tv,
  RefreshCw,
  Clock,
  LineChart,
  Share2,
  Power,
  Folder,
  FileText
} from 'lucide-react';

import BootScreen from '@/components/BootScreen';
import CrtOverlay from '@/components/CrtOverlay';
import RetroWindow from '@/components/RetroWindow';
import CassetteTape from '@/components/CassetteTape';
import VinylPlayer from '@/components/VinylPlayer';
import CursorTrail from '@/components/CursorTrail';
import Timeline from '@/components/Timeline';
import EvolutionChart from '@/components/EvolutionChart';
import ConnectionGraph from '@/components/ConnectionGraph';
import TimeCapsuleCard from '@/components/TimeCapsuleCard';
import CompareWindows from '@/components/CompareWindows';
import { HistoricalSnapshot, CompareResult, SoundtrackTrack } from '@/types';

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [yearInput, setYearInput] = useState('1977');
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  
  // Data State
  const [snapshot, setSnapshot] = useState<HistoricalSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Rewinding history...');

  // Window Management
  const [activeWindow, setActiveWindow] = useState<string>('search');
  const [openWindows, setOpenWindows] = useState<Record<string, boolean>>({
    readme: true,
    search: true,
    narrative: false,
    events: false,
    music: false,
    capsule: false,
    graph: false,
    evolution: false,
    compare: false
  });

  // Start Menu
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  // Time-Capsule details
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  // Personalised Soundtrack choices
  const [userGenres, setUserGenres] = useState<string[]>([]);
  const [customSoundtrack, setCustomSoundtrack] = useState<SoundtrackTrack[]>([]);

  // Taskbar Real-time Clock
  const [timeStr, setTimeStr] = useState('');

  // Easter Eggs State
  const [psychedelic, setPsychedelic] = useState(false);
  const [y2kWarning, setY2kWarning] = useState(false);

  const loadingMessages = [
    "Loading memories...",
    "Rewinding history...",
    "Dusting off vinyl records...",
    "Tuning radio frequencies...",
    "Consulting the music gods...",
    "Booting audio card drivers...",
    "Aligning timeline lasers..."
  ];

  useEffect(() => {
    // Clock tick
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFocus = (windowId: string) => {
    setActiveWindow(windowId);
  };

  const closeWindow = (windowId: string) => {
    setOpenWindows((prev) => ({ ...prev, [windowId]: false }));
  };

  const openWindowDirect = (windowId: string) => {
    setOpenWindows((prev) => ({ ...prev, [windowId]: true }));
    setActiveWindow(windowId);
  };

  const handleTimeTravel = async (year: number) => {
    setLoading(true);
    setPsychedelic(false);
    setY2kWarning(false);
    
    // Cycle loading message
    const msgInterval = setInterval(() => {
      const randomMsg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      setLoadingMessage(randomMsg);
    }, 450);

    try {
      const res = await fetch(`/api/rewind?year=${year}`);
      if (!res.ok) throw new Error("Could not fetch year data");
      
      const data: HistoricalSnapshot = await res.json();
      setSnapshot(data);
      setCurrentYear(year);
      setYearInput(String(year));

      // Trigger windows opening
      setOpenWindows((prev) => ({
        ...prev,
        narrative: true,
        events: true,
        music: true,
        capsule: true,
        graph: true
      }));
      setActiveWindow('narrative');

      // Easter Eggs
      if (year === 1989) {
        // Cassette Explosion: Floating notes confetti
        const end = Date.now() + 2 * 1000;
        const interval = setInterval(() => {
          if (Date.now() > end) {
            clearInterval(interval);
            return;
          }
          confetti({
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: ['#D4A574', '#E8C77A', '#F4EAD5']
          });
        }, 200);
      } else if (year === 1969) {
        setPsychedelic(true);
      } else if (year === 2000) {
        setY2kWarning(true);
      }

    } catch (err) {
      console.error(err);
      alert("Error contacting the historical timeline core. Please retry.");
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yr = parseInt(yearInput, 10);
    const curr = new Date().getFullYear();
    if (isNaN(yr) || yr < 1900 || yr > curr) {
      alert(`Please enter a valid year between 1900 and ${curr}`);
      return;
    }
    handleTimeTravel(yr);
  };

  const handleRandomTravel = () => {
    const min = 1900;
    const max = new Date().getFullYear();
    const randomYear = Math.floor(Math.random() * (max - min + 1)) + min;
    handleTimeTravel(randomYear);
    setStartMenuOpen(false);
  };

  const handleCompareSearch = async (yA: number, yB: number) => {
    setCompareLoading(true);
    try {
      const res = await fetch(`/api/compare?yearA=${yA}&yearB=${yB}`);
      if (!res.ok) throw new Error("Comparison request failed");
      const data: CompareResult = await res.json();
      setCompareResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to compare years.");
    } finally {
      setCompareLoading(false);
    }
  };

  const handleGenreToggle = (genre: string) => {
    setUserGenres(prev => {
      const next = prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre];
      
      // Update soundtrack based on filtered selections
      if (snapshot) {
        const filtered = snapshot.music.soundtrack.filter(track => 
          next.length === 0 || next.some(g => track.description.toLowerCase().includes(g.toLowerCase()) || 
          snapshot.music.genres[0]?.name.toLowerCase().includes(g.toLowerCase()))
        );
        setCustomSoundtrack(filtered.length > 0 ? filtered : snapshot.music.soundtrack.slice(0, 2));
      }

      return next;
    });
  };

  // Re-run soundtrack on snapshot updates
  useEffect(() => {
    if (snapshot) {
      setCustomSoundtrack(snapshot.music.soundtrack);
      setUserGenres([]);
    }
  }, [snapshot]);

  const resetDesktop = () => {
    setOpenWindows({
      readme: true,
      search: true,
      narrative: !!snapshot,
      events: !!snapshot,
      music: !!snapshot,
      capsule: !!snapshot,
      graph: !!snapshot,
      evolution: true,
      compare: false
    });
    setStartMenuOpen(false);
  };

  return (
    <div className={`${psychedelic ? 'psychedelic-filter' : ''} min-h-screen relative overflow-hidden bg-[#1A2340]`}>
      <CursorTrail />

      {/* Boot BIOS Animation Overlay */}
      {!booted && (
        <BootScreen onComplete={() => setBooted(true)} />
      )}

      {booted && (
        <CrtOverlay enabled={crtEnabled}>
          {/* Main Retro OS Workspace */}
          <div className="flex-1 flex flex-col md:flex-row relative min-h-[calc(100vh-60px)] pb-12">
            
            {/* Desktop Icons Left Column */}
            <div className="flex flex-row md:flex-col items-center justify-start flex-wrap gap-4 p-2 md:p-4 z-10">
              {/* Icon 1: Search Console */}
              <button
                onClick={() => openWindowDirect('search')}
                className="w-16 h-18 md:w-20 md:h-22 flex flex-col items-center justify-center text-center hover:bg-[#D4A574]/20 border border-transparent hover:border-[#D4A574]/30 p-1 cursor-pointer focus:outline-none"
              >
                <Tv size={28} className="text-[#E8C77A] mb-1.5" />
                <span className="font-press-start text-[8px] leading-tight break-all uppercase text-[#F4EAD5]">
                  Time machine
                </span>
              </button>

              {/* Icon 2: Genre Dashboard */}
              <button
                onClick={() => openWindowDirect('evolution')}
                className="w-16 h-18 md:w-20 md:h-22 flex flex-col items-center justify-center text-center hover:bg-[#D4A574]/20 border border-transparent hover:border-[#D4A574]/30 p-1 cursor-pointer focus:outline-none"
              >
                <LineChart size={28} className="text-[#E8C77A] mb-1.5" />
                <span className="font-press-start text-[8px] leading-tight uppercase text-[#F4EAD5]">
                  Genre evolution
                </span>
              </button>

              {/* Icon 3: Connect Matrix */}
              <button
                onClick={() => {
                  if (!snapshot) {
                    alert("Please time travel to a year first to view connections!");
                    return;
                  }
                  openWindowDirect('graph');
                }}
                className={`w-16 h-18 md:w-20 md:h-22 flex flex-col items-center justify-center text-center hover:bg-[#D4A574]/20 border border-transparent hover:border-[#D4A574]/30 p-1 cursor-pointer focus:outline-none ${!snapshot ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Share2 size={28} className="text-[#E8C77A] mb-1.5" />
                <span className="font-press-start text-[8px] leading-tight uppercase text-[#F4EAD5]">
                  Graph matrix
                </span>
              </button>

              {/* Icon 4: Compare Eras */}
              <button
                onClick={() => openWindowDirect('compare')}
                className="w-16 h-18 md:w-20 md:h-22 flex flex-col items-center justify-center text-center hover:bg-[#D4A574]/20 border border-transparent hover:border-[#D4A574]/30 p-1 cursor-pointer focus:outline-none"
              >
                <Folder size={28} className="text-[#E8C77A] mb-1.5" />
                <span className="font-press-start text-[8px] leading-tight uppercase text-[#F4EAD5]">
                  Compare Eras
                </span>
              </button>

              {/* Icon 5: README System info */}
              <button
                onClick={() => openWindowDirect('readme')}
                className="w-16 h-18 md:w-20 md:h-22 flex flex-col items-center justify-center text-center hover:bg-[#D4A574]/20 border border-transparent hover:border-[#D4A574]/30 p-1 cursor-pointer focus:outline-none"
              >
                <FileText size={28} className="text-[#E8C77A] mb-1.5" />
                <span className="font-press-start text-[8px] leading-tight uppercase text-[#F4EAD5]">
                  ReadMe.txt
                </span>
              </button>
            </div>

            {/* Desktop Windows Core Container */}
            <div className="flex-1 relative min-h-[500px]">
              
              {/* WINDOW: Readme About */}
              {openWindows.readme && (
                <RetroWindow
                  id="readme"
                  title="README.TXT"
                  onClose={() => closeWindow('readme')}
                  activeId={activeWindow}
                  onFocus={handleFocus}
                  defaultPosition={{ x: 30, y: 20 }}
                  width="w-full md:w-[480px]"
                >
                  <div className="space-y-3 p-1">
                    <h3 className="font-press-start text-xs text-[#E8C77A] uppercase border-b border-[#D4A574]/20 pb-1">
                      Welcome to REWIND OS!
                    </h3>
                    <p className="font-vt323 text-lg leading-relaxed text-[#F4EAD5]/90">
                      REWIND is an interactive, AI-powered music time machine. Explore the sounds, headlines, and lifestyles of human history from 1900 to today.
                    </p>
                    <div className="bg-[#1A2340] border border-[#D4A574]/20 p-2 space-y-1.5 text-base text-[#D4A574]">
                      <p>• Select an icon to launch a retro window app.</p>
                      <p>• Type a year in the Time Machine console or scroll the timeline at the bottom.</p>
                      <p>• Click window titles to drag them and stack elements.</p>
                    </div>
                    <div className="flex items-center justify-between text-xs font-press-start pt-2 border-t border-[#D4A574]/20 text-[#F4EAD5]/50">
                      <span>SYSTEM VERSION: 1.0</span>
                      <span>MEMORY: 100% OK</span>
                    </div>
                  </div>
                </RetroWindow>
              )}

              {/* WINDOW: Time Machine Search Console */}
              {openWindows.search && (
                <RetroWindow
                  id="search"
                  title="TIME TRAVEL CONSOLE"
                  onClose={() => closeWindow('search')}
                  activeId={activeWindow}
                  onFocus={handleFocus}
                  defaultPosition={{ x: 200, y: 60 }}
                  width="w-full md:w-[440px]"
                >
                  <div className="space-y-4 text-center p-1">
                    <div className="flex flex-col items-center justify-center py-2">
                      <h2 className="font-press-start text-sm text-[#D4A574] tracking-wider mb-1">REWIND</h2>
                      <span className="font-vt323 text-base text-[#F4EAD5]/60 uppercase">
                        Travel Through History One Song At A Time
                      </span>
                    </div>

                    {/* Cassette Graphic */}
                    <CassetteTape speed={loading ? 'fast' : (snapshot ? 'play' : 'idle')} />

                    {/* Input Console */}
                    <form onSubmit={handleSearchSubmit} className="flex flex-col items-center space-y-3">
                      <div className="flex items-center space-x-2 border-2 border-[#D4A574] bg-[#1A2340] p-1.5">
                        <span className="font-press-start text-[10px] text-[#E8C77A] animate-pulse cursor-default">
                          ENTER YEAR:
                        </span>
                        <input
                          type="number"
                          value={yearInput}
                          onChange={(e) => setYearInput(e.target.value)}
                          className="bg-[#243054] text-[#F4EAD5] border border-[#D4A574]/30 outline-none p-1 w-20 text-center font-press-start text-xs font-bold"
                          min="1900"
                          max="2026"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-[#243054] text-[#F4EAD5] px-4 py-2 border-2 border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340] active:translate-y-0.5 hover:bg-[#D4A574]/10 cursor-pointer font-press-start text-[9px] disabled:opacity-50"
                        >
                          {loading ? 'WARPING...' : 'LAUNCH ENGINE'}
                        </button>

                        <button
                          type="button"
                          onClick={handleRandomTravel}
                          disabled={loading}
                          className="bg-[#243054] text-[#E8C77A] px-3 py-2 border-2 border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340] active:translate-y-0.5 hover:bg-[#D4A574]/10 cursor-pointer font-press-start text-[9px] disabled:opacity-50"
                        >
                          TAKE ME SOMEWHERE
                        </button>
                      </div>
                    </form>

                    {/* Action loading bar overlay */}
                    {loading && (
                      <div className="border border-[#D4A574] bg-[#1A2340] p-3 text-center space-y-2">
                        <p className="font-press-start text-[8px] text-[#E8C77A] animate-pulse">
                          {loadingMessage.toUpperCase()}
                        </p>
                        <div className="w-full bg-[#243054] h-4 border border-[#D4A574]/55 relative overflow-hidden">
                          <div className="absolute top-0 bottom-0 bg-[#D4A574] animate-pulse" style={{ width: '40%', animationDuration: '0.8s' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </RetroWindow>
              )}

              {/* WINDOW: AI Immersive Narrative */}
              {openWindows.narrative && snapshot && (
                <RetroWindow
                  id="narrative"
                  title={`PORTRAIT: YEAR ${snapshot.year}`}
                  onClose={() => closeWindow('narrative')}
                  activeId={activeWindow}
                  onFocus={handleFocus}
                  defaultPosition={{ x: 100, y: 150 }}
                  width="w-full md:w-[500px]"
                >
                  <div className="space-y-3 p-1 text-left">
                    <div className="font-press-start text-[10px] text-[#E8C77A] border-b border-[#D4A574]/35 pb-2 mb-2">
                      WHAT DID LIFE FEEL LIKE?
                    </div>
                    <p className="text-xl leading-relaxed text-[#F4EAD5]">
                      {snapshot.narrative}
                    </p>
                    <div className="border border-dashed border-[#D4A574]/20 p-2 bg-[#1A2340] flex items-center justify-between">
                      <span className="font-press-start text-[8px] text-[#D4A574]">HISTORICAL ATMOSPHERE PROFILE</span>
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                    </div>
                  </div>
                </RetroWindow>
              )}

              {/* WINDOW: Historical Events */}
              {openWindows.events && snapshot && (
                <RetroWindow
                  id="events"
                  title={`HEADLINES: YEAR ${snapshot.year}`}
                  onClose={() => closeWindow('events')}
                  activeId={activeWindow}
                  onFocus={handleFocus}
                  defaultPosition={{ x: 300, y: 80 }}
                  width="w-full md:w-[480px]"
                >
                  <div className="space-y-4 p-1">
                    <div className="font-press-start text-[10px] text-[#E8C77A] border-b border-[#D4A574]/35 pb-2">
                      MAJOR CHRONICLES & BREAKTHROUGHS
                    </div>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                      {snapshot.events.map((ev, idx) => (
                        <div key={idx} className="border-b border-[#D4A574]/15 pb-3 last:border-b-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-press-start text-[8px] bg-[#1A2340] px-1.5 py-0.5 border border-[#D4A574]/30 text-[#E8C77A] uppercase">
                              {ev.category}
                            </span>
                            <span className="text-xs text-[#F4EAD5]/45 uppercase font-mono">
                              RECORD #{idx + 1}0
                            </span>
                          </div>
                          <h4 className="font-press-start text-xs text-[#F4EAD5] font-bold mb-1">
                            {ev.title}
                          </h4>
                          <p className="text-base text-[#F4EAD5]/80 leading-snug">
                            {ev.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </RetroWindow>
              )}

              {/* WINDOW: Music Snapshot & Covers */}
              {openWindows.music && snapshot && (
                <RetroWindow
                  id="music"
                  title={`AUDIO ARCHIVE: YEAR ${snapshot.year}`}
                  onClose={() => closeWindow('music')}
                  activeId={activeWindow}
                  onFocus={handleFocus}
                  defaultPosition={{ x: 80, y: 220 }}
                  width="w-full md:w-[540px]"
                >
                  <div className="space-y-4 p-1">
                    {/* Top Bands and Trends */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#D4A574]/30 pb-3">
                      <div>
                        <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-2 uppercase">POPULAR ARTISTS</h4>
                        <ul className="space-y-1 text-[#F4EAD5] text-lg list-none">
                          {snapshot.music.artists.map((artist, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <span className="text-[#D4A574]">★</span>
                              <span>{artist}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-2 uppercase">MUSICAL MOVEMENTS</h4>
                        <ul className="space-y-1 text-[#F4EAD5]/80 text-base italic list-none">
                          {snapshot.music.trends.map((trend, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-[#D4A574] mr-2">▪</span>
                              <span>&quot;{trend}&quot;</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Album Covers Grid */}
                    <div>
                      <h4 className="font-press-start text-[8px] text-[#E8C77A] mb-3 uppercase">NOTABLE RELEASES</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {snapshot.music.albums.map((album, idx) => (
                          <div
                            key={idx}
                            className="bg-[#1A2340] border border-[#D4A574]/40 p-1.5 flex flex-col items-center text-center shadow-sm select-none"
                          >
                            {/* Vinyl player/art fallback */}
                            <div className="w-20 h-20 bg-neutral-900 border-2 border-black flex items-center justify-center relative shadow-inner overflow-hidden mb-1.5">
                              {album.coverUrl ? (
                                <img
                                  src={album.coverUrl}
                                  alt={album.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Remove src if image errors (404 on Cover Art Archive) to trigger fallback vinyl
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : null}
                              {/* Vinyl record design behind overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full border border-neutral-800 pointer-events-none">
                                <div className="w-6 h-6 rounded-full bg-[#D4A574] flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A2340]" />
                                </div>
                              </div>
                            </div>
                            <span className="font-press-start text-[7px] text-[#F4EAD5] leading-tight truncate w-full mb-0.5">
                              {album.title}
                            </span>
                            <span className="font-vt323 text-xs text-[#D4A574] truncate w-full">
                              {album.artist}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Personalised Soundtrack Generator */}
                    <div className="border-t border-[#D4A574]/30 pt-3 mt-4 space-y-3">
                      <h4 className="font-press-start text-[8px] text-[#E8C77A] uppercase">Personalised Soundtrack</h4>
                      <p className="text-sm text-[#F4EAD5]/60 mb-2">Select genres to compile your custom playlist:</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {snapshot.music.genres.map((g) => {
                          const isSelected = userGenres.includes(g.name);
                          return (
                            <button
                              key={g.name}
                              onClick={() => handleGenreToggle(g.name)}
                              className={`
                                px-2 py-0.5 font-press-start text-[8px] border cursor-pointer transition-all
                                ${isSelected
                                  ? 'bg-[#E8C77A] text-[#1A2340] border-[#D4A574]'
                                  : 'bg-[#1A2340] text-[#F4EAD5] border-[#D4A574]/30 hover:bg-[#D4A574]/15'
                                }
                              `}
                            >
                              {g.name}
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                        {customSoundtrack.map((track, i) => (
                          <div key={i} className="bg-[#1A2340]/40 p-2 border border-[#D4A574]/10 flex items-start space-x-2">
                            <div className="text-xs text-[#E8C77A] font-press-start self-center">▶</div>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="font-press-start text-[8px] text-[#F4EAD5] truncate">
                                {track.title} <span className="text-[#D4A574]/70">- {track.artist}</span>
                              </div>
                              <div className="font-vt323 text-sm text-[#F4EAD5]/70 italic mt-0.5">
                                &quot;{track.description}&quot;
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </RetroWindow>
              )}

              {/* WINDOW: AI Time Capsule Retro Cards */}
              {openWindows.capsule && snapshot && (
                <RetroWindow
                  id="capsule"
                  title={`TIME CAPSULE: YEAR ${snapshot.year}`}
                  onClose={() => closeWindow('capsule')}
                  activeId={activeWindow}
                  onFocus={handleFocus}
                  defaultPosition={{ x: 150, y: 180 }}
                  width="w-full md:w-[680px]"
                >
                  <div className="space-y-4 p-1">
                    <div className="font-press-start text-[10px] text-[#E8C77A] border-b border-[#D4A574]/35 pb-2">
                      COLLECTIBLE LIFESTYLE SNAPSHOT CARDS
                    </div>
                    <TimeCapsuleCard capsule={snapshot.capsule} />
                  </div>
                </RetroWindow>
              )}

              {/* WINDOW: Connections Matrix Graph */}
              {openWindows.graph && snapshot && (
                <RetroWindow
                  id="graph"
                  title={`CONNECTIONS MATRIX: YEAR ${snapshot.year}`}
                  onClose={() => closeWindow('graph')}
                  activeId={activeWindow}
                  onFocus={handleFocus}
                  defaultPosition={{ x: 220, y: 220 }}
                  width="w-full md:w-[480px]"
                >
                  <div className="space-y-3 p-1">
                    <div className="font-press-start text-[10px] text-[#E8C77A] border-b border-[#D4A574]/35 pb-2">
                      INTERACTIVE ERA RELATIONSHIP GRAPH
                    </div>
                    <ConnectionGraph connections={snapshot.connections} />
                  </div>
                </RetroWindow>
              )}

              {/* WINDOW: Musical Evolution Dashboard */}
              {openWindows.evolution && (
                <RetroWindow
                  id="evolution"
                  title="GENRE POPULARITY HISTORICAL ANALYTICS"
                  onClose={() => closeWindow('evolution')}
                  activeId={activeWindow}
                  onFocus={handleFocus}
                  defaultPosition={{ x: 60, y: 280 }}
                  width="w-full md:w-[640px]"
                >
                  <div className="space-y-3 p-1">
                    <div className="font-press-start text-[10px] text-[#E8C77A] border-b border-[#D4A574]/35 pb-2">
                      POPULARITY READOUT BY DECADES
                    </div>
                    <EvolutionChart />
                  </div>
                </RetroWindow>
              )}

              {/* WINDOW: Compare Eras Side-by-Side */}
              {openWindows.compare && (
                <RetroWindow
                  id="compare"
                  title="ERA COMPARE DATABASE ENGINE"
                  onClose={() => closeWindow('compare')}
                  activeId={activeWindow}
                  onFocus={handleFocus}
                  defaultPosition={{ x: 120, y: 40 }}
                  width="w-full md:w-[720px]"
                >
                  <div className="p-1">
                    <CompareWindows
                      onSearchCompare={handleCompareSearch}
                      result={compareResult}
                      loading={compareLoading}
                    />
                  </div>
                </RetroWindow>
              )}

              {/* Empty state when no year has been travel-led yet */}
              {!snapshot && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none space-y-6">
                  {/* Vinyl spinning slowly */}
                  <VinylPlayer />

                  <div className="space-y-2">
                    <h1 className="font-press-start text-xs md:text-sm text-[#D4A574] animate-pulse">
                      WARP ENGINE OFFLINE
                    </h1>
                    <p className="font-vt323 text-lg md:text-xl text-[#F4EAD5]/60 max-w-sm">
                      Enter a year in the Time Travel console, double-click ReadMe.txt, or scroll the timeline below to begin.
                    </p>
                  </div>
                  
                  {/* Glowing cursor caret */}
                  <div className="font-mono text-xl text-[#E8C77A] animate-pulse">
                    READY_
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Timeline Explorer Footer Bar */}
          <div className="fixed bottom-12 left-0 right-0 z-40 px-4 md:px-6">
            <Timeline
              currentYear={currentYear || 1977}
              onChangeYear={handleTimeTravel}
            />
          </div>

          {/* Windows-like Desktop Taskbar */}
          <div className="fixed bottom-0 left-0 right-0 h-10 bg-[#243054] border-t-2 border-t-[#F4EAD5] flex items-center justify-between px-2 z-[999] select-none">
            {/* Start Button */}
            <div className="relative">
              <button
                onClick={() => setStartMenuOpen(!startMenuOpen)}
                className={`
                  flex items-center space-x-1.5 px-3 py-1 bg-[#243054] border-2 border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340]
                  hover:bg-[#D4A574]/20 active:border-t-[#1A2340] active:border-l-[#1A2340] active:border-b-[#F4EAD5] active:border-r-[#F4EAD5]
                  cursor-pointer font-press-start text-[10px] font-bold text-[#F4EAD5]
                  ${startMenuOpen ? 'bg-[#D4A574]/30' : ''}
                `}
              >
                <div className="w-3.5 h-3.5 bg-[#D4A574] border border-[#1A2340] flex items-center justify-center font-bold text-[#1A2340] text-[8px] font-press-start">
                  R
                </div>
                <span>START</span>
              </button>

              {/* Start Menu Popup */}
              {startMenuOpen && (
                <div className="absolute bottom-10 left-0 w-52 bg-[#243054] border-4 border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340] shadow-md flex flex-col font-mono z-[1000] p-1.5">
                  <div className="bg-[#1A2340] text-[#D4A574] text-center font-press-start text-[8px] p-1 border-b border-[#D4A574]/40 mb-1.5">
                    REWIND OS v1.0
                  </div>
                  
                  {/* Option: Random Travel */}
                  <button
                    onClick={handleRandomTravel}
                    className="w-full text-left font-press-start text-[9px] text-[#F4EAD5] p-2 hover:bg-[#D4A574] hover:text-[#1A2340] cursor-pointer flex items-center space-x-2"
                  >
                    <RefreshCw size={12} />
                    <span>RANDOM TRAVEL</span>
                  </button>

                  {/* Option: Toggle CRT Overlay */}
                  <button
                    onClick={() => {
                      setCrtEnabled(!crtEnabled);
                      setStartMenuOpen(false);
                    }}
                    className="w-full text-left font-press-start text-[9px] text-[#F4EAD5] p-2 hover:bg-[#D4A574] hover:text-[#1A2340] cursor-pointer flex items-center space-x-2"
                  >
                    <Tv size={12} />
                    <span>TOGGLE CRT VIEW</span>
                  </button>

                  {/* Option: Reset Desktop Layout */}
                  <button
                    onClick={resetDesktop}
                    className="w-full text-left font-press-start text-[9px] text-[#F4EAD5] p-2 hover:bg-[#D4A574] hover:text-[#1A2340] cursor-pointer flex items-center space-x-2"
                  >
                    <Folder size={12} />
                    <span>RESET WINDOWS</span>
                  </button>

                  {/* Option: Shutdown OS */}
                  <button
                    onClick={() => {
                      setBooted(false);
                      setStartMenuOpen(false);
                    }}
                    className="w-full text-left font-press-start text-[9px] text-red-400 p-2 hover:bg-red-900 hover:text-white border-t border-[#1A2340] mt-1 pt-2 cursor-pointer flex items-center space-x-2"
                  >
                    <Power size={12} />
                    <span>SHUTDOWN OS</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Task Shortcuts for Open Windows (desktop width only) */}
            <div className="flex-1 hidden md:flex items-center space-x-2 px-4 truncate">
              {Object.entries(openWindows).map(([key, isOpen]) => {
                if (!isOpen) return null;
                const isFocused = activeWindow === key;
                return (
                  <button
                    key={key}
                    onClick={() => openWindowDirect(key)}
                    className={`
                      px-2.5 py-1 text-center font-press-start text-[7px] border-2 uppercase truncate max-w-[120px] cursor-pointer
                      ${isFocused
                        ? 'bg-[#D4A574] text-[#1A2340] border-[#E8C77A]'
                        : 'bg-[#243054] text-[#F4EAD5] border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340]'
                      }
                    `}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* Taskbar Right-Hand Info Status Tray */}
            <div className="flex items-center space-x-3 px-2 py-0.5 bg-[#1A2340] border-2 border-b-[#F4EAD5] border-r-[#F4EAD5] border-t-[#1A2340] border-l-[#1A2340]">
              <div className="flex items-center space-x-1">
                <Tv size={12} className={crtEnabled ? 'text-green-500 animate-pulse' : 'text-neutral-500'} />
                <span className="font-vt323 text-xs text-[#F4EAD5]/70 uppercase hidden sm:inline">CRT: {crtEnabled ? 'ON' : 'OFF'}</span>
              </div>
              <div className="flex items-center space-x-1.5 border-l border-[#243054] pl-2.5">
                <Clock size={12} className="text-[#D4A574]" />
                <span className="font-press-start text-[8px] text-[#F4EAD5]">{timeStr}</span>
              </div>
            </div>
          </div>

          {/* Y2K Modal popup warning easter egg */}
          {y2kWarning && (
            <div className="fixed inset-0 bg-black/75 z-[9999] flex items-center justify-center p-4">
              <div className="bg-red-950 text-red-100 border-4 border-red-500 max-w-sm p-4 font-mono shadow-lg text-left relative space-y-3">
                <h3 className="font-press-start text-xs text-red-500 uppercase border-b border-red-800 pb-1.5 animate-pulse">
                  !!! Y2K FAULT DETECTED !!!
                </h3>
                <p className="font-vt323 text-lg leading-relaxed">
                  CRITICAL ERRORS: Millennium date registers overflowed. BIOS reports year value &quot;00&quot; instead of &quot;2000&quot;. System logs show core timeline fragmentation.
                </p>
                <div className="bg-black/30 border border-red-800 p-2 text-base text-red-400">
                  <p>• Check memory capacitors.</p>
                  <p>• Verify timezone synchronizer.</p>
                </div>
                <div className="text-center pt-2">
                  <button
                    onClick={() => setY2kWarning(false)}
                    className="px-3 py-1 font-press-start text-[8px] bg-red-800 text-red-100 border-2 border-red-500 hover:bg-red-700 cursor-pointer"
                  >
                    OVERRIDE WARNING
                  </button>
                </div>
              </div>
            </div>
          )}

        </CrtOverlay>
      )}
    </div>
  );
}
