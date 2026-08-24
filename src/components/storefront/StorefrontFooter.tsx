import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Lock, 
  Send, 
  Navigation
} from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';
import { BRAND_INFO } from '../../data/brandInfo';

interface StorefrontFooterProps {
  onOpenAboutModal: () => void;
  onOpenRoutingModal: () => void;
  onOpenTracking: () => void;
  onOpenPartnerModal: () => void;
  onSwitchToAdmin: () => void;
}

export const StorefrontFooter: React.FC<StorefrontFooterProps> = ({
  onOpenAboutModal,
  onOpenRoutingModal,
  onOpenTracking,
  onOpenPartnerModal,
  onSwitchToAdmin
}) => {
  return (
    <footer className="bg-[#121214] text-white pt-12 pb-8 border-t border-stone-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-stone-400">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="bg-stone-900 border border-stone-800 p-3 rounded-2xl inline-block">
              <ManotoLogo variant="light" size="md" showPersianSub={false} />
            </div>

            <p className="text-stone-300 text-xs leading-relaxed">
              <strong>تولید و پخش پوشاک من و تو (مدیریت اسدی)</strong>: تولیدکننده تخصصی انواع شلوار زنانه (بگ، نیم‌بگ، راسته، جاگر، دمپا)، شومیز، مانتو و ست‌های راحتی با کیفیت برتر و ارسال مستقیم از بازار بزرگ تهران.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={BRAND_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-sky-600/20 border border-sky-500/30 hover:bg-sky-600 text-sky-300 hover:text-white flex items-center gap-1.5 transition-all font-bold text-xs"
                title="کانال رسمی تلگرام"
              >
                <Send className="w-3.5 h-3.5" />
                <span>کانال تلگرام @{BRAND_INFO.telegramUsername}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm pb-1 border-b border-stone-800">
              دسترسی سریع
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={onOpenTracking}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>سامانه پیگیری بیجک و بارنامه</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPartnerModal}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#B89B58]" />
                  <span>ورود همکاران و خریداران عمده</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenRoutingModal}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 font-bold text-stone-300 hover:text-white"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>نقشه، لوکیشن و مسیریابی در بازار</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAboutModal}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>آدرس دقیق پاساژ المهدی ۴ و تماس</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onSwitchToAdmin}
                  className="text-[#D4AF37] hover:text-white transition-colors flex items-center gap-1.5 font-bold pt-1"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>پرتال مدیریت و انبارداری بازار</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Logistics & Address */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm pb-1 border-b border-stone-800 flex items-center justify-between">
              <span>آدرس و لوکیشن بازار</span>
              {onOpenRoutingModal && (
                <button
                  type="button"
                  onClick={onOpenRoutingModal}
                  className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 font-bold"
                >
                  <Navigation className="w-3 h-3" />
                  <span>مسیریابی</span>
                </button>
              )}
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <button
                type="button"
                onClick={onOpenRoutingModal || onOpenAboutModal}
                className="w-full text-right bg-stone-900 hover:bg-stone-800/90 p-2.5 rounded-xl border border-stone-800 hover:border-[#D4AF37]/50 transition-all space-y-1 block group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#D4AF37] font-bold block text-[11px]">آدرس مغازه (بازار عباس‌آباد):</span>
                  <span className="text-[10px] text-emerald-400 group-hover:text-emerald-300 font-bold">بلد • نشان</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed group-hover:text-white transition-colors">
                  {BRAND_INFO.mainAddressFa}
                </p>
              </button>

              <button
                type="button"
                onClick={onOpenRoutingModal || onOpenAboutModal}
                className="w-full text-right bg-stone-900 hover:bg-stone-800/90 p-2.5 rounded-xl border border-stone-800 hover:border-[#D4AF37]/50 transition-all space-y-1 block group"
              >
                <span className="text-[#B89B58] font-bold block text-[11px]">مسیر دسترسی سریع با مترو:</span>
                <p className="text-[11px] text-stone-300 leading-relaxed group-hover:text-white transition-colors">
                  {BRAND_INFO.subwayRouteFa}
                </p>
              </button>
            </div>
          </div>

          {/* Col 4: Direct Phone Numbers */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm pb-1 border-b border-stone-800">
              تلفن‌های ثبت سفارش و استعلام
            </h4>
            <ul className="space-y-2 text-stone-300 text-xs">
              {BRAND_INFO.allPhones.map((ph, idx) => (
                <li key={idx}>
                  <a
                    href={`tel:${ph.phone}`}
                    className="bg-stone-900 hover:bg-stone-800 p-2.5 rounded-xl border border-stone-800 hover:border-[#D4AF37] flex items-center justify-between transition-all text-white font-bold group cursor-pointer"
                    title={`تماس مستقیم با ${ph.label}`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform flex-shrink-0" />
                      <span className="text-[11px] text-stone-300 group-hover:text-white truncate">{ph.label}:</span>
                    </div>
                    <span dir="ltr" className="text-[#D4AF37] group-hover:text-amber-300 font-black text-xs sm:text-sm tabular-nums tracking-wider font-['Vazirmatn',sans-serif]">
                      {ph.display}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="text-[11px] text-stone-400 font-sans pt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>پاسخگویی ۸:۳۰ الی ۱۹:۰۰ همه روزه</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <p>
            تمامی حقوق مادی و معنوی متعلق به <strong>موسسه تولید و پخش پوشاک من و تو (اسدی) - MANOTO DRESS</strong> می‌باشد.
          </p>
          <p className="flex items-center gap-1">
            <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[10px] font-mono">
              MANOTO DRESS v2.4
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
};
