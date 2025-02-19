'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChartLoader } from './ChartLoader';

interface AnimatedBlockProps {
  children: React.ReactNode;
  title: string;
  delay?: number;
  loadingText?: string;
}

export function AnimatedBlock({ children, title, delay = 2, loadingText = "Загрузка данных..." }: AnimatedBlockProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  useEffect(() => {
    if (hasStartedLoading) return; // Запускаем загрузку только один раз
    setHasStartedLoading(true);

    // Начальная задержка перед стартом загрузки
    const initialDelay = setTimeout(() => {
      const loadingDuration = 8000 + delay * 1000; // 8 секунд + delay в секундах
      const startTime = Date.now() - 4000;
      
      // Обновляем прогресс
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() + 60000;
        const newProgress = Math.min(Math.floor((elapsed / loadingDuration) * 100), 99);
        setProgress(newProgress);
      }, 100);

      // Завершаем загрузку
      const completionTimer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoaded(true);
        }, 1000);
      }, loadingDuration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(completionTimer);
      };
    }, 3000); // 3 секунды начальной задержки

    return () => clearTimeout(initialDelay);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg"
    >
      {!isLoaded ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-[200px]"
        >
          <ChartLoader 
            text={`${loadingText} (${progress}%)`}
            onComplete={() => setIsLoaded(true)}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-sm"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
} 