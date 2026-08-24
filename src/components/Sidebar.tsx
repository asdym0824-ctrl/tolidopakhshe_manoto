import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Scissors,
  Users, 
  ShoppingBasket,
  Receipt, 
  CreditCard, 
  Share2, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  ChevronLeft,
  Crown,
  LogOut
} from 'lucide-react';
import { ModuleTab, UserRoleType } from '../types';
import { ROLE_PERMISSIONS, isTabAllowedForRole } from '../utils/rolePermissions';

interface SidebarProps {
  currentTab: ModuleTab;
  onSelectTab: (tab: ModuleTab) => void;
  lowStockCount: number;
  checkAlertCount: number;
  followUpCount: number;
  currentUserRole?: UserRoleType;
  onOpenStorefront?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  lowStockCount,
  checkAlertCount,
  followUpCount,
  currentUserRole = 'super_admin',
  onOpenStorefront,
  onLogout,
}) => {
  const roleConfig = ROLE_PERMISSIONS[currentUserRole] || ROLE_PERMISSIONS.super_admin;

  const allMenuItems: {
    id: ModuleTab;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'داشبورد مرکزی',
      description: 'اولویت‌های امروز، آمار فروش و کنترل کلی',
      icon: LayoutDashboard,
    },
    {
      id: 'inventory',
      label: 'انبارداری و کالاها',
      description: 'پک‌بندی، بهای تمام‌شده، تغییر درصدی قیمت',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'production',
      label: 'تولید و تامین‌کنندگان',
      description: 'پارچه‌فروشان، دوزندگان، قیمت متری و تحویل',
      icon: Scissors,
    },
    {
      id: 'crm',
      label: 'مشتریان و CRM',
      description: 'امتیاز اعتبار چکی، لیست همکاران، اکسل',
      icon: Users,
      badge: followUpCount > 0 ? followUpCount : undefined,
      badgeColor: 'bg-[#D4AF37] text-[#18181B]',
    },
    {
      id: 'retail_customers',
      label: 'مشتریان تکی و سایت',
      description: 'خریداران تکی، آدرس، باشگاه و پیامک',
      icon: ShoppingBasket,
    },
    {
      id: 'sales',
      label: 'فروش و فاکتورها',
      description: 'فاکتور بازار، قیمت‌گذاری چندسطحی، تسویه',
      icon: Receipt,
    },
    {
      id: 'finance',
      label: 'حسابداری و چک‌ها',
      description: 'رهگیری چک‌های صیادی، سود دسته‌ها، تسویه',
      icon: CreditCard,
      badge: checkAlertCount > 0 ? checkAlertCount : undefined,
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'marketing',
      label: 'دستیار سئو و هوش مصنوعی',
      description: 'استراتژی رتبه ۱ گوگل، کپشن‌نویسی و کانال‌ها',
      icon: Sparkles,
      badgeColor: 'bg-[#8C6D37] text-white',
    },
    {
      id: 'storefront',
      label: 'ویترین و تنظیمات سایت',
      description: 'مدیریت وب‌سایت، بنرها، اعضا و سفارشات آنلاین',
      icon: ShoppingBag,
    },
    {
      id: 'logistics',
      label: 'لجستیک و بیجک باربری',
      description: 'باربری وطن، تیپاکس، چاپار، کد رهگیری',
      icon: Truck,
    },
    {
      id: 'roles',
      label: 'امنیت و سوپر ادمین',
      description: 'دسترسی‌های تام و وضعیت امنیتی سیستم',
      icon: ShieldCheck,
    },
  ];

  // Filter menu items by user role
  const menuItems = allMenuItems.filter((item) =>
    isTabAllowedForRole(item.id, currentUserRole as UserRoleType)
  );

  return (
    <aside id="app-sidebar" className="w-full md:w-64 bg-white border-l border-[#E6DEC8] flex flex-col shrink-0">
      <div className="p-3">
        
        <div className="text-[11px] font-black text-[#8C6D37] px-3 py-1.5 uppercase tracking-wider flex items-center justify-between">
          <span>بخش‌های مجاز</span>
          <span className="text-[10px] bg-[#18181B] text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
            {roleConfig.shortLabel}
          </span>
        </div>

        {onOpenStorefront && (
          <div className="mb-2 px-1">
            <button
              type="button"
              id="sidebar-btn-open-storefront"
              onClick={onOpenStorefront}
              className="w-full py-2.5 px-3 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-all shadow-xs flex items-center justify-between group border border-[#3F3F46] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>مشاهده سایت فروشگاه</span>
              </div>
              <span className="text-[10px] bg-[#D4AF37] text-[#18181B] px-1.5 py-0.5 rounded font-black">
                آنلاین
              </span>
            </button>
          </div>
        )}

        <nav className="space-y-1 mt-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-right transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-[#18181B] text-[#FAF7F2] font-bold shadow-xs'
                    : 'text-stone-700 hover:bg-[#FAF7F2] hover:text-[#18181B] font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#27272A] text-[#D4AF37]'
                        : 'bg-[#FAF7F2] text-stone-600 group-hover:bg-[#E6DEC8]/60 group-hover:text-[#18181B]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs truncate">{item.label}</span>
                    </div>
                    <span className={`text-[10px] block truncate mt-0.5 ${isActive ? 'text-stone-300 font-normal' : 'text-stone-400'}`}>
                      {item.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-[#D4AF37] text-[#18181B]' : item.badgeColor || 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronLeft className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-[#D4AF37] opacity-100' : 'text-stone-400'}`} />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Workshop & Supplier Quick Indicator */}
      <div className="mt-auto p-3.5 border-t border-[#E6DEC8] bg-[#FAF7F2] m-2 rounded-2xl border space-y-2">
        <div className="flex items-center gap-2 text-[#18181B] text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>تولید و کارگاه اسدی</span>
        </div>
        <p className="text-[11px] text-stone-600 leading-relaxed">
          سیستم با فرمول بهای تمام‌شده پارچه و دستمزد دوخت بازار تهران همگام است.
        </p>
        <div className="pt-2 border-t border-[#DDD5C0] flex items-center justify-between text-[10px] text-[#8C6D37]">
          <span>فروش عمده استاندارد:</span>
          <span className="font-bold text-[#18181B] bg-white border border-[#DDD5C0] px-2 py-0.5 rounded-md">
            پک‌های ۴، ۶، ۸، ۱۲
          </span>
        </div>

        {onLogout && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج از حساب مدیریت</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
