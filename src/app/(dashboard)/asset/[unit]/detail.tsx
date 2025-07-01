'use client';

import { SkeletonLoading } from '@/layouts/skeleton-loading';
import { fetchAPI } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { FloatingBottomBar } from './bottom-bar';

export const DetailAsset: FC<{
  unit: string;
}> = ({ unit }) => {
  const dispatchQuery = useQuery<any>({
    queryKey: ['SummaryDailyData', unit],
    queryFn: () => fetchAPI(`/api/asset/${unit}`),
  });

  return (
    <div>
      <FloatingBottomBar />

      <div className="my-5 panel max-w-3xl mx-auto  flex mb-5 justify-between items-center">
        {/* <Link href={getDiff(date, true)} className="btn btn-outline-primary ">
          <IoIosArrowBack className="me-2" />
          Kemarin
        </Link>
        <Link href={'/'} className="btn btn-outline-primary  ">
          Beranda
        </Link>
        <Link href={getDiff(date)} className=" btn btn-outline-primary ">
          Besok
          <IoIosArrowForward className="ms-2" />
        </Link> */}
      </div>

      {dispatchQuery.isLoading || dispatchQuery.isFetching ? (
        <SkeletonLoading />
      ) : (
        <div className="w-full">
          <div className="my-5 max-w-3xl mx-auto gap-2 space-y-6">
            <div
              id="summary"
              className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between"
            >
              <div className="font-bold text-xl">SUMMARY</div>
              <div className="font-bold text-xl">PT ARTA DAYA TARUNA</div>
              <div>Site BBA - Berau, Kalimantan Timur</div>
              <div></div>
            </div>

            <div
              id="fleet"
              className="panel py-3 flex text-dark bg-gradient-to-r from-slate-100 to-slate-200  flex-col text-center items-center justify-between"
            >
              <div className="font-bold">FLEET DAY SHIFT</div>
            </div>
          </div>
        </div>
      )}

      <div className="my-5 panel max-w-3xl mx-auto  flex mb-10 justify-between items-center">
        {/* <Link href={getDiff(date, true)} className="btn btn-outline-primary ">
          <IoIosArrowBack className="me-2" />
          Kemarin
        </Link>
        <Link href={'/'} className="btn btn-outline-primary  ">
          Beranda
        </Link>
        <Link href={getDiff(date)} className=" btn btn-outline-primary ">
          Besok
          <IoIosArrowForward className="ms-2" />
        </Link> */}
      </div>
    </div>
  );
};
