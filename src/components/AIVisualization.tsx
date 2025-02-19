'use client';

import React from 'react';

interface AIVisualizationProps {
  isHovered: boolean;
}

export function AIVisualization({ isHovered }: AIVisualizationProps) {
  return (
    <div className="quiz-container">
      <div className="mood-container">
        <div className={`mood-gradient-bg ${isHovered ? 'hovered' : ''}`} />
        <div className={`mood-glass-circle circle-1 ${isHovered ? 'hovered' : ''}`} />
        <div className={`mood-glass-circle circle-2 ${isHovered ? 'hovered' : ''}`} />
        <div className={`mood-glass-circle circle-3 ${isHovered ? 'hovered' : ''}`} />
      </div>

      <style jsx>{`
        .quiz-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          position: relative;
          overflow: visible;
        }

        .mood-container {
          position: relative;
          width: 294px;
          height: 294px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: visible;
        }

        /* Базовый градиент с плавным переходом */
        .mood-gradient-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mood-gradient-bg::before,
        .mood-gradient-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          filter: blur(30px);
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mood-gradient-bg::before {
          background: linear-gradient(45deg, #4F46E5, #6366F1);
          opacity: 1;
        }

        .mood-gradient-bg::after {
          background: linear-gradient(45deg, #6366F1, #2CD9FF, #6366F1);
          background-size: 200% 200%;
          opacity: 0;
          animation: gradientShift 3s ease infinite;
        }

        /* Ховер состояние для градиента */
        .mood-gradient-bg.hovered {
          transform: scale(1.05);
        }

        .mood-gradient-bg.hovered::before {
          opacity: 0;
        }

        .mood-gradient-bg.hovered::after {
          opacity: 1;
        }

        /* Базовые стили для кругов */
        .mood-glass-circle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          animation-duration: 20s;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Базовые анимации для кругов */
        .circle-1 {
          width: 100%;
          height: 100%;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: rotate_clockwise 20s linear infinite,
                     gentleMorph 15s ease-in-out infinite;
        }

        .circle-2 {
          width: 80%;
          height: 80%;
          border-radius: 40% 60% 70% 30% / 40% 50% 50% 60%;
          animation: rotate_counter_clockwise 20s linear infinite,
                     gentleMorph 20s ease-in-out infinite reverse;
        }

        .circle-3 {
          width: 60%;
          height: 60%;
          border-radius: 53% 47% 47% 53% / 36% 50% 50% 64%;
          animation: rotate_clockwise 20s linear infinite,
                     gentleMorph 18s ease-in-out infinite;
        }

        /* Более спокойная анимация морфинга */
        @keyframes gentleMorph {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%;
          }
        }

        /* Обновляем анимацию градиента */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Базовые анимации для кругов */
        .circle-1 {
          width: 100%;
          height: 100%;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation-name: rotate_clockwise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .circle-2 {
          width: 80%;
          height: 80%;
          border-radius: 40% 60% 70% 30% / 40% 50% 50% 60%;
          animation-name: rotate_counter_clockwise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .circle-3 {
          width: 60%;
          height: 60%;
          border-radius: 53% 47% 47% 53% / 36% 50% 50% 64%;
          animation-name: rotate_clockwise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        /* Базовые кейфреймы */
        @keyframes rotate_clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rotate_counter_clockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}