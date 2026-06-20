import React from "react";

export function SkeletonPage() {
  return (
    <div className="w-full h-full flex flex-col space-y-md animate-pulse">
      {/* Header Skeleton */}
      <div className="w-48 h-8 bg-surface-container rounded-lg mb-4"></div>
      
      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* List Skeleton */}
      <div className="mt-8 space-y-sm">
        <SkeletonList />
        <SkeletonList />
        <SkeletonList />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface rounded-2xl p-6 border border-outline/50">
      <div className="w-12 h-12 rounded-full bg-surface-container mb-4"></div>
      <div className="w-3/4 h-6 bg-surface-container rounded mb-2"></div>
      <div className="w-1/2 h-4 bg-surface-container rounded"></div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="bg-surface rounded-xl p-4 border border-outline/50 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-surface-container"></div>
        <div>
          <div className="w-32 h-5 bg-surface-container rounded mb-2"></div>
          <div className="w-24 h-3 bg-surface-container rounded"></div>
        </div>
      </div>
      <div className="w-16 h-8 bg-surface-container rounded"></div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-lg">
      <div className="flex items-center justify-between">
        <div className="w-48 h-10 bg-surface-container rounded-lg"></div>
        <div className="w-10 h-10 bg-surface-container rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 space-y-md">
          <div className="w-32 h-6 bg-surface-container rounded-md"></div>
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="space-y-md">
          <div className="w-32 h-6 bg-surface-container rounded-md"></div>
          <div className="bg-surface rounded-2xl p-4 border border-outline/50 space-y-4">
             <SkeletonList />
             <SkeletonList />
             <SkeletonList />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="animate-pulse max-w-2xl mx-auto w-full space-y-md">
      <div className="w-full h-32 bg-surface rounded-2xl border border-outline/50 mb-8"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-surface rounded-2xl p-6 border border-outline/50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-surface-container"></div>
            <div>
              <div className="w-32 h-5 bg-surface-container rounded mb-2"></div>
              <div className="w-24 h-3 bg-surface-container rounded"></div>
            </div>
          </div>
          <div className="w-full h-20 bg-surface-container rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}
