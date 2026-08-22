import React from 'react';
import { 
  ShoppingBag, 
  Home, 
  Search, 
  Truck, 
  User, 
  Building2, 
  Bot, 
  Phone,
  Sparkles
} from 'lucide-react';
import { CustomerUser } from '../../types';

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
  isPartnerLoggedIn
}) => {
  return (
    <nav 
      id="mobile-sticky-bottom-nav"
      aria-label="منوی دسترسی سریع موبایل"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-lg border-t border-[#E6DEC8] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      dir="rtl"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        
        {/* 1. Home / Catalog */}
        <button
          type="button"
          onClick={onScrollToCatalog}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-stone-700 hover:text-stone-900 active:scale-95 transition-all"
        >
          <Home className="w-5 h-5 text-stone-800" />
          <span className="text-[10px] font-bold mt-0.5">ویترین</span>
        </button>

        {/* 2. Tracking Orders / Bijak */}
        <button
          type="button"
          onClick={onOpenTracking}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-stone-700 hover:text-stone-900 active:scale-95 transition-all"
        >
          <Truck className="w-5 h-5 text-[#8C6D37]" />
          <span className="text-[10px] font-bold mt-0.5">پیگیری بارنامه</span>
        </button>

        {/* 3. Central Cart Button (High Visibility) */}
        <button
          type="button"
          id="btn-mobile-nav-cart"
          onClick={onOpenCart}
          className="relative -top-3 flex flex-col items-center justify-center bg-[#18181B] text-[#FAF7F2] w-13 h-13 rounded-2xl shadow-xl border-2 border-[#FAF7F2] active:scale-90 transition-transform"
        >
          <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#B89B58] text-[#18181B] font-black rounded-full flex items-center justify-center text-[10px] ring-2 ring-white">
              {cartItemsCount}
            </span>
          )}
        </button>

        {/* 4. AI Assistant */}
        <button
          type="button"
          onClick={onOpenAiAssistant}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-stone-700 hover:text-stone-900 active:scale-95 transition-all"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#8C6D37]" />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] font-bold mt-0.5">مشاور هوشمند</span>
        </button>

        {/* 5. User Profile / Wholesale Partner */}
        <button
          type="button"
          onClick={onOpenCustomerAuthOrPortal}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-stone-700 hover:text-stone-900 active:scale-95 transition-all"
        >
          <User className={`w-5 h-5 ${loggedInCustomer ? 'text-emerald-700' : 'text-stone-800'}`} />
          <span className="text-[10px] font-bold mt-0.5 truncate max-w-[50px]">
            {loggedInCustomer ? loggedInCustomer.fullName.split(' ')[0] : 'حساب من'}
          </span>
        </button>

      </div>
    </nav>
  );
};
