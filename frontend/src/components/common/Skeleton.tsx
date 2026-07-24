import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  circle = false,
}) => {
  const styles: React.CSSProperties = {};
  if (width) styles.width = width;
  if (height) styles.height = height;

  return (
    <div
      className={`animate-shimmer bg-slate-200/50 dark:bg-neutral-800/50 ${
        circle ? 'rounded-full' : 'rounded-lg'
      } ${className}`}
      style={styles}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel rounded-[28px] p-5 shadow-ambient border-l-4 border-neutral-300 dark:border-neutral-700">
      <div className="flex items-center justify-between">
        <Skeleton width="40%" height="14px" />
        <Skeleton width="32px" height="32px" className="rounded-xl" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton width="60%" height="24px" />
        <Skeleton width="80%" height="12px" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Table Header */}
      <div className="flex gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        {[...Array(cols)].map((_, i) => (
          <Skeleton key={i} className="flex-grow" height="16px" />
        ))}
      </div>
      {/* Table Rows */}
      {[...Array(rows)].map((_, r) => (
        <div key={r} className="flex gap-4 items-center py-3 border-b border-neutral-50 dark:border-neutral-800/30">
          {[...Array(cols)].map((_, c) => (
            <Skeleton key={c} className="flex-grow" height="12px" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton width="30%" height="12px" />
          <Skeleton width="100%" height="42px" className="rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4 h-[300px] flex flex-col justify-end">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2 w-1/3">
          <Skeleton width="60%" height="16px" />
          <Skeleton width="100%" height="12px" />
        </div>
        <Skeleton width="80px" height="28px" className="rounded-xl" />
      </div>
      <div className="flex items-end justify-between flex-grow gap-2 px-2 pt-4 border-b border-neutral-100 dark:border-neutral-800">
        <Skeleton className="w-[12%]" height="40%" />
        <Skeleton className="w-[12%]" height="75%" />
        <Skeleton className="w-[12%]" height="50%" />
        <Skeleton className="w-[12%]" height="90%" />
        <Skeleton className="w-[12%]" height="60%" />
        <Skeleton className="w-[12%]" height="85%" />
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 pb-6">
      {/* 1. Welcome Message Banner Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between glass-panel px-6 py-6 rounded-[32px] shadow-ambient mb-2 gap-4">
        <div className="flex items-center space-x-4">
          <Skeleton width="64px" height="64px" className="rounded-2xl" />
          <div className="space-y-2 w-[200px]">
            <Skeleton width="45%" height="10px" />
            <Skeleton width="85%" height="18px" />
            <Skeleton width="100%" height="12px" />
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-white/40 dark:bg-neutral-500/40 border border-neutral-200/50 dark:border-neutral-800 px-4 py-2.5 rounded-2xl md:min-w-[150px]">
          <Skeleton width="20px" height="20px" circle />
          <div className="space-y-1 w-[80px]">
            <Skeleton width="50%" height="8px" />
            <Skeleton width="100%" height="12px" />
          </div>
        </div>
      </div>

      {/* 2. Quick Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* 3. Bento Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Charts & Tables) */}
        <div className="lg:col-span-8 space-y-6">
          <ChartSkeleton />
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
            <TableSkeleton rows={4} cols={5} />
          </div>
        </div>

        {/* Right Column (Side Panels) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
            <Skeleton width="55%" height="16px" />
            <Skeleton width="100%" height="42px" className="rounded-xl" />
            <div className="space-y-3">
              <Skeleton width="100%" height="60px" className="rounded-2xl" />
              <Skeleton width="100%" height="60px" className="rounded-2xl" />
            </div>
          </div>
          <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-4">
            <Skeleton width="45%" height="16px" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton width="36px" height="36px" className="rounded-xl" />
                  <div className="space-y-1.5 flex-grow">
                    <Skeleton width="60%" height="10px" />
                    <Skeleton width="40%" height="8px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
