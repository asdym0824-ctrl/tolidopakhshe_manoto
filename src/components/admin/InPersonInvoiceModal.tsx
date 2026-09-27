import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Receipt, 
  Plus, 
  Minus,
  Trash2, 
  Printer, 
  Download, 
  Check, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Calendar, 
  User, 
  DollarSign, 
  Sparkles, 
  AlertCircle, 
  Share2, 
  Eye, 
  FileText,
  CreditCard,
  Banknote,
  Coins,
  Search,
  UserPlus,
  Package,
  Copy,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle,
  ShieldCheck,
  ArrowRightLeft,
  ExternalLink,
  Layers,
  ZoomIn,
  Send,
  HelpCircle
} from 'lucide-react';
import { Product, Customer, Invoice, InvoiceItem, PackSize, CardPaymentDetails, CardPaymentSlip } from '../../types';
import { toPersianDigits, formatPersianPrice, numberToPersianWords } from '../../utils/persianWriting';
import { ProductSearchPicker } from './ProductSearchPicker';
import { CustomerSearchPicker, MergedCustomer } from './CustomerSearchPicker';

export interface DestinationCardInfo {
  id: string;
  bankName: string;
  bankCode: string;
  cardNumber: string;
  accountHolder: string;
  shaba: string;
  accountNumber: string;
  badge: string;
  accentColor: string;
}

export const DESTINATION_CARDS: DestinationCardInfo[] = [
  {
    id: 'mellat',
    bankName: 'بانک ملت',
    bankCode: 'mellat',
    cardNumber: '۶۱۰۴-۳۳۷۸-۹۲۱۱-۴۵۶۰',
    accountHolder: 'آقای اسدی (تولید و پخش من و تو)',
    shaba: 'IR420120000000001234567890',
    accountNumber: '۰۱۰۲۳۴۵۶۷۸۰۰۱',
    badge: 'حساب اصلی بازار عباس‌آباد',
    accentColor: '#D4AF37'
  },
  {
    id: 'melli',
    bankName: 'بانک ملی ایران',
    bankCode: 'melli',
    cardNumber: '۶۰۳۷-۹۹۷۵-۴۴۱۱-۸۸۲۲',
    accountHolder: 'آقای اسدی (پوشاک من و تو)',
    shaba: 'IR890170000000109988776655',
    accountNumber: '۰۳۰۱۱۴۴۵۵۶۰۰۳',
    badge: 'پایا و ساتنا عمده',
    accentColor: '#38bdf8'
  },
  {
    id: 'saderat',
    bankName: 'بانک صادرات ایران',
    bankCode: 'saderat',
    cardNumber: '۶۰۳۷-۶۹۱۹-۸۲۳۴-۵۵۱۰',
    accountHolder: 'آقای اسدی (تولیدی من و تو)',
    shaba: 'IR120190000000002233445566',
    accountNumber: '۰۲۰۹۸۷۶۵۴۳۰۰۲',
    badge: 'شعبه خیام و ۱۵ خرداد',
    accentColor: '#34d399'
  }
];

export const IRANIAN_BANKS = [
  'بانک ملت',
  'بانک ملی ایران',
  'بانک صادرات ایران',
  'بانک تجارت',
  'بانک سپه',
  'بانک پاسارگاد',
  'بانک سامان',
  'بانک آینده',
  'بانک پارسیان',
  'بانک کشاورزی',
  'بانک مسکن',
  'بانک شهر',
  'بانک کارآفرین',
  'بانک قرض‌الحسنه رسالت',
  'بانک قرض‌الحسنه مهر ایران',
  'بلوبانک (سامان)'
];

// Helper to generate a realistic SVG receipt for testing demo card-to-card transfers
const generateDemoReceiptSvg = (amount: number, tracking: string, bank: string, last4: string, invoiceNum: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" style="background:#fff; font-family:sans-serif;">
    <rect width="400" height="520" fill="#ffffff" rx="16"/>
    <rect x="0" y="0" width="400" height="70" fill="#18181b"/>
    <circle cx="45" cy="35" r="18" fill="#10b981"/>
    <path d="M38 35 L43 40 L52 30" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <text x="75" y="42" fill="#ffffff" font-size="15" font-weight="bold">رسید واریز کارت به کارت شتاب</text>
    <text x="365" y="42" fill="#d4af37" font-size="11" font-weight="bold" text-anchor="end">شبکه شاپرک</text>
    
    <g transform="translate(20, 90)">
      <rect width="360" height="80" fill="#f8fafc" rx="12" stroke="#e2e8f0"/>
      <text x="180" y="30" fill="#64748b" font-size="12" text-anchor="middle">مبلغ انتقال‌یافته به حساب من و تو:</text>
      <text x="180" y="60" fill="#0f172a" font-size="20" font-weight="bold" text-anchor="middle">${amount.toLocaleString('fa-IR')} تومان</text>
    </g>

    <g transform="translate(30, 200)" font-size="12.5" fill="#334155">
      <text x="340" y="0" text-anchor="end" fill="#64748b">بانک مبدأ خریدار:</text>
      <text x="0" y="0" font-weight="bold">${bank || 'بانک ملت'}</text>
      
      <text x="340" y="32" text-anchor="end" fill="#64748b">کارت مبدأ:</text>
      <text x="0" y="32" font-weight="bold">•••• •••• •••• ${last4 || '۸۸۲۲'}</text>

      <text x="340" y="64" text-anchor="end" fill="#64748b">بانک و حساب مقصد:</text>
      <text x="0" y="64" font-weight="bold">بانک ملت - پوشاک من و تو (اسدی)</text>

      <text x="340" y="96" text-anchor="end" fill="#64748b">شماره کارت مقصد:</text>
      <text x="0" y="96" font-weight="bold">۶۱۰۴-۳۳۷۸-۹۲۱۱-۴۵۶۰</text>

      <text x="340" y="128" text-anchor="end" fill="#64748b">شماره پیگیری / ارجاع:</text>
      <text x="0" y="128" font-weight="bold" fill="#0f172a">${tracking}</text>

      <text x="340" y="160" text-anchor="end" fill="#64748b">فاکتور مرتبط:</text>
      <text x="0" y="160" font-weight="bold" fill="#8c6d37">${invoiceNum}</text>

      <text x="340" y="192" text-anchor="end" fill="#64748b">وضعیت انتقال:</text>
      <text x="0" y="192" font-weight="bold" fill="#059669">موفق و تایید گردید ✓</text>
    </g>

    <line x1="25" y1="440" x2="375" y2="440" stroke="#e2e8f0" stroke-dasharray="4"/>
    <text x="200" y="470" fill="#94a3b8" font-size="11" text-anchor="middle">تولید و پخش پوشاک من و تو (MANOTO DRESS)</text>
    <text x="200" y="490" fill="#cbd5e1" font-size="10" text-anchor="middle">بازار بزرگ تهران، بازار عباس‌آباد، سرای ملی، پلاک ۲۴۲</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

interface InPersonInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  customers: Customer[];
  invoices?: Invoice[];
  onAddInvoice: (invoice: Invoice) => void;
  onAddCustomer?: (customer: Customer) => void;
  initialInvoiceToView?: Invoice | null;
}

// Generate today's Persian date string (e.g. ۱۴۰۳/۰۷/۰۴)
const getTodayPersianDate = (): string => {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  } catch (e) {
    return '۱۴۰۳/۰۷/۰۴';
  }
};

