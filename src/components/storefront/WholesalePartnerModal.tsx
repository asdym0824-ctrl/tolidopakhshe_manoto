import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Lock, 
  CheckCircle, 
  Sparkles, 
  Percent, 
  FileCheck2, 
  Truck, 
  ArrowLeft,
  UserCheck
} from 'lucide-react';

interface WholesalePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onToggleLogin: (status: boolean) => void;
}

export const WholesalePartnerModal: React.FC<WholesalePartnerModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  onToggleLogin
}) => {
  if (!isOpen) return null;

  const [partnerPhone, setPartnerPhone] = useState('09121114589');
  const [partnerName, setPartnerName] = useState('حاج داوود محمدی (بنکداری اصفهان)');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onToggleLogin(true);
    onClose();
  };

  const handleLogout = () => {
    onToggleLogin(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#18181B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">ورود به پرتال همکاران و بنکداران</h3>
              <p className="text-xs text-pink-300">پوشاک من و تو (اسدی) • نرخ‌های ویژه تیراژ و خرید چکی</p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-partner-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {isLoggedIn ? (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <UserCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-stone-900 text-base">
                  حساب همکار VIP فعال است
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  شما در حال حاضر با دسترسی «{partnerName}» وارد شده‌اید و کلیه قیمت‌های فروشگاه با تخفیف بنکداری و همکار نمایش داده می‌شوند.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  ادامه خرید با نرخ همکار
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2.5 px-4 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  خروج از حساب همکار
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Value proposition for wholesale partners */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Percent className="w-4 h-4 text-rose-600" />
                    <span>تخفیف ۱۰ الی ۱۵٪</span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    قیمت‌های تیراژ و زیر قیمت بازار برای سفارشات عمده
                  </p>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <span>تسویه چکی صیادی</span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    امکان پرداخت چکی تا ۴۵ روز با تاییدیه اعتبار صیاد
                  </p>
                </div>
              </div>

              {/* Quick Partner Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    شماره موبایل همکار / صاحب بوتیک:
                  </label>
                  <input
                    type="tel"
                    required
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 text-xs font-mono text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    نام فروشگاه یا بنکداری:
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 text-xs text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-confirm-partner-login"
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>ورود آنی و فعال‌سازی نرخ همکار VIP</span>
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
