'use client';

import { fetchAPI } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type SummaryItem = {
  week: string;
  date: string;
  planDs: string;
  actDs: string;
  planNs: string;
  actNs: string;
  planDaily: string;
  actDaily: string;
  achDaily: string;
  planMtd: string;
  actMtd: string;
  achMtd: string;
  fuelDs: string;
  fuelNs: string;
  fuelDaily: string;
  fuelMtd: string;
  frDs: string;
  frNs: string;
  frDaily: string;
  frMtd: string;
  fleetDs: string;
  dtDs: string;
  fleetNs: string;
  dtNs: string;
};

type SummaryData = {
  month: string;
  items: SummaryItem[];
};

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    new Date().toISOString().slice(5, 7) + '-' + new Date().getFullYear(),
  );

  const { data, isLoading } = useQuery<SummaryData>({
    queryKey: ['summary', selectedPeriod],
    queryFn: () => fetchAPI(`/api/summary?period=${selectedPeriod}`),
    enabled: !!selectedPeriod,
  });

  // Transform data for charts
  const chartData =
    data?.items?.map((item) => ({
      date: item.date,
      shortDate: item.date.split('/')[0] + '/' + item.date.split('/')[1],
      planDaily: parseFloat(item.planDaily) || 0,
      actDaily: parseFloat(item.actDaily) || 0,
      fuelDaily: parseFloat(item.fuelDaily) || 0,
      achDaily: parseFloat(item.achDaily?.replace('%', '')) || 0,
      achMtd: parseFloat(item.achMtd?.replace('%', '')) || 0,
      frDaily: parseFloat(item.frDaily) || 0,
      frMtd: parseFloat(item.frMtd) || 0,
      planDs: parseFloat(item.planDs) || 0,
      actDs: parseFloat(item.actDs) || 0,
      planNs: parseFloat(item.planNs) || 0,
      actNs: parseFloat(item.actNs) || 0,
      fuelDs: parseFloat(item.fuelDs) || 0,
      fuelNs: parseFloat(item.fuelNs) || 0,
      fleetDs: parseInt(item.fleetDs) || 0,
      fleetNs: parseInt(item.fleetNs) || 0,
    })) || [];

  // Calculate summary metrics
  const latestData = chartData[chartData.length - 1];
  const totalPlan = chartData.reduce((sum, item) => sum + item.planDaily, 0);
  const totalActual = chartData.reduce((sum, item) => sum + item.actDaily, 0);
  const totalFuel = chartData.reduce((sum, item) => sum + item.fuelDaily, 0);
  const avgAchievement =
    chartData.length > 0
      ? chartData.reduce((sum, item) => sum + item.achDaily, 0) /
        chartData.length
      : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            PT. Arta Daya Taruna
          </h1>
          <p className="text-gray-600">{data?.month || 'Loading...'}</p>
        </div>
        <div className="flex gap-2">
          <input
            type="month"
            value={selectedPeriod.split('-').reverse().join('-')}
            onChange={(e) => {
              const [year, month] = e.target.value.split('-');
              setSelectedPeriod(`${month}-${year}`);
            }}
            className="border rounded p-2 text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading dashboard data...
        </div>
      ) : !data?.items?.length ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available for selected period
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href={`/production`} className="cursor-pointer">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Production</p>
                    <p className="text-2xl font-bold">
                      {totalActual.toLocaleString()}
                    </p>
                    <p className="text-blue-100 text-xs">
                      Plan: {totalPlan.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-3xl opacity-80">📊</div>
                </div>
              </div>
            </Link>

            <Link href={`/fuel`} className="cursor-pointer">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Achievement</p>
                    <p className="text-2xl font-bold">
                      {avgAchievement.toFixed(1)}%
                    </p>
                    <p className="text-green-100 text-xs">
                      MTD: {latestData?.achMtd.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-3xl opacity-80">🎯</div>
                </div>
              </div>
            </Link>

            <Link href={`/fuel`} className="cursor-pointer">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Total Fuel</p>
                    <p className="text-2xl font-bold">
                      {totalFuel.toLocaleString()}
                    </p>
                    <p className="text-orange-100 text-xs">
                      FR: {latestData?.frMtd.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-3xl opacity-80">⛽</div>
                </div>
              </div>
            </Link>
            <Link href={`/asset`} className="cursor-pointer">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Active Fleet</p>
                    <p className="text-2xl font-bold">
                      {(latestData?.fleetDs || 0) + (latestData?.fleetNs || 0)}
                    </p>
                    <p className="text-purple-100 text-xs">
                      DS: {latestData?.fleetDs} | NS: {latestData?.fleetNs}
                    </p>
                  </div>
                  <div className="text-3xl opacity-80">🚛</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Production Trend Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Production Trend - Plan vs Actual
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortDate" />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: 'Production',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: 'Achievement %',
                    angle: 90,
                    position: 'insideRight',
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="planDaily"
                  fill="#e5e7eb"
                  name="Plan Daily"
                />
                <Bar
                  yAxisId="left"
                  dataKey="actDaily"
                  fill="#3b82f6"
                  name="Actual Daily"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="achDaily"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Achievement %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Shift Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Day vs Night Shift Production */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Shift Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shortDate" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="actDs" fill="#fbbf24" name="Day Shift" />
                  <Bar dataKey="actNs" fill="#1f2937" name="Night Shift" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Fuel Consumption */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Fuel Consumption</h2>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shortDate" />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: 'Fuel (L)',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: 'FR', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="fuelDaily"
                    fill="#f97316"
                    name="Daily Fuel"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="frDaily"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Fuel Ratio"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Achievement Progress
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortDate" />
                <YAxis
                  label={{
                    value: 'Achievement %',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="achDaily"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Daily Achievement %"
                />
                <Area
                  type="monotone"
                  dataKey="achMtd"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="MTD Achievement %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                Daily Performance Summary
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Achievement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fuel (L)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      FR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fleet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {chartData
                    .slice() // Create a copy to avoid mutating original array
                    .reverse() // Reverse to show latest date first
                    .map((item, index) => (
                      <tr
                        key={index}
                        className={
                          item.achDaily >= 80
                            ? 'bg-green-50'
                            : item.achDaily >= 60
                              ? 'bg-yellow-50'
                              : 'bg-red-50'
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.planDaily.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {item.actDaily.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.achDaily >= 80
                                ? 'bg-green-100 text-green-800'
                                : item.achDaily >= 60
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.achDaily.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.fuelDaily.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.frDaily.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          DS: {item.fleetDs} | NS: {item.fleetNs}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.achDaily >= 80
                                ? 'bg-green-100 text-green-800'
                                : item.achDaily >= 60
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.achDaily >= 80
                              ? 'Good'
                              : item.achDaily >= 60
                                ? 'Fair'
                                : 'Below Target'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
