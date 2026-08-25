import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  Calculator, 
  Sparkles, 
  ArrowUp, 
  MessageCircle, 
  Phone,
  Layers
} from 'lucide-react';
import { CartItem } from '../../types';
import { BRAND_INFO } from '../../data/brandInfo';

interface FloatingQuickDockProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenRoiCalculator: () => void;
  onOpenAiAssistant: () => void;
  onScrollToCatalog: () => void;
}

export const FloatingQuickDock: React.FC<FloatingQuickDockProps> = ({
  cartItems,
  onOpenCart,
  onOpenRoiCalculator,
  onOpenAiAssistant,
  onScrollToCatalog,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartToman = cartItems.reduce((acc, item) => acc + item.totalPriceToman, 0);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw] pointer-events-none" dir="rtl">
      <div className="pointer-events-auto bg-[#18181B]/95 backdrop-blur-md text-[#FAF7F2] p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#D4AF37]/50 shadow-2xl flex items-center gap-1.5 sm:gap-2.5 transition-all">
        
        {/* Cart Trigger Badge / Button */}
        <button
          type="button"
          onClick={onOpenCart}
          className={`flex items-center gap-2 py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl font-black text-xs transition-all shadow-xs cursor-pointer ${
            totalCartCount > 0
              ? 'bg-[#D4AF37] text-[#18181B] hover:bg-amber-400 ring-2 ring-[#D4AF37]/40'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
          }`}
          title="مشاهده و تسویه سبد خرید"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="hidden xs:inline">
            {totalCartCount > 0 ? (
              <span>{totalCartToman.toLocaleString('fa-IR')} ت</span>
            ) : (
              <span>سبد خرید</span>
            )}
          </span>
        </button>

        <div className="h-6 w-px bg-stone-700 hidden sm:block" />

        {/* ROI Profit Calculator Trigger */}
        <button
          type="button"
          onClick={onOpenRoiCalculator}
          className="flex items-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl sm:rounded-2xl text-xs font-bold transition-all cursor-pointer"
          title="محاسبه‌گر سود بوتیک و آنلاین‌شاپ"
        >
          <Calculator className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="hidden md:inline">محاسبه سود مغازه</span>
        </button>

        {/* AI Stylist & Stock Advisor Trigger */}
        <button
          type="button"
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl sm:rounded-2xl text-xs font-bold transition-all cursor-pointer"
          title="دستیار هوشمند استایل و مشاوره خرید عمده بازار"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="hidden lg:inline">مشاوره هوشمند بازار</span>
        </button>

        {/* WhatsApp Direct Chat */}
        <a
          href={BRAND_INFO.whatsappDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl sm:rounded-2xl transition-all shadow-xs"
          title="ارتباط مستقیم در واتساپ"
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* Scroll To Top (Conditional) */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl sm:rounded-2xl transition-all shadow-xs cursor-pointer animate-fadeIn"
            title="بازگشت به ابتدای صفحه"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

      </div>
    </div>
  );
};
