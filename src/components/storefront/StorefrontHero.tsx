import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Send, 
  Phone, 
  MapPin, 
  ArrowDown, 
  ShieldCheck, 
  Sparkles, 
  Navigation,
  Film,
  Calculator,
  Flame,
  Clock,
  Truck,
  CheckCircle2,
  CreditCard,
  Percent,
  FileText,
  Ruler,
  Layers,
  Shirt,
  Scissors,
  Eye,
  ChevronLeft,
  ChevronRight,
  Crown
} from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';
import { BRAND_INFO } from '../../data/brandInfo';
import { DigikalaMobileBannerSlider } from './DigikalaMobileBannerSlider';
import maisonApparelBg from '../../assets/images/maison_apparel_bg_1789900843633.jpg';
import maisonModelPose from '../../assets/images/maison_model_pose_1789900856562.jpg';
import maisonBannerTwo from '../../assets/images/maison_banner_two_1789901578921.jpg';
import maisonBannerThree from '../../assets/images/maison_banner_three_1789901596428.jpg';
import maisonBannerFour from '../../assets/images/maison_banner_four_1789901608143.jpg';

interface FashionShowcaseSlide {
  id: string;
  image: string;
  badge: string;
  tag: string;
  fabric: string;
  title: string;
  subtitle: string;
  highlight: string;
}

const MAISON_SHOWCASE_SLIDES: FashionShowcaseSlide[] = [
  {
    id: 'slide-1',
    image: maisonModelPose,
    badge: 'کالکشن جدید ۱۴۰۵ • ژورنال اختصاصی',
    tag: 'دوخت ۵ لا کارگاهی',
    fabric: 'کتان لایت ترک • کرپ مازراتی',
    title: 'استایل شیک و ژورنالی با اصالت بازار تهران',
    subtitle: 'تنخور بی‌نظیر انواع شلوار بگ و نیم‌بگ',
    highlight: 'تنخور فوق‌العاده'
  },
  {
    id: 'slide-2',
    image: maisonBannerTwo,
    badge: 'ترند روز بازار • قواره آزاد و استاندارد',
    tag: 'تضمین عدم رنگ‌رفت',
    fabric: 'لینن اسلپ طبیعی • تنسل تایوانی',
    title: 'ست کت و شلوار بگ زنانه با دوخت صنعتی',
    subtitle: 'تامین دست‌اول فروشگاه‌ها و آنلاین‌شاپ‌های کشور',
    highlight: 'پرفروش‌ترین راسته'
  },
  {
    id: 'slide-3',
    image: maisonBannerThree,
    badge: 'کالکشن جدید کارگو و شلوار مام‌استایل',
    tag: 'سنگ‌شور آنزیمی صنعتی',
    fabric: 'کتان پنبه بنگالین درجه یک',
    title: 'شلوارهای کارگو جیب‌دار شیک و اسپرت',
    subtitle: 'دوخت محکم، سایزبندی دقیق استاندارد زنانه',
    highlight: 'ضمانت دوخت'
  },
  {
    id: 'slide-4',
    image: maisonBannerFour,
    badge: 'نیوکالکشن پاییزه و ۴ فصل من و تو',
    tag: 'پک جور ۴ تا ۱۲ تایی',
    fabric: 'جین کشی سنگ‌شور • داکرون سوپر',
    title: 'شلوار بوت‌کات چاکدار و مانتو ست کژوال',
    subtitle: 'خرید مستقیم با قیمت کف تولیدی و تک‌فروشی آنلاین',
    highlight: 'قیمت کف بازار'
  }
];

import { SiteSettings } from '../../types';

interface StorefrontHeroProps {
  onScrollToCatalog: () => void;
  onFilterRetailOnly: () => void;
  onFilterWholesalePacks: () => void;
  onOpenRoutingModal?: () => void;
  onOpenAboutModal?: (tab?: 'about' | 'map' | 'contact' | 'terms') => void;
  onOpenTracking?: () => void;
  totalProductsCount: number;
  onOpenSizeGuide?: () => void;
  onOpenFabricCare?: () => void;
  siteSettings?: SiteSettings;
}

