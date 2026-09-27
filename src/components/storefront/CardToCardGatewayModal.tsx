import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock, 
  Phone, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Smartphone, 
  Lock, 
  Landmark, 
  X,
  Upload,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { BRAND_INFO } from '../../data/brandInfo';

export interface CardReceiptSubmission {
  senderCardLast4: string;
  trackingRefNumber: string;
  receiptImageUrl?: string;
  bankName?: string;
  depositTime?: string;
  notes?: string;
}

interface CardToCardGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountToman: number;
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  onConfirmPayment: (receiptData: CardReceiptSubmission) => void;
}

export const CardToCardGatewayModal: React.FC<CardToCardGatewayModalProps> = ({
  isOpen,
  onClose,
  amountToman,
  orderNumber = 'MNT-1403',
  customerName,
  customerPhone,
  onConfirmPayment,
}) => {
  // Card details of the destination account (Manoto Dress - Asadi)
  const destinationAccount = {
    bankName: 'بانک ملت',
    accountHolder: 'آقای اسدی (تولید و پخش پوشاک من و تو)',
    cardNumber: '۶۱۰۴-۳۳۷۸-۹۰۱۲-۳۴۵۶',
    cardNumberRaw: '6104337890123456',
    shebaNumber: 'IR820120000000001234567890',
    accountNumber: '۴۷۸۵۹۲۱۴۳۰',
    branch: 'بازار بزرگ تهران (شعبه عباس‌آباد)',
  };

  // State
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedSheba, setCopiedSheba] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Form inputs
  const [senderCardLast4, setSenderCardLast4] = useState('');
  const [trackingRefNumber, setTrackingRefNumber] = useState('');
  const [senderBank, setSenderBank] = useState('ملت');
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);

  // Processing & verification animation state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Countdown timer (15 minutes = 900 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (!isOpen) return null;

  // Copy helper
  const handleCopy = (text: string, type: 'card' | 'sheba' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'card') {
      setCopiedCard(true);
      setTimeout(() => setCopiedCard(false), 2500);
    } else if (type === 'sheba') {
      setCopiedSheba(true);
      setTimeout(() => setCopiedSheba(false), 2500);
    } else if (type === 'amount') {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2500);
    }
  };

  // Image upload simulation
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle submit payment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Basic validation
    const cleanCard = senderCardLast4.trim().replace(/[^\d]/g, '');
    const cleanRef = trackingRefNumber.trim();

    if (!cleanCard && !cleanRef && !receiptImage) {
      setValidationError('لطفاً حداقل شماره پیگیری تراکنش بانکی یا ۴ رقم آخر شماره کارت واریزکننده را وارد فرمایید.');
      return;
    }

    if (cleanCard && cleanCard.length !== 4) {
      setValidationError('لطفاً دقیقاً ۴ رقم پایانی کارت بانکی خود را وارد فرمایید (مثال: ۵۴۸۲).');
      return;
    }

    // Start verification workflow
    setIsVerifying(true);
    setVerifyStep(1);

    setTimeout(() => {
      setVerifyStep(2);
      setTimeout(() => {
        setVerifyStep(3);
        setTimeout(() => {
          setIsVerifying(false);
          onConfirmPayment({
            senderCardLast4: cleanCard || 'ثبت دستی',
            trackingRefNumber: cleanRef || `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
            receiptImageUrl: receiptImage || undefined,
            bankName: senderBank,
            depositTime: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            notes: notes.trim() || undefined,
          });
        }, 800);
      }, 900);
    }, 900);
  };

  const amountRial = amountToman * 10;

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      dir="rtl"
    >
      <div 
        id="card-to-card-gateway-modal"
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
      >
        {/* Gateway Official Top Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-4 sm:p-5 border-b border-[#D4AF37]/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                    سامانه پرداخت هوشمند کارت به کارت
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    امنیت ۲۵۶ بیت
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  پوشاک «من و تو» • تسویهٔ مستقیم شتاب و ثبت لحظه‌ای سفارش
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="انصراف و بازگشت"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader: Order details & countdown */}
          <div className="mt-4 pt-3 border-t border-stone-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-stone-300">
              <span>شماره سفارش:</span>
              <span className="font-mono font-bold text-amber-300">{orderNumber}</span>
              <span className="text-stone-500">•</span>
              <span>خریدار:</span>
              <span className="font-bold text-white">{customerName || 'مشتری گرامی'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-stone-800/90 px-3 py-1 rounded-xl border border-stone-700 text-stone-200">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">مهلت پرداخت:</span>
              <span className="font-mono font-bold text-amber-400">{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Amount Banner */}
        <div className="bg-[#FAF7F2] p-4 sm:p-5 border-b border-[#E6DEC8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs text-stone-500 block">مبلغ قابل واریز فاکتور:</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {amountToman.toLocaleString('fa-IR')}
              </span>
              <span className="text-sm font-bold text-stone-700">تومان</span>
              <span className="text-xs text-stone-400 font-mono">
                ({amountRial.toLocaleString('fa-IR')} ریال)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCopy(String(amountToman), 'amount')}
            className="self-start sm:self-auto px-3.5 py-2 bg-white hover:bg-stone-50 border border-[#DDD5C0] text-stone-800 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            {copiedAmount ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">مبلغ کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>کپی مبلغ دقیق</span>
              </>
            )}
          </button>
        </div>

        {/* Main Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Luxury Realistic Bank Card Component */}
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white shadow-xl bg-gradient-to-bl from-[#18181B] via-[#27272A] to-[#09090B] border-2 border-[#D4AF37]/50">
            {/* Background Texture & Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

            <div className="relative z-10 space-y-4">
              {/* Card Header: Bank & Shetab */}
              <div className="flex items-center justify-between border-b border-stone-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600/90 text-white flex items-center justify-center font-black text-[11px] shadow-sm">
                    ملت
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wide text-white block">
                      {destinationAccount.bankName}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {destinationAccount.branch}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-mono border border-stone-700">
                    SHETAB
                  </span>
                  <div className="w-7 h-5 rounded-md bg-amber-400/30 border border-amber-300/40 flex items-center justify-center">
                    <div className="w-4 h-3 rounded-sm bg-gradient-to-r from-amber-400 to-amber-200" />
                  </div>
                </div>
              </div>

              {/* 16-Digit Card Number (Large & Segmented) */}
              <div className="py-2 text-center">
                <span className="text-[11px] text-amber-300/90 font-medium block mb-1">
                  شماره کارت ۱۶ رقمی جهت واریز:
                </span>
                <div 
                  onClick={() => handleCopy(destinationAccount.cardNumberRaw, 'card')}
                  className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider dir-ltr cursor-pointer hover:text-white transition-all bg-stone-900/80 py-2.5 px-3 rounded-2xl border border-stone-700 flex items-center justify-center gap-2 group"
                  title="کلیک برای کپی"
                >
                  <span>{destinationAccount.cardNumber}</span>
                  <Copy className="w-4 h-4 text-stone-400 group-hover:text-amber-300 transition-colors" />
                </div>
              </div>

              {/* Card Footer: Account Holder & Action */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-stone-400 block">نام صاحب حساب:</span>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {destinationAccount.accountHolder}
                  </span>
                </div>

                {/* Big Copy Card Button */}
                <button
                  type="button"
                  id="btn-copy-destination-card"
                  onClick={() => handleCopy(destinationAccount.cardNumberRaw, 'card')}
                  className="py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedCard ? (
                    <>
                      <Check className="w-4 h-4 text-stone-950 stroke-[3]" />
                      <span>شماره کارت کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>کپی شماره کارت ۱۶ رقمی</span>
                    </>
                  )}
                </button>
              </div>

              {/* Collapsible / Quick info for Sheba and Account */}
              <div className="pt-2 border-t border-stone-800 text-[11px] flex flex-wrap items-center justify-between gap-2 text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="text-stone-400">شماره شبا:</span>
                  <span className="font-mono text-stone-200 dir-ltr select-all">{destinationAccount.shebaNumber}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(destinationAccount.shebaNumber, 'sheba')}
                    className="text-amber-400 hover:text-amber-300 text-[10px] underline cursor-pointer"
                  >
                    {copiedSheba ? 'کپی شد' : 'کپی شبا'}
                  </button>
                </div>
                <div>
                  <span className="text-stone-400">شماره حساب:</span>{' '}
                  <span className="font-mono font-bold text-stone-200">{destinationAccount.accountNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Bank Transfer Apps Chips */}
          <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#DDD5C0] space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-700 font-bold">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#8C6D37]" />
                انتقال سریع از طریق اپلیکیشن‌های بانکی و کارت به کارت:
              </span>
              <span className="text-[10px] text-stone-500 font-normal">
                پشتیبانی از تمام اپ‌ها
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {[
                { name: 'همراه کارت', note: 'واریز سریع' },
                { name: 'آپ (آسان پرداخت)', note: 'کارت به کارت' },
                { name: 'بلوبانک (سامان)', note: 'انتقال شتابی' },
                { name: 'بله (بانک ملی)', note: 'کارت به کارت' },
                { name: 'ایوا / سکه / تاپ', note: 'شتاب' },
              ].map((app) => (
                <div 
                  key={app.name} 
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD5C0] text-stone-700 flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold">{app.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 Form: Customer Transfer Details Submission */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E6DEC8]">
              <div className="w-6 h-6 rounded-lg bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                ۲
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                مشخصات واریزی شما جهت استعلام و تایید فاکتور
              </h3>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 4 digits of sender's card */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  ۴ رقم پایانی کارت بانکی واریزکننده: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    value={senderCardLast4}
                    onChange={(e) => setSenderCardLast4(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="مثال: ۷۴۱۹"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs font-mono text-center text-stone-900 bg-white tracking-widest"
                  />
                  <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  جهت تطبیق تراکنش با کارت خریدار
                </span>
              </div>

              {/* Tracking / Reference Number */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  شماره پیگیری / شماره ارجاع رسید بانکی: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={trackingRefNumber}
                    onChange={(e) => setTrackingRefNumber(e.target.value)}
                    placeholder="کد ۶ الی ۱۲ رقمی پیگیری یا RRN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs font-mono text-stone-900 bg-white"
                  />
                  <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  کد درج شده روی رسید اپلیکیشن یا خودپرداز
                </span>
              </div>

              {/* Sender Bank */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  بانک مبدا شما:
                </label>
                <select
                  value={senderBank}
                  onChange={(e) => setSenderBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs text-stone-800 bg-white"
                >
                  <option value="ملت">بانک ملت</option>
                  <option value="ملی">بانک ملی ایران</option>
                  <option value="صادرات">بانک صادرات</option>
                  <option value="سامان / بلو">بانک سامان / بلوبانک</option>
                  <option value="تجارت">بانک تجارت</option>
                  <option value="سپه">بانک سپه</option>
                  <option value="پاسارگاد">بانک پاسارگاد</option>
                  <option value="پارسیان">بانک پارسیان</option>
                  <option value="رسالت">بانک قرض‌الحسنه رسالت</option>
                  <option value="مهر ایران">قرض‌الحسنه مهر ایران</option>
                  <option value="سایر">سایر بانک‌های شتاب</option>
                </select>
              </div>

              {/* Upload Receipt Image */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  تصویر فیش واریزی (اختیاری اما تسریع‌کننده):
                </label>
                <label className="w-full px-3.5 py-2 rounded-xl border border-dashed border-[#DDD5C0] hover:border-[#18181B] bg-white cursor-pointer flex items-center justify-between text-xs text-stone-600 transition-all">
                  <div className="flex items-center gap-2 truncate">
                    <Upload className="w-4 h-4 text-[#8C6D37] flex-shrink-0" />
                    <span className="truncate">{receiptFileName || 'انتخاب تصویر رسید...'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold">
                    آپلود
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  یادداشت یا توضیحات واریز (اختیاری):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: واریز از همراه بانک سامان به نام محمدی"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs text-stone-800 bg-white"
                />
              </div>
            </div>

            {/* Receipt Preview Thumbnail if uploaded */}
            {receiptImage && (
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#DDD5C0] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <img 
                    src={receiptImage} 
                    alt="پیش‌نمایش فیش" 
                    className="w-12 h-12 object-cover rounded-lg border border-stone-200" 
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">فیش واریزی پیوست شد</span>
                    <span className="text-[10px] text-stone-500 font-mono truncate">{receiptFileName}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReceiptImage(null);
                    setReceiptFileName(null);
                  }}
                  className="text-rose-600 text-xs font-bold hover:underline cursor-pointer"
                >
                  حذف تصویر
                </button>
              </div>
            )}

            {/* Verification Loading Simulation Banner */}
            {isVerifying && (
              <div className="bg-stone-900 text-white rounded-2xl p-4 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-amber-400 animate-spin flex-shrink-0" />
                  <span className="font-bold text-xs sm:text-sm">
                    {verifyStep === 1 && 'در حال اتصال به سوییچ پرداخت شتاب و استعلام تراکنش...'}
                    {verifyStep === 2 && 'تطبیق شماره پیگیری با حساب پذیرنده تولید و پخش من و تو...'}
                    {verifyStep === 3 && 'صدور تاییدیه رسمی پرداخت و ارسال اطلاعات به انبار...'}
                  </span>
                </div>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full transition-all duration-500" 
                    style={{ width: `${(verifyStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isVerifying}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer"
              >
                انصراف و بازگشت به فاکتور
              </button>

              <button
                type="submit"
                id="btn-confirm-card-to-card-payment"
                disabled={isVerifying}
                className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-[#18181B] hover:bg-[#27272A] active:scale-[0.98] text-[#FAF7F2] rounded-xl font-black text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/60"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تایید انتقال و ثبت نهایی فاکتور</span>
              </button>
            </div>
          </form>

          {/* Quick Help & Contact */}
          <div className="pt-3 border-t border-[#E6DEC8] flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#8C6D37]" />
              پشتیبانی فوری کارت به کارت: ۰۹۱۲۰۳۶۹۵۶۷ ({BRAND_INFO.managementName})
            </span>
            <span>پاساژ المهدی ۴، پلاک ۲۴۲</span>
          </div>

        </div>
      </div>
    </div>
  );
};
