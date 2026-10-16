import React from 'react';
import { 
  X, 
  Check, 
  SlidersHorizontal, 
  RotateCcw, 
  Package, 
  ShoppingBag, 
  Flame, 
  Sparkles, 
  Film, 
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Product } from '../../types';
import { toPersianDigits } from '../../utils/persianWriting';

interface MobileFilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory?: string;
  selectedCategories?: string[];
  onSelectCategory?: (cat: string) => void;
  onToggleCategory?: (cat: string) => void;
  onClearCategories?: () => void;
  salesModeFilter: 'all' | 'retail_only' | 'wholesale_only';
  onSetSalesModeFilter: (filter: 'all' | 'retail_only' | 'wholesale_only') => void;
  sortBy: 'newest' | 'bestseller' | 'price_asc' | 'price_desc';
  onSetSortBy: (sort: 'newest' | 'bestseller' | 'price_asc' | 'price_desc') => void;
  videoFilterOnly: boolean;
  onSetVideoFilterOnly?: (val: boolean) => void;
  onToggleVideoFilter?: () => void;
  selectedFabric?: string;
  selectedFabrics?: string[];
  onSelectFabric?: (fabric: string) => void;
  onToggleFabric?: (fabric: string) => void;
  onClearFabrics?: () => void;
  availableFabrics: string[];
  totalFilteredCount?: number;
  totalProductsCount?: number;
  filteredCount?: number;
  onResetFilters: () => void;
}

