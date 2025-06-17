import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params?: Record<string, string> }
) {
  try {
    const date = context.params?.date;
    const targetDate = new Date(date!).toDateString();
    const [production, fuel, dispatchNs, dispatchDs, plant] = await Promise.all(
      [
        Sheet.read(SHEET_RANGE.productionOb),
        Sheet.read(SHEET_RANGE.fuel),
        Sheet.read(SHEET_RANGE.ds),
        Sheet.read(SHEET_RANGE.ns),
        Sheet.read(SHEET_RANGE.plant),
      ]
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
      { status: 500 }
    );
  }
}
