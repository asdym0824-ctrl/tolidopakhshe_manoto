import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Truck, 
  Search, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Printer, 
  Copy, 
  MessageSquare,
  RefreshCw,
  X,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { StorefrontOrder, Invoice } from '../types';
import { OrderWorkflowStepper } from './admin/OrderWorkflowStepper';

interface OrderTrackingAdminModuleProps {
  orders: StorefrontOrder[];
  invoices?: Invoice[];
  onUpdateOrderStatus: (
    orderId: string, 
    newStatus: StorefrontOrder['orderStatus'], 
    carrierName?: string, 
    waybillNumber?: string,
    notes?: string
  ) => void;
  isSuperAdminView?: boolean;
}

const CARRIER_OPTIONS = [
  'باربری وطن (شعبه میدان شوش)',
  'تیپاکس شعبه بازار بزرگ',
  'چاپار اکسپرس',
  'پست پیشتاز',
  'پیک موتوری و اسنپ‌باکس (تهران)',
  'باربری پیام‌گیر (خیام)',
  'تحویل حضوری در فروشگاه (المهدی ۴)'
];

const ORDER_STATUS_CONFIG: Record<StorefrontOrder['orderStatus'], {
  label: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  description: string;
}> = {
  registered: {
    label: 'ثبت جدید (در صف تأیید)',
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-900',
    dotColor: 'bg-amber-500',
    description: 'سفارش ثبت شده و در انتظار تأیید ادمین مخصوص است.'
  },
  confirmed: {
    label: 'مرحلهٔ ۱: تأیید شده (آماده دسته‌بندی)',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-900',
    dotColor: 'bg-emerald-500',
    description: 'سفارش توسط ادمین تأیید شد و در صف دسته‌بندی و بسته‌بندی انبار است.'
  },
  processing: {
    label: 'مرحلهٔ ۲: در حال دسته‌بندی و بسته‌بندی',
    badgeBg: 'bg-blue-100 border-blue-300',
    badgeText: 'text-blue-900',
    dotColor: 'bg-blue-500',
    description: 'اقلام در حال دسته‌بندی، کنترل کیفیت و بسته‌بندی در انبار بازار هستند.'
  },
  packed: {
    label: 'مرحلهٔ ۲: بسته‌بندی شده (آماده ارسال)',
    badgeBg: 'bg-indigo-100 border-indigo-300',
    badgeText: 'text-indigo-900',
    dotColor: 'bg-indigo-500',
    description: 'بسته آماده تحویل به سفیر، تیپاکس یا باربری وطن است.'
  },
  sent_to_carrier: {
    label: 'مرحلهٔ ۳: ارسال شده (دارای بیجک باربری)',
    badgeBg: 'bg-purple-100 border-purple-300',
    badgeText: 'text-purple-900',
    dotColor: 'bg-purple-500',
    description: 'بار به باربری تحویل شده و شماره بیجک/بارنامه صادر شده است.'
  },
  delivered: {
    label: 'مرحلهٔ ۴: تحویل شده به خریدار',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-900',
    dotColor: 'bg-emerald-500',
    description: 'مرسوله با موفقیت به دست همکار یا مشتری نهایی رسید.'
  }
};

