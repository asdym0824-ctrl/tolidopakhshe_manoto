import React, { useState } from 'react';
import { CartItem, StorefrontCustomerInfo, StorefrontShippingMethod, StorefrontOrder, CustomerUser } from '../../types';
import { 
  ArrowRight, 
  CheckCircle, 
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
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface CheckoutViewProps {
  cartItems: CartItem[];
  onBackToShop: () => void;
  onOrderPlaced: (order: StorefrontOrder) => void;
  onClearCart: () => void;
  isPartnerLoggedIn?: boolean;
  loggedInCustomer?: CustomerUser | null;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  onBackToShop,
  onOrderPlaced,
  onClearCart,
  isPartnerLoggedIn = false,
  loggedInCustomer = null,
}) => {
  // Customer Form State
  const [customer, setCustomer] = useState<StorefrontCustomerInfo>({
    fullName: loggedInCustomer?.fullName || (isPartnerLoggedIn ? 'حاج داوود محمدی (همکار اصفهان)' : ''),
    phone: loggedInCustomer?.phone || (isPartnerLoggedIn ? '09131114589' : ''),
    province: loggedInCustomer?.province || (isPartnerLoggedIn ? 'اصفهان' : 'تهران'),
    city: loggedInCustomer?.city || (isPartnerLoggedIn ? 'اصفهان' : 'تهران'),
    address: loggedInCustomer?.address || (isPartnerLoggedIn ? 'خیابان عبدالرزاق، پاساژ کلاهدوزان، پلاک ۱۸' : ''),
    postalCode: loggedInCustomer?.postalCode || '',
    notes: '',
    isPartnerWholesale: isPartnerLoggedIn || loggedInCustomer?.isPartnerWholesale,
    storeName: loggedInCustomer?.storeName || (isPartnerLoggedIn ? 'پخش عمده پوشاک محمدی' : ''),
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<StorefrontShippingMethod>('barbari_vatan');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'online_gateway' | 'card_to_card' | 'wholesale_check'>('online_gateway');

  // Simulated Gateway State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<StorefrontOrder | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Totals
  const subtotalToman = cartItems.reduce((acc, item) => acc + item.totalPriceToman, 0);
  
  const shippingCosts: Record<StorefrontShippingMethod, { title: string; cost: number; desc: string }> = {
    barbari_vatan: {
      title: 'باربری وطن (میدان شوش)',
      cost: 85000,
      desc: 'مناسب‌ترین گزینه برای کیسه و کارتن‌های عمده • تحویل به انبار باربری شهر مقصد',
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
      title: 'پیک موتوری فوری بازار',
      cost: 75000,
      desc: 'ویژه شهر تهران و بازار بزرگ • تحویل در همان روز کاری',
    },
    post_pishtaz: {
      title: 'پست پیشتاز',
      cost: 45000,
      desc: 'تحویل به کلیه نقاط روستایی و شهری سراسر ایران',
    }
  };

  const selectedShipping = shippingCosts[shippingMethod];
  const finalAmountToman = subtotalToman + selectedShipping.cost;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.address) {
      alert('لطفاً فیلدهای ضروری نام، شماره تماس و آدرس را تکمیل فرمایید.');
      return;
    }

    if (paymentMethod === 'online_gateway') {
      setIsGatewayOpen(true);
    } else {
      finalizeOrder(paymentMethod === 'card_to_card' ? 'pending_verification' : 'pending_check');
    }
  };

  const finalizeOrder = (status: 'paid' | 'pending_verification' | 'pending_check') => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `MNT-${randomSuffix}`;
    const orderNumber = `MNT-1403-${randomSuffix}`;

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
      paymentMethod,
      paymentStatus: status,
      orderStatus: 'processing',
      carrierName: selectedShipping.title,
      createdAt: new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      estimatedDeliveryDate: '۲ الی ۳ روز کاری آینده'
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

          {/* Printable Formal Invoice Summary */}
          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#DDD5C0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-3">
              <div>
                <span className="font-bold text-stone-900 text-sm">رسید فاکتور فروشگاه «پوشاک من و تو»</span>
                <p className="text-[11px] text-stone-500">موسسه تولید پخش من و تو (بازار بزرگ تهران)</p>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                تاریخ: {placedOrder.createdAt}
              </span>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
              <div><strong>تحویل‌گیرنده:</strong> {placedOrder.customer.fullName}</div>
              <div><strong>شماره تماس:</strong> {placedOrder.customer.phone}</div>
              <div><strong>روش ارسال:</strong> {placedOrder.shippingMethodTitle}</div>
              <div><strong>شهر مقصد:</strong> {placedOrder.customer.city} ({placedOrder.customer.province})</div>
              <div className="sm:col-span-2"><strong>آدرس:</strong> {placedOrder.customer.address}</div>
            </div>

            {/* Items Table */}
            <div className="pt-2 border-t border-[#E6DEC8]">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="text-stone-500 border-b border-[#DDD5C0] pb-1">
                    <th className="font-normal py-1">شرح کالا</th>
                    <th className="font-normal py-1 text-center">نوع</th>
                    <th className="font-normal py-1 text-center">تعداد</th>
                    <th className="font-normal py-1 text-left">مبلغ کل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DEC8]">
                  {placedOrder.items.map((it, idx) => (
                    <tr key={idx} className="text-stone-800">
                      <td className="py-2 font-medium">{it.product.name}</td>
                      <td className="py-2 text-center text-[10px] text-stone-500">
                        {it.mode === 'wholesale_pack' ? `پک ${it.product.packSize} تایی` : 'تک‌فروشی'}
                      </td>
                      <td className="py-2 text-center font-bold">{it.quantity}</td>
                      <td className="py-2 text-left font-bold">{it.totalPriceToman.toLocaleString('fa-IR')} ت</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Final Financial Totals */}
            <div className="pt-3 border-t border-[#E6DEC8] flex flex-col items-end text-xs space-y-1">
              <div className="flex justify-between w-48 text-stone-600">
                <span>جمع اقلام:</span>
                <span>{placedOrder.subtotalToman.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between w-48 text-stone-600">
                <span>هزینه ارسال:</span>
                <span>{placedOrder.shippingCostToman.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between w-48 text-stone-900 font-black text-sm pt-1 border-t border-[#E6DEC8]">
                <span>مبلغ پرداختی:</span>
                <span className="text-[#18181B]">{placedOrder.finalAmountToman.toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#EDE5D3] text-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-[#DDD5C0]"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ فاکتور رسمی</span>
            </button>

            <button
              type="button"
              id="btn-return-shop-after-order"
              onClick={onBackToShop}
              className="w-full sm:w-auto py-3 px-6 bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] rounded-xl text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>بازگشت به صفحه اصلی فروشگاه</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
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
          
          {/* Section 1: Customer Info */}
          <div className="bg-white rounded-3xl border border-[#DDD5C0] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E6DEC8]">
              <div className="w-8 h-8 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                ۱
              </div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                مشخصات خریدار و آدرس تحویل گیرنده
              </h3>
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
                  شماره موبایل (جهت ارسال پیامک بیجک) <span className="text-[#8C6D37]">*</span>:
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="مثال: 09121234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 font-mono bg-[#FAF7F2]"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
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
                    placeholder="خیابان اصلی، کوچه، پلاک، نام فروشگاه یا طبقه واحد"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 resize-none bg-[#FAF7F2]"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  نام فروشگاه یا بوتیک (ویژه همکاران عمده):
                </label>
                <input
                  type="text"
                  value={customer.storeName}
                  onChange={(e) => setCustomer({ ...customer, storeName: e.target.value })}
                  placeholder="مثال: بوتیک شیک‌پوشان"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  کد پستی (اختیاری):
                </label>
                <input
                  type="text"
                  value={customer.postalCode}
                  onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                  placeholder="۱۰ رقمی"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs text-stone-800 font-mono bg-[#FAF7F2]"
                />
              </div>
            </div>
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

                return (
                  <label
                    key={methodKey}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-[#18181B] bg-[#FAF7F2] shadow-xs'
                        : 'border-[#DDD5C0] bg-white hover:border-[#18181B]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping_method"
                      value={methodKey}
                      checked={isSelected}
                      onChange={() => setShippingMethod(methodKey)}
                      className="mt-1 text-[#18181B] focus:ring-[#18181B]"
                    />

                    <div className="flex-1 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-xs sm:text-sm">
                            {opt.title}
                          </span>
                          {methodKey === 'barbari_vatan' && (
                            <span className="text-[10px] bg-[#18181B] text-[#D4AF37] font-bold px-2 py-0.5 rounded-md">
                              پیشنهاد عمده بازار
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {opt.desc}
                        </p>
                      </div>

                      <span className="text-xs font-bold text-stone-800 whitespace-nowrap">
                        {opt.cost.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </label>
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
            <button
              type="submit"
              id="btn-submit-order-checkout"
              className="w-full py-4 px-6 bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2] rounded-2xl font-black text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5 text-[#D4AF37]" />
              <span>پرداخت و ثبت نهایی فاکتور</span>
            </button>

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
