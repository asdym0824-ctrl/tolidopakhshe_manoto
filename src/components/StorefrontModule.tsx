import React, { useState, useEffect } from 'react';
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
  Package,
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
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  RefreshCw,
  Film,
  Building2,
  UserCheck,
  UserPlus,
  Edit3,
  Search,
  Lock,
  Unlock,
  ShieldAlert,
  X
} from 'lucide-react';
import { toPersianDigits } from '../utils/persianWriting';
import { 
  Product, 
  SiteSettings, 
  CustomerUser, 
  StorefrontOrder, 
  StorefrontBanner, 
  StorefrontBannerPosition, 
  StorefrontBannerAction, 
  StorefrontBannerStyle, 
  StorefrontBannerIcon,
  OccasionPromoPopupConfig,
  LookbookBannerItem,
  SiteBackgroundTheme
} from '../types';
import { StorefrontMidGridBanner } from './storefront/StorefrontMidGridBanner';
import { DEFAULT_STOREFRONT_BANNERS, DEFAULT_PROMO_POPUP, INITIAL_SITE_SETTINGS } from '../App';
import { DEFAULT_LOOKBOOK_BANNERS } from '../data/defaultLookbookBanners';
import { OccasionPromoPopupModal } from './storefront/OccasionPromoPopupModal';
import { StoryContentManager } from './admin/StoryContentManager';

interface StorefrontModuleProps {
  products: Product[];
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  customerUsers: CustomerUser[];
  orders: StorefrontOrder[];
  onOpenLiveStorefront: () => void;
  onUpdateCustomerUser?: (user: CustomerUser) => void;
  onAddCustomerUser?: (user: CustomerUser) => void;
  onDeleteCustomerUser?: (userId: string) => void;
}

