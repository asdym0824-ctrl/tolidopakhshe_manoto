import React, { useState } from 'react';
import { Product, PurchaseMode } from '../../types';
import { Package, ShoppingBag, Star, CheckCircle2, ChevronLeft, Eye, Check, Film, Play, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onQuickAddToCart: (product: Product, mode: PurchaseMode, quantity: number, selectedColor?: string) => void;
  isPartnerLoggedIn?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onQuickAddToCart,
  isPartnerLoggedIn = false
}) => {
  const [activeMode, setActiveMode] = useState<PurchaseMode>('wholesale_pack');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || 'جور رنگ‌بندی');
  const [isAdded, setIsAdded] = useState(false);
  const isRetailAvailable = Boolean(product.allowRetailSale && (product.singleStock > 0 || product.packStock > 0));

  // Wholesale pricing
  const wholesaleUnitPrice = isPartnerLoggedIn ? product.colleaguePricePerUnit : product.baseWholesalePricePerUnit;
  const wholesalePackPrice = isPartnerLoggedIn ? product.colleaguePricePerPack : product.baseWholesalePricePerPack;

  // Retail pricing
  const defaultMarkup = product.retailMarkupPercent || 35;
  const retailUnitPrice = product.retailPricePerUnit || Math.round((product.baseWholesalePricePerUnit * (1 + defaultMarkup / 100)) / 5000) * 5000;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAddToCart(product, activeMode, 1, selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <div
      id={`storefront-product-card-${product.id}`}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-[#E6DEC8] shadow-2xs hover:shadow-xl hover:border-[#18181B] transition-all duration-300 flex flex-col overflow-hidden select-none"
    >
      {/* Image and Badges Header - Square on Mobile for Compact Visual Browsing */}
      <div 
        className="relative aspect-square sm:aspect-4/5 w-full bg-[#F5EFEB] overflow-hidden cursor-pointer active:opacity-95" 
        onClick={() => onOpenDetail(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex flex-col gap-1 sm:gap-1.5 items-end z-10">
          <span className="bg-[#18181B]/95 backdrop-blur-xs text-[#FAF7F2] text-[8.5px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-xs flex items-center gap-1 border border-stone-700">
            <Package className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37]" />
            پک {product.packSize} تایی
          </span>

          {product.videoUrl && (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(product);
              }}
              className="bg-[#18181B]/95 hover:bg-black backdrop-blur-xs text-[#D4AF37] text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-[#D4AF37]/50 hover:scale-105 transition-transform"
            >
              <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-[#D4AF37]" />
              پخش ویدیو
            </span>
          )}

          {isRetailAvailable ? (
            <span className="bg-[#8C6D37]/95 backdrop-blur-xs text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <ShoppingBag className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
              تکی
            </span>
          ) : (
            <span className="bg-stone-900/90 backdrop-blur-xs text-stone-200 text-[8px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs">
              فقط عمده
            </span>
          )}
        </div>

        {/* Fabric Type Bottom Badge */}
        <div className="absolute bottom-1.5 right-1.5 left-1.5 sm:bottom-2 sm:right-2 sm:left-2 flex items-center justify-between pointer-events-none z-10">
          <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-[8.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs truncate max-w-[70%] border border-[#E6DEC8]/80">
            {product.fabricType}
          </span>
          {product.rating && (
            <span className="bg-white/95 text-stone-900 text-[8.5px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5 sm:gap-1 border border-[#E6DEC8]/80">
              <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-[#D4AF37] text-[#D4AF37]" />
              {product.rating}
            </span>
          )}
        </div>

        {/* Quick View Hover Overlay (Desktop) */}
        <div className="absolute inset-0 bg-stone-950/25 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center pointer-events-none">
          <span className="bg-[#FAF7F2] text-[#18181B] px-3.5 py-2 rounded-xl font-black text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform border border-[#E6DEC8]">
            <Eye className="w-3.5 h-3.5 text-[#8C6D37]" />
            بررسی مشخصات و تنخور
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-stone-500 mb-0.5 sm:mb-1">
            <span className="font-semibold text-stone-600 hover:text-[#8C6D37] transition-colors cursor-pointer truncate">{product.category}</span>
            <span className="text-stone-400 font-mono text-[8.5px] sm:text-[10px] bg-stone-100 px-1 py-0.2 rounded shrink-0">{product.sku}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetail(product)}
            className="font-black text-stone-900 text-[11.5px] sm:text-sm leading-snug line-clamp-1 sm:line-clamp-2 cursor-pointer hover:text-[#8C6D37] transition-colors"
          >
            {product.name}
          </h3>

          {/* Interactive Color swatches preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-1 sm:mt-2">
              <span className="text-[8.5px] sm:text-[10px] text-stone-400">رنگ:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {product.colors.slice(0, 4).map((c, i) => {
                  const isSel = selectedColor === c;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(c);
                      }}
                      className={`text-[8.5px] sm:text-[10px] px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#18181B] text-[#D4AF37] font-bold shadow-2xs'
                          : 'bg-[#FAF7F2] text-stone-800 border border-[#E6DEC8] hover:border-stone-800'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
                {product.colors.length > 4 && (
                  <span className="text-[8.5px] sm:text-[10px] text-stone-500 font-bold">+{product.colors.length - 4}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pricing Box with Mini Toggle */}
        <div className="bg-[#FAF7F2] rounded-xl p-2 sm:p-2.5 border border-[#E6DEC8] space-y-1 sm:space-y-1.5">
          {/* Dual price mode mini pills */}
          {isRetailAvailable && (
            <div className="flex items-center bg-[#ECE4D5] p-0.5 rounded-lg text-[8.5px] sm:text-[10px] font-black">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMode('wholesale_pack');
                }}
                className={`flex-1 py-0.5 sm:py-1 rounded-md transition-all ${
                  activeMode === 'wholesale_pack' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                پک عمده
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMode('retail_single');
                }}
                className={`flex-1 py-0.5 sm:py-1 rounded-md transition-all ${
                  activeMode === 'retail_single' ? 'bg-[#8C6D37] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                تک‌فروشی
              </button>
            </div>
          )}

          {/* Price Values Display */}
          {activeMode === 'wholesale_pack' ? (
            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-[8.5px] sm:text-[11px] text-stone-600 font-medium">پک {product.packSize} تایی:</span>
                <span className="text-[11px] sm:text-base font-black text-stone-900">
                  {wholesalePackPrice.toLocaleString('fa-IR')}{' '}
                  <span className="text-[8px] sm:text-[10px] font-normal text-stone-500">تومان</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[8.5px] sm:text-[11px] text-stone-700 pt-0.5 border-t border-[#E6DEC8]/50">
                <span className="text-stone-500">هر عدد در پک:</span>
                <span className="font-black text-[#8C6D37]">
                  {wholesaleUnitPrice.toLocaleString('fa-IR')} ت
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-[8.5px] sm:text-[11px] text-stone-600 font-medium">قیمت تک‌فروشی:</span>
                <span className="text-[11px] sm:text-base font-black text-[#8C6D37]">
                  {retailUnitPrice.toLocaleString('fa-IR')}{' '}
                  <span className="text-[8px] sm:text-[10px] font-normal text-stone-500">تومان</span>
                </span>
              </div>
              <div className="text-[8.5px] sm:text-[10px] text-emerald-800 font-bold flex items-center gap-1 pt-0.5 border-t border-[#E6DEC8]/50">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
                <span className="truncate">ارسال پستی فوری</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: 38px/42px touch targets on mobile */}
        <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5">
          <button
            type="button"
            id={`btn-add-cart-${product.id}`}
            onClick={handleAdd}
            className={`flex-1 min-h-[38px] sm:min-h-[42px] py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[10.5px] sm:text-xs font-black transition-all flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white stroke-[3]" />
                <span>به سبد اضافه شد ✓</span>
              </>
            ) : activeMode === 'wholesale_pack' ? (
              <>
                <Package className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#D4AF37] shrink-0" />
                <span className="truncate">خرید پک {product.packSize} تایی</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#D4AF37] shrink-0" />
                <span className="truncate">خرید ۱ عدد تکی</span>
              </>
            )}
          </button>

          <button
            type="button"
            id={`btn-view-details-${product.id}`}
            onClick={() => onOpenDetail(product)}
            className="min-h-[38px] min-w-[38px] sm:min-h-[42px] sm:min-w-[42px] p-1.5 sm:p-2.5 border border-[#DDD5C0] hover:border-[#18181B] text-stone-700 hover:text-stone-900 bg-white hover:bg-[#FAF7F2] active:bg-stone-100 rounded-xl transition-all flex items-center justify-center shadow-2xs active:scale-95 shrink-0"
            title="مشاهده جزئیات و مشخصات"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


