import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  Boxes,
  Crown,
  Award,
  Sparkles,
  ShieldAlert,
  X
} from 'lucide-react';
import { Invoice, Customer, Product, InvoiceItem, PackSize, CheckItem } from '../types';

interface SalesInvoiceModuleProps {
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
  checks?: CheckItem[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: any) => void;
  isNewInvoiceModalOpen: boolean;
  setIsNewInvoiceModalOpen: (open: boolean) => void;
}

export const SalesInvoiceModule: React.FC<SalesInvoiceModuleProps> = ({
  invoices = [],
  customers = [],
  products = [],
  checks = [],
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
    const isColleague = selectedCustomer?.type === 'partner_wholesale' || selectedCustomer?.tier === 'tier_colleague' || selectedCustomer?.wholesaleLoyaltyTier === 'partner_gold_vip';
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

  // Check Risk Warning Logic (Fix 2)
  const customerChecks = selectedCustomer ? checks.filter(c => c.customerId === selectedCustomer.id) : [];
  const customerBouncedChecks = customerChecks.filter(c => c.status === 'bounced' || c.outcome === 'bounced');
  const customerClearedChecks = customerChecks.filter(c => c.status === 'cleared' || c.outcome === 'cleared_on_time');
  const hasBouncedHistory = customerBouncedChecks.length > 0;
  const isLowTrustScore = selectedCustomer ? selectedCustomer.trustScore < 70 : false;
  const showCheckWarning = paymentType === 'check' && (hasBouncedHistory || isLowTrustScore);

  // Loyalty Program Auto-Discount Recommendation (Fix 3)
  const loyaltyTier = selectedCustomer?.wholesaleLoyaltyTier;
  const suggestedLoyaltyDiscountPct = loyaltyTier === 'partner_gold_vip' ? 4 : loyaltyTier === 'partner_silver' ? 2 : 0;
  const calculatedLoyaltyDiscountToman = Math.round(subtotal * (suggestedLoyaltyDiscountPct / 100));

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

  const filteredInvoices = invoices.filter(inv => 
    inv.customerName.includes(searchQuery) ||
    inv.storeName.includes(searchQuery) ||
    inv.invoiceNumber.includes(searchQuery) ||
    inv.city.includes(searchQuery)
  );

  return (
    <div id="sales-invoice-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl shadow-2xs">
            <Receipt className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-lg font-black text-[#18181B]">
              فروش، صدور فاکتور و قیمت‌گذاری چندسطحی
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              صدور فاکتور رسمی و غیررسمی با محاسبه خودکار تخفیف پارت و استعلام وضعیت ریسک چک
            </p>
          </div>
        </div>

        <button
          id="btn-open-new-invoice-modal"
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#3F3F46]"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>+ صدور فاکتور جدید</span>
        </button>
      </div>

      {/* Invoice List & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی شماره فاکتور، نام خریدار، فروشگاه یا شهر..."
              className="w-full bg-[#FAF7F2] text-xs pr-9 pl-3 py-2 rounded-xl border border-[#DDD5C0] text-stone-900 outline-none focus:bg-white focus:border-[#D4AF37]"
            />
          </div>

          <span className="text-xs text-[#8C6D37] font-bold">
            نمایش {filteredInvoices.length} فاکتور صادر شده
          </span>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAF7F2] text-stone-700 border-b border-[#E6DEC8] font-bold">
              <tr>
                <th className="p-3">شماره و تاریخ</th>
                <th className="p-3">نام خریدار و فروشگاه</th>
                <th className="p-3">شهر و باربری</th>
                <th className="p-3">تعداد پک (عدد کل)</th>
                <th className="p-3">مبلغ کل فاکتور</th>
                <th className="p-3">شیوه پرداخت</th>
                <th className="p-3">وضعیت</th>
                <th className="p-3 text-center">چاپ / فاکتور</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F2]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="p-3">
                    <span className="font-mono font-bold text-[#18181B] block">{inv.invoiceNumber}</span>
                    <span className="text-[10px] text-stone-400">{inv.date}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-[#18181B] block">{inv.customerName}</span>
                    <span className="text-[11px] text-stone-500">{inv.storeName}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-stone-800 block">{inv.city}</span>
                    <span className="text-[10px] text-stone-500">{inv.shippingMethod}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-[#18181B]">
                      {inv.items.reduce((s, i) => s + i.packCount, 0)} پک
                    </span>
                    <span className="text-[10px] text-stone-400 mr-1">
                      ({inv.items.reduce((s, i) => s + i.totalUnits, 0)} عدد)
                    </span>
                  </td>
                  <td className="p-3 font-black text-[#18181B]">
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
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-[#FAF7F2] rounded-lg transition-colors flex items-center gap-1 border border-transparent hover:border-[#DDD5C0]"
                        title="مشاهده فاکتور سنتی بازاری"
                      >
                        <Printer className="w-4 h-4 text-[#8C6D37]" />
                        <span className="text-[11px] font-bold">فاکتور</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 1: Create New Invoice (with Check Risk & Loyalty Incentives)  */}
      {/* ------------------------------------------------------------------- */}
      {isNewInvoiceModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          id="modal-new-invoice-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsNewInvoiceModalOpen(false);
          }}
          className="fixed inset-0 z-[9999] bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
          dir="rtl"
        >
          <div 
            id="modal-new-invoice-card"
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#E6DEC8] my-auto max-h-[90vh] flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Top decorative accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]" />

            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-[#E6DEC8] shrink-0 bg-white pt-5">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl shadow-2xs">
                  <Receipt className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#18181B]">صدور فاکتور عمده جدید</h3>
                  <p className="text-xs text-stone-500 mt-0.5">انتخاب مشتری، محاسبه خودکار تخفیف پارت و استعلام اعتبار صیادی</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsNewInvoiceModalOpen(false)} 
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 p-2 rounded-xl transition-colors cursor-pointer"
                title="بستن پنجره"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateInvoice} className="flex-1 flex flex-col min-h-0 text-xs">
              
              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                
                {/* Customer Selector & Tier Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#DDD5C0]">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">انتخاب مشتری و خریدار:</label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full bg-white p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
                    >
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.storeName} - {c.city}) {c.wholesaleLoyaltyTier === 'partner_gold_vip' ? '👑 طلایی VIP' : c.type === 'partner_wholesale' ? '★ قیمت همکاری' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col justify-center text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500">سطح قیمت‌گذاری:</span>
                      <strong className="text-[#8C6D37] font-bold">
                        {selectedCustomer?.type === 'partner_wholesale' || selectedCustomer?.wholesaleLoyaltyTier === 'partner_gold_vip' 
                          ? 'نرخ هم‌صنف و همکاری (تخفیف‌دار)' 
                          : 'نرخ عمده‌فروشی عادی'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">امتیاز اعتبار صیاد:</span>
                      <span className={`font-black ${selectedCustomer && selectedCustomer.trustScore >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {selectedCustomer?.trustScore} از ۱۰۰
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">سابقه وصول چک:</span>
                      <span className="font-bold">
                        {hasBouncedHistory ? (
                          <span className="text-rose-700">⚠️ سابقه برگشتی دارد</span>
                        ) : customerClearedChecks.length > 0 ? (
                          <span className="text-emerald-700">✅ {customerClearedChecks.length} چک وصول شده</span>
                        ) : (
                          <span className="text-stone-500">فاقد سابقه چک</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Loyalty Discount Auto-Suggestion */}
                {suggestedLoyaltyDiscountPct > 0 && (
                  <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <div>
                        <strong className="text-[#8C6D37] block font-bold">
                          تخفیف وفاداری {loyaltyTier === 'partner_gold_vip' ? 'همکار طلایی VIP (۴٪)' : 'همکار نقره‌ای (۲٪)'}
                        </strong>
                        <span className="text-[10px] text-stone-600">
                          مبلغ تخفیف قابل اعمال: {calculatedLoyaltyDiscountToman.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDiscountAmount(calculatedLoyaltyDiscountToman)}
                      className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-[10px] px-3 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      اعمال تخفیف وفاداری
                    </button>
                  </div>
                )}

                {/* Items Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">اقلام و ردیف‌های کالا (بر اساس پک):</span>
                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="text-[#8C6D37] hover:text-[#18181B] font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ افزودن ردیف کالا</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto p-1">
                    {invoiceItems.map((item, idx) => {
                      const prod = products.find(p => p.id === item.productId);
                      const calc = calculatedItems[idx];

                      return (
                        <div key={idx} className="flex flex-wrap items-center gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0]">
                          
                          <div className="flex-1 min-w-[200px]">
                            <select
                              value={item.productId}
                              onChange={(e) => {
                                const updated = [...invoiceItems];
                                updated[idx].productId = e.target.value;
                                setInvoiceItems(updated);
                              }}
                              className="w-full bg-white p-2 rounded-lg border border-[#DDD5C0] text-xs font-bold text-stone-900"
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
                              className="w-16 bg-white p-2 rounded-lg border border-[#DDD5C0] text-center font-black text-stone-900"
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
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                              title="حذف ردیف"
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
                <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#DDD5C0] space-y-3">
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
                    <div className="space-y-2 pt-2 border-t border-[#DDD5C0]">
                      <input
                        type="text"
                        placeholder="مشخصات چک (شماره صیاد، بانک و سررسید)"
                        value={checkNotes}
                        onChange={(e) => setCheckNotes(e.target.value)}
                        className="w-full bg-white p-2.5 rounded-xl border border-[#DDD5C0] font-mono text-stone-900"
                      />

                      {/* Prominent Bounced Check Warning Banner */}
                      {hasBouncedHistory && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-900 text-xs">
                          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block font-black">هشدار فوری صیادی (سابقه چک برگشتی):</strong>
                            <p className="mt-0.5 leading-relaxed text-rose-800">
                              این مشتری دارای سابقه {customerBouncedChecks.length} فقره چک برگشتی است! صدور فاکتور چکی برای ایشان با ریسک بسیار بالا همراه است. توصیه می‌شود تسویه به صورت نقدی انجام گردد.
                            </p>
                          </div>
                        </div>
                      )}

                      {!hasBouncedHistory && isLowTrustScore && (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            <strong>هشدار ریسک بازاری:</strong> امتیاز اعتبار این مشتری ({selectedCustomer?.trustScore}) پایین‌تر از حد استاندارد فروش چکی است.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Discounts & Shipping Costs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">تخفیف دستی فاکتور (تومان):</label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                      className="w-full bg-white p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">شیوه ارسال باربری:</label>
                    <select
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-full bg-white p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                    >
                      <option value="باربری وطن (شوش)">باربری وطن (میدان شوش - پس کرایه)</option>
                      <option value="تیپاکس بازار">تیپاکس بازار</option>
                      <option value="چاپار">چاپار</option>
                      <option value="باربری پیام‌گیر (خیام)">باربری پیام‌گیر (خیام)</option>
                    </select>
                  </div>
                </div>

                {/* Totals Summary Card */}
                <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#DDD5C0] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-600">جمع اقلام فاکتور:</span>
                    <strong className="font-bold text-stone-900">{subtotal.toLocaleString('fa-IR')} ت</strong>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-rose-700">
                      <span>کسر تخفیف:</span>
                      <span>- {discountAmount.toLocaleString('fa-IR')} ت</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-[#18181B] pt-2 border-t border-[#DDD5C0]">
                    <span>مبلغ نهایی قابل پرداخت فاکتور:</span>
                    <span className="text-[#8C6D37]">{finalAmount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>

              </div>

              {/* Modal Fixed Footer */}
              <div className="p-4 sm:p-5 border-t border-[#E6DEC8] bg-[#FAF7F2] flex items-center justify-between gap-3 shrink-0">
                <div className="text-xs text-stone-600">
                  <span>مبلغ کل فاکتور: </span>
                  <strong className="text-sm font-black text-[#8C6D37]">{finalAmount.toLocaleString('fa-IR')} تومان</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewInvoiceModalOpen(false)}
                    className="px-4 py-2.5 text-stone-600 hover:bg-stone-200/70 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="bg-[#18181B] hover:bg-stone-800 text-[#D4AF37] hover:text-white font-black px-6 py-2.5 rounded-xl transition-all shadow-md border border-[#3F3F46] cursor-pointer active:scale-[0.99]"
                  >
                    صدور فاکتور و ثبت
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TRADITIONAL BAZAAR PRINT VIEW MODAL                                 */}
      {/* ------------------------------------------------------------------- */}
      {selectedInvoiceForPrint && typeof document !== 'undefined' && createPortal(
        <div 
          id="modal-print-invoice-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInvoiceForPrint(null);
          }}
          className="fixed inset-0 z-[9999] bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
          dir="rtl"
        >
          <div 
            id="modal-print-invoice-card"
            className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-[#E6DEC8] my-auto text-stone-900 max-h-[90vh] flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Top decorative accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]" />

            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8] print:hidden shrink-0">
              <span className="text-xs font-bold text-stone-500">پیش‌نمایش چاپ فاکتور بازاری</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-[#18181B] text-[#FAF7F2] font-black text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>پرینت / ذخیره PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 p-1.5 rounded-xl transition-colors cursor-pointer"
                  title="بستن"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Traditional Invoice Layout - Scrollable */}
            <div className="overflow-y-auto flex-1 my-3 pr-1 pl-1">
              <div className="p-4 border-2 border-stone-800 rounded-2xl space-y-4 bg-white">
                <div className="text-center pb-3 border-b-2 border-stone-800">
                  <h2 className="text-lg font-black text-stone-900">تولید و پخش پوشاک من و تو (manoto dress)</h2>
                  <p className="text-[11px] text-stone-600 mt-0.5">بازار بزرگ تهران، بازار عباس‌آباد (سرای ملی)، پاساژ المهدی ۴، طبقه منفی یک، پلاک ۲۴۲ (مدیریت: اسدی)</p>
                  <div className="flex justify-between items-center text-xs font-mono font-bold mt-2 pt-1 border-t border-dashed border-stone-400">
                    <span>شماره فاکتور: {selectedInvoiceForPrint.invoiceNumber}</span>
                    <span>تاریخ: {selectedInvoiceForPrint.date}</span>
                  </div>
                </div>

                {/* Customer Box */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-300">
                  <div><span>خریدار:</span> <strong>{selectedInvoiceForPrint.customerName}</strong></div>
                  <div><span>فروشگاه:</span> <strong>{selectedInvoiceForPrint.storeName}</strong></div>
                  <div><span>شهر و باربری:</span> <strong>{selectedInvoiceForPrint.city} ({selectedInvoiceForPrint.shippingMethod})</strong></div>
                  <div><span>تلفن تماس:</span> <strong className="font-mono">{selectedInvoiceForPrint.phone}</strong></div>
                </div>

                {/* Items Table */}
                <table className="w-full text-right text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-stone-800 bg-stone-100">
                      <th className="p-2 border-r border-stone-300">ردیف</th>
                      <th className="p-2 border-r border-stone-300">شرح کالا / مدل</th>
                      <th className="p-2 border-r border-stone-300 text-center">پک</th>
                      <th className="p-2 border-r border-stone-300 text-center">تعداد کل</th>
                      <th className="p-2 border-r border-stone-300 text-center">نرخ پک</th>
                      <th className="p-2 text-left">مبلغ کل (تومان)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-300">
                    {selectedInvoiceForPrint.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border-r border-stone-300 text-center">{idx + 1}</td>
                        <td className="p-2 border-r border-stone-300 font-bold">{item.productName} ({item.sku})</td>
                        <td className="p-2 border-r border-stone-300 text-center">{item.packCount}</td>
                        <td className="p-2 border-r border-stone-300 text-center">{item.totalUnits}</td>
                        <td className="p-2 border-r border-stone-300 text-center">{item.pricePerPack.toLocaleString('fa-IR')}</td>
                        <td className="p-2 text-left font-bold">{item.totalPrice.toLocaleString('fa-IR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Invoice Footer */}
                <div className="pt-2 border-t-2 border-stone-800 space-y-1.5 text-xs">
                  <div className="flex justify-between font-black text-sm">
                    <span>مبلغ قابل پرداخت فاکتور:</span>
                    <span>{selectedInvoiceForPrint.finalAmountToman.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className="text-[11px] text-stone-600 flex justify-between pt-1 border-t border-dashed border-stone-400">
                    <span>شیوه تسویه: {selectedInvoiceForPrint.paymentType === 'cash' ? 'نقدی / واریزی' : `چک صیادی (${selectedInvoiceForPrint.checkDetails})`}</span>
                    <span>مهر و امضای تولید و پخش من و تو (اسدی)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 print:hidden shrink-0">
              <button
                type="button"
                onClick={() => setSelectedInvoiceForPrint(null)}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
