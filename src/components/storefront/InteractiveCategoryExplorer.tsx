import React from 'react';
import { 
  Sparkles, 
  Flame, 
  ShoppingBag, 
  Layers, 
  ChevronLeft,
  Package,
  TrendingUp,
  Tag
} from 'lucide-react';
import { Product } from '../../types';
import { toPersianDigits } from '../../utils/persianWriting';

interface InteractiveCategoryExplorerProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  products: Product[];
}

export const InteractiveCategoryExplorer: React.FC<InteractiveCategoryExplorerProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  products,
}) => {
  // Category visual metadata mapping
  const categoryConfig: Record<string, {
    description: string;
    iconBg: string;
    accentColor: string;
    badge: string;
    bgGradient: string;
  }> = {
    'همه': {
      description: 'مشاهدهٔ تمامی طرح‌ها و دوخت‌های کارگاه',
      iconBg: 'bg-stone-900 text-[#D4AF37]',
      accentColor: 'text-[#8C6D37]',
      badge: 'کاتالوگ جامع',
      bgGradient: 'from-stone-900 to-stone-800 text-white',
    },
    'شلوار بگ': {
      description: 'بگ و نیم‌بگ با الگوی استاندارد و تن‌خور آزاد',
      iconBg: 'bg-amber-100 text-amber-900',
      accentColor: 'text-amber-700',
      badge: '🔥 پرفروش فصل',
      bgGradient: 'from-amber-50 to-[#FAF7F2]',
    },
    'شلوار راحتی نخی': {
      description: 'پارچهٔ تمام‌نخی ۱۰۰٪ طبیعی، لطیف و بدون آبرفت',
      iconBg: 'bg-emerald-100 text-emerald-900',
      accentColor: 'text-emerald-700',
      badge: '🌿 ارگانیک و خنک',
      bgGradient: 'from-emerald-50 to-[#FAF7F2]',
    },
    'جاگر': {
      description: 'اسپرت دمپاکش با پارچهٔ دورس و کرپ کشی',
      iconBg: 'bg-blue-100 text-blue-900',
      accentColor: 'text-blue-700',
      badge: '⚡ اسپرت شهری',
      bgGradient: 'from-blue-50 to-[#FAF7F2]',
    },
    'لگ و ساپورت': {
      description: 'کشی اعلا با فاق بلند، بدون پرزدهی و زانو‌انداختن',
      iconBg: 'bg-purple-100 text-purple-900',
      accentColor: 'text-purple-700',
      badge: '✨ کشسانی بالا',
      bgGradient: 'from-purple-50 to-[#FAF7F2]',
    },
    'داکرون اداری/اسپرت': {
      description: 'کرپ و داکرون با ایستایی عالی ویژهٔ استایل اداری و روزمره',
      iconBg: 'bg-rose-100 text-rose-900',
      accentColor: 'text-rose-700',
      badge: '👔 پرسنلی و اداری',
      bgGradient: 'from-rose-50 to-[#FAF7F2]',
    },
  };

  return (
    <div 
      id="interactive-category-explorer"
      className="relative overflow-hidden rounded-3xl p-4 sm:p-5 space-y-3.5 bg-white/95 backdrop-blur-xl border border-[#EAE4D9] shadow-[0_4px_24px_rgba(24,24,27,0.05)] transition-all duration-300" 
      dir="rtl"
    >
      {/* Subtle Atelier Ambient Glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      
      {/* Header with Title & Context - Compact & Clean */}
      <div className="flex items-center justify-between gap-2 border-b border-[#EAE4D9] pb-3 relative z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-xs shrink-0 border border-[#D4AF37]/30">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-stone-900 text-xs sm:text-sm">
                دسته‌بندی و تن‌خور مدل‌های زنانه
              </h3>
              <span className="hidden sm:inline-block text-[10px] font-bold bg-[#FAF8F5] border border-[#D4AF37]/30 text-[#8C6D37] px-2 py-0.5 rounded-full">
                تفکیک تخصصی
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-stone-500 truncate">
              انتخاب سریع انواع شلوار بگ، نیم‌بگ، کارگو، کرپ مازراتی و ست‌های تولیدی
            </p>
          </div>
        </div>

        {/* Selected Category Pill info */}
        <div className="text-[11px] font-bold text-stone-700 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EAE4D9] shrink-0 flex items-center gap-1.5 shadow-2xs">
          <span className="text-stone-400 hidden xs:inline text-[10.5px]">دسته فعال:</span>
          <span className="text-[#18181B] font-black">{selectedCategory}</span>
        </div>
      </div>

      {/* Interactive Category Grid / Cards - Compact & Snappy */}
      <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5 relative z-10">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const config = categoryConfig[cat] || {
            description: 'کالکشن مدل‌های جور کارگاه',
            iconBg: 'bg-stone-100 text-stone-800',
            accentColor: 'text-stone-800',
            badge: 'مجموعه تولیدی',
            bgGradient: 'from-stone-50 to-white',
          };
          
          const catProducts = cat === 'همه' 
            ? products 
            : products.filter(p => p.category === cat);
          
          const count = catProducts.length;
          const sampleImage = catProducts[0]?.image;

          return (
            <button
              key={cat}
              type="button"
              id={`cat-card-${cat.replace(/\s+/g, '-').replace(/\//g, '-')}`}
              role="button"
              aria-pressed={isSelected}
              onClick={() => onSelectCategory(cat)}
              className={`group relative text-right p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 overflow-hidden active:scale-[0.98] cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#18181B] to-[#27272A] text-[#FAF7F2] border-[#18181B] shadow-md ring-2 ring-[#D4AF37]/60'
                  : 'bg-[#FAF8F5]/90 hover:bg-white text-stone-800 border-[#EAE4D9] hover:border-[#8C6D37]/50 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {sampleImage ? (
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-black/10 bg-white shrink-0 shadow-2xs">
                    <img 
                      src={sampleImage} 
                      alt={cat} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#FAF7F2]/20 text-[#D4AF37]' : config.iconBg
                  }`}>
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="min-w-0">
                  <span className={`block font-black text-[11px] sm:text-xs truncate leading-tight ${
                    isSelected ? 'text-[#FAF7F2]' : 'text-stone-900 group-hover:text-[#8C6D37]'
                  }`}>
                    {cat}
                  </span>
                  <span className={`text-[9px] font-bold block truncate leading-tight mt-0.5 ${
                    isSelected ? 'text-[#D4AF37]' : 'text-stone-500'
                  }`}>
                    {toPersianDigits(count)} مدل
                  </span>
                </div>
              </div>

              <ChevronLeft className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                isSelected ? 'text-[#D4AF37]' : 'text-stone-400 group-hover:-translate-x-0.5'
              }`} />
            </button>
          );
        })}
      </div>

    </div>
  );
};
