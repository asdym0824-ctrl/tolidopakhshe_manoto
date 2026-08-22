import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Settings, 
  Globe, 
  ExternalLink, 
  CheckCircle, 
  Users, 
  Eye, 
  Save, 
  Sparkles, 
  Percent, 
  Truck, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Tag, 
  ShieldCheck,
  Store,
  Crown,
  ChevronLeft,
  PackageCheck
} from 'lucide-react';
import { Product, SiteSettings, CustomerUser, StorefrontOrder } from '../types';

interface StorefrontModuleProps {
  products: Product[];
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  customerUsers: CustomerUser[];
  orders: StorefrontOrder[];
  onOpenLiveStorefront: () => void;
}

export const StorefrontModule: React.FC<StorefrontModuleProps> = ({
  products,
  siteSettings,
  onUpdateSiteSettings,
  customerUsers,
  orders,
  onOpenLiveStorefront,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'site_info' | 'registered_customers' | 'pricing_policy'>('site_info');
  
  // Local form for site settings
  const [formData, setFormData] = useState<SiteSettings>(siteSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Selected customer for viewing history
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<CustomerUser | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div id="storefront-manager-module" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-black">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#18181B]">
                  مدیریت وب‌سایت و ویترین فروشگاه
                </h2>
                <span className="bg-emerald-100 text-emerald-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  ویترین زنده و فعال
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                تنظیم سربرگ، نوار اعلان طلایی، آدرس و شماره‌های بازار و نظارت بر مشتریان عضو
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenLiveStorefront}
              className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-xs border border-[#3F3F46]"
            >
              <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
              <span>ورود به فروشگاه آنلاین</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#E6DEC8] text-xs">
          <button
            onClick={() => setActiveSubTab('site_info')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'site_info'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#D4AF37]" />
            <span>ویرایش اطلاعات و سربرگ سایت</span>
          </button>

          <button
            onClick={() => setActiveSubTab('registered_customers')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'registered_customers'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>خریداران و اعضای سایت ({customerUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pricing_policy')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'pricing_policy'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Tag className="w-4 h-4 text-[#D4AF37]" />
            <span>تنظیمات تک‌فروشی و حمل‌ونقل</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Edit Site Info & Announcements */}
      {activeSubTab === 'site_info' && (
        <form onSubmit={handleSaveSettings} className="space-y-5">
          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>تنظیمات وب‌سایت با موفقیت ذخیره شد و در فروشگاه اعمال گردید!</span>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-black text-[#18181B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8C6D37]" />
              <span>هویت برند و شعار فروشگاه</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">نام برند فروشگاه:</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-bold focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">زیرعنوان برند (مالکیت/کارگاه):</label>
                <input
                  type="text"
                  value={formData.brandSubtitle}
                  onChange={(e) => setFormData({ ...formData, brandSubtitle: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">نوار اعلان بالای سایت (Announcement Notice):</label>
              <input
                type="text"
                value={formData.announcementNotice}
                onChange={(e) => setFormData({ ...formData, announcementNotice: e.target.value })}
                className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#D4AF37] font-medium text-[#18181B] focus:bg-white focus:border-[#18181B] outline-none"
              />
              <span className="text-[11px] text-[#8C6D37] mt-1 block">
                این پیام در بالاترین نوار مشکی-طلایی سایت برای تمام بازدیدکنندگان نمایش داده می‌شود.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-stone-700 mb-1">تیتر بنر اصلی (Hero Headline):</label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">توضیحات بنر اصلی:</label>
                <input
                  type="text"
                  value={formData.heroSubheadline}
                  onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-black text-[#18181B] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8C6D37]" />
              <span>اطلاعات تماس، نشانی و کانال‌های ارتباطی</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">آدرس فروشگاه حضوری بازار:</label>
                <input
                  type="text"
                  value={formData.mainAddress}
                  onChange={(e) => setFormData({ ...formData, mainAddress: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">راهنمای دسترسی مترو:</label>
                <input
                  type="text"
                  value={formData.subwayAddress}
                  onChange={(e) => setFormData({ ...formData, subwayAddress: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">تلفن همراه مدیریت (اسدی):</label>
                <input
                  type="text"
                  value={formData.primaryPhone}
                  onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-mono focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">تلفن ثابت فروشگاه المهدی:</label>
                <input
                  type="text"
                  value={formData.salesPhone}
                  onChange={(e) => setFormData({ ...formData, salesPhone: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-mono focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">شماره پشتیبانی و ارسال:</label>
                <input
                  type="text"
                  value={formData.supportPhone}
                  onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-mono focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">شناسه کانال تلگرام:</label>
                <input
                  type="text"
                  value={formData.telegramChannel}
                  onChange={(e) => setFormData({ ...formData, telegramChannel: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-mono focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">لینک مستقیم جوین تلگرام:</label>
                <input
                  type="text"
                  value={formData.telegramChannelUrl}
                  onChange={(e) => setFormData({ ...formData, telegramChannelUrl: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-mono focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-6 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 border border-[#3F3F46]"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>ذخیره کلیه تنظیمات وب‌سایت</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Registered Customer Accounts */}
      {activeSubTab === 'registered_customers' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[#18181B]">
                لیست خریداران و اعضای ثبت‌نام شده در سایت
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                مشتریانی که در سایت ثبت‌نام کرده یا هنگام خرید، حساب آنها خودکار ایجاد شده است
              </p>
            </div>
            <span className="text-xs bg-[#FAF7F2] text-[#18181B] font-black px-3 py-1.5 rounded-xl border border-[#DDD5C0]">
              {customerUsers.length} کاربر ثبت‌شده
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF7F2] text-[#8C6D37] border-b border-[#E6DEC8] font-black">
                <tr>
                  <th className="p-3">نام کاربر</th>
                  <th className="p-3">شماره تماس</th>
                  <th className="p-3">فروشگاه / شهر</th>
                  <th className="p-3">تاریخ عضویت</th>
                  <th className="p-3">تعداد سفارشات</th>
                  <th className="p-3 text-center">مشاهده سفارش‌ها</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF7F2]">
                {customerUsers.map((user) => {
                  const userOrders = orders.filter(
                    o => o.customer.phone === user.phone || (user.phone && o.customer.phone.endsWith(user.phone.slice(-8)))
                  );
                  return (
                    <tr key={user.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="p-3 font-bold text-[#18181B]">{user.fullName}</td>
                      <td className="p-3 font-mono text-stone-700">{user.phone}</td>
                      <td className="p-3 text-stone-600">
                        {user.storeName ? `${user.storeName} - ` : ''}{user.city}
                      </td>
                      <td className="p-3 text-stone-500">{user.registeredAt}</td>
                      <td className="p-3">
                        <span className="bg-[#FAF7F2] text-[#18181B] border border-[#DDD5C0] font-bold px-2 py-0.5 rounded-md">
                          {userOrders.length} سفارش
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedUserForHistory(user)}
                          className="text-xs bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>سابقه خرید</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Pricing & Retail Sales Policy */}
      {activeSubTab === 'pricing_policy' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-black text-[#18181B]">
              قوانین فروش تک، تخفیف عمده و حمل‌ونقل
            </h3>
            <p className="text-stone-500 mt-0.5">
              مدیریت شرایط سفارش‌گیری در سراسر سایت
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC8] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#18181B] text-xs block">فعال‌سازی حالت تک‌فروشی در سایت:</span>
                  <span className="text-[11px] text-stone-500">امکان ثبت سفارش تکی توسط مشتریان عادی</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isRetailSaleActive}
                  onChange={(e) => {
                    const updated = { ...formData, isRetailSaleActive: e.target.checked };
                    setFormData(updated);
                    onUpdateSiteSettings(updated);
                  }}
                  className="w-5 h-5 rounded text-[#18181B] focus:ring-[#18181B] cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC8] space-y-2">
              <label className="font-bold text-[#18181B] text-xs block">حداقل مبلغ برای ارسال رایگان (تومان):</label>
              <input
                type="number"
                step={500000}
                value={formData.minFreeShippingToman}
                onChange={(e) => {
                  const updated = { ...formData, minFreeShippingToman: Number(e.target.value) };
                  setFormData(updated);
                  onUpdateSiteSettings(updated);
                }}
                className="w-full bg-white p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-[#18181B] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Customer Order History from Admin */}
      {selectedUserForHistory && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#DDD5C0] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8]">
              <div>
                <h3 className="text-base font-black text-[#18181B]">
                  سوابق خریدهای آنلاین: {selectedUserForHistory.fullName}
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  تلفن: {selectedUserForHistory.phone} • {selectedUserForHistory.city}
                </p>
              </div>
              <button
                onClick={() => setSelectedUserForHistory(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              {orders.filter(
                o => o.customer.phone === selectedUserForHistory.phone || (selectedUserForHistory.phone && o.customer.phone.endsWith(selectedUserForHistory.phone.slice(-8)))
              ).length === 0 ? (
                <div className="p-6 text-center text-stone-500 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8]">
                  هنوز سفارشی توسط این کاربر در سایت ثبت نشده است.
                </div>
              ) : (
                orders
                  .filter(o => o.customer.phone === selectedUserForHistory.phone || (selectedUserForHistory.phone && o.customer.phone.endsWith(selectedUserForHistory.phone.slice(-8))))
                  .map((ord) => (
                    <div key={ord.id} className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#18181B]">{ord.orderNumber}</span>
                        <span className="text-stone-500">{ord.createdAt}</span>
                      </div>
                      <div className="text-[11px] text-stone-600">
                        اقلام: {ord.items.map(it => `${it.product.name} (${it.quantity} ${it.mode === 'wholesale_pack' ? 'پک' : 'عدد'})`).join('، ')}
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#DDD5C0] font-bold">
                        <span className="text-stone-600">مبلغ کل:</span>
                        <span className="text-[#18181B] font-black">{ord.finalAmountToman.toLocaleString('fa-IR')} تومان</span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E6DEC8]">
              <button
                onClick={() => setSelectedUserForHistory(null)}
                className="bg-[#18181B] text-[#FAF7F2] font-black text-xs px-5 py-2 rounded-xl"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
