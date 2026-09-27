import React, { useState, useMemo, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  Send, 
  CheckCircle, 
  Clock, 
  Search, 
  Phone, 
  MapPin, 
  Share2, 
  FileText,
  Plus,
  Receipt,
  User,
  Copy,
  Check,
  X,
  Boxes,
  Calendar,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Invoice } from '../types';

export interface ShipmentRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  storeName: string;
  phone: string;
  destinationCity: string;
  carrier: 'باربری وطن (شوش)' | 'تیپاکس بازار' | 'چاپار' | 'باربری پیام‌گیر (خیام)' | 'پیک موتوری لحظه‌ای (اسنپ‌باکس/الوپیک)';
  waybillNumber: string; // شماره بیجک یا کد رهگیری سفیر
  sackCount: number; // تعداد گونی یا کارتن یا بسته
  status: 'packed' | 'delivered_to_carrier' | 'received_by_customer';
  dispatchDate: string;
  shippingFeeType: 'پس‌کرایه (به عهده مشتری)' | 'پیش‌کرایه';
}

interface LogisticsModuleProps {
  invoices: Invoice[];
}

export const LogisticsModule: React.FC<LogisticsModuleProps> = ({ invoices }) => {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([
    {
      id: 'shp-1',
      invoiceNumber: '۱۴۰۳-۱۴۲',
      customerName: 'حاج داوود محمدی',
      storeName: 'پوشاک محمدی اصفهان',
      phone: '09131114589',
      destinationCity: 'اصفهان',
      carrier: 'باربری وطن (شوش)',
      waybillNumber: 'VTN-884920',
      sackCount: 3,
      status: 'delivered_to_carrier',
      dispatchDate: '۱۴۰۳/۰۳/۰۴',
      shippingFeeType: 'پس‌کرایه (به عهده مشتری)',
    },
    {
      id: 'shp-2',
      invoiceNumber: '۱۴۰۳-۱۴۳',
      customerName: 'خانم دکتر زهرا نوری',
      storeName: 'پوشاک مانتو و شلوار نوری',
      phone: '09124447812',
      destinationCity: 'مشهد مقدس',
      carrier: 'تیپاکس بازار',
      waybillNumber: 'TPX-9930214',
      sackCount: 1,
      status: 'delivered_to_carrier',
      dispatchDate: '۱۴۰۳/۰۳/۰۵',
      shippingFeeType: 'پس‌کرایه (به عهده مشتری)',
    },
    {
      id: 'shp-3',
      invoiceNumber: '۱۴۰۳-۱۴۴',
      customerName: 'برادران حسینی',
      storeName: 'پخش عمده شیراز',
      phone: '09173339011',
      destinationCity: 'شیراز',
      carrier: 'باربری پیام‌گیر (خیام)',
      waybillNumber: 'در انتظار بیجک',
      sackCount: 4,
      status: 'packed',
      dispatchDate: 'امروز',
      shippingFeeType: 'پس‌کرایه (به عهده مشتری)',
    },
    {
      id: 'shp-4',
      invoiceNumber: '۱۴۰۳-۱۴۵',
      customerName: 'فروشگاه تندیس تهران',
      storeName: 'گالری مانتو تندیس تجریش',
      phone: '09127891234',
      destinationCity: 'تهران (تجریش)',
      carrier: 'پیک موتوری لحظه‌ای (اسنپ‌باکس/الوپیک)',
      waybillNumber: 'SNP-LIVE-7819',
      sackCount: 1,
      status: 'delivered_to_carrier',
      dispatchDate: 'امروز (تحویل فوری)',
      shippingFeeType: 'پیش‌کرایه',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [carrierFilter, setCarrierFilter] = useState<string>('all');
  const [selectedShipmentForSMS, setSelectedShipmentForSMS] = useState<ShipmentRecord | null>(null);
  const [copiedWaybill, setCopiedWaybill] = useState<string | null>(null);
  const [isCopiedSMS, setIsCopiedSMS] = useState(false);
  const [isSentSMS, setIsSentSMS] = useState(false);

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

  // New Shipment Modal State
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState(false);
  const [newShipmentForm, setNewShipmentForm] = useState({
    invoiceNumber: '',
    customerName: '',
    storeName: '',
    phone: '',
    destinationCity: 'اصفهان',
    carrier: 'باربری وطن (شوش)' as ShipmentRecord['carrier'],
    waybillNumber: '',
    sackCount: 1,
    shippingFeeType: 'پس‌کرایه (به عهده مشتری)' as ShipmentRecord['shippingFeeType'],
    status: 'packed' as ShipmentRecord['status'],
  });

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        !q ||
        s.customerName.toLowerCase().includes(q) ||
        s.storeName.toLowerCase().includes(q) ||
        s.destinationCity.toLowerCase().includes(q) ||
        s.waybillNumber.toLowerCase().includes(q) ||
        s.invoiceNumber.toLowerCase().includes(q) ||
        s.phone.includes(q);

      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesCarrier = carrierFilter === 'all' || s.carrier === carrierFilter;

      return matchesSearch && matchesStatus && matchesCarrier;
    });
  }, [shipments, searchQuery, statusFilter, carrierFilter]);

  // Overall metric totals
  const totalSacks = useMemo(() => filteredShipments.reduce((s, shp) => s + shp.sackCount, 0), [filteredShipments]);
  const deliveredCount = useMemo(() => shipments.filter(s => s.status === 'delivered_to_carrier' || s.status === 'received_by_customer').length, [shipments]);
  const packedCount = useMemo(() => shipments.filter(s => s.status === 'packed').length, [shipments]);
  const vatanCount = useMemo(() => shipments.filter(s => s.carrier === 'باربری وطن (شوش)').length, [shipments]);
  const tipaxCount = useMemo(() => shipments.filter(s => s.carrier === 'تیپاکس بازار').length, [shipments]);

  const handleUpdateStatus = (id: string, newStatus: ShipmentRecord['status']) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleCopyWaybill = (wb: string) => {
    if (!wb || wb === 'در انتظار بیجک') return;
    navigator.clipboard?.writeText(wb);
    setCopiedWaybill(wb);
    setTimeout(() => setCopiedWaybill(null), 2000);
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShipmentForm.customerName.trim()) return;

    const newRecord: ShipmentRecord = {
      id: `shp-${Date.now()}`,
      invoiceNumber: newShipmentForm.invoiceNumber || `۱۴۰۳-${Math.floor(100 + Math.random() * 900)}`,
      customerName: newShipmentForm.customerName,
      storeName: newShipmentForm.storeName || `پوشاک ${newShipmentForm.customerName}`,
      phone: newShipmentForm.phone || '09120000000',
      destinationCity: newShipmentForm.destinationCity,
      carrier: newShipmentForm.carrier,
      waybillNumber: newShipmentForm.waybillNumber || 'در انتظار بیجک',
      sackCount: Number(newShipmentForm.sackCount) || 1,
      status: newShipmentForm.status,
      dispatchDate: 'امروز',
      shippingFeeType: newShipmentForm.shippingFeeType,
    };

    setShipments(prev => [newRecord, ...prev]);
    setIsNewShipmentModalOpen(false);
    setNewShipmentForm({
      invoiceNumber: '',
      customerName: '',
      storeName: '',
      phone: '',
      destinationCity: 'اصفهان',
      carrier: 'باربری وطن (شوش)',
      waybillNumber: '',
      sackCount: 1,
      shippingFeeType: 'پس‌کرایه (به عهده مشتری)',
      status: 'packed',
    });
  };

  const getSMSMessage = (shp: ShipmentRecord) => {
    return `همکار گرامی جناب ${shp.customerName} (${shp.storeName}) 🌸
سفارش فاکتور ${shp.invoiceNumber} شما در قالب ${shp.sackCount} گونی/بسته با ${shp.carrier} به مقصد ${shp.destinationCity} ارسال شد.

📋 شماره بیجک / رهگیری باربری: ${shp.waybillNumber}
نوع کرایه: ${shp.shippingFeeType}

با تشکر از خرید شما - تولید و پخش پوشاک من و تو (بازار بزرگ تهران)
آدرس: بازار عباس‌آباد، سرای ملی، پلاک ۲۴۲
تلفن پیگیری و هماهنگی باربری: 02155667788`;
  };

  return (
    <div id="logistics-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl shadow-2xs">
            <Truck className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-lg font-black text-[#18181B]">
              لجستیک، حواله خروج باربری‌ها و صدور بیجک
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              مدیریت ارسال گونی‌ها و کارتن‌ها به باربری‌های شوش و خیام، تیپاکس و پیامک خودکار بیجک به بنکداران سراسر کشور
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsNewShipmentModalOpen(true)}
            className="bg-gradient-to-r from-[#18181B] via-stone-900 to-[#18181B] hover:from-stone-900 hover:to-black text-[#FAF7F2] font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg border border-[#D4AF37]/50 hover:border-[#D4AF37] cursor-pointer group active:scale-98"
          >
            <div className="w-5 h-5 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <span>+ ثبت حواله خروج و بیجک جدید</span>
          </button>
        </div>
      </div>

      {/* Shipments List, Filters & Luxury Master Table */}
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
              <span className="font-bold text-[#D4AF37]">حالت تمام‌صفحه دفتر لجستیک و ارسال باربری فعال است</span>
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
        
        {/* Module Header Inside Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE9DC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                <span>دفتر ثبت محموله‌های خروجی و بیجک‌های باربری</span>
                <span className="text-[11px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-full font-mono">
                  {shipments.length.toLocaleString('fa-IR')} مرسوله کل
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                رهگیری کیسه‌های تحویل شده به باربری وطن (شوش)، پیام‌گیر (خیام)، تیپاکس و پیک‌های شتابی بازار
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs text-stone-500 font-medium">فیلتر باربری:</span>
            <select
              value={carrierFilter}
              onChange={(e) => setCarrierFilter(e.target.value)}
              className="bg-[#FAF7F2] text-xs font-bold text-stone-800 border border-[#DDD5C0] rounded-xl px-2.5 py-1.5 outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">همه باربری‌ها</option>
              <option value="باربری وطن (شوش)">باربری وطن (شوش)</option>
              <option value="تیپاکس بازار">تیپاکس بازار</option>
              <option value="باربری پیام‌گیر (خیام)">باربری پیام‌گیر (خیام)</option>
              <option value="پیک موتوری لحظه‌ای (اسنپ‌باکس/الوپیک)">پیک موتوری درون‌شهری</option>
            </select>

            {/* Fullscreen Toggle Button */}
            <button
              type="button"
              onClick={() => setIsTableFullscreen(!isTableFullscreen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
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
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-2xs">
              <Package className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-stone-500 block truncate">مرسولات این نما</span>
              <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                {filteredShipments.length.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">محموله</span>
              </span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
              <Boxes className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-stone-500 block truncate">حجم کل بسته‌ها</span>
              <span className="text-sm sm:text-base font-black text-emerald-950 block truncate font-mono">
                {totalSacks.toLocaleString('fa-IR')} <span className="text-xs font-bold text-emerald-700">گونی / کارتن</span>
              </span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8C6D37]/15 text-[#8C6D37] flex items-center justify-center shrink-0 shadow-2xs">
              <Truck className="w-5 h-5 text-[#8C6D37]" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-stone-500 block truncate">تحویل باربری وطن (شوش)</span>
              <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                {vatanCount.toLocaleString('fa-IR')} <span className="text-xs font-normal text-stone-600">بارنامه</span>
              </span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-stone-500 block truncate">بسته‌بندی در انبار</span>
              <span className="text-xs sm:text-sm font-bold text-stone-800 block truncate font-mono">
                {packedCount.toLocaleString('fa-IR')} بسته در انتظار ارسال
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills & Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-stone-900 text-[#FAF7F2] shadow-xs'
                  : 'bg-[#FAF7F2] text-stone-600 hover:bg-[#EFE8D8] border border-[#DDD5C0]'
              }`}
            >
              <span>همه وضعیت‌ها</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === 'all' ? 'bg-[#D4AF37] text-stone-950 font-black' : 'bg-stone-200 text-stone-700'
              }`}>
                {shipments.length.toLocaleString('fa-IR')}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('delivered_to_carrier')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'delivered_to_carrier'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>تحویل باربری شده</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === 'delivered_to_carrier' ? 'bg-emerald-200 text-emerald-950 font-black' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {shipments.filter(s => s.status === 'delivered_to_carrier').length.toLocaleString('fa-IR')}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('packed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'packed'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-amber-900 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>آماده در انبار (در انتظار باربری)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === 'packed' ? 'bg-amber-200 text-amber-950 font-black' : 'bg-amber-100 text-amber-800'
              }`}>
                {packedCount.toLocaleString('fa-IR')}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('received_by_customer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'received_by_customer'
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-stone-700 hover:bg-sky-50 border border-stone-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>رسیده به دست مشتری</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === 'received_by_customer' ? 'bg-sky-200 text-sky-950 font-black' : 'bg-stone-200 text-stone-700'
              }`}>
                {shipments.filter(s => s.status === 'received_by_customer').length.toLocaleString('fa-IR')}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی خریدار، شهر، باربری یا شماره بیجک..."
              className="w-full bg-[#FAF7F2] text-xs pr-10 pl-8 py-2.5 rounded-xl border border-[#DDD5C0] text-stone-900 outline-none focus:bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                title="پاک کردن جستجو"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#E6DEC8] shadow-2xs">
          <table className="w-full text-right text-xs border-collapse">
            <thead className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-stone-100 border-b-2 border-[#D4AF37]">
              <tr>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>شماره فاکتور و تاریخ</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>خریدار و فروشگاه</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>شهر مقصد و تماس</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>شرکت حمل و باربری</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>شماره بیجک / بارنامه</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>تعداد گونی / بسته</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>وضعیت محموله</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>اقدامات و پیامک</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DC]">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] flex items-center justify-center text-stone-400 mb-3 shadow-2xs">
                        <Search className="w-6 h-6 text-stone-400" />
                      </div>
                      <h4 className="text-sm font-extrabold text-stone-900">هیچ محموله‌ای یافت نشد</h4>
                      <p className="text-xs text-stone-500 mt-1">
                        با فیلتر انتخابی یا عبارت جستجوی «{searchQuery}» موردی ثبت نشده است.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                          setCarrierFilter('all');
                        }}
                        className="mt-3.5 px-4 py-1.5 bg-[#18181B] text-[#FAF7F2] hover:bg-stone-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        پاک کردن فیلترها و مشاهده همه
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shp) => (
                  <tr
                    key={shp.id}
                    className="hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80"
                  >
                    {/* Column 1: Invoice & Date */}
                    <td className="p-3.5 align-middle whitespace-nowrap">
                      <div className="font-mono font-bold text-stone-900 text-xs sm:text-sm">
                        فاکتور {shp.invoiceNumber}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                        <Calendar className="w-3 h-3 text-[#8C6D37]" />
                        <span>ارسال: {shp.dispatchDate}</span>
                      </div>
                    </td>

                    {/* Column 2: Buyer & Store */}
                    <td className="p-3.5 align-middle">
                      <strong className="font-extrabold text-stone-900 block text-xs sm:text-sm">
                        {shp.customerName}
                      </strong>
                      <span className="text-[11px] text-stone-600 block mt-0.5">
                        {shp.storeName}
                      </span>
                    </td>

                    {/* Column 3: Destination & Phone */}
                    <td className="p-3.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-stone-900 font-bold bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E6DEC8] inline-flex">
                        <MapPin className="w-3.5 h-3.5 text-[#8C6D37]" />
                        <span>{shp.destinationCity}</span>
                      </div>
                      <span className="font-mono text-[11px] text-stone-500 block mt-1 dir-ltr text-right">
                        {shp.phone}
                      </span>
                    </td>

                    {/* Column 4: Carrier */}
                    <td className="p-3.5 align-middle">
                      <span className="bg-[#FAF7F2] text-stone-900 border border-[#DDD5C0] font-bold px-2.5 py-1 rounded-lg text-xs inline-flex items-center gap-1.5 shadow-2xs">
                        <Truck className="w-3.5 h-3.5 text-[#8C6D37]" />
                        <span>{shp.carrier}</span>
                      </span>
                      <span className="text-[10px] text-stone-500 block mt-1">
                        کرایه: {shp.shippingFeeType}
                      </span>
                    </td>

                    {/* Column 5: Waybill Number */}
                    <td className="p-3.5 align-middle whitespace-nowrap">
                      {shp.waybillNumber === 'در انتظار بیجک' ? (
                        <span className="bg-amber-50 text-amber-900 border border-amber-300 font-bold px-2 py-1 rounded-lg text-[11px] inline-flex items-center gap-1 shadow-2xs">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>در انتظار صدور بیجک</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCopyWaybill(shp.waybillNumber)}
                          className="bg-[#18181B] text-[#D4AF37] px-2.5 py-1 rounded-lg font-mono font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs hover:bg-stone-900 transition-colors cursor-pointer group/btn"
                          title="کلیک برای کپی شماره بیجک"
                        >
                          <span>{shp.waybillNumber}</span>
                          {copiedWaybill === shp.waybillNumber ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                          )}
                        </button>
                      )}
                    </td>

                    {/* Column 6: Sack Count */}
                    <td className="p-3.5 align-middle whitespace-nowrap">
                      <span className="font-black text-stone-900 bg-stone-100 px-3 py-1 rounded-lg border border-stone-300 font-mono text-xs">
                        {shp.sackCount.toLocaleString('fa-IR')} گونی / بسته
                      </span>
                    </td>

                    {/* Column 7: Status */}
                    <td className="p-3.5 align-middle whitespace-nowrap">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 border shadow-2xs ${
                        shp.status === 'delivered_to_carrier'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : shp.status === 'received_by_customer'
                          ? 'bg-sky-50 text-sky-900 border-sky-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          shp.status === 'delivered_to_carrier' || shp.status === 'received_by_customer' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                        }`}></span>
                        <span>
                          {shp.status === 'delivered_to_carrier'
                            ? 'تحویل باربری شد'
                            : shp.status === 'received_by_customer'
                            ? 'رسیده به دست مشتری'
                            : 'بسته‌بندی در انبار'}
                        </span>
                      </span>
                    </td>

                    {/* Column 8: Actions */}
                    <td className="p-3.5 align-middle text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedShipmentForSMS(shp);
                            setIsCopiedSMS(false);
                            setIsSentSMS(false);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-stone-900 to-[#18181B] hover:from-black hover:to-stone-900 text-[#FAF7F2] rounded-xl transition-all flex items-center gap-1.5 border border-[#D4AF37]/60 hover:border-[#D4AF37] font-bold text-xs cursor-pointer shadow-xs hover:shadow-md group/btn active:scale-95"
                          title="مشاهده، ارسال پیامک و کپی اطلاعات بیجک"
                        >
                          <Send className="w-3.5 h-3.5 text-[#D4AF37] group-hover/btn:scale-110 transition-transform" />
                          <span>پیامک بیجک</span>
                        </button>
                      </div>
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
              نمایش {filteredShipments.length.toLocaleString('fa-IR')} از {shipments.length.toLocaleString('fa-IR')} محموله ارسالی
            </span>
            <span className="text-stone-300 hidden sm:inline">|</span>
            <span>
              مجموع کل گونی‌ها و کارتن‌ها: <strong className="text-stone-900 font-mono">{totalSacks.toLocaleString('fa-IR')}</strong> بسته
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">سرویس باربری اصلی:</span>
            <span className="font-bold text-stone-900 bg-white px-2.5 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>باربری وطن شوش و پیام‌گیر خیام</span>
            </span>
          </div>
        </div>

      </div>

      {/* MODAL 1: SMS Waybill Sender */}
      {selectedShipmentForSMS && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DFD7C2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900">
                    ارسال آنی پیامک شماره بیجک و بارنامه به مشتری
                  </h3>
                  <p className="text-xs text-stone-500">
                    ارسال مشخصات گونی‌ها، شماره بارنامه و تلفن هماهنگی باربری
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedShipmentForSMS(null)} 
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EBE4D5] flex items-center justify-between">
                <div>
                  <span className="text-stone-500 block text-[11px]">گیرنده محموله:</span>
                  <strong className="text-stone-900 font-bold text-xs sm:text-sm">{selectedShipmentForSMS.customerName} ({selectedShipmentForSMS.storeName})</strong>
                </div>
                <div className="text-left font-mono font-bold text-stone-800 dir-ltr">
                  {selectedShipmentForSMS.phone}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">متن پیامک آماده جهت ارسال:</label>
                <textarea
                  rows={8}
                  readOnly
                  value={getSMSMessage(selectedShipmentForSMS)}
                  className="w-full bg-[#FAF7F2] p-3 rounded-2xl border border-[#DDD5C0] font-sans leading-relaxed text-stone-900 outline-none text-xs"
                />
              </div>

              {isSentSMS && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>پیامک مشخصات بیجک از طریق سامانه پیامکی بازار با موفقیت به مشتری مخابره شد.</span>
                </div>
              )}

              {isCopiedSMS && (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>متن بیجک با موفقیت در کلیپ‌بورد کپی شد (آماده ارسال در تلگرام یا ایتا).</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsSentSMS(true);
                    setTimeout(() => {
                      setSelectedShipmentForSMS(null);
                    }, 1800);
                  }}
                  className="flex-1 bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 hover:from-black hover:to-stone-900 text-[#FAF7F2] font-black py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border border-[#D4AF37]/50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>ارسال پیامک با پنل پیامکی بازار</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getSMSMessage(selectedShipmentForSMS));
                    setIsCopiedSMS(true);
                    setTimeout(() => setIsCopiedSMS(false), 2500);
                  }}
                  className="bg-[#FAF7F2] hover:bg-[#E6DEC8] text-stone-800 font-bold px-4 py-2.5 rounded-xl border border-[#DDD5C0] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4 text-[#8C6D37]" />
                  <span>کپی متن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New Shipment */}
      {isNewShipmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DFD7C2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900">
                    ثبت حواله خروج و صدور بیجک باربری جدید
                  </h3>
                  <p className="text-xs text-stone-500">
                    ثبت اطلاعات کیسه‌ها و تحویل به باربری‌های طرف قرارداد بازار
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewShipmentModalOpen(false)} 
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">شماره فاکتور مرتبط:</label>
                  <input
                    type="text"
                    placeholder="مثال: ۱۴۰۳-۱۴۶"
                    value={newShipmentForm.invoiceNumber}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, invoiceNumber: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">نام و نام خانوادگی خریدار: *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حاج محمد یزدانی"
                    value={newShipmentForm.customerName}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, customerName: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">نام فروشگاه یا بنکداری:</label>
                  <input
                    type="text"
                    placeholder="مثال: پخش عمده یزدانی"
                    value={newShipmentForm.storeName}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, storeName: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] text-stone-900 outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">شماره موبایل گیرنده: *</label>
                  <input
                    type="text"
                    required
                    placeholder="0912..."
                    value={newShipmentForm.phone}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono text-stone-900 outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">شهر و استان مقصد: *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تبریز، راسته بازار"
                    value={newShipmentForm.destinationCity}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, destinationCity: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">شرکت حمل یا باربری: *</label>
                  <select
                    value={newShipmentForm.carrier}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, carrier: e.target.value as any })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
                  >
                    <option value="باربری وطن (شوش)">باربری وطن (شوش)</option>
                    <option value="تیپاکس بازار">تیپاکس بازار</option>
                    <option value="چاپار">چاپار</option>
                    <option value="باربری پیام‌گیر (خیام)">باربری پیام‌گیر (خیام)</option>
                    <option value="پیک موتوری لحظه‌ای (اسنپ‌باکس/الوپیک)">پیک موتوری لحظه‌ای</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">شماره بیجک یا بارنامه:</label>
                  <input
                    type="text"
                    placeholder="VTN-... یا خالی برای در انتظار بیجک"
                    value={newShipmentForm.waybillNumber}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, waybillNumber: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono text-stone-900 outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">تعداد گونی / کارتن:</label>
                  <input
                    type="number"
                    min={1}
                    value={newShipmentForm.sackCount}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, sackCount: Number(e.target.value) || 1 })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">نحوه تسویه کرایه باربری:</label>
                  <select
                    value={newShipmentForm.shippingFeeType}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, shippingFeeType: e.target.value as any })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
                  >
                    <option value="پس‌کرایه (به عهده مشتری)">پس‌کرایه (به عهده مشتری)</option>
                    <option value="پیش‌کرایه">پیش‌کرایه</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">وضعیت جاری بار:</label>
                  <select
                    value={newShipmentForm.status}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, status: e.target.value as any })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
                  >
                    <option value="packed">بسته‌بندی در انبار (در انتظار باربری)</option>
                    <option value="delivered_to_carrier">تحویل داده شده به باربری</option>
                    <option value="received_by_customer">رسیده به دست مشتری</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#EFE9DC]">
                <button
                  type="button"
                  onClick={() => setIsNewShipmentModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 hover:from-black hover:to-stone-900 text-[#FAF7F2] font-black rounded-xl transition-all shadow-md border border-[#D4AF37]/50 cursor-pointer"
                >
                  ثبت حواله خروج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
