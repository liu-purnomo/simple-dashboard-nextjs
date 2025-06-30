import { authOptions } from '@/lib/auth-options';
import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

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

    const dataFromSheet = await Sheet.read(SHEET_RANGE.asset);

    if (!dataFromSheet || dataFromSheet.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'No data found in the sheet',
        },
        { status: 200 },
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
      { status: 500 },
    );
  }
}