export const StorefrontModule: React.FC<StorefrontModuleProps> = ({
  products,
  siteSettings,
  onUpdateSiteSettings,
  customerUsers,
  orders,
  onOpenLiveStorefront,
  onUpdateCustomerUser,
  onAddCustomerUser,
  onDeleteCustomerUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'site_info' | 'storefront_stories' | 'site_theme' | 'lookbook_banners' | 'mid_grid_banners' | 'promo_popup' | 'wholesale_partners' | 'registered_customers' | 'pricing_policy'>('site_info');
  
  // Local form for site settings
  const [formData, setFormData] = useState<SiteSettings>(() => ({
    ...siteSettings,
    midGridBanners: siteSettings.midGridBanners || DEFAULT_STOREFRONT_BANNERS,
    promoPopup: siteSettings.promoPopup || DEFAULT_PROMO_POPUP,
    lookbookBanners: siteSettings.lookbookBanners || DEFAULT_LOOKBOOK_BANNERS,
    siteBackgroundTheme: siteSettings.siteBackgroundTheme || 'couture_craft',
    customBackgroundPatternOpacity: siteSettings.customBackgroundPatternOpacity ?? 0.12,
  }));

  // Synchronize when external siteSettings changes
  useEffect(() => {
    setFormData({
      ...siteSettings,
      midGridBanners: siteSettings.midGridBanners || DEFAULT_STOREFRONT_BANNERS,
      promoPopup: siteSettings.promoPopup || DEFAULT_PROMO_POPUP,
      lookbookBanners: siteSettings.lookbookBanners || DEFAULT_LOOKBOOK_BANNERS,
      siteBackgroundTheme: siteSettings.siteBackgroundTheme || 'couture_craft',
      customBackgroundPatternOpacity: siteSettings.customBackgroundPatternOpacity ?? 0.12,
    });
  }, [siteSettings]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editingLookbookId, setEditingLookbookId] = useState<string | null>(null);
  const [previewPopupOpen, setPreviewPopupOpen] = useState(false);

  // Selected customer for viewing history
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<CustomerUser | null>(null);

  // Wholesale VIP Partners whitelist state
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<CustomerUser | null>(null);
  const [partnerForm, setPartnerForm] = useState({
    fullName: '',
    phone: '',
    storeName: '',
    city: 'اصفهان',
    province: 'اصفهان',
    vipDiscountPercent: 15,
    wholesaleAccessNotes: '',
    isPartnerWholesale: true,
  });
  const [partnerToast, setPartnerToast] = useState<string | null>(null);

  const showPartnerToast = (msg: string) => {
    setPartnerToast(msg);
    setTimeout(() => setPartnerToast(null), 3500);
  };

  const handleTogglePartnerStatus = (partner: CustomerUser) => {
    if (onUpdateCustomerUser) {
      const updated = {
        ...partner,
        isPartnerWholesale: !partner.isPartnerWholesale,
        wholesaleAccessGrantedAt: partner.isPartnerWholesale ? partner.wholesaleAccessGrantedAt : 'امروز (فعال‌سازی مجدد)',
      };
      onUpdateCustomerUser(updated);
      showPartnerToast(
        updated.isPartnerWholesale 
          ? `دسترسی همکار «${partner.fullName}» فعال شد.` 
          : `دسترسی همکار «${partner.fullName}» موقتاً غیرفعال شد.`
      );
    }
  };

  const handleOpenAddPartner = () => {
    setPartnerForm({
      fullName: '',
      phone: '',
      storeName: '',
      city: 'تهران',
      province: 'تهران',
      vipDiscountPercent: 15,
      wholesaleAccessNotes: '',
      isPartnerWholesale: true,
    });
    setEditingPartner(null);
    setIsAddPartnerModalOpen(true);
  };

  const handleOpenEditPartner = (partner: CustomerUser) => {
    setEditingPartner(partner);
    setPartnerForm({
      fullName: partner.fullName,
      phone: partner.phone,
      storeName: partner.storeName || '',
      city: partner.city || 'تهران',
      province: partner.province || 'تهران',
      vipDiscountPercent: partner.vipDiscountPercent || 15,
      wholesaleAccessNotes: partner.wholesaleAccessNotes || '',
      isPartnerWholesale: partner.isPartnerWholesale ?? true,
    });
    setIsAddPartnerModalOpen(true);
  };

  const handleSavePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.phone.trim() || !partnerForm.fullName.trim()) {
      return;
    }
    const cleanPhone = partnerForm.phone.replace(/[^0-9]/g, '');

    if (editingPartner) {
      if (onUpdateCustomerUser) {
        onUpdateCustomerUser({
          ...editingPartner,
          fullName: partnerForm.fullName.trim(),
          phone: cleanPhone,
          storeName: partnerForm.storeName.trim() || 'فروشگاه / بنکداری',
          city: partnerForm.city.trim() || 'تهران',
          province: partnerForm.province.trim() || 'تهران',
          vipDiscountPercent: Number(partnerForm.vipDiscountPercent) || 15,
          wholesaleAccessNotes: partnerForm.wholesaleAccessNotes.trim(),
          isPartnerWholesale: partnerForm.isPartnerWholesale,
        });
        showPartnerToast(`اطلاعات همکار «${partnerForm.fullName}» با موفقیت به‌روزرسانی شد.`);
      }
    } else {
      if (onAddCustomerUser) {
        const newPartnerUser: CustomerUser = {
          id: `partner-${Date.now()}`,
          fullName: partnerForm.fullName.trim(),
          phone: cleanPhone,
          storeName: partnerForm.storeName.trim() || 'بنکداری / همکار',
          city: partnerForm.city.trim() || 'تهران',
          province: partnerForm.province.trim() || 'تهران',
          address: 'ثبت شده توسط مدیریت در پنل ادمین',
          isPartnerWholesale: partnerForm.isPartnerWholesale,
          vipDiscountPercent: Number(partnerForm.vipDiscountPercent) || 15,
          wholesaleAccessNotes: partnerForm.wholesaleAccessNotes.trim(),
          wholesaleAccessGrantedAt: 'امروز (ثبت از پنل)',
          registeredAt: 'امروز (ثبت از پنل ادمین)',
          totalOrdersCount: 0,
          totalSpentToman: 0,
        };
        onAddCustomerUser(newPartnerUser);
        showPartnerToast(`همکار جدید «${partnerForm.fullName}» با دسترسی VIP اضافه شد.`);
      }
    }
    setIsAddPartnerModalOpen(false);
    setEditingPartner(null);
  };

  const handleDeletePartner = (partner: CustomerUser) => {
    if (confirm(`آیا از حذف دسترسی همکار «${partner.fullName}» اطمینان دارید؟`)) {
      if (onDeleteCustomerUser) {
        onDeleteCustomerUser(partner.id);
      } else if (onUpdateCustomerUser) {
        onUpdateCustomerUser({ ...partner, isPartnerWholesale: false });
      }
      showPartnerToast(`همکار «${partner.fullName}» از فهرست همکاران حذف شد.`);
    }
  };

  const handlePromoteToWholesale = (user: CustomerUser) => {
    if (onUpdateCustomerUser) {
      onUpdateCustomerUser({
        ...user,
        isPartnerWholesale: true,
        wholesaleAccessGrantedAt: 'امروز (ارتقا از پنل)',
        vipDiscountPercent: 15,
        storeName: user.storeName || 'فروشگاه همکار',
      });
      showPartnerToast(`کاربر «${user.fullName}» به لیست همکاران VIP افزوده شد.`);
    }
  };

  const handleSaveSettings = (e?: React.FormEvent, customData?: SiteSettings) => {
    if (e) e.preventDefault();
    const dataToSave = customData || formData;
    onUpdateSiteSettings(dataToSave);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const showResetToast = (msg: string) => {
    setResetSuccessMessage(msg);
    setTimeout(() => setResetSuccessMessage(null), 3500);
  };

  // Reset Handlers for each tab
  const handleResetSiteInfo = () => {
    const updated: SiteSettings = {
      ...formData,
      brandName: INITIAL_SITE_SETTINGS.brandName,
      brandSubtitle: INITIAL_SITE_SETTINGS.brandSubtitle,
      mainAddress: INITIAL_SITE_SETTINGS.mainAddress,
      subwayAddress: INITIAL_SITE_SETTINGS.subwayAddress,
      primaryPhone: INITIAL_SITE_SETTINGS.primaryPhone,
      salesPhone: INITIAL_SITE_SETTINGS.salesPhone,
      supportPhone: INITIAL_SITE_SETTINGS.supportPhone,
      telegramChannel: INITIAL_SITE_SETTINGS.telegramChannel,
      telegramChannelUrl: INITIAL_SITE_SETTINGS.telegramChannelUrl,
      heroHeadline: INITIAL_SITE_SETTINGS.heroHeadline,
      heroSubheadline: INITIAL_SITE_SETTINGS.heroSubheadline,
      announcementNotice: INITIAL_SITE_SETTINGS.announcementNotice,
    };
    setFormData(updated);
    onUpdateSiteSettings(updated);
    showResetToast('اطلاعات، سربرگ و نشانی‌های وب‌سایت به مقادیر اولیه کارگاه بازنشانی شد.');
  };

  const handleResetLookbookBanners = () => {
    const updated = { ...formData, lookbookBanners: DEFAULT_LOOKBOOK_BANNERS };
    setFormData(updated);
    onUpdateSiteSettings(updated);
    showResetToast('بنرهای استایل و ژورنالی لوک‌بوک به حالت اولیه بازنشانی شد.');
  };

  const handleResetSiteTheme = () => {
    const updated: SiteSettings = {
      ...formData,
      siteBackgroundTheme: INITIAL_SITE_SETTINGS.siteBackgroundTheme || 'couture_craft',
      customBackgroundPatternOpacity: INITIAL_SITE_SETTINGS.customBackgroundPatternOpacity ?? 0.12,
    };
    setFormData(updated);
    onUpdateSiteSettings(updated);
    showResetToast('تم بصری و پس‌زمینه سایت به سبک پیش‌فرض خیاطی و وضوح ۱۲٪ بازنشانی شد.');
  };

  const handleResetDefaultBanners = () => {
    const updated = { ...formData, midGridBanners: DEFAULT_STOREFRONT_BANNERS };
    setFormData(updated);
    onUpdateSiteSettings(updated);
    showResetToast('بنرهای بین گریدها و تبلیغات ویژه به حالت استاندارد بازنشانی شد.');
  };

  const handleResetPromoPopup = () => {
    const updated = { ...formData, promoPopup: DEFAULT_PROMO_POPUP };
    setFormData(updated);
    onUpdateSiteSettings(updated);
    showResetToast('تنظیمات پاپ‌آپ حراج مناسبتی به حالت پیش‌فرض بازنشانی شد.');
  };

  const handleResetPricingPolicy = () => {
    const updated: SiteSettings = {
      ...formData,
      isRetailSaleActive: INITIAL_SITE_SETTINGS.isRetailSaleActive,
      minFreeShippingToman: INITIAL_SITE_SETTINGS.minFreeShippingToman,
    };
    setFormData(updated);
    onUpdateSiteSettings(updated);
    showResetToast('قوانین تک‌فروشی و سقف ارسال رایگان به مقادیر پیش‌فرض بازنشانی شد.');
  };

  const handleResetEntireStorefront = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید تمام تنظیمات ویترین، بنرها، پاپ‌آپ و تم پس‌زمینه را به حالت اولیه کارخانه بازنشانی کنید؟')) {
      setFormData(INITIAL_SITE_SETTINGS);
      onUpdateSiteSettings(INITIAL_SITE_SETTINGS);
      showResetToast('تمام بخش‌های ویترین سایت با موفقیت به تنظیمات اولیه بازنشانی شد.');
    }
  };

  const handleUpdatePromoPopup = (updates: Partial<OccasionPromoPopupConfig>) => {
    const current = formData.promoPopup || DEFAULT_PROMO_POPUP;
    const updatedPromo: OccasionPromoPopupConfig = {
      ...current,
      ...updates,
    };
    const updatedSettings = {
      ...formData,
      promoPopup: updatedPromo,
    };
    setFormData(updatedSettings);
    onUpdateSiteSettings(updatedSettings);
  };

  // Lookbook Banner CRUD Operations
  const handleUpdateLookbookBanner = (bannerId: string, updates: Partial<LookbookBannerItem>) => {
    const updatedLookbook = (formData.lookbookBanners || DEFAULT_LOOKBOOK_BANNERS).map(b =>
      b.id === bannerId ? { ...b, ...updates } : b
    );
    const updated = { ...formData, lookbookBanners: updatedLookbook };
    setFormData(updated);
    onUpdateSiteSettings(updated);
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
    onUpdateSiteSettings(updated);
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

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleResetEntireStorefront}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="بازنشانی تمام تنظیمات و بنرهای ویترین به حالت اولیه کارخانه"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>بازنشانی کل ویترین به پیش‌فرض</span>
            </button>

            <button
              onClick={onOpenLiveStorefront}
              className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-xs border border-[#3F3F46] cursor-pointer"
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
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'site_info'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#D4AF37]" />
            <span>اطلاعات و سربرگ سایت</span>
          </button>

          <button
            onClick={() => setActiveSubTab('storefront_stories')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'storefront_stories'
                ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Film className="w-4 h-4 text-[#D4AF37]" />
            <span>استوری‌های قطاری ویترین ({formData.storefrontStories?.length || 9})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('lookbook_banners')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'lookbook_banners'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>بنرهای استایل لوک‌بوک ({formData.lookbookBanners?.length || 8} اسلاید)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('site_theme')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'site_theme'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>پس‌زمینه و تم بصری فروشگاه</span>
          </button>

          <button
            onClick={() => setActiveSubTab('mid_grid_banners')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'mid_grid_banners'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>بنرهای بین گریدها ({activeBannersCount} فعال)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('promo_popup')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'promo_popup'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-500" />
            <span>
              پاپ‌آپ تخفیف مناسبتی {formData.promoPopup?.isActive ? '✨ (فعال)' : '(غیرفعال)'}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('wholesale_partners')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'wholesale_partners'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-500" />
            <span>دسترسی همکاران VIP ({customerUsers.filter(u => u.isPartnerWholesale).length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('registered_customers')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'pricing_policy'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Tag className="w-4 h-4 text-[#D4AF37]" />
            <span>تنظیمات تک‌فروشی و ارسال</span>
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

      {/* Reset Notification Toast */}
      {resetSuccessMessage && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <RotateCcw className="w-5 h-5 text-amber-700 shrink-0" />
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      {/* TAB: Storefront Train Stories Management */}
      {activeSubTab === 'storefront_stories' && (
        <StoryContentManager
          products={products}
          siteSettings={siteSettings}
          onUpdateSiteSettings={onUpdateSiteSettings}
        />
      )}

      {/* TAB: Lookbook Style Banners Management */}
      {activeSubTab === 'lookbook_banners' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 text-[#18181B] flex items-center justify-center font-black">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#18181B]">
                  مدیریت اسلایدر بنرهای استایل و لوک‌بوک فروشگاه
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                این بنرها به صورت ۴تایی در صفحه اصلی نمایش داده می‌شوند و با تایمر روان ورق می‌خورند. مدیر محتوا می‌تواند تیتر، تصویر، برچسب و دکمه هر اسلاید را ویرایش کند.
              </p>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={handleResetLookbookBanners}
                className="w-full sm:w-auto justify-center px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
                title="بازنشانی به بنرهای پیش‌فرض اولیه"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>بازنشانی به بنرهای اولیه</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveSettings()}
                className="w-full sm:w-auto justify-center px-5 py-2.5 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer order-1 sm:order-2"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                <span>ذخیره کلیه بنرهای لوک‌بوک</span>
              </button>
            </div>
          </div>

          {/* List of Lookbook Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(formData.lookbookBanners || DEFAULT_LOOKBOOK_BANNERS).map((item, index) => {
              const isEditing = editingLookbookId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isEditing ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-md' : 'border-[#E6DEC8] shadow-xs'
                  }`}
                >
                  <div className="p-4 flex items-center justify-between gap-3 bg-[#FAF7F2] border-b border-[#E6DEC8]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-[#18181B] text-[#D4AF37] text-xs font-mono font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-black text-xs text-[#18181B] truncate">{item.title}</h4>
                        <span className="text-[10px] text-stone-500 block truncate">دسته: {item.category} • بج: {item.badge}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingLookbookId(isEditing ? null : item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isEditing
                          ? 'bg-[#18181B] text-[#D4AF37]'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border border-[#DDD5C0]'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'بستن' : 'ویرایش اسلاید'}</span>
                    </button>
                  </div>

                  {/* Banner Card Preview */}
                  <div className="p-4">
                    <div className="relative rounded-xl overflow-hidden aspect-16/9 bg-stone-900 shadow-inner group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${item.bgGradient}`} />
                      <div className="absolute inset-0 p-3.5 flex flex-col justify-between text-white">
                        <div className="flex justify-between items-start">
                          <span className="bg-black/60 backdrop-blur-xs text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                          <span className="text-[10px] text-stone-300 font-mono bg-black/40 px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-black text-sm text-white drop-shadow-xs">{item.title}</h5>
                          <p className="text-[11px] text-stone-200 line-clamp-1 drop-shadow-xs mt-0.5">{item.shortFeature}</p>
                          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20">
                            <span>{item.ctaText}</span>
                            <span>←</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editing Panel */}
                  {isEditing && (
                    <div className="p-4 bg-stone-50 border-t border-[#E6DEC8] space-y-3 text-xs animate-in fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">تیتر اسلاید:</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateLookbookBanner(item.id, { title: e.target.value })}
                            className="w-full bg-white p-2 rounded-xl border border-[#DDD5C0] font-bold focus:border-[#18181B] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">دسته‌بندی مرتبط:</label>
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) => handleUpdateLookbookBanner(item.id, { category: e.target.value })}
                            className="w-full bg-white p-2 rounded-xl border border-[#DDD5C0] focus:border-[#18181B] outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">متن برچسب (بج بالا):</label>
                          <input
                            type="text"
                            value={item.badge}
                            onChange={(e) => handleUpdateLookbookBanner(item.id, { badge: e.target.value })}
                            className="w-full bg-white p-2 rounded-xl border border-[#DDD5C0] focus:border-[#18181B] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">متن دکمه (CTA):</label>
                          <input
                            type="text"
                            value={item.ctaText}
                            onChange={(e) => handleUpdateLookbookBanner(item.id, { ctaText: e.target.value })}
                            className="w-full bg-white p-2 rounded-xl border border-[#DDD5C0] focus:border-[#18181B] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">توضیح کوتاه ویژگی:</label>
                        <input
                          type="text"
                          value={item.shortFeature}
                          onChange={(e) => handleUpdateLookbookBanner(item.id, { shortFeature: e.target.value })}
                          className="w-full bg-white p-2 rounded-xl border border-[#DDD5C0] focus:border-[#18181B] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1 flex items-center justify-between">
                          <span>آدرس اینترنتی تصویر بنر (Image URL):</span>
                          <span className="text-[10px] text-stone-400 font-normal">ابعاد بهینه: 800x600 پیکسل</span>
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={item.image}
                          onChange={(e) => handleUpdateLookbookBanner(item.id, { image: e.target.value })}
                          className="w-full bg-white p-2 rounded-xl border border-[#DDD5C0] font-mono text-[11px] focus:border-[#18181B] outline-none"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleSaveSettings();
                            setEditingLookbookId(null);
                          }}
                          className="px-4 py-2 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>ذخیره تغییرات این اسلاید</span>
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

      {/* TAB: Visual Site Theme & Background Settings */}
      {activeSubTab === 'site_theme' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-400 text-white flex items-center justify-center font-black">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#18181B]">
                  تنظیمات پس‌زمینه و هویت بصری سایت (Background & Themes)
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                مدیر تولید محتوا می‌تواند پترن خیاطی و پوشاک پس‌زمینه، شدت محوشدگی (Opacity) و تم نوری را مستقیماً تنظیم کند.
              </p>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={handleResetSiteTheme}
                className="w-full sm:w-auto justify-center px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
                title="بازنشانی پس‌زمینه و تم به حالت اولیه خیاطی کلاسیک"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>بازنشانی تم پیش‌فرض</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveSettings()}
                className="w-full sm:w-auto justify-center px-5 py-2.5 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer order-1 sm:order-2"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                <span>ذخیره تم و پس‌زمینه</span>
              </button>
            </div>
          </div>

          {/* Theme Selection Cards */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <h4 className="font-black text-xs text-[#18181B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>انتخاب تم و سبک طراحی پس‌زمینه سایت:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  id: 'couture_craft',
                  title: 'دست‌ساز خیاطی کلاسیک (Couture Craft)',
                  desc: 'تم پیش‌فرض و گرم کارگاه من و تو با واتر‌مارک طلایی دوخت و پارچه',
                  bgPreview: 'bg-[#FAF8F5] border-amber-600/30',
                  badge: 'پیشنهاد اصلی',
                },
                {
                  id: 'gold_atelier',
                  title: 'آتلیه زرین لوکس (Gold Atelier)',
                  desc: 'توناژ غنی طلایی-کرم، مناسب کالکشن‌های مجلسی و مازراتی اعلا',
                  bgPreview: 'bg-[#FDFBF7] border-amber-500/50',
                  badge: 'مجلسی و فاخر',
                },
                {
                  id: 'minimal_silk',
                  title: 'ابریشم مینیمال مدرن (Minimal Silk)',
                  desc: 'پس‌زمینه مات بسیار ملایم با خطوط محو و تمرکز صددرصدی روی عکس کالا',
                  bgPreview: 'bg-[#FBFBFA] border-stone-300',
                  badge: 'مینیمال خنثی',
                },
                {
                  id: 'dark_luxury',
                  title: 'کنتراست دراماتیک (Dark Luxury Contrast)',
                  desc: 'واترمارک پرکنتراست با المان‌های درخشان و عمق بصری قوی',
                  bgPreview: 'bg-stone-100 border-stone-800/40',
                  badge: 'کنتراست بالا',
                },
              ].map((themeOpt) => {
                const isSelected = (formData.siteBackgroundTheme || 'couture_craft') === themeOpt.id;
                return (
                  <button
                    key={themeOpt.id}
                    type="button"
                    onClick={() => {
                      const updated = { ...formData, siteBackgroundTheme: themeOpt.id as SiteBackgroundTheme };
                      setFormData(updated);
                      onUpdateSiteSettings(updated);
                    }}
                    className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between gap-3 cursor-pointer whitespace-normal w-full ${
                      themeOpt.bgPreview
                    } ${
                      isSelected
                        ? 'border-[#18181B] ring-2 ring-[#D4AF37]/50 shadow-md scale-[1.02]'
                        : 'border-[#E6DEC8] hover:border-stone-400'
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 text-stone-700 whitespace-nowrap">
                          {themeOpt.badge}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#18181B] text-[#D4AF37] flex items-center justify-center text-xs font-black shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <h5 className="font-black text-xs text-[#18181B] mb-1 whitespace-normal break-words">{themeOpt.title}</h5>
                      <p className="text-[11px] text-stone-600 leading-relaxed whitespace-normal break-words">{themeOpt.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[11px] whitespace-normal">
                      <span className="text-stone-500 font-medium">وضعیت:</span>
                      <span className={`font-black ${isSelected ? 'text-[#18181B]' : 'text-stone-400'}`}>
                        {isSelected ? 'فعال در فروشگاه' : 'انتخاب این تم'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pattern Opacity Slider */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DDD5C0] space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <label className="font-bold text-xs text-stone-800 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#8C6D37]" />
                  <span>شدت وضوح واتر‌مارک پس‌زمینه پوشاک (Background Pattern Opacity):</span>
                </label>
                <span className="font-mono font-black text-xs text-[#18181B] bg-white px-2.5 py-1 rounded-lg border border-[#DDD5C0]">
                  {Math.round((formData.customBackgroundPatternOpacity ?? 0.12) * 100)}٪
                </span>
              </div>

              <input
                type="range"
                min="0.04"
                max="0.25"
                step="0.01"
                value={formData.customBackgroundPatternOpacity ?? 0.12}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const updated = { ...formData, customBackgroundPatternOpacity: val };
                  setFormData(updated);
                  onUpdateSiteSettings(updated);
                }}
                className="w-full accent-[#18181B] cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                <span>۴٪ (بسیار محو و نامحسوس)</span>
                <span>۱۲٪ (حالت پیشنهادی کارگاه)</span>
                <span>۲۵٪ (کاملاً واضح و پررنگ)</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveSettings()}
                className="px-6 py-2.5 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                <span>ذخیره و اعمال در کل فروشگاه</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Occasion Promo Popup Management */}
      {activeSubTab === 'promo_popup' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-[#F5E6A3] text-[#18181B] flex items-center justify-center font-black">
                  <Flame className="w-4 h-4 fill-[#18181B]" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#18181B]">
                  پاپ‌آپ تخفیف مناسبتی لندینگ (جنس خاص با آفر ویژه)
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                این پاپ‌آپ بلافاصله پس از ورود خریدار یا همکار به صفحه اول، روی شلوار یا جنس انتخابی شما تخفیف چشمگیر اعمال کرده و شمارش معکوس نشان می‌دهد.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setPreviewPopupOpen(true)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border border-stone-300"
              >
                <Eye className="w-4 h-4 text-[#8C6D37]" />
                <span>پیش‌نمایش زنده پاپ‌آپ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleUpdatePromoPopup({ isActive: !formData.promoPopup?.isActive });
                  handleSaveSettings();
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  formData.promoPopup?.isActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${formData.promoPopup?.isActive ? 'bg-white animate-ping' : 'bg-stone-400'}`} />
                <span>{formData.promoPopup?.isActive ? 'پاپ‌آپ در سایت فعال است' : 'پاپ‌آپ غیرفعال است'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetPromoPopup}
                className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-stone-200"
                title="بازنشانی اطلاعات پاپ‌آپ تخفیف به حالت پیش‌فرض اولیه"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                <span>بازنشانی پیش‌فرض</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveSettings()}
                className="px-5 py-2.5 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                <span>ذخیره تنظیمات</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="bg-gradient-to-r from-[#FAF7F2] to-white p-4 rounded-2xl border border-[#DDD5C0] space-y-2">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>قالب‌های آماده و مناسبتی (انتخاب سریع با یک کلیک):</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleUpdatePromoPopup({
                    occasionTitle: 'جشنواره تخفیف ویژه عید نوروز و سال نو',
                    subtitle: 'تخفیف استثنایی کارگاه اسدی روی مدل‌های نوبرانه بهاره بازار',
                    badgeText: '🌸 آفر عیدانه',
                    discountPercent: 30,
                    couponCode: 'NOWRUZ1404',
                    urgencyNote: 'ظرفیت سهمیه حراج عیدانه فقط تا پایان هفته معتبر است',
                    countdownHours: 72,
                    remainingStock: 18,
                  });
                }}
                className="p-2.5 text-right bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-400 rounded-xl transition-all group shadow-2xs"
              >
                <div className="text-xs font-black text-stone-800 group-hover:text-amber-900">🌸 جشنواره نوروز</div>
                <div className="text-[10px] text-stone-500">۳۰٪ تخفیف + کد NOWRUZ</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleUpdatePromoPopup({
                    occasionTitle: 'جشنواره حراج بزرگ آخر فصل تابستانه',
                    subtitle: 'کف قیمت بازار بزرگ تهران روی شلوارهای خنک کتان و بگ',
                    badgeText: '☀️ حراج تابستانه',
                    discountPercent: 25,
                    couponCode: 'SUMMER-OFF',
                    urgencyNote: 'فقط تا تخلیه کامل انبار کارگاه تولیدی با این نرخ عرضه می‌شود',
                    countdownHours: 48,
                    remainingStock: 12,
                  });
                }}
                className="p-2.5 text-right bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-400 rounded-xl transition-all group shadow-2xs"
              >
                <div className="text-xs font-black text-stone-800 group-hover:text-amber-900">☀️ حراج تابستانه</div>
                <div className="text-[10px] text-stone-500">۲۵٪ تخفیف + SUMMER-OFF</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleUpdatePromoPopup({
                    occasionTitle: 'جشنواره تخفیف اعیاد بازار بزرگ تهران',
                    subtitle: 'آفر اختصاصی کارگاه تولیدی من و تو برای بنکداران و همکاران سراسر کشور',
                    badgeText: '✨ هدیه اعیاد',
                    discountPercent: 20,
                    couponCode: 'EID-OFFER',
                    urgencyNote: 'تعداد بسته‌های تخفیف‌دار این مدل رو به اتمام است',
                    countdownHours: 36,
                    remainingStock: 15,
                  });
                }}
                className="p-2.5 text-right bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-400 rounded-xl transition-all group shadow-2xs"
              >
                <div className="text-xs font-black text-stone-800 group-hover:text-amber-900">✨ تخفیف اعیاد</div>
                <div className="text-[10px] text-stone-500">۲۰٪ تخفیف + EID-OFFER</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleUpdatePromoPopup({
                    occasionTitle: 'جشنواره بلک فرایدی (جمعه سیاه) پوشاک من و تو',
                    subtitle: 'بزرگترین تخفیف سال کارگاه روی تمام تیراژهای عمده و تک',
                    badgeText: '🖤 بلک فرایدی',
                    discountPercent: 35,
                    couponCode: 'BLACK-FRIDAY',
                    urgencyNote: 'آفر آتشین کارگاه اسدی فقط برای سفارش‌های ۲۴ ساعت آینده',
                    countdownHours: 24,
                    remainingStock: 9,
                  });
                }}
                className="p-2.5 text-right bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-400 rounded-xl transition-all group shadow-2xs"
              >
                <div className="text-xs font-black text-stone-800 group-hover:text-amber-900">🖤 بلک فرایدی</div>
                <div className="text-[10px] text-stone-500">۳۵٪ تخفیف + BLACK-FRIDAY</div>
              </button>
            </div>
          </div>

          {/* Detailed Config Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Form Inputs */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-5 text-xs">
              
              {/* Target Product Selection */}
              <div>
                <label className="block font-black text-stone-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#8C6D37]" />
                    <span>انتخاب جنس و محصول خاص برای تخفیف جشنواره:</span>
                  </span>
                  <span className="text-[11px] text-amber-700 font-bold">
                    ({products.length} محصول موجود در کاتالوگ)
                  </span>
                </label>

                <select
                  value={formData.promoPopup?.targetProductId || products[0]?.id}
                  onChange={(e) => handleUpdatePromoPopup({ targetProductId: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-[#DDD5C0] font-bold focus:bg-white focus:border-[#18181B] outline-none"
                >
                  {products.map((prod) => {
                    const wholesalePrice = prod.baseWholesalePricePerPack || 0;
                    const packCount = prod.packSize || 6;
                    const retailPrice = prod.retailPricePerUnit || (wholesalePrice ? Math.round(wholesalePrice / packCount) : 0);
                    return (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} ({prod.sku || ''}) — تک: {(retailPrice || 0).toLocaleString('fa-IR')} ت | پک {packCount}تایی: {(wholesalePrice || 0).toLocaleString('fa-IR')} ت
                      </option>
                    );
                  })}
                </select>
                <p className="text-[11px] text-stone-500 mt-1">
                  عکس، نام، کد و هر دو قیمت تک‌فروشی و پک عمده به همراه درصد تخفیف ویژه به طور خودکار در پاپ‌آپ محاسبه می‌گردد.
                </p>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">تیتر مناسبت / جشنواره:</label>
                  <input
                    type="text"
                    value={formData.promoPopup?.occasionTitle || ''}
                    onChange={(e) => handleUpdatePromoPopup({ occasionTitle: e.target.value })}
                    placeholder="مثال: جشنواره حراج ویژه عید نوروز"
                    className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-bold focus:bg-white focus:border-[#18181B] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">متن نشان / لیبل حراج (Badge):</label>
                  <input
                    type="text"
                    value={formData.promoPopup?.badgeText || ''}
                    onChange={(e) => handleUpdatePromoPopup({ badgeText: e.target.value })}
                    placeholder="مثال: 🌸 آفر عیدانه"
                    className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-bold focus:bg-white focus:border-[#18181B] outline-none"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">زیرعنوان و ارزش پیشنهادی جشنواره:</label>
                <input
                  type="text"
                  value={formData.promoPopup?.subtitle || ''}
                  onChange={(e) => handleUpdatePromoPopup({ subtitle: e.target.value })}
                  placeholder="مثال: تخفیف مستقیم کارگاه تولیدی اسدی روی پرفروش‌ترین شلوار راسته"
                  className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] focus:bg-white focus:border-[#18181B] outline-none"
                />
              </div>

              {/* Discount Percentage & Coupon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD5C0]">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-stone-800">درصد تخفیف مناسبتی:</label>
                    <span className="text-base font-black text-rose-600 font-mono">
                      %{formData.promoPopup?.discountPercent || 25}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={formData.promoPopup?.discountPercent || 25}
                    onChange={(e) => handleUpdatePromoPopup({ discountPercent: Number(e.target.value) })}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                    <span>5%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD5C0]">
                  <label className="block font-bold text-stone-800 mb-1">کد کوپن اختصاصی (اختیاری):</label>
                  <input
                    type="text"
                    value={formData.promoPopup?.couponCode || ''}
                    onChange={(e) => handleUpdatePromoPopup({ couponCode: e.target.value.toUpperCase() })}
                    placeholder="مثال: MANOTO-EID"
                    className="w-full bg-white text-xs p-2 rounded-xl border border-[#DDD5C0] font-mono font-black text-[#18181B] focus:border-[#18181B] outline-none"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    در صورت ثبت، دکمه کپی کد کوپن در پاپ‌آپ فعال می‌شود.
                  </p>
                </div>
              </div>

              {/* Urgency, Countdown, and Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">مدت زمان جشنواره (ساعت):</label>
                  <input
                    type="number"
                    min="1"
                    max="240"
                    value={formData.promoPopup?.countdownHours || 48}
                    onChange={(e) => handleUpdatePromoPopup({ countdownHours: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold focus:bg-white focus:border-[#18181B] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">موجودی باقی‌مانده (حس فوریت):</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formData.promoPopup?.remainingStock || 14}
                    onChange={(e) => handleUpdatePromoPopup({ remainingStock: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold focus:bg-white focus:border-[#18181B] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">متن فوریت و هشدار موجودی:</label>
                  <input
                    type="text"
                    value={formData.promoPopup?.urgencyNote || ''}
                    onChange={(e) => handleUpdatePromoPopup({ urgencyNote: e.target.value })}
                    placeholder="فقط تا پایان موجودی کارگاه"
                    className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] focus:bg-white focus:border-[#18181B] outline-none"
                  />
                </div>
              </div>

              {/* Custom Poster Image with Fallback to Site Default */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-[#8C6D37]" />
                    <span>تصویر یا بنر پوستر اختصاصی پاپ‌آپ (اختیاری):</span>
                  </label>
                  {formData.promoPopup?.customBannerImage && (
                    <button
                      type="button"
                      onClick={() => handleUpdatePromoPopup({ customBannerImage: '' })}
                      className="text-[11px] text-rose-600 hover:underline font-bold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>بازگشت به عکس پیش‌فرض سایت</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.promoPopup?.customBannerImage || ''}
                  onChange={(e) => handleUpdatePromoPopup({ customBannerImage: e.target.value })}
                  placeholder="آدرس اینترنتی (URL) عکس جدید یا خالی بگذارید"
                  dir="ltr"
                  className="w-full bg-white text-xs p-2.5 rounded-xl border border-[#DDD5C0] focus:border-[#18181B] outline-none text-left font-mono"
                />
                <p className="text-[10px] text-stone-500 leading-relaxed">
                  💡 چنانچه کاربر یا مدیر عکسی وارد نکند یا این کادر خالی باشد، تصویر اصلی و پیش‌فرض فعلی سایت به عنوان پوستر باقی می‌ماند.
                </p>
              </div>

              {/* Behavior Settings */}
              <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.promoPopup?.showOncePerSession ?? true}
                    onChange={(e) => handleUpdatePromoPopup({ showOncePerSession: e.target.checked })}
                    className="w-4 h-4 rounded-md accent-[#18181B] text-[#D4AF37]"
                  />
                  <span className="font-bold text-stone-800">
                    نمایش حداکثر یک‌بار در هر نشست (Show Once Per Session)
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  className="w-full sm:w-auto justify-center px-5 py-2.5 bg-[#18181B] text-[#FAF7F2] hover:bg-stone-800 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>ذخیره کلیه تنظیمات پاپ‌آپ</span>
                </button>
              </div>

            </div>

            {/* Right 1 Col: Visual Preview of the Promo Product Card */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DDD5C0] space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-stone-800 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>پیش‌نمایش جنس انتخاب‌شده</span>
                </span>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {formData.promoPopup?.discountPercent || 25}٪ تخفیف
                </span>
              </div>

              {(() => {
                const targetId = formData.promoPopup?.targetProductId;
                const p = products.find(prod => prod.id === targetId) || products[0];
                if (!p) return null;
                const discount = formData.promoPopup?.discountPercent || 25;
                const wholesalePackPrice = p.baseWholesalePricePerPack || 0;
                const packQty = p.packSize || 6;
                const retailBase = p.retailPricePerUnit || (wholesalePackPrice ? Math.round(wholesalePackPrice / packQty) : 0);
                const retailDiscounted = Math.round(retailBase * (1 - discount / 100));
                const wholesaleDiscounted = Math.round(wholesalePackPrice * (1 - discount / 100));

                return (
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#DDD5C0] shadow-xs space-y-3">
                    <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                      <img
                        src={p.galleryImages?.[0] || p.image || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-[#18181B]/90 backdrop-blur-md text-[#D4AF37] text-[10px] font-black px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                        {formData.promoPopup?.badgeText || 'آفر مناسبتی'}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2.5">
                      <div>
                        <div className="font-black text-stone-900 text-sm">{p.name}</div>
                        <div className="text-[10px] text-stone-500 font-mono">کد کالا: {p.sku} • جنس: {p.fabricType || 'پارچه اعلا'}</div>
                      </div>

                      <div className="space-y-1.5 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E6DEC8]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-600">نرخ تک‌فروشی با تخفیف:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="line-through text-stone-400 text-[10px]">
                              {(retailBase || 0).toLocaleString('fa-IR')}
                            </span>
                            <span className="font-black text-rose-600">
                              {(retailDiscounted || 0).toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-600">نرخ پک عمده ({packQty}تایی):</span>
                          <div className="flex items-center gap-1.5">
                            <span className="line-through text-stone-400 text-[10px]">
                              {(wholesalePackPrice || 0).toLocaleString('fa-IR')}
                            </span>
                            <span className="font-black text-emerald-700">
                              {(wholesaleDiscounted || 0).toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewPopupOpen(true)}
                        className="w-full py-2 bg-gradient-to-r from-[#8C6D37] via-[#D4AF37] to-[#F5E6A3] text-[#18181B] rounded-xl font-black text-xs hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مشاهده دقیق پنجره پاپ‌آپ</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

            </div>

          </div>

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
                            placeholder="مثال: ✨ ویژه بنکداران و همکاران سراسر کشور"
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 w-full">
            <button
              type="button"
              onClick={handleResetSiteInfo}
              className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-stone-300 cursor-pointer order-2 sm:order-1"
              title="بازنشانی اطلاعات، تلفن‌ها و آدرس‌های سربرگ به مقادیر اولیه کارگاه"
            >
              <RotateCcw className="w-4 h-4 text-stone-600" />
              <span>بازنشانی اطلاعات به مقادیر پیش‌فرض</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-6 py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 border border-[#3F3F46] cursor-pointer order-1 sm:order-2"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>ذخیره کلیه تنظیمات وب‌سایت</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: Authorized Wholesale VIP Partners Whitelist */}
      {activeSubTab === 'wholesale_partners' && (
        <div className="space-y-6">
          {/* Toast Notification */}
          {partnerToast && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{partnerToast}</span>
            </div>
          )}

          {/* 1. Header & Restriction Switch Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-[#F5E6A3] text-[#18181B] flex items-center justify-center shadow-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-[#18181B]">
                    مدیریت دسترسی همکاران VIP و بنکداران اختصاصی
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  تنها افرادی که در جدول زیر قرار دارند، می‌توانند در سایت از منوی «ورود همکاران» با وارد کردن نام و شماره تماس خود احراز هویت شده و به قیمت‌های عمده و چکی دسترسی یابند.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddPartner}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>افزودن همکار مجاز جدید</span>
              </button>
            </div>

            {/* Master Security Toggle */}
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-950">
                    محدودسازی ورود همکاران فقط به افراد تاییدشده در پنل ادمین
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    در صورت فعال بودن این گزینه، سیستم هنگام ورود همکاران شماره و نام واردشده را با لیست تاییدشده تطبیق داده و مانع ورود افراد متفرقه می‌شود.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextVal = !(formData.restrictWholesaleToAdminApproved ?? true);
                  const updated = { ...formData, restrictWholesaleToAdminApproved: nextVal };
                  setFormData(updated);
                  onUpdateSiteSettings(updated);
                  showPartnerToast(nextVal ? 'محدودسازی دسترسی همکاران فعال شد (توصیه‌شده).' : 'محدودسازی غیرفعال شد (ورود آزاد).');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  (formData.restrictWholesaleToAdminApproved ?? true)
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                }`}
              >
                {(formData.restrictWholesaleToAdminApproved ?? true) ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>محدودیت فعال است (امن)</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>ورود آزاد (غیرفعال)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={partnerSearchQuery}
                onChange={(e) => setPartnerSearchQuery(e.target.value)}
                placeholder="جستجو با نام، شماره تماس یا بنکداری..."
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-stone-800"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setPartnerStatusFilter('all')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  partnerStatusFilter === 'all'
                    ? 'bg-[#18181B] text-[#FAF7F2]'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                همه ({toPersianDigits(customerUsers.filter(u => u.isPartnerWholesale || u.wholesaleAccessGrantedAt).length)})
              </button>
              <button
                type="button"
                onClick={() => setPartnerStatusFilter('active')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  partnerStatusFilter === 'active'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                دسترسی فعال ({toPersianDigits(customerUsers.filter(u => u.isPartnerWholesale).length)})
              </button>
              <button
                type="button"
                onClick={() => setPartnerStatusFilter('inactive')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  partnerStatusFilter === 'inactive'
                    ? 'bg-stone-700 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                معلق / لغوشده ({toPersianDigits(customerUsers.filter(u => !u.isPartnerWholesale && Boolean(u.wholesaleAccessGrantedAt)).length)})
              </button>
            </div>
          </div>

          {/* 3. Authorized Partners Table */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs min-w-[620px]">
                <thead className="bg-[#FAF7F2] text-[#8C6D37] border-b border-[#E6DEC8] font-black">
                  <tr>
                    <th className="p-3.5">نام همکار</th>
                    <th className="p-3.5">شماره همراه (ورود به پرتال)</th>
                    <th className="p-3.5">فروشگاه / بنکداری</th>
                    <th className="p-3.5">شهر و استان</th>
                    <th className="p-3.5 text-center">تخفیف همکاری</th>
                    <th className="p-3.5 text-center">وضعیت دسترسی</th>
                    <th className="p-3.5 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customerUsers
                    .filter(u => u.isPartnerWholesale || Boolean(u.wholesaleAccessGrantedAt))
                    .filter(p => {
                      const q = partnerSearchQuery.trim().toLowerCase();
                      const matches = !q || 
                        (p.fullName && p.fullName.toLowerCase().includes(q)) ||
                        (p.phone && p.phone.includes(q)) ||
                        (p.storeName && p.storeName.toLowerCase().includes(q)) ||
                        (p.city && p.city.toLowerCase().includes(q));
                      if (partnerStatusFilter === 'active') return matches && p.isPartnerWholesale;
                      if (partnerStatusFilter === 'inactive') return matches && !p.isPartnerWholesale;
                      return matches;
                    })
                    .map((partner) => (
                      <tr key={partner.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="p-3.5 font-black text-stone-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
                              <Building2 className="w-3.5 h-3.5 text-[#8C6D37]" />
                            </div>
                            <div>
                              <span>{partner.fullName}</span>
                              {partner.wholesaleAccessNotes && (
                                <p className="text-[10px] text-stone-400 font-normal">
                                  {partner.wholesaleAccessNotes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-stone-800 font-bold" dir="ltr">
                          {toPersianDigits(partner.phone)}
                        </td>
                        <td className="p-3.5 text-stone-700 font-medium">
                          {partner.storeName || 'بنکداری / همکار'}
                        </td>
                        <td className="p-3.5 text-stone-600">
                          {partner.city || 'تهران'} {partner.province && partner.province !== partner.city ? `(${partner.province})` : ''}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="bg-amber-50 text-amber-900 border border-amber-200 font-black px-2 py-0.5 rounded-md text-[11px]">
                            {toPersianDigits(partner.vipDiscountPercent || 15)}٪
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePartnerStatus(partner)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              partner.isPartnerWholesale
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                            title="کلیک جهت فعال یا غیرفعال کردن دسترسی"
                          >
                            <span className={`w-2 h-2 rounded-full ${partner.isPartnerWholesale ? 'bg-emerald-600' : 'bg-stone-400'}`}></span>
                            <span>{partner.isPartnerWholesale ? 'مجاز (فعال)' : 'غیرفعال'}</span>
                          </button>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPartner(partner)}
                              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                              title="ویرایش مشخصات همکار"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePartner(partner)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="حذف همکار"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {customerUsers.filter(u => u.isPartnerWholesale || u.wholesaleAccessGrantedAt).length === 0 && (
                <div className="p-8 text-center text-stone-500 space-y-2">
                  <Building2 className="w-8 h-8 mx-auto text-stone-400" />
                  <p className="text-xs font-bold">هنوز هیچ همکار یا بنکدار اختصاصی ثبت نشده است.</p>
                  <p className="text-[11px] text-stone-400">
                    با کلیک روی دکمه «افزودن همکار مجاز جدید» اولین همکار مورد تایید را ثبت نمایید.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 4. Quick Promote Registered Customers */}
          {customerUsers.filter(u => !u.isPartnerWholesale).length > 0 && (
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC8] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#18181B] flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-[#8C6D37]" />
                    <span>اعطای سریع دسترسی به سایر خریداران ثبت‌نام‌شده</span>
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    کاربرانی که در سایت عضو شده‌اند ولی هنوز دسترسی همکار عمده برایشان فعال نشده است:
                  </p>
                </div>
                <span className="text-[11px] bg-white text-stone-700 px-2.5 py-1 rounded-xl border border-stone-200 font-bold">
                  {toPersianDigits(customerUsers.filter(u => !u.isPartnerWholesale).length)} خریدار عادی
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {customerUsers
                  .filter(u => !u.isPartnerWholesale)
                  .slice(0, 6)
                  .map((user) => (
                    <div key={user.id} className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-2 shadow-2xs">
                      <div>
                        <div className="text-xs font-black text-stone-900">{user.fullName}</div>
                        <div className="text-[10px] text-stone-500 font-mono" dir="ltr">{toPersianDigits(user.phone)}</div>
                        <div className="text-[10px] text-stone-400">{user.storeName || user.city}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePromoteToWholesale(user)}
                        className="px-2.5 py-1.5 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3 text-[#D4AF37]" />
                        <span>ارتقا به همکار VIP</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Modal: Add / Edit Authorized Partner */}
          {isAddPartnerModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
                <div className="bg-[#18181B] text-white p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="font-black text-sm text-white">
                      {editingPartner ? 'ویرایش مشخصات همکار VIP' : 'افزودن همکار مجاز جدید'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddPartnerModalOpen(false);
                      setEditingPartner(null);
                    }}
                    className="p-1 rounded-lg text-stone-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSavePartnerSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        نام و نام خانوادگی همکار:
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.fullName}
                        onChange={(e) => setPartnerForm({ ...partnerForm, fullName: e.target.value })}
                        placeholder="مثال: حاج داوود محمدی"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        شماره موبایل همکار (جهت ورود به سایت):
                      </label>
                      <input
                        type="tel"
                        required
                        value={partnerForm.phone}
                        onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                        placeholder="۰۹۱۲۱۱۱۴۵۸۹"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-stone-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        نام فروشگاه یا بنکداری:
                      </label>
                      <input
                        type="text"
                        value={partnerForm.storeName}
                        onChange={(e) => setPartnerForm({ ...partnerForm, storeName: e.target.value })}
                        placeholder="مثال: بنکداری اصفهان"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        شهر / بازار:
                      </label>
                      <input
                        type="text"
                        value={partnerForm.city}
                        onChange={(e) => setPartnerForm({ ...partnerForm, city: e.target.value })}
                        placeholder="مثال: اصفهان"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        درصد تخفیف همکاری (VIP):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={partnerForm.vipDiscountPercent}
                        onChange={(e) => setPartnerForm({ ...partnerForm, vipDiscountPercent: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        وضعیت دسترسی:
                      </label>
                      <select
                        value={partnerForm.isPartnerWholesale ? 'active' : 'inactive'}
                        onChange={(e) => setPartnerForm({ ...partnerForm, isPartnerWholesale: e.target.value === 'active' })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-stone-900 bg-white"
                      >
                        <option value="active">مجاز و فعال (امکان ورود به پرتال)</option>
                        <option value="inactive">معلق / غیرفعال</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      یادداشت‌های اختصاصی مدیریت:
                    </label>
                    <textarea
                      rows={2}
                      value={partnerForm.wholesaleAccessNotes}
                      onChange={(e) => setPartnerForm({ ...partnerForm, wholesaleAccessNotes: e.target.value })}
                      placeholder="توضیحات و شرایط همکاری، نوع تسویه، باربری..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-stone-900"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddPartnerModalOpen(false);
                        setEditingPartner(null);
                      }}
                      className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-bold transition-all"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-all shadow-sm"
                    >
                      {editingPartner ? 'ثبت تغییرات' : 'افزودن و فعال‌سازی دسترسی'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
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

          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#E6DEC8]">
            <button
              type="button"
              onClick={handleResetPricingPolicy}
              className="w-full sm:w-auto justify-center bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border border-stone-300 cursor-pointer order-2 sm:order-1"
              title="بازنشانی شرایط تک‌فروشی و حداقل ارسال رایگان به مقادیر پیش‌فرض"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
              <span>بازنشانی قوانین به مقادیر پیش‌فرض</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveSettings()}
              className="w-full sm:w-auto justify-center bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 border border-[#3F3F46] cursor-pointer order-1 sm:order-2"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>ذخیره قوانین فروش</span>
            </button>
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

      {/* Admin Live Preview of Occasion Promo Popup */}
      <OccasionPromoPopupModal
        isOpen={previewPopupOpen}
        onClose={() => setPreviewPopupOpen(false)}
        config={formData.promoPopup}
        product={products.find(p => p.id === formData.promoPopup?.targetProductId) || products[0]}
        onAddToCart={() => {}}
        onOpenCart={() => {}}
      />

    </div>
  );
};
