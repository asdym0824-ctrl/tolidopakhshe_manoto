import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Home, 
  Truck, 
  User, 
  Bot, 
  Sparkles
} from 'lucide-react';
import { CustomerUser } from '../../types';

export type MobileNavSection = 'home' | 'tracking' | 'cart' | 'ai' | 'profile';

interface MobileBottomNavBarProps {
  cartItemsCount: number;
  onOpenCart: () => void;
  onScrollToCatalog: () => void;
  onOpenTracking: () => void;
  onOpenCustomerAuthOrPortal: () => void;
  onOpenPartnerModal: () => void;
  onOpenAiAssistant: () => void;
  loggedInCustomer: CustomerUser | null;
  isPartnerLoggedIn: boolean;
  activeSection?: MobileNavSection;
  onSectionChange?: (section: MobileNavSection) => void;
}

export const MobileBottomNavBar: React.FC<MobileBottomNavBarProps> = ({
  cartItemsCount,
  onOpenCart,
  onScrollToCatalog,
  onOpenTracking,
  onOpenCustomerAuthOrPortal,
  onOpenPartnerModal,
  onOpenAiAssistant,
  loggedInCustomer,
  isPartnerLoggedIn,
  activeSection = 'home',
  onSectionChange
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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-lg border-t border-[#E6DEC8] px-2 pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+6px)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      dir="rtl"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto relative">
        
        {/* 1. Home / Catalog (ویترین) */}
        <button
          type="button"
          onClick={() => handleSelect('home', onScrollToCatalog)}
          className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
            currentActive === 'home'
              ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm ring-1 ring-stone-900/10'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
          aria-current={currentActive === 'home' ? 'page' : undefined}
        >
          {currentActive === 'home' && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#D4AF37] shadow-xs" />
          )}
          <Home className={`w-5 h-5 transition-transform ${currentActive === 'home' ? 'text-[#D4AF37] scale-110' : 'text-stone-700'}`} />
          <span className={`text-[10px] mt-0.5 transition-colors ${currentActive === 'home' ? 'font-black text-[#FAF7F2]' : 'font-bold'}`}>
            ویترین
          </span>
        </button>

        {/* 2. Tracking Orders / Bijak (پیگیری بارنامه) */}
        <button
          type="button"
          onClick={() => handleSelect('tracking', onOpenTracking)}
          className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
            currentActive === 'tracking'
              ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm ring-1 ring-stone-900/10'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
          aria-current={currentActive === 'tracking' ? 'page' : undefined}
        >
          {currentActive === 'tracking' && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#D4AF37] shadow-xs" />
          )}
          <Truck className={`w-5 h-5 transition-transform ${currentActive === 'tracking' ? 'text-[#D4AF37] scale-110' : 'text-[#8C6D37]'}`} />
          <span className={`text-[10px] mt-0.5 transition-colors ${currentActive === 'tracking' ? 'font-black text-[#FAF7F2]' : 'font-bold'}`}>
            پیگیری بارنامه
          </span>
        </button>

        {/* 3. Central Cart Button (High Visibility) */}
        <button
          type="button"
          id="btn-mobile-nav-cart"
          onClick={() => handleSelect('cart', onOpenCart)}
          className={`relative -top-3 flex flex-col items-center justify-center bg-[#18181B] text-[#FAF7F2] w-13 h-13 rounded-2xl shadow-xl border-2 border-[#FAF7F2] active:scale-90 transition-all ${
            currentActive === 'cart'
              ? 'ring-4 ring-[#D4AF37]/50 scale-105'
              : ''
          }`}
          aria-current={currentActive === 'cart' ? 'page' : undefined}
        >
          <ShoppingBag className={`w-6 h-6 ${currentActive === 'cart' ? 'text-amber-300' : 'text-[#D4AF37]'}`} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#B89B58] text-[#18181B] font-black rounded-full flex items-center justify-center text-[10px] ring-2 ring-white">
              {cartItemsCount}
            </span>
          )}
        </button>

        {/* 4. AI Assistant (مشاور هوشمند) */}
        <button
          type="button"
          onClick={() => handleSelect('ai', onOpenAiAssistant)}
          className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
            currentActive === 'ai'
              ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm ring-1 ring-stone-900/10'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
          aria-current={currentActive === 'ai' ? 'page' : undefined}
        >
          {currentActive === 'ai' && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#D4AF37] shadow-xs" />
          )}
          <div className="relative">
            <Bot className={`w-5 h-5 transition-transform ${currentActive === 'ai' ? 'text-[#D4AF37] scale-110' : 'text-[#8C6D37]'}`} />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
          </div>
          <span className={`text-[10px] mt-0.5 transition-colors ${currentActive === 'ai' ? 'font-black text-[#FAF7F2]' : 'font-bold'}`}>
            مشاور هوشمند
          </span>
        </button>

        {/* 5. User Profile / Wholesale Partner (حساب کاربری / پروفایل) */}
        <button
          type="button"
          onClick={() => handleSelect('profile', onOpenCustomerAuthOrPortal)}
          className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
            currentActive === 'profile'
              ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm ring-1 ring-stone-900/10'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
          aria-current={currentActive === 'profile' ? 'page' : undefined}
        >
          {currentActive === 'profile' && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#D4AF37] shadow-xs" />
          )}
          <User className={`w-5 h-5 transition-transform ${
            currentActive === 'profile'
              ? 'text-[#D4AF37] scale-110'
              : loggedInCustomer 
              ? 'text-emerald-700' 
              : 'text-stone-800'
          }`} />
          <span className={`text-[10px] mt-0.5 truncate max-w-[55px] transition-colors ${
            currentActive === 'profile' ? 'font-black text-[#FAF7F2]' : 'font-bold'
          }`}>
            {loggedInCustomer ? loggedInCustomer.fullName.split(' ')[0] : 'حساب من'}
          </span>
        </button>

      </div>
    </nav>
  );
};
