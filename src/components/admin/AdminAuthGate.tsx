import React, { useState } from 'react';
import { ShieldCheck, User, Key, Store, AlertCircle, Info, Lock } from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';

interface AdminAuthGateProps {
  onAuthenticated: () => void;
  onBackToStorefront: () => void;
}

/**
 * DEFAULT ADMIN CREDENTIALS
 * 
 * NOTE: For production deployments, these credentials should be migrated to
 * server-side environment variables (e.g. ADMIN_USER, ADMIN_PASSWORD_HASH)
 * and verified via a secure /api/admin/login backend route with bcrypt/JWT.
 */
export const ADMIN_AUTH_CREDENTIALS = {
  username: 'admin',
  password: 'manoto1403admin',
};

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  onAuthenticated,
  onBackToStorefront,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const inputUser = username.trim();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      setError('لطفاً هم نام کاربری و هم رمز عبور مدیریت را وارد فرمایید.');
      return;
    }

    // Secure credential check against defined admin account
    if (
      inputUser === ADMIN_AUTH_CREDENTIALS.username &&
      inputPass === ADMIN_AUTH_CREDENTIALS.password
    ) {
      onAuthenticated();
    } else {
      setError('اطلاعات ورود نامعتبر است! نام کاربری یا کلمه عبور اشتباه است.');
    }
  };

  return (
    <div
      className="min-h-screen bg-[#18181B] text-stone-100 flex flex-col items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-[#18181B]"
      dir="rtl"
    >
      {/* Background Subtle Luxury Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md bg-[#27272A]/95 backdrop-blur-md rounded-3xl border border-[#3F3F46] shadow-2xl p-6 sm:p-8 space-y-6 relative z-10">
        
        {/* Header with Brand Logo */}
        <div className="text-center space-y-3">
          <div className="bg-[#18181B] border border-[#3F3F46] p-4 rounded-3xl inline-block shadow-inner">
            <ManotoLogo variant="light" size="lg" showPersianSub={false} />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#FAF7F2]">
              پرتال مدیریت و انبارداری بازار
            </h2>
            <p className="text-xs text-[#D4AF37] font-bold mt-0.5">
              تولید و پخش پوشاک من و تو (اسدی) • پاساژ المهدی ۴
            </p>
          </div>
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
              نام کاربری یا شناسه پرسنلی:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
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
                <span>راهنمای رمز دمو</span>
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
            <div className="bg-[#18181B] border border-[#D4AF37]/30 text-stone-300 text-[11px] p-3 rounded-xl space-y-1">
              <p className="font-bold text-[#D4AF37]">اطلاعات ورود ادمین (نسخه آزمایشی):</p>
              <div className="font-mono text-[11px] text-stone-300 space-y-0.5">
                <div>نام کاربری: <span className="text-white font-bold">admin</span></div>
                <div>رمز عبور: <span className="text-[#D4AF37] font-bold">manoto1403admin</span></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            id="btn-admin-login-submit"
            className="w-full py-3.5 px-4 bg-[#D4AF37] hover:bg-[#C59F2D] active:bg-[#B38F24] text-[#18181B] rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-black/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#18181B]" />
            <span>ورود به سامانه مدیریت مرکزی</span>
          </button>
        </form>

        {/* Return to Public Website */}
        <div className="pt-4 border-t border-[#3F3F46] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onBackToStorefront}
            className="text-stone-400 hover:text-[#D4AF37] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>بازگشت به سایت فروشگاه (MANOTO DRESS)</span>
          </button>

          <span className="text-[10px] text-stone-500 font-mono">v3.0 Secure</span>
        </div>

      </div>
    </div>
  );
};
