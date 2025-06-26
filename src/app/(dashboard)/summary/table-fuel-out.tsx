'use client';

import { NumberFormat } from '@/lib/number';

export const TableFuelOut = ({ data }: { data: any }) => {
  return (
    <table className="table-striped w-full text-sm text-left">
      <thead>
        <tr>
          <th>Unit</th>
          <th className="text-end">Qty (Liter)</th>
          <th className="text-end">Remaining (Liter) Est</th>
          <th className="text-end">HM</th>
          <th className="text-end">Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry: FuelOutRow, index: number) => (
          <tr key={index}>
            <td className="text-start whitespace-nowrap">{entry.unit}</td>
            <td className="text-end">{NumberFormat.no(entry.qty)}</td>
            <td className="text-end">
              {NumberFormat.no(entry.remainingEstimate || '0')}
            </td>
            <td className="text-end">{NumberFormat.no(entry.hm || '0')}</td>
            <td className="text-end">{entry.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
