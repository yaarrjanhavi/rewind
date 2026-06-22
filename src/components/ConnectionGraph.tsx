'use client';
import React, { useState } from 'react';
import { GraphConnection, GraphNode } from '../types';

interface ConnectionGraphProps {
  connections: GraphConnection;
}

export default function ConnectionGraph({ connections }: ConnectionGraphProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const width = 450;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;

  const { nodes, links } = connections;

  // Calculate coordinates dynamically for each node based on its type
  const getNodeCoords = (node: GraphNode) => {
    if (node.id === 'year') {
      return { x: cx, y: cy };
    }

    const genres = nodes.filter((n) => n.type === 'genre');
    const artists = nodes.filter((n) => n.type === 'artist');
    const events = nodes.filter((n) => n.type === 'event' && n.id !== 'year');

    if (node.type === 'genre') {
      const idx = genres.indexOf(node);
      const angle = (idx * 2 * Math.PI) / genres.length;
      return {
        x: cx + Math.cos(angle) * 55,
        y: cy + Math.sin(angle) * 55
      };
    }

    if (node.type === 'artist') {
      const idx = artists.indexOf(node);
      const angle = (idx * 2 * Math.PI) / artists.length + Math.PI / 6;
      return {
        x: cx + Math.cos(angle) * 110,
        y: cy + Math.sin(angle) * 110
      };
    }

    // Events
    const idx = events.indexOf(node);
    const angle = (idx * 2 * Math.PI) / (events.length || 1) - Math.PI / 4;
    return {
      x: cx + Math.cos(angle) * 125,
      y: cy + Math.sin(angle) * 85
    };
  };

  // Pre-calculate coordinates for all nodes to draw links
  const nodePositions: Record<string, { x: number; y: number }> = {};
  nodes.forEach((node) => {
    nodePositions[node.id] = getNodeCoords(node);
  });

  const getThemeColor = (type: string) => {
    switch (type) {
      case 'artist':
        return '#E8C77A'; // Accent Gold
      case 'genre':
        return '#D4A574'; // Primary Copper
      case 'event':
        return '#8FA0CA'; // Slate Blue
      default:
        return '#F4EAD5'; // Text Cream
    }
  };

  // Identify connected link states
  const isLinked = (sourceId: string, targetId: string) => {
    if (!hoveredNodeId) return true;
    return sourceId === hoveredNodeId || targetId === hoveredNodeId;
  };

  const hoveredNode = nodes.find(n => n.id === hoveredNodeId);

  return (
    <div className="space-y-4 font-mono select-none">
      <div className="relative border-2 border-[#D4A574]/40 bg-[#1A2340] p-1 flex justify-center shadow-[inset_0_0_10px_black] overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-w-[380px] max-w-[500px]">
          {/* Render Graph Links */}
          {links.map((link, idx) => {
            const start = nodePositions[link.source];
            const end = nodePositions[link.target];
            if (!start || !end) return null;

            const active = isLinked(link.source, link.target);

            return (
              <g key={idx} className="transition-opacity duration-300">
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={active ? '#D4A574' : '#243054'}
                  strokeWidth={active ? '2' : '1'}
                  opacity={active ? '0.85' : '0.15'}
                />
                {/* Midpoint Label on Active Hover */}
                {hoveredNodeId && active && (
                  <g transform={`translate(${(start.x + end.x) / 2}, ${(start.y + end.y) / 2})`}>
                    <rect
                      x="-35"
                      y="-8"
                      width="70"
                      height="14"
                      fill="#1A2340"
                      stroke="#D4A574"
                      strokeWidth="0.5"
                    />
                    <text
                      textAnchor="middle"
                      y="2"
                      fill="#F4EAD5"
                      fontSize="7"
                      fontFamily="Press Start 2P"
                    >
                      {link.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Graph Nodes */}
          {nodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isHovered = hoveredNodeId === node.id;
            const isCenter = node.id === 'year';
            const color = getThemeColor(node.type);

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Node Box or Circle */}
                {isCenter ? (
                  <rect
                    x="-24"
                    y="-12"
                    width="48"
                    height="24"
                    fill="#D4A574"
                    stroke="#F4EAD5"
                    strokeWidth="2"
                    className="transition-all"
                  />
                ) : (
                  <circle
                    r={isHovered ? '9' : '7'}
                    fill={color}
                    stroke="#1A2340"
                    strokeWidth="1.5"
                    className="transition-all duration-200"
                  />
                )}

                {/* Node Label text */}
                <text
                  y={isCenter ? '5' : '18'}
                  textAnchor="middle"
                  fill={isCenter ? '#1A2340' : '#F4EAD5'}
                  fontSize={isCenter ? '10' : '9'}
                  fontWeight={isCenter ? 'bold' : 'normal'}
                  fontFamily={isCenter ? 'Press Start 2P' : 'VT323'}
                  className={`${isHovered && !isCenter ? 'fill-[#E8C77A] font-bold text-[11px]' : ''}`}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info readout panel */}
      <div className="bg-[#243054] border border-[#D4A574]/40 p-2 text-center h-12 flex items-center justify-center">
        {hoveredNode ? (
          <div className="text-xs md:text-sm font-vt323">
            <span className="font-press-start text-[8px] text-[#E8C77A] mr-2">
              [{hoveredNode.type.toUpperCase()}]
            </span>
            <span className="text-[#F4EAD5] font-bold">{hoveredNode.label}</span>
          </div>
        ) : (
          <span className="text-[#F4EAD5]/40 text-xs font-vt323">
            Hover over nodes to trace connections in music and world milestones.
          </span>
        )}
      </div>
    </div>
  );
}
