import { Normalize } from '@/lib/normalize';
import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { NextRequest } from 'next/server';
import { summarizeDispatchFleet } from '../[date]/fleet-summary';

function getDefaultDateRange(): [string, string] {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const format = (d: Date) => d.toISOString().split('T')[0];
  return [format(start), format(now)];
}

function getDatesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function toSafeDateString(raw: any): string {
  const match = raw?.toString().match(/\d{2}\/\d{2}\/\d{4}/);
  return match ? match[0] : '';
}

function getSheetFilteredByDate(sheet: any[], formattedDate: string) {
  return sheet.filter((item) => toSafeDateString(item.date) === formattedDate);
}

function getDailySummary(
  date: string,
  allSheets: {
    production: any[];
    fuel: any[];
    dispatchNs: any[];
    dispatchDs: any[];
  },
) {
  const sheetFormattedDate = Normalize.dateToSheet(date);

  const selectedProduction = getSheetFilteredByDate(
    allSheets.production,
    sheetFormattedDate,
  );
  const selectedFuel = getSheetFilteredByDate(
    allSheets.fuel,
    sheetFormattedDate,
  );
  const selectedDispatchNs = getSheetFilteredByDate(
    allSheets.dispatchNs,
    sheetFormattedDate,
  );
  const selectedDispatchDs = getSheetFilteredByDate(
    allSheets.dispatchDs,
    sheetFormattedDate,
  );

  const allFleetDs = selectedDispatchDs
    .map((item) => item.fleet?.trim())
    .filter(Boolean);
  const uniqueFleetDs = Array.from(new Set(allFleetDs));
  const fleetSummaryDs = summarizeDispatchFleet(
    selectedDispatchDs,
    uniqueFleetDs,
  );

  const allFleetNs = selectedDispatchNs
    .map((item) => item.fleet?.trim())
    .filter(Boolean);
  const uniqueFleetNs = Array.from(new Set(allFleetNs));
  const fleetSummaryNs = summarizeDispatchFleet(
    selectedDispatchNs,
    uniqueFleetNs,
  );

  const dataFuel = { ds: 0, ns: 0, unknown: 0, daily: 0 };
  selectedFuel.forEach((fuel: any) => {
    const qty = Normalize.number(fuel.qty);
    if (fuel.shift === 'Day Shift') dataFuel.ds += qty;
    else if (fuel.shift === 'Night Shift') dataFuel.ns += qty;
    else dataFuel.unknown += qty;
    dataFuel.daily += qty;
  });

  const actDs = Normalize.number(selectedProduction[0]?.actDs || '0');
  const actNs = Normalize.number(selectedProduction[0]?.actNs || '0');
  const actDaily = Normalize.number(selectedProduction[0]?.actDaily || '0');
  const fuelRatioDs = actDs ? dataFuel.ds / actDs : null;
  const fuelRatioNs = actNs ? dataFuel.ns / actNs : null;
  const fuelRatio = actDaily ? dataFuel.daily / actDaily : null;

  return {
    date,
    production: selectedProduction[0],
    fuel: dataFuel,
    fuelRatio,
    ds: {
      fleet: Object.values(fleetSummaryDs),
      actual: actDs,
      fuel: dataFuel.ds,
      fuelRatio: fuelRatioDs,
    },
    ns: {
      fleet: Object.values(fleetSummaryNs),
      actual: actNs,
      fuel: dataFuel.ns,
      fuelRatio: fuelRatioNs,
    },
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rangeParam = searchParams.get('range');

    let startDate: string, endDate: string;
    if (rangeParam) {
      const [start, end] = rangeParam.split(',');
      startDate = start;
      endDate = end || start;
    } else {
      [startDate, endDate] = getDefaultDateRange();
    }

    const [production, fuel, dispatchNs, dispatchDs] = await Promise.all([
      Sheet.read(SHEET_RANGE.productionOb),
      Sheet.read(SHEET_RANGE.fuel),
      Sheet.read(SHEET_RANGE.ns),
      Sheet.read(SHEET_RANGE.ds),
    ]);

    const dates = getDatesBetween(startDate, endDate);

    const data = dates.map((date) =>
      getDailySummary(date, { production, fuel, dispatchNs, dispatchDs }),
    );

    const totalFuel = data.reduce(
      (acc, curr) => acc + (curr.fuel?.daily || 0),
      0,
    );
    const totalBcm = data.reduce(
      (acc, curr) => acc + Normalize.number(curr.production?.actDaily || 0),
      0,
    );
    const fuelRatio = totalBcm > 0 ? totalFuel / totalBcm : null;

    return Response.json({
      success: true,
      data: {
        range: { startDate, endDate },
        summary: {
          totalFuel,
          totalBcm,
          fuelRatio,
        },
        data,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
