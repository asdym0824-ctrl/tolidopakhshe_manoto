import React from 'react';
import { Product } from '../../types';
import { Sparkles, Package, ShoppingBag, Flame, Layers } from 'lucide-react';

interface MobileCategoryStoriesProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  products: Product[];
  salesModeFilter: 'all' | 'retail_only' | 'wholesale_only';
  onSetSalesModeFilter: (filter: 'all' | 'retail_only' | 'wholesale_only') => void;
}

export const MobileCategoryStories: React.FC<MobileCategoryStoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  products,
  salesModeFilter,
  onSetSalesModeFilter,
}) => {
  // Find a representative image for each category
  const getCategoryImage = (cat: string) => {
    if (cat === 'همه') {
      return products[0]?.image || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80';
    }
    const match = products.find(p => p.category === cat);
    return match?.image || products[0]?.image || '';
  };

  const getCategoryCount = (cat: string) => {
    if (cat === 'همه') return products.length;
    return products.filter(p => p.category === cat).length;
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-3.5 border border-[#E6DEC8] shadow-xs space-y-3" dir="rtl">
      
      {/* Top Header with Swipe Hint */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
          <Layers className="w-4 h-4 text-[#8C6D37]" />
          <span>دسته‌بندی و کالکشن‌های پوشاک</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#8C6D37] bg-amber-50 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full font-medium animate-pulse">
          <span>👈 به چپ بکشید</span>
        </div>
      </div>

      {/* Horizontal Stories Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
        
        {/* Special Story: Hot Bestsellers */}
        <button
          type="button"
          onClick={() => {
            onSelectCategory('همه');
            window.scrollTo({ top: 450, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
        >
          <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-yellow-400 group-hover:scale-105 transition-transform duration-200 shadow-xs">
            <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-[#18181B] text-[#FAF7F2] flex flex-col items-center justify-center p-1 border-2 border-white">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
              <span className="text-[9px] font-black text-[#D4AF37]">پرفروش‌ها</span>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
              داغ
            </span>
          </div>
          <span className="text-[11px] font-bold text-stone-800 group-hover:text-[#8C6D37] text-center max-w-[68px] truncate">
            ویترین راسته
          </span>
        </button>

        {/* Categories as Stories */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const img = getCategoryImage(cat);
          const count = getCategoryCount(cat);

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
            >
              <div
                className={`relative p-0.5 rounded-full transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-amber-200 scale-105 shadow-md'
                    : 'bg-[#DDD5C0] hover:bg-[#8C6D37]/50 group-hover:scale-102'
                }`}
              >
                <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-stone-100 border-2 border-white relative">
                  <img
                    src={img}
                    alt={cat}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                {/* Count badge */}
                <span
                  className={`absolute -bottom-1 -right-1 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs ${
                    isSelected
                      ? 'bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/50'
                      : 'bg-white text-stone-700 border border-[#E6DEC8]'
                  }`}
                >
                  {count}
                </span>
              </div>

              <span
                className={`text-[11px] font-bold text-center max-w-[72px] truncate transition-colors ${
                  isSelected ? 'text-[#18181B] font-black' : 'text-stone-700 group-hover:text-stone-900'
                }`}
              >
                {cat}
              </span>
            </button>
          );
        })}

        {/* Quick Filter: Retail Only story */}
        <button
          type="button"
          onClick={() => {
            onSetSalesModeFilter(salesModeFilter === 'retail_only' ? 'all' : 'retail_only');
          }}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
        >
          <div className={`relative p-0.5 rounded-full transition-all ${
            salesModeFilter === 'retail_only' 
              ? 'bg-gradient-to-tr from-[#8C6D37] via-amber-400 to-amber-200 scale-105' 
              : 'bg-emerald-200 hover:bg-emerald-300'
          }`}>
            <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-emerald-50 text-emerald-900 flex flex-col items-center justify-center p-1 border-2 border-white">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <span className="text-[9px] font-bold text-emerald-800">خرید تکی</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-stone-800 group-hover:text-emerald-800 text-center max-w-[68px] truncate">
            {salesModeFilter === 'retail_only' ? '✓ فعال' : 'تک‌فروشی'}
          </span>
        </button>

      </div>
    </div>
  );
};
