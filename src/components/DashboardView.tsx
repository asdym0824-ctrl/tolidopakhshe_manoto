import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  Percent, 
  FileText, 
  Sparkles, 
  ShoppingBag,
  CheckCircle2,
  Crown,
  CheckSquare,
  Square,
  Clock,
  Scissors,
  Zap,
  Check,
  RotateCcw,
  Eye,
  EyeOff,
  Phone,
  MessageCircle,
  Truck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  ArrowDownRight,
  Building2,
  Flame,
  Calendar,
  Layers,
  Send,
  HelpCircle,
  BarChart3,
  Search,
  Receipt,
  ShoppingBasket,
  Share2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { Product, Customer, CheckItem, Invoice, ModuleTab, ProductionBatch } from '../types';

interface DashboardViewProps {
  products: Product[];
  customers: Customer[];
  checks: CheckItem[];
  invoices: Invoice[];
  productionBatches?: ProductionBatch[];
  onNavigate: (tab: ModuleTab) => void;
  onOpenBulkPriceModal: () => void;
  onOpenNewProductModal: () => void;
  onOpenNewInvoiceModal: () => void;
  onOpenQuickEntry?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products = [],
  customers = [],
  checks = [],
  invoices = [],
  productionBatches = [],
  onNavigate,
  onOpenBulkPriceModal,
  onOpenNewProductModal,
  onOpenNewInvoiceModal,
  onOpenQuickEntry,
}) => {
  // ----------------------------------------------------
  // EXECUTIVE PSYCHOLOGY & PRIVACY STATE (Bazaar Shield)
  // ----------------------------------------------------
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('manoto_dash_privacy') === 'true';
    } catch {
      return false;
    }
  });

  const togglePrivacyMode = () => {
    setIsPrivacyMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('manoto_dash_privacy', String(next));
      } catch {}
      return next;
    });
  };

  // Mobile Ergonomic Sub-Tab State: 'all_modules' default so section icons show first!
  const [mobileDashboardTab, setMobileDashboardTab] = useState<'all_modules' | 'pulse' | 'priorities' | 'crm_logistics'>('all_modules');

  // Mobile Segmented Filter: 'all' | 'urgent' | 'crm' | 'stock'
  const [mobileActiveFilter, setMobileActiveFilter] = useState<'all' | 'urgent' | 'crm' | 'stock'>('all');

  // Completed / dismissed priority items for today
  const [dismissedItemIds, setDismissedItemIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('manoto_dash_dismissed_today');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleDismissItem = (id: string) => {
    setDismissedItemIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('manoto_dash_dismissed_today', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Mobile ergonomic smooth navigation with top-scroll
  const handleModuleNavigate = (tab: ModuleTab) => {
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {}
    onNavigate(tab);
  };

  // ----------------------------------------------------
  // METRICS & CALCULATIONS
  // ----------------------------------------------------
  const totalPacksInStock = products.reduce((acc, p) => acc + (p.packStock || 0), 0);
  const totalUnitsInStock = products.reduce((acc, p) => acc + ((p.packStock || 0) * (p.packSize || 1)) + (p.singleStock || 0), 0);
  
  const pendingChecks = checks.filter(c => c.status === 'pending' || c.status === 'in_collection');
  const totalPendingChecksAmount = pendingChecks.reduce((acc, c) => acc + (c.amountToman || 0), 0);
  
  const lowStockProducts = products.filter(p => (p.packStock || 0) <= (p.minPackStockAlert || 4));

  // High-priority checks due in next 7 days
  const urgentChecks = pendingChecks.slice(0, 3);

  // CRM Wholesale Customers needing follow-up
  const followUpCustomers = customers.filter(c => c.followUpRequired || (c.balanceToman && c.balanceToman > 0));

  // Recent shipments in transit
  const pendingShipments = invoices.filter(inv => inv.status === 'processing' || inv.status === 'shipped');

  // Month estimated sales
  const estimatedMonthlySales = 184500000;
  const cashSalesEstimate = 112000000;
  const checkSalesEstimate = 72500000;

  // Mask currency helper for privacy mode
  const formatMoney = (amount: number): string => {
    if (isPrivacyMode) return '••••••';
    return amount.toLocaleString('fa-IR');
  };

  // Time of day psychological greeting
  const greetingInfo = useMemo(() => {
    const hour = new Date().getHours();
    let text = 'سلام، خدا قوت و برکت به کارگاه';
    let sub = 'امروز بازار پررونق و پرفروشی داشته باشید';
    if (hour >= 5 && hour < 12) {
      text = 'صبح بخیر، رزق و روزی پربرکت';
      sub = 'بررسی وضعیت صبحگاهی حجره، سفارشات و چک‌های روز';
    } else if (hour >= 12 && hour < 17) {
      text = 'ظهر و بعدازظهر بخیر، خدا قوت';
      sub = 'پیگیری بسته‌بندی باربری‌ها، وصولی‌ها و پارت کارگاه';
    } else if (hour >= 17 && hour < 22) {
      text = 'عصر و غروب بخیر، خسته نباشید';
      sub = 'تراز پایان وقت صندوق، تسویه فاکتورها و برنامه‌ریزی فردا';
    } else {
      text = 'شب بخیر مدیریت محترم';
      sub = 'سیستم آماده بازبینی تراز مالی و هماهنگی‌های کارگاه';
    }

    let dateFa = 'امروز';
    try {
      dateFa = new Intl.DateTimeFormat('fa-IR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(new Date());
    } catch {}

    return { text, sub, dateFa };
  }, []);

  // Priority Checklist Items
  interface PriorityItem {
    id: string;
    title: string;
    description: string;
    badgeText: string;
    badgeColor: string;
    category: 'check' | 'stock' | 'crm' | 'production' | 'shipment';
    targetTab: ModuleTab;
    actionLabel: string;
    urgencyLevel: 'high' | 'medium' | 'normal';
    metaAmount?: string;
  }

  const priorityItems: PriorityItem[] = [
    // 1. Checks due soon
    ...checks.slice(0, 2).map((chk, idx) => ({
      id: `check-${chk.id || idx}`,
      title: `سررسید چک صیادی: ${chk.customerName}`,
      description: `مبلغ ${formatMoney(chk.amountToman)} تومان • بانک ${chk.bankName} • سررسید: ${chk.dueDate}`,
      badgeText: 'سررسید فوری',
      badgeColor: 'bg-rose-500 text-white',
      category: 'check' as const,
      targetTab: 'finance' as ModuleTab,
      actionLabel: 'ثبت وصولی',
      urgencyLevel: 'high' as const,
      metaAmount: `${formatMoney(chk.amountToman)} ت`
    })),
    // 2. Low stock alert
    ...lowStockProducts.slice(0, 2).map((prod, idx) => ({
      id: `stock-${prod.id || idx}`,
      title: `کسری موجودی: ${prod.name}`,
      description: `فقط ${prod.packStock} پک باقی مانده (هشدار: ${prod.minPackStockAlert} پک)`,
      badgeText: 'کسری انبار',
      badgeColor: 'bg-amber-500 text-stone-950 font-black',
      category: 'stock' as const,
      targetTab: 'inventory' as ModuleTab,
      actionLabel: 'سفارش پارت',
      urgencyLevel: 'high' as const,
    })),
    // 3. Customer follow-up
    ...customers.filter(c => c.followUpRequired).slice(0, 2).map((cust, idx) => ({
      id: `crm-${cust.id || idx}`,
      title: `پیگیری همکار: ${cust.name} (${cust.storeName})`,
      description: `مشتری شهر ${cust.city} • بیش از ۳۰ روز بدون سفارش جدید • ارسال ژورنال`,
      badgeText: 'پیگیری CRM',
      badgeColor: 'bg-[#B89B58] text-[#18181B] font-black',
      category: 'crm' as const,
      targetTab: 'crm' as ModuleTab,
      actionLabel: 'تماس / پیامک',
      urgencyLevel: 'medium' as const,
    })),
    // 4. Production batch
    ...productionBatches.filter(b => b.status === 'cutting' || b.status === 'sewing').slice(0, 1).map((batch, idx) => ({
      id: `batch-${batch.id || idx}`,
      title: `پارت در کارگاه: ${batch.batchCode} (${batch.modelName})`,
      description: `${batch.plannedPacks} پک در مرحله ${batch.status === 'cutting' ? 'برش' : 'خیاطی'} • تحویل: ${batch.estimatedDeliveryDate}`,
      badgeText: 'کارگاه دوخت',
      badgeColor: 'bg-purple-600 text-white',
      category: 'production' as const,
      targetTab: 'production' as ModuleTab,
      actionLabel: 'پیگیری دوزنده',
      urgencyLevel: 'medium' as const,
    })),
  ];

  const completedCount = priorityItems.filter(item => dismissedItemIds.includes(item.id)).length;
  const totalPrioritiesCount = priorityItems.length;

  // Filtered priority items for mobile
  const filteredPriorityItems = priorityItems.filter(item => {
    if (mobileActiveFilter === 'all') return true;
    if (mobileActiveFilter === 'urgent') return item.urgencyLevel === 'high' || item.category === 'check';
    if (mobileActiveFilter === 'crm') return item.category === 'crm';
    if (mobileActiveFilter === 'stock') return item.category === 'stock' || item.category === 'production';
    return true;
  });

  // Category Distribution Mock / Calculations
  const categoryData = [
    { name: 'شلوار بگ', value: 38, color: '#18181B', countPacks: 112 },
    { name: 'شلوار راحتی نخی', value: 25, color: '#D4AF37', countPacks: 74 },
    { name: 'لگ و ساپورت', value: 18, color: '#8C6D37', countPacks: 53 },
    { name: 'داکرون اداری', value: 12, color: '#71717A', countPacks: 36 },
    { name: 'جاگر و کارگو', value: 7, color: '#E6DEC8', countPacks: 21 },
  ];

  // Sales Trend Mock Data
  const salesWeeklyData = [
    { day: 'شنبه', cashSales: 18500000, checkSales: 24500000 },
    { day: '۱شنبه', cashSales: 22000000, checkSales: 15000000 },
    { day: '۲شنبه', cashSales: 31000000, checkSales: 35000000 },
    { day: '۳شنبه', cashSales: 19500000, checkSales: 12000000 },
    { day: '۴شنبه', cashSales: 42000000, checkSales: 28500000 },
    { day: '۵شنبه', cashSales: 38000000, checkSales: 18000000 },
  ];

  return (
    <div id="dashboard-view-container" className="space-y-4 md:space-y-6 animate-in fade-in duration-200" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 📱 MOBILE EXCLUSIVE EXPERIENCE: PSYCHOLOGICALLY CALM SUPER ADMIN COCKPIT  */}
      {/* ========================================================================= */}
      <div className="block lg:hidden space-y-3 pb-28">
        
        {/* Calm Segmented Mobile Navigation (Mental Clarity & Focus) */}
        <nav className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-[#E6DEC8] shadow-2xs overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setMobileDashboardTab('all_modules')}
            className={`flex-1 min-w-[85px] py-2 px-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer ${
              mobileDashboardTab === 'all_modules'
                ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>بخش‌های سامانه (۱۰)</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileDashboardTab('pulse')}
            className={`flex-1 min-w-[76px] py-2 px-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer ${
              mobileDashboardTab === 'pulse'
                ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>نبض و عملیات</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileDashboardTab('priorities')}
            className={`flex-1 min-w-[76px] py-2 px-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer ${
              mobileDashboardTab === 'priorities'
                ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>کارهای امروز</span>
            {pendingChecks.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileDashboardTab('crm_logistics')}
            className={`flex-1 min-w-[76px] py-2 px-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer ${
              mobileDashboardTab === 'crm_logistics'
                ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>همکاران و بار</span>
          </button>

          {/* Compact Privacy Shield Toggle */}
          <button
            type="button"
            id="mobile-dash-btn-privacy"
            onClick={togglePrivacyMode}
            className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
              isPrivacyMode 
                ? 'bg-amber-50 text-amber-900 border-amber-300' 
                : 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200'
            }`}
            title={isPrivacyMode ? 'نمایش مبالغ' : 'مخفی‌سازی مبالغ مالی'}
          >
            {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5 text-amber-800" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </nav>

        {/* ========================================================================= */}
        {/* SUB-VIEW 1: ⚡ PULSE & CORE BAZAAR ACTIONS                                */}
        {/* ========================================================================= */}
        {mobileDashboardTab === 'pulse' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            
            {/* Calming Treasury & Financial Pulse Card */}
            <section className="bg-[#1C1C1F] text-[#FAF7F2] p-4 rounded-2xl border border-stone-800 shadow-sm relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-[#D4AF37] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>تراز مالی و نقدینگی ماه جاری</span>
                </span>
                <span className="text-[9.5px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  +۲۲٪ رشد مثبت بازار
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-stone-800 pb-2.5">
                <div>
                  <span className="text-[10px] text-stone-400 block font-medium">مجموع فروش و وصولی:</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black font-mono text-white tracking-tight">
                      {formatMoney(estimatedMonthlySales)}
                    </span>
                    <span className="text-xs text-[#D4AF37] font-bold">تومان</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('sales')}
                  className="text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 active:scale-95 border border-stone-700 cursor-pointer"
                >
                  <span>ریز فاکتورها</span>
                  <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                </button>
              </div>

              {/* Dual Metrics: Cash vs Checks */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div 
                  onClick={() => onNavigate('sales')}
                  className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 flex flex-col justify-between cursor-pointer active:scale-98"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">فروش نقدی صندوق:</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      {formatMoney(cashSalesEstimate)}
                    </span>
                    <span className="text-[9px] text-stone-400">ت</span>
                  </div>
                </div>

                <div 
                  onClick={() => onNavigate('finance')}
                  className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 flex flex-col justify-between cursor-pointer active:scale-98"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">چک‌های صیادی باز:</span>
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-sm font-black text-[#D4AF37] font-mono">
                      {formatMoney(totalPendingChecksAmount)}
                    </span>
                    <span className="text-[9px] text-stone-400">ت ({pendingChecks.length} فقره)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Rapid Thumb Action Deck (3 High-Use Actions + Price Adjust) */}
            <section className="bg-white p-3 rounded-2xl border border-[#E6DEC8] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-[#18181B] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>اقدامات سریع شستی</span>
                </span>
                <span className="text-[10px] text-stone-400">دسترسی با یک لمس</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="mobile-action-new-invoice"
                  onClick={onOpenNewInvoiceModal}
                  className="p-3 bg-[#18181B] text-[#FAF7F2] rounded-xl border border-stone-800 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer shadow-xs min-h-[56px]"
                >
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[11px] font-black">صدور فاکتور</span>
                  <span className="text-[8.5px] text-stone-300">نقدی / چکی</span>
                </button>

                <button
                  type="button"
                  id="mobile-action-new-product"
                  onClick={onOpenNewProductModal}
                  className="p-3 bg-[#FAF7F2] hover:bg-stone-100 text-stone-900 rounded-xl border border-[#DDD5C0] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer shadow-2xs min-h-[56px]"
                >
                  <Package className="w-4 h-4 text-[#8C6D37]" />
                  <span className="text-[11px] font-black">مدل و پک جدید</span>
                  <span className="text-[8.5px] text-stone-500">پک ۴، ۶، ۸</span>
                </button>

                <button
                  type="button"
                  id="mobile-action-finance"
                  onClick={() => onNavigate('finance')}
                  className="p-3 bg-[#FAF7F2] hover:bg-stone-100 text-stone-900 rounded-xl border border-[#DDD5C0] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer shadow-2xs min-h-[56px]"
                >
                  <CreditCard className="w-4 h-4 text-purple-700" />
                  <span className="text-[11px] font-black">چک‌های صیادی</span>
                  <span className="text-[8.5px] text-stone-500">{pendingChecks.length} در انتظار</span>
                </button>
              </div>

              {/* Price adjustment single-line trigger */}
              <button
                type="button"
                onClick={onOpenBulkPriceModal}
                className="w-full py-2 px-3 bg-[#FAF7F2] hover:bg-stone-100 text-stone-800 rounded-xl border border-[#DDD5C0] text-xs font-bold flex items-center justify-between cursor-pointer transition-colors active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <Percent className="w-3.5 h-3.5 text-amber-700" />
                  <span>تغییر درصدی قیمت‌ها (نوسان بهای پارچه)</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-stone-400" />
              </button>
            </section>

            {/* Quick AI Voice/Text Entry Bar */}
            {onOpenQuickEntry && (
              <div 
                onClick={onOpenQuickEntry}
                className="bg-white p-3 rounded-2xl border border-[#E6DEC8] flex items-center justify-between gap-2 cursor-pointer active:scale-98 transition-all shadow-2xs hover:border-[#18181B]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                      <span>ثبت سریع بازاری (متن یا صدا)</span>
                      <span className="bg-amber-100 text-amber-900 text-[9px] px-1.5 py-0.2 rounded font-bold">هوش مصنوعی</span>
                    </div>
                    <p className="text-[10px] text-stone-500 truncate mt-0.5">
                      «۲ پک شلوار بگ کتان نقد به احمدی فروختم»
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-stone-400 shrink-0" />
              </div>
            )}

            {/* Top Urgent Card: Just 1-2 critical tasks */}
            {urgentChecks.length > 0 && (
              <section className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-black text-[#18181B]">سررسید نزدیک‌ترین چک صیادی</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('finance')}
                    className="text-[10.5px] text-[#8C6D37] font-bold hover:underline"
                  >
                    مشاهده تقویم
                  </button>
                </div>

                <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-stone-900 truncate">{urgentChecks[0].customerName}</span>
                      <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-[#DDD5C0]">
                        بانک {urgentChecks[0].bankName}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-stone-500 mt-0.5">
                      سررسید: <span className="font-bold text-amber-900 font-mono">{urgentChecks[0].dueDate}</span>
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="text-xs font-black text-stone-900 block font-mono">
                      {formatMoney(urgentChecks[0].amountToman)} ت
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('finance')}
                      className="text-[10px] bg-[#18181B] text-[#D4AF37] px-2 py-0.5 rounded-lg font-bold mt-1 inline-block"
                    >
                      ثبت وصول
                    </button>
                  </div>
                </div>
              </section>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-VIEW 2: 🧭 SUPER ADMIN ALL-MODULES DIRECTORY (Total Accessibility)    */}
        {/* ========================================================================= */}
        {mobileDashboardTab === 'all_modules' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            {/* Domain Group 1: Production & Inventory */}
            <div className="space-y-2">
              <span className="flex items-center justify-between px-1.5 py-0.5 w-full">
                <span className="text-[11px] font-black text-stone-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-xs" />
                  <span>تولید، انبارداری و بهای تمام‌شده کالا</span>
                </span>
                <span className="text-[9.5px] font-bold text-stone-400 font-mono">۲ ماژول پایه</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                
                {/* 1. Inventory & Stock */}
                <button
                  type="button"
                  id="mobile-mod-inventory"
                  onClick={() => handleModuleNavigate('inventory')}
                  className="group relative p-3 sm:p-3.5 bg-white/95 hover:bg-white rounded-2xl border border-[#E2DAD0] hover:border-[#D4AF37]/60 active:border-[#18181B] shadow-[0_2px_8px_rgba(24,24,27,0.03)] active:scale-[0.985] text-right transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[64px] touch-manipulation select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 border border-amber-300/70 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-black text-stone-900 group-hover:text-black truncate leading-tight">
                        انبارداری و موجودی کالا
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                        {totalPacksInStock} پک موجود • تنظیم درصدی قیمت
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black font-mono bg-amber-500/10 text-amber-900 border border-amber-300/60 shrink-0">
                      {totalPacksInStock} پک
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-[#18181B] group-hover:text-[#D4AF37] text-stone-400 flex items-center justify-center transition-colors shrink-0">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

                {/* 2. Production & Workshop */}
                <button
                  type="button"
                  id="mobile-mod-production"
                  onClick={() => handleModuleNavigate('production')}
                  className="group relative p-3 sm:p-3.5 bg-white/95 hover:bg-white rounded-2xl border border-[#E2DAD0] hover:border-[#D4AF37]/60 active:border-[#18181B] shadow-[0_2px_8px_rgba(24,24,27,0.03)] active:scale-[0.985] text-right transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[64px] touch-manipulation select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-800 border border-indigo-300/70 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Scissors className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-black text-stone-900 group-hover:text-black truncate leading-tight">
                        کارگاه تولید و دوزندگی
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                        {productionBatches.length} پارت در کارگاه • پارچه و دوزنده
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black font-mono bg-indigo-500/10 text-indigo-900 border border-indigo-300/60 shrink-0">
                      {productionBatches.length} پارت
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-[#18181B] group-hover:text-[#D4AF37] text-stone-400 flex items-center justify-center transition-colors shrink-0">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Domain Group 2: Sales, Invoices & Finance */}
            <div className="space-y-2">
              <span className="flex items-center justify-between px-1.5 py-0.5 w-full">
                <span className="text-[11px] font-black text-stone-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs" />
                  <span>فروش، صدور فاکتور و خزانه مالی</span>
                </span>
                <span className="text-[9.5px] font-bold text-stone-400 font-mono">۲ ماژول نقدینگی</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                
                {/* 3. Sales & Invoicing */}
                <button
                  type="button"
                  id="mobile-mod-sales"
                  onClick={() => handleModuleNavigate('sales')}
                  className="group relative p-3 sm:p-3.5 bg-white/95 hover:bg-white rounded-2xl border border-[#E2DAD0] hover:border-[#D4AF37]/60 active:border-[#18181B] shadow-[0_2px_8px_rgba(24,24,27,0.03)] active:scale-[0.985] text-right transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[64px] touch-manipulation select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-800 border border-emerald-300/70 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-black text-stone-900 group-hover:text-black truncate leading-tight">
                        صدور فاکتور و فروش
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                        {invoices.length} فاکتور ثبت‌شده • تسویه نقدی و چکی
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black font-mono bg-emerald-500/10 text-emerald-900 border border-emerald-300/60 shrink-0">
                      {invoices.length} فاکتور
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-[#18181B] group-hover:text-[#D4AF37] text-stone-400 flex items-center justify-center transition-colors shrink-0">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

                {/* 4. Finance & Checks */}
                <button
                  type="button"
                  id="mobile-mod-finance"
                  onClick={() => handleModuleNavigate('finance')}
                  className="group relative p-3 sm:p-3.5 bg-white/95 hover:bg-white rounded-2xl border border-[#E2DAD0] hover:border-[#D4AF37]/60 active:border-[#18181B] shadow-[0_2px_8px_rgba(24,24,27,0.03)] active:scale-[0.985] text-right transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[64px] touch-manipulation select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-800 border border-purple-300/70 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-black text-stone-900 group-hover:text-black truncate leading-tight">
                        خزانه و چک‌های صیادی
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                        {pendingChecks.length} چک در جریان • تقویم سررسید
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black font-mono bg-purple-500/10 text-purple-900 border border-purple-300/60 shrink-0">
                      {pendingChecks.length} چک باز
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-[#18181B] group-hover:text-[#D4AF37] text-stone-400 flex items-center justify-center transition-colors shrink-0">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Domain Group 3: Customers & Logistics */}
            <div className="space-y-2">
              <span className="flex items-center justify-between px-1.5 py-0.5 w-full">
                <span className="text-[11px] font-black text-stone-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-xs" />
                  <span>مشتریان، وب‌سایت و توزیع باربری</span>
                </span>
                <span className="text-[9.5px] font-bold text-stone-400 font-mono">۳ ماژول ارتباطی</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                
                {/* 5. Wholesale CRM */}
                <button
                  type="button"
                  id="mobile-mod-crm"
                  onClick={() => handleModuleNavigate('crm')}
                  className="group relative p-3 sm:p-3.5 bg-white/95 hover:bg-white rounded-2xl border border-[#E2DAD0] hover:border-[#D4AF37]/60 active:border-[#18181B] shadow-[0_2px_8px_rgba(24,24,27,0.03)] active:scale-[0.985] text-right transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[64px] touch-manipulation select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-800 border border-sky-300/70 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-black text-stone-900 group-hover:text-black truncate leading-tight">
                        همکاران عمده (CRM)
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                        {customers.length} همکار سراسر کشور • سقف اعتبار
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black font-mono bg-sky-500/10 text-sky-900 border border-sky-300/60 shrink-0">
                      {customers.length} همکار
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-[#18181B] group-hover:text-[#D4AF37] text-stone-400 flex items-center justify-center transition-colors shrink-0">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

                {/* 6. Retail Customers */}
                <button
                  type="button"
                  id="mobile-mod-retail-customers"
                  onClick={() => handleModuleNavigate('retail_customers')}
                  className="group relative p-3 sm:p-3.5 bg-white/95 hover:bg-white rounded-2xl border border-[#E2DAD0] hover:border-[#D4AF37]/60 active:border-[#18181B] shadow-[0_2px_8px_rgba(24,24,27,0.03)] active:scale-[0.985] text-right transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[64px] touch-manipulation select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-800 border border-teal-300/70 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <ShoppingBasket className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-black text-stone-900 group-hover:text-black truncate leading-tight">
                        مشتریان خرد سایت
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                        سفارشات تک‌فروشی آنلاین و آدرس‌ها
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black font-mono bg-teal-500/10 text-teal-900 border border-teal-300/60 shrink-0">
                      تک‌فروشی
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-[#18181B] group-hover:text-[#D4AF37] text-stone-400 flex items-center justify-center transition-colors shrink-0">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

                {/* 7. Logistics */}
                <button
                  type="button"
                  id="mobile-mod-logistics"
                  onClick={() => handleModuleNavigate('logistics')}
                  className="group relative p-3 sm:p-3.5 bg-white/95 hover:bg-white rounded-2xl border border-[#E2DAD0] hover:border-[#D4AF37]/60 active:border-[#18181B] shadow-[0_2px_8px_rgba(24,24,27,0.03)] active:scale-[0.985] text-right transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[64px] touch-manipulation select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-800 border border-orange-300/70 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-black text-stone-900 group-hover:text-black truncate leading-tight">
                        لجستیک و باربری
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                        بیجک وطن، تیپاکس و بسته‌بندی پلاک ۲۴۲
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black font-mono bg-orange-500/10 text-orange-900 border border-orange-300/60 shrink-0">
                      بارنامه
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-[#18181B] group-hover:text-[#D4AF37] text-stone-400 flex items-center justify-center transition-colors shrink-0">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Domain Group 4: Storefront, AI & Security Root */}
            <div className="space-y-2">
              <span className="flex items-center justify-between px-1.5 py-0.5 w-full">
                <span className="text-[11px] font-black text-stone-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18181B] shadow-xs" />
                  <span>تنظیمات ویترین، هوش مصنوعی و سوپر ادمین</span>
                </span>
                <span className="text-[9.5px] font-bold text-stone-400 font-mono">۳ ماژول راهبردی</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                
                {/* 8. Storefront & Site CMS */}
                <button
                  type="button"
                  id="mobile-mod-storefront"
                  onClick={() => handleModuleNavigate('storefront')}
                  className="group relative p-3 sm:p-3.5 bg-white/95 hover:bg-white rounded-2xl border border-[#E2DAD0] hover:border-[#D4AF37]/60 active:border-[#18181B] shadow-[0_2px_8px_rgba(24,24,27,0.03)] active:scale-[0.985] text-right transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[64px] touch-manipulation select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 text-[#D4AF37] border border-stone-700/70 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-black text-stone-900 group-hover:text-black truncate leading-tight">
                        ویترین و تنظیمات سایت
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                        اسلایدر، بنرها و شرایط ارسال
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black font-mono bg-stone-100 text-stone-800 border border-stone-300/80 shrink-0">
                      ویترین زنده
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-[#18181B] group-hover:text-[#D4AF37] text-stone-400 flex items-center justify-center transition-colors shrink-0">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

                {/* 9. AI Marketing */}
                <button
                  type="button"
                  id="mobile-mod-marketing"
                  onClick={() => handleModuleNavigate('marketing')}
                  className="group relative p-3 sm:p-3.5 bg-white/95 hover:bg-white rounded-2xl border border-[#E2DAD0] hover:border-[#D4AF37]/60 active:border-[#18181B] shadow-[0_2px_8px_rgba(24,24,27,0.03)] active:scale-[0.985] text-right transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[64px] touch-manipulation select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-800 border border-violet-300/70 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-black text-stone-900 group-hover:text-black truncate leading-tight">
                        دستیار هوش مصنوعی
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                        کپشن‌نویسی تلگرام و روبیکا
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black font-mono bg-violet-500/10 text-violet-900 border border-violet-300/60 shrink-0">
                      تولید محتوا
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-[#18181B] group-hover:text-[#D4AF37] text-stone-400 flex items-center justify-center transition-colors shrink-0">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

                {/* 10. Super Admin Roles & Backup */}
                <button
                  type="button"
                  id="mobile-mod-roles"
                  onClick={() => handleModuleNavigate('roles')}
                  className="group relative p-3 sm:p-3.5 bg-gradient-to-r from-[#18181B] via-[#242428] to-[#18181B] text-[#FAF7F2] rounded-2xl border border-stone-800 ring-1 ring-[#D4AF37]/35 shadow-md active:scale-[0.985] text-right transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[64px] touch-manipulation select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#27272A] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-black text-white truncate leading-tight">
                        امنیت و کنترل سوپر ادمین
                      </h4>
                      <p className="text-[10px] text-stone-300 truncate mt-0.5 font-medium">
                        دسترسی روت • بک‌آپ دیتابیس و اکسل
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black font-mono bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                      سطح ۱ روت
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-[#27272A] group-hover:bg-[#D4AF37] group-hover:text-[#18181B] text-[#D4AF37] flex items-center justify-center transition-colors shrink-0">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-VIEW 3: 📋 TODAY'S PRIORITIES & CHECKLIST                              */}
        {/* ========================================================================= */}
        {mobileDashboardTab === 'priorities' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => setMobileActiveFilter('all')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  mobileActiveFilter === 'all'
                    ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                    : 'bg-white text-stone-600 border border-[#DDD5C0]'
                }`}
              >
                <span>همه اولویت‌ها</span>
                <span className="text-[10px] bg-stone-100 text-stone-800 px-1.5 py-0.2 rounded-md font-mono">
                  {totalPrioritiesCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMobileActiveFilter('urgent')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  mobileActiveFilter === 'urgent'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-rose-700 border border-rose-200'
                }`}
              >
                <span>فوری و چک‌ها</span>
                <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-md font-black">
                  {pendingChecks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMobileActiveFilter('stock')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  mobileActiveFilter === 'stock'
                    ? 'bg-[#8C6D37] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-[#DDD5C0]'
                }`}
              >
                <span>انبار و تولید</span>
                <span className="text-[10px] bg-stone-100 text-stone-800 px-1.5 py-0.2 rounded-md">
                  {lowStockProducts.length}
                </span>
              </button>
            </div>

            {/* Checklist Section */}
            <section className="bg-white rounded-2xl p-3.5 border border-[#E6DEC8] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#8C6D37]" />
                  <h3 className="text-xs font-black text-[#18181B]">کارهای مهم امروز کارگاه</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-500 bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#DDD5C0]">
                    {completedCount} از {totalPrioritiesCount} انجام شده
                  </span>
                  {completedCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setDismissedItemIds([])}
                      className="text-[10px] text-stone-500 hover:text-stone-900 p-1"
                      title="بازنشانی"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {filteredPriorityItems.length === 0 ? (
                  <div className="text-center py-6 text-stone-400 text-xs">
                    موردی در این دسته‌بندی وجود ندارد.
                  </div>
                ) : (
                  filteredPriorityItems.map(item => {
                    const isDismissed = dismissedItemIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border transition-all space-y-2 ${
                          isDismissed
                            ? 'bg-stone-50/70 border-stone-200 opacity-60'
                            : 'bg-[#FAF7F2] border-[#E6DEC8] shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                                {item.badgeText}
                              </span>
                              {item.metaAmount && (
                                <span className="text-[10px] font-black font-mono text-stone-800">
                                  {item.metaAmount}
                                </span>
                              )}
                            </div>
                            <h4 className={`text-xs font-black text-[#18181B] truncate ${isDismissed ? 'line-through text-stone-400' : ''}`}>
                              {item.title}
                            </h4>
                            <p className={`text-[10.5px] text-stone-600 mt-0.5 line-clamp-2 leading-relaxed ${isDismissed ? 'text-stone-400' : ''}`}>
                              {item.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleDismissItem(item.id)}
                            className={`p-2 rounded-xl shrink-0 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                              isDismissed ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-stone-400 border border-stone-300'
                            }`}
                            title={isDismissed ? 'برگرداندن' : 'تیک رسیدگی شد'}
                          >
                            {isDismissed ? <Check className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4" />}
                          </button>
                        </div>

                        <div className="pt-1.5 border-t border-[#DDD5C0]/60 flex items-center justify-between">
                          <span className="text-[9.5px] text-stone-400">اقدام سریع:</span>
                          <button
                            type="button"
                            onClick={() => onNavigate(item.targetTab)}
                            className="text-[11px] bg-[#18181B] text-[#FAF7F2] hover:bg-stone-800 font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 active:scale-95 shadow-2xs cursor-pointer min-h-[36px]"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-VIEW 4: 🤝 CRM WHOLESALE, LOGISTICS & MESSENGER STATUS                */}
        {/* ========================================================================= */}
        {mobileDashboardTab === 'crm_logistics' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            
            {/* Wholesale Customers CRM Follow-up */}
            <section className="bg-white rounded-2xl p-3.5 border border-[#E6DEC8] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2">
                <div>
                  <h3 className="text-xs font-black text-[#18181B] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#8C6D37]" />
                    <span>باشگاه همکاران بازار و پیگیری</span>
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    ارتباط و یادآوری سفارش به مغازه‌داران شهرستان
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('crm')}
                  className="text-[11px] text-[#8C6D37] font-bold hover:underline"
                >
                  همه ({customers.length})
                </button>
              </div>

              <div className="space-y-2">
                {customers.slice(0, 3).map(cust => (
                  <div 
                    key={cust.id} 
                    className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-[#18181B] truncate">{cust.name}</span>
                        <span className="text-[9px] bg-white text-stone-600 px-1.5 py-0.2 rounded border border-[#DDD5C0] truncate">
                          {cust.storeName || cust.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500">
                        <span>شهر: {cust.city}</span>
                        <span>•</span>
                        <span className="font-bold text-amber-900">
                          مانده: {formatMoney(cust.balanceToman || 0)} ت
                        </span>
                      </div>
                    </div>

                    {/* Instant Thumb Actions: Phone Call & WhatsApp */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {cust.phone && (
                        <a
                          href={`tel:${cust.phone}`}
                          className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center transition-colors shadow-2xs min-h-[44px] min-w-[44px]"
                          title="تماس تلفنی"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                      {cust.phone && (
                        <a
                          href={`https://wa.me/98${cust.phone.replace(/^0/, '')}?text=${encodeURIComponent(`سلام جناب ${cust.name} عزیز، مدل‌های جدید شلوار کارگاه من و تو آماده ارسال است.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-2xs min-h-[44px] min-w-[44px]"
                          title="پیام واتساپ"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Deliveries & Shipments */}
            <section className="bg-white rounded-2xl p-3.5 border border-[#E6DEC8] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#8C6D37]" />
                  <h3 className="text-xs font-black text-[#18181B]">آخرین فاکتورها و باربری‌ها</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('sales')}
                  className="text-[11px] text-[#8C6D37] font-bold hover:underline"
                >
                  مشاهده فاکتورها
                </button>
              </div>

              <div className="space-y-2">
                {invoices.slice(0, 3).map(inv => (
                  <div key={inv.id} className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-[#18181B] truncate">{inv.customerName}</span>
                        <span className="text-[9.5px] bg-white px-1.5 py-0.2 rounded border border-[#DDD5C0] font-mono">
                          {inv.invoiceNumber}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        مقصد: {inv.city} • {inv.items?.length || 0} ردیف کالا
                      </p>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-xs font-black text-[#18181B] block font-mono">
                        {formatMoney(inv.finalAmountToman)} ت
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 ${
                        inv.status === 'shipped' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'processing' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {inv.status === 'shipped' ? 'ارسال شده' : inv.status === 'processing' ? 'بسته‌بندی' : 'تسویه'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Virtual Channels Status (Telegram, Rubika, Eitaa) */}
            <section className="bg-white rounded-2xl p-3.5 border border-[#E6DEC8] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2">
                <span className="text-xs font-black text-[#18181B] flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>کانال‌های فروش مجازی</span>
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('marketing')}
                  className="text-[11px] text-[#8C6D37] font-bold hover:underline"
                >
                  کپشن AI
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-2 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8]">
                  <span className="text-[11px] font-black text-[#18181B] block">تلگرام</span>
                  <span className="text-[9.5px] text-stone-500 block mt-0.5">۶۱۸ عضو</span>
                  <span className="text-[8.5px] text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded font-bold inline-block mt-1">
                    فعال
                  </span>
                </div>

                <div className="p-2 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8]">
                  <span className="text-[11px] font-black text-[#18181B] block">روبیکا</span>
                  <span className="text-[9.5px] text-stone-500 block mt-0.5">۳۴۰ همکار</span>
                  <span className="text-[8.5px] text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded font-bold inline-block mt-1">
                    ربات وصل
                  </span>
                </div>

                <div className="p-2 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8]">
                  <span className="text-[11px] font-black text-[#18181B] block">ایتا</span>
                  <span className="text-[9.5px] text-stone-500 block mt-0.5">۲۸۵ مشتری</span>
                  <span className="text-[8.5px] text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded font-bold inline-block mt-1">
                    پایدار
                  </span>
                </div>
              </div>
            </section>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 💻 DESKTOP EXPERIENCE: LARGE WORKSPACE VIEWPORT (Kept & Aligned on lg+) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block space-y-6">
        
        {/* Quick Natural Language Action Bar for Merchant */}
        {onOpenQuickEntry && (
          <section className="bg-gradient-to-r from-[#18181B] to-stone-900 text-[#FAF7F2] p-4 rounded-2xl border border-[#3F3F46] shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#18181B] flex items-center justify-center font-black shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#FAF7F2] flex items-center gap-2">
                  <span>ثبت سریع بازاری (با یک خط متن یا صوت)</span>
                  <span className="bg-[#D4AF37] text-[#18181B] text-[10px] px-2 py-0.2 rounded-full font-bold">هوش مصنوعی</span>
                </h3>
                <p className="text-[11px] text-[#E6DEC8]/80 mt-0.5">
                  مثال: «۲ پک شلوار بگ کتان لایت نقد فروختم به سارا احمدی»
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePrivacyMode}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title={isPrivacyMode ? 'نمایش مبالغ' : 'مخفی‌سازی مبالغ مالی'}
              >
                {isPrivacyMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                <span>{isPrivacyMode ? 'مبالغ مخفی' : 'حریم خصوصی'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenQuickEntry}
                className="bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>باز کردن پنجره ثبت سریع</span>
              </button>
            </div>
          </section>
        )}

        {/* 🌟 Desktop All-Modules Executive Launcher (Icon-by-Icon Entry) */}
        <section className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#DDD5C0] text-[#8C6D37] flex items-center justify-center font-black shrink-0 shadow-2xs">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#18181B] flex items-center gap-2">
                  <span>درگاه جامع ورود به بخش‌های سامانه (سوپر ادمین)</span>
                  <span className="text-[10px] bg-[#FAF7F2] text-[#8C6D37] px-2 py-0.5 rounded-full font-bold border border-[#DDD5C0]">
                    ۱۰ بخش فعال کارگاه و سایت
                  </span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  جهت ورود به هر یک از میزهای کار، روی آیکون بخش مربوطه کلیک نمایید:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-medium">
                دسترسی مستقیم و تفکیک‌شده
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* 1. Inventory */}
            <button
              type="button"
              onClick={() => onNavigate('inventory')}
              className="p-3.5 bg-[#FAF7F2] hover:bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#8C6D37] text-right transition-all group cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between gap-3 min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-800 border border-amber-200/60 flex items-center justify-center transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-[#DDD5C0] font-bold group-hover:bg-[#8C6D37] group-hover:text-white group-hover:border-[#8C6D37] transition-all flex items-center gap-1">
                  <span>ورود</span>
                  <ChevronLeft className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-[#8C6D37] transition-colors">انبارداری و موجودی</h4>
                <p className="text-[10px] text-stone-500 mt-0.5 truncate">{totalPacksInStock} پک موجود در انبار</p>
              </div>
            </button>

            {/* 2. Production */}
            <button
              type="button"
              onClick={() => onNavigate('production')}
              className="p-3.5 bg-[#FAF7F2] hover:bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#8C6D37] text-right transition-all group cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between gap-3 min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-800 border border-indigo-200/60 flex items-center justify-center transition-colors">
                  <Scissors className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-[#DDD5C0] font-bold group-hover:bg-[#8C6D37] group-hover:text-white group-hover:border-[#8C6D37] transition-all flex items-center gap-1">
                  <span>ورود</span>
                  <ChevronLeft className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-[#8C6D37] transition-colors">کارگاه تولید و دوزندگی</h4>
                <p className="text-[10px] text-stone-500 mt-0.5 truncate">{productionBatches.length} پارت در دوزندگی</p>
              </div>
            </button>

            {/* 3. Sales */}
            <button
              type="button"
              onClick={() => onNavigate('sales')}
              className="p-3.5 bg-[#FAF7F2] hover:bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#8C6D37] text-right transition-all group cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between gap-3 min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 flex items-center justify-center transition-colors">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-[#DDD5C0] font-bold group-hover:bg-[#8C6D37] group-hover:text-white group-hover:border-[#8C6D37] transition-all flex items-center gap-1">
                  <span>ورود</span>
                  <ChevronLeft className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-[#8C6D37] transition-colors">صدور فاکتور و فروش</h4>
                <p className="text-[10px] text-stone-500 mt-0.5 truncate">{invoices.length} فاکتور ثبت شده</p>
              </div>
            </button>

            {/* 4. Finance */}
            <button
              type="button"
              onClick={() => onNavigate('finance')}
              className="p-3.5 bg-[#FAF7F2] hover:bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#8C6D37] text-right transition-all group cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between gap-3 min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-100 text-purple-800 border border-purple-200/60 flex items-center justify-center transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-[#DDD5C0] font-bold group-hover:bg-[#8C6D37] group-hover:text-white group-hover:border-[#8C6D37] transition-all flex items-center gap-1">
                  <span>ورود</span>
                  <ChevronLeft className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-[#8C6D37] transition-colors">خزانه و چک صیادی</h4>
                <p className="text-[10px] text-stone-500 mt-0.5 truncate">{pendingChecks.length} چک در جریان وصول</p>
              </div>
            </button>

            {/* 5. CRM */}
            <button
              type="button"
              onClick={() => onNavigate('crm')}
              className="p-3.5 bg-[#FAF7F2] hover:bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#8C6D37] text-right transition-all group cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between gap-3 min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-sky-50 group-hover:bg-sky-100 text-sky-800 border border-sky-200/60 flex items-center justify-center transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-[#DDD5C0] font-bold group-hover:bg-[#8C6D37] group-hover:text-white group-hover:border-[#8C6D37] transition-all flex items-center gap-1">
                  <span>ورود</span>
                  <ChevronLeft className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-[#8C6D37] transition-colors">همکاران عمده (CRM)</h4>
                <p className="text-[10px] text-stone-500 mt-0.5 truncate">{customers.length} بنکدار و همکار بازار</p>
              </div>
            </button>

            {/* 6. Retail */}
            <button
              type="button"
              onClick={() => onNavigate('retail_customers')}
              className="p-3.5 bg-[#FAF7F2] hover:bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#8C6D37] text-right transition-all group cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between gap-3 min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-teal-50 group-hover:bg-teal-100 text-teal-800 border border-teal-200/60 flex items-center justify-center transition-colors">
                  <ShoppingBasket className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-[#DDD5C0] font-bold group-hover:bg-[#8C6D37] group-hover:text-white group-hover:border-[#8C6D37] transition-all flex items-center gap-1">
                  <span>ورود</span>
                  <ChevronLeft className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-[#8C6D37] transition-colors">مشتریان خرد سایت</h4>
                <p className="text-[10px] text-stone-500 mt-0.5 truncate">خریداران تک آنلاین و آدرس‌ها</p>
              </div>
            </button>

            {/* 7. Logistics */}
            <button
              type="button"
              onClick={() => onNavigate('logistics')}
              className="p-3.5 bg-[#FAF7F2] hover:bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#8C6D37] text-right transition-all group cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between gap-3 min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-800 border border-amber-200/60 flex items-center justify-center transition-colors">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-[#DDD5C0] font-bold group-hover:bg-[#8C6D37] group-hover:text-white group-hover:border-[#8C6D37] transition-all flex items-center gap-1">
                  <span>ورود</span>
                  <ChevronLeft className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-[#8C6D37] transition-colors">لجستیک و باربری</h4>
                <p className="text-[10px] text-stone-500 mt-0.5 truncate">بیجک وطن، تیپاکس و ارسال</p>
              </div>
            </button>

            {/* 8. Marketing */}
            <button
              type="button"
              onClick={() => onNavigate('marketing')}
              className="p-3.5 bg-[#FAF7F2] hover:bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#8C6D37] text-right transition-all group cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between gap-3 min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-violet-50 group-hover:bg-violet-100 text-violet-800 border border-violet-200/60 flex items-center justify-center transition-colors">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-[#DDD5C0] font-bold group-hover:bg-[#8C6D37] group-hover:text-white group-hover:border-[#8C6D37] transition-all flex items-center gap-1">
                  <span>ورود</span>
                  <ChevronLeft className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-[#8C6D37] transition-colors">دستیار بازاریابی AI</h4>
                <p className="text-[10px] text-stone-500 mt-0.5 truncate">کپشن تلگرام و روبیکا</p>
              </div>
            </button>

            {/* 9. Storefront */}
            <button
              type="button"
              onClick={() => onNavigate('storefront')}
              className="p-3.5 bg-[#FAF7F2] hover:bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#8C6D37] text-right transition-all group cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between gap-3 min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center justify-center transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-[#DDD5C0] font-bold group-hover:bg-[#8C6D37] group-hover:text-white group-hover:border-[#8C6D37] transition-all flex items-center gap-1">
                  <span>ورود</span>
                  <ChevronLeft className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-[#8C6D37] transition-colors">ویترین و تنظیمات سایت</h4>
                <p className="text-[10px] text-stone-500 mt-0.5 truncate">بنرها، قیمت خرد و آفرها</p>
              </div>
            </button>

            {/* 10. Super Admin Roles */}
            <button
              type="button"
              onClick={() => onNavigate('roles')}
              className="p-3.5 bg-gradient-to-br from-[#18181B] to-stone-900 text-[#FAF7F2] rounded-2xl border border-stone-800 hover:border-[#D4AF37]/60 text-right transition-all group cursor-pointer shadow-sm flex flex-col justify-between gap-3 min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-[#27272A] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-[#27272A] text-[#D4AF37] px-2 py-0.5 rounded-md border border-[#D4AF37]/40 font-bold group-hover:bg-[#D4AF37] group-hover:text-[#18181B] transition-all flex items-center gap-1">
                  <span>روت</span>
                  <ChevronLeft className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors">امنیت سوپر ادمین</h4>
                <p className="text-[10px] text-stone-300 mt-0.5 truncate">دسترسی روت و پشتیبان‌گیری</p>
              </div>
            </button>
          </div>
        </section>

        {/* Quick Operational Command Deck for Bazaar Daily Work */}
        <section className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6DEC8]/80">
            <div>
              <h3 className="text-base font-black text-[#18181B] flex items-center gap-2">
                <span>میز کار سریع بازار (عملیات پرتکرار)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  دسترسـی فوری
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                اقدامات اصلی روزمره را در کمترین زمان و بدون جستجو در منوها انجام دهید
              </p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2.5">
            
            <button
              type="button"
              id="dash-btn-new-invoice"
              onClick={onOpenNewInvoiceModal}
              className="p-3 bg-[#FAF7F2] hover:bg-[#18181B] text-stone-900 hover:text-[#FAF7F2] rounded-2xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-2xs hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-[#27272A] border border-[#DDD5C0] group-hover:border-[#3F3F46] flex items-center justify-center transition-colors">
                <FileText className="w-4 h-4 text-[#8C6D37] group-hover:text-[#D4AF37]" />
              </div>
              <span className="font-black text-xs">صدور فاکتور</span>
              <span className="text-[9.5px] text-stone-500 group-hover:text-stone-400 font-normal">تسویه نقدی/چکی</span>
            </button>

            <button
              type="button"
              id="dash-btn-new-product"
              onClick={onOpenNewProductModal}
              className="p-3 bg-[#FAF7F2] hover:bg-[#18181B] text-stone-900 hover:text-[#FAF7F2] rounded-2xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-2xs hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-[#27272A] border border-[#DDD5C0] group-hover:border-[#3F3F46] flex items-center justify-center transition-colors">
                <Package className="w-4 h-4 text-[#8C6D37] group-hover:text-[#D4AF37]" />
              </div>
              <span className="font-black text-xs">ثبت مدل جدید</span>
              <span className="text-[9.5px] text-stone-500 group-hover:text-stone-400 font-normal">پک‌بندی و بها</span>
            </button>

            <button
              type="button"
              id="dash-btn-bulk-price"
              onClick={onOpenBulkPriceModal}
              className="p-3 bg-[#FAF7F2] hover:bg-[#18181B] text-stone-900 hover:text-[#FAF7F2] rounded-2xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-2xs hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-[#27272A] border border-[#DDD5C0] group-hover:border-[#3F3F46] flex items-center justify-center transition-colors">
                <Percent className="w-4 h-4 text-[#8C6D37] group-hover:text-[#D4AF37]" />
              </div>
              <span className="font-black text-xs">تغییر درصدی قیمت</span>
              <span className="text-[9.5px] text-stone-500 group-hover:text-stone-400 font-normal">نوسان پارچه</span>
            </button>

            <button
              type="button"
              id="dash-btn-production"
              onClick={() => onNavigate('production')}
              className="p-3 bg-[#FAF7F2] hover:bg-[#18181B] text-stone-900 hover:text-[#FAF7F2] rounded-2xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-2xs hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-[#27272A] border border-[#DDD5C0] group-hover:border-[#3F3F46] flex items-center justify-center transition-colors">
                <Scissors className="w-4 h-4 text-[#8C6D37] group-hover:text-[#D4AF37]" />
              </div>
              <span className="font-black text-xs">پارت کارگاه دوخت</span>
              <span className="text-[9.5px] text-stone-500 group-hover:text-stone-400 font-normal">دوزندگان و پارچه</span>
            </button>

            <button
              type="button"
              id="dash-btn-finance"
              onClick={() => onNavigate('finance')}
              className="p-3 bg-[#FAF7F2] hover:bg-[#18181B] text-stone-900 hover:text-[#FAF7F2] rounded-2xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-2xs hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-[#27272A] border border-[#DDD5C0] group-hover:border-[#3F3F46] flex items-center justify-center transition-colors">
                <CreditCard className="w-4 h-4 text-[#8C6D37] group-hover:text-[#D4AF37]" />
              </div>
              <span className="font-black text-xs">چک‌های صیادی</span>
              <span className="text-[9.5px] text-stone-500 group-hover:text-stone-400 font-normal">پیگیری سررسید</span>
            </button>

            <button
              type="button"
              id="dash-btn-ai-marketing"
              onClick={() => onNavigate('marketing')}
              className="p-3 bg-[#FAF7F2] hover:bg-[#18181B] text-stone-900 hover:text-[#FAF7F2] rounded-2xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-2xs hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-[#27272A] border border-[#DDD5C0] group-hover:border-[#3F3F46] flex items-center justify-center transition-colors">
                <Sparkles className="w-4 h-4 text-[#8C6D37] group-hover:text-[#D4AF37]" />
              </div>
              <span className="font-black text-xs">کپشن‌نویسی هوشمند</span>
              <span className="text-[9.5px] text-stone-500 group-hover:text-stone-400 font-normal">تلگرام و روبیکا</span>
            </button>

          </div>
        </section>

        {/* TOP WIDGET: Today's Priorities Checklist */}
        <section className="bg-white rounded-2xl p-6 border border-[#E6DEC8] shadow-xs relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E6DEC8]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#18181B] text-[#D4AF37]">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#18181B] flex items-center gap-2">
                  <span>کارهای امروز حجره (اولویت‌های فوری)</span>
                  <span className="text-xs font-bold bg-[#FAF7F2] text-[#8C6D37] px-2.5 py-0.5 rounded-full border border-[#DDD5C0]">
                    {completedCount} از {totalPrioritiesCount} انجام شده
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  لیست تجمیعی چک‌های نزدیک، هشدارهای انبار، پیگیری مشتریان و کارگاه‌های دوزندگی
                </p>
              </div>
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={() => setDismissedItemIds([])}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>بازنشانی چک‌لیست</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {priorityItems.map((item) => {
              const isDismissed = dismissedItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                    isDismissed
                      ? 'bg-stone-50/80 border-stone-200 opacity-60'
                      : 'bg-[#FAF7F2] border-[#E6DEC8] hover:border-[#18181B] shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badgeText}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => toggleDismissItem(item.id)}
                        className={`text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                          isDismissed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-white hover:bg-stone-200 text-stone-600 border border-stone-300'
                        }`}
                        title={isDismissed ? 'در انتظار' : 'رسیدگی شد'}
                      >
                        {isDismissed ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>امروز رسیدگی شد</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-3.5 h-3.5 text-stone-400" />
                            <span>رسیدگی شد</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h3 className={`text-sm font-black text-stone-900 ${isDismissed ? 'line-through text-stone-400' : ''}`}>
                      {item.title}
                    </h3>
                    <p className={`text-[11px] text-stone-600 mt-1 leading-relaxed ${isDismissed ? 'text-stone-400' : ''}`}>
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#DDD5C0]/60 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => onNavigate(item.targetTab)}
                      className="text-xs bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Key Metric Numbers Cards */}
        <section className="grid grid-cols-4 gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#18181B] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8C6D37] font-bold">فروش کل ماه جاری</span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#8C6D37]" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#18181B] font-mono">{formatMoney(estimatedMonthlySales)}</span>
              <span className="text-xs text-stone-500 font-medium">تومان</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-800 font-bold flex items-center gap-1">
              <span>+۲۲٪ رشد نسبت به ماه گذشته</span>
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#18181B] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8C6D37] font-bold">موجودی پک‌های انبار</span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] flex items-center justify-center">
                <Package className="w-4 h-4 text-[#8C6D37]" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#18181B]">{totalPacksInStock}</span>
              <span className="text-xs text-stone-500 font-medium">پک آماده</span>
            </div>
            <p className="mt-1 text-[11px] text-stone-500">
              معادل {totalUnitsInStock.toLocaleString('fa-IR')} عدد شلوار زنانه
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#18181B] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8C6D37] font-bold">چک‌های صیادی در جریان</span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[#8C6D37]" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#18181B] font-mono">
                {isPrivacyMode ? '••••••' : (totalPendingChecksAmount / 1000000).toFixed(1)}
              </span>
              <span className="text-xs text-stone-500 font-medium">میلیون تومان</span>
            </div>
            <p className="mt-1 text-[11px] text-amber-800 font-bold">
              {pendingChecks.length} فقره چک صیادی بنفش
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#18181B] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8C6D37] font-bold">مشتریان و همکاران فعال</span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] flex items-center justify-center">
                <Users className="w-4 h-4 text-[#8C6D37]" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#18181B]">{customers.length}</span>
              <span className="text-xs text-stone-500 font-medium">حساب همکار</span>
            </div>
            <p className="mt-1 text-[11px] text-stone-500">
              پوشش در سراسر شهرستان‌ها
            </p>
          </div>

        </section>

        {/* Charts: Weekly Sales & Category Distribution */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div>
                <h3 className="text-base font-black text-[#18181B]">
                  تفکیک فروش نقدی و چکی (هفته اخیر)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  کنترل نقدینگی صندوق در مقابل چک‌های مدت‌دار همکاران
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#18181B]" />
                  <span>فروش نقدی</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#D4AF37]" />
                  <span>چک صیادی</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesWeeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false} />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                  <Tooltip 
                    formatter={(val: any) => [`${Number(val).toLocaleString('fa-IR')} تومان`]}
                    contentStyle={{ backgroundColor: '#18181b', color: '#faf7f2', borderRadius: '12px', border: '1px solid #3f3f46', fontSize: '11px' }}
                  />
                  <Bar dataKey="cashSales" name="نقدی" fill="#18181B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="checkSales" name="چکی" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#E6DEC8]">
              <h3 className="text-base font-black text-[#18181B]">
                پرفروش‌ترین دسته‌بندی‌ها
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                سهم فروش در راسته بازار بزرگ
              </p>
            </div>

            <div className="h-44 w-full relative" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`${val}٪`]}
                    contentStyle={{ backgroundColor: '#18181b', color: '#faf7f2', borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-black text-[#18181B]">۱۰۰٪</span>
                <span className="text-[10px] text-stone-400">توزیع مدل‌ها</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-stone-700">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                  </span>
                  <strong className="font-black text-[#18181B]">{cat.value}٪</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
