import React from 'react';
import { StorefrontOrder } from '../../types';
import { Printer, CheckCircle, ShieldCheck, Truck, Building2, Phone } from 'lucide-react';

interface FormalInvoicePrintSheetProps {
  order: StorefrontOrder;
  onPrint?: () => void;
}

// Convert number to Persian words for commercial invoices
function numberToPersianWords(num: number): string {
  if (!num || num === 0) return 'صفر تومان';
  const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
  const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
  const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
  const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
  const thousands = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

  function convertChunk(n: number): string {
    let result = '';
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (h > 0) {
      result += hundreds[h];
    }

    const remainder = n % 100;
    if (remainder >= 10 && remainder < 20) {
      if (result) result += ' و ';
      result += teens[remainder - 10];
    } else {
      if (t > 1) {
        if (result) result += ' و ';
        result += tens[t];
      }
      if (u > 0) {
        if (result) result += ' و ';
        result += units[u];
      }
    }
    return result;
  }

  const chunks: number[] = [];
  let temp = Math.floor(num);
  while (temp > 0) {
    chunks.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const words: string[] = [];
  for (let i = chunks.length - 1; i >= 0; i--) {
    if (chunks[i] > 0) {
      const chunkWord = convertChunk(chunks[i]);
      const suffix = thousands[i];
      words.push(suffix ? `${chunkWord} ${suffix}` : chunkWord);
    }
  }

  return words.join(' و ') + ' تومان';
}

export const FormalInvoicePrintSheet: React.FC<FormalInvoicePrintSheetProps> = ({ order, onPrint }) => {
  const triggerPrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const amountInWords = numberToPersianWords(order.finalAmountToman);

  return (
    <div className="w-full space-y-4" dir="rtl">
      {/* Top Toolbar (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-stone-900 flex items-center justify-center font-black shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#FAF7F2]">
              فاکتور رسمی آمادهٔ چاپ با سربرگ «تولید و پخش من و تو»
            </h4>
            <p className="text-[11px] text-stone-400">
              قالب‌بندی استاندارد سایز کاغذ A4، بدون حاشیه‌های اضافی وب برای پرینتر
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={triggerPrint}
          className="w-full sm:w-auto py-2.5 px-5 bg-[#D4AF37] hover:bg-[#c39f2e] active:scale-[0.98] text-stone-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>ارسال مستقیم به پرینتر (چاپ A4)</span>
        </button>
      </div>

      {/* Official Invoice Sheet (Visible on screen and pristine on print) */}
      <div 
        id="formal-invoice-document"
        className="printable-formal-invoice bg-white text-stone-900 rounded-2xl border-2 border-stone-800 p-6 sm:p-8 shadow-sm font-sans"
      >
        {/* Header Block */}
        <div className="border-b-2 border-stone-800 pb-4 mb-4">
          <div className="grid grid-cols-3 items-center">
            
            {/* Left Box (Invoice Metadata) */}
            <div className="text-right text-xs space-y-1 text-stone-700">
              <div>
                <span className="font-semibold text-stone-900">شماره فاکتور:</span>{' '}
                <span className="font-mono font-bold text-stone-900 text-sm dir-ltr inline-block">{order.orderNumber}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-900">تاریخ صدور:</span>{' '}
                <span className="font-mono">{order.createdAt}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-900">کد رهگیری بیجک:</span>{' '}
                <span className="font-mono font-bold text-stone-900">{order.trackingCode}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-900">وضعیت پرداخت:</span>{' '}
                <span className="font-bold text-emerald-800">
                  {order.paymentStatus === 'paid' ? 'تسویه کامل شده' : 'در انتظار بررسی بانکی'}
                </span>
              </div>
            </div>

            {/* Center Box (Brand & Title) */}
            <div className="text-center space-y-1">
              <div className="inline-block px-3 py-0.5 border border-stone-800 rounded text-[11px] font-bold tracking-widest text-stone-700 mb-1">
                MANOTO DRESS
              </div>
              <h1 className="text-lg sm:text-xl font-black text-stone-950 tracking-tight">
                صورت‌حساب فروش کالا و خدمات
              </h1>
              <p className="text-xs font-bold text-[#8C6D37]">
                تولید و پخش پوشاک زنانه «من و تو» (بازار بزرگ تهران)
              </p>
              <span className="text-[10px] text-stone-500 block">
                تولیدی و بنکداری عمده پوشاک • مدیریت: آقای اسدی
              </span>
            </div>

            {/* Right Box (Logo / Badge) */}
            <div className="text-left flex flex-col items-end justify-center">
              <div className="w-16 h-16 border-2 border-stone-800 rounded-xl flex flex-col items-center justify-center bg-stone-50 text-stone-900 p-1">
                <span className="text-[9px] font-extrabold uppercase tracking-tighter">MANOTO</span>
                <span className="text-[14px] font-black leading-none text-[#8C6D37]">M&T</span>
                <span className="text-[8px] font-medium text-stone-600">DRESS</span>
              </div>
              <span className="text-[9px] text-stone-500 mt-1">نسخهٔ اصلی خریدار و انبار</span>
            </div>

          </div>
        </div>

        {/* Seller & Buyer Details Tables */}
        <div className="space-y-3 text-xs mb-5">
          
          {/* Seller Section */}
          <div className="border border-stone-800 rounded-lg overflow-hidden">
            <div className="bg-stone-100 px-3 py-1.5 font-bold border-b border-stone-800 text-stone-900 flex items-center justify-between">
              <span>الف) مشخصات فروشنده (تولیدی و انبار مبدأ)</span>
              <span className="text-[10px] text-stone-500 font-normal">شناسه صنفی: ۴۱۱۸۹۲۳۱۰۸</span>
            </div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white">
              <div>
                <span className="text-stone-500">نام شخص حقیقی/حقوقی:</span>{' '}
                <strong className="text-stone-900">تولید و پخش پوشاک من و تو (اسدی)</strong>
              </div>
              <div>
                <span className="text-stone-500">تلفن دفتر و کارگاه:</span>{' '}
                <span className="font-mono text-stone-900">021-55667788</span>
              </div>
              <div>
                <span className="text-stone-500">همراه پیگیری باربری:</span>{' '}
                <span className="font-mono text-stone-900">09123456789</span>
              </div>
              <div className="sm:col-span-3 pt-1 border-t border-stone-200">
                <span className="text-stone-500">نشانی تولیدی و پخش:</span>{' '}
                <span className="text-stone-800">
                  تهران، بازار بزرگ، بازار عباس‌آباد (سرای ملی)، پاساژ المهدی ۴، طبقه منفی یک (زیرزمین اول)، پلاک ۲۴۲
                </span>
              </div>
            </div>
          </div>

          {/* Buyer Section */}
          <div className="border border-stone-800 rounded-lg overflow-hidden">
            <div className="bg-stone-100 px-3 py-1.5 font-bold border-b border-stone-800 text-stone-900 flex items-center justify-between">
              <span>ب) مشخصات خریدار و نشانی تحویل گیرنده (مقصد)</span>
              <span className="text-[10px] text-stone-500 font-normal">
                روش تحویل: {order.shippingMethodTitle}
              </span>
            </div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white">
              <div>
                <span className="text-stone-500">نام خریدار / تحویل‌گیرنده:</span>{' '}
                <strong className="text-stone-900">{order.customer.fullName}</strong>
                {order.customer.storeName && (
                  <span className="text-[11px] text-stone-600 mr-1">({order.customer.storeName})</span>
                )}
              </div>
              <div>
                <span className="text-stone-500">شماره همراه اصلی:</span>{' '}
                <span className="font-mono font-bold text-stone-900">{order.customer.phone}</span>
              </div>
              <div>
                <span className="text-stone-500">تلفن ثابت:</span>{' '}
                <span className="font-mono text-stone-900">{order.customer.landlinePhone || 'ثبت نشده'}</span>
              </div>
              <div>
                <span className="text-stone-500">شماره در دسترس دوم:</span>{' '}
                <span className="font-mono text-stone-900">{order.customer.alternativePhone || 'ثبت نشده'}</span>
              </div>
              <div>
                <span className="text-stone-500">استان و شهر مقصد:</span>{' '}
                <strong className="text-stone-900">{order.customer.province} - {order.customer.city}</strong>
              </div>
              <div>
                <span className="text-stone-500">کد پستی:</span>{' '}
                <span className="font-mono text-stone-900">{order.customer.postalCode || '---'}</span>
              </div>
              <div className="sm:col-span-3 pt-1 border-t border-stone-200">
                <span className="text-stone-500">نشانی دقیق تحویل مرسوله:</span>{' '}
                <span className="text-stone-900 font-medium">{order.customer.address}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Purchased Items Table */}
        <div className="border border-stone-800 rounded-lg overflow-hidden mb-4">
          <div className="bg-stone-100 px-3 py-1.5 font-bold border-b border-stone-800 text-stone-900 text-xs">
            ج) مشخصات اقلام و کالاهای مورد معامله
          </div>
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-900 border-b border-stone-800 font-bold">
                <th className="py-2 px-2.5 text-center border-l border-stone-300 w-10">ردیف</th>
                <th className="py-2 px-3 border-l border-stone-300">شرح کالا و مدل</th>
                <th className="py-2 px-2 text-center border-l border-stone-300">رنگ</th>
                <th className="py-2 px-2 text-center border-l border-stone-300">سایز</th>
                <th className="py-2 px-2 text-center border-l border-stone-300">نوع فروش</th>
                <th className="py-2 px-2 text-center border-l border-stone-300 w-16">تعداد</th>
                <th className="py-2 px-3 text-left border-l border-stone-300">قیمت واحد (تومان)</th>
                <th className="py-2 px-3 text-left">مبلغ کل (تومان)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-300">
              {order.items.map((item, idx) => {
                const isWholesale = item.mode === 'wholesale_pack';
                return (
                  <tr key={item.id || idx} className="hover:bg-stone-50/50">
                    <td className="py-2 px-2 text-center border-l border-stone-300 font-mono">
                      {(idx + 1).toLocaleString('fa-IR')}
                    </td>
                    <td className="py-2 px-3 border-l border-stone-300">
                      <div className="font-bold text-stone-950">{item.product.name}</div>
                      {item.product.fabric && (
                        <div className="text-[10px] text-stone-500">جنس: {item.product.fabric}</div>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center border-l border-stone-300 text-stone-700">
                      {item.selectedColor || 'رنگ‌بندی انتخابی'}
                    </td>
                    <td className="py-2 px-2 text-center border-l border-stone-300 text-stone-700">
                      {item.selectedSize || 'فری‌سایز'}
                    </td>
                    <td className="py-2 px-2 text-center border-l border-stone-300 text-[11px] font-medium text-stone-800">
                      {isWholesale ? `پک عمده (${item.product.packSize} تایی)` : 'تک‌فروشی'}
                    </td>
                    <td className="py-2 px-2 text-center border-l border-stone-300 font-bold font-mono text-stone-900">
                      {item.quantity.toLocaleString('fa-IR')}
                    </td>
                    <td className="py-2 px-3 text-left border-l border-stone-300 font-mono text-stone-800">
                      {item.unitPriceToman.toLocaleString('fa-IR')}
                    </td>
                    <td className="py-2 px-3 text-left font-mono font-bold text-stone-950">
                      {item.totalPriceToman.toLocaleString('fa-IR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Totals & Words Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-stone-800 rounded-lg p-3.5 bg-stone-50 text-xs mb-5">
          {/* Right: Words Amount */}
          <div className="space-y-1.5 flex flex-col justify-center">
            <div className="text-stone-600 font-medium">مبلغ نهایی قابل پرداخت به حروف:</div>
            <div className="text-stone-950 font-bold text-sm bg-white p-2.5 rounded border border-stone-300 leading-relaxed">
              {amountInWords}
            </div>
            <div className="text-[11px] text-stone-500 pt-1">
              روش پرداخت: {order.paymentMethod === 'online_gateway' ? 'درگاه پرداخت آنلاین شاپرک' : order.paymentMethod === 'card_to_card' ? 'کارت به کارت' : 'چک صیادی بانکی'}
            </div>
          </div>

          {/* Left: Numbers Breakdown */}
          <div className="space-y-1.5 border-t sm:border-t-0 sm:border-r border-stone-300 sm:pr-4 pt-2 sm:pt-0">
            <div className="flex justify-between text-stone-700">
              <span>جمع کل اقلام فاکتور:</span>
              <span className="font-mono font-semibold">{order.subtotalToman.toLocaleString('fa-IR')} تومان</span>
            </div>
            {order.discountToman > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>تخفیف ویژه همکاری:</span>
                <span className="font-mono font-semibold">{order.discountToman.toLocaleString('fa-IR')} تومان</span>
              </div>
            )}
            <div className="flex justify-between text-stone-700">
              <span>هزینه خدمات بسته‌بندی و ارسال ({order.shippingMethodTitle}):</span>
              <span className="font-mono font-semibold">
                {order.shippingCostToman === 0 ? 'رایگان (تحویل حضوری/پس‌کرایه)' : `${order.shippingCostToman.toLocaleString('fa-IR')} تومان`}
              </span>
            </div>
            <div className="flex justify-between text-stone-950 font-black text-sm pt-2 border-t-2 border-stone-800">
              <span>مبلغ نهایی فاکتور:</span>
              <span className="font-mono text-base">{order.finalAmountToman.toLocaleString('fa-IR')} تومان</span>
            </div>
          </div>
        </div>

        {/* Terms, Assurance and Official Stamp & Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          {/* Terms & Warehouse Note */}
          <div className="border border-stone-300 rounded-lg p-3 bg-white space-y-1.5">
            <span className="font-bold text-stone-900 block">شرایط تحویل و ضمانت سلامت بار:</span>
            <ul className="list-disc list-inside text-[11px] text-stone-600 space-y-1 leading-relaxed">
              <li>کلیه اقلام پیش از خروج از انبار بازار بزرگ تهران بازبینی، کنترل کیفی و پلمب شده‌اند.</li>
              <li>شماره بارنامه و بیجک باربری پس از تحویل به شرکت حمل‌ونقل از طریق سامانه پیامکی اطلاع‌رسانی می‌شود.</li>
              <li>تحویل فیزیکی کالا منوط به ارائهٔ کارت شناسایی معتبر و امضای بیجک رسمی خواهد بود.</li>
            </ul>
          </div>

          {/* Official Stamp & Signatures */}
          <div className="border border-stone-800 rounded-lg p-3 bg-white flex items-center justify-around text-center">
            
            {/* Buyer Sign */}
            <div className="space-y-8">
              <span className="font-bold text-stone-700 block text-[11px]">مهر و امضای تحویل‌گیرنده:</span>
              <div className="text-[10px] text-stone-400">امضا و تاریخ دریافت</div>
            </div>

            {/* Official Store Seal */}
            <div className="relative flex flex-col items-center justify-center p-2">
              <div className="w-28 h-20 border-2 border-dashed border-[#8C6D37] rounded-xl flex flex-col items-center justify-center text-[#8C6D37] bg-amber-50/40 transform -rotate-3 select-none">
                <span className="text-[9px] font-black">پوشاک زنانه «من و تو»</span>
                <span className="text-[11px] font-extrabold my-0.5">تولید و پخش من و تو</span>
                <span className="text-[8px] font-semibold text-stone-700">مدیریت: اسدی - بازار تهران</span>
                <span className="text-[8px] text-emerald-700 font-bold mt-0.5">✓ تایید و صادر شد</span>
              </div>
              <span className="text-[10px] text-stone-500 mt-1 font-medium">مهر رسمی تولیدی و انبار</span>
            </div>

          </div>

        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-stone-300 text-center text-[10px] text-stone-500">
          تهران، بازار بزرگ، بازار عباس‌آباد (سرای ملی)، پاساژ المهدی ۴، طبقه منفی یک، پلاک ۲۴۲ • تلفن: ۵۵۶۶۷۷۸۸-۰۲۱
        </div>

      </div>
    </div>
  );
};
