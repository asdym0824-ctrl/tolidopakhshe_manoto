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
  PackageCheck,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Flame,
  Scissors,
  Palette,
  LayoutTemplate,
  ToggleLeft,
  ToggleRight,
  RotateCcw
} from 'lucide-react';
import { 
  Product, 
  SiteSettings, 
  CustomerUser, 
  StorefrontOrder, 
  StorefrontBanner, 
  StorefrontBannerPosition, 
  StorefrontBannerAction, 
  StorefrontBannerStyle, 
  StorefrontBannerIcon 
} from '../types';
import { StorefrontMidGridBanner } from './storefront/StorefrontMidGridBanner';
import { DEFAULT_STOREFRONT_BANNERS } from '../App';

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
  const [activeSubTab, setActiveSubTab] = useState<'site_info' | 'mid_grid_banners' | 'registered_customers' | 'pricing_policy'>('site_info');
  
  // Local form for site settings
  const [formData, setFormData] = useState<SiteSettings>(() => ({
    ...siteSettings,
    midGridBanners: siteSettings.midGridBanners || DEFAULT_STOREFRONT_BANNERS,
  }));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Selected customer for viewing history
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<CustomerUser | null>(null);

  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateSiteSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Banner CRUD Operations
  const handleToggleBanner = (bannerId: string) => {
    const updatedBanners = (formData.midGridBanners || []).map(b => 
      b.id === bannerId ? { ...b, isActive: !b.isActive } : b
    );
    const updated = { ...formData, midGridBanners: updatedBanners };
    setFormData(updated);
    onUpdateSiteSettings(updated);
  };

  const handleUpdateBannerField = (bannerId: string, updates: Partial<StorefrontBanner>) => {
    const updatedBanners = (formData.midGridBanners || []).map(b => 
      b.id === bannerId ? { ...b, ...updates } : b
    );
    const updated = { ...formData, midGridBanners: updatedBanners };
    setFormData(updated);
  };

  const handleAddNewBanner = () => {
    const newId = `banner-${Date.now()}`;
    const newBanner: StorefrontBanner = {
      id: newId,
      title: 'عنوان بنر جذاب جدید فروشگاه',
      subtitle: 'توضیحات تکمیلی در مورد شرایط همکاری، مزایای خرید مستقیم یا ارسال فوری کالا',
      badgeText: '🔥 پیشنهاد ویژه بازار',
      tagline: 'تضمین بالاترین کیفیت و کف قیمت بازار بزرگ',
      buttonText: 'دریافت قیمت همکاری و فاکتور',
      buttonAction: 'wholesale_modal',
      secondaryButtonText: 'مشاهده آدرس در نقشه',
      secondaryButtonAction: 'routing_map',
      styleVariant: 'gold_luxury',
      iconType: 'sparkles',
      position: 'mid_grid',
      isActive: true,
    };

    const updatedBanners = [...(formData.midGridBanners || []), newBanner];
    const updated = { ...formData, midGridBanners: updatedBanners };
    setFormData(updated);
    setEditingBannerId(newId);
    onUpdateSiteSettings(updated);
  };

  const handleDeleteBanner = (bannerId: string) => {
    const updatedBanners = (formData.midGridBanners || []).filter(b => b.id !== bannerId);
    const updated = { ...formData, midGridBanners: updatedBanners };
    setFormData(updated);
    if (editingBannerId === bannerId) setEditingBannerId(null);
    onUpdateSiteSettings(updated);
  };

  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    const banners = [...(formData.midGridBanners || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const temp = banners[index];
    banners[index] = banners[targetIndex];
    banners[targetIndex] = temp;

    const updated = { ...formData, midGridBanners: banners };
    setFormData(updated);
    onUpdateSiteSettings(updated);
  };

  const handleResetDefaultBanners = () => {
    const updated = { ...formData, midGridBanners: DEFAULT_STOREFRONT_BANNERS };
    setFormData(updated);
    onUpdateSiteSettings(updated);
  };

  const currentBanners = formData.midGridBanners || [];
  const activeBannersCount = currentBanners.filter(b => b.isActive).length;

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
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#E6DEC8] text-xs flex-wrap">
          <button
            onClick={() => setActiveSubTab('site_info')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'site_info'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#D4AF37]" />
            <span>اطلاعات و سربرگ سایت</span>
          </button>

          <button
            onClick={() => setActiveSubTab('mid_grid_banners')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'mid_grid_banners'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>بنرهای بین گریدها و تبلیغات ({activeBannersCount} فعال)</span>
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

      {/* Save Toast Notification */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>تغییرات با موفقیت ذخیره شد و در ویترین آنلاین اعمال گردید!</span>
        </div>
      )}

      {/* TAB 2: Mid-Grid Banners Management */}
      {activeSubTab === 'mid_grid_banners' && (
        <div className="space-y-6">
          
          {/* Header Action Bar */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#18181B] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>بنرهای اختصاصی بین ردیف‌های محصولات و قفسه‌ها</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                طراحی شده برای افزایش تعامل، شکستن سادگی گریدها، معرفی کانال تلگرام، فروش عمده و هدایت به نقشه بازار
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAddNewBanner}
                className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>افزودن بنر جدید</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefaultBanners}
                className="bg-[#FAF7F2] hover:bg-stone-200 text-stone-700 border border-[#DDD5C0] font-bold text-xs px-3 py-2.5 rounded-xl transition-all flex items-center gap-1"
                title="بازنشانی به بنرهای پیش‌فرض"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>بازنشانی پیش‌فرض</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveSettings()}
                className="bg-[#D4AF37] hover:bg-[#c49f2e] text-[#18181B] font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره کلیه بنرها</span>
              </button>
            </div>
          </div>

          {/* Banners List */}
          <div className="space-y-6">
            {currentBanners.map((banner, index) => {
              const isEditing = editingBannerId === banner.id;

              return (
                <div 
                  key={banner.id} 
                  className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs overflow-hidden ${
                    banner.isActive ? 'border-[#E6DEC8]' : 'border-stone-200 opacity-80'
                  }`}
                >
                  {/* Banner Card Top Bar */}
                  <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center font-mono font-black text-xs">
                        #{index + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-[#18181B] text-xs sm:text-sm">
                            {banner.title}
                          </h4>
                          {banner.badgeText && (
                            <span className="text-[10px] bg-stone-200 text-stone-800 font-bold px-2 py-0.5 rounded-full">
                              {banner.badgeText}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500 flex-wrap">
                          <span>موقعیت: {
                            banner.position === 'after_bestsellers' ? 'بعد از پرفروش‌ترین‌ها' :
                            banner.position === 'after_new_arrivals' ? 'بعد از کالکشن جدید' :
                            banner.position === 'after_retail' ? 'بعد از قفسه تک‌فروشی' :
                            'میان گرید کاتالوگ'
                          }</span>
                          <span>•</span>
                          <span>تم رنگی: {
                            banner.styleVariant === 'gold_luxury' ? 'مشکی و طلایی لوکس' :
                            banner.styleVariant === 'dark_emerald' ? 'زمردی سلطنتی' :
                            banner.styleVariant === 'amber_bazaar' ? 'شکلاتی و کهربایی بازار' :
                            banner.styleVariant === 'purple_royal' ? 'بنفش درباری' :
                            'سرخ یاقوتی فروش ویژه'
                          }</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions & Toggles */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      
                      {/* Move Up/Down */}
                      <div className="flex items-center bg-white border border-stone-200 rounded-xl p-0.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveBanner(index, 'up')}
                          className="p-1 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                          title="انتقال به بالا"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === currentBanners.length - 1}
                          onClick={() => handleMoveBanner(index, 'down')}
                          className="p-1 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                          title="انتقال به پایین"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Toggle Active Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleBanner(banner.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                          banner.isActive 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-stone-100 text-stone-600 border border-stone-300'
                        }`}
                      >
                        {banner.isActive ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-stone-400" />}
                        <span>{banner.isActive ? 'فعال در سایت' : 'غیرفعال'}</span>
                      </button>

                      {/* Edit Details Button */}
                      <button
                        type="button"
                        onClick={() => setEditingBannerId(isEditing ? null : banner.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                          isEditing 
                            ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B]' 
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <span>{isEditing ? 'بستن ویرایش' : 'ویرایش کامل'}</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="حذف بنر"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                  {/* Live Rendered Visual Preview */}
                  <div className="p-4 sm:p-5 bg-stone-100/50">
                    <div className="text-[11px] font-bold text-stone-500 mb-2 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>پیش‌نمایش زنده ظاهر بنر در فروشگاه آنلاین:</span>
                    </div>

                    <StorefrontMidGridBanner banner={banner} />
                  </div>

                  {/* Expanded Edit Form */}
                  {isEditing && (
                    <div className="p-5 sm:p-6 bg-white border-t border-stone-200 space-y-5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                        <span className="font-black text-xs text-[#18181B] flex items-center gap-2">
                          <Settings className="w-4 h-4 text-[#D4AF37]" />
                          <span>فرم شخصی‌سازی محتوا و اکشن‌های بنر #{index + 1}</span>
                        </span>
                        <span className="text-[11px] text-stone-500">تغییرات به صورت آنی در پیش‌نمایش بالا اعمال می‌شوند</span>
                      </div>

                      {/* Row 1: Title & Subtitle */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            عنوان اصلی بنر (Headline):
                          </label>
                          <input
                            type="text"
                            value={banner.title}
                            onChange={(e) => handleUpdateBannerField(banner.id, { title: e.target.value })}
                            className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-bold focus:bg-white focus:border-[#18181B] outline-none"
                            placeholder="مثال: خرید مستقیم از کارگاه تولیدی • بدون واسطه بازار"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            نشانک بالای بنر (Badge):
                          </label>
                          <input
                            type="text"
                            value={banner.badgeText || ''}
                            onChange={(e) => handleUpdateBannerField(banner.id, { badgeText: e.target.value })}
                            className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-bold focus:bg-white focus:border-[#18181B] outline-none"
                            placeholder="مثال: ✨ ویژه بنکداران و بوتیک‌داران"
                          />
                        </div>
                      </div>

                      {/* Row 2: Subtitle & Tagline */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            متن توضیحات تکمیلی (Subtitle):
                          </label>
                          <textarea
                            rows={2}
                            value={banner.subtitle}
                            onChange={(e) => handleUpdateBannerField(banner.id, { subtitle: e.target.value })}
                            className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-medium focus:bg-white focus:border-[#18181B] outline-none resize-none"
                            placeholder="ارسال سریع روزانه با باربری وطن و پیام‌گیر از میدان شوش به سراسر کشور..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            شعار یا ضمانت کوتاه (Tagline):
                          </label>
                          <textarea
                            rows={2}
                            value={banner.tagline || ''}
                            onChange={(e) => handleUpdateBannerField(banner.id, { tagline: e.target.value })}
                            className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-medium focus:bg-white focus:border-[#18181B] outline-none resize-none"
                            placeholder="تضمین کیفیت دوخت ۵ لا و کش‌دوزی گنی ۱۰ سانتی"
                          />
                        </div>
                      </div>

                      {/* Row 3: Buttons & Actions */}
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                        <span className="font-black text-xs text-stone-800 block">تنظیم دکمه‌ها و لینک‌های اقدام بنر:</span>
                        
                        {/* Primary Button */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 mb-1">متن دکمه اصلی:</label>
                            <input
                              type="text"
                              value={banner.buttonText}
                              onChange={(e) => handleUpdateBannerField(banner.id, { buttonText: e.target.value })}
                              className="w-full bg-white text-xs p-2 rounded-xl border border-[#DDD5C0] font-bold focus:border-[#18181B] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 mb-1">عملیات دکمه اصلی:</label>
                            <select
                              value={banner.buttonAction}
                              onChange={(e) => handleUpdateBannerField(banner.id, { buttonAction: e.target.value as StorefrontBannerAction })}
                              className="w-full bg-white text-xs p-2 rounded-xl border border-[#DDD5C0] font-bold focus:border-[#18181B] outline-none"
                            >
                              <option value="wholesale_modal">باز کردن فرم قیمت همکار و فاکتور عمده</option>
                              <option value="telegram">انتقال مستقیم به کانال تلگرام</option>
                              <option value="whatsapp">انتقال به گفتگوی واتساپ / ایتا</option>
                              <option value="routing_map">باز کردن نقشه و مسیریابی پاساژ</option>
                              <option value="about_modal">مشاهده اطلاعات تماس و کارگاه‌ها</option>
                              <option value="call_sales">تماس تلفنی مستقیم با مدیریت</option>
                              <option value="retail_filter">فیلتر کردن مدل‌های تک‌فروشی</option>
                              <option value="scroll_catalog">اسکرول به لیست محصولات کاتالوگ</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 mb-1">آدرس/شماره اختصاصی (اختیاری):</label>
                            <input
                              type="text"
                              value={banner.buttonTarget || ''}
                              onChange={(e) => handleUpdateBannerField(banner.id, { buttonTarget: e.target.value })}
                              placeholder="پیش‌فرض از اطلاعات برند خوانده می‌شود"
                              className="w-full bg-white text-xs p-2 rounded-xl border border-[#DDD5C0] font-mono text-[11px] focus:border-[#18181B] outline-none"
                            />
                          </div>
                        </div>

                        {/* Secondary Button */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-200">
                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 mb-1">متن دکمه دوم (فرعی):</label>
                            <input
                              type="text"
                              value={banner.secondaryButtonText || ''}
                              onChange={(e) => handleUpdateBannerField(banner.id, { secondaryButtonText: e.target.value })}
                              placeholder="مثال: مسیریابی پاساژ المهدی ۴ (خالی یعنی بدون دکمه دوم)"
                              className="w-full bg-white text-xs p-2 rounded-xl border border-[#DDD5C0] font-bold focus:border-[#18181B] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 mb-1">عملیات دکمه دوم:</label>
                            <select
                              value={banner.secondaryButtonAction || 'routing_map'}
                              onChange={(e) => handleUpdateBannerField(banner.id, { secondaryButtonAction: e.target.value as StorefrontBannerAction })}
                              className="w-full bg-white text-xs p-2 rounded-xl border border-[#DDD5C0] font-bold focus:border-[#18181B] outline-none"
                            >
                              <option value="routing_map">باز کردن نقشه و مسیریابی پاساژ</option>
                              <option value="about_modal">اطلاعات کارگاه‌ها و راهنمای مترو</option>
                              <option value="wholesale_modal">فرم درخواست همکاری عمده</option>
                              <option value="telegram">ورود به کانال تلگرام</option>
                              <option value="whatsapp">ارتباط واتساپ / ایتا</option>
                              <option value="call_sales">تماس تلفنی با فروشگاه</option>
                            </select>
                          </div>
                        </div>

                      </div>

                      {/* Row 4: Styling & Position Placement */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        {/* Theme Variant */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                            <Palette className="w-3.5 h-3.5 text-[#8C6D37]" />
                            <span>تم و پالت رنگی بنر:</span>
                          </label>
                          <select
                            value={banner.styleVariant}
                            onChange={(e) => handleUpdateBannerField(banner.id, { styleVariant: e.target.value as StorefrontBannerStyle })}
                            className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-bold focus:bg-white focus:border-[#18181B] outline-none"
                          >
                            <option value="gold_luxury">مشکی و طلایی لوکس (Gold Luxury)</option>
                            <option value="dark_emerald">زمردی سلطنتی و طلایی (Emerald Royal)</option>
                            <option value="amber_bazaar">شکلاتی و کهربایی بازار (Amber Bazaar)</option>
                            <option value="purple_royal">بنفش درباری و یاقوتی (Purple Velvet)</option>
                            <option value="crimson_sale">سرخ یاقوتی فروش ویژه (Ruby Crimson)</option>
                          </select>
                        </div>

                        {/* Icon Type */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#8C6D37]" />
                            <span>آیکون نشانک:</span>
                          </label>
                          <select
                            value={banner.iconType}
                            onChange={(e) => handleUpdateBannerField(banner.id, { iconType: e.target.value as StorefrontBannerIcon })}
                            className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-bold focus:bg-white focus:border-[#18181B] outline-none"
                          >
                            <option value="package">📦 بسته و پک عمده (Package)</option>
                            <option value="sparkles">✨ ستاره و درخشش (Sparkles)</option>
                            <option value="flame">🔥 شعله و داغ (Flame)</option>
                            <option value="scissors">✂️ قیچی و خیاطی کارگاه (Scissors)</option>
                            <option value="store">🏪 فروشگاه و پاساژ (Store)</option>
                            <option value="shield">🛡️ سپر و ضمانت دوخت (Shield)</option>
                            <option value="truck">🚚 کامیون و باربری (Truck)</option>
                            <option value="tag">🏷️ برچسب قیمت (Tag)</option>
                          </select>
                        </div>

                        {/* Placement Position */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                            <LayoutTemplate className="w-3.5 h-3.5 text-[#8C6D37]" />
                            <span>موقعیت قرارگیری در صفحه:</span>
                          </label>
                          <select
                            value={banner.position}
                            onChange={(e) => handleUpdateBannerField(banner.id, { position: e.target.value as StorefrontBannerPosition })}
                            className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-bold focus:bg-white focus:border-[#18181B] outline-none"
                          >
                            <option value="after_bestsellers">بعد از ردیف پرفروش‌ترین‌ها</option>
                            <option value="after_new_arrivals">بعد از ردیف کالکشن جدید</option>
                            <option value="after_retail">بعد از ردیف امکان خرید تکی</option>
                            <option value="mid_grid">در میان محصولات گرید کاتالوگ</option>
                          </select>
                        </div>

                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                        <button
                          type="button"
                          onClick={() => setEditingBannerId(null)}
                          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all"
                        >
                          بستن ویرایشگر
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleSaveSettings();
                            setEditingBannerId(null);
                          }}
                          className="px-5 py-2 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <Save className="w-4 h-4 text-[#D4AF37]" />
                          <span>ذخیره و اعمال در فروشگاه</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}
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
