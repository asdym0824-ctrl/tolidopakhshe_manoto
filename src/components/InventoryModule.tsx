import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  List,
  Clock,
  ShieldAlert,
  Star,
  ShoppingBag,
  Play,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  EyeOff,
  Palette,
  DollarSign,
  CheckCircle,
  Image as ImageIcon,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Product, PackSize, ProductSource, Invoice } from '../types';
import { ImageUploader } from './common/ImageUploader';
import { VideoUploader } from './common/VideoUploader';

// Category fallback curated high-resolution images to guarantee no broken card on the site
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'شلوار بگ': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
  'شلوار نیم‌بگ': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
  'شلوار کارگو': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
  'شلوار کرپ مازراتی': 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&auto=format&fit=crop&q=80',
  'شلوار لینن': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
  'شلوار بوت‌کات': 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800&auto=format&fit=crop&q=80',
  'شلوار راحتی نخی': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80',
  'جاگر': 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop&q=80',
  'لگ و ساپورت': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80',
  'داکرون اداری/اسپرت': 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&auto=format&fit=crop&q=80',
  'اسلش اسپرت': 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80',
  'دامن شلواری': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
  'ست زنانه': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
};

const POPULAR_CATEGORIES = [
  'شلوار بگ',
  'شلوار نیم‌بگ',
  'شلوار کارگو',
  'شلوار کرپ مازراتی',
  'شلوار لینن',
  'شلوار بوت‌کات',
  'جاگر',
  'لگ و ساپورت',
  'داکرون اداری/اسپرت',
  'شلوار راحتی نخی',
  'اسلش اسپرت',
  'دامن شلواری',
  'ست زنانه',
  'سایر (دسته جدید)',
];

const POPULAR_FABRICS = [
  'کرپ مازراتی اعلا',
  'لینن نچرال شسته‌شده',
  'کتان لایت پنبه‌ای',
  'داکرون تابستانه',
  'غواصی گرم‌بالا',
  'جین کاغذی نیل',
  'نخ پنبه سوپر',
];

const POPULAR_COLORS = [
  'مشکی',
  'کرم استخوانی',
  'طوسی روشن',
  'سبز یشمی',
  'سرمه‌ای',
  'خاکی',
  'نسکافه‌ای',
  'سفید',
  'ذغالی',
  'شتری',
  'موکا',
  'آجری',
];

const POPULAR_SIZES = [
  'فری‌سایز مناسب ۳۸ تا ۴۶',
  'سایز ۱ و ۲ (۳۶ تا ۴۶)',
  'سایزبندی ۳۸، ۴۰، ۴۲، ۴۴',
  'سایز بزرگ ۴۴ تا ۵۲',
];

interface InventoryModuleProps {
  products: Product[];
  invoices?: Invoice[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onBulkUpdatePrices: (percentage: number, category?: string) => void;
  isBulkModalOpen: boolean;
  setIsBulkModalOpen: (open: boolean) => void;
  isNewProductModalOpen: boolean;
  setIsNewProductModalOpen: (open: boolean) => void;
  onNavigateToProduction?: () => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  products,
  invoices = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onBulkUpdatePrices,
  isBulkModalOpen,
  setIsBulkModalOpen,
  isNewProductModalOpen,
  setIsNewProductModalOpen,
  onNavigateToProduction,
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
      galleryImages: product.galleryImages || [],
      videoUrl: product.videoUrl || '',
      videoTitle: product.videoTitle || '',
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
      image: editForm.image || editingProduct.image,
      galleryImages: editForm.galleryImages || [],
      videoUrl: editForm.videoUrl?.trim() || undefined,
      videoTitle: editForm.videoTitle?.trim() || undefined,
      description: editForm.description,
      isNewArrival: Boolean(editForm.isNewArrival),
      isBestSeller: Boolean(editForm.isBestSeller),
    };

