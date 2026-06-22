'use client';
import React, { useEffect, useState } from 'react';
import { GenreTrendPoint } from '../app/api/evolution/route';

export default function EvolutionChart() {
  const [data, setData] = useState<GenreTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Toggled visibility states for genres
  const [visibleGenres, setVisibleGenres] = useState<Record<string, boolean>>({
    Rock: true,
    Jazz: true,
    Pop: true,
    'Hip-Hop': true,
    Disco: true,
    Electronic: true
  });

  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    point: GenreTrendPoint;
  } | null>(null);

  // Genre color coding
  const genreColors: Record<string, string> = {
    Rock: '#D4A574',       // Primary theme color
    Pop: '#E8C77A',        // Accent theme color
    Jazz: '#8FA0CA',       // Soft slate blue
    'Hip-Hop': '#66C2A5',   // Retro sage green
    Disco: '#FC8D62',      // Neon sunset orange
    Electronic: '#E5C494'  // Light tan/beige
  };

  useEffect(() => {
    fetch('/api/evolution')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching evolution data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 font-mono text-center">
        <div className="w-8 h-8 border-4 border-t-[#D4A574] border-l-[#D4A574] border-r-transparent border-b-transparent animate-spin" />
        <span className="font-press-start text-[10px] text-[#E8C77A] animate-pulse">
          TUNING RADIO FREQUENCIES...
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-4 text-center font-press-start text-[10px] text-red-500">
        ERROR LOADING MUSIC DATABASE.
      </div>
    );
  }

  // Dimensions of SVG canvas
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 600;
  const height = 300;

  // Chart calculation functions
  const minYear = data[0].year;
  const maxYear = data[data.length - 1].year;
  const maxVal = 100;

  const getX = (year: number) => {
    return padding.left + ((year - minYear) / (maxYear - minYear)) * (width - padding.left - padding.right);
  };

  const getY = (value: number) => {
    return height - padding.bottom - (value / maxVal) * (height - padding.top - padding.bottom);
  };

  const toggleGenre = (genre: string) => {
    setVisibleGenres((prev) => ({ ...prev, [genre]: !prev[genre] }));
  };

  // Generate SVG path for a genre line
  const generateLinePath = (genreKey: keyof Omit<GenreTrendPoint, 'year' | 'annotation'>) => {
    return data
      .map((d, index) => {
        const x = getX(d.year);
        const y = getY(d[genreKey] as number);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Genre Toggles Panel */}
      <div className="flex flex-wrap gap-2 justify-center p-2 bg-[#1A2340] border border-[#D4A574]/30">
        {Object.keys(visibleGenres).map((genre) => (
          <label
            key={genre}
            className="flex items-center space-x-2 px-2 py-1 text-xs cursor-pointer select-none border border-transparent hover:border-[#D4A574]/40"
          >
            <input
              type="checkbox"
              checked={visibleGenres[genre]}
              onChange={() => toggleGenre(genre)}
              className="accent-[#D4A574] cursor-pointer"
            />
            <span
              style={{ color: genreColors[genre] }}
              className="font-press-start text-[8px] font-bold"
            >
              {genre.toUpperCase()}
            </span>
          </label>
        ))}
      </div>

      {/* Main SVG Chart Area */}
      <div className="relative border-2 border-[#D4A574]/50 bg-[#1A2340] overflow-x-auto overflow-y-hidden select-none p-1 shadow-[inset_0_0_10px_black]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          className="min-w-[500px]"
        >
          {/* Background Grid Lines */}
          {/* Vertical decadal grid */}
          {data.map((d) => (
            <line
              key={d.year}
              x1={getX(d.year)}
              y1={padding.top}
              x2={getX(d.year)}
              y2={height - padding.bottom}
              stroke="#243054"
              strokeWidth="1.5"
              strokeDasharray="2 4"
            />
          ))}

          {/* Horizontal popularity grid */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={padding.left}
                y1={getY(v)}
                x2={width - padding.right}
                y2={getY(v)}
                stroke="#243054"
                strokeWidth="1.5"
                strokeDasharray="2 4"
              />
              {/* Y Axis Labels */}
              <text
                x={padding.left - 8}
                y={getY(v) + 4}
                textAnchor="end"
                fill="#F4EAD5"
                fontSize="10"
                fontFamily="VT323"
              >
                {v}%
              </text>
            </g>
          ))}

          {/* X Axis Labels */}
          {data.map((d, index) => {
            if (index % 2 !== 0 && index !== data.length - 1) return null; // Show every 20 years to avoid clutter
            return (
              <text
                key={d.year}
                x={getX(d.year)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                fill="#F4EAD5"
                fontSize="12"
                fontFamily="VT323"
              >
                {d.year}s
              </text>
            );
          })}

          {/* Chart Line Paths for Active Genres */}
          {Object.keys(visibleGenres).map((genre) => {
            if (!visibleGenres[genre]) return null;
            return (
              <path
                key={genre}
                d={generateLinePath(genre as any)}
                fill="none"
                stroke={genreColors[genre]}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 drop-shadow-[0_0_3px_rgba(255,255,255,0.1)]"
              />
            );
          })}

          {/* Interactive Data Dots (for hover tooltips) */}
          {data.map((d) => {
            const x = getX(d.year);
            return Object.keys(visibleGenres).map((genre) => {
              if (!visibleGenres[genre]) return null;
              const val = d[genre as keyof GenreTrendPoint] as number;
              const y = getY(val);

              return (
                <circle
                  key={`${d.year}-${genre}`}
                  cx={x}
                  cy={y}
                  r="5"
                  fill={genreColors[genre]}
                  stroke="#1A2340"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:r-7 transition-all"
                  onMouseEnter={(e) => {
                    setHoveredPoint({
                      x: x,
                      y: y,
                      point: d
                    });
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            });
          })}
        </svg>

        {/* Custom Retro Tooltip Overlay */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${hoveredPoint.x + 10}px`,
              top: `${hoveredPoint.y - 80}px`
            }}
            className="z-50 bg-[#243054] text-[#F4EAD5] border-2 border-[#D4A574] p-2 text-xs font-mono shadow-md max-w-[200px]"
          >
            <div className="font-press-start text-[8px] text-[#E8C77A] border-b border-[#D4A574]/30 pb-1 mb-1">
              YEAR: {hoveredPoint.point.year}
            </div>
            <div className="font-vt323 text-[15px] space-y-0.5">
              {Object.keys(visibleGenres)
                .filter(g => visibleGenres[g])
                .map((g) => (
                  <div key={g} className="flex justify-between space-x-4">
                    <span>{g}:</span>
                    <span style={{ color: genreColors[g] }} className="font-bold">
                      {hoveredPoint.point[g as keyof GenreTrendPoint]}%
                    </span>
                  </div>
                ))}
              {hoveredPoint.point.annotation && (
                <div className="text-[11px] text-[#D4A574] italic border-t border-[#D4A574]/20 pt-1 mt-1">
                  "{hoveredPoint.point.annotation}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs font-vt323 text-[#F4EAD5]/60">
        Hover over dots to inspect genre popularities and decade notes.
      </div>
    </div>
  );
}
