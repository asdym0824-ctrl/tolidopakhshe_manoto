import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  X, 
  Check, 
  Sparkles, 
  Layers, 
  Package, 
  Tag, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product } from '../../types';
import { toPersianDigits, formatPersianPrice } from '../../utils/persianWriting';

interface ProductSearchPickerProps {
  products: Product[];
  selectedProductId: string;
  onSelectProduct: (product: Product) => void;
  rowIndex?: number;
}

export const ProductSearchPicker: React.FC<ProductSearchPickerProps> = ({
  products,
  selectedProductId,
  onSelectProduct,
  rowIndex
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFabricFilter, setSelectedFabricFilter] = useState<string>('all');
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected product
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0] || null;
  }, [products, selectedProductId]);

  // Extract unique fabric types for fast filtering chips
  const fabricCategories = useMemo(() => {
    const fabrics = new Set<string>();
    products.forEach(p => {
      if (p.fabricType) {
        // e.g., extract short fabric keywords like مازراتی, لینن, کتان, پنبه, داکرون, غواصی
        const f = p.fabricType.trim();
        if (f.includes('مازراتی')) fabrics.add('مازراتی');
        else if (f.includes('لینن')) fabrics.add('لینن');
        else if (f.includes('کتان')) fabrics.add('کتان');
        else if (f.includes('داکرون')) fabrics.add('داکرون');
        else if (f.includes('پنبه')) fabrics.add('پنبه');
        else if (f.includes('غواصی')) fabrics.add('غواصی');
        else {
          fabrics.add(f.split(' ')[0]);
        }
      }
    });
    return Array.from(fabrics).slice(0, 5);
  }, [products]);

  // Filtered products based on search term and fabric chip
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return products.filter(p => {
      // 1. Fabric chip filter
      if (selectedFabricFilter !== 'all') {
        const matchesChip = p.fabricType?.toLowerCase().includes(selectedFabricFilter.toLowerCase()) ||
                            p.name.toLowerCase().includes(selectedFabricFilter.toLowerCase());
        if (!matchesChip) return false;
      }

      // 2. Search query filter (matches name, fabric, category, SKU, description, tags)
      if (!term) return true;

      const nameMatch = p.name.toLowerCase().includes(term);
      const fabricMatch = p.fabricType?.toLowerCase().includes(term);
      const skuMatch = p.sku.toLowerCase().includes(term);
      const catMatch = p.category.toLowerCase().includes(term);
      const tagsMatch = p.tags?.some(t => t.toLowerCase().includes(term));
      const colorMatch = p.colors?.some(c => c.toLowerCase().includes(term));

      return nameMatch || fabricMatch || skuMatch || catMatch || tagsMatch || colorMatch;
    });
  }, [products, searchTerm, selectedFabricFilter]);

  // Close on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
      // Focus search input on open
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* 1. Main Display Card / Trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(prev => !prev);
          }
        }}
        className={`w-full group bg-white border rounded-2xl p-2.5 transition-all text-right cursor-pointer select-none flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-xs ${
          isOpen 
            ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 bg-amber-50/20' 
            : 'border-[#DDD5C0] hover:border-[#D4AF37]/70'
        }`}
      >
        {selectedProduct ? (
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Product Image Thumbnail */}
            <div className="relative w-12 h-13 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-2xs group-hover:border-[#D4AF37]/60 transition-colors">
              {selectedProduct.image && !imageErrorMap[selectedProduct.id] ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  onError={() => setImageErrorMap(prev => ({ ...prev, [selectedProduct.id]: true }))}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
              <span className="absolute bottom-0 inset-x-0 bg-stone-900/75 backdrop-blur-2xs text-[9px] text-[#F3E5AB] text-center font-bold font-mono py-0.5 leading-none">
                پک {toPersianDigits(selectedProduct.packSize)}
              </span>
            </div>

            {/* Product & Fabric Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-xs text-stone-900 truncate max-w-[200px] sm:max-w-[240px]">
                  {selectedProduct.name}
                </span>
                <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md border border-stone-200">
                  {selectedProduct.sku}
                </span>
              </div>

              {/* Fabric Type & Model Spec Badge */}
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded-md shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>جنس: {selectedProduct.fabricType || 'پارچه باکیفیت و تضمینی'}</span>
                </span>
                
                <span className="text-[10px] text-stone-600 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200">
                  {selectedProduct.category}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-stone-400 py-1">
            <Search className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-bold">برای انتخاب یا جستجوی کالا و جنس کلیک کنید...</span>
          </div>
        )}

        {/* Action Button Indicator */}
        <div className="flex items-center gap-1.5 shrink-0 pl-1">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6D37] bg-[#FAF7F2] border border-[#E6DEC8] px-2.5 py-1 rounded-xl group-hover:bg-[#18181B] group-hover:text-[#D4AF37] transition-all">
            <Search className="w-3 h-3" />
            <span>جستجو / تغییر</span>
          </span>
          <div className={`w-7 h-7 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-[#D4AF37]/20 group-hover:text-stone-900 transition-all ${
            isOpen ? 'rotate-180 bg-amber-200 text-amber-900' : ''
          }`}>
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border-2 border-[#D4AF37]/40 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header & Search Bar */}
          <div className="p-3 bg-[#FAF7F2] border-b border-[#E6DEC8] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#8C6D37]" />
                <span className="text-xs font-black text-stone-900">
                  تایپ و جستجوی مدل و جنس کالا
                </span>
                <span className="text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                  {toPersianDigits(filteredProducts.length)} مورد
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-200/60 transition-colors"
                title="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input with real-time typing */}
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="تایپ کنید: نام مدل (بگ، کارگو)، جنس پارچه (مازراتی، لینن، کتان)، کد کالا..."
                className="w-full bg-white pr-9 pl-8 py-2.5 rounded-xl border border-[#DDD5C0] font-bold text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute left-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 rounded-md hover:bg-stone-100"
                  title="پاک کردن متن"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Fabric Chips */}
            {fabricCategories.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[10.5px]">
                <span className="text-stone-500 shrink-0 font-medium text-[10px]">فیلتر جنس:</span>
                <button
                  type="button"
                  onClick={() => setSelectedFabricFilter('all')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                    selectedFabricFilter === 'all'
                      ? 'bg-[#18181B] text-[#D4AF37] shadow-2xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  همه جنس‌ها
                </button>
                {fabricCategories.map(fabric => (
                  <button
                    key={fabric}
                    type="button"
                    onClick={() => setSelectedFabricFilter(fabric === selectedFabricFilter ? 'all' : fabric)}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                      selectedFabricFilter === fabric
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-white text-stone-700 border border-[#DDD5C0] hover:bg-amber-50 hover:border-amber-300'
                    }`}
                  >
                    <span>{fabric}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* List of Products */}
          <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-stone-100 p-1.5 space-y-1">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const isSelected = product.id === selectedProductId;
                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 text-right group ${
                      isSelected
                        ? 'bg-amber-100/70 border border-amber-300/80 shadow-2xs'
                        : 'hover:bg-amber-50/60 hover:border-amber-200 border border-transparent'
                    }`}
                  >
                    {/* Right: Image & Information */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Thumbnail Image */}
                      <div className="relative w-13 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 group-hover:border-[#D4AF37] shadow-2xs transition-colors">
                        {product.image && !imageErrorMap[product.id] ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={() => setImageErrorMap(prev => ({ ...prev, [product.id]: true }))}
                            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-stone-950/80 text-[8.5px] text-[#F3E5AB] text-center font-bold font-mono py-0.5">
                          {toPersianDigits(product.packSize)} تایی
                        </span>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-xs text-stone-900 group-hover:text-amber-950 transition-colors">
                            {product.name}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                            {product.sku}
                          </span>
                        </div>

                        {/* Fabric & Specs */}
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>جنس: {product.fabricType || 'پارچه باکیفیت'}</span>
                          </span>

                          <span className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                            دسته: {product.category}
                          </span>

                          {product.packStock !== undefined && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              product.packStock > 5 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              موجودی: {toPersianDigits(product.packStock)} پک
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Left: Price & Select Action */}
                    <div className="shrink-0 text-left flex flex-col items-end gap-1">
                      <strong className="text-xs font-black text-stone-900 font-mono block">
                        {toPersianDigits(product.baseWholesalePricePerPack.toLocaleString('fa-IR'))} ت
                      </strong>
                      <span className="text-[9.5px] text-stone-500 block">
                        (عددی {toPersianDigits(Math.round(product.baseWholesalePricePerPack / product.packSize).toLocaleString('fa-IR'))} ت)
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                          <Check className="w-3 h-3" />
                          <span>انتخاب‌شده</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#8C6D37] group-hover:underline">
                          کلیک برای انتخاب ←
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs font-bold text-stone-700">
                  هیچ جنسی با عنوان یا مشخصات «{searchTerm}» یافت نشد.
                </p>
                <p className="text-[11px] text-stone-500">
                  می‌توانید کلمه دیگری مانند «مازراتی»، «لینن»، «بگ» یا «کارگو» را امتحان کنید.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFabricFilter('all');
                  }}
                  className="mt-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  پاک‌سازی فیلترها و مشاهده همه
                </button>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="p-2.5 bg-[#FAF7F2] border-t border-[#E6DEC8] text-[10px] text-stone-500 flex items-center justify-between">
            <span>💡 نکته: تایپ زنده برای نام مدل، جنس پارچه، و کد فعال است.</span>
            <span className="font-mono text-stone-400">Esc: بستن</span>
          </div>

        </div>
      )}
    </div>
  );
};
