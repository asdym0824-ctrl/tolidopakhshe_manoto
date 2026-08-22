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
  Clock
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
    const scrollAmount = 300;
    // In RTL, scrolling right or left:
    const sign = direction === 'next' ? -1 : 1;
    scrollContainerRef.current.scrollBy({
      left: sign * scrollAmount,
      behavior: 'smooth'
    });
  };

  const getBadgeStyles = () => {
    switch (badgeType) {
      case 'hot':
        return 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs';
      case 'new':
        return 'bg-emerald-700 text-emerald-100 border border-emerald-600/50 shadow-xs';
      case 'retail':
        return 'bg-[#8C6D37] text-white shadow-xs';
      case 'wholesale':
        return 'bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs';
      default:
        return 'bg-[#FAF7F2] text-[#18181B] border border-[#E6DEC8]';
    }
  };

  if (products.length === 0) return null;

  return (
    <section id={id} className="space-y-3.5 bg-gradient-to-b from-white to-stone-50/50 p-4 sm:p-5 rounded-3xl border border-[#E6DEC8] shadow-xs relative" dir="rtl">
      
      {/* Header Section */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E6DEC8]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-xs flex-shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-sm sm:text-base text-stone-900 leading-tight">
                {title}
              </h3>
              {badgeText && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getBadgeStyles()}`}>
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-stone-500 mt-0.5 hidden xs:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side controls: Swipe hint, View All, and Navigation Arrows */}
        <div className="flex items-center gap-2">
          
          {/* Mobile Swipe Hint Badge */}
          <div className="hidden xs:flex sm:hidden items-center gap-1 text-[10px] text-[#8C6D37] bg-amber-50 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full font-medium">
            <span>👈 به چپ بکشید</span>
          </div>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-bold text-stone-700 hover:text-[#8C6D37] transition-colors flex items-center gap-1 bg-[#FAF7F2] hover:bg-white border border-[#DDD5C0] px-2.5 py-1.5 rounded-xl shadow-2xs"
            >
              <span>مشاهده همه ({products.length})</span>
              <ArrowLeft className="w-3 h-3" />
            </button>
          )}

          {/* Desktop & Tablet Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScroll('prev')}
              className="p-2 rounded-xl border border-[#DDD5C0] bg-white hover:bg-[#FAF7F2] text-stone-700 hover:text-stone-900 transition-colors shadow-2xs active:scale-95"
              title="مشاهده موارد قبلی"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('next')}
              className="p-2 rounded-xl border border-[#DDD5C0] bg-white hover:bg-[#FAF7F2] text-stone-700 hover:text-stone-900 transition-colors shadow-2xs active:scale-95"
              title="مشاهده موارد بعدی"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Horizontal Swipe Scroll Track */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 px-1 snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((product, index) => {
            const isRetailAvailable = Boolean(product.allowRetailSale && (product.singleStock > 0 || product.packStock > 0));
            const currentMode = activeModes[product.id] || 'wholesale_pack';

            // Pricing
            const wholesaleUnitPrice = isPartnerLoggedIn ? product.colleaguePricePerUnit : product.baseWholesalePricePerUnit;
            const wholesalePackPrice = isPartnerLoggedIn ? product.colleaguePricePerPack : product.baseWholesalePricePerPack;
            const defaultMarkup = product.retailMarkupPercent || 35;
            const retailUnitPrice = product.retailPricePerUnit || Math.round((product.baseWholesalePricePerUnit * (1 + defaultMarkup / 100)) / 5000) * 5000;

            return (
              <div
                key={product.id}
                id={`swipe-card-${product.id}`}
                className="w-[74vw] xs:w-[250px] sm:w-[270px] flex-shrink-0 snap-start bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#18181B] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none"
              >
                {/* Image Section */}
                <div
                  className="relative aspect-4/5 w-full bg-[#F5EFEB] overflow-hidden cursor-pointer"
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
                    <div className="absolute top-2.5 left-2.5 z-10 w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 font-black text-xs flex items-center justify-center shadow-md border border-white">
                      #{index + 1}
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end z-10">
                    <span className="bg-[#18181B]/95 backdrop-blur-xs text-[#FAF7F2] text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                      <Package className="w-3 h-3 text-[#D4AF37]" />
                      پک {product.packSize} تایی
                    </span>

                    {isRetailAvailable ? (
                      <span className="bg-[#8C6D37]/95 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <ShoppingBag className="w-2.5 h-2.5" />
                        تکی موجود
                      </span>
                    ) : (
                      <span className="bg-stone-800/90 backdrop-blur-xs text-stone-200 text-[9px] font-medium px-2 py-0.5 rounded-md shadow-xs">
                        فقط عمده
                      </span>
                    )}
                  </div>

                  {/* Fabric Type & Rating Bottom Overlay */}
                  <div className="absolute bottom-2 right-2 left-2 flex items-center justify-between pointer-events-none z-10">
                    <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-[10px] font-medium px-2 py-0.5 rounded-md shadow-xs truncate max-w-[65%] border border-[#E6DEC8]/60">
                      {product.fabricType}
                    </span>
                    {product.rating && (
                      <span className="bg-white/95 text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-[#E6DEC8]/60">
                        <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
                        {product.rating}
                      </span>
                    )}
                  </div>

                  {/* Quick View Hover overlay */}
                  <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 text-[#18181B] px-3 py-1.5 rounded-xl font-bold text-[11px] shadow-md flex items-center gap-1 border border-[#E6DEC8]">
                      <Eye className="w-3 h-3 text-[#8C6D37]" />
                      مشاهده مشخصات
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                      <span>{product.category}</span>
                      <span className="font-mono text-stone-400">{product.sku}</span>
                    </div>

                    <h4
                      onClick={() => onOpenDetail(product)}
                      className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-1 cursor-pointer hover:text-[#8C6D37] transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </h4>

                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[9px] text-stone-400">رنگ:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {product.colors.slice(0, 3).map((c, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] bg-[#FAF7F2] text-stone-700 border border-[#E6DEC8] px-1.5 py-0.2 rounded"
                            >
                              {c}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-[9px] text-stone-400 font-bold">+{product.colors.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-[#FAF7F2] rounded-xl p-2.5 border border-[#E6DEC8] space-y-1.5">
                    {/* Retail / Wholesale Mini Toggle if available */}
                    {isRetailAvailable && (
                      <div className="flex items-center bg-[#ECE4D5] p-0.5 rounded-lg text-[9px] font-bold">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModes(prev => ({ ...prev, [product.id]: 'wholesale_pack' }));
                          }}
                          className={`flex-1 py-0.5 rounded-md transition-all ${
                            currentMode === 'wholesale_pack' ? 'bg-[#18181B] text-[#FAF7F2]' : 'text-stone-700'
                          }`}
                        >
                          پک عمده
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModes(prev => ({ ...prev, [product.id]: 'retail_single' }));
                          }}
                          className={`flex-1 py-0.5 rounded-md transition-all ${
                            currentMode === 'retail_single' ? 'bg-[#8C6D37] text-white' : 'text-stone-700'
                          }`}
                        >
                          تکی
                        </button>
                      </div>
                    )}

                    {/* Price Tag */}
                    {currentMode === 'wholesale_pack' ? (
                      <div className="space-y-0.5">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] text-stone-600">پک {product.packSize} تایی:</span>
                          <span className="text-xs sm:text-sm font-black text-stone-900">
                            {wholesalePackPrice.toLocaleString('fa-IR')}{' '}
                            <span className="text-[9px] font-normal text-stone-500">تومان</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-stone-700">
                          <span>هر عدد:</span>
                          <span className="font-bold text-[#8C6D37]">
                            {wholesaleUnitPrice.toLocaleString('fa-IR')} ت
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] text-stone-600">قیمت تکی:</span>
                          <span className="text-xs sm:text-sm font-black text-[#8C6D37]">
                            {retailUnitPrice.toLocaleString('fa-IR')}{' '}
                            <span className="text-[9px] font-normal text-stone-500">تومان</span>
                          </span>
                        </div>
                        <div className="text-[9px] text-emerald-800 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>آماده ارسال فوری</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <button
                      type="button"
                      id={`btn-shelf-add-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAddToCart(product, currentMode, 1);
                      }}
                      className="flex-1 py-2 px-2 bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2] rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      {currentMode === 'wholesale_pack' ? (
                        <>
                          <Package className="w-3 h-3 text-[#D4AF37]" />
                          <span>خرید پک {product.packSize} تایی</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3 text-[#D4AF37]" />
                          <span>خرید ۱ عدد</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenDetail(product)}
                      className="p-2 border border-[#DDD5C0] hover:border-[#18181B] text-stone-700 hover:text-stone-900 bg-white hover:bg-[#FAF7F2] rounded-xl transition-colors"
                      title="مشاهده جزئیات"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Progress Bar at Bottom of Shelf */}
        <div className="mt-2 px-1 flex items-center justify-between text-[10px] text-stone-400">
          <div className="flex items-center gap-1.5">
            <span className="font-mono">{products.length} مدل شلوار</span>
            <span className="hidden xs:inline">•</span>
            <span className="hidden xs:inline">قابلیت کشیدن به چپ و راست</span>
          </div>

          <div className="w-24 sm:w-32 h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8C6D37] to-[#D4AF37] rounded-full transition-all duration-150"
              style={{ width: `${Math.max(15, scrollProgress)}%` }}
            />
          </div>
        </div>

      </div>

    </section>
  );
};
