import React, { useState, useEffect, useRef } from 'react';

interface LoadingContainerProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  hintText?: string;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  isLoading,
  skeleton,
  children,
  hintText,
}) => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timerSkeletonRef = useRef<NodeJS.Timeout | null>(null);
  const timerHintRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Delay skeleton rendering by 500ms
      timerSkeletonRef.current = setTimeout(() => {
        setShowSkeleton(true);
      }, 500);

      // Delay status hint text by 3000ms
      timerHintRef.current = setTimeout(() => {
        setShowHint(true);
      }, 3000);
    } else {
      // Clear timers and reset states when loading stops
      if (timerSkeletonRef.current) clearTimeout(timerSkeletonRef.current);
      if (timerHintRef.current) clearTimeout(timerHintRef.current);
      setShowSkeleton(false);
      setShowHint(false);
    }

    return () => {
      if (timerSkeletonRef.current) clearTimeout(timerSkeletonRef.current);
      if (timerHintRef.current) clearTimeout(timerHintRef.current);
    };
  }, [isLoading]);

  if (!isLoading) {
    return <div className="animate-fade-in">{children}</div>;
  }

  // < 500ms -> render nothing (or empty space) to avoid flashing
  if (!showSkeleton) {
    return <div className="min-h-[100px] w-full" />;
  }

  // 500ms - 3s -> render skeleton
  // > 3s -> render skeleton + status hint text
  return (
    <div className="w-full space-y-4">
      <div className="animate-fade-in">{skeleton}</div>
      {showHint && hintText && (
        <div className="flex items-center justify-center space-x-2 py-2 text-xs font-semibold text-slate-400 dark:text-neutral-500 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
          <p className="tracking-wide uppercase">{hintText}</p>
        </div>
      )}
    </div>
  );
};

export default LoadingContainer;
