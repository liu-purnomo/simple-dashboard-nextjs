import { authOptions } from '@/lib/auth-options';
import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

type FuelRow = {
  unit?: string;
  date?: string;
  hm?: string;
  qty?: string;
  time?: string;
  remainingEstimate?: string;
  shift?: string;
};

export async function GET() {
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

    const dataFromSheet = (await Sheet.read(SHEET_RANGE.fuel)) as FuelRow[];

    if (!dataFromSheet || dataFromSheet.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No data found in the sheet',
        },
        { status: 200 },
      );
    }

    // Filter unique units dari fuel sheet
    const uniqueUnits = Array.from(
      new Set(
        dataFromSheet
          .map((row) => row.unit?.trim()) // Ambil unit dan trim whitespace
          .filter((unit): unit is string => Boolean(unit)), // Filter out null/undefined/empty
      ),
    ).sort(); // Sort alphabetically

    return NextResponse.json({
      success: true,
      data: uniqueUnits,
      total: uniqueUnits.length,
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
