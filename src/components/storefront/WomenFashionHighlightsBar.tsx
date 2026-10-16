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
                کالکشن جدید زنانه ۱۴۰۴
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 truncate mt-0.5">
              تن‌خور آزاد و ژورنالی، بدون کشیدگی فاق، بافت کشسانی ۴ جهته و قوارهٔ خوش‌پوش بانوان
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Quick Help Buttons (Size Guide, Fabric Care, Catalog) & Mobile Auto-Moving Marquee */}
        <div className="relative w-full md:w-auto overflow-hidden md:overflow-visible shrink-0 touch-pan-y">
          
          {/* Subtle lateral gradient edge masks for mobile marquee strip */}
          <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-10" />
          <div className="md:hidden pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-10" />

          {/* 📱 Mobile Continuous Auto-Moving Ticker Strip (نوار پیوسته و پشت‌سرهم با سرعت آرام و بدون وقفه) */}
          <div className="md:hidden overflow-hidden py-1 w-full touch-pan-y" dir="ltr">
            <div className="flex w-max shrink-0 items-center touch-pan-y">
              {/* Set 1: First continuous ribbon */}
              <div className="animate-marquee-continuous flex items-center gap-2 shrink-0 pr-2 touch-pan-y" dir="rtl">
                {/* 1. Size Guide Trigger */}
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-rose-50 text-stone-800 hover:text-rose-900 border border-[#EAE4D9] hover:border-rose-300 text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>جدول سایزبندی بانوان</span>
                </button>

                {/* 2. Fabric Care Guide Trigger */}
                <button
                  type="button"
                  onClick={onOpenFabricCare}
                  className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 border border-[#EAE4D9] hover:border-amber-300 text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>شناسنامهٔ پارچه و شست‌وشو</span>
                </button>

                {/* 3. Fast View Outfits */}
                <button
                  type="button"
                  onClick={onScrollToCatalog}
                  className="py-1.5 px-2.5 rounded-xl bg-[#18181B] hover:bg-black text-[#D4AF37] text-[11px] font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Shirt className="w-3.5 h-3.5 shrink-0" />
                  <span>ویترین تن‌خور</span>
                </button>

                {/* 4. Atelier Sewing Guarantee Badge */}
                <div className="py-1.5 px-2.5 rounded-xl bg-emerald-50/90 text-emerald-900 border border-emerald-200/80 text-[11px] font-bold flex items-center gap-1.5 shrink-0 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ضمانت دوخت تمیز بازار</span>
                </div>

                {/* 5. Pattern & Cut Badge */}
                <div className="py-1.5 px-2.5 rounded-xl bg-purple-50/90 text-purple-900 border border-purple-200/80 text-[11px] font-bold flex items-center gap-1.5 shrink-0 shadow-2xs">
                  <Scissors className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>الگوسازی خوش‌پوش بانوان</span>
                </div>

                {/* 6. Shipping & Waybill Badge */}
                <div className="py-1.5 px-2.5 rounded-xl bg-sky-50/90 text-sky-900 border border-sky-200/80 text-[11px] font-bold flex items-center gap-1.5 shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>ارسال بیجک و باربری ۲۴ ساعته</span>
                </div>
              </div>

              {/* Set 2: Exact duplicate running immediately back-to-back with zero gap (کاملاً پشت‌سرهم) */}
              <div className="animate-marquee-continuous flex items-center gap-2 shrink-0 pr-2 touch-pan-y" dir="rtl" aria-hidden="true">
                {/* 1. Size Guide Trigger */}
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-rose-50 text-stone-800 hover:text-rose-900 border border-[#EAE4D9] hover:border-rose-300 text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>جدول سایزبندی بانوان</span>
                </button>

                {/* 2. Fabric Care Guide Trigger */}
                <button
                  type="button"
                  onClick={onOpenFabricCare}
                  className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 border border-[#EAE4D9] hover:border-amber-300 text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>شناسنامهٔ پارچه و شست‌وشو</span>
                </button>

                {/* 3. Fast View Outfits */}
                <button
                  type="button"
                  onClick={onScrollToCatalog}
                  className="py-1.5 px-2.5 rounded-xl bg-[#18181B] hover:bg-black text-[#D4AF37] text-[11px] font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Shirt className="w-3.5 h-3.5 shrink-0" />
                  <span>ویترین تن‌خور</span>
                </button>

                {/* 4. Atelier Sewing Guarantee Badge */}
                <div className="py-1.5 px-2.5 rounded-xl bg-emerald-50/90 text-emerald-900 border border-emerald-200/80 text-[11px] font-bold flex items-center gap-1.5 shrink-0 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ضمانت دوخت تمیز بازار</span>
                </div>

                {/* 5. Pattern & Cut Badge */}
                <div className="py-1.5 px-2.5 rounded-xl bg-purple-50/90 text-purple-900 border border-purple-200/80 text-[11px] font-bold flex items-center gap-1.5 shrink-0 shadow-2xs">
                  <Scissors className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>الگوسازی خوش‌پوش بانوان</span>
                </div>

                {/* 6. Shipping & Waybill Badge */}
                <div className="py-1.5 px-2.5 rounded-xl bg-sky-50/90 text-sky-900 border border-sky-200/80 text-[11px] font-bold flex items-center gap-1.5 shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>ارسال بیجک و باربری ۲۴ ساعته</span>
                </div>
              </div>
            </div>
          </div>

          {/* 💻 Desktop View: Clean Static Non-Moving Buttons (بدون حرکت خودکار در دسکتاپ) */}
          <div className="hidden md:flex items-center gap-2 justify-end shrink-0" dir="rtl">
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
              <span>شناسنامهٔ پارچه و شست‌وشو</span>
            </button>

            {/* 3. Fast View Outfits */}
            <button
              type="button"
              onClick={onScrollToCatalog}
              className="py-1.5 px-3 rounded-xl bg-[#18181B] hover:bg-black text-[#D4AF37] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>ویترین تن‌خور</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
