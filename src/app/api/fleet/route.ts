import { DateFormat } from '@/lib/date';
import { NumberFormat } from '@/lib/number';
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

    const [summaryRaw, dayShiftRaw, nightShiftRaw] = await Promise.all([
      Sheet.read(SHEET_RANGE.summary),
      Sheet.read(SHEET_RANGE.fleetDs),
      Sheet.read(SHEET_RANGE.fleetNs),
    ]);

    const summary = filterByPeriod(summaryRaw as SummaryRow[], period).filter(
      (s) => NumberFormat.parse(s.actDaily) > 0,
    );
    const dayShift = filterByPeriod(dayShiftRaw as FleetRow[], period);
    const nightShift = filterByPeriod(nightShiftRaw as FleetRow[], period);

    const uniqueDates = Array.from(
      new Set([...summary, ...dayShift, ...nightShift].map((r) => r.date)),
    ).sort(
      (a, b) =>
        DateFormat.timestampFromSheet(b ?? '') -
        DateFormat.timestampFromSheet(a ?? ''),
    );

    const combined = uniqueDates.map((date) => ({
      date,
      summary: summary.find((s) => s.date === date) || null,
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
