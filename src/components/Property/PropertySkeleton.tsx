import React from 'react';

const PropertySkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-48 w-full flex-shrink-0 bg-gray-200">
        <div className="absolute top-0 left-0 z-10 px-3 py-1 bg-gray-300 rounded-br-lg w-20 h-6"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        {/* Address */}
        <div className="flex-grow">
          <div className="h-4 bg-gray-200 rounded w-11/12 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default PropertySkeleton;