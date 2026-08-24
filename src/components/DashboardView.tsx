import React, { useState } from 'react';
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
  Share2, 
  ShoppingBag,
  CheckCircle2,
  Crown,
  CheckSquare,
  Square,
  Clock,
  Scissors,
  Zap,
  Check,
  RotateCcw
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
  // State for dismissed / completed priority items for today (Fix 3)
  const [dismissedItemIds, setDismissedItemIds] = useState<string[]>([]);
  const [quickInputInline, setQuickInputInline] = useState('');

  const toggleDismissItem = (id: string) => {
    setDismissedItemIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Calculations
  const totalPacksInStock = products.reduce((acc, p) => acc + p.packStock, 0);
  const totalUnitsInStock = products.reduce((acc, p) => acc + (p.packStock * p.packSize) + p.singleStock, 0);
  
  const pendingChecks = checks.filter(c => c.status === 'pending' || c.status === 'in_collection');
  const totalPendingChecksAmount = pendingChecks.reduce((acc, c) => acc + c.amountToman, 0);
  
  const lowStockProducts = products.filter(p => p.packStock <= p.minPackStockAlert);

  // Dynamic Prioritized Items List for Today (Fix 3)
  interface PriorityItem {
    id: string;
    title: string;
    description: string;
    badgeText: string;
    badgeColor: string;
    category: 'check' | 'stock' | 'crm' | 'production' | 'marketing';
    targetTab: ModuleTab;
    actionLabel: string;
  }

  const priorityItems: PriorityItem[] = [
    // 1. Checks due soon
    ...checks.slice(0, 2).map((chk, idx) => ({
      id: `check-${chk.id || idx}`,
      title: `سررسید چک صیادی: ${chk.customerName}`,
      description: `مبلغ ${chk.amountToman.toLocaleString('fa-IR')} تومان • بانک ${chk.bankName} • سررسید: ${chk.dueDate}`,
      badgeText: 'سررسید چک',
      badgeColor: 'bg-rose-500 text-white',
      category: 'check' as const,
      targetTab: 'finance' as ModuleTab,
      actionLabel: 'مشاهده و ثبت وصولی',
    })),
    // 2. Low stock alert
    ...lowStockProducts.slice(0, 2).map((prod, idx) => ({
      id: `stock-${prod.id || idx}`,
      title: `کسری موجودی پک: ${prod.name}`,
      description: `فقط ${prod.packStock} پک باقی مانده (حداقل هشدار: ${prod.minPackStockAlert} پک)`,
      badgeText: 'کسری انبار',
      badgeColor: 'bg-amber-400 text-stone-950 font-bold',
      category: 'stock' as const,
      targetTab: 'inventory' as ModuleTab,
      actionLabel: 'هماهنگی پارت جدید',
    })),
    // 3. Customer follow-up
    ...customers.filter(c => c.followUpRequired).slice(0, 2).map((cust, idx) => ({
      id: `crm-${cust.id || idx}`,
      title: `پیگیری همکار بازار: ${cust.name} (${cust.storeName})`,
      description: `مشتری شهر ${cust.city} • بیش از ۳۰ روز بدون سفارش جدید • ارسال کاتالوگ جدید`,
      badgeText: 'پیگیری CRM',
      badgeColor: 'bg-[#B89B58] text-[#18181B] font-black',
      category: 'crm' as const,
      targetTab: 'crm' as ModuleTab,
      actionLabel: 'تماس / پیامک واتساپ',
    })),
    // 4. Production batch
    ...productionBatches.filter(b => b.status === 'cutting' || b.status === 'sewing').slice(0, 1).map((batch, idx) => ({
      id: `batch-${batch.id || idx}`,
      title: `پارت تولید در کارگاه: ${batch.batchCode} (${batch.modelName})`,
      description: `${batch.plannedPacks} پک (${batch.plannedUnits} عدد) در مرحله ${batch.status === 'cutting' ? 'برش' : 'خیاطی'} • تحویل: ${batch.estimatedDeliveryDate}`,
      badgeText: 'پارت تولید',
      badgeColor: 'bg-purple-600 text-white',
      category: 'production' as const,
      targetTab: 'production' as ModuleTab,
      actionLabel: 'پیگیری کارگاه خیاطی',
    })),
  ];

  const completedCount = priorityItems.filter(item => dismissedItemIds.includes(item.id)).length;
  const totalPrioritiesCount = priorityItems.length;

  // Sales Trend Mock Data
  const salesWeeklyData = [
    { day: 'شنبه', cashSales: 18500000, checkSales: 24500000 },
    { day: '۱شنبه', cashSales: 22000000, checkSales: 15000000 },
    { day: '۲شنبه', cashSales: 31000000, checkSales: 35000000 },
    { day: '۳شنبه', cashSales: 19500000, checkSales: 12000000 },
    { day: '۴شنبه', cashSales: 42000000, checkSales: 28500000 },
    { day: '۵شنبه', cashSales: 38000000, checkSales: 18000000 },
  ];

  // Category Distribution with signature luxury colors
  const categoryData = [
    { name: 'شلوار بگ', value: 38, color: '#18181B' },
    { name: 'شلوار راحتی نخی', value: 25, color: '#D4AF37' },
    { name: 'لگ و ساپورت', value: 18, color: '#8C6D37' },
    { name: 'داکرون اداری', value: 12, color: '#71717A' },
    { name: 'جاگر و کارگو', value: 7, color: '#E6DEC8' },
  ];

  return (
    <div id="dashboard-view-container" className="space-y-6 animate-in fade-in duration-200" dir="rtl">
      
      {/* Quick Natural Language Action Bar for Merchant (Fix 5 in Dashboard) */}
      {onOpenQuickEntry && (
        <section className="bg-gradient-to-r from-[#18181B] to-stone-900 text-[#FAF7F2] p-4 rounded-2xl border border-[#3F3F46] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#18181B] flex items-center justify-center font-black shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-[#FAF7F2] flex items-center gap-2">
                <span>ثبت سریع بازاری (با یک خط متن یا صوت)</span>
                <span className="bg-[#D4AF37] text-[#18181B] text-[10px] px-2 py-0.2 rounded-full font-bold">هوش مصنوعی</span>
              </h3>
              <p className="text-[11px] text-[#E6DEC8]/80 mt-0.5">
                مثال: «۲ پک شلوار بگ کتان لایت نقد فروختم به سارا احمدی»
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenQuickEntry}
            className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>باز کردن پنجره ثبت سریع</span>
          </button>
        </section>
      )}

      {/* TOP WIDGET: Today's Priorities Checklist / کارهای امروز (Fix 3) */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6DEC8] shadow-xs relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#E6DEC8]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#18181B] text-[#D4AF37]">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#18181B] flex items-center gap-2">
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

        {/* Actionable Today's Items Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      title={isDismissed ? 'علامت به عنوان در انتظار' : 'علامت به عنوان رسیدگی شد'}
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

                  <h3 className={`text-xs sm:text-sm font-black text-stone-900 ${isDismissed ? 'line-through text-stone-400' : ''}`}>
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
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Monthly Total Sales */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#18181B] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C6D37] font-bold">فروش کل ماه جاری</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#8C6D37]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#18181B]">۱۸۴,۵۰۰,۰۰۰</span>
            <span className="text-xs text-stone-500 font-medium">تومان</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-800 font-bold flex items-center gap-1">
            <span>+۲۲٪ رشد نسبت به ماه گذشته</span>
          </p>
        </div>

        {/* Metric 2: Inventory Pack Stock */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#18181B] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C6D37] font-bold">موجودی پک‌های انبار</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] flex items-center justify-center">
              <Package className="w-4 h-4 text-[#8C6D37]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#18181B]">{totalPacksInStock}</span>
            <span className="text-xs text-stone-500 font-medium">پک آماده</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500">
            معادل {totalUnitsInStock.toLocaleString('fa-IR')} عدد شلوار زنانه
          </p>
        </div>

        {/* Metric 3: Pending Checks Amount */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#18181B] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C6D37] font-bold">چک‌های صیادی در جریان</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#8C6D37]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#18181B]">
              {(totalPendingChecksAmount / 1000000).toFixed(1)}
            </span>
            <span className="text-xs text-stone-500 font-medium">میلیون تومان</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-800 font-bold">
            {pendingChecks.length} فقره چک صیادی بنفش
          </p>
        </div>

        {/* Metric 4: Active Wholesale Customers */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#18181B] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C6D37] font-bold">مشتریان و همکاران فعال</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#8C6D37]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#18181B]">{customers.length}</span>
            <span className="text-xs text-stone-500 font-medium">حساب همکار</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500">
            پوشش در سراسر شهرستان‌ها
          </p>
        </div>

      </section>

      {/* Charts & Quick Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Cash vs Check Sales Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#18181B]">
                تفکیک فروش نقدی و چکی (هفته اخیر)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                کنترل نقدینگی صندوق در مقابل چک‌های مدت‌دار همکاران
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#18181B]"></span>
                <span>فروش نقدی</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#D4AF37]"></span>
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

        {/* Category Share Donut Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#E6DEC8]">
            <h3 className="text-sm sm:text-base font-black text-[#18181B]">
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
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span>{cat.name}</span>
                </span>
                <strong className="font-black text-[#18181B]">{cat.value}٪</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fast Operational Shortcuts */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-black text-[#18181B]">
          دسترسی سریع به ابزارهای کلیدی مدیریت
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={onOpenNewInvoiceModal}
            className="p-3 bg-[#FAF7F2] hover:bg-stone-200 text-stone-900 rounded-xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center gap-2 transition-colors cursor-pointer"
          >
            <FileText className="w-5 h-5 text-[#8C6D37]" />
            <span>صدور فاکتور</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewProductModal}
            className="p-3 bg-[#FAF7F2] hover:bg-stone-200 text-stone-900 rounded-xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center gap-2 transition-colors cursor-pointer"
          >
            <Package className="w-5 h-5 text-[#8C6D37]" />
            <span>ثبت کالای جدید</span>
          </button>

          <button
            type="button"
            onClick={onOpenBulkPriceModal}
            className="p-3 bg-[#FAF7F2] hover:bg-stone-200 text-stone-900 rounded-xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center gap-2 transition-colors cursor-pointer"
          >
            <Percent className="w-5 h-5 text-[#8C6D37]" />
            <span>تغییر درصدی قیمت</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('production')}
            className="p-3 bg-[#FAF7F2] hover:bg-stone-200 text-stone-900 rounded-xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center gap-2 transition-colors cursor-pointer"
          >
            <Scissors className="w-5 h-5 text-[#8C6D37]" />
            <span>تولید و دوزندگان</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('marketing')}
            className="p-3 bg-[#FAF7F2] hover:bg-stone-200 text-stone-900 rounded-xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-[#8C6D37]" />
            <span>کپشن‌نویسی Gemini</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('roles')}
            className="p-3 bg-[#FAF7F2] hover:bg-stone-200 text-stone-900 rounded-xl border border-[#DDD5C0] font-bold text-xs flex flex-col items-center gap-2 transition-colors cursor-pointer"
          >
            <Crown className="w-5 h-5 text-[#8C6D37]" />
            <span>پشتیبان‌گیری و نقش‌ها</span>
          </button>
        </div>
      </section>

      {/* Logistics & Recent Invoices Quick Table */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
            <div>
              <h3 className="text-sm font-black text-[#18181B]">آخرین فاکتورهای عمده صادر شده</h3>
              <p className="text-xs text-stone-500">ارسال بار به شهرستان‌ها و تسویه</p>
            </div>
            <button
              onClick={() => onNavigate('sales')}
              className="text-xs text-[#8C6D37] font-bold hover:underline"
            >
              مشاهده همه
            </button>
          </div>

          <div className="divide-y divide-[#FAF7F2] mt-2">
            {invoices.slice(0, 3).map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-[#18181B]">{inv.customerName}</span>
                    <span className="text-[10px] bg-[#FAF7F2] text-stone-600 px-1.5 py-0.5 rounded-md font-mono border border-[#E6DEC8]">
                      {inv.invoiceNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {inv.items.length} ردیف کالا ({inv.items.reduce((s, i) => s + i.packCount, 0)} پک) • مقصد: {inv.city}
                  </p>
                </div>

                <div className="text-left">
                  <span className="font-black text-xs text-[#18181B] block">
                    {inv.finalAmountToman.toLocaleString('fa-IR')} ت
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 ${
                    inv.status === 'shipped' ? 'bg-emerald-100 text-emerald-800' :
                    inv.status === 'processing' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {inv.status === 'shipped' ? 'ارسال شده با باربری' :
                     inv.status === 'processing' ? 'در حال بسته‌بندی' : 'تسویه شده'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Multi-Messenger Channels Summary */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
            <div>
              <h3 className="text-sm font-black text-[#18181B]">وضعیت کانال‌های فروش و پاسخگویی</h3>
              <p className="text-xs text-stone-500">اتصال ربات و کانال‌های فروش عمده</p>
            </div>
            <button
              onClick={() => onNavigate('marketing')}
              className="text-xs text-[#8C6D37] font-bold hover:underline"
            >
              مدیریت کانال‌ها
            </button>
          </div>

          <div className="space-y-3 mt-3">
            
            <div className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold text-[11px]">
                  تل
                </span>
                <div>
                  <p className="font-bold text-[#18181B]">کانال اصلی تلگرام عمده</p>
                  <p className="text-[10px] text-stone-500">۶۱۸ عضو • آخرین پست ۲ ساعت پیش</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#18181B] bg-white px-2 py-0.5 rounded-lg border border-[#DDD5C0]">
                پست بعدی ۱۷:۰۰
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold text-[11px]">
                  رو
                </span>
                <div>
                  <p className="font-bold text-[#18181B]">کانال روبیکا پوشاک زنانه</p>
                  <p className="text-[10px] text-stone-500">۳۴۰ دنبال‌کننده • پاسخگوی خودکار فعال</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">
                اتصال پایدار
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold text-[11px]">
                  ای
                </span>
                <div>
                  <p className="font-bold text-[#18181B]">کانال ایتا عمده‌فروشی</p>
                  <p className="text-[10px] text-stone-500">۲۸۵ مشتری شهرستانی • پاسخ سریع</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">
                اتصال پایدار
              </span>
            </div>

          </div>
        </div>

      </section>

    </div>
  );
};
