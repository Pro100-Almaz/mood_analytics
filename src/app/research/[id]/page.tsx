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
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const [dataDialogs, setDataDialogs] = useState(null);
  const [openData, setOpenData] = useState(null);
  const [openDataOpinion, setOpenDataOpinion] = useState(null);
  const [dialogsOpinion, setDialogsOpinion] = useState(null);
  const [web, setWeb] = useState(null);
  const [fb, setFb] = useState(null);
  const [fbOpinion, setFbOpinion] = useState(null);
  const [instagram, setInstagram] = useState(null);
  const [instagramOpinion, setInstagramOpinion] = useState(null);
  const [budgets, setBudgets] = useState(null);
  const [nla, setNla] = useState(null);
  const [nlaOpinion, setNlaOpinion] = useState(null);
  const [egovNpa, setEgovNpa] = useState(null);
  const [adiletNpa, setAdiletNpa] = useState(null);
  const [adiletOpinion, setadiletOpinion] = useState(null);


  const { data, error, isLoading } = useQuery({
    queryKey: ["researchStatus", id],
    queryFn: () => fetchResearchStatus(id),
    refetchInterval: shouldRefetch ? 10000 : false,
  });

  const POLLING_INTERVAL = 10000; 
  
  useEffect(() => {
    if (data?.state === "SUCCESS") {
      setShouldRefetch(false);
  
      if (data?.result?.process_ids) {
        const fetchTasks = async () => {
          const responses = await Promise.all(
            data.result.process_ids.map(async ({ process_type, task_id }: { process_type: string; task_id: string }) => {
              const res = await fetchResearchStatus(task_id);
              return { process_type, res };
            })
          );
  
          let allSuccess = true;
  
          responses.forEach(({ process_type, res }) => {
            if (res?.state !== "SUCCESS") {
              allSuccess = false;
            }
  
            switch (process_type) {
              case "Dialog":
                setDataDialogs(res?.result?.response?.all);
                setDialogsOpinion(res?.result?.response?.ai_response);
                break;
              case "Web":
                setWeb(res?.result?.response);
                break;
              case "FB":
                setFb(res?.result?.response?.all);
                setFbOpinion(res?.result?.response?.ai_response);
                break;
              case "Instagram":
                setInstagram(res?.result?.response?.all);
                setInstagramOpinion(res?.result?.response?.ai_response);
                break;
              case "Budgets":
                setBudgets(res?.result?.response);
                break;
              case "NLA":
                setNla(res?.result?.response?.all);
                setNlaOpinion(res?.result?.response?.ai_response);
                break;
              case "Adilet":
                setAdiletNpa(res?.result?.response?.all);
                setadiletOpinion(res?.result?.response?.ai_response);
                break;
              case "Opendata":
                setOpenData(res?.result?.response?.all);
                setOpenDataOpinion(res?.result?.response?.ai_response);
                break;
            }
          });
  
          if (allSuccess) {
            setDisplayReport(true);
          } else if (shouldRefetch) {
            setTimeout(fetchTasks, POLLING_INTERVAL);
          }
        };
  
        fetchTasks();
      } else {
        setDisplayReport(true);
      }
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
          task_id = {id}
          full={data?.full_research}
          createdAt={data?.created_at}
          finishedAt={data?.finished_at}
          title={data?.Prompt}
          web={JSON.stringify(web)}
          fb={JSON.stringify(fb)}
          instagram={JSON.stringify(instagram)}
          fbOpinion={JSON.stringify(fbOpinion)}
          instagramOpinion={JSON.stringify(instagramOpinion)}
          foundPosts={data?.found_posts}
          foundComments={data?.found_comments}
          foundDialogs={JSON.stringify(dataDialogs)}
          dataDialogs={JSON.stringify(dataDialogs)}
          foundEgovNpa={data?.found_egov_npa}
          foundAdiletNpa={data?.found_adilet_npa}
          egovNpa={JSON.stringify(egovNpa)}
          openData={JSON.stringify(openData)}
          openDataOpinion={JSON.stringify(openDataOpinion)}
          dialogsArrayOpinion={JSON.stringify(dialogsOpinion)}
          adiletOpinion={JSON.stringify(adiletOpinion)}
          adiletNpa={JSON.stringify(adiletNpa)}
          budgets={JSON.stringify(budgets)}
          nla={JSON.stringify(nla)}
          nlaOpinion={JSON.stringify(nlaOpinion)}
          // adilet={JSON.stringify(adilet)}
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
