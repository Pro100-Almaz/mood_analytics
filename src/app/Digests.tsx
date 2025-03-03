"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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

function Digests() {
  const [currentPage, setCurrentPage] = useState(1);

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
    <div className="min-h-screen bg-gray-100 p-6">
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
                <th className="border border-gray-400 px-6 py-3">Название</th>
                <th className="border border-gray-400 px-6 py-3">Дата</th>
                <th className="border border-gray-400 px-6 py-3">Действие</th>
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
                      {index + 1}
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

          <div className="flex justify-end mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Назад
            </button>
            <p className="mx-4">Страница {currentPage}</p>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Вперед
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Digests;
