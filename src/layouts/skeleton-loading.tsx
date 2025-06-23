'use client';

import { Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';

export const SkeletonLoading = () => {
  const [skeletonHeight, setSkeletonHeight] = useState(600); // Default height

  // Dynamically adjust skeleton height based on viewport
  useEffect(() => {
    const handleResize = () => {
      const headerHeight = 300; // adjust based on actual header or fixed component heights
      const calculatedHeight = window.innerHeight - headerHeight;
      setSkeletonHeight(calculatedHeight);
    };

    handleResize(); // Set initial height
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full">
      <div className="my-5 max-w-3xl mx-auto gap-2 space-y-6">
        <Skeleton height={110} />
        <Skeleton height={60} mt={2} />
        <Skeleton height={300} mt={2} />
        <Skeleton height={300} mt={2} />
      </div>
    </div>
  );
};
