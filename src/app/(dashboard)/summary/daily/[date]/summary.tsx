'use client';

import { SkeletonLoading } from '@/layouts/skeleton-loading';
import { fetchAPI } from '@/lib/fetcher';
import { NumberFormat } from '@/lib/number';
import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';

export const DailySummaryPage: FC<{
  date: string;
}> = ({ date }) => {
  const dispatchQuery = useQuery<any>({
    queryKey: ['SummaryDaily', date],
    queryFn: () => fetchAPI(`/api/summary/${date}`),
  });

  return (
    <div>
      {dispatchQuery.isLoading || dispatchQuery.isFetching ? (
        <SkeletonLoading />
      ) : (
        <div className="w-full">
          <div className="my-5 max-w-xl mx-auto gap-2 space-y-6">
            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between">
              <div className="font-bold text-xl">SUMMARY</div>
              <div className="font-bold text-xl">PT ARTA DAYA TARUNA</div>
              <div>Site BBA - Berau, Kalimantan Timur</div>
              <div>
                {new Date(date).toLocaleDateString('id-ID', {
                  dateStyle: 'full',
                })}{' '}
                ({dispatchQuery?.data?.production.week})
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2">
              <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                <div className="flex justify-between">
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    Day Shift
                  </div>
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    {Number(
                      (NumberFormat.parse(
                        dispatchQuery?.data?.production.actDs,
                      ) /
                        NumberFormat.parse(
                          dispatchQuery?.data?.production.planDs,
                        )) *
                        100,
                    ).toFixed(2)}
                    %
                  </div>
                </div>
                <div className="mt-5 flex items-center">
                  <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                    {dispatchQuery?.data?.production.actDs}
                  </div>
                  <div className="badge bg-white/30">BCM</div>
                </div>
                <div className="mt-5 flex items-center justify-between font-semibold">
                  <div>Actual Fleet</div>
                  <div>{dispatchQuery?.data?.ds?.fleet?.length} Fleet</div>
                </div>
                <div className="mt-1 flex items-center justify-between font-semibold">
                  <div>Planning</div>
                  <div>{dispatchQuery?.data?.production.planDs} BCM</div>
                </div>
                <div className="mt-1 flex justify-between items-center font-semibold">
                  <div>Fuel</div>
                  <div>
                    {Number(dispatchQuery?.data?.fuel.ds).toLocaleString(
                      'id-ID',
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      },
                    )}{' '}
                    Liter
                  </div>
                </div>
                <div className="mt-1 justify-between flex items-center font-semibold">
                  <div>Fuel Ratio</div>
                  {/* <div>
                    {Number(
                      Normalize.number(dispatchQuery?.data?.fuel.ds) /
                        Normalize.number(dispatchQuery?.data?.production.actDs),
                    ).toLocaleString('id-ID', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}{' '}
                    Liter / BCM
                  </div> */}
                </div>
              </div>
              <div className="panel bg-gradient-to-r  from-fuchsia-500 to-fuchsia-400">
                <div className="flex justify-between">
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    Night Shift
                  </div>
                  {/* <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    {Number(
                      (Normalize.number(dispatchQuery?.data?.production.actNs) /
                        Normalize.number(
                          dispatchQuery?.data?.production.planNs,
                        )) *
                        100,
                    ).toFixed(2)}
                    %
                  </div> */}
                </div>
                <div className="mt-5 flex items-center">
                  <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                    {dispatchQuery?.data?.production.actNs}
                  </div>
                  <div className="badge bg-white/30">BCM</div>
                </div>
                <div className="mt-5 flex items-center justify-between font-semibold">
                  <div>Actual Fleet</div>
                  <div>{dispatchQuery?.data?.ns?.fleet?.length} Fleet</div>
                </div>
                <div className="mt-1 flex items-center justify-between font-semibold">
                  <div>Planning</div>
                  <div>{dispatchQuery?.data?.production.planNs} BCM</div>
                </div>
                <div className="mt-1 flex justify-between items-center font-semibold">
                  <div>Fuel</div>
                  <div>
                    {Number(dispatchQuery?.data?.fuel.ns).toLocaleString(
                      'id-ID',
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      },
                    )}{' '}
                    Liter
                  </div>
                </div>
                <div className="mt-1 justify-between flex items-center font-semibold">
                  <div>Fuel Ratio</div>
                  {/* <div>
                    {Number(
                      Normalize.number(dispatchQuery?.data?.fuel.ns) /
                        Normalize.number(dispatchQuery?.data?.production.actNs),
                    ).toLocaleString('id-ID', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}{' '}
                    Liter / BCM
                  </div> */}
                </div>
              </div>

              <div className="panel text-dark bg-gradient-to-r from-slate-100 to-slate-200">
                <div className="flex justify-between">
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    Daily
                  </div>
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    {dispatchQuery?.data?.production.achDaily}
                  </div>
                </div>
                <div className="mt-5 flex items-center">
                  <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                    {dispatchQuery?.data?.production.actDaily}
                  </div>
                  <div className="badge bg-primary/30">BCM</div>
                </div>

                <div className="mt-1 flex items-center justify-between font-semibold">
                  <div>Planning</div>
                  <div>{dispatchQuery?.data?.production.planDaily} BCM</div>
                </div>
                <div className="mt-1 flex justify-between items-center font-semibold">
                  <div>Fuel</div>
                  <div>
                    {Number(dispatchQuery?.data?.fuel.daily).toLocaleString(
                      'id-ID',
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      },
                    )}{' '}
                    Liter
                  </div>
                </div>
                <div className="mt-1 justify-between flex items-center font-semibold">
                  <div>Fuel Ratio</div>
                  {/* <div>
                    {Normalize.number(
                      dispatchQuery?.data?.fuelRatio,
                    ).toLocaleString('id-ID', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}{' '}
                    Liter / BCM
                  </div> */}
                </div>
              </div>
              <div className="panel text-dark bg-gradient-to-r from-slate-100 to-slate-200">
                <div className="flex justify-between">
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    Month To Date
                  </div>
                  <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                    {dispatchQuery?.data?.production.achMTD}
                  </div>
                </div>
                <div className="mt-5 flex items-center">
                  <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                    {dispatchQuery?.data?.production.actMTD}
                  </div>
                  <div className="badge bg-primary/30">BCM</div>
                </div>

                <div className="mt-1 flex items-center justify-between font-semibold">
                  <div>Planning</div>
                  <div>{dispatchQuery?.data?.production.planMTD} BCM</div>
                </div>
              </div>
            </div>

            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between">
              <div className="font-bold">FLEET DAY SHIFT</div>
            </div>

            <div>
              <div className="w-full">
                <table className="table-responsive">
                  <thead>
                    <tr>
                      <th>Fleet</th>
                      <th>Unit</th>
                      <th>Ritase</th>
                      <th>Dumping</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatchQuery?.data?.ds?.fleet?.map(
                      (
                        fleet: {
                          fleet: string;
                          dt: string[];
                          trip: number;
                          material: string[];
                          dumping: string[];
                        },
                        index: number,
                      ) => {
                        return (
                          <tr key={index}>
                            <td className="font-bold whitespace-nowrap">
                              {fleet.fleet}
                            </td>
                            <td>{fleet.dt.length}</td>
                            <td>{fleet.trip}</td>
                            <td className="whitespace-nowrap">
                              {fleet.dumping.join(', ')}
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between">
              <div className="font-bold">FLEET NIGHT SHIFT</div>
            </div>

            <div>
              <div className="w-full">
                <table className="table-responsive">
                  <thead>
                    <tr>
                      <th>Fleet</th>
                      <th>Unit</th>
                      <th>Ritase</th>
                      <th>Dumping</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatchQuery?.data?.ns?.fleet?.map(
                      (
                        fleet: {
                          fleet: string;
                          dt: string[];
                          trip: number;
                          material: string[];
                          dumping: string[];
                        },
                        index: number,
                      ) => {
                        return (
                          <tr key={index}>
                            <td className="font-bold whitespace-nowrap">
                              {fleet.fleet}
                            </td>
                            <td>{fleet.dt.length}</td>
                            <td>{fleet.trip}</td>
                            <td className="whitespace-nowrap">
                              {fleet.dumping.join(', ')}
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
