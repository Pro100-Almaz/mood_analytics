'use client';
import React, {useState} from 'react';
import {notFound} from 'next/navigation';
import {useQuery, QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ProgressPage from '@/components/ProgressPage';
import Results from '@/components/Results';
import Image from "next/image";

const queryClient = new QueryClient();
async function fetchResearchStatus(task_id: string) {
    const response = await fetch(`https://api.insitute.etdc.kz/search_status/${task_id}`, {
        method: 'POST',
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
    const [displayReport, setDisplayReport] = useState(false)
    const {data, error, isLoading} = useQuery({
        queryKey: ['researchStatus', id],
        queryFn: () => fetchResearchStatus(id),
        refetchInterval: 10000
    });
    if (data && !data.Prompt) {
        notFound();
    }
    return (
        <div className="min-h-screen flex items-center justify-center">
            {data}
            {displayReport ? (
                <Results
                    full={data?.full_research}
                    createdAt={data?.created_at}
                    finishedAt={data?.finished_at}
                    title={data?.Prompt}
                    web={data?.web}
                    fb={data?.FB}
                    foundPosts={data?.found_posts}
                    foundComments={data?.found_comments}
                    foundDialogs={data?.found_dialog}
                    dataDialogs={data?.egov_dialog}
                    foundEgovNpa={data?.found_egov_npa}
                    foundAdiletNpa={data?.found_adilet_npa}
                    egovNpa={data?.egov_npa}
                    adiletNpa={data?.adilet_npa}
                />
            ) : (
                <ProgressPage setDisplayReport={setDisplayReport}
                              isLoading={isLoading}
                              title={data?.Prompt}
                              web={data?.web}
                              fb={data?.FB}
                              foundPosts={data?.found_posts}
                              foundComments={data?.found_comments}
                              foundDialogs={data?.found_dialog}
                              dataDialogs={data?.egov_dialog}
                              foundEgovNpa={data?.found_egov_npa}
                              foundAdiletNpa={data?.found_adilet_npa}
                              egovNpa={data?.egov_npa}
                              adiletNpa={data?.adilet_npa}
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
            <div className={"pt-8"}>
                <Image className={"mx-auto w-[120px]"} src={'/logo.svg'} width={180} height={143} alt={''}/>
                <ResearchPage id={params.id}/>
            </div>
        </QueryClientProvider>
    );
}