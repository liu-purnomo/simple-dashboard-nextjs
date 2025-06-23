'use client';

import { no } from './day-card';

function groupByFleet(data: FleetSummary[]): Record<string, TripSummary[]> {
  const grouped: Record<string, TripSummary[]> = {};
  for (const fleetItem of data) {
    if (!grouped[fleetItem.fleet]) grouped[fleetItem.fleet] = [];
    grouped[fleetItem.fleet].push(...fleetItem.trip);
  }
  return grouped;
}

export const TableFleet = ({ data }: { data: any }) => {
  const grouped = groupByFleet(data);

  return (
    <table className="table-striped w-full text-sm text-left">
      <thead>
        <tr>
          <th>Fleet</th>
          <th className="text-end">DT</th>
          <th className="text-end">Ritase</th>
          <th className="text-end">Distance (m)</th>
          <th className="text-end">Waste Dump</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(grouped).map(([fleet, entries]) =>
          entries.map((entry, index) => (
            <tr key={`${fleet}-${index}`}>
              {index === 0 && (
                <td
                  rowSpan={entries.length}
                  className="align-middle font-semibold"
                >
                  {fleet}
                </td>
              )}
              <td className="text-end">{entry.dt}</td>
              <td className="text-end">{entry.trip}</td>
              <td className="text-end">{no(entry.distance as any)}</td>
              <td className="text-end">{entry.wasteDump}</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );
};
