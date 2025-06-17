import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const dateParam = searchParams.get('date');
  const dateRangeParam = searchParams.get('dateRange');

  try {
    const dataFromSheet = await Sheet.read(SHEET_RANGE.ds);

    if (!dataFromSheet || dataFromSheet.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'No data found in the sheet',
        },
        { status: 200 }
      );
    }

    let filteredData = dataFromSheet;

    if (dateParam) {
      const targetDate = new Date(dateParam).toDateString();
      filteredData = filteredData.filter((item: any) => {
        const itemDate = new Date(item.date).toDateString();
        return itemDate === targetDate;
      });
    }

    if (dateRangeParam) {
      const [start, end] = dateRangeParam.split(',');
      const startDate = new Date(start);
      const endDate = new Date(end);

      filteredData = filteredData.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return Response.json({
      success: true,
      data: filteredData,
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
