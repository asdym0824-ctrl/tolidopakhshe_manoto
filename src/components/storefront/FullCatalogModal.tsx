import React, { useState, useMemo, useEffect } from 'react';
import { Product, PurchaseMode } from '../../types';
import { 
  X, 
  ArrowRight, 
  Search, 
  Package, 
  ShoppingBag, 
  Film, 
  Play, 
  Eye, 
  Check, 
  SlidersHorizontal, 
  Grid2X2, 
  Grid3X3, 
  LayoutGrid, 
  Sparkles, 
  Star, 
  ChevronDown,
  Layers,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { BRAND_INFO } from '../../data/brandInfo';

interface FullCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, mode: PurchaseMode, quantity: number, selectedColor?: string) => void;
  cartItemsCount: number;
  onOpenCart: () => void;
  isPartnerLoggedIn?: boolean;
}

export const FullCatalogModal: React.FC<FullCatalogModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
  cartItemsCount,
  onOpenCart,
  isPartnerLoggedIn = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [salesModeFilter, setSalesModeFilter] = useState<'all' | 'wholesale_only' | 'retail_only'>('all');
  const [videoFilterOnly, setVideoFilterOnly] = useState(false);
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);
  const [onlyNewArrivals, setOnlyNewArrivals] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'bestseller' | 'price_asc' | 'price_desc'>('newest');
  const [customColumns, setCustomColumns] = useState<'auto' | '2' | '3' | '4' | '6'>('auto');
  const [addedItemIds, setAddedItemIds] = useState<{ [key: string]: boolean }>({});
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Categories list with count
  const categoriesWithCounts = useMemo(() => {
    const counts: { [cat: string]: number } = { 'همه': products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    const uniqueCats: string[] = Array.from(new Set(products.map(p => p.category)));
    return ['همه', ...uniqueCats].map((cat: string) => ({
      name: cat,
      count: counts[cat] || 0
    }));
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const rawQuery = searchQuery.trim();
    const qNorm = rawQuery
      .toLowerCase()
      .replace(/[\u200C\u200B]/g, ' ')
      .replace(/[ي]/g, 'ی')
      .replace(/[ك]/g, 'ک')
      .replace(/[آأإ]/g, 'ا')
      .replace(/[ة]/g, 'ه')
      .replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1584))
      .replace(/\s+/g, ' ')
      .trim();

    const tokens = qNorm.split(' ').filter(t => t.length > 0);

    return products.filter(product => {
      // Category Filter
      if (selectedCategory !== 'همه' && product.category !== selectedCategory) {
        return false;
      }

      // Sales Mode
      if (salesModeFilter === 'retail_only') {
        const isRetail = product.allowRetailSale && (product.singleStock > 0 || product.packStock > 0);
        if (!isRetail) return false;
      } else if (salesModeFilter === 'wholesale_only') {
        if (product.packStock <= 0) return false;
      }

      // Video Filter
      if (videoFilterOnly && !product.videoUrl) {
        return false;
      }

      // Best Seller Filter
      if (onlyBestSellers && !product.isBestSeller && (!product.rating || product.rating < 4.8)) {
        return false;
      }

      // New Arrivals Filter
      if (onlyNewArrivals && !product.isNewArrival) {
        return false;
      }

      // Text Search Tokens
      if (tokens.length > 0) {
        const pTokens = [
          product.name,
          product.category,
          product.fabricType || '',
          product.description || '',
          product.sizes || '',
          ...(product.tags || []),
          ...(product.colors || []),
        ]
          .join(' ')
          .toLowerCase()
          .replace(/[\u200C\u200B]/g, ' ')
          .replace(/[ي]/g, 'ی')
          .replace(/[ك]/g, 'ک')
          .replace(/[آأإ]/g, 'ا')
          .replace(/[ة]/g, 'ه')
          .replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
          .replace(/[٠-٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1584))
          .replace(/\s+/g, ' ');

        const allTokensMatch = tokens.every(token => pTokens.includes(token));
        if (!allTokensMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'bestseller') return (b.reviewCount || 0) - (a.reviewCount || 0);
      if (sortBy === 'price_asc') return a.baseWholesalePricePerPack - b.baseWholesalePricePerPack;
      if (sortBy === 'price_desc') return b.baseWholesalePricePerPack - a.baseWholesalePricePerPack;
      return 0; // newest default
    });
  }, [products, searchQuery, selectedCategory, salesModeFilter, videoFilterOnly, onlyBestSellers, onlyNewArrivals, sortBy]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const chosenColor = selectedColors[product.id] || product.colors?.[0] || 'جور رنگ‌بندی';
    onAddToCart(product, 'wholesale_pack', 1, chosenColor);
    setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleColorSelect = (productId: string, color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedColors(prev => ({ ...prev, [productId]: color }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('همه');
    setSalesModeFilter('all');
    setVideoFilterOnly(false);
    setOnlyBestSellers(false);
    setOnlyNewArrivals(false);
    setSortBy('newest');
  };

  if (!isOpen) return null;

  // Responsive Grid CSS Class resolver
  const getGridClasses = () => {
    if (customColumns === '2') return 'grid-cols-2';
    if (customColumns === '3') return 'grid-cols-2 sm:grid-cols-3';
    if (customColumns === '4') return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
    if (customColumns === '6') return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
    // Default auto responsive: 2 on mobile, 3 on tablet, 4 on desktop, 5-6 on wide screens
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#FAF7F2] text-stone-900 flex flex-col overflow-hidden animate-in fade-in duration-200"
      dir="rtl"
      id="full-catalog-modal"
    >
      {/* Top Header Bar */}
      <header className="bg-white border-b border-[#E6DEC8] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Right: Back button & Title */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EBE3D3] text-stone-900 border border-[#E6DEC8] flex items-center gap-1.5 transition-all font-bold text-xs sm:text-sm cursor-pointer shadow-2xs"
              title="بازگشت به صفحه اصلی"
            >
              <ArrowRight className="w-4 h-4 text-stone-700" />
              <span className="hidden sm:inline">بازگشت به صفحه اصلی</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-lg font-black text-stone-900 leading-tight">
                  کاتالوگ جامع اجناس و مدل‌ها
                </h1>
                <span className="bg-[#18181B] text-[#D4AF37] text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full">
                  {filteredProducts.length} مدل
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-500 hidden md:block">
                تولید و پخش پوشاک زنانه من و تو (اسدی) • دسترسی مستقیم به کل انبار و کارگاه بازار بزرگ تهران
              </p>
            </div>
          </div>

          {/* Left: Cart & Close Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCart}
              className="px-3 py-2 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">سبد خرید</span>
              {cartItemsCount > 0 && (
                <span className="bg-[#D4AF37] text-stone-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="بستن کاتالوگ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Filter and Search Sub-bar */}
        <div className="bg-[#FAF7F2]/90 backdrop-blur-xs border-t border-[#E6DEC8] px-3 sm:px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
            
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی سریع بین تمام اجناس (نام مدل، پارچه، مازراتی، جین، لینن، شومیز، کد...)"
                className="w-full bg-white border border-[#E6DEC8] focus:border-stone-800 rounded-xl pr-9 pl-8 py-1.5 sm:py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-hidden transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filters and Sorters */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-0.5">
              
              {/* Sales Mode Switcher */}
              <div className="flex items-center bg-white p-0.5 rounded-xl border border-[#E6DEC8] text-[11px] font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setSalesModeFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    salesModeFilter === 'all' ? 'bg-[#18181B] text-[#D4AF37]' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  همه
                </button>
                <button
                  type="button"
                  onClick={() => setSalesModeFilter('wholesale_only')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    salesModeFilter === 'wholesale_only' ? 'bg-[#18181B] text-[#D4AF37]' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  پک‌های عمده
                </button>
                <button
                  type="button"
                  onClick={() => setSalesModeFilter('retail_only')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    salesModeFilter === 'retail_only' ? 'bg-[#18181B] text-[#D4AF37]' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  تک‌فروشی آنلاین
                </button>
              </div>

              {/* Video Filter Toggle */}
              <button
                type="button"
                onClick={() => setVideoFilterOnly(!videoFilterOnly)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border shrink-0 transition-all cursor-pointer ${
                  videoFilterOnly
                    ? 'bg-[#18181B] text-[#D4AF37] border-[#D4AF37]'
                    : 'bg-white text-stone-700 border-[#E6DEC8] hover:border-stone-400'
                }`}
              >
                <Film className="w-3 h-3 text-[#D4AF37]" />
                <span>فیلم تنخور</span>
              </button>

              {/* Best Sellers Filter Toggle */}
              <button
                type="button"
                onClick={() => setOnlyBestSellers(!onlyBestSellers)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border shrink-0 transition-all cursor-pointer ${
                  onlyBestSellers
                    ? 'bg-amber-500 text-stone-950 border-amber-600 font-black'
                    : 'bg-white text-stone-700 border-[#E6DEC8] hover:border-stone-400'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>پرفروش‌ها</span>
              </button>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#E6DEC8] text-stone-800 text-[11px] font-bold rounded-xl px-2.5 py-1 outline-hidden shrink-0 cursor-pointer shadow-2xs"
              >
                <option value="newest">جدیدترین مدل‌ها</option>
                <option value="bestseller">پرفروش‌ترین راسته بازار</option>
                <option value="price_asc">ارزان‌ترین قیمت پک</option>
                <option value="price_desc">بیشترین قیمت پک</option>
              </select>

              {/* Desktop Column Density Switcher (Hidden on Mobile) */}
              <div className="hidden lg:flex items-center bg-white p-0.5 rounded-xl border border-[#E6DEC8] text-[11px] shrink-0">
                <button
                  type="button"
                  onClick={() => setCustomColumns('auto')}
                  className={`p-1 rounded-lg transition-all ${customColumns === 'auto' ? 'bg-[#18181B] text-[#D4AF37]' : 'text-stone-500 hover:text-stone-900'}`}
                  title="چیدمان استاندارد"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCustomColumns('4')}
                  className={`p-1 rounded-lg transition-all ${customColumns === '4' ? 'bg-[#18181B] text-[#D4AF37]' : 'text-stone-500 hover:text-stone-900'}`}
                  title="۴ ستونه"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCustomColumns('6')}
                  className={`p-1 rounded-lg transition-all ${customColumns === '6' ? 'bg-[#18181B] text-[#D4AF37]' : 'text-stone-500 hover:text-stone-900'}`}
                  title="نمایش فوق فشرده ۶ ستونه"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Category Chips Scrollbar */}
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2">
            {categoriesWithCounts.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                      : 'bg-white text-stone-700 border border-[#E6DEC8] hover:border-stone-400'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-stone-800 text-[#FAF7F2]' : 'bg-[#FAF7F2] text-stone-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* Main Products Scroll Area */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Active Filter Summary Bar if filtered */}
          {(selectedCategory !== 'همه' || searchQuery || salesModeFilter !== 'all' || videoFilterOnly || onlyBestSellers) && (
            <div className="flex items-center justify-between bg-white border border-[#E6DEC8] rounded-xl px-3 sm:px-4 py-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-stone-900">فیلترهای فعال:</span>
                {selectedCategory !== 'همه' && (
                  <span className="bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E6DEC8]">
                    دسته: {selectedCategory}
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E6DEC8]">
                    جستجو: «{searchQuery}»
                  </span>
                )}
                {salesModeFilter !== 'all' && (
                  <span className="bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E6DEC8]">
                    {salesModeFilter === 'retail_only' ? 'تک‌فروشی آنلاین' : 'پک‌های عمده'}
                  </span>
                )}
                {videoFilterOnly && (
                  <span className="bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E6DEC8]">
                    دارای ویدیو
                  </span>
                )}
                {onlyBestSellers && (
                  <span className="bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E6DEC8]">
                    پرفروش‌ترین‌ها
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-amber-700 hover:text-amber-900 font-bold hover:underline cursor-pointer shrink-0 mr-2"
              >
                پاک کردن همه فیلترها
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className={`grid ${getGridClasses()} gap-2.5 sm:gap-4`}>
              {filteredProducts.map((product) => {
                const isAdded = addedItemIds[product.id];
                const activeColor = selectedColors[product.id] || product.colors?.[0] || 'جور رنگ‌بندی';
                const isRetailAvailable = Boolean(product.allowRetailSale && (product.singleStock > 0 || product.packStock > 0));

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="group bg-white rounded-2xl border border-[#E6DEC8] hover:border-stone-800 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-3/4 sm:aspect-4/5 w-full bg-[#EBE3D3] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
                        <span className="bg-[#18181B] text-[#D4AF37] text-[8.5px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Package className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37]" />
                          پک {product.packSize} تایی
                        </span>

                        {isRetailAvailable && (
                          <span className="bg-emerald-800 text-white text-[8px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                            تک‌فروشی
                          </span>
                        )}

                        {product.isBestSeller && (
                          <span className="bg-amber-500 text-stone-950 text-[8px] sm:text-[9.5px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                            پرفروش
                          </span>
                        )}
                      </div>

                      {/* Video Indicator Button */}
                      {product.videoUrl && (
                        <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 z-10">
                          <span className="bg-[#18181B]/90 backdrop-blur-xs text-[#D4AF37] text-[8px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-[#D4AF37]/30">
                            <Play className="w-2 h-2 fill-[#D4AF37]" />
                            <span className="hidden sm:inline">ویدیو</span>
                          </span>
                        </div>
                      )}

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-stone-950/25 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center pointer-events-none">
                        <span className="bg-[#FAF7F2] text-stone-900 px-3 py-1.5 rounded-xl font-black text-xs shadow-lg flex items-center gap-1.5 border border-[#E6DEC8]">
                          <Eye className="w-3.5 h-3.5 text-[#8C6D37]" />
                          مشاهده تنخور و مشخصات
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        {/* Category & Rating */}
                        <div className="flex items-center justify-between text-[9px] sm:text-[10.5px] text-stone-500 mb-1">
                          <span>{product.category}</span>
                          <span className="flex items-center gap-0.5 font-bold text-amber-600">
                            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-500" />
                            {product.rating || 4.8}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-black text-[11px] sm:text-xs text-stone-900 line-clamp-2 leading-relaxed group-hover:text-[#8C6D37] transition-colors">
                          {product.name}
                        </h2>

                        {/* Fabric Info */}
                        {product.fabricType && (
                          <div className="text-[8.5px] sm:text-[10px] text-stone-600 line-clamp-1 mt-1 font-medium bg-[#FAF7F2] px-1.5 py-0.5 rounded-md border border-[#E6DEC8]">
                            {product.fabricType}
                          </div>
                        )}

                        {/* Colors Chips */}
                        {product.colors && product.colors.length > 0 && (
                          <div className="flex items-center gap-1 mt-1.5 overflow-hidden flex-wrap">
                            {product.colors.slice(0, 3).map((c, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={(e) => handleColorSelect(product.id, c, e)}
                                className={`text-[8px] sm:text-[9.5px] px-1.5 py-0.2 rounded transition-all cursor-pointer ${
                                  activeColor === c 
                                    ? 'bg-stone-900 text-[#D4AF37] font-bold' 
                                    : 'bg-[#FAF7F2] text-stone-700 border border-[#E6DEC8]'
                                }`}
                              >
                                {c}
                              </button>
                            ))}
                            {product.colors.length > 3 && (
                              <span className="text-[8px] sm:text-[9.5px] text-stone-400 font-bold">
                                +{product.colors.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Pricing & Add to Cart Area */}
                      <div className="pt-2 border-t border-[#E6DEC8]/80 space-y-1.5">
                        
                        {/* Price Unit */}
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="text-[9px] sm:text-[10px] text-stone-500">قیمت هر عدد عمده:</span>
                          <span className="font-black text-stone-900 text-[11px] sm:text-xs">
                            {product.baseWholesalePricePerUnit.toLocaleString('fa-IR')} <span className="text-[8.5px] font-normal text-stone-500">تومان</span>
                          </span>
                        </div>

                        {/* Pack Total Price */}
                        <div className="flex items-baseline justify-between bg-[#FAF7F2] px-2 py-1 rounded-lg border border-[#E6DEC8]">
                          <span className="text-[8.5px] sm:text-[9.5px] text-stone-600 font-bold">پک {product.packSize} تایی:</span>
                          <span className="font-black text-[#8C6D37] text-xs sm:text-sm">
                            {product.baseWholesalePricePerPack.toLocaleString('fa-IR')} <span className="text-[8.5px] font-normal text-stone-500">تومان</span>
                          </span>
                        </div>

                        {/* Quick Add Button */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className={`w-full py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                            isAdded
                              ? 'bg-emerald-600 text-white font-black'
                              : 'bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] active:scale-98'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span>به سبد اضافه شد</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
                              <span>خرید پک {product.packSize} تایی</span>
                            </>
                          )}
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-[#E6DEC8] p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 my-8">
              <div className="w-16 h-16 bg-[#FAF7F2] rounded-full flex items-center justify-center mx-auto border border-[#E6DEC8]">
                <Search className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-stone-900">
                هیچ کالایی با فیلترهای انتخابی یافت نشد
              </h3>
              <p className="text-xs text-stone-500">
                لطفاً عبارت جستجو را تغییر دهید یا فیلترهای دسته‌بندی را ریست نمایید.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#18181B] text-[#FAF7F2] rounded-xl text-xs font-bold hover:bg-stone-800 transition-all shadow-xs cursor-pointer"
              >
                نمایش تمام ۲۴ محصول و پک‌های عمده
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer Status & Fast Hotline */}
      <footer className="bg-white border-t border-[#E6DEC8] px-3 sm:px-6 py-2 text-[10px] sm:text-xs text-stone-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>پخش عمده مستقیم بازار بزرگ تهران • ارسال روزانه به تمام شهرها با باربری و تیپاکس</span>
        </div>
        <a 
          href={`tel:${BRAND_INFO.primaryPhone}`} 
          className="font-bold text-stone-900 hover:text-[#8C6D37] hidden sm:inline"
        >
          تماس با واحد فروش: {BRAND_INFO.primaryPhoneDisplay}
        </a>
      </footer>

    </div>
  );
};
