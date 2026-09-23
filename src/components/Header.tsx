import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  Search, 
  Store, 
  AlertCircle, 
  Crown,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  LogOut,
  Shield,
  UserCheck,
  Package,
  Users,
  Receipt,
  CreditCard,
  X,
  Zap,
  ArrowRight,
  Menu,
  HelpCircle,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { ModuleTab, Product, Customer, CheckItem, Invoice, UserRoleType } from '../types';
import { ManotoLogo } from './common/ManotoLogo';
import { ROLE_PERMISSIONS, isTabAllowedForRole } from '../utils/rolePermissions';
import { ADMIN_SECURITY_ACCOUNTS, verifyRoleCredentials } from '../utils/authConfig';

interface HeaderProps {
  currentTab: ModuleTab;
  onSelectTab: (tab: ModuleTab) => void;
  products: Product[];
  customers: Customer[];
  checks: CheckItem[];
  invoices?: Invoice[];
  currentUserRole: UserRoleType;
  onSwitchUserRole: (role: UserRoleType) => void;
  onOpenQuickNewProduct: () => void;
  onOpenQuickNewInvoice: () => void;
  onOpenQuickEntry?: () => void;
  onOpenStorefront?: () => void;
  onLogout?: () => void;
  onOpenLoginGate?: () => void;
  onOpenHelpModal?: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  products,
  customers,
  checks,
  invoices = [],
  currentUserRole,
  onSwitchUserRole,
  onOpenQuickNewProduct,
  onOpenQuickNewInvoice,
  onOpenQuickEntry,
  onOpenStorefront,
  onLogout,
  onOpenLoginGate,
  onOpenHelpModal,
  onOpenMobileMenu
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Security Role Switch Authentication Modal State
  const [roleAuthModalRole, setRoleAuthModalRole] = useState<UserRoleType | null>(null);
  const [roleAuthPassword, setRoleAuthPassword] = useState('');
  const [roleAuthError, setRoleAuthError] = useState('');
  const [roleAuthShowPassword, setRoleAuthShowPassword] = useState(false);
  const [roleAuthShowHint, setRoleAuthShowHint] = useState(false);
  const [securitySuccessToast, setSecuritySuccessToast] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const roleConfig = ROLE_PERMISSIONS[currentUserRole] || ROLE_PERMISSIONS.super_admin;
  const isSuperAdmin = currentUserRole === 'super_admin';

