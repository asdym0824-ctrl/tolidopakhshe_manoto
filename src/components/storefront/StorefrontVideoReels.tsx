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
  Flame
} from 'lucide-react';
import { Product, PurchaseMode } from '../../types';

interface StorefrontVideoReelsProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onQuickAddToCart: (product: Product, mode: PurchaseMode, quantity: number) => void;
  isPartnerLoggedIn?: boolean;
}

export const StorefrontVideoReels: React.FC<StorefrontVideoReelsProps> = ({
  products,
  onOpenDetail,
  onQuickAddToCart,
  isPartnerLoggedIn = false,
}) => {
  const videoProducts = products.filter(p => Boolean(p.videoUrl));
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (videoProducts.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E6DEC8] p-4 sm:p-5 shadow-xs space-y-4" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6DEC8]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-xs">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-stone-900 text-sm sm:text-base flex items-center gap-2">
              <span>ویدیوهای تنخور ژورنالی و تست کشسانی</span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-700" />
                پرو زنده مانکن
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              مشاهده ایستایی تنخور، بافت و ریزش پارچه در حرکت مدل قبل از سفارش
            </p>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={scrollRight}
            className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#DDD5C0] hover:border-stone-900 text-stone-700 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
            title="قبلی"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollLeft}
            className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#DDD5C0] hover:border-stone-900 text-stone-700 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
            title="بعدی"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reels Carousel Cards */}
      <div 
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
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
              className="group relative w-48 sm:w-56 shrink-0 bg-stone-950 rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-800 shadow-md flex flex-col justify-between select-none"
            >
              {/* Media Area (Video/Poster) */}
              <div 
                className="relative aspect-9/14 w-full bg-stone-900 overflow-hidden cursor-pointer"
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
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Video Play/Pause Overlay Indicator */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 flex flex-col justify-between p-2.5 sm:p-3 pointer-events-none">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between w-full">
                    <span className="bg-[#18181B]/90 backdrop-blur-xs text-[#D4AF37] text-[9px] font-black px-2 py-0.5 rounded-md border border-[#D4AF37]/40 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-[#D4AF37]" />
                      پک {product.packSize} تایی
                    </span>

                    {isPlaying && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                        className="pointer-events-auto w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px]"
                      >
                        {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  {/* Center Play Button if paused */}
                  {!isPlaying && (
                    <div className="self-center w-10 h-10 rounded-full bg-white/90 text-[#18181B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current mr-0.5" />
                    </div>
                  )}

                  {/* Bottom Video Title & Category */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-[#D4AF37] font-bold block truncate">
                      {product.category} • {product.fabricType}
                    </span>
                    <h4 className="text-white text-xs font-black leading-snug line-clamp-1">
                      {product.name}
                    </h4>
                  </div>

                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-2.5 sm:p-3 bg-stone-900 text-[#FAF7F2] space-y-2 border-t border-stone-800">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-[10px] text-stone-400">قیمت پک:</span>
                  <span className="font-black text-[#D4AF37] font-mono text-xs sm:text-sm">
                    {wholesalePackPrice.toLocaleString('fa-IR')} ت
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(product)}
                    className="py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    <span>جزئیات</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickAddToCart(product, 'wholesale_pack', 1)}
                    className="py-1.5 px-2 bg-[#D4AF37] hover:bg-amber-400 text-stone-950 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 transition-all shadow-xs"
                  >
                    <Package className="w-3 h-3" />
                    <span>خرید پک</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
