import React from 'react';
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
  User
} from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';
import { BRAND_INFO } from '../../data/brandInfo';
import { CustomerUser } from '../../types';

interface StorefrontHeaderProps {
  cartItemsCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenPartnerModal: () => void;
  onOpenAboutModal: () => void;
  onSwitchToAdmin: () => void;
  isPartnerLoggedIn: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  loggedInCustomer: CustomerUser | null;
  onOpenCustomerAuthOrPortal: () => void;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({
  cartItemsCount,
  onOpenCart,
  onOpenTracking,
  onOpenPartnerModal,
  onOpenAboutModal,
  onSwitchToAdmin,
  isPartnerLoggedIn,
  searchQuery,
  onSearchChange,
  loggedInCustomer,
  onOpenCustomerAuthOrPortal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DEC8] shadow-xs" dir="rtl">
      
      {/* Top Announcement & Quick Contact Bar */}
      <div className="bg-[#18181B] text-[#FAF7F2] text-[11px] py-1.5 px-4 overflow-hidden border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B89B58] text-[#18181B] font-black px-2.5 py-0.5 rounded-full text-[10px] tracking-wide">
              تولید و پخش مستقیم
            </span>
            <span className="text-[#E6DEC8] truncate hidden sm:inline">
              پاساژ المهدی ۴، پلاک ۲۴۲ • ارسال روزانه عمده و تک به سراسر ایران
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-stone-300 text-[11px] flex-shrink-0">
            {/* Quick Telegram */}
            <a
              href={BRAND_INFO.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:text-amber-200 font-bold flex items-center gap-1 transition-colors"
              title="کانال تلگرام تولیدی"
            >
              <Send className="w-3 h-3 text-[#D4AF37]" />
              <span className="hidden md:inline">کانال تلگرام:</span>
              <span className="font-mono text-[10px]">@tolidopakhsh_manoto</span>
            </a>

            <span className="text-stone-700 hidden sm:inline">|</span>

            {/* Direct Phone Call */}
            <a
              href={`tel:${BRAND_INFO.primaryPhone}`}
              className="text-[#FAF7F2] hover:text-[#D4AF37] font-bold flex items-center gap-1 font-mono transition-colors"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span>{BRAND_INFO.primaryPhoneDisplay}</span>
            </a>

            <span className="text-stone-700">|</span>

            <button
              type="button"
              id="btn-nav-admin-portal"
              onClick={onSwitchToAdmin}
              className="text-stone-400 hover:text-white transition-colors flex items-center gap-1 font-bold"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">پرتال مدیریت ادمین</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            className="cursor-pointer group flex items-center gap-3"
            onClick={onOpenAboutModal}
            title="اطلاعات موسسه تولید و پخش من و تو (اسدی)"
          >
            <div className="bg-[#FAF7F2] border border-[#E6DEC8] p-1.5 sm:p-2 rounded-2xl shadow-xs group-hover:border-[#18181B] transition-all">
              <ManotoLogo size="md" showPersianSub={false} />
            </div>

            <div className="hidden lg:block border-r border-[#E6DEC8] pr-3">
              <span className="text-xs font-black text-[#18181B] block">
                تولید و پخش پوشاک من و تو
              </span>
              <span className="text-[10px] text-[#8C6D37] font-bold block">
                مدیریت اسدی • بازار بزرگ تهران
              </span>
            </div>
          </div>

          {/* Search Input Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جستجوی مدل، پارچه (کتان، پنبه، غواصی) یا کد کالا..."
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-white border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/15 focus:border-[#18181B] text-xs text-stone-900 transition-all placeholder:text-stone-400 shadow-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Customer Account / Login / Portal Button */}
            <button
              type="button"
              id="btn-customer-account"
              onClick={onOpenCustomerAuthOrPortal}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                loggedInCustomer
                  ? 'bg-[#18181B] text-[#FAF7F2] border border-[#3F3F46]'
                  : 'bg-white hover:bg-[#FAF7F2] text-stone-900 border border-[#DDD5C0]'
              }`}
              title={loggedInCustomer ? `حساب کاربری: ${loggedInCustomer.fullName}` : 'ورود یا عضویت خریداران'}
            >
              <User className={`w-4 h-4 ${loggedInCustomer ? 'text-[#D4AF37]' : 'text-[#8C6D37]'}`} />
              <span className="hidden sm:inline truncate max-w-[110px]">
                {loggedInCustomer ? loggedInCustomer.fullName : 'ورود / ثبت‌نام'}
              </span>
            </button>

            {/* About & Contact Info Button */}
            <button
              type="button"
              id="btn-header-contact"
              onClick={onOpenAboutModal}
              className="hidden sm:flex items-center gap-1.5 py-2 px-3 bg-white hover:bg-[#FAF7F2] text-stone-900 border border-[#DDD5C0] rounded-xl text-xs font-bold transition-colors shadow-xs"
              title="آدرس دقیق و تلفن‌های کارگاه"
            >
              <MapPin className="w-4 h-4 text-[#8C6D37]" />
              <span>تماس و آدرس بازار</span>
            </button>

            {/* VIP Partner Wholesale Button */}
            <button
              type="button"
              id="btn-header-partner"
              onClick={onOpenPartnerModal}
              className={`hidden sm:flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isPartnerLoggedIn
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                  : 'bg-white hover:bg-[#FAF7F2] text-stone-900 border border-[#DDD5C0]'
              }`}
            >
              {isPartnerLoggedIn ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>همکار VIP (فعال)</span>
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4 text-[#8C6D37]" />
                  <span>ورود همکاران</span>
                </>
              )}
            </button>

            {/* Order Tracking Button */}
            <button
              type="button"
              id="btn-header-tracking"
              onClick={onOpenTracking}
              className="flex items-center gap-1.5 py-2 px-3 bg-white hover:bg-[#FAF7F2] text-stone-900 border border-[#DDD5C0] rounded-xl text-xs font-bold transition-colors shadow-xs"
              title="پیگیری بارنامه و بیجک باربری"
            >
              <Truck className="w-4 h-4 text-[#8C6D37]" />
              <span className="hidden xl:inline">پیگیری بیجک</span>
            </button>

            {/* Cart Button */}
            <button
              type="button"
              id="btn-header-cart"
              onClick={onOpenCart}
              className="relative py-2.5 px-4 bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden xs:inline">سبد خرید</span>
              {cartItemsCount > 0 && (
                <span className="w-5 h-5 bg-[#B89B58] text-[#18181B] font-black rounded-full flex items-center justify-center text-[10px] shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="جستجوی مدل یا کد کالا در کاتالوگ..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-900 shadow-xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
          </div>
        </div>

      </div>
    </header>
  );
};


