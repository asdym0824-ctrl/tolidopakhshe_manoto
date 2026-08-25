import React from 'react';
import { 
  ChevronLeft, 
  HelpCircle, 
  Sparkles, 
  LayoutDashboard, 
  Package, 
  Scissors, 
  Users, 
  Receipt, 
  CreditCard, 
  Truck, 
  ShoppingBag,
  Info
} from 'lucide-react';
import { ModuleTab } from '../../types';

interface AdminBreadcrumbBarProps {
  currentTab: ModuleTab;
  onSelectTab: (tab: ModuleTab) => void;
  onOpenHelpModal: () => void;
  totalProductsCount: number;
  lowStockCount: number;
  pendingChecksCount: number;
}

export const AdminBreadcrumbBar: React.FC<AdminBreadcrumbBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenHelpModal,
  totalProductsCount,
  lowStockCount,
  pendingChecksCount,
}) => {
  const tabMetadata: Record<ModuleTab, { title: string; subtitle: string; icon: React.ElementType }> = {
    dashboard: {
      title: 'داشبورد مرکزی و اولویت‌های امروز',
      subtitle: 'خلاصه وضعیت حجره، چک‌های نزدیک، اولویت‌های تولید و نمودار نقدینگی',
      icon: LayoutDashboard,
    },
    inventory: {
      title: 'انبارداری، پک‌های کالا و قیمت‌گذاری',
      subtitle: 'مدیریت پک‌های عمده (۴، ۶، ۸، ۱۲ تایی)، بهای تمام‌شده و تغییر درصدی قیمت‌ها',
      icon: Package,
    },
    production: {
      title: 'مدیریت تولید، پارچه‌فروشان و کارگاه‌ها',
      subtitle: 'تامین طاقه پارچه، کارگاه‌های خیاطی و چرخ‌کاران، و رهگیری پارت‌های در حال دوخت',
      icon: Scissors,
    },
    crm: {
      title: 'مشتریان و همکاران بنکداری (CRM)',
      subtitle: 'لیست مغازه‌داران و بنکداران سراسر کشور، امتیاز اعتبار چکی و ورود از اکسل',
      icon: Users,
    },
    retail_customers: {
      title: 'خریداران تکی و باشگاه مشتریان',
      subtitle: 'لیست مشتریان مصرف‌کننده نهایی ثبت‌نام شده در وب‌سایت و آدرس‌های پستی',
      icon: Users,
    },
    sales: {
      title: 'فروش، فاکتورها و تسویه حساب',
      subtitle: 'صدور فاکتور چندسطحی (عمده، همکار، تک)، تسویه نقدی و چکی و فاکتور چاپی',
      icon: Receipt,
    },
    finance: {
      title: 'حسابداری و رهگیری چک‌های صیادی',
      subtitle: 'رهگیری چک‌های بنفش صیادی، موعد سررسید، محاسبه سود دسته‌ها و وضعیت تسویه',
      icon: CreditCard,
    },
    marketing: {
      title: 'دستیار هوش مصنوعی و سئو (Gemini)',
      subtitle: 'تولید کپشن‌های تلگرام و اینستاگرام، بهینه‌سازی کلمات کلیدی گوگل و ربات پاسخگو',
      icon: Sparkles,
    },
    storefront: {
      title: 'ویترین و تنظیمات سایت فروشگاهی',
      subtitle: 'تنظیم بنرهای صفحه اول، اطلاعات تماس، آدرس بازار و مدیریت سفارشات آنلاین',
      icon: ShoppingBag,
    },
    logistics: {
      title: 'لجستیک، بسته‌بندی و بیجک باربری',
      subtitle: 'آماده‌سازی ارسال با باربری وطن، تیپاکس و چاپ بیجک و برچسب‌های استاندارد',
      icon: Truck,
    },
    roles: {
      title: 'امنیت، دسترسی‌ها و پشتیبان‌گیری',
      subtitle: 'مدیریت نقش‌های کاربری، ذخیره فایل پشتیبان JSON و بازگردانی سریع داده‌ها',
      icon: Sparkles,
    },
  };

  const currentMeta = tabMetadata[currentTab] || tabMetadata.dashboard;
  const CurrentIcon = currentMeta.icon;

  const quickJumpTabs: { id: ModuleTab; label: string }[] = [
    { id: 'dashboard', label: 'داشبورد' },
    { id: 'inventory', label: 'انبار کالا' },
    { id: 'production', label: 'کارگاه تولید' },
    { id: 'sales', label: 'فاکتورها' },
    { id: 'crm', label: 'مشتریان عمده' },
    { id: 'finance', label: 'چک‌های صیادی' },
    { id: 'logistics', label: 'لجستیک و باربری' },
    { id: 'storefront', label: 'تنظیمات سایت' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E6DEC8] p-3 sm:p-4 mb-4 shadow-2xs space-y-3" dir="rtl">
      
      {/* Top Row: Breadcrumb, Section Title and Context Help Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-[#E6DEC8]/80">
        
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shrink-0">
            <CurrentIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold">
              <span>پنل مدیریت</span>
              <ChevronLeft className="w-3 h-3 text-stone-400" />
              <span className="text-[#18181B] font-black">{currentMeta.title}</span>
            </div>
            <p className="text-[11px] text-[#8C6D37] mt-0.5 font-medium hidden sm:block">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Action / Help Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Quick System Indicators */}
          {lowStockCount > 0 && currentTab !== 'inventory' && (
            <button
              type="button"
              onClick={() => onSelectTab('inventory')}
              className="text-[10.5px] bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-xl font-bold hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              <span>{lowStockCount} کسری انبار</span>
            </button>
          )}

          {pendingChecksCount > 0 && currentTab !== 'finance' && (
            <button
              type="button"
              onClick={() => onSelectTab('finance')}
              className="text-[10.5px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{pendingChecksCount} چک در جریان</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenHelpModal}
            className="text-xs bg-[#FAF7F2] hover:bg-[#EBE3D3] text-[#8C6D37] hover:text-stone-950 font-bold px-3 py-1.5 rounded-xl transition-all border border-[#E6DEC8] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="مشاهده راهنمای استفاده و پاسخ به سوالات"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">راهنمای سیستم و جریان کار</span>
            <span className="sm:hidden">راهنما</span>
          </button>

        </div>

      </div>

      {/* Quick Jump Module Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
        <span className="text-[10.5px] text-stone-500 font-bold shrink-0 ml-1 flex items-center gap-1">
          <Info className="w-3 h-3 text-[#8C6D37]" />
          <span>دسترسی سریع:</span>
        </span>
        {quickJumpTabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#18181B] text-[#FAF7F2] shadow-2xs'
                  : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#E6DEC8]/60 hover:text-stone-950 border border-[#E6DEC8]/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

    </div>
  );
};
