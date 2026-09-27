import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Upload, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertCircle, 
  Phone, 
  MapPin, 
  CreditCard, 
  MessageSquare, 
  Send, 
  Clock, 
  Tag, 
  CheckCircle, 
  FileText, 
  TrendingUp, 
  Store,
  Share2,
  ChevronLeft,
  FileSpreadsheet,
  Crown,
  Award,
  Sparkles,
  UserCheck,
  AlertTriangle,
  Gift,
  ArrowUpRight,
  Building2,
  DollarSign,
  CheckCircle2,
  Calendar,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Customer, CustomerType, CustomerTier, PaymentTerms, CheckItem, Invoice, WholesaleLoyaltyTier } from '../types';
import { ExcelCustomerModal } from './common/ExcelCustomerModal';

interface CustomerCRMModuleProps {
  customers: Customer[];
  checks?: CheckItem[];
  invoices?: Invoice[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onImportCustomers: (importedList: Customer[]) => void;
}

export const CustomerCRMModule: React.FC<CustomerCRMModuleProps> = ({
  customers = [],
  checks = [],
  invoices = [],
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onImportCustomers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTrustFilter, setSelectedTrustFilter] = useState<string>('all');
  const [selectedLoyaltyFilter, setSelectedLoyaltyFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all_customers' | 'loyalty_club' | 'follow_ups' | 'telegram_importer'>('all_customers');
  
  // Selected Customer for Details
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [messageTargetCustomer, setMessageTargetCustomer] = useState<Customer | null>(null);
  const [generatedMessageText, setGeneratedMessageText] = useState('');

  // Referral Modal
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [referringCustomer, setReferringCustomer] = useState<Customer | null>(null);
  const [newReferredName, setNewReferredName] = useState('');
  const [newReferredPhone, setNewReferredPhone] = useState('');
  const [newReferredCity, setNewReferredCity] = useState('');

  // 600 Telegram Importer State
  const [rawImportText, setRawImportText] = useState('');
  const [importedPreview, setImportedPreview] = useState<Customer[]>([]);

  // New Customer Form State
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    storeName: '',
    phone: '',
    city: 'اصفهان',
    province: 'اصفهان',
    type: 'shop_keeper' as CustomerType,
    tier: 'tier_wholesale_1' as CustomerTier,
    wholesaleLoyaltyTier: 'partner_regular' as WholesaleLoyaltyTier,
    trustScore: 85,
    paymentTerms: 'cash_only' as PaymentTerms,
    checkLimitToman: 20000000,
    channelSource: 'telegram' as 'telegram' | 'eitaa' | 'rubika' | 'bale' | 'instagram' | 'in_person',
    preferredShipping: 'باربری وطن' as 'باربری وطن' | 'تیپاکس' | 'چاپار' | 'پست پیشتاز' | 'باربری پیام‌گیر',
    tags: 'مغازه‌دار، تلگرام',
    notes: '',
  });

  // Helper: Get Check Risk History for a customer (Fix 2)
  const getCustomerCheckStats = (customerId: string) => {
    const customerChecks = checks.filter(c => c.customerId === customerId);
    const clearedCount = customerChecks.filter(c => c.status === 'cleared' || c.outcome === 'cleared_on_time').length;
    const bouncedCount = customerChecks.filter(c => c.status === 'bounced' || c.outcome === 'bounced').length;
    const pendingCount = customerChecks.filter(c => c.status === 'pending' || c.status === 'in_collection').length;
    const totalAmount = customerChecks.reduce((s, c) => s + c.amountToman, 0);

    return {
      checks: customerChecks,
      clearedCount,
      bouncedCount,
      pendingCount,
      totalAmount,
      hasBouncedHistory: bouncedCount > 0,
      isCleanHistory: clearedCount > 0 && bouncedCount === 0,
    };
  };

  // Helper: Determine Wholesale Loyalty Tier from purchase volume (Fix 3)
  const getCustomerLoyaltyTier = (cust: Customer): { tier: WholesaleLoyaltyTier; label: string; discountPct: number; nextTierThresholdToman: number; progressPct: number } => {
    const volume = cust.totalPurchasesToman || 0;
    
    if (volume >= 150000000 || cust.wholesaleLoyaltyTier === 'partner_gold_vip') {
      return {
        tier: 'partner_gold_vip',
        label: 'همکار طلایی VIP',
        discountPct: 4,
        nextTierThresholdToman: 150000000,
        progressPct: 100,
      };
    } else if (volume >= 50000000 || cust.wholesaleLoyaltyTier === 'partner_silver') {
      const progress = Math.min(100, Math.round(((volume - 50000000) / 100000000) * 100));
      return {
        tier: 'partner_silver',
        label: 'همکار نقره‌ای',
        discountPct: 2,
        nextTierThresholdToman: 150000000,
        progressPct: Math.max(20, progress),
      };
    } else {
      const progress = Math.min(100, Math.round((volume / 50000000) * 100));
      return {
        tier: 'partner_regular',
        label: 'همکار عادی (برنزی)',
        discountPct: 0,
        nextTierThresholdToman: 50000000,
        progressPct: progress,
      };
    }
  };

  // Filtered list
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.includes(searchQuery) || c.storeName.includes(searchQuery) || c.phone.includes(searchQuery) || c.city.includes(searchQuery);
    const matchesType = selectedType === 'all' || c.type === selectedType;
    const matchesTrust = selectedTrustFilter === 'all' 
      ? true 
      : selectedTrustFilter === 'high' 
        ? c.trustScore >= 85 
        : selectedTrustFilter === 'medium' 
          ? (c.trustScore >= 60 && c.trustScore < 85) 
          : c.trustScore < 60;
    
    const loyalty = getCustomerLoyaltyTier(c);
    const matchesLoyalty = selectedLoyaltyFilter === 'all' || loyalty.tier === selectedLoyaltyFilter;