export const InPersonInvoiceModal: React.FC<InPersonInvoiceModalProps> = ({
  isOpen,
  onClose,
  products = [],
  customers = [],
  invoices = [],
  onAddInvoice,
  onAddCustomer,
  initialInvoiceToView = null
}) => {
  // Step in modal: 'form' for entering data, 'sheet' for showing the final official invoice
  const [activeStep, setActiveStep] = useState<'form' | 'sheet'>('form');

  // Customer & Header Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(getTodayPersianDate());
  const [storeName, setStoreName] = useState('');
  const [city, setCity] = useState('تهران (خرید حضوری بازار)');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isNewCustomerMode, setIsNewCustomerMode] = useState<boolean>(true);
  const [customerNotice, setCustomerNotice] = useState<string | null>(null);

  const customerNameInputRef = React.useRef<HTMLInputElement>(null);

  // Combine and deduplicate customers from CRM and all past invoices
  const allAvailableCustomers = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; phone: string; storeName?: string; city?: string }>();
    customers.forEach(c => {
      const key = (c.phone?.trim() || c.name?.trim().toLowerCase()) || c.id;
      map.set(key, { id: c.id, name: c.name, phone: c.phone, storeName: c.storeName, city: c.city });
    });
    (invoices || []).forEach(inv => {
      if (!inv.customerName) return;
      const key = (inv.phone?.trim() || inv.customerName.trim().toLowerCase());
      if (!map.has(key)) {
        map.set(key, {
          id: inv.customerId || `cust-inv-${inv.id}`,
          name: inv.customerName,
          phone: inv.phone || '',
          storeName: inv.storeName,
          city: inv.city
        });
      }
    });
    return Array.from(map.values());
  }, [customers, invoices]);

  // Items State
  interface RowItem {
    id: string;
    productId: string;
    packCount: number;
    isNegotiated: boolean;
    negotiatedPricePerPack: number;
  }

  const defaultProductId = products[0]?.id || '';
  const defaultProduct = products[0];

  const [rows, setRows] = useState<RowItem[]>([
    {
      id: `row-${Date.now()}-1`,
      productId: defaultProductId,
      packCount: 3,
      isNegotiated: false,
      negotiatedPricePerPack: defaultProduct?.baseWholesalePricePerPack || 0
    }
  ]);

  // Payment & Terms
  const [paymentType, setPaymentType] = useState<'cash' | 'check' | 'split'>('cash');
  const [checkDetails, setCheckDetails] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState('تحویل حضوری در دفتر پخش بازار بزرگ تهران - تسویه نهایی شد');

  // Card-to-Card Payment System State
  const [selectedDestinationBankIndex, setSelectedDestinationBankIndex] = useState(0);
  const [cardTrackingNumber, setCardTrackingNumber] = useState('');
  const [sourceCardLast4, setSourceCardLast4] = useState('');
  const [sourceBankName, setSourceBankName] = useState('بانک ملت');
  const [cardDepositAmount, setCardDepositAmount] = useState<number | ''>('');
  const [cardDepositDate, setCardDepositDate] = useState(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date());
    } catch (e) {
      return 'امروز - ساعت جاری';
    }
  });
  const [cardReceiptImage, setCardReceiptImage] = useState<string | null>(null);
  const [cardNotes, setCardNotes] = useState('');
  const [cardCopiedNotice, setCardCopiedNotice] = useState<string | null>(null);
  const [zoomReceiptUrl, setZoomReceiptUrl] = useState<string | null>(null);

  // Multi-Slip Card-to-Card (سقف شتاب در خریدهای عمده)
  const [isMultiSlip, setIsMultiSlip] = useState(false);
  const [additionalSlips, setAdditionalSlips] = useState<CardPaymentSlip[]>([]);

  // Current Created / Viewed Invoice
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(initialInvoiceToView || null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // If opening in view mode for an existing invoice
  React.useEffect(() => {
    if (initialInvoiceToView) {
      setCurrentInvoice(initialInvoiceToView);
      setActiveStep('sheet');
    } else {
      setActiveStep('form');
    }
  }, [initialInvoiceToView, isOpen]);

  if (!isOpen) return null;

  // Handler for quickly populating from predefined dropdown
  const handleSelectPredefinedCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const custId = e.target.value;
    if (!custId) {
      handleResetToNewCustomer();
      return;
    }
    const found = allAvailableCustomers.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setStoreName(found.storeName || '');
      setCity(found.city ? (found.city.includes('بازار') ? found.city : `${found.city} (خرید حضوری بازار)`) : 'تهران (خرید حضوری بازار)');
      setSelectedCustomerId(found.id);
      setIsNewCustomerMode(false);
      setCustomerNotice(`اطلاعات «${found.name}» بارگذاری شد.`);
      setTimeout(() => setCustomerNotice(null), 3000);
    }
  };

  // Handler for selecting from CustomerSearchPicker
  const handleCustomerPickedFromSearch = (cust: MergedCustomer) => {
    setCustomerName(cust.name);
    setCustomerPhone(cust.phone);
    setStoreName(cust.storeName || '');
    setCity(cust.city ? (cust.city.includes('بازار') ? cust.city : `${cust.city} (خرید حضوری بازار)`) : 'تهران (خرید حضوری بازار)');
    setSelectedCustomerId(cust.id);
    setIsNewCustomerMode(false);
    setCustomerNotice(`اطلاعات «${cust.name}» جهت صدور سریع فاکتور بارگذاری شد.`);
    setTimeout(() => setCustomerNotice(null), 3500);
  };

  // Handler for resetting to New Customer mode
  const handleResetToNewCustomer = () => {
    setCustomerName('');
    setCustomerPhone('');
    setStoreName('');
    setCity('تهران (خرید حضوری بازار)');
    setSelectedCustomerId('');
    setIsNewCustomerMode(true);
    setCustomerNotice('حالت خریدار جدید فعال شد • با صدور فاکتور، این خریدار خودبه‌خود در دیتابیس ثبت می‌شود.');
    setTimeout(() => {
      customerNameInputRef.current?.focus();
    }, 50);
    setTimeout(() => setCustomerNotice(null), 4000);
  };

  // Add new item row
  const handleAddRow = () => {
    const p = products[0];
    setRows(prev => [
      ...prev,
      {
        id: `row-${Date.now()}-${prev.length + 1}`,
        productId: p?.id || '',
        packCount: 2,
        isNegotiated: false,
        negotiatedPricePerPack: p?.baseWholesalePricePerPack || 0
      }
    ]);
  };

  // Remove item row
  const handleRemoveRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter(r => r.id !== id));
  };

  // Step pack count (+1 / -1)
  const handleStepPackCount = (rowId: string, delta: number) => {
    setRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      const newCount = Math.max(1, (r.packCount || 1) + delta);
      return { ...r, packCount: newCount };
    }));
  };

  // Toggle negotiated pricing mode
  const handleToggleNegotiated = (rowId: string, isNegotiated: boolean) => {
    setRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      const prod = products.find(p => p.id === r.productId);
      const std = prod?.baseWholesalePricePerPack || 0;
      return {
        ...r,
        isNegotiated,
        negotiatedPricePerPack: isNegotiated ? (r.negotiatedPricePerPack || std) : std
      };
    }));
  };

  // Quick set negotiated price
  const handleSetNegotiatedPrice = (rowId: string, price: number) => {
    setRows(prev => prev.map(r => r.id === rowId ? {
      ...r,
      isNegotiated: true,
      negotiatedPricePerPack: Math.max(0, Math.round(price))
    } : r));
  };

  // Calculate row details
  const calculatedRows = rows.map(r => {
    const prod = products.find(p => p.id === r.productId);
    const standardPrice = prod ? prod.baseWholesalePricePerPack : 0;
    const effectivePricePerPack = r.isNegotiated ? r.negotiatedPricePerPack : standardPrice;
    const packSize: PackSize = prod?.packSize || 6;
    const totalUnits = r.packCount * packSize;
    const totalPrice = effectivePricePerPack * r.packCount;

    return {
      ...r,
      product: prod,
      productName: prod?.name || 'کالای انتخابی',
      sku: prod?.sku || 'SKU-000',
      packSize,
      totalUnits,
      standardPrice,
      effectivePricePerPack,
      totalPrice
    };
  });

  const subtotalToman = calculatedRows.reduce((sum, item) => sum + item.totalPrice, 0);
  const finalAmountToman = Math.max(0, subtotalToman - discountAmount);
  const totalPacksCount = calculatedRows.reduce((sum, item) => sum + item.packCount, 0);
  const totalUnitsCount = calculatedRows.reduce((sum, item) => sum + item.totalUnits, 0);

  // Keep card deposit amount updated if user switches to card payment
  React.useEffect(() => {
    if (paymentType === 'split' && (cardDepositAmount === '' || cardDepositAmount === 0)) {
      setCardDepositAmount(finalAmountToman);
    }
  }, [paymentType, finalAmountToman]);

  // Card to Card Calculation
  const activeDestinationCard = DESTINATION_CARDS[selectedDestinationBankIndex] || DESTINATION_CARDS[0];
  const primaryDepositAmount = typeof cardDepositAmount === 'number' ? cardDepositAmount : (cardDepositAmount ? parseInt(cardDepositAmount, 10) || 0 : 0);
  const additionalDepositedTotal = isMultiSlip 
    ? additionalSlips.reduce((sum, s) => sum + (Number(s.amountToman) || 0), 0) 
    : 0;
  const totalCardDeposited = primaryDepositAmount + additionalDepositedTotal;
  const cardBalanceDifference = finalAmountToman - totalCardDeposited;

  const handleCopyCardNumber = (cardNumber: string, bankTitle: string) => {
    navigator.clipboard.writeText(cardNumber.replace(/[-]/g, ''));
    setCardCopiedNotice(`شماره کارت ۱۶ رقمی ${bankTitle} کپی شد!`);
    setTimeout(() => setCardCopiedNotice(null), 3000);
  };

  const handleCopyShaba = (shaba: string, bankTitle: string) => {
    navigator.clipboard.writeText(shaba);
    setCardCopiedNotice(`شماره شبا (IBAN) ${bankTitle} کپی شد!`);
    setTimeout(() => setCardCopiedNotice(null), 3000);
  };

  const handleCopyFullAccountShare = (card: typeof DESTINATION_CARDS[0]) => {
    const text = `اطلاعات حساب رسمی تولید و پخش پوشاک «من و تو» (آقای اسدی):
بانک: ${card.bankName}
شماره کارت: ${card.cardNumber}
شماره شبا: ${card.shaba}
صاحب حساب: ${card.accountHolder}
دفتر بازار بزرگ تهران، سرای ملی، پلاک ۲۴۲`;
    navigator.clipboard.writeText(text);
    setCardCopiedNotice(`مشخصات حساب ${card.bankName} جهت ارسال کپی شد!`);
    setTimeout(() => setCardCopiedNotice(null), 3000);
  };

  const handleGenerateRandomTracking = () => {
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    setCardTrackingNumber(code);
  };

  const handleLoadDemoReceipt = () => {
    const amount = primaryDepositAmount > 0 ? primaryDepositAmount : finalAmountToman;
    const tracking = cardTrackingNumber || Math.floor(10000000 + Math.random() * 90000000).toString();
    if (!cardTrackingNumber) setCardTrackingNumber(tracking);
    if (!sourceCardLast4) setSourceCardLast4('۸۸۲۲');
    const demoImg = generateDemoReceiptSvg(
      amount, 
      tracking, 
      sourceBankName, 
      sourceCardLast4 || '۸۸۲۲',
      'فاکتور حضوری من و تو'
    );
    setCardReceiptImage(demoImg);
    setCardCopiedNotice('فیش واریزی شتابی نمونه با موفقیت پیوست شد ✓');
    setTimeout(() => setCardCopiedNotice(null), 3000);
  };

  const handleReceiptFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCardReceiptImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSlip = () => {
    const newSlip: CardPaymentSlip = {
      id: `slip-${Date.now()}`,
      trackingNumber: '',
      amountToman: 0,
      sourceLast4: '',
      sourceBankName: 'بانک ملت',
      depositDate: getTodayPersianDate()
    };
    setAdditionalSlips(prev => [...prev, newSlip]);
  };

  const handleUpdateSlip = (id: string, updates: Partial<CardPaymentSlip>) => {
    setAdditionalSlips(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleRemoveSlip = (id: string) => {
    setAdditionalSlips(prev => prev.filter(s => s.id !== id));
  };

  // Submit and create invoice
  const handleCreateAndFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('لطفاً نام و نام خانوادگی و شماره موبایل خریدار را وارد فرمایید.');
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const invoiceNumber = `MNT-IN-${randomNum}`;

    const invoiceItems: InvoiceItem[] = calculatedRows.map(r => ({
      productId: r.productId,
      productName: r.productName,
      sku: r.sku,
      packCount: r.packCount,
      packSize: r.packSize,
      totalUnits: r.totalUnits,
      pricePerPack: r.effectivePricePerPack,
      totalPrice: r.totalPrice,
      isNegotiatedPrice: r.isNegotiated,
      originalPricePerPack: r.standardPrice
    }));

    const finalCustomerId = selectedCustomerId || `cust-inperson-${Date.now()}`;

    const fullCardDetails: CardPaymentDetails | undefined = paymentType === 'split' ? {
      destinationBank: activeDestinationCard.bankName,
      destinationCardNumber: activeDestinationCard.cardNumber,
      destinationAccountHolder: activeDestinationCard.accountHolder,
      destinationShaba: activeDestinationCard.shaba,
      trackingNumber: cardTrackingNumber.trim() || `SHETAB-${Math.floor(100000 + Math.random() * 900000)}`,
      sourceCardLast4: sourceCardLast4.trim() || undefined,
      sourceBankName: sourceBankName || 'بانک ملت',
      depositAmount: primaryDepositAmount || finalAmountToman,
      depositDate: cardDepositDate || getTodayPersianDate(),
      receiptImage: cardReceiptImage || undefined,
      notes: cardNotes.trim() || undefined,
      multipleSlips: isMultiSlip && additionalSlips.length > 0 ? additionalSlips : undefined
    } : undefined;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      customerId: finalCustomerId,
      customerName: customerName.trim(),
      storeName: storeName.trim() || 'خرید حضوری آزاد',
      phone: customerPhone.trim(),
      city: city.trim() || 'تهران (دفتر پخش بازار)',
      date: invoiceDate.trim() || getTodayPersianDate(),
      items: invoiceItems,
      subtotalToman,
      discountToman: discountAmount,
      shippingCostToman: 0,
      finalAmountToman,
      paymentType,
      checkDetails: paymentType === 'check' ? (checkDetails || 'چک صیادی حضوری') : undefined,
      cardPaymentDetails: fullCardDetails,
      status: paymentType === 'check' ? 'pending_check' : 'paid',
      shippingMethod: 'تحویل حضوری در دفتر پخش و کارگاه بازار تهران',
      trackingCode: invoiceNumber,
      notes: notes.trim(),
      isOfficialInPerson: true
    };

    onAddInvoice(newInvoice);

    if (onAddCustomer && isNewCustomerMode) {
      const newCustomerRecord: Customer = {
        id: finalCustomerId,
        name: customerName.trim(),
        storeName: storeName.trim() || 'فروشگاه / خرید حضوری',
        phone: customerPhone.trim(),
        city: city.trim() || 'تهران',
        province: 'تهران',
        type: 'shop_keeper',
        tier: 'tier_colleague',
        wholesaleLoyaltyTier: 'partner_regular',
        trustScore: 85,
        paymentTerms: paymentType === 'check' ? 'check_eligible' : 'cash_only',
        checkLimitToman: 40000000,
        currentActiveCheckToman: 0,
        totalPurchasesToman: finalAmountToman,
        orderCount: 1,
        totalPacksPurchased: totalPacksCount,
        lastOrderDate: invoiceDate.trim() || getTodayPersianDate(),
        lastContactDate: invoiceDate.trim() || getTodayPersianDate(),
        channelSource: 'in_person',
        preferredShipping: 'باربری وطن',
        tags: ['ثبت خودکار از فاکتور', 'مشتری حضوری'],
        notes: `ثبت خودکار از صدور فاکتور حضوری ${invoiceNumber}`
      };
      onAddCustomer(newCustomerRecord);
    }
    setCurrentInvoice(newInvoice);
    setActiveStep('sheet');
  };

  // Direct Browser Printer Trigger
  const handlePrint = () => {
    window.print();
  };

  // Generate & Download Offline HTML Invoice for Printing Later
  const handleDownloadInvoiceFile = () => {
    if (!currentInvoice) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>فاکتور رسمی من و تو - ${currentInvoice.invoiceNumber}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif;
      direction: rtl;
      background: #fff;
      color: #111;
      margin: 0;
      padding: 10px;
      font-size: 12px;
      line-height: 1.5;
    }
    .invoice-container {
      border: 2px solid #222;
      border-radius: 12px;
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    .header-table {
      width: 100%;
      border-bottom: 2px solid #222;
      padding-bottom: 12px;
      margin-bottom: 15px;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border: 1px solid #999;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    .section-box {
      border: 1px solid #333;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .section-title {
      background: #eee;
      padding: 6px 10px;
      font-weight: bold;
      border-bottom: 1px solid #333;
      font-size: 12px;
    }
    .section-content {
      padding: 10px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      font-size: 11.5px;
    }
    table.items {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      font-size: 11.5px;
    }
    table.items th, table.items td {
      border: 1px solid #666;
      padding: 7px 8px;
      text-align: right;
    }
    table.items th {
      background: #f4f4f4;
      font-weight: bold;
      text-align: center;
    }
    .totals-box {
      border: 1px solid #222;
      border-radius: 8px;
      padding: 12px;
      background: #fafafa;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
    }
    .seal-box {
      border: 2px dashed #8C6D37;
      padding: 10px 16px;
      border-radius: 10px;
      display: inline-block;
      text-align: center;
      color: #8C6D37;
      font-weight: bold;
      transform: rotate(-3deg);
    }
    .footer-note {
      text-align: center;
      font-size: 10.5px;
      color: #666;
      margin-top: 15px;
      border-top: 1px solid #ddd;
      padding-top: 8px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      .invoice-container { border: 2px solid #000; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 900px; margin: 0 auto 15px auto; background: #18181b; color: #fff; padding: 14px 20px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; font-family: inherit; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    <div>
      <div style="font-weight: 900; font-size: 14px; color: #d4af37;">فاکتور رسمی تولید و پخش پوشاک من و تو (MANOTO DRESS)</div>
      <div style="font-size: 11px; color: #a1a1aa; margin-top: 3px;">این فایل مستقل است و در هر زمان بدون نیاز به اینترنت می‌توانید آن را با پرینتر چاپ فرمایید.</div>
    </div>
    <button onclick="window.print()" style="background: #d4af37; color: #18181b; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 900; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-family: inherit;">
      🖨️ چاپ با پرینتر (A4)
    </button>
  </div>
  <div class="invoice-container">
    <table class="header-table">
      <tr>
        <td style="width: 33%; text-align: right; vertical-align: top;">
          <div><strong>شماره فاکتور:</strong> ${currentInvoice.invoiceNumber}</div>
          <div><strong>تاریخ صدور:</strong> ${currentInvoice.date}</div>
          <div><strong>نوع سفارش:</strong> خرید و تحویل حضوری</div>
          <div><strong>وضعیت تسویه:</strong> ${currentInvoice.paymentType === 'cash' ? 'تسویه نقدی / پوز' : currentInvoice.paymentType === 'split' ? 'واریز کارت به کارت شتابی' : 'چک صیادی'}</div>
        </td>
        <td style="width: 34%; text-align: center; vertical-align: top;">
          <div class="badge">MANOTO DRESS</div>
          <h2 style="margin: 4px 0 2px 0; font-size: 16px; font-weight: 900;">صورت‌حساب فروش کالا و خدمات</h2>
          <div style="font-weight: bold; color: #8C6D37; font-size: 13px;">تولید و پخش پوشاک زنانه «من و تو»</div>
          <div style="font-size: 10.5px; color: #555;">مدیریت: آقای اسدی • بازار بزرگ تهران</div>
        </td>
        <td style="width: 33%; text-align: left; vertical-align: top;">
          <div style="display: inline-block; border: 2px solid #222; border-radius: 8px; padding: 6px 12px; text-align: center;">
            <div style="font-weight: 900; font-size: 13px;">MANOTO</div>
            <div style="font-size: 10px; color: #8C6D37;">تولید و پخش</div>
          </div>
          <div style="font-size: 10px; color: #666; margin-top: 4px;">نسخهٔ رسمی خریدار و حسابداری</div>
        </td>
      </tr>
    </table>

    <div class="section-box">
      <div class="section-title">الف) مشخصات فروشنده (تولیدی و بنکداری مبدأ)</div>
      <div class="section-content">
        <div><strong>نام واحد:</strong> تولید و پخش پوشاک من و تو (اسدی)</div>
        <div><strong>تلفن دفتر فروش:</strong> ۰۲۱-۵۵۶۶۷۷۸۸</div>
        <div><strong>تلفن همراه مدیریت:</strong> ۰۹۱۲۱۹۶۶۱۴۴</div>
        <div style="grid-column: span 3; border-top: 1px solid #eee; padding-top: 4px;">
          <strong>آدرس کارگاه و دفتر فروش:</strong> بازار بزرگ تهران، بازار عباس‌آباد (سرای ملی)، پاساژ المهدی ۴، طبقه منفی یک (زیرزمین اول)، پلاک ۲۴۲
        </div>
      </div>
    </div>

    <div class="section-box">
      <div class="section-title">ب) مشخصات خریدار (تحویل حضوری)</div>
      <div class="section-content">
        <div><strong>نام و نام خانوادگی خریدار:</strong> ${currentInvoice.customerName}</div>
        <div><strong>شماره موبایل:</strong> ${currentInvoice.phone}</div>
        <div><strong>فروشگاه / شهر:</strong> ${currentInvoice.storeName} (${currentInvoice.city})</div>
      </div>
    </div>

    <table class="items">
      <thead>
        <tr>
          <th style="width: 35px;">ردیف</th>
          <th>شرح کالا و مدل</th>
          <th style="width: 60px;">تعداد پک</th>
          <th style="width: 60px;">تعداد کل</th>
          <th style="width: 120px;">نرخ هر پک (تومان)</th>
          <th style="width: 130px;">مبلغ کل (تومان)</th>
        </tr>
      </thead>
      <tbody>
        ${currentInvoice.items.map((it, idx) => `
          <tr>
            <td style="text-align: center;">${idx + 1}</td>
            <td><strong>${it.productName}</strong> <span style="color: #666; font-size: 10px;">(${it.sku})</span></td>
            <td style="text-align: center;">${it.packCount}</td>
            <td style="text-align: center;">${it.totalUnits} عدد</td>
            <td style="text-align: left;">${it.pricePerPack.toLocaleString('fa-IR')} ${it.isNegotiatedPrice ? '<span style="color:#d97706; font-size: 10px;">(توافقی)</span>' : ''}</td>
            <td style="text-align: left; font-weight: bold;">${it.totalPrice.toLocaleString('fa-IR')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals-box">
      <div style="width: 55%;">
        <div><strong>مبلغ قابل پرداخت به حروف:</strong></div>
        <div style="background: #fff; border: 1px solid #ccc; padding: 6px 10px; border-radius: 6px; margin-top: 4px; font-weight: bold; font-size: 12px;">
          ${numberToPersianWords(currentInvoice.finalAmountToman)}
        </div>
        <div style="margin-top: 6px; font-size: 11px; color: #555;">
          شیوه تسویه: ${currentInvoice.paymentType === 'cash' ? 'نقدی / دستگاه کارتخوان (POS)' : currentInvoice.paymentType === 'split' ? `کارت به کارت شتابی (${currentInvoice.cardPaymentDetails?.destinationBank || 'بانک ملت'} - کد رهگیری: ${currentInvoice.cardPaymentDetails?.trackingNumber || 'ثبت شده'}${currentInvoice.cardPaymentDetails?.sourceCardLast4 ? ` - کارت مبدأ: ${currentInvoice.cardPaymentDetails.sourceCardLast4}` : ''})` : `چک صیادی (${currentInvoice.checkDetails || 'مدت‌دار'})`}
        </div>
      </div>
      <div style="width: 40%; text-align: left; font-size: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>جمع کل اقلام:</span>
          <strong>${currentInvoice.subtotalToman.toLocaleString('fa-IR')} تومان</strong>
        </div>
        ${currentInvoice.discountToman > 0 ? `
          <div style="display: flex; justify-content: space-between; color: #b91c1c; margin-bottom: 4px;">
            <span>کسر تخفیف توافقی:</span>
            <strong>- ${currentInvoice.discountToman.toLocaleString('fa-IR')} تومان</strong>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; border-top: 2px solid #222; padding-top: 6px; font-size: 14px; font-weight: 900;">
          <span>مبلغ نهایی فاکتور:</span>
          <span>${currentInvoice.finalAmountToman.toLocaleString('fa-IR')} تومان</span>
        </div>
      </div>
    </div>

    <table style="width: 100%; border: 1px solid #333; border-radius: 8px; padding: 10px; margin-top: 10px;">
      <tr>
        <td style="width: 50%; vertical-align: middle; text-align: center;">
          <div style="color: #555; margin-bottom: 40px;">مهر و امضای خریدار / تحویل‌گیرنده کالا</div>
          <div style="font-size: 10px; color: #999;">امضا و تاریخ دریافت اقلام</div>
        </td>
        <td style="width: 50%; vertical-align: middle; text-align: center;">
          <div class="seal-box">
            <div style="font-size: 10px;">پوشاک زنانه «من و تو»</div>
            <div style="font-size: 12px; font-weight: 900; margin: 2px 0;">تولید و پخش من و تو</div>
            <div style="font-size: 9px;">مدیریت: اسدی - بازار بزرگ تهران</div>
            <div style="color: #047857; font-size: 10px; margin-top: 2px;">✓ تسویه و تحویل قطعی شد</div>
          </div>
        </td>
      </tr>
    </table>

    <div class="footer-note">
      بازار بزرگ تهران، بازار عباس‌آباد (سرای ملی)، پاساژ المهدی ۴، طبقه منفی یک، پلاک ۲۴۲ • تلفن دفتر فروش: ۵۵۶۶۷۷۸۸-۰۲۱ • همراه: ۰۹۱۲۱۹۶۶۱۴۴
    </div>
  </div>
  <script>
    window.onload = function() {
      // آماده چاپ
    };
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `فاکتور-من-و-تو-${currentInvoice.invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyInvoiceText = () => {
    if (!currentInvoice) return;
    const text = `فاکتور رسمی تولید و پخش من و تو (MANOTO DRESS)
شماره فاکتور: ${currentInvoice.invoiceNumber}
تاریخ: ${currentInvoice.date}
خریدار: ${currentInvoice.customerName} (${currentInvoice.phone})
فروشگاه: ${currentInvoice.storeName}
اقلام:
${currentInvoice.items.map((it, idx) => `${idx + 1}. ${it.productName} - ${it.packCount} پک (${it.totalUnits} عدد) - نرخ هر پک: ${it.pricePerPack.toLocaleString('fa-IR')} تومان = ${it.totalPrice.toLocaleString('fa-IR')} ت`).join('\n')}
مبلغ نهایی: ${currentInvoice.finalAmountToman.toLocaleString('fa-IR')} تومان (${numberToPersianWords(currentInvoice.finalAmountToman)})
شیوه تسویه: ${currentInvoice.paymentType === 'cash' ? 'نقدی / کارتخوان فروشگاه' : currentInvoice.paymentType === 'split' ? `کارت به کارت شتابی (${currentInvoice.cardPaymentDetails?.destinationBank || 'بانک ملت'} - کد رهگیری: ${currentInvoice.cardPaymentDetails?.trackingNumber || 'ثبت شده'})` : 'چک صیادی'}
محل تحویل: دفتر پخش بازار تهران، پاساژ المهدی ۴، پلاک ۲۴۲`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return createPortal(
    <div 
      id="inperson-invoice-modal-overlay"
      className="fixed inset-0 z-[9999] bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="inperson-invoice-modal-card"
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-[#E6DEC8] my-auto max-h-[94vh] flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E6DEC8] shrink-0 bg-[#FAF7F2]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold shrink-0 shadow-xs border border-stone-800">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  {activeStep === 'form' ? 'صدور فاکتور جدید (خرید و تحویل حضوری)' : 'فاکتور رسمی سربرگ‌دار من و تو'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/40">
                  بازار تهران
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {activeStep === 'form' 
                  ? 'ثبت نام، شماره تماس، تاریخ، انتخاب اجناس با قیمت توافقی و محاسبه خودکار' 
                  : 'آماده چاپ با پرینتر (A4) و ذخیره فایل مستقل جهت چاپ بعدی'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeStep === 'sheet' && (
              <button
                type="button"
                onClick={() => setActiveStep('form')}
                className="text-xs font-bold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                ویرایش / ثبت فاکتور دیگر
              </button>
            )}
            <button 
              type="button"
              onClick={onClose} 
              className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 p-2 rounded-xl transition-colors cursor-pointer"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: INVOICE ISSUING FORM                                  */}
        {/* ------------------------------------------------------------- */}
        {activeStep === 'form' && (
          <form onSubmit={handleCreateAndFinalize} className="flex-1 flex flex-col min-h-0 text-xs">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              
              {/* Part 1: Buyer Info & Date */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#DDD5C0] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E6DEC8] flex-wrap gap-2">
                  <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#8C6D37]" />
                    <span>۱. مشخصات خریدار و تاریخ صدور فاکتور</span>
                  </span>
                  
                  <div className="flex items-center gap-2 text-[11px] flex-wrap">
                    <span className="text-stone-500 hidden sm:inline">انتخاب سریع:</span>
                    <select 
                      value={selectedCustomerId}
                      onChange={handleSelectPredefinedCustomer}
                      className="bg-white border border-[#DDD5C0] text-stone-800 rounded-xl px-2.5 py-1 text-xs outline-none focus:border-[#D4AF37] font-medium shadow-2xs cursor-pointer"
                      title="انتخاب از لیست کشویی مشتریان"
                    >
                      <option value="">-- خریدار جدید --</option>
                      {allAvailableCustomers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.storeName ? `(${c.storeName})` : (c.city ? `(${c.city})` : (c.phone ? `(${c.phone})` : ''))}
                        </option>
                      ))}
                    </select>

                    <CustomerSearchPicker
                      customers={customers}
                      invoices={invoices}
                      selectedCustomerId={selectedCustomerId}
                      onSelectCustomer={handleCustomerPickedFromSearch}
                      onNewCustomer={handleResetToNewCustomer}
                      isNewCustomerMode={isNewCustomerMode}
                    />
                  </div>
                </div>

                {customerNotice && (
                  <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-[11px] animate-in fade-in duration-150">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{customerNotice}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setCustomerNotice(null)} 
                      className="text-stone-400 hover:text-stone-700 cursor-pointer"
                      title="بستن اعلان"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      نام و نام خانوادگی <span className="text-rose-600">*</span>:
                    </label>
                    <div className="relative">
                      <input
                        ref={customerNameInputRef}
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: حاج رضا شریفی"
                        className="w-full bg-white px-3 py-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* Mobile Phone */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      شماره موبایل خریدار <span className="text-rose-600">*</span>:
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="مثال: 09121234567"
                        className="w-full bg-white px-3 py-2.5 rounded-xl border border-[#DDD5C0] font-mono text-stone-900 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Invoice Date */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      تاریخ صدور فاکتور <span className="text-rose-600">*</span>:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        placeholder="مثال: ۱۴۰۳/۰۷/۰۴"
                        className="w-full bg-white px-3 py-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      />
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Store Name (Optional) */}
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      نام فروشگاه / بنکداری (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="مثال: پخش پوشاک شریفی"
                      className="w-full bg-white px-3 py-2 rounded-xl border border-[#DDD5C0] text-stone-900 outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* City (Optional) */}
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-stone-700 mb-1">
                      شهر و مقصد بار:
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="مثال: تهران (خرید حضوری) یا اصفهان / مشهد"
                      className="w-full bg-white px-3 py-2 rounded-xl border border-[#DDD5C0] text-stone-900 outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Part 2: Products Selection with Negotiated Price Option */}
              <div className="bg-white p-4 rounded-2xl border border-[#DDD5C0] shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E6DEC8]">
                  <div>
                    <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-[#8C6D37]" />
                      <span>۲. انتخاب اجناس، تعداد پک و قیمت توافقی</span>
                    </span>
                    <span className="text-[11px] text-stone-500">
                      می‌توانید برای هر قلم کالا تیک «قیمت توافقی» را فعال کرده و نرخ توافق‌شده را دستی تعیین کنید.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="bg-[#18181B] hover:bg-stone-800 text-[#D4AF37] hover:text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ افزودن ردیف کالا</span>
                  </button>
                </div>

                {/* Rows List */}
                <div className="space-y-3">
                  {calculatedRows.map((row, idx) => (
                    <div 
                      key={row.id} 
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
                        row.isNegotiated 
                          ? 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border-amber-300 ring-1 ring-amber-300/60 shadow-xs' 
                          : 'bg-[#FAF7F2] hover:bg-[#FAF7F2]/90 border-[#DDD5C0] shadow-2xs'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        
                        {/* 1. Product Select & Search (5 cols) */}
                        <div className="md:col-span-5 relative">
                          {/* Companion native select for accessibility and DOM selector matching */}
                          <select
                            value={row.productId}
                            onChange={(e) => {
                              const newProdId = e.target.value;
                              const prod = products.find(p => p.id === newProdId);
                              setRows(prev => prev.map(r => r.id === row.id ? {
                                ...r,
                                productId: newProdId,
                                negotiatedPricePerPack: prod?.baseWholesalePricePerPack || 0
                              } : r));
                            }}
                            className="sr-only pointer-events-none absolute opacity-0 -z-10"
                            tabIndex={-1}
                            aria-hidden="true"
                          >
                            {products.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.sku}) • پک {p.packSize} تایی • {p.baseWholesalePricePerPack.toLocaleString('fa-IR')} ت
                              </option>
                            ))}
                          </select>

                          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-[#18181B] text-[#D4AF37] px-2 py-0.5 rounded-lg text-xs font-black shadow-2xs">
                                ردیف {toPersianDigits(idx + 1)}
                              </span>
                              <span className="text-xs font-bold text-stone-800">
                                انتخاب، جستجو و جنس کالا:
                              </span>
                            </div>
                            <span className="text-[10px] text-amber-800 bg-amber-100/70 border border-amber-200/80 px-2 py-0.5 rounded-md font-medium">
                              تایپ و فیلتر زنده
                            </span>
                          </div>

                          {/* Rich Searchable Picker with Image, Fabric Type, and Model Details */}
                          <ProductSearchPicker
                            products={products}
                            selectedProductId={row.productId}
                            rowIndex={idx + 1}
                            onSelectProduct={(newProd) => {
                              setRows(prev => prev.map(r => r.id === row.id ? {
                                ...r,
                                productId: newProd.id,
                                negotiatedPricePerPack: r.isNegotiated ? (r.negotiatedPricePerPack || newProd.baseWholesalePricePerPack) : newProd.baseWholesalePricePerPack
                              } : r));
                            }}
                          />

                          {row.product && (
                            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap text-[10px]">
                              <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300 font-bold shadow-2xs">
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                <span>{row.product.fabricType || 'پارچه باکیفیت و تن‌خور عالی'}</span>
                              </span>
                              <span className="text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded-md border border-stone-200 font-mono">
                                کد: {row.product.sku}
                              </span>
                              <span className="text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded-md border border-stone-200">
                                پک {toPersianDigits(row.packSize)} تایی
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 2. Pack Count Stepper (2 cols) */}
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            تعداد پک:
                          </label>
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#DDD5C0] shadow-2xs focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]">
                            <button
                              type="button"
                              onClick={() => handleStepPackCount(row.id, -1)}
                              disabled={row.packCount <= 1}
                              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer shrink-0"
                              title="کاهش یک پک"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={row.packCount || ''}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(1, parseInt(e.target.value, 10) || 1);
                                setRows(prev => prev.map(r => r.id === row.id ? { ...r, packCount: val } : r));
                              }}
                              className="w-full text-center font-black text-sm text-stone-900 outline-none bg-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => handleStepPackCount(row.id, 1)}
                              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                              title="افزایش یک پک"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="mt-1 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200 whitespace-nowrap">
                              <Package className="w-3 h-3 text-stone-500" />
                              <span>{toPersianDigits(row.totalUnits)} عدد کل</span>
                            </span>
                          </div>
                        </div>

                        {/* 3. Wholesale Pricing Mode (3 cols) */}
                        <div className="md:col-span-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="inline-flex p-0.5 bg-stone-200/80 rounded-lg text-[10.5px] font-bold">
                              <button
                                type="button"
                                onClick={() => handleToggleNegotiated(row.id, false)}
                                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                  !row.isNegotiated 
                                    ? 'bg-white text-stone-900 shadow-2xs font-black' 
                                    : 'text-stone-600 hover:text-stone-900'
                                }`}
                              >
                                نرخ مصوب
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleNegotiated(row.id, true)}
                                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                                  row.isNegotiated 
                                    ? 'bg-amber-500 text-stone-950 font-black shadow-2xs' 
                                    : 'text-stone-600 hover:text-amber-800'
                                }`}
                              >
                                <Sparkles className="w-3 h-3 text-amber-900" />
                                <span>قیمت توافقی</span>
                              </button>
                            </div>

                            {row.isNegotiated && (
                              <span className="text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                                دستی
                              </span>
                            )}
                          </div>

                          {row.isNegotiated ? (
                            <div className="space-y-1">
                              <div className="relative">
                                <input
                                  type="number"
                                  step={5000}
                                  value={row.negotiatedPricePerPack || ''}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                                    setRows(prev => prev.map(r => r.id === row.id ? { ...r, negotiatedPricePerPack: val } : r));
                                  }}
                                  placeholder="نرخ توافقی هر پک به تومان"
                                  className="w-full bg-white pr-2.5 pl-12 py-1.5 rounded-xl border border-amber-400 font-black text-xs text-amber-950 outline-none focus:ring-2 focus:ring-amber-400/40 shadow-2xs"
                                />
                                <span className="absolute left-2.5 top-2 text-[10px] font-bold text-amber-800 pointer-events-none">
                                  تومان
                                </span>
                              </div>

                              {/* Quick bargaining action chips */}
                              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleSetNegotiatedPrice(row.id, row.standardPrice * 0.95)}
                                  className="text-[9.5px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 transition-colors cursor-pointer"
                                  title="اعمال ۵٪ تخفیف روی نرخ مصوب"
                                >
                                  ۵٪-
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetNegotiatedPrice(row.id, row.standardPrice * 0.90)}
                                  className="text-[9.5px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 transition-colors cursor-pointer"
                                  title="اعمال ۱۰٪ تخفیف روی نرخ مصوب"
                                >
                                  ۱۰٪-
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetNegotiatedPrice(row.id, Math.max(0, row.standardPrice - 20000))}
                                  className="text-[9.5px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 transition-colors cursor-pointer"
                                  title="کسر ۲۰ هزار تومان از هر پک"
                                >
                                  ۲۰هزار-
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetNegotiatedPrice(row.id, row.standardPrice)}
                                  className="text-[9.5px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded border border-stone-300 transition-colors cursor-pointer"
                                  title="بازنشانی به نرخ مصوب"
                                >
                                  مصوب
                                </button>
                              </div>

                              {/* Comparison breakdown */}
                              <div className="flex items-center justify-between text-[9.5px] text-stone-600 pt-0.5">
                                {row.negotiatedPricePerPack < row.standardPrice ? (
                                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                    تخفیف: {(row.standardPrice - row.negotiatedPricePerPack).toLocaleString('fa-IR')} ت/پک
                                  </span>
                                ) : row.negotiatedPricePerPack > row.standardPrice ? (
                                  <span className="text-amber-800 font-bold bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                                    افزایش: {(row.negotiatedPricePerPack - row.standardPrice).toLocaleString('fa-IR')} ت/پک
                                  </span>
                                ) : (
                                  <span className="text-stone-500 font-medium">
                                    برابر نرخ مصوب
                                  </span>
                                )}
                                {row.packSize > 0 && row.negotiatedPricePerPack > 0 && (
                                  <span className="text-stone-700 font-bold">
                                    عددی: {Math.round(row.negotiatedPricePerPack / row.packSize).toLocaleString('fa-IR')} ت
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 bg-white rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="text-stone-500 text-[10px]">نرخ مصوب هر پک:</span>
                                <strong className="text-stone-900 font-mono font-black text-xs">
                                  {row.standardPrice.toLocaleString('fa-IR')} تومان
                                </strong>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-stone-500 pt-0.5 border-t border-stone-100">
                                <span>نرخ هر عدد در پک:</span>
                                <span className="font-mono text-stone-700 font-bold">
                                  {row.packSize > 0 ? `${Math.round(row.standardPrice / row.packSize).toLocaleString('fa-IR')} ت` : '—'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleNegotiated(row.id, true)}
                                className="w-full mt-1 text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 py-0.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                <span>تعیین نرخ توافقی</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 4. Total Price & Delete (2 cols) */}
                        <div className="md:col-span-2 flex flex-col justify-between h-full pt-1 md:pt-0">
                          <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-left shadow-2xs">
                            <span className="text-[10px] text-stone-500 block font-medium">جمع ردیف:</span>
                            <strong className="text-xs sm:text-sm font-black text-stone-950 font-mono block tracking-tight">
                              {row.totalPrice.toLocaleString('fa-IR')} ت
                            </strong>
                            <span className="text-[9.5px] text-stone-500 font-mono block mt-0.5">
                              {toPersianDigits(row.packCount)} پک × {row.effectivePricePerPack.toLocaleString('fa-IR')}
                            </span>
                          </div>

                          <div className="flex items-center justify-end gap-1.5 mt-2">
                            {rows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(row.id)}
                                className="flex items-center gap-1 text-[10.5px] font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 px-2 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
                                title="حذف این ردیف کالا"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف ردیف</span>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 3: Payment Type, Discount, and Summary */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Payment Options (7 cols) */}
                <div className="md:col-span-7 bg-[#FAF7F2] p-4 rounded-2xl border border-[#DDD5C0] space-y-3">
                  <span className="font-bold text-stone-900 text-xs block">
                    شیوه تسویه حساب حضوری در فروشگاه / کارگاه:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                      paymentType === 'cash' 
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs' 
                        : 'bg-white border-stone-300 text-stone-700'
                    }`}>
                      <input 
                        type="radio" 
                        name="payType" 
                        checked={paymentType === 'cash'} 
                        onChange={() => setPaymentType('cash')}
                        className="text-emerald-600"
                      />
                      <span>کارتخوان / نقدی</span>
                    </label>

                    {/* 2. Card to Card Label (Targeted UI Element) */}
                    <label className={`relative p-3 rounded-2xl border-2 cursor-pointer flex flex-col justify-between gap-1.5 transition-all select-none ${
                      paymentType === 'split' 
                        ? 'bg-gradient-to-br from-amber-50 via-amber-100/40 to-white border-[#D4AF37] text-stone-900 shadow-md ring-2 ring-[#D4AF37]/30 scale-[1.01]' 
                        : 'bg-white border-stone-200 text-stone-700 hover:border-amber-300 hover:bg-stone-50/80 shadow-2xs'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                            paymentType === 'split' ? 'bg-[#D4AF37] text-stone-950 shadow-xs' : 'bg-stone-100 text-stone-600'
                          }`}>
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-black text-xs block leading-tight text-stone-900">کارت به کارت</span>
                            <span className="text-[10px] text-stone-500 block">شتاب / فیش واریز</span>
                          </div>
                        </div>
                        <input 
                          type="radio" 
                          name="payType" 
                          checked={paymentType === 'split'} 
                          onChange={() => setPaymentType('split')}
                          className="w-4 h-4 text-[#D4AF37] accent-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                        />
                      </div>
                      {paymentType === 'split' && (
                        <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[10px]">
                          <span className="text-amber-900 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                            سامانه شتاب فعال
                          </span>
                          <span className="bg-amber-200/80 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[9.5px]">
                            تایید فیش
                          </span>
                        </div>
                      )}
                    </label>

                    <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                      paymentType === 'check' 
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-2xs' 
                        : 'bg-white border-stone-300 text-stone-700'
                    }`}>
                      <input 
                        type="radio" 
                        name="payType" 
                        checked={paymentType === 'check'} 
                        onChange={() => setPaymentType('check')}
                        className="text-amber-600"
                      />
                      <span>چک صیادی</span>
                    </label>
                  </div>

                  {/* Comprehensive Card-to-Card Payment System */}
                  {paymentType === 'split' && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-amber-300/80 shadow-sm space-y-4 animate-in fade-in duration-200">
                      
                      {/* Notice Banner when Copied */}
                      {cardCopiedNotice && (
                        <div className="p-2.5 bg-emerald-500 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-between shadow-xs animate-in fade-in">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-stone-950" />
                            <span>{cardCopiedNotice}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setCardCopiedNotice(null)}
                            className="text-stone-900 hover:text-black p-0.5 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Header & Bank Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-200">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-stone-900 text-[#D4AF37] flex items-center justify-center font-bold">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-stone-900">
                              کارت‌های رسمی پوشاک «من و تو» (آقای اسدی)
                            </h4>
                            <p className="text-[10px] text-stone-500">
                              ارائه شماره کارت به خریدار جهت واریز شتابی، کارت به کارت یا پایا
                            </p>
                          </div>
                        </div>

                        {/* Company Bank Account Switcher Tabs */}
                        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                          {DESTINATION_CARDS.map((card, idx) => (
                            <button
                              key={card.id}
                              type="button"
                              onClick={() => setSelectedDestinationBankIndex(idx)}
                              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                                selectedDestinationBankIndex === idx 
                                  ? 'bg-stone-900 text-[#D4AF37] shadow-xs' 
                                  : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              {card.bankName}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Realistic ATM Debit Card Representation */}
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-950 via-[#1c1917] to-stone-900 border border-[#D4AF37]/50 p-4 sm:p-5 text-white shadow-xl">
                        {/* Decorative metallic background swirls */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-amber-500/10 to-transparent pointer-events-none -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-radial from-amber-400/5 to-transparent pointer-events-none -ml-12 -mb-12" />

                        {/* Card Top: Bank name and Shetab badge */}
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs sm:text-sm font-black tracking-wide text-amber-100">
                              {activeDestinationCard.bankName}
                            </span>
                            <span className="text-[9.5px] text-amber-300/80 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                              {activeDestinationCard.badge}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Contactless symbol */}
                            <svg className="w-4 h-4 text-amber-300/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M8.5 16.5a5 5 0 0 1 0-7" strokeLinecap="round" />
                              <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
                              <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                            </svg>
                            <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-black border border-[#D4AF37]/40 px-1.5 py-0.5 rounded">
                              SHETAB
                            </span>
                          </div>
                        </div>

                        {/* Card Middle: EMV Chip + 16 Digit Number */}
                        <div className="my-4 sm:my-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                          <div className="flex items-center gap-3">
                            {/* Realistic EMV Smart Chip */}
                            <div className="w-10 h-7 rounded bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-yellow-200 shadow-inner relative overflow-hidden flex items-center justify-center shrink-0">
                              <div className="absolute inset-y-0 w-[1px] bg-amber-800/40 left-1/3" />
                              <div className="absolute inset-y-0 w-[1px] bg-amber-800/40 right-1/3" />
                              <div className="absolute inset-x-0 h-[1px] bg-amber-800/40 top-1/2" />
                            </div>

                            {/* 16 Digit Card Number */}
                            <div className="font-mono text-base sm:text-xl font-black tracking-widest text-amber-50 drop-shadow-sm dir-ltr text-left">
                              {activeDestinationCard.cardNumber}
                            </div>
                          </div>

                          {/* Quick Card Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleCopyCardNumber(activeDestinationCard.cardNumber, activeDestinationCard.bankName)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-[11px] flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                              title="کپی شماره کارت ۱۶ رقمی بدون خط تیره"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>کپی کارت</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyShaba(activeDestinationCard.shaba, activeDestinationCard.bankName)}
                              className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-[11px] flex items-center gap-1 transition-all border border-stone-700 cursor-pointer"
                              title="کپی شماره شبا"
                            >
                              <span>شبا</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyFullAccountShare(activeDestinationCard)}
                              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 transition-all border border-stone-700 cursor-pointer"
                              title="کپی کل مشخصات جهت ارسال به خریدار در پیامک یا ایتا"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Card Bottom: Holder Name, Expiry, IBAN */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-2 border-t border-white/10 text-[10.5px] text-stone-300 relative z-10">
                          <div>
                            <span className="text-stone-400 text-[9.5px] block">صاحب حساب:</span>
                            <strong className="text-white font-black text-xs">
                              {activeDestinationCard.accountHolder}
                            </strong>
                          </div>

                          <div className="dir-ltr text-left">
                            <span className="text-stone-400 text-[9.5px] block">شماره شبا:</span>
                            <span className="font-mono text-amber-200 font-semibold text-[10px]">
                              {activeDestinationCard.shaba}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Deposit Input Form */}
                      <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#DDD5C0] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>ثبت مشخصات واریزی و فیش خریدار:</span>
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">
                            تایید لحظه‌ای تراکنش شتابی
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* 1. Tracking Reference Code */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-bold text-stone-700">
                                شماره پیگیری / کد ارجاع شتاب:
                              </label>
                              <button
                                type="button"
                                onClick={handleGenerateRandomTracking}
                                className="text-[9.5px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                              >
                                کد تستی
                              </button>
                            </div>
                            <input
                              type="text"
                              value={cardTrackingNumber}
                              onChange={(e) => setCardTrackingNumber(e.target.value)}
                              placeholder="مثال: ۸۴۹۲۱۰۳۴"
                              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs text-stone-900 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                            />
                          </div>

                          {/* 2. Source Card Last 4 Digits & Source Bank */}
                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              ۴ رقم آخر کارت و بانک مبدأ خریدار:
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                type="text"
                                maxLength={4}
                                value={sourceCardLast4}
                                onChange={(e) => setSourceCardLast4(e.target.value)}
                                placeholder="۴ رقم: ۸۸۲۲"
                                className="w-full bg-white px-2 py-2 rounded-xl border border-stone-300 font-mono text-center text-xs text-stone-900 outline-none focus:border-[#D4AF37]"
                              />
                              <select
                                value={sourceBankName}
                                onChange={(e) => setSourceBankName(e.target.value)}
                                className="w-full bg-white px-2 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 outline-none focus:border-[#D4AF37]"
                              >
                                {IRANIAN_BANKS.map((b) => (
                                  <option key={b} value={b}>{b}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* 3. Deposited Amount */}
                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              مبلغ واریزی این فیش (تومان):
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step={5000}
                                value={cardDepositAmount}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10) || 0);
                                  setCardDepositAmount(val);
                                }}
                                placeholder="مبلغ واریزی..."
                                className="w-full bg-white pr-3 pl-12 py-2 rounded-xl border border-stone-300 font-mono font-bold text-xs text-stone-900 outline-none focus:border-[#D4AF37]"
                              />
                              <span className="absolute left-3 top-2.5 text-[10px] text-stone-500 font-bold pointer-events-none">
                                تومان
                              </span>
                            </div>

                            {/* Quick Amount Suggestion Chips */}
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => setCardDepositAmount(finalAmountToman)}
                                className="text-[9.5px] font-bold bg-white hover:bg-stone-100 text-stone-800 px-2 py-0.5 rounded-lg border border-stone-300 cursor-pointer"
                              >
                                تسویه کل ({finalAmountToman.toLocaleString('fa-IR')} ت)
                              </button>
                              <button
                                type="button"
                                onClick={() => setCardDepositAmount(Math.round(finalAmountToman / 2))}
                                className="text-[9.5px] font-bold bg-white hover:bg-stone-100 text-stone-800 px-2 py-0.5 rounded-lg border border-stone-300 cursor-pointer"
                              >
                                ۵۰٪ بیعانه
                              </button>
                            </div>
                          </div>

                          {/* 4. Date & Time */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-bold text-stone-700">
                                تاریخ و ساعت تراکنش:
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  try {
                                    const now = new Intl.DateTimeFormat('fa-IR', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }).format(new Date());
                                    setCardDepositDate(now);
                                  } catch (e) {
                                    setCardDepositDate(getTodayPersianDate());
                                  }
                                }}
                                className="text-[9.5px] font-bold text-stone-600 hover:text-stone-900 underline cursor-pointer"
                              >
                                هم‌اکنون
                              </button>
                            </div>
                            <input
                              type="text"
                              value={cardDepositDate}
                              onChange={(e) => setCardDepositDate(e.target.value)}
                              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs text-stone-900 outline-none"
                            />
                          </div>
                        </div>

                        {/* Receipt Slip Attachment (Upload / Sample) */}
                        <div className="pt-2 border-t border-stone-200">
                          <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                            پیوست تصویر فیش بانکی / رسید اسکرین‌شات:
                          </label>

                          {cardReceiptImage ? (
                            <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-center justify-between gap-3 shadow-2xs">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={cardReceiptImage}
                                  alt="رسید واریز"
                                  className="w-14 h-14 object-cover rounded-lg border border-stone-200 cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => setZoomReceiptUrl(cardReceiptImage)}
                                  title="کلیک برای مشاهده بزرگتر"
                                />
                                <div className="truncate">
                                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    تصویر رسید پیوست گردید
                                  </span>
                                  <span className="text-[10.5px] text-stone-500 block truncate">
                                    {cardTrackingNumber ? `کد رهگیری: ${cardTrackingNumber}` : 'آماده ثبت در فاکتور'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setZoomReceiptUrl(cardReceiptImage)}
                                  className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10.5px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <ZoomIn className="w-3.5 h-3.5" />
                                  <span>بزرگنمایی</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCardReceiptImage(null)}
                                  className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10.5px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                              <label className="w-full sm:flex-1 border-2 border-dashed border-stone-300 hover:border-[#D4AF37] bg-white p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors group">
                                <UploadCloud className="w-4 h-4 text-stone-400 group-hover:text-[#D4AF37]" />
                                <span className="text-[11px] font-bold text-stone-600 group-hover:text-stone-900">
                                  انتخاب فایل عکس رسید (PNG, JPG)
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleReceiptFileUpload}
                                  className="hidden"
                                />
                              </label>

                              <button
                                type="button"
                                onClick={handleLoadDemoReceipt}
                                className="w-full sm:w-auto px-3 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[11px] border border-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
                                title="بارگذاری خودکار یک فیش نمونه شتاب جهت تست سریع"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                                <span>فیش نمونه تستی</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Multi-Slip Toggle (Wholesale limits in Iran) */}
                        <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (!isMultiSlip) {
                                setIsMultiSlip(true);
                                if (additionalSlips.length === 0) handleAddSlip();
                              } else {
                                setIsMultiSlip(false);
                              }
                            }}
                            className="text-[11px] font-bold text-stone-800 flex items-center gap-1.5 hover:text-amber-800 transition-colors cursor-pointer self-start"
                          >
                            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>
                              {isMultiSlip ? 'بستن حالت چند فیشی' : '+ ثبت چند فیش واریزی (به دلیل سقف شتاب)'}
                            </span>
                          </button>

                          {/* Real-time settlement balance badge */}
                          <div className="text-[11px]">
                            {cardBalanceDifference === 0 ? (
                              <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-700" />
                                تسویه کامل فاکتور انجام شد
                              </span>
                            ) : cardBalanceDifference > 0 ? (
                              <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                                کسری مانده: {cardBalanceDifference.toLocaleString('fa-IR')} تومان
                              </span>
                            ) : (
                              <span className="font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-300">
                                اضافه واریزی: {Math.abs(cardBalanceDifference).toLocaleString('fa-IR')} تومان
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Additional Slips Container */}
                        {isMultiSlip && (
                          <div className="space-y-2 pt-2 border-t border-stone-200">
                            <span className="text-[10.5px] font-bold text-stone-700 block">
                              فیش‌های اضافی شتاب (سقف روزانه انتقال):
                            </span>
                            {additionalSlips.map((slip, sIdx) => (
                              <div key={slip.id} className="p-2.5 bg-white rounded-xl border border-stone-300 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-xs">
                                <span className="font-bold text-stone-800 text-[11px]">
                                  فیش شماره {toPersianDigits(sIdx + 2)}:
                                </span>
                                <input
                                  type="text"
                                  placeholder="کد پیگیری شتاب..."
                                  value={slip.trackingNumber}
                                  onChange={(e) => handleUpdateSlip(slip.id, { trackingNumber: e.target.value })}
                                  className="bg-stone-50 p-1.5 rounded-lg border border-stone-300 font-mono text-[11px]"
                                />
                                <input
                                  type="number"
                                  placeholder="مبلغ به تومان..."
                                  value={slip.amountToman || ''}
                                  onChange={(e) => handleUpdateSlip(slip.id, { amountToman: Number(e.target.value) || 0 })}
                                  className="bg-stone-50 p-1.5 rounded-lg border border-stone-300 font-mono text-[11px]"
                                />
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSlip(slip.id)}
                                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                                    title="حذف این فیش"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={handleAddSlip}
                              className="text-[10px] font-bold text-[#8C6D37] hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>افزودن یک فیش دیگر</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {paymentType === 'check' && (
                    <div className="pt-2">
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        مشخصات چک صیادی (شماره صیاد، بانک و تاریخ سررسید):
                      </label>
                      <input
                        type="text"
                        value={checkDetails}
                        onChange={(e) => setCheckDetails(e.target.value)}
                        placeholder="مثال: چک صیادی بنفش بانک ملت - ۳۰ روزه - شناسه صیاد ۱۶ رقمی"
                        className="w-full bg-white p-2 rounded-xl border border-amber-300 font-mono text-xs text-stone-900 outline-none"
                      />
                    </div>
                  )}

                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      کسر تخفیف کلی فاکتور (تومان):
                    </label>
                    <input
                      type="number"
                      step={5000}
                      value={discountAmount || ''}
                      onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="۰ تومان"
                      className="w-full bg-white p-2 rounded-xl border border-[#DDD5C0] font-mono text-xs text-stone-900 outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      یادداشت و هماهنگی‌های فاکتور:
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="توضیحات و توافقات انجام‌شده با خریدار..."
                      className="w-full bg-white p-2 rounded-xl border border-[#DDD5C0] text-xs text-stone-900 outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Final Calculations & Words (5 cols) */}
                <div className="md:col-span-5 bg-gradient-to-br from-[#18181B] to-[#27272A] text-white p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-lg border border-stone-800">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-700">
                      <span className="text-xs text-stone-400 font-bold">خلاصه اقلام فاکتور:</span>
                      <span className="text-xs text-[#D4AF37] font-black">
                        {totalPacksCount} پک ({totalUnitsCount} عدد)
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-stone-300">
                      <span>جمع ناخالص:</span>
                      <span className="font-mono">{subtotalToman.toLocaleString('fa-IR')} ت</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-xs text-rose-300">
                        <span>کسر تخفیف:</span>
                        <span className="font-mono">- {discountAmount.toLocaleString('fa-IR')} ت</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-700 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-stone-300">مبلغ نهایی فاکتور:</span>
                        <div className="text-lg font-black text-[#D4AF37] font-mono">
                          {finalAmountToman.toLocaleString('fa-IR')}{' '}
                          <span className="text-xs font-normal text-stone-300">تومان</span>
                        </div>
                      </div>

                      {/* In Words */}
                      <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-[11px] text-stone-200 leading-relaxed font-sans mt-2">
                        <span className="text-[10px] text-[#D4AF37] block mb-0.5">مبلغ به حروف:</span>
                        {numberToPersianWords(finalAmountToman)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#c49f2b] active:scale-[0.98] text-stone-950 font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-stone-950" />
                    <span>صدور و تحویل فاکتور رسمی حضوری</span>
                  </button>
                </div>

              </div>

            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: FORMAL OFFICIAL IN-PERSON INVOICE SHEET               */}
        {/* ------------------------------------------------------------- */}
        {activeStep === 'sheet' && currentInvoice && (
          <div className="flex-1 flex flex-col min-h-0 text-xs bg-stone-100">
            
            {/* Top Toolbar (Hidden on print) */}
            <div className="p-3 sm:p-4 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-stone-950 flex items-center justify-center font-black shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-[#FAF7F2]">
                    فاکتور رسمی حضوری صادر شد • شماره {currentInvoice.invoiceNumber}
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    قالب‌بندی استاندارد چاپی A4 با سربرگ «تولید و پخش پوشاک من و تو»
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Print Direct */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2 px-4 bg-[#D4AF37] hover:bg-[#c49f2b] text-stone-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Printer className="w-4 h-4 text-stone-950" />
                  <span>چاپ با پرینتر (A4)</span>
                </button>

                {/* Download Offline HTML */}
                <button
                  type="button"
                  onClick={handleDownloadInvoiceFile}
                  className="py-2 px-3.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs rounded-xl transition-all border border-stone-600 flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="ذخیره فایل HTML مستقل برای چاپ بعدی بدون نیاز به اینترنت"
                >
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>دانلود فایل چاپی</span>
                </button>

                {/* Copy Text */}
                <button
                  type="button"
                  onClick={handleCopyInvoiceText}
                  className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl transition-all border border-stone-600 flex items-center gap-1 cursor-pointer"
                  title="کپی متن خلاصه فاکتور برای پیامک یا پیام‌رسان"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-stone-400" />
                      <span>کپی متن</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable Printable Document Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 print:p-0 print:overflow-visible">
              
              <div 
                id="formal-inperson-invoice-document"
                className="printable-formal-invoice bg-white text-stone-900 rounded-2xl border-2 border-stone-800 p-6 sm:p-8 max-w-3xl mx-auto shadow-md font-sans print:border-none print:shadow-none print:max-w-none print:p-2"
              >
                
                {/* 1. Official Header */}
                <div className="border-b-2 border-stone-800 pb-4 mb-4">
                  <div className="grid grid-cols-3 items-center">
                    
                    {/* Left Meta */}
                    <div className="text-right text-xs space-y-1 text-stone-700">
                      <div>
                        <span className="font-semibold text-stone-900">شماره فاکتور:</span>{' '}
                        <span className="font-mono font-bold text-stone-950 text-sm">{currentInvoice.invoiceNumber}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900">تاریخ صدور:</span>{' '}
                        <span className="font-mono font-bold">{currentInvoice.date}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900">نوع سفارش:</span>{' '}
                        <span className="font-bold text-[#8C6D37]">خرید و تحویل حضوری در بازار</span>
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900">وضعیت تسویه:</span>{' '}
                        <span className="font-bold text-emerald-800">
                          {currentInvoice.paymentType === 'cash' 
                            ? '✓ تسویه نقدی / پوز فروشگاه' 
                            : currentInvoice.paymentType === 'split'
                            ? `✓ تسویه کارت به کارت (${currentInvoice.cardPaymentDetails?.destinationBank || 'بانک ملت'})`
                            : 'چک صیادی مدت‌دار'}
                        </span>
                      </div>
                    </div>

                    {/* Center Brand Title */}
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

                    {/* Right Logo */}
                    <div className="text-left flex flex-col items-end justify-center">
                      <div className="w-16 h-16 border-2 border-stone-800 rounded-xl flex flex-col items-center justify-center bg-stone-50 text-stone-900 p-1">
                        <span className="text-[9px] font-extrabold uppercase tracking-tighter">MANOTO</span>
                        <span className="text-[14px] font-black leading-none text-[#8C6D37]">M&T</span>
                        <span className="text-[8px] font-medium text-stone-600">DRESS</span>
                      </div>
                      <span className="text-[9px] text-stone-500 mt-1">نسخهٔ رسمی خریدار و انبار</span>
                    </div>

                  </div>
                </div>

                {/* 2. Seller and Buyer Section */}
                <div className="space-y-3 text-xs mb-4">
                  {/* Seller */}
                  <div className="border border-stone-800 rounded-lg overflow-hidden">
                    <div className="bg-stone-100 px-3 py-1.5 font-bold border-b border-stone-800 text-stone-900 flex items-center justify-between">
                      <span>الف) مشخصات فروشنده (تولیدی و بنکداری مبدأ)</span>
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
                        <span className="text-stone-500">همراه مدیریت:</span>{' '}
                        <span className="font-mono text-stone-900">09121966144</span>
                      </div>
                      <div className="sm:col-span-3 pt-1 border-t border-stone-200">
                        <span className="text-stone-500">نشانی کارگاه و دفتر پخش:</span>{' '}
                        <span className="text-stone-800">
                          تهران، بازار بزرگ، بازار عباس‌آباد (سرای ملی)، پاساژ المهدی ۴، طبقه منفی یک (زیرزمین اول)، پلاک ۲۴۲
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buyer */}
                  <div className="border border-stone-800 rounded-lg overflow-hidden">
                    <div className="bg-stone-100 px-3 py-1.5 font-bold border-b border-stone-800 text-stone-900 flex items-center justify-between">
                      <span>ب) مشخصات خریدار (تحویل حضوری در فروشگاه / کارگاه)</span>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        تحویل حضوری در بازار تهران
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white">
                      <div>
                        <span className="text-stone-500">نام و نام خانوادگی خریدار:</span>{' '}
                        <strong className="text-stone-900 text-sm">{currentInvoice.customerName}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500">شماره همراه:</span>{' '}
                        <span className="font-mono font-bold text-stone-900">{currentInvoice.phone}</span>
                      </div>
                      <div>
                        <span className="text-stone-500">فروشگاه / شهر:</span>{' '}
                        <strong className="text-stone-900">{currentInvoice.storeName} ({currentInvoice.city})</strong>
                      </div>
                      {currentInvoice.notes && (
                        <div className="sm:col-span-3 pt-1 border-t border-stone-200 text-stone-600">
                          <span className="text-stone-500">یادداشت تحویل:</span>{' '}
                          <span>{currentInvoice.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Items Table */}
                <div className="border border-stone-800 rounded-lg overflow-hidden mb-4">
                  <div className="bg-stone-100 px-3 py-1.5 font-bold border-b border-stone-800 text-stone-900 text-xs">
                    ج) مشخصات اقلام و کالاهای مورد معامله
                  </div>
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-stone-50 text-stone-900 border-b border-stone-800 font-bold">
                        <th className="py-2 px-2 text-center border-l border-stone-300 w-10">ردیف</th>
                        <th className="py-2 px-3 border-l border-stone-300">شرح کالا و مدل</th>
                        <th className="py-2 px-2 text-center border-l border-stone-300 w-16">تعداد پک</th>
                        <th className="py-2 px-2 text-center border-l border-stone-300 w-20">تعداد کل</th>
                        <th className="py-2 px-3 text-left border-l border-stone-300">نرخ هر پک (تومان)</th>
                        <th className="py-2 px-3 text-left">مبلغ کل (تومان)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-300">
                      {currentInvoice.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50">
                          <td className="py-2 px-2 text-center border-l border-stone-300 font-mono">
                            {(idx + 1).toLocaleString('fa-IR')}
                          </td>
                          <td className="py-2 px-3 border-l border-stone-300">
                            <span className="font-bold text-stone-950">{it.productName}</span>
                            <span className="text-[10px] text-stone-500 mr-1.5 font-mono">({it.sku})</span>
                            {it.isNegotiatedPrice && (
                              <span className="mr-1.5 text-[9px] font-bold text-amber-800 bg-amber-100 px-1 py-0.2 rounded border border-amber-300">
                                نرخ توافقی
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-center border-l border-stone-300 font-bold font-mono">
                            {it.packCount.toLocaleString('fa-IR')}
                          </td>
                          <td className="py-2 px-2 text-center border-l border-stone-300 font-mono text-stone-700">
                            {it.totalUnits.toLocaleString('fa-IR')} عدد
                          </td>
                          <td className="py-2 px-3 text-left border-l border-stone-300 font-mono">
                            {it.pricePerPack.toLocaleString('fa-IR')}
                          </td>
                          <td className="py-2 px-3 text-left font-mono font-bold text-stone-950">
                            {it.totalPrice.toLocaleString('fa-IR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 4. Totals and Words */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-stone-800 rounded-lg p-3.5 bg-stone-50 text-xs mb-4">
                  {/* Words */}
                  <div className="space-y-1.5 flex flex-col justify-center">
                    <div className="text-stone-600 font-medium">مبلغ نهایی قابل پرداخت به حروف:</div>
                    <div className="text-stone-950 font-bold text-sm bg-white p-2.5 rounded border border-stone-300 leading-relaxed">
                      {numberToPersianWords(currentInvoice.finalAmountToman)}
                    </div>
                    <div className="text-[11px] text-stone-600 pt-1">
                      روش تسویه:{' '}
                      {currentInvoice.paymentType === 'cash' ? (
                        <strong className="text-stone-900">نقدی / دستگاه کارتخوان (POS)</strong>
                      ) : currentInvoice.paymentType === 'split' ? (
                        <div className="space-y-1">
                          <span className="text-emerald-800 font-bold block">
                            ✓ کارت به کارت شتابی ({currentInvoice.cardPaymentDetails?.destinationBank || 'بانک ملت'} - کد رهگیری:{' '}
                            <span className="font-mono text-stone-900">{currentInvoice.cardPaymentDetails?.trackingNumber || 'ثبت شده'}</span>
                            {currentInvoice.cardPaymentDetails?.sourceCardLast4 ? ` - کارت مبدأ: ${currentInvoice.cardPaymentDetails.sourceCardLast4}` : ''})
                          </span>
                          {currentInvoice.cardPaymentDetails?.receiptImage && (
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[10px] text-stone-500">تصویر فیش پیوست:</span>
                              <img 
                                src={currentInvoice.cardPaymentDetails.receiptImage} 
                                alt="رسید" 
                                className="w-10 h-10 object-cover rounded border border-stone-300 cursor-pointer hover:opacity-80"
                                onClick={() => setZoomReceiptUrl(currentInvoice.cardPaymentDetails?.receiptImage || null)}
                                title="مشاهده فیش"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <strong className="text-amber-800">چک صیادی ({currentInvoice.checkDetails || 'مدت‌دار'})</strong>
                      )}
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-1.5 border-t sm:border-t-0 sm:border-r border-stone-300 sm:pr-4 pt-2 sm:pt-0">
                    <div className="flex justify-between text-stone-700">
                      <span>جمع ناخالص اقلام فاکتور:</span>
                      <span className="font-mono font-semibold">{currentInvoice.subtotalToman.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    {currentInvoice.discountToman > 0 && (
                      <div className="flex justify-between text-rose-700">
                        <span>کسر تخفیف توافقی:</span>
                        <span className="font-mono font-semibold">- {currentInvoice.discountToman.toLocaleString('fa-IR')} تومان</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-700">
                      <span>هزینه خدمات و ارسال:</span>
                      <span className="font-bold text-emerald-800">تحویل حضوری در محل کارگاه (رایگان)</span>
                    </div>
                    <div className="flex justify-between text-stone-950 font-black text-sm pt-2 border-t-2 border-stone-800">
                      <span>مبلغ کل و نهایی فاکتور:</span>
                      <span className="font-mono text-base">{currentInvoice.finalAmountToman.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>
                </div>

                {/* 5. Terms & Signatures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Terms */}
                  <div className="border border-stone-300 rounded-lg p-3 bg-white space-y-1">
                    <span className="font-bold text-stone-900 block">شرایط و تعهدات خرید حضوری:</span>
                    <ul className="list-disc list-inside text-[11px] text-stone-600 space-y-0.5 leading-relaxed">
                      <li>کلیه اقلام در حضور خریدار یا نمایندهٔ ایشان در محل کارگاه شمارش و بازبینی کیفی گردید.</li>
                      <li>تولید و پخش من و تو سلامت پارچه، الگوسازی دقیق و تن‌خور استاندارد تمامی اقلام را تضمین می‌نماید.</li>
                    </ul>
                  </div>

                  {/* Signatures & Seal */}
                  <div className="border border-stone-800 rounded-lg p-3 bg-white flex items-center justify-around text-center">
                    <div className="space-y-6">
                      <span className="font-bold text-stone-700 block text-[11px]">مهر و امضای خریدار:</span>
                      <div className="text-[10px] text-stone-400">امضا و تحویل کالا</div>
                    </div>

                    <div className="relative flex flex-col items-center justify-center p-1">
                      <div className="w-28 h-20 border-2 border-dashed border-[#8C6D37] rounded-xl flex flex-col items-center justify-center text-[#8C6D37] bg-amber-50/40 transform -rotate-3 select-none">
                        <span className="text-[9px] font-black">پوشاک زنانه «من و تو»</span>
                        <span className="text-[11px] font-extrabold my-0.5">تولید و پخش من و تو</span>
                        <span className="text-[8px] font-semibold text-stone-700">مدیریت: اسدی - بازار تهران</span>
                        <span className="text-[8px] text-emerald-700 font-bold mt-0.5">✓ تسویه و تحویل شد</span>
                      </div>
                      <span className="text-[10px] text-stone-500 mt-1 font-medium">مهر رسمی تولیدی و انبار</span>
                    </div>
                  </div>
                </div>

                {/* 6. Bottom Address Bar */}
                <div className="mt-4 pt-3 border-t border-stone-300 text-center text-[10px] text-stone-500">
                  تهران، بازار بزرگ، بازار عباس‌آباد (سرای ملی)، پاساژ المهدی ۴، طبقه منفی یک، پلاک ۲۴۲ • تلفن دفتر فروش: ۵۵۶۶۷۷۸۸-۰۲۱
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Receipt Image Zoom Modal */}
        {zoomReceiptUrl && (
          <div 
            className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
            onClick={() => setZoomReceiptUrl(null)}
          >
            <div 
              className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-5 relative shadow-2xl space-y-3 animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="font-black text-sm text-stone-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>تصویر فیش واریز کارت به کارت شتاب</span>
                </span>
                <button
                  type="button"
                  onClick={() => setZoomReceiptUrl(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[68vh] overflow-auto flex items-center justify-center bg-stone-50 rounded-2xl p-2 border border-stone-200 shadow-inner">
                <img 
                  src={zoomReceiptUrl} 
                  alt="رسید واریز" 
                  className="max-w-full max-h-[64vh] object-contain rounded-xl shadow-sm"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-stone-500 pt-1">
                <span>تایید شده توسط سامانه شاپرک / شتاب</span>
                <button
                  type="button"
                  onClick={() => setZoomReceiptUrl(null)}
                  className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl font-bold cursor-pointer transition-colors text-xs"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
