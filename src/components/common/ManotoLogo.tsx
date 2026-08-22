import React from 'react';

interface ManotoLogoProps {
  variant?: 'light' | 'dark' | 'card';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPersianSub?: boolean;
  className?: string;
}

export const ManotoLogo: React.FC<ManotoLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showPersianSub = false,
  className = '',
}) => {
  const isLight = variant === 'light';
  const isCard = variant === 'card';
  
  // Font and spacing scales
  const sizeMap = {
    sm: {
      title: 'text-base sm:text-lg tracking-[0.22em]',
      sub: 'text-[9px] tracking-[0.42em]',
      bars: 'w-3 h-[1.5px]',
      subFa: 'text-[9px]',
      gap: 'gap-1',
      container: 'py-1 px-2'
    },
    md: {
      title: 'text-xl sm:text-2xl tracking-[0.24em]',
      sub: 'text-[10px] sm:text-[11px] tracking-[0.45em]',
      bars: 'w-4 sm:w-6 h-[1.5px]',
      subFa: 'text-[10px]',
      gap: 'gap-1.5',
      container: 'py-1.5 px-3'
    },
    lg: {
      title: 'text-3xl sm:text-4xl tracking-[0.25em]',
      sub: 'text-xs sm:text-sm tracking-[0.48em]',
      bars: 'w-6 sm:w-8 h-[2px]',
      subFa: 'text-xs',
      gap: 'gap-2',
      container: 'py-2 px-4'
    },
    xl: {
      title: 'text-4xl sm:text-5xl md:text-6xl tracking-[0.26em]',
      sub: 'text-sm sm:text-base tracking-[0.5em]',
      bars: 'w-8 sm:w-12 h-[2.5px]',
      subFa: 'text-sm',
      gap: 'gap-2.5',
      container: 'py-3 px-6'
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div 
      className={`inline-flex flex-col items-center justify-center select-none text-center relative ${
        isCard 
          ? 'bg-[#FAF7F2] border border-[#E6DEC8] p-5 rounded-2xl shadow-xs' 
          : currentSize.container
      } ${className}`}
      dir="ltr"
    >
      {/* Decorative Subtle Calligraphic Flourish Underlay */}
      <svg 
        className={`absolute inset-0 w-full h-full pointer-events-none opacity-[0.07] ${
          isLight ? 'text-white' : 'text-stone-900'
        }`}
        viewBox="0 0 200 80" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1"
      >
        <path d="M20,50 Q60,10 100,50 T180,50" />
        <path d="M40,30 Q90,70 140,20" />
      </svg>

      {/* MANOTO Serif Display Title */}
      <div 
        className={`font-serif font-normal leading-none transition-colors relative z-10 ${
          isLight ? 'text-[#FAF7F2]' : 'text-[#18181B]'
        } ${currentSize.title}`}
        style={{ 
          fontFamily: "'Playfair Display', 'Cinzel', 'Didot', 'Bodoni MT', serif",
          fontWeight: 400
        }}
      >
        MANOTO
      </div>

      {/* — D R E S S — with flanking solid horizontal rules */}
      <div className={`flex items-center justify-center ${currentSize.gap} mt-1.5 w-full relative z-10`}>
        <span 
          className={`${currentSize.bars} ${
            isLight ? 'bg-[#FAF7F2]' : 'bg-[#18181B]'
          } rounded-full`} 
        />
        <span 
          className={`font-sans uppercase font-medium leading-none ${
            isLight ? 'text-[#FAF7F2]' : 'text-[#18181B]'
          } ${currentSize.sub}`}
          style={{ letterSpacing: '0.45em' }}
        >
          DRESS
        </span>
        <span 
          className={`${currentSize.bars} ${
            isLight ? 'bg-[#FAF7F2]' : 'bg-[#18181B]'
          } rounded-full`} 
        />
      </div>

      {/* Persian Subtitle (Optional) */}
      {showPersianSub && (
        <div 
          className={`mt-2 font-sans font-bold tracking-normal leading-tight relative z-10 ${
            isLight ? 'text-[#E6DEC8]' : 'text-stone-700'
          } ${currentSize.subFa}`}
          dir="rtl"
        >
          تولید و پخش پوشاک من و تو <span className={isLight ? 'text-amber-200' : 'text-amber-800 font-black'}>(اسدی)</span>
        </div>
      )}
    </div>
  );
};

