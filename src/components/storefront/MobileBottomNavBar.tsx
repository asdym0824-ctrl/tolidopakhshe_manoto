import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Home, 
  Truck, 
  User, 
  Bot, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { CustomerUser } from '../../types';

export type MobileNavSection = 'home' | 'tracking' | 'contact' | 'cart' | 'ai' | 'profile';

interface MobileBottomNavBarProps {
  cartItemsCount: number;
  onOpenCart: () => void;
  onScrollToCatalog: () => void;
  onOpenTracking?: () => void;
  onOpenAboutModal?: () => void;
  onOpenCustomerAuthOrPortal: () => void;
  onOpenPartnerModal: () => void;
  onOpenAiAssistant: () => void;
  loggedInCustomer: CustomerUser | null;
  isPartnerLoggedIn: boolean;
  activeSection?: MobileNavSection;
  onSectionChange?: (section: MobileNavSection) => void;
  isVisible?: boolean;
}

export const MobileBottomNavBar: React.FC<MobileBottomNavBarProps> = ({
  cartItemsCount,
  onOpenCart,
  onScrollToCatalog,
  onOpenTracking,
  onOpenAboutModal,
  onOpenCustomerAuthOrPortal,
  onOpenPartnerModal,
  onOpenAiAssistant,
  loggedInCustomer,
  isPartnerLoggedIn,
  activeSection = 'home',
  onSectionChange,
  isVisible = true
}) => {
  const [currentActive, setCurrentActive] = useState<MobileNavSection>(activeSection);

  useEffect(() => {
    if (activeSection) {
      setCurrentActive(activeSection);
    }
  }, [activeSection]);

  const handleSelect = (section: MobileNavSection, action: () => void) => {
    setCurrentActive(section);
    if (onSectionChange) {
      onSectionChange(section);
    }
    action();
  };

  return (
    <nav 
      id="mobile-sticky-bottom-nav"
      aria-label="منوی دسترسی سریع موبایل"
      className={`md:hidden fixed bottom-0 inset-x-0 z-[60] bg-[#0E0E12]/95 backdrop-blur-xl border-t border-[#D4AF37]/35 px-2 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] shadow-[0_-8px_32px_rgba(0,0,0,0.6)] overflow-visible transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'translate-y-0 opacity-100 pointer-events-auto' 
          : 'translate-y-full opacity-0 pointer-events-none invisible'
      }`}
      dir="rtl"
    >
      {/* Top golden luminous accent hairline */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent pointer-events-none" />
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-8 bg-[#D4AF37]/15 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-end justify-around max-w-lg mx-auto relative overflow-visible h-14">
        
        {/* 1. Home / Catalog (ویترین) */}
        <button
          type="button"
          onClick={() => handleSelect('home', onScrollToCatalog)}
          className={`relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
            currentActive === 'home'
              ? '-translate-y-3.5 bg-gradient-to-b from-[#24242C] to-[#121217] text-[#FAF7F2] border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/25 shadow-2xl shadow-black/90 py-2 px-3 z-10 scale-105'
              : 'translate-y-0 text-stone-400 hover:text-white hover:bg-white/5 border border-transparent py-1.5 px-2.5'
          }`}
          aria-current={currentActive === 'home' ? 'page' : undefined}
        >
          {currentActive === 'home' && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] shadow-xs" />
          )}
          <Home className={`transition-all duration-200 ${
            currentActive === 'home' 
              ? 'w-5 h-5 text-[#D4AF37] scale-110 drop-shadow-xs' 
              : 'w-5 h-5 text-[#D4AF37]/80'
          }`} />
          <span className={`text-[10px] mt-0.5 transition-colors ${
            currentActive === 'home' ? 'font-black text-[#FAF7F2]' : 'font-medium text-stone-300'
          }`}>
            ویترین
          </span>
        </button>

        {/* 2. Address & Contact (آدرس و ارتباطات) */}
        <button
          type="button"
          onClick={() => {
            const handler = onOpenAboutModal || onOpenTracking || (() => {});
            handleSelect('contact', handler);
          }}
          className={`relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
            currentActive === 'contact' || currentActive === 'tracking'
              ? '-translate-y-3.5 bg-gradient-to-b from-[#24242C] to-[#121217] text-[#FAF7F2] border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/25 shadow-2xl shadow-black/90 py-2 px-3 z-10 scale-105'
              : 'translate-y-0 text-stone-400 hover:text-white hover:bg-white/5 border border-transparent py-1.5 px-2.5'
          }`}
          aria-current={currentActive === 'contact' || currentActive === 'tracking' ? 'page' : undefined}
        >
          {(currentActive === 'contact' || currentActive === 'tracking') && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] shadow-xs" />
          )}
          <MapPin className={`transition-all duration-200 ${
            currentActive === 'contact' || currentActive === 'tracking' 
              ? 'w-5 h-5 text-[#D4AF37] scale-110 drop-shadow-xs' 
              : 'w-5 h-5 text-[#D4AF37]/80'
          }`} />
          <span className={`text-[10px] mt-0.5 transition-colors whitespace-nowrap ${
            currentActive === 'contact' || currentActive === 'tracking' ? 'font-black text-[#FAF7F2]' : 'font-medium text-stone-300'
          }`}>
            آدرس و ارتباطات
          </span>
        </button>

        {/* 3. Central Cart Button (سبد خرید) */}
        <button
          type="button"
          id="btn-mobile-nav-cart"
          onClick={() => handleSelect('cart', onOpenCart)}
          className={`relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
            currentActive === 'cart'
              ? '-translate-y-3.5 bg-gradient-to-b from-[#24242C] to-[#121217] text-[#FAF7F2] border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/25 shadow-2xl shadow-black/90 py-2 px-3 z-10 scale-105'
              : 'translate-y-0 text-stone-400 hover:text-white hover:bg-white/5 border border-transparent py-1.5 px-2.5'
          }`}
          aria-current={currentActive === 'cart' ? 'page' : undefined}
        >
          {currentActive === 'cart' && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] shadow-xs" />
          )}
          <div className="relative">
            <ShoppingBag className={`transition-all duration-200 ${
              currentActive === 'cart' 
                ? 'w-5 h-5 text-[#D4AF37] scale-110 drop-shadow-xs' 
                : 'w-5 h-5 text-[#D4AF37]/80'
            }`} />
            {cartItemsCount > 0 && (
              <span className={`absolute -top-2 -right-2.5 min-w-4.5 h-4.5 px-1 font-black rounded-full flex items-center justify-center text-[9px] ${
                currentActive === 'cart'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-amber-300 text-[#18181B] ring-2 ring-[#0E0E12]'
                  : 'bg-gradient-to-r from-[#D4AF37] to-amber-300 text-[#18181B] font-black ring-1 ring-black'
              }`}>
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-0.5 transition-colors ${
            currentActive === 'cart' ? 'font-black text-[#FAF7F2]' : 'font-medium text-stone-300'
          }`}>
            سبد خرید
          </span>
        </button>

        {/* 4. AI Assistant (مشاور هوشمند) */}
        <button
          type="button"
          onClick={() => handleSelect('ai', onOpenAiAssistant)}
          className={`relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
            currentActive === 'ai'
              ? '-translate-y-3.5 bg-gradient-to-b from-[#24242C] to-[#121217] text-[#FAF7F2] border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/25 shadow-2xl shadow-black/90 py-2 px-3 z-10 scale-105'
              : 'translate-y-0 text-stone-400 hover:text-white hover:bg-white/5 border border-transparent py-1.5 px-2.5'
          }`}
          aria-current={currentActive === 'ai' ? 'page' : undefined}
        >
          {currentActive === 'ai' && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] shadow-xs" />
          )}
          <div className="relative">
            <Bot className={`transition-all duration-200 ${
              currentActive === 'ai' 
                ? 'w-5 h-5 text-[#D4AF37] scale-110 drop-shadow-xs' 
                : 'w-5 h-5 text-[#D4AF37]/80'
            }`} />
            <span className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full animate-pulse ${
              currentActive === 'ai' ? 'bg-amber-300' : 'bg-[#D4AF37]'
            }`} />
          </div>
          <span className={`text-[10px] mt-0.5 transition-colors ${
            currentActive === 'ai' ? 'font-black text-[#FAF7F2]' : 'font-medium text-stone-300'
          }`}>
            مشاور هوشمند
          </span>
        </button>

        {/* 5. User Profile / Wholesale Partner (حساب کاربری / پروفایل) */}
        <button
          type="button"
          onClick={() => handleSelect('profile', onOpenCustomerAuthOrPortal)}
          className={`relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
            currentActive === 'profile'
              ? '-translate-y-3.5 bg-gradient-to-b from-[#24242C] to-[#121217] text-[#FAF7F2] border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/25 shadow-2xl shadow-black/90 py-2 px-3 z-10 scale-105'
              : 'translate-y-0 text-stone-400 hover:text-white hover:bg-white/5 border border-transparent py-1.5 px-2.5'
          }`}
          aria-current={currentActive === 'profile' ? 'page' : undefined}
        >
          {currentActive === 'profile' && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] shadow-xs" />
          )}
          <User className={`transition-all duration-200 ${
            currentActive === 'profile'
              ? 'w-5 h-5 text-[#D4AF37] scale-110 drop-shadow-xs'
              : loggedInCustomer 
              ? 'w-5 h-5 text-emerald-400' 
              : 'w-5 h-5 text-[#D4AF37]/80'
          }`} />
          <span className={`text-[10px] mt-0.5 truncate max-w-[55px] transition-colors ${
            currentActive === 'profile' ? 'font-black text-[#FAF7F2]' : 'font-medium text-stone-300'
          }`}>
            {loggedInCustomer ? loggedInCustomer.fullName.split(' ')[0] : 'حساب من'}
          </span>
        </button>

      </div>
    </nav>
  );
};
