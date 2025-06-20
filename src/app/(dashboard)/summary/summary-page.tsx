'use client';

import { SkeletonLoading } from '@/layouts/skeleton-loading';
import { DateFormat } from '@/lib/date';
import { fetchAPI } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DayCard } from './day-card';

export const SummaryPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const period = `${String(month).padStart(2, '0')}-${year}`;

  const dispatchSummary = useQuery<any>({
    queryKey: ['SummaryRange', period],
    queryFn: () => fetchAPI(`/api/summary?period=${period}`),
  });
  return (
    <div>
      {dispatchSummary.isLoading || dispatchSummary.isFetching ? (
        <SkeletonLoading />
      ) : (
        <div className="w-full">
          <div className="my-5 max-w-3xl mx-auto gap-2 space-y-6">
            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between">
              <div className="font-bold text-xl">ANALISA DATA PRODUKSI</div>
              <div className="font-bold text-xl">PT ARTA DAYA TARUNA</div>
              <div>Site BBA - Berau, Kalimantan Timur</div>
              <div>Periode {DateFormat.monthNameFromPeriod(period)}</div>
            </div>
            <div className="space-y-6">
              {dispatchSummary?.data?.items?.map((data: any, index: number) => (
                <DayCard items={data} key={index} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
