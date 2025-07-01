'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type PlantStatusEntry = {
  date: string;
  shift: string;
  unit: string;
  hm: number | null;
  problem: string;
  type: string;
  status: string | null;
};

type Props = {
  raw: PlantStatusEntry[];
};

export const ProblemBarChart = ({ raw }: Props) => {
  // 👇 group and count problems
  const groupedData = (() => {
    const counts: Record<string, number> = {};
    raw.forEach((item) => {
      const key = item.problem.trim();
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // urut dari paling banyak
  })();

  return (
    <div className="w-full h-[500px] rounded shadow p-4 bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={groupedData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={200} />
          <Tooltip formatter={(val: number) => `${val} entri`} />
          <Bar dataKey="value" fill="#3b3f5c">
            <LabelList dataKey="value" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