export const OrderTrackingAdminModule: React.FC<OrderTrackingAdminModuleProps> = ({
  orders,
  invoices = [],
  onUpdateOrderStatus,
  isSuperAdminView = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StorefrontOrder['orderStatus']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'wholesale' | 'retail'>('all');

  // Quick Tracking Edit State
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<StorefrontOrder['orderStatus']>('processing');
  const [editCarrier, setEditCarrier] = useState('');
  const [editWaybill, setEditWaybill] = useState('');
  const [editNote, setEditNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Storefront Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      // Status filter
      if (statusFilter !== 'all' && ord.orderStatus !== statusFilter) {
        return false;
      }
      // Wholesale vs Retail
      if (typeFilter === 'wholesale' && !ord.customer.isPartnerWholesale) {
        return false;
      }
      if (typeFilter === 'retail' && ord.customer.isPartnerWholesale) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCustomer = 
          ord.customer.fullName.toLowerCase().includes(q) ||
          ord.customer.phone.includes(q) ||
          (ord.customer.city && ord.customer.city.toLowerCase().includes(q)) ||
          (ord.customer.storeName && ord.customer.storeName.toLowerCase().includes(q));
        const matchesOrder = 
          ord.orderNumber.toLowerCase().includes(q) ||
          ord.trackingCode.toLowerCase().includes(q) ||
          (ord.waybillNumber && ord.waybillNumber.toLowerCase().includes(q));
        const matchesItems = ord.items.some(it => 
          it.product.name.toLowerCase().includes(q) || 
          it.product.sku.toLowerCase().includes(q)
        );
        return matchesCustomer || matchesOrder || matchesItems;
      }
      return true;
    });
  }, [orders, statusFilter, typeFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const pendingNew = orders.filter(o => o.orderStatus === 'registered').length;
    const confirmed = orders.filter(o => o.orderStatus === 'confirmed').length;
    const inProcessing = orders.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'packed').length;
    const dispatched = orders.filter(o => o.orderStatus === 'sent_to_carrier').length;
    const delivered = orders.filter(o => o.orderStatus === 'delivered').length;
    return { total, pendingNew, confirmed, inProcessing, dispatched, delivered };
  }, [orders]);

  const handleStartEdit = (order: StorefrontOrder) => {
    setEditingOrderId(order.id);
    setEditStatus(order.orderStatus);
    setEditCarrier(order.carrierName || order.shippingMethodTitle || CARRIER_OPTIONS[0]);
    setEditWaybill(order.waybillNumber || '');
    setEditNote('');
  };

  const handleSaveTracking = (orderId: string) => {
    onUpdateOrderStatus(orderId, editStatus, editCarrier, editWaybill, editNote);
    setEditingOrderId(null);
    showToast('وضعیت و اطلاعات بارنامه سفارش با موفقیت به‌روزرسانی شد.');
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} در حافظه کپی شد.`);
  };

  const handlePrintLabel = (order: StorefrontOrder) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>برچسب مرسوله - ${order.orderNumber}</title>
          <style>
            body { font-family: Tahoma, sans-serif; padding: 24px; color: #18181b; }
            .badge-box { border: 2px solid #18181b; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
            .title { font-size: 16px; font-weight: bold; border-bottom: 2px solid #ddd; padding-bottom: 8px; margin-bottom: 12px; }
            .row { display: flex; margin-bottom: 8px; font-size: 13px; }
            .label { font-weight: bold; width: 140px; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 12px; }
            .items-table th, .items-table td { border: 1px solid #999; padding: 6px 10px; text-align: right; }
            .items-table th { background: #f4f4f5; }
          </style>
        </head>
        <body>
          <div class="badge-box">
            <div class="title">فرستنده: تولید و پخش پوشاک من و تو (مدیریت اسدی)</div>
            <div class="row"><span class="label">آدرس فرستنده:</span><span>تهران، بازار بزرگ، بازار عباس‌آباد، سرای ملی، پاساژ المهدی ۴، طبقه منفی یک، پلاک ۲۴۲</span></div>
            <div class="row"><span class="label">تلفن تماس:</span><span>09123456789 - 02155667788</span></div>
          </div>

          <div class="badge-box">
            <div class="title">گیرنده مرسوله: ${order.customer.fullName} ${order.customer.storeName ? `(${order.customer.storeName})` : ''}</div>
            <div class="row"><span class="label">شماره سفارش:</span><span style="font-weight: bold; font-family: monospace;">${order.orderNumber}</span></div>
            <div class="row"><span class="label">کد رهگیری:</span><span style="font-family: monospace;">${order.trackingCode}</span></div>
            <div class="row"><span class="label">تلفن گیرنده:</span><span>${order.customer.phone}</span></div>
            <div class="row"><span class="label">استان و شهر:</span><span>${order.customer.province} - ${order.customer.city}</span></div>
            <div class="row"><span class="label">آدرس دقیق:</span><span>${order.customer.address}</span></div>
            ${order.customer.postalCode ? `<div class="row"><span class="label">کد پستی:</span><span>${order.customer.postalCode}</span></div>` : ''}
            <div class="row"><span class="label">روش ارسال:</span><span>${order.shippingMethodTitle} ${order.carrierName ? `(${order.carrierName})` : ''}</span></div>
            ${order.waybillNumber ? `<div class="row"><span class="label">شماره بارنامه/بیجک:</span><span style="font-weight: bold;">${order.waybillNumber}</span></div>` : ''}
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>نام کالا و مدل</th>
                <th>کد SKU</th>
                <th>نوع خرید</th>
                <th>رنگ / سایز</th>
                <th>تعداد</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((it, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${it.product.name}</td>
                  <td style="font-family: monospace;">${it.product.sku}</td>
                  <td>${it.mode === 'wholesale_pack' ? `پک عمده (${it.product.packSize}تایی)` : 'تک‌فروشی'}</td>
                  <td>${it.selectedColor || 'پیش‌فرض'} / ${it.selectedSize || 'فری‌سایز'}</td>
                  <td><b>${it.quantity}</b> ${it.mode === 'wholesale_pack' ? 'پک' : 'عدد'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 24px; font-size: 11px; text-align: center; color: #666;">
            چاپ شده از سامانه مدیریت و پیگیری سفارشات پوشاک من و تو (MANOTO DRESS)
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 inset-x-4 lg:inset-x-auto lg:left-6 z-50 bg-[#18181B] text-[#FAF7F2] border border-[#D4AF37] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Identity - Compact & Modern on Mobile */}
      <div className="bg-[#18181B] text-[#FAF7F2] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#3F3F46] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>واحد پیگیری و مدیریت سفارشات</span>
            </div>
            <h1 className="text-base sm:text-xl font-black text-white">
              رهگیری مرسولات و خریداران
            </h1>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5 leading-relaxed">
              تولید و پخش پوشاک من و تو (اسدی) • پیگیری لحظه‌ای، تماس با مشتری و صدور بارنامه
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => showToast('لیست سفارشات به‌روز شد.')}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-stone-700 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>به‌روزرسانی</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar - Horizontal Scroll on Mobile with Touch Momentum */}
      <div className="flex sm:grid sm:grid-cols-6 gap-2 sm:gap-2.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1 snap-x">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`snap-start shrink-0 min-w-[120px] sm:min-w-0 flex-1 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
            statusFilter === 'all' 
              ? 'bg-[#18181B] text-[#FAF7F2] border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/20' 
              : 'bg-white text-stone-800 border-[#E6DEC8] hover:bg-stone-50'
          }`}
        >
          <div className="text-[10px] font-bold opacity-75">کل سفارش‌ها</div>
          <div className="text-base sm:text-xl font-black font-mono mt-0.5">{stats.total}</div>
          <div className="text-[10px] text-[#D4AF37] font-bold mt-0.5 truncate">همه موارد</div>
        </div>

        <div 
          onClick={() => setStatusFilter('registered')}
          className={`snap-start shrink-0 min-w-[120px] sm:min-w-0 flex-1 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
            statusFilter === 'registered' 
              ? 'bg-amber-950 text-amber-200 border-amber-500 shadow-md ring-2 ring-amber-500/20' 
              : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100/70'
          }`}
        >
          <div className="text-[10px] font-bold opacity-85">در صف تأیید</div>
          <div className="text-base sm:text-xl font-black font-mono mt-0.5 text-amber-700 sm:text-inherit">{stats.pendingNew}</div>
          <div className="text-[10px] text-amber-700 font-bold mt-0.5 truncate">ثبت اولیه مشتری</div>
        </div>

        <div 
          onClick={() => setStatusFilter('confirmed')}
          className={`snap-start shrink-0 min-w-[120px] sm:min-w-0 flex-1 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
            statusFilter === 'confirmed' 
              ? 'bg-emerald-950 text-emerald-200 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
              : 'bg-emerald-50/80 text-emerald-900 border-emerald-200 hover:bg-emerald-100/70'
          }`}
        >
          <div className="text-[10px] font-bold opacity-85">مرحله ۱: تأیید شده</div>
          <div className="text-base sm:text-xl font-black font-mono mt-0.5 text-emerald-700 sm:text-inherit">{stats.confirmed}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5 truncate">تأیید ادمین</div>
        </div>

        <div 
          onClick={() => setStatusFilter('processing')}
          className={`snap-start shrink-0 min-w-[120px] sm:min-w-0 flex-1 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
            statusFilter === 'processing' || statusFilter === 'packed'
              ? 'bg-blue-950 text-blue-200 border-blue-500 shadow-md ring-2 ring-blue-500/20' 
              : 'bg-blue-50/80 text-blue-900 border-blue-200 hover:bg-blue-100/70'
          }`}
        >
          <div className="text-[10px] font-bold opacity-85">مرحله ۲: دسته‌بندی</div>
          <div className="text-base sm:text-xl font-black font-mono mt-0.5 text-blue-700 sm:text-inherit">{stats.inProcessing}</div>
          <div className="text-[10px] text-blue-700 font-bold mt-0.5 truncate">بسته‌بندی انبار</div>
        </div>

        <div 
          onClick={() => setStatusFilter('sent_to_carrier')}
          className={`snap-start shrink-0 min-w-[120px] sm:min-w-0 flex-1 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
            statusFilter === 'sent_to_carrier' 
              ? 'bg-purple-950 text-purple-200 border-purple-500 shadow-md ring-2 ring-purple-500/20' 
              : 'bg-purple-50/80 text-purple-900 border-purple-200 hover:bg-purple-100/70'
          }`}
        >
          <div className="text-[10px] font-bold opacity-85">مرحله ۳: ارسال</div>
          <div className="text-base sm:text-xl font-black font-mono mt-0.5 text-purple-700 sm:text-inherit">{stats.dispatched}</div>
          <div className="text-[10px] text-purple-700 font-bold mt-0.5 truncate">باربری / بیجک</div>
        </div>

        <div 
          onClick={() => setStatusFilter('delivered')}
          className={`snap-start shrink-0 min-w-[120px] sm:min-w-0 flex-1 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
            statusFilter === 'delivered' 
              ? 'bg-teal-950 text-teal-200 border-teal-500 shadow-md ring-2 ring-teal-500/20' 
              : 'bg-teal-50/80 text-teal-900 border-teal-200 hover:bg-teal-100/70'
          }`}
        >
          <div className="text-[10px] font-bold opacity-85">مرحله ۴: تحویل</div>
          <div className="text-base sm:text-xl font-black font-mono mt-0.5 text-teal-700 sm:text-inherit">{stats.delivered}</div>
          <div className="text-[10px] text-teal-700 font-bold mt-0.5 truncate">تحویل خریدار</div>
        </div>
      </div>

      {/* Filter and Search Bar - Mobile Friendly */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-2.5">
        
        {/* Search Input with quick clear */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی مشتری، شماره تماس، شماره سفارش، شهر یا نام شلوار..."
            className="w-full pr-10 pl-16 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#18181B] text-stone-900 placeholder:text-stone-400 transition-all"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-2.5 text-xs text-stone-400 hover:text-stone-700 font-bold bg-stone-200 px-2 py-0.5 rounded-md"
            >
              پاک کردن
            </button>
          )}
        </div>

        {/* Filters Row: Type Filter & Status Chips */}
        <div className="flex items-center gap-2 justify-between flex-wrap">
          {/* Segmented Type Toggle */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-lg font-bold transition-all text-[11px] ${
                typeFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              همه ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('wholesale')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-lg font-bold transition-all text-[11px] ${
                typeFilter === 'wholesale' ? 'bg-[#18181B] text-[#D4AF37] shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              همکار عمده (پک)
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('retail')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-lg font-bold transition-all text-[11px] ${
                typeFilter === 'retail' ? 'bg-[#18181B] text-[#D4AF37] shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              تک‌فروشی
            </button>
          </div>

          <span className="text-[11px] text-stone-500 font-bold mr-auto">
            نمایش: <strong className="text-stone-900">{filteredOrders.length}</strong> سفارش
          </span>
        </div>

        {/* Status Horizontal Pill Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar -mx-1 px-1">
          {(['all', 'registered', 'confirmed', 'processing', 'packed', 'sent_to_carrier', 'delivered'] as const).map((st) => {
            const isSelected = statusFilter === st;
            const label = st === 'all' ? 'همه وضعیت‌ها' : ORDER_STATUS_CONFIG[st].label;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer text-[11px] shrink-0 active:scale-95 ${
                  isSelected 
                    ? 'bg-[#18181B] text-[#D4AF37] shadow-xs ring-1 ring-[#D4AF37]/50' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List: WHO ORDERED WHAT? */}
      <div className="space-y-3 sm:space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-[#E6DEC8] text-center space-y-3">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-stone-300 mx-auto" />
            <h3 className="text-sm sm:text-base font-black text-stone-800">هیچ سفارشی مطابق جستجو یا فیلتر یافت نشد</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              می‌توانید فیلتر وضعیت یا کلمات جستجو را تغییر دهید یا دکمه «همه» را انتخاب کنید.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = ORDER_STATUS_CONFIG[order.orderStatus] || ORDER_STATUS_CONFIG.registered;
            const isEditing = editingOrderId === order.id;
            const totalItemCount = order.items.reduce((sum, it) => sum + it.quantity, 0);

            return (
              <div 
                key={order.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6DEC8] shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Order Summary Header - Highly Optimized for Mobile Touch */}
                <div className="p-3.5 sm:p-5 bg-gradient-to-l from-stone-50 via-white to-stone-50/60 border-b border-stone-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Customer Info & Order Codes */}
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-black shrink-0 shadow-xs mt-0.5 sm:mt-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-black text-stone-900 truncate">
                            {order.customer.fullName}
                          </h3>
                          {order.customer.storeName && (
                            <span className="text-[10px] sm:text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold border border-stone-200">
                              {order.customer.storeName}
                            </span>
                          )}
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            order.customer.isPartnerWholesale 
                              ? 'bg-amber-100 border-amber-300 text-amber-900' 
                              : 'bg-sky-100 border-sky-300 text-sky-900'
                          }`}>
                            {order.customer.isPartnerWholesale ? 'همکار عمده (پک)' : 'تک‌فروشی'}
                          </span>
                        </div>

                        {/* Order Number, Tracking, Date */}
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1 flex-wrap font-mono">
                          <span>سفارش: <strong className="text-stone-800">{order.orderNumber}</strong></span>
                          <span>•</span>
                          <span>کد رهگیری: <strong className="text-stone-800">{order.trackingCode}</strong></span>
                          <span>•</span>
                          <span className="font-sans text-stone-400">{order.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge and Primary Action Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <div className={`px-2.5 py-1 rounded-xl border text-[11px] font-black flex items-center gap-1.5 ${statusInfo.badgeBg} ${statusInfo.badgeText}`}>
                        <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
                        <span>{statusInfo.label}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(order)}
                        className="px-3.5 py-1.5 bg-[#18181B] active:scale-95 hover:bg-stone-800 text-[#D4AF37] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>تغییر وضعیت و بیجک</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* 4-Step Interactive Workflow Stepper Component */}
                <div className="p-3 sm:p-4 bg-[#FAF7F2]/90 border-b border-[#E6DEC8]">
                  <OrderWorkflowStepper 
                    order={order} 
                    onUpdateStatus={(newStatus, carrierName, waybillNumber, notes) => 
                      onUpdateOrderStatus(order.id, newStatus, carrierName, waybillNumber, notes)
                    } 
                    onShowToast={showToast} 
                  />
                </div>

                {/* Tracking & Quick Follow-up In-line / Bottom Drawer Editor */}
                {isEditing && (
                  <div className="p-3.5 sm:p-5 bg-amber-50/70 border-b border-amber-200 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-stone-900">
                        <Truck className="w-4 h-4 text-[#8C6D37]" />
                        <span>ثبت وضعیت جدید و اطلاعات بارنامه برای سفارش {order.orderNumber}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingOrderId(null)}
                        className="p-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-600 transition-colors"
                        title="بستن فرم"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          وضعیت مرحله‌ای مرسوله:
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as StorefrontOrder['orderStatus'])}
                          className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-[#D4AF37]"
                        >
                          <option value="registered">ثبت جدید توسط مشتری (در صف تأیید)</option>
                          <option value="confirmed">۱. تأیید شده توسط ادمین (آماده دسته‌بندی)</option>
                          <option value="packed">۲. دسته‌بندی و بسته‌بندی در انبار</option>
                          <option value="sent_to_carrier">۳. ارسال شده به باربری / صدور بیجک</option>
                          <option value="delivered">۴. تحویل قطعی به خریدار</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          نام شرکت حمل و نقل / باربری:
                        </label>
                        <input
                          type="text"
                          value={editCarrier}
                          onChange={(e) => setEditCarrier(e.target.value)}
                          placeholder="مثلاً: باربری وطن (شوش) یا تیپاکس"
                          list="carrier-suggestions"
                          className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 font-bold focus:ring-2 focus:ring-[#D4AF37]"
                        />
                        <datalist id="carrier-suggestions">
                          {CARRIER_OPTIONS.map(c => <option key={c} value={c} />)}
                        </datalist>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          شماره بیجک باربری / کد رهگیری تیپاکس:
                        </label>
                        <input
                          type="text"
                          value={editWaybill}
                          onChange={(e) => setEditWaybill(e.target.value)}
                          placeholder="مثال: VTN-998241 یا شماره بارنامه"
                          className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 font-mono focus:ring-2 focus:ring-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveTracking(order.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-[#D4AF37] hover:bg-[#C59F2D] active:scale-95 text-[#18181B] font-black rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ذخیره وضعیت و بارنامه</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const smsText = `همکار گرامی ${order.customer.fullName}، سفارش شما به شماره ${order.orderNumber} با ${editCarrier || 'باربری'} ارسال شد. شماره بارنامه/رهگیری: ${editWaybill || 'در حال ثبت'}. با تشکر، تولید و پخش من و تو`;
                            navigator.clipboard.writeText(smsText);
                            showToast('متن پیامک رهگیری برای مشتری کپی شد.');
                          }}
                          className="px-3 py-2 bg-white hover:bg-stone-100 active:scale-95 text-stone-700 border border-stone-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                          <span className="hidden sm:inline">کپی متن پیامک</span>
                          <span className="sm:hidden">پیامک</span>
                        </button>
                      </div>

                      <span className="text-[10px] text-stone-500">
                        وضعیت در پرتال رهگیری مشتری بلافاصله اعمال می‌شود.
                      </span>
                    </div>
                  </div>
                )}

                {/* Core Details Grid: WHO ORDERED WHAT? */}
                <div className="p-3.5 sm:p-5 space-y-3.5">
                  
                  {/* Two Column Layout: Customer Details & Ordered Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5">
                    
                    {/* Column 1: Customer Contact & Shipping Address (4 cols) */}
                    <div className="lg:col-span-4 bg-stone-50 p-3 sm:p-4 rounded-2xl border border-stone-200 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#8C6D37]" />
                          <span>مشخصات و آدرس خریدار</span>
                        </span>
                        
                        {/* Direct Mobile Call Button */}
                        <a
                          href={`tel:${order.customer.phone}`}
                          className="text-xs text-emerald-800 font-bold flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 active:scale-95 px-2.5 py-1 rounded-lg border border-emerald-300 transition-transform"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-700" />
                          <span>تماس تلفنی</span>
                        </a>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 text-[11px]">شماره موبایل اصلی:</span>
                          <div className="flex items-center gap-1.5 font-mono font-bold text-stone-900">
                            <span>{order.customer.phone}</span>
                            <button
                              onClick={() => handleCopy(order.customer.phone, 'شماره موبایل')}
                              className="text-stone-400 hover:text-stone-700 p-1"
                              title="کپی شماره موبایل"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {order.customer.landlinePhone && (
                          <div className="flex items-center justify-between bg-stone-100/70 p-1.5 rounded-lg border border-stone-200/80">
                            <span className="text-stone-600 text-[11px] flex items-center gap-1">
                              <span>تلفن ثابت:</span>
                            </span>
                            <div className="flex items-center gap-1.5 font-mono font-bold text-stone-900">
                              <span>{order.customer.landlinePhone}</span>
                              <a
                                href={`tel:${order.customer.landlinePhone}`}
                                className="text-emerald-700 hover:text-emerald-900 p-0.5"
                                title="تماس با تلفن ثابت"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                              <button
                                onClick={() => handleCopy(order.customer.landlinePhone || '', 'تلفن ثابت')}
                                className="text-stone-400 hover:text-stone-700 p-0.5"
                                title="کپی تلفن ثابت"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}

                        {order.customer.alternativePhone && (
                          <div className="flex items-center justify-between bg-amber-50/70 p-1.5 rounded-lg border border-amber-200/80">
                            <span className="text-amber-900 text-[11px] font-bold flex items-center gap-1">
                              <span>شماره دوم / پشتیبان:</span>
                            </span>
                            <div className="flex items-center gap-1.5 font-mono font-bold text-stone-900">
                              <span>{order.customer.alternativePhone}</span>
                              <a
                                href={`tel:${order.customer.alternativePhone}`}
                                className="text-emerald-700 hover:text-emerald-900 p-0.5"
                                title="تماس با شماره دوم"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                              <button
                                onClick={() => handleCopy(order.customer.alternativePhone || '', 'شماره دوم')}
                                className="text-stone-400 hover:text-stone-700 p-0.5"
                                title="کپی شماره دوم"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 text-[11px]">مقصد:</span>
                          <span className="font-bold text-stone-800">{order.customer.province} - {order.customer.city}</span>
                        </div>

                        <div className="pt-0.5">
                          <span className="text-stone-500 block mb-0.5 text-[11px]">آدرس دقیق تحویل:</span>
                          <p className="text-stone-800 bg-white p-2 rounded-xl border border-stone-200 text-[11px] leading-relaxed select-all">
                            {order.customer.address}
                          </p>
                        </div>

                        {order.customer.postalCode && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-stone-500">کد پستی:</span>
                            <span className="font-mono text-stone-700">{order.customer.postalCode}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-stone-200 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500">روش ارسال:</span>
                            <span className="font-bold text-stone-900">{order.shippingMethodTitle}</span>
                          </div>
                          {order.waybillNumber && (
                            <div className="flex items-center justify-between text-purple-900 bg-purple-50 p-2 rounded-xl border border-purple-200">
                              <span className="font-bold">شماره بارنامه/بیجک:</span>
                              <div className="flex items-center gap-1">
                                <span className="font-mono font-black">{order.waybillNumber}</span>
                                <button
                                  onClick={() => handleCopy(order.waybillNumber || '', 'شماره بارنامه')}
                                  className="text-purple-600 hover:text-purple-900 p-0.5"
                                  title="کپی بارنامه"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Column 2: Exact Items Ordered (What did they order?) (8 cols) */}
                    <div className="lg:col-span-8 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-[#8C6D37]" />
                          <span>اقلام سفارش داده شده ({totalItemCount} قلم)</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-stone-600">
                          مبلغ کل: <strong className="text-stone-900 font-mono text-sm">{order.finalAmountToman.toLocaleString('fa-IR')}</strong> ت
                        </span>
                      </div>

                      {/* Items Cards List - Clean, elegant, readable and simple design */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => {
                          const isWholesale = item.mode === 'wholesale_pack';
                          return (
                            <div 
                              key={item.id || idx}
                              className="group p-2.5 sm:p-3 bg-white hover:bg-stone-50/80 border border-stone-200/90 hover:border-[#D4AF37]/60 rounded-xl sm:rounded-2xl flex items-center justify-between gap-3 transition-all shadow-2xs hover:shadow-xs"
                            >
                              {/* Product Thumbnail & Core Info */}
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative shrink-0">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    referrerPolicy="no-referrer"
                                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover border border-stone-200 bg-[#FAF7F2] shadow-2xs group-hover:scale-102 transition-transform"
                                  />
                                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#18181B] text-[#D4AF37] border border-white text-[10px] font-black flex items-center justify-center font-mono shadow-xs">
                                    {idx + 1}
                                  </span>
                                </div>

                                <div className="min-w-0 space-y-1">
                                  {/* Title & SKU */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="text-xs sm:text-sm font-black text-stone-900 truncate">
                                      {item.product.name}
                                    </h5>
                                    <span className="text-[10px] font-mono font-bold bg-[#FAF7F2] text-stone-600 px-1.5 py-0.5 rounded-md border border-stone-200">
                                      {item.product.sku}
                                    </span>
                                  </div>
                                  
                                  {/* Badges: Mode, Color, Size */}
                                  <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
                                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                                      isWholesale
                                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                                        : 'bg-stone-100 text-stone-700 border-stone-200'
                                    }`}>
                                      {isWholesale ? `پک عمده (${item.product.packSize}تایی)` : 'تک‌فروشی'}
                                    </span>

                                    {item.selectedColor && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100/90 text-stone-700 font-medium text-[10px] border border-stone-200">
                                        <span className="text-stone-400">رنگ:</span>
                                        <strong className="text-stone-900 font-bold">{item.selectedColor}</strong>
                                      </span>
                                    )}

                                    {item.selectedSize && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100/90 text-stone-700 font-medium text-[10px] border border-stone-200">
                                        <span className="text-stone-400">سایز:</span>
                                        <strong className="text-stone-900 font-bold">{item.selectedSize}</strong>
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-[10px] text-stone-500 font-mono">
                                    قیمت واحد: <span className="font-bold text-stone-700">{item.unitPriceToman.toLocaleString('fa-IR')}</span> تومان
                                  </div>
                                </div>
                              </div>

                              {/* Clean Quantity Pill & Subtotal */}
                              <div className="text-left shrink-0 pl-1 flex flex-col items-end gap-1">
                                <div className="inline-flex items-center gap-1.5 bg-[#18181B] text-[#FAF7F2] px-2.5 py-1 rounded-xl text-xs font-black shadow-2xs">
                                  <span className="text-[#D4AF37] font-mono text-sm">{item.quantity}</span>
                                  <span className="text-[10px] font-sans text-stone-300 font-normal">
                                    {isWholesale ? 'پک' : 'عدد'}
                                  </span>
                                </div>

                                <div className="text-left">
                                  <span className="text-xs sm:text-sm font-black text-stone-900 font-mono tracking-tight">
                                    {item.totalPriceToman.toLocaleString('fa-IR')}
                                  </span>
                                  <span className="text-[10px] font-normal text-stone-500 mr-1">تومان</span>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>

                      {/* Payment & Invoice Summary Footer */}
                      <div className="p-2.5 sm:p-3 bg-stone-100/80 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 flex-wrap text-[11px]">
                          <span className="text-stone-500">وضعیت پرداخت:</span>
                          <span className={`font-black px-2 py-0.5 rounded-lg text-[10px] ${
                            order.paymentStatus === 'paid' 
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {order.paymentStatus === 'paid' ? 'پرداخت شده (موفق)' : 'در انتظار بررسی / چک'}
                          </span>
                          <span className="text-stone-400 hidden sm:inline">|</span>
                          <span className="text-stone-600 font-bold">
                            روش: {order.paymentMethod === 'online_gateway' ? 'درگاه آنلاین' : (order.paymentMethod === 'wholesale_check' ? 'چک صیادی' : 'کارت‌به‌کارت')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => handlePrintLabel(order)}
                            className="px-3 py-1.5 bg-white hover:bg-stone-200 active:scale-95 text-stone-800 border border-stone-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>چاپ برچسب باربری</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
