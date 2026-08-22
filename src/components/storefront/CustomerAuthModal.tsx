import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Phone, 
  MapPin, 
  Store, 
  X, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { CustomerUser } from '../../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CustomerUser) => void;
  registeredUsers: CustomerUser[];
  onRegisterUser: (newUser: CustomerUser) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Registration form
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '',
    province: 'تهران',
    city: 'تهران',
    address: '',
    storeName: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanPhone = loginPhone.trim();
    if (!cleanPhone) {
      setAuthError('لطفاً شماره موبایل خود را وارد نمایید.');
      return;
    }

    // Find user in registered list
    const foundUser = registeredUsers.find(
      u => u.phone.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, '')
    );

    if (foundUser) {
      // User found
      onLoginSuccess(foundUser);
      onClose();
    } else {
      // If user is not yet in customerUsers, create an instant profile for seamless UX
      const newAutoUser: CustomerUser = {
        id: `usr-${Date.now()}`,
        phone: cleanPhone,
        fullName: 'خریدار محترم پوشاک من و تو',
        storeName: 'فروشگاه شخصی',
        province: 'تهران',
        city: 'تهران',
        address: 'آدرس ثبت نشده',
        password: loginPassword || '123456',
        registeredAt: 'امروز',
        isPartnerWholesale: false,
      };
      onRegisterUser(newAutoUser);
      onLoginSuccess(newAutoUser);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!regForm.fullName.trim() || !regForm.phone.trim()) {
      setAuthError('نام و شماره موبایل الزامی است.');
      return;
    }

    const newUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      phone: regForm.phone.trim(),
      fullName: regForm.fullName.trim(),
      storeName: regForm.storeName.trim() || `بوتیک ${regForm.fullName}`,
      province: regForm.province.trim() || 'تهران',
      city: regForm.city.trim() || 'تهران',
      address: regForm.address.trim() || 'آدرس ثبت نشده',
      password: regForm.password.trim() || '123456',
      registeredAt: 'امروز',
      isPartnerWholesale: false,
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white text-stone-900 w-full max-w-md rounded-3xl border border-[#DDD5C0] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-[#18181B] text-[#FAF7F2] p-5 flex items-center justify-between border-b border-[#3F3F46]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#18181B] flex items-center justify-center font-bold text-xs shadow-xs border border-[#D4AF37]/30">
              <User className="w-5 h-5 text-[#8C6D37]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                حساب کاربری خریداران پوشاک من و تو
              </h3>
              <p className="text-[11px] text-stone-300">
                مشاهده سابقه خرید، صدور فاکتور و رهگیری وضعیت باربری
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#27272A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E6DEC8] bg-[#FAF7F2] p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setAuthError(null); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-[#18181B] shadow-xs border border-[#DDD5C0]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LogIn className="w-4 h-4 text-[#8C6D37]" />
            <span>ورود به حساب</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('register'); setAuthError(null); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-[#18181B] shadow-xs border border-[#DDD5C0]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-[#8C6D37]" />
            <span>ثبت‌نام خریدار جدید</span>
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {authError}
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  شماره موبایل:
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="09121234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs font-mono text-stone-900 bg-[#FAF7F2]"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    رمز عبور (اختیاری):
                  </label>
                  <span className="text-[10px] text-stone-500">
                    ورود سریع با موبایل
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    dir="ltr"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-900 bg-[#FAF7F2]"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD5C0] text-[11px] text-stone-600 space-y-1">
                <div className="flex items-center gap-1 font-bold text-stone-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>ورود بدون دردسر به حساب:</span>
                </div>
                <p>
                  با وارد کردن شماره همراه خود، تمامی سفارشات ثبت شده با این شماره به‌صورت خودکار در پنل شما نمایش داده می‌شوند.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                <span>ورود به پنل کاربری</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pl-1">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  نام و نام خانوادگی <span className="text-[#8C6D37]">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  placeholder="مثال: مریم سلیمانی"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-900 bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  شماره موبایل <span className="text-[#8C6D37]">*</span>:
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="09121234567"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs font-mono text-stone-900 bg-[#FAF7F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">استان:</label>
                  <input
                    type="text"
                    value={regForm.province}
                    onChange={(e) => setRegForm({ ...regForm, province: e.target.value })}
                    placeholder="اصفهان"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">شهر مقصد:</label>
                  <input
                    type="text"
                    value={regForm.city}
                    onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                    placeholder="کاشان"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  نام فروشگاه یا بوتیک (اختیاری):
                </label>
                <input
                  type="text"
                  value={regForm.storeName}
                  onChange={(e) => setRegForm({ ...regForm, storeName: e.target.value })}
                  placeholder="مثال: بوتیک شیک‌پوشان"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  آدرس پستی جهت ارسال بار:
                </label>
                <textarea
                  rows={2}
                  value={regForm.address}
                  onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                  placeholder="خیابان اصلی، کوچه، پلاک یا واحد"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs resize-none bg-[#FAF7F2]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                <span>ثبت‌نام و ورود به پنل خریدار</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
