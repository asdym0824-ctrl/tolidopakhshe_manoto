import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  UserPlus, 
  User, 
  Check, 
  X, 
  Phone, 
  Store, 
  MapPin, 
  Sparkles, 
  Clock, 
  History,
  Building2,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { Customer, Invoice } from '../../types';
import { toPersianDigits } from '../../utils/persianWriting';

export interface MergedCustomer {
  id: string;
  name: string;
  phone: string;
  storeName?: string;
  city?: string;
  orderCount?: number;
  totalPurchasesToman?: number;
  lastPurchaseDate?: string;
  isFromPastInvoice?: boolean;
}

interface CustomerSearchPickerProps {
  customers: Customer[];
  invoices?: Invoice[];
  selectedCustomerId?: string;
  onSelectCustomer: (cust: MergedCustomer) => void;
  onNewCustomer: () => void;
  isNewCustomerMode?: boolean;
}

export const CustomerSearchPicker: React.FC<CustomerSearchPickerProps> = ({
  customers = [],
  invoices = [],
  selectedCustomerId = '',
  onSelectCustomer,
  onNewCustomer,
  isNewCustomerMode = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine and deduplicate customers from both CRM database and all past invoices
  const allAvailableCustomers = useMemo(() => {
    const map = new Map<string, MergedCustomer>();

    // 1. Add CRM customers
    customers.forEach(c => {
      const key = (c.phone?.trim() || c.name?.trim().toLowerCase()) || c.id;
      map.set(key, {
        id: c.id,
        name: c.name,
        phone: c.phone,
        storeName: c.storeName,
        city: c.city,
        orderCount: c.orderCount || 1,
        totalPurchasesToman: c.totalPurchasesToman || 0,
        lastPurchaseDate: c.lastOrderDate,
        isFromPastInvoice: false
      });
    });

    // 2. Add any past invoice customers not yet explicitly in CRM
    invoices.forEach(inv => {
      if (!inv.customerName) return;
      const key = (inv.phone?.trim() || inv.customerName.trim().toLowerCase());
      if (!map.has(key)) {
        map.set(key, {
          id: inv.customerId || `cust-inv-${inv.id}`,
          name: inv.customerName,
          phone: inv.phone || '',
          storeName: inv.storeName,
          city: inv.city,
          orderCount: 1,
          totalPurchasesToman: inv.finalAmountToman,
          lastPurchaseDate: inv.date,
          isFromPastInvoice: true
        });
      } else {
        // Enhance existing customer with past invoice data if needed
        const existing = map.get(key)!;
        if (!existing.lastPurchaseDate && inv.date) {
          existing.lastPurchaseDate = inv.date;
        }
      }
    });

    return Array.from(map.values());
  }, [customers, invoices]);

  // Find currently selected customer
  const currentSelected = useMemo(() => {
    if (!selectedCustomerId) return null;
    return allAvailableCustomers.find(c => c.id === selectedCustomerId) || null;
  }, [allAvailableCustomers, selectedCustomerId]);

  // Filter customers according to search term (by name, phone, storeName, city)
  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allAvailableCustomers;

    return allAvailableCustomers.filter(c => {
      const nameMatch = c.name?.toLowerCase().includes(term);
      const phoneMatch = c.phone?.toLowerCase().includes(term);
      const storeMatch = c.storeName?.toLowerCase().includes(term);
      const cityMatch = c.city?.toLowerCase().includes(term);
      return nameMatch || phoneMatch || storeMatch || cityMatch;
    });
  }, [allAvailableCustomers, searchTerm]);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleOpenSearch = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handlePickCustomer = (cust: MergedCustomer) => {
    onSelectCustomer(cust);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handlePickNewCustomer = () => {
    onNewCustomer();
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center gap-1.5 flex-wrap">
      {/* Search & Select Trigger Button */}
      <button
        type="button"
        onClick={handleOpenSearch}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
          !isNewCustomerMode && currentSelected
            ? 'bg-[#18181B] text-[#D4AF37] border-stone-800 hover:border-[#D4AF37]'
            : 'bg-white text-stone-700 border-[#DDD5C0] hover:border-[#D4AF37] hover:bg-[#FAF7F2]'
        }`}
        title="جستجو و انتخاب از میان مشتریان دیتابیس و فاکتورهای قبلی"
      >
        <Search className="w-3.5 h-3.5 text-[#8C6D37]" />
        <span>
          {!isNewCustomerMode && currentSelected 
            ? `${currentSelected.name} (${currentSelected.storeName || currentSelected.phone})`
            : 'جستجوی نام یا تلفن مشتری...'}
        </span>
        <ChevronDown className="w-3 h-3 text-stone-400" />
      </button>

      {/* Dedicated "خریدار جدید" (New Customer) Icon Button */}
      <button
        type="button"
        onClick={handlePickNewCustomer}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
          isNewCustomerMode
            ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400/30'
            : 'bg-white text-stone-700 hover:text-stone-900 border border-[#DDD5C0] hover:border-amber-400 hover:bg-amber-50'
        }`}
        title="خریدار جدید (پاک‌کردن فرم جهت صدور فاکتور برای مشتری تازه و ثبت خودکار در دیتابیس)"
      >
        <UserPlus className="w-3.5 h-3.5 text-amber-700" />
        <span>خریدار جدید</span>
        {isNewCustomerMode && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        )}
      </button>

      {/* Floating Search & Auto-complete Dropdown */}
      {isOpen && (
        <div 
          className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#DDD5C0] p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
          dir="rtl"
        >
          {/* Top Search Input */}
          <div className="relative mb-2.5">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="تایپ نام، شماره موبایل، فروشگاه یا شهر مشتری..."
              className="w-full bg-[#FAF7F2] text-stone-900 text-xs font-medium pl-8 pr-8 py-2 rounded-xl border border-[#DDD5C0] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute left-2.5 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* New Customer Quick Action inside Dropdown */}
          <button
            type="button"
            onClick={handlePickNewCustomer}
            className="w-full mb-2 p-2 rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-stone-50 border border-amber-200 hover:border-amber-400 text-stone-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="text-right">
                <div className="text-stone-900 font-black">+ ثبت خریدار جدید (ورود دستی مشخصات)</div>
                <div className="text-[10px] text-stone-500 font-normal">اطلاعات این خریدار با ثبت فاکتور خودکار در دیتابیس ذخیره می‌شود</div>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          </button>

          {/* Customers List Header */}
          <div className="flex items-center justify-between px-1 py-1 text-[10px] text-stone-500 border-b border-stone-100 mb-1">
            <span>مشتریان قبلی ({toPersianDigits(filteredCustomers.length)} مورد):</span>
            <span>برای پر شدن خودکار کلیک کنید</span>
          </div>

          {/* Customers Scrollable List */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 custom-scrollbar pr-0.5">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-6 text-stone-400 text-xs">
                مشتری با این مشخصات در دیتابیس یافت نشد.
                <button
                  type="button"
                  onClick={handlePickNewCustomer}
                  className="block mx-auto mt-2 text-amber-700 hover:underline font-bold text-[11px] cursor-pointer"
                >
                  ثبت به‌عنوان خریدار جدید
                </button>
              </div>
            ) : (
              filteredCustomers.map(cust => {
                const isSelected = selectedCustomerId === cust.id;
                return (
                  <button
                    key={cust.id}
                    type="button"
                    onClick={() => handlePickCustomer(cust)}
                    className={`w-full text-right p-2 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white hover:bg-amber-50/60 border-stone-100 hover:border-amber-200 text-stone-800'
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                        isSelected 
                          ? 'bg-[#D4AF37] text-stone-950' 
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {cust.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold flex items-center gap-1.5 flex-wrap">
                          <span className={isSelected ? 'text-white' : 'text-stone-900'}>
                            {cust.name}
                          </span>
                          {cust.isFromPastInvoice && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                              فاکتور قبلی
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] mt-0.5 flex-wrap text-stone-500">
                          {cust.phone && (
                            <span className="flex items-center gap-0.5 font-mono dir-ltr">
                              <Phone className="w-2.5 h-2.5 opacity-70" />
                              {toPersianDigits(cust.phone)}
                            </span>
                          )}
                          {cust.storeName && (
                            <span className="flex items-center gap-0.5 truncate max-w-[120px]">
                              <Store className="w-2.5 h-2.5 opacity-70" />
                              {cust.storeName}
                            </span>
                          )}
                          {cust.city && (
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5 opacity-70" />
                              {cust.city}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      ) : (
                        cust.orderCount && cust.orderCount > 1 && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-lg">
                            {toPersianDigits(cust.orderCount)} فاکتور
                          </span>
                        )
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
