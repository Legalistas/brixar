import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PropertyDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="text-right">
            <div className="h-8 w-32 bg-gray-200 rounded mb-1 animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Image Carousel Skeleton */}
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="aspect-video relative">
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Navigation buttons skeleton */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>

          {/* Image counter skeleton */}
          <div className="absolute bottom-4 left-4 w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Thumbnail strip skeleton */}
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="flex-shrink-0 w-20 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </Card>

      {/* Property Details Grid Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Details Skeleton */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-3 w-16 bg-gray-200 rounded mb-1 animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="h-5 w-32 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Amenities Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="h-5 w-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="h-5 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailSkeleton; 