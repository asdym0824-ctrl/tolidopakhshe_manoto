import React from 'react';
import { Printer, X, Truck, MapPin, Phone, CheckCircle, Package } from 'lucide-react';

export interface ShipmentRecordData {
  id: string;
  invoiceNumber: string;
  customerName: string;
  storeName: string;
  phone: string;
  destinationCity: string;
  carrier: string;
  waybillNumber: string;
  sackCount: number;
  status: 'packed' | 'delivered_to_carrier' | 'received_by_customer';
  dispatchDate: string;
  shippingFeeType: string;
}

interface PrintWaybillModalProps {
  shipment: ShipmentRecordData | null;
  onClose: () => void;
}

export const PrintWaybillModal: React.FC<PrintWaybillModalProps> = ({
  shipment,
  onClose,
}) => {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-300 my-8">
        
        {/* Action Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-stone-700">پیش‌نمایش بیجک و بارنامه باربری بازار تهران</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-[#18181B] hover:bg-stone-800 text-[#D4AF37] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ بیجک رسمی</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-3 py-2 rounded-xl cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>

        {/* Traditional Printable Waybill Form */}
        <div className="border-2 border-stone-900 p-6 rounded-xl space-y-4 bg-white text-stone-900 text-xs">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900">
            <div>
              <h2 className="text-base font-black text-stone-950">بیجک و بارنامه رسمی ارسال کالا</h2>
              <p className="text-[11px] text-stone-600 font-bold mt-0.5">تولید و پخش پوشاک من و تو (حاج رضا اسدی)</p>
              <p className="text-[10px] text-stone-500">بازار بزرگ تهران • راسته بازار • پاساژ المهدی ۴ پلاک ۲۴۲</p>
            </div>
            <div className="text-left font-mono border-r-2 border-stone-200 pr-4 space-y-1">
              <p className="font-black text-sm text-amber-900">شماره بیجک: {shipment.waybillNumber}</p>
              <p className="text-[11px] text-stone-700">شماره فاکتور: {shipment.invoiceNumber}</p>
              <p className="text-[11px] text-stone-600">تاریخ ارسال: {shipment.dispatchDate}</p>
            </div>
          </div>

          {/* Sender & Receiver Boxes */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Sender Box */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-300 space-y-1.5">
              <span className="font-black text-stone-900 block border-b border-stone-200 pb-1 text-[11px]">
                مشخصات فرستنده:
              </span>
              <p><strong>نام:</strong> تولیدی و عمده‌فروشی پوشاک من و تو</p>
              <p><strong>مبدا:</strong> تهران، بازار بزرگ، پاساژ المهدی ۴</p>
              <p><strong>تلفن حجره:</strong> 02155667788 - 09123456789</p>
            </div>

            {/* Receiver Box */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-300 space-y-1.5">
              <span className="font-black text-stone-900 block border-b border-stone-200 pb-1 text-[11px]">
                مشخصات گیرنده و مقصد:
              </span>
              <p><strong>تحویل‌گیرنده:</strong> {shipment.customerName} ({shipment.storeName})</p>
              <p><strong>شهر مقصد:</strong> {shipment.destinationCity}</p>
              <p><strong>تلفن همراه:</strong> {shipment.phone}</p>
            </div>
          </div>

          {/* Shipment Details Table */}
          <table className="w-full text-right border-collapse border border-stone-900 text-xs">
            <thead className="bg-stone-100 font-bold border-b border-stone-900">
              <tr>
                <th className="border border-stone-400 p-2 text-center">شرکت حمل / باربری</th>
                <th className="border border-stone-400 p-2 text-center">تعداد کیسه / گونی / کارتن</th>
                <th className="border border-stone-400 p-2 text-center">نوع بسته</th>
                <th className="border border-stone-400 p-2 text-center">شیوه پرداخت کرایه</th>
                <th className="border border-stone-400 p-2 text-center">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-stone-400 p-2.5 text-center font-bold">{shipment.carrier}</td>
                <td className="border border-stone-400 p-2.5 text-center font-black text-amber-900 text-sm">{shipment.sackCount} گونی/بسته</td>
                <td className="border border-stone-400 p-2.5 text-center">پوشاک زنانه (شلوار و لگ)</td>
                <td className="border border-stone-400 p-2.5 text-center font-bold text-stone-800">{shipment.shippingFeeType}</td>
                <td className="border border-stone-400 p-2.5 text-center text-emerald-800 font-bold">
                  {shipment.status === 'delivered_to_carrier' ? 'تحویل باربری گردید' : 'آماده ارسال'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Notes & Guarantees */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600 space-y-1">
            <p>🔹 بسته‌ها با چسب و نخ باربندی پلمپ شده‌اند. لطفاً هنگام تحویل از باربری تعداد و سلامت بسته‌ها بررسی گردد.</p>
            <p>🔹 در صورت هرگونه مغایرت یا کسری بار، حداکثر تا ۲۴ ساعت پس از دریافت با دفتر بازار تماس حاصل فرمایید.</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 pt-6 text-center text-stone-700 text-[11px] border-t border-stone-200">
            <div>
              <p className="font-bold">امضا و مهر فرستنده</p>
              <p className="text-[10px] text-stone-400 mt-6">(پوشاک من و تو)</p>
            </div>
            <div>
              <p className="font-bold">امضا و مهر باربری</p>
              <p className="text-[10px] text-stone-400 mt-6">(متصدی انبار باربری)</p>
            </div>
            <div>
              <p className="font-bold">امضا و تاریخ تحویل‌گیرنده</p>
              <p className="text-[10px] text-stone-400 mt-6">(مشتری محترم)</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
