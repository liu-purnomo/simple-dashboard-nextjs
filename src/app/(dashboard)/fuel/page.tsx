'use client';

import { fetchAPI } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type FuelEfficiencyData = {
  unit: string;
  type: string;
  category: string;
  brand: string;
  fuelEfficiency: number | null;
  totalHm: number;
  fuelUsed: number;
  avarageEfficieny: number | null;
};

export default function FuelEfficiencyPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    new Date().toISOString().slice(0, 7), // Default to current month
  );

  const { data, isLoading } = useQuery<FuelEfficiencyData[]>({
    queryKey: ['fuelEfficiency', selectedPeriod],
    queryFn: () => fetchAPI(`/api/fuel/${selectedPeriod}/efficiency`),
    enabled: !!selectedPeriod,
  });

  // Filter data yang valid (ada fuel efficiency dan totalHm > 0)
  const validData =
    data?.filter(
      (item) => item.fuelEfficiency !== null,
      // item.totalHm > 10 &&
      // item.fuelEfficiency > 0 &&
      // item.fuelEfficiency < 1000, // Filter out extreme values
    ) || [];

  // Sort by efficiency (descending - paling boros dulu)
  const sortedData = [...validData].sort(
    (a, b) => (b.fuelEfficiency || 0) - (a.fuelEfficiency || 0),
  );

  // Ambil average efficiency dari data yang valid
  const averageEfficiency =
    validData.length > 0
      ? validData.reduce((sum, item) => sum + (item.fuelEfficiency || 0), 0) /
        validData.length
      : 0;

  // Custom tooltip untuk bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{`${data.unit}`}</p>
          <p className="text-sm text-gray-600">{`${data.brand} ${data.type}`}</p>
          <p className="text-sm">{`Category: ${data.category}`}</p>
          <p className="text-blue-600 font-medium">{`Efficiency: ${data.fuelEfficiency?.toFixed(2)} L/HM`}</p>
          <p className="text-sm">{`Total HM: ${data.totalHm?.toFixed(1)}`}</p>
          <p className="text-sm">{`Fuel Used: ${data.fuelUsed?.toFixed(0)} L`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Fuel Efficiency Leaderboard</h1>
        <div className="flex gap-2">
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Valid Units</p>
          <p className="font-bold text-xl">{validData.length}</p>
          <p className="text-xs text-gray-400">
            Total: {data?.length || 0} (filtered invalid data)
          </p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Average Efficiency</p>
          <p className="font-bold text-xl">
            {averageEfficiency?.toFixed(2) || 0} L/HM
          </p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Most Efficient</p>
          <p className="font-bold text-green-600">
            {sortedData[sortedData.length - 1]?.unit || '-'}
          </p>
          <p className="text-xs text-gray-400">
            {sortedData[sortedData.length - 1]?.fuelEfficiency?.toFixed(2)} L/HM
          </p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Least Efficient</p>
          <p className="font-bold text-red-600">{sortedData[0]?.unit || '-'}</p>
          <p className="text-xs text-gray-400">
            {sortedData[0]?.fuelEfficiency?.toFixed(2)} L/HM
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading...
        </div>
      ) : validData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No valid data found for the selected period
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bar Chart - Fuel Efficiency Comparison */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Fuel Efficiency by Unit
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={sortedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="unit"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis
                  label={{
                    value: 'Efficiency (L/HM)',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={averageEfficiency}
                  stroke="red"
                  strokeDasharray="5 5"
                  label={{
                    value: `Avg: ${averageEfficiency?.toFixed(2)}`,
                    position: 'insideTopLeft',
                  }}
                />
                <Bar dataKey="fuelEfficiency">
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.fuelEfficiency! > averageEfficiency
                          ? '#ef4444'
                          : '#10b981'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter Plot - Efficiency vs Total HM */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Efficiency vs Operating Hours
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                data={validData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey="totalHm"
                  name="Total HM"
                  label={{
                    value: 'Total Operating Hours (HM)',
                    position: 'insideBottom',
                    offset: -10,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="fuelEfficiency"
                  name="Efficiency"
                  label={{
                    value: 'Efficiency (L/HM)',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={<CustomTooltip />}
                />
                <Scatter name="Units" data={validData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Efficiency Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {validData.length} units with valid efficiency data
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Efficiency (L/HM)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total HM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fuel Used (L)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.map((item, index) => (
                    <tr
                      key={item.unit}
                      className={
                        index < 3
                          ? 'bg-red-50'
                          : index >= sortedData.length - 3
                            ? 'bg-green-50'
                            : ''
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            item.fuelEfficiency! > averageEfficiency
                              ? 'text-red-600'
                              : 'text-green-600'
                          }
                        >
                          {item.fuelEfficiency?.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.totalHm.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.fuelUsed.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.fuelEfficiency! > averageEfficiency
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {item.fuelEfficiency! > averageEfficiency
                            ? 'Diatas Rata Rata'
                            : 'Dibawah Rata Rata'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
