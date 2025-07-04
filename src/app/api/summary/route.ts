import { authOptions } from '@/lib/auth-options';
import { DateFormat } from '@/lib/date';
import { NumberFormat } from '@/lib/number';
import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

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

    const { searchParams } = new URL(req.url);
    let period = searchParams.get('period');

    if (period && !/^\d{2}-\d{4}$/.test(period)) {
      return NextResponse.json(
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

    const summaryRaw = await Sheet.read(SHEET_RANGE.summary);

    const summary = filterByPeriod(summaryRaw as SummaryRow[], period).filter(
      (s) => NumberFormat.parse(s.actDaily) > 0,
    );

    return NextResponse.json({
      success: true,
      data: {
        month: DateFormat.monthNameFromPeriod(period),
        items: summary,
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
