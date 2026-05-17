import React from 'react';
import { motion } from 'framer-motion';

interface Props { className?: string }

export const EmptyDiscussionsIllustration: React.FC<Props> = ({ className }) => {
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

      {/* Layer 1: Back speech bubble (secondary) */}
      <motion.path
        d="M72 38 Q72 28 80 28 H97 Q105 28 105 38 Q105 48 97 48 H84 L76 56 L78 48 H72 Q72 48 72 38 Z"
        fill="#F8FAFC"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"
        fillOpacity="0.8"
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.0, duration: 0.5, ease: 'easeOut' }}
      />
      {/* Text lines in back bubble */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.15 }}>
        <rect x="77" y="33" width="22" height="2" rx="1" fill="currentColor" />
        <rect x="77" y="38" width="16" height="2" rx="1" fill="currentColor" />
      </motion.g>

      {/* Layer 2: Main front speech bubble */}
      <motion.path
        d="M18 45 Q18 32 30 32 H72 Q84 32 84 45 Q84 58 72 58 H42 L30 68 L32 58 H30 Q18 58 18 45 Z"
        fill="white"
        stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
      />
      {/* Text lines in main bubble */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <rect x="26" y="39" width="48" height="2.5" rx="1.2" fill="currentColor" fillOpacity="0.25" />
        <rect x="26" y="45" width="36" height="2.5" rx="1.2" fill="currentColor" fillOpacity="0.18" />
      </motion.g>

      {/* Layer 3: Typing dots (spring focal, collaborative warm) */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 12 }}
        style={{ transformOrigin: '51px 52px' }}
      >
        <motion.circle cx="43" cy="52" r="3" fill="currentColor"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 1.4, ease: 'easeInOut' }} />
        <motion.circle cx="51" cy="52" r="3" fill="currentColor"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 1.55, ease: 'easeInOut' }} />
        <motion.circle cx="59" cy="52" r="3" fill="currentColor"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 1.7, ease: 'easeInOut' }} />
      </motion.g>

      {/* Infinite: bubble gentle bob */}
      <motion.path
        d="M18 45 Q18 32 30 32 H72 Q84 32 84 45 Q84 58 72 58 H42 L30 68 L32 58 H30 Q18 58 18 45 Z"
        fill="none" stroke="none"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
      />

      {/* Layer 4: Large sparkle top-left */}
      <motion.path
        d="M20 20L22.5 25.5L28 28L22.5 30.5L20 36L17.5 30.5L12 28L17.5 25.5L20 20Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.6, 0.5] }}
        transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
      />
      <motion.path
        d="M20 20L22.5 25.5L28 28L22.5 30.5L20 36L17.5 30.5L12 28L17.5 25.5L20 20Z"
        fill="currentColor"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
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
        d="M90 85L91 88L94 89L91 90L90 93L89 90L86 89L89 88L90 85Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.0, duration: 0.8, type: 'spring' }}
      />
    </svg>
  );
};
