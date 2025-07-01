'use client';

import { fetchAPI } from '@/lib/fetcher';
import { NumberFormat } from '@/lib/number';
import { Skeleton } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { FuelInNumber } from './fuel-in-number';
import { TableFuelOut } from './fuel-table';
import FuelUsageChart from './fuel-usage';
import { ProblemBarChart } from './plant-chart';
import { TableMaintenance } from './plant-table';

type Asset = {
  no: string;
  category: string;
  classification: string;
  brand: string;
  type: string;
  serialNumber: string;
  unit: string;
  productionYear: string;
  condition: string;
  purchaseYear: string;
  purchaseMonth: string;
  purchaseDate: string;
};

const CATEGORY_PREFIX_MAP: { [prefix: string]: string } = {
  AC: 'AC',
  Bulldozer: 'Bulldozer',
  Compactor: 'Compactor',
  Container: 'Container',
  Drone: 'Drone Mapping',
  Dump: 'Dump Truck',
  Excavator: 'Excavator',
  Fabrikasi: 'Fabrikasi Pontoon 4 TON',
  'Fuel Storage': 'Fuel Storage',
  'Fuel Truck': 'Fuel Truck',
  'Fuel Pump': 'Fuel Pump',
  Genset: 'Genset',
  Handphone: 'HP',
  HP: 'HP',
  Internet: 'Internet Satellite',
  Kasur: 'Kasur Slimbed',
  Kompresor: 'Kompresor MWE',
  Laptop: 'Laptop',
  Ligth: 'Ligth Vehicle',
  Meja: 'Meja Rapat Expo MTM 1890',
  'Mesin Cuci': 'Mesin Cuci',
  'Mesin Welding': 'Mesin Welding HDPE',
  Minibus: 'Minibus',
  'Motor Grader': 'Motor Grader',
  PC: 'PC',
  Printer: 'Printer',
  TV: 'TV',
  Tab: 'HP',
  'Tower Lamp': 'Tower Lamp',
  'Water Pump': 'Water Pump (Pompa Tambang)',
  'Water Truck': 'Water Truck',
  'Alat Survey': 'Alat Survey',
};

const CATEGORY_ICONS: { [category: string]: string } = {
  AC: '/assets/icons/AC.png',
  Bulldozer: '/assets/icons/Bulldozer.png',
  Compactor: '/assets/icons/Compactor.png',
  Container: '/assets/icons/Container.png',
  'Drone Mapping': '/assets/icons/Drone Mapping.png',
  'Dump Truck': '/assets/icons/Dump Truck.png',
  Excavator: '/assets/icons/Excavator.png',
  'Fuel Storage': '/assets/icons/Fuel Storage.png',
  'Fuel Truck': '/assets/icons/Fuel Truck.png',
  'Fuel Pump': '/assets/icons/Fuel Pump.png',
  Genset: '/assets/icons/Genset.png',
  HP: '/assets/icons/HP.png',
  'Internet Satellite': '/assets/icons/Internet Satellite.png',
  Laptop: '/assets/icons/Lap-top.png',
  'Ligth Vehicle': '/assets/icons/Ligth Vehicle.png',
  Minibus: '/assets/icons/Minibus.png',
  'Motor Grader': '/assets/icons/Motor Grader.png',
  PC: '/assets/icons/P-C.png',
  Printer: '/assets/icons/Printer.png',
  TV: '/assets/icons/TV.png',
  Tab: '/assets/icons/Tab.png',
  'Tower Lamp': '/assets/icons/Tower Lamp.png',
  'Water Pump (Pompa Tambang)': '/assets/icons/Water Pump (Pompa Tambang).png',
  'Water Truck': '/assets/icons/Water Truck.png',
  'Alat Survey': '/assets/icons/Others.png',
  Others: '/assets/icons/Others.png',
};

export interface PlantStatusResponse {
  success: boolean;
  data: {
    lastRecord: PlantStatusEntry | null;
    maxHM: PlantStatusEntry | null;
    raw: PlantStatusEntry[];
  };
}

export interface PlantStatusEntry {
  date: string; // Format: 'YYYY-MM-DD'
  shift: string;
  unit: string;
  hm: number;
  problem: string;
  type: string;
  status: string | null;
}

