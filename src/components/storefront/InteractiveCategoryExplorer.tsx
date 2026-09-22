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
      description: 'مشاهده کلیه طرح‌ها و تولیدات کارگاه',
      iconBg: 'bg-stone-900 text-[#D4AF37]',
      accentColor: 'text-[#8C6D37]',
      badge: 'کاتالوگ جامع',
      bgGradient: 'from-stone-900 to-stone-800 text-white',
    },
    'شلوار بگ': {
      description: 'بگ و نیم‌بگ استایل روز با تنخور راحت',
      iconBg: 'bg-amber-100 text-amber-900',
      accentColor: 'text-amber-700',
      badge: '🔥 پرفروش فصل',
      bgGradient: 'from-amber-50 to-[#FAF7F2]',
    },
    'شلوار راحتی نخی': {
      description: 'پارچه نخی ۱۰۰٪ طبیعی بدون آبرفت خانگی',
      iconBg: 'bg-emerald-100 text-emerald-900',
      accentColor: 'text-emerald-700',
      badge: '🌿 ارگانیک و خنک',
      bgGradient: 'from-emerald-50 to-[#FAF7F2]',
    },
    'جاگر': {
      description: 'اسپرت دمپا کش با پارچه دورس و کرپ',
      iconBg: 'bg-blue-100 text-blue-900',
      accentColor: 'text-blue-700',
      badge: '⚡ اسپرت شهری',
      bgGradient: 'from-blue-50 to-[#FAF7F2]',
    },
    'لگ و ساپورت': {
      description: 'کشی اعلا با فاق بلند، بدون پرزدهی و زانواندازی',
      iconBg: 'bg-purple-100 text-purple-900',
      accentColor: 'text-purple-700',
      badge: '✨ کشسانی بالا',
      bgGradient: 'from-purple-50 to-[#FAF7F2]',
    },
    'داکرون اداری/اسپرت': {
      description: 'پارچه شیک داکرون فرم رسمی و شیک بانوان',
      iconBg: 'bg-rose-100 text-rose-900',
      accentColor: 'text-rose-700',
      badge: '👔 پرسنلی و اداری',
      bgGradient: 'from-rose-50 to-[#FAF7F2]',
    },
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-[#EAE4D9] p-3 sm:p-4 shadow-xs space-y-2.5" dir="rtl">
      
      {/* Header with Title & Context - Compact & Clean */}
      <div className="flex items-center justify-between gap-2 border-b border-[#EAE4D9]/80 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-xs shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2 truncate">
            <h3 className="font-black text-stone-900 text-xs sm:text-sm">
              دسته‌بندی مدل‌ها
            </h3>
            <span className="hidden sm:inline-block text-[10px] font-bold bg-[#FAF8F5] border border-[#EAE4D9] text-stone-500 px-2 py-0.5 rounded-full">
              تفکیک سریع
            </span>
          </div>
        </div>

        {/* Selected Category Pill info */}
        <div className="text-[11px] font-bold text-stone-600 bg-[#FAF8F5] px-2.5 py-1 rounded-xl border border-[#EAE4D9] shrink-0 flex items-center gap-1.5">
          <span className="text-stone-400 hidden xs:inline text-[10px]">دسته فعال:</span>
          <span className="text-[#18181B] font-black">{selectedCategory}</span>
        </div>
      </div>

      {/* Interactive Category Grid / Cards - Compact & Snappy */}
      <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-2">
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
              className={`group relative text-right p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 overflow-hidden active:scale-[0.98] cursor-pointer ${
                isSelected
                  ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B] shadow-xs ring-1.5 ring-[#D4AF37]/50'
                  : 'bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-stone-800 border-[#EAE4D9] hover:border-[#8C6D37]/40 hover:shadow-2xs'
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
                    {count} مدل
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
