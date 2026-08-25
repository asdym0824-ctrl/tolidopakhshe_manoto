import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Package, 
  Receipt, 
  Scissors, 
  CreditCard, 
  ShoppingBag, 
  Truck, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Percent,
  Search
} from 'lucide-react';
import { ModuleTab } from '../../types';

interface AdminHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: ModuleTab) => void;
}

export const AdminHelpModal: React.FC<AdminHelpModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<'workflows' | 'modules' | 'faq' | 'tips'>('workflows');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const workflows = [
    {
      title: '۱. تعریف کالا، بهای تمام‌شده و بسته‌بندی پک‌ها',
      icon: Package,
      tab: 'inventory' as ModuleTab,
      description: 'در بازار بزرگ تهران، فروش عمده بر اساس پک (۶، ۸، ۱۲ تایی) انجام می‌شود. برای ثبت کالا:',
      steps: [
        'وارد بخش «انبارداری و کالاها» شوید.',
        'دکمه «افزودن کالای جدید» را بزنید.',
        'قیمت پارچه، دستمزد برش/دوخت و ملحقات را وارد کنید تا بهای تمام‌شده اتوماتیک محاسبه شود.',
        'تعداد در هر پک (مثلاً ۶ تایی) و قیمت عمده هر عدد و هر پک را تعیین کنید.',
        'اگر قصد فروش تکی در وب‌سایت را دارید، گزینه «فعال‌سازی تک‌فروشی» را روشن کنید.'
      ]
    },
    {
      title: '۲. صدور فاکتور بنکداری و تسویه حساب بازار',
      icon: Receipt,
      tab: 'sales' as ModuleTab,
      description: 'ثبت سریع فاکتور برای مشتریان شهرستانی یا پاساژهای تهران با پشتیبانی از قیمت همکار و تخفیف:',
      steps: [
        'وارد بخش «فروش و فاکتورها» شده و «صدور فاکتور جدید» را بزنید.',
        'مشتری را از لیست انتخاب کنید یا مشخصات مشتری جدید را سریع بنویسید.',
        'کالاها و تعداد پک درخواستی را اضافه کنید (سیستم مبلغ کل را دقیق محاسبه می‌کند).',
        'نوع تسویه را نقدی، کارت‌به‌کارت یا چکی انتخاب کنید.',
        'با ثبت فاکتور، موجودی انبار به صورت خودکار کسر می‌گردد.'
      ]
    },
    {
      title: '۳. مدیریت زنجیره تولید (تامین پارچه، برش و دوزندگان)',
      icon: Scissors,
      tab: 'production' as ModuleTab,
      description: 'رهگیری مرحله به مرحله تولید از خرید طاقه پارچه تا دوخت و تحویل به انبار:',
      steps: [
        'تامین‌کنندگان پارچه (مانند سرای بوعلی یا خیابان خیام) را ثبت کنید.',
        'کارگاه‌های خیاطی و چرخ‌کاران طرف قرارداد را تعریف کنید.',
        '«ثبت پارت تولید جدید» را بزنید تا مشخص شود چه مدلی، در چه کارگاهی و با چه موعد تحویلی در حال دوخت است.',
        'پس از تحویل بار از کارگاه، وضعیت را به «تکمیل و تحویل به انبار» تغییر دهید.'
      ]
    },
    {
      title: '۴. ثبت و رهگیری چک‌های صیادی مشتریان',
      icon: CreditCard,
      tab: 'finance' as ModuleTab,
      description: 'جلوگیری از فراموشی موعد چک‌های همکاران شهرستانی با هشدارهای هوشمند:',
      steps: [
        'در بخش «حسابداری و چک‌ها»، اطلاعات چک (شماره صیادی ۱۶ رقمی، بانک، سررسید و مبلغ) را ثبت کنید.',
        'سیستم روزهای باقی‌مانده تا سررسید را به رنگ‌های سبز، زرد و قرمز نمایش می‌دهد.',
        'پس از پاس شدن چک در بانک، با یک کلیک وضعیت آن را به «وصول شد» تغییر دهید.'
      ]
    },
    {
      title: '۵. سفارشات آنلاین و هماهنگی با باربری (لجستیک)',
      icon: Truck,
      tab: 'logistics' as ModuleTab,
      description: 'آماده‌سازی بسته‌ها برای باربری وطن، تیپاکس، پیشتاز و چاپار:',
      steps: [
        'سفارشات ثبت‌شده در وب‌سایت مستقیماً در بخش فروش و لجستیک ظاهر می‌شوند.',
        'در بخش «لجستیک و باربری»، برای هر بار بیجک و برچسب باربری چاپ کنید.',
        'کد رهگیری بارنامه را ثبت نمایید تا برای خریدار قابل مشاهده باشد.'
      ]
    }
  ];

  const faqs = [
    {
      q: 'چگونه قیمت تمام کالاهای انبار را یکجا ۱۰٪ افزایش یا کاهش دهم؟',
      a: 'کافیست به بخش «انبارداری و کالاها» بروید و روی دکمه «تغییر درصدی قیمت‌ها» کلیک کنید. سپس درصد مورد نظر را وارد کرده و نوع قیمت (عمده، همکار یا تک‌فروشی) را انتخاب نمایید تا کل انبار در ۱ ثانیه به‌روزرسانی شود.'
    },
    {
      q: 'آیا با ثبت سفارش آنلاین در وب‌سایت، موجودی انبار کم می‌شود؟',
      a: 'بله! سیستم به صورت کاملاً یکپارچه و Real-Time طراحی شده است. هر سفارشی که مشتری در فروشگاه آنلاین ثبت کند، فوراً موجودی پک یا تک آن کالا در انبار را کاهش می‌دهد و یک فاکتور متناظر ایجاد می‌کند.'
    },
    {
      q: 'چگونه لیست همکاران و مشتریان قدیمی را از اکسل وارد کنم؟',
      a: 'در بخش «مشتریان و CRM»، دکمه «ورود از فایل اکسل (Import)» را بزنید. فایل اکسل خود را انتخاب کنید تا اطلاعات تلفن، نام فروشگاه و آدرس همگی به سیستم اضافه شوند.'
    },
    {
      q: 'چگونه می‌توانم از هوش مصنوعی برای کپشن اینستاگرام و تلگرام استفاده کنم؟',
      a: 'در بخش «دستیار سئو و هوش مصنوعی»، مدل مورد نظرتان را انتخاب کنید و روی دکمه «تولید کپشن تلگرام و روبیکا» کلیک نمایید. متن جذاب، هشتگ‌های پربازدید و مشخصات پک آماده کپی کردن در کانال خواهد بود.'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      dir="rtl"
      id="admin-help-modal"
    >
      <div className="bg-white rounded-3xl border border-[#E6DEC8] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#18181B] text-[#FAF7F2] p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#27272A] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#FAF7F2]">
                راهنمای کاربری و نقشه راه سیستم من و تو
              </h2>
              <p className="text-xs text-stone-400">
                آموزش سریع جریان‌های کاری بازار بزرگ، ترفندها و پاسخ به سوالات متداول
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="bg-[#FAF7F2] border-b border-[#E6DEC8] px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory('workflows')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeCategory === 'workflows'
                ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                : 'text-stone-700 hover:bg-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>جریان‌های اصلی کار (Workflow)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('faq')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeCategory === 'faq'
                ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                : 'text-stone-700 hover:bg-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>سوالات پرتکرار بازار (FAQ)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('tips')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeCategory === 'tips'
                ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                : 'text-stone-700 hover:bg-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>کلیدهای میانبر و نکات سریع</span>
          </button>
        </div>

        {/* Body Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Workflows View */}
          {activeCategory === 'workflows' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                💡 با دنبال کردن این ۵ مرحله، کلیه فرایندهای تولید، انبارداری، صدور فاکتور و پیگیری مالی کسب‌وکار خود را بدون سردرگمی مدیریت کنید:
              </p>

              {workflows.map((wf, idx) => {
                const Icon = wf.icon;
                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl border border-[#E6DEC8] p-4 hover:border-stone-800 transition-all shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-stone-900">
                          {wf.title}
                        </h3>
                      </div>

                      {onNavigateToTab && (
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateToTab(wf.tab);
                            onClose();
                          }}
                          className="text-[11px] font-bold text-[#8C6D37] hover:text-stone-950 flex items-center gap-1 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E6DEC8] hover:border-stone-400 transition-all cursor-pointer"
                        >
                          <span>ورود به این بخش</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] sm:text-xs text-stone-600">
                      {wf.description}
                    </p>

                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DEC8]/80 space-y-1.5">
                      {wf.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-[11px] text-stone-700">
                          <span className="w-4 h-4 rounded-full bg-[#18181B] text-[#FAF7F2] text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* FAQ View */}
          {activeCategory === 'faq' && (
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#E6DEC8] overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-3.5 text-right font-black text-xs sm:text-sm text-stone-900 flex items-center justify-between hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#8C6D37] shrink-0" />
                        <span>{faq.q}</span>
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                    </button>

                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs text-stone-600 bg-[#FAF7F2]/50 border-t border-[#E6DEC8] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tips View */}
          {activeCategory === 'tips' && (
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] space-y-2">
                <h4 className="font-black text-xs text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>ورود سریع اطلاعات با زبان محاوره‌ای (دکمه شناور بنفش)</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  در هر کجای سیستم که باشید، با زدن دکمه شناور گوشه صفحه می‌توانید با گفتن یا تایپ عبارات ساده‌ای مثل:
                  <br />
                  <code className="bg-[#FAF7F2] px-2 py-1 rounded text-stone-800 font-bold inline-block mt-1">
                    «۳ پک شلوار بگ به حاج رضا فروخته شد نقد»
                  </code>
                  <br />
                  فاکتور و کسر انبار را در کسری از ثانیه انجام دهید.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] space-y-2">
                <h4 className="font-black text-xs text-stone-900 flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-emerald-600" />
                  <span>تغییر قیمت دسته‌جمعی به دلیل نوسان قیمت پارچه</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  در زمان نوسان بازار پارچه، نیازی به ویرایش تک‌تک کالاها نیست؛ از بخش انبارداری با ابزار تغییر درصدی قیمت‌ها، کل موجودی را در چند ثانیه هماهنگ کنید.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#FAF7F2] p-3 sm:p-4 border-t border-[#E6DEC8] flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            سیستم مدیریت یکپارچه پوشاک من و تو (اسدی)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#18181B] text-[#FAF7F2] rounded-xl text-xs font-bold hover:bg-stone-800 transition-all cursor-pointer"
          >
            متوجه شدم، بستن راهنما
          </button>
        </div>

      </div>
    </div>
  );
};
