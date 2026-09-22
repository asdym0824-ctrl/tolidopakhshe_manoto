import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Lock, 
  Phone, 
  Store, 
  X, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageSquare,
  KeyRound,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { CustomerUser } from '../../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CustomerUser) => void;
  registeredUsers: CustomerUser[];
  onRegisterUser: (newUser: CustomerUser) => void;
  onUpdateUser?: (updatedUser: CustomerUser) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot_password'>('login');

  // Login inputs: Username (Phone number) and Password (user-defined)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration form with user-defined password
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '',
    province: 'تهران',
    city: 'تهران',
    address: '',
    storeName: '',
    password: '',
    confirmPassword: '',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password / Reset flow
  const [resetPhone, setResetPhone] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'verify_and_set'>('request');
  const [resetOtp, setResetOtp] = useState('');
  const [generatedResetCode, setGeneratedResetCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(0);
  const [simulatedSmsBanner, setSimulatedSmsBanner] = useState<string | null>(null);

  // Errors & success messages
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (resetCountdown > 0) {
      timerRef.current = setTimeout(() => {
        setResetCountdown(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetCountdown]);

  // Reset modal states when opened or closed
  useEffect(() => {
    if (!isOpen) {
      setAuthError(null);
      setAuthSuccessMsg(null);
      setSimulatedSmsBanner(null);
      setResetOtp('');
      setResetStep('request');
      setResetCountdown(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validate Iranian mobile number (e.g. 09121234567)
  const isValidIranianPhone = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    return clean.length === 11 && clean.startsWith('09');
  };

  // 1. Password-based login with Phone number as username
  const handlePasswordLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    const cleanPhone = loginPhone.replace(/[^0-9]/g, '');
    const inputPassword = loginPassword.trim();

    if (!cleanPhone) {
      setAuthError('لطفاً نام کاربری خود (شماره موبایل) را وارد فرمایید.');
      return;
    }

    if (!isValidIranianPhone(cleanPhone)) {
      setAuthError('نام کاربری باید شماره موبایل معتبر ۱۱ رقمی باشد (مانند ۰۹۱۲۱۲۳۴۵۶۷).');
      return;
    }

    if (!inputPassword) {
      setAuthError('لطفاً رمز عبوری که خودتان تعیین کرده‌اید را وارد فرمایید.');
      return;
    }

    // Look up user in registered list by phone (username)
    const foundUser = registeredUsers.find(
      u => u.phone.replace(/[^0-9]/g, '') === cleanPhone
    );

    if (!foundUser) {
      setAuthError(
        'کاربری با این شماره موبایل (نام کاربری) یافت نشد! لطفاً از برگه «ثبت‌نام خریدار» حساب کاربری جدید ایجاد کنید و رمز دلخواه خود را تعیین نمایید.'
      );
      return;
    }

    // STRICT PASSWORD CHECK: Match password exactly against stored user password
    const userStoredPassword = foundUser.password || 'password123';
    if (inputPassword !== userStoredPassword) {
      setAuthError(
        'رمز عبور وارد شده با رمزی که تعیین کرده‌اید مطابقت ندارد! لطفاً مجدداً دقت فرمایید یا در صورت فراموشی روی «فراموشی رمز عبور» کلیک کنید.'
      );
      return;
    }

    // Credentials match!
    onLoginSuccess(foundUser);
    onClose();
  };

  // 2. Register new user with custom password defined by user
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanPhone = regForm.phone.replace(/[^0-9]/g, '');
    const fullName = regForm.fullName.trim();
    const pass = regForm.password.trim();
    const confirmPass = regForm.confirmPassword.trim();

    if (!fullName || fullName.length < 3) {
      setAuthError('لطفاً نام و نام خانوادگی خود را کامل وارد نمایید (حداقل ۳ حرف).');
      return;
    }

    if (!isValidIranianPhone(cleanPhone)) {
      setAuthError('شماره موبایل (نام کاربری شما) باید ۱۱ رقمی بوده و با ۰۹ آغاز شود (مانند ۰۹۱۲۱۲۳۴۵۶۷).');
      return;
    }

    // Check if phone (username) already exists
    const existing = registeredUsers.find(
      u => u.phone.replace(/[^0-9]/g, '') === cleanPhone
    );
    if (existing) {
      setAuthError('این شماره موبایل (نام کاربری) قبلاً در سیستم ثبت شده است! لطفاً با همان شماره و رمز عبور وارد شوید.');
      return;
    }

    if (!pass || pass.length < 6) {
      setAuthError('رمز عبوری که تعیین می‌کنید باید حداقل ۶ کاراکتر داشته باشد.');
      return;
    }

    if (pass !== confirmPass) {
      setAuthError('تکرار رمز عبور با رمز عبور تعیین‌شده مطابقت ندارد.');
      return;
    }

    const newUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      phone: cleanPhone,
      fullName: fullName,
      storeName: regForm.storeName.trim() || 'فروشگاه شخصی',
      province: regForm.province.trim() || 'تهران',
      city: regForm.city.trim() || 'تهران',
      address: regForm.address.trim() || 'آدرس پیش‌فرض در فاکتور بعدی درج می‌شود',
      password: pass,
      registeredAt: 'امروز',
      isPartnerWholesale: false,
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  // 3. Request password reset (Forgot password flow)
  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    const cleanPhone = resetPhone.replace(/[^0-9]/g, '');
    if (!isValidIranianPhone(cleanPhone)) {
      setAuthError('لطفاً شماره موبایل ۱۱ رقمی معتبر را وارد نمایید.');
      return;
    }

    const found = registeredUsers.find(
      u => u.phone.replace(/[^0-9]/g, '') === cleanPhone
    );

    if (!found) {
      setAuthError('حساب کاربری با این نام کاربری (شماره همراه) پیدا نشد. ابتدا ثبت‌نام فرمایید.');
      return;
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();
    setGeneratedResetCode(code);
    setSimulatedSmsBanner(code);
    setResetStep('verify_and_set');
    setResetCountdown(120);
    setAuthSuccessMsg(`کد تایید بازنشانی به شماره ${cleanPhone} ارسال شد.`);
  };

  // 4. Set new password chosen by user
  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanInputOtp = resetOtp.trim().replace(/[^0-9]/g, '');
    if (!cleanInputOtp || cleanInputOtp !== generatedResetCode) {
      setAuthError('کد تایید وارد شده نادرست است! لطفاً مجدداً بررسی فرمایید.');
      return;
    }

    const cleanPass = newPassword.trim();
    if (!cleanPass || cleanPass.length < 6) {
      setAuthError('کلمه عبور جدید باید حداقل شامل ۶ کاراکتر باشد.');
      return;
    }

    if (cleanPass !== confirmNewPassword.trim()) {
      setAuthError('تکرار کلمه عبور جدید با کلمه عبور وارد شده همخوانی ندارد.');
      return;
    }

    const cleanPhone = resetPhone.replace(/[^0-9]/g, '');
    const foundUser = registeredUsers.find(
      u => u.phone.replace(/[^0-9]/g, '') === cleanPhone
    );

    if (foundUser) {
      const updatedUser: CustomerUser = {
        ...foundUser,
        password: cleanPass
      };
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      onLoginSuccess(updatedUser);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" 
      dir="rtl"
    >
      <div 
        id="customer-auth-modal-container"
        className="bg-white text-stone-900 w-full max-w-md rounded-3xl border border-[#DDD5C0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Header Bar */}
        <div className="bg-[#18181B] text-[#FAF7F2] p-4.5 flex items-center justify-between border-b border-[#3F3F46]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#27272A] text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-xs border border-[#D4AF37]/30">
              <KeyRound className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                پرتال خریداران پوشاک من و تو
              </h3>
              <p className="text-[11px] text-stone-300">
                ورود با نام کاربری (شماره همراه) و رمز عبور اختصاصی
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#27272A] transition-colors cursor-pointer"
            aria-label="بستن پنجره ورود"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex border-b border-[#E6DEC8] bg-[#FAF7F2] p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => { 
              setActiveTab('login'); 
              setAuthError(null); 
              setAuthSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-[#18181B] shadow-xs border border-[#DDD5C0]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LogIn className="w-4 h-4 text-[#8C6D37]" />
            <span>ورود با رمز عبور</span>
          </button>

          <button
            type="button"
            onClick={() => { 
              setActiveTab('register'); 
              setAuthError(null); 
              setAuthSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-[#18181B] shadow-xs border border-[#DDD5C0]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-[#8C6D37]" />
            <span>ثبت‌نام و تعیین رمز</span>
          </button>
        </div>

        {/* Simulated Notification Banner (for password reset code) */}
        {simulatedSmsBanner && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-start gap-3 text-right animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-950">پیامک بازنشانی رمز عبور</span>
                <span className="text-[10px] text-amber-700 font-bold">هم‌اکنون</span>
              </div>
              <p className="text-xs text-amber-900 mt-1">
                کد تایید بازنشانی رمز: <span className="font-black text-sm tracking-wider text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-md">{simulatedSmsBanner}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setResetOtp(simulatedSmsBanner);
                  setAuthError(null);
                }}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-black text-amber-800 hover:text-amber-950 underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>درج خودکار این کد در کادر تایید</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {authError && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium leading-relaxed">{authError}</span>
          </div>
        )}

        {/* Success Alert */}
        {authSuccessMsg && !authError && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium leading-relaxed">{authSuccessMsg}</span>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* TAB 1: LOGIN (نام کاربری = شماره موبایل | رمز عبور = تعیین شده توسط کاربر) */}
          {activeTab === 'login' && (
            <form onSubmit={handlePasswordLoginSubmit} className="space-y-4">
              
              {/* Username: Phone Number */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  نام کاربری (شماره موبایل شما):
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                    dir="ltr"
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3.5 py-2.5 pl-10 text-stone-900 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37] text-left"
                    autoFocus
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  شماره موبایلی که در زمان ثبت‌نام وارد نموده‌اید، نام کاربری شماست.
                </p>
              </div>

              {/* Password: User Defined */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    رمز عبور (تعیین‌شده توسط شما):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot_password');
                      setResetPhone(loginPhone);
                      setAuthError(null);
                      setAuthSuccessMsg(null);
                    }}
                    className="text-[11px] font-bold text-[#8C6D37] hover:underline cursor-pointer"
                  >
                    فراموشی رمز عبور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="رمز عبور شخصی خود را وارد نمایید"
                    dir="ltr"
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-stone-900 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37]"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                    tabIndex={-1}
                    aria-label="نمایش یا مخفی‌سازی رمز عبور"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#18181B] text-[#FAF7F2] hover:bg-stone-800 rounded-xl font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                <span>ورود به حساب کاربری</span>
              </button>

              {/* Quick Test Accounts for Demonstration */}
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC8] text-[11px] text-stone-600 space-y-1.5">
                <p className="font-black text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>حساب‌های پیش‌فرض جهت تست سریع:</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => { 
                      setLoginPhone('09131234567'); 
                      setLoginPassword('password123'); 
                      setAuthError(null);
                    }}
                    className="bg-white border border-[#DDD5C0] px-2.5 py-1.5 rounded-lg text-right hover:bg-amber-50 text-stone-800 font-bold transition-all cursor-pointer flex-1"
                  >
                    حاج محمود: <span className="font-mono text-[#8C6D37]">۰۹۱۳۱۲۳۴۵۶۷</span>
                    <span className="block text-stone-500 font-normal">رمز: password123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { 
                      setLoginPhone('09351112233'); 
                      setLoginPassword('password123'); 
                      setAuthError(null);
                    }}
                    className="bg-white border border-[#DDD5C0] px-2.5 py-1.5 rounded-lg text-right hover:bg-amber-50 text-stone-800 font-bold transition-all cursor-pointer flex-1"
                  >
                    نیلوفر رضایی: <span className="font-mono text-[#8C6D37]">۰۹۳۵۱۱۱۲۲۳۳</span>
                    <span className="block text-stone-500 font-normal">رمز: password123</span>
                  </button>
                </div>
              </div>

              {/* Switch to Register link */}
              <div className="text-center pt-1">
                <span className="text-xs text-stone-600">هنوز حساب کاربری نساخته‌اید؟ </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setAuthError(null);
                  }}
                  className="text-xs font-black text-[#8C6D37] hover:underline cursor-pointer"
                >
                  ثبت‌نام و تعیین رمز عبور جدید
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: REGISTER (ثبت نام خریدار + تعیین رمز عبور توسط خود کاربر) */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  شماره موبایل شما به عنوان <strong>نام کاربری</strong> ثبت می‌شود و <strong>رمز عبور</strong> را خودتان تعیین می‌کنید.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  نام و نام خانوادگی خریدار: *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    placeholder="مثال: مریم حسینی"
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3.5 py-2.5 pl-10 text-stone-900 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37]"
                    required
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  شماره موبایل (نام کاربری شما جهت ورود): *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                    dir="ltr"
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3.5 py-2.5 pl-10 text-stone-900 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37] text-left"
                    required
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Password Fields Chosen by User */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">
                      تعیین رمز عبور: *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="text-[10px] text-stone-500 hover:text-stone-800"
                    >
                      {showRegPassword ? 'مخفی‌سازی' : 'نمایش رمز'}
                    </button>
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="حداقل ۶ کاراکتر"
                    dir="ltr"
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3 py-2 text-stone-900 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    تکرار رمز عبور انتخابی: *
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="تکرار همان رمز"
                    dir="ltr"
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3 py-2 text-stone-900 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    استان:
                  </label>
                  <input
                    type="text"
                    value={regForm.province}
                    onChange={(e) => setRegForm({ ...regForm, province: e.target.value })}
                    placeholder="تهران"
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3 py-2 text-stone-900 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    شهر:
                  </label>
                  <input
                    type="text"
                    value={regForm.city}
                    onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                    placeholder="تهران"
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3 py-2 text-stone-900 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  نام فروشگاه یا پیج کاری (اختیاری):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regForm.storeName}
                    onChange={(e) => setRegForm({ ...regForm, storeName: e.target.value })}
                    placeholder="فروشگاه یا پیج پوشاک زنانه..."
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3.5 py-2 text-stone-900 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37]"
                  />
                  <Store className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#8C6D37] hover:bg-[#73582B] text-white rounded-xl font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-3"
              >
                <UserPlus className="w-4 h-4" />
                <span>ثبت‌نام و ذخیره کلمه عبور</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-stone-600">قبلاً ثبت‌نام کرده‌اید؟ </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setAuthError(null);
                  }}
                  className="text-xs font-black text-[#8C6D37] hover:underline cursor-pointer"
                >
                  ورود به حساب کاربری
                </button>
              </div>

            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD / RESET PASSWORD */}
          {activeTab === 'forgot_password' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6DEC8]">
                <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#8C6D37]" />
                  <span>بازیابی و تغییر رمز عبور</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setAuthError(null);
                  }}
                  className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>بازگشت به ورود</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {resetStep === 'request' ? (
                <form onSubmit={handleRequestPasswordReset} className="space-y-3.5">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    شماره موبایل (نام کاربری) خود را وارد کنید تا کد تایید یکبار مصرف ارسال گردد و بتوانید رمز دلخواه جدیدی تنظیم کنید.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      شماره موبایل (نام کاربری):
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={resetPhone}
                        onChange={(e) => setResetPhone(e.target.value)}
                        placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                        dir="ltr"
                        className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3.5 py-2.5 pl-10 text-stone-900 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37] text-left"
                        autoFocus
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#18181B] text-[#FAF7F2] hover:bg-stone-800 rounded-xl font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                    <span>ارسال کد تایید بازنشانی</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSetNewPassword} className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-stone-700">
                        کد تایید ارسال‌شده به {resetPhone}:
                      </label>
                      <button
                        type="button"
                        onClick={() => setResetStep('request')}
                        className="text-[11px] font-bold text-[#8C6D37] hover:underline"
                      >
                        ویرایش شماره
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={5}
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      placeholder="۱۲۳۴۵"
                      dir="ltr"
                      className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3.5 py-2 text-center text-stone-900 text-lg font-black tracking-widest focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37]"
                      autoFocus
                    />
                  </div>

                  {/* New Custom Password Fields */}
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-stone-700">
                          رمز عبور جدید دلخواه: *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="text-[10px] text-stone-500 hover:text-stone-800"
                        >
                          {showNewPassword ? 'مخفی‌سازی' : 'نمایش رمز'}
                        </button>
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="حداقل ۶ کاراکتر"
                        dir="ltr"
                        className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3 py-2 text-stone-900 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        تکرار رمز عبور جدید: *
                      </label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="تکرار رمز عبور جدید"
                        dir="ltr"
                        className="w-full bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3 py-2 text-stone-900 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#8C6D37]"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#8C6D37] hover:bg-[#73582B] text-white rounded-xl font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ذخیره رمز جدید و ورود به حساب</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Security Trust Footer */}
        <div className="bg-[#FAF7F2] px-5 py-3 border-t border-[#E6DEC8] flex items-center justify-between text-[11px] text-stone-600">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>حفاظت از کلمه عبور و امنیت حساب کاربری</span>
          </div>
          <span className="text-[10px] text-stone-600">پوشاک من و تو</span>
        </div>

      </div>
    </div>
  );
};