export const StorefrontHero: React.FC<StorefrontHeroProps> = ({
  onScrollToCatalog,
  onFilterRetailOnly,
  onFilterWholesalePacks,
  onOpenRoutingModal,
  onOpenAboutModal,
  onOpenTracking,
  totalProductsCount,
  onOpenSizeGuide,
  onOpenFabricCare,
  siteSettings,
}) => {
  // 🔄 Automatic multi-banner rotation state (cycles smoothly every 5.5 seconds like Digikala)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % MAISON_SHOWCASE_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + MAISON_SHOWCASE_SLIDES.length) % MAISON_SHOWCASE_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const activeSlide = MAISON_SHOWCASE_SLIDES[currentSlideIndex];

  return (
    <div className="relative bg-[#FAF8F5] border-b border-[#EAE4D9] overflow-hidden" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 👗 ATMOSPHERIC MAISON & FASHION BOUTIQUE BACKGROUND                       */}
      {/* Authentic atelier interior featuring fashion model in boutique clothing   */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Full-width editorial apparel background photo */}
        <img
          src={maisonApparelBg}
          alt="تولید و پخش پوشاک من و تو"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_32%] filter brightness-[0.98] contrast-[1.02] transform scale-102"
        />

        {/* Sophisticated dual-layer scrims ensuring 100% WCAG contrast for Persian typography */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#FAF8F5]/96 via-[#FAF8F5]/88 to-[#FAF8F5]/75 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/80 via-transparent to-[#FAF8F5]" />
        
        {/* Gentle warm ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#EAD49B]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/5 w-80 h-80 bg-[#B8D5C4]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#E5D5BA]/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE SPECIALIZED HERO VIEW (< md screens) - DIGIKALA STYLE           */}
      {/* Tailored for phone shoppers: animated slider, circular icons, zero clutter*/}
      {/* ========================================================================= */}
      <div className="block md:hidden px-3 pt-3 pb-4 space-y-3 relative z-10 w-full">
        
        {/* Top Production & Brand Trust Badge */}
        <div className="flex items-center justify-between bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#EAE4D9] shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="text-right truncate">
              <span className="text-[11px] font-black text-[#141416] block leading-tight">
                تولید و پخش پوشاک من و تو
                <span className="block text-[9.5px] font-bold text-stone-600">
                  (مدیریت اسدی)
                </span>
              </span>
              <span className="text-[9px] text-[#967434] font-bold block truncate">
                بازار بزرگ تهران • پاساژ المهدی ۴، پ ۲۴۲
              </span>
            </div>
          </div>

          <a
            href={`tel:${BRAND_INFO.primaryPhone}`}
            className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#967434] border border-[#D4AF37]/40 shadow-xs flex items-center justify-center shrink-0 active:scale-95 transition-all"
            title="تماس فوری با دفتر بازار"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 🎬 DIGIKALA-STYLE ANIMATED PROMO BANNER SLIDER (فقط برای موبایل) */}
        <DigikalaMobileBannerSlider
          onFilterWholesalePacks={onFilterWholesalePacks}
          onFilterRetailOnly={onFilterRetailOnly}
          onScrollToCatalog={onScrollToCatalog}
          onOpenAboutModal={onOpenAboutModal}
          onOpenTracking={onOpenTracking}
          customBanners={siteSettings?.midGridBanners}
        />

        {/* 🔘 DIGIKALA-STYLE CIRCULAR QUICK SERVICE ICONS (دایره‌های خدمات سریع دیجی‌کالا) */}
        <div className="grid grid-cols-4 gap-2 pt-1 pb-0.5">
          {/* 1. Hot Deals / Incredible Offer */}
          <button
            type="button"
            onClick={onScrollToCatalog}
            className="flex flex-col items-center justify-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/25 group-hover:scale-105 transition-transform mb-1 border border-white/20">
              <Flame className="w-6 h-6 animate-bounce" />
            </div>
            <span className="text-[10px] font-black text-stone-800 leading-tight text-center">
              شگفت‌انگیز
            </span>
          </button>

          {/* 2. Wholesale Packs */}
          <button
            type="button"
            onClick={onFilterWholesalePacks}
            className="flex flex-col items-center justify-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#18181B] to-stone-700 text-[#D4AF37] flex items-center justify-center shadow-md shadow-stone-900/20 group-hover:scale-105 transition-transform mb-1 border border-amber-400/25">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-stone-800 leading-tight text-center">
              پک‌های عمده
            </span>
          </button>

          {/* 3. Retail Shopping */}
          <button
            type="button"
            onClick={onFilterRetailOnly}
            className="flex flex-col items-center justify-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform mb-1 border border-white/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-stone-800 leading-tight text-center">
              تک‌فروشی
            </span>
          </button>

          {/* 4. Cheque / Terms */}
          <button
            type="button"
            onClick={() => onOpenAboutModal ? onOpenAboutModal('terms') : onScrollToCatalog()}
            className="flex flex-col items-center justify-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform mb-1 border border-white/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-stone-800 leading-tight text-center">
              چک صیادی
            </span>
          </button>
        </div>

        {/* Second Row of Circular Icons (Digikala Style 8 Services) */}
        <div className="grid grid-cols-4 gap-2 pt-0.5 pb-1">
          {/* 5. Tracking Bijak */}
          <button
            type="button"
            onClick={onOpenTracking || onScrollToCatalog}
            className="flex flex-col items-center justify-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform mb-1 border border-white/20">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-[9.5px] font-bold text-stone-700 leading-tight text-center">
              پیگیری بار
            </span>
          </button>

          {/* 6. Bazaar Map */}
          {onOpenRoutingModal && (
            <button
              type="button"
              onClick={onOpenRoutingModal}
              className="flex flex-col items-center justify-center group active:scale-95 transition-transform"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-[#141416] flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform mb-1 border border-white/20">
                <MapPin className="w-5 h-5 font-black" />
              </div>
              <span className="text-[9.5px] font-bold text-stone-700 leading-tight text-center">
                نقشه بازار
              </span>
            </button>
          )}

          {/* 7. Catalog models count */}
          <button
            type="button"
            onClick={onScrollToCatalog}
            className="flex flex-col items-center justify-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform mb-1 border border-white/20">
              <span className="text-xs font-black font-mono text-white drop-shadow-xs">{totalProductsCount}+</span>
            </div>
            <span className="text-[9.5px] font-bold text-stone-700 leading-tight text-center">
              همه مدل‌ها
            </span>
          </button>

          {/* 8. Direct Consultation */}
          <a
            href={`tel:${BRAND_INFO.primaryPhone}`}
            className="flex flex-col items-center justify-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform mb-1 border border-white/20">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[9.5px] font-bold text-stone-700 leading-tight text-center">
              تماس فوری
            </span>
          </a>
        </div>

        {/* Mobile Fast Mode Switcher: Wholesale Pack vs Retail Single */}
        <div className="bg-white p-1 rounded-2xl border border-[#EAE4D9] shadow-xs flex items-center gap-1 text-xs font-black">
          <button
            type="button"
            onClick={onFilterWholesalePacks}
            className="flex-1 py-2 px-2 rounded-xl bg-[#141416] text-[#FAF8F5] shadow-xs flex flex-col items-center justify-center leading-tight transition-transform active:scale-98"
          >
            <div className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>خرید عمده (پک بازار)</span>
            </div>
            <span className="text-[9px] text-[#D4AF37] font-medium mt-0.5">
              پک ۴، ۶ و ۱۲ تایی جور
            </span>
          </button>

          <button
            type="button"
            onClick={onFilterRetailOnly}
            className="flex-1 py-2 px-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#967434] border border-[#EAE4D9] flex flex-col items-center justify-center leading-tight transition-transform active:scale-98"
          >
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-[#967434]" />
              <span>تک‌فروشی آنلاین</span>
            </div>
            <span className="text-[9px] text-stone-500 font-medium mt-0.5">
              انتخاب رنگ و سایز دلخواه
            </span>
          </button>
        </div>

        {/* Value Guarantees Strip for Mobile (Digikala Trust Seals) */}
        <div className="flex items-center justify-around bg-white/90 border border-[#EAE4D9] px-2.5 py-2 rounded-2xl text-[9.5px] font-bold text-stone-700 shadow-2xs">
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#967434]" />
            <span>ارسال ۲۴ ساعته</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>چک صیادی بنفش</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#967434]" />
            <span>کف قیمت بازار</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP & TABLET LUXURY HERO VIEW (md: and above)                        */}
      {/* High-fashion Maison Atelier Showcase Layout with Fashion Model Card        */}
      {/* ========================================================================= */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 pt-7 pb-12 sm:pb-16 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-center">

          {/* Right Column (7 cols): Editorial Typography, Brand & Actions */}
          <div className="col-span-12 lg:col-span-7 space-y-5 text-right">
            
            {/* Atelier & Wholesale Identity Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-[#EAE4D9] px-4 py-1.5 rounded-full shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-xs font-black text-stone-900">
                کارگاه تولیدی و پخش عمده پوشاک زنانه «من و تو» (اسدی)
              </span>
              <span className="text-[10px] bg-[#141416] text-[#D4AF37] font-bold px-2 py-0.5 rounded-full tracking-wide">
                بازار بزرگ تهران
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#141416] leading-[1.25] tracking-tight">
                {siteSettings?.heroHeadline ? (
                  <span>{siteSettings.heroHeadline}</span>
                ) : (
                  <>
                    تولید و پخش پوشاک <span className="text-[#967434]">من و تو</span>
                  </>
                )}
                <span className="block text-xl sm:text-2xl lg:text-[26px] font-bold text-stone-700 mt-1 sm:mt-1.5">
                  {siteSettings?.brandSubtitle || '(مدیریت اسدی)'}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal max-w-xl">
                {siteSettings?.heroSubheadline || 'تولیدکننده تخصصی انواع شلوار زنانه (بگ، نیم‌بگ، راسته، جاگر، دمپا)، شومیز، مانتو و ست‌های راحتی با کیفیت برتر و ارسال مستقیم از بازار بزرگ تهران.'}
              </p>
            </div>

            {/* Address & Metro Fast Routing Button */}
            <div>
              {onOpenRoutingModal ? (
                <button
                  type="button"
                  onClick={onOpenRoutingModal}
                  className="text-xs text-stone-700 bg-white/90 hover:bg-white border border-[#EAE4D9] hover:border-[#D4AF37] px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 font-bold transition-all shadow-2xs group cursor-pointer"
                  title="کلیک برای مشاهده نقشه و لوکیشن در بازار بزرگ"
                >
                  <MapPin className="w-4 h-4 text-[#967434] group-hover:scale-110 transition-transform" />
                  <span>{siteSettings?.mainAddress || BRAND_INFO.mainAddressFa}</span>
                  <span className="bg-[#141416] text-[#D4AF37] text-[10px] font-black px-2 py-0.5 rounded-full">
                    {siteSettings?.subwayAddress ? 'مسیریابی مترو' : 'مسیریابی مترو خیام'}
                  </span>
                </button>
              ) : (
                <div className="text-xs text-stone-700 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#967434]" />
                  <span>{siteSettings?.mainAddress || BRAND_INFO.mainAddressFa}</span>
                </div>
              )}
            </div>

            {/* Fast Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="bg-white/90 hover:bg-stone-50 border border-[#EAE4D9] hover:border-[#141416] px-3.5 py-1.5 rounded-full text-stone-800 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>پرفروش‌های راسته</span>
              </button>

              <button
                type="button"
                onClick={onFilterRetailOnly}
                className="bg-white/90 hover:bg-amber-50 border border-[#EAE4D9] hover:border-[#967434] px-3.5 py-1.5 rounded-full text-[#967434] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>خرید تکی آنلاین</span>
              </button>

              {onOpenSizeGuide && (
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="bg-rose-50/90 hover:bg-rose-100 border border-rose-200 text-rose-900 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Ruler className="w-3.5 h-3.5 text-rose-700" />
                  <span>راهنمای سایزبندی استاندارد</span>
                </button>
              )}

              {onOpenFabricCare && (
                <button
                  type="button"
                  onClick={onOpenFabricCare}
                  className="bg-amber-50/90 hover:bg-amber-100 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Layers className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>شناسنامه پارچه‌ها</span>
                </button>
              )}

              <a
                href={`tel:${BRAND_INFO.primaryPhone}`}
                className="bg-white/90 hover:bg-stone-50 border border-[#EAE4D9] px-3.5 py-1.5 rounded-full text-stone-800 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#967434]" />
                <span>دفتر فروش: {BRAND_INFO.primaryPhoneDisplay}</span>
              </a>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                id="btn-hero-view-catalog"
                onClick={onScrollToCatalog}
                className="py-3.5 px-7 bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2] rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer ring-2 ring-[#D4AF37]/30 hover:ring-[#D4AF37]/60"
              >
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <span>مشاهده کاتالوگ جامع و تمام اجناس</span>
                <span className="bg-[#D4AF37] text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {totalProductsCount} مدل
                </span>
              </button>

              <button
                type="button"
                id="btn-hero-retail-only"
                onClick={onFilterRetailOnly}
                className="py-3.5 px-6 bg-white hover:bg-[#FAF8F5] text-stone-900 border border-[#EAE4D9] hover:border-stone-400 rounded-2xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#8C6D37]" />
                <span>مدل‌های تک‌فروشی آنلاین</span>
              </button>
            </div>

            {/* Key Value Props Grid */}
            <div className="grid grid-cols-4 gap-2.5 pt-2 text-xs">
              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-[#EAE4D9] shadow-xs">
                <span className="font-black text-[#141416] text-base block">
                  {totalProductsCount}+ مدل
                </span>
                <span className="text-[10px] text-stone-500">شلوار، شومیز، ست</span>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-[#EAE4D9] shadow-xs">
                <span className="font-black text-[#967434] text-base block">
                  پک ۴ تا ۱۲ تایی
                </span>
                <span className="text-[10px] text-stone-500">قیمت کف تولیدی</span>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-[#EAE4D9] shadow-xs">
                <span className="font-black text-[#141416] text-base block">
                  تک‌فروشی
                </span>
                <span className="text-[10px] text-stone-500">ارسال پستی به خانه</span>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-[#EAE4D9] shadow-xs">
                <span className="font-black text-emerald-800 text-base block">
                  چک صیادی
                </span>
                <span className="text-[10px] text-stone-500">خرید اعتباری همکار</span>
              </div>
            </div>

          </div>

          {/* Left Column (5 cols): Haute Couture Maison Animated Multi-Banner Showcase */}
          <div className="col-span-12 lg:col-span-5 flex justify-center lg:justify-end">
            <div 
              className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-[0_20px_45px_rgba(24,24,27,0.14)] bg-stone-900 group select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              
              {/* Stacked Rotating Banner Images with Cross-fade */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                {MAISON_SHOWCASE_SLIDES.map((slide, index) => {
                  const isCurrent = index === currentSlideIndex;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        isCurrent ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 pointer-events-none scale-105'
                      }`}
                      style={{ transitionProperty: 'opacity, transform' }}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top filter brightness-[0.97]"
                      />
                    </div>
                  );
                })}
                
                {/* Atmospheric Vignette Overlays */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#141416] via-[#141416]/25 to-transparent pointer-events-none" />
                <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#141416]/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Top Badge: Dynamic Banner Edition */}
                <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-[#D4AF37]/60 text-[#D4AF37] px-3 py-1 rounded-full text-[11px] font-black shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{activeSlide.badge}</span>
                </div>

                {/* Left Floating Chip: Quality Tag */}
                <div className="absolute top-3.5 left-3.5 z-30 bg-white/90 backdrop-blur-md text-stone-900 px-2.5 py-1 rounded-full text-[10px] font-black shadow-xs flex items-center gap-1">
                  <Scissors className="w-3 h-3 text-[#967434]" />
                  <span>{activeSlide.tag}</span>
                </div>

                {/* Left/Right Carousel Controls (appear on hover or visible) */}
                <div className="absolute inset-y-0 inset-x-2 z-30 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/85 text-white/90 hover:text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all cursor-pointer pointer-events-auto active:scale-90"
                    title="بنر قبلی"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/85 text-white/90 hover:text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all cursor-pointer pointer-events-auto active:scale-90"
                    title="بنر بعدی"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Model & Banner Details Overlay */}
                <div className="absolute bottom-0 inset-x-0 z-30 p-4 space-y-2 text-right">
                  
                  {/* Slide Indicators Dots with Progress Fill */}
                  <div className="flex items-center justify-center gap-1.5 pb-1">
                    {MAISON_SHOWCASE_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === currentSlideIndex 
                            ? 'w-7 bg-[#D4AF37]' 
                            : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        title={`بنر شماره ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="bg-[#D4AF37] text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {activeSlide.highlight}
                    </span>
                    <span className="text-[11px] text-stone-200 font-bold">
                      {activeSlide.fabric}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white leading-snug">
                    {activeSlide.title}
                  </h3>

                  <p className="text-[11px] text-stone-300 line-clamp-1">
                    {activeSlide.subtitle}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/15 text-xs text-stone-300">
                    <span className="text-[11px] font-medium text-amber-200/90">
                      پوشاک من و تو (اسدی) • بنر {currentSlideIndex + 1} از {MAISON_SHOWCASE_SLIDES.length}
                    </span>
                    <button
                      type="button"
                      onClick={onScrollToCatalog}
                      className="inline-flex items-center gap-1 text-[#D4AF37] hover:text-white font-black text-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>مشاهده در کاتالوگ</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

