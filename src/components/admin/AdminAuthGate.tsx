import React, { useState } from 'react';
import { ShieldCheck, User, Key, Store, AlertCircle, Info, Lock, Package, Crown } from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';
import { UserRoleType } from '../../types';

interface AdminAuthGateProps {
  onAuthenticated: (role: UserRoleType) => void;
  onBackToStorefront: () => void;
}

/**
 * DEFAULT ADMIN ACCOUNTS
 * 
 * 1. Super Admin: full access to accounting, inventory, workshops, settings, marketing
 * 2. Content Admin: restricted specifically to products, inventory & catalogue management
 * 3. Order Tracking Admin: restricted solely to viewing customer orders (who ordered what) and tracking/dispatching
 */
export const ADMIN_AUTH_ACCOUNTS: Record<string, { role: UserRoleType; password: string; title: string }> = {
  admin: {
    role: 'super_admin',
    password: 'manoto1403admin',
    title: 'سوپر ادمین مرکزی (دسترسی کامل به کل سیستم)'
  },
  content: {
    role: 'content_admin',
    password: 'manoto1403content',
    title: 'پنل مدیر محتوا (اختصاصی محصولات و موجودی انبار)'
  },
  orders: {
    role: 'order_tracker',
    password: 'manoto1403orders',
    title: 'ادمین پیگیری سفارشات (فقط مشاهده خریداران و پیگیری بار)'
  },
  tracker: {
    role: 'order_tracker',
    password: 'manoto1403orders',
    title: 'ادمین پیگیری سفارشات'
  }
};

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  onAuthenticated,
  onBackToStorefront,
}) => {
  const [selectedPanelTab, setSelectedPanelTab] = useState<UserRoleType>('super_admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSelectTab = (tab: UserRoleType) => {
    setSelectedPanelTab(tab);
    setError('');
    if (tab === 'super_admin') {
      setUsername('admin');
      setPassword('');
    } else if (tab === 'content_admin') {
      setUsername('content');
      setPassword('');
    } else {
      setUsername('orders');
      setPassword('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const inputUser = username.trim().toLowerCase();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      setError('لطفاً هم نام کاربری و هم رمز عبور را وارد فرمایید.');
      return;
    }

    const account = ADMIN_AUTH_ACCOUNTS[inputUser];
    if (account && account.password === inputPass) {
      onAuthenticated(account.role);
    } else {
      setError('اطلاعات ورود نامعتبر است! نام کاربری یا کلمه عبور اشتباه است.');
    }
  };

  return (
    <div
      className="admin-panel min-h-screen bg-[#18181B] text-stone-100 flex flex-col items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-[#18181B]"
      dir="rtl"
    >
      {/* Background Subtle Luxury Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md bg-[#27272A]/95 backdrop-blur-md rounded-3xl border border-[#3F3F46] shadow-2xl p-6 sm:p-8 space-y-5 relative z-10">
        
        {/* Header with Brand Logo */}
        <div className="text-center space-y-2.5">
          <div className="bg-[#18181B] border border-[#3F3F46] p-3.5 rounded-3xl inline-block shadow-inner">
            <ManotoLogo variant="light" size="lg" showPersianSub={false} />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#FAF7F2]">
              ورود به درگاه مدیریت پوشاک من و تو
            </h2>
            <p className="text-xs text-[#D4AF37] font-bold mt-0.5">
              تولید و پخش پوشاک من و تو (اسدی) • پاساژ المهدی ۴
            </p>
          </div>
        </div>

        {/* Panel Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#18181B] rounded-2xl border border-[#3F3F46]">
          <button
            type="button"
            id="btn-tab-login-superadmin"
            onClick={() => handleSelectTab('super_admin')}
            className={`py-2 px-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
              selectedPanelTab === 'super_admin'
                ? 'bg-[#27272A] text-[#D4AF37] shadow-sm border border-[#D4AF37]/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>سوپر ادمین</span>
          </button>

          <button
            type="button"
            id="btn-tab-login-contentadmin"
            onClick={() => handleSelectTab('content_admin')}
            className={`py-2 px-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
              selectedPanelTab === 'content_admin'
                ? 'bg-[#27272A] text-emerald-400 shadow-sm border border-emerald-500/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>مدیر محتوا</span>
          </button>

          <button
            type="button"
            id="btn-tab-login-ordertracker"
            onClick={() => handleSelectTab('order_tracker')}
            className={`py-2 px-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
              selectedPanelTab === 'order_tracker'
                ? 'bg-[#27272A] text-amber-300 shadow-sm border border-amber-400/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>پیگیری سفارشات</span>
          </button>
        </div>

        {/* Role Explanatory Card */}
        <div className="bg-[#18181B]/80 border border-stone-700/60 p-3 rounded-2xl text-[11px] text-stone-300 leading-relaxed">
          {selectedPanelTab === 'super_admin' ? (
            <p>
              👑 <strong className="text-white">پنل سوپر ادمین:</strong> دسترسی نامحدود به تمامی ماژول‌های حسابداری، انبار، چک‌ها، کارگاه‌های دوزنده، تنظیمات سایت و سئو.
            </p>
          ) : selectedPanelTab === 'content_admin' ? (
            <p>
              📦 <strong className="text-emerald-400">پنل مدیر محتوا:</strong> دسترسی اختصاصی به محصولات و انبارداری، مدیریت موجودی پک‌ها، قیمت‌گذاری و ویرایش مشخصات کالاها.
            </p>
          ) : (
            <p>
              🚚 <strong className="text-amber-300">پنل ادمین پیگیری سفارشات:</strong> دسترسی متمرکز جهت مشاهده خریداران، اقلام دقیق سفارش داده شده، تغییر وضعیت بسته‌بندی و صدور بارنامه باربری.
            </p>
          )}
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-950/80 border border-rose-700 text-rose-200 text-xs p-3 rounded-xl flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1">
              نام کاربری پرسنلی:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={selectedPanelTab === 'super_admin' ? 'admin' : selectedPanelTab === 'content_admin' ? 'content' : 'orders'}
                className="w-full px-4 py-3 rounded-xl bg-[#18181B] border border-[#3F3F46] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] text-xs text-white placeholder:text-stone-500 font-mono"
              />
              <User className="w-4 h-4 text-stone-500 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-300 block">
                رمز عبور مدیریت:
              </label>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <Info className="w-3 h-3" />
                <span>راهنمای رمزهای آزمایشی</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="کلمه عبور امنیتی"
                className="w-full px-4 py-3 rounded-xl bg-[#18181B] border border-[#3F3F46] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] text-xs text-white placeholder:text-stone-500 font-mono"
              />
              <Key className="w-4 h-4 text-stone-500 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {showHint && (
            <div className="bg-[#18181B] border border-[#D4AF37]/30 text-stone-300 text-[11px] p-3 rounded-xl space-y-2">
              <p className="font-bold text-[#D4AF37]">حساب‌های ورود سیستم (جهت تست سریع):</p>
              
              <div className="border-b border-stone-800 pb-1.5 space-y-0.5 font-mono text-[11px]">
                <div className="text-white font-bold font-sans">۱. پنل سوپر ادمین (دسترسی کامل):</div>
                <div>نام کاربری: <span className="text-[#D4AF37] font-bold">admin</span></div>
                <div>رمز عبور: <span className="text-stone-200">manoto1403admin</span></div>
              </div>

              <div className="border-b border-stone-800 pb-1.5 space-y-0.5 font-mono text-[11px]">
                <div className="text-emerald-400 font-bold font-sans">۲. پنل مدیر محتوا (اختصاصی محصولات و انبار):</div>
                <div>نام کاربری: <span className="text-emerald-400 font-bold">content</span></div>
                <div>رمز عبور: <span className="text-stone-200">manoto1403content</span></div>
              </div>

              <div className="space-y-0.5 font-mono text-[11px]">
                <div className="text-amber-300 font-bold font-sans">۳. پنل ادمین پیگیری سفارشات:</div>
                <div>نام کاربری: <span className="text-amber-300 font-bold">orders</span></div>
                <div>رمز عبور: <span className="text-stone-200">manoto1403orders</span></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            id="btn-admin-login-submit"
            className="w-full py-3.5 px-4 bg-[#D4AF37] hover:bg-[#C59F2D] active:bg-[#B38F24] text-[#18181B] rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-black/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#18181B]" />
            <span>
              {selectedPanelTab === 'super_admin'
                ? 'ورود به پنل سوپر ادمین'
                : selectedPanelTab === 'content_admin'
                ? 'ورود به پنل مدیر محتوا'
                : 'ورود به پنل پیگیری سفارشات'}
            </span>
          </button>
        </form>

        {/* Return to Public Website */}
        <div className="pt-3 border-t border-[#3F3F46] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onBackToStorefront}
            className="text-stone-400 hover:text-[#D4AF37] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>بازگشت به سایت فروشگاه (MANOTO DRESS)</span>
          </button>

          <span className="text-[10px] text-stone-500 font-mono">v3.2 RBAC</span>
        </div>

      </div>
    </div>
  );
};
