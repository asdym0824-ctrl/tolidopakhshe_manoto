import React, { useState } from 'react';
import { 
  Ruler, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  Check, 
  X, 
  ShieldCheck, 
  Scissors,
  Shirt
} from 'lucide-react';

interface WomenSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  category?: string;
}

export const WomenSizeGuideModal: React.FC<WomenSizeGuideModalProps> = ({
  isOpen,
  onClose,
  productName = 'پوشاک زنانه من و تو',
  category = 'شلوار زنانه',
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'pants' | 'blouse' | 'measureGuide'>('pants');

  const pantsSizes = [
    { size: 'M (۳۸-۴۰)', waist: '۶۸ تا ۷۶', hip: '۹۴ تا ۱۰۲', thigh: '۵۴ تا ۵۸', length: '۱۰۰ تا ۱۰۵' },
    { size: 'L (۴۲-۴۴)', waist: '۷۶ تا ۸۴', hip: '۱۰۲ تا ۱۱۰', thigh: '۵۸ تا ۶۲', length: '۱۰۲ تا ۱۰۶' },
    { size: 'XL (۴۶-۴۸)', waist: '۸۴ تا ۹۴', hip: '۱۱۰ تا ۱۲۰', thigh: '۶۲ تا ۶۸', length: '۱۰۳ تا ۱۰۶' },
    { size: '2XL (۵۰-۵۲)', waist: '۹۴ تا ۱۰۶', hip: '۱۲۰ تا ۱۳۰', thigh: '۶۸ تا ۷۴', length: '۱۰۴ تا ۱۰۸' },
    { size: 'فری‌سایز کشی (۳۸ تا ۴۶)', waist: '۶۸ تا ۹۲', hip: '۹۶ تا ۱۱۶', thigh: '۵۶ تا ۶۴', length: '۱۰۲ تا ۱۰۵' },
  ];

  const topsSizes = [
    { size: 'فری‌سایز مانتو / شومیز', bust: '۹۵ تا ۱۱۸', shoulder: '۴۰ تا ۴۶', sleeve: '۵۶ تا ۶۰', length: '۷۵ تا ۸۵' },
    { size: 'L (شومیز ۴۰-۴۲)', bust: '۹۲ تا ۹۸', shoulder: '۳۹ تا ۴۱', sleeve: '۵۷', length: '۷۰' },
    { size: 'XL (شومیز ۴۴-۴۶)', bust: '۹۹ تا ۱۰۸', shoulder: '۴۱ تا ۴۳', sleeve: '۵۸', length: '۷۲' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#EAE4D9] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE4D9] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs border border-[#D4AF37]/30">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-stone-900">
                  راهنمای سایزبندی و اندازه‌گیری تخصصی بانوان
                </h3>
                <span className="bg-[#D4AF37]/15 text-[#8C6D37] border border-[#D4AF37]/30 text-[9.5px] font-black px-2 py-0.5 rounded-full">
                  قواره استاندارد بازار
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                مخصوص مدل‌های کارگاه تولیدی من و تو • بدون خطا در انتخاب آنلاین
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

        {/* Tab Switcher */}
        <div className="p-3 bg-white border-b border-[#EAE4D9] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('pants')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pants'
                ? 'bg-[#18181B] text-[#FAF8F5] shadow-xs'
                : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-[#EAE4D9]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>شلوار زنانه (بگ، جاگر، لگ و راسته)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blouse')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'blouse'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-[#EAE4D9]'
            }`}
          >
            <Shirt className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>شومیز، مانتو و ست خانگی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('measureGuide')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'measureGuide'
                ? 'bg-[#D4AF37] text-[#18181B] shadow-xs'
                : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-[#EAE4D9]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">نحوه متر زدن</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {activeTab === 'pants' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-[#EAE4D9]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#FAF8F5] text-stone-700 font-bold border-b border-[#EAE4D9]">
                    <tr>
                      <th className="p-3">سایز معادل</th>
                      <th className="p-3">دور کمر (سانتی‌متر)</th>
                      <th className="p-3">دور باسن</th>
                      <th className="p-3">دور ران</th>
                      <th className="p-3">قد شلوار</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE4D9]/80 text-stone-800">
                    {pantsSizes.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]/40'}>
                        <td className="p-3 font-black text-stone-900">{row.size}</td>
                        <td className="p-3">{row.waist}</td>
                        <td className="p-3">{row.hip}</td>
                        <td className="p-3">{row.thigh}</td>
                        <td className="p-3 font-mono font-bold text-[#8C6D37]">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Free-size elastic advice */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div className="text-xs text-amber-950 leading-relaxed">
                  <span className="font-bold block mb-1">نکته تنخور مدل‌های فری‌سایز کمرکش من و تو:</span>
                  بیشتر مدل‌های شلوار بگ و راحتی ما دارای کش ۴ سانتی صنعتی با خاصیت بازشوندگی بالا هستند. بنابراین روی بازه وسیعی از اندام‌ها (سایز ۳۸ تا ۴۶) کاملاً خوش‌فرم، شیک و بدون احساس فشار می‌ایستد.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blouse' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-[#EAE4D9]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#FAF8F5] text-stone-700 font-bold border-b border-[#EAE4D9]">
                    <tr>
                      <th className="p-3">سایز</th>
                      <th className="p-3">دور سینه</th>
                      <th className="p-3">عرض سرشانه</th>
                      <th className="p-3">قد آستین</th>
                      <th className="p-3">قد لباس</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE4D9]/80 text-stone-800">
                    {topsSizes.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]/40'}>
                        <td className="p-3 font-black text-stone-900">{row.size}</td>
                        <td className="p-3">{row.bust}</td>
                        <td className="p-3">{row.shoulder}</td>
                        <td className="p-3">{row.sleeve}</td>
                        <td className="p-3 font-mono font-bold text-[#8C6D37]">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'measureGuide' && (
            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] space-y-1">
                  <span className="font-black text-stone-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#18181B] text-[#D4AF37] flex items-center justify-center text-[10px]">۱</span>
                    اندازه‌گیری دور کمر
                  </span>
                  <p className="text-[11px] text-stone-600">
                    متر خیاطی را دور باریک‌ترین قسمت گودی کمر بدون فشردن بیش از حد قرار دهید.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] space-y-1">
                  <span className="font-black text-stone-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#18181B] text-[#D4AF37] flex items-center justify-center text-[10px]">۲</span>
                    اندازه‌گیری دور باسن
                  </span>
                  <p className="text-[11px] text-stone-600">
                    متر را دور برجسته‌ترین قسمت باسن عبور دهید تا آزادترین عدد به دست آید.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>اگر بین دو سایز شک دارید، همواره سایز بزرگتر را برای تنخور آزادتر انتخاب نمایید.</span>
              </div>
            </div>
          )}

          {/* Guarantee Badges footer */}
          <div className="pt-3 border-t border-[#EAE4D9] flex flex-wrap items-center justify-around gap-2 text-[10.5px] font-bold text-stone-600">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              قواره استاندارد بانوان ایران
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              الگوی دوخت تنخور ژورنالی
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              تضمین بدون کشیدگی فاق
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#FAF8F5] border-t border-[#EAE4D9] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-[#18181B] hover:bg-stone-800 text-[#FAF8F5] rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            متوجه شدم، بستن راهنما
          </button>
        </div>

      </div>
    </div>
  );
};
