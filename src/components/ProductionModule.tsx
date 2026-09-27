import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Building2, 
  Layers, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  PhoneCall, 
  MapPin, 
  DollarSign, 
  Check, 
  Sparkles,
  Calculator,
  Truck,
  Package,
  Crown,
  ChevronDown,
  Copy,
  Tag,
  FileText,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { FabricSupplier, TailorWorkshop, ProductionBatch } from '../types';

interface ProductionModuleProps {
  fabricSuppliers: FabricSupplier[];
  tailorWorkshops: TailorWorkshop[];
  productionBatches: ProductionBatch[];
  onAddSupplier: (supplier: FabricSupplier) => void;
  onAddWorkshop: (workshop: TailorWorkshop) => void;
  onAddBatch: (batch: ProductionBatch) => void;
  onUpdateBatchStatus: (batchId: string, status: ProductionBatch['status']) => void;
}

export const ProductionModule: React.FC<ProductionModuleProps> = ({
  fabricSuppliers,
  tailorWorkshops,
  productionBatches,
  onAddSupplier,
  onAddWorkshop,
  onAddBatch,
  onUpdateBatchStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'workshops' | 'batches' | 'calculator'>('batches');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchStatusFilter, setBatchStatusFilter] = useState<string>('all');
  const [copiedBatchNumber, setCopiedBatchNumber] = useState<string | null>(null);

  // Fullscreen Table Mode
  const [isTableFullscreen, setIsTableFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsTableFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isTableFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTableFullscreen]);
  
  // Modals
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isAddWorkshopModalOpen, setIsAddWorkshopModalOpen] = useState(false);
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);

  // New Supplier Form State
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    managerName: '',
    phone: '',
    marketLocation: 'بازار مولوی، سرای آزادی',
    fabricTypes: 'کتان لایت، داکرون',
    avgPricePerMeter: 85000,
    rollLengthMeters: 60,
    defectRate: 'کمتر از ۱٪',
    deliverySpeed: 'همان روز',
    paymentTerms: 'نقدی با ۲٪ تخفیف',
    rating: 5,
    notes: '',
  });

  // New Workshop Form State
  const [newWorkshop, setNewWorkshop] = useState({
    name: '',
    masterName: '',
    phone: '',
    address: 'بازار خیام، کوچه کربلایی',
    specialtyModels: 'شلوار بگ، کارگو، داکرون',
    wagePerUnit: 35000,
    qualityScore: 'عالی (پنج‌لا دوز و اتو)',
    dailyCapacity: 200,
    typicalLeadTimeDays: 4,
    rating: 5,
    notes: '',
  });

  // New Batch Form State
  const [newBatch, setNewBatch] = useState({
    productName: 'شلوار بگ کتان لایت (پارت بهاره)',
    category: 'شلوار بگ',
    fabricSupplierId: fabricSuppliers[0]?.id || '',
    fabricMetersUsed: 500,
    fabricCostPerMeter: 85000,
    tailorWorkshopId: tailorWorkshops[0]?.id || '',
    wagePerUnit: 35000,
    trimsPerUnit: 12000, // کش، مارک، سلفون
    plannedUnitCount: 400,
    estimatedDeliveryDate: '۱۴۰۳/۰۳/۱۰',
    notes: 'پارت اول با کیفیت دوخت صادراتی و رنگ‌بندی ۶ تایی',
  });

  // Estimator Calculator State
  const [calcFabricMeters, setCalcFabricMeters] = useState<number>(600);
  const [calcFabricPriceMeter, setCalcFabricPriceMeter] = useState<number>(85000);
  const [calcUnitsExpected, setCalcUnitsExpected] = useState<number>(480);
  const [calcTailorWage, setCalcTailorWage] = useState<number>(35000);
  const [calcTrimsCost, setCalcTrimsCost] = useState<number>(12000);
  const [calcWorkshopDailyCap, setCalcWorkshopDailyCap] = useState<number>(180);

  // Quick stats calculation
  const totalDailyCapacity = tailorWorkshops.reduce((acc, w) => acc + w.dailyCapacity, 0);
  const activeBatchesCount = productionBatches.filter(b => b.status !== 'delivered_to_warehouse').length;
  const inSewingUnitsCount = productionBatches
    .filter(b => b.status === 'sewing' || b.status === 'cutting')
    .reduce((acc, b) => acc + b.plannedUnitCount, 0);

  // Estimator results
  const totalFabricCost = calcFabricMeters * calcFabricPriceMeter;
  const fabricCostPerUnit = calcUnitsExpected > 0 ? Math.round(totalFabricCost / calcUnitsExpected) : 0;
  const totalCostPerSingleUnit = fabricCostPerUnit + calcTailorWage + calcTrimsCost;
  const estimatedSewingDays = calcWorkshopDailyCap > 0 ? Math.ceil(calcUnitsExpected / calcWorkshopDailyCap) : 0;

  // Handlers
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name.trim()) return;

    const supplier: FabricSupplier = {
      id: `sup-${Date.now()}`,
      name: newSupplier.name,
      managerName: newSupplier.managerName,
      phone: newSupplier.phone,
      marketLocation: newSupplier.marketLocation,
      fabricTypes: newSupplier.fabricTypes.split('،').map(s => s.trim()).filter(Boolean),
      avgPricePerMeter: Number(newSupplier.avgPricePerMeter) || 0,
      rollLengthMeters: Number(newSupplier.rollLengthMeters) || 50,
      defectRate: newSupplier.defectRate,
      deliverySpeed: newSupplier.deliverySpeed,
      paymentTerms: newSupplier.paymentTerms,
      rating: Number(newSupplier.rating) || 5,
      notes: newSupplier.notes,
      lastPurchaseDate: 'امروز',
    };

    onAddSupplier(supplier);
    setIsAddSupplierModalOpen(false);
    setNewSupplier({
      name: '',
      managerName: '',
      phone: '',
      marketLocation: 'بازار مولوی، سرای آزادی',
      fabricTypes: 'کتان لایت، داکرون',
      avgPricePerMeter: 85000,
      rollLengthMeters: 60,
      defectRate: 'کمتر از ۱٪',
      deliverySpeed: 'همان روز',
      paymentTerms: 'نقدی با ۲٪ تخفیف',
      rating: 5,
      notes: '',
    });
  };

  const handleSaveWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkshop.name.trim()) return;

    const workshop: TailorWorkshop = {
      id: `ws-${Date.now()}`,
      name: newWorkshop.name,
      masterName: newWorkshop.masterName,
      phone: newWorkshop.phone,
      address: newWorkshop.address,
      specialtyModels: newWorkshop.specialtyModels.split('،').map(s => s.trim()).filter(Boolean),
      wagePerUnit: Number(newWorkshop.wagePerUnit) || 0,
      qualityScore: newWorkshop.qualityScore,
      dailyCapacity: Number(newWorkshop.dailyCapacity) || 100,
      typicalLeadTimeDays: Number(newWorkshop.typicalLeadTimeDays) || 4,
      rating: Number(newWorkshop.rating) || 5,
      notes: newWorkshop.notes,
      currentActiveBatchesCount: 0,
    };

    onAddWorkshop(workshop);
    setIsAddWorkshopModalOpen(false);
    setNewWorkshop({
      name: '',
      masterName: '',
      phone: '',
      address: 'بازار خیام، کوچه کربلایی',
      specialtyModels: 'شلوار بگ، کارگو، داکرون',
      wagePerUnit: 35000,
      qualityScore: 'عالی (پنج‌لا دوز و اتو)',
      dailyCapacity: 200,
      typicalLeadTimeDays: 4,
      rating: 5,
      notes: '',
    });
  };

  const handleSaveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = fabricSuppliers.find(s => s.id === newBatch.fabricSupplierId) || fabricSuppliers[0];
    const ws = tailorWorkshops.find(w => w.id === newBatch.tailorWorkshopId) || tailorWorkshops[0];

    const totalCost = (newBatch.fabricMetersUsed * newBatch.fabricCostPerMeter) + 
                      (newBatch.plannedUnitCount * (newBatch.wagePerUnit + newBatch.trimsPerUnit));
    const costPerUnit = newBatch.plannedUnitCount > 0 ? Math.round(totalCost / newBatch.plannedUnitCount) : 0;

    const batch: ProductionBatch = {
      id: `batch-${Date.now()}`,
      batchNumber: `PRD-1403-${Math.floor(100 + Math.random() * 900)}`,
      productName: newBatch.productName,
      category: newBatch.category,
      fabricSupplierId: sup?.id || 'sup-1',
      fabricSupplierName: sup?.name || 'بنکداری مولوی',
      fabricType: sup?.fabricTypes[0] || 'کتان لایت',
      fabricMetersUsed: Number(newBatch.fabricMetersUsed),
      fabricCostPerMeter: Number(newBatch.fabricCostPerMeter),
      tailorWorkshopId: ws?.id || 'ws-1',
      tailorWorkshopName: ws?.name || 'کارگاه خیام',
      wagePerUnit: Number(newBatch.wagePerUnit),
      plannedUnitCount: Number(newBatch.plannedUnitCount),
      status: 'fabric_ordered',
      startDate: 'امروز',
      estimatedDeliveryDate: newBatch.estimatedDeliveryDate,
      totalCostToman: totalCost,
      costPerUnitToman: costPerUnit,
      notes: newBatch.notes,
    };

    onAddBatch(batch);
    setIsAddBatchModalOpen(false);
  };

  const getStatusBadge = (status: ProductionBatch['status']) => {
    switch (status) {
      case 'fabric_ordered':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg">طاقه پارچه خریداری شد</span>;
      case 'cutting':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-bold px-2.5 py-1 rounded-lg">در حال برش‌کاری تیغ</span>;
      case 'sewing':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-bold px-2.5 py-1 rounded-lg">در حال دوخت در کارگاه</span>;
      case 'finishing_ironing':
        return <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 text-[11px] font-bold px-2.5 py-1 rounded-lg">اتو، کش‌دوزی و سلفون</span>;
      case 'delivered_to_warehouse':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> تحویل کامل به انبار</span>;
      default:
        return null;
    }
  };

  return (
    <div id="production-module" className="space-y-6 animate-in fade-in duration-200" dir="rtl">
      
      {/* Top Banner with Luxury Super Admin Styling */}
      <div className="bg-[#18181B] text-[#FAF7F2] p-6 rounded-2xl border border-[#3F3F46] shadow-sm relative overflow-hidden">
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#27272A] border border-[#3F3F46] text-[#D4AF37] flex items-center justify-center font-black shadow-xs">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#FAF7F2]">
                  مدیریت زنجیره تولید، پارچه‌فروشان و کارگاه‌های دوخت
                </h2>
                <span className="bg-[#D4AF37] text-[#18181B] text-xs px-2.5 py-0.5 rounded-full font-black flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  ویژه سوپر ادمین
                </span>
              </div>
              <p className="text-xs text-[#E6DEC8]/80 mt-1">
                استعلام قیمت متری طاقه پارچه مولوی، نظارت بر کارگاه‌های خیاطی بازار، ثبت سفارشات دوخت و کنترل زمان تحویل
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddBatchModalOpen(true)}
              className="text-xs bg-[#D4AF37] hover:bg-[#c49f2e] text-[#18181B] font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ پارت تولید جدید</span>
            </button>
            <button
              onClick={() => setIsAddSupplierModalOpen(true)}
              className="text-xs bg-[#27272A] hover:bg-[#3F3F46] text-[#FAF7F2] font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border border-[#3F3F46] cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>+ پارچه‌فروش جدید</span>
            </button>
            <button
              onClick={() => setIsAddWorkshopModalOpen(true)}
              className="text-xs bg-[#27272A] hover:bg-[#3F3F46] text-[#FAF7F2] font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border border-[#3F3F46] cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>+ کارگاه خیاطی</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#3F3F46]/80 text-xs">
          <div className="bg-[#27272A]/70 p-3 rounded-xl border border-[#3F3F46]">
            <span className="text-stone-400 block text-[11px]">بنکداران طرف قرارداد:</span>
            <span className="text-lg font-black text-[#FAF7F2] mt-0.5 block">{fabricSuppliers.length} بنکدار بازار</span>
            <span className="text-[10px] text-[#D4AF37]">مولوی، شوش و سیروس</span>
          </div>

          <div className="bg-[#27272A]/70 p-3 rounded-xl border border-[#3F3F46]">
            <span className="text-stone-400 block text-[11px]">کارگاه‌های خیاطی فعال:</span>
            <span className="text-lg font-black text-[#FAF7F2] mt-0.5 block">{tailorWorkshops.length} کارگاه برش و دوخت</span>
            <span className="text-[10px] text-emerald-400">ظرفیت {totalDailyCapacity.toLocaleString('fa-IR')} عدد در روز</span>
          </div>

          <div className="bg-[#27272A]/70 p-3 rounded-xl border border-[#3F3F46]">
            <span className="text-stone-400 block text-[11px]">پارت‌های در جریان تولید:</span>
            <span className="text-lg font-black text-[#FAF7F2] mt-0.5 block">{activeBatchesCount} پارت فعال</span>
            <span className="text-[10px] text-amber-400">{inSewingUnitsCount.toLocaleString('fa-IR')} عدد در حال دوخت</span>
          </div>

          <div className="bg-[#27272A]/70 p-3 rounded-xl border border-[#3F3F46]">
            <span className="text-stone-400 block text-[11px]">میانگین دستمزد دوخت:</span>
            <span className="text-lg font-black text-[#FAF7F2] mt-0.5 block">
              {(tailorWorkshops.reduce((a, b) => a + b.wagePerUnit, 0) / (tailorWorkshops.length || 1)).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} تومان
            </span>
            <span className="text-[10px] text-[#E6DEC8]/80">فرمول بهای تمام‌شده بازار</span>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button
            onClick={() => setActiveTab('batches')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'batches' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#E6DEC8]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>پیگیری پارت‌های تولید و زمان تحویل ({productionBatches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'suppliers' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#E6DEC8]'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#8C6D37]" />
            <span>پارچه‌فروشان و بنکداران مولوی ({fabricSuppliers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('workshops')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'workshops' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#E6DEC8]'
            }`}
          >
            <Scissors className="w-4 h-4 text-[#8C6D37]" />
            <span>کارگاه‌های خیاطی و دوزندگان ({tailorWorkshops.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'calculator' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#E6DEC8]'
            }`}
          >
            <Calculator className="w-4 h-4 text-[#D4AF37]" />
            <span>محاسبه‌گر بهای تمام‌شده و زمان تحویل</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64 text-xs">
          <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="جستجوی پارچه، خیاط یا پارت..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] pr-9 pl-3 py-2 rounded-xl border border-[#DDD5C0] text-stone-900 focus:bg-white focus:border-[#18181B] outline-none font-medium"
          />
        </div>
      </div>

      {/* Tab 1: Production Batches & Delivery Tracker */}
      {activeTab === 'batches' && (() => {
        const filteredBatches = productionBatches.filter(b => {
          const matchesSearch = 
            b.productName.includes(searchQuery) || 
            b.batchNumber.includes(searchQuery) || 
            b.tailorWorkshopName.includes(searchQuery) ||
            b.fabricSupplierName.includes(searchQuery);
          const matchesStatus = batchStatusFilter === 'all' || b.status === batchStatusFilter;
          return matchesSearch && matchesStatus;
        });

        const totalPlannedUnits = filteredBatches.reduce((s, b) => s + b.plannedUnitCount, 0);
        const totalBatchCostToman = filteredBatches.reduce((s, b) => s + b.totalCostToman, 0);
        const totalFabricMeters = filteredBatches.reduce((s, b) => s + b.fabricMetersUsed, 0);
        const deliveredCount = filteredBatches.filter(b => b.status === 'delivered_to_warehouse').length;

        const handleCopyBatch = (batchNo: string) => {
          navigator.clipboard?.writeText(batchNo);
          setCopiedBatchNumber(batchNo);
          setTimeout(() => setCopiedBatchNumber(null), 2000);
        };

        return (
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
                  <span className="font-bold text-[#D4AF37]">حالت تمام‌صفحه جدول پارت‌های تولید فعال است</span>
                  <span className="text-stone-400 hidden sm:inline">| برای خروج کلید Esc کیبورد یا دکمه کوچک‌نمایی را بزنید</span>
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

            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE9DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Scissors className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                    <span>کاردکس پارت‌های تولید، برش و دوخت کارگاه «من و تو»</span>
                    <span className="text-[11px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-full font-mono">
                      {productionBatches.length.toLocaleString('fa-IR')} پارت کل
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    رهگیری مرحله به مرحله از طاقه تا انبار کالا با پایش بهای تمام‌شده و تاریخ تحویل قطعی
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {/* Fullscreen Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsTableFullscreen(!isTableFullscreen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isTableFullscreen
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 shadow-sm'
                      : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0] hover:bg-[#F2ECE1] hover:text-stone-900'
                  }`}
                  title={isTableFullscreen ? 'خروج از حالت تمام‌صفحه (Esc)' : 'بزرگنمایی جدول به تمام‌صفحه'}
                >
                  {isTableFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>کوچک‌نمایی</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>تمام‌صفحه</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsAddBatchModalOpen(true)}
                  className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 hover:from-black hover:to-stone-900 text-[#FAF7F2] text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#D4AF37]/50 hover:border-[#D4AF37] cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>+ ثبت سفارش پارت جدید</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-2xs">
                  <Layers className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">پارت‌های نمایشی</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {filteredBatches.length.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">پارت</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8C6D37]/15 text-[#8C6D37] flex items-center justify-center shrink-0 shadow-2xs">
                  <Package className="w-5 h-5 text-[#8C6D37]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">تیراژ در دست اقدام</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {totalPlannedUnits.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">عدد</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">ارزش سرمایه تولید</span>
                  <span className="text-sm sm:text-base font-black text-emerald-950 block truncate">
                    {totalBatchCostToman.toLocaleString('fa-IR')} <span className="text-xs font-bold text-emerald-700">تومان</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">متراژ طاقه مصرفی</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {totalFabricMeters.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">متر</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setBatchStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  batchStatusFilter === 'all'
                    ? 'bg-stone-900 text-[#FAF7F2] shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-600 hover:bg-[#EFE8D8] border border-[#DDD5C0]'
                }`}
              >
                <span>همه پارت‌ها</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  batchStatusFilter === 'all' ? 'bg-[#D4AF37] text-stone-950 font-black' : 'bg-stone-200 text-stone-700'
                }`}>
                  {productionBatches.length.toLocaleString('fa-IR')}
                </span>
              </button>

              <button
                onClick={() => setBatchStatusFilter('cutting')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  batchStatusFilter === 'cutting'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-blue-900 hover:bg-blue-50 border border-blue-200'
                }`}
              >
                <span>برش‌کاری تیغ</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  batchStatusFilter === 'cutting' ? 'bg-blue-200 text-blue-950 font-black' : 'bg-blue-100 text-blue-800'
                }`}>
                  {productionBatches.filter(b => b.status === 'cutting').length.toLocaleString('fa-IR')}
                </span>
              </button>

              <button
                onClick={() => setBatchStatusFilter('sewing')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  batchStatusFilter === 'sewing'
                    ? 'bg-purple-800 text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-purple-900 hover:bg-purple-50 border border-purple-200'
                }`}
              >
                <span>دوخت در کارگاه</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  batchStatusFilter === 'sewing' ? 'bg-purple-200 text-purple-950 font-black' : 'bg-purple-100 text-purple-800'
                }`}>
                  {productionBatches.filter(b => b.status === 'sewing').length.toLocaleString('fa-IR')}
                </span>
              </button>

              <button
                onClick={() => setBatchStatusFilter('finishing_ironing')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  batchStatusFilter === 'finishing_ironing'
                    ? 'bg-indigo-800 text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-indigo-900 hover:bg-indigo-50 border border-indigo-200'
                }`}
              >
                <span>اتو و بسته‌بندی</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  batchStatusFilter === 'finishing_ironing' ? 'bg-indigo-200 text-indigo-950 font-black' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {productionBatches.filter(b => b.status === 'finishing_ironing').length.toLocaleString('fa-IR')}
                </span>
              </button>

              <button
                onClick={() => setBatchStatusFilter('delivered_to_warehouse')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  batchStatusFilter === 'delivered_to_warehouse'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                <span>تحویل کامل انبار</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  batchStatusFilter === 'delivered_to_warehouse' ? 'bg-emerald-200 text-emerald-950 font-black' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {deliveredCount.toLocaleString('fa-IR')}
                </span>
              </button>
            </div>

            {/* Master Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#E6DEC8] shadow-2xs">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-stone-100 border-b-2 border-[#D4AF37]">
                  <tr>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>کد و پارت تولید</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>مدل و گروه لباس</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>تامین‌کننده و متراژ طاقه</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>کارگاه دوزنده و دستمزد</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>تیراژ خروجی</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>بهای تمام‌شده هر عدد</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>موعد تحویل به انبار</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>مرحله و وضعیت</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                      <span>تغییر مرحله</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DC]">
                  {filteredBatches.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] flex items-center justify-center text-stone-400 mb-3 shadow-2xs">
                            <Search className="w-6 h-6 text-stone-400" />
                          </div>
                          <h4 className="text-sm font-extrabold text-stone-900">هیچ پارت تولیدی یافت نشد</h4>
                          <p className="text-xs text-stone-500 mt-1">
                            با فیلتر انتخابی یا عبارت جستجو موردی ثبت نشده است.
                          </p>
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setBatchStatusFilter('all');
                            }}
                            className="mt-3.5 px-4 py-1.5 bg-[#18181B] text-[#FAF7F2] hover:bg-stone-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            مشاهده همه پارت‌ها
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBatches.map((batch) => (
                      <tr
                        key={batch.id}
                        className="hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80"
                      >
                        {/* Column 1: Batch Number */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <button
                            onClick={() => handleCopyBatch(batch.batchNumber)}
                            className="bg-[#18181B] text-[#D4AF37] px-2.5 py-1 rounded-lg font-mono font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs hover:bg-stone-900 transition-colors cursor-pointer group/btn"
                            title="کلیک برای کپی شماره پارت"
                          >
                            <span>#{batch.batchNumber}</span>
                            {copiedBatchNumber === batch.batchNumber ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                            )}
                          </button>
                          <span className="text-[10px] text-stone-400 font-mono block mt-1">
                            آغاز: {batch.startDate}
                          </span>
                        </td>

                        {/* Column 2: Model & Category */}
                        <td className="p-3.5 align-middle">
                          <strong className="font-extrabold text-stone-900 block text-xs sm:text-sm">
                            {batch.productName}
                          </strong>
                          <span className="inline-block mt-0.5 text-[10px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-md">
                            {batch.category}
                          </span>
                        </td>

                        {/* Column 3: Fabric Supplier */}
                        <td className="p-3.5 align-middle">
                          <span className="font-bold text-stone-900 block text-xs">
                            {batch.fabricSupplierName}
                          </span>
                          <span className="text-[11px] text-stone-600 font-mono block mt-0.5">
                            {batch.fabricMetersUsed.toLocaleString('fa-IR')} متر ({batch.fabricCostPerMeter.toLocaleString('fa-IR')} ت/متر)
                          </span>
                        </td>

                        {/* Column 4: Tailor Workshop */}
                        <td className="p-3.5 align-middle">
                          <span className="font-bold text-stone-900 block text-xs">
                            {batch.tailorWorkshopName}
                          </span>
                          <span className="text-[11px] text-stone-600 font-mono block mt-0.5">
                            دستمزد دوخت: {batch.wagePerUnit.toLocaleString('fa-IR')} تومان
                          </span>
                        </td>

                        {/* Column 5: Units */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="font-black text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-300 font-mono text-xs">
                            {batch.plannedUnitCount.toLocaleString('fa-IR')} عدد
                          </span>
                        </td>

                        {/* Column 6: Cost per unit */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="text-sm font-black text-emerald-950 font-sans">
                            {batch.costPerUnitToman.toLocaleString('fa-IR')}{' '}
                            <span className="text-xs font-bold text-emerald-700">تومان</span>
                          </div>
                          <span className="text-[10px] text-stone-500 font-mono block mt-0.5">
                            کل پارت: {batch.totalCostToman.toLocaleString('fa-IR')} تومان
                          </span>
                        </td>

                        {/* Column 7: Delivery Date */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-stone-900 font-bold bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E6DEC8] inline-flex">
                            <Calendar className="w-3.5 h-3.5 text-[#8C6D37]" />
                            <span className="font-mono text-xs">{batch.estimatedDeliveryDate}</span>
                          </div>
                        </td>

                        {/* Column 8: Status Badge */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          {getStatusBadge(batch.status)}
                        </td>

                        {/* Column 9: Update Status */}
                        <td className="p-3.5 align-middle text-center whitespace-nowrap">
                          <select
                            value={batch.status}
                            onChange={(e) => onUpdateBatchStatus(batch.id, e.target.value as ProductionBatch['status'])}
                            className="bg-white border border-[#DDD5C0] rounded-xl text-xs font-bold px-2.5 py-1.5 text-stone-800 focus:border-[#D4AF37] outline-none cursor-pointer shadow-2xs hover:border-[#D4AF37] transition-colors"
                          >
                            <option value="fabric_ordered">طاقه خریداری شد</option>
                            <option value="cutting">در حال برش‌کاری تیغ</option>
                            <option value="sewing">در حال دوخت کارگاه</option>
                            <option value="finishing_ironing">اتو و بسته‌بندی</option>
                            <option value="delivered_to_warehouse">تحویل به انبار کالا</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Summary Strip */}
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-stone-800">
                  نمایش {filteredBatches.length.toLocaleString('fa-IR')} از {productionBatches.length.toLocaleString('fa-IR')} پارت تولید
                </span>
                <span className="text-stone-300 hidden sm:inline">|</span>
                <span>
                  تیراژ کل سفارشات: <strong className="text-stone-900 font-mono">{totalPlannedUnits.toLocaleString('fa-IR')}</strong> عدد
                </span>
                <span className="text-stone-300 hidden sm:inline">|</span>
                <span>
                  طاقه مصرفی: <strong className="text-stone-900 font-mono">{totalFabricMeters.toLocaleString('fa-IR')}</strong> متر
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-medium">مجموع بهای سرمایه‌گذاری تولید:</span>
                <span className="text-sm font-black text-stone-950 font-sans bg-white px-3 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs">
                  {totalBatchCostToman.toLocaleString('fa-IR')} <span className="text-xs font-bold text-[#8C6D37]">تومان</span>
                </span>
              </div>
            </div>

          </div>
        );
      })()}

      {/* Tab 2: Fabric Suppliers (بنکداران پارچه بازار مولوی) */}
      {activeTab === 'suppliers' && (() => {
        const filteredSuppliers = fabricSuppliers.filter(
          s => s.name.includes(searchQuery) || s.fabricTypes.some(f => f.includes(searchQuery)) || s.managerName.includes(searchQuery) || s.marketLocation.includes(searchQuery)
        );
        const avgPriceAll = Math.round(
          filteredSuppliers.reduce((s, sup) => s + sup.avgPricePerMeter, 0) / (filteredSuppliers.length || 1)
        );
        const avgRollLength = Math.round(
          filteredSuppliers.reduce((s, sup) => s + sup.rollLengthMeters, 0) / (filteredSuppliers.length || 1)
        );

        return (
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
                  <span className="font-bold text-[#D4AF37]">حالت تمام‌صفحه دفتر بنکداران پارچه فعال است</span>
                  <span className="text-stone-400 hidden sm:inline">| برای خروج کلید Esc کیبورد یا دکمه کوچک‌نمایی را بزنید</span>
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

            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE9DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                    <span>دفتر جامع بنکداران و تامین‌کنندگان پارچه طاقه (بازار مولوی و شوش)</span>
                    <span className="text-[11px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-full font-mono">
                      {fabricSuppliers.length.toLocaleString('fa-IR')} بنکدار کل
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    استعلام قیمت متری طاقه پارچه‌های کتان لایت، داکرون، کرپ مازراتی و شرایط تسویه نقدی/چکی
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {/* Fullscreen Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsTableFullscreen(!isTableFullscreen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isTableFullscreen
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 shadow-sm'
                      : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0] hover:bg-[#F2ECE1] hover:text-stone-900'
                  }`}
                  title={isTableFullscreen ? 'خروج از حالت تمام‌صفحه (Esc)' : 'بزرگنمایی جدول به تمام‌صفحه'}
                >
                  {isTableFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>کوچک‌نمایی</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>تمام‌صفحه</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsAddSupplierModalOpen(true)}
                  className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 hover:from-black hover:to-stone-900 text-[#FAF7F2] text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#D4AF37]/50 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>+ ثبت پارچه‌فروش جدید</span>
                </button>
              </div>
            </div>

            {/* Live Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-2xs">
                  <Building2 className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">بنکداران طرف قرارداد</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {filteredSuppliers.length.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">بنکدار</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">میانگین قیمت متری طاقه</span>
                  <span className="text-sm sm:text-base font-black text-emerald-950 block truncate font-mono">
                    {avgPriceAll.toLocaleString('fa-IR')} <span className="text-xs font-bold text-emerald-700">تومان</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8C6D37]/15 text-[#8C6D37] flex items-center justify-center shrink-0 shadow-2xs">
                  <Layers className="w-5 h-5 text-[#8C6D37]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">متراژ استاندارد طاقه</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {avgRollLength.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">متر</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">سرعت تحویل طاقه</span>
                  <span className="text-xs sm:text-sm font-bold text-stone-800 block truncate">
                    ارسال همان روز با وانت بار بازار
                  </span>
                </div>
              </div>
            </div>

            {/* Master Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#E6DEC8] shadow-2xs">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-stone-100 border-b-2 border-[#D4AF37]">
                  <tr>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>نام بنکدار و مدیریت</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>راسته و موقعیت بازار</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>پارچه‌های تخصصی</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>نرخ متری طاقه</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>طاقه و نرخ پرتی</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>شرایط تسویه و تحویل</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>تماس مستقیم</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                      <span>سفارش طاقه</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DC]">
                  {filteredSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] flex items-center justify-center text-stone-400 mb-3 shadow-2xs">
                            <Search className="w-6 h-6 text-stone-400" />
                          </div>
                          <h4 className="text-sm font-extrabold text-stone-900">هیچ بنکدار پارچه‌ای یافت نشد</h4>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((sup) => (
                      <tr
                        key={sup.id}
                        className="hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80"
                      >
                        {/* Column 1: Supplier & Manager */}
                        <td className="p-3.5 align-middle">
                          <strong className="font-extrabold text-stone-900 block text-xs sm:text-sm">
                            {sup.name}
                          </strong>
                          <span className="text-[11px] text-stone-500 block mt-0.5">
                            مدیریت: {sup.managerName}
                          </span>
                        </td>

                        {/* Column 2: Location */}
                        <td className="p-3.5 align-middle">
                          <div className="flex items-center gap-1 text-stone-900 font-bold text-xs">
                            <MapPin className="w-3.5 h-3.5 text-[#8C6D37] shrink-0" />
                            <span>{sup.marketLocation}</span>
                          </div>
                        </td>

                        {/* Column 3: Fabric Types */}
                        <td className="p-3.5 align-middle">
                          <div className="flex items-center gap-1 flex-wrap">
                            {sup.fabricTypes.map((ft, idx) => (
                              <span
                                key={idx}
                                className="bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] text-[10px] font-bold px-2 py-0.5 rounded-md"
                              >
                                {ft}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Column 4: Price per meter */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="text-sm font-black text-emerald-950 font-sans">
                            {sup.avgPricePerMeter.toLocaleString('fa-IR')}{' '}
                            <span className="text-xs font-bold text-emerald-700">تومان/متر</span>
                          </div>
                        </td>

                        {/* Column 5: Roll length & Defect */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="font-bold text-stone-900 block text-xs">
                            {sup.rollLengthMeters.toLocaleString('fa-IR')} متر در طاقه
                          </span>
                          <span className="text-[10px] text-stone-500 block mt-0.5">
                            پرتی: {sup.defectRate}
                          </span>
                        </td>

                        {/* Column 6: Payment Terms & Delivery */}
                        <td className="p-3.5 align-middle">
                          <span className="text-xs font-bold text-stone-800 block">
                            {sup.paymentTerms}
                          </span>
                          <span className="text-[10px] text-[#8C6D37] block mt-0.5">
                            تحویل: {sup.deliverySpeed}
                          </span>
                        </td>

                        {/* Column 7: Phone */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <a
                            href={`tel:${sup.phone}`}
                            className="bg-[#FAF7F2] hover:bg-[#E6DEC8] text-stone-900 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-[#DDD5C0] inline-flex items-center gap-1.5 transition-colors"
                          >
                            <PhoneCall className="w-3 h-3 text-[#8C6D37]" />
                            <span className="dir-ltr text-right">{sup.phone}</span>
                          </a>
                        </td>

                        {/* Column 8: Action */}
                        <td className="p-3.5 align-middle text-center whitespace-nowrap">
                          <button
                            onClick={() => {
                              setNewBatch(prev => ({
                                ...prev,
                                fabricSupplierId: sup.id,
                                fabricCostPerMeter: sup.avgPricePerMeter,
                              }));
                              setIsAddBatchModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-stone-900 to-[#18181B] hover:from-black hover:to-stone-900 text-[#FAF7F2] rounded-xl transition-all flex items-center gap-1.5 border border-[#D4AF37]/60 hover:border-[#D4AF37] font-bold text-xs cursor-pointer shadow-xs mx-auto active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>سفارش طاقه</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Bottom Summary Strip */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-stone-800">
                  نمایش {filteredSuppliers.length.toLocaleString('fa-IR')} از {fabricSuppliers.length.toLocaleString('fa-IR')} بنکدار پارچه
                </span>
                <span className="text-stone-300 hidden sm:inline">|</span>
                <span>
                  موقعیت‌های اصلی: <strong className="text-stone-900">بازار مولوی، سرای آزادی و گذر شوش</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-medium">پایش نرخ مواد اولیه:</span>
                <span className="font-bold text-stone-900 bg-white px-2.5 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs">
                  به‌روزرسانی با نرخ رسمی بازار پارچه
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Tab 3: Tailor Workshops (کارگاه‌های خیاطی و دوزندگان) */}
      {activeTab === 'workshops' && (() => {
        const filteredWorkshops = tailorWorkshops.filter(
          w => w.name.includes(searchQuery) || w.specialtyModels.some(m => m.includes(searchQuery)) || w.masterName.includes(searchQuery) || w.address.includes(searchQuery)
        );
        const totalDailyCapFiltered = filteredWorkshops.reduce((s, w) => s + w.dailyCapacity, 0);
        const avgWageFiltered = Math.round(
          filteredWorkshops.reduce((s, w) => s + w.wagePerUnit, 0) / (filteredWorkshops.length || 1)
        );

        return (
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
                  <span className="font-bold text-[#D4AF37]">حالت تمام‌صفحه دفتر کارگاه‌های خیاطی فعال است</span>
                  <span className="text-stone-400 hidden sm:inline">| برای خروج کلید Esc کیبورد یا دکمه کوچک‌نمایی را بزنید</span>
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

            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE9DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Scissors className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                    <span>دفتر کارگاه‌های خیاطی، دوزندگان و برشکاران طرف قرارداد</span>
                    <span className="text-[11px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-full font-mono">
                      {tailorWorkshops.length.toLocaleString('fa-IR')} کارگاه کل
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    ظرفیت دوخت روزانه، استانداردهای اتو و پنج‌لا دوز، دستمزد هر عدد شلوار و زمان تحویل پارت
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {/* Fullscreen Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsTableFullscreen(!isTableFullscreen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isTableFullscreen
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 shadow-sm'
                      : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0] hover:bg-[#F2ECE1] hover:text-stone-900'
                  }`}
                  title={isTableFullscreen ? 'خروج از حالت تمام‌صفحه (Esc)' : 'بزرگنمایی جدول به تمام‌صفحه'}
                >
                  {isTableFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>کوچک‌نمایی</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>تمام‌صفحه</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsAddWorkshopModalOpen(true)}
                  className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 hover:from-black hover:to-stone-900 text-[#FAF7F2] text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#D4AF37]/50 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>+ ثبت کارگاه خیاطی جدید</span>
                </button>
              </div>
            </div>

            {/* Live Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-2xs">
                  <Scissors className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">کارگاه‌های فعال</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {filteredWorkshops.length.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">کارگاه</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <Package className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">ظرفیت دوخت روزانه</span>
                  <span className="text-sm sm:text-base font-black text-emerald-950 block truncate font-mono">
                    {totalDailyCapFiltered.toLocaleString('fa-IR')} <span className="text-xs font-bold text-emerald-700">عدد/روز</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8C6D37]/15 text-[#8C6D37] flex items-center justify-center shrink-0 shadow-2xs">
                  <DollarSign className="w-5 h-5 text-[#8C6D37]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">میانگین دستمزد دوخت</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {avgWageFiltered.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">تومان</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">میانگین زمان تحویل پارت</span>
                  <span className="text-xs sm:text-sm font-bold text-stone-800 block truncate">
                    ۴ الی ۶ روز کاری
                  </span>
                </div>
              </div>
            </div>

            {/* Master Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#E6DEC8] shadow-2xs">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-stone-100 border-b-2 border-[#D4AF37]">
                  <tr>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>نام کارگاه و استادکار</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>آدرس و راسته کارگاه</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>مدل‌های تخصصی دوخت</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>دستمزد دوخت هر عدد</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>ظرفیت روزانه</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>کیفیت و زمان تحویل</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>تماس مستقیم</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                      <span>ارسال کار به کارگاه</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DC]">
                  {filteredWorkshops.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] flex items-center justify-center text-stone-400 mb-3 shadow-2xs">
                            <Search className="w-6 h-6 text-stone-400" />
                          </div>
                          <h4 className="text-sm font-extrabold text-stone-900">هیچ کارگاه خیاطی‌ای یافت نشد</h4>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredWorkshops.map((ws) => (
                      <tr
                        key={ws.id}
                        className="hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80"
                      >
                        {/* Column 1: Workshop & Master */}
                        <td className="p-3.5 align-middle">
                          <strong className="font-extrabold text-stone-900 block text-xs sm:text-sm">
                            {ws.name}
                          </strong>
                          <span className="text-[11px] text-stone-500 block mt-0.5">
                            استادکار: {ws.masterName}
                          </span>
                        </td>

                        {/* Column 2: Address */}
                        <td className="p-3.5 align-middle">
                          <div className="flex items-center gap-1 text-stone-900 font-bold text-xs">
                            <MapPin className="w-3.5 h-3.5 text-[#8C6D37] shrink-0" />
                            <span>{ws.address}</span>
                          </div>
                        </td>

                        {/* Column 3: Specialty Models */}
                        <td className="p-3.5 align-middle">
                          <div className="flex items-center gap-1 flex-wrap">
                            {ws.specialtyModels.map((m, idx) => (
                              <span
                                key={idx}
                                className="bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] text-[10px] font-bold px-2 py-0.5 rounded-md"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Column 4: Wage per unit */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="text-sm font-black text-emerald-950 font-sans">
                            {ws.wagePerUnit.toLocaleString('fa-IR')}{' '}
                            <span className="text-xs font-bold text-emerald-700">تومان</span>
                          </div>
                        </td>

                        {/* Column 5: Daily Capacity */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="bg-stone-100 text-stone-900 border border-stone-300 font-bold px-2.5 py-1 rounded-lg font-mono text-xs">
                            {ws.dailyCapacity.toLocaleString('fa-IR')} عدد در روز
                          </span>
                        </td>

                        {/* Column 6: Quality & Lead Time */}
                        <td className="p-3.5 align-middle">
                          <span className="text-xs font-bold text-stone-900 block">
                            {ws.qualityScore}
                          </span>
                          <span className="text-[10px] text-[#8C6D37] block mt-0.5 font-mono">
                            تحویل: {ws.typicalLeadTimeDays} روز کاری
                          </span>
                        </td>

                        {/* Column 7: Phone */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <a
                            href={`tel:${ws.phone}`}
                            className="bg-[#FAF7F2] hover:bg-[#E6DEC8] text-stone-900 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-[#DDD5C0] inline-flex items-center gap-1.5 transition-colors"
                          >
                            <PhoneCall className="w-3 h-3 text-[#8C6D37]" />
                            <span className="dir-ltr text-right">{ws.phone}</span>
                          </a>
                        </td>

                        {/* Column 8: Action */}
                        <td className="p-3.5 align-middle text-center whitespace-nowrap">
                          <button
                            onClick={() => {
                              setNewBatch(prev => ({
                                ...prev,
                                tailorWorkshopId: ws.id,
                                wagePerUnit: ws.wagePerUnit,
                              }));
                              setIsAddBatchModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-stone-900 to-[#18181B] hover:from-black hover:to-stone-900 text-[#FAF7F2] rounded-xl transition-all flex items-center gap-1.5 border border-[#D4AF37]/60 hover:border-[#D4AF37] font-bold text-xs cursor-pointer shadow-xs mx-auto active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>ارسال کار</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Bottom Summary Strip */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-stone-800">
                  نمایش {filteredWorkshops.length.toLocaleString('fa-IR')} از {tailorWorkshops.length.toLocaleString('fa-IR')} کارگاه خیاطی
                </span>
                <span className="text-stone-300 hidden sm:inline">|</span>
                <span>
                  مجموع پتانسیل تولید روزانه: <strong className="text-stone-900 font-mono">{totalDailyCapFiltered.toLocaleString('fa-IR')}</strong> عدد شلوار
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-medium">پایش خطوط دوخت:</span>
                <span className="font-bold text-stone-900 bg-white px-2.5 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs">
                  کنترل کیفیت صادراتی «من و تو»
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Tab 4: Interactive Cost & Delivery Estimator Calculator */}
      {activeTab === 'calculator' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-6">
          <div className="border-b border-[#E6DEC8] pb-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#8C6D37]" />
              <h3 className="font-black text-sm sm:text-base text-[#18181B]">
                محاسبه‌گر بهای تمام‌شده شلوار، دستمزد دوخت و موعد تحویل پارت تولید
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              با تغییر مقادیر زیر، بهای تمام‌شده هر عدد شلوار و زمان مورد نیاز برای دوخت در کارگاه بلافاصله محاسبه می‌شود.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Input fields */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div>
                <label className="block font-bold text-stone-700 mb-1">متراژ کل طاقه پارچه (متر):</label>
                <input
                  type="number"
                  value={calcFabricMeters}
                  onChange={(e) => setCalcFabricMeters(Number(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">قیمت هر متر پارچه طاقه (تومان):</label>
                <input
                  type="number"
                  step="1000"
                  value={calcFabricPriceMeter}
                  onChange={(e) => setCalcFabricPriceMeter(Number(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">تیراژ خروجی شلوار بعد از برش (عدد):</label>
                <input
                  type="number"
                  value={calcUnitsExpected}
                  onChange={(e) => setCalcUnitsExpected(Number(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">دستمزد دوخت هر عدد در کارگاه (تومان):</label>
                <input
                  type="number"
                  step="1000"
                  value={calcTailorWage}
                  onChange={(e) => setCalcTailorWage(Number(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">خرج‌کار، کش، نخ و سلفون هر عدد (تومان):</label>
                <input
                  type="number"
                  step="1000"
                  value={calcTrimsCost}
                  onChange={(e) => setCalcTrimsCost(Number(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">ظرفیت روزانه خیاطی (عدد در روز):</label>
                <input
                  type="number"
                  value={calcWorkshopDailyCap}
                  onChange={(e) => setCalcWorkshopDailyCap(Number(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

            </div>

            {/* Results Card */}
            <div className="bg-[#18181B] text-[#FAF7F2] p-6 rounded-2xl border border-[#3F3F46] flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-[#D4AF37] font-black pb-2 border-b border-[#3F3F46]">
                  <Sparkles className="w-4 h-4" />
                  <span>نتایج آنالیز تولید بازار</span>
                </div>

                <div className="flex justify-between text-stone-300">
                  <span>هزینه کل طاقه پارچه:</span>
                  <span className="font-bold text-[#FAF7F2] font-mono">{totalFabricCost.toLocaleString('fa-IR')} تومان</span>
                </div>

                <div className="flex justify-between text-stone-300">
                  <span>سهم پارچه هر عدد شلوار:</span>
                  <span className="font-bold text-[#FAF7F2] font-mono">{fabricCostPerUnit.toLocaleString('fa-IR')} تومان</span>
                </div>

                <div className="flex justify-between text-stone-300">
                  <span>دستمزد دوخت + خرج‌کار:</span>
                  <span className="font-bold text-[#FAF7F2] font-mono">{(calcTailorWage + calcTrimsCost).toLocaleString('fa-IR')} تومان</span>
                </div>

                <div className="flex justify-between text-stone-300 pt-2 border-t border-[#3F3F46]">
                  <span>زمان لازم برای دوخت:</span>
                  <span className="font-bold text-[#D4AF37]">{estimatedSewingDays} روز کاری</span>
                </div>

                <div className="p-3 bg-[#27272A] rounded-xl border border-[#3F3F46] mt-2">
                  <span className="text-[11px] text-stone-400 block">بهای تمام‌شده نهایی هر عدد شلوار:</span>
                  <strong className="text-xl font-black text-emerald-400 font-mono mt-1 block">
                    {totalCostPerSingleUnit.toLocaleString('fa-IR')} تومان
                  </strong>
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    قیمت پیشنهادی عمده در کانال: {(Math.round((totalCostPerSingleUnit * 1.35) / 1000) * 1000).toLocaleString('fa-IR')} تومان (۳۵٪ سود)
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setNewBatch(prev => ({
                    ...prev,
                    fabricMetersUsed: calcFabricMeters,
                    fabricCostPerMeter: calcFabricPriceMeter,
                    plannedUnitCount: calcUnitsExpected,
                    wagePerUnit: calcTailorWage,
                    trimsPerUnit: calcTrimsCost,
                  }));
                  setIsAddBatchModalOpen(true);
                }}
                className="w-full bg-[#D4AF37] hover:bg-[#c49f2e] text-[#18181B] font-black py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>تبدیل این محاسبه به پارت تولید واقعی</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 1: Add Fabric Supplier */}
      {isAddSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6DEC8] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#8C6D37]" />
                <h3 className="text-base font-black text-[#18181B]">ثبت بنکدار و پارچه‌فروش جدید</h3>
              </div>
              <button onClick={() => setIsAddSupplierModalOpen(false)} className="text-stone-400 hover:text-stone-700 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-3.5 my-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">نام بنکداری / فروشگاه پارچه:</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: پارچه‌سرای نساجی مولوی (حاج محمود)"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">نام مسئول / فروشنده:</label>
                  <input
                    type="text"
                    placeholder="حاج محمود مولوی"
                    value={newSupplier.managerName}
                    onChange={(e) => setNewSupplier({ ...newSupplier, managerName: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شماره تماس / همراه:</label>
                  <input
                    type="text"
                    placeholder="09121112233"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">آدرس در بازار تهران:</label>
                <input
                  type="text"
                  placeholder="بازار مولوی، سرای آزادی، پلاک ۱۲"
                  value={newSupplier.marketLocation}
                  onChange={(e) => setNewSupplier({ ...newSupplier, marketLocation: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">انواع پارچه (با ویرگول):</label>
                  <input
                    type="text"
                    placeholder="کتان لایت، داکرون، ابروبادی"
                    value={newSupplier.fabricTypes}
                    onChange={(e) => setNewSupplier({ ...newSupplier, fabricTypes: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">میانگین قیمت متری (تومان):</label>
                  <input
                    type="number"
                    value={newSupplier.avgPricePerMeter}
                    onChange={(e) => setNewSupplier({ ...newSupplier, avgPricePerMeter: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">سرعت تحویل طاقه:</label>
                  <select
                    value={newSupplier.deliverySpeed}
                    onChange={(e) => setNewSupplier({ ...newSupplier, deliverySpeed: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  >
                    <option value="همان روز">همان روز (پیک بازار)</option>
                    <option value="۲۴ ساعته">۲۴ ساعته</option>
                    <option value="۲ روزه">۲ روزه</option>
                    <option value="موجودی انبار تهران">موجودی انبار تهران</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شرایط تسویه:</label>
                  <select
                    value={newSupplier.paymentTerms}
                    onChange={(e) => setNewSupplier({ ...newSupplier, paymentTerms: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  >
                    <option value="نقدی با ۲٪ تخفیف">نقدی با ۲٪ تخفیف</option>
                    <option value="چک صیادی ۳۰ روزه">چک صیادی ۳۰ روزه</option>
                    <option value="چک صیادی ۴۵ روزه">چک صیادی ۴۵ روزه</option>
                    <option value="تسویه سر ماه">تسویه سر ماه</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-[#FAF7F2] rounded-xl font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-5 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  ذخیره تامین‌کننده
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Tailor Workshop */}
      {isAddWorkshopModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6DEC8] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#8C6D37]" />
                <h3 className="text-base font-black text-[#18181B]">ثبت کارگاه خیاطی و برش جدید</h3>
              </div>
              <button onClick={() => setIsAddWorkshopModalOpen(false)} className="text-stone-400 hover:text-stone-700 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveWorkshop} className="space-y-3.5 my-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">نام کارگاه خیاطی:</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: کارگاه دوخت استاد رحمان (خیام)"
                  value={newWorkshop.name}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">نام استاد کار / سرپرست:</label>
                  <input
                    type="text"
                    placeholder="استاد رحمان"
                    value={newWorkshop.masterName}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, masterName: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شماره تماس / همراه:</label>
                  <input
                    type="text"
                    placeholder="09123334455"
                    value={newWorkshop.phone}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">آدرس کارگاه:</label>
                <input
                  type="text"
                  placeholder="بازار خیام، کوچه کربلایی، پلاک ۱۸"
                  value={newWorkshop.address}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, address: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">دستمزد هر عدد (تومان):</label>
                  <input
                    type="number"
                    value={newWorkshop.wagePerUnit}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, wagePerUnit: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ظرفیت دوخت روزانه (عدد):</label>
                  <input
                    type="number"
                    value={newWorkshop.dailyCapacity}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, dailyCapacity: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">مدل‌های تخصصی دوخت:</label>
                <input
                  type="text"
                  placeholder="شلوار بگ، داکرون، لگ غواصی"
                  value={newWorkshop.specialtyModels}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, specialtyModels: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => setIsAddWorkshopModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-[#FAF7F2] rounded-xl font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-5 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  ذخیره کارگاه خیاطی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Production Batch */}
      {isAddBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E6DEC8] animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#8C6D37]" />
                <h3 className="text-base font-black text-[#18181B]">ثبت پارت جدید برش و دوخت کارگاه</h3>
              </div>
              <button onClick={() => setIsAddBatchModalOpen(false)} className="text-stone-400 hover:text-stone-700 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveBatch} className="space-y-3.5 my-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">عنوان مدل / پارت تولید:</label>
                <input
                  type="text"
                  required
                  value={newBatch.productName}
                  onChange={(e) => setNewBatch({ ...newBatch, productName: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">بنکدار و تامین‌کننده پارچه:</label>
                  <select
                    value={newBatch.fabricSupplierId}
                    onChange={(e) => {
                      const sup = fabricSuppliers.find(s => s.id === e.target.value);
                      setNewBatch({
                        ...newBatch,
                        fabricSupplierId: e.target.value,
                        fabricCostPerMeter: sup?.avgPricePerMeter || newBatch.fabricCostPerMeter,
                      });
                    }}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  >
                    {fabricSuppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.avgPricePerMeter.toLocaleString('fa-IR')} ت/متر)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">کارگاه خیاطی و دوزنده:</label>
                  <select
                    value={newBatch.tailorWorkshopId}
                    onChange={(e) => {
                      const ws = tailorWorkshops.find(w => w.id === e.target.value);
                      setNewBatch({
                        ...newBatch,
                        tailorWorkshopId: e.target.value,
                        wagePerUnit: ws?.wagePerUnit || newBatch.wagePerUnit,
                      });
                    }}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  >
                    {tailorWorkshops.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.wagePerUnit.toLocaleString('fa-IR')} ت/عدد)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">متراژ پارچه مصرفی (متر):</label>
                  <input
                    type="number"
                    value={newBatch.fabricMetersUsed}
                    onChange={(e) => setNewBatch({ ...newBatch, fabricMetersUsed: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">تیراژ خروجی پیش‌بینی‌شده (عدد):</label>
                  <input
                    type="number"
                    value={newBatch.plannedUnitCount}
                    onChange={(e) => setNewBatch({ ...newBatch, plannedUnitCount: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">قیمت هر متر پارچه (تومان):</label>
                  <input
                    type="number"
                    value={newBatch.fabricCostPerMeter}
                    onChange={(e) => setNewBatch({ ...newBatch, fabricCostPerMeter: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">دستمزد دوخت هر عدد (تومان):</label>
                  <input
                    type="number"
                    value={newBatch.wagePerUnit}
                    onChange={(e) => setNewBatch({ ...newBatch, wagePerUnit: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">تاریخ تخمینی تحویل به انبار:</label>
                <input
                  type="text"
                  placeholder="۱۴۰۳/۰۳/۱۵"
                  value={newBatch.estimatedDeliveryDate}
                  onChange={(e) => setNewBatch({ ...newBatch, estimatedDeliveryDate: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">توضیحات و مشخصات رنگ‌بندی:</label>
                <textarea
                  rows={2}
                  value={newBatch.notes}
                  onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => setIsAddBatchModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-[#FAF7F2] rounded-xl font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-5 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  ثبت سفارش پارت دوخت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
