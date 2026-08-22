import React, { useState } from 'react';
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
  FileSpreadsheet
} from 'lucide-react';
import { Customer, CustomerType, CustomerTier, PaymentTerms } from '../types';
import { ExcelCustomerModal } from './common/ExcelCustomerModal';

interface CustomerCRMModuleProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onImportCustomers: (importedList: Customer[]) => void;
}

export const CustomerCRMModule: React.FC<CustomerCRMModuleProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onImportCustomers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTrustFilter, setSelectedTrustFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all_customers' | 'follow_ups' | 'telegram_importer'>('all_customers');
  
  // Selected Customer for Details
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [messageTargetCustomer, setMessageTargetCustomer] = useState<Customer | null>(null);
  const [generatedMessageText, setGeneratedMessageText] = useState('');

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
    trustScore: 85,
    paymentTerms: 'cash_only' as PaymentTerms,
    checkLimitToman: 20000000,
    channelSource: 'telegram' as 'telegram' | 'eitaa' | 'rubika' | 'bale' | 'instagram' | 'in_person',
    preferredShipping: 'باربری وطن' as 'باربری وطن' | 'تیپاکس' | 'چاپار' | 'پست پیشتاز' | 'باربری پیام‌گیر',
    tags: 'مغازه‌دار، تلگرام',
    notes: '',
  });

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
    
    return matchesSearch && matchesType && matchesTrust;
  });

  const inactiveQueue = customers.filter(c => c.followUpRequired);

  // Handle Telegram 600 list parsing
  const handleParseTelegramList = () => {
    const lines = rawImportText.split('\n').filter(line => line.trim().length > 0);
    const parsed: Customer[] = [];

    lines.forEach((line, index) => {
      // Split by comma, dash, tab or pipe
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
        trustScore: 75,
        paymentTerms: 'cash_only',
        checkLimitToman: 0,
        currentActiveCheckToman: 0,
        totalPurchasesToman: 0,
        orderCount: 0,
        lastOrderDate: 'فاقد سابقه',
        lastContactDate: 'امروز (ورود از تلگرام)',
        channelSource: 'telegram',
        preferredShipping: 'باربری وطن',
        tags: ['مخاطب_تلگرام', 'ورود_گروهی'],
        notes: 'ایمپورت شده از دفترچه مخاطبین کانال ۶۰۰ نفره تلگرام',
      });
    });

    setImportedPreview(parsed);
  };

  const handleApplyImport = () => {
    if (importedPreview.length > 0) {
      onImportCustomers(importedPreview);
      setRawImportText('');
      setImportedPreview([]);
      setActiveTab('all_customers');
    }
  };

  // 1-Click Message Generator for inactive follow-ups
  const handleOpenFollowUpMessage = (cust: Customer) => {
    setMessageTargetCustomer(cust);
    const msg = `سلام و احترام جناب آقای/سرکار خانم ${cust.name} عزیز (${cust.storeName}) 🌸
امیدوارم ایام به کام باشه.

مدل‌های جدید و پرفروش تابستانه بازار بزرگ تهران آماده ارسال شد:
✨ شلوار بگ کتان لایت تابستانه (پک ۶ تایی - قیمت استثنایی)
✨ شلوار راحتی نخی ۱۲ تایی حراجی
✨ لگ غواصی کمر گنی اعلا

ارسال بار مثل همیشه با ${cust.preferredShipping} به مقصد ${cust.city}.
جهت مشاهده عکس‌های غیرژورنالی و ثبت سفارش در پیوی در خدمتتون هستیم:
🆔 @bazar_admin
📞 09121234567`;

    setGeneratedMessageText(msg);
    setIsSendMessageModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = newCustForm.tags.split('،').map(t => t.trim()).filter(Boolean);

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustForm.name,
      storeName: newCustForm.storeName || `پوشاک ${newCustForm.name}`,
      phone: newCustForm.phone,
      city: newCustForm.city,
      province: newCustForm.province,
      type: newCustForm.type,
      tier: newCustForm.tier,
      trustScore: Number(newCustForm.trustScore) || 75,
      paymentTerms: newCustForm.paymentTerms,
      checkLimitToman: Number(newCustForm.checkLimitToman) || 0,
      currentActiveCheckToman: 0,
      totalPurchasesToman: 0,
      orderCount: 0,
      lastOrderDate: 'امروز',
      lastContactDate: 'امروز',
      channelSource: newCustForm.channelSource,
      preferredShipping: newCustForm.preferredShipping,
      tags: tagArray.length > 0 ? tagArray : ['مشتری_جدید'],
      notes: newCustForm.notes,
    };

    onAddCustomer(newCustomer);
    setIsAddCustomerOpen(false);
  };

  return (
    <div id="crm-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-stone-900">
                  مدیریت مشتریان و CRM (اعتبارسنجی چکی و سابقه خرید)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  جایگزین دفترچه تلفن سنتی، بررسی سقف اعتبار چکی صیاد، پیگیری خودکار مشتریان ۶۰۰ تایی تلگرام
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-open-excel-modal"
              onClick={() => setIsExcelModalOpen(true)}
              className="text-xs bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/30 font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
              <span>ورود و خروجی با اکسل (Excel)</span>
            </button>

            <button
              id="btn-open-telegram-importer"
              onClick={() => setActiveTab('telegram_importer')}
              className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span>ورود گروهی لیست تلگرام (۶۰۰ مخاطب)</span>
            </button>

            <button
              id="btn-open-add-customer-modal"
              onClick={() => setIsAddCustomerOpen(true)}
              className="text-xs bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] font-black px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ ثبت مشتری جدید</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100 text-xs">
          <button
            onClick={() => setActiveTab('all_customers')}
            className={`px-3 py-1.8 rounded-xl font-bold transition-all ${
              activeTab === 'all_customers'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            همه مشتریان و خریداران ({customers.length})
          </button>

          <button
            onClick={() => setActiveTab('follow_ups')}
            className={`px-3 py-1.8 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'follow_ups'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>صف پیگیری مشتریان غیرفعال</span>
            {inactiveQueue.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'follow_ups' ? 'bg-white text-amber-800' : 'bg-rose-500 text-white'
              }`}>
                {inactiveQueue.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('telegram_importer')}
            className={`px-3 py-1.8 rounded-xl font-bold transition-all ${
              activeTab === 'telegram_importer'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            ابزار ایمپورت سریع اکسل / متن
          </button>
        </div>
      </div>

      {/* Tab 1: All Customers View */}
      {activeTab === 'all_customers' && (
        <div className="space-y-4">
          
          {/* Search & Filters */}
          <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام مشتری، نام فروشگاه، شماره موبایل یا شهر..."
                  className="w-full bg-stone-50 text-xs pr-9 pl-3 py-2 rounded-lg border border-stone-200 focus:border-amber-500 focus:bg-white outline-none"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-stone-50 text-xs py-2 px-2.5 rounded-lg border border-stone-200 text-stone-700 outline-none"
              >
                <option value="all">همه انواع مشتری</option>
                <option value="shop_keeper">مغازه‌دار شهرستان</option>
                <option value="partner_wholesale">عمده‌فروش همکار</option>
                <option value="online_shop">آنلاین‌شاپ و مزون</option>
              </select>

              <select
                value={selectedTrustFilter}
                onChange={(e) => setSelectedTrustFilter(e.target.value)}
                className="bg-stone-50 text-xs py-2 px-2.5 rounded-lg border border-stone-200 text-stone-700 outline-none"
              >
                <option value="all">همه امتیازهای اعتبار</option>
                <option value="high">خوش‌حساب و مجاز به چک (۸۵+)</option>
                <option value="medium">متوسط (۶۰ تا ۸۴)</option>
                <option value="low">پرریسک / فقط نقدی (زیر ۶۰)</option>
              </select>
            </div>

            <span className="text-xs text-stone-500 font-medium">
              نمایش {filteredCustomers.length} از {customers.length} مخاطب
            </span>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-100/80 text-stone-600 border-b border-stone-200 font-bold">
                  <tr>
                    <th className="p-3">نام مشتری و فروشگاه</th>
                    <th className="p-3">شماره تماس و شهر</th>
                    <th className="p-3">نوع مشتری</th>
                    <th className="p-3">امتیاز اعتبار چکی (Trust)</th>
                    <th className="p-3">شرایط پرداخت مجاز</th>
                    <th className="p-3">جمع خرید کل</th>
                    <th className="p-3">ارسال ترجیحی</th>
                    <th className="p-3 text-center">اقدام سریع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70">
                  {filteredCustomers.map((cust) => {
                    const isHighTrust = cust.trustScore >= 85;
                    const isLowTrust = cust.trustScore < 60;

                    return (
                      <tr key={cust.id} className="hover:bg-stone-50/80 transition-colors">
                        
                        {/* Name & Store */}
                        <td className="p-3">
                          <div>
                            <span 
                              onClick={() => setSelectedCustomer(cust)}
                              className="font-bold text-stone-900 hover:text-amber-700 cursor-pointer block text-xs"
                            >
                              {cust.name}
                            </span>
                            <span className="text-[11px] text-stone-500 font-medium">
                              {cust.storeName}
                            </span>
                            {cust.tags.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                {cust.tags.slice(0, 2).map((t, idx) => (
                                  <span key={idx} className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Phone & City */}
                        <td className="p-3">
                          <div className="font-mono text-stone-800 text-[11px] dir-ltr text-right">
                            {cust.phone}
                          </div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{cust.city}</span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            cust.type === 'partner_wholesale' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                            cust.type === 'online_shop' ? 'bg-pink-50 text-pink-800 border-pink-200' :
                            'bg-blue-50 text-blue-800 border-blue-200'
                          }`}>
                            {cust.type === 'partner_wholesale' ? 'عمده‌فروش همکار' :
                             cust.type === 'online_shop' ? 'آنلاین‌شاپ / مزون' : 'مغازه‌دار شهرستان'}
                          </span>
                        </td>

                        {/* Trust Score */}
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                              isHighTrust ? 'bg-emerald-100 text-emerald-800' :
                              isLowTrust ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {cust.trustScore}
                            </div>
                            <span className="text-[10px] text-stone-500 font-medium">
                              {isHighTrust ? 'بسیار خوش‌حساب' : isLowTrust ? 'پرریسک' : 'متوسط'}
                            </span>
                          </div>
                        </td>

                        {/* Payment Terms */}
                        <td className="p-3">
                          {cust.paymentTerms === 'check_eligible' ? (
                            <div>
                              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                مجاز به چک صیادی
                              </span>
                              <div className="text-[10px] text-stone-400 mt-0.5">
                                سقف: {(cust.checkLimitToman / 1000000).toFixed(0)} میلیون ت
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] font-bold text-stone-700 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md">
                              فقط نقدی / واریز
                            </span>
                          )}
                        </td>

                        {/* Total Purchases */}
                        <td className="p-3">
                          <span className="font-bold text-stone-900 block">
                            {cust.totalPurchasesToman.toLocaleString('fa-IR')} ت
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {cust.orderCount} سفارش ثبت شده
                          </span>
                        </td>

                        {/* Shipping */}
                        <td className="p-3">
                          <span className="text-stone-700 text-[11px] font-medium">
                            {cust.preferredShipping}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenFollowUpMessage(cust)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="ارسال پیام آماده کاتالوگ یا پیگیری"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedCustomer(cust)}
                              className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors"
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

      {/* Tab 2: Follow-up Reminders Queue for Inactive Clients */}
      {activeTab === 'follow_ups' && (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                سیستم یادآوری پیگیری خودکار مشتریان غیرفعال
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                مشتریانی که بیش از ۲۵ روز است سفارش جدیدی ثبت نکرده‌اند یا بدهی دارند در این لیست قرار می‌گیرند. با ۱ کلیک پیام کاتالوگ تابستانه را در واتساپ، تلگرام یا پیامک ارسال کنید.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inactiveQueue.map((cust) => (
              <div key={cust.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{cust.name}</h4>
                      <p className="text-xs text-stone-500">{cust.storeName} • شهر {cust.city}</p>
                    </div>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                      نیازمند پیگیری
                    </span>
                  </div>

                  <div className="mt-3 p-3 bg-stone-50 rounded-lg text-xs text-stone-700 border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">علت پیگیری:</span>
                    <p className="text-stone-600 leading-relaxed">{cust.followUpReason}</p>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                    <span>آخرین سفارش: {cust.lastOrderDate}</span>
                    <span>موبایل: {cust.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleOpenFollowUpMessage(cust)}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>تولید و ارسال پیام آماده</span>
                  </button>
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-3 py-2 rounded-xl font-medium"
                  >
                    پرونده
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Fast 600 Telegram Importer */}
      {activeTab === 'telegram_importer' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <span className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <Upload className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                ورود سریع لیست ۶۰۰ تایی مخاطبین تلگرام و دفترچه تلفن
              </h3>
              <p className="text-xs text-stone-500">
                لیست شماره‌ها و نام‌های همکاران و خریداران را کپی و اینجا پیست کنید تا خودکار تفکیک شوند.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-700">
              متن خام شماره‌ها و نام‌ها (هر خط یک مخاطب: نام - شماره موبایل - شهر - نام مغازه):
            </label>
            <textarea
              rows={6}
              value={rawImportText}
              onChange={(e) => setRawImportText(e.target.value)}
              placeholder={`مثال:
حاج محمود کمالی - 09148882310 - تبریز - پوشاک خانواده
خانم رضایی - 09123334455 - رشت - بوتیک نیلوفر
اصغر شریفی - 09172039481 - شیراز - ارزان‌سرای شریفی
پخش کریمی - 09183319020 - کرمانشاه - پخش پوشاک کریمی`}
              className="w-full bg-stone-50 text-xs p-3 rounded-xl border border-stone-200 font-mono outline-none focus:bg-white focus:border-blue-500 leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={handleParseTelegramList}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-2xs"
              >
                پردازش و شناسایی مخاطبین
              </button>

              <button
                onClick={() => {
                  setRawImportText(`حاج بهرام ناصری - 09121118899 - قزوین - عمده‌فروشی ناصری
خانم طاهری - 09354447788 - بابل - مزون بهار
آقای علیرضا مرادی - 09139992211 - یزد - ارزان‌سرای پوشاک یزد
حاج قاسم داوودی - 09153332211 - زاهدان - بازار رسولی پوشاک`);
                }}
                className="text-xs text-stone-500 hover:text-stone-800 underline"
              >
                بارگذاری نمونه تستی
              </button>
            </div>
          </div>

          {/* Import Preview */}
          {importedPreview.length > 0 && (
            <div className="mt-4 pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">
                  ✅ {importedPreview.length} مخاطب با موفقیت شناسایی شد:
                </span>
                <button
                  onClick={handleApplyImport}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs transition-colors"
                >
                  تایید و افزودن به دیتابیس CRM
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto rounded-xl border border-stone-200 divide-y divide-stone-100 text-xs">
                {importedPreview.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between bg-stone-50">
                    <div>
                      <strong className="text-stone-900">{item.name}</strong>
                      <span className="text-stone-500 mr-2">({item.storeName} - {item.city})</span>
                    </div>
                    <span className="font-mono text-stone-700">{item.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Add New Customer */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">ثبت مشتری و همکار جدید</h3>
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
                    className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">نام فروشگاه / بنکداری:</label>
                  <input
                    type="text"
                    placeholder="مثال: پخش پوشاک محمدی"
                    value={newCustForm.storeName}
                    onChange={(e) => setNewCustForm({ ...newCustForm, storeName: e.target.value })}
                    className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200"
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
                    className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شهر / استان:</label>
                  <input
                    type="text"
                    value={newCustForm.city}
                    onChange={(e) => setNewCustForm({ ...newCustForm, city: e.target.value })}
                    className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">نوع مشتری:</label>
                  <select
                    value={newCustForm.type}
                    onChange={(e) => setNewCustForm({ ...newCustForm, type: e.target.value as CustomerType })}
                    className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200"
                  >
                    <option value="shop_keeper">مغازه‌دار شهرستان</option>
                    <option value="partner_wholesale">عمده‌فروش همکار (قیمت هم‌صنف)</option>
                    <option value="online_shop">آنلاین‌شاپ و مزون اینترنتی</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">امتیاز اعتبار چکی (1-100):</label>
                  <input
                    type="number"
                    value={newCustForm.trustScore}
                    onChange={(e) => setNewCustForm({ ...newCustForm, trustScore: Number(e.target.value) })}
                    className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200 font-bold text-center"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
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
                  <div className="pt-2 border-t border-stone-200">
                    <span className="text-stone-500 block mb-1">سقف اعتبار چک صیادی (تومان):</span>
                    <input
                      type="number"
                      value={newCustForm.checkLimitToman}
                      onChange={(e) => setNewCustForm({ ...newCustForm, checkLimitToman: Number(e.target.value) })}
                      className="w-full bg-white p-2 rounded-lg border border-stone-300 font-bold"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">روش ارسال ترجیحی:</label>
                  <select
                    value={newCustForm.preferredShipping}
                    onChange={(e) => setNewCustForm({ ...newCustForm, preferredShipping: e.target.value as any })}
                    className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200"
                  >
                    <option value="باربری وطن">باربری وطن (شوش)</option>
                    <option value="تیپاکس">تیپاکس بازار</option>
                    <option value="چاپار">چاپار</option>
                    <option value="باربری پیام‌گیر">باربری پیام‌گیر (خیام)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">کانال جذب:</label>
                  <select
                    value={newCustForm.channelSource}
                    onChange={(e) => setNewCustForm({ ...newCustForm, channelSource: e.target.value as any })}
                    className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200"
                  >
                    <option value="telegram">کانال تلگرام</option>
                    <option value="eitaa">ایتا</option>
                    <option value="rubika">روبیکا</option>
                    <option value="bale">بله</option>
                    <option value="instagram">اینستاگرام</option>
                    <option value="in_person">حضوری در بازار</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl transition-colors shadow-xs"
                >
                  ثبت در دیتابیس CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: 1-Click Message Generator */}
      {isSendMessageModalOpen && messageTargetCustomer && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Send className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
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
                className="w-full bg-stone-50 text-xs p-3 rounded-xl border border-stone-200 font-sans leading-relaxed outline-none focus:bg-white focus:border-amber-500"
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
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  کپی متن پیام
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: View Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-stone-500">{selectedCustomer.storeName} • {selectedCustomer.city}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl text-stone-700">
                <div><span>موبایل:</span> <strong className="font-mono text-stone-900">{selectedCustomer.phone}</strong></div>
                <div><span>امتیاز صیاد/اعتبار:</span> <strong className="text-amber-800">{selectedCustomer.trustScore} از ۱۰۰</strong></div>
                <div><span>مجموع خریدها:</span> <strong className="text-stone-900">{selectedCustomer.totalPurchasesToman.toLocaleString('fa-IR')} تومان</strong></div>
                <div><span>تعداد سفارش:</span> <strong>{selectedCustomer.orderCount} فاکتور</strong></div>
                <div><span>باربری ترجیحی:</span> <strong>{selectedCustomer.preferredShipping}</strong></div>
                <div><span>آخرین سفارش:</span> <strong>{selectedCustomer.lastOrderDate}</strong></div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900 block">یادداشت و پیشینه بازاری:</span>
                <p className="text-amber-800 leading-relaxed text-[11px]">{selectedCustomer.notes}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="bg-stone-900 text-white font-bold text-xs px-4 py-2 rounded-xl"
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
