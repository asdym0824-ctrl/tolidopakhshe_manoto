import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Eye, 
  MessageSquare, 
  Send, 
  Tag, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Truck, 
  Package, 
  UserPlus, 
  ChevronLeft, 
  FileText, 
  Heart, 
  Award, 
  TrendingUp, 
  Share2, 
  ExternalLink,
  Percent,
  Sparkles,
  ShoppingBasket,
  Receipt,
  Calendar,
  DollarSign,
  Boxes,
  CheckCircle2,
  X,
  Copy,
  Check,
  Building2,
  Printer,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { CustomerUser, StorefrontOrder, Customer } from '../types';

interface RetailCustomersModuleProps {
  customerUsers: CustomerUser[];
  orders: StorefrontOrder[];
  wholesaleCustomers?: Customer[];
  onAddRetailCustomer?: (user: CustomerUser) => void;
  onUpdateRetailCustomer?: (user: CustomerUser) => void;
  onOpenOrderDetails?: (order: StorefrontOrder) => void;
}

export const RetailCustomersModule: React.FC<RetailCustomersModuleProps> = ({
  customerUsers,
  orders,
  wholesaleCustomers = [],
  onAddRetailCustomer,
  onUpdateRetailCustomer,
  onOpenOrderDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'all_retail' | 'retail_orders' | 'loyalty_club' | 'sms_marketing'>('all_retail');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all'); // all, with_orders, high_value
  
  // Fullscreen Table Mode
  const [isTableFullscreen, setIsTableFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsTableFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isTableFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTableFullscreen]);

  // Selected Customer for Detailed Profile
  const [selectedUser, setSelectedUser] = useState<CustomerUser | null>(null);

  // Quick SMS / Promo message modal
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTargetUser, setMessageTargetUser] = useState<CustomerUser | null>(null);
  const [promoMessageText, setPromoMessageText] = useState('');
  const [selectedPresetPromo, setSelectedPresetPromo] = useState('discount');

  // Add new retail customer manual modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRetailForm, setNewRetailForm] = useState({
    fullName: '',
    phone: '',
    province: 'تهران',
    city: 'تهران',
    address: '',
    postalCode: '',
    notes: '',
  });

  // Calculate detailed stats for each retail customer from orders
  const enrichedRetailUsers = customerUsers.map(user => {
    const userOrders = orders.filter(o => 
      o.customer.phone === user.phone || 
      (user.phone && o.customer.phone && o.customer.phone.endsWith(user.phone.slice(-8)))
    );

    const totalSpent = userOrders.reduce((sum, o) => sum + (o.finalAmountToman || 0), 0);
    const retailOrdersCount = userOrders.filter(o => o.items.some(it => it.mode === 'retail_single')).length;
    const lastOrder = userOrders.length > 0 ? userOrders[0] : null;

    // Customer tier in retail loyalty club
    let loyaltyTier: 'برنزی' | 'نقره‌ای' | 'طلایی VIP' = 'برنزی';
    if (totalSpent >= 3000000 || userOrders.length >= 5) {
      loyaltyTier = 'طلایی VIP';
    } else if (totalSpent >= 1000000 || userOrders.length >= 2) {
      loyaltyTier = 'نقره‌ای';
    }

    return {
      ...user,
      computedOrders: userOrders,
      totalSpent,
      ordersCount: userOrders.length,
      retailOrdersCount,
      lastOrderDate: lastOrder ? lastOrder.createdAt : 'بدون خرید',
      loyaltyTier,
    };
  });

  // Filtered List
  const filteredUsers = enrichedRetailUsers.filter(u => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.address && u.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = cityFilter === 'all' || u.city === cityFilter || u.province === cityFilter;

    const matchesOrderFilter = 
      orderFilter === 'all' ? true :
      orderFilter === 'with_orders' ? u.ordersCount > 0 :
      orderFilter === 'high_value' ? u.totalSpent >= 1000000 :
      orderFilter === 'vip' ? u.loyaltyTier === 'طلایی VIP' : true;

    return matchesSearch && matchesCity && matchesOrderFilter;
  });

  // Unique cities list for filtering
  const allCities = Array.from(new Set(customerUsers.map(u => u.city).filter(Boolean)));

  // Total Retail Stats
  const totalRetailCustomersCount = enrichedRetailUsers.length;
  const totalRetailOrders = orders.filter(o => o.items.some(it => it.mode === 'retail_single'));
  const totalRetailRevenue = totalRetailOrders.reduce((sum, o) => sum + (o.finalAmountToman || 0), 0);
  const vipCount = enrichedRetailUsers.filter(u => u.loyaltyTier === 'طلایی VIP').length;

  // Open Message Modal with predefined templates
  const handleOpenSendMessage = (user: CustomerUser) => {
    setMessageTargetUser(user);
    const msg = `سلام و احترام سرکار خانم/جناب آقای ${user.fullName} عزیز 🌸
از همراهی شما با پوشاک زنانه من و تو (بازار بزرگ تهران) سپاسگزاریم.

🎁 کد تخفیف اختصاصی ۱۰ درصدی خرید جدید شما:
کد: MANOTO-TAK10

مشاهده جدیدترین شلوارهای تنخور ژورنالی (بگ، کارگو و لگ گنی):
https://t.me/manoto_pants
پشتیبانی: 09123456789`;
    setPromoMessageText(msg);
    setIsMessageModalOpen(true);
  };

  const handleApplyPresetPromo = (type: string) => {
    if (!messageTargetUser) return;
    setSelectedPresetPromo(type);
    if (type === 'discount') {
      setPromoMessageText(`سلام ${messageTargetUser.fullName} عزیز 🌸
🎁 هدیه ویژه خرید تکی شما از پوشاک من و تو بازار تهران:
کد تخفیف ۱۰ درصدی: MANOTO-TAK10
ارسال رایگان به مقصد ${messageTargetUser.city} برای خریدهای بالای ۵۰۰ هزار تومان!
ثبت در سایت و تلگرام: 09123456789`);
    } else if (type === 'new_collection') {
      setPromoMessageText(`سلام ${messageTargetUser.fullName} گرامی ✨
کالکشن جدید شلوارهای کتان لایت و بگ ژورنالی تابستانه در سایت شارژ شد!
تنخور شیک و کیفیت ضمانتی بدون آبرفت.
مشاهده و سفارش آنلاین با ارسال فوری.`);
    } else if (type === 'survey') {
      setPromoMessageText(`سلام و درود ${messageTargetUser.fullName} عزیز 🌸
امیدواریم از کیفیت سفارش شلوار زنانه رضایت کامل داشته باشید.
نظر شما برای کارگاه تولیدی ما بسیار ارزشمند است. با ارسال نظر در پیوی از ۱۰٪ تخفیف خرید بعدی بهره‌مند شوید.`);
    }
  };

  const handleSaveNewRetailCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: CustomerUser = {
      id: `usr-ret-${Date.now()}`,
      fullName: newRetailForm.fullName,
      phone: newRetailForm.phone,
      province: newRetailForm.province,
      city: newRetailForm.city,
      address: newRetailForm.address,
      postalCode: newRetailForm.postalCode,
      isPartnerWholesale: false,
      registeredAt: 'امروز (ثبت دستی)',
      totalOrdersCount: 0,
      totalSpentToman: 0,
    };

    if (onAddRetailCustomer) {
      onAddRetailCustomer(newUser);
    }
    setIsAddModalOpen(false);
    setNewRetailForm({
      fullName: '',
      phone: '',
      province: 'تهران',
      city: 'تهران',
      address: '',
      postalCode: '',
      notes: '',
    });
  };

  return (
    <div id="retail-customers-module" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#18181B] text-[#D4AF37] border border-[#DDD5C0] flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#18181B]">
                  مدیریت مشتریان تک‌فروشی و خریداران سایت
                </h2>
                <span className="bg-amber-100 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
                  مشتریان تکی و نهایی
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                تفکیک کامل از عمده‌فروشان، ثبت شماره و آدرس، باشگاه مشتریان، سابقه خریدهای تکی و ارسال پیامک تخفیف
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-open-add-retail-modal"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#3F3F46]"
            >
              <UserPlus className="w-4 h-4 text-[#D4AF37]" />
              <span>+ ثبت مشتری تکی جدید</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5 pt-5 border-t border-[#E6DEC8]">
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#DDD5C0]">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-1">
              <span>تعداد کل خریداران تکی</span>
              <Users className="w-4 h-4 text-[#8C6D37]" />
            </div>
            <div className="text-xl font-black text-[#18181B]">
              {totalRetailCustomersCount.toLocaleString('fa-IR')} <span className="text-xs font-normal text-stone-500">نفر</span>
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">ثبت شده در وب‌سایت و فروشگاه</span>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#DDD5C0]">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-1">
              <span>تعداد سفارشات تکی</span>
              <ShoppingBasket className="w-4 h-4 text-[#8C6D37]" />
            </div>
            <div className="text-xl font-black text-emerald-800">
              {totalRetailOrders.length.toLocaleString('fa-IR')} <span className="text-xs font-normal text-stone-500">فاکتور</span>
            </div>
            <span className="text-[10px] text-emerald-700 mt-1 block">ارسال شده با تیپاکس و پست</span>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#DDD5C0]">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-1">
              <span>گردش مالی تک‌فروشی</span>
              <CreditCard className="w-4 h-4 text-[#8C6D37]" />
            </div>
            <div className="text-xl font-black text-[#18181B]">
              {totalRetailRevenue.toLocaleString('fa-IR')} <span className="text-xs font-normal text-stone-500">تومان</span>
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">سود نقدی مستقیم حاصل از سایت</span>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#DDD5C0]">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-1">
              <span>اعضای باشگاه طلایی VIP</span>
              <Award className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-xl font-black text-[#8C6D37]">
              {vipCount.toLocaleString('fa-IR')} <span className="text-xs font-normal text-stone-500">مشتری دائم</span>
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">خریداران بالای ۱ میلیون یا پرتکرار</span>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#E6DEC8] text-xs">
          <button
            onClick={() => setActiveTab('all_retail')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'all_retail'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>لیست همه مشتریان تکی ({filteredUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('retail_orders')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'retail_orders'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>سفارشات تک‌فروشی آنلاین ({totalRetailOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty_club')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'loyalty_club'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>باشگاه مشتریان و سطح‌بندی وفاداری</span>
          </button>

          <button
            onClick={() => setActiveTab('sms_marketing')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sms_marketing'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Send className="w-4 h-4 text-[#D4AF37]" />
            <span>پیامک تبلیغاتی و کد تخفیف تکی</span>
          </button>
        </div>
      </div>

      {/* TAB 1: All Retail Customers List */}
      {activeTab === 'all_retail' && (() => {
        const filteredUsersTotalSpent = filteredUsers.reduce((s, u) => s + u.totalSpent, 0);
        const filteredUsersTotalOrders = filteredUsers.reduce((s, u) => s + u.ordersCount, 0);
        const filteredVipCount = filteredUsers.filter(u => u.loyaltyTier === 'طلایی VIP').length;

        return (
          <div className={`transition-all duration-200 ${
            isTableFullscreen
              ? 'fixed inset-0 z-50 bg-[#FAF8F5] p-3 sm:p-6 overflow-y-auto space-y-4 shadow-2xl'
              : 'bg-white rounded-3xl border border-[#DFD7C2] shadow-sm overflow-hidden space-y-4 p-4 sm:p-5'
          }`}>
            {/* Fullscreen Notice Banner */}
            {isTableFullscreen && (
              <div className="bg-[#18181B] text-[#FAF8F5] px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-medium border border-[#D4AF37]/30 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-[#D4AF37]">حالت تمام‌صفحه دفتر خریداران تک‌فروشی فعال است</span>
                  <span className="text-stone-400 hidden sm:inline">| برای خروج کلید Esc کیبورد یا دکمه کوچک‌نمایی را بزنید</span>
                </div>
                <button
                  onClick={() => setIsTableFullscreen(false)}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white flex items-center gap-1.5 transition-colors font-bold text-xs"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>خروج از تمام‌صفحه</span>
                </button>
              </div>
            )}

            {/* Module Header Inside Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE9DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                    <span>دفتر جامع خریداران تک‌فروشی آنلاین و سایت</span>
                    <span className="text-[11px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-full font-mono">
                      {customerUsers.length.toLocaleString('fa-IR')} خریدار کل
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    پایش سوابق خریداران تکی شلوار، سطح وفاداری، نشانی‌های پستی و پیامک‌های آفر تخفیف
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {/* Fullscreen Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsTableFullscreen(!isTableFullscreen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isTableFullscreen
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 shadow-sm'
                      : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0] hover:bg-[#F2ECE1] hover:text-stone-900'
                  }`}
                  title={isTableFullscreen ? 'خروج از حالت تمام‌صفحه (Esc)' : 'بزرگنمایی جدول به تمام‌صفحه'}
                >
                  {isTableFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>کوچک‌نمایی</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>تمام‌صفحه</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 hover:from-black hover:to-stone-900 text-[#FAF7F2] text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#D4AF37]/50 cursor-pointer active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>+ ثبت خریدار جدید</span>
                </button>
              </div>
            </div>

            {/* Live Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-2xs">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">خریداران این نما</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {filteredUsers.length.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">نفر</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">مجموع خرید تک‌فروشی</span>
                  <span className="text-sm sm:text-base font-black text-emerald-950 block truncate font-mono">
                    {filteredUsersTotalSpent.toLocaleString('fa-IR')} <span className="text-xs font-bold text-emerald-700">تومان</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8C6D37]/15 text-[#8C6D37] flex items-center justify-center shrink-0 shadow-2xs">
                  <ShoppingBag className="w-5 h-5 text-[#8C6D37]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">تعداد فاکتورهای ثبت‌شده</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {filteredUsersTotalOrders.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">سفارش</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                  <Award className="w-5 h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">خریداران VIP طلایی</span>
                  <span className="text-xs sm:text-sm font-bold text-stone-800 block truncate font-mono">
                    {filteredVipCount.toLocaleString('fa-IR')} مشتری وفادار
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Pills & Search Input */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-[#FAF7F2] text-xs py-2 px-3 rounded-xl border border-[#DDD5C0] text-stone-800 outline-none font-bold cursor-pointer"
                >
                  <option value="all">همه شهرها و استان‌ها ({allCities.length})</option>
                  {allCities.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="bg-[#FAF7F2] text-xs py-2 px-3 rounded-xl border border-[#DDD5C0] text-stone-800 outline-none font-bold cursor-pointer"
                >
                  <option value="all">همه وضعیت‌های خرید</option>
                  <option value="with_orders">دارای سابقه خرید (ثبت شده)</option>
                  <option value="high_value">خرید بالای ۱ میلیون تومان</option>
                  <option value="vip">مشتریان VIP طلایی</option>
                </select>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام مشتری، موبایل، شهر یا نشانی..."
                  className="w-full bg-[#FAF7F2] text-xs pr-10 pl-8 py-2 rounded-xl border border-[#DDD5C0] text-stone-900 outline-none focus:bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                    title="پاک کردن جستجو"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Master Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#E6DEC8] shadow-2xs">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-stone-100 border-b-2 border-[#D4AF37]">
                  <tr>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>نام و مشخصات خریدار</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>شماره تماس</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>استان، شهر و نشانی پستی</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>سطح باشگاه</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>تعداد سفارشات</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>مجموع پرداختی</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>آخرین سفارش</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                      <span>اقدامات</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DC]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] flex items-center justify-center text-stone-400 mb-3 shadow-2xs">
                            <Search className="w-6 h-6 text-stone-400" />
                          </div>
                          <h4 className="text-sm font-extrabold text-stone-900">هیچ خریدار تکی‌ای یافت نشد</h4>
                          <p className="text-xs text-stone-500 mt-1">
                            با فیلتر انتخابی یا عبارت جستجوی «{searchQuery}» موردی ثبت نشده است.
                          </p>
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setCityFilter('all');
                              setOrderFilter('all');
                            }}
                            className="mt-3.5 px-4 py-1.5 bg-[#18181B] text-[#FAF7F2] hover:bg-stone-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            مشاهده همه خریداران
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80"
                      >
                        {/* Column 1: Name */}
                        <td className="p-3.5 align-middle">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] font-black text-xs flex items-center justify-center shadow-2xs shrink-0">
                              {user.fullName ? user.fullName.charAt(0) : 'ک'}
                            </div>
                            <div>
                              <span 
                                onClick={() => setSelectedUser(user)}
                                className="font-extrabold text-stone-900 hover:text-[#8C6D37] cursor-pointer block text-xs sm:text-sm transition-colors"
                              >
                                {user.fullName}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                                عضویت: {user.registeredAt}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Phone */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="font-mono font-bold text-stone-800 text-xs dir-ltr text-right block">
                            {user.phone}
                          </span>
                        </td>

                        {/* Column 3: Location */}
                        <td className="p-3.5 align-middle max-w-[200px]">
                          <div className="flex items-center gap-1 text-stone-900 font-bold text-xs">
                            <MapPin className="w-3.5 h-3.5 text-[#8C6D37] shrink-0" />
                            <span>{user.province} - {user.city}</span>
                          </div>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5" title={user.address}>
                            {user.address || 'نشانی ثبت نشده'}
                          </p>
                        </td>

                        {/* Column 4: Loyalty Tier */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 border shadow-2xs ${
                            user.loyaltyTier === 'طلایی VIP' ? 'bg-amber-100 text-amber-950 border-amber-300' :
                            user.loyaltyTier === 'نقره‌ای' ? 'bg-stone-100 text-stone-800 border-stone-300' :
                            'bg-[#FAF7F2] text-[#8C6D37] border-[#DDD5C0]'
                          }`}>
                            <Award className="w-3.5 h-3.5 text-[#8C6D37]" />
                            <span>{user.loyaltyTier}</span>
                          </span>
                        </td>

                        {/* Column 5: Orders count */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="bg-stone-100 text-stone-900 border border-stone-300 font-bold px-2.5 py-1 rounded-lg font-mono text-xs">
                            {user.ordersCount.toLocaleString('fa-IR')} سفارش
                          </span>
                        </td>

                        {/* Column 6: Total Spent */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="text-sm font-black text-emerald-950 font-sans">
                            {user.totalSpent.toLocaleString('fa-IR')}{' '}
                            <span className="text-xs font-bold text-emerald-700">تومان</span>
                          </div>
                        </td>

                        {/* Column 7: Last Order Date */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="text-xs text-stone-600 font-mono">
                            {user.lastOrderDate}
                          </span>
                        </td>

                        {/* Column 8: Actions */}
                        <td className="p-3.5 align-middle text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenSendMessage(user)}
                              className="px-2.5 py-1.5 bg-[#FAF7F2] text-[#8C6D37] hover:bg-[#E6DEC8] rounded-xl transition-all border border-[#DDD5C0] font-bold text-xs cursor-pointer shadow-2xs flex items-center gap-1"
                              title="ارسال پیامک / کد تخفیف"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#8C6D37]" />
                              <span>پیامک آفر</span>
                            </button>
                            
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-1.5 bg-[#FAF7F2] text-stone-700 hover:text-stone-900 hover:bg-[#E6DEC8] rounded-xl transition-all border border-[#DDD5C0] shadow-2xs cursor-pointer"
                              title="مشاهده پرونده خرید"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Bottom Summary Strip */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-stone-800">
                  نمایش {filteredUsers.length.toLocaleString('fa-IR')} از {customerUsers.length.toLocaleString('fa-IR')} خریدار تکی
                </span>
                <span className="text-stone-300 hidden sm:inline">|</span>
                <span>
                  مجموع فاکتورهای تکی: <strong className="text-stone-900 font-mono">{filteredUsersTotalOrders.toLocaleString('fa-IR')}</strong> سفارش
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-medium">مجموع گردش کل تک‌فروشی:</span>
                <span className="text-sm font-black text-stone-950 font-sans bg-white px-3 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs">
                  {filteredUsersTotalSpent.toLocaleString('fa-IR')} <span className="text-xs font-bold text-[#8C6D37]">تومان</span>
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 2: Retail Orders Master Table */}
      {activeTab === 'retail_orders' && (() => {
        const totalAmountOrders = totalRetailOrders.reduce((s, o) => s + (o.finalAmountToman || 0), 0);
        const deliveredOrdersCount = totalRetailOrders.filter(o => o.orderStatus === 'delivered').length;
        const sentOrdersCount = totalRetailOrders.filter(o => o.orderStatus === 'sent_to_carrier').length;

        return (
          <div className={`transition-all duration-200 ${
            isTableFullscreen
              ? 'fixed inset-0 z-50 bg-[#FAF8F5] p-3 sm:p-6 overflow-y-auto space-y-4 shadow-2xl'
              : 'bg-white rounded-3xl border border-[#DFD7C2] shadow-sm overflow-hidden space-y-4 p-4 sm:p-5'
          }`}>
            {/* Fullscreen Notice Banner */}
            {isTableFullscreen && (
              <div className="bg-[#18181B] text-[#FAF8F5] px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-medium border border-[#D4AF37]/30 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-[#D4AF37]">حالت تمام‌صفحه کاردکس سفارشات تک‌فروشی فعال است</span>
                  <span className="text-stone-400 hidden sm:inline">| برای خروج کلید Esc کیبورد یا دکمه کوچک‌نمایی را بزنید</span>
                </div>
                <button
                  onClick={() => setIsTableFullscreen(false)}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white flex items-center gap-1.5 transition-colors font-bold text-xs"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>خروج از تمام‌صفحه</span>
                </button>
              </div>
            )}

            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE9DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Receipt className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                    <span>دفتر کاردکس سفارشات و فاکتورهای تک‌فروشی آنلاین</span>
                    <span className="text-[11px] font-bold bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2 py-0.5 rounded-full font-mono">
                      {totalRetailOrders.length.toLocaleString('fa-IR')} فاکتور تکی
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    لیست خریدهای آنلاین مصرف‌کنندگان نهایی از فروشگاه اینترنتی با صدور بارنامه پستی و تیپاکس
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {/* Fullscreen Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsTableFullscreen(!isTableFullscreen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    isTableFullscreen
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 shadow-sm'
                      : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0] hover:bg-[#F2ECE1] hover:text-stone-900'
                  }`}
                  title={isTableFullscreen ? 'خروج از حالت تمام‌صفحه (Esc)' : 'بزرگنمایی جدول به تمام‌صفحه'}
                >
                  {isTableFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>کوچک‌نمایی</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>تمام‌صفحه</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-2xs">
                  <Receipt className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">فاکتورهای صادر شده</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {totalRetailOrders.length.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">فقره</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">مجموع فروش آنلاین</span>
                  <span className="text-sm sm:text-base font-black text-emerald-950 block truncate font-mono">
                    {totalAmountOrders.toLocaleString('fa-IR')} <span className="text-xs font-bold text-emerald-700">تومان</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8C6D37]/15 text-[#8C6D37] flex items-center justify-center shrink-0 shadow-2xs">
                  <Truck className="w-5 h-5 text-[#8C6D37]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">ارسال با پست و تیپاکس</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block font-mono">
                    {sentOrdersCount.toLocaleString('fa-IR')} <span className="text-xs font-normal font-sans text-stone-600">مرسوله</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-500 block truncate">تحویل کامل به خریدار</span>
                  <span className="text-xs sm:text-sm font-bold text-stone-800 block truncate font-mono">
                    {deliveredOrdersCount.toLocaleString('fa-IR')} تحویل نهایی
                  </span>
                </div>
              </div>
            </div>

            {/* Master Table of Retail Orders */}
            <div className="overflow-x-auto rounded-2xl border border-[#E6DEC8] shadow-2xs">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-stone-100 border-b-2 border-[#D4AF37]">
                  <tr>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Receipt className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>شماره سفارش و تاریخ</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>نام خریدار و تماس</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Boxes className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>اقلام سفارش و البسه</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>مبلغ کل فاکتور</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>روش ارسال و رهگیری</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-stone-300 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>وضعیت سفارش</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center text-stone-300 font-bold whitespace-nowrap">
                      <span>مشاهده فاکتور</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DC]">
                  {totalRetailOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] flex items-center justify-center text-stone-400 mb-3 shadow-2xs">
                            <ShoppingBag className="w-6 h-6 text-stone-400" />
                          </div>
                          <h4 className="text-sm font-extrabold text-stone-900">هیچ سفارش آنلاینی یافت نشد</h4>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    totalRetailOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-[#F5EFE4]/90 transition-colors group odd:bg-white even:bg-[#FAF8F5]/80"
                      >
                        {/* Column 1: Order # & Date */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm block">
                            #{order.orderNumber}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                            {order.createdAt}
                          </span>
                        </td>

                        {/* Column 2: Customer & Phone */}
                        <td className="p-3.5 align-middle">
                          <strong className="font-extrabold text-stone-900 block text-xs sm:text-sm">
                            {order.customer.fullName}
                          </strong>
                          <span className="font-mono text-[11px] text-stone-500 block mt-0.5 dir-ltr text-right">
                            {order.customer.phone}
                          </span>
                        </td>

                        {/* Column 3: Items */}
                        <td className="p-3.5 align-middle">
                          <div className="space-y-1.5">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <img 
                                  src={it.product.image} 
                                  alt={it.product.name} 
                                  className="w-8 h-8 object-cover rounded-lg border border-stone-200 shrink-0" 
                                  referrerPolicy="no-referrer" 
                                />
                                <div>
                                  <span className="font-bold text-stone-900 text-xs block">
                                    {it.product.name}
                                  </span>
                                  <span className="text-[10px] text-stone-500 block">
                                    {it.quantity} عدد تکی ({it.totalPriceToman.toLocaleString('fa-IR')} ت)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Column 4: Total Amount */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="text-sm font-black text-emerald-950 font-sans">
                            {order.finalAmountToman.toLocaleString('fa-IR')}{' '}
                            <span className="text-xs font-bold text-emerald-700">تومان</span>
                          </div>
                        </td>

                        {/* Column 5: Shipping & Tracking */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-stone-800 text-xs">
                            <Truck className="w-3.5 h-3.5 text-[#8C6D37]" />
                            <span>{order.shippingMethodTitle}</span>
                          </div>
                          {order.waybillNumber ? (
                            <span className="text-[10px] bg-[#FAF7F2] border border-[#DDD5C0] px-2 py-0.5 rounded font-mono font-bold text-stone-700 block mt-1">
                              کد رهگیری: {order.waybillNumber}
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 block mt-1">
                              بدون کد رهگیری
                            </span>
                          )}
                        </td>

                        {/* Column 6: Order Status */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 border shadow-2xs ${
                            order.orderStatus === 'delivered'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                              : order.orderStatus === 'sent_to_carrier'
                              ? 'bg-sky-50 text-sky-900 border-sky-200'
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              order.orderStatus === 'delivered' || order.orderStatus === 'sent_to_carrier' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                            }`}></span>
                            <span>
                              {order.orderStatus === 'delivered'
                                ? 'تحویل شد'
                                : order.orderStatus === 'sent_to_carrier'
                                ? 'ارسال با تیپاکس/پست'
                                : 'آماده‌سازی در کارگاه'}
                            </span>
                          </span>
                        </td>

                        {/* Column 7: Actions */}
                        <td className="p-3.5 align-middle text-center whitespace-nowrap">
                          <button
                            onClick={() => onOpenOrderDetails?.(order)}
                            className="px-3 py-1.5 bg-gradient-to-r from-stone-900 to-[#18181B] hover:from-black hover:to-stone-900 text-[#FAF7F2] rounded-xl transition-all flex items-center gap-1.5 border border-[#D4AF37]/60 hover:border-[#D4AF37] font-bold text-xs cursor-pointer shadow-xs mx-auto active:scale-95"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>مشاهده فاکتور</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Bottom Summary Strip */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-stone-800">
                  تعداد کل سفارشات آنلاین: {totalRetailOrders.length.toLocaleString('fa-IR')} فقره
                </span>
                <span className="text-stone-300 hidden sm:inline">|</span>
                <span>
                  تحویل شده: <strong className="text-emerald-800 font-mono">{deliveredOrdersCount.toLocaleString('fa-IR')}</strong> سفارش
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-medium">مجموع ارزش سفارشات:</span>
                <span className="text-sm font-black text-stone-950 font-sans bg-white px-3 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs">
                  {totalAmountOrders.toLocaleString('fa-IR')} <span className="text-xs font-bold text-[#8C6D37]">تومان</span>
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 3: Loyalty Club & Retention */}
      {activeTab === 'loyalty_club' && (
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E6DEC8]">
              <div className="p-2.5 bg-[#FAF7F2] text-[#D4AF37] rounded-2xl border border-[#DDD5C0]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#18181B]">
                  باشگاه مشتریان و سطح‌بندی وفاداری خریداران تکی
                </h3>
                <p className="text-xs text-stone-500">
                  سیستم خودکار دسته‌بندی مشتریان تکی برای حفظ تعامل، ارسال آفر تولد و تخفیف‌های هدفمند
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Bronze Tier */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DDD5C0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-stone-800 text-sm">سطح ۱: برنزی (خرید اول)</span>
                  <span className="text-xs bg-white px-2 py-0.5 rounded-lg border font-bold text-stone-600">
                    {enrichedRetailUsers.filter(u => u.loyaltyTier === 'برنزی').length} کاربر
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  مشتریانی که ۱ بار از سایت شلوار خریده‌اند. آفر پیشنهادی: ارسال کد تخفیف ۵ درصدی خرید بعدی برای ترغیب به بازگشت.
                </p>
              </div>

              {/* Silver Tier */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DDD5C0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-stone-800 text-sm">سطح ۲: نقره‌ای (خریدار مستمر)</span>
                  <span className="text-xs bg-white px-2 py-0.5 rounded-lg border font-bold text-stone-600">
                    {enrichedRetailUsers.filter(u => u.loyaltyTier === 'نقره‌ای').length} کاربر
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  مشتریانی با حداقل ۲ خرید یا مجموع خرید بالای ۱ میلیون تومان. آفر پیشنهادی: ارسال رایگان با تیپاکس و پست پیشتاز.
                </p>
              </div>

              {/* Gold VIP Tier */}
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-950 text-sm">سطح ۳: طلایی VIP</span>
                  <span className="text-xs bg-amber-200 text-amber-950 px-2 py-0.5 rounded-lg font-black">
                    {vipCount} کاربر VIP
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  مشتریان وفادار پرخرید با بیش از ۳ میلیون تومان خرید تکی. آفر: هدیه سالانه، تخفیف ۱۵ درصدی همیشگی و اولویت در شارژ مدل‌های ترند.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SMS & Messaging Automation */}
      {activeTab === 'sms_marketing' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E6DEC8]">
            <div className="p-2.5 bg-[#FAF7F2] text-[#8C6D37] rounded-2xl border border-[#DDD5C0]">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#18181B]">
                ارسال پیامک و آفر اختصاصی برای مشتریان تکی
              </h3>
              <p className="text-xs text-stone-500">
                ارسال خودکار جشنواره‌های تخفیف، رونمایی مدل‌های فصلی و اطلاع‌رسانی به خریداران تکی
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-800">
                قالب‌های آماده پیامک تک‌فروشی:
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setPromoMessageText(`پوشاک من و تو بازار تهران 🌸
کالکشن جدید شلوارهای کتان و کارگو تابستانه شارژ شد!
۱۰٪ تخفیف اختصاصی خریداران سایت:
کد: MANOTO-SUMMER
مشاهده و سفارش آنلاین با ارسال فوری.`);
                  }}
                  className="w-full text-right p-3 bg-[#FAF7F2] hover:bg-stone-100 rounded-xl border border-[#DDD5C0] text-xs font-bold text-stone-800 transition-colors"
                >
                  ✨ پیامک رونمایی کالکشن جدید فصلی
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPromoMessageText(`هدیه ویژه پوشاک من و تو 🎁
ارسال رایگان به سراسر کشور برای خریدهای تکی بالای ۵۰۰ هزار تومان تا پایان این هفته!
کد: FREE-POST
بازار بزرگ تهران - تولیدی اسدی`);
                  }}
                  className="w-full text-right p-3 bg-[#FAF7F2] hover:bg-stone-100 rounded-xl border border-[#DDD5C0] text-xs font-bold text-stone-800 transition-colors"
                >
                  🚚 پیامک ارسال رایگان پایان هفته
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPromoMessageText(`سلام همراه گرامی من و تو 🌸
دلتنگ حضورتان هستیم! برای خرید جدید شما ۲۰ هزار تومان تخفیف ویژه در نظر گرفته‌ایم.
کد: RETURN20
پشتیبانی واتساپ و تلگرام: 09123456789`);
                  }}
                  className="w-full text-right p-3 bg-[#FAF7F2] hover:bg-stone-100 rounded-xl border border-[#DDD5C0] text-xs font-bold text-stone-800 transition-colors"
                >
                  ❤️ پیامک بازگشت مشتریان قبلی
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-800">
                پیش‌نمایش متن پیامک ارسالی:
              </label>
              <textarea
                rows={7}
                value={promoMessageText}
                onChange={(e) => setPromoMessageText(e.target.value)}
                placeholder="متن پیامک یا پیام واتساپ را اینجا بنویسید..."
                className="w-full bg-[#FAF7F2] text-xs p-3.5 rounded-xl border border-[#DDD5C0] font-sans leading-relaxed text-stone-900 outline-none focus:border-[#D4AF37] focus:bg-white"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-bold">
                  گیرندگان: {filteredUsers.length} شماره موبایل تکی
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(promoMessageText);
                    alert('متن پیامک کپی شد! می‌توانید در پنل پیامک ارسال فرمایید.');
                  }}
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  کپی متن برای ارسال گروهی
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: View Retail Customer Profile & History */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E6DEC8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#18181B] text-[#D4AF37] font-black text-sm flex items-center justify-center">
                  {selectedUser.fullName.slice(0, 1)}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#18181B]">{selectedUser.fullName}</h3>
                  <span className="text-xs text-stone-500">عضویت: {selectedUser.registeredAt}</span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="my-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#DDD5C0] text-stone-700">
                <div><span>شماره موبایل:</span> <strong className="font-mono text-stone-900 block mt-0.5">{selectedUser.phone}</strong></div>
                <div><span>استان / شهر:</span> <strong className="text-stone-900 block mt-0.5">{selectedUser.province} - {selectedUser.city}</strong></div>
                <div><span>تعداد سفارشات:</span> <strong className="text-stone-900 block mt-0.5">{selectedUser.totalOrdersCount || 0} سفارش</strong></div>
                <div><span>مجموع پرداخت:</span> <strong className="text-emerald-800 block mt-0.5">{(selectedUser.totalSpentToman || 0).toLocaleString('fa-IR')} تومان</strong></div>
              </div>

              {selectedUser.address && (
                <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] space-y-1">
                  <span className="font-bold text-[#18181B] block">نشانی پستی جهت ارسال مرسوله:</span>
                  <p className="text-stone-700 leading-relaxed text-[11px]">{selectedUser.address}</p>
                  {selectedUser.postalCode && (
                    <span className="text-[10px] text-stone-500 font-mono block mt-1">کد پستی: {selectedUser.postalCode}</span>
                  )}
                </div>
              )}

              {/* Order History */}
              <div>
                <span className="font-bold text-[#18181B] block mb-2">سوابق خریدهای ثبت شده:</span>
                {orders.filter(o => o.customer.phone === selectedUser.phone).length === 0 ? (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center text-stone-400 text-xs">
                    هنوز سفارشی برای این کاربر ثبت نشده است.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {orders.filter(o => o.customer.phone === selectedUser.phone).map((ord) => (
                      <div key={ord.id} className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-[11px] text-[#8C6D37] block">{ord.orderNumber}</span>
                          <span className="text-[10px] text-stone-500">{ord.createdAt}</span>
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-stone-900 text-xs block">{ord.finalAmountToman.toLocaleString('fa-IR')} ت</span>
                          <span className="text-[10px] text-emerald-700 font-bold">پرداخت شده</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E6DEC8]">
              <button
                type="button"
                onClick={() => {
                  handleOpenSendMessage(selectedUser);
                }}
                className="bg-[#8C6D37] hover:bg-[#72582C] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ارسال پیامک تخفیف</span>
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="bg-[#18181B] text-[#FAF7F2] font-black text-xs px-5 py-2.5 rounded-xl shadow-xs"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Send Single SMS / WhatsApp Promo */}
      {isMessageModalOpen && messageTargetUser && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E6DEC8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#FAF7F2] text-[#8C6D37] rounded-xl border border-[#DDD5C0]">
                  <Send className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#18181B]">
                    ارسال پیام و آفر به {messageTargetUser.fullName}
                  </h3>
                  <p className="text-[11px] text-stone-500">شماره همراه: {messageTargetUser.phone}</p>
                </div>
              </div>
              <button onClick={() => setIsMessageModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="my-4 space-y-3">
              {/* Presets */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPresetPromo('discount')}
                  className={`text-[11px] px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    selectedPresetPromo === 'discount' ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0]'
                  }`}
                >
                  🎁 کد تخفیف ۱۰٪
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetPromo('new_collection')}
                  className={`text-[11px] px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    selectedPresetPromo === 'new_collection' ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0]'
                  }`}
                >
                  ✨ کالکشن تابستانه
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetPromo('survey')}
                  className={`text-[11px] px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    selectedPresetPromo === 'survey' ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0]'
                  }`}
                >
                  🌸 نظرسنجی رضایت
                </button>
              </div>

              <textarea
                rows={7}
                value={promoMessageText}
                onChange={(e) => setPromoMessageText(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs p-3.5 rounded-xl border border-[#DDD5C0] font-sans leading-relaxed outline-none focus:bg-white focus:border-[#D4AF37] text-stone-900"
              />

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/98${messageTargetUser.phone.replace(/^0/, '')}?text=${encodeURIComponent(promoMessageText)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>ارسال مستقیم در واتساپ</span>
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(promoMessageText);
                    alert('متن پیام کپی شد! می‌توانید در سامانه پیامکی یا ایتا ارسال نمایید.');
                  }}
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-4 py-2.5 rounded-xl transition-colors border border-[#3F3F46]"
                >
                  کپی متن پیام
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add New Retail Customer Manual */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E6DEC8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <h3 className="text-base font-black text-[#18181B]">ثبت مشخصات مشتری تک‌فروشی جدید</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSaveNewRetailCustomer} className="space-y-3.5 my-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">نام و نام خانوادگی خریدار:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خانم سارا رستمی"
                  value={newRetailForm.fullName}
                  onChange={(e) => setNewRetailForm({ ...newRetailForm, fullName: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شماره همراه:</label>
                  <input
                    type="text"
                    required
                    placeholder="09121234567"
                    value={newRetailForm.phone}
                    onChange={(e) => setNewRetailForm({ ...newRetailForm, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شهر / استان:</label>
                  <input
                    type="text"
                    placeholder="مثال: تهران / اصفهان"
                    value={newRetailForm.city}
                    onChange={(e) => setNewRetailForm({ ...newRetailForm, city: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">آدرس کامل پستی (جهت ارسال تیپاکس/پست):</label>
                <textarea
                  rows={3}
                  placeholder="خیابان، کوچه، پلاک، واحد..."
                  value={newRetailForm.address}
                  onChange={(e) => setNewRetailForm({ ...newRetailForm, address: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] text-stone-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">کد پستی ۱۰ رقمی:</label>
                  <input
                    type="text"
                    placeholder="1983746501"
                    value={newRetailForm.postalCode}
                    onChange={(e) => setNewRetailForm({ ...newRetailForm, postalCode: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">یادداشت / رنگ یا سایز دلخواه:</label>
                  <input
                    type="text"
                    placeholder="مثلا: عاشق شلوار بگ کتان سایز ۴۰"
                    value={newRetailForm.notes}
                    onChange={(e) => setNewRetailForm({ ...newRetailForm, notes: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] text-stone-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-[#FAF7F2] rounded-xl font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-5 py-2 rounded-xl transition-all shadow-xs border border-[#3F3F46]"
                >
                  ثبت مشتری در لیست تک‌فروشی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
