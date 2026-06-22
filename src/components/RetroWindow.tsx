'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';

interface RetroWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  activeId: string;
  onFocus: (id: string) => void;
  defaultPosition?: { x: number; y: number };
  width?: string;
  height?: string;
}

export default function RetroWindow({
  id,
  title,
  children,
  onClose,
  activeId,
  onFocus,
  defaultPosition = { x: 50, y: 50 },
  width = 'w-full md:w-[600px]',
  height = 'h-auto'
}: RetroWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const isActive = activeId === id;

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <div
        onClick={() => {
          setIsMinimized(false);
          onFocus(id);
        }}
        className={`fixed bottom-4 z-40 bg-[#243054] text-[#F4EAD5] border-2 border-t-[#D4A574] border-l-[#D4A574] border-b-[#1A2340] border-r-[#1A2340] cursor-pointer hover:bg-[#D4A574]/10 select-none py-1.5 px-3 flex items-center justify-between shadow-md max-w-[200px] truncate`}
      >
        <span className="font-press-start text-[9px] truncate mr-2">{title}</span>
        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: defaultPosition.y + 20, x: defaultPosition.x }}
      animate={
        isMaximized
          ? { x: 0, y: 0, width: '100%', height: 'calc(100vh - 32px)', scale: 1, opacity: 1 }
          : { x: defaultPosition.x, y: defaultPosition.y, scale: 1, opacity: 1 }
      }
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      drag={!isMaximized}
      dragMomentum={false}
      dragHandleClassName="window-title-bar"
      onDragStart={() => onFocus(id)}
      onClickCapture={() => onFocus(id)}
      style={{
        zIndex: isActive ? 100 : 30,
        position: isMaximized ? 'fixed' : 'absolute',
        top: isMaximized ? '0px' : 'auto',
        left: isMaximized ? '0px' : 'auto'
      }}
      className={`
        ${isMaximized ? 'w-full h-full' : `${width} ${height}`}
        bg-[#243054] text-[#F4EAD5] 
        border-4 border-t-[#E8C77A] border-l-[#E8C77A] border-b-[#1A2340] border-r-[#1A2340]
        shadow-[4px_4px_0px_#1A2340]
        flex flex-col select-none
        overflow-hidden
      `}
    >
      {/* Window Title Bar */}
      <div
        className={`
          window-title-bar
          flex items-center justify-between p-1.5 md:p-2 cursor-move
          ${isActive ? 'bg-[#D4A574] text-[#1A2340]' : 'bg-[#1A2340]/40 text-[#F4EAD5]/70'}
          border-b-2 border-b-[#1A2340]
        `}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 border border-[#F4EAD5]/40 flex-shrink-0 bg-[#243054]`} />
          <span className="font-press-start text-[10px] md:text-[11px] font-bold tracking-tight select-none uppercase truncate max-w-[250px] md:max-w-md">
            {title}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {/* Minimize button */}
          <button
            onClick={toggleMinimize}
            className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-[#243054] hover:bg-[#D4A574]/20 border border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340] active:border-t-[#1A2340] active:border-l-[#1A2340] active:border-b-[#F4EAD5] active:border-r-[#F4EAD5] text-[#F4EAD5] cursor-pointer"
          >
            <Minus size={11} className="stroke-[3]" />
          </button>
          
          {/* Maximize button */}
          <button
            onClick={toggleMaximize}
            className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-[#243054] hover:bg-[#D4A574]/20 border border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340] active:border-t-[#1A2340] active:border-l-[#1A2340] active:border-b-[#F4EAD5] active:border-r-[#F4EAD5] text-[#F4EAD5] cursor-pointer"
          >
            <Square size={10} className="stroke-[3]" />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-[#243054] hover:bg-red-800 border border-t-[#F4EAD5] border-l-[#F4EAD5] border-b-[#1A2340] border-r-[#1A2340] active:border-t-[#1A2340] active:border-l-[#1A2340] active:border-b-[#F4EAD5] active:border-r-[#F4EAD5] text-[#F4EAD5] cursor-pointer"
          >
            <X size={11} className="stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Window Body Contents */}
      <div className="flex-1 p-3 overflow-y-auto font-vt323 text-lg md:text-xl leading-relaxed custom-scrollbar h-full">
        {children}
      </div>
    </motion.div>
  );
}
