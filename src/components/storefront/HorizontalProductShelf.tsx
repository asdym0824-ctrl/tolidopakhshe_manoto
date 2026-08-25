import React, { useRef, useState, useEffect } from 'react';
import { Product, PurchaseMode } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  ShoppingBag, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  ArrowLeft,
  Flame,
  Tag,
  Clock,
  Check,
  ShieldCheck,
  Truck,
  Play
} from 'lucide-react';

interface HorizontalProductShelfProps {
  id?: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeType?: 'hot' | 'new' | 'wholesale' | 'retail' | 'custom';
  icon?: React.ElementType;
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onQuickAddToCart: (product: Product, mode: PurchaseMode, quantity: number) => void;
  isPartnerLoggedIn?: boolean;
  onViewAll?: () => void;
  showRankNumber?: boolean;
}

export const HorizontalProductShelf: React.FC<HorizontalProductShelfProps> = ({
  id,
  title,
  subtitle,
  badgeText,
  badgeType = 'custom',
  icon: Icon = Sparkles,
  products,
  onOpenDetail,
  onQuickAddToCart,
  isPartnerLoggedIn = false,
  onViewAll,
  showRankNumber = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeModes, setActiveModes] = useState<Record<string, PurchaseMode>>({});
  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    // In RTL, scrollLeft can be negative or positive depending on browser implementation
    const maxScroll = scrollWidth - clientWidth;
    const absScroll = Math.abs(scrollLeft);
    
    setCanScrollLeft(absScroll < maxScroll - 10);
    setCanScrollRight(absScroll > 10);

    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (absScroll / maxScroll) * 100)));
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);
    }
    return () => {
      if (container) container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [products]);

  const handleScroll = (direction: 'next' | 'prev') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = window.innerWidth < 640 ? window.innerWidth * 0.8 : 320;
    // In RTL, scrolling right or left:
    const sign = direction === 'next' ? -1 : 1;
    scrollContainerRef.current.scrollBy({
      left: sign * scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleAddToCartWithFeedback = (product: Product, mode: PurchaseMode, e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAddToCart(product, mode, 1);
    
    setAddedFeedback(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedFeedback(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const getBadgeStyles = () => {
    switch (badgeType) {
      case 'hot':
        return 'bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 text-white shadow-xs font-black';
      case 'new':
        return 'bg-gradient-to-r from-emerald-700 to-teal-800 text-emerald-50 border border-emerald-500/40 shadow-xs font-bold';
      case 'retail':
        return 'bg-[#8C6D37] text-white shadow-xs font-bold';
      case 'wholesale':
        return 'bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs font-bold';
      default:
        return 'bg-[#FAF7F2] text-[#18181B] border border-[#E6DEC8] font-bold';
    }
  };

  if (products.length === 0) return null;

  return (
    <section 
      id={id} 
      className="space-y-3.5 bg-gradient-to-b from-white via-white to-[#FAF7F2]/60 p-3.5 sm:p-5 rounded-3xl border border-[#E6DEC8] shadow-xs relative transition-all duration-300" 
      dir="rtl"
    >
      
      {/* Header Section with Mobile Ergonomics */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E6DEC8]/60 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-xs shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-sm sm:text-base text-stone-900 leading-tight truncate">
                {title}
              </h3>
              {badgeText && (
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap ${getBadgeStyles()}`}>
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-stone-500 mt-0.5 hidden xs:block truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side controls: Swipe hint, View All, and Navigation Arrows */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Mobile Swipe Hint Badge */}
          <div className="flex sm:hidden items-center gap-1 text-[10px] text-[#8C6D37] bg-amber-50 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full font-medium animate-pulse">
            <span>👈 بکشید</span>
          </div>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-bold text-stone-700 hover:text-[#8C6D37] active:scale-95 transition-all flex items-center gap-1 bg-[#FAF7F2] hover:bg-white border border-[#DDD5C0] px-2.5 py-1.5 rounded-xl shadow-2xs"
            >
              <span>مشاهده همه ({products.length})</span>
              <ArrowLeft className="w-3 h-3 text-[#8C6D37]" />
            </button>
          )}

          {/* Desktop & Tablet Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScroll('prev')}
              disabled={!canScrollRight}
              className={`p-2 rounded-xl border border-[#DDD5C0] transition-all shadow-2xs active:scale-95 ${
                canScrollRight 
                  ? 'bg-white hover:bg-[#FAF7F2] text-stone-800' 
                  : 'bg-stone-100 text-stone-400 opacity-50 cursor-not-allowed'
              }`}
              title="مشاهده موارد قبلی"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('next')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-xl border border-[#DDD5C0] transition-all shadow-2xs active:scale-95 ${
                canScrollLeft 
                  ? 'bg-white hover:bg-[#FAF7F2] text-stone-800' 
                  : 'bg-stone-100 text-stone-400 opacity-50 cursor-not-allowed'
              }`}
              title="مشاهده موارد بعدی"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Horizontal Swipe Scroll Track */}
      <div className="relative -mx-3.5 sm:mx-0">
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 px-3.5 sm:px-1 snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((product, index) => {
            const isRetailAvailable = Boolean(product.allowRetailSale && (product.singleStock > 0 || product.packStock > 0));
            const currentMode = activeModes[product.id] || 'wholesale_pack';
            const isAdded = Boolean(addedFeedback[product.id]);

            // Pricing
            const wholesaleUnitPrice = isPartnerLoggedIn ? product.colleaguePricePerUnit : product.baseWholesalePricePerUnit;
            const wholesalePackPrice = isPartnerLoggedIn ? product.colleaguePricePerPack : product.baseWholesalePricePerPack;
            const defaultMarkup = product.retailMarkupPercent || 35;
            const retailUnitPrice = product.retailPricePerUnit || Math.round((product.baseWholesalePricePerUnit * (1 + defaultMarkup / 100)) / 5000) * 5000;

            return (
              <div
                key={product.id}
                id={`swipe-card-${product.id}`}
                className="w-[168px] xs:w-[190px] sm:w-[230px] md:w-[260px] shrink-0 snap-start bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#18181B] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none relative"
              >
                {/* Image Section - Compact and Crisp */}
                <div
                  className="relative aspect-square w-full bg-[#F5EFEB] overflow-hidden cursor-pointer active:opacity-95"
                  onClick={() => onOpenDetail(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Rank Badge for Bestsellers */}
                  {showRankNumber && (
                    <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 font-black text-[10px] flex items-center justify-center shadow-xs border border-white">
                      #{index + 1}
                    </div>
                  )}

                  {/* Top Badges - Compact */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                    <span className="bg-[#18181B]/95 backdrop-blur-xs text-[#FAF7F2] text-[8.5px] sm:text-[9.5px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-stone-700">
                      <Package className="w-2.5 h-2.5 text-[#D4AF37]" />
                      پک {product.packSize}
                    </span>

                    {product.videoUrl && (
                      <span className="bg-[#18181B]/95 backdrop-blur-xs text-[#D4AF37] text-[7.5px] sm:text-[8.5px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5 border border-[#D4AF37]/40">
                        <Play className="w-2 h-2 fill-[#D4AF37]" />
                        ویدیو
                      </span>
                    )}

                    {isRetailAvailable && (
                      <span className="bg-[#8C6D37]/95 backdrop-blur-xs text-white text-[8px] sm:text-[8.5px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                        تکی
                      </span>
                    )}
                  </div>

                  {/* Fabric Type & Rating Bottom Overlay */}
                  <div className="absolute bottom-1.5 right-1.5 left-1.5 flex items-center justify-between pointer-events-none z-10">
                    <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-[8.5px] sm:text-[9.5px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs truncate max-w-[70%] border border-[#E6DEC8]/80">
                      {product.fabricType}
                    </span>
                    {product.rating && (
                      <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-[8.5px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5 border border-[#E6DEC8]/80">
                        <Star className="w-2 h-2 fill-[#D4AF37] text-[#D4AF37]" />
                        {product.rating}
                      </span>
                    )}
                  </div>

                  {/* Quick View Hover overlay (Desktop) */}
                  <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none hidden sm:flex">
                    <span className="bg-white/95 text-[#18181B] px-2.5 py-1 rounded-lg font-black text-[11px] shadow-md flex items-center gap-1 border border-[#E6DEC8]">
                      <Eye className="w-3 h-3 text-[#8C6D37]" />
                      جزئیات
                    </span>
                  </div>
                </div>

                {/* Details Body - Compact & Readable */}
                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-[9px] text-stone-500 mb-0.5">
                      <span className="font-semibold text-stone-600 truncate">{product.category}</span>
                      <span className="font-mono text-stone-400 text-[8px] bg-stone-100 px-1 py-0.2 rounded shrink-0">{product.sku}</span>
                    </div>

                    <h4
                      onClick={() => onOpenDetail(product)}
                      className="font-black text-stone-900 text-[11px] sm:text-xs leading-snug line-clamp-1 cursor-pointer hover:text-[#8C6D37] transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </h4>

                    {/* Colors Count / Quick Preview */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 text-[9px] text-stone-500">
                        <span className="text-stone-400">رنگ:</span>
                        <span className="font-bold text-stone-700 truncate">{product.colors.slice(0, 2).join('، ')}</span>
                        {product.colors.length > 2 && (
                          <span className="text-[#8C6D37] font-bold text-[8.5px]">+{product.colors.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing Box - Streamlined */}
                  <div className="bg-[#FAF7F2] rounded-xl p-2 border border-[#E6DEC8] space-y-1">
                    {/* Retail / Wholesale Mini Toggle if available */}
                    {isRetailAvailable && (
                      <div className="flex items-center bg-[#ECE4D5] p-0.5 rounded-md text-[8.5px] font-black">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModes(prev => ({ ...prev, [product.id]: 'wholesale_pack' }));
                          }}
                          className={`flex-1 py-0.5 rounded transition-all ${
                            currentMode === 'wholesale_pack' 
                              ? 'bg-[#18181B] text-[#FAF7F2] shadow-2xs' 
                              : 'text-stone-700 hover:text-stone-900'
                          }`}
                        >
                          پک ({product.packSize})
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModes(prev => ({ ...prev, [product.id]: 'retail_single' }));
                          }}
                          className={`flex-1 py-0.5 rounded transition-all ${
                            currentMode === 'retail_single' 
                              ? 'bg-[#8C6D37] text-white shadow-2xs' 
                              : 'text-stone-700 hover:text-stone-900'
                          }`}
                        >
                          تکی
                        </button>
                      </div>
                    )}

                    {/* Price Tag with High Legibility */}
                    {currentMode === 'wholesale_pack' ? (
                      <div className="space-y-0.5">
                        <div className="flex items-baseline justify-between gap-1">
                          <span className="text-[8.5px] text-stone-500">پک {product.packSize} تایی:</span>
                          <span className="text-[11px] sm:text-xs font-black text-stone-900">
                            {wholesalePackPrice.toLocaleString('fa-IR')}{' '}
                            <span className="text-[8px] font-normal text-stone-500">ت</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[8.5px] text-stone-600 pt-0.5 border-t border-[#E6DEC8]/50">
                          <span className="text-stone-400">هر عدد:</span>
                          <span className="font-bold text-[#8C6D37]">
                            {wholesaleUnitPrice.toLocaleString('fa-IR')} ت
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="flex items-baseline justify-between gap-1">
                          <span className="text-[8.5px] text-stone-500">تک‌فروشی:</span>
                          <span className="text-[11px] sm:text-xs font-black text-[#8C6D37]">
                            {retailUnitPrice.toLocaleString('fa-IR')}{' '}
                            <span className="text-[8px] font-normal text-stone-500">ت</span>
                          </span>
                        </div>
                        <div className="text-[8px] text-emerald-800 font-bold flex items-center gap-0.5 pt-0.5 border-t border-[#E6DEC8]/50">
                          <CheckCircle2 className="w-2 h-2 text-emerald-600 shrink-0" />
                          <span className="truncate">ارسال پستی فوری</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Compact touch targets */}
                  <div className="flex items-center gap-1 pt-0.5">
                    <button
                      type="button"
                      id={`btn-shelf-add-${product.id}`}
                      onClick={(e) => handleAddToCartWithFeedback(product, currentMode, e)}
                      className={`flex-1 min-h-[36px] py-1.5 px-1.5 rounded-xl text-[10.5px] sm:text-xs font-black transition-all flex items-center justify-center gap-1 shadow-2xs active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3 text-white stroke-[3]" />
                          <span>ثبت شد ✓</span>
                        </>
                      ) : currentMode === 'wholesale_pack' ? (
                        <>
                          <Package className="w-3 h-3 text-[#D4AF37] shrink-0" />
                          <span className="truncate">خرید پک</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3 text-[#D4AF37] shrink-0" />
                          <span className="truncate">خرید ۱ عدد</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenDetail(product)}
                      className="min-h-[36px] min-w-[36px] p-1.5 border border-[#DDD5C0] hover:border-[#18181B] text-stone-700 hover:text-stone-900 bg-white hover:bg-[#FAF7F2] active:bg-stone-100 rounded-xl transition-all flex items-center justify-center shadow-2xs active:scale-95 shrink-0"
                      title="مشاهده مشخصات و عکس‌های بیشتر"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Progress & Swipe Helper Bar at Bottom of Shelf */}
        <div className="mt-2.5 px-3.5 sm:px-1 flex items-center justify-between text-[11px] text-stone-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-700">{products.length} مدل شلوار</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 text-[10px]">کشویی قابل سوایپ</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-20 sm:w-28 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8C6D37] to-[#D4AF37] rounded-full transition-all duration-150"
                style={{ width: `${Math.max(15, scrollProgress)}%` }}
              />
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};