export const MobileFilterBottomSheet: React.FC<MobileFilterBottomSheetProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory = 'همه',
  selectedCategories = [],
  onSelectCategory,
  onToggleCategory,
  onClearCategories,
  salesModeFilter,
  onSetSalesModeFilter,
  sortBy,
  onSetSortBy,
  videoFilterOnly,
  onSetVideoFilterOnly,
  onToggleVideoFilter,
  selectedFabric = '',
  selectedFabrics = [],
  onSelectFabric,
  onToggleFabric,
  onClearFabrics,
  availableFabrics,
  totalFilteredCount,
  filteredCount,
  onResetFilters
}) => {
  if (!isOpen) return null;

  const displayCount = totalFilteredCount !== undefined ? totalFilteredCount : (filteredCount || 0);
  const isCategorySelected = (cat: string) => {
    if (selectedCategories.length > 0) {
      if (cat === 'همه') return false;
      return selectedCategories.includes(cat);
    }
    return selectedCategory === cat;
  };

  const isAllCategoriesActive = selectedCategories.length === 0 || selectedCategory === 'همه';

  const handleCategoryClick = (cat: string) => {
    if (cat === 'همه') {
      if (onClearCategories) {
        onClearCategories();
      } else if (onToggleCategory) {
        onToggleCategory('همه');
      } else if (onSelectCategory) {
        onSelectCategory('همه');
      }
      return;
    }
    if (onToggleCategory) {
      onToggleCategory(cat);
    } else if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  const isFabricSelected = (fabric: string) => {
    if (selectedFabrics.length > 0) {
      return selectedFabrics.includes(fabric);
    }
    return selectedFabric === fabric;
  };

  const isAllFabricsActive = selectedFabrics.length === 0 && !selectedFabric;

  const handleFabricClick = (fabric: string) => {
    if (fabric === '') {
      if (onClearFabrics) {
        onClearFabrics();
      } else if (onToggleFabric) {
        onToggleFabric('');
      } else if (onSelectFabric) {
        onSelectFabric('');
      }
      return;
    }
    if (onToggleFabric) {
      onToggleFabric(fabric);
    } else if (onSelectFabric) {
      onSelectFabric(fabric);
    }
  };

  const activeCategoriesCount = selectedCategories.filter(c => c !== 'همه').length;
  const activeFabricsCount = selectedFabrics.length;

  return (
    <div 
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-end justify-center md:hidden animate-in fade-in duration-200"
      dir="rtl"
      onClick={onClose}
    >
      <div 
        className="w-full max-h-[85vh] bg-[#FAF7F2] text-stone-900 rounded-t-3xl border-t border-[#DDD5C0] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle & Header */}
        <div className="pt-2.5 pb-2 px-4 border-b border-[#E6DEC8] bg-white flex flex-col items-center">
          <div className="w-12 h-1.5 bg-stone-300 rounded-full mb-2" />
          
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-sm">فیلتر و دسته‌بندی مدل‌ها</h3>
                <span className="text-[10px] text-stone-500 font-medium">
                  {toPersianDigits(displayCount)} مدل منطبق در کاتالوگ
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                title="پاک کردن همه فیلترها"
              >
                <RotateCcw className="w-3 h-3" />
                <span>تنظیم مجدد</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Filter Sections */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1 select-none">
          
          {/* 1. Sort Options */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-stone-800">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>مرتب‌سازی بر اساس:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'newest', label: 'جدیدترین مدل‌ها', icon: Sparkles },
                { id: 'bestseller', label: 'پرفروش‌ترین‌های راسته', icon: Flame },
                { id: 'price_asc', label: 'ارزان‌ترین پک عمده', icon: null },
                { id: 'price_desc', label: 'گران‌ترین پک عمده', icon: null },
              ].map((item) => {
                const isSelected = sortBy === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSetSortBy(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B] shadow-xs'
                        : 'bg-white text-stone-700 border-[#DDD5C0] hover:bg-[#F5EFEB]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D4AF37]' : 'text-stone-400'}`} />}
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Sales Mode (Wholesale vs Retail) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-stone-800">
              <Package className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>نوع معامله و فروش:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSetSalesModeFilter('all')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                  salesModeFilter === 'all'
                    ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B] shadow-xs'
                    : 'bg-white text-stone-700 border-[#DDD5C0]'
                }`}
              >
                همه مدل‌ها
              </button>
              
              <button
                type="button"
                onClick={() => onSetSalesModeFilter('wholesale_only')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                  salesModeFilter === 'wholesale_only'
                    ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B] shadow-xs'
                    : 'bg-white text-stone-700 border-[#DDD5C0]'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>فقط عمده</span>
              </button>

              <button
                type="button"
                onClick={() => onSetSalesModeFilter('retail_only')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                  salesModeFilter === 'retail_only'
                    ? 'bg-[#8C6D37] text-white border-[#8C6D37] shadow-xs'
                    : 'bg-white text-stone-700 border-[#DDD5C0]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>دارای تک‌فروشی</span>
              </button>
            </div>
          </div>

          {/* 3. Categories Multi-Select Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-stone-800">
                <Layers className="w-3.5 h-3.5 text-[#8C6D37]" />
                <span>دسته‌بندی پوشاک (امکان انتخاب همزمان چند دسته):</span>
              </div>
              {activeCategoriesCount > 0 && (
                <span className="text-[10px] font-bold bg-[#D4AF37]/15 text-[#8C6D37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full">
                  {toPersianDigits(activeCategoriesCount)} دسته انتخاب شده
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {/* Option to clear and view all */}
              <button
                type="button"
                onClick={() => handleCategoryClick('همه')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isAllCategoriesActive
                    ? 'bg-[#18181B] text-[#D4AF37] border-[#18181B] shadow-xs ring-1 ring-[#D4AF37]/30'
                    : 'bg-white text-stone-700 border-[#DDD5C0] hover:bg-[#F5EFEB]'
                }`}
              >
                {isAllCategoriesActive && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                <span>همه مدل‌ها</span>
              </button>

              {categories.filter(c => c !== 'همه').map((cat) => {
                const isSelected = isCategorySelected(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#18181B] text-[#FAF7F2] border-[#D4AF37] shadow-xs ring-1 ring-[#D4AF37]/50'
                        : 'bg-white text-stone-700 border-[#DDD5C0] hover:bg-[#F5EFEB]'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#D4AF37] text-[#18181B]' : 'border border-stone-300 bg-stone-50'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Fabric Type Multi-Select Filter */}
          {availableFabrics.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-stone-800">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>جنس و نوع پارچه (انتخاب چندتایی):</span>
                </span>
                {activeFabricsCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => handleFabricClick('')}
                    className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    حذف فیلتر پارچه ({toPersianDigits(activeFabricsCount)})
                  </button>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFabricClick('')}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isAllFabricsActive
                      ? 'bg-[#18181B] text-white border-[#18181B]'
                      : 'bg-white text-stone-700 border-[#DDD5C0]'
                  }`}
                >
                  {isAllFabricsActive && <Check className="w-3 h-3 text-[#D4AF37]" />}
                  <span>همه جنس‌ها</span>
                </button>
                {availableFabrics.map((fabric) => {
                  const isSelected = isFabricSelected(fabric);
                  return (
                    <button
                      key={fabric}
                      type="button"
                      onClick={() => handleFabricClick(fabric)}
                      className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#8C6D37] text-white border-[#8C6D37] shadow-xs ring-1 ring-amber-300/40'
                          : 'bg-white text-stone-700 border-[#DDD5C0]'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-white text-[#8C6D37]' : 'border border-stone-300 bg-stone-50'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span>{fabric}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Special Features: Video Only Toggle */}
          <div className="bg-white p-3 rounded-2xl border border-[#DDD5C0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#8C6D37] flex items-center justify-center">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">فقط مدل‌های دارای فیلم تنخور ژورنالی</span>
                <span className="text-[10px] text-stone-500">مشاهده ویدیو و کیفیت پارچه در تن مانکن</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onToggleVideoFilter) {
                  onToggleVideoFilter();
                } else if (onSetVideoFilterOnly) {
                  onSetVideoFilterOnly(!videoFilterOnly);
                }
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                videoFilterOnly ? 'bg-[#18181B]' : 'bg-stone-300'
              }`}
            >
              <span 
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  videoFilterOnly ? 'right-6 bg-[#D4AF37]' : 'right-0.5'
                }`} 
              />
            </button>
          </div>

        </div>

        {/* Bottom Apply Action Bar */}
        <div className="p-3.5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] bg-white border-t border-[#E6DEC8] flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-[#18181B] to-stone-900 text-[#FAF7F2] rounded-2xl font-black text-xs transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 border border-stone-800 cursor-pointer"
          >
            <span>نمایش {toPersianDigits(displayCount)} مدل منطبق</span>
            <Check className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

      </div>
    </div>
  );
};
