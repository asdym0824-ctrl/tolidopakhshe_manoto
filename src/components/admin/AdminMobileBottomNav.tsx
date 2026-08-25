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
}

export const AdminMobileBottomNav: React.FC<AdminMobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  onOpenQuickNewInvoice,
  lowStockCount,
  checkAlertCount,
  followUpCount,
}) => {
  const totalBadges = lowStockCount + checkAlertCount + followUpCount;

  return (
    <div 
      className="fixed bottom-0 inset-x-0 z-40 bg-[#18181B] text-[#FAF7F2] border-t border-[#3F3F46] shadow-2xl px-2 py-1.5 lg:hidden safe-area-bottom"
      dir="rtl"
      id="admin-mobile-bottom-nav"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        
        {/* Dashboard */}
        <button
          type="button"
          id="mobile-nav-dashboard"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-[#D4AF37] font-black'
              : 'text-stone-400 hover:text-stone-200 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${currentTab === 'dashboard' ? 'bg-[#27272A]' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">داشبورد</span>
        </button>

        {/* Inventory */}
        <button
          type="button"
          id="mobile-nav-inventory"
          onClick={() => onSelectTab('inventory')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
            currentTab === 'inventory'
              ? 'text-[#D4AF37] font-black'
              : 'text-stone-400 hover:text-stone-200 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg relative ${currentTab === 'inventory' ? 'bg-[#27272A]' : ''}`}>
            <Package className="w-5 h-5" />
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-[#18181B]"></span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">انبار کالا</span>
        </button>

        {/* Quick New Invoice Floating Action Center Button */}
        <button
          type="button"
          id="mobile-nav-quick-invoice"
          onClick={onOpenQuickNewInvoice}
          className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
          title="صدور سریع فاکتور"
        >
          <div className="w-12 h-12 rounded-full bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] flex items-center justify-center shadow-lg border-4 border-[#18181B] group-active:scale-95 transition-transform">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[9.5px] font-black text-[#FAF7F2] mt-0.5">فاکتور +</span>
        </button>

        {/* Finance & Checks */}
        <button
          type="button"
          id="mobile-nav-finance"
          onClick={() => onSelectTab('finance')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
            currentTab === 'finance'
              ? 'text-[#D4AF37] font-black'
              : 'text-stone-400 hover:text-stone-200 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg relative ${currentTab === 'finance' ? 'bg-[#27272A]' : ''}`}>
            <CreditCard className="w-5 h-5" />
            {checkAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-[#18181B]"></span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">چک و مالی</span>
        </button>

        {/* Full Drawer / Menu */}
        <button
          type="button"
          id="mobile-nav-more-menu"
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all text-stone-400 hover:text-stone-200 relative cursor-pointer"
        >
          <div className="p-1 rounded-lg relative">
            <Menu className="w-5 h-5" />
            {totalBadges > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-[#D4AF37] text-[#18181B] text-[9px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-[#18181B]">
                {totalBadges}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">کل ماژول‌ها</span>
        </button>

      </div>
    </div>
  );
};
