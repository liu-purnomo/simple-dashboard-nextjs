'use client';

import { fetchAPI } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useMemo } from 'react';

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

function getCategory(asset: Asset): string {
  // Cek prefix pada beberapa field, jika tidak ada masuk ke 'Others'
  const prefixes = Object.keys(CATEGORY_PREFIX_MAP);
  for (const prefix of prefixes) {
    if (
      asset.category?.startsWith(prefix)
      // asset.type?.startsWith(prefix) ||
      // asset.brand?.startsWith(prefix) ||
      // asset.unit?.startsWith(prefix)
    ) {
      return CATEGORY_PREFIX_MAP[prefix];
    }
  }
  return 'Others';
}

export default function AssetListPage() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['ListAssets'],
    queryFn: () => fetchAPI(`/api/asset`),
  });

  // Gabungkan semua asset yang tidak punya icon ke kategori Others
  const groupedAssets = useMemo(() => {
    const groups: Record<string, Asset[]> = {};
    data?.forEach((asset: Asset) => {
      const cat = getCategory(asset);
      // Jika tidak ada icon, masukkan ke Others
      if (!CATEGORY_ICONS[cat]) {
        if (!groups['Others']) groups['Others'] = [];
        groups['Others'].push(asset);
      } else {
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(asset);
      }
    });
    return groups;
  }, [data]);

  // Daftar kategori yang muncul di data
  const categories = useMemo(() => {
    if (!groupedAssets) return [];
    return Object.keys(groupedAssets);
  }, [groupedAssets]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Asset List</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button key={cat} className="btn btn-outline-success w-full px-5">
                <div className="relative flex flex-col items-center justify-center">
                  <Image
                    priority
                    src={CATEGORY_ICONS[cat] || CATEGORY_ICONS['Others']}
                    alt={cat}
                    width={80}
                    height={80}
                    className="mb-4 w-20 h-20 object-contain rounded-xl object-center"
                  />
                  <div className="text-wrap text-center font-bold">
                    <p>{cat}</p>
                  </div>
                </div>
                <span className="badge absolute ltr:right-0 rtl:left-0 -top-3 bg-primary p-0.5 px-1.5 rounded-full">
                  {groupedAssets[cat]?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
