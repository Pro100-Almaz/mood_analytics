'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ResearchStep, StepStatus } from '@/types/research';

interface ProgressCardProps {
  title: string;
  steps: ResearchStep[];
  currentStep: number;
  isCompleted: boolean;
}

export function ProgressCard({ title, steps, currentStep, isCompleted }: ProgressCardProps) {
  const getStatusStyles = (status: StepStatus, index: number) => {
    const styles = {
      icon: '',
      color: '',
      animation: false,
      indicator: ''
    };

    if (index === currentStep) {
      status = 'active';
    } else if (index < currentStep) {
      status = 'completed';
    }

    switch (status) {
      case 'active':
        styles.icon = '▶';
        styles.color = 'text-indigo-600';
        styles.animation = true;
        styles.indicator = 'bg-indigo-500';
        break;
      case 'completed':
        styles.icon = '✓';
        styles.color = 'text-green-600';
        styles.indicator = 'bg-green-500';
        break;
      case 'error':
        styles.icon = '⚠';
        styles.color = 'text-red-600';
        styles.indicator = 'bg-red-500';
        break;
      default:
        styles.icon = '○';
        styles.color = 'text-gray-400';
        styles.indicator = 'bg-gray-300';
    }

    return styles;
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200
                 shadow-lg hover:shadow-xl transition-all"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-xl font-light mb-6 text-green-600">{title}</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const styles = getStatusStyles(step.status, index);
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3 group">
                <div className="flex items-center space-x-3 min-w-[20px]">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${styles.indicator}`}
                    animate={styles.animation ? {
                      scale: [1, 1.5, 1],
                      transition: { repeat: Infinity, duration: 2 }
                    } : {}}
                  />
                </div>
                <div className={`flex-1 flex items-center space-x-2 ${styles.color}`}>
                  <span className="text-sm transition-colors duration-300">
                    {step.text}
                  </span>
                  {styles.animation && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-xs"
                    >
                      ●●●
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-green-500 text-sm font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Анализ завершен</span>
        </motion.div>
      )}
    </motion.div>
  );
} 