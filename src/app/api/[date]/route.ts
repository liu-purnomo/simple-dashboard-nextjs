import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { NextRequest } from 'next/server';

const isValidDateInput = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(dateStr);

  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } },
) {
  try {
    const date = params.date;

    if (!isValidDateInput(date)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid date format. Please use a valid YYYY-MM-DD format.',
        },
        { status: 400 },
      );
    }

    const targetDate = new Date(date!).toDateString();

    const [production, fuel, dispatchNs, dispatchDs, plant] = await Promise.all(
      [
        Sheet.read(SHEET_RANGE.productionOb),
        Sheet.read(SHEET_RANGE.fuel),
        Sheet.read(SHEET_RANGE.ds),
        Sheet.read(SHEET_RANGE.ns),
        Sheet.read(SHEET_RANGE.plant),
      ],
    );

    const normalizeDate = (val: string) => new Date(val).toDateString();

    const filterByDate = (arr: any[]) =>
      arr.filter((item) => normalizeDate(item.date) === targetDate);

    const result = {
      date,
      production: filterByDate(production),
      fuel: filterByDate(fuel),
      plant: filterByDate(plant),
      dispatchDs: filterByDate(dispatchDs),
      dispatchNs: filterByDate(dispatchNs),
    };

    return Response.json({
      success: true,
      data: result,
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
