import React from 'react';
import { motion } from 'framer-motion';

interface Props { className?: string }

export const EmptyTeamIllustration: React.FC<Props> = ({ className }) => {
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

      {/* Layer 1: Left avatar circle */}
      <motion.circle
        cx="38" cy="62" r="19"
        fill="#F8FAFC" stroke="currentColor" strokeWidth="2"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.0, duration: 0.5, ease: 'easeOut' }}
      />
      {/* Left person head */}
      <motion.circle cx="38" cy="54" r="7" fill="currentColor" fillOpacity="0.2"
        stroke="currentColor" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
      {/* Left person shoulders */}
      <motion.path d="M24 75 Q38 65 52 75" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} />

      {/* Layer 1b: Right avatar circle */}
      <motion.circle
        cx="82" cy="62" r="19"
        fill="#F8FAFC" stroke="currentColor" strokeWidth="2"
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
      />
      {/* Right person head */}
      <motion.circle cx="82" cy="54" r="7" fill="currentColor" fillOpacity="0.2"
        stroke="currentColor" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
      {/* Right person shoulders */}
      <motion.path d="M68 75 Q82 65 96 75" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} />

      {/* Layer 2: Center avatar circle (larger, focal) */}
      <motion.circle
        cx="60" cy="58" r="23"
        fill="white" stroke="currentColor" strokeWidth="2.5"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
      />

      {/* Layer 3: Center person — spring focal */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 12 }}
        style={{ transformOrigin: '60px 50px' }}
      >
        {/* Head */}
        <circle cx="60" cy="47" r="10" fill="currentColor" fillOpacity="0.25"
          stroke="currentColor" strokeWidth="2" />
        {/* Shoulders */}
        <path d="M42 72 Q60 60 78 72" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>

      {/* Plus badge (invite indicator) */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.55, type: 'spring', stiffness: 280, damping: 14 }}
        style={{ transformOrigin: '78px 38px' }}
      >
        <circle cx="78" cy="38" r="9" fill="currentColor" />
        <line x1="78" y1="33" x2="78" y2="43" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="73" y1="38" x2="83" y2="38" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </motion.g>

      {/* Infinite: center person gentle bob */}
      <motion.circle cx="60" cy="58" r="0" fill="none"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }} />

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
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
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
        d="M88 90L89 93L92 94L89 95L88 98L87 95L84 94L87 93L88 90Z"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.0, duration: 0.8, type: 'spring' }}
      />
    </svg>
  );
};
