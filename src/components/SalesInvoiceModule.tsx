import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Printer, 
  Share2, 
  AlertTriangle, 
  CheckCircle, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Truck, 
  User, 
  Trash2,
  Boxes
} from 'lucide-react';
import { Invoice, Customer, Product, InvoiceItem, PackSize } from '../types';

interface SalesInvoiceModuleProps {
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: any) => void;
  isNewInvoiceModalOpen: boolean;
  setIsNewInvoiceModalOpen: (open: boolean) => void;
}

export const SalesInvoiceModule: React.FC<SalesInvoiceModuleProps> = ({
  invoices,
  customers,
  products,
  onAddInvoice,
  onUpdateInvoiceStatus,
  isNewInvoiceModalOpen,
  setIsNewInvoiceModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  // New Invoice Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [paymentType, setPaymentType] = useState<'cash' | 'check' | 'split'>('cash');
  const [checkNotes, setCheckNotes] = useState('چک صیادی بنفش ۴۵ روزه');
  const [shippingMethod, setShippingMethod] = useState('باربری وطن (شوش)');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  
  // Invoice items
  const [invoiceItems, setInvoiceItems] = useState<{
    productId: string;
    packCount: number;
  }[]>([
    { productId: products[0]?.id || '', packCount: 5 }
  ]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Calculate items with pricing based on customer tier
  const calculatedItems: InvoiceItem[] = invoiceItems.map(item => {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) {
      return {
        productId: item.productId,
        productName: 'کالا نامشخص',
        sku: 'SH-000',
        packCount: item.packCount,
        packSize: 6,
        totalUnits: item.packCount * 6,
        pricePerPack: 0,
        totalPrice: 0
      };
    }

    // Tier pricing logic: Colleague gets colleague price; others get wholesale
    const isColleague = selectedCustomer?.type === 'partner_wholesale' || selectedCustomer?.tier === 'tier_colleague';
    const pricePerPack = isColleague ? prod.colleaguePricePerPack : prod.baseWholesalePricePerPack;
    const totalUnits = item.packCount * prod.packSize;
    const totalPrice = pricePerPack * item.packCount;

    return {
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      packCount: item.packCount,
      packSize: prod.packSize,
      totalUnits,
      pricePerPack,
      totalPrice,
    };
  });

  const subtotal = calculatedItems.reduce((s, i) => s + i.totalPrice, 0);
  const finalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

  // Check trust alert
  const showCheckWarning = paymentType === 'check' && selectedCustomer && selectedCustomer.trustScore < 70;

  const handleAddItemRow = () => {
    setInvoiceItems([...invoiceItems, { productId: products[0]?.id || '', packCount: 2 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, idx) => idx !== index));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `۱۴۰۳-${Math.floor(120 + Math.random() * 800)}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      storeName: selectedCustomer.storeName,
      phone: selectedCustomer.phone,
      city: selectedCustomer.city,
      date: '۱۴۰۳/۰۳/۰۵',
      items: calculatedItems,
      subtotalToman: subtotal,
      discountToman: discountAmount,
      shippingCostToman: shippingCost,
      finalAmountToman: finalAmount,
      paymentType,
      checkDetails: paymentType === 'check' ? checkNotes : undefined,
      status: paymentType === 'cash' ? 'processing' : 'pending_check',
      shippingMethod,
      notes: `فاکتور صادر شده به صورت ${paymentType === 'cash' ? 'نقدی' : 'چک صیادی'} برای ${selectedCustomer.storeName}`,
    };

    onAddInvoice(newInvoice);
    setIsNewInvoiceModalOpen(false);
    setSelectedInvoiceForPrint(newInvoice);
  };

  return (
    <div id="sales-invoice-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-stone-900 text-white rounded-xl">
            <Receipt className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-stone-900">
              فروش، صدور فاکتور و قیمت‌گذاری چندسطحی
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              صدور فاکتور سنتی بازار، اعمال خودکار قیمت همکاری (فاصله ۱۰۰ تا ۲۰۰ تومانی) و کنترل ریسک فروش چکی
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="text-xs bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ صدور فاکتور عمده جدید</span>
        </button>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-800">لیست فاکتورهای ثبت شده</h3>
          <span className="text-xs text-stone-500">{invoices.length} فاکتور</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-100/80 text-stone-600 border-b border-stone-200 font-bold">
              <tr>
                <th className="p-3">شماره فاکتور</th>
                <th className="p-3">نام مشتری و فروشگاه</th>
                <th className="p-3">شهر مقصد</th>
                <th className="p-3">تعداد اقلام (پک)</th>
                <th className="p-3">مبلغ کل فاکتور</th>
                <th className="p-3">نوع تسویه</th>
                <th className="p-3">وضعیت بار</th>
                <th className="p-3 text-center">چاپ و ارسال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/70">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-stone-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-stone-900 block">{inv.customerName}</span>
                    <span className="text-[11px] text-stone-500">{inv.storeName}</span>
                  </td>
                  <td className="p-3 text-stone-700">{inv.city}</td>
                  <td className="p-3">
                    <span className="font-bold text-amber-800">
                      {inv.items.reduce((s, i) => s + i.packCount, 0)} پک
                    </span>
                    <span className="text-[10px] text-stone-400 mr-1">
                      ({inv.items.reduce((s, i) => s + i.totalUnits, 0)} عدد)
                    </span>
                  </td>
                  <td className="p-3 font-black text-stone-900">
                    {inv.finalAmountToman.toLocaleString('fa-IR')} ت
                  </td>
                  <td className="p-3">
                    {inv.paymentType === 'cash' ? (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[11px]">
                        نقدی / واریزی
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded text-[11px]">
                        چک صیادی
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'shipped' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'processing' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-800'
                    }`}>
                      {inv.status === 'shipped' ? 'تحویل باربری شد' :
                       inv.status === 'processing' ? 'در حال بسته‌بندی' : 'در انتظار تایید چک'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1"
                        title="مشاهده فاکتور سنتی بازاری"
                      >
                        <Printer className="w-4 h-4" />
                        <span className="text-[11px]">فاکتور</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Create New Invoice */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">صدور فاکتور عمده جدید</h3>
                <p className="text-xs text-stone-500">انتخاب مشتری، محاسبه خودکار تخفیف همکاری و پک‌های کالا</p>
              </div>
              <button onClick={() => setIsNewInvoiceModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 my-4 text-xs">
              
              {/* Customer Selector & Tier Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">انتخاب مشتری:</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-white p-2.5 rounded-xl border border-stone-200 font-bold text-stone-900 outline-none"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.storeName} - {c.city}) {c.type === 'partner_wholesale' ? '★ قیمت همکاری' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-center text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">سطح قیمت‌گذاری:</span>
                    <strong className="text-amber-800 font-bold">
                      {selectedCustomer?.type === 'partner_wholesale' ? 'نرخ هم‌صنف و همکاری (تخفیف‌دار)' : 'نرخ عمده‌فروشی عادی'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">امتیاز اعتبار صیاد:</span>
                    <span className={`font-bold ${selectedCustomer && selectedCustomer.trustScore >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {selectedCustomer?.trustScore} از ۱۰۰
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">اقلام و ردیف‌های کالا (بر اساس پک):</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ افزودن ردیف کالا</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                  {invoiceItems.map((item, idx) => {
                    const prod = products.find(p => p.id === item.productId);
                    const calc = calculatedItems[idx];

                    return (
                      <div key={idx} className="flex flex-wrap items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        
                        <div className="flex-1 min-w-[200px]">
                          <select
                            value={item.productId}
                            onChange={(e) => {
                              const updated = [...invoiceItems];
                              updated[idx].productId = e.target.value;
                              setInvoiceItems(updated);
                            }}
                            className="w-full bg-white p-2 rounded-lg border border-stone-200 text-xs"
                          >
                            {products.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} (پک {p.packSize} تایی - موجودی: {p.packStock} پک)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-stone-500">تعداد پک:</span>
                          <input
                            type="number"
                            min={1}
                            value={item.packCount}
                            onChange={(e) => {
                              const updated = [...invoiceItems];
                              updated[idx].packCount = Number(e.target.value) || 1;
                              setInvoiceItems(updated);
                            }}
                            className="w-16 bg-white p-2 rounded-lg border border-stone-200 text-center font-bold"
                          />
                        </div>

                        <div className="text-left min-w-[130px]">
                          <span className="font-bold text-stone-900 block">
                            {calc ? calc.totalPrice.toLocaleString('fa-IR') : 0} ت
                          </span>
                          <span className="text-[10px] text-stone-500">
                            ({calc ? calc.totalUnits : 0} عدد)
                          </span>
                        </div>

                        {invoiceItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Type & Check Warning */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-stone-800">شیوه تسویه حساب:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === 'cash'}
                      onChange={() => setPaymentType('cash')}
                    />
                    <span>نقدی / کارت به کارت فوری</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === 'check'}
                      onChange={() => setPaymentType('check')}
                    />
                    <span className="font-bold text-amber-800">چک صیادی مدت‌دار</span>
                  </label>
                </div>

                {paymentType === 'check' && (
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    <input
                      type="text"
                      placeholder="مشخصات چک (شماره صیاد، بانک و سررسید)"
                      value={checkNotes}
                      onChange={(e) => setCheckNotes(e.target.value)}
                      className="w-full bg-white p-2 rounded-lg border border-stone-200"
                    />

                    {showCheckWarning && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-900 text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          <strong>هشدار ریسک بازاری:</strong> امتیاز این مشتری ({selectedCustomer?.trustScore}) پایین‌تر از حد نصاب فروش چکی است! تایید نهایی مدیریت الزامی است.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shipping & Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شیوه ارسال باربری:</label>
                  <select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200"
                  >
                    <option value="باربری وطن (شوش)">باربری وطن (میدان شوش - پس کرایه)</option>
                    <option value="تیپاکس بازار">تیپاکس بازار</option>
                    <option value="چاپار">چاپار</option>
                    <option value="باربری پیام‌گیر (خیام)">باربری پیام‌گیر (خیام)</option>
                  </select>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span>جمع اقلام:</span>
                    <strong className="font-bold text-stone-900">{subtotal.toLocaleString('fa-IR')} ت</strong>
                  </div>
                  <div className="flex justify-between text-base font-black text-amber-950 pt-1 border-t border-amber-200">
                    <span>مبلغ قابل پرداخت فاکتور:</span>
                    <span>{finalAmount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-6 py-2 rounded-xl transition-colors shadow-xs"
                >
                  صدور فاکتور و ثبت در حساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Traditional Bazaar Printable Invoice */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-300 my-8">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4 print:hidden">
              <span className="text-xs font-bold text-stone-500">پیش‌نمایش فاکتور سنتی بازار بزرگ تهران</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.8 rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>چاپ فاکتور</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-3 py-1.8 rounded-lg"
                >
                  بستن
                </button>
              </div>
            </div>

            {/* Traditional Invoice Body */}
            <div className="border-2 border-stone-800 p-5 rounded-xl space-y-4 bg-stone-50/40 text-stone-900 text-xs">
              
              {/* Invoice Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-stone-800">
                <div>
                  <h2 className="text-base font-black">تولید و پخش عمده پوشاک بازار تهران</h2>
                  <p className="text-[11px] text-stone-600 mt-0.5">راسته بازار بزرگ • انواع شلوار راحتی، بگ و اسپرت زنانه</p>
                </div>
                <div className="text-left font-mono">
                  <p className="font-bold text-sm">شماره: {selectedInvoiceForPrint.invoiceNumber}</p>
                  <p className="text-[11px] text-stone-600">تاریخ: {selectedInvoiceForPrint.date}</p>
                </div>
              </div>

              {/* Customer Box */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-stone-100 rounded-lg border border-stone-300">
                <div><strong>خریدار محترم:</strong> {selectedInvoiceForPrint.customerName} ({selectedInvoiceForPrint.storeName})</div>
                <div><strong>شهر مقصد:</strong> {selectedInvoiceForPrint.city}</div>
                <div><strong>شماره تماس:</strong> {selectedInvoiceForPrint.phone}</div>
                <div><strong>شیوه ارسال:</strong> {selectedInvoiceForPrint.shippingMethod}</div>
              </div>

              {/* Items Table */}
              <table className="w-full text-right border-collapse border border-stone-400">
                <thead className="bg-stone-200 font-bold">
                  <tr>
                    <th className="border border-stone-400 p-2 text-center w-8">ردیف</th>
                    <th className="border border-stone-400 p-2">شرح کالا و مدل</th>
                    <th className="border border-stone-400 p-2 text-center">کد SKU</th>
                    <th className="border border-stone-400 p-2 text-center">تعداد پک</th>
                    <th className="border border-stone-400 p-2 text-center">تعداد عدد</th>
                    <th className="border border-stone-400 p-2 text-left">قیمت هر پک (تومان)</th>
                    <th className="border border-stone-400 p-2 text-left">مبلغ کل (تومان)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceForPrint.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-stone-400 p-2 text-center">{idx + 1}</td>
                      <td className="border border-stone-400 p-2 font-bold">{item.productName}</td>
                      <td className="border border-stone-400 p-2 text-center font-mono text-[11px]">{item.sku}</td>
                      <td className="border border-stone-400 p-2 text-center font-bold text-amber-900">{item.packCount} پک ({item.packSize} تایی)</td>
                      <td className="border border-stone-400 p-2 text-center">{item.totalUnits}</td>
                      <td className="border border-stone-400 p-2 text-left">{item.pricePerPack.toLocaleString('fa-IR')}</td>
                      <td className="border border-stone-400 p-2 text-left font-bold">{item.totalPrice.toLocaleString('fa-IR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary & Signatures */}
              <div className="flex justify-between items-end pt-2">
                <div className="space-y-1 text-[11px] text-stone-600">
                  <p>🔹 نحوه تسویه: {selectedInvoiceForPrint.paymentType === 'cash' ? 'نقدی / واریز' : selectedInvoiceForPrint.checkDetails}</p>
                  <p>🔹 اجناس با ضمانت دوخت و بدون آبرفت ارسال می‌گردد.</p>
                </div>

                <div className="text-left space-y-1 min-w-[200px]">
                  <div className="flex justify-between font-black text-sm text-stone-900 bg-stone-200 p-2 rounded">
                    <span>مبلغ کل فاکتور:</span>
                    <span>{selectedInvoiceForPrint.finalAmountToman.toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 pt-6 text-center text-stone-500 text-[11px]">
                <div>مهر و امضای فروشگاه (بازار تهران)</div>
                <div>امضا و تایید خریدار</div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
