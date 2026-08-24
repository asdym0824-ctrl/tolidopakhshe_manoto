import React, { useState, useMemo } from 'react';
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
  ArrowUpRight
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
                <option value="online_shop">آنلاین‌شاپ و مزون</option>
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

          {/* Customers Table */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF7F2] text-stone-700 border-b border-[#E6DEC8] font-bold">
                  <tr>
                    <th className="p-3.5">نام مشتری و فروشگاه</th>
                    <th className="p-3.5">شماره تماس و شهر</th>
                    <th className="p-3.5">نوع و سطح وفاداری</th>
                    <th className="p-3.5">سابقه چک‌های صیادی (Check Risk)</th>
                    <th className="p-3.5">شرایط پرداخت مجاز</th>
                    <th className="p-3.5">جمع خرید کل</th>
                    <th className="p-3.5">معرفی همکار</th>
                    <th className="p-3.5 text-center">اقدام سریع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF7F2]">
                  {filteredCustomers.map((cust) => {
                    const checkStats = getCustomerCheckStats(cust.id);
                    const loyalty = getCustomerLoyaltyTier(cust);

                    return (
                      <tr key={cust.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        
                        {/* Name & Store */}
                        <td className="p-3.5">
                          <div>
                            <span 
                              onClick={() => setSelectedCustomer(cust)}
                              className="font-black text-[#18181B] hover:text-[#8C6D37] cursor-pointer block text-xs"
                            >
                              {cust.name}
                            </span>
                            <span className="text-[11px] text-stone-500 font-medium">
                              {cust.storeName}
                            </span>
                            {cust.tags.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                {cust.tags.slice(0, 2).map((t, idx) => (
                                  <span key={idx} className="text-[9px] bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-1.5 py-0.2 rounded-md font-bold">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Phone & City */}
                        <td className="p-3.5">
                          <div className="font-mono font-bold text-stone-800 text-[11px] dir-ltr text-right">
                            {cust.phone}
                          </div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{cust.city}</span>
                          </div>
                        </td>

                        {/* Type & Loyalty Badge */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${
                              cust.type === 'partner_wholesale' ? 'bg-[#FAF7F2] text-[#8C6D37] border-[#DDD5C0]' :
                              cust.type === 'online_shop' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                              cust.type === 'retail' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
                              'bg-stone-100 text-stone-800 border-stone-200'
                            }`}>
                              {cust.type === 'partner_wholesale' ? 'عمده‌فروش همکار' :
                               cust.type === 'online_shop' ? 'آنلاین‌شاپ / مزون' :
                               cust.type === 'retail' ? 'مشتری تکی' : 'مغازه‌دار شهرستان'}
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

                        {/* Check Risk History (Fix 2) */}
                        <td className="p-3.5">
                          {checkStats.hasBouncedHistory ? (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>سابقه {checkStats.bouncedCount} چک برگشتی</span>
                            </span>
                          ) : checkStats.isCleanHistory ? (
                            <div>
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold text-[11px]">
                                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{checkStats.clearedCount} چک وصول به‌موقع</span>
                              </span>
                              <div className="text-[10px] text-stone-400 mt-0.5">
                                امتیاز اعتبار صیادی: {cust.trustScore}/۱۰۰
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-lg">
                              فاقد سابقه چک صیادی
                            </span>
                          )}
                        </td>

                        {/* Payment Terms */}
                        <td className="p-3.5">
                          {cust.paymentTerms === 'check_eligible' ? (
                            <div>
                              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                مجاز به چک صیادی
                              </span>
                              <div className="text-[10px] text-stone-400 mt-0.5">
                                سقف: {(cust.checkLimitToman / 1000000).toFixed(0)} میلیون ت
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] font-bold text-stone-700 bg-[#FAF7F2] border border-[#DDD5C0] px-2 py-0.5 rounded-lg">
                              فقط نقدی / واریز
                            </span>
                          )}
                        </td>

                        {/* Total Purchases */}
                        <td className="p-3.5">
                          <span className="font-black text-[#18181B] block">
                            {cust.totalPurchasesToman.toLocaleString('fa-IR')} ت
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {cust.orderCount} سفارش ثبت شده
                          </span>
                        </td>

                        {/* Referral Count (Fix 3) */}
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              setReferringCustomer(cust);
                              setIsReferralModalOpen(true);
                            }}
                            className="text-[11px] bg-[#FAF7F2] hover:bg-[#E6DEC8] border border-[#DDD5C0] text-stone-800 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors"
                            title="ثبت معرفی همکار جدید توسط این مشتری"
                          >
                            <Gift className="w-3 h-3 text-[#8C6D37]" />
                            <span>{cust.referralCount || 0} معرف</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenFollowUpMessage(cust)}
                              className="p-2 text-[#8C6D37] hover:bg-[#FAF7F2] rounded-xl transition-colors border border-transparent hover:border-[#DDD5C0]"
                              title="ارسال پیام آماده کاتالوگ یا پیگیری"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedCustomer(cust)}
                              className="p-2 text-stone-600 hover:text-[#18181B] hover:bg-[#FAF7F2] rounded-xl transition-colors border border-transparent hover:border-[#DDD5C0]"
                              title="مشاهده پرونده کامل"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

          {/* Wholesale Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wholesaleCustomers.map((cust) => {
              const loyalty = getCustomerLoyaltyTier(cust);
              const checkStats = getCustomerCheckStats(cust.id);

              return (
                <div 
                  key={cust.id} 
                  className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                    loyalty.tier === 'partner_gold_vip' ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30' : 'border-[#E6DEC8]'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-black text-sm text-[#18181B]">{cust.name}</h4>
                        <span className="text-xs text-stone-500">{cust.storeName} • {cust.city}</span>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        loyalty.tier === 'partner_gold_vip' ? 'bg-[#D4AF37] text-stone-950' :
                        loyalty.tier === 'partner_silver' ? 'bg-stone-200 text-stone-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {loyalty.tier === 'partner_gold_vip' && <Crown className="w-3 h-3" />}
                        <span>{loyalty.label}</span>
                      </span>
                    </div>

                    {/* Progress Bar towards Next Tier */}
                    <div className="mt-3.5 space-y-1">
                      <div className="flex justify-between text-[11px] text-stone-600">
                        <span>پیشرفت سطح وفاداری:</span>
                        <strong className="text-stone-900">{loyalty.progressPct}٪</strong>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            loyalty.tier === 'partner_gold_vip' ? 'bg-[#D4AF37]' : 'bg-[#18181B]'
                          }`}
                          style={{ width: `${loyalty.progressPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-stone-400">
                        <span>خرید کل: {cust.totalPurchasesToman.toLocaleString('fa-IR')} ت</span>
                        <span>هدف: {loyalty.nextTierThresholdToman.toLocaleString('fa-IR')} ت</span>
                      </div>
                    </div>

                    {/* Partner Details */}
                    <div className="mt-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD5C0] text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-600">مزیت تخفیف فعال:</span>
                        <strong className="text-emerald-800 font-black">
                          {loyalty.discountPct > 0 ? `${loyalty.discountPct}٪ تخفیف روی فاکتور` : 'قیمت پایه عمده'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">سابقه صیادی:</span>
                        <span className="font-bold text-stone-800">
                          {checkStats.hasBouncedHistory ? '⚠️ دارای برگشتی' : checkStats.clearedCount > 0 ? `✅ ${checkStats.clearedCount} چک پاس‌شده` : 'فاقد چک'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">معرفی همکار جدید:</span>
                        <span className="font-black text-[#8C6D37]">
                          {cust.referralCount || 0} نفر بنکدار
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E6DEC8]">
                    <button
                      onClick={() => {
                        setReferringCustomer(cust);
                        setIsReferralModalOpen(true);
                      }}
                      className="flex-1 text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8] text-[#18181B] font-bold py-2 rounded-xl border border-[#DDD5C0] transition-colors flex items-center justify-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>+ ثبت معرفی جدید</span>
                    </button>

                    <button
                      onClick={() => handleOpenFollowUpMessage(cust)}
                      className="p-2 text-[#18181B] hover:bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl transition-colors"
                      title="ارسال پیام اختصاصی"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
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
                مشتریانی که بیش از ۲۵ روز است سفارش جدیدی ثبت نکرده‌اند یا بدهی دارند در این لیست قرار می‌گیرند. با ۱ کلیک پیام کاتالوگ تابستانه را در واتساپ، تلگرام یا پیامک ارسال کنید.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inactiveQueue.map((cust) => (
              <div key={cust.id} className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-[#18181B]">{cust.name}</h4>
                      <p className="text-xs text-stone-500">{cust.storeName} • شهر {cust.city}</p>
                    </div>
                    <span className="bg-rose-50 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                      نیازمند پیگیری
                    </span>
                  </div>

                  <div className="mt-3 p-3.5 bg-[#FAF7F2] rounded-xl text-xs text-stone-700 border border-[#DDD5C0]">
                    <span className="font-bold text-[#18181B] block mb-1">علت پیگیری:</span>
                    <p className="text-stone-600 leading-relaxed">{cust.followUpReason}</p>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-[#E6DEC8]">
                    <span>آخرین سفارش: {cust.lastOrderDate}</span>
                    <span>موبایل: {cust.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleOpenFollowUpMessage(cust)}
                    className="flex-1 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs border border-[#3F3F46]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>تولید و ارسال پیام آماده</span>
                  </button>
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="bg-[#FAF7F2] hover:bg-[#E6DEC8] text-stone-800 text-xs px-3.5 py-2.5 rounded-xl font-bold border border-[#DDD5C0]"
                  >
                    پرونده
                  </button>
                </div>
              </div>
            ))}
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
                    <option value="online_shop">آنلاین‌شاپ و مزون اینترنتی</option>
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
