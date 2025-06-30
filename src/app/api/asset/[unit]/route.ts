import { authOptions } from '@/lib/auth-options';
import { Sheet, SHEET_RANGE } from '@/lib/sheet';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { unit: string } },
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

    const { unit } = params;

    const dataFromSheet = await Sheet.read(SHEET_RANGE.asset);

    const filteredAsset = dataFromSheet.find((asset) => asset.unit === unit);

    if (!filteredAsset) {
      return Response.json(
        {
          success: false,
          error: 'No data found in the sheet',
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        asset: filteredAsset,
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
