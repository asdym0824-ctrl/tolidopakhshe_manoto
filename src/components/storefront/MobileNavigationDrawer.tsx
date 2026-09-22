import React, { useEffect, useState } from 'react';
import { 
  X, 
  Menu, 
  Home, 
  Sparkles, 
  Flame, 
  ShoppingBag, 
  Truck, 
  Building2, 
  Calculator, 
  MapPin, 
  Phone, 
  Send, 
  MessageSquare, 
  Bot, 
  User, 
  UserCheck, 
  Lock, 
  Layers, 
  ChevronLeft, 
  ChevronDown, 
  Tag, 
  Film, 
  Compass, 
  LogOut, 
  ShieldCheck, 
  Package, 
  ExternalLink,
  Store,
  Grid,
  CheckCircle2,
  Clock,
  Navigation,
  Ruler,
  Shirt
} from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';
import { BRAND_INFO } from '../../data/brandInfo';
import { RubikaIcon, BaleIcon, EitaaIcon, TelegramIcon } from '../common/SocialIcons';
import { CustomerUser, Product } from '../../types';

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  salesModeFilter: 'all' | 'retail_only' | 'wholesale_only';
  onSetSalesModeFilter: (filter: 'all' | 'retail_only' | 'wholesale_only') => void;
  onScrollToCatalog: () => void;
  onScrollToSection?: (sectionId: string) => void;
  onOpenCart: () => void;
  cartItemsCount: number;
  onOpenTracking: () => void;
  onOpenPartnerModal: () => void;
  onOpenAboutModal: (tab?: 'all' | 'map' | 'metro') => void;
  onOpenRoutingModal: () => void;
  onOpenAiAssistant: () => void;
  onOpenRoiCalculator?: () => void;
  onOpenFullCatalog?: () => void;
  onOpenPromoPopup?: () => void;
  promoTitle?: string;
  promoDiscount?: number;
  onOpenCustomerAuthOrPortal: () => void;
  onSwitchToAdmin: () => void;
  loggedInCustomer: CustomerUser | null;
  isPartnerLoggedIn: boolean;
  products?: Product[];
  onOpenSizeGuide?: () => void;
  onOpenFabricCare?: () => void;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  salesModeFilter,
  onSetSalesModeFilter,
  onScrollToCatalog,
  onScrollToSection,
  onOpenCart,
  cartItemsCount,
  onOpenTracking,
  onOpenPartnerModal,
  onOpenAboutModal,
  onOpenRoutingModal,
  onOpenAiAssistant,
  onOpenRoiCalculator,
  onOpenFullCatalog,
  onOpenPromoPopup,
  promoTitle,
  promoDiscount = 25,
  onOpenCustomerAuthOrPortal,
  onSwitchToAdmin,
  loggedInCustomer,
  isPartnerLoggedIn,
  products = [],
  onOpenSizeGuide,
  onOpenFabricCare
}) => {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);

  // Disable background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    onClose();
    onScrollToCatalog();
  };

  const handleSalesModeClick = (mode: 'all' | 'retail_only' | 'wholesale_only') => {
    onSetSalesModeFilter(mode);
    onClose();
    onScrollToCatalog();
  };

  const handleAction = (callback: () => void) => {
    onClose();
    callback();
  };

  // Helper to count products per category
  const getCategoryCount = (cat: string) => {
    if (cat === 'همه') return products.length;
    return products.filter(p => p.category === cat).length;
  };

  return (
    <div 
      id="mobile-navigation-drawer-backdrop" 
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden"
      dir="rtl"
      onClick={onClose}
    >
      {/* Drawer Container (Slides from Right) */}
      <div 
        id="mobile-navigation-drawer-panel"
        className="fixed inset-y-0 right-0 max-w-[85vw] w-full sm:max-w-sm bg-[#FAF7F2] text-stone-900 shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out border-l border-[#E6DEC8] animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 1. Header with Brand & Close Button */}
        <div className="p-4 sm:p-5 bg-[#18181B] text-[#FAF7F2] border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#FAF7F2] p-1 rounded-xl shadow-xs">
              <ManotoLogo size="sm" showPersianSub={false} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm text-[#FAF7F2]">پوشاک من و تو</h3>
                <span className="bg-[#D4AF37] text-[#18181B] font-black text-[9px] px-1.5 py-0.2 rounded-md">
                  اسدی
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-medium">
                تولید و پخش بازار بزرگ تهران
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-mobile-drawer"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 active:scale-95 transition-all cursor-pointer"
            aria-label="بستن منو"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 divide-y divide-[#E6DEC8]/70">
          
          {/* Section A: Customer Account & Wholesale VIP Access */}
          <div className="space-y-2.5 pt-1">
            {loggedInCustomer ? (
              /* Logged-in Customer Card */
              <div className="bg-white rounded-2xl p-3.5 border border-[#DDD5C0] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-black text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#18181B]">{loggedInCustomer.fullName}</div>
                      <div className="text-[10px] text-stone-500 font-mono" dir="ltr">{loggedInCustomer.phoneNumber}</div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {loggedInCustomer.customerType === 'wholesale_vip' ? 'همکار VIP' : 'مشتری ثبت‌شده'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAction(onOpenCustomerAuthOrPortal)}
                  className="w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#F3EFE6] text-stone-800 border border-[#DDD5C0] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>سوابق خرید و پیگیری سفارش‌ها</span>
                  <ChevronLeft className="w-3.5 h-3.5 opacity-60 mr-auto" />
                </button>
              </div>
            ) : (
              /* Guest / Wholesale Login Buttons */
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAction(onOpenCustomerAuthOrPortal)}
                  className="p-3 bg-white hover:bg-[#FAF7F2] border border-[#DDD5C0] rounded-2xl text-right transition-all group shadow-xs active:scale-98"
                >
                  <div className="w-7 h-7 rounded-xl bg-stone-100 text-[#18181B] flex items-center justify-center mb-1.5 group-hover:bg-[#18181B] group-hover:text-[#D4AF37] transition-colors">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-black text-[#18181B]">ورود / ثبت‌نام</div>
                  <div className="text-[10px] text-stone-500">حساب مشتریان</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAction(onOpenPartnerModal)}
                  className={`p-3 rounded-2xl text-right transition-all group shadow-xs active:scale-98 border ${
                    isPartnerLoggedIn 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                      : 'bg-gradient-to-br from-[#18181B] to-[#27272A] border-stone-800 text-white'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1.5 ${
                    isPartnerLoggedIn ? 'bg-emerald-200 text-emerald-900' : 'bg-stone-800 text-[#D4AF37]'
                  }`}>
                    {isPartnerLoggedIn ? <UserCheck className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`text-xs font-black ${isPartnerLoggedIn ? 'text-emerald-900' : 'text-white'}`}>
                    {isPartnerLoggedIn ? 'همکار VIP فعال' : 'ورود همکاران'}
                  </div>
                  <div className={`text-[10px] ${isPartnerLoggedIn ? 'text-emerald-700' : 'text-stone-300'}`}>
                    {isPartnerLoggedIn ? 'تخفیف عمده بنکداری' : 'قیمت همکاری و فاکتور'}
                  </div>
                </button>
              </div>
            )}

            {/* Special Occasion Festival Discount Callout */}
            {onOpenPromoPopup && (
              <button
                type="button"
                id="btn-drawer-occasion-promo"
                onClick={() => handleAction(onOpenPromoPopup)}
                className="w-full mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-[#18181B] via-stone-900 to-[#18181B] border-2 border-[#D4AF37] text-right shadow-md flex items-center justify-between group active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-[#F5E6A3] text-[#18181B] flex items-center justify-center font-black shrink-0 shadow-xs">
                    <Flame className="w-4 h-4 fill-[#18181B]" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <span>{promoTitle || 'جشنواره حراج ویژه مناسبتی'}</span>
                      <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                        {promoDiscount}٪ تخفیف
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-300">
                      مشاهده شلوار تخفیف‌دار، کوپن و مهلت جشنواره
                    </div>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-[#D4AF37] group-hover:-translate-x-0.5 transition-transform shrink-0" />
              </button>
            )}
          </div>

          {/* Section B: Direct Quick Modes & Storefront Shelves */}
          <div className="pt-4 space-y-2">
            <span className="text-[11px] font-black text-stone-500 block px-1">
              بخش‌های ویژه و فیلترهای خرید:
            </span>

            <div className="grid grid-cols-1 gap-1.5">
              {/* Home & All Products */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('همه');
                  onSetSalesModeFilter('all');
                  onClose();
                  onScrollToCatalog();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'همه' && salesModeFilter === 'all'
                    ? 'bg-[#18181B] text-[#FAF7F2]'
                    : 'bg-white hover:bg-[#FAF7F2] text-stone-800 border border-[#E6DEC8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home className={`w-4 h-4 ${selectedCategory === 'همه' ? 'text-[#D4AF37]' : 'text-stone-600'}`} />
                  <span>صفحه اصلی و کل کاتالوگ</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono">
                  {products.length} مدل
                </span>
              </button>

              {/* Retail Ready Mode Filter */}
              <button
                type="button"
                onClick={() => handleSalesModeClick('retail_only')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                  salesModeFilter === 'retail_only'
                    ? 'bg-rose-900 text-white'
                    : 'bg-white hover:bg-rose-50/50 text-stone-800 border border-[#E6DEC8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-rose-500" />
                  <span>امکان خرید تکی (تک‌فروشی)</span>
                </div>
                <span className="text-[9px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                  بدون نیاز به پک
                </span>
              </button>

              {/* Wholesale Only Mode */}
              <button
                type="button"
                onClick={() => handleSalesModeClick('wholesale_only')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                  salesModeFilter === 'wholesale_only'
                    ? 'bg-[#8C6D37] text-white'
                    : 'bg-white hover:bg-amber-50/50 text-stone-800 border border-[#E6DEC8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#8C6D37]" />
                  <span>خرید عمده و تیراژ (پک‌های جین)</span>
                </div>
                <span className="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  پک‌های ۴ تا ۱۲ تایی
                </span>
              </button>

              {/* Full Interactive Catalog View */}
              {onOpenFullCatalog && (
                <button
                  type="button"
                  onClick={() => handleAction(onOpenFullCatalog)}
                  className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-[#FAF7F2] text-stone-800 border border-[#E6DEC8] rounded-xl text-xs font-bold transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Grid className="w-4 h-4 text-[#8C6D37]" />
                    <span>کاتالوگ کامل و ورق‌زدن آلبوم مدل‌ها</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 opacity-50" />
                </button>
              )}
            </div>
          </div>

          {/* Section C: Product Categories Accordion */}
          <div className="pt-4 space-y-2">
            <div 
              className="flex items-center justify-between px-1 cursor-pointer select-none"
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            >
              <span className="text-[11px] font-black text-stone-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#8C6D37]" />
                <span>دسته‌بندی‌های شلوار زنانه:</span>
              </span>
              <span className="text-[10px] text-stone-400 font-bold flex items-center gap-0.5">
                <span>{categoriesExpanded ? 'بستن' : 'نمایش'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesExpanded ? 'rotate-180' : ''}`} />
              </span>
            </div>

            {categoriesExpanded && (
              <div className="grid grid-cols-2 gap-1.5 pt-1 animate-in fade-in">
                {categories.map((category) => {
                  const count = getCategoryCount(category);
                  const isSelected = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryClick(category)}
                      className={`p-2.5 rounded-xl text-right transition-all flex items-center justify-between text-xs font-bold border ${
                        isSelected
                          ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B] shadow-xs'
                          : 'bg-white hover:bg-[#FAF7F2] text-stone-800 border-[#E6DEC8]'
                      }`}
                    >
                      <span className="truncate">{category}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-md font-mono ${
                        isSelected ? 'bg-stone-800 text-[#D4AF37]' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section D: Reseller Tools & Inquiries */}
          <div className="pt-4 space-y-2">
            <span className="text-[11px] font-black text-stone-500 block px-1">
              ابزارها و خدمات ویژه خریداران:
            </span>

            <div className="space-y-1.5">
              {/* Order Tracking & Freight Bijak */}
              <button
                type="button"
                onClick={() => handleAction(onOpenTracking)}
                className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-[#FAF7F2] text-stone-800 border border-[#E6DEC8] rounded-xl text-xs font-bold transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span>پیگیری بارنامه و بیجک باربری</span>
                    <span className="text-[10px] text-stone-400 block font-normal">استعلام مرسولات باربری وطن و چاپار</span>
                  </div>
                </div>
                <ChevronLeft className="w-3.5 h-3.5 opacity-50" />
              </button>

              {/* Reseller Profit / ROI Calculator */}
              {onOpenRoiCalculator && (
                <button
                  type="button"
                  onClick={() => handleAction(onOpenRoiCalculator)}
                  className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-[#FAF7F2] text-stone-800 border border-[#E6DEC8] rounded-xl text-xs font-bold transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-[#8C6D37] flex items-center justify-center">
                      <Calculator className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span>محاسبه‌گر سود بنکداران و فروشگاه‌داران</span>
                      <span className="text-[10px] text-stone-400 block font-normal">محاسبه مارجین و سود هر پک جین</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 opacity-50" />
                </button>
              )}

              {/* AI Smart Advisor */}
              <button
                type="button"
                onClick={() => handleAction(onOpenAiAssistant)}
                className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-50/80 to-white hover:from-amber-100/80 text-stone-900 border border-[#D4AF37]/40 rounded-xl text-xs font-bold transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#18181B] text-[#D4AF37] flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span>مشاور هوشمند فروشگاه (AI)</span>
                      <span className="text-[9px] bg-[#D4AF37] text-[#18181B] font-black px-1.5 py-0.2 rounded-full">پاسخ آنی</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block font-normal">پاسخ به سوالات جنس، تنخور و شرایط همکاری</span>
                  </div>
                </div>
                <ChevronLeft className="w-3.5 h-3.5 opacity-50" />
              </button>

              {/* Women Size Guide Trigger in Drawer */}
              {onOpenSizeGuide && (
                <button
                  type="button"
                  onClick={() => handleAction(onOpenSizeGuide)}
                  className="w-full flex items-center justify-between p-2.5 bg-rose-50/70 hover:bg-rose-100/70 text-rose-950 border border-rose-200/90 rounded-xl text-xs font-bold transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                      <Ruler className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>راهنمای سایزبندی بانوان</span>
                        <span className="text-[8.5px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded-md font-bold">قد و دور کمر</span>
                      </div>
                      <span className="text-[10px] text-stone-500 block font-normal">جدول استاندارد سایز شلوارهای زنانه کارگاه</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-rose-400" />
                </button>
              )}

              {/* Fabric Care & Styling Guide in Drawer */}
              {onOpenFabricCare && (
                <button
                  type="button"
                  onClick={() => handleAction(onOpenFabricCare)}
                  className="w-full flex items-center justify-between p-2.5 bg-amber-50/70 hover:bg-amber-100/70 text-stone-900 border border-amber-200/90 rounded-xl text-xs font-bold transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>شناسنامه پارچه و شستشو</span>
                        <span className="text-[8.5px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-md font-bold">حفظ تنخور</span>
                      </div>
                      <span className="text-[10px] text-stone-500 block font-normal">توصیه‌های دوخت و اتوکشی کتان، کرپ و مازراتی</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-amber-500" />
                </button>
              )}

              {/* Cart Quick Access */}
              <button
                type="button"
                onClick={() => handleAction(onOpenCart)}
                className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-[#FAF7F2] text-stone-800 border border-[#E6DEC8] rounded-xl text-xs font-bold transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-stone-100 text-[#18181B] flex items-center justify-center">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <span>سبد خرید من</span>
                </div>
                {cartItemsCount > 0 ? (
                  <span className="bg-[#B89B58] text-[#18181B] font-black px-2 py-0.5 rounded-full text-[10px]">
                    {cartItemsCount} کالا
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-400">خالی</span>
                )}
              </button>
            </div>
          </div>

          {/* Section E: Physical Location, Contact & Telegram */}
          <div className="pt-4 space-y-2.5">
            <span className="text-[11px] font-black text-stone-500 block px-1">
              خرید حضوری در بازار تهران و ارتباط:
            </span>

            {/* Address & Metro Routing Button */}
            <button
              type="button"
              onClick={() => handleAction(() => onOpenAboutModal('map'))}
              className="w-full p-3 bg-white hover:bg-[#FAF7F2] border border-[#DDD5C0] rounded-2xl text-right transition-all group space-y-1.5 shadow-xs"
            >
              <div className="flex items-center justify-between text-xs font-black text-[#18181B]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#8C6D37]" />
                  <span>آدرس و مسیریابی پاساژ المهدی ۴</span>
                </div>
                <span className="text-[10px] text-[#8C6D37] font-bold">نقشه و بلد</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-relaxed">
                بازار بزرگ تهران، خیابان خیام، روبه‌روی مترو خیام، پاساژ المهدی ۴، پلاک ۲۴۲
              </p>
            </button>

            {/* Quick Contact Buttons Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Direct Phone Call */}
              <a
                href={`tel:${BRAND_INFO.primaryPhone}`}
                className="p-2.5 bg-white hover:bg-stone-50 text-stone-900 border border-[#DDD5C0] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>تماس تلفنی</span>
              </a>

              {/* WhatsApp Direct */}
              <a
                href={BRAND_INFO.whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white hover:bg-stone-50 text-stone-900 border border-[#DDD5C0] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>واتساپ پشتیبانی</span>
              </a>
            </div>

            {/* Iranian Messengers & Telegram */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-stone-400 font-bold block">
                کانال‌های رسمی در پیام‌رسان‌ها:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* Telegram Channel */}
                <a
                  href={BRAND_INFO.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-sky-50/70 hover:bg-sky-100/70 text-sky-900 border border-sky-200/80 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <TelegramIcon className="w-4 h-4 shrink-0" />
                  <span>کانال تلگرام</span>
                </a>

                {/* Rubika */}
                <a
                  href="https://rubika.ir/tolidopakhsh_manoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-purple-50/70 hover:bg-purple-100/70 text-purple-900 border border-purple-200/80 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <RubikaIcon className="w-4 h-4 shrink-0" />
                  <span>کانال روبیکا</span>
                </a>

                {/* Bale */}
                <a
                  href="https://ble.ir/tolidopakhsh_manoto_dress"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <BaleIcon className="w-4 h-4 shrink-0" />
                  <span>پیام‌رسان بله</span>
                </a>

                {/* Eitaa */}
                <a
                  href="https://eitaa.com/tolidopakhsh_manoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-orange-50/70 hover:bg-orange-100/70 text-orange-900 border border-orange-200/80 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <EitaaIcon className="w-4 h-4 shrink-0" />
                  <span>کانال ایتا</span>
                </a>
              </div>
            </div>

          </div>

          {/* Section F: Admin Portal Switch */}
          <div className="pt-4 pb-2">
            <button
              type="button"
              onClick={() => handleAction(onSwitchToAdmin)}
              className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-stone-200"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span>ورود به پرتال مدیریت و انبار (ادمین)</span>
            </button>
          </div>

        </div>

        {/* 3. Sticky Footer in Drawer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-center text-[10px] text-stone-500 shrink-0">
          <span>ساعات کاری بازار بزرگ: ۸:۳۰ الی ۱۹:۰۰ • جمعه‌ها تعطیل</span>
        </div>

      </div>
    </div>
  );
};
