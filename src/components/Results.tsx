"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import remarkGfm from "remark-gfm";
import { AIVisualization } from "@/components/AIVisualization";
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
} from "chart.js";
import { Bar, Doughnut, PolarArea } from "react-chartjs-2";
import { ChartLoader } from "@/components/ChartLoader";
import { AnimatedBlock } from "@/components/AnimatedBlock";
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
  task_id: string;
  title: string;
  foundPosts?: number;
  foundComments?: number;
  fb?: string;
  web?: string;
  budgets?: string;
  instagram?: string;
  fbOpinion?: string;
  instagramOpinion?: string;
  foundDialogs?: string;
  dataDialogs?: string;
  foundEgovNpa: number;
  foundAdiletNpa: number;
  egovNpa?: string;
  adiletNpa?: string;
  openData?: string;
  openDataOpinion?: string;
  dialogsArrayOpinion?: string;
  adiletOpinion?: string;
  nla?: string;
  nlaOpinion?: string;
  createdAt?: string;
  finishedAt?: string;
  full?: boolean;
}

interface nlaType {
  comment_url: string;
  short_description: string;
}
interface SourceType {
  url: string;
  short_description: string;
}
interface OpinionSourceType {
  link: string;
  opinion: string;
  relev_score: number;
  summary: string;
}
interface SourceDialogType {
  citations: string[];
  research: string;
}

interface SocialMediaType {
  comment_url: string;
  short_description: string;
}
interface GetDigest {
  id: string
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

