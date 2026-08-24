import React from 'react';
import { Package, ShoppingBag, Send, Phone, MapPin, ArrowDown, ShieldCheck, Sparkles, Navigation } from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';
import { BRAND_INFO } from '../../data/brandInfo';

interface StorefrontHeroProps {
  onScrollToCatalog: () => void;
  onFilterRetailOnly: () => void;
  onFilterWholesalePacks: () => void;
  onOpenRoutingModal?: () => void;
  totalProductsCount: number;
}

export const StorefrontHero: React.FC<StorefrontHeroProps> = ({
  onScrollToCatalog,
  onFilterRetailOnly,
  onFilterWholesalePacks,
  onOpenRoutingModal,
  totalProductsCount
}) => {
  return (
    <div className="relative bg-[#FAF7F2] pt-8 pb-12 sm:pb-16 border-b border-[#E6DEC8] overflow-hidden" dir="rtl">
      
      {/* Background Subtle Elegant Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#EBE3D3]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Main Fashion Brand Identity Display Card */}
          <div className="inline-block mx-auto bg-[#FAF7F2] border border-[#E6DEC8] px-8 sm:px-12 py-6 rounded-3xl shadow-sm relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#18181B] text-[#FAF7F2] px-3.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Atelier & Wholesale Hub
            </div>
            <ManotoLogo size="xl" showPersianSub={false} />
            <div className="mt-3 text-xs sm:text-sm font-bold text-stone-800">
              تولید و پخش عمده و تک پوشاک زنانه <span className="text-[#8C6D37] font-black">«اسدی»</span>
            </div>
            
            {onOpenRoutingModal ? (
              <button
                type="button"
                onClick={onOpenRoutingModal}
                className="mt-2 text-[11px] text-stone-700 bg-white hover:bg-[#F4ECE1] border border-[#DDD5C0] px-3 py-1 rounded-full inline-flex items-center justify-center gap-1.5 font-bold transition-all shadow-2xs group cursor-pointer"
                title="کلیک برای مشاهده نقشه، لوکیشن و مسیریابی در بازار تهران"
              >
                <MapPin className="w-3.5 h-3.5 text-[#8C6D37] group-hover:scale-110 transition-transform" />
                <span>بازار بزرگ تهران • بازار عباس‌آباد • پاساژ المهدی ۴، پلاک ۲۴۲</span>
                <span className="bg-[#18181B] text-[#D4AF37] text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  نقشه و مسیریابی
                </span>
              </button>
            ) : (
              <div className="text-[11px] text-stone-600 mt-1 flex items-center justify-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#8C6D37] inline" />
                <span>بازار بزرگ تهران • بازار عباس‌آباد • پاساژ المهدی ۴، پلاک ۲۴۲</span>
              </div>
            )}
          </div>

          {/* Headline & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#18181B] leading-tight tracking-tight">
              تولید و پخش مستقیم پوشاک زنانه از کارگاه بازار
            </h1>
            <p className="text-xs sm:text-base text-stone-700 leading-relaxed max-w-2xl mx-auto">
              تامین‌کننده معتبر بوتیک‌ها، ارزان‌سراها و آنلاین‌شاپ‌های کشور با قیمت کف بازار • فروش در پک‌های ۴، ۶، ۸ و ۱۲ تایی جور با امکان خرید تکی در مدل‌های دارای موجودی آزاد.
            </p>
          </div>

          {/* Quick Contact & Verified Phone Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs">
            <a
              href={`tel:${BRAND_INFO.primaryPhone}`}
              className="bg-white border border-[#DDD5C0] hover:border-[#18181B] px-4 py-2.5 rounded-xl text-stone-900 font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>تلفن دفتر:</span>
              <span dir="ltr" className="text-[#8C6D37] font-black tracking-wider tabular-nums font-['Vazirmatn',sans-serif]">
                {BRAND_INFO.primaryPhoneDisplay}
              </span>
            </a>

            <a
              href={BRAND_INFO.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xs transition-all border border-stone-800"
            >
              <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>عضویت در کانال تلگرام:</span>
              <span className="font-mono text-xs text-[#D4AF37]">@{BRAND_INFO.telegramUsername}</span>
            </a>

            <div className="bg-white border border-[#DDD5C0] px-4 py-2.5 rounded-xl text-stone-800 font-bold flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>ارسال روزانه به سراسر کشور با باربری وطن و تیپاکس</span>
            </div>
          </div>

          {/* Key Value Props Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-3xl mx-auto text-xs">
            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs">
              <span className="font-black text-[#18181B] text-sm sm:text-base block">
                {totalProductsCount}+ مدل فعال
              </span>
              <span className="text-[10px] text-stone-500">شلوار، شومیز، مانتو، ست راحتی</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs">
              <span className="font-black text-[#8C6D37] text-sm sm:text-base block">
                پک ۴ تا ۱۲ تایی
              </span>
              <span className="text-[10px] text-stone-500">قیمت کف تولیدی بازار</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs">
              <span className="font-black text-[#18181B] text-sm sm:text-base block">
                تک‌فروشی آنلاین
              </span>
              <span className="text-[10px] text-stone-500">انتخاب رنگ و سایز دلخواه</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs">
              <span className="font-black text-emerald-800 text-sm sm:text-base block">
                چک صیادی بنفش
              </span>
              <span className="text-[10px] text-stone-500">خرید اعتباری همکاران</span>
            </div>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              id="btn-hero-view-catalog"
              onClick={onScrollToCatalog}
              className="w-full sm:w-auto py-3.5 px-7 bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2] rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>مشاهده کامل محصولات و پک‌های عمده</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              id="btn-hero-retail-only"
              onClick={onFilterRetailOnly}
              className="w-full sm:w-auto py-3.5 px-7 bg-white hover:bg-[#FAF7F2] text-stone-900 border border-[#DDD5C0] rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#8C6D37]" />
              <span>مشاهده کالاهای دارای خرید تکی</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

