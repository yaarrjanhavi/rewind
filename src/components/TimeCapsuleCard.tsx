'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { TimeCapsule } from '../types';
import { Briefcase, Shirt, Cpu, Radio, Sparkles, CircleDollarSign } from 'lucide-react';

interface TimeCapsuleCardProps {
  capsule: TimeCapsule;
}

export default function TimeCapsuleCard({ capsule }: TimeCapsuleCardProps) {
  const cards = [
    {
      title: 'SALARY',
      icon: <CircleDollarSign size={16} className="text-[#E8C77A]" />,
      content: [capsule.averageSalary || 'N/A'],
      desc: 'Estimated average income'
    },
    {
      title: 'POPULAR JOBS',
      icon: <Briefcase size={16} className="text-[#E8C77A]" />,
      content: capsule.popularJobs || [],
      desc: 'Common fields of employment'
    },
    {
      title: 'FASHION',
      icon: <Shirt size={16} className="text-[#E8C77A]" />,
      content: capsule.fashion || [],
      desc: 'Style, garments, & accessories'
    },
    {
      title: 'TECHNOLOGY',
      icon: <Cpu size={16} className="text-[#E8C77A]" />,
      content: capsule.technology || [],
      desc: 'Consumer gadgets & microchips'
    },
    {
      title: 'MUSIC HABITS',
      icon: <Radio size={16} className="text-[#E8C77A]" />,
      content: capsule.musicHabits || [],
      desc: 'How audio media was consumed'
    },
    {
      title: 'LIFESTYLE',
      icon: <Sparkles size={16} className="text-[#E8C77A]" />,
      content: capsule.lifestyle || [],
      desc: 'Social activities & pastimes'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          whileHover={{ y: -5, rotate: index % 2 === 0 ? 1 : -1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="
            bg-[#243054] text-[#F4EAD5] p-3
            border-4 border-t-[#F4EAD5]/90 border-l-[#F4EAD5]/90 border-b-[#1A2340] border-r-[#1A2340]
            shadow-[3px_3px_0px_#1A2340]
            flex flex-col justify-between
            cursor-pointer select-none
          "
        >
          {/* Card Header */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-[#D4A574]/40 pb-2 mb-2">
            <span className="font-press-start text-[9px] text-[#E8C77A] tracking-wider">
              {card.title}
            </span>
            {card.icon}
          </div>

          {/* Card Body */}
          <ul className="flex-1 space-y-1.5 font-vt323 text-lg leading-snug">
            {card.content.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-[#D4A574] mr-2">▪</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Card Footer */}
          <div className="border-t border-[#D4A574]/20 pt-2 mt-3 text-[10px] text-[#F4EAD5]/40 font-mono italic">
            {card.desc}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
