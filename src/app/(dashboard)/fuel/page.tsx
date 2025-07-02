'use client';

import { fetchAPI } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
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

  // Filter states
  const [minEfficiency, setMinEfficiency] = useState<number>(0);
  const [maxEfficiency, setMaxEfficiency] = useState<number>(50);
  const [minHours, setMinHours] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'efficiency' | 'hours' | 'fuel'>(
    'efficiency',
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading } = useQuery<FuelEfficiencyData[]>({
    queryKey: ['fuelEfficiency', selectedPeriod],
    queryFn: () => fetchAPI(`/api/fuel/${selectedPeriod}/efficiency`),
    enabled: !!selectedPeriod,
  });

  // Get unique categories and brands for filter dropdowns
  // Get unique categories and brands for filter dropdowns
  const categories = data
    ? Array.from(new Set(data.map((item) => item.category).filter(Boolean)))
    : [];
  const brands = data
    ? Array.from(new Set(data.map((item) => item.brand).filter(Boolean)))
    : [];

  // Apply filters
  const filteredData =
    data?.filter((item) => {
      // Basic validation
      if (
        item.fuelEfficiency === null ||
        item.totalHm <= 0 ||
        item.fuelEfficiency <= 0
      ) {
        return false;
      }

      // Efficiency range filter
      if (
        item.fuelEfficiency < minEfficiency ||
        item.fuelEfficiency > maxEfficiency
      ) {
        return false;
      }

      // Minimum hours filter
      if (item.totalHm < minHours) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && item.brand !== selectedBrand) {
        return false;
      }

      return true;
    }) || [];

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let aVal: number, bVal: number;

    switch (sortBy) {
      case 'hours':
        aVal = a.totalHm;
        bVal = b.totalHm;
        break;
      case 'fuel':
        aVal = a.fuelUsed;
        bVal = b.fuelUsed;
        break;
      default:
        aVal = a.fuelEfficiency || 0;
        bVal = b.fuelEfficiency || 0;
    }

    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  // Calculate average efficiency from filtered data
  const averageEfficiency =
    filteredData.length > 0
      ? filteredData.reduce(
          (sum, item) => sum + (item.fuelEfficiency || 0),
          0,
        ) / filteredData.length
      : 0;

  // Reset filters
  const resetFilters = () => {
    setMinEfficiency(0);
    setMaxEfficiency(50);
    setMinHours(10);
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSortBy('efficiency');
    setSortOrder('desc');
  };

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
        <div>
          <h1 className="text-2xl font-bold">Fuel Efficiency Leaderboard</h1>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Back to Homepage
          </Link>
        </div>
        <div className="flex gap-2">
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={resetFilters}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {/* Efficiency Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Efficiency (L/HM)
            </label>
            <input
              type="number"
              value={minEfficiency}
              onChange={(e) => setMinEfficiency(Number(e.target.value))}
              className="w-full border rounded p-2 text-sm"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Efficiency (L/HM)
            </label>
            <input
              type="number"
              value={maxEfficiency}
              onChange={(e) => setMaxEfficiency(Number(e.target.value))}
              className="w-full border rounded p-2 text-sm"
              min="0"
              step="0.1"
            />
          </div>

          {/* Min Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Hours (HM)
            </label>
            <input
              type="number"
              value={minHours}
              onChange={(e) => setMinHours(Number(e.target.value))}
              className="w-full border rounded p-2 text-sm"
              min="0"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            >
              <option value="all">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'efficiency' | 'hours' | 'fuel')
              }
              className="w-full border rounded p-2 text-sm"
            >
              <option value="efficiency">Efficiency</option>
              <option value="hours">Operating Hours</option>
              <option value="fuel">Fuel Used</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full border rounded p-2 text-sm"
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <span className="font-medium">Active Filters:</span> Efficiency:{' '}
          {minEfficiency}-{maxEfficiency} L/HM, Min Hours: {minHours} HM
          {selectedCategory !== 'all' && `, Category: ${selectedCategory}`}
          {selectedBrand !== 'all' && `, Brand: ${selectedBrand}`} | Showing{' '}
          {filteredData.length} of {data?.length || 0} units
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Filtered Units</p>
          <p className="font-bold text-xl">{filteredData.length}</p>
          <p className="text-xs text-gray-400">Total: {data?.length || 0}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Average Efficiency</p>
          <p className="font-bold text-xl">
            {averageEfficiency?.toFixed(2) || 0} L/HM
          </p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Best Performance</p>
          <p className="font-bold text-green-600">
            {sortOrder === 'asc'
              ? sortedData[0]?.unit
              : sortedData[sortedData.length - 1]?.unit || '-'}
          </p>
          <p className="text-xs text-gray-400">
            {sortOrder === 'asc'
              ? sortedData[0]?.fuelEfficiency?.toFixed(2)
              : sortedData[sortedData.length - 1]?.fuelEfficiency?.toFixed(
                  2,
                )}{' '}
            L/HM
          </p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Worst Performance</p>
          <p className="font-bold text-red-600">
            {sortOrder === 'asc'
              ? sortedData[sortedData.length - 1]?.unit
              : sortedData[0]?.unit || '-'}
          </p>
          <p className="text-xs text-gray-400">
            {sortOrder === 'asc'
              ? sortedData[sortedData.length - 1]?.fuelEfficiency?.toFixed(2)
              : sortedData[0]?.fuelEfficiency?.toFixed(2)}{' '}
            L/HM
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading...
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data matches the current filters
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
                data={filteredData}
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
                <Scatter name="Units" data={filteredData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Efficiency Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredData.length} units with current filters
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
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
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
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.type}
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
                            ? 'Above Average'
                            : 'Below Average'}
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
