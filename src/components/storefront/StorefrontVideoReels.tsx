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
      className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 space-y-3 relative overflow-hidden transition-all duration-300" 
      dir="rtl"
    >
      
      {/* Header: Sleek, Modern & Instagram Reels Aesthetic */}
      <div className="flex items-center justify-between gap-2 border-b border-stone-800/80 pb-2.5 relative z-10">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {/* Instagram / Reels Style Gradient Icon */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-[#FAF7F2] text-xs sm:text-sm truncate">
                ریلز و تنخور زنده مدل‌ها
              </h3>
              <span className="hidden xs:inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[9px] font-black px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                استیج اختصاصی تنخور
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-300 truncate">
              مشاهده کیفیت دوخت و ریزش پارچه در تن مانکن قبل از سفارش
            </p>
          </div>
        </div>

        {/* Action & Carousel Arrows */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={scrollRight}
            className="w-7 h-7 rounded-xl bg-stone-800/90 border border-stone-700 hover:border-[#D4AF37] text-stone-200 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
            title="قبلی"
            aria-label="اسلاید قبلی ویدیوها"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={scrollLeft}
            className="w-7 h-7 rounded-xl bg-stone-800/90 border border-stone-700 hover:border-[#D4AF37] text-stone-200 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
            title="بعدی"
            aria-label="اسلاید بعدی ویدیوها"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
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
            ? product.colleaguePricePerPack 
            : product.baseWholesalePricePerPack;
          const wholesaleUnitPrice = isPartnerLoggedIn 
            ? product.colleaguePricePerUnit 
            : product.baseWholesalePricePerUnit;

          const isPlaying = activePlayingId === product.id;

          return (
            <div
              key={product.id}
              className="group relative w-36 xs:w-40 sm:w-44 shrink-0 snap-start rounded-2xl overflow-hidden border border-[#EAE4D9] hover:border-[#D4AF37]/70 hover:shadow-md transition-all duration-300 select-none bg-stone-900"
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
                        <span className="font-black text-[#D4AF37] font-mono text-[11px] sm:text-xs leading-tight">
                          {wholesaleUnitPrice.toLocaleString('fa-IR')} ت
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProduct(product);
                        }}
                        className="bg-white/95 hover:bg-white text-stone-950 font-black text-[9.5px] px-2 py-1 rounded-lg flex items-center gap-1 shadow-md active:scale-95 transition-all shrink-0"
                        title="مشاهده جزئیات و خرید"
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
