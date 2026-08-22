import React from 'react';
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
  Crown
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
import { Product, Customer, CheckItem, Invoice, ModuleTab } from '../types';

interface DashboardViewProps {
  products: Product[];
  customers: Customer[];
  checks: CheckItem[];
  invoices: Invoice[];
  onNavigate: (tab: ModuleTab) => void;
  onOpenBulkPriceModal: () => void;
  onOpenNewProductModal: () => void;
  onOpenNewInvoiceModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  customers,
  checks,
  invoices,
  onNavigate,
  onOpenBulkPriceModal,
  onOpenNewProductModal,
  onOpenNewInvoiceModal,
}) => {
  // Calculations
  const totalPacksInStock = products.reduce((acc, p) => acc + p.packStock, 0);
  const totalUnitsInStock = products.reduce((acc, p) => acc + (p.packStock * p.packSize) + p.singleStock, 0);
  
  const pendingChecks = checks.filter(c => c.status === 'pending' || c.status === 'in_collection');
  const totalPendingChecksAmount = pendingChecks.reduce((acc, c) => acc + c.amountToman, 0);
  
  const lowStockProducts = products.filter(p => p.packStock <= p.minPackStockAlert);

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
    <div id="dashboard-view-container" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner: Today's Priorities / اولویت‌های فوری امروز */}
      <section className="bg-[#18181B] text-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#3F3F46] shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#27272A] text-[#D4AF37] border border-[#3F3F46]">
                <Crown className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#FAF7F2]">
                  میز کار مدیریت مرکزی (سوپر ادمین)
                </h2>
                <p className="text-xs text-[#E6DEC8]/80">
                  اولویت‌های امروز بازار، وضعیت چک‌های صیادی و گردش موجودی انبار
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#27272A] text-[#D4AF37] px-3.5 py-1 rounded-full border border-[#3F3F46] font-bold">
                وضعیت: فعال و یکپارچه
              </span>
            </div>
          </div>

          {/* Priority Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
            
            {/* Priority 1: Upcoming Check */}
            <div className="bg-[#27272A]/80 rounded-xl p-3.5 border border-[#3F3F46] hover:border-[#D4AF37] transition-all">
              <div className="flex items-center justify-between text-xs text-[#D4AF37] mb-1.5 font-bold">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  سررسید چک (۳ روز دیگر)
                </span>
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">فوری</span>
              </div>
              <p className="text-sm font-black text-white">۲۸,۵۰۰,۰۰۰ تومان</p>
              <p className="text-[11px] text-stone-300 truncate mt-0.5">حاج داوود محمدی (پخش اصفهان)</p>
              <button
                onClick={() => onNavigate('finance')}
                className="mt-2.5 w-full text-right text-[11px] bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] font-black px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>مشاهده صیادی و وصول</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Priority 2: Low Stock Warning */}
            <div className="bg-[#27272A]/80 rounded-xl p-3.5 border border-[#3F3F46] hover:border-[#D4AF37] transition-all">
              <div className="flex items-center justify-between text-xs text-[#D4AF37] mb-1.5 font-bold">
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  کسری موجودی انبار
                </span>
                <span className="bg-amber-400 text-stone-950 text-[10px] px-1.5 py-0.2 rounded font-bold">۳ پک</span>
              </div>
              <p className="text-sm font-black text-white">جاگر ابروبادی زنانه</p>
              <p className="text-[11px] text-stone-300 truncate mt-0.5">فقط ۳ پک ۶ تایی مانده در انبار</p>
              <button
                onClick={() => onNavigate('inventory')}
                className="mt-2.5 w-full text-right text-[11px] bg-white/10 hover:bg-white/20 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between border border-white/10"
              >
                <span>هماهنگی دوخت کارگاه</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Priority 3: Customer Follow-up CRM */}
            <div className="bg-[#27272A]/80 rounded-xl p-3.5 border border-[#3F3F46] hover:border-[#D4AF37] transition-all">
              <div className="flex items-center justify-between text-xs text-[#D4AF37] mb-1.5 font-bold">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  پیگیری همکاران عمده
                </span>
                <span className="bg-[#B89B58] text-[#18181B] text-[10px] px-1.5 py-0.2 rounded font-black">۲ همکار</span>
              </div>
              <p className="text-sm font-black text-white">ارسال کاتالوگ مدل‌های جدید</p>
              <p className="text-[11px] text-stone-300 truncate mt-0.5">خانم نوری (مشهد) و اصغر شریفی</p>
              <button
                onClick={() => onNavigate('crm')}
                className="mt-2.5 w-full text-right text-[11px] bg-white/10 hover:bg-white/20 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between border border-white/10"
              >
                <span>ارسال پیام تلگرام / واتساپ</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Priority 4: Scheduled Multi-Channel Post */}
            <div className="bg-[#27272A]/80 rounded-xl p-3.5 border border-[#3F3F46] hover:border-[#D4AF37] transition-all">
              <div className="flex items-center justify-between text-xs text-[#D4AF37] mb-1.5 font-bold">
                <span className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  انتشار خودکار کانال‌ها
                </span>
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">۱۷:۰۰</span>
              </div>
              <p className="text-sm font-black text-white truncate">شلوار بگ کتان لایت</p>
              <p className="text-[11px] text-stone-300 truncate mt-0.5">ارسال همزمان به تلگرام، روبیکا و ایتا</p>
              <button
                onClick={() => onNavigate('marketing')}
                className="mt-2.5 w-full text-right text-[11px] bg-white/10 hover:bg-white/20 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between border border-white/10"
              >
                <span>کپشن Gemini هوش مصنوعی</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

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
            <span className="text-xs text-stone-500 font-medium">پک ({totalUnitsInStock} عدد)</span>
          </div>
          <p className="mt-1 text-[11px] text-[#8C6D37] font-medium">
            <span>{lowStockProducts.length} مدل نیازمند تجدید دوخت</span>
          </p>
        </div>

        {/* Metric 3: Pending Checks Amount */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#18181B] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C6D37] font-bold">چک‌های در جریان وصول</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#8C6D37]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#18181B]">
              {(totalPendingChecksAmount / 1000000).toFixed(1)}
            </span>
            <span className="text-xs text-stone-500 font-medium">میلیون تومان ({pendingChecks.length} فقره)</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-800 font-medium">
            <span>۱۰۰٪ ثبت شده در سامانه صیاد بنفش</span>
          </p>
        </div>

        {/* Metric 4: Active Customer Base */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#18181B] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C6D37] font-bold">مخاطبان و مشتریان فعال</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#8C6D37]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#18181B]">۶۱۸</span>
            <span className="text-xs text-stone-500 font-medium">مشتری</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500 font-medium">
            <span>کانال تلگرام، ایتا و همکاران سنتی</span>
          </p>
        </div>

      </section>

      {/* Quick Tooling Bar */}
      <section className="bg-white border border-[#E6DEC8] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#18181B]">ابزارهای پرکاربرد سوپر ادمین:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-dash-bulk-price"
            onClick={onOpenBulkPriceModal}
            className="text-xs bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] font-black px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Percent className="w-3.5 h-3.5" />
            <span>تغییر درصدی سریع قیمت‌ها</span>
          </button>

          <button
            id="btn-dash-new-invoice"
            onClick={onOpenNewInvoiceModal}
            className="text-xs bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>صدور فاکتور عمده بازاری</span>
          </button>

          <button
            id="btn-dash-ai-caption"
            onClick={() => onNavigate('marketing')}
            className="text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8]/60 text-[#18181B] border border-[#DDD5C0] font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8C6D37]" />
            <span>کپشن‌نویسی Gemini</span>
          </button>

          <button
            id="btn-dash-import-crm"
            onClick={() => onNavigate('crm')}
            className="text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8]/60 text-[#18181B] border border-[#DDD5C0] font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-[#8C6D37]" />
            <span>لیست مشتریان و اکسل</span>
          </button>
        </div>
      </section>

      {/* Analytics & Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Sales Trends (Cash vs Check) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-[#18181B]">روند فروش هفتگی (تفکیک نقدی و چکی)</h3>
              <p className="text-xs text-stone-500">کنترل جریان نقدینگی و سهم فروش چکی در بازار</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-stone-700">
                <span className="w-3 h-3 rounded bg-[#18181B] inline-block"></span>
                نقدی و واریز
              </span>
              <span className="flex items-center gap-1 text-stone-700">
                <span className="w-3 h-3 rounded bg-[#D4AF37] inline-block"></span>
                چک صیادی
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesWeeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6DEC8" />
                <XAxis dataKey="day" tick={{ fill: '#78716c', fontSize: 12 }} />
                <YAxis 
                  tickFormatter={(val) => `${val / 1000000}M`}
                  tick={{ fill: '#78716c', fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(val: any) => [`${Number(val).toLocaleString('fa-IR')} تومان`]}
                  labelStyle={{ textAlign: 'right', fontWeight: 'bold' }}
                  contentStyle={{ direction: 'rtl', borderRadius: '12px', border: '1px solid #DDD5C0', backgroundColor: '#FFFFFF' }}
                />
                <Bar dataKey="cashSales" name="فروش نقدی" fill="#18181B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="checkSales" name="فروش چکی" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Best Selling Categories Share */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-[#18181B]">سهم فروش دسته‌بندی‌ها</h3>
            <p className="text-xs text-stone-500">پرفروش‌ترین مدل‌های پوشاک زنانه</p>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`${val}٪ از کل فروش`]}
                  contentStyle={{ direction: 'rtl', borderRadius: '12px', border: '1px solid #DDD5C0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#E6DEC8] text-xs">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-stone-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span>{cat.name}</span>
                </span>
                <span className="font-bold text-[#18181B]">{cat.value}٪</span>
              </div>
            ))}
          </div>
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
