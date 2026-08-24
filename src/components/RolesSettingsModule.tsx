import React, { useState, useRef } from 'react';
import { 
  Crown, 
  CheckCircle2, 
  Lock, 
  Package, 
  Scissors,
  Receipt, 
  CreditCard, 
  Users, 
  Share2, 
  Truck, 
  ShoppingBag, 
  ShieldCheck, 
  Save, 
  Check, 
  UserCheck, 
  ShoppingBasket,
  Download,
  Upload,
  FileSpreadsheet,
  Database,
  RefreshCw,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { 
  ModuleTab, 
  UserRoleType, 
  Product, 
  Customer, 
  Invoice, 
  CheckItem, 
  FabricSupplier, 
  TailorWorkshop, 
  ProductionBatch, 
  CustomerUser, 
  SiteSettings 
} from '../types';
import { ROLE_PERMISSIONS, isTabAllowedForRole } from '../utils/rolePermissions';

interface RolesSettingsModuleProps {
  currentRole: UserRoleType;
  onRoleChange: (role: UserRoleType) => void;
  products?: Product[];
  customers?: Customer[];
  invoices?: Invoice[];
  checks?: CheckItem[];
  fabricSuppliers?: FabricSupplier[];
  tailorWorkshops?: TailorWorkshop[];
  productionBatches?: ProductionBatch[];
  customerUsers?: CustomerUser[];
  siteSettings?: SiteSettings;
  onRestoreFullState?: (restoredState: any) => void;
  onResetToSampleData?: () => void;
}

export const RolesSettingsModule: React.FC<RolesSettingsModuleProps> = ({
  currentRole,
  onRoleChange,
  products = [],
  customers = [],
  invoices = [],
  checks = [],
  fabricSuppliers = [],
  tailorWorkshops = [],
  productionBatches = [],
  customerUsers = [],
  siteSettings,
  onRestoreFullState,
  onResetToSampleData
}) => {
  const [adminPhone, setAdminPhone] = useState('09123456789');
  const [adminName, setAdminName] = useState('حاج رضا اسدی');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);
  const [backupErrorMessage, setBackupErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleConfig = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.super_admin;

  const modulesList: {
    id: ModuleTab;
    title: string;
    desc: string;
    icon: React.ElementType;
  }[] = [
    {
      id: 'dashboard',
      title: 'داشبورد مرکزی و آمار',
      desc: 'مشاهده شاخص‌های کلیدی، نمودارهای فروش و اولویت‌های روزانه',
      icon: Crown,
    },
    {
      id: 'inventory',
      title: 'انبارداری، پک‌بندی و بهای تمام‌شده',
      desc: 'مدیریت موجودی پک‌ها، قیمت عمده و تکی، بهای تمام‌شده پارچه و تغییر درصدی قیمت‌ها',
      icon: Package,
    },
    {
      id: 'production',
      title: 'تولید، تامین‌کنندگان پارچه و دوزندگان (ویژه سوپر ادمین)',
      desc: 'مدیریت بنکداران پارچه مولوی، کارگاه‌های خیاطی و برش، استعلام قیمت متری، پیگیری پارت تولید و تاریخ تحویل',
      icon: Scissors,
    },
    {
      id: 'crm',
      title: 'مشتریان و مدیریت اعتبار (CRM)',
      desc: 'مشاهده لیست همکاران بازار، ورود دسته‌جمعی از اکسل، سقف اعتبار چکی و پیگیری',
      icon: Users,
    },
    {
      id: 'retail_customers',
      title: 'مشتریان تکی و وب‌سایت',
      desc: 'لیست خریداران تکی سایت، ثبت آدرس‌ها و عضویت در باشگاه مشتریان',
      icon: ShoppingBasket,
    },
    {
      id: 'sales',
      title: 'فروش، صدور فاکتور و قیمت‌گذاری چندسطحی',
      desc: 'صدور فاکتور سنتی بازار، اعمال تخفیف نقدی و پکی، تسویه حساب و چاپ فاکتور',
      icon: Receipt,
    },
    {
      id: 'finance',
      title: 'حسابداری و استعلام چک‌های صیادی',
      desc: 'ثبت و پیگیری چک‌های بنفش صیادی، تقویم سررسید، گزارش سود ناخالص و گردش مالی',
      icon: CreditCard,
    },
    {
      id: 'marketing',
      title: 'اتوماسیون محتوا و بازاریابی هوش مصنوعی (Gemini)',
      desc: 'کپشن‌نویسی هوشمند ژورنالی، زمان‌بندی و انتشار در تلگرام، ایتا، روبیکا، بله و اینستاگرام',
      icon: Share2,
    },
    {
      id: 'storefront',
      title: 'ویترین و تنظیمات فروشگاه آنلاین',
      desc: 'مدیریت اطلاعات و بنرهای سایت، شرایط ارسال رایگان و نظارت بر سفارشات اینترنتی',
      icon: ShoppingBag,
    },
    {
      id: 'logistics',
      title: 'لجستیک، بسته‌بندی و بیجک باربری',
      desc: 'هماهنگی با باربری وطن، چاپار، تیپاکس و صدور کد رهگیری و ارسال پیامک به خریدار',
      icon: Truck,
    },
    {
      id: 'roles',
      title: 'امنیت و کنترل مرکزی سیستم',
      desc: 'پشتیبان‌گیری از داده‌ها، دسترسی به دیتابیس و مدیریت مجوزهای پرسنل و حجره',
      icon: ShieldCheck,
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // ----------------------------------------------------
  // Fix 4: Full System State Export as JSON
  // ----------------------------------------------------
  const handleExportFullJsonBackup = () => {
    try {
      const fullBackupData = {
        app: 'پوشاک من و تو - سوپر ادمین',
        exportDate: new Date().toISOString(),
        jalaliDate: new Date().toLocaleDateString('fa-IR'),
        version: '2.5.0',
        data: {
          products,
          customers,
          invoices,
          checks,
          fabricSuppliers,
          tailorWorkshops,
          productionBatches,
          customerUsers,
          siteSettings
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackupData, null, 2));
      const downloadAnchor = document.createElement('a');
      const filename = `manoto-backup-${new Date().toISOString().slice(0, 10)}.json`;
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setBackupSuccessMessage(`فایل پشتیبان کامل (${filename}) با موفقیت دانلود شد.`);
      setTimeout(() => setBackupSuccessMessage(null), 4000);
    } catch (err: any) {
      setBackupErrorMessage('خطا در ایجاد فایل پشتیبان: ' + (err.message || 'نامشخص'));
      setTimeout(() => setBackupErrorMessage(null), 4000);
    }
  };

  // ----------------------------------------------------
  // Fix 4: Restore Full System State from JSON
  // ----------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.data && onRestoreFullState) {
            onRestoreFullState(parsed.data);
            setBackupSuccessMessage(`اطلاعات سیستم از فایل «${file.name}» با موفقیت بازیابی شد.`);
            setTimeout(() => setBackupSuccessMessage(null), 5000);
          } else if (parsed && onRestoreFullState) {
            onRestoreFullState(parsed);
            setBackupSuccessMessage(`اطلاعات سیستم با موفقیت بازیابی گردید.`);
            setTimeout(() => setBackupSuccessMessage(null), 5000);
          } else {
            throw new Error('فرمت فایل پشتیبان معتبر نیست.');
          }
        } catch (err: any) {
          setBackupErrorMessage('خطا در خواندن فایل پشتیبان: ' + (err.message || 'فایل نامعتبر است.'));
          setTimeout(() => setBackupErrorMessage(null), 5000);
        }
      };
    }
    // reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ----------------------------------------------------
  // Fix 4: Export CSV with Persian BOM for Excel Compatibility
  // ----------------------------------------------------
  const downloadCsv = (content: string, filename: string) => {
    const bom = '\uFEFF'; // UTF-8 Byte Order Mark for Excel
    const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportProductsCsv = () => {
    const headers = ['کد SKU', 'نام کالا', 'دسته‌بندی', 'جنس پارچه', 'موجودی پک', 'تعداد در پک', 'قیمت عمده پک (تومان)', 'قیمت تک (تومان)'];
    const rows = products.map(p => [
      `"${p.sku}"`,
      `"${p.name}"`,
      `"${p.category || ''}"`,
      `"${p.fabricType || ''}"`,
      p.packStock,
      p.packSize,
      p.baseWholesalePricePerPack,
      p.singleRetailPriceToman || (p.baseWholesalePricePerUnit * 1.5)
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(csvContent, `manoto-products-${new Date().toISOString().slice(0, 10)}.csv`);
    setBackupSuccessMessage('اکسل موجودی و کالاهای انبار دانلود شد.');
    setTimeout(() => setBackupSuccessMessage(null), 3000);
  };

  const handleExportCustomersCsv = () => {
    const headers = ['نام مشتری', 'نام فروشگاه/حجره', 'شماره تماس', 'شهر', 'استان', 'امتیاز اعتبار', 'سقف اعتبار چکی (تومان)'];
    const rows = customers.map(c => [
      `"${c.name}"`,
      `"${c.storeName || ''}"`,
      `"${c.phone}"`,
      `"${c.city}"`,
      `"${c.province || ''}"`,
      c.trustScore,
      c.maxCreditLimitToman || 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(csvContent, `manoto-customers-crm-${new Date().toISOString().slice(0, 10)}.csv`);
    setBackupSuccessMessage('اکسل لیست مشتریان و همکاران CRM دانلود شد.');
    setTimeout(() => setBackupSuccessMessage(null), 3000);
  };

  const handleExportInvoicesCsv = () => {
    const headers = ['شماره فاکتور', 'نام مشتری', 'فروشگاه', 'شهر', 'تاریخ', 'مبلغ کل (تومان)', 'نوع پرداخت', 'وضعیت'];
    const rows = invoices.map(i => [
      `"${i.invoiceNumber}"`,
      `"${i.customerName}"`,
      `"${i.storeName || ''}"`,
      `"${i.city}"`,
      `"${i.date}"`,
      i.finalAmountToman,
      i.paymentType === 'cash' ? 'نقدی' : 'چکی',
      i.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(csvContent, `manoto-invoices-${new Date().toISOString().slice(0, 10)}.csv`);
    setBackupSuccessMessage('اکسل فاکتورهای فروش دانلود شد.');
    setTimeout(() => setBackupSuccessMessage(null), 3000);
  };

  const handleExportChecksCsv = () => {
    const headers = ['شماره چک', 'نام مشتری', 'بانک', 'مبلغ (تومان)', 'تاریخ سررسید', 'شناسه صیاد', 'وضعیت'];
    const rows = checks.map(c => [
      `"${c.checkNumber}"`,
      `"${c.customerName}"`,
      `"${c.bankName}"`,
      c.amountToman,
      `"${c.dueDate}"`,
      `"${c.sayadNumber || ''}"`,
      c.status === 'cleared' ? 'پاس شده' : c.status === 'bounced' ? 'برگشتی' : 'در جریان'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(csvContent, `manoto-checks-${new Date().toISOString().slice(0, 10)}.csv`);
    setBackupSuccessMessage('اکسل چک‌های صیادی دانلود شد.');
    setTimeout(() => setBackupSuccessMessage(null), 3000);
  };

  return (
    <div id="roles-settings-module" className="space-y-6 animate-in fade-in duration-200" dir="rtl">
      
      {/* Top Role Banner */}
      <div className="bg-[#18181B] text-[#FAF7F2] p-6 rounded-2xl border border-[#3F3F46] shadow-sm relative overflow-hidden">
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#27272A] border border-[#3F3F46] text-[#D4AF37] flex items-center justify-center font-black">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#FAF7F2]">
                  مدیریت نقش‌ها، امنیت و پشتیبان‌گیری سیستم
                </h2>
                <span className="bg-[#D4AF37] text-[#18181B] text-xs px-2.5 py-0.5 rounded-full font-black">
                  {roleConfig.shortLabel}
                </span>
              </div>
              <p className="text-xs text-[#E6DEC8]/80 mt-1">
                {roleConfig.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#27272A] border border-[#3F3F46] px-3.5 py-2 rounded-xl text-xs">
            <span className="text-stone-300">نقش فعال سیستم:</span>
            <strong className="text-[#D4AF37] font-black">
              {roleConfig.title}
            </strong>
          </div>
        </div>
      </div>

      {/* Fix 4: System Backup, Restore & Excel Export Center */}
      <section className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6DEC8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-black">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#18181B]">
                پشتیبان‌گیری کامل و خروجی اکسل (ویژه سوپر ادمین)
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                دانلود نسخه پشتیبان کل دیتابیس یا خروجی اختصاصی اکسل/CSV برای چاپ و بایگانی سنتی
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            داده‌های زنده: {products.length} کالا • {customers.length} مشتری • {invoices.length} فاکتور
          </span>
        </div>

        {/* Status Alerts */}
        {backupSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{backupSuccessMessage}</span>
          </div>
        )}

        {backupErrorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{backupErrorMessage}</span>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          
          {/* Action 1: Export Full JSON State */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC8] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#18181B] font-black text-xs mb-1">
                <Download className="w-4 h-4 text-[#8C6D37]" />
                <span>دانلود پشتیبان کامل (JSON)</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                شامل کلیه کالاها، انبار، مشتریان، فاکتورها، چک‌ها، دوزندگان و تنظیمات جهت بایگانی یا انتقال.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportFullJsonBackup}
              className="w-full bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-bold text-xs py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>دانلود فایل Backup</span>
            </button>
          </div>

          {/* Action 2: Import & Restore JSON State */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC8] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#18181B] font-black text-xs mb-1">
                <Upload className="w-4 h-4 text-[#8C6D37]" />
                <span>بازیابی اطلاعات از فایل پشتیبان</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                بارگذاری فایل JSON پشتیبان قبلی و بازنشانی کامل وضعیت سیستم بدون نیاز به تایپ دستی.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] font-black text-xs py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>انتخاب فایل و بازیابی</span>
              </button>
            </div>
          </div>

          {/* Action 3: Reset to Factory / Sample Data */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC8] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#18181B] font-black text-xs mb-1">
                <RefreshCw className="w-4 h-4 text-[#8C6D37]" />
                <span>بازنشانی به داده‌های نمونه اولیه</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                بارگذاری مجدد اطلاعات پیش‌فرض پوشاک من و تو (مدل‌های شلوار زنانه، مشتریان و چک‌های تستی).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('آیا از بازنشانی داده‌های نمونه اولیه اطمینان دارید؟')) {
                  if (onResetToSampleData) {
                    onResetToSampleData();
                    setBackupSuccessMessage('اطلاعات پیش‌فرض سیستم بازنشانی شد.');
                    setTimeout(() => setBackupSuccessMessage(null), 3000);
                  }
                }
              }}
              className="w-full bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs py-2 rounded-xl border border-stone-300 transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
              <span>بازنشانی داده‌های پیش‌فرض</span>
            </button>
          </div>

        </div>

        {/* Individual CSV / Excel Download Center */}
        <div className="pt-3 border-t border-[#E6DEC8]">
          <h4 className="text-xs font-black text-[#18181B] mb-2.5 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>خروجی اکسل و CSV تفکیکی (با پشتیبانی کامل از متن فارسی):</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={handleExportProductsCsv}
              className="p-2.5 bg-white hover:bg-[#FAF7F2] text-stone-800 rounded-xl border border-[#DDD5C0] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>اکسل موجودی کالا</span>
            </button>

            <button
              type="button"
              onClick={handleExportCustomersCsv}
              className="p-2.5 bg-white hover:bg-[#FAF7F2] text-stone-800 rounded-xl border border-[#DDD5C0] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-blue-700" />
              <span>اکسل مشتریان CRM</span>
            </button>

            <button
              type="button"
              onClick={handleExportInvoicesCsv}
              className="p-2.5 bg-white hover:bg-[#FAF7F2] text-stone-800 rounded-xl border border-[#DDD5C0] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-700" />
              <span>اکسل فاکتورهای فروش</span>
            </button>

            <button
              type="button"
              onClick={handleExportChecksCsv}
              className="p-2.5 bg-white hover:bg-[#FAF7F2] text-stone-800 rounded-xl border border-[#DDD5C0] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-purple-700" />
              <span>اکسل چک‌های صیادی</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Role Switcher for Testing / Permissions Simulation */}
      <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#8C6D37]" />
            <h3 className="font-black text-sm text-[#18181B]">
              تغییر نقش کاربری جهت شبیه‌سازی دسترسی پرسنل بازار
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            (روی هر نقش کلیک کنید تا منو و بخش‌های مجاز بلافاصله فیلتر شوند)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
          {(Object.keys(ROLE_PERMISSIONS) as UserRoleType[]).map((roleKey) => {
            const config = ROLE_PERMISSIONS[roleKey];
            const isSelected = currentRole === roleKey;
            return (
              <button
                key={roleKey}
                type="button"
                onClick={() => onRoleChange(roleKey)}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B] shadow-md ring-2 ring-[#D4AF37]/30'
                    : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0] hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{config.shortLabel}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                </div>
                <p className={`text-[10px] mt-1 line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {config.title}
                </p>
                <span className={`text-[10px] font-bold mt-2 ${isSelected ? 'text-[#D4AF37]' : 'text-[#8C6D37]'}`}>
                  {config.allowedTabs.length} ماژول مجاز
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Permissions Matrix & Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E6DEC8]">
            <Crown className="w-5 h-5 text-[#8C6D37]" />
            <h3 className="font-black text-sm text-[#18181B]">مشخصات کاربر فعال</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            {saveSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>اطلاعات کاربر با موفقیت به‌روزرسانی شد.</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">نام و نام خانوادگی:</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">شماره همراه پرسنلی:</label>
              <input
                type="text"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">نقش سازمانی:</label>
              <div className="p-2.5 bg-stone-100 rounded-xl border border-stone-200 font-bold text-stone-800">
                {roleConfig.title}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-bold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                <span>ذخیره تغییرات پروفایل</span>
              </button>
            </div>
          </form>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] text-[11px] text-[#8C6D37] space-y-1">
            <span className="font-bold block text-[#18181B]">کنترل نشست و لاگ:</span>
            <p>کلیه درخواست‌ها با توکن نشست کاربری {roleConfig.shortLabel} ثبت و اعتبارسنجی می‌گردد.</p>
          </div>
        </div>

        {/* Dynamic Permissions Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-sm text-[#18181B]">
                وضعیت دسترسی به ماژول‌های سیستم برای {roleConfig.shortLabel}
              </h3>
            </div>
            <span className="text-xs bg-[#FAF7F2] text-[#18181B] font-bold px-2.5 py-0.5 rounded-full border border-[#DDD5C0]">
              {roleConfig.allowedTabs.length} از {modulesList.length} ماژول مجاز
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modulesList.map((mod) => {
              const Icon = mod.icon;
              const isAllowed = isTabAllowedForRole(mod.id, currentRole);
              return (
                <div 
                  key={mod.id}
                  className={`p-3 rounded-xl border space-y-1.5 transition-colors ${
                    isAllowed
                      ? 'bg-[#FAF7F2] border-[#E6DEC8]'
                      : 'bg-stone-50/70 border-stone-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#18181B]">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isAllowed ? 'bg-[#18181B] text-[#D4AF37]' : 'bg-stone-200 text-stone-500'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{mod.title}</span>
                    </div>
                    {isAllowed ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>مجاز</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3 text-stone-500" />
                        <span>محدود</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
