import React from 'react';
import { Store } from 'lucide-react';

interface KoperasiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
}

export const KoperasiLogo: React.FC<KoperasiLogoProps> = ({
  size = 'md',
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: {
      icon: 'w-7 h-7',
      title: 'text-xs sm:text-sm font-bold',
      sub: 'text-[9px]',
    },
    md: {
      icon: 'w-8 h-8 sm:w-9 sm:h-9',
      title: 'text-sm sm:text-base font-extrabold',
      sub: 'text-[10px]',
    },
    lg: {
      icon: 'w-10 h-10 sm:w-12 sm:h-12',
      title: 'text-lg sm:text-xl font-extrabold',
      sub: 'text-xs',
    },
  };

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 min-w-0">
      <div
        className={`${sizeClasses[size].icon} rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 flex-shrink-0 border border-emerald-400/30`}
      >
        <Store className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100" />
      </div>
      <div className="flex flex-col min-w-0 justify-center">
        <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
          <span
            className={`${sizeClasses[size].title} tracking-tight whitespace-nowrap ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span className="hidden sm:inline">KOPERASI </span>
            <span className="text-emerald-600 dark:text-emerald-400">EL-BAYAN</span>
          </span>
          <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[9px] font-bold tracking-wide">
            TERPADU
          </span>
        </div>
        <span
          className={`${sizeClasses[size].sub} ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          } font-medium leading-tight whitespace-nowrap hidden sm:block truncate`}
        >
          Katalog Pemasaran & Sistem Kasir
        </span>
      </div>
    </div>
  );
};

