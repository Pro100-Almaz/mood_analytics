'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AIAnimation = () => {
  return (
    <div className="flex justify-center items-center my-12">
      <motion.div
        className="w-64 h-64 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <span className="text-4xl font-bold text-white">AI</span>
      </motion.div>
    </div>
  );
};

export default AIAnimation; 