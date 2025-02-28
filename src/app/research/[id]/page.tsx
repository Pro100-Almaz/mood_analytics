'use client';
import React, {useState, useEffect} from 'react';
import {notFound} from 'next/navigation';
import {useQuery, QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ProgressPage from '@/components/ProgressPage';
import Results from '@/components/Results';
import Image from "next/image";

const queryClient = new QueryClient();

async function fetchResearchStatus(task_id: string) {
    const response = await fetch(`https://api.insitute.etdc.kz/search_status/${task_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

function ResearchPage({id}: { id: string }) {
    const [displayReport, setDisplayReport] = useState(false);
    const {data, error, isLoading} = useQuery({
        queryKey: ['researchStatus', id],
        queryFn: () => fetchResearchStatus(id),
        refetchInterval: 10000
    });

    useEffect(() => {
        if (data?.state === 'SUCCESS') {
            setDisplayReport(true);
        }
    }, [data?.state]);

    if (data?.state === 'FAILURE') {
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
                    web={JSON.stringify(data?.result?.response?.citations)}
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

export default function Page({params}: { params: { id: string } }) {
    if (!params.id || params.id === 'undefined') {
        notFound();
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className="pt-8">
                <Image className="mx-auto w-[120px]" src={'/logo.svg'} width={180} height={143} alt={''}/>
                <ResearchPage id={params.id}/>
            </div>
        </QueryClientProvider>
    );
}
