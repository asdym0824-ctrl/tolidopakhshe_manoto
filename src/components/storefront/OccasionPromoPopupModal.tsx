import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShoppingBag, 
  ArrowLeft, 
  Check, 
  Copy, 
  Tag, 
  Sparkles,
  Clock,
  Flame,
  Award,
  Camera,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Edit3
} from 'lucide-react';
import promoPosterBanner from '../../assets/images/fashion_promo_poster_1789560143097.jpg';
import { Product, OccasionPromoPopupConfig, PurchaseMode } from '../../types';
import { toPersianDigits, formatPersianPrice } from '../../utils/persianWriting';

// Preset fashion boutique posters for quick selection
const BOUTIQUE_POSTER_PRESETS = [
  { 
    id: 'preset-default',
    title: 'پوستر اختصاصی تولیدی من و تو (پیش‌فرض)', 
    subtitle: 'طراحی ژورنالی تنخور شلوار و آفر ویژه جشنواره',
    url: promoPosterBanner 
  },
  { 
    id: 'preset-1',
    title: 'ژورنال مینیمال استایل شیک زنانه', 
    subtitle: 'کالکشن شلوار بگ و نیم‌بگ ترند',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'preset-2',
    title: 'پارچه لینن و شلوار تابستانه کرم', 
    subtitle: 'خنک، سبک و مخصوص ویترین فصلی',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'preset-3',
    title: 'استایل رسمی پارچه مازراتی مشکی', 
    subtitle: 'دوخت صنعتی راسته و بوت‌کات اداری',
    url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'preset-4',
    title: 'شلوار اسلش و کارگو کتان لایت', 
    subtitle: 'تیپ اسپرت و پرفروش بازار بزرگ تهران',
    url: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=900&auto=format&fit=crop&q=80' 
  },
];

interface OccasionPromoPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: OccasionPromoPopupConfig;
  product?: Product;
  onSelectProduct?: (product: Product) => void;
  onAddToCart: (
    product: Product,
    mode: PurchaseMode,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => void;
  onOpenCart?: () => void;
  isPartnerLoggedIn?: boolean;
}

