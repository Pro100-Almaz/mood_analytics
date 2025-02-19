'use client';

import React, {useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {motion, AnimatePresence} from 'framer-motion';
import {ProgressCard} from '@/components/ProgressCard';
import {ResearchStep} from '@/types/research';
import {AIVisualization} from '@/components/AIVisualization';

function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const webSteps: ResearchStep[] = [
    {id: 1, text: 'ищу релевантные веб-ресурсы и источники...', status: 'pending'},
    {id: 2, text: 'оцениваю достоверность и качество найденных источников...', status: 'pending'},
    {id: 3, text: 'анализирую содержание выбранных материалов...', status: 'pending'},
    {id: 4, text: 'выделяю основные выводы и ключевые инсайты...', status: 'pending'},
    {id: 5, text: 'готовлю рекомендации на основе анализа...', status: 'pending'},
];

const socialSteps: ResearchStep[] = [
    {id: 1, text: 'ищу релевантные посты и обсуждения в социальных медиа...', status: 'pending'},
    {id: 2, text: 'собираю и структурирую комментарии пользователей...', status: 'pending'},
    {id: 3, text: 'выполняю анализ тональности (сентимент-анализ)...', status: 'pending'},
    {id: 4, text: 'выделяю ключевые темы и тренды в обсуждениях...', status: 'pending'},
    {id: 5, text: 'оцениваю влияние трендов на общественное мнение...', status: 'pending'},
    {id: 6, text: 'готовлю рекомендации для дальнейших действий...', status: 'pending'},
];

const dialogsSteps: ResearchStep[] = [
    {id: 1, text: 'формирую список ключевых слов...', status: 'pending'},
    {id: 2, text: 'ищу обращения граждан по теме в доступных системах...', status: 'pending'},
    {id: 3, text: 'анализирую обращения на релевантность запросу...', status: 'pending'},
    {id: 4, text: 'формирую итоговый список...', status: 'pending'},
];

const legalSteps: ResearchStep[] = [
    {id: 1, text: 'формирую список ключевых слов...', status: 'pending'},
    {id: 2, text: 'ищу нормативно-правовые акты на портале eGov...', status: 'pending'},
    {id: 3, text: 'выбираю релевантные НПА...', status: 'pending'},
    {id: 4, text: 'ищу нормативно-правовые акты в системе «Әділет»...', status: 'pending'},
    {id: 5, text: 'выбираю релевантные НПА...', status: 'pending'},
];

interface ProgressPageProps {
    setDisplayReport: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading?: boolean,
    title: string,
    foundPosts?: number
    foundComments?: number
    fb?: string,
    web?: string,
    foundDialogs?: number
    dataDialogs?: number
    foundEgovNpa?: number
    foundAdiletNpa?: number
    egovNpa?: string
    adiletNpa?: string
}

export default function ProgressPage({
                                         setDisplayReport,
                                         isLoading,
                                         title,
                                         web,
                                         fb,
                                         foundPosts,
                                         foundComments,
                                         foundDialogs,
                                         dataDialogs,
                                         foundEgovNpa,
                                         foundAdiletNpa,
                                         egovNpa,
                                         adiletNpa
                                     }: ProgressPageProps) {
    const [currentSection, setCurrentSection] = useState('web')
    const [currentSteps, setCurrentSteps] = useState({
        web: 0,
        social: foundPosts ? foundComments ? 2 : 1 : 0,
        dialog: 0,
        npa: 0
    });
    const [completedSections, setCompletedSections] = useState({
        web: false,
        social: false,
        dialog: false,
        npa: false
    });
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (web) {
            setCompletedSections(prev => ({...prev, web: true}));
            setCurrentSection('social')
        }
        if (fb && web) {
            setCompletedSections(prev => ({...prev, social: true}));
            setCurrentSection('dialog')
        }
        if (foundDialogs && dataDialogs) {
            setCompletedSections(prev => ({...prev, dialog: true}));
            setCurrentSection('npa')
        }
        if (egovNpa && adiletNpa) {
            setCompletedSections(prev => ({...prev, npa: true}));
        }
    }, [web, fb, egovNpa, adiletNpa])

    const settingState = useCallback(() => {
        setCurrentSteps(prev => {
            const newSteps = {...prev};
            switch (currentSection) {
                case 'web':
                    if (prev.web < webSteps.length - 1) {
                        newSteps.web = prev.web + 1;
                    }
                    break;
                case 'social':
                    if (!foundPosts) {
                        break
                    }
                    if (foundPosts && !foundComments) {
                        newSteps.social = 1;
                        break
                    }
                    if (foundComments && !fb && prev.social < socialSteps.length - 1) {
                        newSteps.social = prev.social + 1;
                    }
                    break;
                case 'dialog':
                    if (!foundDialogs) {
                        newSteps.dialog = 1
                        break
                    }
                    if (foundDialogs && prev.dialog < dialogsSteps.length - 1) {
                        newSteps.dialog = prev.dialog + 1;
                    }
                    break;
                case 'npa':
                    const maxValue = foundAdiletNpa ? 4 : egovNpa ? 3 : foundEgovNpa ? 2 : 1
                    if (prev.npa < maxValue) {
                        newSteps.npa = prev.npa + 1;
                    }
                    break;
            }

            return newSteps;
        });
    }, [foundPosts, foundComments, foundDialogs, currentSection, fb, foundEgovNpa, foundAdiletNpa, egovNpa, adiletNpa])
    // Остальные useEffect-ы запускаем только после инициализации
    useEffect(() => {
        if (isLoading) return;
        const stepInterval = setInterval(() => {
            settingState()
        }, 2000);

        return () => clearInterval(stepInterval);
    }, [isLoading, settingState]);

    // Проверяем завершение всех секций
    useEffect(() => {
        if (completedSections.web && completedSections.social && completedSections.social && completedSections.npa) {
            setIsComplete(true);
        }
    }, [completedSections]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loader"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="h-screen flex flex-col items-center justify-center"
                    >
                        <motion.div
                            className="w-[353px] h-[353px] mb-8"
                            animate={{
                                rotate: 360,
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                rotate: {duration: 2, ease: "linear", repeat: Infinity},
                                scale: {duration: 2, repeat: Infinity}
                            }}
                        >
                            <AIVisualization isHovered={true}/>
                        </motion.div>
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            className="text-2xl text-gray-600 font-light"
                        >
                            Загрузка исследования...
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        className="max-w-7xl mx-auto px-4 py-12"
                    >
                        <motion.h1
                            initial={{y: -50}}
                            animate={{y: 0}}
                            className="text-4xl md:text-5xl font-light mb-12 text-center tracking-tight text-gray-800"
                        >
                            {title}
                        </motion.h1>

                        <div className="relative flex justify-center items-center mb-16 h-[353px]">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[353px] h-[353px]">
                                    <AIVisualization isHovered={isComplete}/>
                                </div>
                            </div>

                            {isComplete && (
                                <motion.button
                                    onClick={() => setDisplayReport(true)}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    className="relative z-10 w-[300px] h-[60px]
                            bg-gray-900 text-white rounded-xl text-lg font-light
                            shadow-[0_0_15px_rgba(0,0,0,0.2)] 
                            hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]
                            hover:bg-gray-800
                            transition-all duration-300 ease-out 
                            flex items-center justify-center
                            group"
                                    whileTap={{scale: 0.98}}
                                >
                  <span className="relative">
                    <span className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 
                                  blur-lg group-hover:blur-xl transition-all duration-300"/>
                    Сформировать результат
                  </span>
                                </motion.button>
                            )}
                        </div>

                        {!isLoading && <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <AnimatePresence>
                                {[
                                    {
                                        title: "Анализ веб-ресурсов",
                                        loaded: web,
                                        steps: webSteps,
                                        current: completedSections.web ? webSteps.length : currentSteps.web,
                                        completed: completedSections.web
                                    },
                                    {
                                        title: "Анализ социальных медиа",
                                        loaded: fb,
                                        steps: socialSteps.map(el => {
                                            if (el.id === 1 && foundPosts) {
                                                return {
                                                    ...el,
                                                    text: `найдено релевантных постов: ${foundPosts}`
                                                }
                                            }
                                            if (el.id === 2 && foundComments) {
                                                return {
                                                    ...el,
                                                    text: `собрано комментариев: ${foundComments}`
                                                }
                                            }
                                            return el
                                        }),
                                        current: completedSections.social ? socialSteps.length : currentSteps.social,
                                        completed: completedSections.social
                                    },
                                    {
                                        title: "Анализ обращений",
                                        loaded: dataDialogs,
                                        steps: dialogsSteps.map(el => {
                                            if (el.id === 2 && foundDialogs) {
                                                return {
                                                    ...el,
                                                    text: `найдено обращений: ${foundDialogs}`
                                                }
                                            }
                                            return el
                                        }),
                                        current: completedSections.dialog ? dialogsSteps.length : currentSteps.dialog,
                                        completed: completedSections.dialog
                                    },
                                    {
                                        title: "Анализ законодательства",
                                        loaded: egovNpa && adiletNpa,
                                        steps: legalSteps.map(el => {
                                            if (el.id === 2 && foundEgovNpa) {
                                                return {
                                                    ...el,
                                                    text: `найдено НПА (eGov): ${foundEgovNpa}`
                                                }
                                            }
                                            if (el.id === 4 && foundAdiletNpa) {
                                                return {
                                                    ...el,
                                                    text: `найдено НПА (Әділет): ${foundAdiletNpa}`
                                                }
                                            }
                                            return el
                                        }),
                                        current: completedSections.npa ? legalSteps.length : currentSteps.npa,
                                        completed: completedSections.npa
                                    }
                                ].map((section, index) => (
                                    <motion.div
                                        key={section.title}
                                        initial={{opacity: 0, x: -50}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: index * 0.2}}
                                    >
                                        <ProgressCard
                                            title={section.title}
                                            steps={section.steps}
                                            currentStep={section.current}
                                            isCompleted={section.completed}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 