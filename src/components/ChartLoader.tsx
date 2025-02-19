'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ChartLoaderProps {
  text: string;
  onComplete?: () => void;
}

export function ChartLoader({ text, onComplete }: ChartLoaderProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-[400px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="w-16 h-16 border-4 border-green-500 rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-gray-600"
      >
        {text}
      </motion.p>
    </motion.div>
  );
} 