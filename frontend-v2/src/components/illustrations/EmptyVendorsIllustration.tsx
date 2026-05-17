import React from 'react';
import { motion } from 'framer-motion';

interface Props { className?: string }

export const EmptyVendorsIllustration: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'overflow-visible'}
      style={{ overflow: 'visible' }}
    >
      {/* Layer 0: Background glow */}
      <circle cx="60" cy="60" r="50" fill="currentColor" fillOpacity="0.06" />

      {/* Layer 1: Vendor cards behind the glass */}
      <motion.rect
        x="12" y="52" width="28" height="36" rx="5"
        fill="currentColor" fillOpacity="0.10"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.0, duration: 0.45, ease: 'easeOut' }}
      />
      <motion.rect x="16" y="56" width="20" height="3" rx="1.5" fill="currentColor" fillOpacity="0.3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
      <motion.rect x="16" y="62" width="14" height="2" rx="1" fill="currentColor" fillOpacity="0.2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} />
      <motion.rect x="16" y="67" width="16" height="2" rx="1" fill="currentColor" fillOpacity="0.15"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} />

      <motion.rect
        x="80" y="40" width="28" height="36" rx="5"
        fill="currentColor" fillOpacity="0.10"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.45, ease: 'easeOut' }}
      />
      <motion.rect x="84" y="44" width="20" height="3" rx="1.5" fill="currentColor" fillOpacity="0.3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} />
      <motion.rect x="84" y="50" width="14" height="2" rx="1" fill="currentColor" fillOpacity="0.2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />

      {/* Layer 2: Magnifying glass lens ring */}
      <motion.circle
        cx="52" cy="52" r="28"
        fill="currentColor" fillOpacity="0.08"
        stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
      />

      {/* Layer 2b: Inner details — storefront lines visible through lens */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {/* Door */}
        <rect x="46" y="54" width="12" height="16" rx="2"
          fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Awning */}
        <path d="M34 50 H70 L66 44 H38 Z"
          fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Left window */}
        <rect x="36" y="52" width="8" height="6" rx="1.5"
          fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1" />
        {/* Right window */}
        <rect x="66" y="52" width="8" height="6" rx="1.5"
          fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1" />
      </motion.g>

      {/* Layer 3: Handle — spring focal */}
      <motion.line
        x1="73" y1="73" x2="96" y2="96"
        stroke="currentColor" strokeWidth="7" strokeLinecap="round"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 12 }}
        style={{ transformOrigin: '73px 73px' }}
      />

      {/* Infinite: lens gentle pulse */}
      <motion.circle
        cx="52" cy="52" r="28"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{ transformOrigin: '52px 52px' }}
      />

      {/* Layer 4: Large sparkle top-left */}
      <motion.path
        d="M20 25L22.5 30.5L28 33L22.5 35.5L20 41L17.5 35.5L12 33L17.5 30.5L20 25Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.6, 0.5] }}
        transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
      />
      <motion.path
        d="M20 25L22.5 30.5L28 33L22.5 35.5L20 41L17.5 35.5L12 33L17.5 30.5L20 25Z"
        fill="currentColor"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Layer 5: Medium sparkle top-right */}
      <motion.path
        d="M100 18L101.5 22L105 23.5L101.5 25L100 29L98.5 25L95 23.5L98.5 22L100 18Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 0.6] }}
        transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
      />

      {/* Layer 6: Small sparkle bottom-left */}
      <motion.path
        d="M22 88L23 91L26 92L23 93L22 96L21 93L18 92L21 91L22 88Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.0, duration: 0.8, type: 'spring' }}
      />
    </svg>
  );
};
