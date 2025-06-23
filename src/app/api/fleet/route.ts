import { DateFormat } from '@/lib/date';
import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { NextRequest } from 'next/server';

interface FleetRow {
  date: string;
  fleet: string;
  unit: string;
  dump: string;
  trip: string;
  distance: string;
}

type Shift = 'DS' | 'NS';

interface TripSummary {
  shift: Shift;
  dt: number;
  trip: number;
  distance: number;
  wasteDump: string;
  units: string[];
}

interface FleetSummary {
  fleet: string;
  trip: TripSummary[];
}

interface DailySummary {
  date: string;
  dayShift: FleetSummary[];
  nightShift: FleetSummary[];
}

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

function processShiftData(
  rows: (FleetRow & { shift: Shift })[],
  shift: Shift,
): FleetSummary[] {
  const fleets = Array.from(new Set(rows.map((r) => r.fleet)));

  return fleets.map((fleetId) => {
    const fleetRows = rows.filter((r) => r.fleet === fleetId);

    const dumpMap = new Map<
      string,
      {
        trip: number;
        distance: number;
        wasteDump: string;
        units: Set<string>;
      }
    >();

    for (const r of fleetRows) {
      const dump = r.dump;
      const trip = parseInt(r.trip || '0');
      const distance = parseInt(r.distance || '0');
      const unit = r.unit;

      if (!dumpMap.has(dump)) {
        dumpMap.set(dump, {
          trip,
          distance,
          wasteDump: dump,
          units: new Set([unit]),
        });
      } else {
        const val = dumpMap.get(dump)!;
        val.trip += trip;
        val.units.add(unit);
      }
    }

    return {
      fleet: fleetId,
      trip: Array.from(dumpMap.values()).map((item) => ({
        shift,
        dt: item.units.size,
        trip: item.trip,
        distance: item.distance,
        wasteDump: item.wasteDump,
        units: Array.from(item.units).sort(),
      })),
    };
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

    const [dsRaw, nsRaw] = await Promise.all([
      Sheet.read(SHEET_RANGE.ds),
      Sheet.read(SHEET_RANGE.ns),
    ]);

    const dayShift = filterByPeriod(dsRaw as FleetRow[], period);
    const nightShift = filterByPeriod(nsRaw as FleetRow[], period);

    const uniqueDates = Array.from(
      new Set([...dayShift, ...nightShift].map((r) => r.date)),
    ).sort(
      (a, b) =>
        DateFormat.timestampFromSheet(b ?? '') -
        DateFormat.timestampFromSheet(a ?? ''),
    );

    const outputData: DailySummary[] = uniqueDates.map((date) => {
      const labeledDS = dayShift
        .filter((r) => r.date === date)
        .map((r) => ({ ...r, shift: 'DS' as const }));

      const labeledNS = nightShift
        .filter((r) => r.date === date)
        .map((r) => ({ ...r, shift: 'NS' as const }));

      return {
        date,
        dayShift: processShiftData(labeledDS, 'DS'),
        nightShift: processShiftData(labeledNS, 'NS'),
      };
    });

    return Response.json({
      success: true,
      data: outputData,
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
