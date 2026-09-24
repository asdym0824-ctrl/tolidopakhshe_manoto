import React, { useState, useRef } from 'react';
import { 
  Film, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShoppingBag, 
  Package, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  Instagram,
  ArrowLeft
} from 'lucide-react';
import { Product, PurchaseMode } from '../../types';
import { formatPersianPrice } from '../../utils/persianWriting';

interface StorefrontVideoReelsProps {
  products: Product[];
  onOpenProductModal?: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
  onQuickAddToCart?: (product: Product, mode: PurchaseMode, quantity: number) => void;
  isPartnerLoggedIn?: boolean;
}

export const StorefrontVideoReels: React.FC<StorefrontVideoReelsProps> = ({
  products,
  onOpenProductModal,
  onOpenDetail,
  onQuickAddToCart,
  isPartnerLoggedIn = false,
}) => {
  const videoProducts = products.filter(p => Boolean(p.videoUrl));
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (videoProducts.length === 0) return null;

  const handleOpenProduct = (product: Product) => {
    if (onOpenProductModal) {
      onOpenProductModal(product);
    } else if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <div 
      id="storefront-video-reels"
      className="relative overflow-hidden rounded-3xl p-4 sm:p-5 space-y-3.5 bg-white/95 backdrop-blur-xl border border-[#EAE4D9] shadow-[0_4px_24px_rgba(24,24,27,0.05)] transition-all duration-300 select-none" 
      dir="rtl"
    >
      {/* Subtle Atelier Ambient Glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      
      {/* Header: Clean & Consistent with Other Storefront Divs */}
      <div className="flex items-center justify-between gap-3 border-b border-[#EAE4D9] pb-3 relative z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Instagram / Reels Style Gradient Icon */}
          <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0 ring-2 ring-white">
            <Film className="w-4 h-4" />
          </div>
          
          <div className="truncate">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-stone-900 text-xs sm:text-sm md:text-base tracking-tight truncate">
                ویدیوها و تن‌خور زندهٔ مدل‌های «من و تو»
              </h3>
              <span className="inline-flex items-center gap-1 bg-amber-50 border border-[#D4AF37]/35 text-[#8C6D37] text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                استیج اختصاصی تن‌خور
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 truncate">
              بررسی کیفیت پارچه، کشسانی و قوارهٔ تن‌خور شلوارها پیش از ثبت سفارش
            </p>
          </div>
        </div>

        {/* Action & Carousel Arrows */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={scrollRight}
            className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-white active:scale-95 border border-[#EAE4D9] hover:border-[#8C6D37]/50 text-stone-700 flex items-center justify-center transition-all shadow-xs cursor-pointer"
            title="قبلی"
            aria-label="اسلاید قبلی ویدیوها"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollLeft}
            className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-white active:scale-95 border border-[#EAE4D9] hover:border-[#8C6D37]/50 text-stone-700 flex items-center justify-center transition-all shadow-xs cursor-pointer"
            title="بعدی"
            aria-label="اسلاید بعدی ویدیوها"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reels Carousel Cards - Full Bleed, Lightweight, No Heavy Dark Footers */}
      <div 
        ref={scrollContainerRef}
        className="flex items-stretch gap-2.5 sm:gap-3 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {videoProducts.map((product) => {
          const wholesalePackPrice = isPartnerLoggedIn 
            ? (product.colleaguePricePerPack || product.baseWholesalePricePerPack || 0)
            : (product.baseWholesalePricePerPack || 0);
          const wholesaleUnitPrice = isPartnerLoggedIn 
            ? (product.colleaguePricePerUnit || product.baseWholesalePricePerUnit || 0)
            : (product.baseWholesalePricePerUnit || 0);

          const isPlaying = activePlayingId === product.id;

          return (
            <div
              key={product.id}
              className="group relative w-36 xs:w-40 sm:w-44 shrink-0 snap-start rounded-2xl overflow-hidden border border-[#EAE4D9] hover:border-[#D4AF37] hover:shadow-md transition-all duration-300 select-none bg-stone-950"
            >
              {/* Media Container (Instagram Reels Aspect Ratio 9:15) */}
              <div 
                className="relative aspect-[9/15] w-full overflow-hidden cursor-pointer bg-stone-950"
                onClick={() => {
                  if (isPlaying) {
                    setActivePlayingId(null);
                  } else {
                    setActivePlayingId(product.id);
                  }
                }}
              >
                {product.videoUrl ? (
                  <video
                    src={product.videoUrl}
                    playsInline
                    loop
                    muted={isMuted}
                    autoPlay={isPlaying}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    ref={(el) => {
                      if (el) {
                        if (isPlaying) el.play().catch(() => {});
                        else el.pause();
                      }
                    }}
                  />
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Soft Vignette Overlay (Light gradient, never harsh) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 flex flex-col justify-between p-2 sm:p-2.5 pointer-events-none">
                  
                  {/* Top: Reels Tag & Mute Toggle */}
                  <div className="flex items-center justify-between w-full">
                    <span className="bg-black/45 backdrop-blur-md text-[#FAF8F5] text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/15 flex items-center gap-1 shadow-xs">
                      <Film className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span>پک {product.packSize} تایی</span>
                    </span>

                    {isPlaying && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                        className="pointer-events-auto w-6 h-6 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center text-[10px] backdrop-blur-md border border-white/15 transition-colors"
                        title={isMuted ? 'صدا وصل' : 'بی‌صدا'}
                      >
                        {isMuted ? <VolumeX className="w-3 h-3 text-amber-300" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                      </button>
                    )}
                  </div>

                  {/* Center Play Button if paused */}
                  {!isPlaying && (
                    <div className="self-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform backdrop-blur-xs border border-white/50">
                      <Play className="w-4 h-4 fill-current mr-0.5 text-[#141416]" />
                    </div>
                  )}

                  {/* Bottom: Floating Product Card details directly over video */}
                  <div className="space-y-1.5 pointer-events-auto">
                    <div>
                      <span className="text-[9px] font-bold text-[#D4AF37] block truncate leading-tight">
                        {product.category} • {product.fabricType}
                      </span>
                      <h4 className="text-white text-[11.5px] sm:text-xs font-black leading-tight line-clamp-1 drop-shadow-xs">
                        {product.name}
                      </h4>
                    </div>

                    {/* Price and Action Row */}
                    <div className="pt-1 border-t border-white/15 flex items-center justify-between gap-1">
                      <div>
                        <span className="text-[8.5px] text-stone-300 block leading-none">قیمت عمده:</span>
                        <span className="font-black text-[#D4AF37] text-[11px] sm:text-xs leading-tight">
                          {formatPersianPrice(wholesaleUnitPrice)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProduct(product);
                        }}
                        className="bg-white/95 hover:bg-white text-stone-950 font-black text-[9.5px] px-2 py-1 rounded-lg flex items-center gap-1 shadow-md active:scale-95 transition-all shrink-0"
                        title="مشاهدهٔ جزئیات و خرید"
                      >
                        <span>مشاهده</span>
                        <ArrowLeft className="w-2.5 h-2.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
