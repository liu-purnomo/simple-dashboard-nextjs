'use client';

import { NumberFormat } from '@/lib/number';

export const TableMaintenance = ({ data }: { data: any }) => {
  return (
    <table className="table-striped w-full text-sm text-left">
      <thead>
        <tr>
          <th>Unit</th>
          <th className="text-start">Type</th>
          <th className="text-start">Problem</th>
          <th className="text-start">HM</th>
          <th className="text-start">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry: PlantSummary, index: number) => (
          <tr key={index}>
            <td className="text-start whitespace-nowrap">{entry.unit}</td>
            <td className="text-start">{entry.type}</td>
            <td className="text-start">{entry.problem}</td>
            <td className="text-end">{NumberFormat.no(entry.hm || '0')}</td>
            <td className="text-start">{entry.status}</td>
            {/* <td className="text-end">{entry.dt}</td>
              <td className="text-end">{entry.trip}</td>
              <td className="text-end">{no(entry.distance as any)}</td>
              <td className="text-end">{entry.wasteDump}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
