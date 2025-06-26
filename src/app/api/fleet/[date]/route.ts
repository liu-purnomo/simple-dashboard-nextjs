import { authOptions } from '@/lib/auth-options';
import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } },
) {
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

  const { date } = params;

  // Format: dd-mm-yyyy
  if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid date format. Expected format: dd-mm-yyyy',
      },
      { status: 400 },
    );
  }

  const normalizedDate = date.replace(/-/g, '/'); // convert to dd/mm/yyyy

  try {
    const [dsRaw, nsRaw] = await Promise.all([
      Sheet.read(SHEET_RANGE.ds),
      Sheet.read(SHEET_RANGE.ns),
    ]);

    const labeledDS = (dsRaw as FleetRow[])
      .filter((r) => r.date === normalizedDate)
      .map((r) => ({ ...r, shift: 'DS' as const }));

    const labeledNS = (nsRaw as FleetRow[])
      .filter((r) => r.date === normalizedDate)
      .map((r) => ({ ...r, shift: 'NS' as const }));

    const processShiftData = (
      rows: (FleetRow & { shift: Shift })[],
      shift: Shift,
    ): FleetSummary[] => {
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
            val.distance += distance;
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
    };

    return NextResponse.json({
      success: true,
      date: normalizedDate,
      dayShift: processShiftData(labeledDS, 'DS'),
      nightShift: processShiftData(labeledNS, 'NS'),
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
