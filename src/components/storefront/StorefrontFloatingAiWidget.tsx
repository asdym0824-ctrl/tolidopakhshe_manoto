import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, MessageSquare, X, ChevronUp } from 'lucide-react';

interface StorefrontFloatingAiWidgetProps {
  onOpen: () => void;
}

export const StorefrontFloatingAiWidget: React.FC<StorefrontFloatingAiWidgetProps> = ({ onOpen }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start gap-2" dir="rtl">
      
      {/* Speech Bubble / Tooltip */}
      {showTooltip && (
        <div className="bg-[#18181B] text-[#FAF7F2] p-3 px-4 rounded-2xl rounded-bl-xs shadow-xl border border-[#D4AF37]/40 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#18181B] flex items-center justify-center flex-shrink-0 font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-[#D4AF37]">سوال یا راهنمایی دارید؟</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-stone-400 hover:text-white p-0.5 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-stone-300 mt-1 leading-snug">
              درباره خرید عمده، خرید تکی، ارسال باربری وطن و جنس شلوارها از دستیار هوشمند بپرسید!
            </p>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        id="btn-floating-storefront-ai"
        onClick={onOpen}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#18181B] via-stone-900 to-[#18181B] text-white p-3 sm:px-4 sm:py-3.5 rounded-full shadow-2xl hover:shadow-[#D4AF37]/20 border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {/* Glow effect */}
        <span className="absolute inset-0 rounded-full bg-[#D4AF37]/10 animate-ping opacity-75 pointer-events-none" />

        {/* Bot Icon with glowing badge */}
        <div className="relative">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-amber-200 text-[#18181B] flex items-center justify-center shadow-inner font-black group-hover:rotate-12 transition-transform duration-300">
            <Bot className="w-5 h-5" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#18181B] rounded-full animate-pulse" />
        </div>

        {/* Text Label (Hidden on small mobile if desired, or visible with nice typography) */}
        <div className="hidden sm:flex flex-col text-right pr-1">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs text-[#FAF7F2] group-hover:text-[#D4AF37] transition-colors">
              دستیار هوشمند من و تو
            </span>
            <span className="bg-[#D4AF37] text-[#18181B] text-[9px] font-black px-1.5 py-0.2 rounded-full">
              AI
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-medium">
            پاسخگویی به سوالات پر تکرار
          </span>
        </div>
      </button>

    </div>
  );
};
