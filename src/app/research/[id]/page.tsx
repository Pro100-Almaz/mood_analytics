"use client";
import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ProgressPage from "@/components/ProgressPage";
import Results from "@/components/Results";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Modal from "@/components/Modal";
const queryClient = new QueryClient();

async function fetchResearchStatus(task_id: string) {
  const response = await fetch(
    `https://api.insitute.etdc.kz/search_status/${task_id}`,
    {
      method: "GET",
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

function ResearchPage({ id }: { id: string }) {
  const [displayReport, setDisplayReport] = useState(false);
  const { data, error, isLoading } = useQuery({
    queryKey: ["researchStatus", id],
    queryFn: () => fetchResearchStatus(id),
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (data?.state === "SUCCESS") {
      setDisplayReport(true);
    }
  }, [data?.state]);

  if (data?.state === "FAILURE") {
    console.log(data);
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {displayReport ? (
        <Results
          full={data?.full_research}
          createdAt={data?.created_at}
          finishedAt={data?.finished_at}
          title={data?.Prompt}
          web={JSON.stringify(data?.result?.response?.web?.citations)}
          research={JSON.stringify(data?.result?.response?.web?.research)}
          fb={JSON.stringify(data?.result?.response?.facebook)}
          foundPosts={data?.found_posts}
          foundComments={data?.found_comments}
          foundDialogs={data?.found_dialog}
          dataDialogs={JSON.stringify(data?.result?.response?.egov?.dialog)}
          foundEgovNpa={data?.found_egov_npa}
          foundAdiletNpa={data?.found_adilet_npa}
          egovNpa={JSON.stringify(data?.result?.response?.egov?.opendata)}
          adiletNpa={JSON.stringify(data?.result?.response?.adilet?.npa)}
          resultData={data}
        />
      ) : (
        <ProgressPage
          setDisplayReport={setDisplayReport}
          isLoading={isLoading}
          title={data?.Prompt}
        />
      )}
    </div>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!params.id || params.id === "undefined") {
    notFound();
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div>
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
        <div className="pt-8">
          <Image
            className="mx-auto w-[120px]"
            src={"/logo.svg"}
            width={180}
            height={143}
            alt={""}
          />

          <ResearchPage id={params.id} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
