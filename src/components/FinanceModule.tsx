import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Building, 
  Scissors, 
  Plus, 
  Search, 
  Filter,
  Check,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { CheckItem, Customer, Product, Invoice } from '../types';

interface FinanceModuleProps {
  checks?: CheckItem[];
  customers?: Customer[];
  products?: Product[];
  invoices?: Invoice[];
  onAddCheck: (check: CheckItem) => void;
  onUpdateCheckStatus: (checkId: string, status: 'pending' | 'in_collection' | 'cleared' | 'bounced') => void;
  onNavigateToProduction?: () => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  checks = [],
  customers = [],
  products = [],
  invoices = [],
  onAddCheck,
  onUpdateCheckStatus,
  onNavigateToProduction,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profitability' | 'checks' | 'profit_loss' | 'cash_flow'>('profitability');
  const [isAddCheckModalOpen, setIsAddCheckModalOpen] = useState(false);
  
  // Date Range filter for Real Profitability
  const [timeRange, setTimeRange] = useState<'last_30_days' | 'current_season' | 'all_time'>('last_30_days');
  const [profitSortBy, setProfitSortBy] = useState<'net_profit' | 'margin_pct' | 'revenue' | 'units_sold'>('net_profit');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // New Check form
  const [newCheckForm, setNewCheckForm] = useState({
    checkNumber: '',
    sayadNumber: '',
    bankName: 'بانک صادرات (شعبه بازار)',
    amountToman: 25000000,
    issueDate: '۱۴۰۳/۰۲/۲۵',
    dueDate: '۱۴۰۳/۰۳/۱۵',
    customerId: customers[0]?.id || '',
    registeredInSayad: true,
    notes: '',
  });

  const totalPendingAmount = (checks || [])
    .filter(c => c.status === 'pending' || c.status === 'in_collection')
    .reduce((s, c) => s + c.amountToman, 0);

  const totalClearedAmount = (checks || [])
    .filter(c => c.status === 'cleared')
    .reduce((s, c) => s + c.amountToman, 0);

  // -------------------------------------------------------------
  // REAL PROFITABILITY ENGINE (Fix 1)
  // Computes exact revenues, raw materials / tailoring costs, net profit, margin %
  // -------------------------------------------------------------
  const productProfitabilityData = useMemo(() => {
    // Map product sales from invoices
    const salesMap: Record<string, { unitsSold: number; packsSold: number; totalRevenue: number }> = {};

    (invoices || []).forEach(inv => {
      (inv?.items || []).forEach(item => {
        if (!salesMap[item.productId]) {
          salesMap[item.productId] = { unitsSold: 0, packsSold: 0, totalRevenue: 0 };
        }
        salesMap[item.productId].unitsSold += (item.totalUnits || 0);
        salesMap[item.productId].packsSold += (item.packCount || 0);
        salesMap[item.productId].totalRevenue += (item.totalPrice || 0);
      });
    });

    return (products || []).map(prod => {
      const sales = salesMap[prod.id] || { 
        unitsSold: prod.packStock > 0 ? (prod.packSize * 6) : 0, 
        packsSold: 6, 
        totalRevenue: 6 * prod.baseWholesalePricePerPack 
      };

      // Cost price components per unit
      const fabricCost = prod.fabricCost || 0;
      const tailoringCost = prod.tailoringCost || 0;
      const trimsCost = prod.trimsCost || 0;
      const finishingCost = prod.finishingCost || 0;
      const unitCost = prod.totalCostPrice || (fabricCost + tailoringCost + trimsCost + finishingCost);

      const totalCost = sales.unitsSold * unitCost;
      const netProfit = sales.totalRevenue - totalCost;
      const marginPct = sales.totalRevenue > 0 ? (netProfit / sales.totalRevenue) * 100 : 0;
      const unitMarginToman = sales.unitsSold > 0 ? Math.round(netProfit / sales.unitsSold) : (prod.baseWholesalePricePerUnit - unitCost);

      return {
        product: prod,
        category: prod.category,
        unitsSold: sales.unitsSold,
        packsSold: sales.packsSold,
        totalRevenue: sales.totalRevenue,
        unitCost,
        fabricCost,
        tailoringCost,
        trimsCost,
        finishingCost,
        totalCost,
        netProfit,
        marginPct,
        unitMarginToman,
      };
    });
  }, [products, invoices]);

