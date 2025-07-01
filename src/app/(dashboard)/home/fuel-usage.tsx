'use client';

import { Skeleton } from '@mantine/core';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  data: {
    date: string;
    qty: number;
  }[];
  isLoading?: boolean;
};

const FuelUsageChart = ({ data, isLoading }: Props) => {
  return (
    <div className="w-full h-52 bg-white rounded shadow p-4">
      {isLoading ? (
        <Skeleton height={180} />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => d.slice(-2)} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="qty"
              stroke="#4299e1"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name="Fuel Usage (L)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FuelUsageChart;
