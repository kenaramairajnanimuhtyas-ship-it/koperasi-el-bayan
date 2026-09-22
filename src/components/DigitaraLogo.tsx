import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const DigitaraLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Geometric modern chevron "D" arrow mark matching Digitara Medan logo in the flyer */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-1.5 shadow-md shadow-blue-500/20 text-white`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blue base chevron shape */}
          <path
            d="M20 20 L55 20 C72 20 85 33 85 50 C85 67 72 80 55 80 L20 80 Z"
            fill="#1E40AF"
          />
          {/* Cyan/Blue energetic inner wing */}
          <path
            d="M32 30 L54 30 C64 30 72 38 72 48 C72 58 64 66 54 66 L32 66 Z"
            fill="#0284C7"
          />
          {/* Yellow golden dynamic forward arrow / lightning bolt */}
          <path
            d="M22 68 L50 20 L44 50 L68 50 L34 84 L40 56 Z"
            fill="#FBBF24"
          />
          <path
            d="M38 48 L56 22 L46 48 L64 48 L32 80 Z"
            fill="#F59E0B"
            opacity="0.8"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className="font-extrabold tracking-tight text-slate-900 text-lg uppercase font-sans">
              DIGITARA
            </span>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
              POS
            </span>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 tracking-wider uppercase mt-0.5">
            Sistem Kasir Pintar
          </span>
        </div>
      )}
    </div>
  );
};
