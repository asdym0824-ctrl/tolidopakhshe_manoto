import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, User, Key, Building2, Store } from 'lucide-react';
import { ManotoLogo } from '../common/ManotoLogo';
import { BRAND_INFO } from '../../data/brandInfo';

interface AdminAuthGateProps {
  onAuthenticated: () => void;
  onBackToStorefront: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  onAuthenticated,
  onBackToStorefront
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onAuthenticated();
    } else {
      setError('لطفاً نام کاربری و کلمه عبور را وارد فرمایید.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141416] text-stone-100 flex flex-col items-center justify-center p-4 selection:bg-pink-600 selection:text-white" dir="rtl">
      
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#db2777_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md bg-[#1c1c1f]/95 backdrop-blur-md rounded-3xl border border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6 relative z-10">
        
        {/* Header with Brand Logo */}
        <div className="text-center space-y-3">
          <div className="bg-stone-900 border border-stone-800 p-4 rounded-3xl inline-block shadow-inner">
            <ManotoLogo variant="light" size="lg" showPersianSub={false} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              پرتال مدیریت و انبارداری بازار
            </h2>
            <p className="text-xs text-pink-400 font-bold mt-0.5">
              تولید و پخش پوشاک من و تو (اسدی) • پاساژ المهدی ۴
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-pink-950/80 border border-pink-800 text-pink-300 text-xs p-3 rounded-xl">
              {error}
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
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 text-xs text-white placeholder:text-stone-500 font-mono"
              />
              <User className="w-4 h-4 text-stone-500 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1">
              رمز عبور:
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 text-xs text-white placeholder:text-stone-500 font-mono"
              />
              <Key className="w-4 h-4 text-stone-500 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            id="btn-admin-login-submit"
            className="w-full py-3.5 px-4 bg-pink-600 hover:bg-pink-500 active:bg-pink-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-pink-950 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ورود به سامانه مدیریت مرکزی</span>
          </button>
        </form>

        {/* Return to Public Website */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onBackToStorefront}
            className="text-stone-400 hover:text-pink-400 font-bold flex items-center gap-1.5 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>بازگشت به سایت فروشگاه (MANOTO DRESS)</span>
          </button>

          <span className="text-[10px] text-stone-600 font-mono">v2.4 Pro</span>
        </div>

      </div>
    </div>
  );
};

