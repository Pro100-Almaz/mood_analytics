'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressCard } from '@/components/ProgressCard';
import { AIVisualization } from '@/components/AIVisualization';

const titles = [
    'Анализ веб-ресурсов',
    'Анализ социальных медиа',
    'Анализ обращений',
    'Анализ законодательства',
];

const webSteps = [
    'ищу релевантные веб-ресурсы и источники...',
    'оцениваю достоверность и качество найденных источников...',
    'анализирую содержание выбранных материалов...',
    'выделяю основные выводы и ключевые инсайты...',
    'готовлю рекомендации на основе анализа...'
];

const socialSteps = [
    'ищу релевантные посты и обсуждения в социальных медиа...',
    'собираю и структурирую комментарии пользователей...',
    'выполняю анализ тональности (сентимент-анализ)...',
    'выделяю ключевые темы и тренды в обсуждениях...',
    'оцениваю влияние трендов на общественное мнение...',
    'готовлю рекомендации для дальнейших действий...'
];

const dialogSteps = [
    'формирую список ключевых слов...',
    'ищу обращения граждан по теме...',
    'анализирую обращения на релевантность...',
    'формирую итоговый список...'
];

const npaSteps = [
    'ищу нормативно-правовые акты...',
    'оцениваю релевантность НПА...',
    'анализирую влияние законодательных изменений...',
    'формирую рекомендации...'
];

const sections = ['web', 'social', 'dialog', 'npa'] as const;
type Section = (typeof sections)[number];

const stepsData: Record<Section, string[]> = {
    web: webSteps,
    social: socialSteps,
    dialog: dialogSteps,
    npa: npaSteps,
};

interface ProgressPageProps {
    setDisplayReport: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading?: boolean;
    title: string;
}

export default function ProgressPage({ setDisplayReport, isLoading }: ProgressPageProps) {
    const [currentSection, setCurrentSection] = useState<Section>('web');
    const [currentSteps, setCurrentSteps] = useState<Record<Section, number>>({ web: 0, social: 0, dialog: 0, npa: 0 });
    const [completedSections, setCompletedSections] = useState<Record<Section, boolean>>({ web: false, social: false, dialog: false, npa: false });
    const [isComplete, setIsComplete] = useState(false);

    const title = titles[sections.indexOf(currentSection)];

    const settingState = useCallback(() => {
        setCurrentSteps((prev) => {
            const newSteps = { ...prev };
            if (newSteps[currentSection] < stepsData[currentSection].length - 1) {
                newSteps[currentSection]++;
            } else {
                setCompletedSections((prev) => ({ ...prev, [currentSection]: true }));
                const nextSectionIndex = sections.indexOf(currentSection) + 1;
                if (nextSectionIndex < sections.length) {
                    setCurrentSection(sections[nextSectionIndex]);
                }
            }
            return newSteps;
        });
    }, [currentSection]);

    useEffect(() => {
        if (isLoading) return;
        const stepInterval = setInterval(() => {
            settingState();
        }, 23000);

        return () => clearInterval(stepInterval);
    }, [isLoading, settingState]);

    useEffect(() => {
        if (Object.values(completedSections).every(Boolean)) {
            setIsComplete(true);
        }
    }, [completedSections]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div className="h-screen flex flex-col items-center justify-center">
                        <motion.div className="w-[353px] h-[353px] mb-8">
                            <AIVisualization isHovered={true} />
                        </motion.div>
                        <motion.div className="text-2xl text-gray-600 font-light">
                            Загрузка исследования...
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div className="max-w-7xl mx-auto px-4 py-12">
                        <motion.h1 className="text-4xl md:text-5xl font-light mb-6 text-center text-gray-800">
                            {title}
                        </motion.h1>
                        <motion.p className="text-center mb-8">Загрузка исследования... </motion.p>
                        <div className="relative flex justify-center items-center mb-16 h-[353px]">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[353px] h-[353px]">
                                    <AIVisualization isHovered={isComplete} />
                                </div>
                            </div>
                        </div>

                        {!isLoading && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                {sections.map((section, index) => (
                                    <motion.div key={section} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 }}>
                                        <ProgressCard
                                            title={titles[index]} 
                                            steps={stepsData[section].map((text, i) => ({ id: i + 1, text, status: 'pending' }))}
                                            currentStep={completedSections[section] ? stepsData[section].length : currentSteps[section]}
                                            isCompleted={completedSections[section]}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