    return matchesSearch && matchesType && matchesTrust && matchesLoyalty;
  });

  // Wholesale & Colleague buyers for Loyalty Tab (Fix 3)
  const wholesaleCustomers = customers.filter(c => c.type === 'partner_wholesale' || c.type === 'shop_keeper' || c.totalPurchasesToman >= 30000000);
  const goldVipCount = wholesaleCustomers.filter(c => getCustomerLoyaltyTier(c).tier === 'partner_gold_vip').length;
  const silverCount = wholesaleCustomers.filter(c => getCustomerLoyaltyTier(c).tier === 'partner_silver').length;
  const regularCount = wholesaleCustomers.filter(c => getCustomerLoyaltyTier(c).tier === 'partner_regular').length;

  const inactiveQueue = customers.filter(c => c.followUpRequired);

  // Handle Telegram 600 list parsing
  const handleParseTelegramList = () => {
    const lines = rawImportText.split('\n').filter(line => line.trim().length > 0);
    const parsed: Customer[] = [];

    lines.forEach((line, index) => {
      const parts = line.split(/[,|\t\-–]/).map(p => p.trim());
      const name = parts[0] || `مشتری تلگرام ${index + 1}`;
      const phone = parts[1] || `09${Math.floor(100000000 + Math.random() * 900000000)}`;
      const city = parts[2] || 'تهران/شهرستان';
      const storeName = parts[3] || `پوشاک ${name}`;

      parsed.push({
        id: `cust-imp-${Date.now()}-${index}`,
        name,
        storeName,
        phone,
        city,
        province: city,
        type: 'shop_keeper',
        tier: 'tier_wholesale_1',
        wholesaleLoyaltyTier: 'partner_regular',
        totalPacksPurchased: 0,
        referralCount: 0,
        trustScore: 75,
        paymentTerms: 'cash_only',
        checkLimitToman: 0,
        currentActiveCheckToman: 0,
        totalPurchasesToman: 0,
        orderCount: 0,
        lastOrderDate: '-',
        lastContactDate: '۱۴۰۳/۰۳/۰۱',
        channelSource: 'telegram',
        preferredShipping: 'باربری وطن',
        tags: ['تلگرام_ایمپورت'],
        notes: 'ایمپورت شده از لیست تلگرام.',
      });
    });

    setImportedPreview(parsed);
  };

  const handleApplyImport = () => {
    if (importedPreview.length === 0) return;
    onImportCustomers(importedPreview);
    setImportedPreview([]);
    setRawImportText('');
    setActiveTab('all_customers');
  };

  // Open 1-Click Message
  const handleOpenFollowUpMessage = (cust: Customer) => {
    setMessageTargetCustomer(cust);
    const message = `سلام جناب ${cust.name} عزیز 🌸
وقت شما بخیر از تولید و پخش عمده پوشاک من و تو (بازار بزرگ تهران).
پارت جدید شلوارهای بگ کتان لایت و راحتی نخی تابستانه با رنگ‌بندی کامل آماده ارسال با باربری ${cust.preferredShipping} به مقصد ${cust.city} می‌باشد.
جهت مشاهده لیست قیمت و ثبت سفارش سریع پک در خدمتیم.`;
    setGeneratedMessageText(message);
    setIsSendMessageModalOpen(true);
  };

  // Handle Save New Customer
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustForm.name.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustForm.name,
      storeName: newCustForm.storeName || `پوشاک ${newCustForm.name}`,
      phone: newCustForm.phone,
      city: newCustForm.city,
      province: newCustForm.province,
      type: newCustForm.type,
      tier: newCustForm.tier,
      wholesaleLoyaltyTier: newCustForm.wholesaleLoyaltyTier,
      totalPacksPurchased: 0,
      referralCount: 0,
      trustScore: Number(newCustForm.trustScore) || 80,
      paymentTerms: newCustForm.paymentTerms,
      checkLimitToman: Number(newCustForm.checkLimitToman) || 0,
      currentActiveCheckToman: 0,
      totalPurchasesToman: 0,
      orderCount: 0,
      lastOrderDate: 'ثبت جدید',
      lastContactDate: '۱۴۰۳/۰۳/۰۱',
      channelSource: newCustForm.channelSource,
      preferredShipping: newCustForm.preferredShipping,
      tags: newCustForm.tags.split('،').map(t => t.trim()).filter(Boolean),
      notes: newCustForm.notes,
    };

    onAddCustomer(newCust);
    setIsAddCustomerOpen(false);
  };

  // Handle Add Referral for a Customer (Fix 3)
  const handleSaveReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referringCustomer || !newReferredName.trim()) return;

    const updatedCustomer: Customer = {
      ...referringCustomer,
      referralCount: (referringCustomer.referralCount || 0) + 1,
      notes: `${referringCustomer.notes || ''}\n[معرفی همکار: ${newReferredName} (${newReferredPhone} - ${newReferredCity})]`.trim(),
    };

    // Also optionally add the referred customer to the database
    const newReferredCustomer: Customer = {
      id: `cust-ref-${Date.now()}`,
      name: newReferredName,
      storeName: `پوشاک ${newReferredName}`,
      phone: newReferredPhone || `09${Math.floor(100000000 + Math.random() * 900000000)}`,
      city: newReferredCity || 'شهرستان',
      province: newReferredCity || 'شهرستان',
      type: 'shop_keeper',
      tier: 'tier_wholesale_1',
      wholesaleLoyaltyTier: 'partner_regular',
      totalPacksPurchased: 0,
      referralCount: 0,
      referredByCustomerId: referringCustomer.id,
      trustScore: 80,
      paymentTerms: 'cash_only',
      checkLimitToman: 0,
      currentActiveCheckToman: 0,
      totalPurchasesToman: 0,
      orderCount: 0,
      lastOrderDate: 'ثبت جدید با معرفی',
      lastContactDate: '۱۴۰۳/۰۳/۰۱',
      channelSource: 'in_person',
      preferredShipping: 'باربری وطن',
      tags: ['معرفی_شده', `معرف_${referringCustomer.name}`],
      notes: `معرفی‌شده توسط همکار محترم: ${referringCustomer.name} (${referringCustomer.storeName})`,
    };

    onUpdateCustomer(updatedCustomer);
    onAddCustomer(newReferredCustomer);

    setIsReferralModalOpen(false);
    setReferringCustomer(null);
    setNewReferredName('');
    setNewReferredPhone('');
    setNewReferredCity('');
  };

  return (
    <div id="customer-crm-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl shadow-2xs">
                <Users className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#18181B]">
                  مدیریت مشتریان و CRM (اعتبارسنجی سابقه چک و باشگاه همکاران)
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  سامانه سابقه چک‌های صیادی، سطوح وفاداری عمده‌فروشان و باشگاه معرفی همکاران بنکدار
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-open-excel-modal"
              onClick={() => setIsExcelModalOpen(true)}
              className="text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8] text-[#18181B] border border-[#DDD5C0] font-bold px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#8C6D37]" />
              <span>ورود و خروجی با اکسل</span>
            </button>

            <button
              id="btn-open-telegram-importer"
              onClick={() => setActiveTab('telegram_importer')}
              className="text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8] text-[#18181B] border border-[#DDD5C0] font-bold px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-4 h-4 text-[#8C6D37]" />
              <span>ایمپورت سریع متنی</span>
            </button>

            <button
              id="btn-open-add-customer-modal"
              onClick={() => setIsAddCustomerOpen(true)}
              className="text-xs bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#3F3F46]"
            >
              <UserPlus className="w-4 h-4 text-[#D4AF37]" />
              <span>+ ثبت مشتری جدید</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E6DEC8] text-xs flex-wrap">
          <button
            onClick={() => setActiveTab('all_customers')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'all_customers'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            همه مشتریان و سابقه چک ({customers.length})
          </button>

          <button
            onClick={() => setActiveTab('loyalty_club')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'loyalty_club'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>باشگاه همکاران و عمده‌فروشان (تخفیف حجمی)</span>
            <span className="text-[10px] bg-[#D4AF37] text-[#18181B] px-1.5 py-0.2 rounded-full font-black">
              {wholesaleCustomers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('follow_ups')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'follow_ups'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <span>صف پیگیری مشتریان غیرفعال</span>
            {inactiveQueue.length > 0 && (
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                activeTab === 'follow_ups' ? 'bg-[#D4AF37] text-[#18181B]' : 'bg-rose-500 text-white'
              }`}>
                {inactiveQueue.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('telegram_importer')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'telegram_importer'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            ابزار ایمپورت سریع متن
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* TAB 1: ALL CUSTOMERS & CHECK RISK HISTORY (Fix 2)                   */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'all_customers' && (
        <div className="space-y-4">
          
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px] flex-wrap">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام مشتری، نام فروشگاه، شماره موبایل یا شهر..."
                  className="w-full bg-[#FAF7F2] text-xs pr-9 pl-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:border-[#D4AF37] focus:bg-white outline-none text-stone-900 font-medium"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#FAF7F2] text-xs py-2.5 px-3 rounded-xl border border-[#DDD5C0] text-stone-800 outline-none font-medium"
              >
                <option value="all">همه انواع مشتری</option>
                <option value="shop_keeper">مغازه‌دار شهرستان</option>
                <option value="partner_wholesale">عمده‌فروش همکار</option>
                <option value="online_shop">آنلاین‌شاپ و فروشگاه اینترنتی</option>
                <option value="retail">مشتری تکی و مصرف‌کننده</option>
              </select>

              <select
                value={selectedTrustFilter}
                onChange={(e) => setSelectedTrustFilter(e.target.value)}
                className="bg-[#FAF7F2] text-xs py-2.5 px-3 rounded-xl border border-[#DDD5C0] text-stone-800 outline-none font-medium"
              >
                <option value="all">همه وضعیت‌های چک و اعتبار</option>
                <option value="high">خوش‌حساب صیادی (۸۵+)</option>
                <option value="medium">متوسط (۶۰ تا ۸۴)</option>
                <option value="low">دارای سابقه چک برگشتی / ریسک بالا</option>
              </select>
            </div>

            <span className="text-xs text-[#8C6D37] font-bold">
              نمایش {filteredCustomers.length} از {customers.length} مخاطب
            </span>
          </div>

          {/* Customers Table Container */}
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
                  <span className="font-bold text-[#D4AF37]">حالت تمام‌صفحه دفتر مشتریان و همکاران عمده فعال است</span>
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
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                    <span>دفتر جامع مشتریان، بنکداران و همکاران عمده‌فروش سراسر کشور</span>
                    <span className="text-[11px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-full font-mono">
                      {customers.length.toLocaleString('fa-IR')} مخاطب کل
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    پایش سوابق وصولی چک‌های صیادی، سقف اعتبار خرید، باشگاه وفاداری و معرفی همکاران جدید
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
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

                <div className="text-xs text-stone-500 font-medium hidden sm:flex items-center gap-1">
                  <span>نمای جاری:</span>
                  <strong className="text-stone-900 font-black">{filteredCustomers.length.toLocaleString('fa-IR')} مشتری</strong>
                </div>
              </div>
            </div>

            {/* Quick Metrics Ribbon */}
            {(() => {
              const totalPurchasesSum = filteredCustomers.reduce((s, c) => s + c.totalPurchasesToman, 0);
              const checkEligibleCount = filteredCustomers.filter(c => c.paymentTerms === 'check_eligible').length;
              const totalReferrals = filteredCustomers.reduce((s, c) => s + (c.referralCount || 0), 0);

              return (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-2xs">
                      <Users className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-500 block truncate">مخاطبان فیلترشده</span>
                      <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                        {filteredCustomers.length.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">همکار</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-500 block truncate">مجموع خرید ثبت‌شده</span>
                      <span className="text-sm sm:text-base font-black text-emerald-950 block truncate">
                        {totalPurchasesSum.toLocaleString('fa-IR')} <span className="text-xs font-bold text-emerald-700">تومان</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8C6D37]/15 text-[#8C6D37] flex items-center justify-center shrink-0 shadow-2xs">
                      <CreditCard className="w-5 h-5 text-[#8C6D37]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-500 block truncate">اعتبار چک صیادی</span>
                      <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                        {checkEligibleCount.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">مشتری مجاز</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                      <Gift className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-500 block truncate">معرفی همکاران جدید</span>
                      <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                        {totalReferrals.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">معرفی</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Master Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#E6DEC8] shadow-2xs">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-stone-100 border-b-2 border-[#D4AF37]">
                  <tr>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>نام مشتری و فروشگاه</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>تماس و موقعیت</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>نوع و سطح وفاداری</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>سابقه اعتبار چک (Sayad Risk)</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>شرایط پرداخت و سقف</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>مجموع خرید کل</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>معرفی همکار</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>اقدام سریع</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DC]">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] flex items-center justify-center text-stone-400 mb-3 shadow-2xs">
                            <Search className="w-6 h-6 text-stone-400" />
                          </div>
                          <h4 className="text-sm font-extrabold text-stone-900">هیچ مشتری‌ای یافت نشد</h4>
                          <p className="text-xs text-stone-500 mt-1">
                            با فیلتر انتخابی یا عبارت جستجوی «{searchQuery}» مخاطبی ثبت نشده است.
                          </p>
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedType('all');
                              setSelectedTrustFilter('all');
                            }}
                            className="mt-3.5 px-4 py-1.5 bg-[#18181B] text-[#FAF7F2] hover:bg-stone-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            مشاهده همه مخاطبان
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const checkStats = getCustomerCheckStats(cust.id);
                      const loyalty = getCustomerLoyaltyTier(cust);

                      return (
                        <tr
                          key={cust.id}
                          className="hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80"
                        >
                          {/* Column 1: Name & Store */}
                          <td className="p-3.5 align-middle">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8C6D37] to-[#D4AF37] text-white font-black flex items-center justify-center text-xs shadow-2xs shrink-0">
                                {cust.name ? cust.name.charAt(0) : 'م'}
                              </div>
                              <div className="min-w-0">
                                <span
                                  onClick={() => setSelectedCustomer(cust)}
                                  className="font-extrabold text-stone-900 hover:text-[#8C6D37] cursor-pointer block text-xs sm:text-sm truncate transition-colors"
                                >
                                  {cust.name}
                                </span>
                                <div className="flex items-center gap-1 text-[11px] text-stone-600 mt-0.5 truncate">
                                  <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                                  <span className="truncate">{cust.storeName}</span>
                                </div>
                                {cust.tags.length > 0 && (
                                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                                    {cust.tags.slice(0, 2).map((t, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[9px] bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-1.5 py-0.2 rounded-md font-bold"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Phone & City */}
                          <td className="p-3.5 align-middle whitespace-nowrap">
                            <div className="font-mono font-bold text-stone-900 text-xs dir-ltr text-right">
                              {cust.phone}
                            </div>
                            <div className="text-[11px] text-stone-600 flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                              <span className="font-medium">{cust.city}</span>
                            </div>
                          </td>

                          {/* Column 3: Type & Loyalty */}
                          <td className="p-3.5 align-middle whitespace-nowrap">
                            <div className="space-y-1">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${
                                  cust.type === 'partner_wholesale'
                                    ? 'bg-[#FAF7F2] text-[#8C6D37] border-[#DDD5C0]'
                                    : cust.type === 'online_shop'
                                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                                    : cust.type === 'retail'
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                    : 'bg-stone-100 text-stone-800 border-stone-200'
                                }`}
                              >
                                {cust.type === 'partner_wholesale'
                                  ? 'عمده‌فروش همکار'
                                  : cust.type === 'online_shop'
                                  ? 'آنلاین‌شاپ / فروشگاه'
                                  : cust.type === 'retail'
                                  ? 'مشتری تکی'
                                  : 'مغازه‌دار شهرستان'}
                              </span>
                              {loyalty.tier === 'partner_gold_vip' && (
                                <div className="text-[10px] text-[#8C6D37] font-black flex items-center gap-1">
                                  <Crown className="w-3 h-3 text-[#D4AF37]" />
                                  <span>طلایی VIP (۴٪ تخفیف)</span>
                                </div>
                              )}
                              {loyalty.tier === 'partner_silver' && (
                                <div className="text-[10px] text-stone-600 font-bold flex items-center gap-1">
                                  <Award className="w-3 h-3 text-stone-400" />
                                  <span>نقره‌ای (۲٪ تخفیف)</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Column 4: Check Risk */}
                          <td className="p-3.5 align-middle whitespace-nowrap">
                            {checkStats.hasBouncedHistory ? (
                              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-900 border border-rose-200 px-2.5 py-1 rounded-lg font-bold text-[11px] shadow-2xs">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                <span>سابقه {checkStats.bouncedCount} چک برگشتی</span>
                              </span>
                            ) : checkStats.isCleanHistory ? (
                              <div>
                                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-lg font-bold text-[11px] shadow-2xs">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>{checkStats.clearedCount} چک وصول به‌موقع</span>
                                </span>
                                <div className="text-[10px] text-stone-500 mt-1 font-mono">
                                  امتیاز اعتبار: {cust.trustScore.toLocaleString('fa-IR')}/۱۰۰
                                </div>
                              </div>
                            ) : (
                              <span className="text-[11px] text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-lg inline-block">
                                بدون سابقه چک صیادی
                              </span>
                            )}
                          </td>

                          {/* Column 5: Payment Terms */}
                          <td className="p-3.5 align-middle whitespace-nowrap">
                            {cust.paymentTerms === 'check_eligible' ? (
                              <div>
                                <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1.5 shadow-2xs">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>مجاز به چک صیادی</span>
                                </span>
                                <div className="text-[10px] text-stone-500 mt-1">
                                  سقف: {(cust.checkLimitToman / 1000000).toLocaleString('fa-IR')} میلیون تومان
                                </div>
                              </div>
                            ) : (
                              <span className="text-[11px] font-bold text-stone-800 bg-[#FAF7F2] border border-[#DDD5C0] px-2.5 py-0.5 rounded-lg inline-block">
                                فقط نقدی / کارتخوان
                              </span>
                            )}
                          </td>

                          {/* Column 6: Total Purchases */}
                          <td className="p-3.5 align-middle whitespace-nowrap">
                            <div className="text-sm font-black text-stone-950 font-sans tracking-tight">
                              {cust.totalPurchasesToman.toLocaleString('fa-IR')}{' '}
                              <span className="text-xs font-bold text-[#8C6D37]">تومان</span>
                            </div>
                            <span className="text-[10px] text-stone-500 font-mono block mt-0.5">
                              {cust.orderCount.toLocaleString('fa-IR')} فاکتور صادر شده
                            </span>
                          </td>

                          {/* Column 7: Referral Count */}
                          <td className="p-3.5 align-middle whitespace-nowrap">
                            <button
                              onClick={() => {
                                setReferringCustomer(cust);
                                setIsReferralModalOpen(true);
                              }}
                              className="text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8] border border-[#DDD5C0] text-stone-800 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                              title="ثبت معرفی همکار جدید توسط این مشتری"
                            >
                              <Gift className="w-3.5 h-3.5 text-[#8C6D37]" />
                              <span>{(cust.referralCount || 0).toLocaleString('fa-IR')} معرف</span>
                            </button>
                          </td>

                          {/* Column 8: Actions */}
                          <td className="p-3.5 align-middle text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenFollowUpMessage(cust)}
                                className="p-2 bg-[#FAF7F2] text-[#8C6D37] hover:bg-[#EDE5D3] rounded-xl transition-all border border-[#DDD5C0] shadow-2xs cursor-pointer"
                                title="ارسال پیام آماده کاتالوگ یا پیگیری"
                              >
                                <MessageSquare className="w-4 h-4 text-[#8C6D37]" />
                              </button>
                              <button
                                onClick={() => setSelectedCustomer(cust)}
                                className="p-2 bg-[#FAF7F2] text-stone-700 hover:text-stone-900 hover:bg-[#EDE5D3] rounded-xl transition-all border border-[#DDD5C0] shadow-2xs cursor-pointer"
                                title="مشاهده پرونده کامل مشتری"
                              >
                                <FileText className="w-4 h-4" />
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

            {/* Bottom Summary Strip */}
            {(() => {
              const totalPurchasesSum = filteredCustomers.reduce((s, c) => s + c.totalPurchasesToman, 0);
              const totalOrdersSum = filteredCustomers.reduce((s, c) => s + c.orderCount, 0);

              return (
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-stone-800">
                      نمایش {filteredCustomers.length.toLocaleString('fa-IR')} از {customers.length.toLocaleString('fa-IR')} همکار و مخاطب
                    </span>
                    <span className="text-stone-300 hidden sm:inline">|</span>
                    <span>
                      تعداد کل فاکتورها: <strong className="text-stone-900 font-mono">{totalOrdersSum.toLocaleString('fa-IR')}</strong> فقره
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 font-medium">مجموع گردش کل مشتریان این نما:</span>
                    <span className="text-sm font-black text-stone-950 font-sans bg-white px-3 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs">
                      {totalPurchasesSum.toLocaleString('fa-IR')} <span className="text-xs font-bold text-[#8C6D37]">تومان</span>
                    </span>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 2: WHOLESALE LOYALTY & VOLUME INCENTIVE CLUB (Fix 3)            */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'loyalty_club' && (
        <div className="space-y-5">
          
          {/* Loyalty Program Overview Banner */}
          <div className="bg-gradient-to-l from-[#18181B] via-stone-900 to-[#27272A] text-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-stone-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-base font-black text-white">
                    باشگاه همکاران، بنکداران و پاداش خرید حجمی
                  </h3>
                </div>
                <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                  سیستم خودکار دسته‌بندی همکاران بر اساس حجم خرید ۱۲ ماهه، اعمال خودکار تخفیف‌های ۲٪ و ۴٪ در صدور فاکتور، اولویت باربری وطن و ثبت معرف‌های جدید
                </p>
              </div>

              {/* Quick Stat Badges */}
              <div className="flex items-center gap-2">
                <div className="bg-stone-800/80 px-3.5 py-2 rounded-xl border border-stone-700 text-center">
                  <span className="text-[10px] text-[#D4AF37] font-bold block">همکاران طلایی VIP:</span>
                  <span className="text-base font-black text-white">{goldVipCount} همکار</span>
                </div>
                <div className="bg-stone-800/80 px-3.5 py-2 rounded-xl border border-stone-700 text-center">
                  <span className="text-[10px] text-stone-300 font-bold block">همکاران نقره‌ای:</span>
                  <span className="text-base font-black text-white">{silverCount} همکار</span>
                </div>
              </div>
            </div>

            {/* Loyalty Tier Rule Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-800 text-xs">
              
              {/* Bronze / Regular */}
              <div className="bg-stone-800/60 p-3.5 rounded-xl border border-stone-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-300">همکار عادی (برنزی)</span>
                  <span className="text-[10px] bg-stone-700 px-2 py-0.5 rounded text-stone-200">خرید زیر ۵۰ م ت</span>
                </div>
                <p className="text-[11px] text-stone-400">قیمت عمده استاندارد بازار • پرداخت نقدی یا چک کوتاه‌مدت</p>
              </div>

              {/* Silver */}
              <div className="bg-stone-800/60 p-3.5 rounded-xl border border-[#DDD5C0]/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E6DEC8] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-stone-300" />
                    همکار نقره‌ای
                  </span>
                  <span className="text-[10px] bg-stone-700 text-[#E6DEC8] px-2 py-0.5 rounded font-bold">خرید ۵۰ تا ۱۵۰ م ت</span>
                </div>
                <p className="text-[11px] text-stone-300">۲٪ تخفیف مازاد روی کل فاکتور • اولویت تحویل باربری وطن</p>
              </div>

              {/* Gold VIP */}
              <div className="bg-amber-950/40 p-3.5 rounded-xl border border-[#D4AF37]/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#D4AF37] flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                    همکار طلایی VIP
                  </span>
                  <span className="text-[10px] bg-[#D4AF37] text-stone-950 font-black px-2 py-0.5 rounded">خرید بالای ۱۵۰ م ت</span>
                </div>
                <p className="text-[11px] text-amber-200/90">۴٪ تخفیف کل فاکتور + قیمت کف همکاری + ارسال رایگان تا باربری + سقف چک ۶۰ روز</p>
              </div>

            </div>
          </div>

          {/* Wholesale Partners Master Table */}
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
                  <span className="font-bold text-[#D4AF37]">حالت تمام‌صفحه جدول باشگاه وفاداری فعال است</span>
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE9DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Crown className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                    <span>جدول کاردکس همکاران عمده، رتبه‌بندی وفاداری و پاداش پارت</span>
                    <span className="text-[11px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-full font-mono">
                      {wholesaleCustomers.length.toLocaleString('fa-IR')} همکار فعال
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    تخفیف‌های پلکانی ۲٪ و ۴٪ پارت، اولویت حواله باربری، سقف چک صیادی و ثبت معرف‌های جدید
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
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

            {/* Master Table of Wholesale Loyalty Partners */}
            <div className="overflow-x-auto rounded-2xl border border-[#E6DEC8] shadow-2xs">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-stone-100 border-b-2 border-[#D4AF37]">
                  <tr>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>همکار و نام فروشگاه</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>شهر و استان</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>سطح باشگاه و نشان</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>گردش خرید ۱۲ ماهه</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>پیشرفت تا سطح بعد</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>تخفیف روی فاکتور</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>وضعیت چک صیادی</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                      <span>ثبت معرف / پیام</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DC]">
                  {wholesaleCustomers.map((cust) => {
                    const loyalty = getCustomerLoyaltyTier(cust);
                    const checkStats = getCustomerCheckStats(cust.id);

                    return (
                      <tr
                        key={cust.id}
                        className={`hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80 ${
                          loyalty.tier === 'partner_gold_vip' ? 'border-r-4 border-r-[#D4AF37]' : ''
                        }`}
                      >
                        {/* Column 1: Partner & Store */}
                        <td className="p-3.5 align-middle">
                          <strong className="font-extrabold text-stone-900 block text-xs sm:text-sm">
                            {cust.name}
                          </strong>
                          <span className="text-[11px] text-stone-500 block mt-0.5">
                            {cust.storeName}
                          </span>
                        </td>

                        {/* Column 2: City */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1 text-stone-900 font-bold text-xs">
                            <MapPin className="w-3.5 h-3.5 text-[#8C6D37] shrink-0" />
                            <span>{cust.city}</span>
                          </div>
                        </td>

                        {/* Column 3: Tier Badge */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 border shadow-2xs ${
                            loyalty.tier === 'partner_gold_vip' ? 'bg-[#D4AF37] text-stone-950 border-[#D4AF37]' :
                            loyalty.tier === 'partner_silver' ? 'bg-stone-200 text-stone-800 border-stone-300' :
                            'bg-[#FAF7F2] text-[#8C6D37] border-[#DDD5C0]'
                          }`}>
                            {loyalty.tier === 'partner_gold_vip' && <Crown className="w-3.5 h-3.5" />}
                            <span>{loyalty.label}</span>
                          </span>
                        </td>

                        {/* Column 4: Purchases */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="text-sm font-black text-emerald-950 font-sans">
                            {cust.totalPurchasesToman.toLocaleString('fa-IR')}{' '}
                            <span className="text-xs font-bold text-emerald-700">تومان</span>
                          </div>
                        </td>

                        {/* Column 5: Progress Bar */}
                        <td className="p-3.5 align-middle min-w-[140px]">
                          <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                            <span>پیشرفت: {loyalty.progressPct}٪</span>
                            <span>هدف: {loyalty.nextTierThresholdToman.toLocaleString('fa-IR')} ت</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                loyalty.tier === 'partner_gold_vip' ? 'bg-[#D4AF37]' : 'bg-stone-800'
                              }`}
                              style={{ width: `${loyalty.progressPct}%` }}
                            />
                          </div>
                        </td>

                        {/* Column 6: Discount */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg border font-mono ${
                            loyalty.discountPct > 0 
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : 'bg-stone-100 text-stone-700 border-stone-300'
                          }`}>
                            {loyalty.discountPct > 0 ? `${loyalty.discountPct}٪ تخفیف کل فاکتور` : 'قیمت پایه عمده'}
                          </span>
                        </td>

                        {/* Column 7: Check stats */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                            checkStats.hasBouncedHistory 
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : checkStats.clearedCount > 0 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-700 border-stone-200'
                          }`}>
                            {checkStats.hasBouncedHistory ? '⚠️ دارای چک برگشتی' : checkStats.clearedCount > 0 ? `✅ ${checkStats.clearedCount} چک پاس‌شده` : 'فاقد چک'}
                          </span>
                        </td>

                        {/* Column 8: Actions */}
                        <td className="p-3.5 align-middle text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setReferringCustomer(cust);
                                setIsReferralModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-[#FAF7F2] text-[#8C6D37] hover:bg-[#E6DEC8] rounded-xl transition-all border border-[#DDD5C0] font-bold text-xs cursor-pointer shadow-2xs flex items-center gap-1"
                              title="ثبت معرفی همکار جدید توسط این مشتری"
                            >
                              <UserPlus className="w-3.5 h-3.5 text-[#8C6D37]" />
                              <span>+ معرفی ({cust.referralCount || 0})</span>
                            </button>
                            <button
                              onClick={() => handleOpenFollowUpMessage(cust)}
                              className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-[#E6DEC8] rounded-xl transition-all border border-[#DDD5C0] shadow-2xs cursor-pointer"
                              title="ارسال پیام اختصاصی"
                            >
                              <MessageSquare className="w-4 h-4 text-[#8C6D37]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Bottom Summary Strip */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-stone-800">
                  تعداد کل اعضای باشگاه همکاران: {wholesaleCustomers.length.toLocaleString('fa-IR')} بنکدار
                </span>
                <span className="text-stone-300 hidden sm:inline">|</span>
                <span>
                  طلایی VIP: <strong className="text-amber-800 font-mono">{goldVipCount.toLocaleString('fa-IR')}</strong> همکار
                </span>
                <span className="text-stone-300 hidden sm:inline">|</span>
                <span>
                  نقره‌ای: <strong className="text-stone-900 font-mono">{silverCount.toLocaleString('fa-IR')}</strong> همکار
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-medium">سیاست قیمت‌گذاری:</span>
                <span className="font-bold text-stone-900 bg-white px-2.5 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs">
                  اعمال خودکار تخفیف پارت در صدور فاکتور
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 3: FOLLOW-UPS FOR INACTIVE CUSTOMERS                            */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'follow_ups' && (
        <div className="space-y-4">
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC8] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#8C6D37] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-black text-[#18181B]">
                سیستم یادآوری پیگیری خودکار مشتریان غیرفعال
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mt-1">
                مشتریانی که بیش از ۲۵ روز است سفارش جدیدی ثبت نکرده‌اند یا بدهی دارند در این کاردکس قرار می‌گیرند. با ۱ کلیک پیام کاتالوگ تابستانه را در واتساپ، تلگرام یا پیامک ارسال کنید.
              </p>
            </div>
          </div>

          {/* Master Table of Inactive Customers Follow-up */}
          <div className="bg-white rounded-3xl border border-[#DFD7C2] shadow-sm overflow-hidden space-y-4 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE9DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                    <span>کاردکس صف پیگیری مشتریان و طرف‌حساب‌های غیرفعال</span>
                    <span className="text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-mono">
                      {inactiveQueue.length.toLocaleString('fa-IR')} مخاطب نیازمند تماس
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    ارسال آنی پیام با متن آماده بازاریابی و کاتالوگ جدید جهت فعال‌سازی مجدد حساب
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E6DEC8] shadow-2xs">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-stone-100 border-b-2 border-[#D4AF37]">
                  <tr>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>نام مشتری و فروشگاه</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>شهر و استان</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>شماره تماس</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>علت پیگیری و تاخیر</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>آخرین سفارش ثبت‌شده</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>وضعیت پیگیری</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                      <span>اقدامات سریع</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DC]">
                  {inactiveQueue.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] flex items-center justify-center text-emerald-600 mb-3 shadow-2xs">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          </div>
                          <h4 className="text-sm font-extrabold text-stone-900">هیچ مشتری نیازمند پیگیری وجود ندارد</h4>
                          <p className="text-xs text-stone-500 mt-1">
                            تمامی همکاران در چرخه سفارش‌گذاری منظم قرار دارند.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    inactiveQueue.map((cust) => (
                      <tr
                        key={cust.id}
                        className="hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80"
                      >
                        {/* Column 1: Customer & Store */}
                        <td className="p-3.5 align-middle">
                          <strong className="font-extrabold text-stone-900 block text-xs sm:text-sm">
                            {cust.name}
                          </strong>
                          <span className="text-[11px] text-stone-500 block mt-0.5">
                            {cust.storeName}
                          </span>
                        </td>

                        {/* Column 2: City */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1 text-stone-900 font-bold text-xs">
                            <MapPin className="w-3.5 h-3.5 text-[#8C6D37] shrink-0" />
                            <span>{cust.city}</span>
                          </div>
                        </td>

                        {/* Column 3: Phone */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="font-mono font-bold text-stone-800 text-xs dir-ltr text-right block">
                            {cust.phone}
                          </span>
                        </td>

                        {/* Column 4: Reason */}
                        <td className="p-3.5 align-middle max-w-[240px]">
                          <span className="text-xs text-stone-800 block line-clamp-2">
                            {cust.followUpReason}
                          </span>
                        </td>

                        {/* Column 5: Last Order Date */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="font-mono text-xs text-stone-600">
                            {cust.lastOrderDate}
                          </span>
                        </td>

                        {/* Column 6: Status */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                            <span>نیازمند پیگیری فوری</span>
                          </span>
                        </td>

                        {/* Column 7: Actions */}
                        <td className="p-3.5 align-middle text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenFollowUpMessage(cust)}
                              className="px-3 py-1.5 bg-gradient-to-r from-stone-900 to-[#18181B] hover:from-black hover:to-stone-900 text-[#FAF7F2] rounded-xl transition-all flex items-center gap-1.5 border border-[#D4AF37]/60 hover:border-[#D4AF37] font-bold text-xs cursor-pointer shadow-xs active:scale-95"
                              title="تولید و ارسال پیام آماده"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>ارسال پیام آماده</span>
                            </button>
                            <button
                              onClick={() => setSelectedCustomer(cust)}
                              className="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-[#E6DEC8] text-stone-800 text-xs rounded-xl font-bold border border-[#DDD5C0] transition-colors cursor-pointer"
                            >
                              پرونده
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
                  تعداد کل موارد صف پیگیری: {inactiveQueue.length.toLocaleString('fa-IR')} مخاطب
                </span>
                <span className="text-stone-300 hidden sm:inline">|</span>
                <span>
                  هدف: <strong className="text-stone-900">حفظ زنجیره خرید ماهانه بنکداران</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-medium">پایش هوشمند CRM:</span>
                <span className="font-bold text-stone-900 bg-white px-2.5 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs">
                  تشخیص تاخیر بیش از ۲۵ روز
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 4: TELEGRAM QUICK TEXT IMPORTER                                 */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'telegram_importer' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[#18181B]">
                ورود سریع لیست متنی تلگرام (مشتریان کانال و همکاران)
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                متن خام شماره‌های دفترچه را پیست کنید؛ هر خط به یک مخاطب CRM تبدیل می‌شود.
              </p>
            </div>
          </div>

          <textarea
            rows={6}
            value={rawImportText}
            onChange={(e) => setRawImportText(e.target.value)}
            placeholder="مثال:
حاج مهدی اکبری - 09123334455 - تبریز - پوشاک نگین
محمد حسینی, 09351112233, شیراز, آنلاین شاپ رز"
            className="w-full bg-[#FAF7F2] p-3.5 rounded-xl border border-[#DDD5C0] font-mono text-xs outline-none focus:border-[#D4AF37] focus:bg-white text-stone-900"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleParseTelegramList}
              className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
            >
              پردازش و استخراج مخاطبان
            </button>
            <button
              onClick={() => {
                setRawImportText(`حاج رضا کاظمی - 09121118899 - اصفهان - پخش پوشاک کاظمی
آقای علیرضا مرادی - 09139992211 - یزد - ارزان‌سرای پوشاک یزد
حاج قاسم داوودی - 09153332211 - زاهدان - بازار رسولی پوشاک`);
              }}
              className="text-xs text-[#8C6D37] hover:underline font-bold"
            >
              بارگذاری نمونه تستی
            </button>
          </div>

          {importedPreview.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#E6DEC8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">
                  ✅ {importedPreview.length} مخاطب شناسایی شد:
                </span>
                <button
                  onClick={handleApplyImport}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  تایید و افزودن به دیتابیس CRM
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E6DEC8] divide-y divide-[#FAF7F2] text-xs">
                {importedPreview.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-[#FAF7F2]/60">
                    <div>
                      <strong className="text-stone-900">{item.name}</strong>
                      <span className="text-stone-500 mr-2">({item.storeName} - {item.city})</span>
                    </div>
                    <span className="font-mono font-bold text-stone-700">{item.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL: ADD REFERRAL (Fix 3)                                         */}
      {/* ------------------------------------------------------------------- */}
      {isReferralModalOpen && referringCustomer && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6DEC8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#8C6D37]" />
                <h3 className="text-sm font-black text-[#18181B]">
                  ثبت معرفی همکار جدید توسط {referringCustomer.name}
                </h3>
              </div>
              <button onClick={() => setIsReferralModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSaveReferral} className="space-y-3 my-4 text-xs">
              <p className="text-stone-600 text-[11px] leading-relaxed">
                با ثبت همکار معرفی‌شده، به امتیاز معرف {referringCustomer.name} افزوده شده و مخاطب جدید به دیتابیس با برچسب معرفی اضافه می‌گردد.
              </p>

              <div>
                <label className="block font-bold text-stone-700 mb-1">نام بنکدار / مغازه‌دار جدید:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: آقای سعید رضایی (پخش مشهد)"
                  value={newReferredName}
                  onChange={(e) => setNewReferredName(e.target.value)}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شماره تماس:</label>
                  <input
                    type="text"
                    placeholder="09121112233"
                    value={newReferredPhone}
                    onChange={(e) => setNewReferredPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شهر:</label>
                  <input
                    type="text"
                    placeholder="مشهد"
                    value={newReferredCity}
                    onChange={(e) => setNewReferredCity(e.target.value)}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => setIsReferralModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-[#FAF7F2] rounded-xl font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-5 py-2 rounded-xl shadow-xs"
                >
                  ثبت معرف و همکار جدید
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 1: Add New Customer                                           */}
      {/* ------------------------------------------------------------------- */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E6DEC8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <h3 className="text-base font-black text-[#18181B]">ثبت مشتری و همکار جدید</h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3.5 my-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حاج داوود محمدی"
                    value={newCustForm.name}
                    onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">نام فروشگاه / بنکداری:</label>
                  <input
                    type="text"
                    placeholder="مثال: پخش پوشاک محمدی"
                    value={newCustForm.storeName}
                    onChange={(e) => setNewCustForm({ ...newCustForm, storeName: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شماره موبایل:</label>
                  <input
                    type="text"
                    required
                    placeholder="09121234567"
                    value={newCustForm.phone}
                    onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شهر / استان:</label>
                  <input
                    type="text"
                    value={newCustForm.city}
                    onChange={(e) => setNewCustForm({ ...newCustForm, city: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">نوع مشتری:</label>
                  <select
                    value={newCustForm.type}
                    onChange={(e) => setNewCustForm({ ...newCustForm, type: e.target.value as CustomerType })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  >
                    <option value="shop_keeper">مغازه‌دار شهرستان</option>
                    <option value="partner_wholesale">عمده‌فروش همکار (قیمت هم‌صنف)</option>
                    <option value="online_shop">آنلاین‌شاپ و فروشگاه اینترنتی</option>
                    <option value="retail">مشتری تکی (مصرف‌کننده)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">سطح وفاداری عمده:</label>
                  <select
                    value={newCustForm.wholesaleLoyaltyTier}
                    onChange={(e) => setNewCustForm({ ...newCustForm, wholesaleLoyaltyTier: e.target.value as WholesaleLoyaltyTier })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  >
                    <option value="partner_regular">همکار عادی</option>
                    <option value="partner_silver">همکار نقره‌ای (۲٪ تخفیف)</option>
                    <option value="partner_gold_vip">همکار طلایی VIP (۴٪ تخفیف)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] space-y-2">
                <label className="block font-bold text-stone-800">شرایط پرداخت مجاز:</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentTerms"
                      checked={newCustForm.paymentTerms === 'cash_only'}
                      onChange={() => setNewCustForm({ ...newCustForm, paymentTerms: 'cash_only' })}
                    />
                    <span>فقط فروش نقدی و واریز</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentTerms"
                      checked={newCustForm.paymentTerms === 'check_eligible'}
                      onChange={() => setNewCustForm({ ...newCustForm, paymentTerms: 'check_eligible' })}
                    />
                    <span className="text-emerald-800 font-bold">مجاز به خرید چکی (صیادی)</span>
                  </label>
                </div>

                {newCustForm.paymentTerms === 'check_eligible' && (
                  <div className="pt-2 border-t border-[#DDD5C0]">
                    <span className="text-stone-500 block mb-1">سقف اعتبار چک صیادی (تومان):</span>
                    <input
                      type="number"
                      value={newCustForm.checkLimitToman}
                      onChange={(e) => setNewCustForm({ ...newCustForm, checkLimitToman: Number(e.target.value) })}
                      className="w-full bg-white p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-[#FAF7F2] rounded-xl font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-5 py-2 rounded-xl transition-all shadow-xs border border-[#3F3F46]"
                >
                  ثبت در دیتابیس CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 2: 1-Click Message Generator                                  */}
      {/* ------------------------------------------------------------------- */}
      {isSendMessageModalOpen && messageTargetCustomer && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E6DEC8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#FAF7F2] text-[#8C6D37] rounded-xl border border-[#DDD5C0]">
                  <Send className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#18181B]">
                    ارسال پیام کاتالوگ به {messageTargetCustomer.name}
                  </h3>
                  <p className="text-[11px] text-stone-500">شماره: {messageTargetCustomer.phone}</p>
                </div>
              </div>
              <button onClick={() => setIsSendMessageModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="my-4 space-y-3">
              <textarea
                rows={8}
                value={generatedMessageText}
                onChange={(e) => setGeneratedMessageText(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs p-3.5 rounded-xl border border-[#DDD5C0] font-sans leading-relaxed outline-none focus:bg-white focus:border-[#D4AF37] text-stone-900"
              />

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/98${messageTargetCustomer.phone.replace(/^0/, '')}?text=${encodeURIComponent(generatedMessageText)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>ارسال مستقیم در واتساپ</span>
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedMessageText);
                    alert('متن پیام کپی شد! می‌توانید در تلگرام یا ایتا پیست نمایید.');
                  }}
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-4 py-2.5 rounded-xl transition-colors border border-[#3F3F46]"
                >
                  کپی متن پیام
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 3: View Customer Detail Drawer & Sayad History (Fix 2 & 3)    */}
      {/* ------------------------------------------------------------------- */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-[#E6DEC8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div>
                <h3 className="text-base font-black text-[#18181B] flex items-center gap-2">
                  <span>{selectedCustomer.name}</span>
                  {getCustomerLoyaltyTier(selectedCustomer).tier === 'partner_gold_vip' && (
                    <span className="text-[10px] bg-[#D4AF37] text-stone-950 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                      <Crown className="w-3 h-3" /> طلایی VIP
                    </span>
                  )}
                </h3>
                <p className="text-xs text-stone-500">{selectedCustomer.storeName} • شهر {selectedCustomer.city}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="my-4 space-y-3.5 text-xs">
              
              {/* Core Stats */}
              <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#DDD5C0] text-stone-700">
                <div><span>شماره موبایل:</span> <strong className="font-mono text-stone-900">{selectedCustomer.phone}</strong></div>
                <div><span>امتیاز اعتبار صیاد:</span> <strong className="text-[#8C6D37]">{selectedCustomer.trustScore} از ۱۰۰</strong></div>
                <div><span>مجموع خریدها:</span> <strong className="text-stone-900">{selectedCustomer.totalPurchasesToman.toLocaleString('fa-IR')} تومان</strong></div>
                <div><span>تعداد سفارش:</span> <strong>{selectedCustomer.orderCount} فاکتور</strong></div>
                <div><span>باربری ترجیحی:</span> <strong>{selectedCustomer.preferredShipping}</strong></div>
                <div><span>تعداد همکاران معرفی‌شده:</span> <strong className="text-emerald-800">{selectedCustomer.referralCount || 0} معرف</strong></div>
              </div>

              {/* Fix 2: Detailed Sayad Checks History */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E6DEC8] space-y-2">
                <span className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8C6D37]" />
                  <span>سابقه چک‌های صیادی این مشتری (Sayad Check Records):</span>
                </span>

                {getCustomerCheckStats(selectedCustomer.id).checks.length === 0 ? (
                  <p className="text-stone-400 text-[11px]">تاکنون هیچ فقره چکی از این مشتری ثبت نشده است.</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {getCustomerCheckStats(selectedCustomer.id).checks.map(chk => (
                      <div key={chk.id} className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#DDD5C0] flex items-center justify-between text-[11px]">
                        <div>
                          <strong className="text-stone-900 font-mono">{chk.checkNumber}</strong>
                          <span className="text-stone-500 mr-2">({chk.bankName})</span>
                          <span className="text-[10px] text-stone-400 block">سررسید: {chk.dueDate}</span>
                        </div>
                        <div className="text-left">
                          <span className="font-black text-stone-900 block">{chk.amountToman.toLocaleString('fa-IR')} ت</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            chk.status === 'cleared' ? 'bg-emerald-100 text-emerald-800' :
                            chk.status === 'bounced' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {chk.status === 'cleared' ? 'وصول سروقت' : chk.status === 'bounced' ? 'برگشتی' : 'در انتظار'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] space-y-1">
                <span className="font-bold text-[#18181B] block">یادداشت و پیشینه بازاری:</span>
                <p className="text-stone-600 leading-relaxed text-[11px] whitespace-pre-line">{selectedCustomer.notes}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E6DEC8]">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="bg-[#18181B] text-[#FAF7F2] font-black text-xs px-5 py-2.5 rounded-xl shadow-xs"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel / CSV Customer Import & Export Modal */}
      <ExcelCustomerModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onImportCustomers={onImportCustomers}
        existingCustomers={customers}
      />

    </div>
  );
};
