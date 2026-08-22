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
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl shadow-2xs">
                <Users className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#18181B]">
                  مدیریت مشتریان و CRM (اعتبارسنجی چکی و سابقه خرید)
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  جایگزین دفترچه تلفن سنتی، بررسی سقف اعتبار چکی صیاد و پیگیری مشتریان تلگرام
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
              <span>ورود و خروجی با اکسل (Excel)</span>
            </button>

            <button
              id="btn-open-telegram-importer"
              onClick={() => setActiveTab('telegram_importer')}
              className="text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8] text-[#18181B] border border-[#DDD5C0] font-bold px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-4 h-4 text-[#8C6D37]" />
              <span>ورود سریع لیست متنی تلگرام</span>
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
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E6DEC8] text-xs">
          <button
            onClick={() => setActiveTab('all_customers')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'all_customers'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            همه مشتریان و خریداران ({customers.length})
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

      {/* Tab 1: All Customers View */}
      {activeTab === 'all_customers' && (
        <div className="space-y-4">
          
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
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
                <option value="retail">مشتری تکی و مصرف‌کننده نهایی</option>
              </select>

              <select
                value={selectedTrustFilter}
                onChange={(e) => setSelectedTrustFilter(e.target.value)}
                className="bg-[#FAF7F2] text-xs py-2.5 px-3 rounded-xl border border-[#DDD5C0] text-stone-800 outline-none font-medium"
              >
                <option value="all">همه امتیازهای اعتبار</option>
                <option value="high">خوش‌حساب و مجاز به چک (۸۵+)</option>
                <option value="medium">متوسط (۶۰ تا ۸۴)</option>
                <option value="low">پرریسک / فقط نقدی (زیر ۶۰)</option>
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
                    <th className="p-3.5">نوع مشتری</th>
                    <th className="p-3.5">امتیاز اعتبار چکی (Trust)</th>
                    <th className="p-3.5">شرایط پرداخت مجاز</th>
                    <th className="p-3.5">جمع خرید کل</th>
                    <th className="p-3.5">ارسال ترجیحی</th>
                    <th className="p-3.5 text-center">اقدام سریع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF7F2]">
                  {filteredCustomers.map((cust) => {
                    const isHighTrust = cust.trustScore >= 85;
                    const isLowTrust = cust.trustScore < 60;

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

                        {/* Type */}
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            cust.type === 'partner_wholesale' ? 'bg-[#FAF7F2] text-[#8C6D37] border-[#DDD5C0]' :
                            cust.type === 'online_shop' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                            cust.type === 'retail' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
                            'bg-stone-100 text-stone-800 border-stone-200'
                          }`}>
                            {cust.type === 'partner_wholesale' ? 'عمده‌فروش همکار' :
                             cust.type === 'online_shop' ? 'آنلاین‌شاپ / مزون' :
                             cust.type === 'retail' ? 'مشتری تکی / مصرف‌کننده' : 'مغازه‌دار شهرستان'}
                          </span>
                        </td>

                        {/* Trust Score */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border ${
                              isHighTrust ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              isLowTrust ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-900 border-amber-200'
                            }`}>
                              {cust.trustScore}
                            </div>
                            <span className="text-[10px] text-stone-500 font-medium">
                              {isHighTrust ? 'بسیار خوش‌حساب' : isLowTrust ? 'پرریسک' : 'متوسط'}
                            </span>
                          </div>
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

                        {/* Shipping */}
                        <td className="p-3.5">
                          <span className="text-stone-700 text-[11px] font-medium">
                            {cust.preferredShipping}
                          </span>
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

      {/* Tab 2: Follow-up Reminders Queue for Inactive Clients */}
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

      {/* Tab 3: Fast 600 Telegram Importer */}
      {activeTab === 'telegram_importer' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E6DEC8]">
            <span className="p-2.5 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl">
              <Upload className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-[#18181B]">
                ورود سریع لیست مخاطبین تلگرام و دفترچه تلفن
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
              className="w-full bg-[#FAF7F2] text-xs p-3.5 rounded-xl border border-[#DDD5C0] font-mono outline-none focus:bg-white focus:border-[#D4AF37] leading-relaxed text-stone-900"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={handleParseTelegramList}
                className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs border border-[#3F3F46]"
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
                className="text-xs text-[#8C6D37] hover:underline font-bold"
              >
                بارگذاری نمونه تستی
              </button>
            </div>
          </div>

          {/* Import Preview */}
          {importedPreview.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#E6DEC8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">
                  ✅ {importedPreview.length} مخاطب با موفقیت شناسایی شد:
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

      {/* MODAL 1: Add New Customer */}
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
                    <option value="retail">مشتری تکی (مصرف‌کننده / وب‌سایت)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">امتیاز اعتبار چکی (1-100):</label>
                  <input
                    type="number"
                    value={newCustForm.trustScore}
                    onChange={(e) => setNewCustForm({ ...newCustForm, trustScore: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-black text-center text-stone-900"
                  />
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">روش ارسال ترجیحی:</label>
                  <select
                    value={newCustForm.preferredShipping}
                    onChange={(e) => setNewCustForm({ ...newCustForm, preferredShipping: e.target.value as any })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
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
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
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

      {/* MODAL 2: 1-Click Message Generator */}
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

      {/* MODAL 3: View Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E6DEC8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div>
                <h3 className="text-base font-black text-[#18181B]">{selectedCustomer.name}</h3>
                <p className="text-xs text-stone-500">{selectedCustomer.storeName} • {selectedCustomer.city}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#DDD5C0] text-stone-700">
                <div><span>موبایل:</span> <strong className="font-mono text-stone-900">{selectedCustomer.phone}</strong></div>
                <div><span>امتیاز صیاد/اعتبار:</span> <strong className="text-[#8C6D37]">{selectedCustomer.trustScore} از ۱۰۰</strong></div>
                <div><span>مجموع خریدها:</span> <strong className="text-stone-900">{selectedCustomer.totalPurchasesToman.toLocaleString('fa-IR')} تومان</strong></div>
                <div><span>تعداد سفارش:</span> <strong>{selectedCustomer.orderCount} فاکتور</strong></div>
                <div><span>باربری ترجیحی:</span> <strong>{selectedCustomer.preferredShipping}</strong></div>
                <div><span>آخرین سفارش:</span> <strong>{selectedCustomer.lastOrderDate}</strong></div>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] space-y-1">
                <span className="font-bold text-[#18181B] block">یادداشت و پیشینه بازاری:</span>
                <p className="text-stone-600 leading-relaxed text-[11px]">{selectedCustomer.notes}</p>
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
