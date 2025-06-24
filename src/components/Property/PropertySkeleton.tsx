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

export const PropertyListItemSkeleton = () => {
  return (
    <div className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Imagen Skeleton */}
        <div className="relative md:w-80 h-48 md:h-auto flex-shrink-0 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gray-200" />
          <div className="absolute top-3 left-3 w-20 h-6 bg-gray-300 rounded-br-lg" />
          <div className="absolute bottom-3 left-3 w-24 h-8 bg-gray-300 rounded-full" />
        </div>
        {/* Contenido Skeleton */}
        <div className="flex-1 p-6 flex flex-col h-full">
          <div className="flex-1">
            <div className="mb-4">
              <div className="h-8 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  <div>
                    <div className="h-4 w-16 bg-gray-200 rounded mb-1 animate-pulse" />
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertySkeleton;