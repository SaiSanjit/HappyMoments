import React from 'react';
import { motion } from 'framer-motion';

interface Props { className?: string }

export const EmptyFavoritesIllustration: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'text-rose-500 overflow-visible'}
      style={{ overflow: 'visible' }}
    >
      {/* Layer 0: Background glow */}
      <circle cx="60" cy="60" r="50" fill="currentColor" fillOpacity="0.06" />

      {/* Layer 1: Back small heart (offset, lighter) */}
      <motion.path
        d="M82 35 Q82 26 89 26 Q96 26 96 33 Q96 42 82 50 Q68 42 68 33 Q68 26 75 26 Q82 26 82 35 Z"
        fill="currentColor" fillOpacity="0.12"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.0, duration: 0.5, ease: 'easeOut' }}
      />

      {/* Layer 1b: Back small heart left */}
      <motion.path
        d="M33 42 Q33 35 38.5 35 Q44 35 44 40 Q44 47 33 54 Q22 47 22 40 Q22 35 27.5 35 Q33 35 33 42 Z"
        fill="currentColor" fillOpacity="0.10"
        stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, duration: 0.5, ease: 'easeOut' }}
      />

      {/* Layer 2: Main heart body */}
      <motion.path
        d="M60 88 Q22 70 22 46 Q22 28 38 28 Q50 28 60 42 Q70 28 82 28 Q98 28 98 46 Q98 70 60 88 Z"
        fill="white"
        stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
      />

      {/* Layer 3: Inner filled heart highlight — spring focal */}
      <motion.path
        d="M60 80 Q30 64 30 46 Q30 36 38 36 Q50 36 60 50 Q70 36 82 36 Q90 36 90 46 Q90 64 60 80 Z"
        fill="currentColor" fillOpacity="0.18"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 12 }}
      />

      {/* Infinite: heartbeat pulse */}
      <motion.path
        d="M60 88 Q22 70 22 46 Q22 28 38 28 Q50 28 60 42 Q70 28 82 28 Q98 28 98 46 Q98 70 60 88 Z"
        fill="currentColor" fillOpacity="0.05"
        animate={{ scale: [1, 1.05, 1, 1.05, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1.6, times: [0, 0.2, 0.4, 0.6, 1] }}
        style={{ transformOrigin: '60px 58px' }}
      />

      {/* Floating small heart top */}
      <motion.path
        d="M60 25 Q60 20 63.5 20 Q67 20 67 23.5 Q67 28 60 32 Q53 28 53 23.5 Q53 20 56.5 20 Q60 20 60 25 Z"
        fill="currentColor" fillOpacity="0.5"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [-2, -8, -14], opacity: [0, 0.7, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 1.8 }}
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

      {/* Layer 6: Small sparkle bottom-right */}
      <motion.path
        d="M90 88L91 91L94 92L91 93L90 96L89 93L86 92L89 91L90 88Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.0, duration: 0.8, type: 'spring' }}
      />
    </svg>
  );
};
