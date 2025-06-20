// import { Normalize } from '@/lib/normalize';
// import { Sheet, SHEET_RANGE } from '@/lib/sheet';
// import { NextRequest } from 'next/server';
// import { summarizeDispatchFleet } from './fleet-summary';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { date: string } },
// ) {
//   try {
//     const date = params.date;

//     const sheetFormattedDate = Normalize.dateToSheet(date); // example: '16/06/2025'

//     const [production, fuel, dispatchNs, dispatchDs] = await Promise.all([
//       Sheet.read(SHEET_RANGE.productionOb),
//       Sheet.read(SHEET_RANGE.fuelDaily),
//       Sheet.read(SHEET_RANGE.ns),
//       Sheet.read(SHEET_RANGE.ds),
//     ]);

//     const toSafeDateString = (raw: any) => {
//       const match = raw?.toString().match(/\d{2}\/\d{2}\/\d{4}/);
//       return match ? match[0] : '';
//     };

//     const filterByDate = (arr: any[]) =>
//       arr.filter((item) => toSafeDateString(item.date) === sheetFormattedDate);

//     const selectedProduction = filterByDate(production);
//     const selectedFuel = filterByDate(fuel);
//     const selectedDispatchNs = filterByDate(dispatchNs);
//     const selectedDispatchDs = filterByDate(dispatchDs);

//     const allFleetDs = selectedDispatchDs
//       .map((item) => item.fleet?.trim())
//       .filter(Boolean);
//     const uniqueFleetDs = Array.from(new Set(allFleetDs));

//     const fleetSummaryDs = summarizeDispatchFleet(
//       selectedDispatchDs,
//       uniqueFleetDs,
//     );

//     const allFleetNs = selectedDispatchNs
//       .map((item) => item.fleet?.trim())
//       .filter(Boolean);
//     const uniqueFleetNs = Array.from(new Set(allFleetNs));

//     const fleetSummaryNs = summarizeDispatchFleet(
//       selectedDispatchNs,
//       uniqueFleetNs,
//     );

//     const dataFuel = {
//       ds: 0,
//       ns: 0,
//       unknown: 0,
//       daily: 0,
//     };

//     selectedFuel.forEach((fuel: any) => {
//       const qty = Normalize.number(fuel.qty);

//       if (fuel.shift === 'Day Shift') {
//         dataFuel.ds += qty;
//       } else if (fuel.shift === 'Night Shift') {
//         dataFuel.ns += qty;
//       } else {
//         dataFuel.unknown += qty;
//       }
//       dataFuel.daily += qty;
//     });

//     const actDs = Normalize.number(selectedProduction[0]?.actDs || '0');
//     const actNs = Normalize.number(selectedProduction[0]?.actNs || '0');
//     const actDaily = Normalize.number(selectedProduction[0]?.actDaily || '0');
//     const fuelRatioDs = actDs ? dataFuel.ds / actDs : null;
//     const fuelRatioNs = actNs ? dataFuel.ns / actNs : null;
//     const fuelRatio = actDaily ? dataFuel.daily / actDaily : null;

//     return Response.json({
//       success: true,
//       data: {
//         date,
//         production: selectedProduction[0],
//         fuel: dataFuel,
//         fuelRatio,
//         ds: {
//           fleet: Object.values(fleetSummaryDs),
//           actual: actDs,
//           fuel: dataFuel.ds,
//           fuelRatio: fuelRatioDs,
//         },
//         ns: {
//           fleet: Object.values(fleetSummaryNs),
//           actual: actNs,
//           fuel: dataFuel.ns,
//           fuelRatio: fuelRatioNs,
//         },
//       },
//     });
//   } catch (error) {
//     return Response.json(
//       {
//         success: false,
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     );
//   }
// }
