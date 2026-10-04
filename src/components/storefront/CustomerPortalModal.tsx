import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard,
  Package, 
  Truck, 
  Wallet,
  User, 
  Phone, 
  MapPin, 
  Building2, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Printer, 
  LogOut, 
  LogIn, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  AlertCircle, 
  ShoppingBag, 
  Eye, 
  X, 
  Award, 
  KeyRound, 
  FileText,
  Search,
  ExternalLink,
  UserPlus
} from 'lucide-react';
import { CustomerUser, StorefrontOrder } from '../../types';
import { CustomerOrderStepper } from './CustomerOrderStepper';
import { FormalInvoicePrintSheet } from './FormalInvoicePrintSheet';

export type DashboardTab = 'overview' | 'orders' | 'waybills' | 'club' | 'profile';

export interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  orders: StorefrontOrder[];
  customerUsers?: CustomerUser[];
  onLogout: () => void;
  onLoginSuccess?: (user: CustomerUser) => void;
  onRegisterUser?: (user: CustomerUser) => void;
  onUpdateProfile: (updated: CustomerUser) => void;
  onOpenTrackingModalWithCode?: (code: string) => void;
  onOpenWholesalePartner?: () => void;
  onStartShopping?: () => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  customerUsers = [],
  onLogout,
  onLoginSuccess,
  onRegisterUser,
  onUpdateProfile,
  onOpenTrackingModalWithCode,
  onOpenWholesalePartner,
  onStartShopping,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'shipping' | 'delivered'>('all');
  const [printingOrder, setPrintingOrder] = useState<StorefrontOrder | null>(null);

  // Guest / Login Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regStoreName, setRegStoreName] = useState('');
  const [regProvince, setRegProvince] = useState('تهران');
  const [regCity, setRegCity] = useState('تهران');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    landlinePhone: currentUser?.landlinePhone || '',
    alternativePhone: currentUser?.alternativePhone || '',
    storeName: currentUser?.storeName || '',
    province: currentUser?.province || 'تهران',
    city: currentUser?.city || 'تهران',
    address: currentUser?.address || '',
    password: currentUser?.password || 'password123',
  });
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync profile form when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName,
        phone: currentUser.phone,
        landlinePhone: currentUser.landlinePhone || '',
        alternativePhone: currentUser.alternativePhone || '',
        storeName: currentUser.storeName || '',
        province: currentUser.province || 'تهران',
        city: currentUser.city || 'تهران',
        address: currentUser.address || '',
        password: currentUser.password || 'password123',
      });
    }
  }, [currentUser]);

  // Orders matching current user phone
  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    const cleanCurrentPhone = currentUser.phone.replace(/[^0-9]/g, '');
    const filtered = orders.filter(
      o => o.customer.phone.replace(/[^0-9]/g, '') === cleanCurrentPhone
    );
    // If no direct phone match, but current user is sample/demo user, attach relevant sample orders
    if (filtered.length === 0 && orders.length > 0) {
      return orders.slice(0, 3);
    }
    return filtered;
  }, [currentUser, orders]);

  // Computed dashboard KPIs
  const totalSpent = useMemo(() => {
    return userOrders.reduce((sum, o) => sum + (o.finalAmountToman || 0), 0);
  }, [userOrders]);

  // Wallet points / Credit balance calculation (2% cashback loyalty reward)
  const walletBalanceToman = useMemo(() => {
    const calculated = Math.round(totalSpent * 0.02);
    return Math.max(150000, calculated);
  }, [totalSpent]);

  // Recent active order (in transit or processing)
  const activeOrder = useMemo(() => {
    return userOrders.find(
      o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
    ) || userOrders[0] || null;
  }, [userOrders]);

  // Waybills list (orders with waybillNumber or carrier info)
  const waybillsList = useMemo(() => {
    return userOrders.filter(o => o.waybillNumber || o.trackingCode || o.shippingMethodTitle);
  }, [userOrders]);

  // Filtered orders for Orders tab
  const filteredOrders = useMemo(() => {
    let result = [...userOrders];

    if (orderStatusFilter === 'pending') {
      result = result.filter(o => o.orderStatus === 'registered' || o.orderStatus === 'confirmed');
    } else if (orderStatusFilter === 'shipping') {
      result = result.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'packed' || o.orderStatus === 'sent_to_carrier');
    } else if (orderStatusFilter === 'delivered') {
      result = result.filter(o => o.orderStatus === 'delivered');
    }

    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.trim().toLowerCase();
      result = result.filter(o => 
        o.orderNumber.toLowerCase().includes(q) ||
        (o.waybillNumber && o.waybillNumber.toLowerCase().includes(q)) ||
        o.items.some(i => i.product.name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [userOrders, orderStatusFilter, orderSearchQuery]);

  if (!isOpen) return null;

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      // fallback
    }
  };

  // Demo Login Quick-Action (loads sample customer user so user immediately enjoys the full dashboard)
  const handleQuickDemoLogin = () => {
    const demoUser: CustomerUser = customerUsers[0] || {
      id: 'usr-demo-1',
      phone: '09121234567',
      password: 'password123',
      fullName: 'خانم مریم احمدی',
      storeName: 'گالری ونوس (همکار بازار)',
      province: 'آذربایجان شرقی',
      city: 'تبریز',
      address: 'خیابان تربیت، پاساژ شمس، پلاک ۱۲',
      postalCode: '5138765432',
      isPartnerWholesale: true,
      registeredAt: '۱۴۰۳/۰۴/۱۵',
      totalOrdersCount: 3,
      totalSpentToman: 4250000,
    };
    if (onLoginSuccess) {
      onLoginSuccess(demoUser);
    }
    setLoginError(null);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const clean = loginPhone.replace(/[^0-9]/g, '');
    if (!clean || clean.length < 10) {
      setLoginError('لطفاً شماره موبایل ۱۱ رقمی معتبر وارد فرمایید.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('لطفاً رمز عبور حساب خود را وارد فرمایید.');
      return;
    }

    // Match existing registered user
    const found = customerUsers.find(
      u => u.phone.replace(/[^0-9]/g, '') === clean
    );

    if (found) {
      if (found.password && found.password !== loginPassword.trim()) {
        setLoginError('رمز عبور وارد شده نادرست است.');
        return;
      }
      if (onLoginSuccess) {
        onLoginSuccess(found);
      }
    } else {
      // Auto-create customer profile on successful first login
      const newUser: CustomerUser = {
        id: `usr-${Date.now()}`,
        fullName: 'خریدار محترم',
        phone: clean,
        province: 'تهران',
        city: 'تهران',
        address: 'تهران، بازار بزرگ',
        storeName: 'فروشگاه پوشاک زنانه',
        isPartnerWholesale: false,
        password: loginPassword.trim(),
        registeredAt: '۱۴۰۳/۰۷/۱۵',
        totalOrdersCount: 0,
        totalSpentToman: 0,
      };
      if (onRegisterUser) {
        onRegisterUser(newUser);
      } else if (onLoginSuccess) {
        onLoginSuccess(newUser);
      }
    }
  };

  // Register handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    const clean = regPhone.replace(/[^0-9]/g, '');
    if (!regFullName.trim()) {
      setRegError('لطفاً نام و نام خانوادگی خود را وارد فرمایید.');
      return;
    }
    if (!clean || clean.length < 10) {
      setRegError('لطفاً شماره موبایل معتبر وارد فرمایید.');
      return;
    }
    if (!regAddress.trim()) {
      setRegError('لطفاً آدرس پستی جهت ارسال بار را وارد فرمایید.');
      return;
    }
    if (!regPassword.trim() || regPassword.trim().length < 4) {
      setRegError('رمز عبور باید حداقل ۴ رقم باشد.');
      return;
    }

    const newUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      fullName: regFullName.trim(),
      phone: clean,
      storeName: regStoreName.trim() || 'فروشگاه همکار',
      province: regProvince.trim() || 'تهران',
      city: regCity.trim() || 'تهران',
      address: regAddress.trim(),
      password: regPassword.trim(),
      isPartnerWholesale: Boolean(regStoreName.trim()),
      registeredAt: '۱۴۰۳/۰۷/۱۵',
      totalOrdersCount: 0,
      totalSpentToman: 0,
    };

    if (onRegisterUser) {
      onRegisterUser(newUser);
    } else if (onLoginSuccess) {
      onLoginSuccess(newUser);
    }
  };

  // Profile update handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: CustomerUser = {
      ...currentUser,
      fullName: profileForm.fullName.trim() || currentUser.fullName,
      phone: profileForm.phone.trim() || currentUser.phone,
      landlinePhone: profileForm.landlinePhone.trim(),
      alternativePhone: profileForm.alternativePhone.trim(),
      storeName: profileForm.storeName.trim(),
      province: profileForm.province.trim(),
      city: profileForm.city.trim(),
      address: profileForm.address.trim(),
      password: profileForm.password.trim() || currentUser.password || 'password123',
    };
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getStatusBadge = (status: StorefrontOrder['orderStatus']) => {
    switch (status) {
      case 'registered':
        return <span className="bg-amber-100 text-amber-900 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">ثبت اولیه (در صف تأیید کارگاه)</span>;
      case 'confirmed':
        return <span className="bg-emerald-100 text-emerald-900 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">مرحلهٔ ۱: تأیید شده توسط مدیریت</span>;
      case 'processing':
      case 'packed':
        return <span className="bg-blue-100 text-blue-900 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-blue-300">مرحلهٔ ۲: بسته‌بندی در انبار بازار</span>;
      case 'sent_to_carrier':
        return <span className="bg-purple-100 text-purple-900 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-purple-300">مرحلهٔ ۳: تحویل به باربری / در حال حمل</span>;
      case 'delivered':
        return <span className="bg-teal-100 text-teal-900 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-teal-300">مرحلهٔ ۴: تحویل موفق به خریدار</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">در حال بررسی</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-fadeIn" dir="rtl">
      
      {/* Modal Dialog Card */}
      <div className="bg-[#FAF7F2] text-stone-900 w-full max-w-4xl rounded-3xl border border-[#DDD5C0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ===================== DASHBOARD TOP HEADER ===================== */}
        <div className="bg-gradient-to-r from-[#18181B] via-[#202024] to-[#18181B] text-[#FAF7F2] p-4 sm:p-6 border-b border-[#3F3F46] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* User Identity & Avatar Hub */}
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-[#27272A] to-[#18181B] border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-[#D4AF37]/20 shrink-0">
                {currentUser?.fullName ? currentUser.fullName.charAt(0) : <User className="w-7 h-7 text-[#D4AF37]" />}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-white text-base sm:text-lg tracking-tight">
                    {currentUser ? currentUser.fullName : 'پیشخوان اختصاصی مشتریان و خریداران'}
                  </h3>
                  {currentUser?.storeName ? (
                    <span className="text-[10px] bg-[#D4AF37]/20 text-amber-300 border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#D4AF37]" />
                      <span>{currentUser.storeName}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>پوشاک من و تو (manoto dress)</span>
                    </span>
                  )}
                </div>

                {currentUser ? (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-300 mt-1">
                    <span className="flex items-center gap-1 font-mono text-[#D4AF37]">
                      <Phone className="w-3.5 h-3.5" />
                      {currentUser.phone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {currentUser.city} ({currentUser.province})
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>باشگاه مشتریان طلایی</span>
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 mt-0.5">
                    پیگیری آنی بارنامه، فاکتورهای رسمی بازار تهران و مدیریت اعتبار خرید
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions (Logout / Close / Demo) */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                  }}
                  className="py-1.5 px-3 bg-[#27272A] hover:bg-red-950/60 text-stone-300 hover:text-red-300 rounded-xl text-xs font-bold transition-all border border-[#3F3F46] flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  title="خروج از حساب کاربری"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="py-1.5 px-3 bg-gradient-to-r from-[#D4AF37] to-amber-400 hover:from-amber-400 hover:to-[#D4AF37] text-[#18181B] rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  title="مشاهدهٔ امکانات داشبورد به عنوان خریدار نمونه"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ورود آزمایشی خریدار نمونه</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-[#27272A] transition-colors border border-transparent hover:border-[#3F3F46] cursor-pointer"
                title="بستن پیشخوان"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Quick Stats Strip (Visible when user is logged in) */}
          {currentUser && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 pt-4 border-t border-[#27272A] text-center text-xs">
              <div className="bg-[#202024]/90 p-2.5 rounded-2xl border border-[#333338] shadow-xs">
                <span className="text-stone-400 text-[10.5px] block font-bold">تعداد کل فاکتورها</span>
                <span className="text-white font-black text-sm mt-0.5 block font-mono">
                  {userOrders.length.toLocaleString('fa-IR')} فاکتور
                </span>
              </div>

              <div className="bg-[#202024]/90 p-2.5 rounded-2xl border border-[#333338] shadow-xs">
                <span className="text-stone-400 text-[10.5px] block font-bold">مجموع خرید شما</span>
                <span className="text-[#D4AF37] font-black text-sm mt-0.5 block font-mono">
                  {totalSpent.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="bg-[#202024]/90 p-2.5 rounded-2xl border border-[#333338] shadow-xs">
                <span className="text-stone-400 text-[10.5px] block font-bold">اعتبار کیف پول من</span>
                <span className="text-emerald-400 font-black text-sm mt-0.5 block font-mono">
                  {walletBalanceToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="bg-[#202024]/90 p-2.5 rounded-2xl border border-[#333338] shadow-xs">
                <span className="text-stone-400 text-[10.5px] block font-bold">وضعیت سفارش جاری</span>
                <span className="text-amber-300 font-bold text-[11px] mt-0.5 block truncate">
                  {activeOrder ? activeOrder.shippingMethodTitle : 'سفارش بازی ندارید'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ===================== LOGGED-IN: 5 TABS NAVIGATION ===================== */}
        {currentUser ? (
          <>
            <div className="flex items-center overflow-x-auto border-b border-[#E6DEC8] bg-[#FAF8F5] px-3 sm:px-6 py-1 gap-1.5 scrollbar-none">
              
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-3.5 font-black text-xs rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#D4AF37]' : 'text-[#8C6D37]'}`} />
                <span>پیشخوان و آمار</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-3.5 font-black text-xs rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Package className={`w-4 h-4 ${activeTab === 'orders' ? 'text-[#D4AF37]' : 'text-[#8C6D37]'}`} />
                <span>سفارش‌ها و فاکتورها ({userOrders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('waybills')}
                className={`py-3 px-3.5 font-black text-xs rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'waybills'
                    ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Truck className={`w-4 h-4 ${activeTab === 'waybills' ? 'text-[#D4AF37]' : 'text-[#8C6D37]'}`} />
                <span>بیجک‌ها و بارنامه‌ها ({waybillsList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('club')}
                className={`py-3 px-3.5 font-black text-xs rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'club'
                    ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Wallet className={`w-4 h-4 ${activeTab === 'club' ? 'text-[#D4AF37]' : 'text-[#8C6D37]'}`} />
                <span>کیف پول و باشگاه</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-3.5 font-black text-xs rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-[#D4AF37]' : 'text-[#8C6D37]'}`} />
                <span>مشخصات و آدرس باربری</span>
              </button>

            </div>

            {/* ===================== TAB CONTENT BODIES ===================== */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-[#FAF7F2]">
              
              {/* ---------- 1. OVERVIEW TAB ---------- */}
              {activeTab === 'overview' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Active Shipment Spotlight */}
                  {activeOrder ? (
                    <div className="bg-gradient-to-br from-white to-[#F7F3EA] p-4 sm:p-5 rounded-3xl border border-[#DDD5C0] shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6DEC8]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                            <span className="font-black text-sm text-stone-900">
                              وضعیت لحظه‌ای سفارش جاری: {activeOrder.orderNumber}
                            </span>
                          </div>
                          <span className="text-xs text-stone-500 block">
                            ارسال از طریق {activeOrder.shippingMethodTitle} • ثبت‌شده در تاریخ {activeOrder.createdAt}
                          </span>
                        </div>

                        {activeOrder.waybillNumber ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold bg-[#18181B] text-[#D4AF37] px-3 py-1.5 rounded-xl border border-[#3F3F46]">
                              بیجک: {activeOrder.waybillNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(activeOrder.waybillNumber!)}
                              className="py-1.5 px-3 bg-[#FAF7F2] hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-[#DDD5C0] transition-colors cursor-pointer"
                            >
                              {copiedCode === activeOrder.waybillNumber ? 'کپی شد' : 'کپی شماره'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-bold">
                            در حال آماده‌سازی و ارسال به باربری
                          </span>
                        )}
                      </div>

                      {/* 4-Step Interactive Pipeline Stepper */}
                      <CustomerOrderStepper order={activeOrder} />

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-stone-600">
                          مقصد تحویل بار: {activeOrder.customer.province}، {activeOrder.customer.city}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('orders');
                            setExpandedOrderId(activeOrder.id);
                          }}
                          className="font-bold text-[#8C6D37] hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                        >
                          <span>مشاهده اقلام این سفارش</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Quick Action Shortcuts Grid */}
                  <div>
                    <h4 className="font-black text-stone-900 text-sm mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>دسترسی‌های سریع و خدمات اختصاصی</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (onStartShopping) onStartShopping();
                          else onClose();
                        }}
                        className="p-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-[#DDD5C0] text-right space-y-1.5 transition-all shadow-xs hover:border-[#8C6D37] cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#8C6D37] flex items-center justify-center font-bold">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <span className="font-black text-xs block text-stone-900">مشاهده ویترین جدید</span>
                        <span className="text-[10px] text-stone-500 block">ثبت سفارش از کارگاه</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="p-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-[#DDD5C0] text-right space-y-1.5 transition-all shadow-xs hover:border-[#8C6D37] cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-black text-xs block text-stone-900">سوابق فاکتورها</span>
                        <span className="text-[10px] text-stone-500 block">چاپ فاکتور و پیش‌فاکتور</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenWholesalePartner) onOpenWholesalePartner();
                        }}
                        className="p-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-[#DDD5C0] text-right space-y-1.5 transition-all shadow-xs hover:border-[#8C6D37] cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="font-black text-xs block text-stone-900">تخفیف همکاری عمده</span>
                        <span className="text-[10px] text-stone-500 block">قیمت ویژهٔ بنکداران</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className="p-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-[#DDD5C0] text-right space-y-1.5 transition-all shadow-xs hover:border-[#8C6D37] cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="font-black text-xs block text-stone-900">آدرس باربری</span>
                        <span className="text-[10px] text-stone-500 block">تغییر آدرس تخلیه بار</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer Loyalty Special Banner */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-[#18181B] text-[#FAF7F2] border border-[#3F3F46] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#D4AF37] text-[#18181B] font-black text-[10px] rounded-md">
                          کد تخفیف اختصاصی شما
                        </span>
                        <span className="text-xs text-stone-300 font-bold">جشنوارهٔ خرید فصلی</span>
                      </div>
                      <p className="text-xs text-stone-300">
                        با وارد کردن کد زیر در صفحهٔ تسویه‌حساب، از ۵٪ تخفیف مازاد روی کل سفارش‌های عمده و تک بهره‌مند شوید:
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="font-mono font-black text-sm bg-[#27272A] border border-[#D4AF37]/50 text-amber-300 px-3 py-1.5 rounded-xl">
                        MANOTO-VIP
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode('MANOTO-VIP')}
                        className="py-1.5 px-3 bg-[#FAF7F2] hover:bg-white text-stone-900 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        {copiedCode === 'MANOTO-VIP' ? 'کپی شد' : 'کپی کد'}
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* ---------- 2. ORDERS & INVOICES TAB ---------- */}
              {activeTab === 'orders' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Filters and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-[#E6DEC8]">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="جستجو با شماره فاکتور یا نام محصول..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="w-full pr-9 pl-3 py-2 bg-white rounded-xl border border-[#DDD5C0] text-xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/20"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                      <button
                        type="button"
                        onClick={() => setOrderStatusFilter('all')}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          orderStatusFilter === 'all'
                            ? 'bg-[#18181B] text-white'
                            : 'bg-white text-stone-600 border border-[#DDD5C0]'
                        }`}
                      >
                        همه فاکتورها
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderStatusFilter('shipping')}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          orderStatusFilter === 'shipping'
                            ? 'bg-[#18181B] text-white'
                            : 'bg-white text-stone-600 border border-[#DDD5C0]'
                        }`}
                      >
                        در حال ارسال
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderStatusFilter('delivered')}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          orderStatusFilter === 'delivered'
                            ? 'bg-[#18181B] text-white'
                            : 'bg-white text-stone-600 border border-[#DDD5C0]'
                        }`}
                      >
                        تحویل‌شده
                      </button>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 space-y-3 bg-white rounded-2xl border border-[#DDD5C0]">
                      <div className="w-14 h-14 rounded-full bg-[#EDE5D3] text-[#8C6D37] flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-7 h-7" />
                      </div>
                      <h4 className="font-bold text-stone-800 text-sm">سفارشی با این مشخصات یافت نشد</h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        می‌توانید مدل‌های ژورنالی جدید پوشاک من و تو را در ویترین مشاهده و ثبت فاکتور فرمایید.
                      </p>
                      {onStartShopping && (
                        <button
                          type="button"
                          onClick={onStartShopping}
                          className="py-2 px-4 bg-[#18181B] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer hover:bg-[#27272A]"
                        >
                          مشاهده کاتالوگ مدل‌ها
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {filteredOrders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        return (
                          <div
                            key={order.id}
                            className="bg-white rounded-2xl border border-[#DDD5C0] shadow-xs overflow-hidden transition-all"
                          >
                            {/* Summary Card Row */}
                            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-black text-stone-900 text-sm font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                                    {order.orderNumber}
                                  </span>
                                  {getStatusBadge(order.orderStatus)}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                                    {order.createdAt}
                                  </span>
                                  <span>•</span>
                                  <span>ارسال با: {order.shippingMethodTitle}</span>
                                  <span>•</span>
                                  <span className="font-black text-stone-900 text-xs">
                                    {order.finalAmountToman.toLocaleString('fa-IR')} تومان
                                  </span>
                                </div>
                              </div>

                              {/* Card Action Buttons */}
                              <div className="flex items-center gap-2 self-end sm:self-center">
                                <button
                                  type="button"
                                  onClick={() => setPrintingOrder(order)}
                                  className="py-1.5 px-2.5 bg-[#FAF7F2] hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-bold border border-[#DDD5C0] transition-colors flex items-center gap-1 cursor-pointer"
                                  title="مشاهده و چاپ فاکتور رسمی"
                                >
                                  <Printer className="w-3.5 h-3.5 text-[#8C6D37]" />
                                  <span>فاکتور رسمی</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                  className="py-1.5 px-3 bg-[#18181B] text-[#FAF7F2] hover:bg-[#27272A] rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{isExpanded ? 'بستن اقلام' : 'ریز اقلام'}</span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            {/* Order Stepper */}
                            <div className="px-4 sm:px-5 py-3 bg-[#FAF7F2]/90 border-t border-[#E6DEC8]">
                              <CustomerOrderStepper order={order} />
                            </div>

                            {/* Expanded Details and Items Table */}
                            {isExpanded && (
                              <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E6DEC8] space-y-4 text-xs animate-fadeIn">
                                
                                {/* Waybill information */}
                                {order.waybillNumber ? (
                                  <div className="bg-[#18181B] text-[#FAF7F2] p-3.5 rounded-2xl border border-[#3F3F46] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-0.5">
                                      <span className="text-[11px] text-[#D4AF37] font-black block">
                                        اطلاعات بارنامه و بیجک باربری صادر شده:
                                      </span>
                                      <span className="font-mono text-sm font-bold text-white block">
                                        شماره بیجک: {order.waybillNumber} ({order.carrierName || order.shippingMethodTitle})
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyCode(order.waybillNumber!)}
                                      className="py-1 px-3 bg-[#FAF7F2] text-[#18181B] font-bold text-xs rounded-xl cursor-pointer self-start sm:self-center"
                                    >
                                      {copiedCode === order.waybillNumber ? 'کپی شد' : 'کپی شماره بیجک'}
                                    </button>
                                  </div>
                                ) : (
                                  <div className="bg-amber-50 text-amber-900 p-3 rounded-2xl border border-amber-200 text-xs flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                                    <span>سفارش شما در مرحلهٔ آماده‌سازی و بسته‌بندی در انبار بازار عباس‌آباد قرار دارد.</span>
                                  </div>
                                )}

                                {/* Items Breakdown */}
                                <div>
                                  <span className="font-black text-stone-900 block mb-2 text-xs">
                                    اقلام خریداری‌شده ({order.items.length} ردیف):
                                  </span>
                                  <div className="space-y-2">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="bg-white p-3 rounded-xl border border-[#DDD5C0] flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                          <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-12 h-12 object-cover rounded-xl border border-[#DDD5C0] shrink-0"
                                          />
                                          <div>
                                            <span className="font-black text-stone-900 block text-xs">{item.product.name}</span>
                                            <span className="text-[11px] text-stone-500 block mt-0.5">
                                              {item.mode === 'wholesale_pack' ? `پک ${item.product.packSize} تایی × ${item.quantity}` : `تک‌فروشی × ${item.quantity}`}
                                              {item.selectedColor ? ` • رنگ: ${item.selectedColor}` : ''}
                                              {item.selectedSize ? ` • سایز: ${item.selectedSize}` : ''}
                                            </span>
                                          </div>
                                        </div>
                                        <span className="font-black text-stone-900 text-xs">
                                          {item.totalPriceToman.toLocaleString('fa-IR')} تومان
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Delivery Address */}
                                <div className="bg-white p-3.5 rounded-xl border border-[#DDD5C0] text-xs text-stone-700">
                                  <span className="font-bold text-stone-900 block mb-1">نشانی تحویل بار ثبت‌شده:</span>
                                  <p>{order.customer.province}، {order.customer.city}، {order.customer.address}</p>
                                </div>

                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

              {/* ---------- 3. WAYBILLS & TRACKING TAB ---------- */}
              {activeTab === 'waybills' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDD5C0] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-[#8C6D37]" />
                        <h4 className="font-black text-stone-900 text-sm">
                          لیست بیجک‌ها و بارنامه‌های رسمی
                        </h4>
                      </div>
                      <span className="text-xs text-stone-500 font-bold">
                        تحویل به باربری‌های معتبر شوش و راه‌آهن
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      کلیه بارهای ثبت‌شده در پوشاک من و تو، همه‌روزه ساعت ۱۴ و ۱۸ تحویل باربری‌های وطن، پیام‌شمس، پیشتاز، تیپاکس و ترمینال‌های مسافربری می‌شوند.
                    </p>
                  </div>

                  {waybillsList.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-[#DDD5C0] text-xs text-stone-500 space-y-2">
                      <Truck className="w-8 h-8 text-stone-300 mx-auto" />
                      <p>هنوز بارنامه‌ای برای سفارش‌های شما صادر نشده است.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {waybillsList.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white p-4 rounded-2xl border border-[#DDD5C0] shadow-xs space-y-3"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-[#E6DEC8]">
                            <span className="font-mono font-black text-stone-900 text-xs">
                              {order.orderNumber}
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              {order.carrierName || order.shippingMethodTitle}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs text-stone-600">
                            <div className="flex items-center justify-between">
                              <span className="text-stone-400">شماره بیجک:</span>
                              <span className="font-mono font-black text-stone-900">
                                {order.waybillNumber || order.trackingCode || 'در انتظار صدور'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-stone-400">تاریخ تحویل به باربری:</span>
                              <span>{order.createdAt}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-stone-400">شهر مقصد:</span>
                              <span>{order.customer.city} ({order.customer.province})</span>
                            </div>
                          </div>

                          {order.waybillNumber && (
                            <button
                              type="button"
                              onClick={() => handleCopyCode(order.waybillNumber!)}
                              className="w-full py-2 bg-[#FAF7F2] hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-[#DDD5C0] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#8C6D37]" />
                              <span>{copiedCode === order.waybillNumber ? 'کد بیجک کپی شد!' : 'کپی شماره بارنامه'}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* ---------- 4. WALLET & CLUB TAB ---------- */}
              {activeTab === 'club' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Luxury Loyalty Card */}
                  <div className="bg-gradient-to-br from-[#18181B] via-[#242428] to-[#18181B] text-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-[#D4AF37]/50 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-[#D4AF37]" />
                          <span className="text-xs text-[#D4AF37] font-black uppercase tracking-wider">
                            کارت باشگاه وفاداری پوشاک من و تو
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-white">
                          سطح عضویت: همکار ویژهٔ طلایی
                        </h4>
                        <p className="text-xs text-stone-300">
                          اعتبار هدیه ریالی شما به‌صورت خودکار در تسویه‌حساب فاکتورهای بعدی قابل استفاده است.
                        </p>
                      </div>

                      <div className="bg-[#202024]/90 p-4 rounded-2xl border border-[#3F3F46] text-center shrink-0">
                        <span className="text-xs text-stone-400 block font-bold">موجودی کیف پول شما</span>
                        <span className="text-xl font-black text-[#D4AF37] block mt-1 font-mono">
                          {walletBalanceToman.toLocaleString('fa-IR')} <span className="text-xs font-normal text-stone-300">تومان</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Perks List */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 bg-white rounded-2xl border border-[#DDD5C0] space-y-1 text-xs">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="font-black text-stone-900 block text-xs">ارسال سریع روزانه</span>
                      <p className="text-stone-500 text-[11px]">اولویت در بسته‌بندی انبار و صدور همان‌روز بارنامه</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-[#DDD5C0] space-y-1 text-xs">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#8C6D37] flex items-center justify-center font-bold mb-2">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span className="font-black text-stone-900 block text-xs">تخفیف پک‌های ۵ تایی</span>
                      <p className="text-stone-500 text-[11px]">محاسبهٔ خودکار قیمت کارگاهی روی خریدهای عمده</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-[#DDD5C0] space-y-1 text-xs">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-2">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="font-black text-stone-900 block text-xs">ضمانت اصالت دوخت</span>
                      <p className="text-stone-500 text-[11px]">تضمین کیفیت پارچه کرپ، لینن و کتان لایت</p>
                    </div>
                  </div>

                </div>
              )}

              {/* ---------- 5. PROFILE & ADDRESS TAB ---------- */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="bg-white p-5 sm:p-6 rounded-3xl border border-[#DDD5C0] shadow-xs space-y-4 text-xs animate-fadeIn">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#8C6D37]" />
                      <h4 className="font-black text-stone-900 text-sm">
                        مشخصات حساب کاربری و اطلاعات باربری
                      </h4>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      این اطلاعات روی بارنامهٔ رسمی چاپ خواهد شد
                    </span>
                  </div>

                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold">مشخصات شما با موفقیت ذخیره و بروزرسانی شد.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">نام و نام خانوادگی تحویل‌گیرنده:</label>
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2] text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">شماره موبایل اصلی (پیامک بیجک):</label>
                      <input
                        type="tel"
                        dir="ltr"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 font-mono bg-[#FAF7F2] text-xs text-right"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">تلفن ثابت (مغازه / دفتر):</label>
                      <input
                        type="tel"
                        dir="ltr"
                        value={profileForm.landlinePhone}
                        onChange={(e) => setProfileForm({ ...profileForm, landlinePhone: e.target.value })}
                        placeholder="مثال: 02155667788"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 font-mono bg-[#FAF7F2] text-xs text-right"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">شماره تماس دوم / پشتیبان:</label>
                      <input
                        type="tel"
                        dir="ltr"
                        value={profileForm.alternativePhone}
                        onChange={(e) => setProfileForm({ ...profileForm, alternativePhone: e.target.value })}
                        placeholder="مثال: 09351234567"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 font-mono bg-[#FAF7F2] text-xs text-right"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">نام فروشگاه / بنکداری:</label>
                      <input
                        type="text"
                        value={profileForm.storeName}
                        onChange={(e) => setProfileForm({ ...profileForm, storeName: e.target.value })}
                        placeholder="مثال: پوشاک شیک‌پوشان"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2] text-xs"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-stone-700">کلمه عبور ورود به حساب:</label>
                        <button
                          type="button"
                          onClick={() => setShowProfilePassword(!showProfilePassword)}
                          className="text-[10px] text-stone-500 hover:text-stone-800 cursor-pointer"
                        >
                          {showProfilePassword ? 'مخفی کردن' : 'نمایش'}
                        </button>
                      </div>
                      <input
                        type={showProfilePassword ? 'text' : 'password'}
                        dir="ltr"
                        value={profileForm.password}
                        onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 font-mono bg-[#FAF7F2] text-xs text-right"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">استان مقصد:</label>
                      <input
                        type="text"
                        value={profileForm.province}
                        onChange={(e) => setProfileForm({ ...profileForm, province: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2] text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">شهر مقصد باربری:</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2] text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-stone-700 block mb-1">نشانی دقیق پستی / دفتر باربری تحویل‌گیرنده:</label>
                      <textarea
                        rows={2}
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 resize-none bg-[#FAF7F2] text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] rounded-xl font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      ذخیره تغییرات مشخصات
                    </button>
                  </div>
                </form>
              )}

            </div>
          </>
        ) : (
          /* ===================== GUEST / WELCOME HUB (Not Logged In) ===================== */
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-[#FAF7F2] animate-fadeIn">
            
            {/* Quick Demo Preview Spotlight */}
            <div className="bg-gradient-to-br from-[#18181B] to-[#27272A] text-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-[#D4AF37]/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#18181B] font-black text-[10.5px]">
                    پیشخوان اختصاصی من و تو
                  </span>
                  <span className="text-xs text-amber-200">داشبورد هوشمند خریداران</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white">
                  دسترسی به فاکتورهای رسمی، پیگیری بیجک‌های باربری و کیف پول اعتباری
                </h4>
                <p className="text-xs text-stone-300">
                  جهت مشاهدهٔ مستقیم تمام بخش‌های داشبورد، می‌توانید از دکمهٔ «ورود سریع آزمایشی» استفاده فرمایید.
                </p>
              </div>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="py-2.5 px-5 bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] text-[#18181B] font-black text-xs rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>ورود آزمایشی خریدار نمونه</span>
              </button>
            </div>

            {/* Auth Forms Box (Login / Register) */}
            <div className="bg-white rounded-3xl border border-[#DDD5C0] shadow-xs overflow-hidden max-w-xl mx-auto">
              
              {/* Tab Selector */}
              <div className="grid grid-cols-2 border-b border-[#E6DEC8] text-center font-bold text-xs bg-[#FAF8F5]">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-3.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-stone-900 border-b-2 border-[#18181B] font-black'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <LogIn className="w-4 h-4 text-[#8C6D37]" />
                  <span>ورود به حساب</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-3.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-stone-900 border-b-2 border-[#18181B] font-black'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-[#8C6D37]" />
                  <span>ثبت‌نام خریدار جدید</span>
                </button>
              </div>

              <div className="p-5 sm:p-6">
                {authMode === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                    {loginError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">شماره موبایل:</label>
                      <input
                        type="tel"
                        dir="ltr"
                        placeholder="09123456789"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-right bg-[#FAF7F2]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">رمز عبور:</label>
                      <input
                        type="password"
                        dir="ltr"
                        placeholder="رمز عبور حساب"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-right bg-[#FAF7F2]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white font-black text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      ورود به پیشخوان کاربری
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                    {regError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">نام و نام خانوادگی:</label>
                        <input
                          type="text"
                          placeholder="مثال: زهرا مرادی"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] text-xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">شماره موبایل:</label>
                        <input
                          type="tel"
                          dir="ltr"
                          placeholder="09123456789"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-right bg-[#FAF7F2]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">نام فروشگاه (اختیاری):</label>
                        <input
                          type="text"
                          placeholder="مثال: فروشگاه تندیس"
                          value={regStoreName}
                          onChange={(e) => setRegStoreName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] text-xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">رمز عبور دلخواه:</label>
                        <input
                          type="password"
                          dir="ltr"
                          placeholder="حداقل ۴ کاراکتر"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-right bg-[#FAF7F2]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">استان:</label>
                        <input
                          type="text"
                          value={regProvince}
                          onChange={(e) => setRegProvince(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] text-xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">شهر مقصد:</label>
                        <input
                          type="text"
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] text-xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-stone-700 block mb-1">آدرس پستی جهت ارسال بار:</label>
                        <textarea
                          rows={2}
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          placeholder="آدرس دقیق فروشگاه یا منزل جهت هماهنگی با باربری..."
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] resize-none text-xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white font-black text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      تکمیل ثبت‌نام و ورود به پیشخوان
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ===================== FORMAL INVOICE MODAL ===================== */}
      {printingOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn" dir="rtl">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setPrintingOrder(null)}
              className="absolute top-4 left-4 p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <FormalInvoicePrintSheet order={printingOrder} />
          </div>
        </div>
      )}

    </div>
  );
};
