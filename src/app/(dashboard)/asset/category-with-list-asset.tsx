import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

export const CategoryWithListAsset = ({
  categories,
  CATEGORY_ICONS,
  groupedAssets,
  handleCategoryClick,
  selectedCategory,
}: {
  categories: string[];
  selectedCategory: string;
  CATEGORY_ICONS: Record<string, string>;
  groupedAssets: Record<string, any[]>;
  handleCategoryClick: (category: string) => void;
}) => {
  const [search, setSearch] = useState<string>('');

  const filteredAssets = selectedCategory
    ? groupedAssets[selectedCategory]?.filter((asset) => {
        const searchLower = search?.toLowerCase();
        return (
          asset.unit?.toLowerCase().includes(searchLower) ||
          asset.brand?.toLowerCase().includes(searchLower)
        );
      }) || []
    : [];

  return (
    <div className="relative flex gap-5 h-[calc(100vh)]">
      {/* Sidebar */}

      <div className="panel dark:gray-50 h-full w-[250px] max-w-full flex-none space-y-3 overflow-hidden px-4 ltr:rounded-r-none rtl:rounded-l-none">
        <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
          <div className="flex h-full flex-col pb-16">
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`flex h-12 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${
                    selectedCategory === cat
                      ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                      : ''
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div className="flex items-center">
                    <Image
                      src={CATEGORY_ICONS[cat] || CATEGORY_ICONS['Others']}
                      alt={cat}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                    <div className="ltr:ml-3 rtl:mr-3 line-clamp-1">{cat}</div>
                  </div>
                  <div className="whitespace-nowrap rounded-md bg-primary-light px-2 py-0.5 font-semibold dark:bg-[#060818]">
                    {groupedAssets[cat]?.length || 0}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </PerfectScrollbar>
      </div>

      {/* Content */}
      <div className="h-full flex-1 overflow-x-hidden p-0">
        <div className="flex flex-wrap-reverse items-center justify-between gap-4 py-2 px-4">
          <div className="mt-3 font-semibold text-lg text-primary">
            {selectedCategory}
          </div>
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Unit or Brand"
              className="form-input"
            />
          </div>
        </div>
        <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
        <div className="flex h-full flex-col">
          <div className="py-4">
            {selectedCategory && groupedAssets[selectedCategory]?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredAssets.map((asset, idx) => (
                  <div
                    key={asset.no + idx}
                    className="panel cursor-pointer hover:bg-white-light"
                  >
                    <Link href={`/asset/${asset.unit}`}>
                      <div className="flex justify-between items-center">
                        <Image
                          src={
                            CATEGORY_ICONS[selectedCategory] ||
                            CATEGORY_ICONS['Others']
                          }
                          alt={selectedCategory}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
                        <div className="font-bold">{asset.unit}</div>
                      </div>
                      <div>
                        <div className="">{asset.brand}</div>
                        <div className="">{asset.classification}</div>
                        <div className="">{asset.type}</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                {selectedCategory
                  ? 'Tidak ada asset pada kategori ini'
                  : 'Silakan pilih kategori di menu samping'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
