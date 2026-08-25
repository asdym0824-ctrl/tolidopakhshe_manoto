import React from 'react';
import { 
  Package, 
  ShoppingBag, 
  Send, 
  Phone, 
  MapPin, 
  ArrowDown, 
  ShieldCheck, 
  Sparkles, 
  Navigation,
  Film,
  Calculator,
  Flame,
  Clock,
  Truck,
  CheckCircle2
} from 'lucide-react';
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
    <div className="relative bg-[#FAF7F2] pt-6 pb-10 sm:pb-14 border-b border-[#E6DEC8] overflow-hidden" dir="rtl">
      
      {/* Background Subtle Elegant Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#EBE3D3]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative space-y-6">

        <div className="max-w-4xl mx-auto text-center space-y-5">
          
          {/* Main Fashion Brand Identity Display Card */}
          <div className="inline-block mx-auto bg-[#FAF7F2] border border-[#E6DEC8] px-8 sm:px-12 py-5 sm:py-6 rounded-3xl shadow-sm relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#18181B] text-[#FAF7F2] px-3.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xs">
              Atelier & Wholesale Hub
            </div>
            <ManotoLogo size="xl" showPersianSub={false} />
            <div className="mt-2.5 text-xs sm:text-sm font-bold text-stone-800">
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
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#18181B] leading-tight tracking-tight">
              تولید و پخش مستقیم پوشاک زنانه از کارگاه بازار
            </h1>
            <p className="text-xs sm:text-base text-stone-700 leading-relaxed max-w-2xl mx-auto">
              تامین‌کننده معتبر بوتیک‌ها، ارزان‌سراها و آنلاین‌شاپ‌های کشور با قیمت کف بازار • فروش در پک‌های ۴، ۶، ۸ و ۱۲ تایی جور با امکان خرید تکی در مدل‌های دارای موجودی آزاد.
            </p>
          </div>

          {/* Interactive Fast Filter Chips in Hero */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-2xl mx-auto text-xs font-bold">
            
            <button
              type="button"
              onClick={onScrollToCatalog}
              className="bg-white hover:bg-stone-50 border border-[#DDD5C0] hover:border-[#18181B] px-3 py-1.5 rounded-full text-stone-800 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>پرفروش‌های راسته</span>
            </button>

            <button
              type="button"
              onClick={onFilterRetailOnly}
              className="bg-white hover:bg-amber-50 border border-[#DDD5C0] hover:border-[#8C6D37] px-3 py-1.5 rounded-full text-[#8C6D37] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>خرید تکی آنلاین</span>
            </button>

            <a
              href={`tel:${BRAND_INFO.primaryPhone}`}
              className="bg-white hover:bg-stone-50 border border-[#DDD5C0] px-3 py-1.5 rounded-full text-stone-800 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>تلفن دفتر: {BRAND_INFO.primaryPhoneDisplay}</span>
            </a>

          </div>

          {/* Key Value Props Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-3xl mx-auto text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-[#E6DEC8] shadow-xs">
              <span className="font-black text-[#18181B] text-sm sm:text-base block">
                {totalProductsCount}+ مدل فعال
              </span>
              <span className="text-[10px] text-stone-500">شلوار، شومیز، مانتو، ست</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E6DEC8] shadow-xs">
              <span className="font-black text-[#8C6D37] text-sm sm:text-base block">
                پک ۴ تا ۱۲ تایی
              </span>
              <span className="text-[10px] text-stone-500">قیمت کف تولیدی بازار</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E6DEC8] shadow-xs">
              <span className="font-black text-[#18181B] text-sm sm:text-base block">
                تک‌فروشی آنلاین
              </span>
              <span className="text-[10px] text-stone-500">انتخاب رنگ و سایز دلخواه</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E6DEC8] shadow-xs">
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
              className="w-full sm:w-auto py-3.5 px-6 sm:px-8 bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2] rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer ring-2 ring-[#D4AF37]/30 hover:ring-[#D4AF37]/60"
            >
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>مشاهده کاتالوگ جامع و تمام اجناس</span>
              <span className="bg-[#D4AF37] text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                {totalProductsCount} مدل
              </span>
            </button>

            <button
              type="button"
              id="btn-hero-retail-only"
              onClick={onFilterRetailOnly}
              className="w-full sm:w-auto py-3.5 px-6 bg-white hover:bg-[#FAF7F2] text-stone-900 border border-[#DDD5C0] rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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

