import React, { useState } from 'react';
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
  ShoppingBasket
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
      {activeTab === 'all_retail' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام مشتری، موبایل، شهر یا نشانی..."
                  className="w-full bg-[#FAF7F2] text-xs pr-9 pl-3 py-2.5 rounded-xl border border-[#DDD5C0] focus:border-[#D4AF37] focus:bg-white outline-none text-stone-900 font-medium"
                />
              </div>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-[#FAF7F2] text-xs py-2.5 px-3 rounded-xl border border-[#DDD5C0] text-stone-800 outline-none font-medium"
              >
                <option value="all">همه شهرها و استان‌ها</option>
                {allCities.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="bg-[#FAF7F2] text-xs py-2.5 px-3 rounded-xl border border-[#DDD5C0] text-stone-800 outline-none font-medium"
              >
                <option value="all">همه وضعیت‌های خرید</option>
                <option value="with_orders">دارای سابقه خرید (ثبت شده)</option>
                <option value="high_value">خرید بالای ۱ میلیون تومان</option>
                <option value="vip">مشتریان VIP طلایی</option>
              </select>
            </div>

            <span className="text-xs text-[#8C6D37] font-bold">
              نمایش {filteredUsers.length} خریدار تکی
            </span>
          </div>

          {/* Table of Retail Customers */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF7F2] text-stone-700 border-b border-[#E6DEC8] font-bold">
                  <tr>
                    <th className="p-3.5">نام و مشخصات خریدار</th>
                    <th className="p-3.5">شماره تماس</th>
                    <th className="p-3.5">استان / شهر و آدرس پستی</th>
                    <th className="p-3.5">سطح باشگاه</th>
                    <th className="p-3.5">تعداد سفارشات</th>
                    <th className="p-3.5">مجموع پرداختی</th>
                    <th className="p-3.5">آخرین فعالیت / سفارش</th>
                    <th className="p-3.5 text-center">اقدامات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF7F2]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      
                      {/* Name */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#18181B] text-[#D4AF37] font-black text-xs flex items-center justify-center">
                            {user.fullName.slice(0, 1)}
                          </div>
                          <div>
                            <span 
                              onClick={() => setSelectedUser(user)}
                              className="font-black text-[#18181B] hover:text-[#8C6D37] cursor-pointer block text-xs"
                            >
                              {user.fullName}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              عضویت: {user.registeredAt}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-stone-800 text-[11px] dir-ltr text-right block">
                          {user.phone}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="p-3.5 max-w-[200px]">
                        <div className="flex items-center gap-1 text-stone-800 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{user.province} - {user.city}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 truncate mt-0.5" title={user.address}>
                          {user.address || 'آدرس ثبت نشده'}
                        </p>
                      </td>

                      {/* Loyalty Tier */}
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${
                          user.loyaltyTier === 'طلایی VIP' ? 'bg-amber-100 text-amber-950 border-amber-300' :
                          user.loyaltyTier === 'نقره‌ای' ? 'bg-stone-100 text-stone-800 border-stone-300' :
                          'bg-[#FAF7F2] text-[#8C6D37] border-[#DDD5C0]'
                        }`}>
                          <Award className="w-3 h-3 text-[#8C6D37]" />
                          <span>{user.loyaltyTier}</span>
                        </span>
                      </td>

                      {/* Orders count */}
                      <td className="p-3.5">
                        <span className="bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] font-bold px-2 py-0.5 rounded-lg text-xs">
                          {user.ordersCount} سفارش
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="p-3.5">
                        <span className="font-black text-[#18181B] block">
                          {user.totalSpent.toLocaleString('fa-IR')} ت
                        </span>
                      </td>

                      {/* Last Order Date */}
                      <td className="p-3.5">
                        <span className="text-[11px] text-stone-600">
                          {user.lastOrderDate}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenSendMessage(user)}
                            className="p-1.5 text-[#8C6D37] hover:bg-[#FAF7F2] rounded-xl border border-transparent hover:border-[#DDD5C0] transition-colors"
                            title="ارسال پیامک / واتساپ کد تخفیف"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 text-stone-700 hover:bg-[#FAF7F2] rounded-xl border border-transparent hover:border-[#DDD5C0] transition-colors"
                            title="مشاهده پروفایل و پرونده خرید"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Retail Orders Detailed List */}
      {activeTab === 'retail_orders' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[#18181B]">
                فاکتورهای تک‌فروشی صادر شده از سایت
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                لیست سفارش‌های خرید تکی شلوار زنانه توسط مشتریان نهایی
              </p>
            </div>
            <span className="text-xs bg-[#FAF7F2] font-black text-[#8C6D37] px-3 py-1.5 rounded-xl border border-[#DDD5C0]">
              {totalRetailOrders.length} فاکتور تکی
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {totalRetailOrders.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-[#8C6D37]">{order.orderNumber}</span>
                      <h4 className="font-black text-sm text-[#18181B] mt-0.5">{order.customer.fullName}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      order.orderStatus === 'sent_to_carrier' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      'bg-amber-50 text-amber-900 border-amber-200'
                    }`}>
                      {order.orderStatus === 'sent_to_carrier' ? 'ارسال با تیپاکس/پست' :
                       order.orderStatus === 'delivered' ? 'تحویل داده شده' : 'آماده‌سازی در کارگاه'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="mt-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] space-y-2 text-xs">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-stone-800">
                        <div className="flex items-center gap-2">
                          <img src={it.product.image} alt={it.product.name} className="w-7 h-7 object-cover rounded-lg border border-stone-200" referrerPolicy="no-referrer" />
                          <span className="font-bold">{it.product.name} ({it.quantity} عدد تکی)</span>
                        </div>
                        <span className="font-bold">{it.totalPriceToman.toLocaleString('fa-IR')} ت</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-[#E6DEC8]">
                    <span className="text-stone-500">شماره تماس: <strong className="font-mono text-stone-800">{order.customer.phone}</strong></span>
                    <span className="font-black text-[#18181B]">مبلغ نهایی: {order.finalAmountToman.toLocaleString('fa-IR')} ت</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="flex-1 text-[11px] text-stone-500">
                    🚚 {order.shippingMethodTitle}
                  </div>
                  {order.waybillNumber && (
                    <span className="text-[10px] bg-white border border-[#DDD5C0] px-2 py-1 rounded-lg font-mono font-bold text-stone-700">
                      کد رهگیری: {order.waybillNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
