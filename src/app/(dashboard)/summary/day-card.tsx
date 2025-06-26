'use client';

import { TableFleet } from '@/components/tables/table-fleet';
import { DateFormat } from '@/lib/date';
import Link from 'next/link';
import { useState } from 'react';

const clean = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseFloat(String(val).replace(/[^\d.-]+/g, '')) || 0;
};

export function percent(
  actual?: string | number,
  planning?: string | number,
  digits = 2,
): string {
  const a = clean(actual || '0');
  const p = clean(planning || '0');
  if (p === 0 || isNaN(a) || isNaN(p)) return '0%';
  const result = (a / p) * 100;
  return `${result.toFixed(digits)}%`;
}

export const no = (val = '0') => {
  return clean(val).toLocaleString('en-EN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const DayCard = ({
  items,
  fleet,
}: {
  items: any;
  fleet?: DailySummary;
}) => {
  const data = items as SummaryRow;
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="panel">
      <Link
        className="btn cursor-pointer btn-outline-success w-full"
        target="_blank"
        href={`/daily/${data?.date?.replace(/\//g, '-')}`}
      >
        {DateFormat.toIndonesianFullDate(data?.date)}
      </Link>

      <table className="table-striped mt-2">
        <thead>
          <tr>
            <th>Period</th>
            <th className="text-end">Actual</th>
            <th className="text-end">Planning</th>
            <th className="text-end">Achievement</th>
            <th className="text-end">Fuel</th>
            <th className="text-end">Fuel Ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Day Shift</td>
            <td className="text-end">{no(data.actDs)}</td>
            <td className="text-end">{no(data.planDs)}</td>
            <td className="text-end">{percent(data.actDs, data.planDs)}</td>
            <td className="text-end">{no(data.fuelDs)}</td>
            <td className="text-end">{no(data.frDs)}</td>
          </tr>
          <tr>
            <td>Night Shift</td>
            <td className="text-end">{no(data.actNs)}</td>
            <td className="text-end">{no(data.planNs)}</td>
            <td className="text-end">{percent(data.actNs, data.planNs)}</td>
            <td className="text-end">{no(data.fuelNs)}</td>
            <td className="text-end">{no(data.frNs)}</td>
          </tr>
          <tr>
            <td>Daily</td>
            <td className="text-end">{no(data.actDaily)}</td>
            <td className="text-end">{no(data.planDaily)}</td>
            <td className="text-end">{data.achDaily}</td>
            <td className="text-end">{no(data.fuelDaily)}</td>
            <td className="text-end">{no(data.frDaily)}</td>
          </tr>
          <tr>
            <td>Month to date</td>
            <td className="text-end">{no(data.actMtd)}</td>
            <td className="text-end">{no(data.planMtd)}</td>
            <td className="text-end">{data.achMtd}</td>
            <td className="text-end">{no(data.fuelMtd)}</td>
            <td className="text-end">{no(data.frMtd)}</td>
          </tr>
        </tbody>
      </table>
      <div className=" mt-4">
        <table className="table-striped">
          <thead>
            <tr>
              <th>Shift</th>
              <th className="text-end">jumlah Fleet</th>
              <th className="text-end">jumlah DT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Day Shift</td>
              <td className="text-end">{data.fleetDs} Fleet</td>
              <td className="text-end">{data.dtDs} Unit DT</td>
            </tr>
            <tr>
              <td>Night Shift</td>
              <td className="text-end">{data.fleetNs} Fleet</td>
              <td className="text-end">{data.dtNs} Unit DT</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className=" mt-4 flex justify-center items-center">
        <button type="button" onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? 'Sembunyikan Detail' : 'Tampilkan Detail'}
        </button>
      </div>

      {showDetail && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="font-bold mb-1 text-center">Detail Day Shift</div>
            <TableFleet data={fleet?.dayShift ?? []} />
          </div>
          <div>
            <div className="font-bold mb-1 text-center">Detail Night Shift</div>
            <TableFleet data={fleet?.nightShift ?? []} />
          </div>
        </div>
      )}
    </div>
  );
};
