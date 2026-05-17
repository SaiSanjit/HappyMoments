import React from 'react';
import { motion } from 'framer-motion';

interface Props { className?: string }

export const EmptyTerritoriesIllustration: React.FC<Props> = ({ className }) => {
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

      {/* Layer 1: Map base / ground ellipse */}
      <motion.ellipse
        cx="60" cy="90" rx="38" ry="8"
        fill="currentColor" fillOpacity="0.08"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.0, duration: 0.5, ease: 'easeOut' }}
      />

      {/* Layer 1b: Winding road / territory boundary */}
      <motion.path
        d="M22 88 Q35 70 50 72 Q65 74 75 60 Q85 48 98 52"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeDasharray="5 3" strokeOpacity="0.3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
      />

      {/* Layer 2: Secondary small pin (territory marker) */}
      <motion.g
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 0.5 }}
        transition={{ delay: 0.25, duration: 0.4, ease: 'easeOut' }}
      >
        <circle cx="40" cy="72" r="5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        <path d="M40 72 Q36 79 40 84 Q44 79 40 72 Z" fill="currentColor" fillOpacity="0.3" />
      </motion.g>
      <motion.g
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 0.5 }}
        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
      >
        <circle cx="85" cy="55" r="5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        <path d="M85 55 Q81 62 85 67 Q89 62 85 55 Z" fill="currentColor" fillOpacity="0.3" />
      </motion.g>

      {/* Layer 3: Main map pin — spring focal */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 220, damping: 11 }}
        style={{ transformOrigin: '60px 52px' }}
      >
        {/* Pin head (circle) */}
        <circle cx="60" cy="44" r="16"
          fill="currentColor" fillOpacity="0.2"
          stroke="currentColor" strokeWidth="2.5" />
        {/* Pin teardrop tail */}
        <path d="M52 55 Q48 68 60 78 Q72 68 68 55"
          fill="currentColor" fillOpacity="0.15"
          stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {/* Inner dot */}
        <circle cx="60" cy="44" r="6" fill="currentColor" />
        <circle cx="60" cy="44" r="3" fill="white" />
      </motion.g>

      {/* Infinite: pin float */}
      <motion.g
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
        style={{ transformOrigin: '60px 52px' }}
      >
        <circle cx="60" cy="44" r="0" fill="none" />
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
        d="M85 85L86 88L89 89L86 90L85 93L84 90L81 89L84 88L85 85Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.0, duration: 0.8, type: 'spring' }}
      />
    </svg>
  );
};
