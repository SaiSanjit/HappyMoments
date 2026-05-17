import React from 'react';
import { motion } from 'framer-motion';

interface Props { className?: string }

export const EmptyLeadsIllustration: React.FC<Props> = ({ className }) => {
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

      {/* Layer 1: Lens outer ring */}
      <motion.circle
        cx="50" cy="50" r="28"
        fill="white" stroke="currentColor" strokeWidth="3"
        strokeLinejoin="round"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
      />

      {/* Layer 1b: Handle */}
      <motion.line
        x1="70" y1="70" x2="90" y2="90"
        stroke="currentColor" strokeWidth="6" strokeLinecap="round"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      />

      {/* Layer 2: Inner dashed target ring */}
      <motion.circle
        cx="50" cy="50" r="16"
        fill="none" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="4 3" strokeLinecap="round"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
      />

      {/* Layer 2b: Crosshair lines */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <line x1="50" y1="37" x2="50" y2="63" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="37" y1="50" x2="63" y2="50" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </motion.g>

      {/* Layer 3: Center target dot — spring focal */}
      <motion.circle
        cx="50" cy="50" r="5"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 250, damping: 12 }}
      />

      {/* Infinite: lens gentle breathing */}
      <motion.circle
        cx="50" cy="50" r="28"
        fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

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
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
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
        d="M85 85L86 88L89 89L86 90L85 93L84 90L81 89L84 88L85 85Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.0, duration: 0.8, type: 'spring' }}
      />
    </svg>
  );
};
