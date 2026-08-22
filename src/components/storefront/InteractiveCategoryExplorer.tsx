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
    <div className="bg-white rounded-3xl border border-[#E6DEC8] p-4 sm:p-5 shadow-xs space-y-4" dir="rtl">
      
      {/* Header with Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6DEC8]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-stone-900 text-sm sm:text-base flex items-center gap-2">
              <span>انتخاب دسته‌بندی و کالکشن تخصصی</span>
              <span className="text-[10px] font-bold bg-[#FAF7F2] border border-[#DDD5C0] text-stone-600 px-2 py-0.5 rounded-full">
                کلیک برای تفکیک سریع
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              با انتخاب هر دسته، محصولات همان رسته با قابلیت فیلتر قیمت و خرید تکی نمایش داده می‌شود
            </p>
          </div>
        </div>

        {/* Selected Category Pill info */}
        <div className="text-xs font-bold text-stone-600 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#DDD5C0] self-start sm:self-auto flex items-center gap-1.5">
          <span>دسته فعال:</span>
          <span className="text-[#18181B] font-black">{selectedCategory}</span>
        </div>
      </div>

      {/* Interactive Category Grid / Cards */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
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
              onClick={() => onSelectCategory(cat)}
              className={`group relative text-right p-3 rounded-2xl border transition-all flex flex-col justify-between overflow-hidden text-right h-full min-h-[120px] active:scale-[0.98] ${
                isSelected
                  ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B] shadow-md ring-2 ring-[#D4AF37]/40 -translate-y-0.5'
                  : 'bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] text-stone-800 border-[#E6DEC8] hover:border-[#8C6D37]/50 hover:shadow-xs'
              }`}
            >
              {/* Background Accent Subtle Decor */}
              {isSelected && (
                <div className="absolute top-0 left-0 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none -translate-x-6 -translate-y-6" />
              )}

              {/* Top Row: Thumbnail / Icon & Badge */}
              <div className="flex items-start justify-between gap-1.5 w-full">
                {sampleImage ? (
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-black/10 bg-white flex-shrink-0 shadow-2xs">
                    <img 
                      src={sampleImage} 
                      alt={cat} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-[#FAF7F2]/20 text-[#D4AF37]' : config.iconBg
                  }`}>
                    <Tag className="w-4 h-4" />
                  </div>
                )}

                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md whitespace-nowrap ${
                  isSelected 
                    ? 'bg-[#D4AF37] text-[#18181B]' 
                    : 'bg-white/80 border border-[#DDD5C0] text-stone-600'
                }`}>
                  {count} مدل
                </span>
              </div>

              {/* Middle: Title & Description */}
              <div className="mt-2 space-y-0.5 flex-1">
                <div className="flex items-center gap-1">
                  <h4 className={`font-black text-xs sm:text-[13px] leading-tight ${
                    isSelected ? 'text-[#FAF7F2]' : 'text-stone-900 group-hover:text-[#8C6D37]'
                  }`}>
                    {cat}
                  </h4>
                </div>
                <p className={`text-[10px] line-clamp-1 leading-snug ${
                  isSelected ? 'text-stone-300' : 'text-stone-500'
                }`}>
                  {config.description}
                </p>
              </div>

              {/* Bottom: Interactive Indicator */}
              <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[10px] font-bold w-full">
                <span className={isSelected ? 'text-[#D4AF37]' : 'text-stone-500 group-hover:text-stone-800'}>
                  {isSelected ? '✓ در حال نمایش' : 'مشاهده اجناس'}
                </span>
                <ChevronLeft className={`w-3 h-3 transition-transform ${
                  isSelected ? 'text-[#D4AF37] -translate-x-0.5' : 'text-stone-400 group-hover:-translate-x-0.5'
                }`} />
              </div>

            </button>
          );
        })}
      </div>

    </div>
  );
};
