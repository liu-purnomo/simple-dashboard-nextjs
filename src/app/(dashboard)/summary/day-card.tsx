import { DateFormat } from '@/lib/date';

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

const no = (val = '0') => {
  return clean(val).toLocaleString('en-EN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function groupByFleet(rows: FleetRow[]) {
  const grouped: Record<string, FleetRow[]> = {};
  for (const row of rows) {
    if (!grouped[row.fleet]) grouped[row.fleet] = [];
    grouped[row.fleet].push(row);
  }
  return grouped;
}

export const DayCard = ({ items }: { items: any }) => {
  const data = items.summary as SummaryRow;
  const ds = items.dayShift as FleetRow[];
  const ns = items.nightShift as FleetRow[];
  return (
    <div className="panel">
      <div className="btn cursor-pointer btn-outline-success w-full">
        {DateFormat.toIndonesianFullDate(data?.date)}
      </div>

      <table className="table-striped mt-2">
        <thead>
          <tr>
            <th>Period</th>
            <th>Actual</th>
            <th>Planning</th>
            <th>Achievement</th>
            <th>Fuel</th>
            <th>Fuel Ratio</th>
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
            <td className="">Night Shift</td>
            <td className="text-end">{no(data.actNs)}</td>
            <td className="text-end">{no(data.planNs)}</td>
            <td className="text-end">{percent(data.actNs, data.planNs)}</td>
            <td className="text-end">{no(data.fuelNs)}</td>
            <td className="text-end">{no(data.frNs)}</td>
          </tr>
          <tr>
            <td className="">Daily</td>
            <td className="text-end">{no(data.actDaily)}</td>
            <td className="text-end">{no(data.planDaily)}</td>
            <td className="text-end">{data.achDaily}</td>
            <td className="text-end">{no(data.fuelDaily)}</td>
            <td className="text-end">{no(data.frDaily)}</td>
          </tr>
          <tr>
            <td className="">Month to date</td>
            <td className="text-end">{no(data.actMtd)}</td>
            <td className="text-end">{no(data.planMtd)}</td>
            <td className="text-end">{data.achMtd}</td>
            <td className="text-end">{no(data.fuelMtd)}</td>
            <td className="text-end">{no(data.frMtd)}</td>
          </tr>
        </tbody>
      </table>

      {/* DAY SHIFT TABLE */}
      <div>
        <div className="p-5 mt-5 text-center border-t">Fleet Day Shift</div>
        <table className="table-striped">
          <thead>
            <tr>
              <th>Fleet</th>
              <th>DT</th>
              <th>Ritase</th>
              <th>Distance</th>
              <th>Waste Dump</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupByFleet(ds)).map(([fleet, entries]) =>
              entries.map((entry, index) => (
                <tr key={`${fleet}-${index}`}>
                  {index === 0 && (
                    <td rowSpan={entries.length} className="align-middle">
                      {fleet}
                    </td>
                  )}
                  <td className="text-end">{entry.dt}</td>
                  <td className="text-end">{entry.ritase}</td>
                  <td className="text-end">{no(entry.distance)}</td>
                  <td>{entry.wasteDump}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>

      {/* NIGHT SHIFT TABLE */}
      <div>
        <div className="p-5 mt-5 text-center border-t">Fleet Night Shift</div>
        <table className="table-striped">
          <thead>
            <tr>
              <th>Fleet</th>
              <th>DT</th>
              <th>Ritase</th>
              <th>Distance</th>
              <th>Waste Dump</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupByFleet(ns)).map(([fleet, entries]) =>
              entries.map((entry, index) => (
                <tr key={`${fleet}-${index}`}>
                  {index === 0 && (
                    <td rowSpan={entries.length} className="align-middle">
                      {fleet}
                    </td>
                  )}
                  <td className="text-end">{entry.dt}</td>
                  <td className="text-end">{entry.ritase}</td>
                  <td className="text-end">{no(entry.distance)}</td>
                  <td>{entry.wasteDump}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
