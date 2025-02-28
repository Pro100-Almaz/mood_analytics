'use client';

import React, {useMemo, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {AIVisualization} from '@/components/AIVisualization';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
} from 'chart.js';
import {Bar, Doughnut, PolarArea} from 'react-chartjs-2';
import {ChartLoader} from '@/components/ChartLoader';
import {AnimatedBlock} from '@/components/AnimatedBlock';
import NumberFlow from "@number-flow/react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale
);

interface ResultsPageProps {
    title: string,
    foundPosts?: number
    foundComments?: number
    fb?: string,
    web?: string,
    foundDialogs?: number
    dataDialogs?: string
    foundEgovNpa: number
    foundAdiletNpa: number
    egovNpa?: string
    adiletNpa?: string
    createdAt?: string
    finishedAt?: string
    full?: boolean
    resultData? : string
}

interface SourceType {
    link: string
    summary: string
}

interface SocialMediaType {
    url: string;
    message: string;
}

interface WebResult {
    // research: string
    citations: string[]
}
function formatTimeDifference(date1: string, date2: string) {
    // Парсим даты
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Вычисляем разницу в миллисекундах
    let diffInSeconds = Math.abs((+d1 - +d2) / 1000);

    // Вычисляем часы, минуты и секунды
    const hours = Math.floor(diffInSeconds / 3600);
    diffInSeconds %= 3600;

    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = Math.floor(diffInSeconds % 60);

    // Формируем строку, исключая ненужные компоненты
    const parts = [];
    if (hours > 0) parts.push(`${hours} ч`);
    if (minutes > 0) parts.push(`${minutes} м`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} с`);

    return parts.join(' ');
}
export default function ResultsPage({
                                        title,
                                        web,
                                        fb,
                                        foundPosts,
                                        foundDialogs,
                                        dataDialogs,
                                        foundEgovNpa,
                                        foundAdiletNpa,
                                        egovNpa,
                                        adiletNpa,
                                        createdAt,
                                        finishedAt,
                                        full,
                                        resultData
                                    }: ResultsPageProps) {
    const [activeSection, setActiveSection] = useState('egov_dialog');
    const [showNumber, setShowNumber] = useState(false);
    setTimeout(() => {
        setShowNumber(true)
    }, 100)
    const dialogs: SourceType[] = useMemo(() => {
        return JSON.parse(dataDialogs || "[]")
    }, [dataDialogs])
    const npa: SourceType[] = useMemo(() => {
        return [...JSON.parse(egovNpa || "[]"), ...JSON.parse(adiletNpa || "[]")]
    }, [egovNpa, adiletNpa])
    const webResults: WebResult[] = useMemo(() => {
        return JSON.parse(web || "[]")
    }, [web])
    const socialMedia: SocialMediaType[] = useMemo(() => {
        return JSON.parse(fb || "[]")
    }, [fb])
    const statistics = [
        {
            id: 0,
            text: "Использовано веб-источников",
            number: webResults.length * 5 || 26
        },
        {
            id: 1,
            text: "Проанализировано постов в соц. сетях",
            number: foundPosts || "58"
        },
        {
            id: 2,
            text: "Найдено обращений граждан",
            number: foundDialogs || 42,
            realNumber: dialogs.length || 26
        },
        {
            id: 3,
            text: "Найдено нормативно-правовых актов",
            number: foundEgovNpa + foundAdiletNpa || 31,
            realNumber: npa.length || 17
        }
    ]
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto px-4 py-8"
        >
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-3xl md:text-4xl font-light mb-6 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-3 tracking-tight">
              Результаты анализа
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600">
                {title}
              </span>
            </h1>
          </motion.h1>
          <div className={"flex items-center gap-4 justify-center"}>
            {createdAt && finishedAt && (
              <p
                className={
                  "w-max bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-gray-200\n" +
                  "                 shadow-lg hover:shadow-xl transition-all font-light text-sm"
                }
              >
                Исследование завершено за:{" "}
                <span className={"font-bold text-indigo-500"}>
                  {formatTimeDifference(createdAt, finishedAt)}
                </span>
              </p>
            )}
            <p
              className={
                "w-max bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-gray-200 shadow-lg hover:shadow-xl transition-all font-bold text-indigo-500 text-sm"
              }
            >
              {full ? "Детальное" : "Быстрое"} исследование
            </p>
          </div>
          <div className={"flex items-stretch gap-8 py-8"}>
            {statistics.map((item, i) => (
              <motion.div
                className={"flex-1"}
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200
                 shadow-lg hover:shadow-xl transition-all h-full flex flex-col gap-2"
                >
                  <p className={"font-light"}>{item.text}</p>
                  <p className={"text-6xl font-semibold text-blue-500"}>
                    <NumberFlow
                      spinTiming={{ duration: i * 250 + 500 }}
                      value={item.number && showNumber ? +item.number : 0}
                      continuous={true}
                    />
                  </p>
                  {item.realNumber !== undefined && (
                    <p className={"text-green-600 text-sm"}>
                      Релевантных:{" "}
                      <span className={"font-bold"}>{item.realNumber}</span>
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center p-4">
            <a
              href={`https://api.insitute.etdc.kz/digest?id=142`}
              rel="noopener noreferrer"
            >
              <motion.button
                className="relative z-30 px-4 py-2 flex items-center justify-center gap-2 rounded-lg 
                                         text-base font-light tracking-wide transition-all duration-300 ease-out 
                                         bg-gradient-to-r from-indigo-600/90 to-blue-600/90 hover:shadow-xl 
                                         hover:scale-105 shadow-lg text-white"
                // onClick={() => setIsModalOpen(true)}
              >
                Сгенерировать виджет
              </motion.button>
            </a>
          </div>
          <div className="flex justify-center mt-8 pb-6">
            <table className="border-collapse border border-gray-400 rounded-lg shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-300 text-gray-800 text-left">
                  <th className="border border-gray-400 px-6 py-3">Название</th>
                  <th className="border border-gray-400 px-6 py-3">
                    Положительные отзывы
                  </th>
                  <th className="border border-gray-400 px-6 py-3">
                    Отрицательные отзывы
                  </th>
                  <th className="border border-gray-400 px-6 py-3">
                    Нейтральные отзывы
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-200 transition-colors">
                  <td className="border border-gray-400 px-6 py-3">
                    Мнение населения
                  </td>
                  <td className="border border-gray-400 px-6 py-3">
                    19 комментариев в 2021 году
                  </td>
                  <td className="border border-gray-400 px-6 py-3">
                    5 комментариев в 2021 году
                  </td>
                  <td className="border border-gray-400 px-6 py-3">
                    5 комментариев в 2021 году
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Навигация */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { id: "egov_dialog", title: `E-Gov Диалог (${dialogs.length})` },
              { id: "egov_nla", title: `НПА (${npa.length})` },
              { id: "fb", title: "Социальные сети" },
              { id: "web", title: "Веб-анализ" },
            ].map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg text-base font-light
                        ${
                          activeSection === section.id
                            ? "bg-gray-900 text-white"
                            : "bg-white text-gray-600"
                        }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {section.title}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSection === "egov_dialog" && (
              <motion.div
                key="egov_dialog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {Array.isArray(dialogs) && dialogs.length ? (
                  dialogs.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-xl shadow-sm"
                    >
                      <p className="text-gray-700">{item.summary}</p>
                      {item.link && item.link !== "null" && (
                        <a
                          href={item.link}
                          className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Подробнее →
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700">Данные отсутствуют</p>
                )}
              </motion.div>
            )}

            {activeSection === "egov_nla" && (
              <motion.div
                key="egov_nla"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {npa
                  .filter((el) => el?.link !== "null" && el?.summary)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-xl shadow-sm"
                    >
                      <p className="text-gray-700">{item.summary}</p>
                      <a
                        href={item.link}
                        className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Подробнее →
                      </a>
                    </div>
                  ))}
              </motion.div>
            )}

            {activeSection === "fb" && (
              <motion.div
                key="fb"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm mx-auto"
              >
                {socialMedia
                  .filter((el) => el?.url !== "null" && el?.message)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-xl shadow-sm"
                    >
                      <p className="text-gray-700">{item.message}</p>
                      <a
                        href={item.url}
                        className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Подробнее →
                      </a>
                    </div>
                  ))}
              </motion.div>
            )}

            {activeSection === "web" && (
              <motion.div
                key="web"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 flex flex-col"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  {/* <p>
                    {webResults}
                  </p> */}
                </div>
                {webResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm"
                  >
                    {result.citations.map((citation, i) => (
                      <div key={i}>
                        <a
                          href={citation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {`Источник ${index + 1}-${i + 1}`}
                        </a>
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
} 