import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  X, 
  ChevronUp, 
  Truck, 
  Clock, 
  Headphones, 
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Send
} from 'lucide-react';
import { BRAND_INFO } from '../../data/brandInfo';

interface StorefrontFloatingSupportWidgetProps {
  onOpenAiAssistant: () => void;
  onOpenTracking?: () => void;
  onOpenAboutModal?: (tab?: 'about' | 'map' | 'contact' | 'terms') => void;
}

export const StorefrontFloatingAiWidget: React.FC<StorefrontFloatingSupportWidgetProps> = ({ 
  onOpenAiAssistant,
  onOpenTracking,
  onOpenAboutModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showAllPhones, setShowAllPhones] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-hide tooltip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div 
      ref={menuRef}
      className="fixed bottom-20 md:bottom-6 left-3 sm:left-6 z-40 flex flex-col items-start gap-2 select-none" 
      dir="rtl"
    >
      
      {/* ========================================================================= */}
      {/* 🌟 EXPANDABLE SUPPORT & AI POPUP CARD                                      */}
      {/* ========================================================================= */}
      {isOpen && (
        <div 
          className="w-[calc(100vw-24px)] max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl border border-[#EAE4D9] shadow-2xl p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300 text-stone-800"
          dir="rtl"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs shrink-0 border border-[#D4AF37]/30">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <h4 className="font-black text-xs sm:text-sm text-stone-900 truncate">
                    پشتیبانی و چت آنلاین من و تو
                  </h4>
                </div>
                <p className="text-[10px] text-stone-500 truncate">
                  پاسخگویی آنی هوش مصنوعی و دفتر بازار
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="بستن پنجره پشتیبانی"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Primary AI Chatbot Action */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenAiAssistant();
            }}
            className="w-full text-right p-3 rounded-2xl bg-gradient-to-r from-[#18181B] via-stone-900 to-[#18181B] text-white border border-[#D4AF37]/50 shadow-md hover:border-[#D4AF37] hover:shadow-[#D4AF37]/20 transition-all group flex items-start gap-3 active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-amber-200 text-[#18181B] flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-300">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-black text-xs text-[#FAF8F5] group-hover:text-[#D4AF37] transition-colors">
                  گفتگو با چتبات هوشمند (AI)
                </span>
                <span className="bg-[#D4AF37] text-[#18181B] text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  آنلاین
                </span>
              </div>
              <p className="text-[10px] text-stone-300 mt-1 leading-relaxed">
                استعلام قیمت پک‌های عمده، شرایط چک صیادی، هزینه باربری و موجودی مدل‌ها
              </p>
            </div>
          </button>

          {/* 2. Direct Phone Call Action */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-950 font-black text-xs">
                <Phone className="w-3.5 h-3.5 text-[#967434]" />
                <span>تماس مستقیم با دفتر بازار بزرگ</span>
              </div>
              <span className="text-[9.5px] text-stone-500 font-bold">۸:۳۰ تا ۱۹:۰۰</span>
            </div>

            {/* Primary Phone Button */}
            <a
              href={`tel:${BRAND_INFO.primaryPhone}`}
              className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-300/70 hover:border-amber-500 shadow-2xs hover:shadow-xs transition-all text-stone-900 group"
            >
              <div className="text-right">
                <span className="text-[10px] text-stone-500 block">مدیریت و سفارشات اصلی (اسدی)</span>
                <span className="font-mono font-black text-xs sm:text-sm text-stone-900 group-hover:text-amber-800 transition-colors">
                  {BRAND_INFO.primaryPhoneDisplay}
                </span>
              </div>
              <span className="py-1 px-2.5 bg-emerald-600 group-hover:bg-emerald-700 text-white font-black text-[10px] rounded-lg shadow-2xs flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>تماس</span>
              </span>
            </a>

            {/* Secondary Phones Toggle */}
            {showAllPhones ? (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
                {BRAND_INFO.secondaryPhones.map((sec, idx) => (
                  <a
                    key={idx}
                    href={`tel:${sec.phone}`}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/90 border border-stone-200 hover:border-amber-400 text-stone-800 text-[11px]"
                  >
                    <span className="text-[10px] text-stone-600">
                      {idx === 0 ? 'واحد فروش و تلگرام:' : 'پیگیری باربری و انبار:'}
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-xs">
                      {sec.display}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAllPhones(true)}
                className="w-full text-center text-[10px] text-amber-800 hover:text-amber-900 font-bold pt-0.5"
              >
                نمایش سایر شماره‌های دفتر و باربری ↓
              </button>
            )}
          </div>

          {/* 3. Messenger Fast Support Badges (WhatsApp, Eitaa, Telegram, Bale) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-stone-500 block text-right">
              ارسال پیام در پیام‌رسان‌ها:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {/* WhatsApp */}
              <a
                href={BRAND_INFO.whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black transition-colors"
                title="پشتیبانی واتساپ"
              >
                <MessageSquare className="w-3 h-3 text-emerald-600" />
                <span>واتساپ</span>
              </a>

              {/* Telegram */}
              <a
                href={BRAND_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-black transition-colors"
                title="کانال و پشتیبانی تلگرام"
              >
                <Send className="w-3 h-3 text-sky-600" />
                <span>تلگرام</span>
              </a>

              {/* Eitaa / Bale */}
              <a
                href={BRAND_INFO.eitaaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-[10px] font-black transition-colors"
                title="پشتیبانی ایتا"
              >
                <ExternalLink className="w-3 h-3 text-orange-600" />
                <span>ایتا و بله</span>
              </a>
            </div>
          </div>

          {/* 4. Tracking and Address Quick Footer */}
          <div className="pt-2 border-t border-[#EAE4D9] flex items-center justify-between text-[10px] text-stone-500 font-bold">
            {onOpenTracking && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenTracking();
                }}
                className="flex items-center gap-1 text-stone-700 hover:text-stone-900 transition-colors"
              >
                <Truck className="w-3 h-3 text-[#967434]" />
                <span>پیگیری بیجک باربری</span>
              </button>
            )}

            {onOpenAboutModal && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAboutModal('map');
                }}
                className="text-[#8C6D37] hover:underline"
              >
                آدرس پاساژ المهدی ۴
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💬 TOOLTIP BUBBLE (PROACTIVE ENGAGEMENT - DESKTOP ONLY)                   */}
      {/* ========================================================================= */}
      {showTooltip && !isOpen && (
        <div 
          onClick={() => {
            setShowTooltip(false);
            setIsOpen(true);
          }}
          className="hidden sm:flex bg-[#18181B] text-[#FAF7F2] p-2.5 px-3 rounded-2xl rounded-bl-xs shadow-xl border border-[#D4AF37]/40 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300 items-start gap-2 cursor-pointer hover:border-[#D4AF37] transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-[#D4AF37] text-[#18181B] flex items-center justify-center shrink-0 font-bold mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-center justify-between">
              <span className="font-black text-[11px] text-[#D4AF37]">پشتیبانی آنلاین و چت هوشمند</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-stone-400 hover:text-white p-0.5 rounded"
                title="بستن پیام"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[10px] text-stone-300 mt-0.5 leading-snug">
              نیاز به راهنمایی خرید عمده، چک صیادی یا تماس با دفتر بازار دارید؟ لمس کنید.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔘 MAIN FLOATING TRIGGER BUTTON (BOTTOM-LEFT)                             */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5">
        
        {/* Main Hub Button - Compact single circular badge on mobile, full pill on desktop */}
        <button
          id="btn-floating-occasion-promo"
          type="button"
          onClick={() => {
            setShowTooltip(false);
            setIsOpen(!isOpen);
          }}
          className="group relative flex items-center gap-2 sm:gap-2.5 bg-gradient-to-r from-[#18181B] via-stone-900 to-[#18181B] text-white p-2.5 sm:px-4 sm:py-3 rounded-full shadow-[0_8px_25px_rgba(24,24,27,0.35)] hover:shadow-[#D4AF37]/25 border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          title="پشتیبانی آنلاین، تماس و چتبات هوشمند"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#D4AF37]/15 animate-ping opacity-50 pointer-events-none" />

          {/* Bot & Headphone Icon with Online Status Dot */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-amber-200 text-[#18181B] flex items-center justify-center shadow-inner font-black group-hover:rotate-12 transition-transform duration-300">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#18181B] rounded-full animate-pulse" />
          </div>

          {/* Typography Label - hidden on small screens for ultra-clean mobile aesthetic */}
          <div className="hidden sm:flex flex-col text-right leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs text-[#FAF8F5] group-hover:text-[#D4AF37] transition-colors">
                پشتیبانی و چتبات
              </span>
              <span className="bg-[#D4AF37] text-[#18181B] text-[9px] font-black px-1.5 py-0.2 rounded-full">
                AI
              </span>
            </div>
            <span className="text-[9.5px] text-stone-400 font-medium">
              تماس فوری یا چت هوشمند
            </span>
          </div>

          <ChevronUp className={`hidden sm:block w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Quick Direct-Call Shortcut Pill (Only visible on desktop sm+, hidden on mobile to keep single button) */}
        <a
          href={`tel:${BRAND_INFO.primaryPhone}`}
          className="hidden sm:flex w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white items-center justify-center shadow-lg hover:shadow-emerald-600/30 border border-emerald-400/40 active:scale-95 transition-all shrink-0"
          title={`تماس تلفنی فوری با دفتر بازار: ${BRAND_INFO.primaryPhoneDisplay}`}
        >
          <Phone className="w-4 h-4" />
        </a>

      </div>

    </div>
  );
};
