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
  Navigation,
  Sparkles
} from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';
import { BRAND_INFO } from '../../data/brandInfo';
import { SiteSettings } from '../../types';
import { RubikaIcon, BaleIcon, EitaaIcon, TelegramIcon } from '../common/SocialIcons';

interface StorefrontFooterProps {
  onOpenAboutModal: () => void;
  onOpenRoutingModal: () => void;
  onOpenTracking: () => void;
  onOpenPartnerModal: () => void;
  onSwitchToAdmin: () => void;
  siteSettings?: SiteSettings;
}

export const StorefrontFooter: React.FC<StorefrontFooterProps> = ({
  onOpenAboutModal,
  onOpenRoutingModal,
  onOpenTracking,
  onOpenPartnerModal,
  onSwitchToAdmin,
  siteSettings,
}) => {
  return (
    <footer 
      className="relative bg-gradient-to-b from-[#111115] via-[#0B0B0E] to-[#060608] text-white pt-14 pb-10 overflow-hidden border-t border-stone-800/80" 
      dir="rtl"
    >
      {/* 1. Luminous Haute-Couture Top Border Hairline */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#D4AF37]/[0.04] to-transparent pointer-events-none" />

      {/* 2. Atmospheric Minimal Luxury Ambient Glows */}
      <div 
        className="absolute -top-24 right-1/4 w-[420px] h-[420px] bg-gradient-to-br from-[#D4AF37]/15 via-[#8C6D37]/5 to-transparent rounded-full blur-[100px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-20 left-10 w-[360px] h-[360px] bg-gradient-to-tr from-[#9E7A38]/10 via-stone-800/20 to-transparent rounded-full blur-[90px] pointer-events-none" 
        aria-hidden="true"
      />

      {/* 3. Subtle Couture Textile Diamond & Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(45deg, #D4AF37 1px, transparent 1px), linear-gradient(-45deg, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '56px 56px'
        }}
        aria-hidden="true"
      />

      {/* Main Content Container with elevated z-index */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-stone-400">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="bg-black/40 border border-[#D4AF37]/25 p-3.5 rounded-2xl inline-block backdrop-blur-md shadow-2xl shadow-black/60 ring-1 ring-white/5">
              <ManotoLogo variant="light" size="md" showPersianSub={false} />
            </div>

            <p className="text-stone-300 text-xs leading-relaxed">
              <strong className="text-white font-bold">{siteSettings?.brandName || 'تولید و پخش پوشاک من و تو'} ({siteSettings?.brandSubtitle || 'مدیریت اسدی'})</strong>: {siteSettings?.heroSubheadline || 'تولیدکننده تخصصی انواع شلوار زنانه (بگ، نیم‌بگ، راسته، جاگر، دمپا)، شومیز، مانتو و ست‌های راحتی با کیفیت برتر و ارسال مستقیم از بازار بزرگ تهران.'}
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-300">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>کانال‌ها و پیام‌رسان‌های رسمی من و تو:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={siteSettings?.telegramChannelUrl || BRAND_INFO.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/35 hover:border-sky-400 text-sky-200 hover:text-white flex items-center gap-2 transition-all font-bold text-xs shadow-xs active:scale-95 group backdrop-blur-sm"
                  title="کانال رسمی تلگرام: tolidopakhsh_manoto@"
                >
                  <TelegramIcon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform shadow-2xs" />
                  <span>تلگرام</span>
                </a>

                <a
                  href="https://rubika.ir/tolidopakhsh_manoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/35 hover:border-purple-400 text-purple-200 hover:text-white flex items-center gap-2 transition-all font-bold text-xs shadow-xs active:scale-95 group backdrop-blur-sm"
                  title="کانال و پیج روبیکا: tolidopakhsh_manoto"
                >
                  <RubikaIcon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform shadow-2xs" />
                  <span>روبیکا</span>
                </a>

                <a
                  href="https://ble.ir/tolidopakhsh_manoto_dress"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/35 hover:border-emerald-400 text-emerald-200 hover:text-white flex items-center gap-2 transition-all font-bold text-xs shadow-xs active:scale-95 group backdrop-blur-sm"
                  title="شناسه کانال پیام‌رسان بله: tolidopakhsh_manoto_dress"
                >
                  <BaleIcon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform shadow-2xs" />
                  <span>بله</span>
                </a>

                <a
                  href="https://eitaa.com/tolidopakhsh_manoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-orange-950/50 hover:bg-orange-900/60 border border-orange-500/35 hover:border-orange-400 text-orange-200 hover:text-white flex items-center gap-2 transition-all font-bold text-xs shadow-xs active:scale-95 group backdrop-blur-sm"
                  title="کانال پیام‌رسان ایتا: tolidopakhsh_manoto"
                >
                  <EitaaIcon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform shadow-2xs" />
                  <span>ایتا</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm pb-1 border-b border-stone-800/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>دسترسی سریع</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={onOpenTracking}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 group cursor-pointer text-right w-full"
                >
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-0.5 transition-transform">سامانه پیگیری بیجک و بارنامه</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPartnerModal}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 group cursor-pointer text-right w-full"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#B89B58] group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-0.5 transition-transform">ورود همکاران و خریداران عمده</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenRoutingModal}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 font-bold text-stone-300 hover:text-white group cursor-pointer text-right w-full"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-0.5 transition-transform">نقشه، لوکیشن و مسیریابی در بازار</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAboutModal}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 group cursor-pointer text-right w-full"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-0.5 transition-transform">آدرس دقیق پاساژ المهدی ۴ و تماس</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onSwitchToAdmin}
                  className="text-[#D4AF37] hover:text-white transition-colors flex items-center gap-1.5 font-bold pt-1 group cursor-pointer text-right w-full"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-0.5 transition-transform">پرتال مدیریت و انبارداری بازار</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Logistics & Address */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm pb-1 border-b border-stone-800/80 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>آدرس و لوکیشن بازار</span>
              </span>
              {onOpenRoutingModal && (
                <button
                  type="button"
                  onClick={onOpenRoutingModal}
                  className="text-[10px] text-[#D4AF37] hover:text-amber-300 flex items-center gap-1 font-bold transition-colors"
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
                className="w-full text-right bg-black/40 hover:bg-stone-900/80 p-3 rounded-2xl border border-stone-800/80 hover:border-[#D4AF37]/50 backdrop-blur-sm transition-all space-y-1.5 block group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#D4AF37] font-bold block text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    <span>آدرس فروشگاه (بازار عباس‌آباد):</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 group-hover:text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    بلد • نشان
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed group-hover:text-white transition-colors">
                  {siteSettings?.mainAddress || BRAND_INFO.mainAddressFa}
                </p>
              </button>

              <button
                type="button"
                onClick={onOpenRoutingModal || onOpenAboutModal}
                className="w-full text-right bg-black/40 hover:bg-stone-900/80 p-3 rounded-2xl border border-stone-800/80 hover:border-[#D4AF37]/50 backdrop-blur-sm transition-all space-y-1.5 block group shadow-xs cursor-pointer"
              >
                <span className="text-[#B89B58] font-bold block text-[11px] flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#B89B58]" />
                  <span>مسیر دسترسی سریع با مترو:</span>
                </span>
                <p className="text-[11px] text-stone-300 leading-relaxed group-hover:text-white transition-colors">
                  {siteSettings?.subwayAddress || BRAND_INFO.subwayRouteFa}
                </p>
              </button>
            </div>
          </div>

          {/* Col 4: Direct Phone Numbers */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm pb-1 border-b border-stone-800/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>تلفن‌های ثبت سفارش و استعلام</span>
            </h4>
            <ul className="space-y-2 text-stone-300 text-xs">
              {/* Primary Phone */}
              <li>
                <a
                  href={`tel:${siteSettings?.primaryPhone || BRAND_INFO.primaryPhone}`}
                  className="bg-black/40 hover:bg-stone-900/90 p-2.5 rounded-2xl border border-stone-800/80 hover:border-[#D4AF37] flex items-center justify-between transition-all text-white font-bold group cursor-pointer backdrop-blur-sm shadow-xs"
                  title="تماس مستقیم با مدیریت"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="text-[11px] text-stone-300 group-hover:text-white truncate">مدیریت (اسدی):</span>
                  </div>
                  <span dir="ltr" className="text-[#D4AF37] group-hover:text-amber-300 font-black text-xs sm:text-sm tabular-nums tracking-wider font-['Vazirmatn',sans-serif]">
                    {siteSettings?.primaryPhone || BRAND_INFO.primaryPhoneDisplay}
                  </span>
                </a>
              </li>

              {/* Sales Phone */}
              <li>
                <a
                  href={`tel:${siteSettings?.salesPhone || '09121966144'}`}
                  className="bg-black/40 hover:bg-stone-900/90 p-2.5 rounded-2xl border border-stone-800/80 hover:border-[#D4AF37] flex items-center justify-between transition-all text-white font-bold group cursor-pointer backdrop-blur-sm shadow-xs"
                  title="تماس با واحد فروش و سفارش عمده"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="text-[11px] text-stone-300 group-hover:text-white truncate">واحد فروش عمده:</span>
                  </div>
                  <span dir="ltr" className="text-[#D4AF37] group-hover:text-amber-300 font-black text-xs sm:text-sm tabular-nums tracking-wider font-['Vazirmatn',sans-serif]">
                    {siteSettings?.salesPhone || '09121966144'}
                  </span>
                </a>
              </li>

              {/* Support Phone */}
              <li>
                <a
                  href={`tel:${siteSettings?.supportPhone || '02155608823'}`}
                  className="bg-black/40 hover:bg-stone-900/90 p-2.5 rounded-2xl border border-stone-800/80 hover:border-[#D4AF37] flex items-center justify-between transition-all text-white font-bold group cursor-pointer backdrop-blur-sm shadow-xs"
                  title="تماس با پشتیبانی و پیگیری بار"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="text-[11px] text-stone-300 group-hover:text-white truncate">دفتر بازار و پیگیری:</span>
                  </div>
                  <span dir="ltr" className="text-[#D4AF37] group-hover:text-amber-300 font-black text-xs sm:text-sm tabular-nums tracking-wider font-['Vazirmatn',sans-serif]">
                    {siteSettings?.supportPhone || '02155608823'}
                  </span>
                </a>
              </li>
            </ul>
            <div className="text-[11px] text-stone-400 font-sans pt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>پاسخ‌گویی همه‌روزه از ۸:۳۰ الی ۱۹:۰۰ (روزهای کاری بازار تهران)</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
          <p className="leading-relaxed text-center sm:text-right">
            تمامی حقوق مادی و معنوی متعلق به <strong className="text-stone-200">تولید و پخش پوشاک «من و تو» (اسدی) — MANOTO DRESS</strong> است.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-[#D4AF37]/30 text-[#D4AF37] px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>MANOTO DRESS • COUTURE CRAFT</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
