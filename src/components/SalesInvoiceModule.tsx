import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Receipt, 
  Plus, 
  Search, 
  Printer, 
  Share2, 
  AlertTriangle, 
  CheckCircle, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Truck, 
  User, 
  Trash2,
  Boxes,
  Crown,
  Award,
  Sparkles,
  ShieldAlert,
  X,
  MapPin,
  Calendar,
  Store,
  Building2,
  Phone,
  ArrowUpDown,
  Filter,
  Check,
  Eye,
  TrendingUp,
  Tag,
  Clock,
  Layers,
  Copy,
  CheckCircle2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Invoice, Customer, Product, InvoiceItem, PackSize, CheckItem } from '../types';
import { InPersonInvoiceModal } from './admin/InPersonInvoiceModal';

interface SalesInvoiceModuleProps {
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
  checks?: CheckItem[];
  onAddInvoice: (invoice: Invoice) => void;
  onAddCustomer?: (customer: Customer) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: any) => void;
  isNewInvoiceModalOpen: boolean;
  setIsNewInvoiceModalOpen: (open: boolean) => void;
}

export const SalesInvoiceModule: React.FC<SalesInvoiceModuleProps> = ({
  invoices = [],
  customers = [],
  products = [],
  checks = [],
  onAddInvoice,
  onAddCustomer,
  onUpdateInvoiceStatus,
  isNewInvoiceModalOpen,
  setIsNewInvoiceModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_person' | 'cargo' | 'paid' | 'check'>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'amount_desc' | 'amount_asc' | 'packs_desc'>('date_desc');
  const [copiedInvoiceNumber, setCopiedInvoiceNumber] = useState<string | null>(null);

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

  // New Invoice Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [paymentType, setPaymentType] = useState<'cash' | 'check' | 'split'>('cash');
  const [checkNotes, setCheckNotes] = useState('چک صیادی بنفش ۴۵ روزه');
  const [shippingMethod, setShippingMethod] = useState('باربری وطن (شوش)');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  
  // Invoice items
  const [invoiceItems, setInvoiceItems] = useState<{
    productId: string;
    packCount: number;
  }[]>([
    { productId: products[0]?.id || '', packCount: 5 }
  ]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Calculate items with pricing based on customer tier
  const calculatedItems: InvoiceItem[] = invoiceItems.map(item => {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) {
      return {
        productId: item.productId,
        productName: 'کالا نامشخص',
        sku: 'SH-000',
        packCount: item.packCount,
        packSize: 6,
        totalUnits: item.packCount * 6,
        pricePerPack: 0,
        totalPrice: 0
      };
    }

    // Tier pricing logic: Colleague gets colleague price; others get wholesale
    const isColleague = selectedCustomer?.type === 'partner_wholesale' || selectedCustomer?.tier === 'tier_colleague' || selectedCustomer?.wholesaleLoyaltyTier === 'partner_gold_vip';
    const pricePerPack = isColleague ? prod.colleaguePricePerPack : prod.baseWholesalePricePerPack;
    const totalUnits = item.packCount * prod.packSize;
    const totalPrice = pricePerPack * item.packCount;

    return {
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      packCount: item.packCount,
      packSize: prod.packSize,
      totalUnits,
      pricePerPack,
      totalPrice,
    };
  });

  const subtotal = calculatedItems.reduce((s, i) => s + i.totalPrice, 0);
  const finalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

  // Check Risk Warning Logic (Fix 2)
  const customerChecks = selectedCustomer ? checks.filter(c => c.customerId === selectedCustomer.id) : [];
  const customerBouncedChecks = customerChecks.filter(c => c.status === 'bounced' || c.outcome === 'bounced');
  const customerClearedChecks = customerChecks.filter(c => c.status === 'cleared' || c.outcome === 'cleared_on_time');
  const hasBouncedHistory = customerBouncedChecks.length > 0;
  const isLowTrustScore = selectedCustomer ? selectedCustomer.trustScore < 70 : false;
  const showCheckWarning = paymentType === 'check' && (hasBouncedHistory || isLowTrustScore);

  // Loyalty Program Auto-Discount Recommendation (Fix 3)
  const loyaltyTier = selectedCustomer?.wholesaleLoyaltyTier;
  const suggestedLoyaltyDiscountPct = loyaltyTier === 'partner_gold_vip' ? 4 : loyaltyTier === 'partner_silver' ? 2 : 0;
  const calculatedLoyaltyDiscountToman = Math.round(subtotal * (suggestedLoyaltyDiscountPct / 100));

  const handleAddItemRow = () => {
    setInvoiceItems([...invoiceItems, { productId: products[0]?.id || '', packCount: 2 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, idx) => idx !== index));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `۱۴۰۳-${Math.floor(120 + Math.random() * 800)}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      storeName: selectedCustomer.storeName,
      phone: selectedCustomer.phone,
      city: selectedCustomer.city,
      date: '۱۴۰۳/۰۳/۰۵',
      items: calculatedItems,
      subtotalToman: subtotal,
      discountToman: discountAmount,
      shippingCostToman: shippingCost,
      finalAmountToman: finalAmount,
      paymentType,
      checkDetails: paymentType === 'check' ? checkNotes : undefined,
      status: paymentType === 'cash' ? 'processing' : 'pending_check',
      shippingMethod,
      notes: `فاکتور صادر شده به صورت ${paymentType === 'cash' ? 'نقدی' : 'چک صیادی'} برای ${selectedCustomer.storeName}`,
    };

    onAddInvoice(newInvoice);
    setIsNewInvoiceModalOpen(false);
    setSelectedInvoiceForPrint(newInvoice);
  };

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          inv.customerName.toLowerCase().includes(query) ||
          inv.storeName.toLowerCase().includes(query) ||
          inv.invoiceNumber.toLowerCase().includes(query) ||
          inv.city.toLowerCase().includes(query) ||
          (inv.phone && inv.phone.includes(query)) ||
          (inv.shippingMethod && inv.shippingMethod.toLowerCase().includes(query));

        if (!matchesSearch) return false;

        if (statusFilter === 'in_person') return !!inv.isOfficialInPerson;
        if (statusFilter === 'cargo') return !inv.isOfficialInPerson;
        if (statusFilter === 'paid') return inv.paymentType === 'cash' || inv.status === 'paid' || inv.status === 'delivered';
        if (statusFilter === 'check') return inv.paymentType === 'check';
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'amount_desc') return b.finalAmountToman - a.finalAmountToman;
        if (sortBy === 'amount_asc') return a.finalAmountToman - b.finalAmountToman;
        if (sortBy === 'packs_desc') {
          const packsA = a.items.reduce((s, i) => s + i.packCount, 0);
          const packsB = b.items.reduce((s, i) => s + i.packCount, 0);
          return packsB - packsA;
        }
        return 0; // default order
      });
  }, [invoices, searchQuery, statusFilter, sortBy]);

  // Overall metric totals
  const totalAmountAll = useMemo(() => filteredInvoices.reduce((s, inv) => s + inv.finalAmountToman, 0), [filteredInvoices]);
  const totalGrossAll = useMemo(() => filteredInvoices.reduce((s, inv) => s + inv.subtotalToman, 0), [filteredInvoices]);
  const totalDiscountAll = useMemo(() => filteredInvoices.reduce((s, inv) => s + (inv.discountToman || 0), 0), [filteredInvoices]);
  const totalPacksAll = useMemo(() => filteredInvoices.reduce((s, inv) => s + inv.items.reduce((sum, item) => sum + item.packCount, 0), 0), [filteredInvoices]);
  const totalUnitsAll = useMemo(() => filteredInvoices.reduce((s, inv) => s + inv.items.reduce((sum, item) => sum + (item.totalUnits || (item.packCount * (item.packSize || 6))), 0), 0), [filteredInvoices]);

  const inPersonCount = invoices.filter(i => !!i.isOfficialInPerson).length;
  const cargoCount = invoices.filter(i => !i.isOfficialInPerson).length;
  const paidCount = invoices.filter(i => i.paymentType === 'cash' || i.status === 'paid' || i.status === 'delivered').length;
  const checkCount = invoices.filter(i => i.paymentType === 'check').length;

  const handleCopyInvoiceNumber = (invNum: string) => {
    navigator.clipboard?.writeText(invNum);
    setCopiedInvoiceNumber(invNum);
    setTimeout(() => setCopiedInvoiceNumber(null), 2000);
  };

  return (
    <div id="sales-invoice-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl shadow-2xs">
            <Receipt className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-lg font-black text-[#18181B]">
              فروش، صدور فاکتور و قیمت‌گذاری چندسطحی
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              صدور فاکتور رسمی و غیررسمی با محاسبه خودکار تخفیف پارت و استعلام وضعیت ریسک چک
            </p>
          </div>
        </div>

        <button
          id="btn-open-new-invoice-modal"
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="bg-gradient-to-r from-[#18181B] via-stone-900 to-[#18181B] hover:from-stone-900 hover:to-black text-[#FAF7F2] font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg border border-[#D4AF37]/50 hover:border-[#D4AF37] cursor-pointer group active:scale-98"
          title="صدور فاکتور رسمی جدید برای خرید حضوری با ثبت مشخصات، اجناس و قیمت توافقی"
        >
          <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <span>+ صدور فاکتور جدید (خرید حضوری)</span>
        </button>
      </div>

      {/* Invoice List, Filters & Luxury Master Table */}
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
              <span className="font-bold text-[#D4AF37]">حالت تمام‌صفحه دفتر فاکتورهای فروش فعال است</span>
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
        
        {/* Module Header Inside Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE9DC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                <span>دفتر ثبت و کاردکس فاکتورهای فروش عمده و حضوری</span>
                <span className="text-[11px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-full">
                  {invoices.length.toLocaleString('fa-IR')} فاکتور کل
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                تفکیک فاکتورهای رسمی خرید حضوری در بازار بزرگ (سرای ملی) و سفارش‌های حواله باربری سراسری
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs text-stone-500 font-medium">مرتب‌سازی:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF7F2] text-xs font-bold text-stone-800 border border-[#DDD5C0] rounded-xl px-2.5 py-1.5 outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="date_desc">جدیدترین تاریخ صدور</option>
              <option value="amount_desc">بیشترین مبلغ فاکتور</option>
              <option value="amount_asc">کمترین مبلغ فاکتور</option>
              <option value="packs_desc">بیشترین تیراژ پک‌ها</option>
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
              <Receipt className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-stone-500 block truncate">فاکتورهای منطبق</span>
              <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                {filteredInvoices.length.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">فقره</span>
              </span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-stone-500 block truncate">مجموع خالص فاکتورها</span>
              <span className="text-sm sm:text-base font-black text-emerald-950 block truncate">
                {totalAmountAll.toLocaleString('fa-IR')} <span className="text-xs font-bold text-emerald-700">تومان</span>
              </span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8C6D37]/15 text-[#8C6D37] flex items-center justify-center shrink-0 shadow-2xs">
              <Boxes className="w-5 h-5 text-[#8C6D37]" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-stone-500 block truncate">تیراژ کل البسه</span>
              <span className="text-sm sm:text-base font-black text-stone-900 block truncate">
                {totalPacksAll.toLocaleString('fa-IR')} <span className="text-xs font-normal text-stone-600">پک</span>
                <span className="text-[11px] text-stone-400 mr-1">({totalUnitsAll.toLocaleString('fa-IR')} عدد)</span>
              </span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
              <CreditCard className="w-5 h-5 text-amber-700" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-stone-500 block truncate">وضعیت وصولی‌ها</span>
              <span className="text-xs sm:text-sm font-bold text-stone-800 block truncate">
                {paidCount.toLocaleString('fa-IR')} تسویه / {checkCount.toLocaleString('fa-IR')} چک
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
              <span>همه فاکتورها</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === 'all' ? 'bg-[#D4AF37] text-stone-950 font-black' : 'bg-stone-200 text-stone-700'
              }`}>
                {invoices.length.toLocaleString('fa-IR')}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('in_person')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'in_person'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-amber-900 hover:bg-amber-100/70 border border-amber-200'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>خرید حضوری سرای ملی</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === 'in_person' ? 'bg-amber-200 text-amber-950 font-black' : 'bg-amber-100 text-amber-800'
              }`}>
                {inPersonCount.toLocaleString('fa-IR')}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('cargo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'cargo'
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-stone-700 hover:bg-sky-50 border border-stone-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-sky-600" />
              <span>ارسال باربری سراسری</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === 'cargo' ? 'bg-sky-200 text-sky-950 font-black' : 'bg-stone-200 text-stone-700'
              }`}>
                {cargoCount.toLocaleString('fa-IR')}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'paid'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>تسویه‌شده / نقد</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === 'paid' ? 'bg-emerald-200 text-emerald-950 font-black' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {paidCount.toLocaleString('fa-IR')}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('check')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'check'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-stone-700 hover:bg-amber-50 border border-[#DDD5C0]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-700" />
              <span>چک صیادی</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === 'check' ? 'bg-amber-300 text-stone-950 font-black' : 'bg-stone-200 text-stone-700'
              }`}>
                {checkCount.toLocaleString('fa-IR')}
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
              placeholder="جستجوی فاکتور، خریدار، فروشگاه، شهر..."
              className="w-full bg-[#FAF7F2] text-xs pr-10 pl-8 py-2.5 rounded-xl border border-[#DDD5C0] text-stone-900 outline-none focus:bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
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
                    <span>شماره و تاریخ صدور</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>خریدار و نام فروشگاه</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>مقصد و شیوه تحویل</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>حجم سفارش (پک / تیراژ)</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>مبلغ کل فاکتور</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>شیوه تسویه</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>وضعیت سفارش</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1.5">
                    <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>چاپ و تحویل</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DC]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] flex items-center justify-center text-stone-400 mb-3 shadow-2xs">
                        <Search className="w-6 h-6 text-stone-400" />
                      </div>
                      <h4 className="text-sm font-extrabold text-stone-900">هیچ فاکتوری یافت نشد</h4>
                      <p className="text-xs text-stone-500 mt-1">
                        با فیلتر انتخابی یا عبارت جستجوی «{searchQuery}» موردی در سیستم ثبت نشده است.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                        }}
                        className="mt-3.5 px-4 py-1.5 bg-[#18181B] text-[#FAF7F2] hover:bg-stone-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        پاک کردن فیلترها و مشاهده همه
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv, idx) => {
                  const totalPacks = inv.items.reduce((s, i) => s + i.packCount, 0);
                  const totalUnits = inv.items.reduce((s, i) => s + (i.totalUnits || (i.packCount * (i.packSize || 6))), 0);
                  const hasNegotiated = inv.items.some(i => i.isNegotiatedPrice);

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80"
                    >
                      {/* Column 1: Number & Date */}
                      <td className="p-3.5 align-middle">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyInvoiceNumber(inv.invoiceNumber)}
                            className="bg-[#18181B] text-[#D4AF37] px-2.5 py-1 rounded-lg font-mono font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs hover:bg-stone-900 transition-colors cursor-pointer group/btn"
                            title="کلیک برای کپی شماره فاکتور"
                          >
                            <span>#{inv.invoiceNumber}</span>
                            {copiedInvoiceNumber === inv.invoiceNumber ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-stone-500 font-mono">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{inv.date}</span>
                        </div>
                        {inv.isOfficialInPerson ? (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-amber-100/90 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300/80 shadow-2xs">
                            <Store className="w-3 h-3 text-amber-700" />
                            <span>خرید حضوری سرای ملی</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                            <Truck className="w-3 h-3 text-stone-500" />
                            <span>ارسال باربری سراسری</span>
                          </span>
                        )}
                      </td>

                      {/* Column 2: Customer & Store */}
                      <td className="p-3.5 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8C6D37] to-[#D4AF37] text-white font-extrabold flex items-center justify-center text-xs shadow-2xs shrink-0">
                            {inv.customerName ? inv.customerName.charAt(0) : 'م'}
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold text-stone-900 block text-xs sm:text-sm truncate">
                              {inv.customerName}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-stone-600 mt-0.5 truncate">
                              <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                              <span className="truncate">{inv.storeName || 'مشتری آزاد / همکار'}</span>
                            </div>
                            {inv.phone && (
                              <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono mt-0.5">
                                <Phone className="w-2.5 h-2.5 text-stone-400" />
                                <span>{inv.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Destination & Shipping */}
                      <td className="p-3.5 align-middle">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-900 bg-stone-100/90 px-2 py-0.5 rounded-lg border border-stone-200">
                          <MapPin className="w-3 h-3 text-stone-600" />
                          <span>{inv.city}</span>
                        </span>
                        <div className="text-[11px] text-stone-600 mt-1 max-w-[180px] line-clamp-1" title={inv.shippingMethod}>
                          {inv.shippingMethod}
                        </div>
                        {inv.trackingCode && (
                          <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                            کد رهگیری: {inv.trackingCode}
                          </span>
                        )}
                      </td>

                      {/* Column 4: Volume & Units */}
                      <td className="p-3.5 align-middle">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-300 text-xs">
                            {totalPacks.toLocaleString('fa-IR')} پک
                          </span>
                          <span className="text-[11px] text-stone-600 font-medium">
                            ({totalUnits.toLocaleString('fa-IR')} عدد)
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
                          <span>{inv.items.length.toLocaleString('fa-IR')} مدل پوشاک</span>
                          {hasNegotiated && (
                            <span className="text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-300 px-1 py-0.2 rounded">
                              قیمت توافقی ✓
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 5: Total Amount */}
                      <td className="p-3.5 align-middle whitespace-nowrap">
                        <div className="text-sm font-black text-stone-950 font-sans tracking-tight">
                          {inv.finalAmountToman.toLocaleString('fa-IR')}{' '}
                          <span className="text-xs font-bold text-[#8C6D37]">تومان</span>
                        </div>
                        {inv.discountToman > 0 && (
                          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                            تخفیف: {inv.discountToman.toLocaleString('fa-IR')} تومان
                          </div>
                        )}
                      </td>

                      {/* Column 6: Payment Method */}
                      <td className="p-3.5 align-middle">
                        {inv.paymentType === 'cash' ? (
                          <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold px-2 py-1 rounded-lg text-[11px] inline-flex items-center gap-1.5 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span>نقدی / کارتخوان دفتر</span>
                          </span>
                        ) : inv.paymentType === 'split' ? (
                          <span className="bg-teal-50 text-teal-900 border border-teal-300 font-bold px-2 py-1 rounded-lg text-[11px] inline-flex items-center gap-1.5 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                            <span>کارت به کارت شتابی</span>
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="bg-amber-50 text-amber-900 border border-amber-300 font-bold px-2 py-1 rounded-lg text-[11px] inline-flex items-center gap-1.5 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                              <span>چک صیادی بنفش</span>
                            </span>
                            {inv.checkDetails && (
                              <span className="text-[10px] text-stone-500 block truncate max-w-[130px]">
                                {inv.checkDetails}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Column 7: Status */}
                      <td className="p-3.5 align-middle">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 border shadow-2xs ${
                          inv.status === 'shipped' || inv.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : inv.status === 'processing' || inv.status === 'paid'
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : 'bg-stone-100 text-stone-800 border-stone-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            inv.status === 'shipped' || inv.status === 'delivered' ? 'bg-emerald-600 animate-pulse' :
                            inv.status === 'processing' || inv.status === 'paid' ? 'bg-amber-600' : 'bg-stone-500'
                          }`}></span>
                          <span>
                            {inv.status === 'shipped' || inv.status === 'delivered'
                              ? 'تحویل شد'
                              : inv.status === 'processing'
                              ? 'در حال بسته‌بندی'
                              : inv.status === 'paid'
                              ? 'تسویه و تحویل شد'
                              : 'در انتظار تایید چک'}
                          </span>
                        </span>
                      </td>

                      {/* Column 8: Actions */}
                      <td className="p-3.5 align-middle text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedInvoiceForPrint(inv)}
                            className="px-3 py-1.5 bg-gradient-to-r from-stone-900 to-[#18181B] hover:from-black hover:to-stone-900 text-[#FAF7F2] rounded-xl transition-all flex items-center gap-1.5 border border-[#D4AF37]/60 hover:border-[#D4AF37] font-bold text-xs cursor-pointer shadow-xs hover:shadow-md group/btn active:scale-95"
                            title="مشاهده، چاپ رسمی و دریافت فایل چاپی فاکتور"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#D4AF37] group-hover/btn:scale-110 transition-transform" />
                            <span>چاپ فاکتور رسمی</span>
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
        <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-stone-800">
              نمایش {filteredInvoices.length.toLocaleString('fa-IR')} از {invoices.length.toLocaleString('fa-IR')} فاکتور صادر شده
            </span>
            <span className="text-stone-300 hidden sm:inline">|</span>
            <span>
              مجموع ناخالص: <strong className="text-stone-900 font-mono">{totalGrossAll.toLocaleString('fa-IR')}</strong> تومان
            </span>
            <span className="text-stone-300 hidden sm:inline">|</span>
            <span>
              تخفیف همکاری: <strong className="text-emerald-800 font-mono">{totalDiscountAll.toLocaleString('fa-IR')}</strong> تومان
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">مجموع کل قابل دریافت:</span>
            <span className="text-sm font-black text-stone-950 font-sans bg-white px-3 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs">
              {totalAmountAll.toLocaleString('fa-IR')} <span className="text-xs font-bold text-[#8C6D37]">تومان</span>
            </span>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------------- */}
      {/* IN-PERSON FORMAL COMMERCIAL INVOICE MODAL & PRINT SHEET             */}
      {/* ------------------------------------------------------------------- */}
      <InPersonInvoiceModal
        isOpen={isNewInvoiceModalOpen || selectedInvoiceForPrint !== null}
        onClose={() => {
          setIsNewInvoiceModalOpen(false);
          setSelectedInvoiceForPrint(null);
        }}
        products={products}
        customers={customers}
        invoices={invoices}
        onAddInvoice={onAddInvoice}
        onAddCustomer={onAddCustomer}
        initialInvoiceToView={selectedInvoiceForPrint}
      />

    </div>
  );
};
