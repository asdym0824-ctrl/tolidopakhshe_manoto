import React, { useState } from 'react';
import { 
  Shield, 
  Crown, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Key, 
  Package, 
  Receipt, 
  CreditCard, 
  Users, 
  Share2, 
  Truck, 
  ShoppingBag,
  ShieldCheck,
  Smartphone,
  Save,
  Check
} from 'lucide-react';
import { UserRoleType } from '../types';

interface RolesSettingsModuleProps {
  currentRole: UserRoleType;
  onRoleChange: (role: UserRoleType) => void;
}

export const RolesSettingsModule: React.FC<RolesSettingsModuleProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const [adminPhone, setAdminPhone] = useState('09123456789');
  const [adminName, setAdminName] = useState('حاج رضا اسدی');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const superAdminCapabilities = [
    {
      title: 'انبارداری، پک‌بندی و بهای تمام‌شده',
      desc: 'مدیریت موجودی پک‌ها، قیمت عمده و تکی، بهای تمام‌شده پارچه و تغییر درصدی قیمت‌ها',
      icon: Package,
      status: 'فعال - دسترسی تام'
    },
    {
      title: 'فروش، صدور فاکتور و قیمت‌گذاری چندسطحی',
      desc: 'صدور فاکتور سنتی بازار، اعمال تخفیف نقدی و پکی، تسویه حساب و چاپ فاکتور',
      icon: Receipt,
      status: 'فعال - دسترسی تام'
    },
    {
      title: 'مشتریان و مدیریت اعتبار (CRM)',
      desc: 'مشاهده لیست همکاران بازار، ورود دسته‌جمعی از اکسل، سقف اعتبار چکی و پیگیری',
      icon: Users,
      status: 'فعال - دسترسی تام'
    },
    {
      title: 'حسابداری و استعلام چک‌های صیادی',
      desc: 'ثبت و پیگیری چک‌های بنفش صیادی، تقویم سررسید، گزارش سود ناخالص و گردش مالی',
      icon: CreditCard,
      status: 'فعال - دسترسی تام'
    },
    {
      title: 'اتوماسیون محتوا و بازاریابی هوش مصنوعی (Gemini)',
      desc: 'کپشن‌نویسی هوشمند ژورنالی، زمان‌بندی و انتشار در تلگرام، ایتا، روبیکا، بله و اینستاگرام',
      icon: Share2,
      status: 'فعال - دسترسی تام'
    },
    {
      title: 'لجستیک، بسته‌بندی و بیجک باربری',
      desc: 'هماهنگی با باربری وطن، چاپار، تیپاکس و صدور کد رهگیری و ارسال پیامک به خریدار',
      icon: Truck,
      status: 'فعال - دسترسی تام'
    },
    {
      title: 'ویترین و تنظیمات فروشگاه آنلاین',
      desc: 'مدیریت اطلاعات و بنرهای سایت، شرایط ارسال رایگان و نظارت بر سفارشات اینترنتی',
      icon: ShoppingBag,
      status: 'فعال - دسترسی تام'
    },
    {
      title: 'امنیت و کنترل مرکزی سیستم',
      desc: 'پشتیبان‌گیری از داده‌ها، دسترسی به دیتابیس و مدیریت مجوزهای پرسنل و حجره',
      icon: ShieldCheck,
      status: 'فعال - دسترسی تام'
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div id="roles-settings-module" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Super Admin Banner */}
      <div className="bg-[#18181B] text-[#FAF7F2] p-6 rounded-2xl border border-[#3F3F46] shadow-sm relative overflow-hidden">
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#27272A] border border-[#3F3F46] text-[#D4AF37] flex items-center justify-center font-black">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#FAF7F2]">
                  مدیریت یکپارچه در سطح سوپر ادمین (Super Admin)
                </h2>
                <span className="bg-[#D4AF37] text-[#18181B] text-xs px-2.5 py-0.5 rounded-full font-black">
                  دسترسی تام فعال
                </span>
              </div>
              <p className="text-xs text-[#E6DEC8]/80 mt-1">
                کلیه اختیارات و ابزارهای سیستم بدون محدودیت در اختیار مدیر ارشد (حاج رضا اسدی) تجمیع شده است.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#27272A] border border-[#3F3F46] px-3.5 py-2 rounded-xl text-xs">
            <span className="text-stone-300">نقش فعال سیستم:</span>
            <strong className="text-[#D4AF37] font-black">
              سوپر ادمین مرکزی (مالک و مدیر کل)
            </strong>
          </div>
        </div>
      </div>

      {/* Super Admin Profile & Access Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E6DEC8]">
            <Crown className="w-5 h-5 text-[#8C6D37]" />
            <h3 className="font-black text-sm text-[#18181B]">مشخصات مدیر ارشد</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            {saveSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>اطلاعات سوپر ادمین با موفقیت به‌روزرسانی شد.</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">نام و نام خانوادگی مدیر:</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">شماره همراه ورود و تایید دو مرحله‌ای:</label>
              <input
                type="text"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 focus:bg-white focus:border-[#18181B] outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-bold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                <span>ذخیره تغییرات پروفایل</span>
              </button>
            </div>
          </form>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] text-[11px] text-[#8C6D37] space-y-1">
            <span className="font-bold block text-[#18181B]">امنیت نشست:</span>
            <p>کلیه عملیات‌های حساس (تغییر قیمت‌ها، تایید چک‌ها، صدور فاکتور) با شناسه سوپر ادمین ثبت می‌گردد.</p>
          </div>
        </div>

        {/* Permissions & Capabilities Grid (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-sm text-[#18181B]">
                مجوزهای فعال برای سوپر ادمین (تمامی بخش‌ها)
              </h3>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
              ۸ از ۸ ماژول فعال
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {superAdminCapabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div 
                  key={idx}
                  className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6DEC8] space-y-1.5 hover:border-[#18181B] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#18181B]">
                      <div className="w-6 h-6 rounded-lg bg-[#18181B] text-[#D4AF37] flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{cap.title}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
