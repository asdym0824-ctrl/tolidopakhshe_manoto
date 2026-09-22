import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  CreditCard, 
  Menu,
  Sparkles,
  Plus
} from 'lucide-react';
import { ModuleTab } from '../../types';

interface AdminMobileBottomNavProps {
  currentTab: ModuleTab;
  onSelectTab: (tab: ModuleTab) => void;
  onOpenMobileMenu: () => void;
  onOpenQuickNewInvoice: () => void;
  lowStockCount: number;
  checkAlertCount: number;
  followUpCount: number;
  currentUserRole?: string;
}

export const AdminMobileBottomNav: React.FC<AdminMobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  onOpenQuickNewInvoice,
  lowStockCount,
  checkAlertCount,
  followUpCount,
  currentUserRole,
}) => {
  const totalBadges = lowStockCount + checkAlertCount + followUpCount;

  // Dedicated bottom bar for content_admin role (only inventory & catalogue)
  if (currentUserRole === 'content_admin') {
    return (
      <div 
        className="admin-panel fixed bottom-0 inset-x-0 z-40 bg-[#18181B] text-[#FAF7F2] border-t border-[#3F3F46] shadow-2xl px-4 py-2 lg:hidden safe-area-bottom"
        dir="rtl"
        id="admin-mobile-bottom-nav"
      >
        <div className="flex items-center justify-around max-w-md mx-auto w-full">
          <button
            type="button"
            id="mobile-nav-inventory-contentadmin"
            onClick={() => onSelectTab('inventory')}
            className={`flex items-center gap-2 py-1.5 px-4 rounded-xl transition-all cursor-pointer ${
              currentTab === 'inventory'
                ? 'bg-[#27272A] text-emerald-400 font-black'
                : 'text-stone-300 font-bold'
            }`}
          >
            <Package className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black">محصولات و موجودی انبار</span>
          </button>

          <button
            type="button"
            id="mobile-nav-more-menu"
            onClick={onOpenMobileMenu}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all text-stone-400 hover:text-stone-200 cursor-pointer font-bold text-xs"
          >
            <Menu className="w-4 h-4" />
            <span>منو</span>
          </button>
        </div>
      </div>
    );
  }

  // Dedicated bottom bar for order_tracker role (only order tracking and menu/logout)
  if (currentUserRole === 'order_tracker') {
    return (
      <div 
        className="admin-panel fixed bottom-0 inset-x-0 z-40 bg-[#18181B] text-[#FAF7F2] border-t border-[#3F3F46] shadow-2xl px-4 py-2 lg:hidden safe-area-bottom"
        dir="rtl"
        id="admin-mobile-bottom-nav"
      >
        <div className="flex items-center justify-around max-w-md mx-auto w-full">
          <button
            type="button"
            id="mobile-nav-order-tracking"
            onClick={() => onSelectTab('order_tracking')}
            className={`flex items-center gap-2 py-1.5 px-4 rounded-xl transition-all cursor-pointer ${
              currentTab === 'order_tracking'
                ? 'bg-[#27272A] text-[#D4AF37] font-black'
                : 'text-stone-300 font-bold'
            }`}
          >
            <Receipt className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-black">پیگیری و مدیریت سفارشات</span>
          </button>

          <button
            type="button"
            id="mobile-nav-more-menu"
            onClick={onOpenMobileMenu}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all text-stone-400 hover:text-stone-200 cursor-pointer font-bold text-xs"
          >
            <Menu className="w-4 h-4" />
            <span>منو</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="admin-panel fixed bottom-0 inset-x-0 z-40 bg-[#18181B] text-[#FAF7F2] border-t border-[#3F3F46] shadow-2xl px-2 py-1.5 lg:hidden safe-area-bottom"
      dir="rtl"
      id="admin-mobile-bottom-nav"
    >
      <div className="grid grid-cols-5 items-end max-w-lg mx-auto w-full">
        
        {/* Dashboard */}
        <button
          type="button"
          id="mobile-nav-dashboard"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-1 w-full rounded-xl transition-all cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-[#D4AF37] font-black'
              : 'text-stone-400 hover:text-stone-200 font-bold'
          }`}
        >
          <div className={`p-1 rounded-lg ${currentTab === 'dashboard' ? 'bg-[#27272A]' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold mt-0.5 truncate">داشبورد</span>
        </button>

        {/* Inventory */}
        <button
          type="button"
          id="mobile-nav-inventory"
          onClick={() => onSelectTab('inventory')}
          className={`flex flex-col items-center justify-center py-1 px-1 w-full rounded-xl transition-all relative cursor-pointer ${
            currentTab === 'inventory'
              ? 'text-[#D4AF37] font-black'
              : 'text-stone-400 hover:text-stone-200 font-bold'
          }`}
        >
          <div className={`p-1 rounded-lg relative ${currentTab === 'inventory' ? 'bg-[#27272A]' : ''}`}>
            <Package className="w-5 h-5" />
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-[#18181B]"></span>
            )}
          </div>
          <span className="text-[11px] font-bold mt-0.5 truncate">انبار</span>
        </button>

        {/* Quick New Invoice Floating Action Center Button */}
        <button
          type="button"
          id="mobile-nav-quick-invoice"
          onClick={onOpenQuickNewInvoice}
          className="flex flex-col items-center justify-center -mt-5 w-full cursor-pointer group"
          title="صدور سریع فاکتور"
        >
          <div className="w-12 h-12 rounded-full bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] flex items-center justify-center shadow-lg border-4 border-[#18181B] group-active:scale-95 transition-transform mx-auto">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-black text-[#FAF7F2] mt-0.5 text-center truncate">فاکتور</span>
        </button>

        {/* Finance & Checks */}
        <button
          type="button"
          id="mobile-nav-finance"
          onClick={() => onSelectTab('finance')}
          className={`flex flex-col items-center justify-center py-1 px-1 w-full rounded-xl transition-all relative cursor-pointer ${
            currentTab === 'finance'
              ? 'text-[#D4AF37] font-black'
              : 'text-stone-400 hover:text-stone-200 font-bold'
          }`}
        >
          <div className={`p-1 rounded-lg relative ${currentTab === 'finance' ? 'bg-[#27272A]' : ''}`}>
            <CreditCard className="w-5 h-5" />
            {checkAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-[#18181B]"></span>
            )}
          </div>
          <span className="text-[11px] font-bold mt-0.5 truncate">مالی</span>
        </button>

        {/* Full Drawer / Menu */}
        <button
          type="button"
          id="mobile-nav-more-menu"
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-1 w-full rounded-xl transition-all text-stone-400 hover:text-stone-200 relative cursor-pointer"
        >
          <div className="p-1 rounded-lg relative">
            <Menu className="w-5 h-5" />
            {totalBadges > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-[#D4AF37] text-[#18181B] text-[9px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-[#18181B]">
                {totalBadges}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold mt-0.5 truncate">ماژول‌ها</span>
        </button>

      </div>
    </div>
  );
};
