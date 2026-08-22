import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Store, 
  Send, 
  AlertCircle, 
  Crown,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { ModuleTab, Product, Customer, CheckItem } from '../types';
import { ManotoLogo } from './common/ManotoLogo';

interface HeaderProps {
  currentTab: ModuleTab;
  onSelectTab: (tab: ModuleTab) => void;
  products: Product[];
  customers: Customer[];
  checks: CheckItem[];
  currentUserRole: string;
  onSwitchUserRole: (role: string) => void;
  onOpenQuickNewProduct: () => void;
  onOpenQuickNewInvoice: () => void;
  onOpenStorefront?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  products,
  customers,
  checks,
  currentUserRole,
  onSwitchUserRole,
  onOpenQuickNewProduct,
  onOpenQuickNewInvoice,
  onOpenStorefront
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Computed alerts
  const lowStockCount = products.filter(p => p.packStock <= p.minPackStockAlert).length;
  const pendingChecksCount = checks.filter(c => c.status === 'pending' || c.status === 'in_collection').length;
  const followUpRequiredCustomers = customers.filter(c => c.followUpRequired).length;

  const totalNotifications = (lowStockCount > 0 ? 1 : 0) + (pendingChecksCount > 0 ? 1 : 0) + (followUpRequiredCustomers > 0 ? 1 : 0);

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DEC8] shadow-xs" dir="rtl">
      
      {/* Top Black Bar matching the Main Site */}
      <div className="bg-[#18181B] text-[#FAF7F2] text-[11px] py-1.5 px-4 overflow-hidden border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#D4AF37] text-[#18181B] font-black px-2.5 py-0.5 rounded-full text-[10px] tracking-wide flex items-center gap-1">
              <Crown className="w-3 h-3 text-[#18181B]" />
              <span>پنل مرکزی سوپر ادمین</span>
            </span>
            <span className="text-[#E6DEC8] truncate hidden sm:inline">
              مدیریت بنکداری و تولیدی پوشاک من و تو (اسدی) • بازار بزرگ تهران
            </span>
          </div>

          <div className="flex items-center gap-3 text-stone-300 text-[11px] flex-shrink-0">
            {onOpenStorefront && (
              <button
                type="button"
                id="btn-topbar-storefront"
                onClick={onOpenStorefront}
                className="text-[#D4AF37] hover:text-amber-200 font-bold flex items-center gap-1.5 transition-colors"
                title="مشاهده سایت فروشگاه مشتریان"
              >
                <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">مشاهده ویترین آنلاین فروشگاه</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            <span className="text-stone-700 hidden sm:inline">|</span>

            <span className="text-[#E6DEC8] font-mono text-[10px] hidden md:inline">
              دسترسی تام و یکپارچه فعال است
            </span>
          </div>
        </div>
      </div>

      {/* Main Admin Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Right Section: Brand & Shop Identity */}
          <div className="flex items-center gap-3">
            <div 
              onClick={onOpenStorefront}
              className="cursor-pointer group flex items-center gap-3"
              title="مشاهده ویترین عمومی فروشگاه"
            >
              <div className="bg-[#FAF7F2] border border-[#E6DEC8] p-1.5 rounded-2xl shadow-xs group-hover:border-[#18181B] transition-all">
                <ManotoLogo size="sm" showPersianSub={false} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-black text-[#18181B] leading-tight">
                    پوشاک من و تو
                  </h1>
                  <span className="bg-[#18181B] text-[#D4AF37] text-[10px] px-2 py-0.5 rounded-full font-bold border border-[#3F3F46]">
                    سوپر ادمین
                  </span>
                </div>
                <p className="text-[11px] text-[#8C6D37] flex items-center gap-1.5 mt-0.5">
                  <span>پاساژ المهدی ۴، پلاک ۲۴۲</span>
                  <span>•</span>
                  <span className="text-emerald-800 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                    همگام با انبار و سایت
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Center Section: Quick Search Bar matching the Main Site */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                id="header-global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی سریع مدل کالا، کد انبار، نام مشتری یا شهر..."
                className="w-full pl-4 pr-10 py-2 rounded-xl bg-white border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/15 focus:border-[#18181B] text-xs text-stone-900 transition-all placeholder:text-stone-400 shadow-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Left Section: Actions, Quick Buttons, Notifications & Super Admin Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick Actions matching Luxury Palette */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                id="btn-quick-new-invoice"
                onClick={onOpenQuickNewInvoice}
                className="text-xs bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>+ فاکتور جدید</span>
              </button>

              <button
                id="btn-quick-new-product"
                onClick={onOpenQuickNewProduct}
                className="text-xs bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] font-black px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shadow-xs"
              >
                <span>+ ثبت کالا</span>
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="btn-header-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white hover:bg-[#FAF7F2] text-stone-700 border border-[#DDD5C0] rounded-xl transition-colors shadow-xs"
                title="هشدارهای مهم"
              >
                <Bell className="w-4 h-4" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#DDD5C0] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E6DEC8]">
                    <span className="text-xs font-black text-[#18181B] flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
                      هشدارهای امروز انبار و مالی
                    </span>
                    <span className="text-[10px] text-stone-500 font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#E6DEC8]">
                      ۳ مورد
                    </span>
                  </div>

                  <div className="space-y-2 mt-2.5 max-h-64 overflow-y-auto">
                    {pendingChecksCount > 0 && (
                      <div 
                        onClick={() => { onSelectTab('finance'); setShowNotifications(false); }}
                        className="p-2.5 bg-[#FAF7F2] hover:bg-amber-50/80 border border-[#E6DEC8] rounded-xl cursor-pointer transition-colors"
                      >
                        <p className="text-xs font-bold text-[#8C6D37]">چک سررسید نزدیک (۳ روز آینده)</p>
                        <p className="text-[11px] text-stone-600 mt-0.5">چک ۲۸,۵۰۰,۰۰۰ تومانی حاج داوود محمدی (اصفهان)</p>
                      </div>
                    )}

                    {lowStockCount > 0 && (
                      <div 
                        onClick={() => { onSelectTab('inventory'); setShowNotifications(false); }}
                        className="p-2.5 bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200 rounded-xl cursor-pointer transition-colors"
                      >
                        <p className="text-xs font-bold text-rose-900">کسری موجودی پک در انبار</p>
                        <p className="text-[11px] text-rose-700 mt-0.5">شلوار جاگر ابروبادی کمتر از ۳ پک باقی مانده است</p>
                      </div>
                    )}

                    {followUpRequiredCustomers > 0 && (
                      <div 
                        onClick={() => { onSelectTab('crm'); setShowNotifications(false); }}
                        className="p-2.5 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 rounded-xl cursor-pointer transition-colors"
                      >
                        <p className="text-xs font-bold text-blue-900">پیگیری مشتریان همکار</p>
                        <p className="text-[11px] text-blue-700 mt-0.5">۲ مشتری قدیمی بیش از ۳۰ روز است سفارشی ثبت نکرده‌اند</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Consolidated Super Admin Profile */}
            <div className="relative">
              <button
                id="btn-user-role-menu"
                onClick={() => setShowProfileModal(!showProfileModal)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-[#18181B] text-[#FAF7F2] border border-[#3F3F46] rounded-xl text-xs font-bold transition-all shadow-xs"
                title="پروفایل سوپر ادمین"
              >
                <div className="w-6 h-6 rounded-lg bg-[#D4AF37] text-[#18181B] flex items-center justify-center text-xs font-black">
                  <Crown className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block text-right">
                  <span className="block font-black text-[#FAF7F2] text-xs">
                    حاج رضا اسدی
                  </span>
                  <span className="block text-[10px] text-[#D4AF37] font-normal">
                    سوپر ادمین (دسترسی کامل)
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {showProfileModal && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#DDD5C0] p-3.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#E6DEC8]">
                    <div className="w-9 h-9 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-black">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#18181B] text-xs">حاج رضا اسدی</h4>
                      <p className="text-[10px] text-[#8C6D37] font-bold">مالک و سوپر ادمین کل سیستم</p>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1.5 text-[11px] text-stone-600">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>دسترسی تام به انبار، قیمت‌گذاری و سود</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>دسترسی به فاکتورها، چک‌ها و حسابداری</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>مدیریت ویترین آنلاین و سفارشات</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E6DEC8]">
                    <button
                      onClick={() => {
                        onSelectTab('roles');
                        setShowProfileModal(false);
                      }}
                      className="w-full text-center py-2 bg-[#FAF7F2] hover:bg-[#E6DEC8]/50 text-[#18181B] rounded-xl font-bold transition-colors border border-[#DDD5C0]"
                    >
                      مشاهده جزئیات دسترسی‌های سوپر ادمین
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
