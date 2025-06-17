'use client';

import { fetchAPI } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';

export function FetchData() {
  const dispatchQuery = useQuery<DataDispatch[]>({
    queryKey: ['dispatch'],
    queryFn: () => fetchAPI('/api/ds'),
    enabled: false,
  });

  const fuelQuery = useQuery<DataFuel[]>({
    queryKey: ['fuel'],
    queryFn: () => fetchAPI('/api/fuel'),
    enabled: false,
  });

  const plantQuery = useQuery<DataPlant[]>({
    queryKey: ['plant'],
    queryFn: () => fetchAPI('/api/plant'),
    enabled: false,
  });

  const obQuery = useQuery<DataOb[]>({
    queryKey: ['ob'],
    queryFn: () => fetchAPI('/api/ob'),
    enabled: false,
  });

  const handleFetchAll = () => {
    dispatchQuery.refetch();
    fuelQuery.refetch();
    plantQuery.refetch();
    obQuery.refetch();
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleFetchAll}
      >
        Refresh
      </button>

      <section className="mt-4">
        <h2 className="font-bold">Data Dispatch</h2>
        {dispatchQuery.data?.map((item, i) => (
          <div key={i}>
            {item.unit} — {item.date.toString()}
          </div>
        ))}

        <h2 className="font-bold mt-4">Data Fuel</h2>
        {fuelQuery.data?.map((item, i) => (
          <div key={i}>
            {item.unit} — {item.qty} Liter
          </div>
        ))}

        <h2 className="font-bold mt-4">Data Plant</h2>
        {plantQuery.data?.map((item, i) => (
          <div key={i}>
            {item.unit} — {item.status}
          </div>
        ))}

        <h2 className="font-bold mt-4">Data OB</h2>
        {obQuery.data?.map((item, i) => (
          <div key={i}>
            {item.week} — {item.achDailyPercent}
          </div>
        ))}
      </section>
    </div>
  );
}
