import { authOptions } from '@/lib/auth-options';
import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

interface PlantRow {
  date?: string;
  shift?: string;
  unit?: string;
  hm?: string;
  problem?: string;
  type?: string;
  status?: string;
}

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

    const rawSheetData = await Sheet.read(SHEET_RANGE.plant);
    const data = rawSheetData as PlantRow[];

    // --- GLOBAL DATA HANDLING (tanpa filter periode) ---
    const normalized = data
      .map((item) => {
        if (!item.date || !item.unit) return null;
        const [dd, mm, yyyy] = item.date.split('/');
        if (!dd || !mm || !yyyy) return null;

        const formattedDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        const hm = item.hm?.trim() ? parseFloat(item.hm.trim()) : null;

        return {
          ...item,
          date: formattedDate,
          hm,
        };
      })
      .filter(
        (d): d is Required<PlantRow> & { date: string; hm: number | null } =>
          !!d,
      );

    // --- LAST RECORD (by max date) ---
    const lastRecord =
      normalized
        .filter((d) => d.unit === unit)
        .sort((a, b) => b.date.localeCompare(a.date))
        .at(0) ?? null;

    // --- MAX HM (by highest numeric hm) ---
    const maxHM =
      normalized
        .filter((d) => d.unit === unit && typeof d.hm === 'number')
        .sort((a, b) => (b.hm ?? 0) - (a.hm ?? 0))
        .at(0) ?? null;

    // --- FILTERED by period ---
    const filtered = normalized
      .filter(
        (entry) =>
          entry.unit === unit && entry.date.startsWith(`${year}-${month}`),
      )
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      success: true,
      data: {
        lastRecord,
        maxHM,
        raw: filtered,
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
