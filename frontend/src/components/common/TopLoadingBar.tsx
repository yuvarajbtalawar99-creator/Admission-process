import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const TopLoadingBar: React.FC = () => {
  const globalLoading = useSelector((state: RootState) => state.ui.globalLoading);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let fadeTimer: NodeJS.Timeout;

    if (globalLoading) {
      setVisible(true);
      setWidth(10);
      
      // Simulate progress bar increments
      timer = setInterval(() => {
        setWidth((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          const increment = Math.max(1, Math.floor((100 - prev) / 10));
          return prev + increment;
        });
      }, 150);
    } else {
      setWidth(100);
      fadeTimer = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 300);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [globalLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-neutral-100/30 dark:bg-neutral-900/30 z-[9999] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 shadow-[0_0_8px_rgba(99,102,241,0.8)] transition-all duration-300 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default TopLoadingBar;
