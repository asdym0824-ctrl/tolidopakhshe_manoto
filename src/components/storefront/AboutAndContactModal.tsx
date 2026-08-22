import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Send, 
  QrCode,
  Award,
  Navigation,
  Globe
} from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';
import { BRAND_INFO } from '../../data/brandInfo';

interface AboutAndContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRoutingModal?: () => void;
}

export const AboutAndContactModal: React.FC<AboutAndContactModalProps> = ({
  isOpen,
  onClose,
  onOpenRoutingModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn" dir="rtl">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#DDD5C0] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2D8C0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <ManotoLogo size="sm" showPersianSub={false} />
            <div className="border-r border-stone-200 pr-3">
              <h3 className="font-black text-stone-900 text-sm sm:text-base">
                شناسنامه و راه‌های ارتباطی
              </h3>
              <p className="text-[11px] text-pink-700 font-bold">
                تولید و پخش پوشاک من و تو (اسدی)
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

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-stone-700 leading-relaxed">
          
          {/* Identity Card (Inspired by Physical Business Card) */}
          <div className="bg-[#18181B] text-[#FAF7F2] rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4 border border-[#3F3F46]">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div>
                <span className="text-[10px] bg-[#FAF7F2]/15 text-[#D4AF37] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#D4AF37]/30">
                  کارت ویزیت رسمی دفتر بازار
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
                  تولید و پخش پوشاک من و تو <span className="text-[#D4AF37] font-light text-lg">(اسدی)</span>
                </h4>
                <p className="text-xs text-stone-300 font-medium mt-0.5">
                  تولیدکننده انواع شلوار، شومیز، مانتو و پوشاک زنانه بازار بزرگ تهران
                </p>
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-sm text-center flex-shrink-0 self-center sm:self-auto border border-[#E6DEC8]">
                <QrCode className="w-12 h-12 text-[#18181B] mx-auto" />
                <span className="text-[9px] text-stone-600 font-bold block mt-1">
                  اسکن تلگرام تولیدی
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              {BRAND_INFO.allPhones.map((ph, idx) => (
                <a
                  key={idx}
                  href={`tel:${ph.phone}`}
                  className="bg-stone-900/90 hover:bg-stone-800 p-2 rounded-xl text-center font-bold text-white transition-colors flex items-center justify-center gap-1.5 border border-stone-800"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{ph.display}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Official Location Addresses */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-black text-stone-900 text-sm">
                <MapPin className="w-4 h-4 text-[#8C6D37]" />
                <span>نشانی شعب و دفاتر در بازار بزرگ تهران:</span>
              </div>

              {onOpenRoutingModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRoutingModal();
                  }}
                  className="bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>باز کردن نقشه تعاملی و مسیریاب‌ها</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Address 1 */}
              <div className="bg-white p-4 rounded-2xl border border-[#DDD5C0] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                  <Navigation className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>آدرس اصلی فروشگاه (بازار عباس‌آباد):</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {BRAND_INFO.mainAddressFa}
                </p>
              </div>

              {/* Address 2 (Metro Route) */}
              <div className="bg-white p-4 rounded-2xl border border-[#DDD5C0] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                  <Navigation className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>مسیر دسترسی سریع با مترو:</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {BRAND_INFO.subwayRouteFa}
                </p>
              </div>
            </div>

            {/* English Address */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#DDD5C0] text-left space-y-1" dir="ltr">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <Globe className="w-3.5 h-3.5 text-[#8C6D37]" />
                <span className="font-serif">Manoto Dress — International Address:</span>
              </div>
              <p className="text-xs text-stone-600 font-mono">
                {BRAND_INFO.addressEn}
              </p>
            </div>
          </div>

          {/* Logistics & Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#DDD5C0] space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                <Clock className="w-4 h-4 text-[#8C6D37]" />
                <span>ساعات کاری و پاسخگویی:</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                شنبه تا چهارشنبه: ۸:۳۰ الی ۱۹:۰۰<br />
                پنج‌شنبه‌ها: ۸:۳۰ الی ۱۵:۰۰ (تحویل سفارشات به باربری وطن و تیپاکس)
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DDD5C0] space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                <Truck className="w-4 h-4 text-[#8C6D37]" />
                <span>حمل‌ونقل و باربری سراسر کشور:</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                ارسال روزانه با باربری وطن (شوش)، پیام‌گیر، تیپاکس اکسپرس، چاپار و پست پیشتاز
              </p>
            </div>
          </div>

          {/* Social Channels */}
          <div className="space-y-2.5 pt-1">
            <span className="font-black text-stone-900 text-xs block">
              کانال رسمی اطلاع‌رسانی مدل‌های جدید و شارژ کاتالوگ:
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href={BRAND_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] border border-[#3F3F46] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>عضویت در کانال تلگرام (@{BRAND_INFO.telegramUsername})</span>
              </a>

              <a
                href={`tel:${BRAND_INFO.primaryPhone}`}
                className="bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                <Phone className="w-4 h-4 text-[#18181B]" />
                <span>تماس مستقیم با مدیریت: {BRAND_INFO.primaryPhoneDisplay}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

