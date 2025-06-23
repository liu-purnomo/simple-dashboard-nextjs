'use client';

import { SkeletonLoading } from '@/layouts/skeleton-loading';
import { DateFormat } from '@/lib/date';
import { fetchAPI } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DayCard } from './day-card';

type Item = {
  date: string; // "dd/mm/yyyy"
  [key: string]: any;
};

type SortOrder = 'Terbaru' | 'Terlama';

export const SummaryPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [order, setOrder] = useState<SortOrder>('Terbaru');
  const [search, setSearch] = useState<string>('');

  const period = `${String(month).padStart(2, '0')}-${year}`;

  const dispatchSummary = useQuery<any>({
    queryKey: ['SummaryRange', period],
    queryFn: () => fetchAPI(`/api/summary?period=${period}`),
  });

  const dataFleet = useQuery<any>({
    queryKey: ['dataFleet', period],
    queryFn: () => fetchAPI(`/api/fleet?period=${period}`),
  });

  const handleToggleOrder = () => {
    setOrder((prev) => (prev === 'Terlama' ? 'Terbaru' : 'Terlama'));
  };

  const getSortedAndFilteredData = (items: Item[]) => {
    const filtered = search
      ? items.filter((i) => i.date.includes(search))
      : [...items];

    filtered.sort((a, b) => {
      const [da, ma, ya] = a.date.split('/').map(Number);
      const [db, mb, yb] = b.date.split('/').map(Number);
      const dateA = new Date(ya, ma - 1, da).getTime();
      const dateB = new Date(yb, mb - 1, db).getTime();
      return order === 'Terlama' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  };

  const sortedItems = dispatchSummary.data?.items
    ? getSortedAndFilteredData(dispatchSummary.data.items)
    : [];

  return (
    <div>
      {dispatchSummary.isLoading || dispatchSummary.isFetching ? (
        <SkeletonLoading />
      ) : (
        <div className="w-full">
          <div className="my-5 max-w-3xl mx-auto gap-2 space-y-6">
            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200 flex-col text-center items-center justify-between">
              <div className="font-bold text-xl">ANALISA DATA PRODUKSI</div>
              <div className="font-bold text-xl">PT ARTA DAYA TARUNA</div>
              <div>Site BBA - Berau, Kalimantan Timur</div>
              <div>Periode {DateFormat.monthNameFromPeriod(period)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4  panel">
              <input
                type="text"
                placeholder="Cari tanggal (dd/mm/yyyy)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input max-w-md"
              />
              <button
                onClick={handleToggleOrder}
                className="btn btn-sm btn-secondary"
              >
                Urutkan: {order}
              </button>
            </div>

            <div className="space-y-6">
              {sortedItems.map((data: any, index: number) => {
                const fleetData = dataFleet?.data?.find(
                  (fleet: DailySummary) => fleet.date === data.date,
                );
                return <DayCard items={data} key={index} fleet={fleetData} />;
              })}
              {sortedItems.length === 0 && (
                <div className="text-center text-gray-500">
                  Tidak ada data ditemukan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
