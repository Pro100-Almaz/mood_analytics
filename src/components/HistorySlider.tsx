'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import Link from "next/link";

interface Research {
    id: number;
    query: string;
    date: string;
    task_id: string;
    status: 'completed' | 'in_progress' | 'error';
}

interface HistorySliderProps {
    researches: Research[];
}

export function HistorySlider({researches}: HistorySliderProps) {
    const getStatusStyles = (status: Research['status']) => {
        switch (status) {
            case 'completed':
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-700',
                    label: 'Завершено'
                };
            case 'in_progress':
                return {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700',
                    label: 'В процессе'
                };
            case 'error':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-700',
                    label: 'Ошибка'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-700',
                    label: 'Статус неизвестен'
                };
        }
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex space-x-2 p-2">
                {researches.map((research) => {
                    const statusStyle = getStatusStyles(research.status);
                    return (
                        <motion.div
                            key={research.id}
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                            className="flex-shrink-0 w-[250px] bg-white rounded-xl p-2.5 shadow-sm
                       hover:shadow-md transition-all cursor-pointer"
                        >
                            <Link href={`/research/${research.task_id}`} key={research.task_id} >
                                <div className="flex flex-col space-y-1 justify-between h-full">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-gray-900 font-medium text-xs leading-tight">
                                            {research.query}
                                        </h3>
                                        <motion.div
                                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium whitespace-nowrap
                             ${statusStyle.bg} ${statusStyle.text}
                             flex items-center space-x-0.5`}
                                            initial={{opacity: 0, scale: 0.8}}
                                            animate={{opacity: 1, scale: 1}}
                                        >
                                            {research.status === 'in_progress' && (
                                                <motion.span
                                                    className="w-0.5 h-0.5 rounded-full bg-blue-600 mr-0.5"
                                                    animate={{scale: [1, 1.2, 1]}}
                                                    transition={{repeat: Infinity, duration: 1}}
                                                />
                                            )}
                                            <span>{statusStyle.label}</span>
                                        </motion.div>
                                    </div>
                                    <p className="text-gray-500 text-[10px]">
                                        {format(new Date(research.date), 'd MMMM yyyy', {locale: ru})}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>

                    );
                })}
            </div>
        </div>
    );
} 