  return parts.join(" ");
}
export default function ResultsPage({
  task_id,
  title,
  web,
  fb,
  instagram,
  foundPosts,
  foundDialogs,
  dataDialogs,
  foundEgovNpa,
  foundAdiletNpa,
  nlaOpinion,
  fbOpinion,
  instagramOpinion,
  egovNpa,
  openData,
  openDataOpinion,
  dialogsArrayOpinion,
  adiletOpinion,
  adiletNpa,
  nla,
  createdAt,
  finishedAt,
  full,
}: ResultsPageProps) {
  const [activeSection, setActiveSection] = useState("egov_dialog");
  const [showNumber, setShowNumber] = useState(false);
  const [opinionData, setOpinionData] = useState("");

  const safeParseJSON = (data: any, fallback: any[] = []) => {
    try {
      const parsed =
        typeof data === "string" && data.trim() !== ""
          ? JSON.parse(data)
          : fallback;
      return Array.isArray(parsed) ? parsed : fallback; // Ensure always an array
    } catch (error) {
      console.error("JSON parsing error:", error);
      return fallback;
    }
  };
  setTimeout(() => {
    setShowNumber(true);
  }, 100);
  const totalOpinion: OpinionSourceType[] = useMemo(() => {
    const dataDialogsOpinionArray = safeParseJSON(dialogsArrayOpinion, []);
    const openDataApinionArray = safeParseJSON(openDataOpinion, []);
    const fbOpinionArray = safeParseJSON(fbOpinion, []);
    const instagramApinionArray = safeParseJSON(instagramOpinion, []);
    const adiletApinionArray = safeParseJSON(adiletOpinion, []);
    return [
      ...dataDialogsOpinionArray,
      ...openDataApinionArray,
      ...fbOpinionArray,
      ...instagramApinionArray,
      ...adiletApinionArray,
    ];
  }, [
    dialogsArrayOpinion,
    openDataOpinion,
    fbOpinion,
    instagramOpinion,
    adiletOpinion,
  ]);





  const neutralCount = totalOpinion.filter(
    (item) => item.opinion === "neutral" || item.opinion === "нейтральное"
  ).length;
  const negativeCount = totalOpinion.filter(
    (item) => item.opinion === "negative" || item.opinion === "негативное"
  ).length;
  const positiveCount = totalOpinion.filter(
    (item) => item.opinion === "positive" || item.opinion === "позитивное"
  ).length;

  const getDigest = async () => {

    const sendData = {
      all_opinion: negativeCount + positiveCount + neutralCount,
      negative_opinion: negativeCount,
      positive_opinion: positiveCount,
      neutral_opinion: neutralCount,
      dominating_opinion: opinionData
    };
  
    try {
      const response = await fetch(`https://api.insitute.etdc.kz/generate_digest/${task_id}`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to download file. Status: ${response.status}`);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `digest_${task_id}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  
      console.log("File downloaded successfully.");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  
  const opinionsOnly: string[] = useMemo(() => {
    const dataDialogsOpinionArray = safeParseJSON(dialogsArrayOpinion, []);
    const openDataApinionArray = safeParseJSON(openDataOpinion, []);
    const fbOpinionArray = safeParseJSON(fbOpinion, []);
    const instagramApinionArray = safeParseJSON(instagramOpinion, []);
    const nlaOpinionArray = safeParseJSON(nlaOpinion, []);
    const adiletApinionArray = safeParseJSON(adiletOpinion, []);
  
    return [
      ...dataDialogsOpinionArray,
      ...openDataApinionArray,
      ...fbOpinionArray,
      ...instagramApinionArray,
      ...nlaOpinionArray,
      ...adiletApinionArray,
    ].map((item) => item.opinion);
  }, [
    dialogsArrayOpinion,
    openDataOpinion,
    fbOpinion,
    instagramOpinion,
    nlaOpinion,
    adiletOpinion,
  ]);


  const getOpinion = async () => {

    const sendData = {
      opinions: opinionsOnly,
    };
  
    try {
      const response = await fetch(`https://api.insitute.etdc.kz/get_opinion`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed get opinion. Status: ${response.status}`);
      }
      const data = await response.json();
      setOpinionData(data.response);
    } catch (error) {
      console.error("Error get opinion:", error);
    }
  };
  useEffect(() => {
    getOpinion();
  }, []);


  const dialogs: SourceType[] = useMemo(() => {
    const dataDialogsArray = safeParseJSON(dataDialogs, []);
    const openDataArray = safeParseJSON(openData, []);
    return [...dataDialogsArray, ...openDataArray];
  }, [dataDialogs, openData]);

  const dialogsOpinion: OpinionSourceType[] = useMemo(() => {
    const dataDialogsOpinionArray = safeParseJSON(dialogsArrayOpinion, []);
    const openDataApinionArray = safeParseJSON(openDataOpinion, []);
    return [...dataDialogsOpinionArray, ...openDataApinionArray];
  }, [dialogsArrayOpinion, openDataOpinion]);

  const socialMediaOpinion: OpinionSourceType[] = useMemo(() => {
    const fbOpinionArray = safeParseJSON(fbOpinion, []);
    const instagramApinionArray = safeParseJSON(instagramOpinion, []);
    return [...fbOpinionArray, ...instagramApinionArray];
  }, [fbOpinion, instagramOpinion]);

  const npaOpinion: OpinionSourceType[] = useMemo(() => {
    const nlaOpinionArray = safeParseJSON(nlaOpinion, []);
    const adiletApinionArray = safeParseJSON(adiletOpinion, []);
    return [...nlaOpinionArray, ...adiletApinionArray];
  }, [nlaOpinion, adiletOpinion]);

  const npa: SourceType[] = useMemo(() => {
    const adiletNpaArray = safeParseJSON(adiletNpa, []);
    const nlaArray = safeParseJSON(nla, []);
    return [...adiletNpaArray, ...nlaArray];
  }, [adiletNpa, nla]);

  const webData: SourceDialogType = useMemo(() => {
    try {
      const parsed = JSON.parse(web || "[]");
      return parsed && typeof parsed === "object"
        ? parsed
        : { citations: [], research: "" };
    } catch {
      return { citations: [], research: "" };
    }
  }, [web]);

  const citations: string[] = webData?.citations ?? [];
  const researchText: string = webData?.research ?? "";

  const socialMedia: SocialMediaType[] = useMemo(() => {
    return JSON.parse(fb || "[]");
  }, [fb]);
  const socialMediaInstagram: SourceType[] = useMemo(() => {
    return Array.isArray(instagram) ? instagram : safeParseJSON(instagram, []);
  }, [instagram]);
  const statistics = [
    {
      id: 0,
      text: "Использовано веб-источников",
      number: citations.length,
    },
    {
      id: 1,
      text: "Проанализировано постов в соц. сетях",
      number: socialMedia?.length + socialMediaInstagram?.length,
    },
    {
      id: 2,
      text: "Найдено обращений граждан",
      number: dialogs.length || 42,
      realNumber: dialogsOpinion.length,
    },
    {
      id: 3,
      text: "Найдено нормативно-правовых актов",
      number: npa.length,
      realNumber: npaOpinion.length,
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-4 py-8"
      >
        <motion.div
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
        </motion.div>
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
                 shadow-lg hover:shadow-xl transition-all h-full flex flex-col items-between"
              >
                <p className={"font-light h-14"}>{item.text}</p>
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
          <motion.button
            className="relative z-30 px-4 py-2 flex items-center justify-center gap-2 rounded-lg 
                                         text-base font-light tracking-wide transition-all duration-300 ease-out 
                                         bg-gradient-to-r from-indigo-600/90 to-blue-600/90 hover:shadow-xl 
                                         hover:scale-105 shadow-lg text-white"
            onClick={getDigest}
          >
            Сгенерировать дайджест
          </motion.button>
        </div>
        {opinionData ? (
          <div className="w-full flex justify-center my-4">
            <div>
              <h1 className="text-3xl font-light text-gray-800 mb-3 tracking-tight text-center">
                Доминирующее мнение
              </h1>
              <div
                className="w-[700px] bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200
                 shadow-lg hover:shadow-xl transition-all flex flex-col items-between"
              >
                {opinionData}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center my-4">
            <p>Загрузка доминирующего мнения...</p>
          </div>
        )}
        <div className="flex justify-center mt-16 pb-6">
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
                  {positiveCount} отзывов
                </td>
                <td className="border border-gray-400 px-6 py-3">
                  {negativeCount} отзывов
                </td>
                <td className="border border-gray-400 px-6 py-3">
                  {neutralCount} отзывов
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
          {/* Egov диалоги */}

          {activeSection === "egov_dialog" && (
            <motion.div
              key="egov_dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {Array.isArray(dialogsOpinion) && dialogsOpinion.length ? (
                dialogsOpinion.map((item, index) => {
                  const opinionColor =
                    item.opinion === "neutral" || item.opinion === "нейтральное"
                      ? "bg-gray-400"
                      : item.opinion === "negative" ||
                        item.opinion === "негативное"
                      ? "bg-red-500"
                      : item.opinion === "positive" ||
                        item.opinion === "позитивное"
                      ? "bg-green-500"
                      : "bg-gray-400"; // Default color

                  return (
                    <div
                      key={index}
                      className="relative bg-white p-6 rounded-xl shadow-sm"
                    >
                      {/* Status Indicator */}
                      <div
                        className={`absolute top-2 right-2 w-2 h-2 rounded-full ${opinionColor}`}
                      ></div>

                      <p className="text-gray-700">{item.summary}</p>
                      <p
                        className={`${
                          item.opinion === "neutral" ||
                          item.opinion === "нейтральное"
                            ? "text-gray-400"
                            : item.opinion === "negative" ||
                              item.opinion === "негативное"
                            ? "text-red-500"
                            : item.opinion === "positive" ||
                              item.opinion === "позитивное"
                            ? "text-green-500"
                            : "text-gray-700"
                        }`}
                      >
                        Мнение:{" "}
                        {item.opinion === "neutral" ||
                        item.opinion === "нейтральное"
                          ? "нейтральное"
                          : item.opinion === "negative" ||
                            item.opinion === "негативное"
                          ? "негативное"
                          : item.opinion === "positive" ||
                            item.opinion === "позитивное"
                          ? "позитивное"
                          : item.opinion}
                      </p>
                      <div className="flex justify-between">
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
                        <p className="flex mt-2 text-sm">
                          Релевантность: {item.relev_score}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : Array.isArray(dialogs) && dialogs.length ? (
                dialogs.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm"
                  >
                    <p className="text-gray-700">{item.short_description}</p>
                    {item.url && item.url !== "null" && (
                      <a
                        href={item.url}
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

          {/* NPA */}

          {activeSection === "egov_nla" && (
            <motion.div
              key="egov_nla"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {npaOpinion.length > 0
                ? npaOpinion.map((item, index) => (
                    <div
                      key={index}
                      className="relative bg-white p-6 rounded-xl shadow-sm"
                    >
                      {item.opinion && (
                        <div
                          className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                            item.opinion === "neutral"
                              ? "bg-gray-400"
                              : item.opinion === "negative"
                              ? "bg-red-400"
                              : item.opinion === "positive"
                              ? "bg-green-400"
                              : ""
                          }`}
                        />
                      )}

                      <p className="text-gray-700">{item.summary}</p>
                      <p
                        className={`${
                          item.opinion === "neutral" ||
                          item.opinion === "нейтральное"
                            ? "text-gray-400"
                            : item.opinion === "negative" ||
                              item.opinion === "негативное"
                            ? "text-red-500"
                            : item.opinion === "positive" ||
                              item.opinion === "позитивное"
                            ? "text-green-500"
                            : "text-gray-700"
                        }`}
                      >
                        Мнение:{" "}
                        {item.opinion === "neutral" ||
                        item.opinion === "нейтральное"
                          ? "нейтральное"
                          : item.opinion === "negative" ||
                            item.opinion === "негативное"
                          ? "негативное"
                          : item.opinion === "positive" ||
                            item.opinion === "позитивное"
                          ? "позитивное"
                          : item.opinion}
                      </p>
                      <div className="flex justify-between">
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
                        <p className="flex mt-2 text-sm">
                          Релевантность: {item.relev_score}
                        </p>
                      </div>
                    </div>
                  ))
                : npa.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-xl shadow-sm"
                    >
                      <p className="text-gray-700">
                        {item.short_description || "Нет описания"}
                      </p>
                      {item.url && item.url !== "null" ? (
                        <a
                          href={item.url}
                          className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Подробнее →
                        </a>
                      ) : (
                        <span className="text-gray-400">
                          Ссылка отсутствует
                        </span>
                      )}
                    </div>
                  ))}
            </motion.div>
          )}

          {/* Social media */}
          {activeSection === "fb" && (
            <motion.div
              key="fb"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {socialMediaOpinion.length > 0 ? (
                socialMediaOpinion.map((item, index) => (
                  <div
                    key={index}
                    className="relative bg-white p-6 rounded-xl shadow-sm"
                  >
                    {item.opinion && (
                      <div
                        className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                          item.opinion === "neutral"
                            ? "bg-gray-400"
                            : item.opinion === "negative"
                            ? "bg-red-400"
                            : item.opinion === "positive"
                            ? "bg-green-400"
                            : ""
                        }`}
                      />
                    )}
                    <p className="text-gray-700">{item.summary}</p>
                    <p
                      className={`${
                        item.opinion === "neutral" ||
                        item.opinion === "нейтральное"
                          ? "text-gray-400"
                          : item.opinion === "negative" ||
                            item.opinion === "негативное"
                          ? "text-red-500"
                          : item.opinion === "positive" ||
                            item.opinion === "позитивное"
                          ? "text-green-500"
                          : "text-gray-700"
                      }`}
                    >
                      Мнение:{" "}
                      {item.opinion === "neutral" ||
                      item.opinion === "нейтральное"
                        ? "нейтральное"
                        : item.opinion === "negative" ||
                          item.opinion === "негативное"
                        ? "негативное"
                        : item.opinion === "positive" ||
                          item.opinion === "позитивное"
                        ? "позитивное"
                        : item.opinion}
                    </p>
                    <div className="flex justify-between">
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
                      <p className="flex mt-2 text-sm">
                        Релевантность: {item.relev_score}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {socialMediaInstagram
                    .filter((el) => el?.url !== "null" && el?.short_description)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-sm"
                      >
                        <p className="text-gray-700">
                          {item.short_description}
                        </p>
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
                  {socialMedia
                    .filter(
                      (el) =>
                        el?.comment_url !== "null" && el?.short_description
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-sm"
                      >
                        <p className="text-gray-700">
                          {item.short_description}
                        </p>
                        <a
                          href={item.comment_url}
                          className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Подробнее →
                        </a>
                      </div>
                    ))}
                </>
              )}
            </motion.div>
          )}

          {/* WEB */}
          {activeSection === "web" && (
            <motion.div
              key="web"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p>{researchText}</p>
              </div>
              {citations.length > 0 ? (
                citations.map((link, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm"
                  >
                    <a
                      href={link}
                      className="text-blue-500 hover:text-blue-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Источник {index + 1} →
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">Нет доступных источников</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

