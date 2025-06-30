'use client';

import { fetchAPI } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { CategoryBigButton } from './catagory-big-button';
import { CategoryWithListAsset } from './category-with-list-asset';

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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

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

  console.log('Selected Category:', selectedCategory);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {selectedCategory ? (
            <CategoryWithListAsset
              selectedCategory={selectedCategory}
              categories={categories}
              CATEGORY_ICONS={CATEGORY_ICONS}
              groupedAssets={groupedAssets}
              handleCategoryClick={(category: string) => {
                setSelectedCategory(category);
              }}
            />
          ) : (
            <CategoryBigButton
              CATEGORY_ICONS={CATEGORY_ICONS}
              categories={categories}
              groupedAssets={groupedAssets}
              handleCategoryClick={(category: string) => {
                setSelectedCategory(category);
                setSelectedUnit(null); // Reset unit selection when category changes
              }}
            />
          )}
        </>
      )}
    </>
  );
}
