import { DateFormat } from '@/lib/date';
import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { NextRequest } from 'next/server';

function filterByPeriod<T extends { date?: string }>(
  data: T[],
  period: string,
): T[] {
  return data.filter((item) => {
    if (!item.date) return false;
    const [_, month, year] = item.date.split('/');
    return `${month}-${year}` === period;
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let period = searchParams.get('period');

    if (period && !/^\d{2}-\d{4}$/.test(period)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid period format. Expected format: MM-YYYY',
        },
        { status: 400 },
      );
    }

    if (!period) {
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = String(now.getFullYear());
      period = `${mm}-${yyyy}`;
    }

    const [dayShiftRaw, nightShiftRaw] = await Promise.all([
      Sheet.read(SHEET_RANGE.summary),
      Sheet.read(SHEET_RANGE.ds),
      Sheet.read(SHEET_RANGE.ns),
    ]);

    const dayShift = filterByPeriod(dayShiftRaw as FleetRow[], period);
    const nightShift = filterByPeriod(nightShiftRaw as FleetRow[], period);

    const uniqueDates = Array.from(
      new Set([...dayShift, ...nightShift].map((r) => r.date)),
    ).sort(
      (a, b) =>
        DateFormat.timestampFromSheet(b ?? '') -
        DateFormat.timestampFromSheet(a ?? ''),
    );

    const combined = uniqueDates.map((date) => ({
      date,
      dayShift: dayShift.filter((d) => d.date === date),
      nightShift: nightShift.filter((n) => n.date === date),
    }));

    return Response.json({
      success: true,
      data: {
        month: DateFormat.monthNameFromPeriod(period),
        items: combined,
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
