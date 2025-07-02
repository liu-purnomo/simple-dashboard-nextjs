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
  remainingEstimate?: string;
  shift?: string;
};

type AssetRow = {
  unit?: string;
  type?: string;
  category?: string;
  brand?: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { period: string } },
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

    const { period } = params;
    const [year, monthRaw] = period.split('-');
    if (!year || !monthRaw) {
      return NextResponse.json(
        { success: false, message: 'Invalid period format' },
        { status: 400 },
      );
    }
    const month = monthRaw.padStart(2, '0');

    // Ambil data fuel dan asset
    const rawFuelData = await Sheet.read(SHEET_RANGE.fuel);
    const fuelData = rawFuelData as FuelRow[];

    const rawAssetData = await Sheet.read(SHEET_RANGE.asset);
    const assetData = rawAssetData as AssetRow[];

    // Group fuel data by unit
    const fuelByUnit: Record<string, FuelRow[]> = {};
    fuelData.forEach((item) => {
      if (!item.unit || !item.date) return;
      const [dd, mm, yyyy] = item.date.split('/');
      if (!dd || !mm || !yyyy) return;
      if (yyyy !== year || mm.padStart(2, '0') !== month) return;
      const unit = item.unit.trim();
      if (!fuelByUnit[unit]) fuelByUnit[unit] = [];
      fuelByUnit[unit].push({
        ...item,
        date: `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`,
      });
    });

    // Hitung efisiensi per unit
    const leaderboard = Object.entries(fuelByUnit).map(([unit, rows]) => {
      // Urutkan berdasarkan tanggal
      const sorted = rows
        .map((item) => ({
          ...item,
          qty: Number(item.qty) || 0,
          hm: item.hm ? Number(item.hm) : null,
        }))
        .sort((a, b) => (a.date! > b.date! ? 1 : -1));

      // Ambil HM awal & akhir
      const hmList = sorted
        .map((d) => d.hm)
        .filter((hm) => hm !== null) as number[];
      const firstHM = hmList.length ? hmList[0] : 0;
      const lastHM = hmList.length ? hmList[hmList.length - 1] : 0;
      const totalHM = hmList.length >= 2 ? lastHM - firstHM : 0;

      // Total fuel used
      const fuelUsed = sorted.reduce((sum, d) => sum + (d.qty || 0), 0);

      // Fuel efficiency
      const fuelEfficiency =
        totalHM > 0 ? Number((fuelUsed / totalHM).toFixed(2)) : null;

      // Ambil info asset
      const assetInfo = assetData.find((a) => a.unit === unit) || {};

      return {
        unit,
        type: assetInfo.type || '',
        category: assetInfo.category || '',
        brand: assetInfo.brand || '',
        fuelEfficiency,
        totalHm: totalHM,
        fuelUsed,
      };
    });

    // Hitung average efficiency
    const validEff = leaderboard.filter((l) => l.fuelEfficiency !== null);
    const avarageEfficieny =
      validEff.length > 0
        ? Number(
            (
              validEff.reduce(
                (sum, l) => sum + (l.fuelEfficiency as number),
                0,
              ) / validEff.length
            ).toFixed(2),
          )
        : null;

    return NextResponse.json({
      success: true,
      data: leaderboard.map((item) => ({
        ...item,
        avarageEfficieny,
      })),
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
