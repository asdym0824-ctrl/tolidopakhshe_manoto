import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Flame, 
  Package, 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Percent, 
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowLeft
} from 'lucide-react';

import { StorefrontBanner } from '../../types';

interface BannerSlide {
  id: string;
  badge: string;
  badgeType: 'fire' | 'gold' | 'emerald' | 'purple' | 'blue';
  title: string;
  highlightText: string;
  subtitle: string;
  ctaText: string;
  bgGradient: string;
  accentBorder: string;
  imageUrl: string;
  actionType: 'wholesale' | 'retail' | 'cheque' | 'delivery' | 'catalog';
}

interface DigikalaMobileBannerSliderProps {
  onFilterWholesalePacks: () => void;
  onFilterRetailOnly: () => void;
  onScrollToCatalog: () => void;
  onOpenAboutModal?: (tab?: 'about' | 'map' | 'contact' | 'terms') => void;
  onOpenTracking?: () => void;
  customBanners?: StorefrontBanner[];
}

export const DigikalaMobileBannerSlider: React.FC<DigikalaMobileBannerSliderProps> = ({
  onFilterWholesalePacks,
  onFilterRetailOnly,
  onScrollToCatalog,
  onOpenAboutModal,
  onOpenTracking,
  customBanners,
}) => {
  const defaultSlides: BannerSlide[] = [
    {
      id: 'slide-1',
      badge: 'شگفت‌انگیز راسته بازار',
      badgeType: 'fire',
      title: 'حراج پک‌های جور عمده',
      highlightText: 'تا ۴۰٪ حاشیه سود بنکداری',
      subtitle: 'شلوار بگ، مازراتی و کتان با تضمین تنخور',
      ctaText: 'خرید پک عمده',
      bgGradient: 'from-[#1A1817] via-[#2A2318] to-[#141416]',
      accentBorder: 'border-amber-500/40',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      actionType: 'wholesale',
    },
    {
      id: 'slide-2',
      badge: 'تک‌فروشی با نرخ دست‌اول',
      badgeType: 'emerald',
      title: 'خرید مستقیم از کارگاه',
      highlightText: 'ارسال فوری با پست پیشتاز',
      subtitle: 'انتخاب آسان رنگ و سایز برای سراسر کشور',
      ctaText: 'خرید تکی پوشاک',
      bgGradient: 'from-[#0E2319] via-[#143022] to-[#0A1610]',
      accentBorder: 'border-emerald-500/40',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
      actionType: 'retail',
    },
    {
      id: 'slide-3',
      badge: 'تسویه منعطف بازار',
      badgeType: 'gold',
      title: 'خرید اقساطی با چک صیادی',
      highlightText: 'بدون سود و کارمزد اضافی',
      subtitle: 'ویژه فروشگاه‌داران و همکاران محترم سراسر کشور',
      ctaText: 'شرایط خرید چکی',
      bgGradient: 'from-[#261E14] via-[#352815] to-[#1A140B]',
      accentBorder: 'border-[#C5A059]/40',
      imageUrl: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&auto=format&fit=crop&q=80',
      actionType: 'cheque',
    },
    {
      id: 'slide-4',
      badge: 'ارسال اکسپرس بازار تهران',
      badgeType: 'blue',
      title: 'تحویل ۲۴ ساعته به باربری',
      highlightText: 'باربری وطن، پیام‌گیر و پیشتاز',
      subtitle: 'ارائه آنی بیجک رسمی و کد رهگیری سامانه',
      ctaText: 'پیگیری و نحوه ارسال',
      bgGradient: 'from-[#121E2C] via-[#1A2C40] to-[#0D1520]',
      accentBorder: 'border-blue-500/40',
      imageUrl: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&auto=format&fit=crop&q=80',
      actionType: 'delivery',
    },
    {
      id: 'slide-5',
      badge: 'تولیدات جدید فصل',
      badgeType: 'purple',
      title: 'کالکشن پاییزه من و تو',
      highlightText: 'پارچه بدون آبرفت و پرزدهی',
      subtitle: 'انواع شلوار بگ، جاگر، لگ و اداری',
      ctaText: 'مشاهده کل کاتالوگ',
      bgGradient: 'from-[#21172E] via-[#2E1E42] to-[#160E21]',
      accentBorder: 'border-purple-500/40',
      imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
      actionType: 'catalog',
    },
  ];

  // If custom banners are provided and active from site settings, map them into slides
  const slides: BannerSlide[] = (customBanners && customBanners.filter(b => b.isActive).length > 0)
    ? customBanners.filter(b => b.isActive).map((b, idx) => {
        const badgeTypes: ('fire' | 'gold' | 'emerald' | 'purple' | 'blue')[] = ['fire', 'emerald', 'gold', 'blue', 'purple'];
        const gradients = [
          'from-[#1A1817] via-[#2A2318] to-[#141416]',
          'from-[#0E2319] via-[#143022] to-[#0A1610]',
          'from-[#261E14] via-[#352815] to-[#1A140B]',
          'from-[#121E2C] via-[#1A2C40] to-[#0D1520]',
          'from-[#21172E] via-[#2E1E42] to-[#160E21]',
        ];
        return {
          id: b.id,
          badge: b.tag || 'پیشنهاد ویژه من و تو',
          badgeType: badgeTypes[idx % badgeTypes.length],
          title: b.title,
          highlightText: b.subtitle || 'تولید و پخش مستقیم بازار',
          subtitle: b.badge || 'بازار بزرگ تهران • سرای ملی',
          ctaText: b.ctaText || 'مشاهده جزئیات',
          bgGradient: gradients[idx % gradients.length],
          accentBorder: 'border-amber-500/40',
          imageUrl: b.imageUrl,
          actionType: (b.actionType === 'wholesale_modal' ? 'wholesale' : b.actionType === 'routing_map' ? 'cheque' : 'catalog') as any,
        };
      })
    : defaultSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Prev slide
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay timer like Digikala & modern e-commerce (5.0s comfortable read time)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch gesture support (Swipe like native app)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current !== null && touchCurrentX.current !== null) {
      const diffX = touchStartX.current - touchCurrentX.current;
      // In RTL, dragging left (diffX > 45) means advance to next slide
      if (diffX > 45) {
        nextSlide();
      } else if (diffX < -45) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  const handleSlideAction = (actionType: BannerSlide['actionType']) => {
    switch (actionType) {
      case 'wholesale':
        onFilterWholesalePacks();
        break;
      case 'retail':
        onFilterRetailOnly();
        break;
      case 'cheque':
        if (onOpenAboutModal) {
          onOpenAboutModal('terms');
        } else {
          onScrollToCatalog();
        }
        break;
      case 'delivery':
        if (onOpenTracking) {
          onOpenTracking();
        } else {
          onScrollToCatalog();
        }
        break;
      case 'catalog':
      default:
        onScrollToCatalog();
        break;
    }
  };

  const toPersianNum = (num: number) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/[0-9]/g, (w) => persianDigits[+w]);
  };

  return (
    <div 
      className="block md:hidden w-full max-w-full select-none"
      dir="rtl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Digikala-Style Main Slider Container */}
      <div 
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#EAE4D9]/80 aspect-[2.15/1] min-h-[145px]"
      >
        {/* Slides Track with Digikala-Smooth Easing & Transition */}
        <div 
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
          style={{ transform: `translateX(${currentIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={slide.id}
                onClick={() => handleSlideAction(slide.actionType)}
                className={`w-full flex-shrink-0 h-full relative cursor-pointer bg-gradient-to-r ${slide.bgGradient} p-3.5 flex flex-col justify-between overflow-hidden`}
              >
                {/* Visual Image Backdrop Accent */}
                <div className="absolute inset-y-0 left-0 w-2/5 pointer-events-none overflow-hidden">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-35 mix-blend-luminosity scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#141416]/50 to-[#141416]" />
                </div>

                {/* Ambient Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C5A059]/15 rounded-full blur-2xl pointer-events-none" />

                {/* Top: Promotional Digikala-style Badge */}
                <div className="relative z-10 flex items-center gap-1.5">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide shadow-xs border ${
                    slide.badgeType === 'fire'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse'
                      : slide.badgeType === 'emerald'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                      : slide.badgeType === 'gold'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                      : slide.badgeType === 'blue'
                      ? 'bg-sky-950/80 text-sky-300 border-sky-500/50'
                      : 'bg-purple-950/80 text-purple-300 border-purple-500/50'
                  }`}>
                    {slide.badgeType === 'fire' && <Flame className="w-2.5 h-2.5 text-rose-400" />}
                    {slide.badgeType === 'emerald' && <ShoppingBag className="w-2.5 h-2.5 text-emerald-400" />}
                    {slide.badgeType === 'gold' && <CreditCard className="w-2.5 h-2.5 text-amber-400" />}
                    {slide.badgeType === 'blue' && <Truck className="w-2.5 h-2.5 text-sky-400" />}
                    {slide.badgeType === 'purple' && <Sparkles className="w-2.5 h-2.5 text-purple-400" />}
                    <span>{slide.badge}</span>
                  </div>

                  <span className="text-[9px] font-bold text-amber-300/80 hidden xs:inline">
                    تولید و پخش من و تو
                  </span>
                </div>

                {/* Middle: Headline & Highlight */}
                <div className="relative z-10 space-y-0.5 my-auto pr-1">
                  <h3 className="text-white font-black text-[13.5px] sm:text-base leading-tight drop-shadow-xs">
                    {slide.title}
                  </h3>
                  <p className="text-[#C5A059] font-black text-[11px] sm:text-xs leading-tight">
                    {slide.highlightText}
                  </p>
                  <p className="text-stone-300 text-[9.5px] line-clamp-1 opacity-90">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Bottom: Digikala CTA Button with Arrow */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1 bg-white/95 hover:bg-white text-[#141416] px-2.5 py-1 rounded-xl text-[10px] font-black shadow-md active:scale-95 transition-transform">
                    <span>{slide.ctaText}</span>
                    <ArrowLeft className="w-3 h-3 text-[#141416]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* Digikala-Style Indicators (Bottom Overlays)                                */}
        {/* ========================================================================= */}
        
        {/* Bottom Left: Digikala Page Counter Pill (e.g. ۱ / ۵) */}
        <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
          <div className="bg-black/55 backdrop-blur-md text-white/90 text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border border-white/15 flex items-center gap-1 shadow-xs">
            <span>{toPersianNum(currentIndex + 1)}</span>
            <span className="opacity-50">/</span>
            <span>{toPersianNum(slides.length)}</span>
          </div>
        </div>

        {/* Bottom Right: Digikala Pagination Animated Dots */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 pointer-events-auto">
          {slides.map((_, dotIdx) => {
            const isActive = dotIdx === currentIndex;
            return (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(dotIdx);
                }}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-5 h-1.5 bg-[#C5A059] shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`اسلاید ${dotIdx + 1}`}
              />
            );
          })}
        </div>

        {/* Subtle Next / Prev Touch Arrows on Sides */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="اسلاید قبلی"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-xs opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="اسلاید بعدی"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-xs opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
