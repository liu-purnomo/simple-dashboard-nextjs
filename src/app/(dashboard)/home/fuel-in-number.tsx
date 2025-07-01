// {
//     "data": {
//     "lastRefuel": {
//       "date": "2025-06-29",
//       "unit": "TJ-3054",
//       "hm": "762.10",
//       "remainingEstimate": "83.00",
//       "qty": 100,
//       "time": "8:37:00 PM",
//       "shift": "Night Shift"
//     },
//     "fuelEfficiency": 8.62,
//     "totalFuelUsed": 2939,
//     "totalHM": 5748.7,
// }

import { NumberFormat } from '@/lib/number';
import { Skeleton } from '@mantine/core';

export const FuelInNumber = ({
  data,
  isLoading = false,
}: {
  data: {
    lastRefuel: {
      date: string;
      unit: string;
      hm: string;
      remainingEstimate: string;
      qty: number;
      time: string;
      shift: string;
    } | null;
    fuelEfficiency: number | null;
    totalFuelUsed: number;
    totalHM: number;
  };
  isLoading?: boolean;
}) => {
  return (
    <div className="grid my-5 grid-cols-1 md:grid-cols-2 gap-4">
      {isLoading ? (
        <div className="panel">
          <Skeleton height={120} />
        </div>
      ) : (
        <div className="panel">
          <div className="grid grid-cols-2 gap-4">
            <div className="panel bg-gradient-to-r text-white from-blue-500 to-blue-400">
              <div className="flex justify-between">
                <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                  Last Refuel
                </div>
              </div>
              <div className="mt-5 flex items-center">
                <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">
                  {NumberFormat.no(data?.lastRefuel?.qty)}
                </div>
                <div className="badge bg-white/30">Liter</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-primary-light rounded-md">
                <div>Jam</div>
                <div>{data?.lastRefuel?.time || 'N/A'}</div>
              </div>
              <div className="flex justify-between p-2 bg-danger-light rounded-md">
                <div>Perkiraan Sisa</div>
                <div>
                  {data?.lastRefuel?.remainingEstimate
                    ? NumberFormat.no(data?.lastRefuel?.remainingEstimate || 0)
                    : 'N/A'}{' '}
                  Liter
                </div>
              </div>
              <div className="flex justify-between p-2 bg-primary-light rounded-md">
                <div>HM saat pengisian</div>
                <div>
                  {data?.lastRefuel?.hm
                    ? NumberFormat.no(data?.lastRefuel?.hm || 0)
                    : 'N/A'}{' '}
                  HM
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="panel">
          <Skeleton height={120} />
        </div>
      ) : (
        <div className="panel">
          <div className="grid grid-cols-2 gap-4">
            <div className="panel bg-gradient-to-r text-white from-green-500 to-green-400">
              <div className="flex justify-between">
                <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">
                  Fuel Efficiency
                </div>
              </div>
              <div className="mt-5 flex items-center">
                <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">
                  {NumberFormat.no(data?.fuelEfficiency || 0)}
                </div>
                <div className="badge bg-white/30">Liter / HM</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-primary-light rounded-md">
                <div>Fuel Variance</div>
                <div>{'N/A'}</div>
              </div>
              <div className="flex justify-between p-2 bg-danger-light rounded-md">
                <div>Total usage</div>
                <div>
                  {data?.totalFuelUsed
                    ? NumberFormat.no(data?.totalFuelUsed || 0)
                    : 'N/A'}{' '}
                  Liter
                </div>
              </div>
              <div className="flex justify-between p-2 bg-primary-light rounded-md">
                <div>Total HM Tercatat</div>
                <div>
                  {data?.totalHM ? NumberFormat.no(data?.totalHM || 0) : 'N/A'}{' '}
                  HM
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
