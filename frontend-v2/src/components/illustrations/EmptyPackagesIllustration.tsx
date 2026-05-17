import React from 'react';
import { motion } from 'framer-motion';

interface Props { className?: string }

export const EmptyPackagesIllustration: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'text-amber-500 overflow-visible'}
      style={{ overflow: 'visible' }}
    >
      {/* Layer 0: Background glow */}
      <circle cx="60" cy="60" r="50" fill="currentColor" fillOpacity="0.06" />

      {/* Layer 1: Shadow ellipse */}
      <motion.ellipse
        cx="60" cy="96" rx="28" ry="5"
        fill="currentColor" fillOpacity="0.1"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.0, duration: 0.4, ease: 'easeOut' }}
      />

      {/* Layer 1b: Box right side face */}
      <motion.path
        d="M82 46 L96 36 L96 82 L82 92 Z"
        fill="currentColor" fillOpacity="0.12"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        initial={{ x: 6, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.45, ease: 'easeOut' }}
      />

      {/* Layer 2: Box front face */}
      <motion.rect
        x="28" y="46" width="54" height="46" rx="3"
        fill="white"
        stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45, ease: 'easeOut' }}
      />

      {/* Layer 2b: Box top face */}
      <motion.path
        d="M28 46 L44 34 L96 34 L82 46 Z"
        fill="currentColor" fillOpacity="0.15"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
      />

      {/* Layer 2c: Center stripe on front */}
      <motion.line
        x1="55" y1="46" x2="55" y2="92"
        stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }}
      />

      {/* Layer 3: Ribbon bow — spring focal */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 240, damping: 12 }}
        style={{ transformOrigin: '55px 38px' }}
      >
        {/* Ribbon horizontal */}
        <line x1="28" y1="38" x2="82" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="55" y1="46" x2="55" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Bow left loop */}
        <path d="M55 38 Q44 28 38 30 Q34 32 38 36 Q42 40 55 38 Z"
          fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Bow right loop */}
        <path d="M55 38 Q66 28 72 30 Q76 32 72 36 Q68 40 55 38 Z"
          fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Bow center knot */}
        <circle cx="55" cy="38" r="3.5" fill="currentColor" />
      </motion.g>

      {/* Infinite: box gentle float */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
        style={{ transformOrigin: '60px 65px' }}
      >
        <circle cx="60" cy="65" r="0" fill="none" />
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
        d="M98 18L99.5 22L103 23.5L99.5 25L98 29L96.5 25L93 23.5L96.5 22L98 18Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 0.6] }}
        transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
      />

      {/* Layer 6: Small sparkle bottom-right */}
      <motion.path
        d="M88 88L89 91L92 92L89 93L88 96L87 93L84 92L87 91L88 88Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.0, duration: 0.8, type: 'spring' }}
      />
    </svg>
  );
};
