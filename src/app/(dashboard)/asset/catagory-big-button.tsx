'use client';
import Image from 'next/image';

export const CategoryBigButton = ({
  categories,
  CATEGORY_ICONS,
  groupedAssets,
  handleCategoryClick,
}: {
  categories: string[];
  CATEGORY_ICONS: Record<string, string>;
  groupedAssets: Record<string, any[]>;
  handleCategoryClick: (category: string) => void;
}) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className="btn btn-outline-success w-full px-5"
            onClick={() => handleCategoryClick(cat)}
            title={cat}
          >
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
  );
};
