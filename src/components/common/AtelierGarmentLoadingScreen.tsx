import React, { useEffect, useState } from 'react';

interface AtelierGarmentLoadingScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const AtelierGarmentLoadingScreen: React.FC<AtelierGarmentLoadingScreenProps> = ({
  onFinish,
  minDurationMs = 1900,
}) => {
  const [progress, setProgress] = useState(12);
  const [stageTextIndex, setStageTextIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Industry-specific craftsman milestones
  const stages = [
    { title: 'برش الگو و چیدمان پارچه کتان و کرپ...', detail: 'کارگاه خیام و بازار بزرگ تهران' },
    { title: 'دوخت صنعتی ۵ لا و کوک ظریف زرین...', detail: 'سوزن‌دوزی و تست کشسانی نخ' },
    { title: 'پک‌بندی جور ۱۲ تایی و کنترل کیفیت نهایی...', detail: 'پاساژ المهدی ۴، پلاک ۲۴۲' },
    { title: 'آماده‌سازی ویترین و کاتالوگ مدل‌های من و تو...', detail: 'پخش مستقیم دست‌اول کارگاه' },
  ];

  useEffect(() => {
    // Step-by-step progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Random incremental tick
        const next = prev + Math.floor(Math.random() * 14) + 8;
        return next > 100 ? 100 : next;
      });
    }, 150);

    // Stage text transitions
    const textInterval = setInterval(() => {
      setStageTextIndex((prev) => (prev + 1) % stages.length);
    }, 480);

    // Fade out and finish callback
    const finishTimeout = setTimeout(() => {
      setIsFadingOut(true);
      const closeTimeout = setTimeout(() => {
        if (onFinish) onFinish();
      }, 500);
      return () => clearTimeout(closeTimeout);
    }, minDurationMs);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearTimeout(finishTimeout);
    };
  }, [minDurationMs, onFinish]);

  return (
    <div
      dir="rtl"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5] text-stone-900 transition-opacity duration-500 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.09) 0%, transparent 60%),
          radial-gradient(ellipse at 85% 85%, rgba(200, 160, 100, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 1px 1px, rgba(40, 35, 30, 0.035) 1px, transparent 0)
        `,
        backgroundSize: '100% 100%, 100% 100%, 24px 24px',
      }}
    >
      {/* Subtle floating textile watermarks in background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center overflow-hidden">
        <span className="font-['Cinzel',serif] text-[18vw] font-black tracking-widest text-[#18181B] rotate-[-12deg] select-none">
          MANOTO
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        
        {/* ========================================================================= */}
        {/* ✂️ ICONIC GARMENT CRAFT HERO (SEWING MACHINE / THREAD / HANGER / SHEARS)   */}
        {/* ========================================================================= */}
        <div className="relative mb-6 flex items-center justify-center">
          
          {/* Pulsing Warm Gold Halo */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-amber-200/40 via-amber-300/30 to-amber-100/10 blur-xl animate-pulse" />

          {/* Measuring Tape Ring Orbit */}
          <div className="absolute w-28 h-28 rounded-full border border-dashed border-[#D4AF37]/40 animate-[spin_16s_linear_infinite]" />
          
          {/* Central Atelier Medallion */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#18181B] via-stone-900 to-[#2A2825] border border-[#D4AF37]/50 shadow-[0_12px_35px_rgba(24,24,27,0.35)] flex items-center justify-center p-3">
            
            {/* Custom SVG Sewing Machine & Golden Stitches */}
            <svg
              viewBox="0 0 64 64"
              className="w-12 h-12 sm:w-14 sm:h-14 text-[#D4AF37]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Base Table of Sewing Machine */}
              <path d="M8 50h48c1.5 0 2-1 2-2s-.5-2-2-2H8c-1.5 0-2 1-2 2s.5 2 2 2z" fill="#D4AF37" fillOpacity="0.15" />
              
              {/* Left Column & Upper Arm */}
              <path d="M14 46V22c0-3 2-5 5-5h24c3 0 5 2 5 5v5" />
              
              {/* Machine Head Arch */}
              <path d="M48 27H36v5h12v-5z" fill="#D4AF37" fillOpacity="0.2" />
              
              {/* Needle Bar & Needle */}
              <path d="M40 32v11" className="animate-bounce" style={{ animationDuration: '0.6s' }} />
              <circle cx="40" cy="44" r="1" fill="#F5E6A3" />
              
              {/* Handwheel on the Left */}
              <circle cx="14" cy="28" r="4" strokeWidth="2" />
              <path d="M14 24v8M10 28h8" />
              
              {/* Spool of Golden Thread on top */}
              <rect x="22" y="11" width="6" height="6" rx="1" fill="#F5E6A3" strokeWidth="1.8" />
              <path d="M25 11V8M23 8h4" />
              
              {/* Flowing golden sewing thread to needle */}
              <path
                d="M28 14c6 0 12 3 12 10v8"
                stroke="#F5E6A3"
                strokeDasharray="2 2"
                className="animate-[pulse_1.2s_ease-in-out_infinite]"
              />

              {/* Fabric being stitched beneath needle */}
              <path
                d="M30 46h20"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeDasharray="3 2"
              />
            </svg>

            {/* Micro Badge: Tailoring Scissors Accent */}
            <div className="absolute -bottom-2 -left-2 w-7 h-7 rounded-xl bg-gradient-to-tr from-[#967434] via-[#D4AF37] to-amber-200 text-[#18181B] flex items-center justify-center shadow-md border border-white/60">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-none stroke-current"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Scissors */}
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </svg>
            </div>

            {/* Micro Badge: Clothes Hanger Accent */}
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-xl bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center shadow-md">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-none stroke-current"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4a2 2 0 0 1 2 2c0 1.5-1.5 2-2 3l-8 7a1 1 0 0 0 .5 1.5h15a1 1 0 0 0 .5-1.5l-8-7" />
              </svg>
            </div>

          </div>
        </div>

        {/* Brand Headline */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-[11px] font-black shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
            <span>تولید و پخش پوشاک زنانه</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center justify-center gap-1.5 pt-1">
            <span>پوشاک من و تو</span>
            <span className="text-[#967434] text-xs sm:text-sm font-light font-['Cinzel',serif] tracking-wider">
              (اسدی)
            </span>
          </h1>

          <p className="text-[11px] text-stone-500 font-medium">
            دست‌اول بازار بزرگ تهران • سرای ملی، پاساژ المهدی ۴
          </p>
        </div>

        {/* Garment Stitch Progress Line */}
        <div className="w-full space-y-2 mb-3">
          <div className="relative w-full h-2 rounded-full bg-[#E8E1D3] overflow-hidden p-0.5 border border-[#DDD5C4]">
            
            {/* Running Stitch Texture inside the bar */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#967434] via-[#D4AF37] to-amber-400 transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Needle Glow Head */}
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-xs border border-[#967434]" />
            </div>
          </div>

          {/* Real-time Percentage & Needle Movement */}
          <div className="flex items-center justify-between text-[10px] text-stone-600 font-bold px-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>آماده‌سازی تنخور و مدل‌ها</span>
            </span>
            <span className="font-mono text-stone-900 font-black">
              {progress}٪
            </span>
          </div>
        </div>

        {/* Dynamic Atelier Step Caption */}
        <div className="min-h-[42px] flex flex-col items-center justify-center">
          <p className="text-xs font-bold text-stone-800 transition-all duration-300 animate-in fade-in">
            {stages[stageTextIndex].title}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            {stages[stageTextIndex].detail}
          </p>
        </div>

        {/* Footer Guarantee Micro-Pill */}
        <div className="mt-5 flex items-center justify-center gap-3 text-[10px] text-stone-600 border-t border-[#EAE4D9] pt-3 w-full">
          <span className="flex items-center gap-1">
            <span className="text-[#D4AF37]">✦</span>
            <span>دوخت تمیز ۵ لا</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="text-[#D4AF37]">✦</span>
            <span>کش‌دوزی استاندارد</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="text-[#D4AF37]">✦</span>
            <span>تضمین آبرفت</span>
          </span>
        </div>

      </div>
    </div>
  );
};
