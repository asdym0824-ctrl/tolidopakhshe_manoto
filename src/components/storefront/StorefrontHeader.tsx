import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  Building2, 
  Phone, 
  Send,
  Lock, 
  UserCheck,
  MapPin,
  User,
  Bot,
  Sparkles,
  Navigation,
  X,
  Package,
  Layers,
  ArrowLeft,
  Menu
} from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';
import { BRAND_INFO } from '../../data/brandInfo';
import { CustomerUser, Product, SiteSettings } from '../../types';
import { toPersianDigits, formatPersianPrice } from '../../utils/persianWriting';

// Helper for comprehensive Persian & Arabic text normalization
const normalizePersian = (val: string = ''): string => {
  return val
    .toLowerCase()
    .replace(/[\u200C\u200B]/g, ' ')
    .replace(/[ي]/g, 'ی')
    .replace(/[ك]/g, 'ک')
    .replace(/[آأإ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1584))
    .replace(/\s+/g, ' ')
    .trim();
};

interface StorefrontHeaderProps {
  cartItemsCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenPartnerModal: () => void;
  onOpenAboutModal: () => void;
  onOpenRoutingModal: () => void;
  onOpenAiAssistant: () => void;
  onSwitchToAdmin: () => void;
  isPartnerLoggedIn: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  loggedInCustomer: CustomerUser | null;
  onOpenCustomerAuthOrPortal: () => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onScrollToCatalog?: () => void;
  onOpenMobileMenu?: () => void;
  siteSettings?: SiteSettings;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({
  cartItemsCount,
  onOpenCart,
  onOpenTracking,
  onOpenPartnerModal,
  onOpenAboutModal,
  onOpenRoutingModal,
  onOpenAiAssistant,
  onSwitchToAdmin,
  isPartnerLoggedIn,
  searchQuery,
  onSearchChange,
  loggedInCustomer,
  onOpenCustomerAuthOrPortal,
  products = [],
  onSelectProduct,
  onScrollToCatalog,
  onOpenMobileMenu,
  siteSettings,
}) => {
  const [isDesktopFocused, setIsDesktopFocused] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Compute live instant search results matching query
  const liveResults = useMemo(() => {
    const rawQuery = searchQuery.trim();
    if (!rawQuery || products.length === 0) return [];

    const qNorm = normalizePersian(rawQuery);
    const tokens = qNorm.split(' ').filter(t => t.length > 0);

    return products.filter(p => {
      const nameNorm = normalizePersian(p.name);
      const skuNorm = normalizePersian(p.sku);
      const fabricNorm = normalizePersian(p.fabricType || '');
      const catNorm = normalizePersian(p.category || '');
      const descNorm = normalizePersian(p.description || '');
      const colorsNorm = normalizePersian((p.colors || []).join(' '));

      const combined = `${nameNorm} ${skuNorm} ${fabricNorm} ${catNorm} ${descNorm} ${colorsNorm}`;

      // Check if all tokens are present in combined text
      return tokens.every(token => combined.includes(token));
    });
  }, [searchQuery, products]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setIsDesktopFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setIsMobileFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (prod: Product) => {
    if (onSelectProduct) {
      onSelectProduct(prod);
    }
    setIsDesktopFocused(false);
    setIsMobileFocused(false);
  };

  const handleViewAllResults = () => {
    setIsDesktopFocused(false);
    setIsMobileFocused(false);
    if (onScrollToCatalog) {
      onScrollToCatalog();
    }
  };

  const quickSearchSuggestions = ['شلوار بگ', 'کتان', 'مازراتی', 'کارگو', 'اسلش', 'پنبه سوپر', 'لگ'];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE4D9] shadow-[0_2px_10px_rgba(24,24,27,0.03)] w-full max-w-full" dir="rtl">
      
      {/* Top Announcement & Quick Contact Bar (Shown on desktop, hidden on mobile so main nav bar stays completely fixed & constant) */}
      <div className="hidden md:block bg-[#141416] text-[#FAF8F5] text-[11px] py-1.5 px-2.5 sm:px-4 border-b border-stone-800 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="bg-[#C5A059] text-[#141416] font-black px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] tracking-wide whitespace-nowrap shrink-0">
              تولید و پخش مستقیم
            </span>
            <span className="text-[#EAE4D9] truncate text-[9.5px] sm:text-[11px]">
              {siteSettings?.announcementNotice || 'پاساژ المهدی ۴، پلاک ۲۴۲ • ارسال سراسری'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 text-stone-300 text-[10px] sm:text-[11px] shrink-0">
            {/* Quick Telegram */}
            <a
              href={siteSettings?.telegramChannelUrl || BRAND_INFO.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:text-amber-200 font-bold flex items-center gap-1 transition-colors p-0.5"
              title="کانال تلگرام تولیدی"
            >
              <Send className="w-3 h-3 text-[#D4AF37]" />
              <span className="hidden md:inline font-mono text-[10px]">
                {siteSettings?.telegramChannel || '@tolidopakhsh_manoto'}
              </span>
            </a>

            <span className="text-stone-700 hidden sm:inline">|</span>

            {/* Direct Phone Call */}
            <a
              href={`tel:${siteSettings?.primaryPhone || BRAND_INFO.primaryPhone}`}
              className="text-[#FAF7F2] hover:text-[#D4AF37] font-bold flex items-center gap-1 transition-all bg-stone-900/80 hover:bg-stone-800 px-1.5 sm:px-2.5 py-0.5 rounded-lg border border-stone-700/60 hover:border-[#D4AF37]/60 group cursor-pointer"
              title="تماس مستقیم با مدیریت و ثبت سفارش"
            >
              <Phone className="w-3 h-3 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden sm:inline text-stone-400 text-[10px] group-hover:text-stone-300">تماس:</span>
              <span dir="ltr" className="hidden sm:inline font-black text-[11px] tracking-wider tabular-nums font-['Vazirmatn',sans-serif]">
                {siteSettings?.primaryPhone || BRAND_INFO.primaryPhoneDisplay}
              </span>
            </a>

            <span className="text-stone-700 hidden sm:inline">|</span>

            {/* Quick Location & Routing Link */}
            <button
              type="button"
              onClick={onOpenRoutingModal}
              className="text-[#D4AF37] hover:text-white font-bold flex items-center gap-1 transition-colors p-0.5"
              title="مشاهده لوکیشن در نقشه بازار و مسیریابی"
            >
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span className="hidden md:inline">لوکیشن در بازار</span>
            </button>

            <span className="text-stone-700 hidden sm:inline">|</span>

            <button
              type="button"
              id="btn-nav-admin-portal"
              onClick={onSwitchToAdmin}
              className="text-stone-400 hover:text-white transition-colors flex items-center gap-1 font-bold p-0.5"
              title="پرتال مدیریت ادمین"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">ادمین</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div id="storefront-main-navbar" className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-3 w-full">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 w-full">
          
          {/* Mobile Hamburger Menu Trigger & Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Hamburger Button for Mobile */}
            {onOpenMobileMenu && (
              <button
                type="button"
                id="btn-mobile-hamburger-nav"
                onClick={onOpenMobileMenu}
                className="md:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white hover:bg-[#FAF8F5] active:bg-[#F3EFE6] text-stone-900 border border-[#EAE4D9] shadow-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0"
                aria-label="باز کردن منوی دسترسی سریع موبایل"
                title="منوی دسترسی سریع و دسته‌بندی‌ها"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-[#18181B] hover:text-[#967434] transition-colors" />
              </button>
            )}

            {/* Logo & Brand Identity */}
            <div 
              className="cursor-pointer group flex items-center gap-2 sm:gap-3 shrink-0"
              onClick={onOpenAboutModal}
              title="اطلاعات موسسه تولید و پخش من و تو (اسدی)"
            >
              <div className="bg-[#FAF8F5] border border-[#EAE4D9] p-1 sm:p-2 rounded-2xl shadow-xs group-hover:border-[#18181B] transition-all flex items-center justify-center">
                <div className="sm:hidden">
                  <ManotoLogo size="sm" showPersianSub={false} />
                </div>
                <div className="hidden sm:block">
                  <ManotoLogo size="md" showPersianSub={false} />
                </div>
              </div>

              <div className="hidden lg:block border-r border-[#EAE4D9] pr-3">
                <span className="text-xs font-black text-[#18181B] block">
                  {siteSettings?.brandName || 'تولید و پخش پوشاک من و تو'}
                </span>
                <span className="text-[10px] text-[#967434] font-bold block">
                  {siteSettings?.brandSubtitle ? `${siteSettings.brandSubtitle} • بازار بزرگ تهران` : 'مدیریت اسدی • بازار بزرگ تهران'}
                </span>
              </div>
            </div>
          </div>

          {/* Search Input Bar (Desktop & Tablet) */}
          <div ref={desktopSearchRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                id="storefront-desktop-search-input"
                value={searchQuery}
                onFocus={() => setIsDesktopFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsDesktopFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleViewAllResults();
                  }
                }}
                placeholder="جست‌وجوی مدل، پارچه (کرپ مازراتی، کتان، لینن) یا کد کالا..."
                className="w-full pl-9 pr-10 py-2.5 rounded-2xl bg-white border border-[#EAE5DC] focus:outline-none focus:ring-2 focus:ring-[#18181B]/15 focus:border-[#18181B] text-xs text-stone-900 transition-all placeholder:text-stone-400 shadow-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setIsDesktopFocused(false);
                  }}
                  className="absolute left-3 top-2.5 p-0.5 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
                  title="پاک کردن جست‌وجو"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Desktop Live Search Dropdown Popup */}
            {isDesktopFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full mt-2 right-0 w-[420px] lg:w-[480px] bg-white rounded-3xl border border-[#D4AF37]/40 shadow-2xl z-50 p-3 space-y-2.5 max-h-[460px] overflow-y-auto ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Dropdown Header */}
                <div className="flex items-center justify-between px-2 pb-2 border-b border-stone-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-extrabold text-stone-900">
                      نتایج جست‌وجو: <span className="text-[#8C6D37]">{toPersianDigits(liveResults.length)}</span> مدل
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">کلید ↵ برای مشاهده در کاتالوگ</span>
                </div>

                {liveResults.length > 0 ? (
                  <div className="space-y-1.5">
                    {liveResults.slice(0, 6).map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectResult(prod)}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF7F2] active:bg-[#F3EFE6] cursor-pointer transition-all border border-transparent hover:border-[#E6DEC8] group shadow-2xs"
                      >
                        {/* Thumbnail & Title/Details */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative w-13 h-13 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=60';
                              }}
                            />
                            {prod.colors && prod.colors.length > 0 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[8px] font-bold px-1 rounded-sm">
                                {toPersianDigits(prod.colors.length)} رنگ
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 text-right space-y-1 flex-1">
                            <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-[#8C6D37] transition-colors">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                              <span className="bg-stone-100 text-stone-700 font-bold px-1.5 py-0.5 rounded-md border border-stone-200">
                                {prod.sku}
                              </span>
                              <span className="bg-[#FAF7F2] text-[#8C6D37] font-medium px-1.5 py-0.5 rounded-md border border-[#E6DEC8]">
                                {prod.category}
                              </span>
                              {prod.fabricType && (
                                <span className="text-stone-500 text-[10px]">
                                  جنس: {prod.fabricType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="text-left flex-shrink-0 pl-1 pr-2 space-y-0.5">
                          <div className="text-xs font-black text-stone-900 flex items-center justify-end gap-1">
                            <span>
                              {formatPersianPrice(
                                isPartnerLoggedIn 
                                  ? (prod.colleaguePricePerPack || prod.baseWholesalePricePerPack) 
                                  : prod.baseWholesalePricePerPack
                              )}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-400 font-medium">
                            پک {prod.packSize} تایی عمده
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleViewAllResults}
                      className="w-full py-2.5 bg-[#18181B] hover:bg-[#27272A] active:scale-[0.99] text-[#FAF7F2] rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2 shadow-sm border border-stone-800"
                    >
                      <span>مشاهده کامل همه {liveResults.length} نتیجه در صفحه کاتالوگ</span>
                      <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC8] flex items-center justify-center mx-auto text-stone-400">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-stone-800">کالایی با عبارت «{searchQuery}» پیدا نشد</p>
                      <p className="text-[11px] text-stone-500">می‌توانید عبارات عمومی‌تر مثل جنس یا نوع لباس را امتحان کنید</p>
                    </div>
                    <div className="pt-2 border-t border-stone-100">
                      <span className="text-[10px] font-bold text-stone-400 block mb-2">پیشنهادهای محبوب:</span>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {quickSearchSuggestions.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => onSearchChange(tag)}
                            className="text-xs bg-[#FAF7F2] hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-xl border border-[#DDD5C0] transition-colors font-medium"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* AI Assistant Button */}
            <button
              type="button"
              id="btn-header-ai-assistant"
              onClick={onOpenAiAssistant}
              className="flex items-center justify-center gap-1 h-9 sm:h-10 px-2 sm:px-2.5 bg-gradient-to-r from-amber-50 to-[#FAF7F2] hover:from-amber-100 hover:to-amber-50 text-[#18181B] border border-[#D4AF37]/50 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 active:scale-95"
              title="دستیار هوشمند و پاسخ به سوالات پر تکرار"
            >
              <div className="w-4 h-4 rounded-full bg-[#18181B] text-[#D4AF37] flex items-center justify-center text-[10px] shrink-0">
                <Bot className="w-3 h-3" />
              </div>
              <span className="font-bold hidden md:inline xl:inline">دستیار هوشمند</span>
              <span className="bg-[#D4AF37] text-[#18181B] text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">
                AI
              </span>
            </button>

            {/* Customer Account / Login / Portal Button */}
            <button
              type="button"
              id="btn-customer-account"
              onClick={onOpenCustomerAuthOrPortal}
              className={`flex items-center justify-center h-9 sm:h-10 w-9 sm:w-auto px-0 sm:px-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 active:scale-95 cursor-pointer ${
                loggedInCustomer
                  ? 'bg-[#18181B] text-[#FAF8F5] border border-[#3F3F46]'
                  : 'bg-white hover:bg-[#FAF8F5] text-stone-900 border border-[#EAE4D9]'
              }`}
              title={loggedInCustomer ? `حساب کاربری: ${loggedInCustomer.fullName}` : 'ورود با نام کاربری (شماره همراه) و رمز عبور'}
            >
              <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${loggedInCustomer ? 'text-[#D4AF37]' : 'text-[#967434]'}`} />
              <span className="hidden sm:inline mr-1 truncate max-w-[80px] lg:max-w-[120px]">
                {loggedInCustomer ? loggedInCustomer.fullName : 'ورود / ثبت‌نام'}
              </span>
            </button>

            {/* Merged Contact, Address & Workshop Info + Balad / Neshan Navigation Button */}
            <button
              type="button"
              id="btn-header-contact"
              onClick={onOpenAboutModal}
              className="hidden xl:flex items-center gap-1.5 py-2 px-3 bg-white hover:bg-[#FAF8F5] text-stone-900 border border-[#EAE4D9] hover:border-[#967434] rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
              title="تماس، آدرس مغازه، شناسنامه کارگاه و مسیریابی مستقیم در نشان و بلد"
            >
              <MapPin className="w-3.5 h-3.5 text-[#967434]" />
              <span>تماس و آدرس</span>
            </button>

            {/* VIP Partner Wholesale Button */}
            <button
              type="button"
              id="btn-header-partner"
              onClick={onOpenPartnerModal}
              className={`hidden lg:flex items-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                isPartnerLoggedIn
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                  : 'bg-white hover:bg-[#FAF8F5] text-stone-900 border border-[#EAE4D9]'
              }`}
            >
              {isPartnerLoggedIn ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>همکار VIP</span>
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5 text-[#967434]" />
                  <span>ورود همکاران</span>
                </>
              )}
            </button>

            {/* Order Tracking Button */}
            <button
              type="button"
              id="btn-header-tracking"
              onClick={onOpenTracking}
              className="hidden 2xl:flex items-center gap-1.5 py-2 px-3 bg-white hover:bg-[#FAF8F5] text-stone-900 border border-[#EAE4D9] rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
              title="پیگیری بارنامه و بیجک باربری"
            >
              <Truck className="w-3.5 h-3.5 text-[#967434]" />
              <span>پیگیری بیجک</span>
            </button>

            {/* Quick Direct Call Button for Mobile Shoppers */}
            <a
              href={`tel:${BRAND_INFO.primaryPhone}`}
              className="md:hidden h-9 w-9 rounded-xl bg-[#FAF8F5] hover:bg-amber-50 text-[#967434] border border-[#D4AF37]/40 shadow-xs flex items-center justify-center shrink-0 active:scale-95 transition-all"
              title="تماس تلفنی با دفتر بازار"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            {/* Cart Button (Selected element: #btn-header-cart) */}
            <button
              type="button"
              id="btn-header-cart"
              onClick={onOpenCart}
              className="relative h-9 sm:h-10 px-2.5 sm:px-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:from-emerald-700 active:to-emerald-800 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-700/25 hover:shadow-lg border border-emerald-500/40 flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer select-none"
              aria-label={`سبد خرید با ${cartItemsCount} کالا`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-100 shrink-0" />
              <span className="hidden sm:inline">سبد خرید</span>
              {cartItemsCount > 0 ? (
                <span className="min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] px-1 bg-white text-emerald-800 font-black rounded-full flex items-center justify-center text-[10px] shadow-xs shrink-0">
                  {toPersianDigits(cartItemsCount)}
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping hidden sm:inline-block shrink-0" />
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div ref={mobileSearchRef} className="mt-2 md:hidden relative w-full">
          <div className="relative w-full">
            <input
              type="text"
              id="storefront-mobile-search-input"
              value={searchQuery}
              onFocus={() => setIsMobileFocused(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsMobileFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleViewAllResults();
                }
              }}
              placeholder="جست‌وجوی مدل، پارچه یا کد کالا..."
              className="w-full pl-9 pr-10 py-2 rounded-xl bg-white border border-[#EAE4D9] focus:outline-none focus:ring-2 focus:ring-[#18181B]/15 focus:border-[#18181B] text-xs text-stone-900 shadow-xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-2.5 pointer-events-none" />
            
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setIsMobileFocused(false);
                }}
                className="absolute left-3 top-2.5 p-0.5 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
                title="پاک کردن جست‌وجو"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Live Search Dropdown Popup */}
          {isMobileFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl border border-[#D4AF37]/50 shadow-2xl z-50 p-2.5 space-y-2 max-h-84 overflow-y-auto ring-1 ring-black/5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between px-2 pt-1 pb-1.5 border-b border-stone-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-extrabold text-stone-900">
                    یافت‌شده: <span className="text-[#8C6D37]">{toPersianDigits(liveResults.length)}</span> مدل
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleViewAllResults}
                  className="text-xs text-[#8C6D37] font-bold hover:underline"
                >
                  مشاهده در کاتالوگ 👈
                </button>
              </div>

              {liveResults.length > 0 ? (
                <div className="space-y-1.5">
                  {liveResults.slice(0, 5).map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectResult(prod)}
                      className="flex items-center justify-between p-2 rounded-xl bg-stone-50 hover:bg-[#FAF7F2] active:bg-[#F3EFE6] cursor-pointer border border-stone-200/80 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=60';
                          }}
                        />
                        <div className="min-w-0 text-right space-y-0.5 flex-1">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {prod.name}
                          </h4>
                          <div className="flex items-center gap-1 text-[10px] text-stone-500 flex-wrap">
                            <span className="bg-stone-200 text-stone-800 font-bold px-1 rounded">
                              {prod.sku}
                            </span>
                            <span className="bg-amber-50 text-[#8C6D37] font-medium px-1 rounded border border-amber-200">
                              {prod.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left flex-shrink-0 pl-1 pr-2">
                        <span className="text-xs font-black text-stone-900 block">
                          {formatPersianPrice(
                            isPartnerLoggedIn 
                              ? (prod.colleaguePricePerPack || prod.baseWholesalePricePerPack) 
                              : prod.baseWholesalePricePerPack
                          )}
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          پک {toPersianDigits(prod.packSize)} تایی
                        </span>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleViewAllResults}
                    className="w-full py-2.5 bg-[#18181B] text-[#FAF7F2] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-1.5 shadow-sm active:scale-[0.99]"
                  >
                    <span>مشاهدهٔ همهٔ {toPersianDigits(liveResults.length)} مدل در کاتالوگ</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center space-y-2">
                  <p className="text-xs font-bold text-stone-800">مدلی یافت نشد</p>
                  <div className="flex flex-wrap gap-1 justify-center pt-1">
                    {quickSearchSuggestions.slice(0, 5).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => onSearchChange(tag)}
                        className="text-[11px] bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg border border-stone-200"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};



