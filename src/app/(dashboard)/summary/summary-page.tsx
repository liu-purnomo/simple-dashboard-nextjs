'use client';

import { SkeletonLoading } from '@/layouts/skeleton-loading';
import { fetchAPI } from '@/lib/fetcher';
import { Normalize } from '@/lib/normalize';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const SummaryPage = () => {
  const dispatchSummary = useQuery<any>({
    queryKey: ['SummaryRange'],
    queryFn: () => fetchAPI(`/api/summary/range`),
  });

  //   console.log(dispatchSummary.data);

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
              <div className="flex justify-between gap-2">
                <div>
                  Fuel Consumption :{' '}
                  {Number(
                    dispatchSummary?.data?.summary?.totalFuel,
                  ).toLocaleString()}
                  Liter
                </div>{' '}
                -{' '}
                <div>
                  Production :{' '}
                  {Number(
                    dispatchSummary?.data?.summary?.totalBcm,
                  ).toLocaleString()}
                  BCM
                </div>{' '}
                -{' '}
                <div>
                  Fuel Ratio :{' '}
                  {Number(
                    dispatchSummary?.data?.summary?.fuelRatio,
                  ).toLocaleString()}
                  liter/BCM
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {dispatchSummary?.data?.data?.map(
                (dailyData: any, index: number) => {
                  return (
                    <div key={index} className="panel space-y-2">
                      {/* header */}
                      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Date</div>
                          <Link
                            href={`/${formatDate(new Date(dailyData.date))}`}
                            className="font-bold cursor-pointer"
                          >
                            {new Date(dailyData.date).toLocaleDateString(
                              'id-ID',
                              {
                                dateStyle: 'medium',
                              },
                            )}
                          </Link>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Act Daily</div>
                          <div className="font-bold">
                            {dailyData.production.actDaily}BCM
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Plan Daily</div>
                          <div className="font-bold">
                            {dailyData.production.planDaily}BCM
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Ach Daily</div>
                          <div className="font-bold">
                            {dailyData.production.achDaily}
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Fuel Daily</div>
                          <div className="font-bold">
                            {Number(dailyData.fuel.daily).toLocaleString()}
                            ltr
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>FR Daily</div>
                          <div className="font-bold">
                            {Number(
                              Number(dailyData.fuel.daily) /
                                Normalize.number(dailyData.production.actDaily),
                            ).toFixed(2)}
                            ltr/BCM
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Act MTD</div>
                          <div className="font-bold">
                            {dailyData.production.actMTD}
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Plan MTD</div>
                          <div className="font-bold">
                            {dailyData.production.planMTD}
                          </div>
                        </div>
                      </div>

                      <div>
                        <hr />
                      </div>

                      <div className="w-full text-center font-bold">
                        Day Shift
                      </div>

                      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Act DS</div>
                          <div className="font-bold">
                            {dailyData.production.actDs}BCM
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Plan DS</div>
                          <div className="font-bold">
                            {dailyData.production.planDs}BCM
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Fuel DS</div>
                          <div className="font-bold">
                            {Number(dailyData.fuel.ds).toLocaleString()}
                            ltr
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>FR DS</div>
                          <div className="font-bold">
                            {Number(
                              Number(dailyData.fuel.ds) /
                                Normalize.number(dailyData.production.actDs),
                            ).toFixed(2)}
                            ltr/BCM
                          </div>
                        </div>
                      </div>

                      <div>
                        <table className="table-responsive">
                          <thead>
                            <tr>
                              <th>Fleet</th>
                              <th>DT</th>
                              <th>Ritase</th>
                              <th>Waste Dump</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dailyData?.ds?.fleet?.map(
                              (
                                fleet: {
                                  fleet: string;
                                  dt: string[];
                                  trip: number;
                                  material: string[];
                                  dumping: string[];
                                },
                                indexA: number,
                              ) => {
                                return (
                                  <tr key={indexA}>
                                    <td className="font-bold whitespace-nowrap">
                                      {fleet.fleet}
                                    </td>
                                    <td>{fleet.dt.length}</td>
                                    <td>{fleet.trip}</td>
                                    <td className="whitespace-nowrap">
                                      {fleet.dumping.map((text: string) => (
                                        <span key={text}>
                                          - {text} <br />
                                        </span>
                                      ))}
                                    </td>
                                  </tr>
                                );
                              },
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <hr />
                      </div>

                      <div className="w-full text-center font-bold">
                        Night Shift
                      </div>

                      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Act NS</div>
                          <div className="font-bold">
                            {dailyData.production.actNs}BCM
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Plan NS</div>
                          <div className="font-bold">
                            {dailyData.production.planNs}BCM
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>Fuel NS</div>
                          <div className="font-bold">
                            {Number(dailyData.fuel.ns).toLocaleString()}
                            ltr
                          </div>
                        </div>
                        <div className="flex shadow-sm bg-slate-100 rounded-md p-2 justify-between items-center">
                          <div>FR NS</div>
                          <div className="font-bold">
                            {Number(
                              Number(dailyData.fuel.ns) /
                                Normalize.number(dailyData.production.actNs),
                            ).toFixed(2)}
                            ltr/BCM
                          </div>
                        </div>
                      </div>

                      <div>
                        <table className="table-responsive">
                          <thead>
                            <tr>
                              <th>Fleet</th>
                              <th>DT</th>
                              <th>Ritase</th>
                              <th>Waste Dump</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dailyData?.ns?.fleet?.map(
                              (
                                fleet: {
                                  fleet: string;
                                  dt: string[];
                                  trip: number;
                                  material: string[];
                                  dumping: string[];
                                },
                                indexA: number,
                              ) => {
                                return (
                                  <tr key={indexA}>
                                    <td className="font-bold whitespace-nowrap">
                                      {fleet.fleet}
                                    </td>
                                    <td>{fleet.dt.length}</td>
                                    <td>{fleet.trip}</td>
                                    <td className="whitespace-nowrap">
                                      {fleet.dumping.map((text: string) => (
                                        <span key={text}>
                                          - {text} <br />
                                        </span>
                                      ))}
                                    </td>
                                  </tr>
                                );
                              },
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* <div className="flex flex-col justify-center gap-2">
                        <div className="flex items-center p-2 gap-2 bg-green-100 justify-between">
                          <div>Day Shift</div>
                          <div></div>
                        </div>
                        <div className="flex items-center p-2 gap-2 bg-blue-100  justify-between">
                          <div>Night Shift</div>
                          <div>
                            <table className="table-responsive">
                              <thead>
                                <tr>
                                  <th>Fleet</th>
                                  <th>DT</th>
                                  <th>Ritase</th>
                                  <th>Waste Dump</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dailyData?.ns?.fleet?.map(
                                  (
                                    fleet: {
                                      fleet: string;
                                      dt: string[];
                                      trip: number;
                                      material: string[];
                                      dumping: string[];
                                    },
                                    indexA: number,
                                  ) => {
                                    return (
                                      <tr key={indexA}>
                                        <td className="font-bold whitespace-nowrap">
                                          {fleet.fleet}
                                        </td>
                                        <td>{fleet.dt.length}</td>
                                        <td>{fleet.trip}</td>
                                        <td className="whitespace-nowrap">
                                          {fleet.dumping.map((text: string) => (
                                            <span key={text}>
                                              - {text} <br />
                                            </span>
                                          ))}
                                        </td>
                                      </tr>
                                    );
                                  },
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