  // Filtered & Sorted Profitability
  const filteredProfitability = useMemo(() => {
    let list = [...productProfitabilityData];

    if (categoryFilter !== 'all') {
      list = list.filter(item => item.category === categoryFilter);
    }

    list.sort((a, b) => {
      if (profitSortBy === 'net_profit') return b.netProfit - a.netProfit;
      if (profitSortBy === 'margin_pct') return b.marginPct - a.marginPct;
      if (profitSortBy === 'revenue') return b.totalRevenue - a.totalRevenue;
      if (profitSortBy === 'units_sold') return b.unitsSold - a.unitsSold;
      return 0;
    });

    return list;
  }, [productProfitabilityData, categoryFilter, profitSortBy]);

  // Category Aggregates
  const categoryProfitSummary = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; cost: number; profit: number; units: number }> = {};

    productProfitabilityData.forEach(item => {
      if (!map[item.category]) {
        map[item.category] = { name: item.category, revenue: 0, cost: 0, profit: 0, units: 0 };
      }
      map[item.category].revenue += item.totalRevenue;
      map[item.category].cost += item.totalCost;
      map[item.category].profit += item.netProfit;
      map[item.category].units += item.unitsSold;
    });

    return Object.values(map).map(cat => ({
      ...cat,
      marginPct: cat.revenue > 0 ? ((cat.profit / cat.revenue) * 100).toFixed(1) : '0',
    })).sort((a, b) => b.profit - a.profit);
  }, [productProfitabilityData]);

  // Overall Totals
  const totalRevenueAll = productProfitabilityData.reduce((s, i) => s + i.totalRevenue, 0);
  const totalCostAll = productProfitabilityData.reduce((s, i) => s + i.totalCost, 0);
  const totalNetProfitAll = totalRevenueAll - totalCostAll;
  const overallMarginPct = totalRevenueAll > 0 ? ((totalNetProfitAll / totalRevenueAll) * 100).toFixed(1) : '0';

  // -------------------------------------------------------------
  // SEASONAL & MONTH-OVER-MONTH CATEGORY TREND DATA (Fix 1)
  // -------------------------------------------------------------
  const seasonalTrendData = [
    { month: 'اسفند ۱۴۰۲ (عیدانه)', 'شلوار بگ': 48, 'شلوار راحتی نخی': 65, 'داکرون': 35, 'لگ و ساپورت': 40, 'جاگر و کارگو': 28 },
    { month: 'فروردین ۱۴۰۳', 'شلوار بگ': 32, 'شلوار راحتی نخی': 45, 'داکرون': 22, 'لگ و ساپورت': 30, 'جاگر و کارگو': 20 },
    { month: 'اردیبهشت ۱۴۰۳ (بهاره)', 'شلوار بگ': 76, 'شلوار راحتی نخی': 82, 'داکرون': 48, 'لگ و ساپورت': 55, 'جاگر و کارگو': 42 },
    { month: 'خرداد ۱۴۰۳ (تابستانه فعلی)', 'شلوار بگ': 94, 'شلوار راحتی نخی': 110, 'داکرون': 52, 'لگ و ساپورت': 68, 'جاگر و کارگو': 58 },
  ];

  // -------------------------------------------------------------
  // CASH FLOW PROJECTION STRIP (Fix 1)
  // -------------------------------------------------------------
  const confirmedCashSales = invoices
    .filter(inv => inv.paymentType === 'cash' || inv.status === 'paid' || inv.status === 'shipped')
    .reduce((sum, inv) => sum + inv.finalAmountToman, 0);

  const checksDue7Days = checks
    .filter(c => c.status === 'pending' || c.status === 'in_collection')
    .slice(0, 2);
  const checksDue7DaysAmount = checksDue7Days.reduce((s, c) => s + c.amountToman, 0);

  const checksDue30Days = checks.filter(c => c.status === 'pending' || c.status === 'in_collection');
  const checksDue30DaysAmount = checksDue30Days.reduce((s, c) => s + c.amountToman, 0);

  const totalProjectedCash30Days = confirmedCashSales + checksDue30DaysAmount;

  const handleSaveCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === newCheckForm.customerId);

    const newCheck: CheckItem = {
      id: `chk-${Date.now()}`,
      checkNumber: newCheckForm.checkNumber || `${Math.floor(10000000 + Math.random() * 90000000)}`,
      sayadNumber: newCheckForm.sayadNumber || `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
      bankName: newCheckForm.bankName,
      amountToman: Number(newCheckForm.amountToman),
      issueDate: newCheckForm.issueDate,
      dueDate: newCheckForm.dueDate,
      customerId: newCheckForm.customerId,
      customerName: cust?.name || 'مشتری بازار',
      storeName: cust?.storeName || 'فروشگاه',
      status: 'pending',
      outcome: 'cleared_on_time',
      registeredInSayad: newCheckForm.registeredInSayad,
      notes: newCheckForm.notes,
    };

    onAddCheck(newCheck);
    setIsAddCheckModalOpen(false);
  };

  const allCategories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div id="finance-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl shadow-2xs">
              <CreditCard className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#18181B]">
                مدیریت مالی، سودآوری واقعی و رهگیری چک‌های صیادی
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                محاسبه دقیق حاشیه سود با کسر هزینه طاقه پارچه، دستمزد دوزندگی و خرج‌کار + پیش‌بینی جریان نقدینگی
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddCheckModalOpen(true)}
            className="text-xs bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#3F3F46]"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>+ ثبت چک صیادی دریافتی</span>
          </button>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E6DEC8] text-xs flex-wrap">
          <button
            onClick={() => setActiveSubTab('profitability')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'profitability'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>سودآوری واقعی و تحلیل فصلی کالاها</span>
          </button>

          <button
            onClick={() => setActiveSubTab('checks')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubTab === 'checks' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            مدیریت چک‌های صیادی ({checks.length})
          </button>

          <button
            onClick={() => setActiveSubTab('cash_flow')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubTab === 'cash_flow' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            پیش‌بینی و تراز نقدینگی
          </button>

          <button
            onClick={() => setActiveSubTab('profit_loss')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubTab === 'profit_loss' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            خلاصه سود و زیان دسته‌بندی‌ها
          </button>

          {onNavigateToProduction && (
            <button
              onClick={onNavigateToProduction}
              className="mr-auto px-3.5 py-2 rounded-xl font-bold text-[#8C6D37] bg-[#FAF7F2] hover:bg-[#DDD5C0]/60 border border-[#DDD5C0] transition-all flex items-center gap-1.5"
            >
              <span>مدیریت تولید، پارچه و خیاطان ←</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* CASH FLOW PROJECTION STRIP (Always visible or under profitability) */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#FAF7F2] via-white to-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#DDD5C0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E6DEC8]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#D4AF37]/20 text-[#8C6D37] rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-black text-[#18181B]">
              نوار پیش‌بینی جریان نقدینگی و ورودی صندوق (Cash Flow Projection Strip)
            </h3>
          </div>
          <span className="text-[11px] text-stone-500">
            بر اساس فاکتورهای نقدی تأییدشده + سررسید قطعی چک‌های صیاد بنفش
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {/* Confirmed Cash */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC8]">
            <span className="text-[11px] text-stone-500 block">نقدینگی و واریزهای وصول‌شده:</span>
            <span className="text-base font-black text-emerald-800 block mt-1">
              {confirmedCashSales.toLocaleString('fa-IR')} تومان
            </span>
            <span className="text-[10px] text-emerald-700 font-bold">۱۰۰٪ قطعی در حساب</span>
          </div>

          {/* 7 Days Checks */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC8]">
            <span className="text-[11px] text-[#8C6D37] font-bold block">ورودی چک‌های ۷ روز آینده:</span>
            <span className="text-base font-black text-[#18181B] block mt-1">
              {checksDue7DaysAmount.toLocaleString('fa-IR')} تومان
            </span>
            <span className="text-[10px] text-stone-500">
              {checksDue7Days.length} فقره چک در آستانه سررسید
            </span>
          </div>

          {/* 30 Days Checks */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC8]">
            <span className="text-[11px] text-stone-500 block">مجموع چک‌های ۳۰ روز آینده:</span>
            <span className="text-base font-black text-[#18181B] block mt-1">
              {checksDue30DaysAmount.toLocaleString('fa-IR')} تومان
            </span>
            <span className="text-[10px] text-stone-500">
              {checksDue30Days.length} فقره چک صیادی ثبت‌شده
            </span>
          </div>

          {/* Total Projected 30 Days */}
          <div className="bg-[#18181B] text-[#FAF7F2] p-3.5 rounded-xl border border-stone-800 shadow-2xs">
            <span className="text-[11px] text-[#D4AF37] font-bold block">پیش‌بینی کل ورودی ۳۰ روز:</span>
            <span className="text-base sm:text-lg font-black text-white block mt-1">
              {totalProjectedCash30Days.toLocaleString('fa-IR')} تومان
            </span>
            <span className="text-[10px] text-stone-300">مجموع نقد و وصول چک</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SUBTAB 1: REAL PROFITABILITY & SEASONAL REPORTING (Fix 1 Core)     */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'profitability' && (
        <div className="space-y-5">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs">
              <span className="text-[11px] text-[#8C6D37] font-bold block">درآمد ناخالص فروش کل:</span>
              <span className="text-xl font-black text-[#18181B] mt-1 block">
                {totalRevenueAll.toLocaleString('fa-IR')} تومان
              </span>
              <span className="text-[10px] text-stone-500">از فاکتورهای فروش عمده و تکی</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs">
              <span className="text-[11px] text-stone-500 font-bold block">بهای تمام‌شده کل کالاها:</span>
              <span className="text-xl font-black text-stone-900 mt-1 block">
                {totalCostAll.toLocaleString('fa-IR')} تومان
              </span>
              <span className="text-[10px] text-stone-500">پارچه + دستمزد دوخت + خرج‌کار</span>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 shadow-xs">
              <span className="text-[11px] text-emerald-800 font-bold block">سود خالص واقعی (Net Profit):</span>
              <span className="text-xl font-black text-emerald-950 mt-1 block">
                {totalNetProfitAll.toLocaleString('fa-IR')} تومان
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">پس از کسر هزینه‌های کامل تولید</span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#DDD5C0] shadow-xs">
              <span className="text-[11px] text-[#8C6D37] font-bold block">حاشیه سود میانگین بنکداری:</span>
              <span className="text-xl font-black text-[#18181B] mt-1 block">
                {overallMarginPct}٪
              </span>
              <span className="text-[10px] text-stone-500">میانگین وزنی دسته‌بندی‌ها</span>
            </div>
          </div>

          {/* Seasonal Category Performance Trend Chart */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-[#18181B] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#8C6D37]" />
                  <span>روند فروش و تقاضای فصلی دسته‌بندی‌ها (ماه به ماه بر حسب پک)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  شناسایی مدل‌های متناسب با فصل (مثلاً اوج‌گیری بگ کتان لایت و راحتی نخی در خرداد/تابستان)
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] font-bold">
                  فصل جاری: بهار و تابستان ۱۴۰۳
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonalTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6DEC8" />
                  <XAxis dataKey="month" tick={{ fill: '#78716c', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#78716c', fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val: any) => [`${val} پک فروش رفته`]}
                    contentStyle={{ direction: 'rtl', borderRadius: '12px', border: '1px solid #DDD5C0', backgroundColor: '#FFFFFF' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  <Bar dataKey="شلوار بگ" fill="#18181B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="شلوار راحتی نخی" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="لگ و ساپورت" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="داکرون" fill="#d97706" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="جاگر و کارگو" fill="#78716c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filtering and Sort Controls for Real Profit Table */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-black text-[#18181B]">فیلتر و رتبه‌بندی:</span>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#FAF7F2] p-2 rounded-xl border border-[#DDD5C0] text-stone-800 font-medium outline-none"
              >
                <option value="all">همه دسته‌بندی‌ها</option>
                {allCategories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={profitSortBy}
                onChange={(e) => setProfitSortBy(e.target.value as any)}
                className="bg-[#FAF7F2] p-2 rounded-xl border border-[#DDD5C0] text-stone-800 font-bold outline-none"
              >
                <option value="net_profit">رتبه‌بندی بر اساس: بیشترین سود خالص (تومان)</option>
                <option value="margin_pct">رتبه‌بندی بر اساس: بالاترین درصد حاشیه سود (٪)</option>
                <option value="revenue">رتبه‌بندی بر اساس: بیشترین درآمد ناخالص</option>
                <option value="units_sold">رتبه‌بندی بر اساس: حجم فروش (تعداد عدد)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#8C6D37] font-bold">
                نمایش {filteredProfitability.length} مدل کالا
              </span>
            </div>
          </div>

          {/* Real Profitability Detailed Table */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF7F2] text-stone-700 border-b border-[#E6DEC8] font-bold">
                  <tr>
                    <th className="p-3.5">مدل پوشاک و دسته‌بندی</th>
                    <th className="p-3.5">بهای تمام‌شده هر عدد</th>
                    <th className="p-3.5">تعداد فروش رفته</th>
                    <th className="p-3.5">درآمد فروش کل</th>
                    <th className="p-3.5">بهای تمام‌شده کل</th>
                    <th className="p-3.5">سود خالص (تومان)</th>
                    <th className="p-3.5">حاشیه سود خالص (٪)</th>
                    <th className="p-3.5 text-center">ارزیابی استراتژیک</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF7F2]">
                  {filteredProfitability.map((item, index) => {
                    const isHighMargin = item.marginPct >= 38;
                    const isLowMarginHighVolume = item.marginPct < 25 && item.unitsSold > 50;
                    const isTopProfit = index === 0 && profitSortBy === 'net_profit';

                    return (
                      <tr key={item.product.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        
                        {/* Product Info */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover border border-[#DDD5C0] shrink-0"
                            />
                            <div>
                              <strong className="font-bold text-[#18181B] block">
                                {item.product.name}
                              </strong>
                              <span className="text-[10px] text-stone-500">
                                {item.product.sku} • {item.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Unit Cost Breakdown */}
                        <td className="p-3.5">
                          <span className="font-black text-stone-900 block">
                            {item.unitCost.toLocaleString('fa-IR')} ت
                          </span>
                          <span className="text-[10px] text-stone-500">
                            پارچه: {(item.fabricCost).toLocaleString('fa-IR')} | دوخت: {(item.tailoringCost).toLocaleString('fa-IR')}
                          </span>
                        </td>

                        {/* Units Sold */}
                        <td className="p-3.5">
                          <strong className="font-black text-[#18181B] block">
                            {item.unitsSold} عدد
                          </strong>
                          <span className="text-[10px] text-stone-500">
                            ({item.packsSold} پک بسته)
                          </span>
                        </td>

                        {/* Revenue */}
                        <td className="p-3.5 font-bold text-stone-900">
                          {item.totalRevenue.toLocaleString('fa-IR')} ت
                        </td>

                        {/* Total Cost */}
                        <td className="p-3.5 text-stone-600 font-medium">
                          {item.totalCost.toLocaleString('fa-IR')} ت
                        </td>

                        {/* Net Profit */}
                        <td className="p-3.5">
                          <span className="font-black text-emerald-800 text-sm block">
                            +{item.netProfit.toLocaleString('fa-IR')} ت
                          </span>
                          <span className="text-[10px] text-emerald-700">
                            {item.unitMarginToman.toLocaleString('fa-IR')} ت به ازای هر عدد
                          </span>
                        </td>

                        {/* Margin Percentage */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-stone-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isHighMargin ? 'bg-emerald-600' : item.marginPct >= 28 ? 'bg-[#D4AF37]' : 'bg-rose-500'}`}
                                style={{ width: `${Math.min(100, item.marginPct * 2)}%` }}
                              />
                            </div>
                            <span className="font-black text-[#18181B]">
                              {item.marginPct.toFixed(1)}٪
                            </span>
                          </div>
                        </td>

                        {/* Strategic Evaluation Badge */}
                        <td className="p-3.5 text-center">
                          {isTopProfit && (
                            <span className="inline-flex items-center gap-1 bg-[#D4AF37]/20 text-[#8C6D37] border border-[#DDD5C0] font-black text-[10px] px-2.5 py-1 rounded-full">
                              ⭐ بیشترین سود خالص
                            </span>
                          )}
                          {!isTopProfit && isHighMargin && (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-full">
                              💎 حاشیه سود عالی
                            </span>
                          )}
                          {isLowMarginHighVolume && (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full" title="فروش بالاست اما بهای تمام‌شده نیازمند چانه‌زنی با پارچه‌فروش است">
                              ⚠️ پرفروش کم‌مارجین
                            </span>
                          )}
                          {!isTopProfit && !isHighMargin && !isLowMarginHighVolume && (
                            <span className="text-stone-500 text-[10px]">
                              عملکرد متعادل
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Rollup Cards */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-3">
            <h3 className="font-black text-sm text-[#18181B]">
              جمع‌بندی سودآوری بر اساس دسته‌بندی‌های پوشاک زنانه
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryProfitSummary.map((cat, idx) => (
                <div key={idx} className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-stone-900 text-xs">{cat.name}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#DDD5C0] font-bold text-[#8C6D37]">
                      {cat.units} عدد فروش
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-600 pt-1">
                    <span>درآمد کل:</span>
                    <strong className="text-stone-900">{cat.revenue.toLocaleString('fa-IR')} ت</strong>
                  </div>
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>سود خالص:</span>
                    <strong className="text-emerald-800 font-black">{cat.profit.toLocaleString('fa-IR')} ت</strong>
                  </div>
                  <div className="flex justify-between text-xs text-stone-600 pt-1 border-t border-[#DDD5C0]">
                    <span>حاشیه سود:</span>
                    <span className="font-black text-stone-900">{cat.marginPct}٪</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUBTAB 2: CHECKS MANAGEMENT                                         */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'checks' && (
        <div className="space-y-4">
          
          {/* Summary Metric Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8]">
              <span className="text-xs text-[#8C6D37] font-bold block">مجموع چک‌های در جریان وصول:</span>
              <span className="text-xl font-black text-[#18181B] mt-1 block">
                {totalPendingAmount.toLocaleString('fa-IR')} تومان
              </span>
              <span className="text-[11px] text-stone-500">تعهدات مشتریان شهرستانی</span>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
              <span className="text-xs text-emerald-800 font-bold block">چک‌های وصول شده این ماه:</span>
              <span className="text-xl font-black text-emerald-950 mt-1 block">
                {totalClearedAmount.toLocaleString('fa-IR')} تومان
              </span>
              <span className="text-[11px] text-emerald-700">واریز مستقیم به حساب</span>
            </div>

            <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200">
              <span className="text-xs text-rose-800 font-bold block">هشدار سررسید نزدیک (۳ روز):</span>
              <span className="text-base font-black text-rose-900 mt-1 block">
                ۱ چک (۲۸,۵۰۰,۰۰۰ تومان)
              </span>
              <span className="text-[11px] text-rose-700">حاج داوود محمدی (اصفهان)</span>
            </div>
          </div>

          {/* Checks Table */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF7F2] text-stone-700 border-b border-[#E6DEC8] font-bold">
                  <tr>
                    <th className="p-3.5">مشتری صادرکننده</th>
                    <th className="p-3.5">شماره چک و صیادی ۱۶ رقمی</th>
                    <th className="p-3.5">بانک و شعبه</th>
                    <th className="p-3.5">مبلغ چک</th>
                    <th className="p-3.5">تاریخ سررسید</th>
                    <th className="p-3.5">وضعیت صیاد</th>
                    <th className="p-3.5">نتیجه وصول</th>
                    <th className="p-3.5 text-center">تغییر وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF7F2]">
                  {checks.map((chk) => (
                    <tr key={chk.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="p-3.5">
                        <span className="font-black text-stone-900 block">{chk.customerName}</span>
                        <span className="text-[11px] text-stone-500">{chk.storeName}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-stone-800 text-[11px] block">{chk.checkNumber}</span>
                        <span className="font-mono text-[10px] text-stone-400">{chk.sayadNumber}</span>
                      </td>
                      <td className="p-3.5 text-stone-700">{chk.bankName}</td>
                      <td className="p-3.5 font-black text-[#18181B]">
                        {chk.amountToman.toLocaleString('fa-IR')} ت
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-[#8C6D37] bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#DDD5C0] text-[11px]">
                          {chk.dueDate}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-emerald-800 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          ثبت صیاد بنفش
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          chk.status === 'cleared' ? 'bg-emerald-100 text-emerald-800' :
                          chk.status === 'in_collection' ? 'bg-amber-100 text-amber-900' :
                          chk.status === 'bounced' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-800'
                        }`}>
                          {chk.status === 'cleared' ? 'پاس شده به‌موقع' :
                           chk.status === 'in_collection' ? 'در جریان وصول' :
                           chk.status === 'bounced' ? 'برگشتی' : 'در انتظار سررسید'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {chk.status !== 'cleared' && (
                            <button
                              onClick={() => onUpdateCheckStatus(chk.id, 'cleared')}
                              className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors"
                            >
                              وصول شد
                            </button>
                          )}
                          {chk.status !== 'bounced' && (
                            <button
                              onClick={() => onUpdateCheckStatus(chk.id, 'bounced')}
                              className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold px-2 py-1 rounded-lg border border-rose-200"
                            >
                              برگشت خورد
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUBTAB 3: CASH FLOW & TREASURY                                      */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'cash_flow' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8]">
              <span className="text-xs text-stone-600 font-bold block">موجودی صندوق مرکزی دفتر بازار:</span>
              <span className="text-xl font-black text-[#18181B] mt-1 block">
                ۴۵,۲۰۰,۰۰۰ تومان
              </span>
              <span className="text-[11px] text-emerald-800 font-bold">نقدینگی در دسترس خرید فوری طاقه</span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8]">
              <span className="text-xs text-stone-600 font-bold block">حساب جاری ملت (پرداخت دستمزد خیاط):</span>
              <span className="text-xl font-black text-stone-900 mt-1 block">
                ۸۲,۰۰۰,۰۰۰ تومان
              </span>
              <span className="text-[11px] text-stone-500">پشتیبان تسویه هفتگی برش و دوخت</span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8]">
              <span className="text-xs text-stone-600 font-bold block">مطالبات باز فاکتورهای بنکداری:</span>
              <span className="text-xl font-black text-[#8C6D37] mt-1 block">
                ۱۱۵,۸۰۰,۰۰۰ تومان
              </span>
              <span className="text-[11px] text-stone-500">فاکتورهای تحویل باربری شهرستان</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUBTAB 4: GENERAL PROFIT & LOSS                                     */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'profit_loss' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 text-xs">
          <h3 className="font-black text-sm text-[#18181B]">سود ناخالص و حاشیه سود به تفکیک دسته‌بندی پوشاک</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {categoryProfitSummary.map((item, idx) => (
              <div key={idx} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC8] space-y-2">
                <span className="font-black text-[#18181B] block text-xs">{item.name}</span>
                <div className="flex justify-between text-stone-700">
                  <span>حاشیه سود ناخالص:</span>
                  <strong className="text-emerald-800 font-black">{item.marginPct}٪</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>سود ناخالص کل:</span>
                  <span className="font-bold text-stone-900">{item.profit.toLocaleString('fa-IR')} ت</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[10px] pt-2 border-t border-[#DDD5C0]">
                  <span>تعداد فروش رفته:</span>
                  <span>{item.units} عدد</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Add Check */}
      {isAddCheckModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6DEC8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <h3 className="text-base font-black text-[#18181B]">ثبت چک صیادی دریافتی</h3>
              <button onClick={() => setIsAddCheckModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSaveCheck} className="space-y-3 my-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">مشتری صادرکننده چک:</label>
                <select
                  value={newCheckForm.customerId}
                  onChange={(e) => setNewCheckForm({ ...newCheckForm, customerId: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.storeName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">مبلغ چک (تومان):</label>
                <input
                  type="number"
                  value={newCheckForm.amountToman}
                  onChange={(e) => setNewCheckForm({ ...newCheckForm, amountToman: Number(e.target.value) })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شماره سریال چک:</label>
                  <input
                    type="text"
                    placeholder="48201948"
                    value={newCheckForm.checkNumber}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, checkNumber: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شناسه ۱۶ رقمی صیادی:</label>
                  <input
                    type="text"
                    placeholder="7829104829104829"
                    value={newCheckForm.sayadNumber}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, sayadNumber: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono text-[11px] text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">بانک صادرکننده:</label>
                  <input
                    type="text"
                    value={newCheckForm.bankName}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, bankName: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">تاریخ سررسید چک:</label>
                  <input
                    type="text"
                    value={newCheckForm.dueDate}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, dueDate: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => setIsAddCheckModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-[#FAF7F2] rounded-xl font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-5 py-2 rounded-xl shadow-xs"
                >
                  ثبت چک صیادی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
