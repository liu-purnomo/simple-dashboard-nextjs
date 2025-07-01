import { authOptions } from '@/lib/auth-options';
import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

type FuelRow = {
  date?: string;
  unit?: string;
  hm?: string;
  qty?: string;
  time?: string;
  shift?: string;
  remainingEstimate?: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { unit: string; period: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access Denied',
        },
        { status: 401 },
      );
    }

    const { unit, period } = params;

    const [year, monthRaw] = period.split('-');
    if (!year || !monthRaw) {
      return NextResponse.json(
        { success: false, message: 'Invalid period format' },
        { status: 400 },
      );
    }

    const month = monthRaw.padStart(2, '0');
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

    const rawSheetData = await Sheet.read(SHEET_RANGE.fuel);
    const dataFromSheet = rawSheetData as FuelRow[];

    // Normalize and filter by unit & period
    const filtered = dataFromSheet
      .map((item) => {
        if (!item.date || !item.unit) return null;
        const [dd, mm, yyyy] = item.date.split('/');
        if (!dd || !mm || !yyyy) return null;

        const formattedDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        return {
          date: formattedDate,
          unit: item.unit.trim(),
          qty: parseFloat(item.qty?.trim() ?? '0') || 0,
          hm: item.hm?.trim() ? parseFloat(item.hm.trim()) : null,
          time: item.time?.trim() ?? '',
          shift: item.shift?.trim() ?? '',
          remainingEstimate: item.remainingEstimate?.trim() ?? '',
        };
      })
      .filter(
        (entry): entry is NonNullable<typeof entry> =>
          entry !== null &&
          entry.unit === unit &&
          entry.date.startsWith(`${year}-${month}`),
      )
      .sort((a, b) => a.date.localeCompare(b.date));

    // Generate full list of dates in month
    const allDates = Array.from({ length: daysInMonth }, (_, i) => {
      const day = String(i + 1).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });

    // Map entries for fast lookup
    const entryMap = new Map<
      string,
      Omit<NonNullable<typeof filtered>[number], 'date'>
    >();
    filtered.forEach((item) => {
      entryMap.set(item.date, {
        unit: item.unit,
        qty: item.qty,
        hm: item.hm,
        time: item.time,
        shift: item.shift,
        remainingEstimate: item.remainingEstimate,
      });
    });

    // Generate full chartData
    let lastHM = 0;
    const chartData = allDates.map((date) => {
      const entry = entryMap.get(date);
      if (entry) {
        lastHM = entry.hm ?? lastHM;
        return {
          date,
          qty: entry.qty,
          hm: entry.hm ?? lastHM,
          time: entry.time,
          shift: entry.shift,
          remainingEstimate: entry.remainingEstimate,
        };
      } else {
        return {
          date,
          qty: 0,
          hm: lastHM,
          time: '',
          shift: '',
          remainingEstimate: '',
        };
      }
    });

    // Fuel efficiency
    const firstHM = chartData.find((d) => d.hm !== null)?.hm ?? 0;
    const lastHMFinal =
      chartData
        .slice()
        .reverse()
        .find((d) => d.hm !== null)?.hm ?? 0;
    const totalQty = chartData.reduce((sum, d) => sum + d.qty, 0);
    const fuelEfficiency =
      lastHMFinal > firstHM
        ? Number((totalQty / (lastHMFinal - firstHM)).toFixed(2))
        : null;

    // Last Refuel (from all time)
    const lastRefuelEntry = dataFromSheet
      .map((item) => {
        if (!item.date || item.unit?.trim() !== unit) return null;
        const [dd, mm, yyyy] = item.date.split('/');
        if (!dd || !mm || !yyyy) return null;

        return {
          date: `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`,
          qty: parseFloat(item.qty?.trim() ?? '0') || 0,
          time: item.time?.trim() ?? '',
        };
      })
      .filter((d): d is NonNullable<typeof d> => d !== null)
      .sort((a, b) => b.date.localeCompare(a.date))
      .at(0);

    const totalFuelUsed = chartData.reduce((sum, d) => sum + d.qty, 0);
    const hmList = chartData.map((d) => d.hm).filter((hm) => hm > 0);
    const totalHM =
      hmList.length >= 2 ? Math.max(...hmList) - Math.min(...hmList) : 0;

    return NextResponse.json({
      success: true,
      data: {
        lastRefuel: lastRefuelEntry ?? null,
        fuelEfficiency,
        totalFuelUsed,
        totalHM,
        chartData,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
