"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Modal from "@/components/Modal";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
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

function Digests() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pathname = usePathname();

  const {
    data: tableData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tableData", currentPage],
    queryFn: () => getTableData(currentPage),
    staleTime: 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-gray-100">
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
      <div className="flex justify-center">
        <div className="w-2/3 p-6">
          <h1 className="text-2xl font-light text-gray-800 mb-4">Дайджест</h1>

          {isLoading ? (
            <p>Загрузка данных...</p>
          ) : isError ? (
            <p className="text-red-500">Ошибка загрузки данных</p>
          ) : (
            <>
              <table className="w-full border-collapse border border-gray-400 rounded-lg shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-300 text-gray-800 text-left">
                    <th className="border border-gray-400 px-4 py-3">Номер</th>
                    <th className="border border-gray-400 px-6 py-3">
                      Название
                    </th>
                    <th className="border border-gray-400 px-6 py-3">Дата</th>
                    <th className="border border-gray-400 px-6 py-3">
                      Действие
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.data?.length ? (
                    tableData.data.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className="odd:bg-white even:bg-gray-100 transition-colors"
                      >
                        <td className="border border-gray-400 px-6 py-3">
                          {(currentPage - 1) * 10 + index + 1}
                        </td>
                        <td className="border border-gray-400 px-6 py-3">
                          {item.title}
                        </td>
                        <td className="border border-gray-400 px-6 py-3">
                          {item.date}
                        </td>
                        <td className="border border-gray-400 px-6 py-3 text-center">
                          <a
                            href={`https://api.insitute.etdc.kz/digest?id=${item.id}`}
                            rel="noopener noreferrer"
                          >
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                              Скачать
                            </button>
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center p-4">
                        Данные отсутствуют
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="flex gap-4 mt-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div className="flex items-center">
                    <p>Страница {currentPage}</p>
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <Digests />
    </QueryClientProvider>
  );
}
