"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { AIVisualization } from "@/components/AIVisualization";
import { HistorySlider } from "@/components/HistorySlider";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { Switch } from "@/components/Switch/Switch";

interface Research {
  id: number;
  created_at: string;
  query: string;
  Tools: string;
  web: string;
  "Final report": string;
  HTML: string;
  egov: string;
  FB: string;
  finished_at?: string;
}

async function createResearch({
  searchQuery,
}: {
  searchQuery: string;
}): Promise<{ task_id: number }> {
  const response = await fetch("https://api.insitute.etdc.kz/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: searchQuery,
    }),
  });
  if (!response.ok) {
    throw new Error("Ошибка при создании исследования");
  }
  const data = await response.json();

  return data;
}
async function getLatestResearches() {
  const response = await fetch("https://api.insitute.etdc.kz/least", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
async function getTableData(page: number = 1) {
  const response = await fetch(
    `https://api.insitute.etdc.kz/digests?page=${page}&limit=10`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
const queryClient = new QueryClient();

function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fullResearch, setFullResearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pathname = usePathname();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const handleSubmitReview = () => {
    if (reviewText.trim().length < 5) {
      alert("Отзыв должен содержать минимум 5 символов.");
      return;
    }
    console.log("Отправленный отзыв:", reviewText);
    setIsReviewOpen(false);
    setReviewText("");
  };
  const { data: latest } = useQuery({
    queryKey: ["latestResearches"],
    queryFn: () => getLatestResearches(),
    staleTime: 60 * 1000,
  });
  const {
    data: tableData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tableData", currentPage],
    queryFn: () => getTableData(currentPage),
    staleTime: 60 * 1000,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate, isPending, data, isSuccess } = useMutation<
    { task_id: number },
    Error,
    { searchQuery: string }
  >({
    mutationFn: createResearch,
    onSuccess: (data) => {
      // data будет типа ResearchResponse
      router.push(`/research/${data.task_id}`);
    },
    onError: (error) => {
      // error будет типа Error
      console.error(error);
    },
  });

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchQuery(e.target.value);
    setIsTyping(true);
    adjustHeight();

    const timeoutId = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between">
          <nav className="flex space-x-4 flex items-center">
            <Link
              href="/"
              className={`px-4 py-2 rounded  ${
                pathname === "/page.tsx"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Главная
            </Link>
            <Link
              href="/digests"
              className={`px-4 py-2 rounded ${
                pathname === "/digest-table.tsx"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Отчёты
            </Link>
          </nav>
          <div className="flex justify-end p-4">
            <motion.button
              className="relative z-30 px-4 py-2 flex items-center justify-center gap-2 rounded-lg 
                               text-base font-light tracking-wide transition-all duration-300 ease-out 
                               bg-gradient-to-r from-indigo-600/90 to-blue-600/90 hover:shadow-xl 
                               hover:scale-105 shadow-lg text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Загрузить дайджест
            </motion.button>
          </div>
        </div>
      </header>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Image
          className={"mx-auto w-[120px] mb-8"}
          src={"/logo.svg"}
          width={180}
          height={143}
          alt={""}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-3 tracking-tight">
            Аналитическая система
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600">
              Института Парламентаризма РК
            </span>
          </h1>
          <p className="text-lg font-light text-gray-600">
            Интеллектуальный анализ данных для принятия эффективных решений
          </p>
        </motion.div>

        <div className="mb-8">
          <HistorySlider
            researches={
              latest
                ? latest.map((el: Research) => ({
                    id: el.id,
                    query: el.query,
                    date: el.created_at,
                    status: el.finished_at ? "completed" : "in_progress",
                  }))
                : []
            }
          />
        </div>

        <motion.div
          className="relative z-20 max-w-[800px] mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <div className="relative flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={searchQuery}
                  onChange={handleQueryChange}
                  placeholder="Введите тему исследования..."
                  className={`w-full text-base text-gray-800 bg-transparent outline-none
                                    font-light leading-relaxed resize-none
                                    whitespace-pre-wrap break-words
                                    min-h-[24px] overflow-hidden ${
                                      searchQuery.length > 0 &&
                                      searchQuery.length < 10
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor:
                      "rgba(99, 102, 241, 0.5) rgba(255, 255, 255, 0.1)",
                  }}
                />
                {searchQuery.length > 0 && searchQuery.length < 10 && (
                  <div className="text-red-500 text-xs mt-1">
                    Минимум 10 символов требуется.
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-4 bg-indigo-500 animate-[blink_1s_ease-in-out_infinite]" />
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs">
                      {isTyping
                        ? "Ввод текста..."
                        : searchQuery
                        ? "Тема задана"
                        : "Тема не задана"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="airplane-mode"
                    checked={fullResearch}
                    onCheckedChange={setFullResearch}
                  />
                  <label
                    htmlFor="airplane-mode"
                    className="text-xs text-gray-400"
                  >
                    Детальное исследование
                  </label>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative flex justify-center items-center mb-8 h-[235px]">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-[235px] h-[235px]">
              <AIVisualization isHovered={isHovered} />
            </div>
          </div>

          <motion.button
            initial={false}
            onClick={() => {
              if (searchQuery.length >= 10) {
                mutate({ searchQuery });
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative z-30 px-4 py-2 flex items-center justify-center gap-2 rounded-lg text-base font-light tracking-wide transition-all duration-300 ease-out ${
              searchQuery.length > 0 && searchQuery.length < 10
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600/90 to-blue-600/90 hover:shadow-xl hover:scale-105 shadow-lg text-white"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            Начать исследование
            {isPending && (
              <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
            )}
          </motion.button>
        </div>
        <>
      <motion.button
        onClick={() => setIsReviewOpen(true)}
        className="fixed bottom-6 right-6 z-30 px-4 py-2 flex items-center justify-center gap-2 rounded-lg 
                               text-base font-light tracking-wide transition-all duration-300 ease-out 
                               bg-gradient-to-r from-indigo-600/90 to-blue-600/90 hover:shadow-xl 
                              shadow-lg text-white hover:scale-105 "
      >
        Оставить отзыв
      </motion.button>

      {isReviewOpen && (
        <div className="fixed bottom-16 right-6 bg-white p-4 shadow-lg rounded-lg w-80 border border-gray-200 mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Ваш отзыв</h3>
          <textarea
            className="w-full border p-2 rounded resize-none text-gray-700"
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Напишите ваш отзыв..."
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button
              className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setIsReviewOpen(false)}
            >
              Отмена
            </button>
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSubmitReview}
            >
              Отправить
            </button>
          </div>
        </div>
      )}
    </>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}
