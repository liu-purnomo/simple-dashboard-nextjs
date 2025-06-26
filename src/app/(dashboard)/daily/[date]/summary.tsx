'use client';

import { TableFleet } from '@/components/tables/table-fleet';
import { TableFuelOut } from '@/components/tables/table-fuel-out';
import { TableMaintenance } from '@/components/tables/table-maintenance';
import { SkeletonLoading } from '@/layouts/skeleton-loading';
import { DateFormat } from '@/lib/date';
import { fetchAPI } from '@/lib/fetcher';
import { NumberFormat } from '@/lib/number';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FC } from 'react';

const getDiff = (date: string, isY: boolean = false) => {
  const [day, month, year] = date.split('-');
  const y = isY ? Number(day) - 1 : Number(day) + 1;

  return `${y.toString().padStart(2, '0')}-${month}-${year}`;
};

export const DailySummaryPage: FC<{
  date: string;
}> = ({ date }) => {
  const dispatchQuery = useQuery<any>({
    queryKey: ['SummaryDailyData', date],
    queryFn: () => fetchAPI(`/api/summary/${date}`),
  });

  return (
    <div>
      {dispatchQuery.isLoading || dispatchQuery.isFetching ? (
        <SkeletonLoading />
      ) : (
        <div className="w-full">
          <div className="my-5 max-w-3xl mx-auto gap-2 space-y-6">
            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between">
              <div className="font-bold text-xl">SUMMARY</div>
              <div className="font-bold text-xl">PT ARTA DAYA TARUNA</div>
              <div>Site BBA - Berau, Kalimantan Timur</div>
              <div>
                {DateFormat.toIndonesianFullDate(date)}(
                {dispatchQuery?.data?.summary?.week})
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2">
              <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                <div className="flex justify-between">
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    Day Shift
                  </div>
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    {NumberFormat.ratioPercent(
                      dispatchQuery?.data?.summary?.actDs,
                      dispatchQuery?.data?.summary?.planDs,
                    )}
                  </div>
                </div>
                <div className="mt-5 flex items-center">
                  <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                    {NumberFormat.no(dispatchQuery?.data?.summary?.actDs)}
                  </div>
                  <div className="badge bg-white/30">BCM</div>
                </div>
                <div className="mt-5 flex items-center justify-between font-semibold">
                  <div>Fleet</div>
                  <div>{dispatchQuery?.data?.summary?.fleetDs} Fleet</div>
                </div>
                <div className="mt-1 flex items-center justify-between font-semibold">
                  <div>Planning</div>
                  <div>{dispatchQuery?.data?.summary?.planDs} BCM</div>
                </div>
                <div className="mt-1 flex justify-between items-center font-semibold">
                  <div>Fuel</div>
                  <div>
                    {NumberFormat.no(dispatchQuery?.data?.summary?.fuelDs)}{' '}
                    Liter
                  </div>
                </div>
                <div className="mt-1 justify-between flex items-center font-semibold">
                  <div>Fuel Ratio</div>
                  <div>
                    {NumberFormat.no(dispatchQuery?.data?.summary?.frDs)} Liter
                    / BCM
                  </div>
                </div>
              </div>
              <div className="panel bg-gradient-to-r  from-fuchsia-500 to-fuchsia-400">
                <div className="flex justify-between">
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    Night Shift
                  </div>
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    {NumberFormat.ratioPercent(
                      dispatchQuery?.data?.summary?.actNs,
                      dispatchQuery?.data?.summary?.planNs,
                    )}
                  </div>
                </div>
                <div className="mt-5 flex items-center">
                  <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                    {NumberFormat.no(dispatchQuery?.data?.summary?.actNs)}
                  </div>
                  <div className="badge bg-white/30">BCM</div>
                </div>
                <div className="mt-5 flex items-center justify-between font-semibold">
                  <div>Fleet</div>
                  <div>{dispatchQuery?.data?.summary?.fleetNs} Fleet</div>
                </div>
                <div className="mt-1 flex items-center justify-between font-semibold">
                  <div>Planning</div>
                  <div>{dispatchQuery?.data?.summary?.planNs} BCM</div>
                </div>
                <div className="mt-1 flex justify-between items-center font-semibold">
                  <div>Fuel</div>
                  <div>
                    {NumberFormat.no(dispatchQuery?.data?.summary?.fuelNs)}{' '}
                    Liter
                  </div>
                </div>
                <div className="mt-1 justify-between flex items-center font-semibold">
                  <div>Fuel Ratio</div>
                  <div>
                    {NumberFormat.no(dispatchQuery?.data?.summary?.frNs)} Liter
                    / BCM
                  </div>
                </div>
              </div>

              <div className="panel text-dark bg-gradient-to-r from-slate-100 to-slate-200">
                <div className="flex justify-between">
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    Daily
                  </div>
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    {dispatchQuery?.data?.summary?.achDaily}
                  </div>
                </div>
                <div className="mt-5 flex items-center">
                  <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                    {NumberFormat.no(dispatchQuery?.data?.summary?.actDaily)}
                  </div>
                  <div className="badge bg-primary/30">BCM</div>
                </div>
                <div className="mt-1 flex items-center justify-between font-semibold">
                  <div>Planning</div>
                  <div>{dispatchQuery?.data?.summary?.planDaily} BCM</div>
                </div>
                <div className="mt-1 flex justify-between items-center font-semibold">
                  <div>Fuel</div>
                  <div>
                    {NumberFormat.no(dispatchQuery?.data?.summary?.fuelDaily)}{' '}
                    Liter
                  </div>
                </div>
                <div className="mt-1 justify-between flex items-center font-semibold">
                  <div>Fuel Ratio</div>
                  <div>
                    {NumberFormat.no(dispatchQuery?.data?.summary?.frDaily)}{' '}
                    Liter / BCM
                  </div>
                </div>
              </div>
              <div className="panel text-dark bg-gradient-to-r from-slate-100 to-slate-200">
                <div className="flex justify-between">
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    Month To Date
                  </div>
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    {dispatchQuery?.data?.summary?.achMtd}
                  </div>
                </div>
                <div className="mt-5 flex items-center">
                  <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                    {NumberFormat.no(dispatchQuery?.data?.summary?.actMtd)}
                  </div>
                  <div className="badge bg-primary/30">BCM</div>
                </div>

                <div className="mt-1 flex items-center justify-between font-semibold">
                  <div>Planning</div>
                  <div>{dispatchQuery?.data?.summary?.planMtd} BCM</div>
                </div>
                <div className="mt-1 flex justify-between items-center font-semibold">
                  <div>Fuel</div>
                  <div>
                    {NumberFormat.no(dispatchQuery?.data?.summary?.fuelMtd)}{' '}
                    Liter
                  </div>
                </div>
                <div className="mt-1 justify-between flex items-center font-semibold">
                  <div>Fuel Ratio</div>
                  <div>
                    {NumberFormat.no(dispatchQuery?.data?.summary?.frMtd)} Liter
                    / BCM
                  </div>
                </div>
              </div>
            </div>

            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between">
              <div className="font-bold">FLEET DAY SHIFT</div>
            </div>

            <div>
              <TableFleet data={dispatchQuery?.data?.dayShift ?? []} />
            </div>

            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between">
              <div className="font-bold">FLEET NIGHT SHIFT</div>
            </div>

            <div>
              <TableFleet data={dispatchQuery?.data?.nightShift ?? []} />
            </div>

            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between">
              <div className="font-bold">DATA MAINTENANCE</div>
            </div>

            <div>
              <TableMaintenance
                tableName="Maintenance Day Shift"
                data={
                  dispatchQuery?.data?.plant?.filter(
                    (e: PlantSummary) => e.shift == '1',
                  ) ?? []
                }
              />
            </div>

            <div>
              <TableMaintenance
                tableName="Maintenance Night Shift"
                data={
                  dispatchQuery?.data?.plant?.filter(
                    (e: PlantSummary) => e.shift == '2',
                  ) ?? []
                }
              />
            </div>

            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between">
              <div className="font-bold">DATA FUEL</div>
            </div>

            <div>
              <TableFuelOut
                tableName="Fuel Day Shift"
                data={
                  dispatchQuery?.data?.fuel?.filter(
                    (e: FuelOutRow) => e.shift == 'Day Shift',
                  ) ?? []
                }
              />
            </div>

            <div>
              <TableFuelOut
                tableName="Fuel Night Shift"
                data={
                  dispatchQuery?.data?.fuel?.filter(
                    (e: FuelOutRow) => e.shift == 'Night Shift',
                  ) ?? []
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="my-5 panel max-w-3xl mx-auto  flex mb-5 justify-between items-center">
        <Link
          href={getDiff(date, true)}
          className="flex items-center gap-2 hover:text-primary"
        >
          <IconArrowLeft className="w-6" />
          Kemarin
        </Link>
        <Link href={'/'} className=" hover:text-primary">
          Beranda
        </Link>
        <Link
          href={getDiff(date)}
          className="flex items-center gap-2 hover:text-primary"
        >
          Besok
          <IconArrowRight className="w-6" />
        </Link>
      </div>
    </div>
  );
};
