import React, { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
  FileText,
  Activity,
  Clock,
  Key,
  HardDrive,
  Smartphone,
  Sparkles,
  ChevronLeft,
  Trash2,
  Search,
  SlidersHorizontal,
  X,
  Eye,
  EyeOff,
  KeyRound,
  ShieldAlert
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
import { ADMIN_SECURITY_ACCOUNTS, verifyRoleCredentials } from '../utils/authConfig';

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

type MobileSubTab = 'roles' | 'backup' | 'telemetry' | 'profile';

interface AuditLogItem {
  id: string;
  action: string;
  category: 'security' | 'backup' | 'data' | 'system';
  timestamp: string;
  user: string;
  status: 'success' | 'warning' | 'info';
  details: string;
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
  // Mobile ergonomic sub-tab state
  const [mobileSubTab, setMobileSubTab] = useState<MobileSubTab>('roles');

  // Permissions filtering & search
  const [permissionsSearch, setPermissionsSearch] = useState('');
  const [permissionsFilter, setPermissionsFilter] = useState<'all' | 'allowed' | 'restricted'>('all');

  // Admin Profile form
  const [adminPhone, setAdminPhone] = useState('09123456789');
  const [adminName, setAdminName] = useState('حاج رضا اسدی');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<string>(() => {
    try {
      return localStorage.getItem('manoto_last_backup_date') || 'ثبت نشده';
    } catch {
      return 'ثبت نشده';
    }
  });

  // Backup & alert states
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);
  const [backupErrorMessage, setBackupErrorMessage] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [cacheClearSuccess, setCacheClearSuccess] = useState(false);

  // Security Role Switch Challenge States
  const [roleAuthModalRole, setRoleAuthModalRole] = useState<UserRoleType | null>(null);
  const [roleAuthPassword, setRoleAuthPassword] = useState('');
  const [roleAuthError, setRoleAuthError] = useState('');
  const [roleAuthShowPassword, setRoleAuthShowPassword] = useState(false);
  const [roleAuthShowHint, setRoleAuthShowHint] = useState(false);

  const handleVerifyAndChangeRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleAuthModalRole) return;
    setRoleAuthError('');

    if (verifyRoleCredentials(roleAuthModalRole, roleAuthPassword)) {
      const targetRole = roleAuthModalRole;
      const targetConf = ROLE_PERMISSIONS[targetRole];
      onRoleChange(targetRole);
      addAuditLog('تغییر نقش با احراز هویت امنیتی', 'security', `دسترسی جاری با تأیید کلمه عبور به «${targetConf.shortLabel}» سوئیچ شد`);
      setBackupSuccessMessage(`نقش فعال سیستم با تأیید موفق کلمه عبور به «${targetConf.shortLabel}» ارتقا یافت.`);
      setRoleAuthModalRole(null);
      setRoleAuthPassword('');
      setRoleAuthShowHint(false);
      setTimeout(() => setBackupSuccessMessage(null), 5000);
    } else {
      setRoleAuthError('کلمه عبور وارد شده نادرست است! دسترسی به این حساب امکان‌پذیر نیست.');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleConfig = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.super_admin;

  // Real-time system audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      action: 'ورود موفق به نشست سوپر ادمین',
      category: 'security',
      timestamp: '۱۰ دقیقه پیش',
      user: 'حاج رضا اسدی',
      status: 'success',
      details: 'تأیید هویت بیومتریک موبایل با آدرس محلی کارگاه'
    },
    {
      id: 'log-2',
      action: 'همگام‌سازی دیتابیس کالاها و انبار',
      category: 'data',
      timestamp: '۲۵ دقیقه پیش',
      user: 'سیستم خودکار',
      status: 'info',
      details: `${products.length} کالا و پک فعال در انبار راستی‌آزمایی شد`
    },
    {
      id: 'log-3',
      action: 'تغییر وضعیت نقش کاربری سیستم',
      category: 'security',
      timestamp: '۱ ساعت پیش',
      user: 'مدیریت مرکزی',
      status: 'info',
      details: `نقش فعال به «${roleConfig.shortLabel}» تنظیم گردید`
    },
    {
      id: 'log-4',
      action: 'بررسی سلامت کش و کوکی‌های محلی',
      category: 'system',
      timestamp: '۲ ساعت پیش',
      user: 'هسته سیستم',
      status: 'success',
      details: 'عدم وجود تداخل، حافظه لوکال کاملاً پایدار'
    }
  ]);

  const addAuditLog = (action: string, category: 'security' | 'backup' | 'data' | 'system', details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      action,
      category,
      timestamp: 'لحظاتی پیش',
      user: adminName,
      status: 'success',
      details
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 7)]);
  };

  const modulesList: {
    id: ModuleTab;
    title: string;
    desc: string;
    icon: React.ElementType;
    categoryTag: string;
  }[] = [
    {
      id: 'dashboard',
      title: 'داشبورد مرکزی و نبض بازار',
      desc: 'مشاهده شاخص‌های کلیدی، نمودارهای مالی، اولویت‌های روزانه و ویترین نقدینگی',
      icon: Crown,
      categoryTag: 'مدیریت اجرایی'
    },
    {
      id: 'inventory',
      title: 'انبارداری، پک‌بندی و تغییر درصدی',
      desc: 'مدیریت موجودی پک‌ها، قیمت عمده و تکی، بهای تمام‌شده پارچه و تنظیم درصدی سریع قیمت‌ها',
      icon: Package,
      categoryTag: 'انبار و کالا'
    },
    {
      id: 'production',
      title: 'کارگاه تولید، پارچه و دوزندگان',
      desc: 'بنکداران پارچه مولوی، کارگاه‌های برش و خیاطی، استعلام متری، پیگیری پارت تولید و تاریخ تحویل',
      icon: Scissors,
      categoryTag: 'تولید و دوزندگی'
    },
    {
      id: 'crm',
      title: 'همکاران عمده و اعتبار سنجی (CRM)',
      desc: 'لیست مغازه‌داران بازار، ثبت خوش‌حسابی، سقف چک، پیگیری سفارش مجدد و تماس تلفنی مستقیم',
      icon: Users,
      categoryTag: 'باشگاه مشتریان'
    },
    {
      id: 'retail_customers',
      title: 'مشتریان خرد و وب‌سایت',
      desc: 'خریداران تک‌فروشی سایت، آدرس‌های پستی، باشگاه مشتریان و تاریخچه سفارشات اینترنتی',
      icon: ShoppingBasket,
      categoryTag: 'فروش خرد'
    },
    {
      id: 'sales',
      title: 'صدور فاکتور و قیمت‌گذاری چندسطحی',
      desc: 'صدور فاکتور سنتی و رسمی، اعمال تخفیف نقدی و پکی، تسویه حساب فوری و چاپ فاکتور بیجک',
      icon: Receipt,
      categoryTag: 'فروش و فاکتور'
    },
    {
      id: 'finance',
      title: 'خزانه، حسابداری و چک‌های صیادی',
      desc: 'استعلام چک‌های بنفش صیادی، تقویم سررسید وصولی‌ها، تراز صندوق نقدی و محاسبه سود ناخالص',
      icon: CreditCard,
      categoryTag: 'مالی و چک'
    },
    {
      id: 'marketing',
      title: 'دستیار بازاریابی هوش مصنوعی (Gemini)',
      desc: 'تولید کپشن‌های تلگرام و ایتا، عکاسی ژورنالی، زمان‌بندی روبیکا و بهینه‌سازی فروش مجازی',
      icon: Share2,
      categoryTag: 'هوش مصنوعی'
    },
    {
      id: 'storefront',
      title: 'ویترین و تنظیمات فروشگاه آنلاین',
      desc: 'مدیریت بنرهای اسلایدر، شرایط ارسال رایگان، هدر و نظارت بر خرید آنلاین مغازه‌داران',
      icon: ShoppingBag,
      categoryTag: 'سایت و ویترین'
    },
    {
      id: 'logistics',
      title: 'لجستیک، باربری و چاپ بیجک',
      desc: 'هماهنگی با باربری وطن، پیام‌شمس، تیپاکس و چاپ برچسب کارتن بسته‌بندی با پیامک کد رهگیری',
      icon: Truck,
      categoryTag: 'ارسال و باربری'
    },
    {
      id: 'order_tracking',
      title: 'مدیریت و پیگیری سفارشات (کی چی سفارش داده؟)',
      desc: 'مشاهده نام خریدار، اقلام دقیق سفارش، آدرس تحویل، تغییر وضعیت بسته‌بندی و صدور بارنامه',
      icon: Truck,
      categoryTag: 'ارسال و پیگیری'
    },
    {
      id: 'roles',
      title: 'امنیت، کنترل روت و سوپر ادمین',
      desc: 'پشتیبان‌گیری کامل از دیتابیس، بازیابی فایل JSON، اکسل با UTF-8 و مدیریت مجوزهای پرسنل',
      icon: ShieldCheck,
      categoryTag: 'امنیت و سیستم'
    },
  ];

  // Filter modules based on search and status
  const filteredModules = useMemo(() => {
    return modulesList.filter(mod => {
      const isAllowed = isTabAllowedForRole(mod.id, currentRole);
      if (permissionsFilter === 'allowed' && !isAllowed) return false;
      if (permissionsFilter === 'restricted' && isAllowed) return false;

      if (!permissionsSearch.trim()) return true;
      const q = permissionsSearch.toLowerCase();
      return mod.title.toLowerCase().includes(q) || mod.desc.toLowerCase().includes(q) || mod.categoryTag.toLowerCase().includes(q);
    });
  }, [modulesList, currentRole, permissionsFilter, permissionsSearch]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    addAuditLog('به‌روزرسانی پروفایل سوپر ادمین', 'security', `اطلاعات مدیر (${adminName} - ${adminPhone}) ذخیره گردید`);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Full System State Export as JSON
  const handleExportFullJsonBackup = () => {
    try {
      const nowStr = new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      const fullBackupData = {
        app: 'پوشاک من و تو - سوپر ادمین مرکزی',
        exportDate: new Date().toISOString(),
        jalaliDate: nowStr,
        version: '3.0.0',
        metadata: {
          productsCount: products.length,
          customersCount: customers.length,
          invoicesCount: invoices.length,
          checksCount: checks.length,
          suppliersCount: fabricSuppliers.length,
          workshopsCount: tailorWorkshops.length,
        },
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
      const filename = `manoto-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setLastBackupDate(nowStr);
      try {
        localStorage.setItem('manoto_last_backup_date', nowStr);
      } catch {}

      addAuditLog('تهیه نسخه پشتیبان کامل JSON', 'backup', `فایل «${filename}» شامل تمام جدول‌های سیستم دانلود گردید`);
      setBackupSuccessMessage(`پشتیبان کامل سیستم (${filename}) با موفقیت دانلود شد.`);
      setTimeout(() => setBackupSuccessMessage(null), 4000);
    } catch (err: any) {
      setBackupErrorMessage('خطا در ایجاد فایل پشتیبان: ' + (err.message || 'نامشخص'));
      setTimeout(() => setBackupErrorMessage(null), 4000);
    }
  };

  // Restore Full System State from JSON
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
            addAuditLog('بازیابی کامل اطلاعات سیستم', 'backup', `اطلاعات از فایل «${file.name}» با موفقیت بازیابی شد`);
            setBackupSuccessMessage(`اطلاعات دیتابیس از فایل «${file.name}» با موفقیت در سیستم بارگذاری شد.`);
            setTimeout(() => setBackupSuccessMessage(null), 5000);
          } else if (parsed && onRestoreFullState) {
            onRestoreFullState(parsed);
            addAuditLog('بازیابی کامل اطلاعات سیستم', 'backup', `اطلاعات از فایل «${file.name}» بارگذاری شد`);
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Export CSV with UTF-8 BOM for Excel Compatibility
  const downloadCsv = (content: string, filename: string) => {
    const bom = '\uFEFF';
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
    addAuditLog('خروجی اکسل موجودی کالا', 'data', `${products.length} ردیف کالا به صورت فایل CSV دریافت شد`);
    setBackupSuccessMessage('اکسل موجودی و کالاهای انبار با موفقیت دانلود شد.');
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
    addAuditLog('خروجی اکسل مشتریان CRM', 'data', `${customers.length} پرونده مشتری دانلود شد`);
    setBackupSuccessMessage('اکسل همکاران و مشتریان بازار با موفقیت دانلود شد.');
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
    addAuditLog('خروجی اکسل فاکتورهای فروش', 'data', `${invoices.length} فاکتور ثبت شده خروجی گرفته شد`);
    setBackupSuccessMessage('اکسل فاکتورهای فروش با موفقیت دانلود شد.');
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
    addAuditLog('خروجی اکسل چک‌های صیادی', 'data', `${checks.length} فقره چک صیادی بنفش دریافت شد`);
    setBackupSuccessMessage('اکسل چک‌های صیادی بنفش با موفقیت دانلود شد.');
    setTimeout(() => setBackupSuccessMessage(null), 3000);
  };

  // Clear system cache & memory optimization
  const handleClearCache = () => {
    try {
      sessionStorage.clear();
      setCacheClearSuccess(true);
      addAuditLog('بهینه‌سازی حافظه و کش موقت', 'system', 'کش نشست و آبجکت‌های موقت مرورگر تخلیه شد');
      setTimeout(() => setCacheClearSuccess(false), 3000);
    } catch {}
  };

  // Perform safe reset to sample factory data
  const handleConfirmFactoryReset = () => {
    setShowResetModal(false);
    if (onResetToSampleData) {
      onResetToSampleData();
      addAuditLog('بازنشانی داده‌های نمونه اولیه', 'system', 'دیتابیس سیستم به مقادیر پیش‌فرض بازگردانی شد');
      setBackupSuccessMessage('اطلاعات پیش‌فرض پوشاک من و تو با موفقیت بارگذاری شد.');
      setTimeout(() => setBackupSuccessMessage(null), 4000);
    }
  };

  const totalDatabaseRecords = products.length + customers.length + invoices.length + checks.length + fabricSuppliers.length + tailorWorkshops.length;

  return (
    <div id="roles-settings-module" className="space-y-4 md:space-y-6 pb-28 animate-in fade-in duration-200" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 👑 1. SUPER ADMIN EXECUTIVE MASTHEAD & LIVE TELEMETRY BAR                */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-[#18181B] via-stone-900 to-[#27272A] text-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md relative overflow-hidden space-y-3.5">
        {/* Subtle Luxury Golden Glow Ambient */}
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#27272A] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-black shrink-0 shadow-xs">
              <Crown className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-white truncate">
                  مرکز فرماندهی سوپر ادمین (Super Admin)
                </h2>
                <span className="bg-[#D4AF37] text-stone-950 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1 shrink-0">
                  <Key className="w-3 h-3" />
                  <span>دسترسی روت (Root)</span>
                </span>
              </div>
              <p className="text-[10.5px] text-stone-300 truncate mt-0.5">
                کنترل متمرکز امنیت، نقش‌های کاربری، پشتیبان‌گیری و سلامت دیتابیس
              </p>
            </div>
          </div>

          {/* Quick Immediate Backup Button on Mobile Header */}
          <button
            type="button"
            onClick={handleExportFullJsonBackup}
            className="shrink-0 bg-[#D4AF37] hover:bg-[#C59F2D] text-stone-950 font-black text-xs px-3 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="دانلود نسخه پشتیبان کامل سیستم"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">بک‌آپ کامل JSON</span>
            <span className="sm:hidden text-[11px]">بک‌آپ</span>
          </button>
        </div>

        {/* Live Telemetry Status Pills on Mobile */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-stone-800/90 text-xs">
          <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-800 flex items-center justify-between">
            <span className="text-[10.5px] text-stone-400">کل رکوردهای دیتابیس:</span>
            <span className="font-mono font-black text-[#D4AF37] text-xs sm:text-sm">
              {totalDatabaseRecords.toLocaleString('fa-IR')}
            </span>
          </div>

          <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-800 flex items-center justify-between">
            <span className="text-[10.5px] text-stone-400">نقش فعال در حال اجرا:</span>
            <span className="font-bold text-white text-[11px] truncate mr-1">
              {roleConfig.shortLabel}
            </span>
          </div>

          <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-800 flex items-center justify-between">
            <span className="text-[10.5px] text-stone-400">آخرین خروجی کامل:</span>
            <span className="font-bold text-emerald-400 text-[10px] truncate mr-1">
              {lastBackupDate}
            </span>
          </div>

          <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-800 flex items-center justify-between">
            <span className="text-[10.5px] text-stone-400">وضعیت امنیت نشست:</span>
            <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>پایدار و رمزنگاری‌شده</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📱 2. MOBILE-FIRST ERGONOMIC SEGMENTED TABS (No Clutter, High Focus)     */}
      {/* ========================================================================= */}
      <nav className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#E6DEC8] shadow-2xs overflow-x-auto no-scrollbar">
        <button
          type="button"
          id="tab-btn-roles"
          onClick={() => setMobileSubTab('roles')}
          className={`flex-1 min-w-[85px] py-2.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
            mobileSubTab === 'roles'
              ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
              : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>نقش‌ها و دسترسی</span>
        </button>

        <button
          type="button"
          id="tab-btn-backup"
          onClick={() => setMobileSubTab('backup')}
          className={`flex-1 min-w-[85px] py-2.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
            mobileSubTab === 'backup'
              ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
              : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>بک‌آپ و اکسل</span>
        </button>

        <button
          type="button"
          id="tab-btn-telemetry"
          onClick={() => setMobileSubTab('telemetry')}
          className={`flex-1 min-w-[85px] py-2.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
            mobileSubTab === 'telemetry'
              ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
              : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>سلامت و لاگ‌ها</span>
        </button>

        <button
          type="button"
          id="tab-btn-profile"
          onClick={() => setMobileSubTab('profile')}
          className={`flex-1 min-w-[85px] py-2.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
            mobileSubTab === 'profile'
              ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
              : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>هویت و امنیت</span>
        </button>
      </nav>

      {/* Global Status Notifications for Mobile */}
      {backupSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="flex-1">{backupSuccessMessage}</span>
          <button 
            type="button" 
            onClick={() => setBackupSuccessMessage(null)}
            className="text-stone-400 hover:text-stone-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {backupErrorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="flex-1">{backupErrorMessage}</span>
          <button 
            type="button" 
            onClick={() => setBackupErrorMessage(null)}
            className="text-stone-400 hover:text-stone-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {cacheClearSuccess && (
        <div className="p-3 bg-blue-50 border border-blue-300 text-blue-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
          <Check className="w-4 h-4 text-blue-600 shrink-0" />
          <span>حافظه کش موقت و نشست‌های غیرفعال با موفقیت بهینه‌سازی شد.</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 👑 TAB 1: ROLES MANAGEMENT & LIVE PERMISSIONS MATRIX                      */}
      {/* ========================================================================= */}
      {mobileSubTab === 'roles' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Role Simulation Selector Deck */}
          <section className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6DEC8] shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2.5">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#8C6D37]" />
                <h3 className="font-black text-xs sm:text-sm text-[#18181B]">
                  شبیه‌سازی و بررسی نقش‌های سازمانی
                </h3>
              </div>
              <span className="text-[10px] text-stone-500 font-medium bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#DDD5C0]">
                لمس کنید تا منو فیلتر شود
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(ROLE_PERMISSIONS) as UserRoleType[]).map((roleKey) => {
                const config = ROLE_PERMISSIONS[roleKey];
                const isSelected = currentRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => {
                      if (isSelected) return;
                      setRoleAuthModalRole(roleKey);
                      setRoleAuthPassword('');
                      setRoleAuthError('');
                      setRoleAuthShowHint(false);
                    }}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer min-h-[72px] active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B] shadow-sm ring-2 ring-[#D4AF37]/50'
                        : 'bg-[#FAF7F2] text-stone-800 border-[#DDD5C0] hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs">{config.shortLabel}</span>
                        {roleKey === 'super_admin' && (
                          <Crown className="w-3 h-3 text-[#D4AF37]" />
                        )}
                      </div>
                      {isSelected ? (
                        <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-stone-950 flex items-center justify-center font-black text-[10px]">
                          ✓
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                          <Lock className="w-2.5 h-2.5 text-stone-400" />
                          <span>رمز</span>
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      {config.title}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/40 text-[9.5px]">
                      <span className={isSelected ? 'text-[#D4AF37] font-bold' : 'text-[#8C6D37]'}>
                        {config.allowedTabs.length} بخش مجاز
                      </span>
                      {isSelected ? (
                        <span className="text-emerald-400 font-bold">فعال کنونی</span>
                      ) : (
                        <span className="text-amber-800 font-bold">نیازمند رمز ورود</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Interactive Live Permissions Matrix for Current Role */}
          <section className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6DEC8] shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <h3 className="font-black text-xs sm:text-sm text-[#18181B]">
                    ماتریس مجوز ماژول‌ها برای «{roleConfig.shortLabel}»
                  </h3>
                  <p className="text-[10.5px] text-stone-500">
                    {roleConfig.allowedTabs.length} ماژول مجاز از کل {modulesList.length} ماژول سامانه
                  </p>
                </div>
              </div>

              {/* Search & Status Filter for Permissions */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={permissionsSearch}
                    onChange={(e) => setPermissionsSearch(e.target.value)}
                    placeholder="جستجوی ماژول..."
                    className="w-full bg-[#FAF7F2] pr-8 pl-2 py-1.5 rounded-xl border border-[#DDD5C0] text-xs font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
                  />
                  {permissionsSearch && (
                    <button
                      type="button"
                      onClick={() => setPermissionsSearch('')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter Pill Carousel */}
                <div className="flex items-center gap-1 bg-[#FAF7F2] p-0.5 rounded-xl border border-[#DDD5C0]">
                  <button
                    type="button"
                    onClick={() => setPermissionsFilter('all')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                      permissionsFilter === 'all'
                        ? 'bg-[#18181B] text-[#FAF7F2]'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    همه
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermissionsFilter('allowed')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                      permissionsFilter === 'allowed'
                        ? 'bg-emerald-600 text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    مجاز
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermissionsFilter('restricted')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                      permissionsFilter === 'restricted'
                        ? 'bg-rose-600 text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    مسدود
                  </button>
                </div>
              </div>
            </div>

            {/* Modules List Cards (Mobile Optimized) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
              {filteredModules.length === 0 ? (
                <div className="col-span-full py-8 text-center text-stone-400 text-xs">
                  ماژولی با این عبارت جستجو یافت نشد.
                </div>
              ) : (
                filteredModules.map((mod) => {
                  const Icon = mod.icon;
                  const isAllowed = isTabAllowedForRole(mod.id, currentRole);
                  return (
                    <div 
                      key={mod.id}
                      className={`p-3 rounded-xl border space-y-1.5 transition-all ${
                        isAllowed
                          ? 'bg-[#FAF7F2] border-[#E6DEC8] shadow-2xs'
                          : 'bg-stone-50/70 border-stone-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isAllowed ? 'bg-[#18181B] text-[#D4AF37]' : 'bg-stone-200 text-stone-500'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-xs text-[#18181B] truncate">{mod.title}</h4>
                            <span className="text-[9px] text-stone-500 block truncate">{mod.categoryTag}</span>
                          </div>
                        </div>

                        {isAllowed ? (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>مجاز</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <Lock className="w-3 h-3 text-stone-500" />
                            <span>مسدود</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[10.5px] text-stone-600 leading-relaxed line-clamp-2">
                        {mod.desc}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </section>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 💾 TAB 2: BACKUP VAULT, JSON RESTORE & EXCEL CENTER                       */}
      {/* ========================================================================= */}
      {mobileSubTab === 'backup' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Master Full System State JSON Card */}
          <section className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6DEC8] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#8C6D37]" />
                <h3 className="font-black text-xs sm:text-sm text-[#18181B]">
                  بایگانی و پشتیبان کامل دیتابیس (JSON State)
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                شامل تمام جداول
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              با فشردن کلید دانلود، تمام رکوردها شامل کالاها، مشتریان بنکدار، فاکتورهای فروش، چک‌های صیادی و کارگاه‌های دوزندگی در قالب یک فایل استاندارد JSON ذخیره می‌شود. برای انتقال به گوشی دیگر یا بازنشانی سریع، از بخش بارگذاری استفاده فرمایید.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Export Full JSON Action Button */}
              <button
                type="button"
                id="btn-export-full-json"
                onClick={handleExportFullJsonBackup}
                className="p-3 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl border border-stone-800 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] cursor-pointer min-h-[44px]"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>دانلود فوری فایل پشتیبان (Backup.json)</span>
              </button>

              {/* Import & Restore JSON Action */}
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
                  id="btn-import-full-json"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 bg-[#FAF7F2] hover:bg-stone-100 text-stone-900 rounded-xl border border-[#DDD5C0] font-black text-xs flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-[0.98] cursor-pointer min-h-[44px]"
                >
                  <Upload className="w-4 h-4 text-[#8C6D37]" />
                  <span>انتخاب فایل پشتیبان و بازنشانی دیتابیس</span>
                </button>
              </div>
            </div>
          </section>

          {/* Individual Excel & CSV Export Gallery */}
          <section className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6DEC8] shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2.5">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <h3 className="font-black text-xs sm:text-sm text-[#18181B]">
                  خروجی تفکیکی اکسل و CSV (پشتیبانی ۱۰۰٪ فونت فارسی)
                </h3>
              </div>
              <span className="text-[10px] text-stone-500 font-medium">
                UTF-8 BOM استاندارد
              </span>
            </div>

            <p className="text-xs text-stone-600">
              جهت باز کردن بدون مشکل حروف فارسی در نرم‌افزار Excel و چاپ لیست‌ها در کامپیوتر مغازه:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Product Inventory CSV */}
              <button
                type="button"
                id="btn-export-products-csv"
                onClick={handleExportProductsCsv}
                className="p-3 bg-[#FAF7F2] hover:bg-white text-stone-900 rounded-xl border border-[#DDD5C0] text-right transition-all flex items-center justify-between gap-2 active:scale-95 cursor-pointer shadow-2xs min-h-[48px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-[#18181B] block truncate">اکسل موجودی کالا</span>
                    <span className="text-[10px] text-stone-500">{products.length} ردیف کالا و پک</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 shrink-0" />
              </button>

              {/* Customers CRM CSV */}
              <button
                type="button"
                id="btn-export-customers-csv"
                onClick={handleExportCustomersCsv}
                className="p-3 bg-[#FAF7F2] hover:bg-white text-stone-900 rounded-xl border border-[#DDD5C0] text-right transition-all flex items-center justify-between gap-2 active:scale-95 cursor-pointer shadow-2xs min-h-[48px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-[#18181B] block truncate">اکسل همکاران CRM</span>
                    <span className="text-[10px] text-stone-500">{customers.length} مغازه‌دار و بنکدار</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 shrink-0" />
              </button>

              {/* Invoices CSV */}
              <button
                type="button"
                id="btn-export-invoices-csv"
                onClick={handleExportInvoicesCsv}
                className="p-3 bg-[#FAF7F2] hover:bg-white text-stone-900 rounded-xl border border-[#DDD5C0] text-right transition-all flex items-center justify-between gap-2 active:scale-95 cursor-pointer shadow-2xs min-h-[48px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-[#18181B] block truncate">اکسل فاکتورهای فروش</span>
                    <span className="text-[10px] text-stone-500">{invoices.length} فاکتور ثبت شده</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 shrink-0" />
              </button>

              {/* Sayad Checks CSV */}
              <button
                type="button"
                id="btn-export-checks-csv"
                onClick={handleExportChecksCsv}
                className="p-3 bg-[#FAF7F2] hover:bg-white text-stone-900 rounded-xl border border-[#DDD5C0] text-right transition-all flex items-center justify-between gap-2 active:scale-95 cursor-pointer shadow-2xs min-h-[48px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-[#18181B] block truncate">اکسل چک‌های صیادی</span>
                    <span className="text-[10px] text-stone-500">{checks.length} فقره چک در سیستم</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 shrink-0" />
              </button>
            </div>
          </section>

          {/* Dangerous Zone: Factory Sample Reset with In-App Confirmation Modal */}
          <section className="bg-rose-50/50 p-3.5 sm:p-5 rounded-2xl border border-rose-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              <h3 className="font-black text-xs sm:text-sm text-rose-950">
                منطقه حساس: بازنشانی سیستم به اطلاعات پیش‌فرض کارگاه
              </h3>
            </div>
            <p className="text-[11.5px] text-rose-800 leading-relaxed">
              در صورت تمایل به پاک‌سازی تست‌ها و بازگشت به تنظیمات اولیه پوشاک من و تو (مدل‌های شلوار بگ، مشتریان نمونه و چک‌های تست)، از دکمه زیر استفاده نمایید.
            </p>
            <button
              type="button"
              id="btn-factory-reset"
              onClick={() => setShowResetModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[44px]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>درخواست بازنشانی اطلاعات نمونه اولیه</span>
            </button>
          </section>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 📊 TAB 3: SYSTEM HEALTH, DATABASE ENTITIES & AUDIT LOGS                   */}
      {/* ========================================================================= */}
      {mobileSubTab === 'telemetry' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Detailed Database Breakdown Cards */}
          <section className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6DEC8] shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2.5">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#8C6D37]" />
                <h3 className="font-black text-xs sm:text-sm text-[#18181B]">
                  آمار تفکیکی موجودیت‌های ثبت‌شده در دیتابیس
                </h3>
              </div>
              <span className="text-xs font-black text-[#8C6D37] bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#DDD5C0]">
                مجموع: {totalDatabaseRecords} رکورد
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] space-y-1">
                <span className="text-[10.5px] text-stone-500 font-bold block">کالاها و مدل‌ها:</span>
                <span className="text-base sm:text-lg font-black font-mono text-[#18181B] block">
                  {products.length} قلم
                </span>
                <span className="text-[9px] text-stone-400">انبار راسته بازار</span>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] space-y-1">
                <span className="text-[10.5px] text-stone-500 font-bold block">همکاران بنکدار:</span>
                <span className="text-base sm:text-lg font-black font-mono text-[#18181B] block">
                  {customers.length} پرونده
                </span>
                <span className="text-[9px] text-stone-400">سراسر کشور</span>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] space-y-1">
                <span className="text-[10.5px] text-stone-500 font-bold block">فاکتورهای فروش:</span>
                <span className="text-base sm:text-lg font-black font-mono text-[#18181B] block">
                  {invoices.length} برگ
                </span>
                <span className="text-[9px] text-stone-400">صادره سیستم</span>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] space-y-1">
                <span className="text-[10.5px] text-stone-500 font-bold block">چک‌های صیادی:</span>
                <span className="text-base sm:text-lg font-black font-mono text-[#18181B] block">
                  {checks.length} فقره
                </span>
                <span className="text-[9px] text-stone-400">بنفش در جریان</span>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] space-y-1">
                <span className="text-[10.5px] text-stone-500 font-bold block">تامین‌کنندگان پارچه:</span>
                <span className="text-base sm:text-lg font-black font-mono text-[#18181B] block">
                  {fabricSuppliers.length} منبع
                </span>
                <span className="text-[9px] text-stone-400">مولوی و بازار بزرگ</span>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] space-y-1">
                <span className="text-[10.5px] text-stone-500 font-bold block">کارگاه‌های خیاطی:</span>
                <span className="text-base sm:text-lg font-black font-mono text-[#18181B] block">
                  {tailorWorkshops.length} واحد
                </span>
                <span className="text-[9px] text-stone-400">دوخت و برش</span>
              </div>
            </div>

            {/* Cache optimization trigger */}
            <div className="pt-2 border-t border-[#E6DEC8] flex items-center justify-between">
              <span className="text-xs text-stone-600">بهینه‌سازی فضای رم و کش موقت:</span>
              <button
                type="button"
                onClick={handleClearCache}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-stone-500" />
                <span>پاک‌سازی کش موقت</span>
              </button>
            </div>
          </section>

          {/* Live System Security Audit Trail */}
          <section className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6DEC8] shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8C6D37]" />
                <h3 className="font-black text-xs sm:text-sm text-[#18181B]">
                  ردپای امنیتی و لاگ رویدادهای زنده (Audit Trail)
                </h3>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                ثبت زنده رخدادها
              </span>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] flex items-start justify-between gap-2.5 text-xs"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      log.status === 'success' ? 'bg-emerald-500' :
                      log.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-[#18181B] truncate">{log.action}</span>
                        <span className="text-[9px] bg-white text-stone-600 px-1.5 py-0.2 rounded border border-[#DDD5C0]">
                          {log.user}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-stone-500 mt-0.5 line-clamp-1">
                        {log.details}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0 font-medium">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚙️ TAB 4: SUPER ADMIN PROFILE & SESSION CREDENTIALS                      */}
      {/* ========================================================================= */}
      {mobileSubTab === 'profile' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          <section className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6DEC8] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2.5">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#8C6D37]" />
                <h3 className="font-black text-xs sm:text-sm text-[#18181B]">
                  اطلاعات کاربری و هویت سوپر ادمین
                </h3>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                حساب اصلی کارگاه
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>مشخصات مدیر ارشد با موفقیت به‌روزرسانی گردید.</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-800 mb-1">نام و نام خانوادگی مدیر:</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none text-xs min-h-[44px]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">شماره همراه پرسنلی جهت هشدارهای پیامکی:</label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none text-xs min-h-[44px]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">سطح مجوز دسترسی:</label>
                <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 font-black text-stone-900 flex items-center justify-between">
                  <span>{roleConfig.title}</span>
                  <span className="text-[10px] bg-[#18181B] text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                    روت کامل
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[44px]"
                >
                  <Save className="w-4 h-4 text-[#D4AF37]" />
                  <span>ذخیره تغییرات مشخصات مدیر</span>
                </button>
              </div>
            </form>
          </section>

          {/* Security Protocols Notice */}
          <section className="bg-[#FAF7F2] p-3.5 sm:p-4 rounded-2xl border border-[#E6DEC8] text-xs text-stone-700 space-y-2">
            <div className="flex items-center gap-1.5 font-black text-[#18181B]">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>استاندارد امنیت نشست‌ها در نرم‌افزار پوشاک من و تو:</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              کلیه تراکنش‌های حساس شامل صدور فاکتور، تغییر درصدی بهای پارچه، برگشت چک و بازیابی فایل‌های پشتیبان با هویت کاربر جاری ثبت شده و دارای مهر زمان شمسی جهت حسابرسی دقیق می‌باشد.
            </p>
          </section>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚠️ CUSTOM IN-APP MODAL FOR DANGEROUS FACTORY RESET CONFIRMATION            */}
      {/* ========================================================================= */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in" dir="rtl">
          <div className="bg-white w-full max-w-md rounded-2xl border border-rose-200 p-4 sm:p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center gap-3 border-b border-rose-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-rose-950">
                  تأیید بازنشانی دیتابیس به مقادیر اولیه
                </h3>
                <p className="text-[11px] text-stone-500">
                  اقدام با سطح دسترسی سوپر ادمین
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              آیا از بارگذاری مجدد اطلاعات پیش‌فرض کارگاه (مدل‌های شلوار، مشتریان و چک‌های تستی) اطمینان دارید؟ اگر فاکتورهای جدیدی صادر نموده‌اید، پیشنهاد می‌شود ابتدا نسخه پشتیبان JSON را ذخیره نمایید.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs transition-colors cursor-pointer min-h-[44px]"
              >
                انصراف و بازگشت
              </button>

              <button
                type="button"
                onClick={handleConfirmFactoryReset}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs transition-colors cursor-pointer shadow-xs min-h-[44px]"
              >
                بله، بازنشانی به پیش‌فرض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Role Switch Authentication Modal - Portaled to document.body */}
      {roleAuthModalRole && typeof document !== 'undefined' && createPortal(
        <div 
          id="modal-settings-role-security-auth"
          onClick={(e) => {
            if (e.target === e.currentTarget) setRoleAuthModalRole(null);
          }}
          className="fixed inset-0 z-[9999] bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150" 
          dir="rtl"
        >
          <div 
            id="modal-settings-role-security-card"
            className="bg-white border border-[#E6DEC8] rounded-3xl shadow-2xl w-full max-w-md p-5 sm:p-6 text-stone-900 space-y-4 animate-in zoom-in-95 duration-200 relative overflow-hidden my-auto"
          >
            {/* Top decorative accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8] pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-md shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#18181B]">
                    تأیید هویت و کلمه عبور نقش
                  </h3>
                  <p className="text-[11px] text-[#8C6D37] font-bold mt-0.5">
                    احراز هویت قبل از ارتقای دسترسی • پوشاک من و تو
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRoleAuthModalRole(null)}
                className="text-stone-400 hover:text-stone-800 hover:bg-stone-100 p-2 rounded-xl transition-colors cursor-pointer"
                title="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Account Badge */}
            {(() => {
              const targetConf = ROLE_PERMISSIONS[roleAuthModalRole];
              const targetAcc = ADMIN_SECURITY_ACCOUNTS[roleAuthModalRole];
              return (
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500">نقش کاربری مقصد:</span>
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full ${
                      roleAuthModalRole === 'super_admin'
                        ? 'bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/30'
                        : roleAuthModalRole === 'content_admin'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    } flex items-center gap-1.5 shadow-2xs`}>
                      {roleAuthModalRole === 'super_admin' && <Crown className="w-3 h-3 text-[#D4AF37]" />}
                      {roleAuthModalRole === 'content_admin' && <Package className="w-3 h-3 text-emerald-700" />}
                      {roleAuthModalRole === 'order_tracker' && <ShieldCheck className="w-3 h-3 text-amber-700" />}
                      <span>{targetConf.shortLabel}</span>
                    </span>
                  </div>
                  <div className="font-black text-sm text-[#18181B] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#8C6D37]" />
                    <span>{targetAcc?.name || targetConf.title}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pt-0.5">
                    {targetConf.description}
                  </p>
                </div>
              );
            })()}

            {/* Security Explanation */}
            <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                جهت پیشگیری از ارتقای غیرمجاز دسترسی و محافظت از اطلاعات مالی و مشتریان کارگاه «من و تو»، تغییر به این نقش مستلزم ورود رمز عبور است.
              </span>
            </div>

            {/* Password Form */}
            <form onSubmit={handleVerifyAndChangeRole} className="space-y-3.5">
              {roleAuthError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl flex items-center gap-2.5 animate-in fade-in font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{roleAuthError}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-stone-800">
                    کلمه عبور حساب:
                  </label>
                  <button
                    type="button"
                    onClick={() => setRoleAuthShowHint(!roleAuthShowHint)}
                    className="text-xs text-[#8C6D37] hover:text-[#D4AF37] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>راهنمای رمزهای تستی</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={roleAuthShowPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    dir="ltr"
                    value={roleAuthPassword}
                    onChange={(e) => {
                      setRoleAuthPassword(e.target.value);
                      if (roleAuthError) setRoleAuthError('');
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#DDD5C0] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm text-stone-900 placeholder:text-stone-400 font-mono text-left transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setRoleAuthShowPassword(!roleAuthShowPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    title={roleAuthShowPassword ? 'مخفی‌سازی رمز' : 'نمایش رمز'}
                  >
                    {roleAuthShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {roleAuthShowHint && (
                <div className="bg-[#FAF7F2] border border-[#D4AF37]/50 text-stone-800 text-xs p-3.5 rounded-2xl space-y-2 animate-in fade-in">
                  <div className="font-bold text-[#8C6D37] flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                    <span>اطلاعات ورود حساب انتخابی (جهت تست):</span>
                  </div>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#E6DEC8] font-mono text-xs" dir="ltr">
                    <span className="font-bold text-[#18181B]">{ADMIN_SECURITY_ACCOUNTS[roleAuthModalRole]?.password}</span>
                    <span className="text-[11px] text-stone-500 font-sans">کلمه عبور</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-600 pt-0.5">
                    <span>نام کاربری پرسنلی:</span>
                    <span className="font-mono font-bold text-[#18181B] bg-white px-2.5 py-1 rounded-lg border border-[#E6DEC8]" dir="ltr">
                      {ADMIN_SECURITY_ACCOUNTS[roleAuthModalRole]?.username}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="submit"
                  id="btn-confirm-settings-role-auth"
                  className="flex-1 py-3 px-4 bg-[#18181B] hover:bg-stone-800 text-[#D4AF37] hover:text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>تأیید کلمه عبور و اعمال دسترسی</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoleAuthModalRole(null)}
                  className="py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs sm:text-sm font-bold transition-all border border-stone-300 cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
