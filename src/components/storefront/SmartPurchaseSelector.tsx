import React from 'react';
import { Product, PurchaseMode } from '../../types';
import { Package, ShoppingBag, Sparkles, CheckCircle, AlertCircle, TrendingDown } from 'lucide-react';

interface SmartPurchaseSelectorProps {
  product: Product;
  mode: PurchaseMode;
  onModeChange: (mode: PurchaseMode) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  isPartnerLoggedIn?: boolean;
  onSelectRetailAlternative?: (category: string) => void;
}

export const SmartPurchaseSelector: React.FC<SmartPurchaseSelectorProps> = ({
  product,
  mode,
  onModeChange,
  quantity,
  onQuantityChange,
  isPartnerLoggedIn = false,
  onSelectRetailAlternative
}) => {
  // Commercial Wholesale & Retail Logic Calculation
  const isRetailAvailable = Boolean(product.allowRetailSale && (product.singleStock > 0 || product.packStock > 0));
  
  // Wholesale Pack calculations
  const wholesaleUnitPrice = isPartnerLoggedIn ? product.colleaguePricePerUnit : product.baseWholesalePricePerUnit;
  const wholesalePackPrice = isPartnerLoggedIn ? product.colleaguePricePerPack : product.baseWholesalePricePerPack;

  // Retail single unit calculation: Use product.retailPricePerUnit or calculate with markup
  const defaultMarkup = product.retailMarkupPercent || 35;
  const calculatedRetailPrice = product.retailPricePerUnit || Math.round((product.baseWholesalePricePerUnit * (1 + defaultMarkup / 100)) / 5000) * 5000;

  // Savings calculation
  const retailEquivalentPackPrice = calculatedRetailPrice * product.packSize;
  const savingsPerPack = retailEquivalentPackPrice - wholesalePackPrice;
  const savingsPercent = Math.round((savingsPerPack / retailEquivalentPackPrice) * 100);

  return (
    <div className="space-y-4" id="smart-purchase-selector">
      {/* Mode Selector Tabs (Wholesale Pack vs Retail Single) */}
      <div className="bg-[#FAF7F2] p-1 rounded-2xl flex items-center gap-1 border border-[#E6DEC8]">
        <button
          type="button"
          id="tab-mode-wholesale"
          onClick={() => {
            onModeChange('wholesale_pack');
            if (quantity <= 0) onQuantityChange(1);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'wholesale_pack'
              ? 'bg-[#18181B] text-[#FAF7F2] shadow-md border border-[#18181B]'
              : 'text-stone-700 hover:text-stone-900 hover:bg-[#F0E8D8]'
          }`}
        >
          <Package className="w-4 h-4 text-[#D4AF37]" />
          <span>خرید عمده (پک {product.packSize} تایی)</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-normal ${
            mode === 'wholesale_pack' ? 'bg-[#FAF7F2]/20 text-[#FAF7F2]' : 'bg-emerald-100 text-emerald-800'
          }`}>
            به‌صرفه
          </span>
        </button>

        {isRetailAvailable ? (
          <button
            type="button"
            id="tab-mode-retail"
            onClick={() => {
              onModeChange('retail_single');
              if (quantity <= 0) onQuantityChange(1);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mode === 'retail_single'
                ? 'bg-[#8C6D37] text-white shadow-md'
                : 'text-stone-700 hover:text-stone-900 hover:bg-[#F0E8D8]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>خرید تکی (۱ عدد)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-normal ${
              mode === 'retail_single' ? 'bg-white/20 text-white' : 'bg-[#E6DEC8] text-[#8C6D37]'
            }`}>
              موجود
            </span>
          </button>
        ) : (
          <div 
            id="retail-unavailable-pill"
            className="flex-1 py-3 px-3 rounded-xl text-xs text-stone-400 font-medium flex items-center justify-center gap-1.5 cursor-not-allowed opacity-75 bg-[#F5EFEB]"
            title="تک‌فروشی برای این مدل فعال نیست"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="truncate">تک‌فروشی غیرفعال</span>
          </div>
        )}
      </div>

      {/* Mode-Specific Pricing and Benefits Card */}
      {mode === 'wholesale_pack' ? (
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8] space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-stone-600 font-medium">قیمت هر بسته ({product.packSize} عددی):</span>
            <div className="text-left">
              <div className="text-lg sm:text-xl font-black text-stone-900">
                {wholesalePackPrice.toLocaleString('fa-IR')} <span className="text-xs font-normal text-stone-500">تومان</span>
              </div>
              {isPartnerLoggedIn && (
                <span className="text-[11px] text-[#8C6D37] font-bold bg-[#ECE4D5] px-2 py-0.5 rounded-md">
                  اعمال نرخ همکار VIP
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E6DEC8]">
            <span className="text-stone-700">قیمت تمام‌شده هر عدد در پک:</span>
            <span className="font-bold text-[#8C6D37]">
              {wholesaleUnitPrice.toLocaleString('fa-IR')} تومان
            </span>
          </div>

          {/* Wholesale Value Proposition Pill */}
          <div className="bg-white border border-[#E6DEC8] rounded-xl p-2.5 flex items-center gap-2 text-xs text-stone-800">
            <TrendingDown className="w-4 h-4 text-[#8C6D37] flex-shrink-0" />
            <span>
              با خرید پک عمده، <strong>{savingsPercent}٪ ({savingsPerPack.toLocaleString('fa-IR')} تومان)</strong> سود خرید مستقیم کارگاه دریافت می‌کنید.
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-600 pt-1">
            <CheckCircle className="w-3.5 h-3.5 text-[#8C6D37]" />
            <span>شامل رنگ‌بندی و سایزبندی جور استاندارد بازار بزرگ</span>
          </div>
        </div>
      ) : (
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8] space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-stone-600 font-medium">قیمت خرید تکی:</span>
            <div className="text-left">
              <div className="text-lg sm:text-xl font-black text-[#8C6D37]">
                {calculatedRetailPrice.toLocaleString('fa-IR')} <span className="text-xs font-normal text-stone-500">تومان</span>
              </div>
              <span className="text-[11px] text-stone-400 line-through">
                {(calculatedRetailPrice * 1.2).toLocaleString('fa-IR')} تومان در بازار
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#E6DEC8] rounded-xl p-2.5 flex items-start gap-2 text-xs text-stone-800">
            <Sparkles className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">امکان انتخاب مستقیم ۱ عدد با رنگ و سایز دلخواه</p>
              <p className="text-[11px] text-stone-600 mt-0.5">
                موجودی انبار تکی این مدل: <strong>{product.singleStock > 0 ? `${product.singleStock} عدد آماده ارسال` : 'موجود'}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* When Retail is unavailable and user tries to understand why */}
      {!isRetailAvailable && (
        <div className="bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl p-3 text-xs text-stone-700 space-y-2">
          <div className="flex items-center gap-2 font-medium text-stone-900">
            <Package className="w-4 h-4 text-[#8C6D37]" />
            <span>این محصول اختصاصی بنکداری و فقط به صورت پک عمده عرضه می‌شود.</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            به منظور حفظ بازار و حاشیه سود مغازه‌داران محترم، این مدل در بسته‌های {product.packSize} عددی دوخت کارگاه توزیع می‌گردد.
          </p>
          {onSelectRetailAlternative && (
            <button
              type="button"
              id="btn-see-retail-alternatives"
              onClick={() => onSelectRetailAlternative(product.category)}
              className="text-[#8C6D37] hover:text-stone-900 font-bold text-xs flex items-center gap-1 hover:underline"
            >
              <span>مشاهده مدل‌های دارای ارسال تکی در دسته‌بندی {product.category} ←</span>
            </button>
          )}
        </div>
      )}

      {/* Quantity Stepper */}
      <div className="flex items-center justify-between pt-2">
        <label className="text-xs font-semibold text-stone-800">
          تعداد {mode === 'wholesale_pack' ? `پک (${product.packSize} عددی)` : 'عدد تکی'}:
        </label>
        <div className="flex items-center border border-[#DDD5C0] bg-white rounded-xl overflow-hidden shadow-xs">
          <button
            type="button"
            id="qty-decrement"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-9 h-9 flex items-center justify-center text-stone-700 hover:bg-[#FAF7F2] active:bg-[#ECE4D5] font-bold transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center text-sm font-bold text-stone-900">
            {quantity}
          </span>
          <button
            type="button"
            id="qty-increment"
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-9 h-9 flex items-center justify-center text-stone-700 hover:bg-[#FAF7F2] active:bg-[#ECE4D5] font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
