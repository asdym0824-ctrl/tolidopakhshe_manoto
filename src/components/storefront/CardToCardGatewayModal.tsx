import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Copy, 
  Check, 
  Clock, 
  Phone, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Smartphone, 
  Lock, 
  X, 
  Upload, 
  User, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { BRAND_INFO } from '../../data/brandInfo';

export interface CardReceiptSubmission {
  senderCardLast4: string;
  trackingRefNumber: string;
  receiptImageUrl?: string;
  bankName?: string;
  depositTime?: string;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
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
  customerName: initialCustomerName,
  customerPhone: initialCustomerPhone,
  onConfirmPayment,
}) => {
  // Destination account details for Manoto Dress (Asadi)
  const destinationAccount = {
    bankName: 'بانک ملت',
    accountHolder: 'آقای اسدی (تولید و پخش پوشاک من و تو)',
    cardNumber: '۶۱۰۴-۳۳۷۸-۹۰۱۲-۳۴۵۶',
    cardNumberRaw: '6104337890123456',
    shebaNumber: 'IR820120000000001234567890',
    accountNumber: '۴۷۸۵۹۲۱۴۳۰',
    branch: 'شعبه بازار بزرگ تهران (پاساژ المهدی ۴)',
  };

  // State
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedSheba, setCopiedSheba] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Form inputs
  const [customerName, setCustomerName] = useState(initialCustomerName || '');
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone || '');
  const [senderCardLast4, setSenderCardLast4] = useState('');
  const [trackingRefNumber, setTrackingRefNumber] = useState('');
  const [senderBank, setSenderBank] = useState('بانک ملت');
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);

  // Sync initial props
  useEffect(() => {
    if (initialCustomerName) setCustomerName(initialCustomerName);
    if (initialCustomerPhone) setCustomerPhone(initialCustomerPhone);
  }, [initialCustomerName, initialCustomerPhone]);

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Countdown timer (15 minutes)
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Lock background page scroll while gateway is active
  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBodyOverflow;
      };
    }
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

  // Image upload
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
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const cleanCard = senderCardLast4.trim().replace(/[^\d]/g, '');
    const cleanRef = trackingRefNumber.trim();
    const cleanPhone = customerPhone.trim().replace(/[^\d]/g, '');

    if (!customerName.trim()) {
      setValidationError('لطفاً نام و نام خانوادگی خریدار را وارد فرمایید.');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setValidationError('لطفاً شماره تلفن همراه معتبر خریدار را وارد فرمایید.');
      return;
    }

    if (!cleanCard && !cleanRef && !receiptImage) {
      setValidationError('لطفاً حداقل شماره پیگیری تراکنش بانکی یا ۴ رقم آخر کارت واریزکننده را وارد فرمایید.');
      return;
    }

    if (cleanCard && cleanCard.length !== 4) {
      setValidationError('لطفاً دقیقاً ۴ رقم پایانی کارت بانکی خود را وارد فرمایید (مثال: ۵۴۸۲).');
      return;
    }

    // Process
    setIsVerifying(true);
    setVerifyStep(1);

    setTimeout(() => {
      setVerifyStep(2);
      setTimeout(() => {
        setVerifyStep(3);
        setTimeout(() => {
          setIsVerifying(false);
          onConfirmPayment({
            customerName: customerName.trim(),
            customerPhone: cleanPhone,
            senderCardLast4: cleanCard || 'ثبت دستی',
            trackingRefNumber: cleanRef || `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
            receiptImageUrl: receiptImage || undefined,
            bankName: senderBank,
            depositTime: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            notes: notes.trim() || undefined,
          });
        }, 600);
      }, 600);
    }, 600);
  };

  const amountRial = amountToman * 10;

  return (
    <div 
      className="fixed inset-0 z-[999999] bg-[#0C0C0F]/95 backdrop-blur-md overflow-y-auto overscroll-contain flex items-center justify-center p-2 sm:p-4 md:p-6"
      style={{ WebkitOverflowScrolling: 'touch' }}
      dir="rtl"
    >
      {/* Modal Dialog Card (Unified Clean Framing) */}
      <div 
        id="card-to-card-gateway-modal"
        className="bg-white w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#DDD5C0] flex flex-col overflow-hidden transition-all my-auto"
      >
        {/* Top Header (div:nth-of-type(1)) */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white p-3.5 sm:p-5 border-b border-[#D4AF37]/40 shrink-0 z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                    سامانه پرداخت هوشمند کارت به کارت شاپرک
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                    <Lock className="w-2.5 h-2.5" />
                    امنیت شتاب ۲۵۶ بیت
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5">
                  پوشاک «من و تو» • تسویه مستقیم به حساب رسمی آقای اسدی (بازار بزرگ تهران)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-stone-300 hover:text-white flex items-center gap-1 text-xs font-bold transition-all cursor-pointer shrink-0"
              title="انصراف و بازگشت به فاکتور"
            >
              <span>انصراف</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader: Order details & countdown */}
          <div className="mt-3 pt-2.5 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-stone-300 text-[11px] sm:text-xs">
              <span>شماره سفارش:</span>
              <span className="font-mono font-bold text-amber-300">{orderNumber}</span>
              <span className="text-stone-600 hidden sm:inline">•</span>
              <span className="hidden sm:inline">پذیرنده:</span>
              <span className="font-bold text-white hidden sm:inline">{BRAND_INFO.managementName} (من و تو)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-stone-900/90 px-3 py-1 rounded-xl border border-stone-700/80 text-stone-200 shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] sm:text-[11px]">زمان باقیمانده جهت پرداخت:</span>
              <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm">{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Main Body Area (div:nth-of-type(2)) */}
        <div 
          className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-6 bg-[#FAF8F5] space-y-5"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* Clean Unified 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* Right Card: Destination Bank Card & Amount (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">

              {/* Amount Highlight Box */}
              <div className="bg-white p-4 rounded-2xl border-2 border-[#D4AF37]/50 shadow-sm space-y-2">
                <span className="text-xs font-bold text-stone-600 block">
                  مبلغ دقیق قابل واریز:
                </span>
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-stone-950 font-mono tracking-tight">
                      {amountToman.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-xs font-bold text-[#8C6D37]">تومان</span>
                  </div>
                  <span className="text-xs text-stone-500 font-mono">
                    ({amountRial.toLocaleString('fa-IR')} ریال)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(String(amountToman), 'amount')}
                  className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  {copiedAmount ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-700 font-bold">مبلغ کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-600" />
                      <span>کپی مبلغ دقیق فاکتور</span>
                    </>
                  )}
                </button>
              </div>

              {/* Luxury Mellat Credit Card Component */}
              <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white shadow-lg bg-gradient-to-bl from-stone-900 via-stone-850 to-stone-950 border border-[#D4AF37]/60 space-y-3.5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-[10px] shadow-xs">
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

                  <span className="text-[9px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono border border-stone-700">
                    SHETAB
                  </span>
                </div>

                {/* 16-Digit Card Number */}
                <div className="text-center py-1">
                  <span className="text-[10px] text-amber-300/90 font-medium block mb-1">
                    شماره کارت مقصد جهت واریز کارت به کارت:
                  </span>
                  <div 
                    onClick={() => handleCopy(destinationAccount.cardNumberRaw, 'card')}
                    className="font-mono text-lg sm:text-xl font-black text-amber-300 tracking-wider dir-ltr cursor-pointer hover:text-white transition-all bg-stone-900/95 py-2.5 px-3 rounded-xl border border-stone-700 flex items-center justify-center gap-2 group active:scale-98"
                    title="کلیک برای کپی سریع شماره کارت"
                  >
                    <span className="select-all">{destinationAccount.cardNumber}</span>
                    <Copy className="w-4 h-4 text-stone-400 group-hover:text-amber-300 transition-colors shrink-0" />
                  </div>
                </div>

                {/* Account Holder */}
                <div>
                  <span className="text-[10px] text-stone-400 block">نام صاحب حساب:</span>
                  <span className="text-xs sm:text-sm font-bold text-white block mt-0.5">
                    {destinationAccount.accountHolder}
                  </span>
                </div>

                {/* Big Copy Card Button */}
                <button
                  type="button"
                  id="btn-copy-destination-card"
                  onClick={() => handleCopy(destinationAccount.cardNumberRaw, 'card')}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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

                {/* Sheba & Account */}
                <div className="pt-2 border-t border-stone-800 text-[10px] space-y-1 text-stone-300">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-stone-400">شماره شبا:</span>
                    <div className="flex items-center gap-1 font-mono dir-ltr select-all">
                      <span>{destinationAccount.shebaNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(destinationAccount.shebaNumber, 'sheba')}
                        className="text-amber-400 hover:underline cursor-pointer"
                      >
                        {copiedSheba ? 'کپی شد' : 'کپی'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-stone-400">شماره حساب:</span>
                    <span className="font-mono font-bold text-stone-200">{destinationAccount.accountNumber}</span>
                  </div>
                </div>
              </div>

              {/* Supported Banking Apps */}
              <div className="bg-white rounded-2xl p-3 border border-[#DDD5C0] space-y-1.5 text-[11px]">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#8C6D37]" />
                  پشتیبانی از واریز با تمام اپلیکیشن‌های بانکی:
                </span>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-stone-600">
                  {['همراه کارت', 'آپ (آسان پرداخت)', 'بلوبانک', 'بله', 'توبانک', 'سکه'].map(app => (
                    <span key={app} className="px-2 py-0.5 rounded-lg bg-stone-100 font-medium">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Left Card: Customer Details & Receipt Submission (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-[#DDD5C0] shadow-sm space-y-4">
              <div className="border-b border-[#E6DEC8] pb-3">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                    ۲
                  </span>
                  <span>مشخصات خریدار و رسید واریزی جهت استعلام و تایید فاکتور</span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">
                  پس از واریز از طریق همراه بانک یا خودپرداز، اطلاعات زیر را تکمیل فرمایید:
                </p>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Customer Full Name */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      نام و نام خانوادگی خریدار: <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="نام گیرنده فاکتور"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs text-stone-900 bg-[#FAF8F5]"
                      />
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Customer Phone */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      شماره تماس همراه (جهت پیامک): <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs font-mono text-stone-900 bg-[#FAF8F5]"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* 4 digits of sender's card */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      ۴ رقم پایانی کارت واریزکننده: <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={4}
                        value={senderCardLast4}
                        onChange={(e) => setSenderCardLast4(e.target.value.replace(/[^\d]/g, ''))}
                        placeholder="مثال: ۸۸۱۴"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs font-mono text-center font-bold text-stone-900 bg-[#FAF8F5] tracking-widest"
                      />
                      <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                    <span className="text-[10px] text-stone-500 mt-0.5 block">
                      جهت تطبیق تراکنش با کارت خریدار
                    </span>
                  </div>

                  {/* Tracking / Reference Number */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      شماره پیگیری / کد ارجاع رسید: <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={trackingRefNumber}
                        onChange={(e) => setTrackingRefNumber(e.target.value)}
                        placeholder="کد ۶ الی ۱۲ رقمی پیگیری یا RRN"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs font-mono text-stone-900 bg-[#FAF8F5]"
                      />
                      <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                    <span className="text-[10px] text-stone-500 mt-0.5 block">
                      شماره ارجاع درج شده روی رسید اپلیکیشن
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs text-stone-800 bg-[#FAF8F5]"
                    >
                      <option value="بانک ملت">بانک ملت</option>
                      <option value="بانک ملی ایران">بانک ملی ایران</option>
                      <option value="بانک صادرات">بانک صادرات</option>
                      <option value="بانک سامان / بلوبانک">بانک سامان / بلوبانک</option>
                      <option value="بانک تجارت">بانک تجارت</option>
                      <option value="بانک سپه">بانک سپه</option>
                      <option value="بانک پاسارگاد">بانک پاسارگاد</option>
                      <option value="بانک پارسیان">بانک پارسیان</option>
                      <option value="قرض‌الحسنه رسالت">قرض‌الحسنه رسالت</option>
                      <option value="قرض‌الحسنه مهر ایران">قرض‌الحسنه مهر ایران</option>
                      <option value="سایر بانک‌های شتاب">سایر بانک‌های شتاب</option>
                    </select>
                  </div>

                  {/* Upload Receipt Image */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      تصویر یا اسکرین‌شات فیش (اختیاری):
                    </label>
                    <label className="w-full px-3 py-2 rounded-xl border border-dashed border-[#DDD5C0] hover:border-[#18181B] bg-[#FAF8F5] cursor-pointer flex items-center justify-between text-xs text-stone-600 transition-all">
                      <div className="flex items-center gap-2 truncate">
                        <Upload className="w-4 h-4 text-[#8C6D37] shrink-0" />
                        <span className="truncate text-[11px]">{receiptFileName || 'انتخاب عکس رسید...'}</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="hidden"
                      />
                      <span className="text-[10px] bg-white border border-[#DDD5C0] text-stone-700 px-2 py-0.5 rounded font-bold shrink-0">
                        انتخاب فایل
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
                      placeholder="توضیحات لازم برای حسابداری بازار..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs text-stone-800 bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                {/* Receipt Image Preview */}
                {receiptImage && (
                  <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#DDD5C0] flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img 
                        src={receiptImage} 
                        alt="پیش‌نمایش فیش" 
                        className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0" 
                      />
                      <div className="truncate">
                        <span className="font-bold text-stone-900 block truncate">تصویر رسید پیوست شد</span>
                        <span className="text-[10px] text-stone-500 font-mono truncate block">{receiptFileName}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptImage(null);
                        setReceiptFileName(null);
                      }}
                      className="text-rose-600 text-xs font-bold hover:underline cursor-pointer shrink-0"
                    >
                      حذف
                    </button>
                  </div>
                )}

                {/* Verification Process Animation */}
                {isVerifying && (
                  <div className="bg-stone-900 text-white rounded-2xl p-3.5 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center gap-2.5">
                      <RefreshCw className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
                      <span className="font-bold text-xs sm:text-sm">
                        {verifyStep === 1 && 'در حال اتصال به سوییچ پرداخت شتاب و استعلام شماره پیگیری...'}
                        {verifyStep === 2 && 'تطبیق تراکنش با حساب پذیرنده تولید و پخش پوشاک من و تو...'}
                        {verifyStep === 3 && 'صدور تاییدیه رسمی پرداخت و ارسال اطلاعات فاکتور به انبار...'}
                      </span>
                    </div>
                    <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full transition-all duration-300" 
                        style={{ width: `${(verifyStep / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

          </div>

        </div>

        {/* Footer Action Bar (Pinned Bottom of Modal Card) */}
        <div className="bg-white border-t border-[#E6DEC8] p-3 sm:p-4.5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg z-10">
          <div className="flex items-center gap-2 text-stone-600 text-xs order-2 sm:order-1 self-start sm:self-auto">
            <Phone className="w-4 h-4 text-[#8C6D37] shrink-0" />
            <span>پشتیبانی اضطراری واریز کارت به کارت: ۰۹۱۲۰۳۶۹۵۶۷ ({BRAND_INFO.managementName})</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className="py-3 px-5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer shrink-0"
            >
              انصراف و ویرایش فاکتور
            </button>

            <button
              type="button"
              id="btn-confirm-card-to-card-payment"
              disabled={isVerifying}
              onClick={() => handleSubmit()}
              className="flex-1 sm:flex-initial py-3 px-7 bg-gradient-to-r from-stone-950 via-[#18181B] to-stone-950 hover:bg-stone-900 active:scale-[0.98] text-[#FAF7F2] rounded-xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/60"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isVerifying ? 'در حال ثبت تاییدیه...' : 'تایید انتقال و ثبت نهایی فاکتور'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
