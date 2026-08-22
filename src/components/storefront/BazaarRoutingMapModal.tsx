import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Compass, 
  Copy, 
  Check, 
  ExternalLink, 
  Train, 
  Car, 
  Footprints, 
  Clock, 
  Phone, 
  Layers, 
  Building2, 
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { BRAND_INFO } from '../../data/brandInfo';
import { ManotoLogo } from '../common/ManotoLogo';

interface BazaarRoutingMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BazaarRoutingMapModal: React.FC<BazaarRoutingMapModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'metro' | 'car' | 'passage'>('map');
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);

  if (!isOpen) return null;

  const handleCopyLocation = () => {
    const textToCopy = `${BRAND_INFO.brandNameFa}\n📍 ${BRAND_INFO.mainAddressFa}\nمختصات جغرافیایی: ${BRAND_INFO.coordinates.lat}, ${BRAND_INFO.coordinates.lng}\nلینک گوگل مپ: ${BRAND_INFO.coordinates.googleMapsUrl}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-fadeIn" 
      dir="rtl"
      id="modal-bazaar-routing"
    >
      <div className={`bg-[#FAF7F2] w-full rounded-3xl shadow-2xl border border-[#DDD5C0] overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreenMap ? 'max-w-6xl h-[95vh]' : 'max-w-3xl max-h-[92vh]'
      }`}>
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#E2D8C0] flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-xs flex-shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-stone-900 text-sm sm:text-base">
                  مسیریابی و لوکیشن در بازار بزرگ تهران
                </h3>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  پاساژ المهدی ۴
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                دفتر مرکزی و فروشگاه بنکداری پوشاک من و تو (مدیریت اسدی)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsFullscreenMap(!isFullscreenMap)}
              className="hidden sm:flex p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title={isFullscreenMap ? 'نمایش معمولی' : 'بزرگ‌نمایی پنجره'}
            >
              {isFullscreenMap ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              id="btn-close-routing-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#FAF7F2] border-b border-[#E6DEC8] px-3 sm:px-6 pt-2 overflow-x-auto scrollbar-none gap-1 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'map'
                ? 'bg-white text-[#18181B] border-[#18181B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#8C6D37]" />
            <span>نقشه تعاملی و اپلیکیشن‌ها</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metro')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'metro'
                ? 'bg-white text-[#18181B] border-[#18181B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <Train className="w-4 h-4 text-emerald-600" />
            <span>مسیر با مترو و پیاده‌روی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('passage')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'passage'
                ? 'bg-white text-[#18181B] border-[#18181B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#D4AF37]" />
            <span>راهنمای ورودی پاساژ و پلاک</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('car')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'car'
                ? 'bg-white text-[#18181B] border-[#18181B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <Car className="w-4 h-4 text-sky-600" />
            <span>خودرو و پارکینگ‌های اطراف</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-stone-700 leading-relaxed">
          
          {/* TAB 1: INTERACTIVE MAP & APP NAVIGATION */}
          {activeTab === 'map' && (
            <div className="space-y-5">
              
              {/* Official Address Banner */}
              <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                      <MapPin className="w-4 h-4 text-[#8C6D37] flex-shrink-0" />
                      <span>نشانی دقیق در نقشه بازار:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 font-bold leading-relaxed">
                      {BRAND_INFO.mainAddressFa}
                    </p>
                    <p className="text-[11px] text-stone-500 font-medium">
                      مختصات: <span className="font-mono text-stone-700 font-bold">{BRAND_INFO.coordinates.lat} N, {BRAND_INFO.coordinates.lng} E</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyLocation}
                    className="flex-shrink-0 bg-[#FAF7F2] hover:bg-[#F4ECE1] text-stone-800 border border-[#DDD5C0] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    title="کپی متن آدرس و مختصات"
                  >
                    {copiedCoords ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-600" />
                        <span>کپی آدرس</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive OpenStreetMap Embed */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#18181B]/10 shadow-md bg-stone-100 group">
                <div className="h-64 sm:h-80 w-full relative">
                  <iframe
                    title="نقشه بازار بزرگ تهران - پاساژ المهدی ۴"
                    src={BRAND_INFO.coordinates.osmEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>

                {/* Floating Map Overlay Header */}
                <div className="absolute top-3 right-3 left-3 bg-[#18181B]/90 backdrop-blur-md text-[#FAF7F2] p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-lg border border-stone-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold truncate">
                      موقعیت زنده در راسته بازار عباس‌آباد و حاج قاسم
                    </span>
                  </div>
                  <span className="text-[10px] text-[#D4AF37] font-mono bg-black/40 px-2 py-0.5 rounded-md flex-shrink-0">
                    پلاک ۲۴۲
                  </span>
                </div>

                {/* Bottom Quick Bar on Map */}
                <div className="absolute bottom-3 right-3 left-3 bg-white/95 backdrop-blur-md text-stone-800 p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-md border border-[#E6DEC8]">
                  <div className="text-[11px] font-bold truncate">
                    📍 پاساژ المهدی ۴ • طبقه منفی یک
                  </div>
                  <a
                    href={BRAND_INFO.coordinates.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors flex-shrink-0"
                  >
                    <span>گوگل مپ</span>
                    <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                  </a>
                </div>
              </div>

              {/* 1-Click Routing Buttons in Iranian and Global Navigation Apps */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-[#8C6D37]" />
                    <span>مسیریابی مستقیم با اپلیکیشن‌های گوشی:</span>
                  </h4>
                  <span className="text-[11px] text-stone-500">انتخاب اپ دلخواه</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* 1. Google Maps */}
                  <a
                    href={BRAND_INFO.coordinates.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-[#FAF7F2] p-3 rounded-2xl border border-[#DDD5C0] hover:border-[#18181B] text-center transition-all shadow-xs group flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">
                      🗺️
                    </div>
                    <span className="font-black text-xs text-stone-900">Google Maps</span>
                    <span className="text-[10px] text-stone-500">گوگل مپ</span>
                  </a>

                  {/* 2. Neshan */}
                  <a
                    href={BRAND_INFO.coordinates.neshanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-[#FAF7F2] p-3 rounded-2xl border border-[#DDD5C0] hover:border-blue-500 text-center transition-all shadow-xs group flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">
                      🔵
                    </div>
                    <span className="font-black text-xs text-stone-900">نشان (Neshan)</span>
                    <span className="text-[10px] text-stone-500">مسیریاب ایرانی</span>
                  </a>

                  {/* 3. Balad */}
                  <a
                    href={BRAND_INFO.coordinates.baladUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-[#FAF7F2] p-3 rounded-2xl border border-[#DDD5C0] hover:border-emerald-500 text-center transition-all shadow-xs group flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">
                      🟢
                    </div>
                    <span className="font-black text-xs text-stone-900">بلد (Balad)</span>
                    <span className="text-[10px] text-stone-500">مسیریاب ایرانی</span>
                  </a>

                  {/* 4. Waze */}
                  <a
                    href={BRAND_INFO.coordinates.wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-[#FAF7F2] p-3 rounded-2xl border border-[#DDD5C0] hover:border-indigo-500 text-center transition-all shadow-xs group flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">
                      🚗
                    </div>
                    <span className="font-black text-xs text-stone-900">ویز (Waze)</span>
                    <span className="text-[10px] text-stone-500">مسیریابی هوشمند</span>
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: METRO & WALKING GUIDE */}
          {activeTab === 'metro' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Train className="w-4 h-4 text-emerald-700" />
                  <span>سریع‌ترین و خلوت‌ترین راه دسترسی (بدون ترافیک بازار):</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  با توجه به قرارگیری بازار بزرگ تهران در محدوده طرح ترافیک، استفاده از خطوط مترو بهترین و سریع‌ترین روش برای مراجعه حضوری است.
                </p>
              </div>

              {/* Metro Stations List */}
              <div className="space-y-3">
                {/* Station 1: Khayam */}
                <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-black text-xs">
                        خط ۱
                      </div>
                      <h4 className="font-black text-stone-900 text-xs sm:text-sm">
                        ایستگاه مترو خیام (نزدیک‌ترین مسیر)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">
                      ۵ دقیقه پیاده‌روی
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    پس از خروج از ایستگاه مترو خیام، وارد راسته خیابان خیام شوید، به سمت بازار حاج قاسم حرکت کنید. پاساژ المهدی ۴ در ابتدای راسته واقع شده است.
                  </p>
                </div>

                {/* Station 2: Mohammadieh */}
                <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                        ۱ و ۷
                      </div>
                      <h4 className="font-black text-stone-900 text-xs sm:text-sm">
                        ایستگاه مترو میدان محمدیه (تقاطع خط ۱ و ۷)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">
                      ۷ دقیقه پیاده‌روی
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {BRAND_INFO.subwayRouteFa}
                  </p>
                </div>

                {/* Station 3: 15 Khordad */}
                <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-black text-xs">
                        خط ۱
                      </div>
                      <h4 className="font-black text-stone-900 text-xs sm:text-sm">
                        ایستگاه مترو ۱۵ خرداد
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">
                      ۱۰ دقیقه پیاده‌روی
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    از سمت سبزه میدان و بازار کفاش‌ها وارد راسته بازار عباس‌آباد شوید و به سمت پاساژ المهدی ۴ حرکت کنید.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INSIDE PASSAGE & SHOP UNIT */}
          {activeTab === 'passage' && (
            <div className="space-y-4">
              <div className="bg-[#18181B] text-[#FAF7F2] p-5 rounded-3xl shadow-md space-y-3 border border-[#3F3F46]">
                <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                  <span>راهنمای ورود به پاساژ المهدی ۴:</span>
                </div>
                
                <div className="space-y-2 text-xs text-stone-300">
                  <div className="flex items-start gap-2">
                    <span className="bg-[#D4AF37] text-[#18181B] font-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      ۱
                    </span>
                    <p>ورود از درب شماره یک پاساژ المهدی ۴ در راسته بازار حاج قاسم / عباس‌آباد.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-[#D4AF37] text-[#18181B] font-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      ۲
                    </span>
                    <p>استفاده از پله‌های ورودی یا آسانسور جهت رفتن به <strong>طبقه منفی یک (زیرزمین اول)</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-[#D4AF37] text-[#18181B] font-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      ۳
                    </span>
                    <p>حرکت در راهروی اصلی به سمت <strong>پلاک ۲۴۲ — تابلوی تولید و پخش پوشاک من و تو (اسدی)</strong>.</p>
                  </div>
                </div>
              </div>

              {/* Working Hours Alert */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h5 className="font-black text-amber-950">ساعات پذیرش مراجعین حضوری بنکداری:</h5>
                  <p className="text-amber-900 leading-relaxed">
                    همه روزه از ساعت <strong>۸:۳۰ صبح الی ۱۹:۰۰ عصر</strong> (پنج‌شنبه‌ها تا ساعت ۱۵:۰۰). جمعه‌ها بازار بزرگ تهران و پاساژ تعطیل می‌باشد.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAR & PARKING */}
          {activeTab === 'car' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl text-sky-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Car className="w-4 h-4 text-sky-700" />
                  <span>اطلاعات پارکینگ و تردد با خودرو شخصی:</span>
                </div>
                <p className="text-xs text-sky-900 leading-relaxed">
                  محدوده بازار تهران داخل طرح ترافیک و زوج و فرد قرار دارد. در صورت تردد با خودرو شخصی، پیشنهاد می‌شود از پارکینگ‌های طبقاتی زیر استفاده فرمایید:
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="bg-white p-3.5 rounded-2xl border border-[#E6DEC8] shadow-xs flex items-center justify-between">
                  <div>
                    <h5 className="font-black text-stone-900 text-xs">پارکینگ عمومی ناصرخسرو و خیام</h5>
                    <p className="text-[11px] text-stone-500">نزدیک به خیابان پانزده خرداد و مترو خیام</p>
                  </div>
                  <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-1 rounded-xl">
                    ظرفیت بالا
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#E6DEC8] shadow-xs flex items-center justify-between">
                  <div>
                    <h5 className="font-black text-stone-900 text-xs">پارکینگ طبقاتی مصطفی خمینی (سرچشمه)</h5>
                    <p className="text-[11px] text-stone-500">مناسب مراجعین سمت شرق و چهارراه سیروس</p>
                  </div>
                  <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-1 rounded-xl">
                    طبقاتی
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Call Actions */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#E2D8C0] flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0">
          <div className="text-xs text-stone-600 font-medium text-center sm:text-right">
            <span>نیاز به راهنمایی تلفنی دارید؟ </span>
            <span className="font-bold text-stone-900">قبل از حرکت تماس بگیرید:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${BRAND_INFO.primaryPhone}`}
              className="flex-1 sm:flex-none bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{BRAND_INFO.primaryPhoneDisplay}</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none bg-[#FAF7F2] hover:bg-[#F4ECE1] text-stone-800 border border-[#DDD5C0] px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              بستن پنجره
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
