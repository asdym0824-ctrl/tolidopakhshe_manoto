import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Scissors,
  Users, 
  ShoppingBasket,
  Receipt, 
  CreditCard, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  ChevronLeft,
  Crown,
  LogOut,
  HelpCircle,
  Search,
  Layers,
  Store,
  X
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
  onOpenHelpModal?: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

interface MenuGroup {
  groupTitle: string;
  items: {
    id: ModuleTab;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[];
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
  onOpenHelpModal,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const [sidebarSearch, setSidebarSearch] = useState('');
  const roleConfig = ROLE_PERMISSIONS[currentUserRole] || ROLE_PERMISSIONS.super_admin;

  const menuGroups: MenuGroup[] = [
    {
      groupTitle: 'مرکز کنترل و نظارت',
      items: [
        {
          id: 'dashboard',
          label: 'داشبورد و اولویت‌های امروز',
          description: 'میز کار روزانه، چک‌ها و وضعیت انبار',
          icon: LayoutDashboard,
        },
      ]
    },
    {
      groupTitle: 'انبارداری و خط تولید',
      items: [
        {
          id: 'inventory',
          label: 'انبارداری و پک‌های کالا',
          description: 'پک‌بندی، بهای تمام‌شده، تغییر درصدی قیمت',
          icon: Package,
          badge: lowStockCount > 0 ? lowStockCount : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
        {
          id: 'production',
          label: 'تولید و کارگاه‌های دوزنده',
          description: 'تامین پارچه، کارگاه خیاطی و بچ‌های دوخت',
          icon: Scissors,
        },
      ]
    },
    {
      groupTitle: 'فروش، فاکتور و مشتریان',
      items: [
        {
          id: 'sales',
          label: 'فروش و صدور فاکتور',
          description: 'فاکتور بازار، تسویه نقدی/چکی، تخفیف همکاری',
          icon: Receipt,
        },
        {
          id: 'crm',
          label: 'مشتریان بنکداری (CRM)',
          description: 'اعتبار چکی، لیست همکاران، ورود از اکسل',
          icon: Users,
          badge: followUpCount > 0 ? followUpCount : undefined,
          badgeColor: 'bg-[#D4AF37] text-[#18181B]',
        },
        {
          id: 'retail_customers',
          label: 'مشتریان تکی و آنلاین',
          description: 'خریداران سایت، آدرس پستی و باشگاه مشتریان',
          icon: ShoppingBasket,
        },
        {
          id: 'logistics',
          label: 'لجستیک و بیجک باربری',
          description: 'باربری وطن، پیشتاز، تیپاکس و چاپ بارنامه',
          icon: Truck,
        },
      ]
    },
    {
      groupTitle: 'امور مالی، هوش مصنوعی و تنظیمات',
      items: [
        {
          id: 'finance',
          label: 'حسابداری و چک‌های صیادی',
          description: 'رهگیری چک‌ها، موعد سررسید و سودآوری',
          icon: CreditCard,
          badge: checkAlertCount > 0 ? checkAlertCount : undefined,
          badgeColor: 'bg-amber-600 text-white',
        },
        {
          id: 'marketing',
          label: 'دستیار سئو و هوش مصنوعی',
          description: 'تولید کپشن تلگرام، سئو گوگل و متن تبلیغاتی',
          icon: Sparkles,
        },
        {
          id: 'storefront',
          label: 'ویترین و تنظیمات سایت',
          description: 'مدیریت بنرها، اعضا و سفارشات آنلاین',
          icon: ShoppingBag,
        },
        {
          id: 'roles',
          label: 'امنیت و نسخه پشتیبان',
          description: 'دسترسی نقش‌ها، بک‌آپ و بازیابی داده‌ها',
          icon: ShieldCheck,
        },
      ]
    }
  ];

  // Filter groups by allowed roles and search query
  const filteredGroups = menuGroups
    .map(group => ({
      ...group,
      items: group.items
        .filter(item => isTabAllowedForRole(item.id, currentUserRole as UserRoleType))
        .filter(item => {
          if (!sidebarSearch.trim()) return true;
          const q = sidebarSearch.toLowerCase();
          return item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
        })
    }))
    .filter(group => group.items.length > 0);

  const handleItemClick = (tab: ModuleTab) => {
    onSelectTab(tab);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <aside 
      id="app-sidebar" 
      className={`bg-white border-l border-[#E6DEC8] flex flex-col shrink-0 shadow-2xs ${
        isMobileDrawer ? 'w-full h-full' : 'w-full md:w-68 rounded-2xl'
      }`}
    >
      {/* Top Header inside Sidebar */}
      <div className="p-3.5 border-b border-[#E6DEC8]/80 space-y-2.5">
        
        {/* Role & Access Badge + Close Button (if drawer) */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
            <Layers className="w-4 h-4 text-[#8C6D37]" />
            <span>منوی ماژول‌های سیستم</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#18181B] text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
              {roleConfig.shortLabel}
            </span>
            {isMobileDrawer && onCloseMobileDrawer && (
              <button
                type="button"
                onClick={onCloseMobileDrawer}
                className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                title="بستن منو"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Storefront Quick Link */}
        {onOpenStorefront && (
          <button
            type="button"
            id="sidebar-btn-open-storefront"
            onClick={() => {
              onOpenStorefront();
              if (isMobileDrawer && onCloseMobileDrawer) onCloseMobileDrawer();
            }}
            className="w-full py-2.5 px-3 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-all shadow-xs flex items-center justify-between group border border-[#3F3F46] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#D4AF37]" />
              <span>مشاهده سایت فروشگاه</span>
            </div>
            <span className="text-[9.5px] bg-[#D4AF37] text-[#18181B] px-1.5 py-0.5 rounded-md font-black">
              ویترین آنلاین
            </span>
          </button>
        )}

        {/* Search inside menu */}
        <div className="relative">
          <input
            type="text"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            placeholder="فیلتر سریع منوها..."
            className="w-full pl-7 pr-8 py-1.5 bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl text-[11px] text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#18181B]"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2 pointer-events-none" />
          {sidebarSearch && (
            <button
              type="button"
              onClick={() => setSidebarSearch('')}
              className="absolute left-2 top-2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Help & Guide Button */}
        {onOpenHelpModal && (
          <button
            type="button"
            onClick={() => {
              onOpenHelpModal();
              if (isMobileDrawer && onCloseMobileDrawer) onCloseMobileDrawer();
            }}
            className="w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#EBE3D3] text-[#8C6D37] hover:text-stone-950 rounded-xl text-xs font-bold transition-all border border-[#E6DEC8] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#8C6D37]" />
            <span>راهنمای سریع کار با سیستم</span>
          </button>
        )}

      </div>

      {/* Navigation Menu Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {filteredGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="text-[10px] font-black text-[#8C6D37] px-2 py-1 uppercase tracking-wider">
              {group.groupTitle}
            </div>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-right transition-all group cursor-pointer ${
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
                        <span className="text-xs truncate block font-bold leading-tight">
                          {item.label}
                        </span>
                        <span className={`text-[9.5px] block truncate mt-0.5 ${isActive ? 'text-stone-300 font-normal' : 'text-stone-400'}`}>
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.badge !== undefined && (
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full ${
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
            </div>
          </div>
        ))}
      </div>

      {/* Workshop & Supplier Quick Indicator & Logout */}
      <div className="p-3 border-t border-[#E6DEC8] bg-[#FAF7F2] space-y-2">
        <div className="flex items-center justify-between text-[11px] text-stone-700">
          <div className="flex items-center gap-1.5 font-black text-stone-900">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>پوشاک من و تو (اسدی)</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
            انبار فعال
          </span>
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج از حساب مدیریت</span>
          </button>
        )}
      </div>
    </aside>
  );
};
