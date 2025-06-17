import { Sheet, SHEET_RANGE } from '@/lib/sheet';

export async function GET() {
  try {
    const dataFromSheet = await Sheet.read(SHEET_RANGE.fuel);

    if (!dataFromSheet || dataFromSheet.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'No data found in the sheet',
        },
        { status: 200 }
      );
    }

    return Response.json({
      success: true,
      data: dataFromSheet,
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