export const OccasionPromoPopupModal: React.FC<OccasionPromoPopupModalProps> = ({
  isOpen,
  onClose,
  config,
  product,
  onSelectProduct,
  onAddToCart,
  onOpenCart,
  isPartnerLoggedIn = false
}) => {
  // Mode selection: default wholesale for logged-in partners, else retail if enabled
  const [selectedMode, setSelectedMode] = useState<PurchaseMode>(() => 
    isPartnerLoggedIn ? 'wholesale_pack' : (product?.allowRetailSale ? 'retail_single' : 'wholesale_pack')
  );
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // User custom poster image state (with fallback to default site image if none is set or entered)
  const [activePoster, setActivePoster] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('manoto_custom_promo_poster');
      if (stored && stored.trim()) return stored;
    } catch {
      // storage fallback
    }
    return config?.customBannerImage || config?.posterImage || promoPosterBanner;
  });

  const [isEditingPoster, setIsEditingPoster] = useState(false);
  const [inputPosterUrl, setInputPosterUrl] = useState('');
  const [previewPosterUrl, setPreviewPosterUrl] = useState('');
  const [posterSourceTab, setPosterSourceTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync if config provides a custom image
  useEffect(() => {
    const configImg = config?.customBannerImage || config?.posterImage;
    if (configImg) {
      setActivePoster(configImg);
    }
  }, [config?.customBannerImage, config?.posterImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSaveNotice('حجم تصویر نباید بیشتر از ۵ مگابایت باشد.');
        setTimeout(() => setSaveNotice(null), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setPreviewPosterUrl(resultStr);
          setInputPosterUrl(resultStr);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomPoster = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const candidate = (previewPosterUrl || inputPosterUrl).trim();
    if (candidate) {
      try {
        localStorage.setItem('manoto_custom_promo_poster', candidate);
      } catch (err) {}
      setActivePoster(candidate);
      setSaveNotice('تصویر جدید با موفقیت اعمال شد!');
    } else {
      // If user did not enter or select an image: keep current site default!
      try {
        localStorage.removeItem('manoto_custom_promo_poster');
      } catch (err) {}
      setActivePoster(promoPosterBanner);
      setSaveNotice('تصویر پیش‌فرض فعلی سایت حفظ شد.');
    }
    setTimeout(() => {
      setSaveNotice(null);
      setIsEditingPoster(false);
    }, 900);
  };

  const handleResetToDefaultPoster = () => {
    try {
      localStorage.removeItem('manoto_custom_promo_poster');
    } catch (err) {}
    setInputPosterUrl('');
    setPreviewPosterUrl('');
    setActivePoster(promoPosterBanner);
    setSaveNotice('تصویر پیش‌فرض اصلی سایت بازنشانی شد.');
    setTimeout(() => {
      setSaveNotice(null);
      setIsEditingPoster(false);
    }, 900);
  };

  // Update selectedMode if product mode compatibility changes
  useEffect(() => {
    if (product) {
      if (isPartnerLoggedIn) {
        setSelectedMode('wholesale_pack');
      } else if (product.allowRetailSale) {
        setSelectedMode('retail_single');
      } else {
        setSelectedMode('wholesale_pack');
      }
    }
  }, [product, isPartnerLoggedIn]);

  if (!isOpen || !product) return null;

  const discountPercent = config?.discountPercent || 30;
  const couponCode = config?.discountCouponCode || config?.couponCode || 'MANOTO30';
  const occasionTitle = config?.occasionTitle || 'عضویت در باشگاه مشتریان و دریافت تخفیف‌های ویژه !';

  // Wholesale calculations
  const originalPackPrice = isPartnerLoggedIn 
    ? product.colleaguePricePerPack 
    : product.baseWholesalePricePerPack;
  const discountedPackPrice = config?.customSpecialPricePerPack && config.customSpecialPricePerPack > 0
    ? config.customSpecialPricePerPack
    : Math.round((originalPackPrice * (1 - discountPercent / 100)) / 5000) * 5000;
  const discountedUnitInPack = Math.round(discountedPackPrice / product.packSize);

  // Retail calculations
  const defaultMarkup = product.retailMarkupPercent || 35;
  const originalRetailPrice = product.retailPricePerUnit || 
    Math.round((product.baseWholesalePricePerUnit * (1 + defaultMarkup / 100)) / 5000) * 5000;
  const discountedRetailPrice = config?.customSpecialPricePerUnit && config.customSpecialPricePerUnit > 0
    ? config.customSpecialPricePerUnit
    : Math.round((originalRetailPrice * (1 - discountPercent / 100)) / 5000) * 5000;

  // Active pricing based on mode
  const isWholesale = selectedMode === 'wholesale_pack';
  const displayCurrentPrice = isWholesale ? discountedPackPrice : discountedRetailPrice;
  const displayOriginalPrice = isWholesale ? originalPackPrice : originalRetailPrice;

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('manoto_dismiss_promo_popup_date', new Date().toDateString());
      } catch {
        // storage fallback
      }
    }
    onClose();
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleQuickAdd = () => {
    const promoProduct: Product = {
      ...product,
      baseWholesalePricePerPack: discountedPackPrice,
      colleaguePricePerPack: discountedPackPrice,
      retailPricePerUnit: discountedRetailPrice,
      baseWholesalePricePerUnit: discountedUnitInPack,
      colleaguePricePerUnit: discountedUnitInPack,
    };

    onAddToCart(
      promoProduct,
      selectedMode,
      1,
      product.colors?.[0] || 'رنگ ژورنال',
      'فری‌سایز'
    );

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      handleClose();
      if (onOpenCart) {
        onOpenCart();
      }
    }, 850);
  };

  const heroImage = product.galleryImages?.[0] || product.image;

  return (
    <div 
      id="occasion-promo-popup-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-in fade-in duration-200"
      dir="rtl"
      onClick={handleClose}
    >
      {/* LUXURY E-COMMERCE SPLIT MODAL (Harmonized with MANOTO DRESS Atelier Theme) */}
      <div 
        id="occasion-promo-popup-card"
        className="relative w-full max-w-[94vw] sm:max-w-md md:max-w-2xl lg:max-w-3xl bg-[#FAF8F5] text-stone-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E6DEC8] shadow-[0_25px_60px_-15px_rgba(20,20,22,0.45)] animate-in zoom-in-95 duration-300 flex flex-col md:flex-row select-none max-h-[92vh] sm:max-h-[88vh] md:max-h-[85vh] overflow-y-auto md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button (Harmonized with Dark/Gold Brand Aesthetic) */}
        <button
          type="button"
          id="btn-close-occasion-promo"
          onClick={handleClose}
          className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#18181B] hover:bg-black active:bg-stone-800 text-[#FAF8F5] border border-[#3F3F46] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90 touch-manipulation group"
          aria-label="بستن"
          title="بستن پنجره"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-stone-300 group-hover:text-white stroke-[2.2]" />
        </button>

        {/* RIGHT COLUMN (RTL): Offer & Conversion Form (Harmonized with MANOTO Atelier Palette) */}
        <div className="w-full md:w-[56%] p-3.5 sm:p-5 md:p-7 flex flex-col justify-between space-y-2.5 sm:space-y-3.5 md:space-y-4 order-2 md:order-1 bg-[#FAF8F5]">
          
          {/* Eyebrow / Headline */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-[#8C7A58] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C5A059] shrink-0" />
                <span className="truncate">{occasionTitle}</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-[#F4EFE6] border border-[#DDD5C0] text-[#78350F] px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black">
                <Clock className="w-3 h-3 text-[#C5A059]" />
                <span>مهلت: تا ساعت ۲۴ امشب</span>
              </div>
            </div>

            {/* MASSIVE PROMO TYPOGRAPHY */}
            <div className="space-y-0.5 pt-0.5">
              <span className="block text-xs sm:text-sm font-black text-stone-500 tracking-wide">
                دریافت هدیه ورود
              </span>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#881337] tracking-tight leading-none drop-shadow-xs font-['Vazirmatn',sans-serif]">
                {discountPercent}٪ تخفیف خرید
              </div>
              <span className="block text-[11px] sm:text-xs md:text-sm font-bold text-stone-700 pt-1 leading-snug">
                روی اولین سفارش عمده (پک بازاری) یا تکی از خط دوخت من و تو
              </span>
            </div>
          </div>

          {/* Coupon Action Area */}
          <div className="space-y-2 sm:space-y-2.5">
            {/* Instant Coupon Pill */}
            <div className="flex items-center justify-between bg-[#F5EFE6] border border-[#DDD5C0] rounded-xl px-3 py-2 text-xs shadow-2xs">
              <div className="flex items-center gap-2 text-stone-900 font-bold truncate">
                <Tag className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="hidden sm:inline text-stone-700">کد تخفیف ویژه شما:</span>
                <span className="sm:hidden text-stone-700">کد تخفیف:</span>
                <span className="font-mono tracking-wider font-black text-[#18181B] bg-white px-2.5 py-1 rounded-lg border border-[#DDD5C0] shadow-2xs text-xs sm:text-sm">
                  {couponCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="text-xs font-bold text-[#18181B] hover:text-white bg-[#EAE4D9] hover:bg-[#18181B] active:bg-black px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer touch-manipulation shadow-2xs border border-[#DDD5C0]"
              >
                {copiedCoupon ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCoupon ? 'کپی شد!' : 'کپی کد'}</span>
              </button>
            </div>

            {/* Mode Switcher & Price Bar */}
            {product.allowRetailSale && !isPartnerLoggedIn ? (
              <div className="flex items-center justify-between bg-white border border-[#E6DEC8] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedMode('retail_single')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer text-[10px] sm:text-xs ${
                      selectedMode === 'retail_single'
                        ? 'bg-[#18181B] text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    تک‌فروشی
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMode('wholesale_pack')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer text-[10px] sm:text-xs ${
                      selectedMode === 'wholesale_pack'
                        ? 'bg-[#18181B] text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    عمده ({toPersianDigits(product.packSize)} تایی)
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="line-through text-stone-400 text-[10px] sm:text-[11px]">
                    {formatPersianPrice(displayOriginalPrice, 'تومان', false)}
                  </span>
                  <span className="font-black text-[#9F1239] text-xs sm:text-sm">
                    {formatPersianPrice(displayCurrentPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white border border-[#E6DEC8] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs">
                <span className="text-stone-700 font-bold text-[11px] sm:text-xs">
                  {isWholesale ? `پک عمده (${toPersianDigits(product.packSize)} تایی):` : 'تک‌فروشی:'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="line-through text-stone-400 text-[10px] sm:text-[11px]">
                    {formatPersianPrice(displayOriginalPrice, 'تومان', false)}
                  </span>
                  <span className="font-black text-[#9F1239] text-xs sm:text-sm">
                    {formatPersianPrice(displayCurrentPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Add CTA */}
            <button
              type="button"
              id="btn-promo-quick-order"
              onClick={handleQuickAdd}
              disabled={addedSuccess}
              className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-[#18181B] hover:bg-black active:bg-stone-900 text-[#FAF8F5] border border-[#3F3F46] font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 cursor-pointer touch-manipulation"
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">به سبد خرید اضافه شد!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>سفارش با {discountPercent}٪ تخفیف ویژه</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Checkbox & Details Link */}
          <div className="pt-1.5 sm:pt-2 border-t border-[#E6DEC8] flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500">
            <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-stone-300 text-[#C5A059] focus:ring-[#C5A059] cursor-pointer"
              />
              <span className="font-medium text-stone-600">دیگر این پنجره را نشان نده</span>
            </label>

            {onSelectProduct && (
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onSelectProduct(product);
                }}
                className="text-stone-600 hover:text-stone-950 transition-colors font-bold flex items-center gap-1 cursor-pointer touch-manipulation"
              >
                <span>مشاهده مشخصات</span>
                <ArrowLeft className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>

        {/* LEFT COLUMN (RTL): High-Impact Editorial Fashion Poster & Campaign Showcase */}
        <div 
          className="w-full md:w-[44%] h-52 sm:h-64 md:h-auto md:min-h-[460px] bg-stone-950 relative flex items-center justify-center overflow-hidden order-1 md:order-2 select-none"
          title="پوستر جشنواره پوشاک زنانه من و تو"
        >
          {/* Fashion Campaign Editorial Poster */}
          <img 
            id="occasion-promo-poster-img"
            src={activePoster} 
            alt="پوستر اختصاصی حراج پوشاک زنانه من و تو"
            referrerPolicy="no-referrer"
            onError={() => {
              setActivePoster(promoPosterBanner);
            }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="eager"
          />

          {/* Luxury Editorial Overlay & Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 pointer-events-none" />

          {/* Light Sheen Sweep Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          {/* Top Magazine Header Badge */}

          {/* Floating Gold Discount Seal (Creative eye-catcher with brand gold palette) */}
          <div className="absolute top-12 left-2.5 sm:top-14 sm:left-3.5 z-10 -rotate-12 group-hover:rotate-0 transition-transform duration-300 pointer-events-none">
            <div className="bg-gradient-to-br from-[#D4AF37] via-[#C5A059] to-[#8C7A58] text-[#18181B] p-2 sm:p-2.5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(197,160,89,0.5)] border-2 border-white/80 flex flex-col items-center justify-center min-w-[58px] sm:min-w-[68px]">
              <span className="text-[8px] sm:text-[9px] font-black text-[#262420] uppercase tracking-tight">MANOTO</span>
              <span className="text-base sm:text-xl font-black font-mono leading-none text-[#18181B]">{discountPercent}٪</span>
              <span className="text-[8px] font-black text-[#3A3326] mt-0.5">تخفیف ویژه</span>
            </div>
          </div>

          {/* Bottom Editorial Caption Card */}
          <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3.5 sm:inset-x-3.5 bg-stone-950/85 backdrop-blur-md text-stone-100 p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl space-y-0.5 sm:space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Award className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-xs sm:text-sm font-black text-white truncate">
                  کالکشن شلوار و استایل زنانه
                </span>
              </div>
              <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30 shrink-0">
                پاییز و زمستان
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-300 font-medium line-clamp-1">
              تنخور عالی با پارچه‌های کتان لایت، مازراتی و داکرون بازار بزرگ
            </p>
          </div>

          {/* IN-PLACE POSTER PHOTO EDITOR MODAL / DRAWER (REMOVED) */}
          {false && (
            <div 
              className="absolute inset-0 z-40 bg-stone-950/95 backdrop-blur-md p-3 sm:p-4 text-white flex flex-col justify-between overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      ویرایش تصویر و پوستر پاپ‌آپ
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      امکان بارگذاری عکس دلخواه یا حفظ پوستر فعلی سایت
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingPoster(false)}
                  className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Notice if any */}
              {saveNotice && (
                <div className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-[11px] p-2 rounded-xl flex items-center gap-2 my-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{saveNotice}</span>
                </div>
              )}

              {/* Source Selection Tabs */}
              <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 my-2">
                <button
                  type="button"
                  onClick={() => setPosterSourceTab('presets')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                    posterSourceTab === 'presets'
                      ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>آلبوم ژورنال</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPosterSourceTab('upload')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                    posterSourceTab === 'upload'
                      ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>آپلود فایل</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPosterSourceTab('url')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                    posterSourceTab === 'url'
                      ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>لینک عکس</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 space-y-2.5 my-1">
                {/* 1. Presets */}
                {posterSourceTab === 'presets' && (
                  <div className="space-y-1.5 max-h-48 sm:max-h-52 overflow-y-auto pr-1">
                    <p className="text-[10px] text-stone-400">
                      یک پوستر آماده را انتخاب کنید، یا تصویر پیش‌فرض کارگاه را نگه دارید:
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {BOUTIQUE_POSTER_PRESETS.map((p) => {
                        const isSelected = (previewPosterUrl || activePoster) === p.url;
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              setPreviewPosterUrl(p.url);
                              setInputPosterUrl(p.url);
                            }}
                            className={`p-1.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500 text-white'
                                : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                            }`}
                          >
                            <img
                              src={p.url}
                              alt={p.title}
                              className="w-12 h-12 rounded-lg object-cover border border-white/20 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-[11px] font-bold truncate flex items-center gap-1">
                                {p.title}
                                {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                              </div>
                              <div className="text-[9px] text-stone-400 truncate">
                                {p.subtitle}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Upload from device */}
                {posterSourceTab === 'upload' && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-stone-700 hover:border-amber-500/70 rounded-2xl p-4 sm:p-5 text-center cursor-pointer bg-stone-900/40 hover:bg-stone-900/80 transition-all flex flex-col items-center justify-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-stone-200">
                        برای انتخاب عکس از گوشی یا سیستم اینجا کلیک کنید
                      </span>
                      <span className="text-[10px] text-stone-400">
                        فرمت‌های JPG، PNG، WEBP (حداکثر ۵ مگابایت)
                      </span>
                    </div>

                    {previewPosterUrl && (
                      <div className="flex items-center gap-2.5 p-2 bg-stone-900 rounded-xl border border-stone-800">
                        <img
                          src={previewPosterUrl}
                          alt="پیش‌نمایش آپلود"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="text-[11px] font-bold text-amber-300 truncate">
                          عکس آماده اعمال است
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Image URL */}
                {posterSourceTab === 'url' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] text-stone-300 font-bold">
                      آدرس اینترنتی (URL) عکس جدید را وارد کنید:
                    </label>
                    <input
                      type="url"
                      value={inputPosterUrl}
                      onChange={(e) => {
                        setInputPosterUrl(e.target.value);
                        setPreviewPosterUrl(e.target.value);
                      }}
                      placeholder="https://example.com/photo.jpg"
                      dir="ltr"
                      className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 text-white rounded-xl p-2.5 text-xs text-left outline-none font-mono"
                    />
                    <p className="text-[10px] text-stone-400 leading-relaxed">
                      نکته: در صورت خالی گذاشتن این کادر، عکس پیش‌فرض اصلی سایت بدون تغییر باقی خواهد ماند.
                    </p>
                  </div>
                )}

                {/* Fallback guarantee statement */}
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200 leading-relaxed">
                  💡 <span className="font-bold">قانون نمایش سایت:</span> در صورتی که تمایلی به تغییر نداشته باشید یا عکسی وارد نکنید، همان عکس پیش‌فرض باکیفیت کارگاه در سایت نمایش داده می‌شود.
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-stone-800 flex items-center gap-2">
                <button
                  type="button"
                  id="btn-save-custom-poster"
                  onClick={() => handleApplyCustomPoster()}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>تایید و اعمال عکس</span>
                </button>

                <button
                  type="button"
                  id="btn-reset-default-poster"
                  onClick={handleResetToDefaultPoster}
                  className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                  title="بازگشت به عکس پیش‌فرض کارگاه من و تو"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>حفظ عکس فعلی</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
