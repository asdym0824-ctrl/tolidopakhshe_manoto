import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  UserCheck,
  Percent, 
  FileCheck2, 
  Sparkles, 
  ShieldAlert, 
  PhoneCall, 
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  Lock,
  ArrowRight
} from 'lucide-react';
import { CustomerUser } from '../../types';
import { toPersianDigits } from '../../utils/persianWriting';

interface WholesalePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onToggleLogin: (status: boolean, partnerData?: Partial<CustomerUser>) => void;
  customerUsers?: CustomerUser[];
  restrictWholesaleToAdminApproved?: boolean;
}

export const WholesalePartnerModal: React.FC<WholesalePartnerModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  onToggleLogin,
  customerUsers = [],
  restrictWholesaleToAdminApproved = true,
}) => {
  const [partnerPhone, setPartnerPhone] = useState('09121114589');
  const [partnerName, setPartnerName] = useState('حاج داوود محمدی');
  const [partnerError, setPartnerError] = useState<string | null>(null);
  const [showDemoApprovedPartners, setShowDemoApprovedPartners] = useState(false);

  // List of approved wholesale partners
  const approvedPartners = customerUsers.filter(u => u.isPartnerWholesale);

  const normalizeText = (s: string) => {
    return (s || '')
      .replace(/[\u200c\s]/g, '')
      .toLowerCase()
      .replace(/ي/g, 'ی')
      .replace(/ك/g, 'ک');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerError(null);
    const cleanPhone = partnerPhone.replace(/[^0-9]/g, '');

    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('09')) {
      setPartnerError('لطفاً یک شماره همراه معتبر ۱۱ رقمی (با پیش‌شماره ۰۹) وارد فرمایید.');
      return;
    }
    if (!partnerName.trim() || partnerName.trim().length < 2) {
      setPartnerError('لطفاً نام همکار یا نام بنکداری را وارد نمایید.');
      return;
    }

    if (restrictWholesaleToAdminApproved) {
      // Find matching approved partner
      const matched = approvedPartners.find(u => {
        const uPhoneClean = (u.phone || '').replace(/[^0-9]/g, '');
        const phoneMatches = 
          uPhoneClean === cleanPhone || 
          (cleanPhone.length >= 10 && uPhoneClean.endsWith(cleanPhone.slice(-10)));
        
        if (!phoneMatches) return false;

        // Verify name or storeName match
        const enteredNorm = normalizeText(partnerName);
        const fullNorm = normalizeText(u.fullName || '');
        const storeNorm = normalizeText(u.storeName || '');

        return (
          fullNorm.includes(enteredNorm) || 
          enteredNorm.includes(fullNorm) || 
          storeNorm.includes(enteredNorm) || 
          enteredNorm.includes(storeNorm) ||
          enteredNorm.length <= 2
        );
      });

      if (!matched) {
        setPartnerError('NOT_APPROVED_IN_ADMIN');
        return;
      }

      onToggleLogin(true, matched);
      onClose();
      return;
    }

    // Unrestricted mode
    onToggleLogin(true, {
      fullName: partnerName,
      phone: cleanPhone,
      storeName: partnerName,
      isPartnerWholesale: true,
    });
    onClose();
  };

  const handleLogout = () => {
    onToggleLogin(false);
    onClose();
  };

  const handleFillSample = (partner: CustomerUser) => {
    setPartnerPhone(partner.phone);
    setPartnerName(partner.fullName);
    setPartnerError(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      id="wholesale-partner-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 pb-28 md:pb-4 animate-fadeIn" 
      dir="rtl"
    >
      <div 
        id="wholesale-partner-modal-panel"
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-[#18181B] text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-[#F5E6A3] text-[#18181B] flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-white text-base">پرتال اختصاصی همکاران و بنکداران</h3>
                <span className="bg-[#D4AF37] text-[#18181B] font-black text-[9px] px-1.5 py-0.5 rounded-md">
                  VIP
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                پوشاک من و تو (اسدی) • نرخ‌های تیراژ کارگاه و خرید چکی
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-partner-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {isLoggedIn ? (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <UserCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>دسترسی شما در پنل ادمین تایید شده است</span>
                </div>
                <h4 className="font-black text-stone-900 text-base">
                  حساب همکار VIP فعال است
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  کلیه قیمت‌های فروشگاه هم‌اکنون با تخفیف ویژهٔ بنکداری و نرخ مستقیم کارگاه نمایش داده می‌شوند.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-colors shadow-sm cursor-pointer"
                >
                  مشاهده کاتالوگ با قیمت همکاری
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-3 px-4 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  خروج از حساب همکار
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Security info banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[11px]">
                  <strong className="font-black block text-amber-950 mb-0.5">
                    ورود اختصاصی با تاییدیه مدیریت
                  </strong>
                  دسترسی به این قسمت تنها برای همکاران و بنکدارانی مقدور است که شماره و نام آن‌ها از طریق پنل ادمین توسط مدیریت تایید و ثبت شده باشد.
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC8] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Percent className="w-4 h-4 text-[#8C6D37]" />
                    <span>تخفیف ۱۰ تا ۱۵٪</span>
                  </div>
                  <p className="text-[10px] text-stone-600">
                    قیمت‌های مستقیم کارگاهی برای سفارشات عمده و تیراژ
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC8] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <FileCheck2 className="w-4 h-4 text-emerald-700" />
                    <span>تسویه چکی صیادی</span>
                  </div>
                  <p className="text-[10px] text-stone-600">
                    امکان پرداخت چکی تا ۴۵ روز با تاییدیه اعتبار بازار
                  </p>
                </div>
              </div>

              {/* Not Authorized Alert Box */}
              {partnerError === 'NOT_APPROVED_IN_ADMIN' && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2 font-black text-rose-800 text-xs">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>عدم تطابق دسترسی در سیستم همکاران مجاز</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-800">
                    شماره همراه «<span className="font-mono font-bold" dir="ltr">{toPersianDigits(partnerPhone)}</span>» یا نام واردشده در لیست همکاران تاییدشدهٔ مدیریت «من و تو» یافت نشد. ورود به این پرتال منحصراً ویژهٔ همکارانی است که دسترسی آن‌ها در پنل ادمین ثبت شده است.
                  </p>
                  
                  <div className="pt-2 border-t border-rose-200 flex flex-wrap items-center gap-2">
                    <a
                      href="tel:09121114589"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>تماس با مدیریت (آقای اسدی)</span>
                    </a>
                    <a
                      href="https://wa.me/989121114589?text=سلام،%20درخواست%20فعال‌سازی%20دسترسی%20همکار%20VIP%20پوشاک%20من%20و%20تو%20را%20دارم."
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>درخواست دسترسی در واتساپ</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Generic error */}
              {partnerError && partnerError !== 'NOT_APPROVED_IN_ADMIN' && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                  {partnerError}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    شماره موبایل همکار (ثبت‌شده در پنل ادمین):
                  </label>
                  <input
                    type="tel"
                    required
                    value={partnerPhone}
                    onChange={(e) => {
                      setPartnerPhone(e.target.value);
                      if (partnerError) setPartnerError(null);
                    }}
                    placeholder="۰۹۱۲..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#8C6D37] text-xs font-mono text-stone-900 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    نام و نام خانوادگی یا نام فروشگاه / بنکداری:
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => {
                      setPartnerName(e.target.value);
                      if (partnerError) setPartnerError(null);
                    }}
                    placeholder="نام یا نام فروشگاه ثبت‌شده..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#8C6D37] text-xs text-stone-900 bg-stone-50/50"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-confirm-partner-login"
                  className="w-full py-3 px-4 bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>بررسی دسترسی و ورود به پرتال همکار</span>
                </button>
              </form>

              {/* Helper collapsible for demo / testing */}
              <div className="pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowDemoApprovedPartners(!showDemoApprovedPartners)}
                  className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>
                    {showDemoApprovedPartners ? 'بستن راهنمای تست دسترسی' : 'مشاهده همکاران مجاز پیش‌فرض جهت تست سیستم'}
                  </span>
                </button>

                {showDemoApprovedPartners && (
                  <div className="mt-2.5 p-3 rounded-xl bg-stone-100 border border-stone-200 space-y-2 text-[11px] text-stone-700 animate-fadeIn">
                    <p className="font-bold text-stone-800">
                      همکاران دارای دسترسی فعال (ثبت‌شده در پنل ادمین):
                    </p>
                    <div className="space-y-1.5">
                      {approvedPartners.map(p => (
                        <div key={p.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200">
                          <div>
                            <span className="font-bold text-stone-900">{p.fullName}</span>
                            <span className="text-stone-500 mr-1">({p.storeName || p.city})</span>
                            <div className="font-mono text-[10px] text-stone-600" dir="ltr">{toPersianDigits(p.phone)}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFillSample(p)}
                            className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded text-[10px] font-bold"
                          >
                            تکمیل خودکار فرم
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-stone-500 pt-1">
                      * شما می‌توانید همکاران جدید را در هر زمان از «پنل ادمین ← تنظیمات فروشگاه ← دسترسی همکاران VIP» اضافه، ویرایش یا حذف نمایید.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
