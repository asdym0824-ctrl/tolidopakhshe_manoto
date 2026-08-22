import React, { useState } from 'react';
import { 
  Truck, 
  Package, 
  Send, 
  CheckCircle, 
  Clock, 
  Search, 
  Phone, 
  MapPin, 
  Share2, 
  FileText,
  Plus
} from 'lucide-react';
import { Invoice } from '../types';

interface ShipmentRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  storeName: string;
  phone: string;
  destinationCity: string;
  carrier: 'باربری وطن (شوش)' | 'تیپاکس بازار' | 'چاپار' | 'باربری پیام‌گیر (خیام)';
  waybillNumber: string; // شماره بیجک
  sackCount: number; // تعداد گونی یا کارتن
  status: 'packed' | 'delivered_to_carrier' | 'received_by_customer';
  dispatchDate: string;
  shippingFeeType: 'پس‌کرایه (به عهده مشتری)' | 'پیش‌کرایه';
}

interface LogisticsModuleProps {
  invoices: Invoice[];
}

export const LogisticsModule: React.FC<LogisticsModuleProps> = ({ invoices }) => {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([
    {
      id: 'shp-1',
      invoiceNumber: '۱۴۰۳-۱۴۲',
      customerName: 'حاج داوود محمدی',
      storeName: 'پوشاک محمدی اصفهان',
      phone: '09131114589',
      destinationCity: 'اصفهان',
      carrier: 'باربری وطن (شوش)',
      waybillNumber: 'VTN-884920',
      sackCount: 3,
      status: 'delivered_to_carrier',
      dispatchDate: '۱۴۰۳/۰۳/۰۴',
      shippingFeeType: 'پس‌کرایه (به عهده مشتری)',
    },
    {
      id: 'shp-2',
      invoiceNumber: '۱۴۰۳-۱۴۳',
      customerName: 'خانم دکتر زهرا نوری',
      storeName: 'بوتیک مانتو و شلوار نوری',
      phone: '09124447812',
      destinationCity: 'مشهد مقدس',
      carrier: 'تیپاکس بازار',
      waybillNumber: 'TPX-9930214',
      sackCount: 1,
      status: 'delivered_to_carrier',
      dispatchDate: '۱۴۰۳/۰۳/۰۵',
      shippingFeeType: 'پس‌کرایه (به عهده مشتری)',
    },
    {
      id: 'shp-3',
      invoiceNumber: '۱۴۰۳-۱۴۴',
      customerName: 'برادران حسینی',
      storeName: 'پخش عمده شیراز',
      phone: '09173339011',
      destinationCity: 'شیراز',
      carrier: 'باربری پیام‌گیر (خیام)',
      waybillNumber: 'در انتظار بیجک',
      sackCount: 4,
      status: 'packed',
      dispatchDate: 'امروز',
      shippingFeeType: 'پس‌کرایه (به عهده مشتری)',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipmentForSMS, setSelectedShipmentForSMS] = useState<ShipmentRecord | null>(null);

  const filteredShipments = shipments.filter(s => 
    s.customerName.includes(searchQuery) ||
    s.destinationCity.includes(searchQuery) ||
    s.waybillNumber.includes(searchQuery) ||
    s.invoiceNumber.includes(searchQuery)
  );

  const handleUpdateStatus = (id: string, newStatus: ShipmentRecord['status']) => {
    setShipments(shipments.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const getSMSMessage = (shp: ShipmentRecord) => {
    return `همکار گرامی جناب ${shp.customerName} (${shp.storeName}) 🌸
سفارش فاکتور ${shp.invoiceNumber} شما در قالب ${shp.sackCount} گونی/بسته با ${shp.carrier} به مقصد ${shp.destinationCity} ارسال شد.

📋 شماره بیجک / رهگیری باربری: ${shp.waybillNumber}
نوع کرایه: ${shp.shippingFeeType}

با تشکر از خرید شما - تولید و پخش عمده بازار بزرگ تهران
تلفن پیگیری: 02155667788`;
  };

  return (
    <div id="logistics-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <Truck className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-stone-900">
              لجستیک، باربری‌های بازار و صدور بیجک
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              مدیریت ارسال کیسه‌ها و کارتن‌ها به باربری وطن، تیپاکس و پیامک خودکار شماره بیجک به مشتری شهرستان
            </p>
          </div>
        </div>

        <div className="text-xs text-stone-500 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-xl">
          <span>وضعیت امروز: </span>
          <strong className="text-stone-900 font-bold">۸ بسته ارسال شده به شوش و خیام</strong>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس نام مشتری، شهر یا شماره بیجک..."
              className="w-full bg-stone-50 text-xs pr-9 pl-3 py-2 rounded-lg border border-stone-200 outline-none"
            />
          </div>

          <span className="text-xs text-stone-500 font-medium">
            {filteredShipments.length} محموله در دست اقدام
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-100/80 text-stone-600 border-b border-stone-200 font-bold">
              <tr>
                <th className="p-3">شماره فاکتور و مشتری</th>
                <th className="p-3">شهر مقصد</th>
                <th className="p-3">باربری / شرکت حمل</th>
                <th className="p-3">شماره بیجک / بارنامه</th>
                <th className="p-3">تعداد بسته / گونی</th>
                <th className="p-3">وضعیت بار</th>
                <th className="p-3 text-center">ارسال بیجک به مشتری</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/70">
              {filteredShipments.map((shp) => (
                <tr key={shp.id} className="hover:bg-stone-50 transition-colors">
                  
                  <td className="p-3">
                    <span className="font-bold text-stone-900 block">{shp.customerName}</span>
                    <span className="text-[11px] text-stone-500 font-mono">فاکتور: {shp.invoiceNumber}</span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-1 font-bold text-stone-800">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{shp.destinationCity}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-medium border border-stone-200 text-[11px]">
                      {shp.carrier}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                      {shp.waybillNumber}
                    </span>
                  </td>

                  <td className="p-3 font-bold text-stone-900">
                    {shp.sackCount} گونی
                  </td>

                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      shp.status === 'delivered_to_carrier' ? 'bg-emerald-100 text-emerald-800' :
                      shp.status === 'packed' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-800'
                    }`}>
                      {shp.status === 'delivered_to_carrier' ? 'تحویل باربری شد' :
                       shp.status === 'packed' ? 'بسته‌بندی در انبار' : 'رسیده به دست مشتری'}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedShipmentForSMS(shp)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 mx-auto shadow-2xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>ارسال پیامک بیجک</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: SMS Waybill Sender */}
      {selectedShipmentForSMS && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-stone-900">ارسال پیامک شماره بیجک به مشتری</h3>
              </div>
              <button onClick={() => setSelectedShipmentForSMS(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-stone-500 mb-1">گیرنده: <strong>{selectedShipmentForSMS.customerName}</strong> ({selectedShipmentForSMS.phone})</p>
                <p className="text-stone-500">باربری: <strong>{selectedShipmentForSMS.carrier}</strong></p>
              </div>

              <textarea
                rows={7}
                readOnly
                value={getSMSMessage(selectedShipmentForSMS)}
                className="w-full bg-stone-50 p-3 rounded-xl border border-stone-200 font-sans leading-relaxed text-stone-800 outline-none"
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    alert(`پیامک بیجک با موفقیت به شماره ${selectedShipmentForSMS.phone} ارسال شد.`);
                    setSelectedShipmentForSMS(null);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  ارسال پیامک با پنل پیامکی بازار
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getSMSMessage(selectedShipmentForSMS));
                    alert('متن بیجک کپی شد! می‌توانید در واتساپ یا تلگرام ارسال فرمایید.');
                  }}
                  className="bg-stone-900 text-white font-bold px-3 py-2.5 rounded-xl"
                >
                  کپی متن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
