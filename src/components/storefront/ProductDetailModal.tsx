import React, { useState } from 'react';
import { Product, PurchaseMode } from '../../types';
import { SmartPurchaseSelector } from './SmartPurchaseSelector';
import { 
  X, 
  Package, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  MessageCircle, 
  Send, 
  Check, 
  Scissors, 
  Layers, 
  Info,
  HelpCircle
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product, 
    mode: PurchaseMode, 
    quantity: number, 
    selectedColor?: string, 
    selectedSize?: string
  ) => void;
  isPartnerLoggedIn?: boolean;
  onSelectCategoryFilter?: (category: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isPartnerLoggedIn = false,
  onSelectCategoryFilter
}) => {
  if (!isOpen || !product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('wholesale_pack');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'جور رنگ‌بندی');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes.split(' ')[0] || 'فری‌سایز');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  const images = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.image];

  // Pricing calculations
  const wholesaleUnitPrice = isPartnerLoggedIn ? product.colleaguePricePerUnit : product.baseWholesalePricePerUnit;
  const wholesalePackPrice = isPartnerLoggedIn ? product.colleaguePricePerPack : product.baseWholesalePricePerPack;
  const defaultMarkup = product.retailMarkupPercent || 35;
  const retailUnitPrice = product.retailPricePerUnit || Math.round((product.baseWholesalePricePerUnit * (1 + defaultMarkup / 100)) / 5000) * 5000;

  const currentUnitPrice = purchaseMode === 'wholesale_pack' ? wholesalePackPrice : retailUnitPrice;
  const totalCartValue = currentUnitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(product, purchaseMode, quantity, selectedColor, selectedSize);
    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
      onClose();
    }, 900);
  };

  // WhatsApp pre-filled inquiry text
  const inquiryText = encodeURIComponent(
    `سلام و وقت بخیر از سایت پوشاک من و تو.\nدرباره محصول «${product.name}» با کد «${product.sku}» سوال داشتم:\nتعداد درخواستی: ${quantity} ${purchaseMode === 'wholesale_pack' ? 'پک' : 'عدد'}\nلطفاً موجودی و زمان ارسال باربری وطن را بفرمایید.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn" dir="rtl">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-[#E6DEC8] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <span className="bg-[#18181B] text-[#FAF7F2] text-xs font-bold px-2.5 py-1 rounded-lg">
              {product.category}
            </span>
            <span className="text-xs text-stone-500 font-mono">
              کد کالا: {product.sku}
            </span>
          </div>

          <button
            type="button"
            id="btn-close-product-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-[#E6DEC8]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-4/5 w-full bg-[#F5EFEB] rounded-2xl overflow-hidden border border-[#E6DEC8] shadow-inner relative">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              <div className="absolute bottom-3 right-3 bg-[#18181B]/90 backdrop-blur-xs text-[#FAF7F2] text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 border border-[#D4AF37]/30">
                <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>پک {product.packSize} عددی دوخت کارگاه</span>
              </div>
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img ? 'border-[#18181B] scale-95 shadow-md' : 'border-[#E6DEC8] hover:border-[#8C6D37] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`نمای ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="bg-[#FAF7F2] rounded-2xl p-3 border border-[#E6DEC8] space-y-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8C6D37] flex-shrink-0" />
                <span>ارسال مستقیم از بازار بزرگ تهران (باربری وطن، تیپاکس، چاپار)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>تضمین سلامت دوخت کارگاهی و قواره استاندارد</span>
              </div>
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#B89B58] flex-shrink-0" />
                <span>تولید اختصاصی «موسسه تولید پخش من و تو»</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Commercial Logic */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Fabric & Technical Highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E6DEC8]">
                <span className="text-stone-500 block text-[10px]">جنس و بافت پارچه:</span>
                <span className="font-bold text-stone-900 mt-0.5 block">{product.fabricType}</span>
              </div>
              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E6DEC8]">
                <span className="text-stone-500 block text-[10px]">سایزبندی:</span>
                <span className="font-bold text-stone-900 mt-0.5 block">{product.sizes}</span>
              </div>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800 block">
                  رنگ‌بندی {purchaseMode === 'wholesale_pack' ? '(در پک جور)' : '(انتخاب برای تک‌فروشی)'}:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {purchaseMode === 'wholesale_pack' ? (
                    <div className="bg-[#FAF7F2] border border-[#DDD5C0] text-stone-800 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>پک کامل شامل رنگ‌بندی جور ({product.colors.join('، ')})</span>
                    </div>
                  ) : (
                    product.colors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          selectedColor === c
                            ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B] shadow-xs'
                            : 'bg-[#FAF7F2] text-stone-800 border-[#DDD5C0] hover:border-[#8C6D37]'
                        }`}
                      >
                        {selectedColor === c && <Check className="w-3 h-3 text-[#D4AF37]" />}
                        <span>{c}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Reusable Smart Wholesale / Retail Selector */}
            <SmartPurchaseSelector
              product={product}
              mode={purchaseMode}
              onModeChange={setPurchaseMode}
              quantity={quantity}
              onQuantityChange={setQuantity}
              isPartnerLoggedIn={isPartnerLoggedIn}
              onSelectRetailAlternative={(cat) => {
                onClose();
                if (onSelectCategoryFilter) onSelectCategoryFilter(cat);
              }}
            />

            {/* Total Calculation & Instant Action */}
            <div className="bg-[#18181B] text-[#FAF7F2] p-4 rounded-2xl shadow-xl space-y-3 border border-[#3F3F46]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block">
                    مبلغ کل سفارش {purchaseMode === 'wholesale_pack' ? `(${quantity} پک)` : `(${quantity} عدد)`}:
                  </span>
                  <span className="text-lg sm:text-xl font-black text-[#FAF7F2]">
                    {totalCartValue.toLocaleString('fa-IR')}{' '}
                    <span className="text-xs font-normal text-stone-400">تومان</span>
                  </span>
                </div>

                <button
                  type="button"
                  id="btn-add-to-cart-modal"
                  onClick={handleAdd}
                  disabled={isAddedSuccess}
                  className={`py-3 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md ${
                    isAddedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#D4AF37] hover:bg-[#C59F2D] active:bg-[#B89B58] text-[#18181B]'
                  }`}
                >
                  {isAddedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>به سبد خرید افزوده شد</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>افزودن به سبد خرید</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct WhatsApp channel quick link */}
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>نیاز به مشاوره تیراژ بالا یا فاکتور رسمی دارید؟</span>
                <a
                  href={`https://wa.me/989121110000?text=${inquiryText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:text-white font-bold flex items-center gap-1 hover:underline transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>پیام در واتساپ</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
