import React, { useState, useEffect } from 'react';
import { CartItem, StorefrontCustomerInfo, StorefrontShippingMethod, StorefrontOrder, CustomerUser, InstantCourierInfo } from '../../types';
import { FormalInvoicePrintSheet } from './FormalInvoicePrintSheet';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  CheckCircle2,
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Printer, 
  Copy, 
  Check, 
  Building2, 
  MapPin, 
  Phone, 
  PhoneCall, 
  User, 
  FileText,
  AlertCircle,
  Zap,
  Clock,
  Sparkles,
  Bike,
  Navigation,
  Lock,
  Eye,
  EyeOff,
  Hash,
  Layers
} from 'lucide-react';

interface CheckoutViewProps {
  cartItems: CartItem[];
  onBackToShop: () => void;
  onOrderPlaced: (order: StorefrontOrder) => void;
  onClearCart: () => void;
  isPartnerLoggedIn?: boolean;
  loggedInCustomer?: CustomerUser | null;
  customerUsers?: CustomerUser[];
  onRegisterCustomerUser?: (user: CustomerUser) => void;
  onLoginCustomerUser?: (user: CustomerUser) => void;
  onUpdateCustomerUser?: (user: CustomerUser) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  onBackToShop,
  onOrderPlaced,
  onClearCart,
  isPartnerLoggedIn = false,
  loggedInCustomer = null,
  customerUsers = [],
  onRegisterCustomerUser,
  onLoginCustomerUser,
  onUpdateCustomerUser,
}) => {
  // Authentication & Registration Gate State
  const [activeUser, setActiveUser] = useState<CustomerUser | null>(loggedInCustomer || null);
  const [isAuthCompleted, setIsAuthCompleted] = useState<boolean>(!!loggedInCustomer || isPartnerLoggedIn);
  const [authPhone, setAuthPhone] = useState(loggedInCustomer?.phone || '');
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessBanner, setAuthSuccessBanner] = useState<string | null>(null);

  // Sync when loggedInCustomer changes
  useEffect(() => {
    if (loggedInCustomer) {
      setActiveUser(loggedInCustomer);
      setIsAuthCompleted(true);
      setAuthPhone(loggedInCustomer.phone);
      setCustomer(prev => ({
        ...prev,
        phone: loggedInCustomer.phone,
        fullName: prev.fullName || loggedInCustomer.fullName,
        landlinePhone: prev.landlinePhone || loggedInCustomer.landlinePhone,
        alternativePhone: prev.alternativePhone || loggedInCustomer.alternativePhone,
        province: prev.province || loggedInCustomer.province,
        city: prev.city || loggedInCustomer.city,
        address: prev.address || loggedInCustomer.address,
        postalCode: prev.postalCode || loggedInCustomer.postalCode,
      }));
    }
  }, [loggedInCustomer]);

  // Customer Form State
  const [customer, setCustomer] = useState<StorefrontCustomerInfo>({
    fullName: loggedInCustomer?.fullName || (isPartnerLoggedIn ? 'حاج داوود محمدی (همکار اصفهان)' : ''),
    phone: loggedInCustomer?.phone || (isPartnerLoggedIn ? '09131114589' : ''),
    landlinePhone: loggedInCustomer?.landlinePhone || (isPartnerLoggedIn ? '03132224455' : ''),
    alternativePhone: loggedInCustomer?.alternativePhone || '',
    province: loggedInCustomer?.province || (isPartnerLoggedIn ? 'اصفهان' : 'تهران'),
    city: loggedInCustomer?.city || (isPartnerLoggedIn ? 'اصفهان' : 'تهران'),
    address: loggedInCustomer?.address || (isPartnerLoggedIn ? 'خیابان عبدالرزاق، پاساژ کلاهدوزان، پلاک ۱۸' : ''),
    postalCode: loggedInCustomer?.postalCode || '',
    notes: '',
    isPartnerWholesale: isPartnerLoggedIn || loggedInCustomer?.isPartnerWholesale,
    storeName: loggedInCustomer?.storeName || (isPartnerLoggedIn ? 'پخش عمده پوشاک محمدی' : ''),
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<StorefrontShippingMethod>('peyk_instant');

  // Check if destination is Tehran (province or city contains تهران)
  const isTehranDestination = Boolean(
    (customer.province && customer.province.trim().includes('تهران')) ||
    (customer.city && customer.city.trim().includes('تهران'))
  );

  // Auto-switch away from instant peyk if user selects a non-Tehran destination
  React.useEffect(() => {
    if (!isTehranDestination && (shippingMethod === 'peyk_instant' || shippingMethod === 'peyk_tehran')) {
      setShippingMethod(isPartnerLoggedIn ? 'barbari_vatan' : 'tipax');
    }
  }, [customer.province, customer.city, isTehranDestination, shippingMethod, isPartnerLoggedIn]);

  // Instant Courier Options State
  const [courierProvider, setCourierProvider] = useState<'snapp_box' | 'alopeyk' | 'tapsi_pack' | 'dedicated_bazaar'>('snapp_box');
  const [courierUrgency, setCourierUrgency] = useState<'immediate_2h' | 'today_evening' | 'custom_time'>('immediate_2h');
  const [courierDeliveryNote, setCourierDeliveryNote] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'online_gateway' | 'card_to_card' | 'wholesale_check'>('online_gateway');

  // Simulated Gateway State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<StorefrontOrder | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Totals
  const subtotalToman = cartItems.reduce((acc, item) => acc + item.totalPriceToman, 0);
  
  const shippingCosts: Record<StorefrontShippingMethod, { title: string; cost: number; desc: string; badge?: string; isInstant?: boolean }> = {
    peyk_instant: {
      title: '⚡ ارسال لحظه‌ای با پیک (تحویل زیر ۲ ساعت)',
      cost: 95000,
      desc: 'سریع‌ترین شیوه • ارسال بلافاصله پس از ثبت سفارش با اسنپ‌باکس، الوپیک و تپسی‌پک در تهران و حومه',
      badge: '⚡ تحویل فوری زیر ۲ ساعت',
      isInstant: true,
    },
    barbari_vatan: {
      title: 'باربری وطن (میدان شوش)',
      cost: 85000,
      desc: 'مناسب‌ترین گزینه برای کیسه و کارتن‌های عمده • تحویل به انبار باربری شهر مقصد',
      badge: 'پیشنهاد عمده بازار',
    },
    tipax: {
      title: 'تیپاکس اکسپرس',
      cost: 65000,
      desc: 'تحویل سریع درب منزل یا فروشگاه با کد رهگیری پیامکی',
    },
    chapar: {
      title: 'چاپار',
      cost: 55000,
      desc: 'مناسب بسته‌های سبک و متوسط تک‌فروشی و نیمه‌عمده',
    },
    peyk_tehran: {
      title: 'پیک موتوری عادی بازار',
      cost: 70000,
      desc: 'ویژه شهر تهران و بازار بزرگ • تحویل تا پایان روز کاری',
    },
    post_pishtaz: {
      title: 'پست پیشتاز',
      cost: 45000,
      desc: 'تحویل به کلیه نقاط روستایی و شهری سراسر ایران',
    }
  };

  const selectedShipping = shippingCosts[shippingMethod];
  const finalAmountToman = subtotalToman + selectedShipping.cost;

  const handleQuickAuthSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    // Normalize phone number (convert Persian/Arabic digits and strip non-digits)
    const cleanPhone = authPhone.trim().replace(/[\u0660-\u0669\u06F0-\u06F9]/g, d => 
      String.fromCharCode(d.charCodeAt(0) - (d.charCodeAt(0) >= 0x06F0 ? 0x06F0 : 0x0660) + 48)
    ).replace(/[^\d]/g, '');

    if (!cleanPhone) {
      setAuthError('لطفاً شماره تلفن همراه خود را وارد فرمایید.');
      return;
    }
    if (!/^0?9\d{9}$/.test(cleanPhone)) {
      setAuthError('شماره تلفن همراه معتبر نیست. لطفاً شماره را به‌صورت ۱۱ رقمی (مثال: ۰۹۱۲۳۴۵۶۷۸۹) وارد فرمایید.');
      return;
    }

    const standardPhone = cleanPhone.startsWith('0') ? cleanPhone : `0${cleanPhone}`;

    if (!authPassword || authPassword.trim().length < 4) {
      setAuthError('لطفاً یک رمز عبور حداقل ۴ رقمی یا حروفی برای حسابتان تعیین فرمایید.');
      return;
    }

    const existingUser = customerUsers.find(u => u.phone === standardPhone);

    if (authMode === 'register') {
      if (existingUser) {
        setAuthMode('login');
        setAuthError('این شماره قبلاً در سامانه ثبت‌نام شده است. لطفاً رمز عبور خود را وارد کرده و روی «ورود به حساب» کلیک فرمایید.');
        return;
      }

      // Create new customer account
      const newUser: CustomerUser = {
        id: `usr-${Date.now()}`,
        phone: standardPhone,
        password: authPassword.trim(),
        fullName: customer.fullName || '',
        landlinePhone: customer.landlinePhone,
        alternativePhone: customer.alternativePhone,
        province: customer.province || 'تهران',
        city: customer.city || 'تهران',
        address: customer.address || '',
        registeredAt: new Date().toLocaleDateString('fa-IR'),
      };

      onRegisterCustomerUser?.(newUser);
      onLoginCustomerUser?.(newUser);
      setActiveUser(newUser);
      setIsAuthCompleted(true);
      setCustomer(prev => ({ ...prev, phone: standardPhone }));
      setAuthSuccessBanner(`ثبت‌نام با شمارهٔ ${standardPhone} انجام شد. اکنون مشخصات آدرس ارسال را در کادر زیر تکمیل فرمایید.`);
    } else {
      // Login mode
      if (!existingUser) {
        setAuthMode('register');
        setAuthError('کاربری با این شماره یافت نشد. لطفاً تب «ثبت‌نام خریدار جدید» را انتخاب کنید.');
        return;
      }

      if (existingUser.password && existingUser.password !== authPassword.trim()) {
        setAuthError('رمز عبور وارد شده نادرست است. لطفاً مجدداً بررسی فرمایید.');
        return;
      }

      onLoginCustomerUser?.(existingUser);
      setActiveUser(existingUser);
      setIsAuthCompleted(true);
      setCustomer(prev => ({
        ...prev,
        phone: standardPhone,
        fullName: existingUser.fullName || prev.fullName,
        landlinePhone: existingUser.landlinePhone || prev.landlinePhone,
        alternativePhone: existingUser.alternativePhone || prev.alternativePhone,
        province: existingUser.province || prev.province,
        city: existingUser.city || prev.city,
        address: existingUser.address || prev.address,
        postalCode: existingUser.postalCode || prev.postalCode,
      }));
      setAuthSuccessBanner(`ورود موفقیت‌آمیز به حساب • خوش آمدید ${existingUser.fullName || ''}`);
    }
  };

  const handleSwitchAuth = () => {
    setIsAuthCompleted(false);
    setActiveUser(null);
    setAuthSuccessBanner(null);
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isAuthCompleted) {
      setFormError('لطفاً ابتدا در بخش بالای فرم، شماره موبایل خود را وارد کرده و رمز عبور را تعیین فرمایید.');
      const elem = document.getElementById('checkout-customer-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setFormError('لطفاً نام و نام خانوادگی، شماره تماس و آدرس دقیق گیرنده را تکمیل فرمایید.');
      const elem = document.getElementById('checkout-customer-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (paymentMethod === 'online_gateway') {
      setIsGatewayOpen(true);
    } else {
      finalizeOrder(paymentMethod === 'card_to_card' ? 'pending_verification' : 'pending_check');
    }
  };

  const finalizeOrder = (status: 'paid' | 'pending_verification' | 'pending_check') => {
    // Keep registered customer profile up to date
    if (activeUser && onUpdateCustomerUser) {
      onUpdateCustomerUser({
        ...activeUser,
        fullName: customer.fullName,
        landlinePhone: customer.landlinePhone,
        alternativePhone: customer.alternativePhone,
        province: customer.province,
        city: customer.city,
        address: customer.address,
        postalCode: customer.postalCode,
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `MNT-${randomSuffix}`;
    const orderNumber = `MNT-1403-${randomSuffix}`;

    const instantCourierInfo: InstantCourierInfo | undefined = shippingMethod === 'peyk_instant' ? {
      provider: courierProvider,
      urgency: courierUrgency,
      deliveryNote: courierDeliveryNote,
      driverName: courierProvider === 'snapp_box' ? 'سفیر اسنپ‌باکس (آقای مرادی)' : courierProvider === 'alopeyk' ? 'سفیر الوپیک (آقای رضایی)' : 'پیک اختصاصی بازار بزرگ',
      driverPhone: '09123456789'
    } : undefined;

    const estimatedDeliveryDate = shippingMethod === 'peyk_instant' 
      ? 'امروز، کمتر از ۲ ساعت آینده (ارسال لحظه‌ای با پیک)'
      : shippingMethod === 'peyk_tehran'
      ? 'امروز تا ساعت ۱۹'
      : '۲ الی ۳ روز کاری آینده';

    const newOrder: StorefrontOrder = {
      id: `order-${Date.now()}`,
      orderNumber,
      trackingCode,
      customer,
      items: [...cartItems],
      subtotalToman,
      discountToman: 0,
      shippingCostToman: selectedShipping.cost,
      finalAmountToman,
      shippingMethod,
      shippingMethodTitle: selectedShipping.title,
      instantCourierInfo,
      paymentMethod,
      paymentStatus: status,
      orderStatus: 'registered',
      carrierName: shippingMethod === 'peyk_instant' 
        ? `پیک لحظه‌ای (${courierProvider === 'snapp_box' ? 'اسنپ‌باکس' : courierProvider === 'alopeyk' ? 'الوپیک' : courierProvider === 'tapsi_pack' ? 'تپسی‌پک' : 'پیک بازار'})`
        : selectedShipping.title,
      createdAt: new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      estimatedDeliveryDate
    };

    setPlacedOrder(newOrder);
    onOrderPlaced(newOrder);
    onClearCart();
    setIsGatewayOpen(false);
  };

  const handleCopyTrackingCode = () => {
    if (placedOrder) {
      navigator.clipboard.writeText(placedOrder.trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // ----------------------------------------------------
  // VIEW: SUCCESS CONFIRMATION & RECEIPT
  // ----------------------------------------------------
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn" dir="rtl" id="order-success-screen">
        <div className="bg-white rounded-3xl border border-[#DDD5C0] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b border-[#E6DEC8]">
            <div className="w-16 h-16 bg-[#ECE4D5] text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner border border-[#DDD5C0]">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              سفارش شما با موفقیت در پوشاک من و تو ثبت شد!
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
              سفارش شما به کارگاه و انبار ارسال شد. به محض تحویل بسته به باربری، شماره بیجک و کد رهگیری از طریق پیامک برای شما ارسال خواهد شد.
            </p>
          </div>

          {/* Tracking Code Highlight Box */}
          <div className="bg-[#18181B] text-[#FAF7F2] border border-[#3F3F46] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#D4AF37] font-medium block">کد رهگیری اختصاصی سفارش شما:</span>
              <div className="text-2xl font-black font-mono text-white tracking-wider mt-0.5">
                {placedOrder.trackingCode}
              </div>
              <p className="text-[11px] text-stone-300 mt-1">
                می‌توانید با وارد کردن این کد در بخش «پیگیری سفارش»، وضعیت مرسوله خود را بدون نیاز به پیام دادن چک کنید.
              </p>
            </div>

            <button
              type="button"
              id="btn-copy-tracking"
              onClick={handleCopyTrackingCode}
              className="py-2.5 px-4 bg-[#FAF7F2] text-[#18181B] hover:bg-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8C6D37]" />
                  <span>کپی کد رهگیری</span>
                </>
              )}
            </button>
          </div>

          {/* Formal Official Commercial Invoice (For Screen & High-Res A4 Print) */}
          <div className="w-full">
            <FormalInvoicePrintSheet order={placedOrder} onPrint={() => window.print()} />
          </div>

          {/* Action Buttons */}
          <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#E6DEC8]">
            <button
              type="button"
              id="btn-print-official-invoice"
              onClick={() => window.print()}
              className="w-full sm:w-auto py-3 px-5 bg-[#18181B] hover:bg-[#27272A] active:scale-[0.98] text-[#D4AF37] hover:text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 border border-[#D4AF37]/70 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>چاپ فاکتور رسمی با سربرگ تولید و پخش من و تو (پرینتر)</span>
            </button>

            <button
              type="button"
              id="btn-return-shop-after-order"
              onClick={onBackToShop}
              className="w-full sm:w-auto py-3 px-6 bg-[#FAF7F2] hover:bg-[#EDE5D3] text-stone-800 rounded-xl text-xs font-bold transition-colors border border-[#DDD5C0] shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>بازگشت به صفحه اصلی فروشگاه</span>
              <ArrowRight className="w-4 h-4 text-[#8C6D37]" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: CHECKOUT FORM (3 STEPS)
  // ----------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn" dir="rtl" id="checkout-view">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#DDD5C0]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            تکمیل سفارش و تسویه حساب
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            پوشاک من و تو • ارسال روزانه از انبار و کارگاه بازار بزرگ تهران
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToShop}
          className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors bg-[#FAF7F2] border border-[#DDD5C0] px-3 py-1.5 rounded-xl"
        >
          <span>بازگشت به سبد</span>
          <ArrowRight className="w-4 h-4 text-[#8C6D37]" />
        </button>
      </div>

      <form onSubmit={handleStartPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Customer Info & Shipping Options */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Validation Error Banner */}
          {formError && (
            <div 
              role="alert"
              className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-start gap-3 shadow-xs animate-fadeIn"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs font-bold leading-relaxed">
                <span>{formError}</span>
              </div>
            </div>
          )}

          {/* Section 1: Customer Auth & Shipping Destination */}
          <div id="checkout-customer-section" className="bg-white rounded-3xl border border-[#DDD5C0] p-5 sm:p-6 shadow-xs space-y-5">
            {!isAuthCompleted ? (
              /* Step 1: User Registration / Login Gate (Phone first + Password) */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#E6DEC8]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                      ۱
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                        {authMode === 'register' ? 'گام اول: ثبت‌نام خریدار (شماره موبایل و تعیین رمز)' : 'گام اول: ورود به حساب کاربری'}
                      </h3>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        اولین و مهم‌ترین شناسه جهت ثبت سفارش، ارسال پیامک بیجک باربری و ورود به حساب
                      </p>
                    </div>
                  </div>

                  {/* Mode switch tabs */}
                  <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#DDD5C0] text-xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('register'); setAuthError(null); }}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        authMode === 'register' 
                          ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' 
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      ثبت‌نام خریدار جدید
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setAuthError(null); }}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        authMode === 'login' 
                          ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' 
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      قبلاً ثبت‌نام کرده‌ام
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="bg-[#FAF7F2] border border-[#E6DEC8] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone field: Primary and most important */}
                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1.5">
                        شماره تلفن همراه (اصلی و در دسترس) <span className="text-[#8C6D37]">*</span>:
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={authPhone}
                          onChange={(e) => {
                            setAuthPhone(e.target.value);
                            setAuthError(null);
                          }}
                          placeholder="مثال: 09121234567"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 font-mono bg-white dir-ltr text-right"
                        />
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                      <span className="text-[10px] text-stone-500 block mt-1">
                        شناسهٔ اصلی حساب شما، صدور فاکتور و ارسال پیامک بیجک باربری
                      </span>
                    </div>

                    {/* Password field */}
                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1.5">
                        {authMode === 'register' ? 'تعیین رمز عبور حساب کاربری *:' : 'رمز عبور حساب کاربری *:'}
                      </label>
                      <div className="relative">
                        <input
                          type={showAuthPassword ? 'text' : 'password'}
                          value={authPassword}
                          onChange={(e) => {
                            setAuthPassword(e.target.value);
                            setAuthError(null);
                          }}
                          placeholder="حداقل ۴ کاراکتر (عدد یا حروف)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 font-mono bg-white dir-ltr text-right pl-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAuthPassword(!showAuthPassword)}
                          className="absolute left-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                        >
                          {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-stone-500 block mt-1">
                        جهت مراجعات بعدی و پیگیری آنلاین وضعیت بار
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickAuthSubmit}
                    className="w-full py-3 px-4 bg-[#18181B] hover:bg-[#27272A] active:scale-[0.99] text-[#FAF7F2] rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {authMode === 'register'
                        ? 'تأیید شماره و ثبت‌نام • رفتن به مرحله تکمیل آدرس ارسال'
                        : 'ورود به حساب کاربری و رفتن به مرحله تکمیل آدرس'}
                    </span>
                    <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>

                <div className="bg-[#FAF7F2]/70 border border-dashed border-[#DDD5C0] rounded-2xl p-4 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-stone-400" />
                  <span>پس از ثبت‌نام اولیه، کادر آدرس دقیق و مشخصات تحویل‌گیرنده برای ارسال فعال می‌شود.</span>
                </div>
              </div>
            ) : (
              /* Step 2: Shipping Destination Information Form */
              <div className="space-y-4">
                {/* Active Account Status Chip */}
                <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between text-xs text-emerald-950 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-stone-900 block truncate">
                        حساب کاربری فعال شد (تأیید شده)
                      </span>
                      <span className="text-[11px] text-stone-600">
                        شماره همراه: <strong className="font-mono text-emerald-800 dir-ltr font-bold">{customer.phone}</strong>
                        {customer.fullName && <span className="mr-1.5">• خریدار: {customer.fullName}</span>}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSwitchAuth}
                    className="text-[11px] text-stone-600 hover:text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors shadow-2xs shrink-0 cursor-pointer"
                  >
                    تغییر شماره / خروج
                  </button>
                </div>

                {authSuccessBanner && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-2.5 text-[11px] flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{authSuccessBanner}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pb-3 border-b border-[#E6DEC8]">
                  <div className="w-8 h-8 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                    ۲
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                      مشخصات خریدار و آدرس تحویل‌گیرنده جهت ارسال بار
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      اطلاعات مقصد را با دقت وارد فرمایید تا بسته‌بندی و تحویل به باربری بدون خطا انجام شود.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      نام و نام خانوادگی <span className="text-[#8C6D37]">*</span>:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customer.fullName}
                        onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                        placeholder="مثال: مریم سلیمانی"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 bg-[#FAF7F2]"
                      />
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      شماره موبایل ثبت‌شده <span className="text-[#8C6D37]">*</span>:
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        readOnly
                        value={customer.phone}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] bg-stone-100 text-xs text-stone-600 font-mono cursor-not-allowed"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Landline Phone */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      شماره تلفن ثابت (مغازه / کارگاه / منزل):
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customer.landlinePhone || ''}
                        onChange={(e) => setCustomer({ ...customer, landlinePhone: e.target.value })}
                        placeholder="مثال: 02155667788 یا 03132224455"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 font-mono bg-[#FAF7F2]"
                      />
                      <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Alternative Reachable Contact Number */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      شماره تماس دوم / در دسترس دیگر:
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customer.alternativePhone || ''}
                        onChange={(e) => setCustomer({ ...customer, alternativePhone: e.target.value })}
                        placeholder="مثال: 09351234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 font-mono bg-[#FAF7F2]"
                      />
                      <PhoneCall className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Safety & Reachability Assurance Box */}
                  <div className="sm:col-span-2 bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold block text-stone-900">
                        تضمین پیگیری بدون معطلی باربری و بسته‌بندی:
                      </span>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        ثبت شمارهٔ ثابت یا شمارهٔ دوم در دسترس به همکاران انبار و متصدی باربری کمک می‌کند تا حتی در صورت خاموشی، خطای تایپی یا اختلال آنتن‌دهی در شمارهٔ اصلی، ارسال بار و تحویل بیجک بدون لحظه‌ای وقفه انجام پذیرد.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      استان <span className="text-[#8C6D37]">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.province}
                      onChange={(e) => setCustomer({ ...customer, province: e.target.value })}
                      placeholder="مثال: اصفهان"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      شهر مقصد <span className="text-[#8C6D37]">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="مثال: کاشان"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 bg-[#FAF7F2]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      آدرس دقیق پستی <span className="text-[#8C6D37]">*</span>:
                    </label>
                    <div className="relative">
                      <textarea
                        rows={2}
                        required
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="خیابان اصلی، کوچه، پلاک، طبقه و واحد"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 resize-none bg-[#FAF7F2]"
                      />
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      کد پستی (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                      placeholder="کد پستی ۱۰ رقمی"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 font-mono bg-[#FAF7F2]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Shipping Method Selection */}
          <div className="bg-white rounded-3xl border border-[#DDD5C0] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E6DEC8]">
              <div className="w-8 h-8 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                ۲
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  انتخاب روش ارسال بار و باربری
                </h3>
                <p className="text-[11px] text-stone-500">
                  کلیه بارها از انبار بازار بزرگ تهران بسته‌بندی و تحویل متصدی می‌گردد.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {(Object.keys(shippingCosts) as StorefrontShippingMethod[]).map((methodKey) => {
                const opt = shippingCosts[methodKey];
                const isSelected = shippingMethod === methodKey;
                const isInstant = methodKey === 'peyk_instant';
                const isTehranOnly = methodKey === 'peyk_instant' || methodKey === 'peyk_tehran';
                const isDisabled = isTehranOnly && !isTehranDestination;

                return (
                  <div key={methodKey} className="space-y-2">
                    <label
                      className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                        isDisabled
                          ? 'opacity-50 cursor-not-allowed bg-stone-50 border-stone-200'
                          : isSelected
                            ? isInstant 
                              ? 'border-[#18181B] bg-[#FAF7F2] shadow-sm ring-2 ring-[#D4AF37]/30 cursor-pointer'
                              : 'border-[#18181B] bg-[#FAF7F2] shadow-xs cursor-pointer'
                            : 'border-[#DDD5C0] bg-white hover:border-[#18181B]/40 cursor-pointer'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping_method"
                        value={methodKey}
                        disabled={isDisabled}
                        checked={isSelected}
                        onChange={() => !isDisabled && setShippingMethod(methodKey)}
                        className="mt-1 text-[#18181B] focus:ring-[#18181B] disabled:opacity-40"
                      />

                      <div className="flex-1 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-bold text-xs sm:text-sm ${isInstant ? 'text-stone-900 font-black' : 'text-stone-900'} ${isDisabled ? 'text-stone-400' : ''}`}>
                              {opt.title}
                            </span>
                            {opt.badge && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                isDisabled
                                  ? 'bg-stone-200 text-stone-600'
                                  : isInstant ? 'bg-[#18181B] text-[#D4AF37]' : 'bg-[#18181B] text-[#D4AF37]'
                              }`}>
                                {isInstant && !isDisabled && <Zap className="w-3 h-3 text-[#D4AF37]" />}
                                {opt.badge}
                              </span>
                            )}
                            {isDisabled && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                                ویژه شهر تهران (مقصد انتخابی شما: {customer.city || customer.province || 'غیر تهران'})
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {isDisabled ? 'این شیوه فقط برای آدرس‌های واقع در شهر تهران و حومه قابل انتخاب است.' : opt.desc}
                          </p>
                        </div>

                        <span className={`text-xs font-bold whitespace-nowrap ${isDisabled ? 'text-stone-400' : 'text-stone-800'}`}>
                          {opt.cost.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </label>

                    {/* Instant Courier Sub-Settings & Preferences Panel */}
                    {isInstant && isSelected && !isDisabled && (
                      <div className="bg-[#FAF7F2] border border-[#DDD5C0] rounded-2xl p-4 space-y-3.5 mr-6 text-xs animate-fadeIn shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2">
                          <div className="flex items-center gap-1.5 font-bold text-stone-900">
                            <Bike className="w-4 h-4 text-[#8C6D37]" />
                            <span>تنظیمات ناوگان و زمان ارسال پیک موتوری لحظه‌ای</span>
                          </div>
                          <span className="text-[10px] bg-[#18181B] text-[#D4AF37] px-2 py-0.5 rounded-md font-bold">
                            تضمین سرعت
                          </span>
                        </div>

                        {/* Courier Provider Choices */}
                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1.5">
                            انتخاب ناوگان پیک موتوری:
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { id: 'snapp_box', name: 'اسنپ‌باکس', desc: 'سفیر لحظه‌ای' },
                              { id: 'alopeyk', name: 'الوپیک', desc: 'رهگیری زنده' },
                              { id: 'tapsi_pack', name: 'تپسی‌پک', desc: 'تحویل اکسپرس' },
                              { id: 'dedicated_bazaar', name: 'پیک اختصاصی بازار', desc: 'متصدی کارگاه' }
                            ].map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => setCourierProvider(p.id as any)}
                                className={`p-2 rounded-xl border text-right transition-all flex flex-col justify-between ${
                                  courierProvider === p.id 
                                    ? 'bg-[#18181B] text-white border-[#18181B] shadow-xs' 
                                    : 'bg-white text-stone-800 border-[#DDD5C0] hover:border-stone-400'
                                }`}
                              >
                                <span className="font-bold text-xs">{p.name}</span>
                                <span className={`text-[10px] ${courierProvider === p.id ? 'text-[#D4AF37]' : 'text-stone-500'}`}>{p.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Urgency Choices */}
                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1.5">
                            زمان‌بندی تحویل فوری:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {[
                              { id: 'immediate_2h', title: 'تحویل آنی (زیر ۲ ساعت)', sub: 'اعزام سریع‌ترین سفیر' },
                              { id: 'today_evening', title: 'عصر امروز (۱۷ الی ۲۰)', sub: 'بازه عصرگاهی' },
                              { id: 'custom_time', title: 'هماهنگی تلفنی قبل از اعزام', sub: 'تماس با گیرنده' }
                            ].map((u) => (
                              <label
                                key={u.id}
                                className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between gap-2 transition-all ${
                                  courierUrgency === u.id 
                                    ? 'bg-white border-[#18181B] ring-1 ring-[#18181B]' 
                                    : 'bg-white/60 border-[#DDD5C0] hover:bg-white'
                                }`}
                              >
                                <div>
                                  <span className="font-bold text-xs text-stone-900 block">{u.title}</span>
                                  <span className="text-[10px] text-stone-500">{u.sub}</span>
                                </div>
                                <input
                                  type="radio"
                                  name="courier_urgency"
                                  value={u.id}
                                  checked={courierUrgency === u.id}
                                  onChange={() => setCourierUrgency(u.id as any)}
                                  className="text-[#18181B] focus:ring-[#18181B]"
                                />
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Driver Note */}
                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1">
                            توضیحات و هماهنگی ویژه برای سفیر پیک موتوری (اختیاری):
                          </label>
                          <input
                            type="text"
                            value={courierDeliveryNote}
                            onChange={(e) => setCourierDeliveryNote(e.target.value)}
                            placeholder="مثال: زنگ واحد ۴، تحویل به نگهبانی لابی یا تماس قبل از رسیدن"
                            className="w-full px-3 py-2 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 text-xs text-stone-800 bg-white"
                          />
                        </div>

                        {/* Location check notice */}
                        <div className="bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl p-2.5 flex items-center gap-2 text-[11px]">
                          <Navigation className="w-4 h-4 text-[#8C6D37] flex-shrink-0" />
                          <span className="text-stone-700">
                            {customer.city.includes('تهران') || customer.province.includes('تهران') ? (
                              <span className="text-emerald-700 font-bold">
                                ✅ شهر مقصد شما ({customer.city || 'تهران'}) در محدوده ارسال لحظه‌ای و زیر ۲ ساعت با پیک موتوری قرار دارد.
                              </span>
                            ) : (
                              <span className="text-stone-600">
                                💡 ارسال لحظه‌ای با پیک ویژه مناطق ۲۲گانه تهران و حومه است. در صورت ثبت برای شهرستان‌ها، هماهنگی تحویل به باربری انجام خواهد شد.
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white rounded-3xl border border-[#DDD5C0] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E6DEC8]">
              <div className="w-8 h-8 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                ۳
              </div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                نحوه تسویه و پرداخت
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  paymentMethod === 'online_gateway'
                    ? 'border-[#18181B] bg-[#FAF7F2] shadow-xs'
                    : 'border-[#DDD5C0] bg-white hover:border-[#18181B]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs">درگاه آنلاین شتاب</span>
                  <input
                    type="radio"
                    name="payment_method"
                    value="online_gateway"
                    checked={paymentMethod === 'online_gateway'}
                    onChange={() => setPaymentMethod('online_gateway')}
                    className="text-[#18181B] focus:ring-[#18181B]"
                  />
                </div>
                <p className="text-[10px] text-stone-500">
                  پرداخت آنی با کلیه کارت‌های عضو شبکه شاپرک با تاییدیه لحظه‌ای
                </p>
              </label>

              <label
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  paymentMethod === 'card_to_card'
                    ? 'border-[#18181B] bg-[#FAF7F2] shadow-xs'
                    : 'border-[#DDD5C0] bg-white hover:border-[#18181B]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs">کارت به کارت</span>
                  <input
                    type="radio"
                    name="payment_method"
                    value="card_to_card"
                    checked={paymentMethod === 'card_to_card'}
                    onChange={() => setPaymentMethod('card_to_card')}
                    className="text-[#18181B] focus:ring-[#18181B]"
                  />
                </div>
                <p className="text-[10px] text-stone-500">
                  واریز به حساب بانک ملت موسسه من و تو و ارسال فیش
                </p>
              </label>

              <label
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  paymentMethod === 'wholesale_check'
                    ? 'border-[#18181B] bg-[#FAF7F2] shadow-xs'
                    : 'border-[#DDD5C0] bg-white hover:border-[#18181B]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs">چک صیادی (همکاران)</span>
                  <input
                    type="radio"
                    name="payment_method"
                    value="wholesale_check"
                    checked={paymentMethod === 'wholesale_check'}
                    onChange={() => setPaymentMethod('wholesale_check')}
                    className="text-[#18181B] focus:ring-[#18181B]"
                  />
                </div>
                <p className="text-[10px] text-stone-500">
                  ویژه مشتریان دارای اعتبار تایید شده بنکداری (حداکثر ۴۵ روزه)
                </p>
              </label>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Order Summary & Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#DDD5C0] p-5 sm:p-6 shadow-lg sticky top-6 space-y-4">
            <h3 className="font-black text-stone-900 text-base pb-3 border-b border-[#E6DEC8] flex items-center justify-between">
              <span>خلاصه سفارش شما</span>
              <span className="text-xs text-[#8C6D37] font-bold">
                {cartItems.length} قلم کالا
              </span>
            </h3>

            {/* Mini list of items */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 divide-y divide-[#E6DEC8] pl-1">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-12 object-cover rounded-lg bg-stone-100 flex-shrink-0"
                    />
                    <div className="truncate">
                      <span className="font-bold text-stone-800 block truncate">
                        {item.product.name}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {item.mode === 'wholesale_pack' ? `پک ${item.product.packSize} تایی × ${item.quantity}` : `تک‌فروشی × ${item.quantity}`}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 whitespace-nowrap">
                    {item.totalPriceToman.toLocaleString('fa-IR')} ت
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[#E6DEC8] space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>جمع کل اقلام:</span>
                <span className="font-bold text-stone-800">{subtotalToman.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>هزینه ارسال ({selectedShipping.title}):</span>
                <span className="font-bold text-stone-800">{selectedShipping.cost.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between text-stone-900 font-black text-sm pt-3 border-t border-[#E6DEC8]">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="text-[#18181B] text-lg font-black">
                  {finalAmountToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>

            {/* Submit Button */}
            {!isAuthCompleted ? (
              <button
                type="button"
                id="btn-submit-order-checkout"
                onClick={() => {
                  const elem = document.getElementById('checkout-customer-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  setAuthError('لطفاً ابتدا شماره موبایل خود را وارد کرده و رمز عبور را تعیین فرمایید.');
                }}
                className="w-full py-4 px-6 bg-stone-900 hover:bg-black active:scale-[0.99] text-white rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/50"
              >
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                <span>گام اول: ابتدا شماره موبایل و رمز عبور را وارد فرمایید</span>
              </button>
            ) : (
              <button
                type="submit"
                id="btn-submit-order-checkout"
                className="w-full py-4 px-6 bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2] rounded-2xl font-black text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                <span>پرداخت و ثبت نهایی فاکتور</span>
              </button>
            )}

            <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#DDD5C0] text-[11px] text-stone-600 space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-800 font-bold">
                <Building2 className="w-3.5 h-3.5 text-[#8C6D37]" />
                <span>موسسه تولید پخش من و تو</span>
              </div>
              <p>بازار بزرگ تهران، سرای حاج حسن • تلفن دفتر: ۰۲۱-۵۵۱۱۰۰۰۰</p>
            </div>
          </div>
        </div>

      </form>

      {/* Simulated Online Gateway Modal (Shaparak) */}
      {isGatewayOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span className="font-bold text-sm">درگاه پرداخت الکترونیک شاپرک</span>
              </div>
              <span className="text-xs opacity-80 font-mono">SHAPARAK-SANDBOX</span>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>پذیرنده:</span>
                  <span className="font-bold text-stone-800">پوشاک من و تو (موسسه تولید پخش من و تو)</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>مبلغ تراکنش:</span>
                  <span className="font-black text-emerald-700 text-sm">{finalAmountToman.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-stone-500 block mb-1">شماره کارت ۱۶ رقمی شتاب:</label>
                  <input
                    type="text"
                    readOnly
                    value="۶۰۳۷-۹۹۷۵-۴۴۱۱-۸۸۲۲ (تست پرداخت)"
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 border border-stone-300 text-xs font-mono text-stone-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">رمز اینترنتی (CVV2):</label>
                    <input
                      type="password"
                      readOnly
                      value="***"
                      className="w-full px-3 py-2 rounded-xl bg-stone-100 border border-stone-300 text-xs font-mono text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">رمز پویا:</label>
                    <input
                      type="text"
                      readOnly
                      value="۸۴۹۲۱۵"
                      className="w-full px-3 py-2 rounded-xl bg-stone-100 border border-stone-300 text-xs font-mono text-emerald-700 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsGatewayOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-stone-300 text-stone-600 text-xs font-bold hover:bg-stone-100"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  id="btn-confirm-simulated-payment"
                  disabled={isProcessingPayment}
                  onClick={() => {
                    setIsProcessingPayment(true);
                    setTimeout(() => {
                      setIsProcessingPayment(false);
                      finalizeOrder('paid');
                    }, 800);
                  }}
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 flex items-center justify-center gap-1"
                >
                  {isProcessingPayment ? 'در حال تایید تراکنش...' : 'تایید و پرداخت موفق'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
