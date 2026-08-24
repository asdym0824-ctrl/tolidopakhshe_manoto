import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Receipt, 
  Package, 
  User, 
  CreditCard,
  Edit3,
  Check
} from 'lucide-react';
import { Product, Customer, Invoice, InvoiceItem } from '../../types';

interface QuickNaturalLanguageEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  customers: Customer[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateProductStock?: (productId: string, newPackStock: number) => void;
  onAddNewCustomer?: (customer: Customer) => void;
}

interface ParsedResult {
  actionType: 'sale_invoice' | 'stock_update' | 'new_customer';
  summaryPersian: string;
  matchedProductId: string | null;
  matchedProductName: string;
  quantity: number;
  unitType: 'pack' | 'single';
  packSize: number;
  pricePerPack: number;
  totalAmount: number;
  matchedCustomerId: string | null;
  customerName: string;
  customerCity?: string;
  paymentType: 'cash' | 'check';
  paymentNotes: string;
  confidenceScore: number;
}

export const QuickNaturalLanguageEntryModal: React.FC<QuickNaturalLanguageEntryModalProps> = ({
  isOpen,
  onClose,
  products,
  customers,
  onAddInvoice,
  onUpdateProductStock,
  onAddNewCustomer,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedDraft, setParsedDraft] = useState<ParsedResult | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [successCommitMsg, setSuccessCommitMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setParsedDraft(null);
    setSuccessCommitMsg(null);

    try {
      const response = await fetch('/api/quick-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          products,
          customers,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setParsedDraft(json.data);
      } else {
        setErrorMsg(json.error || 'خطا در پردازش هوشمند متن.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('ارتباط با سرور برقرار نشد. لطفاً مجدداً تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCommit = () => {
    if (!parsedDraft) return;

    if (parsedDraft.actionType === 'sale_invoice') {
      const matchedProd = products.find(p => p.id === parsedDraft.matchedProductId) || products[0];
      const matchedCust = customers.find(c => c.id === parsedDraft.matchedCustomerId);

      const invoiceItem: InvoiceItem = {
        productId: matchedProd.id,
        productName: matchedProd.name,
        sku: matchedProd.sku,
        packCount: parsedDraft.quantity,
        packSize: matchedProd.packSize,
        totalUnits: parsedDraft.quantity * matchedProd.packSize,
        pricePerPack: parsedDraft.pricePerPack,
        totalPrice: parsedDraft.totalAmount,
      };

      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `۱۴۰۳-${Math.floor(200 + Math.random() * 700)}`,
        customerId: matchedCust?.id || `cust-${Date.now()}`,
        customerName: parsedDraft.customerName,
        storeName: matchedCust?.storeName || 'مشتری بازار',
        phone: matchedCust?.phone || '09120000000',
        city: parsedDraft.customerCity || matchedCust?.city || 'تهران',
        date: new Date().toLocaleDateString('fa-IR'),
        items: [invoiceItem],
        subtotalToman: parsedDraft.totalAmount,
        discountToman: 0,
        shippingCostToman: 0,
        finalAmountToman: parsedDraft.totalAmount,
        paymentType: parsedDraft.paymentType,
        checkDetails: parsedDraft.paymentType === 'check' ? parsedDraft.paymentNotes : undefined,
        status: parsedDraft.paymentType === 'cash' ? 'processing' : 'pending_check',
        shippingMethod: 'باربری وطن (شوش)',
        notes: `ثبت سریع با دستیار هوشمند: "${inputText}"`,
      };

      onAddInvoice(newInvoice);

      // Deduct stock if handler provided
      if (onUpdateProductStock && matchedProd) {
        const newStock = Math.max(0, matchedProd.packStock - parsedDraft.quantity);
        onUpdateProductStock(matchedProd.id, newStock);
      }

      setSuccessCommitMsg(`فاکتور فروش شماره ${newInvoice.invoiceNumber} برای ${parsedDraft.customerName} با موفقیت ثبت شد!`);
      setTimeout(() => {
        onClose();
        setInputText('');
        setParsedDraft(null);
        setSuccessCommitMsg(null);
      }, 1800);
    }
  };

  const sampleSuggestions = [
    '۲ پک شلوار بگ کتان لایت نقد فروختم به سارا احمدی',
    '۵ پک شلوار راحتی نخی چک صیادی ۴۵ روزه به حاج داوود محمدی اصفهان',
    '۳ پک داکرون اداری فروخته شد به خانم نوری مشهد نقد',
    '۱ پک لگ غواصی گنی نقد واریز شد',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#E6DEC8] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-black shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#18181B] flex items-center gap-1.5">
                <span>افزودن سریع با یک خط (هوشمند)</span>
                <span className="bg-[#D4AF37] text-[#18181B] text-[10px] px-2 py-0.5 rounded-full font-bold">Gemini AI</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                جمله را همانطور که به شاگرد حجره می‌گویید بنویسید؛ سیستم خودکار فاکتور را می‌چیند.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleParse} className="mt-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="مثلاً: ۲ پک شلوار بگ کتان لایت نقد فروختم به سارا احمدی..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 focus:border-[#18181B] text-xs sm:text-sm text-stone-900 transition-all placeholder:text-stone-400 font-medium shadow-xs"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute left-2 top-2 bottom-2 px-3 bg-[#18181B] hover:bg-stone-800 disabled:opacity-50 text-[#D4AF37] rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>پردازش</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-stone-500">پیشنهادهای نمونه بازاری:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleSuggestions.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(sample);
                  }}
                  className="text-[11px] bg-[#FAF7F2] hover:bg-[#E6DEC8]/60 text-stone-700 px-2.5 py-1 rounded-lg border border-[#DDD5C0] transition-colors cursor-pointer text-right truncate max-w-xs"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Error Message */}
        {errorMsg && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-900 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Commit Message */}
        {successCommitMsg && (
          <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successCommitMsg}</span>
          </div>
        )}

        {/* Parsed Draft Confirmation Card */}
        {parsedDraft && !successCommitMsg && (
          <div className="mt-4 bg-[#FAF7F2] border-2 border-[#18181B] rounded-2xl p-4 space-y-3.5 animate-in slide-in-from-top-3 fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span className="text-xs font-black text-[#18181B]">پیش‌نویس فاکتور استخراج شده</span>
              </div>
              <span className="text-[11px] bg-[#18181B] text-[#D4AF37] font-bold px-2 py-0.5 rounded-md">
                اطمینان: {Math.round(parsedDraft.confidenceScore * 100)}٪
              </span>
            </div>

            <p className="text-xs font-black text-[#8C6D37]">
              {parsedDraft.summaryPersian}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-[#DDD5C0] space-y-1">
                <span className="text-[10px] text-stone-500 font-bold flex items-center gap-1">
                  <Package className="w-3 h-3 text-[#8C6D37]" />
                  محصول و تعداد:
                </span>
                <p className="font-black text-stone-900 truncate">{parsedDraft.matchedProductName}</p>
                <p className="text-[11px] font-bold text-[#8C6D37]">
                  {parsedDraft.quantity} پک ({parsedDraft.quantity * parsedDraft.packSize} عدد)
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-[#DDD5C0] space-y-1">
                <span className="text-[10px] text-stone-500 font-bold flex items-center gap-1">
                  <User className="w-3 h-3 text-[#8C6D37]" />
                  مشتری و تسویه:
                </span>
                <p className="font-black text-stone-900 truncate">{parsedDraft.customerName}</p>
                <p className="text-[11px] font-bold text-emerald-800">
                  {parsedDraft.paymentType === 'cash' ? 'نقدی / واریز' : 'چک صیادی'} ({parsedDraft.paymentNotes})
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#18181B] text-[#FAF7F2] rounded-xl text-xs">
              <span className="font-bold">مبلغ نهایی محاسبه شده:</span>
              <strong className="text-sm font-black text-[#D4AF37]">
                {parsedDraft.totalAmount.toLocaleString('fa-IR')} تومان
              </strong>
            </div>

            {/* Confirmation Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmCommit}
                className="flex-1 bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] font-black py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Check className="w-4 h-4" />
                <span>تایید و ثبت نهایی در سیستم</span>
              </button>

              <button
                type="button"
                onClick={() => setParsedDraft(null)}
                className="px-3 py-2.5 bg-white hover:bg-stone-100 text-stone-700 font-bold rounded-xl border border-[#DDD5C0] transition-colors cursor-pointer text-xs"
              >
                ویرایش مجدد
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
