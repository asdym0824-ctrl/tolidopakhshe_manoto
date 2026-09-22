import React from 'react';
import { 
  Sparkles, 
  Ruler, 
  Shirt, 
  Scissors, 
  Layers, 
  HeartHandshake, 
  CheckCircle2, 
  Camera, 
  Eye, 
  ShieldCheck,
  Flame,
  ArrowDown
} from 'lucide-react';

interface WomenFashionHighlightsBarProps {
  onOpenSizeGuide: () => void;
  onOpenFabricCare: () => void;
  onScrollToCatalog: () => void;
}

export const WomenFashionHighlightsBar: React.FC<WomenFashionHighlightsBarProps> = ({
  onOpenSizeGuide,
  onOpenFabricCare,
  onScrollToCatalog,
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border-y border-[#EAE4D9] py-3.5 px-3 sm:px-6 shadow-2xs select-none" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left Side: Women's Fashion Craft Tagline */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4 text-rose-600 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="text-right truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-stone-900">
                طراحی، الگوسازی و دوخت اختصاصی پوشاک زنانه
              </span>
              <span className="hidden sm:inline-block bg-rose-100 text-rose-900 text-[9px] font-black px-2 py-0.5 rounded-full border border-rose-200">
                مدل‌های زنانه ۱۴۰۳
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 truncate mt-0.5">
              تنخور آزاد و ژورنالی، بدون کشیدگی فاق، بافت کشسانی ۴ جهته و قواره خوش‌پوش بانوان
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Quick Help Buttons (Size Guide, Fabric Care, Catalog) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-0.5 no-scrollbar shrink-0">
          {/* 1. Size Guide Trigger */}
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="py-1.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-stone-800 hover:text-rose-900 border border-[#EAE4D9] hover:border-rose-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5 text-rose-600" />
            <span>جدول سایزبندی بانوان</span>
          </button>

          {/* 2. Fabric Care Guide Trigger */}
          <button
            type="button"
            onClick={onOpenFabricCare}
            className="py-1.5 px-3 rounded-xl bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 border border-[#EAE4D9] hover:border-amber-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>شناسنامه پارچه و شستشو</span>
          </button>

          {/* 3. Fast View Outfits */}
          <button
            type="button"
            onClick={onScrollToCatalog}
            className="py-1.5 px-3 rounded-xl bg-[#18181B] hover:bg-black text-[#D4AF37] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>ویترین تنخور</span>
          </button>
        </div>

      </div>
    </div>
  );
};
