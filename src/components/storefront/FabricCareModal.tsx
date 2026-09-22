import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Check, 
  X, 
  Droplets, 
  Sun, 
  Shirt, 
  Flame, 
  Layers,
  ChevronLeft
} from 'lucide-react';

interface FabricCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fabricType?: string;
}

export const FabricCareModal: React.FC<FabricCareModalProps> = ({
  isOpen,
  onClose,
  fabricType = 'پارچه کتان و کرپ زنانه',
}) => {
  if (!isOpen) return null;

  const fabrics = [
    {
      name: 'کتان لایت و پنبه‌ای',
      tag: 'خنک و تنفس‌پذیر تابستانه',
      washTemp: 'حداکثر ۳۰ درجه سانتی‌گراد',
      ironing: 'اتوکشی ملایم در حالت کمی مرطوب',
      features: 'بدون آبرفت پس از شستشوی صنعتی اولیه کارگاه، بسیار سبک و بادوام',
      icon: '🌿',
    },
    {
      name: 'کرپ مازراتی و اسکاچی',
      tag: 'ایستایی مجلسی و شیک',
      washTemp: 'شستشو با دور ملایم ماشین لباسشویی',
      ironing: 'اتوکشی غیرمستقیم با پارچه محافظ',
      features: 'بدون پرزدهی، ضد چروک قوی با ریزش و تنخور بسیار باوقار',
      icon: '✨',
    },
    {
      name: 'نخ پنبه ۱۰۰٪ ارگانیک',
      tag: 'راحتی خانگی و خواب',
      washTemp: 'آب ولرم و شوینده بدون آنزیم قوی',
      ironing: 'نیاز کم به اتوکشی در صورت خشک‌کردن صاف',
      features: 'نهایت لطافت پوستی، ضد حساسیت، رنگ ثابت با ضمانت',
      icon: '☁️',
    },
    {
      name: 'داکرون اداری و پرسنلی',
      tag: 'مقاوم با فرم رسمی',
      washTemp: '۳۰ تا ۴۰ درجه سانتی‌گراد',
      ironing: 'اتوکشی سریع با بخار متوسط',
      features: 'تراکم تار و پود بالا، ثبات رنگ فوق‌العاده در استفاده روزمره اداری',
      icon: '👔',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#EAE4D9] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE4D9] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-700 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-stone-900">
                  شناسنامه پارچه و راهنمای نگهداری لباس
                </h3>
                <span className="bg-amber-100 text-amber-900 text-[9.5px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                  گارانتی ثبات بافت
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                توصیه‌های کارگاه برای افزایش طول عمر و حفظ نو بودن پوشاک زنانه
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fabrics.map((f, i) => (
              <div key={i} className="p-3.5 rounded-2xl border border-[#EAE4D9] bg-[#FAF8F5]/60 hover:bg-white transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{f.icon}</span>
                    <span className="font-black text-xs sm:text-sm text-stone-900">{f.name}</span>
                  </div>
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    {f.tag}
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {f.features}
                </p>

                <div className="pt-2 border-t border-[#EAE4D9]/80 space-y-1 text-[10.5px] text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>شستشو: {f.washTemp}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>اتوکشی: {f.ironing}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3 Golden Rules */}
          <div className="bg-stone-900 text-[#FAF8F5] p-4 rounded-2xl space-y-2 border border-stone-800">
            <span className="text-xs font-black text-[#D4AF37] block">
              ⭐ ۳ اصل طلایی ماندگاری پوشاک تولید من و تو:
            </span>
            <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>لباس‌ها را قبل از انداختن در ماشین لباسشویی پشت و رو کنید تا درخشش پارچه حفظ شود.</li>
              <li>از مایع لباسشویی بدون نرم‌کننده غلیظ استفاده کنید تا خاصیت کشسانی نخ آسیب نبیند.</li>
              <li>خشک‌کردن در سایه و روی چوب‌لباسی مانع چروک شدن و تغییر قواره پارچه می‌شود.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#FAF8F5] border-t border-[#EAE4D9] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-[#18181B] hover:bg-stone-800 text-[#FAF8F5] rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            بستن راهنما
          </button>
        </div>

      </div>
    </div>
  );
};
