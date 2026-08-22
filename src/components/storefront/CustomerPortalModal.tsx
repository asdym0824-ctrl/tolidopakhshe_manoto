import React, { useState } from 'react';
import { 
  User, 
  Package, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  Building2, 
  X, 
  LogOut, 
  Printer, 
  Copy, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Search
} from 'lucide-react';
import { CustomerUser, StorefrontOrder } from '../../types';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser;
  orders: StorefrontOrder[];
  onLogout: () => void;
  onUpdateProfile: (updated: CustomerUser) => void;
  onOpenTrackingModalWithCode?: (code: string) => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  onLogout,
  onUpdateProfile,
  onOpenTrackingModalWithCode,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Edit profile state
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser.fullName,
    phone: currentUser.phone,
    storeName: currentUser.storeName || '',
    province: currentUser.province,
    city: currentUser.city,
    address: currentUser.address,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter orders by customer phone
  const cleanCurrentPhone = currentUser.phone.replace(/[^0-9]/g, '');
  const userOrders = orders.filter(
    o => o.customer.phone.replace(/[^0-9]/g, '') === cleanCurrentPhone
  );

  const totalSpent = userOrders.reduce((sum, o) => sum + o.finalAmountToman, 0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CustomerUser = {
      ...currentUser,
      fullName: profileForm.fullName.trim(),
      phone: profileForm.phone.trim(),
      storeName: profileForm.storeName.trim(),
      province: profileForm.province.trim(),
      city: profileForm.city.trim(),
      address: profileForm.address.trim(),
    };
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const getStatusBadge = (status: StorefrontOrder['orderStatus']) => {
    switch (status) {
      case 'registered':
        return <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">ثبت در صف بسته‌بندی</span>;
      case 'processing':
      case 'packed':
        return <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">بسته‌بندی در انبار بازار</span>;
      case 'sent_to_carrier':
        return <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">تحویل به باربری / تیپاکس</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">تحویل موفق به مشتری</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full">در حال پردازش</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-[#FAF7F2] text-stone-900 w-full max-w-3xl rounded-3xl border border-[#DDD5C0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header Card */}
        <div className="bg-[#18181B] text-[#FAF7F2] p-5 sm:p-6 border-b border-[#3F3F46]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#27272A] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-black text-lg shadow-sm">
                {currentUser.fullName ? currentUser.fullName.charAt(0) : 'م'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-base sm:text-lg">
                    {currentUser.fullName || 'خریدار محترم'}
                  </h3>
                  {currentUser.storeName && (
                    <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-md font-bold">
                      {currentUser.storeName}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-300 mt-1">
                  <span className="flex items-center gap-1 font-mono text-[#D4AF37]">
                    <Phone className="w-3.5 h-3.5" />
                    {currentUser.phone}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {currentUser.city} ({currentUser.province})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onLogout(); onClose(); }}
                className="py-1.5 px-3 bg-[#27272A] hover:bg-red-950/60 text-stone-300 hover:text-red-300 rounded-xl text-xs font-bold transition-all border border-[#3F3F46] flex items-center gap-1"
                title="خروج از حساب"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">خروج</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-[#27272A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#27272A] text-center text-xs">
            <div className="bg-[#202024] p-2.5 rounded-xl border border-[#333338]">
              <span className="text-stone-400 text-[11px] block">تعداد سفارشات</span>
              <span className="text-white font-bold font-mono text-sm mt-0.5 block">{userOrders.length} فاکتور</span>
            </div>
            <div className="bg-[#202024] p-2.5 rounded-xl border border-[#333338]">
              <span className="text-stone-400 text-[11px] block">مجموع خرید شما</span>
              <span className="text-[#D4AF37] font-bold text-sm mt-0.5 block">{totalSpent.toLocaleString('fa-IR')} تومان</span>
            </div>
            <div className="bg-[#202024] p-2.5 rounded-xl border border-[#333338]">
              <span className="text-stone-400 text-[11px] block">نوع حساب</span>
              <span className="text-emerald-400 font-bold text-xs mt-0.5 block">خریدار تاییدشده</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E6DEC8] bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 font-bold text-xs border-b-2 flex items-center gap-2 transition-all mr-4 ${
              activeTab === 'orders'
                ? 'border-[#18181B] text-[#18181B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4 text-[#8C6D37]" />
            <span>سفارشات و خریدهای من ({userOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'border-[#18181B] text-[#18181B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-4 h-4 text-[#8C6D37]" />
            <span>ویرایش مشخصات و آدرس باربری</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'orders' ? (
            userOrders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#EDE5D3] text-[#8C6D37] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-stone-800 text-sm">هنوز سفارشی با این شماره ثبت نشده است</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  مدل‌های جدید پوشاک من و تو را در ویترین فروشگاه مشاهده کنید و اولین سفارش خود را ثبت نمایید.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-5 bg-[#18181B] text-[#FAF7F2] font-bold text-xs rounded-xl shadow-xs hover:bg-[#27272A]"
                >
                  مشاهده کاتالوگ مدل‌ها
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {userOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-[#DDD5C0] shadow-xs overflow-hidden transition-all"
                    >
                      {/* Order Summary Row */}
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-black text-stone-900 text-sm font-mono">
                              {order.orderNumber}
                            </span>
                            {getStatusBadge(order.orderStatus)}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {order.createdAt}
                            </span>
                            <span>•</span>
                            <span>روش ارسال: {order.shippingMethodTitle}</span>
                            <span>•</span>
                            <span className="font-bold text-stone-900">
                              {order.finalAmountToman.toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                        </div>

                        {/* Action buttons on card */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {order.trackingCode && (
                            <button
                              type="button"
                              onClick={() => handleCopyCode(order.trackingCode)}
                              className="py-1.5 px-2.5 bg-[#FAF7F2] hover:bg-[#ECE4D5] text-stone-700 rounded-lg text-xs font-bold transition-colors border border-[#DDD5C0] flex items-center gap-1"
                              title="کپی کد رهگیری مرسوله"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#8C6D37]" />
                              <span>{copiedCode === order.trackingCode ? 'کپی شد!' : order.trackingCode}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="py-1.5 px-3 bg-[#18181B] text-[#FAF7F2] rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <span>جزئیات اقلام</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Order Items and Waybill Info */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E6DEC8] space-y-4 text-xs animate-fadeIn">
                          
                          {/* Waybill highlight if available */}
                          {order.waybillNumber ? (
                            <div className="bg-[#18181B] text-[#FAF7F2] p-3.5 rounded-xl border border-[#3F3F46] flex items-center justify-between gap-3">
                              <div>
                                <span className="text-[11px] text-[#D4AF37] block font-bold">
                                  اطلاعات بیجک باربری / بارنامه صادر شده:
                                </span>
                                <span className="font-mono text-sm font-bold text-white mt-0.5 block">
                                  شماره بارنامه: {order.waybillNumber} ({order.carrierName || order.shippingMethodTitle})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(order.waybillNumber!)}
                                className="py-1 px-2.5 bg-[#FAF7F2] text-[#18181B] font-bold text-[11px] rounded-lg"
                              >
                                {copiedCode === order.waybillNumber ? 'کپی شد' : 'کپی بیجک'}
                              </button>
                            </div>
                          ) : (
                            <div className="bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-200 text-[11px] flex items-center gap-2">
                              <Truck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                              <span>سفارش در نوبت بسته‌بندی در انبار بازار قرار دارد و به محض تحویل به باربری، شماره بیجک پیامک خواهد شد.</span>
                            </div>
                          )}

                          {/* Items table */}
                          <div>
                            <span className="font-bold text-stone-800 block mb-2">
                              اقلام سفارش ({order.items.length} قلم):
                            </span>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="bg-white p-2.5 rounded-xl border border-[#DDD5C0] flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-10 h-10 object-cover rounded-lg border border-[#DDD5C0]"
                                    />
                                    <div>
                                      <span className="font-bold text-stone-900 block">{item.product.name}</span>
                                      <span className="text-[11px] text-stone-500">
                                        {item.mode === 'wholesale_pack' ? `پک ${item.product.packSize} تایی × ${item.quantity}` : `تک‌فروشی × ${item.quantity}`}
                                        {item.selectedColor ? ` • رنگ: ${item.selectedColor}` : ''}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="font-bold text-stone-900">
                                    {item.totalPriceToman.toLocaleString('fa-IR')} تومان
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Address */}
                          <div className="bg-white p-3 rounded-xl border border-[#DDD5C0] text-[11px] text-stone-600">
                            <span className="font-bold text-stone-800 block mb-1">آدرس ثبت شده برای تحویل بار:</span>
                            <p>{order.customer.province}، {order.customer.city}، {order.customer.address}</p>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Profile Tab */
            <form onSubmit={handleSaveProfile} className="bg-white p-5 rounded-2xl border border-[#DDD5C0] shadow-xs space-y-4 text-xs">
              <h4 className="font-bold text-stone-900 text-sm pb-2 border-b border-[#E6DEC8]">
                مشخصات حساب کاربری و دفترچه آدرس
              </h4>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>اطلاعات شما با موفقیت بروزرسانی شد.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">شماره موبایل:</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 font-mono bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">نام فروشگاه / بوتیک:</label>
                  <input
                    type="text"
                    value={profileForm.storeName}
                    onChange={(e) => setProfileForm({ ...profileForm, storeName: e.target.value })}
                    placeholder="بوتیک شیک‌پوشان"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">استان:</label>
                  <input
                    type="text"
                    value={profileForm.province}
                    onChange={(e) => setProfileForm({ ...profileForm, province: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">شهر مقصد:</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 bg-[#FAF7F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">آدرس پستی جهت ارسال بار:</label>
                  <textarea
                    rows={2}
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 resize-none bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] rounded-xl font-bold text-xs transition-all shadow-md"
              >
                ذخیره تغییرات مشخصات
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
