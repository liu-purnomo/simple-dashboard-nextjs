'use client';

import { SkeletonLoading } from '@/layouts/skeleton-loading';
import { fetchAPI } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import {
  MRT_ColumnDef,
  MantineReactTable,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';

type FleetRecord = {
  date: string;
  type: 'date-summary' | 'shift-summary' | 'fleet';
  shift?: 'Day' | 'Night';
  fleet?: string;
  dtCount?: number;
  trip?: number;
  dumping?: string;
  fuel?: number;
  fuelRatio?: number;
  production?: {
    actDaily: number;
    planDaily: number;
    actMTD: number;
    planMTD: number;
  };
};

export const SummaryPage = () => {
  const dispatchSummary = useQuery<any>({
    queryKey: ['SummaryRange'],
    queryFn: () => fetchAPI(`/api/summary`),
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'fleet',
        header: 'Fleet',
        Cell: ({ row }) => {
          if (row.original.type === 'date-summary') return '📊 Daily Summary';
          if (row.original.type === 'shift-summary')
            return `🕒 ${row.original.shift} Shift`;
          return row.original.fleet;
        },
      },
      {
        accessorKey: 'dtCount',
        header: 'DT',
        Cell: ({ row }) => row.original.dtCount ?? '',
      },
      {
        accessorKey: 'trip',
        header: 'Trip',
        Cell: ({ row }) => row.original.trip ?? '',
      },
      {
        accessorKey: 'dumping',
        header: 'Dumping',
        enableGrouping: false,
        Cell: ({ row }) => row.original.dumping ?? '',
      },
      {
        accessorKey: 'fuel',
        header: 'Fuel (L)',
        Cell: ({ row }) =>
          row.original.type === 'shift-summary' &&
          row.original.fuel !== undefined
            ? `${row.original.fuel.toFixed(1)} L`
            : '',
      },
      //   {
      //     accessorKey: 'fuelRatio',
      //     header: 'Fuel Ratio',
      //     Cell: ({ row }) =>
      //       row.original.type === 'shift-summary' &&
      //       row.original.fuelRatio !== null
      //         ? `${row.original.fuelRatio?.toFixed(2)} L/BCM`
      //         : '',
      //   },
      //   {
      //     accessorKey: 'production',
      //     header: 'Production (Daily / MTD)',
      //     enableGrouping: false,
      //     Cell: ({ row }) => {
      //       const p = row.original.production;
      //       if (row.original.type !== 'date-summary' || !p) return '';
      //       return (
      //         <div className="text-xs">
      //           <div>
      //             <strong>Daily:</strong> {p.actDaily.toLocaleString()} /{' '}
      //             {p.planDaily.toLocaleString()} BCM
      //           </div>
      //           <div>
      //             <strong>MTD:</strong> {p.actMTD.toLocaleString()} /{' '}
      //             {p.planMTD.toLocaleString()} BCM
      //           </div>
      //         </div>
      //       );
      //     },
      //   },
    ],
    [],
  );

  const flattened: FleetRecord[] = useMemo(() => {
    return dispatchSummary.data?.data || [];
  }, [dispatchSummary.data]);

  const table = useMantineReactTable({
    columns: columns ?? [],
    data: flattened ?? [],
    enableGrouping: true,
    enableStickyHeader: true,
    enableColumnResizing: true,
    initialState: {
      grouping: ['date'],
      pagination: { pageIndex: 0, pageSize: 100 },
    },
  });

  return (
    <div>
      {dispatchSummary.isLoading || dispatchSummary.isFetching ? (
        <SkeletonLoading />
      ) : (
        <div className="w-full">
          <div className="my-5 mx-auto gap-2 space-y-6">
            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200 flex-col text-center items-center justify-between">
              <div className="font-bold text-xl">ANALISA DATA PRODUKSI</div>
              <div className="font-bold text-xl">PT ARTA DAYA TARUNA</div>
              <div>Site BBA - Berau, Kalimantan Timur</div>
              <div>
                Periode{' '}
                {new Date(
                  dispatchSummary?.data?.range?.startDate,
                ).toLocaleDateString('id-ID', {
                  dateStyle: 'full',
                })}{' '}
                s/d{' '}
                {new Date(
                  dispatchSummary?.data?.range?.endDate,
                ).toLocaleDateString('id-ID', {
                  dateStyle: 'full',
                })}
              </div>
            </div>

            <MantineReactTable table={table} />
          </div>
        </div>
      )}
    </div>
  );
};
