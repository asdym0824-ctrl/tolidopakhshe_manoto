import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Percent, 
  Coins, 
  X,
  HelpCircle,
  Store
} from 'lucide-react';
import { Product, PurchaseMode } from '../../types';

interface ResellerRoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product, mode: PurchaseMode, quantity: number) => void;
  isPartnerLoggedIn?: boolean;
}

export const ResellerRoiCalculatorModal: React.FC<ResellerRoiCalculatorModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  isPartnerLoggedIn = false,
}) => {
  if (!isOpen) return null;

  // Selected sample product or custom
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [customPackCount, setCustomPackCount] = useState<number>(1);
  const [customRetailPrice, setCustomRetailPrice] = useState<number | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Pricing calculations
  const wholesalePackPrice = isPartnerLoggedIn && selectedProduct
    ? selectedProduct.colleaguePricePerPack
    : (selectedProduct?.baseWholesalePricePerPack || 0);

  const wholesaleUnitPrice = isPartnerLoggedIn && selectedProduct
    ? selectedProduct.colleaguePricePerUnit
    : (selectedProduct?.baseWholesalePricePerUnit || 0);

  const defaultMarkup = selectedProduct?.retailMarkupPercent || 35;
  const suggestedRetailUnitPrice = selectedProduct?.retailPricePerUnit || 
    Math.round((wholesaleUnitPrice * (1 + defaultMarkup / 100)) / 5000) * 5000;

  const currentRetailUnitPrice = customRetailPrice !== null ? customRetailPrice : suggestedRetailUnitPrice;

  // Total calculations
  const packSize = selectedProduct?.packSize || 6;
  const totalUnits = packSize * customPackCount;
  const totalWholesaleCost = wholesalePackPrice * customPackCount;
  const totalGrossRevenue = currentRetailUnitPrice * totalUnits;
  const totalNetProfit = totalGrossRevenue - totalWholesaleCost;
  const profitMarginPercent = totalWholesaleCost > 0 
    ? Math.round((totalNetProfit / totalWholesaleCost) * 100) 
    : 0;
  const profitPerSinglePiece = currentRetailUnitPrice - wholesaleUnitPrice;

  const handleAddPack = () => {
    if (!selectedProduct) return;
    onAddToCart(selectedProduct, 'wholesale_pack', customPackCount);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn" dir="rtl">
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E6DEC8] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#18181B] text-[#FAF7F2] p-4 sm:p-5 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#27272A] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                <span>ماشین‌حساب هوشمند سود بوتیک و آنلاین‌شاپ</span>
                <span className="bg-[#D4AF37] text-[#18181B] text-[10px] font-black px-2 py-0.5 rounded-full">
                  B2B Profit Estimator
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                محاسبه دقیق سود خالص و درصد بازگشت سرمایه از هر پک عمده تولیدی من و تو
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-stone-800">
          
          {/* Step 1: Select Product */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-3">
            <label className="text-xs font-black text-stone-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#8C6D37]" />
                ۱. مدل مورد نظر برای محاسبه سود را انتخاب کنید:
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                {products.length} مدل در کاتالوگ
              </span>
            </label>

            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setCustomRetailPrice(null);
              }}
              className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl p-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-[#18181B]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category}) - پک {p.packSize} تایی: {p.baseWholesalePricePerPack.toLocaleString('fa-IR')} ت (دانه‌ای {p.baseWholesalePricePerUnit.toLocaleString('fa-IR')} ت)
                </option>
              ))}
            </select>

            {selectedProduct && (
              <div className="flex items-center gap-3 pt-2 border-t border-[#E6DEC8]/60 text-xs">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-12 h-14 rounded-lg object-cover border border-[#DDD5C0] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-stone-900 block truncate">{selectedProduct.name}</span>
                  <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                    <span>جنس: {selectedProduct.fabricType}</span>
                    <span>•</span>
                    <span>پک: {selectedProduct.packSize} عددی جور</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Sliders & Adjusters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* Number of Packs */}
            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-2">
              <label className="text-xs font-bold text-stone-900 flex items-center justify-between">
                <span>تعداد پک سفارشی:</span>
                <span className="font-black text-stone-900 font-mono bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#DDD5C0]">
                  {customPackCount} پک ({totalUnits} عدد)
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={customPackCount}
                onChange={(e) => setCustomPackCount(Number(e.target.value))}
                className="w-full accent-[#18181B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-600 font-bold">
                <span>۱ پک آزمایشی</span>
                <span>۵ پک</span>
                <span>۱۰ پک</span>
                <span>۲۰ پک عمده</span>
              </div>
            </div>

            {/* Target Retail Price per Piece */}
            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-2">
              <label className="text-xs font-bold text-stone-900 flex items-center justify-between">
                <span>قیمت فروش تکی شما در مغازه:</span>
                <span className="font-black text-[#8C6D37] font-mono bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  {currentRetailUnitPrice.toLocaleString('fa-IR')} ت
                </span>
              </label>
              <input
                type="range"
                min={wholesaleUnitPrice}
                max={wholesaleUnitPrice * 3}
                step="5000"
                value={currentRetailUnitPrice}
                onChange={(e) => setCustomRetailPrice(Number(e.target.value))}
                className="w-full accent-[#8C6D37] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-600 font-bold">
                <span>کف: {wholesaleUnitPrice.toLocaleString('fa-IR')}</span>
                <span>پیشنهادی: {suggestedRetailUnitPrice.toLocaleString('fa-IR')}</span>
                <span>بالا: {(wholesaleUnitPrice * 2.5).toLocaleString('fa-IR')}</span>
              </div>
            </div>

          </div>

          {/* Results Display Dashboard */}
          <div className="bg-gradient-to-br from-[#18181B] to-stone-900 text-[#FAF7F2] p-5 rounded-3xl border border-[#D4AF37]/50 shadow-lg space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                خلاصه سوددهی و حاشیه فروش شما:
              </span>
              <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +{profitMarginPercent}٪ بازدهی سرمایه (ROI)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                <span className="text-[10px] text-stone-400 block">سرمایه خرید از کارگاه:</span>
                <span className="text-xs sm:text-sm font-black text-stone-200 mt-1 block">
                  {totalWholesaleCost.toLocaleString('fa-IR')} ت
                </span>
              </div>

              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                <span className="text-[10px] text-stone-400 block">کل فروش در بوتیک:</span>
                <span className="text-xs sm:text-sm font-black text-amber-200 mt-1 block">
                  {totalGrossRevenue.toLocaleString('fa-IR')} ت
                </span>
              </div>

              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                <span className="text-[10px] text-stone-400 block">سود هر ۱ عدد شلوار:</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400 mt-1 block">
                  +{profitPerSinglePiece.toLocaleString('fa-IR')} ت
                </span>
              </div>

              <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/40">
                <span className="text-[10px] text-emerald-300 block font-bold">سود خالص کل شما:</span>
                <span className="text-sm sm:text-base font-black text-emerald-300 mt-1 block font-mono">
                  +{totalNetProfit.toLocaleString('fa-IR')} ت
                </span>
              </div>

            </div>

            <p className="text-[11px] text-stone-400 text-center leading-relaxed">
              💡 با فروش روزانه تنها ۲ عدد از این مدل در مغازه یا پیج، در کمتر از 
              <span className="text-[#D4AF37] font-bold mx-1">{Math.ceil(totalUnits / 2)} روز</span>
              کل سرمایه شما به همراه سود خالص نقدی برمی‌گردد.
            </p>

          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl border border-[#DDD5C0] text-stone-700 hover:bg-white text-xs font-bold transition-all"
            >
              بستن ماشین‌حساب
            </button>

            <button
              type="button"
              onClick={handleAddPack}
              disabled={addedSuccess}
              className={`w-full sm:w-auto py-3 px-6 rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2]'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>به سبد خرید اضافه شد ✓</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 text-[#D4AF37]" />
                  <span>افزودن {customPackCount} پک ({totalUnits} عدد) به سبد خرید</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
