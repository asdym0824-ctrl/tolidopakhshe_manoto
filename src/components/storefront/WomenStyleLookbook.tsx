import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Play, 
  Pause, 
  Flame, 
  ShoppingBag, 
  Award, 
  ArrowLeft,
  CheckCircle2,
  Compass,
  Layers,
  Tag
} from 'lucide-react';
import { Product } from '../../types';

interface WomenStyleLookbookProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onFilterCategory: (category: string) => void;
}

interface BannerItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  badgeType: 'fire' | 'gold' | 'emerald' | 'blue' | 'purple' | 'amber';
  shortFeature: string;
  ctaText: string;
  bgGradient: string;
  accentBorder: string;
  accentTextColor: string;
  image: string;
  matchingSku: string;
}

export const WomenStyleLookbook: React.FC<WomenStyleLookbookProps> = ({
  products,
  onOpenProduct,
  onFilterCategory,
}) => {
  // 8 Curated Fashion Style Banners organized into 2 distinct 4-banner packs (4 تا 4 تا)
  const allBanners: BannerItem[] = [
    // Pack 1: پرفروش‌ترین استایل‌های روزمره و خیابانی
    {
      id: 'banner-baggy',
      title: 'شلوار بگ ترند خیابانی',
      category: 'شلوار بگ',
      badge: 'پرفروش‌ترین ترند سال',
      badgeType: 'gold',
      shortFeature: 'تنخور آزاد و خوش‌ایست استاندار',
      ctaText: 'مدل‌های بگ',
      bgGradient: 'from-black/90 via-[#261E16]/80 to-transparent',
      accentBorder: 'border-amber-400/40 hover:border-amber-400',
      accentTextColor: 'text-amber-300',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      matchingSku: 'SH-BGR-101',
    },
    {
      id: 'banner-cotton-relax',
      title: 'راحتی ۱۰۰٪ نخ پنبه',
      category: 'شلوار راحتی نخی',
      badge: 'فوق‌العاده خنک و لطیف',
      badgeType: 'emerald',
      shortFeature: 'الیاف طبیعی بدون آبرفت',
      ctaText: 'شلوار راحتی',
      bgGradient: 'from-black/90 via-[#0E2319]/80 to-transparent',
      accentBorder: 'border-emerald-400/40 hover:border-emerald-400',
      accentTextColor: 'text-emerald-300',
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80',
      matchingSku: 'SH-RHT-204',
    },
    {
      id: 'banner-dacron-office',
      title: 'اداری و پرسنلی داکرون',
      category: 'داکرون اداری/اسپرت',
      badge: 'ایستایی رسمی بدون چروک',
      badgeType: 'blue',
      shortFeature: 'خط اتوی مقاوم با دوام بالا',
      ctaText: 'مدل‌های اداری',
      bgGradient: 'from-black/90 via-[#121F33]/80 to-transparent',
      accentBorder: 'border-sky-400/40 hover:border-sky-400',
      accentTextColor: 'text-sky-300',
      image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=800&auto=format&fit=crop&q=80',
      matchingSku: 'SH-DKR-305',
    },
    {
      id: 'banner-jogger-sport',
      title: 'جاگر و اسلش اسپرت',
      category: 'جاگر',
      badge: 'دمپا کش و تحرک راحت',
      badgeType: 'fire',
      shortFeature: 'پارچه دورس با کشسانی ۴ جهته',
      ctaText: 'جاگر اسپرت',
      bgGradient: 'from-black/90 via-[#2D121B]/80 to-transparent',
      accentBorder: 'border-rose-400/40 hover:border-rose-400',
      accentTextColor: 'text-rose-300',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      matchingSku: 'SH-JGR-412',
    },

    // Pack 2: کالکشن راسته، عمده و کلاسیک
    {
      id: 'banner-straight-classic',
      title: 'راسته کلاسیک مجلسی',
      category: 'شلوار راسته',
      badge: 'قدبلندتر نشان‌دادن اندام',
      badgeType: 'purple',
      shortFeature: 'پارچه کرپ مازراتی اعلا',
      ctaText: 'شلوار راسته',
      bgGradient: 'from-black/90 via-[#24132E]/80 to-transparent',
      accentBorder: 'border-purple-400/40 hover:border-purple-400',
      accentTextColor: 'text-purple-300',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
      matchingSku: 'SH-RST-518',
    },
    {
      id: 'banner-dacron-casual',
      title: 'داکرون کژوال مانتویی',
      category: 'داکرون اداری/اسپرت',
      badge: 'سبک و چهارفصل',
      badgeType: 'gold',
      shortFeature: 'ست‌پذیری بالا با انواع مانتو',
      ctaText: 'داکرون کژوال',
      bgGradient: 'from-black/90 via-[#2E2413]/80 to-transparent',
      accentBorder: 'border-amber-400/40 hover:border-amber-400',
      accentTextColor: 'text-amber-300',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
      matchingSku: 'SH-DKR-305',
    },
    {
      id: 'banner-wholesale-bundles',
      title: 'پک‌های بنکداری و عمده',
      category: 'همه دسته‌ها',
      badge: 'تخفیف پلکانی جین و کارتن',
      badgeType: 'emerald',
      shortFeature: 'ارزان‌ترین نرخ بازار بزرگ تهران',
      ctaText: 'لیست عمده',
      bgGradient: 'from-black/90 via-[#0A261C]/80 to-transparent',
      accentBorder: 'border-emerald-400/40 hover:border-emerald-400',
      accentTextColor: 'text-emerald-300',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
      matchingSku: 'SH-BGR-101',
    },
    {
      id: 'banner-mom-fit',
      title: 'مام‌استایل و فاق‌بلند',
      category: 'شلوار راسته',
      badge: 'برش شیک و مدرن',
      badgeType: 'blue',
      shortFeature: 'دوخت محکم چهارسوزنه و باکیفیت',
      ctaText: 'مدل‌های مام',
      bgGradient: 'from-black/90 via-[#102330]/80 to-transparent',
      accentBorder: 'border-sky-400/40 hover:border-sky-400',
      accentTextColor: 'text-sky-300',
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
      matchingSku: 'SH-RST-518',
    },
  ];

  // Group into pages of 4 banners each (4 تا 4 تا)
  const pageSize = 4;
  const totalPages = Math.ceil(allBanners.length / pageSize);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Next page (4 banners)
  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  // Prev page (4 banners)
  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Autoplay rotation every 5.5 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      nextPage();
    }, 5500);
    return () => clearInterval(timer);
  }, [isAutoPlay, nextPage]);

  const toPersianNum = (num: number) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/[0-9]/g, (w) => persianDigits[+w]);
  };

  // Slice current 4 banners
  const currentBanners = allBanners.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div 
      id="women-style-lookbook-banner-container"
      className="bg-white rounded-2xl sm:rounded-3xl border border-[#EAE4D9] p-3 sm:p-4 shadow-2xs space-y-3 select-none" 
      dir="rtl"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Compact Digikala-Style Header: Banner Group Selector */}
      <div className="flex items-center justify-between gap-2 border-b border-[#EAE4D9]/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-2xs border border-amber-400/20">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-stone-900 text-sm sm:text-base">
                بنرهای منتخب استایل و کالکشن
              </h3>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-300/60 hidden xs:inline">
                ۴ تایی دیجی‌استایل
              </span>
            </div>
          </div>
        </div>

        {/* 4-by-4 Navigation Controls */}
        <div className="flex items-center gap-1.5">
          {/* Pack tabs (پک ۱ / پک ۲) */}
          <div className="flex items-center bg-[#FAF8F5] p-0.5 rounded-xl border border-[#EAE4D9] text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setCurrentPage(0)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currentPage === 0
                  ? 'bg-[#18181B] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              پک ۱ (ترند)
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currentPage === 1
                  ? 'bg-[#18181B] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              پک ۲ (مجلسی و کلاسیک)
            </button>
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevPage}
              className="w-7 h-7 rounded-lg bg-[#FAF8F5] hover:bg-[#18181B] hover:text-white text-stone-700 border border-[#EAE4D9] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
              aria-label="۴ بنر قبلی"
              title="۴ بنر قبلی"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={nextPage}
              className="w-7 h-7 rounded-lg bg-[#FAF8F5] hover:bg-[#18181B] hover:text-white text-stone-700 border border-[#EAE4D9] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
              aria-label="۴ بنر بعدی"
              title="۴ بنر بعدی"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🖼️ COMPACT 4-BANNER GRID (۴ بنر همزمان با طراحی مدرن و ارتفاع بهینه)          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
        {currentBanners.map((banner) => {
          const matchingProduct = products.find(
            p => p.sku === banner.matchingSku || (banner.category !== 'همه دسته‌ها' && p.category === banner.category)
          );

          return (
            <div
              key={banner.id}
              onClick={() => {
                if (banner.category === 'همه دسته‌ها') {
                  onFilterCategory('');
                } else {
                  onFilterCategory(banner.category);
                }
              }}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border ${banner.accentBorder} shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer h-32 sm:h-36 md:h-40 flex flex-col justify-between p-2.5 sm:p-3 select-none bg-stone-900`}
            >
              {/* Background Image with Zoom & Dark Gradient Overlay */}
              <img
                src={banner.image}
                alt={banner.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out brightness-[0.82] group-hover:brightness-90"
              />
              
              {/* Atmospheric Gradient Scrim (for pristine text contrast) */}
              <div className={`absolute inset-0 bg-gradient-to-t ${banner.bgGradient} pointer-events-none`} />

              {/* Top Row: Badge & Quick View Button */}
              <div className="relative z-10 flex items-center justify-between gap-1 w-full">
                <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full border shadow-2xs backdrop-blur-md ${
                  banner.badgeType === 'gold'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-400/50'
                    : banner.badgeType === 'emerald'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-400/50'
                    : banner.badgeType === 'blue'
                    ? 'bg-sky-950/80 text-sky-300 border-sky-400/50'
                    : banner.badgeType === 'fire'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-400/50 animate-pulse'
                    : 'bg-purple-950/80 text-purple-300 border-purple-400/50'
                }`}>
                  {banner.badgeType === 'fire' && <Flame className="w-2.5 h-2.5 text-rose-400" />}
                  {banner.badgeType === 'gold' && <Award className="w-2.5 h-2.5 text-amber-400" />}
                  {banner.badgeType === 'emerald' && <ShoppingBag className="w-2.5 h-2.5 text-emerald-400" />}
                  {banner.badgeType === 'blue' && <Compass className="w-2.5 h-2.5 text-sky-400" />}
                  {banner.badgeType === 'purple' && <Sparkles className="w-2.5 h-2.5 text-purple-400" />}
                  <span className="truncate max-w-[90px] sm:max-w-none">{banner.badge}</span>
                </span>

                {matchingProduct && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProduct(matchingProduct);
                    }}
                    className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                    title="مشاهده تنخور و مشخصات مدل"
                  >
                    <Eye className="w-3 h-3 text-amber-300" />
                  </button>
                )}
              </div>

              {/* Bottom Content: Title, Short Feature & Quick Action Arrow */}
              <div className="relative z-10 space-y-0.5 sm:space-y-1">
                <h4 className="text-xs sm:text-sm font-black text-white leading-tight drop-shadow-xs group-hover:text-amber-200 transition-colors">
                  {banner.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-stone-200/90 font-medium line-clamp-1">
                  {banner.shortFeature}
                </p>
                <div className="pt-0.5 flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-amber-300 group-hover:text-white transition-colors">
                  <span className="flex items-center gap-1">
                    <span>{banner.ctaText}</span>
                    <ArrowLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:-translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[9px] font-mono text-stone-400/90 bg-black/40 px-1 rounded backdrop-blur-xs">
                    من و تو
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Progress Indicator Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-0.5">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentPage(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentPage
                ? 'w-6 h-1.5 bg-amber-500 shadow-xs'
                : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
            }`}
            aria-label={`رفتن به پک ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