    onUpdateProduct(updated);
    setEditingProduct(null);
    setEditForm(null);
  };

  // Fullscreen Table Mode
  const [isTableFullscreen, setIsTableFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsTableFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isTableFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isTableFullscreen]);

  // Toast notification for actions
  const [creationSuccessToast, setCreationSuccessToast] = useState<string | null>(null);

  // Bulk Price Modal State
  const [bulkPercent, setBulkPercent] = useState<number>(10);
  const [bulkCategory, setBulkCategory] = useState<string>('all');

  // New Product Modal Tabs and Preview State
  const [newProductTab, setNewProductTab] = useState<'info' | 'media' | 'costs' | 'pricing' | 'variants'>('info');
  const [showLiveStorefrontPreview, setShowLiveStorefrontPreview] = useState<boolean>(true);

  // Auto SKU Generator function
  const generateSKU = (cat: string) => {
    const prefixMap: Record<string, string> = {
      'شلوار بگ': 'SH-BGR',
      'شلوار نیم‌بگ': 'SH-NBG',
      'شلوار کارگو': 'SH-CRG',
      'شلوار کرپ مازراتی': 'SH-MZR',
      'شلوار لینن': 'SH-LNN',
      'شلوار بوت‌کات': 'SH-BTC',
      'شلوار راحتی نخی': 'SH-RHT',
      'جاگر': 'SH-JGR',
      'لگ و ساپورت': 'SH-LEG',
      'داکرون اداری/اسپرت': 'SH-DKR',
      'اسلش اسپرت': 'SH-SLS',
      'دامن شلواری': 'SH-DMN',
      'ست زنانه': 'ST-ZNN',
    };
    const prefix = prefixMap[cat] || 'SH-MDL';
    const rand = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${rand}`;
  };

  // Initial New Product Form State
  const initialNewProductFormState = {
    name: '',
    category: 'شلوار بگ',
    customCategory: '',
    sku: 'SH-BGR-842',
    fabricType: 'کرپ مازراتی اعلا',
    packSize: 6 as PackSize,
    source: 'self_produced' as ProductSource,
    fabricCost: 85000,
    tailoringCost: 35000,
    trimsCost: 12000,
    finishingCost: 8000,
    partnerPurchaseCost: 210000,
    partnerSupplierName: 'بنکداری برادران کاظمی (بازار)',
    fabricSupplierName: 'پارچه‌سرای نساجی مولوی (حاج محمود)',
    tailorName: 'کارگاه دوخت استاد رحمان (خیابان خیام)',
    baseWholesalePricePerUnit: 220000,
    colleaguePricePerUnit: 195000,
    allowRetailSale: true,
    retailMarkupPercent: 35,
    retailPricePerUnit: 345000,
    packStock: 24,
    singleStock: 0,
    minPackStockAlert: 5,
    colors: 'مشکی، کرم استخوانی، طوسی روشن، سبز یشمی، سرمه‌ای',
    sizes: 'فری‌سایز مناسب ۳۸ تا ۴۶',
    image: CATEGORY_FALLBACK_IMAGES['شلوار بگ'],
    galleryImages: [] as string[],
    videoUrl: '',
    videoTitle: 'ویدیو معرفی و تنخور شلوار',
    description: 'تنخور ژورنالی فوق‌العاده شیک، پارچه بدون آبرفت، دوخت تمیز کارگاهی با نخ پنج‌لا، کش کمر ۴ سانتی اعلا',
    isNewArrival: true,
    isBestSeller: false,
  };

  const [formData, setFormData] = useState(initialNewProductFormState);

  // Initialize or reset form with dynamic SKU
  const initNewProductForm = (customCategoryInitial?: string) => {
    const selectedCat = customCategoryInitial || formData.category;
    const autoSku = generateSKU(selectedCat);
    const fallbackImg = CATEGORY_FALLBACK_IMAGES[selectedCat] || CATEGORY_FALLBACK_IMAGES['شلوار بگ'];
    setFormData({
      ...initialNewProductFormState,
      category: selectedCat,
      sku: autoSku,
      image: fallbackImg,
    });
    setNewProductTab('info');
  };

  // Live calculation of cost price based on source
  const calculatedCostPrice = formData.source === 'self_produced'
    ? (Number(formData.fabricCost) || 0) + 
      (Number(formData.tailoringCost) || 0) + 
      (Number(formData.trimsCost) || 0) + 
      (Number(formData.finishingCost) || 0)
    : (Number(formData.partnerPurchaseCost) || 0);

  const calculatedBasePackPrice = (Number(formData.baseWholesalePricePerUnit) || 0) * (Number(formData.packSize) || 6);
  const calculatedColleaguePackPrice = (Number(formData.colleaguePricePerUnit) || 0) * (Number(formData.packSize) || 6);
  
  const profitMarginPercent = formData.baseWholesalePricePerUnit > 0
    ? Math.round(((formData.baseWholesalePricePerUnit - calculatedCostPrice) / formData.baseWholesalePricePerUnit) * 100)
    : 0;

  // Toggle quick color chips
  const toggleColorInForm = (colorName: string) => {
    const currentList = formData.colors.split(/[،,]/).map(s => s.trim()).filter(Boolean);
    let updated: string[];
    if (currentList.includes(colorName)) {
      updated = currentList.filter(c => c !== colorName);
    } else {
      updated = [...currentList, colorName];
    }
    setFormData({ ...formData, colors: updated.join('، ') });
  };

  // Change category handler with intelligent fallback picture and SKU
  const handleCategoryChange = (newCat: string) => {
    const isCustom = newCat === 'سایر (دسته جدید)';
    const targetCat = isCustom ? (formData.customCategory || 'شلوار مجلسی') : newCat;
    const newSku = generateSKU(targetCat);
    const fallbackImage = CATEGORY_FALLBACK_IMAGES[newCat] || CATEGORY_FALLBACK_IMAGES['شلوار بگ'];

    setFormData(prev => ({
      ...prev,
      category: newCat,
      sku: newSku,
      image: (!prev.image || Object.values(CATEGORY_FALLBACK_IMAGES).includes(prev.image)) ? fallbackImage : prev.image,
    }));
  };

  // Handle final product creation
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = formData.category === 'سایر (دسته جدید)' && formData.customCategory.trim()
      ? formData.customCategory.trim()
      : formData.category;

    const finalSku = formData.sku.trim() || generateSKU(finalCategory);

    const colorArray = formData.colors
      .split(/[،,]/)
      .map(s => s.trim())
      .filter(Boolean);

    const finalImage = formData.image.trim() ||
      CATEGORY_FALLBACK_IMAGES[finalCategory] ||
      CATEGORY_FALLBACK_IMAGES['شلوار بگ'] ||
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80';

    const wholesaleUnitPrice = Math.max(0, Number(formData.baseWholesalePricePerUnit) || 0);
    const packSize = Number(formData.packSize) || 6;
    const wholesalePackPrice = wholesaleUnitPrice * packSize;
    const colleagueUnitPrice = Math.max(0, Number(formData.colleaguePricePerUnit) || Math.max(wholesaleUnitPrice - 15000, 10000));
    const colleaguePackPrice = colleagueUnitPrice * packSize;

    const defaultRetailMarkup = Number(formData.retailMarkupPercent) || 35;
    const finalRetailPrice = formData.allowRetailSale
      ? (Number(formData.retailPricePerUnit) > 0
          ? Number(formData.retailPricePerUnit)
          : Math.round((wholesaleUnitPrice * (1 + defaultRetailMarkup / 100)) / 5000) * 5000)
      : undefined;

    const packStock = Math.max(0, Number(formData.packStock) || 0);
    const singleStock = Math.max(0, Number(formData.singleStock) || 0);

    let todayStr = '۱۴۰۳/۰۷/۰۱';
    try {
      todayStr = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    } catch {}

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: finalSku,
      name: formData.name.trim() || `مدل ${finalCategory} ${formData.fabricType}`,
      category: finalCategory,
      image: finalImage,
      galleryImages: formData.galleryImages && formData.galleryImages.length > 0 ? formData.galleryImages : [finalImage],
      videoUrl: formData.videoUrl?.trim() || undefined,
      videoTitle: formData.videoTitle?.trim() || undefined,
      fabricCost: formData.source === 'self_produced' ? Number(formData.fabricCost) || 0 : 0,
      tailoringCost: formData.source === 'self_produced' ? Number(formData.tailoringCost) || 0 : 0,
      trimsCost: formData.source === 'self_produced' ? Number(formData.trimsCost) || 0 : 0,
      finishingCost: formData.source === 'self_produced' ? Number(formData.finishingCost) || 0 : 0,
      totalCostPrice: calculatedCostPrice,
      packSize: packSize as PackSize,
      baseWholesalePricePerUnit: wholesaleUnitPrice,
      baseWholesalePricePerPack: wholesalePackPrice,
      colleaguePricePerUnit: colleagueUnitPrice,
      colleaguePricePerPack: colleaguePackPrice,
      allowRetailSale: formData.allowRetailSale,
      retailMarkupPercent: defaultRetailMarkup,
      retailPricePerUnit: finalRetailPrice,
      packStock: packStock,
      singleStock: singleStock,
      minPackStockAlert: Number(formData.minPackStockAlert) || 5,
      source: formData.source,
      partnerSupplierName: formData.source === 'partner_sourced' ? formData.partnerSupplierName : undefined,
      fabricSupplierName: formData.source === 'self_produced' ? formData.fabricSupplierName : undefined,
      tailorName: formData.source === 'self_produced' ? formData.tailorName : undefined,
      fabricType: formData.fabricType.trim() || 'کرپ مازراتی اعلا',
      colors: colorArray.length > 0 ? colorArray : ['مشکی', 'طوسی روشن', 'کرم'],
      sizes: formData.sizes.trim() || 'فری‌سایز مناسب ۳۸ تا ۴۶',
      description: formData.description.trim() || 'تنخور ژورنالی فوق‌العاده راحت، دوخت تمیز کارگاهی با نخ پنج‌لا، کش کمر ۴ سانتی اعلا',
      tags: [finalCategory, formData.source === 'self_produced' ? 'تولید_خود' : 'همکاری', 'ویترین_سایت'],
      rating: 5.0,
      reviewCount: 1,
      isNewArrival: formData.isNewArrival,
      isBestSeller: formData.isBestSeller,
      createdAt: todayStr,
      updatedAt: todayStr,
    };

    onAddProduct(newProduct);
    setIsNewProductModalOpen(false);
    setCreationSuccessToast(`مدل جدید «${newProduct.name}» با کد کاتالوگ ${newProduct.sku} با موفقیت در انبار و ویترین سایت ثبت شد.`);
    setTimeout(() => {
      setCreationSuccessToast(null);
    }, 6000);
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

  // Inventory valuation summary metrics
  const totalFilteredPacks = useMemo(() => filteredProducts.reduce((s, p) => s + p.packStock, 0), [filteredProducts]);
  const totalFilteredUnits = useMemo(() => filteredProducts.reduce((s, p) => s + (p.packStock * p.packSize) + p.singleStock, 0), [filteredProducts]);
  const totalFilteredWholesaleValue = useMemo(() => filteredProducts.reduce((s, p) => s + (p.packStock * p.baseWholesalePricePerPack), 0), [filteredProducts]);
  const totalFilteredCostValue = useMemo(() => filteredProducts.reduce((s, p) => s + (p.packStock * p.packSize * p.totalCostPrice), 0), [filteredProducts]);

  return (
    <div id="inventory-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Creation Success Toast Notification */}
      {creationSuccessToast && (
        <div className="bg-emerald-900 text-emerald-50 px-4 py-3 rounded-2xl border border-emerald-700 shadow-md flex items-center justify-between animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-emerald-800 text-emerald-200 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </span>
            <span className="text-xs sm:text-sm font-bold">{creationSuccessToast}</span>
          </div>
          <button 
            onClick={() => setCreationSuccessToast(null)}
            className="text-emerald-300 hover:text-white text-xs px-2 py-1 rounded-lg"
          >
            بستن
          </button>
        </div>
      )}

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
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-open-new-product-modal"
              onClick={() => {
                initNewProductForm();
                setIsNewProductModalOpen(true);
              }}
              className="relative group bg-[#18181B] hover:bg-black text-[#FAF7F2] border border-[#D4AF37]/50 hover:border-[#D4AF37] px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-[0_2px_10px_rgba(24,24,27,0.12)] hover:shadow-[0_4px_16px_rgba(212,175,55,0.22)] active:scale-98 flex items-center gap-2.5 cursor-pointer"
              title="ثبت مدل جدید در ویترین سایت و انبار با تنظیم دقیق مشخصات، عکس، ویدیو، قیمت عمده و تکی"
            >
              <span className="p-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg group-hover:bg-[#D4AF37] group-hover:text-[#18181B] transition-colors">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </span>
              <div className="flex flex-col text-right leading-tight">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  ثبت مدل و کاتالوگ جدید
                </span>
                <span className="text-[9.5px] text-[#D4AF37] font-medium">
                  طراحی تخصصی برای ویترین و انبار
                </span>
              </div>
              <span className="hidden sm:inline-flex bg-white/10 text-white/90 text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10">
                + جدید
              </span>
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
        <div className={`transition-all duration-200 ${
          isTableFullscreen
            ? 'fixed inset-0 z-50 bg-[#FAF8F5] p-3 sm:p-6 overflow-y-auto space-y-4 shadow-2xl'
            : 'bg-white rounded-3xl border border-[#DFD7C2] shadow-sm overflow-hidden space-y-4 p-4 sm:p-5'
        }`}>
          {/* Fullscreen Notice Banner */}
          {isTableFullscreen && (
            <div className="bg-[#18181B] text-[#FAF8F5] px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-medium border border-[#D4AF37]/30 shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-[#D4AF37]">حالت تمام‌صفحه جدول کاردکس انبار و کالاها فعال است</span>
                <span className="text-stone-400 hidden sm:inline">| برای خروج می‌توانید کلید Esc کیبورد یا دکمه کوچک‌نمایی را بزنید</span>
              </div>
              <button
                onClick={() => setIsTableFullscreen(false)}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white flex items-center gap-1.5 transition-colors font-bold text-xs"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>خروج از تمام‌صفحه</span>
              </button>
            </div>
          )}

          {/* Inner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE9DC]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
                <Boxes className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                  <span>جدول جامع کاردکس انبار، بهای تمام‌شده و نرخ‌های فروش</span>
                  <span className="text-[11px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-full">
                    {filteredProducts.length.toLocaleString('fa-IR')} مدل در این نما
                  </span>
                  {isTableFullscreen && (
                    <span className="text-[10px] font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-md animate-pulse">
                      نمای تمام‌صفحه
                    </span>
                  )}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  تفکیک تولید کارگاه اختصاصی «من و تو» و خرید همکاری، پایش بلادرنگ موجودی پک‌ها و حاشیه سود
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setIsTableFullscreen(!isTableFullscreen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer active:scale-95 ${
                  isTableFullscreen
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                    : 'bg-[#FAF7F2] hover:bg-[#EFE8D8] text-stone-800 border-[#DDD5C0] shadow-2xs'
                }`}
                title={isTableFullscreen ? 'خروج از حالت تمام‌صفحه (کلید Esc)' : 'بزرگ‌نمایی و نمایش تمام‌صفحه جدول'}
              >
                {isTableFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-white" />
                    <span>خروج از تمام‌صفحه (Esc)</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#8C6D37]" />
                    <span>نمای تمام‌صفحه</span>
                  </>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                <span>کل کاتالوگ:</span>
                <strong className="text-stone-900 font-black">{products.length.toLocaleString('fa-IR')} مدل</strong>
              </div>
            </div>
          </div>

          {/* Master Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E6DEC8] shadow-2xs">
            <table className="w-full text-right text-xs border-collapse">
              <thead className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-stone-100 border-b-2 border-[#D4AF37]">
                <tr>
                  {/* Column 1: Main Product Photo */}
                  <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>عکس اصلی کالا</span>
                    </div>
                  </th>

                  {/* Column 2: Colors */}
                  <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>رنگ‌ها و تنوع</span>
                    </div>
                  </th>

                  {/* Column 3: Model & Fabric */}
                  <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>مدل کالا و پارچه</span>
                    </div>
                  </th>

                  <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>کد کاتالوگ (SKU)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>بهای تمام‌شده (واحد)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Boxes className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>واحد فروش (پک)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>قیمت عمده پک</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>قیمت همکاری هم‌صنف</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>موجودی پک در انبار</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>منبع تامین کالا</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>عملیات و مدیریت</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9DC]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] flex items-center justify-center text-stone-400 mb-3 shadow-2xs">
                          <Search className="w-6 h-6 text-stone-400" />
                        </div>
                        <h4 className="text-sm font-extrabold text-stone-900">هیچ مدلی با این مشخصات یافت نشد</h4>
                        <p className="text-xs text-stone-500 mt-1">
                          با فیلتر انتخابی یا عبارت جستجوی «{searchQuery}» کالایی در انبار ثبت نشده است.
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                            setSelectedSource('all');
                            setStockFilter('all');
                          }}
                          className="mt-3.5 px-4 py-1.5 bg-[#18181B] text-[#FAF7F2] hover:bg-stone-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          پاک کردن فیلترها و مشاهده همه
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isLow = product.packStock <= product.minPackStockAlert;
                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80"
                      >
                        {/* Column 1: عکس اصلی کالا (Main Photo) */}
                        <td className="p-3.5 align-middle text-center whitespace-nowrap">
                          <div
                            onClick={() => setSelectedProductForDetails(product)}
                            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-[#DDD5C0] shrink-0 shadow-2xs bg-stone-100 group-hover:border-[#D4AF37] group-hover:shadow-md transition-all cursor-pointer mx-auto group/img"
                            title="کلیک برای مشاهده جزئیات و تصاویر ژورنالی"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                              <Eye className="w-4 h-4 text-[#FAF7F2]" />
                            </div>
                            {product.galleryImages && product.galleryImages.length > 1 && (
                              <span className="absolute bottom-1 left-1 bg-stone-900/80 backdrop-blur-xs text-[#FAF7F2] text-[8px] font-mono font-bold px-1 py-0.2 rounded">
                                {product.galleryImages.length}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Column 2: رنگ‌ها (Colors) */}
                        <td className="p-3.5 align-middle">
                          <div className="flex flex-wrap gap-1 max-w-[190px]">
                            {product.colors.map((col, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[10px] font-medium bg-[#FAF7F2] text-stone-800 px-2 py-0.5 rounded-lg border border-[#E0D7C3] shadow-2xs whitespace-nowrap hover:border-[#D4AF37] transition-colors"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D37]/80 shrink-0"></span>
                                <span>{col}</span>
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono block mt-1">
                            {product.colors.length.toLocaleString('fa-IR')} رنگ در پک
                          </span>
                        </td>

                        {/* Column 3: مدل کالا (Model, Category, Fabric & Sizes) */}
                        <td className="p-3.5 align-middle">
                          <div className="min-w-[180px] max-w-[260px]">
                            <p
                              className="font-extrabold text-stone-900 text-xs sm:text-sm hover:text-[#8C6D37] cursor-pointer line-clamp-1 transition-colors block"
                              onClick={() => setSelectedProductForDetails(product)}
                              title={product.name}
                            >
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="text-[9.5px] font-bold bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded-md border border-stone-200">
                                {product.category}
                              </span>
                              {product.isBestSeller && (
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                                  پرفروش
                                </span>
                              )}
                              {product.isNewArrival && (
                                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded border border-emerald-300">
                                  جدید
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-600 mt-1 line-clamp-1" title={product.fabricType}>
                              <span className="text-stone-400 font-normal">پارچه:</span> {product.fabricType}
                            </p>
                            <p className="text-[10px] text-stone-500 font-mono mt-0.5 line-clamp-1" title={product.sizes}>
                              <span className="text-stone-400 font-normal">سایز:</span> {product.sizes}
                            </p>
                          </div>
                        </td>

                        {/* Column 2: SKU */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="bg-[#18181B] text-[#D4AF37] px-2.5 py-1 rounded-lg font-mono font-bold text-xs inline-flex items-center gap-1 shadow-2xs">
                            {product.sku}
                          </span>
                        </td>

                        {/* Column 3: Cost Price */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-black text-stone-900 font-sans">
                            {product.totalCostPrice.toLocaleString('fa-IR')}{' '}
                            <span className="text-xs font-bold text-stone-600">تومان</span>
                          </div>
                          {product.source === 'self_produced' ? (
                            <div className="text-[10px] text-stone-500 mt-0.5 font-mono">
                              پارچه: {(product.fabricCost / 1000).toLocaleString('fa-IR')}k | خیاط: {(product.tailoringCost / 1000).toLocaleString('fa-IR')}k
                            </div>
                          ) : (
                            <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                              خرید از همکار بازار
                            </div>
                          )}
                        </td>

                        {/* Column 4: Pack Unit */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="bg-amber-100/90 text-amber-950 font-bold px-2.5 py-1 rounded-lg text-xs inline-flex items-center gap-1.5 border border-amber-300 shadow-2xs">
                            <Boxes className="w-3.5 h-3.5 text-amber-700" />
                            <span>پک {product.packSize.toLocaleString('fa-IR')} تایی</span>
                          </span>
                        </td>

                        {/* Column 5: Base Wholesale Price */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="text-sm font-black text-stone-950 font-sans tracking-tight">
                            {product.baseWholesalePricePerPack.toLocaleString('fa-IR')}{' '}
                            <span className="text-xs font-bold text-[#8C6D37]">تومان</span>
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5">
                            دانه‌ای {product.baseWholesalePricePerUnit.toLocaleString('fa-IR')} تومان
                          </div>
                        </td>

                        {/* Column 6: Colleague Price */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="text-sm font-black text-emerald-950 font-sans tracking-tight">
                            {product.colleaguePricePerPack.toLocaleString('fa-IR')}{' '}
                            <span className="text-xs font-bold text-emerald-700">تومان</span>
                          </div>
                          <div className="text-[10px] text-emerald-800 font-bold mt-0.5">
                            سود همکار: {(product.baseWholesalePricePerUnit - product.colleaguePricePerUnit).toLocaleString('fa-IR')} ت/عدد
                          </div>
                        </td>

                        {/* Column 7: Stock Stepper */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAdjustPackStock(product, -1)}
                              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-colors border border-stone-200 cursor-pointer shadow-2xs active:scale-95"
                              title="کاهش ۱ پک از انبار"
                            >
                              -
                            </button>

                            <div className="text-center min-w-[65px] bg-[#FAF8F5] px-2 py-1 rounded-lg border border-[#E6DEC8]">
                              <span className={`font-black text-xs sm:text-sm block ${isLow ? 'text-rose-600' : 'text-stone-900'}`}>
                                {product.packStock.toLocaleString('fa-IR')} پک
                              </span>
                              <span className="text-[10px] text-stone-500 font-mono block">
                                ({(product.packStock * product.packSize).toLocaleString('fa-IR')} عدد)
                              </span>
                            </div>

                            <button
                              onClick={() => handleAdjustPackStock(product, 1)}
                              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-colors border border-stone-200 cursor-pointer shadow-2xs active:scale-95"
                              title="افزایش ۱ پک به انبار"
                            >
                              +
                            </button>
                          </div>
                          {isLow && (
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md mt-1.5 animate-pulse">
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                              <span>هشدار کسری انبار</span>
                            </span>
                          )}
                        </td>

                        {/* Column 8: Source */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          {product.source === 'self_produced' ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg shadow-2xs">
                              <Scissors className="w-3 h-3 text-emerald-600" />
                              <span>تولید کارگاه «من و تو»</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-300 px-2.5 py-1 rounded-lg shadow-2xs">
                              <Building2 className="w-3 h-3 text-purple-600" />
                              <span>تامین از همکار بازار</span>
                            </span>
                          )}
                        </td>

                        {/* Column 9: Actions */}
                        <td className="p-3.5 align-middle text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedProductForDetails(product)}
                              className="p-1.5 bg-[#FAF7F2] text-stone-700 hover:text-stone-900 hover:bg-[#EDE5D3] rounded-xl transition-all border border-[#DDD5C0] shadow-2xs cursor-pointer"
                              title="مشاهده شناسنامه کامل کالا و تصاویر ژورنالی"
                            >
                              <Eye className="w-4 h-4 text-[#8C6D37]" />
                            </button>
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="p-1.5 bg-[#FAF7F2] text-stone-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all border border-[#DDD5C0] shadow-2xs cursor-pointer"
                              title="ویرایش قیمت‌ها، بسته‌بندی و مشخصات"
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(product.id)}
                              className="p-1.5 bg-[#FAF7F2] text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all border border-[#DDD5C0] shadow-2xs cursor-pointer"
                              title="حذف مدل از انبار"
                            >
                              <Trash2 className="w-4 h-4 text-rose-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Summary Strip */}
          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-stone-800">
                نمایش {filteredProducts.length.toLocaleString('fa-IR')} از {products.length.toLocaleString('fa-IR')} مدل کاتالوگ
              </span>
              <span className="text-stone-300 hidden sm:inline">|</span>
              <span>
                مجموع موجودی: <strong className="text-stone-900 font-mono">{totalFilteredPacks.toLocaleString('fa-IR')}</strong> پک ({totalFilteredUnits.toLocaleString('fa-IR')} عدد)
              </span>
              <span className="text-stone-300 hidden sm:inline">|</span>
              <span>
                ارزش بهای تمام‌شده: <strong className="text-stone-700 font-mono">{totalFilteredCostValue.toLocaleString('fa-IR')}</strong> تومان
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">ارزش سرمایه انبار (نرخ عمده):</span>
              <span className="text-sm font-black text-stone-950 font-sans bg-white px-3 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs">
                {totalFilteredWholesaleValue.toLocaleString('fa-IR')} <span className="text-xs font-bold text-[#8C6D37]">تومان</span>
              </span>
            </div>
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
      {isBulkModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          id="modal-bulk-price-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsBulkModalOpen(false);
          }}
          className="fixed inset-0 z-[9999] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          dir="rtl"
        >
          <div 
            id="modal-bulk-price-card"
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in zoom-in-95 duration-150 my-auto"
          >
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
        </div>,
        document.body
      )}

      {/* MODAL 2: Add New Product / کاتالوگ با فرمول دقیق بهای تمام شده و ویترین آنلاین */}
      {isNewProductModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          id="modal-new-product-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsNewProductModalOpen(false);
          }}
          className="fixed inset-0 z-[9999] bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
          dir="rtl"
        >
          <div 
            id="modal-new-product-card"
            className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-stone-200 my-auto max-h-[92vh] flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
          >
            
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between pb-3 sm:pb-4 border-b border-stone-100 gap-2 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-900 rounded-2xl border border-amber-200/60">
                  <Package className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-stone-900">
                      ثبت مدل جدید و انتشار در ویترین و انبار
                    </h3>
                    <span className="hidden sm:inline-flex bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      تولید و پخش من و تو
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                    تنظیم تخصصی مشخصات فنی، رنگ‌بندی، بهای تمام‌شده، قیمت عمده، تکی و ژورنال مدل
                  </p>
                </div>
              </div>

              {/* SKU & Preview Toggles & Close */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-stone-100 rounded-xl px-2.5 py-1.5 border border-stone-200 text-xs">
                  <span className="text-[10px] text-stone-500 ml-1.5">کد SKU:</span>
                  <span className="font-mono font-bold text-stone-900">{formData.sku}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const finalCat = formData.category === 'سایر (دسته جدید)' ? (formData.customCategory || 'شلوار') : formData.category;
                      setFormData({ ...formData, sku: generateSKU(finalCat) });
                    }}
                    title="تولید مجدد کد کاتالوگ"
                    className="mr-1.5 p-1 hover:bg-stone-200 rounded-md text-stone-600 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLiveStorefrontPreview(!showLiveStorefrontPreview)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl border flex items-center gap-1 transition-all ${
                    showLiveStorefrontPreview
                      ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">پیش‌نمایش کارت ویترین</span>
                </button>

                <button 
                  onClick={() => setIsNewProductModalOpen(false)} 
                  className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center font-bold text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Step Tabs Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-stone-100 shrink-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setNewProductTab('info')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  newProductTab === 'info'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>۱. مشخصات و دسته‌بندی</span>
              </button>

              <button
                type="button"
                onClick={() => setNewProductTab('media')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  newProductTab === 'media'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>۲. عکس و ویدیو تنخور</span>
              </button>

              <button
                type="button"
                onClick={() => setNewProductTab('costs')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  newProductTab === 'costs'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>۳. بهای تمام‌شده و کارگاه</span>
              </button>

              <button
                type="button"
                onClick={() => setNewProductTab('pricing')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  newProductTab === 'pricing'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>۴. قیمت‌گذاری و فروش تکی</span>
              </button>

              <button
                type="button"
                onClick={() => setNewProductTab('variants')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  newProductTab === 'variants'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>۵. رنگ، سایز و موجودی</span>
              </button>
            </div>

            {/* Modal Body with Form & Live Preview */}
            <form onSubmit={handleCreateProduct} className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
              
              <div className={`grid grid-cols-1 ${showLiveStorefrontPreview ? 'lg:grid-cols-12 gap-5' : 'gap-4'}`}>
                
                {/* Form Fields Column */}
                <div className={showLiveStorefrontPreview ? 'lg:col-span-8 space-y-4' : 'space-y-4'}>
                  
                  {/* TAB 1: مشخصات و دسته‌بندی */}
                  {newProductTab === 'info' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      
                      {/* Name & Auto-naming */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-stone-800">
                            نام مدل و کاتالوگ کالا: <span className="text-rose-600">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const cat = formData.category === 'سایر (دسته جدید)' ? (formData.customCategory || 'شلوار') : formData.category;
                              setFormData({
                                ...formData,
                                name: `${cat} ${formData.fabricType} زنانه مدل پرفروش`,
                              });
                            }}
                            className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            پیشنهاد نام خودکار
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="مثال: شلوار بگ کرپ مازراتی اعلا دمپا پاکتی"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-stone-50 text-sm font-bold p-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:bg-white outline-none transition-all"
                        />
                      </div>

                      {/* Category & Custom Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-800 mb-1">
                            دسته‌بندی تخصصی پوشاک:
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full bg-stone-50 text-xs font-bold p-2.5 rounded-xl border border-stone-200 outline-none focus:border-stone-900"
                          >
                            {POPULAR_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        {formData.category === 'سایر (دسته جدید)' ? (
                          <div>
                            <label className="block text-xs font-bold text-stone-800 mb-1">
                              نام دسته‌بندی جدید:
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: شلوار مام‌استایل، شلوار سندبادی..."
                              value={formData.customCategory}
                              onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                              className="w-full bg-stone-50 text-xs font-bold p-2.5 rounded-xl border border-amber-300 outline-none focus:border-stone-900"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-xs font-bold text-stone-800 mb-1">
                              واحد فروش پکی (پیش‌فرض عمده):
                            </label>
                            <select
                              value={formData.packSize}
                              onChange={(e) => setFormData({ ...formData, packSize: Number(e.target.value) as PackSize })}
                              className="w-full bg-amber-50/80 text-xs font-bold p-2.5 rounded-xl border border-amber-200 text-amber-950 outline-none"
                            >
                              <option value={4}>پک ۴ عددی (نیم‌جین سبک)</option>
                              <option value={6}>پک ۶ عددی (استاندارد پرفروش بازار)</option>
                              <option value={8}>پک ۸ عددی</option>
                              <option value={12}>پک ۱۲ عددی (یک جین کامل)</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Fabric Type and Quick Chips */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          جنس پارچه و متریال:
                        </label>
                        <input
                          type="text"
                          value={formData.fabricType}
                          onChange={(e) => setFormData({ ...formData, fabricType: e.target.value })}
                          placeholder="مثال: کرپ مازراتی نخ ۳۲۰ گرمی اعلا"
                          className="w-full bg-stone-50 text-xs font-medium p-2.5 rounded-xl border border-stone-200 outline-none focus:border-stone-900 mb-2"
                        />
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-stone-500 ml-1">پیشنهاد سریع:</span>
                          {POPULAR_FABRICS.map(fabric => (
                            <button
                              key={fabric}
                              type="button"
                              onClick={() => setFormData({ ...formData, fabricType: fabric })}
                              className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                                formData.fabricType === fabric
                                  ? 'bg-stone-900 text-white border-stone-900 font-bold'
                                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                              }`}
                            >
                              {fabric}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          توضیحات و ویژگی‌های تنخور ژورنالی (نمایش در صفحه محصول):
                        </label>
                        <textarea
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="ویژگی‌های خاص دوخت، کش کمر، دمپا، جیب‌ها و ضمانت عدم آبرفت..."
                          className="w-full bg-stone-50 text-xs p-2.5 rounded-xl border border-stone-200 outline-none focus:border-stone-900 leading-relaxed"
                        />
                      </div>

                      {/* Storefront Badges */}
                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center gap-4">
                        <span className="text-xs font-bold text-stone-800">نشان‌های ویژه در ویترین:</span>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                          <input
                            type="checkbox"
                            checked={formData.isNewArrival}
                            onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span>نشان مدل جدید (New Arrival)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                          <input
                            type="checkbox"
                            checked={formData.isBestSeller}
                            onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span>نشان پرفروش‌ترین‌ها (Best Seller)</span>
                        </label>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setNewProductTab('media')}
                          className="text-xs bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <span>مرحله بعدی: عکس و ویدیو</span>
                          <span>←</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ژورنال و ویدیو تنخور */}
                  {newProductTab === 'media' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      
                      {/* Curated Fallback Picker if user wants fast setup */}
                      <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                            انتخاب سریع تصویر ژورنالی استاندارد بدون نیاز به عکاسی مجدد:
                          </span>
                          <span className="text-[10px] text-amber-800 font-medium">کیفیت بالا و بدون واترمارک</span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {Object.entries(CATEGORY_FALLBACK_IMAGES).slice(0, 6).map(([catName, imgUrl]) => (
                            <button
                              key={catName}
                              type="button"
                              onClick={() => setFormData({ ...formData, image: imgUrl })}
                              className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                                formData.image === imgUrl
                                  ? 'border-amber-600 ring-2 ring-amber-400'
                                  : 'border-transparent hover:border-stone-300'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={catName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[9px] py-0.5 text-center truncate px-1">
                                {catName}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Main Image Uploader */}
                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                        <ImageUploader
                          id="new-product-image-uploader"
                          label="عکس اصلی مدل و کاتالوگ ژورنالی:"
                          value={formData.image}
                          onChange={(url) => setFormData({ ...formData, image: url })}
                          galleryValues={formData.galleryImages}
                          onGalleryChange={(imgs) => setFormData({ ...formData, galleryImages: imgs })}
                          allowGallery={true}
                          helpText="می‌توانید عکس پوشاک را آپلود نموده یا آدرس تصویر ژورنالی را قرار دهید."
                        />
                      </div>

                      {/* Video Uploader */}
                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                        <VideoUploader
                          id="new-product-video-uploader"
                          label="ویدیو معرفی و تست تنخور ژورنالی (پخش در ویترین سایت):"
                          value={formData.videoUrl || ''}
                          onChange={(vUrl) => setFormData({ ...formData, videoUrl: vUrl })}
                          videoTitle={formData.videoTitle || ''}
                          onTitleChange={(title) => setFormData({ ...formData, videoTitle: title })}
                          helpText="ویدیو کوتاه ۱۰ تا ۳۰ ثانیه‌ای از ریزش پارچه و تنخور در تن مانکن یا رگال فروشگاهی."
                        />
                      </div>

                      <div className="flex justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setNewProductTab('info')}
                          className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl transition-all"
                        >
                          → مرحله قبلی
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProductTab('costs')}
                          className="text-xs bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <span>مرحله بعدی: بهای تمام‌شده</span>
                          <span>←</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: بهای تمام‌شده و کارگاه */}
                  {newProductTab === 'costs' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      
                      {/* Sourcing Mode Switcher */}
                      <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 rounded-2xl border border-stone-200">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, source: 'self_produced' })}
                          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            formData.source === 'self_produced'
                              ? 'bg-white text-stone-900 shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          <Scissors className="w-3.5 h-3.5 text-amber-700" />
                          <span>تولید کارگاه خودمان (برش و دوخت)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, source: 'partner_sourced' })}
                          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            formData.source === 'partner_sourced'
                              ? 'bg-white text-stone-900 shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5 text-purple-700" />
                          <span>خرید همکاری از همکاران بازار</span>
                        </button>
                      </div>

                      {/* Self Produced Cost Breakdown */}
                      {formData.source === 'self_produced' ? (
                        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                            <span className="text-xs font-black text-stone-800">
                              اجزای محاسبه بهای تمام‌شده برای هر ۱ عدد:
                            </span>
                            <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg">
                              بهای تمام‌شده کل: {calculatedCostPrice.toLocaleString('fa-IR')} تومان
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-stone-600 block mb-1">هزینه پارچه:</label>
                              <input
                                type="number"
                                value={formData.fabricCost}
                                onChange={(e) => setFormData({ ...formData, fabricCost: Number(e.target.value) })}
                                className="w-full bg-white text-xs p-2.5 rounded-xl border border-stone-200 text-center font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-stone-600 block mb-1">اجرت دوخت خیاط:</label>
                              <input
                                type="number"
                                value={formData.tailoringCost}
                                onChange={(e) => setFormData({ ...formData, tailoringCost: Number(e.target.value) })}
                                className="w-full bg-white text-xs p-2.5 rounded-xl border border-stone-200 text-center font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-stone-600 block mb-1">خرج‌کار و ملزومات:</label>
                              <input
                                type="number"
                                value={formData.trimsCost}
                                onChange={(e) => setFormData({ ...formData, trimsCost: Number(e.target.value) })}
                                className="w-full bg-white text-xs p-2.5 rounded-xl border border-stone-200 text-center font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-stone-600 block mb-1">تکمیل، اتو و بسته‌بندی:</label>
                              <input
                                type="number"
                                value={formData.finishingCost}
                                onChange={(e) => setFormData({ ...formData, finishingCost: Number(e.target.value) })}
                                className="w-full bg-white text-xs p-2.5 rounded-xl border border-stone-200 text-center font-bold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-stone-200/60">
                            <div>
                              <label className="text-[11px] font-bold text-stone-600 block mb-1">تأمین‌کننده پارچه (طاقه‌ای):</label>
                              <input
                                type="text"
                                value={formData.fabricSupplierName}
                                onChange={(e) => setFormData({ ...formData, fabricSupplierName: e.target.value })}
                                className="w-full bg-white text-xs p-2 rounded-xl border border-stone-200"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-stone-600 block mb-1">کارگاه دوخت و خیاط:</label>
                              <input
                                type="text"
                                value={formData.tailorName}
                                onChange={(e) => setFormData({ ...formData, tailorName: e.target.value })}
                                className="w-full bg-white text-xs p-2 rounded-xl border border-stone-200"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                            <span className="text-xs font-black text-purple-950">
                              خرید عمده از همکار بازار:
                            </span>
                            <span className="text-xs font-black text-purple-900 bg-purple-100 px-2.5 py-1 rounded-lg">
                              قیمت خرید هر عدد: {formData.partnerPurchaseCost.toLocaleString('fa-IR')} تومان
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                                قیمت خرید همکاری نقدی از بنکدار (هر ۱ عدد):
                              </label>
                              <input
                                type="number"
                                value={formData.partnerPurchaseCost}
                                onChange={(e) => setFormData({ ...formData, partnerPurchaseCost: Number(e.target.value) })}
                                className="w-full bg-white text-xs font-black p-2.5 rounded-xl border border-purple-300 text-purple-950 text-center"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                                نام همکار / بنکداری طرف قرارداد:
                              </label>
                              <input
                                type="text"
                                value={formData.partnerSupplierName}
                                onChange={(e) => setFormData({ ...formData, partnerSupplierName: e.target.value })}
                                className="w-full bg-white text-xs p-2.5 rounded-xl border border-purple-200"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setNewProductTab('media')}
                          className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl transition-all"
                        >
                          → مرحله قبلی
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProductTab('pricing')}
                          className="text-xs bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <span>مرحله بعدی: قیمت‌گذاری و فروش</span>
                          <span>←</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: قیمت‌گذاری و فروش تکی */}
                  {newProductTab === 'pricing' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      
                      {/* Wholesale Tiers */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                          <label className="block text-xs font-bold text-stone-800">
                            قیمت فروش عمده عادی (به ازای هر ۱ عدد):
                          </label>
                          <input
                            type="number"
                            value={formData.baseWholesalePricePerUnit}
                            onChange={(e) => setFormData({ ...formData, baseWholesalePricePerUnit: Number(e.target.value) })}
                            className="w-full bg-white text-sm font-black p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:border-stone-900 outline-none"
                          />
                          <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1">
                            <span>قیمت کل پک {formData.packSize} تایی:</span>
                            <span className="font-bold text-stone-900">
                              {calculatedBasePackPrice.toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                          <div className="text-[11px] font-bold flex items-center justify-between pt-1 border-t border-stone-200/80">
                            <span>حاشیه سود ناخالص کارگاه:</span>
                            <span className={profitMarginPercent >= 15 ? 'text-emerald-700' : 'text-amber-700'}>
                              {profitMarginPercent}٪ ({((formData.baseWholesalePricePerUnit - calculatedCostPrice) * formData.packSize).toLocaleString('fa-IR')} ت در هر پک)
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                          <label className="block text-xs font-bold text-emerald-950">
                            قیمت همکاری هم‌صنف بازار (تخفیف تیراژ):
                          </label>
                          <input
                            type="number"
                            value={formData.colleaguePricePerUnit}
                            onChange={(e) => setFormData({ ...formData, colleaguePricePerUnit: Number(e.target.value) })}
                            className="w-full bg-white text-sm font-black p-2.5 rounded-xl border border-emerald-300 text-emerald-900 focus:border-emerald-600 outline-none"
                          />
                          <div className="flex items-center justify-between text-[11px] text-emerald-800 pt-1">
                            <span>قیمت کل پک همکاری:</span>
                            <span className="font-bold text-emerald-950">
                              {calculatedColleaguePackPrice.toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                          <div className="text-[11px] text-emerald-700 pt-1 border-t border-emerald-200/80">
                            تخفیف ویژه همکار: {(formData.baseWholesalePricePerUnit - formData.colleaguePricePerUnit).toLocaleString('fa-IR')} ت به ازای هر عدد
                          </div>
                        </div>
                      </div>

                      {/* Retail Sale Configuration */}
                      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.allowRetailSale}
                              onChange={(e) => setFormData({ ...formData, allowRetailSale: e.target.checked })}
                              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-xs font-bold text-amber-950">
                              امکان فروش تکی در ویترین سایت (برای خریداران شخصی آنلاین)
                            </span>
                          </label>
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                            افزایش فروش آنلاین
                          </span>
                        </div>

                        {formData.allowRetailSale && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/70">
                            <div>
                              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                                درصد سود خرده‌فروشی نسبت به عمده:
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={formData.retailMarkupPercent}
                                  onChange={(e) => {
                                    const markup = Number(e.target.value);
                                    const calculated = Math.round((formData.baseWholesalePricePerUnit * (1 + markup / 100)) / 5000) * 5000;
                                    setFormData({
                                      ...formData,
                                      retailMarkupPercent: markup,
                                      retailPricePerUnit: calculated,
                                    });
                                  }}
                                  className="w-20 bg-white text-xs font-bold p-2 rounded-xl border border-stone-300 text-center"
                                />
                                <span className="text-xs text-stone-600">درصد (پیشنهاد استاندارد: ۳۵٪)</span>
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                                قیمت فروش تکی به ازای هر عدد:
                              </label>
                              <input
                                type="number"
                                value={formData.retailPricePerUnit}
                                onChange={(e) => setFormData({ ...formData, retailPricePerUnit: Number(e.target.value) })}
                                className="w-full bg-white text-sm font-black p-2 rounded-xl border border-amber-300 text-stone-900"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setNewProductTab('costs')}
                          className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl transition-all"
                        >
                          → مرحله قبلی
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProductTab('variants')}
                          className="text-xs bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <span>مرحله بعدی: رنگ، سایز و موجودی</span>
                          <span>←</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: رنگ، سایز و موجودی */}
                  {newProductTab === 'variants' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      
                      {/* Color Palette Multi-selector */}
                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-stone-800">
                            رنگ‌بندی موجود (کلیک روی هر رنگ برای افزودن/حذف سریع):
                          </label>
                          <span className="text-[10px] text-stone-500">جدا شده با ویرگول</span>
                        </div>
                        <input
                          type="text"
                          value={formData.colors}
                          onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                          className="w-full bg-white text-xs font-medium p-2.5 rounded-xl border border-stone-300 outline-none focus:border-stone-900 mb-2"
                        />
                        <div className="flex flex-wrap items-center gap-1.5">
                          {POPULAR_COLORS.map(cName => {
                            const isSelected = formData.colors.includes(cName);
                            return (
                              <button
                                key={cName}
                                type="button"
                                onClick={() => toggleColorInForm(cName)}
                                className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-stone-900 text-white border-stone-900 font-bold shadow-xs'
                                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                                }`}
                              >
                                {isSelected ? <Check className="w-3 h-3 text-amber-400" /> : <Plus className="w-3 h-3 text-stone-400" />}
                                <span>{cName}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Sizes with Quick Suggestions */}
                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                        <label className="block text-xs font-bold text-stone-800">
                          سایزبندی کالا:
                        </label>
                        <input
                          type="text"
                          value={formData.sizes}
                          onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                          className="w-full bg-white text-xs font-medium p-2.5 rounded-xl border border-stone-300 outline-none focus:border-stone-900 mb-2"
                        />
                        <div className="flex flex-wrap items-center gap-1.5">
                          {POPULAR_SIZES.map(sOption => (
                            <button
                              key={sOption}
                              type="button"
                              onClick={() => setFormData({ ...formData, sizes: sOption })}
                              className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                                formData.sizes === sOption
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                                  : 'bg-white hover:bg-stone-100 text-stone-600 border-stone-200'
                              }`}
                            >
                              {sOption}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Stock Counts */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                          <label className="block text-xs font-bold text-stone-800 mb-1">
                            موجودی پک در انبار:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.packStock}
                            onChange={(e) => setFormData({ ...formData, packStock: Number(e.target.value) })}
                            className="w-full bg-white text-sm font-black p-2.5 rounded-xl border border-stone-300 text-center"
                          />
                          <span className="text-[10px] text-stone-500 block mt-1 text-center">
                            معادل {(formData.packStock * formData.packSize).toLocaleString('fa-IR')} عدد
                          </span>
                        </div>

                        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                          <label className="block text-xs font-bold text-stone-800 mb-1">
                            موجودی تکی انبار:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.singleStock}
                            onChange={(e) => setFormData({ ...formData, singleStock: Number(e.target.value) })}
                            className="w-full bg-white text-sm font-black p-2.5 rounded-xl border border-stone-300 text-center"
                          />
                          <span className="text-[10px] text-stone-500 block mt-1 text-center">
                            جهت سفارشات تک‌فروشی آنلاین
                          </span>
                        </div>

                        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                          <label className="block text-xs font-bold text-stone-800 mb-1">
                            هشدار کسری انبار (حداقل پک):
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.minPackStockAlert}
                            onChange={(e) => setFormData({ ...formData, minPackStockAlert: Number(e.target.value) })}
                            className="w-full bg-white text-sm font-black p-2.5 rounded-xl border border-stone-300 text-center text-amber-800"
                          />
                          <span className="text-[10px] text-stone-500 block mt-1 text-center">
                            آستانه اخطار به انباردار
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setNewProductTab('pricing')}
                          className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl transition-all"
                        >
                          → مرحله قبلی
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Live Storefront Card Preview Column */}
                {showLiveStorefrontPreview && (
                  <div className="lg:col-span-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
                      <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-amber-700" />
                        پیش‌نمایش کارت در ویترین سایت
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                        آماده نمایش
                      </span>
                    </div>

                    {/* Exact Card Preview */}
                    <div className="w-full max-w-[260px] bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative transition-all hover:shadow-md">
                      
                      {/* Image Frame */}
                      <div className="relative aspect-3/4 bg-stone-100 overflow-hidden">
                        <img
                          src={formData.image || CATEGORY_FALLBACK_IMAGES['شلوار بگ']}
                          alt={formData.name || 'مدل جدید'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                          {formData.isNewArrival && (
                            <span className="bg-[#18181B] text-[#FAF7F2] text-[9px] font-bold px-2 py-0.5 rounded-md border border-[#D4AF37]/50">
                              جدید
                            </span>
                          )}
                          {formData.isBestSeller && (
                            <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                              پرفروش
                            </span>
                          )}
                        </div>

                        {/* Pack Badge */}
                        <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                          پک {formData.packSize} عددی
                        </span>

                        {formData.videoUrl && (
                          <span className="absolute top-2 left-2 bg-rose-600 text-white p-1 rounded-full shadow-xs">
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3 text-right">
                        <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                          <span>{formData.category}</span>
                          <span className="font-mono text-stone-400">{formData.sku}</span>
                        </div>

                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1 mb-1">
                          {formData.name || `مدل ${formData.category}`}
                        </h4>

                        <p className="text-[10px] text-stone-500 line-clamp-1 mb-2">
                          {formData.fabricType} • {formData.sizes}
                        </p>

                        {/* Price Info */}
                        <div className="pt-2 border-t border-stone-100">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[10px] text-stone-500">عمده (هر عدد):</span>
                            <span className="text-xs font-black text-stone-900">
                              {formData.baseWholesalePricePerUnit.toLocaleString('fa-IR')} تومان
                            </span>
                          </div>

                          {formData.allowRetailSale && formData.retailPricePerUnit && (
                            <div className="flex items-baseline justify-between mt-1 text-[10px] text-amber-800">
                              <span>تک‌فروشی آنلاین:</span>
                              <span className="font-bold">
                                {Number(formData.retailPricePerUnit).toLocaleString('fa-IR')} ت
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-stone-500 text-center mt-3 leading-relaxed">
                      این مدل به صورت خودکار با فرمت بالا در کاتالوگ آنلاین و سیستم انبارداری «من و تو» قرار می‌گیرد.
                    </p>
                  </div>
                )}

              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-500">کد اختصاصی:</span>
                  <span className="font-mono text-xs font-black bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg border border-stone-200">
                    {formData.sku}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewProductModalOpen(false)}
                    className="text-xs px-4 py-2.5 text-stone-600 hover:bg-stone-100 rounded-xl font-medium transition-colors"
                  >
                    انصراف
                  </button>

                  <button
                    type="submit"
                    className="bg-[#18181B] hover:bg-black text-[#FAF7F2] border border-[#D4AF37] px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-98 flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span>ثبت نهایی و انتشار در سایت و انبار</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: View Product Details */}
      {selectedProductForDetails && typeof document !== 'undefined' && createPortal(
        <div 
          id="modal-product-details-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedProductForDetails(null);
          }}
          className="fixed inset-0 z-[9999] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          dir="rtl"
        >
          <div 
            id="modal-product-details-card"
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 my-auto max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-stone-100 text-stone-900 font-bold px-2 py-0.5 rounded text-xs">
                  {selectedProductForDetails.sku}
                </span>
                <h3 className="text-sm font-bold text-stone-900 truncate">
                  {selectedProductForDetails.name}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedProductForDetails(null)} 
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
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

              {/* Video Player in Details Modal if available */}
              {selectedProductForDetails.videoUrl && (
                <div className="p-3 bg-stone-900 text-white rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#D4AF37] font-bold">
                    <span>🎬 ویدیو تنخور و دوخت محصول:</span>
                    <span className="text-[10px] text-stone-400">{selectedProductForDetails.videoTitle || 'کیفیت بالا'}</span>
                  </div>
                  <div className="rounded-lg overflow-hidden bg-black aspect-video max-h-48 flex items-center justify-center">
                    <video
                      src={selectedProductForDetails.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <p className="text-stone-500 text-[11px] leading-relaxed">
                {selectedProductForDetails.description}
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedProductForDetails(null)}
                className="text-xs bg-stone-900 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 4: Full Product Editor (ویرایش مشخصات، قیمت، خرده‌فروشی و موجودی کالا) */}
      {editingProduct && editForm && typeof document !== 'undefined' && createPortal(
        <div 
          id="modal-product-editor-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingProduct(null);
              setEditForm(null);
            }
          }}
          className="fixed inset-0 z-[9999] bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          dir="rtl"
        >
          <div 
            id="modal-product-editor-card"
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 my-auto max-h-[90vh] overflow-y-auto"
          >
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
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setEditForm(null);
                }}
                className="text-stone-400 hover:text-stone-700 text-lg p-1 cursor-pointer"
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

              {/* Image Uploader & Gallery */}
              <div className="pt-1">
                <ImageUploader
                  id="edit-product-image-uploader"
                  label="تصویر شاخص و کاتالوگ ژورنالی (امکان ویرایش عکس):"
                  value={editForm.image}
                  onChange={(url) => setEditForm({ ...editForm, image: url || editingProduct.image })}
                  galleryValues={editForm.galleryImages || []}
                  onGalleryChange={(imgs) => setEditForm({ ...editForm, galleryImages: imgs })}
                  allowGallery={true}
                  helpText="امکان ویرایش عکس در صورت تمایل وجود دارد؛ چنانچه عکس جدیدی وارد نکنید، تصویر فعلی کالا در سایت بدون تغییر حفظ خواهد شد."
                />
              </div>

              {/* Video Uploader for Storefront showcase */}
              <div className="pt-1">
                <VideoUploader
                  id="edit-product-video-uploader"
                  label="ویدیو معرفی و تنخور ژورنالی کالا (نمایش در ویترین سایت):"
                  value={editForm.videoUrl || ''}
                  onChange={(vUrl) => setEditForm({ ...editForm, videoUrl: vUrl })}
                  videoTitle={editForm.videoTitle || ''}
                  onTitleChange={(title) => setEditForm({ ...editForm, videoTitle: title })}
                  helpText="افزودن ویدیو تنخور و تست پارچه، اعتماد خریداران عمده و تکی ویترین سایت را به شدت افزایش می‌دهد."
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
        </div>,
        document.body
      )}

    </div>
  );
};
