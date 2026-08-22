import React, { useState } from 'react';
import { Product, PurchaseMode } from '../../types';
import { Package, ShoppingBag, Star, CheckCircle2, ChevronLeft, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onQuickAddToCart: (product: Product, mode: PurchaseMode, quantity: number) => void;
  isPartnerLoggedIn?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onQuickAddToCart,
  isPartnerLoggedIn = false
}) => {
  const [activeMode, setActiveMode] = useState<PurchaseMode>('wholesale_pack');
  const isRetailAvailable = Boolean(product.allowRetailSale && (product.singleStock > 0 || product.packStock > 0));

  // Wholesale pricing
  const wholesaleUnitPrice = isPartnerLoggedIn ? product.colleaguePricePerUnit : product.baseWholesalePricePerUnit;
  const wholesalePackPrice = isPartnerLoggedIn ? product.colleaguePricePerPack : product.baseWholesalePricePerPack;

  // Retail pricing
  const defaultMarkup = product.retailMarkupPercent || 35;
  const retailUnitPrice = product.retailPricePerUnit || Math.round((product.baseWholesalePricePerUnit * (1 + defaultMarkup / 100)) / 5000) * 5000;

  return (
    <div
      id={`storefront-product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-[#E6DEC8] shadow-xs hover:shadow-xl hover:border-[#18181B] transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image and Badges Header */}
      <div className="relative aspect-4/5 w-full bg-[#F5EFEB] overflow-hidden cursor-pointer" onClick={() => onOpenDetail(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end">
          <span className="bg-[#18181B]/95 backdrop-blur-xs text-[#FAF7F2] text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
            <Package className="w-3 h-3 text-[#D4AF37]" />
            پک {product.packSize} تایی
          </span>

          {isRetailAvailable ? (
            <span className="bg-[#8C6D37]/95 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <ShoppingBag className="w-2.5 h-2.5" />
              تکی موجود
            </span>
          ) : (
            <span className="bg-stone-800/90 backdrop-blur-xs text-stone-200 text-[10px] font-medium px-2 py-0.5 rounded-md shadow-xs">
              فقط فروش عمده
            </span>
          )}
        </div>

        {/* Fabric Type Bottom Badge */}
        <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between pointer-events-none">
          <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-medium px-2.5 py-1 rounded-md shadow-xs truncate max-w-[70%] border border-[#E6DEC8]/60">
            {product.fabricType}
          </span>
          {product.rating && (
            <span className="bg-white/95 text-stone-900 text-[11px] font-bold px-2 py-1 rounded-md shadow-xs flex items-center gap-1 border border-[#E6DEC8]/60">
              <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
              {product.rating}
            </span>
          )}
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-stone-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-[#FAF7F2] text-[#18181B] px-3.5 py-2 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform border border-[#E6DEC8]">
            <Eye className="w-3.5 h-3.5 text-[#8C6D37]" />
            بررسی مشخصات و رنگ‌بندی
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Tags */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="hover:text-[#8C6D37] transition-colors cursor-pointer">{product.category}</span>
            <span className="text-stone-400 font-mono text-[10px]">{product.sku}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetail(product)}
            className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 cursor-pointer hover:text-[#8C6D37] transition-colors"
          >
            {product.name}
          </h3>

          {/* Color swatches preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[10px] text-stone-500 ml-1">رنگ‌ها:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {product.colors.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-[#FAF7F2] text-stone-800 border border-[#E6DEC8] px-1.5 py-0.5 rounded text-center"
                  >
                    {c}
                  </span>
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-stone-500 font-medium">+{product.colors.length - 4}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pricing Box with Mini Toggle */}
        <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#E6DEC8] space-y-2">
          {/* Dual price mode mini pills */}
          {isRetailAvailable && (
            <div className="flex items-center bg-[#ECE4D5] p-0.5 rounded-lg text-[10px] font-bold">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMode('wholesale_pack');
                }}
                className={`flex-1 py-1 rounded-md transition-all ${
                  activeMode === 'wholesale_pack' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                قیمت پک عمده
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMode('retail_single');
                }}
                className={`flex-1 py-1 rounded-md transition-all ${
                  activeMode === 'retail_single' ? 'bg-[#8C6D37] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                قیمت تکی
              </button>
            </div>
          )}

          {/* Price Values Display */}
          {activeMode === 'wholesale_pack' ? (
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-stone-600 font-medium">پک {product.packSize} تایی:</span>
                <span className="text-sm sm:text-base font-black text-stone-900">
                  {wholesalePackPrice.toLocaleString('fa-IR')}{' '}
                  <span className="text-[10px] font-normal text-stone-500">تومان</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-700">
                <span>قیمت هر عدد در پک:</span>
                <span className="font-bold text-[#8C6D37]">
                  {wholesaleUnitPrice.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-stone-600 font-medium">قیمت تکی (۱ عدد):</span>
                <span className="text-sm sm:text-base font-black text-[#8C6D37]">
                  {retailUnitPrice.toLocaleString('fa-IR')}{' '}
                  <span className="text-[10px] font-normal text-stone-500">تومان</span>
                </span>
              </div>
              <div className="text-[10px] text-emerald-800 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>موجودی تک آماده ارسال</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            id={`btn-add-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product, activeMode, 1);
            }}
            className="flex-1 py-2.5 px-3 bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            {activeMode === 'wholesale_pack' ? (
              <>
                <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>خرید پک {product.packSize} تایی</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>خرید ۱ عدد تکی</span>
              </>
            )}
          </button>

          <button
            type="button"
            id={`btn-view-details-${product.id}`}
            onClick={() => onOpenDetail(product)}
            className="p-2.5 border border-[#DDD5C0] hover:border-[#18181B] text-stone-700 hover:text-stone-900 bg-white hover:bg-[#FAF7F2] rounded-xl transition-colors"
            title="مشاهده جزئیات و رنگ‌بندی"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

