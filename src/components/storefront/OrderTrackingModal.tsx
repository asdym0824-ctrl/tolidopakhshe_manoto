import React, { useState } from 'react';
import { StorefrontOrder } from '../../types';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Zap,
  Bike
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: StorefrontOrder[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<StorefrontOrder | null>(null);
  const [copiedWaybill, setCopiedWaybill] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanQuery = query.trim().toUpperCase();

    const found = orders.find(o => 
      o.trackingCode.toUpperCase() === cleanQuery ||
      o.orderNumber.toUpperCase() === cleanQuery ||
      o.customer.phone === cleanQuery ||
      (o.waybillNumber && o.waybillNumber.toUpperCase() === cleanQuery)
    );

    setMatchedOrder(found || null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWaybill(true);
    setTimeout(() => setCopiedWaybill(false), 2000);
  };

  const getStepStatus = (orderStatus: string, stepIndex: number) => {
    const stepsOrder = ['registered', 'processing', 'packed', 'sent_to_carrier', 'delivered'];
    const currentIndex = stepsOrder.indexOf(orderStatus);
    if (currentIndex >= stepIndex) return 'completed';
    if (currentIndex === stepIndex - 1) return 'current';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn" dir="rtl">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E6DEC8] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-stone-900 text-sm sm:text-base">
                سامانه هوشمند رهگیری بیجک و وضعیت مرسوله
              </h3>
              <p className="text-[11px] text-stone-500">
                پوشاک من و تو • بدون نیاز به تماس یا پیام به ادمین کانال
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-tracking-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-[#E6DEC8]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">
              کد پیگیری سفارش یا شماره موبایل ثبت شده:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="مثال: MNT-8821 یا 09123456789"
                  className="w-full pl-4 pr-10 py-3 rounded-2xl border border-[#DDD5C0] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs sm:text-sm text-stone-900 font-mono bg-[#FAF7F2]"
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>

              <button
                type="submit"
                id="btn-search-tracking"
                className="py-3 px-5 bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 flex-shrink-0"
              >
                <span>استعلام</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
              <span>کدهای تستی موجود:</span>
              <button
                type="button"
                onClick={() => { setQuery('MNT-8821'); }}
                className="font-mono text-[#8C6D37] hover:underline bg-[#FAF7F2] border border-[#E6DEC8] px-1.5 py-0.5 rounded"
              >
                MNT-8821 (باربری وطن)
              </button>
              <button
                type="button"
                onClick={() => { setQuery('MNT-9042'); }}
                className="font-mono text-[#8C6D37] hover:underline bg-[#FAF7F2] border border-[#E6DEC8] px-1.5 py-0.5 rounded"
              >
                MNT-9042 (تیپاکس)
              </button>
            </div>
          </form>

          {/* Search Result */}
          {searched && matchedOrder ? (
            <div className="bg-[#FAF7F2] rounded-3xl border border-[#E6DEC8] p-5 space-y-5 animate-fadeIn">
              
              {/* Order Quick Overview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6DEC8]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">شماره سفارش:</span>
                    <span className="font-black font-mono text-stone-900">{matchedOrder.orderNumber}</span>
                  </div>
                  <div className="text-xs text-stone-700 mt-0.5">
                    <strong>تحویل‌گیرنده:</strong> {matchedOrder.customer.fullName} ({matchedOrder.customer.city})
                  </div>
                </div>

                <div className="text-left">
                  <span className="inline-flex items-center gap-1.5 bg-[#ECE4D5] text-stone-900 font-bold text-xs px-3 py-1 rounded-xl border border-[#DDD5C0]">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {matchedOrder.orderStatus === 'sent_to_carrier' ? 'تحویل به باربری / در حال حمل' :
                       matchedOrder.orderStatus === 'packed' ? 'بسته‌بندی شده در انبار' :
                       matchedOrder.orderStatus === 'delivered' ? 'تحویل داده شده' : 'در حال پردازش'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Instant Courier Highlight Box */}
              {matchedOrder.shippingMethod === 'peyk_instant' ? (
                <div className="bg-[#18181B] text-[#FAF7F2] rounded-2xl p-4 shadow-md space-y-3 border border-[#D4AF37]/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#D4AF37] text-stone-950 flex items-center justify-center font-bold">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white">ارسال لحظه‌ای با پیک موتوری (تحویل فوری زیر ۲ ساعت)</span>
                        <p className="text-[10px] text-[#D4AF37]">
                          ناوگان: {matchedOrder.instantCourierInfo?.provider === 'snapp_box' ? 'اسنپ‌باکس (Snapp! Box)' : matchedOrder.instantCourierInfo?.provider === 'alopeyk' ? 'الوپیک (Alopeyk)' : matchedOrder.instantCourierInfo?.provider === 'tapsi_pack' ? 'تپسی‌پک' : 'پیک موتوری اختصاصی بازار'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-1 rounded-full font-bold animate-pulse">
                      اعزام سریع سفیر
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                    <div className="flex items-center gap-1.5 text-stone-300">
                      <Bike className="w-4 h-4 text-[#D4AF37]" />
                      <span>سفیر مسئول: <strong>{matchedOrder.instantCourierInfo?.driverName || 'سفیر اسنپ‌باکس'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-300 sm:justify-end">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span>تخمین تحویل: <strong>{matchedOrder.estimatedDeliveryDate || 'کمتر از ۲ ساعت آینده'}</strong></span>
                    </div>
                  </div>

                  {matchedOrder.instantCourierInfo?.deliveryNote && (
                    <div className="text-[11px] text-stone-300">
                      <strong>یادداشت آدرس/زنگ:</strong> {matchedOrder.instantCourierInfo.deliveryNote}
                    </div>
                  )}
                </div>
              ) : matchedOrder.waybillNumber ? (
                <div className="bg-[#18181B] text-[#FAF7F2] rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#3F3F46]">
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#D4AF37] block font-bold">
                      شماره بارنامه / بیجک {matchedOrder.carrierName || 'باربری'}:
                    </span>
                    <div className="text-xl font-black font-mono tracking-widest text-white">
                      {matchedOrder.waybillNumber}
                    </div>
                    <p className="text-[10px] text-stone-300">
                      جهت دریافت بار در انبار مقصد، این شماره بیجک را همراه با کارت شناسایی ارائه فرمایید.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(matchedOrder.waybillNumber || '')}
                    className="py-2 px-3.5 bg-[#FAF7F2] text-[#18181B] hover:bg-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0"
                  >
                    {copiedWaybill ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#8C6D37]" />
                        <span>کپی بیجک</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl p-3 text-xs text-stone-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8C6D37] flex-shrink-0" />
                  <span>بسته شما در حال سلفون‌پیچی و بسته‌بندی در کارگاه بازار است. شماره بیجک تا عصر صادر می‌گردد.</span>
                </div>
              )}

              {/* Shipment Progress Visual Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-stone-900 text-xs">مراحل آماده‌سازی و ارسال مرسوله:</h4>

                <div className="relative border-r-2 border-[#DDD5C0] pr-5 mr-3 space-y-4 text-xs">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -right-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#18181B] border-2 border-white" />
                    <p className="font-bold text-stone-900">ثبت فاکتور و تایید پرداخت در سامانه</p>
                    <p className="text-[11px] text-stone-500">تاریخ ثبت: {matchedOrder.createdAt}</p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -right-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#18181B] border-2 border-white" />
                    <p className="font-bold text-stone-900">بسته‌بندی و تفکیک پک‌ها در انبار بازار تهران</p>
                    <p className="text-[11px] text-stone-500">کنترل کیفیت دوخت و قواره استاندارد</p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className={`absolute -right-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      matchedOrder.orderStatus === 'sent_to_carrier' || matchedOrder.orderStatus === 'delivered'
                        ? 'bg-[#18181B]'
                        : 'bg-stone-300'
                    }`} />
                    <p className={`font-bold ${matchedOrder.orderStatus === 'sent_to_carrier' ? 'text-[#8C6D37]' : 'text-stone-800'}`}>
                      تحویل به متصدی {matchedOrder.shippingMethodTitle} و صدور بیجک
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {matchedOrder.waybillNumber ? `شماره بیجک: ${matchedOrder.waybillNumber}` : 'در انتظار تحویل نوبت عصر'}
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className={`absolute -right-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      matchedOrder.orderStatus === 'delivered' ? 'bg-[#18181B]' : 'bg-stone-300'
                    }`} />
                    <p className="font-bold text-stone-700">تحویل نهایی به خریدار در شهر {matchedOrder.customer.city}</p>
                    <p className="text-[11px] text-stone-400">تحویل طبق موعد باربری</p>
                  </div>

                </div>
              </div>

              {/* Order Items Preview */}
              <div className="pt-3 border-t border-[#E6DEC8] space-y-2">
                <span className="text-xs font-bold text-stone-700 block">اقلام این مرسوله:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchedOrder.items.map((it, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-[#E6DEC8] flex items-center gap-2 text-xs">
                      <img src={it.product.image} alt={it.product.name} className="w-10 h-12 object-cover rounded-lg bg-stone-100" />
                      <div className="truncate">
                        <span className="font-bold text-stone-800 block truncate">{it.product.name}</span>
                        <span className="text-[10px] text-stone-500">
                          {it.mode === 'wholesale_pack' ? `پک ${it.product.packSize} تایی × ${it.quantity}` : `تک‌فروشی × ${it.quantity}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : searched && !matchedOrder ? (
            <div className="bg-[#FAF7F2] border border-[#DDD5C0] rounded-3xl p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-[#8C6D37] mx-auto" />
              <h4 className="font-bold text-stone-900 text-sm">سفارشی با این مشخصات یافت نشد</h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                لطفاً کد رهگیری (مانند MNT-8821) یا شماره موبایلی که هنگام خرید ثبت کرده‌اید را مجدداً بررسی فرمایید.
              </p>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
};
