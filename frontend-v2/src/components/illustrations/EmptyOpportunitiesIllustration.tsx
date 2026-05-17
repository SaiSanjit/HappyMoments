import React from 'react';
import { motion } from 'framer-motion';

interface Props { className?: string }

export const EmptyOpportunitiesIllustration: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'text-orange-500 overflow-visible'}
      style={{ overflow: 'visible' }}
    >
      {/* Layer 0: Background glow */}
      <circle cx="60" cy="60" r="50" fill="currentColor" fillOpacity="0.06" />

      {/* Layer 1: Kanban card — left (short) */}
      <motion.rect
        x="14" y="65" width="24" height="28" rx="4"
        fill="currentColor" fillOpacity="0.1"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.0, duration: 0.45, ease: 'easeOut' }}
      />
      <motion.rect x="18" y="69" width="14" height="2" rx="1" fill="currentColor" fillOpacity="0.4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} />
      <motion.rect x="18" y="74" width="10" height="2" rx="1" fill="currentColor" fillOpacity="0.25"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />

      {/* Layer 1b: Kanban card — center (medium) */}
      <motion.rect
        x="48" y="52" width="24" height="40" rx="4"
        fill="currentColor" fillOpacity="0.12"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.45, ease: 'easeOut' }}
      />
      <motion.rect x="52" y="56" width="14" height="2" rx="1" fill="currentColor" fillOpacity="0.4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} />
      <motion.rect x="52" y="61" width="10" height="2" rx="1" fill="currentColor" fillOpacity="0.25"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />

      {/* Layer 1c: Kanban card — right (tallest, accent) */}
      <motion.rect
        x="82" y="42" width="24" height="51" rx="4"
        fill="currentColor" fillOpacity="0.15"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
      />
      <motion.rect x="86" y="46" width="14" height="2" rx="1" fill="currentColor" fillOpacity="0.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} />
      <motion.rect x="86" y="51" width="10" height="2" rx="1" fill="currentColor" fillOpacity="0.3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />

      {/* Layer 2: Arrows between cards */}
      <motion.path
        d="M40 78 L46 78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      />
      <motion.path
        d="M44 75 L47 78 L44 81" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        fill="none"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.35 }}
      />
      <motion.path
        d="M74 72 L80 72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      />
      <motion.path
        d="M78 69 L81 72 L78 75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        fill="none"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.4 }}
      />

      {/* Layer 3: Trophy — spring focal element */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 220, damping: 12 }}
        style={{ transformOrigin: '60px 30px' }}
      >
        {/* Trophy cup body */}
        <path
          d="M48 18 Q48 36 54 38 H50 V42 H70 V38 H66 Q72 36 72 18 Z"
          fill="currentColor" fillOpacity="0.15"
          stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
        />
        {/* Trophy handles */}
        <path d="M48 20 Q40 20 40 28 Q40 34 48 34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M72 20 Q80 20 80 28 Q80 34 72 34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        {/* Trophy base */}
        <rect x="50" y="42" width="20" height="4" rx="1.5" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Star inside trophy */}
        <path d="M60 23 L61.5 27.5 L66 27.5 L62.5 30 L64 34.5 L60 32 L56 34.5 L57.5 30 L54 27.5 L58.5 27.5 Z"
          fill="currentColor" fillOpacity="0.7" />
      </motion.g>

      {/* Infinite: trophy gentle float */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
        style={{ transformOrigin: '60px 30px' }}
      >
        <circle cx="60" cy="30" r="0" fill="none" />
      </motion.g>

      {/* Layer 4: Large sparkle top-left */}
      <motion.path
        d="M20 30L22.5 35.5L28 38L22.5 40.5L20 46L17.5 40.5L12 38L17.5 35.5L20 30Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.6, 0.5] }}
        transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
      />
      <motion.path
        d="M20 30L22.5 35.5L28 38L22.5 40.5L20 46L17.5 40.5L12 38L17.5 35.5L20 30Z"
        fill="currentColor"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Layer 5: Medium sparkle top-right */}
      <motion.path
        d="M95 20L96.5 24L100 25.5L96.5 27L95 31L93.5 27L90 25.5L93.5 24L95 20Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 0.6] }}
        transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
      />

      {/* Layer 6: Small sparkle bottom-right */}
      <motion.path
        d="M85 95L86 98L89 99L86 100L85 103L84 100L81 99L84 98L85 95Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.0, duration: 0.8, type: 'spring' }}
      />
    </svg>
  );
};
