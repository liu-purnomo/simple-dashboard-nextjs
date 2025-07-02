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
  remainingEstimate: string;
  shift: string;
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

    const rawSheetDataDayShift = await Sheet.read(SHEET_RANGE.ds);
    const rawSheetDataNightShift = await Sheet.read(SHEET_RANGE.ns);

    return NextResponse.json({
      success: true,
      data: {
        maxHM: 0,
        // raw: { ...rawSheetDataDayShift, ...rawSheetDataNightShift },
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