export default function TruckAssetDashboard() {
  const [selectedUnit, setSelectedUnit] = useState<string>('TJ-3054');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    new Date().toISOString().slice(0, 7), // Default to current month
  );

  const assetList = useQuery<any>({
    queryKey: ['assetList'],
    queryFn: () => fetchAPI(`/api/asset`),
  });

  const detailAsset = useQuery<any>({
    queryKey: ['detailAsset', selectedUnit],
    queryFn: () => fetchAPI(`/api/asset/${selectedUnit}`),
    enabled: !!selectedUnit, // Only fetch if selectedUnit is set
  });

  const fuelPeriod = useQuery<any>({
    queryKey: ['fuelPeriod', selectedUnit, selectedPeriod],
    queryFn: () =>
      fetchAPI(`/api/asset/${selectedUnit}/${selectedPeriod}/fuel`),
    enabled: !!selectedUnit && !!selectedPeriod, // Only fetch if both are set
  });

  const plantPeriod = useQuery<any>({
    queryKey: ['plantPeriod', selectedUnit, selectedPeriod],
    queryFn: () =>
      fetchAPI(`/api/asset/${selectedUnit}/${selectedPeriod}/plant`),
    enabled: !!selectedUnit && !!selectedPeriod, // Only fetch if both are set
  });

  const assetOptions = assetList.data?.map((asset: any) => (
    <option key={asset.unit} value={asset.unit}>
      {asset.unit}
    </option>
  ));

  const categoryIcon = (category: string) => {
    return CATEGORY_ICONS[category] || CATEGORY_ICONS['Others'];
  };

  const [tab, setTab] = useState<'fuel' | 'maintenance' | 'utilization'>(
    'fuel',
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Asset Dashboard</h1>
        <div className="flex gap-2">
          <select
            className="border rounded p-2 text-sm"
            value={selectedUnit}
            onChange={(e) => {
              setSelectedUnit(e.target.value);
            }}
          >
            {assetOptions?.length > 0 ? (
              assetOptions
            ) : (
              <option value={selectedUnit} disabled>
                {selectedUnit}
              </option>
            )}
          </select>
          <input
            type="month"
            className="border rounded p-2 text-sm"
            defaultValue={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          />
          <button className="border rounded px-4 py-2 text-sm hover:bg-gray-100">
            Export
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {detailAsset.isLoading ? (
          <Skeleton height={80} />
        ) : (
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center">
              <div>
                <Image
                  src={categoryIcon(detailAsset?.data?.asset?.category)}
                  alt={detailAsset?.data?.asset?.category}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain mr-2"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {detailAsset?.data?.asset?.category}{' '}
                  {detailAsset?.data?.asset?.unit}
                </p>

                <p className="font-bold">
                  {detailAsset?.data?.asset?.brand}{' '}
                  {detailAsset?.data?.asset?.type}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Last HM (fuel/plant/dispatch)</p>
          <p className="font-bold">
            {NumberFormat.no(fuelPeriod?.data?.maxHM?.hm || 0)} /{' '}
            {NumberFormat.no(plantPeriod?.data?.maxHM?.hm || 0)}{' '}
          </p>
        </div>
        {plantPeriod.isLoading || plantPeriod.isRefetching ? (
          <Skeleton height={80} />
        ) : (
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-gray-500">
              Last Status {plantPeriod?.data?.lastRecord?.date}
            </p>
            <p className="font-bold">
              {plantPeriod?.data?.lastRecord?.status || 'No Record'} HM :
              {plantPeriod?.data?.lastRecord?.hm}
            </p>
          </div>
        )}
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Last Activity</p>
          <p className="font-bold">Kerja Angkut</p>
        </div>
      </div>

      <div className="border-t" />

      {/* Tabs Section */}
      <div>
        <div className="flex gap-2 border-b">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              tab === 'fuel'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setTab('fuel')}
          >
            Fuel Usage
          </button>
          <button
            onClick={() => setTab('maintenance')}
            className={`px-4 py-2 text-sm font-medium ${
              tab === 'maintenance'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Maintenance
          </button>
          <button
            onClick={() => setTab('utilization')}
            className={`px-4 py-2 text-sm font-medium ${
              tab === 'utilization'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Work & Utilization
          </button>
        </div>

        {/* Fuel Usage */}
        {tab === 'fuel' && (
          <>
            <div>
              <FuelUsageChart
                data={fuelPeriod?.data?.chartData}
                isLoading={fuelPeriod.isLoading || fuelPeriod.isRefetching}
              />
            </div>

            <div>
              <FuelInNumber
                data={fuelPeriod?.data}
                isLoading={fuelPeriod.isLoading || fuelPeriod.isRefetching}
              />
            </div>

            <div>
              {fuelPeriod.isLoading || fuelPeriod.isRefetching ? (
                <Skeleton height={200} />
              ) : (
                <TableFuelOut
                  tableName="fuel usage"
                  data={fuelPeriod?.data?.raw ?? []}
                />
              )}
            </div>
          </>
        )}

        {/* Maintenance */}
        {tab === 'maintenance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="bg-white rounded shadow p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {/* <BarChart className="w-4 h-4" />  */}
                  Downtime Summary
                </div>
                <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  [Bar Chart Here]
                </div>
              </div>
              <div className="bg-white rounded shadow p-4 space-y-1">
                <p className="text-sm text-gray-500">Upcoming Maintenance</p>
                <p className="font-bold">Oil Change - Due in 20 HM</p>
                <p className="text-sm text-gray-500">Health Status</p>
                <span className="inline-block px-2 py-1 text-xs bg-yellow-200 text-yellow-900 rounded-full">
                  Warning
                </span>
              </div>
            </div>

            <div>
              {plantPeriod?.data?.raw?.length > 0 && (
                <ProblemBarChart raw={plantPeriod?.data?.raw} />
              )}
            </div>

            <div>
              {plantPeriod.isLoading || plantPeriod.isRefetching ? (
                <Skeleton height={200} />
              ) : (
                <TableMaintenance
                  tableName="maintenance records"
                  data={plantPeriod?.data?.raw ?? []}
                />
              )}
            </div>
          </div>
        )}

        {/* Work & Utilization */}
        {tab === 'utilization' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="bg-white rounded shadow p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {/* <PieChart className="w-4 h-4" />  */}
                  Task Utilization
                </div>
                <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  [Pie Chart Here]
                </div>
              </div>
              <div className="bg-white rounded shadow p-4 space-y-1">
                <p className="text-sm text-gray-500">Current Operator</p>
                <p className="font-bold">John Siregar</p>
                <p className="text-sm text-gray-500">Total Operated Today</p>
                <p className="font-bold">5.2 HM</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