  // Handle password verification & switching role securely
  const handleVerifyAndSwitchRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleAuthModalRole) return;
    
    setRoleAuthError('');
    const isValid = verifyRoleCredentials(roleAuthModalRole, roleAuthPassword);
    
    if (isValid) {
      const targetRole = roleAuthModalRole;
      const targetConfig = ROLE_PERMISSIONS[targetRole];
      
      onSwitchUserRole(targetRole);
      
      if (targetRole === 'order_tracker') {
        onSelectTab('order_tracking');
      } else if (targetRole === 'content_admin') {
        onSelectTab('inventory');
      } else if (!targetConfig.allowedTabs.includes(currentTab)) {
        onSelectTab(targetConfig.allowedTabs[0] || 'dashboard');
      }
      
      setRoleAuthModalRole(null);
      setRoleAuthPassword('');
      setRoleAuthShowHint(false);
      setSecuritySuccessToast(`احراز هویت موفق: ورود به حساب «${targetConfig.shortLabel}» تأیید گردید.`);
      setTimeout(() => setSecuritySuccessToast(null), 4500);
    } else {
      setRoleAuthError('کلمه عبور وارد شده نادرست است! امکان تغییر حساب کاربری بدون رمز معتبر وجود ندارد.');
    }
  };

  // RBAC checks for quick action buttons
  const canCreateInvoice = isTabAllowedForRole('sales', currentUserRole);
  const canCreateProduct = isTabAllowedForRole('inventory', currentUserRole);
  const canQuickEntry = canCreateInvoice || canCreateProduct;

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multi-entity search calculation
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedProducts = products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.fabricType && p.fabricType.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedCustomers = customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.storeName && c.storeName.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q))
    ).slice(0, 4);

    const matchedInvoices = invoices.filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      (inv.storeName && inv.storeName.toLowerCase().includes(q)) ||
      (inv.city && inv.city.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedChecks = checks.filter(chk =>
      chk.customerName.toLowerCase().includes(q) ||
      chk.checkNumber.includes(q) ||
      (chk.sayadNumber && chk.sayadNumber.includes(q)) ||
      chk.bankName.toLowerCase().includes(q)
    ).slice(0, 4);

    const totalCount = matchedProducts.length + matchedCustomers.length + matchedInvoices.length + matchedChecks.length;

    return {
      products: matchedProducts,
      customers: matchedCustomers,
      invoices: matchedInvoices,
      checks: matchedChecks,
      totalCount,
    };
  }, [searchQuery, products, customers, invoices, checks]);

  // Computed alerts
  const lowStockCount = products.filter(p => p.packStock <= p.minPackStockAlert).length;
  const pendingChecksCount = checks.filter(c => c.status === 'pending' || c.status === 'in_collection').length;
  const followUpRequiredCustomers = customers.filter(c => c.followUpRequired).length;

  const totalNotifications = (lowStockCount > 0 ? 1 : 0) + (pendingChecksCount > 0 ? 1 : 0) + (followUpRequiredCustomers > 0 ? 1 : 0);

  const handleSearchResultClick = (tab: ModuleTab) => {
    onSelectTab(tab);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  const renderSearchResultsList = () => {
    if (!searchResults) return null;

    if (searchResults.totalCount === 0) {
      return (
        <div className="p-6 text-center text-xs text-stone-500">
          <p className="font-bold text-stone-700 mb-1">نتیجه‌ای برای «{searchQuery}» یافت نشد</p>
          <p className="text-[11px] text-stone-400">می‌توانید با نام کالا، کد SKU، نام مشتری، شهر یا شماره فاکتور جستجو کنید.</p>
        </div>
      );
    }

    return (
      <div className="max-h-[70vh] overflow-y-auto divide-y divide-[#E6DEC8]/60 text-xs">
        
        {/* Products Group */}
        {searchResults.products.length > 0 && (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-stone-500">
              <span className="flex items-center gap-1.5 text-[#8C6D37]">
                <Package className="w-3.5 h-3.5" />
                کالاها و موجودی انبار ({searchResults.products.length})
              </span>
              <button 
                type="button" 
                onClick={() => handleSearchResultClick('inventory')}
                className="text-[10px] text-[#8C6D37] hover:underline cursor-pointer"
              >
                مشاهده همه
              </button>
            </div>
            <div className="space-y-1 mt-1">
              {searchResults.products.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSearchResultClick('inventory')}
                  className="w-full text-right p-2 hover:bg-[#FAF7F2] rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="truncate">
                    <p className="font-bold text-stone-900 group-hover:text-[#8C6D37] truncate">{p.name}</p>
                    <p className="text-[10px] text-stone-500">کد: {p.sku} | موجودی: {p.packStock} پک ({p.packSize} تایی)</p>
                  </div>
                  <span className="text-[11px] font-black text-[#18181B] shrink-0 mr-2">
                    {p.baseWholesalePricePerPack.toLocaleString('fa-IR')} ت
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Customers Group */}
        {searchResults.customers.length > 0 && (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-stone-500">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Users className="w-3.5 h-3.5" />
                مشتریان و همکاران ({searchResults.customers.length})
              </span>
              <button 
                type="button" 
                onClick={() => handleSearchResultClick('crm')}
                className="text-[10px] text-blue-700 hover:underline cursor-pointer"
              >
                مشاهده همه
              </button>
            </div>
            <div className="space-y-1 mt-1">
              {searchResults.customers.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSearchResultClick('crm')}
                  className="w-full text-right p-2 hover:bg-blue-50/50 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="truncate">
                    <p className="font-bold text-stone-900 group-hover:text-blue-800 truncate">{c.name}</p>
                    <p className="text-[10px] text-stone-500">{c.storeName} • {c.city} • {c.phone}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mr-2 ${
                    c.trustScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    اعتبار {c.trustScore}٪
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Invoices Group */}
        {searchResults.invoices.length > 0 && (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-stone-500">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Receipt className="w-3.5 h-3.5" />
                فاکتورهای فروش ({searchResults.invoices.length})
              </span>
              <button 
                type="button" 
                onClick={() => handleSearchResultClick('sales')}
                className="text-[10px] text-emerald-700 hover:underline cursor-pointer"
              >
                مشاهده همه
              </button>
            </div>
            <div className="space-y-1 mt-1">
              {searchResults.invoices.map(inv => (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => handleSearchResultClick('sales')}
                  className="w-full text-right p-2 hover:bg-emerald-50/50 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="truncate">
                    <p className="font-bold text-stone-900 group-hover:text-emerald-800 truncate">
                      فاکتور {inv.invoiceNumber} - {inv.customerName}
                    </p>
                    <p className="text-[10px] text-stone-500">{inv.storeName} ({inv.city}) • {inv.paymentType === 'cash' ? 'نقدی' : 'چکی'}</p>
                  </div>
                  <span className="text-[11px] font-black text-emerald-900 shrink-0 mr-2">
                    {inv.finalAmountToman.toLocaleString('fa-IR')} ت
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Checks Group */}
        {searchResults.checks.length > 0 && (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-stone-500">
              <span className="flex items-center gap-1.5 text-purple-700">
                <CreditCard className="w-3.5 h-3.5" />
                چک‌های صیادی ({searchResults.checks.length})
              </span>
              <button 
                type="button" 
                onClick={() => handleSearchResultClick('finance')}
                className="text-[10px] text-purple-700 hover:underline cursor-pointer"
              >
                مشاهده همه
              </button>
            </div>
            <div className="space-y-1 mt-1">
              {searchResults.checks.map(chk => (
                <button
                  key={chk.id}
                  type="button"
                  onClick={() => handleSearchResultClick('finance')}
                  className="w-full text-right p-2 hover:bg-purple-50/50 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="truncate">
                    <p className="font-bold text-stone-900 group-hover:text-purple-800 truncate">
                      چک {chk.customerName} ({chk.bankName})
                    </p>
                    <p className="text-[10px] text-stone-500">سررسید: {chk.dueDate} • ش.چک: {chk.checkNumber}</p>
                  </div>
                  <span className="text-[11px] font-black text-purple-900 shrink-0 mr-2">
                    {chk.amountToman.toLocaleString('fa-IR')} ت
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-40 bg-[#FAF7F2]/85 backdrop-blur-xl border-b border-[#E6DEC8]/90 shadow-[0_4px_24px_-4px_rgba(24,24,27,0.06),0_1px_2px_rgba(24,24,27,0.02)] transition-all relative" 
      dir="rtl"
    >
      {/* Delicate ambient gold hairline accent on bottom of header */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent pointer-events-none" />
      
      {/* Top Black Bar matching the Main Site */}
      <div className="bg-gradient-to-r from-[#18181B] via-[#232328] to-[#18181B] text-[#FAF7F2] text-[11px] py-1.5 px-4 overflow-hidden border-b border-[#D4AF37]/25 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#D4AF37] text-[#18181B] font-black px-2.5 py-0.5 rounded-full text-[10px] tracking-wide flex items-center gap-1">
              <Crown className="w-3 h-3 text-[#18181B]" />
              <span>{roleConfig.shortLabel}</span>
            </span>
            <span className="text-[#E6DEC8] truncate hidden sm:inline">
              مدیریت بنکداری و تولیدی پوشاک من و تو (اسدی) • بازار بزرگ تهران
            </span>
          </div>

          <div className="flex items-center gap-3 text-stone-300 text-[11px] flex-shrink-0">
            {currentUserRole !== 'order_tracker' && onOpenStorefront && (
              <button
                type="button"
                id="btn-topbar-storefront"
                onClick={onOpenStorefront}
                className="text-[#D4AF37] hover:text-amber-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="مشاهده سایت فروشگاه مشتریان"
              >
                <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">مشاهده ویترین آنلاین فروشگاه</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            {onLogout && (
              <>
                <span className="text-stone-700">|</span>
                <button
                  type="button"
                  onClick={onLogout}
                  id="btn-topbar-logout"
                  className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="خروج از پنل مدیریت"
                >
                  <LogOut className="w-3 h-3 text-rose-400" />
                  <span>خروج</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Admin Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Right Section: Brand & Shop Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile / Tablet Drawer Trigger */}
            {onOpenMobileMenu && (
              <button
                type="button"
                id="btn-header-mobile-menu"
                onClick={onOpenMobileMenu}
                className="p-2 bg-[#18181B] hover:bg-stone-800 text-[#D4AF37] border border-[#3F3F46] rounded-xl transition-colors shadow-xs lg:hidden cursor-pointer flex items-center justify-center shrink-0"
                title="مشاهده منوی سیستم و ماژول‌ها"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div 
              onClick={onOpenStorefront}
              className="cursor-pointer group flex items-center gap-2 sm:gap-3"
              title="مشاهده ویترین عمومی فروشگاه"
            >
              <div className="bg-[#FAF7F2] border border-[#E6DEC8] p-1.5 rounded-2xl shadow-xs group-hover:border-[#18181B] transition-all">
                <ManotoLogo size="sm" showPersianSub={false} />
              </div>
              {!isSuperAdmin && (
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm sm:text-base font-black text-[#18181B] leading-tight">
                      پوشاک من و تو
                    </h1>
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
              )}
            </div>
          </div>

          {/* Center Section: Global Search Bar with Live Grouped Results Dropdown (Hidden for order_tracker) */}
          {currentUserRole !== 'order_tracker' && (
            <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <div className="relative w-full">
                <input
                  id="header-global-search"
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  placeholder="جستجوی سریع کالا، کد انبار، نام مشتری، فاکتور یا چک..."
                  className="w-full pl-8 pr-10 py-2 rounded-xl bg-white border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/15 focus:border-[#18181B] text-xs text-stone-900 transition-all placeholder:text-stone-400 shadow-xs"
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdown Results */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-[#DDD5C0] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2.5 bg-[#FAF7F2] border-b border-[#E6DEC8] flex items-center justify-between text-[11px] font-bold text-stone-600">
                    <span>نتایج جستجوی جامع: «{searchQuery}»</span>
                    <span className="text-[#8C6D37]">{searchResults?.totalCount || 0} مورد یافت شد</span>
                  </div>
                  {renderSearchResultsList()}
                </div>
              )}
            </div>
          )}

          {/* Left Section: Actions, Quick Buttons (RBAC Gated - Fix 7), Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Mobile Search Trigger Button (Only for non-order_tracker) */}
            {currentUserRole !== 'order_tracker' && (
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(true)}
                className="p-2 bg-white hover:bg-[#FAF7F2] text-stone-700 border border-[#DDD5C0] rounded-xl transition-colors shadow-xs md:hidden cursor-pointer"
                title="جستجوی سریع"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Help Guide Button */}
            {onOpenHelpModal && (
              <button
                type="button"
                id="btn-header-help-guide"
                onClick={onOpenHelpModal}
                className="hidden md:flex text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8]/60 text-[#8C6D37] hover:text-stone-950 font-bold px-3 py-2 rounded-xl transition-all items-center gap-1.5 border border-[#DDD5C0] shadow-2xs cursor-pointer"
                title="راهنمای سریع کار با سیستم"
              >
                <HelpCircle className="w-4 h-4 text-[#8C6D37]" />
                <span>راهنما</span>
              </button>
            )}

            {/* Quick Action: Natural Language One-Line Entry */}
            {canQuickEntry && onOpenQuickEntry && (
              <button
                type="button"
                onClick={onOpenQuickEntry}
                className="hidden lg:flex text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8]/60 text-[#18181B] font-bold px-3 py-2 rounded-xl transition-all items-center gap-1.5 border border-[#DDD5C0] shadow-2xs cursor-pointer"
                title="ثبت سریع فاکتور یا کالا با یک خط متن"
              >
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>ثبت سریع</span>
              </button>
            )}

            {/* Desktop Quick Actions with RBAC Check (Fix 7) */}
            <div className="hidden sm:flex items-center gap-2">
              {canCreateInvoice && (
                <button
                  id="btn-quick-new-invoice"
                  type="button"
                  onClick={onOpenQuickNewInvoice}
                  className="text-xs bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>+ فاکتور جدید</span>
                </button>
              )}

              {canCreateProduct && (
                <button
                  id="btn-quick-new-product"
                  type="button"
                  onClick={onOpenQuickNewProduct}
                  className="text-xs bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] font-black px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>+ ثبت کالا</span>
                </button>
              )}
            </div>

            {/* Notification Bell (Hidden for order_tracker since alerts are financial/inventory) */}
            {currentUserRole !== 'order_tracker' && (
              <div className="relative">
                <button
                  id="btn-header-notifications"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 bg-white hover:bg-[#FAF7F2] text-stone-700 border border-[#DDD5C0] rounded-xl transition-colors shadow-xs cursor-pointer"
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
            )}

            {/* User Profile & Role Selector */}
            <div className="relative">
              <button
                id="btn-user-role-menu"
                onClick={() => setShowProfileModal(!showProfileModal)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-[#18181B] text-[#FAF7F2] border border-[#3F3F46] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                title={`نقش کاربر: ${roleConfig.title}`}
              >
                <div className="w-6 h-6 rounded-lg bg-[#D4AF37] text-[#18181B] flex items-center justify-center text-xs font-black">
                  <Crown className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block text-right">
                  <span className="block font-black text-[#FAF7F2] text-xs">
                    {currentUserRole === 'order_tracker' 
                      ? 'واحد پیگیری سفارشات' 
                      : currentUserRole === 'content_admin'
                      ? 'واحد مدیریت محتوا'
                      : 'حاج رضا اسدی'}
                  </span>
                  <span className="block text-[10px] text-[#D4AF37] font-normal">
                    {roleConfig.shortLabel}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {showProfileModal && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#DDD5C0] p-3.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#E6DEC8]">
                    <div className="w-9 h-9 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-black">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#18181B] text-xs">
                        {currentUserRole === 'order_tracker' 
                          ? 'واحد پیگیری و ارسال سفارشات' 
                          : currentUserRole === 'content_admin'
                          ? 'واحد مدیریت محتوا و محصولات'
                          : 'حاج رضا اسدی'}
                      </h4>
                      <p className="text-[10px] text-[#8C6D37] font-bold">{roleConfig.title}</p>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-[#8C6D37]" />
                        <span>سوییچ حساب (نیازمند رمز ورود):</span>
                      </label>
                      <span className="text-[9.5px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        امنیت فعال
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                      {(Object.keys(ROLE_PERMISSIONS) as UserRoleType[]).map((r) => {
                        const isCurrent = currentUserRole === r;
                        const conf = ROLE_PERMISSIONS[r];
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              if (isCurrent) {
                                setShowProfileModal(false);
                                return;
                              }
                              // Security: Require password authentication to switch account
                              setShowProfileModal(false);
                              setRoleAuthModalRole(r);
                              setRoleAuthPassword('');
                              setRoleAuthError('');
                              setRoleAuthShowHint(false);
                            }}
                            className={`w-full text-right px-2.5 py-2 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer group ${
                              isCurrent
                                ? 'bg-[#18181B] text-[#D4AF37] font-black'
                                : 'hover:bg-[#FAF7F2] text-stone-700 border border-transparent hover:border-[#E6DEC8]'
                            }`}
                            title={isCurrent ? 'حساب فعال جاری' : `نیازمند تأیید کلمه عبور جهت ورود به حساب ${conf.shortLabel}`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{conf.shortLabel}</span>
                              {r === 'super_admin' && (
                                <Crown className={`w-3 h-3 ${isCurrent ? 'text-[#D4AF37]' : 'text-stone-400'}`} />
                              )}
                            </div>

                            {isCurrent ? (
                              <span className="flex items-center gap-1 text-[10px] text-[#D4AF37] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>فعال</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium bg-stone-100 group-hover:bg-amber-100/80 group-hover:text-amber-900 px-2 py-0.5 rounded-md border border-stone-200 transition-colors">
                                <Lock className="w-2.5 h-2.5 text-stone-400 group-hover:text-amber-700" />
                                <span>ورود با رمز</span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#E6DEC8] space-y-1.5">
                    <button
                      onClick={() => {
                        onSelectTab('roles');
                        setShowProfileModal(false);
                      }}
                      className="w-full text-center py-2 bg-[#FAF7F2] hover:bg-[#E6DEC8]/50 text-[#18181B] rounded-xl font-bold transition-colors border border-[#DDD5C0] cursor-pointer"
                    >
                      تنظیمات و امنیت نقش‌ها
                    </button>

                    {onOpenLoginGate && (
                      <button
                        onClick={() => {
                          setShowProfileModal(false);
                          onOpenLoginGate();
                        }}
                        className="w-full text-center py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition-colors border border-stone-300 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D37]" />
                        <span>ورود از درگاه رسمی مدیریت</span>
                      </button>
                    )}

                    {onLogout && (
                      <button
                        onClick={() => {
                          setShowProfileModal(false);
                          onLogout();
                        }}
                        className="w-full text-center py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition-colors border border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>خروج از پنل مدیریت</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Global Search Overlay Modal (Fix 1 Mobile Support) */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex flex-col p-4 md:hidden animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full shadow-2xl border border-[#DDD5C0] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-3.5 border-b border-[#E6DEC8] flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی کالا، مشتری، فاکتور یا چک..."
                  className="w-full pl-8 pr-10 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD5C0] text-xs text-stone-900 focus:outline-none focus:bg-white"
                  autoFocus
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-2.5 text-stone-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2.5 text-stone-500 hover:text-stone-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {renderSearchResultsList()}
            </div>
          </div>
        </div>
      )}

      {/* Security Role Switch Authentication Modal - Portaled to document.body so it is never trapped inside sticky header backdrop-filter containing block */}
      {roleAuthModalRole && typeof document !== 'undefined' && createPortal(
        <div 
          id="modal-role-security-auth"
          onClick={(e) => {
            if (e.target === e.currentTarget) setRoleAuthModalRole(null);
          }}
          className="fixed inset-0 z-[9999] bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150" 
          dir="rtl"
        >
          <div 
            id="modal-role-security-card"
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
                    تأیید هویت و کلمه عبور امنیتی
                  </h3>
                  <p className="text-[11px] text-[#8C6D37] font-bold mt-0.5">
                    کنترل سطح دسترسی • پوشاک من و تو (manoto dress)
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
                    <span className="text-xs font-bold text-stone-500">حساب کاربری مقصد:</span>
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
                جهت پیشگیری از ارتقای غیرمجاز دسترسی و محافظت از اطلاعات مالی و موجودی انبار، ورود به این حساب مستلزم درج کلمه عبور اختصاصی می‌باشد.
              </span>
            </div>

            {/* Password Form */}
            <form onSubmit={handleVerifyAndSwitchRole} className="space-y-3.5">
              {roleAuthError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl flex items-center gap-2.5 animate-in fade-in font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
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
                  id="btn-confirm-role-security-auth"
                  className="flex-1 py-3 px-4 bg-[#18181B] hover:bg-stone-800 text-[#D4AF37] hover:text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>تأیید کلمه عبور و ورود امن</span>
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

      {/* Security Toast Notification - Portaled to document.body */}
      {securitySuccessToast && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 left-6 z-[9999] bg-[#18181B] text-[#FAF7F2] border border-[#D4AF37]/60 shadow-2xl px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-4 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{securitySuccessToast}</span>
          <button
            type="button"
            onClick={() => setSecuritySuccessToast(null)}
            className="text-stone-400 hover:text-white mr-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>,
        document.body
      )}

    </header>
  );
};

