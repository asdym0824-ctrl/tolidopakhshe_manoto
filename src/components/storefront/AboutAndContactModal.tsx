import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Truck, 
  Send, 
  QrCode,
  Navigation,
  Globe,
  Copy,
  Check,
  Train
} from 'lucide-react';
import { BRAND_INFO } from '../../data/brandInfo';

interface AboutAndContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'all' | 'map' | 'metro';
  onOpenRoutingModal?: () => void;
}

export const AboutAndContactModal: React.FC<AboutAndContactModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'all'
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'all' | 'map' | 'metro'>(initialTab);

  // Sync tab when initialTab changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveViewTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleCopyAddress = () => {
    const textToCopy = `${BRAND_INFO.brandNameFa} (اسدی)\n📍 ${BRAND_INFO.mainAddressFa}\n📞 ${BRAND_INFO.primaryPhoneDisplay}\nمسیریابی نشان: ${BRAND_INFO.coordinates.neshanUrl}\nمسیریابی بلد: ${BRAND_INFO.coordinates.baladUrl}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn" 
      dir="rtl"
      id="modal-about-contact"
    >
      <div className="bg-[#FAF7F2] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#DDD5C0] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2D8C0] flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-xs flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-stone-900 text-sm sm:text-base">
                  تماس، آدرس مغازه و شناسنامه کارگاه
                </h3>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                  بازار بزرگ تهران
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-bold">
                تولید و پخش پوشاک من و تو (مدیریت اسدی) • پاساژ المهدی ۴ پلاک ۲۴۲
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-about-modal"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tab Selection */}
        <div className="flex items-center bg-[#FAF7F2] border-b border-[#E6DEC8] px-4 sm:px-6 pt-2 overflow-x-auto gap-2 flex-shrink-0">
          <button
            type="button"
            id="tab-btn-workshop-info"
            onClick={() => setActiveViewTab('all')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeViewTab === 'all'
                ? 'bg-white text-[#18181B] border-[#18181B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#8C6D37]" />
            <span>شناسنامه کارگاه، آدرس و تماس</span>
          </button>

          <button
            type="button"
            id="tab-btn-routing-map"
            onClick={() => setActiveViewTab('map')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeViewTab === 'map'
                ? 'bg-white text-[#18181B] border-[#18181B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <Navigation className="w-4 h-4 text-[#D4AF37]" />
            <span>مسیریابی با بلد، نشان و نقشه</span>
          </button>

          <button
            type="button"
            id="tab-btn-metro-guide"
            onClick={() => setActiveViewTab('metro')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeViewTab === 'metro'
                ? 'bg-white text-[#18181B] border-[#18181B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <Train className="w-4 h-4 text-emerald-600" />
            <span>راهنمای مترو و دسترسی سریع</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-stone-700 leading-relaxed">

          {/* TAB 1: WORKSHOP IDENTITY, SHOP ADDRESS & CONTACT INFO */}
          {activeViewTab === 'all' && (
            <div className="space-y-6">
              {/* SECTION: OFFICIAL WORKSHOP IDENTITY CARD (شناسنامه کارگاه) */}
              <div className="bg-[#18181B] text-[#FAF7F2] rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4 border border-[#3F3F46]">
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#D4AF37] text-stone-950 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        شناسنامه رسمی کارگاه و تولیدی
                      </span>
                      <span className="text-[10px] bg-white/10 text-stone-300 font-bold px-2 py-0.5 rounded-full border border-white/10">
                        کد صنفی بازار تهران
                      </span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black text-white pt-1">
                      تولید و پخش پوشاک من و تو <span className="text-[#D4AF37] font-light text-lg">(اسدی)</span>
                    </h4>
                    <p className="text-xs text-stone-300 font-medium leading-relaxed">
                      تولیدکننده تخصصی انواع شلوار زنانه (بگ، نیم‌بگ کتان، کارگو، جاگر، مازراتی، راحتی نخی)، شومیز و ست‌های مجلسی با امکان سفارش بسته‌ای عمده و تک.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-2xl shadow-sm text-center flex-shrink-0 self-center sm:self-auto border border-[#E6DEC8]">
                    <QrCode className="w-14 h-14 text-[#18181B] mx-auto" />
                    <span className="text-[9px] text-stone-700 font-black block mt-1">
                      اسکن تلگرام تولیدی
                    </span>
                  </div>
                </div>

                {/* Workshop Specs Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-800 text-[11px]">
                  <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 text-center">
                    <span className="text-stone-400 block text-[10px]">مدیریت مجموعه:</span>
                    <span className="font-bold text-white">آقای اسدی</span>
                  </div>
                  <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 text-center">
                    <span className="text-stone-400 block text-[10px]">دفتر و شو‌روم:</span>
                    <span className="font-bold text-[#D4AF37]">پاساژ المهدی ۴ (پلاک ۲۴۲)</span>
                  </div>
                  <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 text-center">
                    <span className="text-stone-400 block text-[10px]">نحوه ارسال:</span>
                    <span className="font-bold text-emerald-400">باربری وطن، تیپاکس، چاپار</span>
                  </div>
                  <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 text-center">
                    <span className="text-stone-400 block text-[10px]">پذیرش سفارشات:</span>
                    <span className="font-bold text-amber-300">عمده بسته‌ای + تکی</span>
                  </div>
                </div>

                {/* Direct Call Numbers */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-stone-300 block mb-2">
                    تلفن‌های تماس مستقیم جهت استعلام موجودی، قیمت عمده و هماهنگی خرید:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {BRAND_INFO.allPhones.map((ph, idx) => (
                      <a
                        key={idx}
                        href={`tel:${ph.phone}`}
                        className="bg-stone-900 hover:bg-stone-800 p-2.5 rounded-xl text-center font-bold text-white transition-all flex items-center justify-between gap-1.5 border border-stone-700 hover:border-[#D4AF37]"
                      >
                        <span className="text-[11px] font-sans text-stone-400">{ph.label}:</span>
                        <div className="flex items-center gap-1.5 text-[#D4AF37]">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                          <span dir="ltr" className="text-xs sm:text-sm font-black tracking-wider tabular-nums font-['Vazirmatn',sans-serif]">
                            {ph.display}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: PHYSICAL SHOP ADDRESSES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-stone-900 text-sm">
                    <MapPin className="w-4 h-4 text-[#8C6D37]" />
                    <span>آدرس دقیق مغازه و دفتر فروش در بازار بزرگ تهران:</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="text-[11px] bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C0] px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-500" />
                        <span>کپی آدرس</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Address 1 */}
                  <div className="bg-white p-4 rounded-2xl border border-[#DDD5C0] space-y-2 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                      <Building2 className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>نشانی اصلی فروشگاه (بازار عباس‌آباد):</span>
                    </div>
                    <p className="text-xs text-stone-800 leading-relaxed font-bold">
                      {BRAND_INFO.mainAddressFa}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      راهنمای پاساژ: ورودی شماره یک، پله‌ها یا آسانسور به طبقه منفی یک، راهروی اصلی پلاک ۲۴۲ (تولید و پخش من و تو اسدی)
                    </p>
                  </div>

                  {/* Address 2 (Metro Route) */}
                  <div className="bg-white p-4 rounded-2xl border border-[#DDD5C0] space-y-2 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                      <Train className="w-3.5 h-3.5 text-emerald-600" />
                      <span>مسیر دسترسی با مترو (۵ تا ۷ دقیقه):</span>
                    </div>
                    <p className="text-xs text-stone-800 leading-relaxed font-medium">
                      {BRAND_INFO.subwayRouteFa}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      نزدیک‌ترین ایستگاه: <strong>مترو خیام (خط ۱)</strong> یا <strong>مترو میدان محمدیه (تقاطع خط ۱ و ۷)</strong>
                    </p>
                  </div>
                </div>

                {/* English International Address */}
                <div className="bg-white p-3 rounded-2xl border border-[#DDD5C0] text-left space-y-1" dir="ltr">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-900">
                    <Globe className="w-3.5 h-3.5 text-[#8C6D37]" />
                    <span className="font-serif">Manoto Dress — Tehran Grand Bazaar Address:</span>
                  </div>
                  <p className="text-xs text-stone-600 font-mono">
                    {BRAND_INFO.addressEn}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT 1-CLICK ROUTING WITH BALAD, NESHAN & MAP */}
          {activeViewTab === 'map' && (
            <div className="space-y-5 animate-fadeIn">
              {/* SECTION: DIRECT 1-CLICK NAVIGATION APPS (بلد و نشان) */}
              <div className="bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-stone-800 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#D4AF37] text-stone-950 flex items-center justify-center font-black">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm sm:text-base">
                        مسیریابی مستقیم با ۱ کلیک در اپلیکیشن‌های گوشی
                      </h4>
                      <p className="text-[11px] text-stone-300">
                        مستقیماً به لوکیشن پاساژ المهدی ۴ (پلاک ۲۴۲) هدایت شوید:
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="bg-stone-800 hover:bg-stone-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto border border-stone-700 shadow-xs"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">آدرس کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-300" />
                        <span>کپی آدرس و شماره</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct 1-Click Iranian & Global Navigators Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {/* 1. Balad (بلد) */}
                  <a
                    href={BRAND_INFO.coordinates.baladUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-2xl text-center transition-all shadow-md group flex flex-col items-center justify-center gap-1 border border-emerald-400"
                    id="btn-route-balad"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white text-emerald-700 flex items-center justify-center font-black text-base shadow-xs group-hover:scale-110 transition-transform">
                      🟢
                    </div>
                    <span className="font-black text-xs">مسیریاب بلد (Balad)</span>
                    <span className="text-[10px] text-emerald-100 font-medium">باز کردن در بلد</span>
                  </a>

                  {/* 2. Neshan (نشان) */}
                  <a
                    href={BRAND_INFO.coordinates.neshanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl text-center transition-all shadow-md group flex flex-col items-center justify-center gap-1 border border-blue-400"
                    id="btn-route-neshan"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white text-blue-700 flex items-center justify-center font-black text-base shadow-xs group-hover:scale-110 transition-transform">
                      🔵
                    </div>
                    <span className="font-black text-xs">مسیریاب نشان (Neshan)</span>
                    <span className="text-[10px] text-blue-100 font-medium">باز کردن در نشان</span>
                  </a>

                  {/* 3. Google Maps */}
                  <a
                    href={BRAND_INFO.coordinates.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-stone-100 text-stone-900 p-3 rounded-2xl text-center transition-all shadow-md group flex flex-col items-center justify-center gap-1 border border-stone-300"
                    id="btn-route-google-maps"
                  >
                    <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black text-base shadow-xs group-hover:scale-110 transition-transform">
                      🗺️
                    </div>
                    <span className="font-black text-xs">Google Maps</span>
                    <span className="text-[10px] text-stone-500 font-medium">گوگل مپ</span>
                  </a>

                  {/* 4. Waze */}
                  <a
                    href={BRAND_INFO.coordinates.wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-700 hover:bg-sky-600 text-white p-3 rounded-2xl text-center transition-all shadow-md group flex flex-col items-center justify-center gap-1 border border-sky-500"
                    id="btn-route-waze"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white text-sky-800 flex items-center justify-center font-black text-base shadow-xs group-hover:scale-110 transition-transform">
                      🚗
                    </div>
                    <span className="font-black text-xs">ویز (Waze)</span>
                    <span className="text-[10px] text-sky-200 font-medium">مسیریابی هوشمند</span>
                  </a>
                </div>
              </div>

              {/* Map Preview */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-stone-800 shadow-md bg-stone-100">
                <div className="h-64 sm:h-72 w-full relative">
                  <iframe
                    title="نقشه بازار بزرگ تهران - پاساژ المهدی ۴"
                    src={BRAND_INFO.coordinates.osmEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>

                <div className="absolute top-3 right-3 left-3 bg-[#18181B]/90 backdrop-blur-md text-[#FAF7F2] p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-lg border border-stone-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold truncate">
                      موقعیت زنده در راسته بازار عباس‌آباد و پاساژ المهدی ۴
                    </span>
                  </div>
                  <span className="text-[10px] text-[#D4AF37] font-mono bg-black/40 px-2 py-0.5 rounded-md flex-shrink-0">
                    پلاک ۲۴۲
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: METRO & ACCESS GUIDE */}
          {activeViewTab === 'metro' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-emerald-950 flex items-start gap-3">
                <Train className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h5 className="font-black text-emerald-950">
                    بهترین راه مراجعه بدون ماندن در ترافیک بازار:
                  </h5>
                  <p className="text-emerald-900 leading-relaxed">
                    با مترو خط ۱ (قرمز) در <strong>ایستگاه خیام</strong> یا <strong>ایستگاه میدان محمدیه</strong> پیاده شوید. پس از ۵ دقیقه پیاده‌روی در راسته خیام وارد پاساژ المهدی ۴ خواهید شد.
                  </p>
                </div>
              </div>

              {/* Working Hours & Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-[#DDD5C0] space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                    <Clock className="w-4 h-4 text-[#8C6D37]" />
                    <span>ساعات کاری و پاسخگویی مغازه:</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    شنبه تا چهارشنبه: ۸:۳۰ صبح الی ۱۹:۰۰ عصر<br />
                    پنج‌شنبه‌ها: ۸:۳۰ صبح الی ۱۵:۰۰ بعدازظهر (جمعه‌ها تعطیل)
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#DDD5C0] space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                    <Truck className="w-4 h-4 text-[#8C6D37]" />
                    <span>تحویل و ارسال به سراسر کشور:</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    ارسال روزانه با باربری وطن (شوش)، پیام‌گیر، تیپاکس و چاپار به تمام استان‌ها و شهرستان‌ها
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Social Channels Link */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[#E6DEC8]">
            <div className="flex items-center gap-2">
              <a
                href={BRAND_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>کانال تلگرام (@{BRAND_INFO.telegramUsername})</span>
              </a>
            </div>

            <span className="text-[11px] text-stone-500 font-bold">
              مدیریت: اسدی • بازار بزرگ تهران
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#E2D8C0] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${BRAND_INFO.primaryPhone}`}
              className="bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Phone className="w-4 h-4 text-[#18181B]" />
              <span>تماس مستقیم:</span>
              <span dir="ltr" className="font-black tabular-nums tracking-wider">{BRAND_INFO.primaryPhoneDisplay}</span>
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="bg-[#FAF7F2] hover:bg-[#F4ECE1] text-stone-800 border border-[#DDD5C0] px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>
  );
};
