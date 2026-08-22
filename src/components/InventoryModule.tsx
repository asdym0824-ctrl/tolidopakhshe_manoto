import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Percent, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Scissors, 
  Building2, 
  Check, 
  Eye, 
  ArrowUpDown,
  Tag,
  Boxes,
  Grid,
  List
} from 'lucide-react';
import { Product, PackSize, ProductSource } from '../types';

interface InventoryModuleProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onBulkUpdatePrices: (percentage: number, category?: string) => void;
  isBulkModalOpen: boolean;
  setIsBulkModalOpen: (open: boolean) => void;
  isNewProductModalOpen: boolean;
  setIsNewProductModalOpen: (open: boolean) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onBulkUpdatePrices,
  isBulkModalOpen,
  setIsBulkModalOpen,
  isNewProductModalOpen,
  setIsNewProductModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all'); // all, low, normal
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState<any>(null);

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      ...product,
      colorsStr: product.colors.join('، '),
    });
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editForm) return;

    const colorArray = editForm.colorsStr ? editForm.colorsStr.split('،').map((s: string) => s.trim()).filter(Boolean) : editingProduct.colors;
    const baseWholesalePricePerUnit = Number(editForm.baseWholesalePricePerUnit) || editingProduct.baseWholesalePricePerUnit;
    const colleaguePricePerUnit = Number(editForm.colleaguePricePerUnit) || editingProduct.colleaguePricePerUnit;
    const packSize = Number(editForm.packSize) || editingProduct.packSize;
    const baseWholesalePricePerPack = baseWholesalePricePerUnit * packSize;
    const colleaguePricePerPack = colleaguePricePerUnit * packSize;

    const retailPricePerUnit = Number(editForm.retailPricePerUnit) || Math.round((baseWholesalePricePerUnit * 1.35) / 5000) * 5000;

    const updated: Product = {
      ...editingProduct,
      name: editForm.name,
      category: editForm.category,
      fabricType: editForm.fabricType,
      packSize: packSize as PackSize,
      baseWholesalePricePerUnit,
      baseWholesalePricePerPack,
      colleaguePricePerUnit,
      colleaguePricePerPack,
      allowRetailSale: Boolean(editForm.allowRetailSale),
      retailPricePerUnit,
      packStock: Number(editForm.packStock) || 0,
      singleStock: Number(editForm.singleStock) || 0,
      minPackStockAlert: Number(editForm.minPackStockAlert) || 5,
      colors: colorArray,
      sizes: editForm.sizes,
      image: editForm.image,
      description: editForm.description,
      isNewArrival: Boolean(editForm.isNewArrival),
      isBestSeller: Boolean(editForm.isBestSeller),
    };

    onUpdateProduct(updated);
    setEditingProduct(null);
    setEditForm(null);
  };

  // Bulk Price Modal State
  const [bulkPercent, setBulkPercent] = useState<number>(10);
  const [bulkCategory, setBulkCategory] = useState<string>('all');

  // New Product Form State
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    fabricType: string;
    packSize: PackSize;
    source: ProductSource;
    fabricCost: number;
    tailoringCost: number;
    trimsCost: number;
    finishingCost: number;
    partnerPurchaseCost: number;
    partnerSupplierName: string;
    fabricSupplierName: string;
    tailorName: string;
    baseWholesalePricePerUnit: number;
    colleaguePricePerUnit: number;
    packStock: number;
    singleStock: number;
    minPackStockAlert: number;
    colors: string;
    sizes: string;
    image: string;
    description: string;
  }>({
    name: '',
    category: 'شلوار بگ',
    fabricType: 'کتان لایت پنبه‌ای',
    packSize: 6,
    source: 'self_produced',
    fabricCost: 80000,
    tailoringCost: 35000,
    trimsCost: 10000,
    finishingCost: 7000,
    partnerPurchaseCost: 210000,
    partnerSupplierName: 'بنکداری برادران کاظمی (بازار)',
    fabricSupplierName: 'پارچه‌سرای نساجی مولوی',
    tailorName: 'کارگاه دوخت استاد رحمان',
    baseWholesalePricePerUnit: 220000,
    colleaguePricePerUnit: 195000,
    packStock: 20,
    singleStock: 0,
    minPackStockAlert: 5,
    colors: 'مشکی، کرم، طوسی، سرمه‌ای، خاکی',
    sizes: 'فری‌سایز مناسب ۳۸ تا ۴۶',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
    description: 'تنخور ژورنالی فوق‌العاده راحت، پارچه بدون آبرفت، دوخت تمیز کارگاهی',
  });

  // Calculate live cost price based on source
  const calculatedCostPrice = formData.source === 'self_produced'
    ? formData.fabricCost + formData.tailoringCost + formData.trimsCost + formData.finishingCost
    : formData.partnerPurchaseCost;

  const calculatedBasePackPrice = formData.baseWholesalePricePerUnit * formData.packSize;
  const calculatedColleaguePackPrice = formData.colleaguePricePerUnit * formData.packSize;
  const profitMarginPercent = formData.baseWholesalePricePerUnit > 0
    ? Math.round(((formData.baseWholesalePricePerUnit - calculatedCostPrice) / formData.baseWholesalePricePerUnit) * 100)
    : 0;

  // Auto SKU Generator function
  const generateSKU = (cat: string) => {
    const prefixMap: { [k: string]: string } = {
      'شلوار بگ': 'SH-BGR',
      'شلوار راحتی نخی': 'SH-RHT',
      'جاگر': 'SH-JGR',
      'لگ و ساپورت': 'SH-LEG',
      'داکرون اداری/اسپرت': 'SH-DKR',
      'شلوار کارگو': 'SH-CRG',
      'اسلش اسپرت': 'SH-SLS',
      'دامن شلواری': 'SH-DMN',
    };
    const prefix = prefixMap[cat] || 'SH-MDL';
    const rand = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${rand}`;
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newSku = generateSKU(formData.category);
    const colorArray = formData.colors.split('،').map(s => s.trim()).filter(Boolean);

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: newSku,
      name: formData.name || `مدل ${formData.category} ${formData.fabricType}`,
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
      fabricCost: formData.source === 'self_produced' ? formData.fabricCost : 0,
      tailoringCost: formData.source === 'self_produced' ? formData.tailoringCost : 0,
      trimsCost: formData.source === 'self_produced' ? formData.trimsCost : 0,
      finishingCost: formData.source === 'self_produced' ? formData.finishingCost : 0,
      totalCostPrice: calculatedCostPrice,
      packSize: formData.packSize,
      baseWholesalePricePerUnit: formData.baseWholesalePricePerUnit,
      baseWholesalePricePerPack: calculatedBasePackPrice,
      colleaguePricePerUnit: formData.colleaguePricePerUnit,
      colleaguePricePerPack: calculatedColleaguePackPrice,
      retailPricePerUnit: Math.round(formData.baseWholesalePricePerUnit * 1.7),
      packStock: Number(formData.packStock) || 0,
      singleStock: Number(formData.singleStock) || 0,
      minPackStockAlert: Number(formData.minPackStockAlert) || 5,
      source: formData.source,
      partnerSupplierName: formData.source === 'partner_sourced' ? formData.partnerSupplierName : undefined,
      fabricSupplierName: formData.source === 'self_produced' ? formData.fabricSupplierName : undefined,
      tailorName: formData.source === 'self_produced' ? formData.tailorName : undefined,
      fabricType: formData.fabricType,
      colors: colorArray.length > 0 ? colorArray : ['مشکی', 'طوسی', 'کرم'],
      sizes: formData.sizes,
      description: formData.description,
      tags: [formData.category, formData.source === 'self_produced' ? 'تولید_خود' : 'همکاری'],
      createdAt: '۱۴۰۳/۰۳/۰۵',
      updatedAt: '۱۴۰۳/۰۳/۰۵',
    };

    onAddProduct(newProduct);
    setIsNewProductModalOpen(false);
  };

  // Quick Stock adjustment
  const handleAdjustPackStock = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.packStock + delta);
    onUpdateProduct({
      ...product,
      packStock: newStock,
      updatedAt: 'امروز',
    });
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.includes(searchQuery) || p.sku.includes(searchQuery) || p.fabricType.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSource = selectedSource === 'all' || p.source === selectedSource;
    const matchesStock = stockFilter === 'all' || (stockFilter === 'low' && p.packStock <= p.minPackStockAlert);
    return matchesSearch && matchesCategory && matchesSource && matchesStock;
  });

  const categoriesList = Array.from(new Set(products.map(p => p.category)));

  return (
    <div id="inventory-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header with Stats and Main Action Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Package className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-stone-900">
                  انبارداری و مدیریت کالا (سیستم پکی و بهای تمام‌شده)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  ثبت با کد کاتالوگ خودکار، محاسبه دقیق هزینه پارچه و خیاط، قیمت‌گذاری پک‌های ۴، ۶، ۸ و ۱۲ تایی
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-open-bulk-price-modal"
              onClick={() => setIsBulkModalOpen(true)}
              className="text-xs bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Percent className="w-4 h-4" />
              <span>تغییر درصدی قیمت‌ها (تورم پارچه)</span>
            </button>

            <button
              id="btn-open-new-product-modal"
              onClick={() => setIsNewProductModalOpen(true)}
              className="text-xs bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت مدل و کاتالوگ جدید</span>
            </button>
          </div>
        </div>

        {/* Quick Inventory Metrics Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-stone-100">
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <span className="text-[11px] text-stone-500 block">کل مدل‌های فعال</span>
            <span className="text-base font-black text-stone-900">{products.length} مدل کاتالوگ</span>
          </div>
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <span className="text-[11px] text-stone-500 block">موجودی پک‌های آماده فروش</span>
            <span className="text-base font-black text-amber-700">
              {products.reduce((s, p) => s + p.packStock, 0)} پک بسته بندی
            </span>
          </div>
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <span className="text-[11px] text-stone-500 block">تعداد کل عدد در انبار</span>
            <span className="text-base font-black text-stone-900">
              {products.reduce((s, p) => s + (p.packStock * p.packSize) + p.singleStock, 0)} عدد
            </span>
          </div>
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <span className="text-[11px] text-stone-500 block">تولید کارگاه vs خرید همکاری</span>
            <span className="text-base font-black text-emerald-700">
              {products.filter(p => p.source === 'self_produced').length} کارگاه / {products.filter(p => p.source === 'partner_sourced').length} همکاری
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در نام مدل، کد SKU (مثلاً SH-BGR) یا جنس پارچه..."
              className="w-full bg-stone-50 text-xs pr-9 pl-3 py-2 rounded-lg border border-stone-200 focus:border-amber-500 focus:bg-white outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-stone-50 text-xs py-2 px-2.5 rounded-lg border border-stone-200 text-stone-700 outline-none focus:border-amber-500"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-stone-50 text-xs py-2 px-2.5 rounded-lg border border-stone-200 text-stone-700 outline-none focus:border-amber-500"
          >
            <option value="all">همه منابع تامین</option>
            <option value="self_produced">تولید کارگاه خودمان</option>
            <option value="partner_sourced">خرید همکاری (واسطه‌ای)</option>
          </select>

          {/* Stock Alert Filter */}
          <button
            onClick={() => setStockFilter(stockFilter === 'low' ? 'all' : 'low')}
            className={`text-xs px-2.5 py-1.8 rounded-lg border flex items-center gap-1 transition-all ${
              stockFilter === 'low'
                ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>فقط کسری موجودی</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium ${
              viewMode === 'table' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
            title="نمای جدول جامع با بهای تمام شده"
          >
            <List className="w-3.5 h-3.5" />
            <span>جدول مشخصات</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium ${
              viewMode === 'grid' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
            title="نمای کارت ژورنالی"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>کاتالوگ تصویری</span>
          </button>
        </div>
      </div>

      {/* Main Content: Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-100/80 text-stone-600 border-b border-stone-200 font-bold">
                <tr>
                  <th className="p-3">تصویر و مدل کالا</th>
                  <th className="p-3">کد کاتالوگ (SKU)</th>
                  <th className="p-3">بهای تمام‌شده (عدد)</th>
                  <th className="p-3">واحد فروش (پک)</th>
                  <th className="p-3">قیمت عمده پک</th>
                  <th className="p-3">قیمت همکاری (تخفیف‌دار)</th>
                  <th className="p-3">موجودی پک در انبار</th>
                  <th className="p-3">منبع تامین</th>
                  <th className="p-3 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70">
                {filteredProducts.map((product) => {
                  const isLow = product.packStock <= product.minPackStockAlert;
                  return (
                    <tr key={product.id} className="hover:bg-stone-50/80 transition-colors">
                      
                      {/* Product Image and Name */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-stone-900 hover:text-amber-700 cursor-pointer" onClick={() => setSelectedProductForDetails(product)}>
                              {product.name}
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {product.fabricType} • {product.sizes}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {product.colors.slice(0, 3).map((col, idx) => (
                                <span key={idx} className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded border border-stone-200">
                                  {col}
                                </span>
                              ))}
                              {product.colors.length > 3 && (
                                <span className="text-[9px] text-stone-400">+{product.colors.length - 3} رنگ</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-3">
                        <span className="font-mono text-stone-800 bg-stone-100 px-2 py-1 rounded font-bold border border-stone-200 text-[11px]">
                          {product.sku}
                        </span>
                      </td>

                      {/* Real Cost Price Breakdown */}
                      <td className="p-3">
                        <div className="font-bold text-stone-900">
                          {product.totalCostPrice.toLocaleString('fa-IR')} ت
                        </div>
                        {product.source === 'self_produced' ? (
                          <div className="text-[10px] text-stone-400 mt-0.5">
                            پارچه: {(product.fabricCost / 1000).toFixed(0)}k | خیاط: {(product.tailoringCost / 1000).toFixed(0)}k
                          </div>
                        ) : (
                          <div className="text-[10px] text-purple-600 font-medium mt-0.5">
                            خرید از همکار بازار
                          </div>
                        )}
                      </td>

                      {/* Pack Size Unit */}
                      <td className="p-3">
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.8 rounded-md text-[11px] inline-flex items-center gap-1 border border-amber-200">
                          <Boxes className="w-3 h-3" />
                          پک {product.packSize} تایی
                        </span>
                      </td>

                      {/* Base Wholesale Price Per Pack */}
                      <td className="p-3">
                        <div className="font-bold text-stone-900">
                          {product.baseWholesalePricePerPack.toLocaleString('fa-IR')} ت
                        </div>
                        <div className="text-[10px] text-stone-500">
                          دونه‌ای {product.baseWholesalePricePerUnit.toLocaleString('fa-IR')} ت
                        </div>
                      </td>

                      {/* Colleague Price */}
                      <td className="p-3">
                        <div className="font-bold text-emerald-800">
                          {product.colleaguePricePerPack.toLocaleString('fa-IR')} ت
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">
                          اختلاف: {(product.baseWholesalePricePerUnit - product.colleaguePricePerUnit).toLocaleString('fa-IR')} ت/عدد
                        </div>
                      </td>

                      {/* Stock Adjustment Controls */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAdjustPackStock(product, -1)}
                            className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center transition-colors"
                            title="کاهش ۱ پک"
                          >
                            -
                          </button>
                          
                          <div className="text-center min-w-[50px]">
                            <span className={`font-black text-sm block ${isLow ? 'text-rose-600' : 'text-stone-900'}`}>
                              {product.packStock} پک
                            </span>
                            <span className="text-[10px] text-stone-400">
                              ({product.packStock * product.packSize} عدد)
                            </span>
                          </div>

                          <button
                            onClick={() => handleAdjustPackStock(product, 1)}
                            className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center transition-colors"
                            title="افزایش ۱ پک"
                          >
                            +
                          </button>
                        </div>
                        {isLow && (
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded inline-block mt-1">
                            هشدار کسری
                          </span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="p-3">
                        {product.source === 'self_produced' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <Scissors className="w-2.5 h-2.5" />
                            تولید کارگاه
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full">
                            <Building2 className="w-2.5 h-2.5" />
                            خرید همکاری
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleStartEdit(product)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="ویرایش کامل کالا و قیمت و موجودی"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedProductForDetails(product)}
                            className="p-1.5 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            title="مشاهده جزییات و فرمول قیمت"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="حذف از انبار"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Lookbook View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col">
              <div className="relative h-56 bg-stone-100 overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
                  <span className="bg-stone-900/90 text-white font-mono text-xs px-2 py-0.5 rounded-md font-bold backdrop-blur-xs">
                    {product.sku}
                  </span>
                  <span className="bg-amber-600 text-white text-[11px] px-2 py-0.5 rounded-md font-bold">
                    پک {product.packSize} تایی
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 left-2.5 bg-white/95 backdrop-blur-md p-2 rounded-xl border border-white/40 flex items-center justify-between text-xs">
                  <span className="text-stone-500">موجودی:</span>
                  <span className="font-black text-stone-900">{product.packStock} پک ({product.packStock * product.packSize} عدد)</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-stone-500 mt-1">{product.fabricType} • {product.sizes}</p>
                  
                  <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">قیمت عمده هر پک:</span>
                      <span className="font-bold text-stone-900">{product.baseWholesalePricePerPack.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>قیمت همکاری هم‌صنف:</span>
                      <span className="font-bold">{product.colleaguePricePerPack.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-400 text-[11px] pt-1 border-t border-stone-200">
                      <span>بهای تمام‌شده هر عدد:</span>
                      <span>{product.totalCostPrice.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleAdjustPackStock(product, -1)}
                      className="w-7 h-7 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold px-2">{product.packStock} پک</span>
                    <button
                      onClick={() => handleAdjustPackStock(product, 1)}
                      className="w-7 h-7 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(product)}
                      className="text-xs text-blue-600 font-bold hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>ویرایش</span>
                    </button>
                    <button
                      onClick={() => setSelectedProductForDetails(product)}
                      className="text-xs text-amber-700 font-bold hover:underline"
                    >
                      جزئیات
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: Bulk Price Inflation Updater (افزایش درصدی دسته‌جمعی قیمت‌ها) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Percent className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    تغییر درصدی قیمت‌ها (تورم پارچه)
                  </h3>
                  <p className="text-xs text-stone-500">بدون نیاز به عکاسی مجدد یا ویرایش تک‌تک محصولات</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  دسته‌بندی مورد نظر برای تغییر قیمت:
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 text-stone-800 outline-none"
                >
                  <option value="all">تمامی کالاهای انبار (کل کاتالوگ)</option>
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  درصد تغییر قیمت (مثبت برای افزایش، منفی برای تخفیف):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={bulkPercent}
                    onChange={(e) => setBulkPercent(Number(e.target.value))}
                    className="w-32 bg-stone-50 text-base font-bold p-2.5 rounded-xl border border-stone-200 text-stone-900 text-center outline-none"
                  />
                  <span className="text-xs text-stone-500">درصد (٪)</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => setBulkPercent(5)} className="text-xs bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded">+۵٪</button>
                  <button onClick={() => setBulkPercent(10)} className="text-xs bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded">+۱۰٪ (متداول)</button>
                  <button onClick={() => setBulkPercent(15)} className="text-xs bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded">+۱۵٪</button>
                  <button onClick={() => setBulkPercent(-10)} className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 px-2 py-1 rounded">-۱۰٪ حراج</button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <span>💡 تاثیر بر قیمت‌ها:</span>
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  قیمت فروش عمده هر پک و قیمت هم‌صنف به صورت خودکار {bulkPercent > 0 ? `+${bulkPercent}٪ افزایش` : `${bulkPercent}٪ کاهش`} می‌یابد و به نزدیک‌ترین ۱۰,۰۰۰ تومان رند می‌گردد.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-xs px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onBulkUpdatePrices(bulkPercent, bulkCategory === 'all' ? undefined : bulkCategory);
                  setIsBulkModalOpen(false);
                }}
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
              >
                اعمال تغییر قیمت در انبار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New Product / کاتالوگ با فرمول دقیق بهای تمام شده */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  ثبت مدل جدید و محاسبه بهای تمام‌شده
                </h3>
                <p className="text-xs text-stone-500">
                  تولید خودکار کد کاتالوگ (SKU) و تنظیم قیمت‌های چندسطحی پک
                </p>
              </div>
              <button onClick={() => setIsNewProductModalOpen(false)} className="text-stone-400 hover:text-stone-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 my-4">
              
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نام مدل کالا:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شلوار بگ کتان لایت تابستانه"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">دسته‌بندی:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 outline-none"
                  >
                    <option value="شلوار بگ">شلوار بگ</option>
                    <option value="شلوار راحتی نخی">شلوار راحتی نخی</option>
                    <option value="جاگر">جاگر</option>
                    <option value="لگ و ساپورت">لگ و ساپورت</option>
                    <option value="داکرون اداری/اسپرت">داکرون اداری/اسپرت</option>
                    <option value="شلوار کارگو">شلوار کارگو</option>
                    <option value="اسلش اسپرت">اسلش اسپرت</option>
                    <option value="دامن شلواری">دامن شلواری</option>
                  </select>
                </div>
              </div>

              {/* Source & Pack Size */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">منبع تامین کالا:</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as ProductSource })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 outline-none"
                  >
                    <option value="self_produced">تولید کارگاه خودمان (خرید پارچه و خیاط)</option>
                    <option value="partner_sourced">خرید همکاری از همکاران بازار</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">واحد فروش (پک چندتایی):</label>
                  <select
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: Number(e.target.value) as PackSize })}
                    className="w-full bg-amber-50 text-xs font-bold p-2.5 rounded-xl border border-amber-200 text-amber-900 outline-none"
                  >
                    <option value={4}>پک ۴ عددی</option>
                    <option value={6}>پک ۶ عددی (استاندارد)</option>
                    <option value={8}>پک ۸ عددی</option>
                    <option value={12}>پک ۱۲ عددی (جین کامل)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">جنس پارچه:</label>
                  <input
                    type="text"
                    value={formData.fabricType}
                    onChange={(e) => setFormData({ ...formData, fabricType: e.target.value })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 outline-none"
                  />
                </div>
              </div>

              {/* Cost Calculation Box */}
              {formData.source === 'self_produced' ? (
                <div className="p-3.5 bg-stone-100/80 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span>فرمول محاسبه بهای تمام شده به ازای هر ۱ عدد:</span>
                    <span className="text-amber-800 font-black">
                      بهای تمام‌شده: {calculatedCostPrice.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[11px] text-stone-500 block mb-0.5">هزینه پارچه (هر عدد):</span>
                      <input
                        type="number"
                        value={formData.fabricCost}
                        onChange={(e) => setFormData({ ...formData, fabricCost: Number(e.target.value) })}
                        className="w-full bg-white text-xs p-2 rounded-lg border border-stone-200 text-center font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block mb-0.5">دستمزد خیاط/برش:</span>
                      <input
                        type="number"
                        value={formData.tailoringCost}
                        onChange={(e) => setFormData({ ...formData, tailoringCost: Number(e.target.value) })}
                        className="w-full bg-white text-xs p-2 rounded-lg border border-stone-200 text-center font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block mb-0.5">خرج‌کار (کش، نخ):</span>
                      <input
                        type="number"
                        value={formData.trimsCost}
                        onChange={(e) => setFormData({ ...formData, trimsCost: Number(e.target.value) })}
                        className="w-full bg-white text-xs p-2 rounded-lg border border-stone-200 text-center font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block mb-0.5">بسته‌بندی و اتو:</span>
                      <input
                        type="number"
                        value={formData.finishingCost}
                        onChange={(e) => setFormData({ ...formData, finishingCost: Number(e.target.value) })}
                        className="w-full bg-white text-xs p-2 rounded-lg border border-stone-200 text-center font-bold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
                  <span className="text-xs font-bold text-purple-900 block">اطلاعات خرید از همکار بازار:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-stone-600 block mb-0.5">قیمت خرید هر عدد از همکار:</span>
                      <input
                        type="number"
                        value={formData.partnerPurchaseCost}
                        onChange={(e) => setFormData({ ...formData, partnerPurchaseCost: Number(e.target.value) })}
                        className="w-full bg-white text-xs p-2 rounded-lg border border-purple-200 text-center font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-600 block mb-0.5">نام همکار / بنکدار:</span>
                      <input
                        type="text"
                        value={formData.partnerSupplierName}
                        onChange={(e) => setFormData({ ...formData, partnerSupplierName: e.target.value })}
                        className="w-full bg-white text-xs p-2 rounded-lg border border-purple-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Tiers & Margins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    قیمت فروش عمده عادی (به ازای هر عدد):
                  </label>
                  <input
                    type="number"
                    value={formData.baseWholesalePricePerUnit}
                    onChange={(e) => setFormData({ ...formData, baseWholesalePricePerUnit: Number(e.target.value) })}
                    className="w-full bg-white text-sm font-black p-2 rounded-lg border border-stone-300 text-stone-900"
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-500">
                    <span>قیمت کل هر پک {formData.packSize} تایی:</span>
                    <span className="font-bold text-stone-800">
                      {calculatedBasePackPrice.toLocaleString('fa-IR')} ت
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-700 font-bold">
                    حاشیه سود ناخالص: {profitMarginPercent}٪
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    قیمت همکاری هم‌صنف (تخفیف ویژه):
                  </label>
                  <input
                    type="number"
                    value={formData.colleaguePricePerUnit}
                    onChange={(e) => setFormData({ ...formData, colleaguePricePerUnit: Number(e.target.value) })}
                    className="w-full bg-white text-sm font-black p-2 rounded-lg border border-emerald-300 text-emerald-900"
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-emerald-700">
                    <span>قیمت کل هر پک همکاری:</span>
                    <span className="font-bold text-emerald-900">
                      {calculatedColleaguePackPrice.toLocaleString('fa-IR')} ت
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-stone-500">
                    تفاوت قیمت: {(formData.baseWholesalePricePerUnit - formData.colleaguePricePerUnit).toLocaleString('fa-IR')} تومان به ازای هر عدد
                  </div>
                </div>
              </div>

              {/* Stock Input & Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">تعداد پک اولیه در انبار:</label>
                  <input
                    type="number"
                    value={formData.packStock}
                    onChange={(e) => setFormData({ ...formData, packStock: Number(e.target.value) })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رنگ‌بندی (جدا شده با ویرگول):</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">سایزبندی:</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              {/* Image URL & Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">آدرس تصویر ژورنالی کالا:</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-stone-50 text-xs p-2 rounded-xl border border-stone-200 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="text-xs px-4 py-2.5 text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  ثبت در انبار و صدور کد SKU خودکار
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: View Product Details */}
      {selectedProductForDetails && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-stone-100 text-stone-900 font-bold px-2 py-0.5 rounded text-xs">
                  {selectedProductForDetails.sku}
                </span>
                <h3 className="text-sm font-bold text-stone-900 truncate">
                  {selectedProductForDetails.name}
                </h3>
              </div>
              <button onClick={() => setSelectedProductForDetails(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <img
                src={selectedProductForDetails.image}
                alt={selectedProductForDetails.name}
                referrerPolicy="no-referrer"
                className="w-full h-48 object-cover rounded-xl border border-stone-200"
              />

              <div className="grid grid-cols-2 gap-2 text-stone-700 bg-stone-50 p-3 rounded-xl">
                <div><span>دسته:</span> <strong className="text-stone-900">{selectedProductForDetails.category}</strong></div>
                <div><span>بسته‌بندی:</span> <strong className="text-amber-800">پک {selectedProductForDetails.packSize} عددی</strong></div>
                <div><span>موجودی پک:</span> <strong className="text-stone-900">{selectedProductForDetails.packStock} پک</strong></div>
                <div><span>کل تعداد عدد:</span> <strong className="text-stone-900">{selectedProductForDetails.packStock * selectedProductForDetails.packSize} عدد</strong></div>
                <div><span>جنس پارچه:</span> <strong>{selectedProductForDetails.fabricType}</strong></div>
                <div><span>سایز:</span> <strong>{selectedProductForDetails.sizes}</strong></div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>قیمت عمده هر پک:</span>
                  <span className="text-stone-900">{selectedProductForDetails.baseWholesalePricePerPack.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>قیمت همکاری هم‌صنف:</span>
                  <span>{selectedProductForDetails.colleaguePricePerPack.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between text-stone-500 pt-1 border-t border-amber-200/60">
                  <span>بهای تمام‌شده هر عدد:</span>
                  <span>{selectedProductForDetails.totalCostPrice.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>

              <p className="text-stone-500 text-[11px] leading-relaxed">
                {selectedProductForDetails.description}
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedProductForDetails(null)}
                className="text-xs bg-stone-900 text-white font-bold px-4 py-2 rounded-xl"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Full Product Editor (ویرایش مشخصات، قیمت، خرده‌فروشی و موجودی کالا) */}
      {editingProduct && editForm && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                  <Edit3 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    ویرایش مشخصات و قیمت‌های کالا
                  </h3>
                  <p className="text-xs text-stone-500">
                    کد کاتالوگ: <strong className="font-mono text-stone-800">{editingProduct.sku}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setEditForm(null);
                }}
                className="text-stone-400 hover:text-stone-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditSubmit} className="my-4 space-y-4 text-xs">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نام مدل شلوار:</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">دسته‌بندی بازار:</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200"
                  >
                    <option value="شلوار بگ">شلوار بگ (پرفروش)</option>
                    <option value="شلوار راحتی نخی">شلوار راحتی نخی و خانگی</option>
                    <option value="جاگر">شلوار جاگر و دمپا کش</option>
                    <option value="لگ و ساپورت">لگ غواصی و ساپورت</option>
                    <option value="داکرون اداری/اسپرت">داکرون اداری و اسپرت</option>
                    <option value="شلوار کارگو">کارگو ۶ جیب</option>
                    <option value="اسلش اسپرت">اسلش ورزشی و اسپرت</option>
                    <option value="دامن شلواری">دامن شلواری تابستانه</option>
                  </select>
                </div>
              </div>

              {/* Fabric and Pack Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">جنس پارچه:</label>
                  <input
                    type="text"
                    value={editForm.fabricType}
                    onChange={(e) => setEditForm({ ...editForm, fabricType: e.target.value })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">تعداد در هر پک (بسته‌بندی عمده):</label>
                  <select
                    value={editForm.packSize}
                    onChange={(e) => setEditForm({ ...editForm, packSize: Number(e.target.value) })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200"
                  >
                    <option value={4}>پک ۴ تایی</option>
                    <option value={6}>پک ۶ تایی (معیار بازار)</option>
                    <option value={8}>پک ۸ تایی</option>
                    <option value={10}>پک ۱۰ تایی</option>
                    <option value={12}>جین ۱۲ تایی (حراجی/راحتی)</option>
                  </select>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-3">
                <span className="font-bold text-amber-950 block">قیمت‌گذاری عمده و همکار:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 mb-1 font-bold">قیمت عمده پایه (به ازای هر عدد - تومان):</label>
                    <input
                      type="number"
                      step={5000}
                      value={editForm.baseWholesalePricePerUnit}
                      onChange={(e) => setEditForm({ ...editForm, baseWholesalePricePerUnit: Number(e.target.value) })}
                      className="w-full bg-white text-xs p-2.5 rounded-xl border border-amber-200 font-mono font-bold"
                    />
                    <span className="text-[10px] text-amber-800 mt-1 block">
                      قیمت کل پک {editForm.packSize} تایی: <strong>{((Number(editForm.baseWholesalePricePerUnit) || 0) * (Number(editForm.packSize) || 6)).toLocaleString('fa-IR')} تومان</strong>
                    </span>
                  </div>

                  <div>
                    <label className="block text-stone-700 mb-1 font-bold">قیمت همکاری ویژه بنکداران (هر عدد):</label>
                    <input
                      type="number"
                      step={5000}
                      value={editForm.colleaguePricePerUnit}
                      onChange={(e) => setEditForm({ ...editForm, colleaguePricePerUnit: Number(e.target.value) })}
                      className="w-full bg-white text-xs p-2.5 rounded-xl border border-amber-200 font-mono text-emerald-800 font-bold"
                    />
                    <span className="text-[10px] text-emerald-700 mt-1 block">
                      قیمت پک همکار: <strong>{((Number(editForm.colleaguePricePerUnit) || 0) * (Number(editForm.packSize) || 6)).toLocaleString('fa-IR')} تومان</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Retail Toggle and Price */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900 block">فروش تکی در سایت (مشتری عادی):</span>
                    <span className="text-[11px] text-stone-500">امکان خرید تک‌دانه این محصول توسط مشتریان عادی در سایت</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editForm.allowRetailSale)}
                      onChange={(e) => setEditForm({ ...editForm, allowRetailSale: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {editForm.allowRetailSale && (
                  <div className="pt-2 border-t border-stone-200">
                    <label className="block text-stone-700 mb-1 font-bold">قیمت تک‌فروشی در سایت (تومان):</label>
                    <input
                      type="number"
                      step={5000}
                      value={editForm.retailPricePerUnit || Math.round((Number(editForm.baseWholesalePricePerUnit) * 1.35) / 5000) * 5000}
                      onChange={(e) => setEditForm({ ...editForm, retailPricePerUnit: Number(e.target.value) })}
                      className="w-full sm:w-1/2 bg-white text-xs p-2.5 rounded-xl border border-stone-300 font-mono font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Stock and Alerts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">موجودی پک در انبار:</label>
                  <input
                    type="number"
                    value={editForm.packStock}
                    onChange={(e) => setEditForm({ ...editForm, packStock: Number(e.target.value) })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">موجودی تکی (نمونه/تک‌فروشی):</label>
                  <input
                    type="number"
                    value={editForm.singleStock || 0}
                    onChange={(e) => setEditForm({ ...editForm, singleStock: Number(e.target.value) })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">آستانه هشدار کسری (پک):</label>
                  <input
                    type="number"
                    value={editForm.minPackStockAlert || 5}
                    onChange={(e) => setEditForm({ ...editForm, minPackStockAlert: Number(e.target.value) })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 font-mono"
                  />
                </div>
              </div>

              {/* Colors and Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رنگ‌بندی (جدا شده با ویرگول):</label>
                  <input
                    type="text"
                    value={editForm.colorsStr}
                    onChange={(e) => setEditForm({ ...editForm, colorsStr: e.target.value })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">سایزبندی:</label>
                  <input
                    type="text"
                    value={editForm.sizes}
                    onChange={(e) => setEditForm({ ...editForm, sizes: e.target.value })}
                    className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">آدرس تصویر کالا:</label>
                <input
                  type="text"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 font-mono text-[11px]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">توضیحات و مشخصات تنخور:</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              {/* Badges Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.isNewArrival)}
                    onChange={(e) => setEditForm({ ...editForm, isNewArrival: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-bold text-stone-700">برچسب مدل جدید (New)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.isBestSeller)}
                    onChange={(e) => setEditForm({ ...editForm, isBestSeller: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-bold text-stone-700">برچسب پرفروش بازار (Best Seller)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setEditForm(null);
                  }}
                  className="text-xs px-4 py-2.5 text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>ذخیره تغییرات محصول</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
