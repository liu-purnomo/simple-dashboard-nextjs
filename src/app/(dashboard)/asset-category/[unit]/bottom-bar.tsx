'use client';

import { useEffect, useState } from 'react';
import { FaGasPump, FaTruckMoving } from 'react-icons/fa';
import { MdBuild, MdSummarize } from 'react-icons/md';

export const FloatingBottomBar = () => {
  const [showTopButton, setShowTopButton] = useState(false);

  const onScrollHandler = () => {
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop;
    setShowTopButton(scrollTop > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);
    return () => {
      window.removeEventListener('scroll', onScrollHandler); // ✅ fix wrong event name
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      {showTopButton && (
        <div className="group flex gap-4 bg-white/10 hover:bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-gray-200 transition-colors duration-300">
          <a
            href="#summary"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <MdSummarize size={18} />
            Summary
          </a>
          <a
            href="#fleet"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <FaTruckMoving size={18} />
            Fleet
          </a>
          <a
            href="#maintenance"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <MdBuild size={18} />
            Maintenance
          </a>
          <a
            href="#fuel"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <FaGasPump size={18} />
            Fuel
          </a>
        </div>
      )}
    </div>
  );
};
