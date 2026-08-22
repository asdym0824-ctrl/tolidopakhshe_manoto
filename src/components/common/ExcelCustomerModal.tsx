import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Trash2, 
  Users, 
  Info,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Customer, CustomerTier, CustomerType, PaymentTerms } from '../../types';

interface ExcelCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCustomers: (importedList: Customer[]) => void;
  existingCustomers: Customer[];
}

export const ExcelCustomerModal: React.FC<ExcelCustomerModalProps> = ({
  isOpen,
  onClose,
  onImportCustomers,
  existingCustomers,
}) => {
  const [parsedRows, setParsedRows] = useState<Customer[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process Excel / CSV file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          setErrorMsg('فایل اکسل انتخاب شده خالی است یا قالبی نامعتبر دارد.');
          setIsProcessing(false);
          return;
        }

        const now = new Date();
        const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

        const converted: Customer[] = rawJson.map((row, idx) => {
          // Normalize column keys
          const name = row['نام'] || row['نام مشتری'] || row['نام و نام خانوادگی'] || row['Name'] || row['name'] || `مشتری اکسل ${idx + 1}`;
          const storeName = row['نام فروشگاه'] || row['فروشگاه'] || row['بوتیک'] || row['Store'] || row['store'] || `بوتیک ${name}`;
          let phone = String(row['موبایل'] || row['شماره تماس'] || row['تلفن'] || row['Phone'] || row['phone'] || '').trim();
          
          if (phone && !phone.startsWith('0') && phone.length === 10) {
            phone = '0' + phone;
          }
          if (!phone || phone.length < 7) {
            phone = `09${Math.floor(100000000 + Math.random() * 900000000)}`;
          }

          const city = row['شهر'] || row['City'] || row['city'] || 'تهران';
          const province = row['استان'] || row['Province'] || row['province'] || city;
          const trustScore = Number(row['امتیاز اعتبار'] || row['اعتبار']) || 80;
          const checkLimit = Number(row['سقف چک'] || row['اعتبار چک'] || row['Check Limit']) || 0;
          const notes = row['یادداشت'] || row['توضیحات'] || row['Notes'] || 'ثبت شده از طریق فایل اکسل';
          const channelSource = (row['کانال'] || row['منبع'] || 'telegram').toLowerCase().includes('insta') ? 'instagram' : 'telegram';

          return {
            id: `cust-xl-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
            name: String(name).trim(),
            storeName: String(storeName).trim(),
            phone: phone,
            city: String(city).trim(),
            province: String(province).trim(),
            type: 'shop_keeper' as CustomerType,
            tier: 'tier_wholesale_1' as CustomerTier,
            trustScore: trustScore,
            paymentTerms: checkLimit > 0 ? ('check_eligible' as PaymentTerms) : ('cash_only' as PaymentTerms),
            checkLimitToman: checkLimit,
            currentActiveCheckToman: 0,
            totalPurchasesToman: 0,
            orderCount: 0,
            lastOrderDate: 'فاقد سفارش',
            lastContactDate: 'امروز (ورود از اکسل)',
            channelSource: channelSource as any,
            preferredShipping: 'باربری وطن',
            tags: ['ورود_اکسل', 'مشتری_جدید'],
            notes: String(notes).trim(),
          };
        });

        setParsedRows(converted);
        setIsProcessing(false);
      } catch (err: any) {
        console.error(err);
        setErrorMsg('خطا در خواندن فایل اکسل. لطفاً از فرمت استاندارد .xlsx یا .csv استفاده نمایید.');
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Download Sample Excel Template
  const handleDownloadSample = () => {
    const sampleData = [
      {
        'نام': 'محمدرضا کاظمی',
        'نام فروشگاه': 'بوتیک رُز',
        'شماره تماس': '09121234567',
        'شهر': 'اصفهان',
        'استان': 'اصفهان',
        'سقف چک': 30000000,
        'امتیاز اعتبار': 90,
        'منبع': 'تلگرام',
        'یادداشت': 'خریدار عمده شلوار بگ و جاگر تابستانه'
      },
      {
        'نام': 'سمیرا نوری',
        'نام فروشگاه': 'پوشاک شیک‌پوشان',
        'شماره تماس': '09359876543',
        'شهر': 'شیراز',
        'استان': 'فارس',
        'سقف چک': 0,
        'امتیاز اعتبار': 75,
        'منبع': 'اینستاگرام',
        'یادداشت': 'خرید نقدی پک‌های ۱۲ تایی راحتی'
      },
      {
        'نام': 'حاج اصغر کریمی',
        'نام فروشگاه': 'ارزان‌سرای کریمی',
        'شماره تماس': '09135554433',
        'شهر': 'مشهد',
        'استان': 'خراسان رضوی',
        'سقف چک': 50000000,
        'امتیاز اعتبار': 95,
        'منبع': 'حضوری بازار',
        'یادداشت': 'مشتری قدیمی بازار بزرگ تهران، ارسال با باربری وطن'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'مشتریان');
    XLSX.writeFile(workbook, 'قالب_نمونه_اکسل_مشتریان_پوشاک_من_و_تو.xlsx');
  };

  // Export current customers database to XLSX
  const handleExportCurrent = () => {
    const exportData = existingCustomers.map((c, i) => ({
      'ردیف': i + 1,
      'نام مشتری': c.name,
      'فروشگاه / بوتیک': c.storeName,
      'شماره تماس': c.phone,
      'استان': c.province,
      'شهر': c.city,
      'سقف چک (تومان)': c.checkLimitToman,
      'امتیاز اعتبار': c.trustScore,
      'تعداد سفارش': c.orderCount,
      'مجموع خرید (تومان)': c.totalPurchasesToman,
      'باربری ترجیحی': c.preferredShipping,
      'کانال ارتباطی': c.channelSource,
      'یادداشت': c.notes,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'لیست مشتریان CRM');
    XLSX.writeFile(wb, `بانک_مشتریان_پوشاک_من_و_تو_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    onImportCustomers(parsedRows);
    setParsedRows([]);
    setFileName('');
    onClose();
  };

  const handleRemoveRow = (index: number) => {
    setParsedRows(parsedRows.filter((_, idx) => idx !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-[#1E2024] text-[#FAF7F2] w-full max-w-4xl rounded-3xl border border-[#3F3F46] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2E3138] flex items-center justify-between bg-[#181A1D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>افزودن و مدیریت هوشمند مشتریان با اکسل (Excel / CSV)</span>
                <span className="text-[11px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                  اتوماتیک
                </span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                ورود گروهی مخاطبین کانال تلگرام، بنکداری، فایل حسابداری یا فرم‌های ثبت‌نام اکسل
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-[#2E3138] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Action Cards: Download Template or Export */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Download Template Box */}
            <div className="bg-[#26282E] border border-[#3A3D45] rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="font-bold text-white text-xs block">
                  قالب آماده اکسل مشتریان
                </span>
                <p className="text-[11px] text-stone-400">
                  فایل اکسل مرتب با سرستون‌های فارسی برای وارد کردن اطلاعات مخاطبین
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="py-2 px-3 bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود نمونه XLSX</span>
              </button>
            </div>

            {/* Export Current CRM */}
            <div className="bg-[#26282E] border border-[#3A3D45] rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="font-bold text-white text-xs block">
                  خروجی اکسل مشتریان فعلی
                </span>
                <p className="text-[11px] text-stone-400">
                  دانلود فایل پشتیبان از {existingCustomers.length} مشتری ثبت شده در پنل
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportCurrent}
                className="py-2 px-3 bg-[#32363F] hover:bg-[#3F444F] text-stone-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-[#484D58] flex-shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>خروجی اکسل</span>
              </button>
            </div>

          </div>

          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#484D58] hover:border-[#D4AF37] bg-[#24262C] hover:bg-[#282B32] transition-all rounded-3xl p-6 text-center cursor-pointer space-y-3 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-[#181A1D] border border-[#3F3F46] group-hover:border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center mx-auto transition-colors">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                {fileName ? `فایل انتخاب شده: ${fileName}` : 'برای انتخاب یا بارگذاری فایل اکسل اینجا کلیک کنید'}
              </span>
              <p className="text-xs text-stone-400 mt-1">
                پشتیبانی کامل از فرمت‌های XLSX، XLS و CSV با تشخیص هوشمند ستون‌ها
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-950/60 border border-red-800 text-red-200 p-3.5 rounded-2xl flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Rows Preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs">
                    پیش‌نمایش {parsedRows.length} مشتری شناسایی شده از فایل اکسل:
                  </span>
                </div>
                <span className="text-[11px] text-stone-400">
                  می‌توانید ردیف‌ها را بررسی و ردیف‌های نامطلوب را حذف کنید.
                </span>
              </div>

              <div className="border border-[#3A3D45] rounded-2xl overflow-hidden bg-[#181A1D] max-h-64 overflow-y-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#24262C] text-stone-300 sticky top-0 border-b border-[#3A3D45]">
                    <tr>
                      <th className="p-2.5 font-bold">نام مشتری</th>
                      <th className="p-2.5 font-bold">فروشگاه / بوتیک</th>
                      <th className="p-2.5 font-bold">شماره موبایل</th>
                      <th className="p-2.5 font-bold">شهر</th>
                      <th className="p-2.5 font-bold text-center">سقف چک</th>
                      <th className="p-2.5 font-bold text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#282B32] text-stone-200">
                    {parsedRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#202227] transition-colors">
                        <td className="p-2.5 font-bold text-white">{row.name}</td>
                        <td className="p-2.5 text-stone-300">{row.storeName}</td>
                        <td className="p-2.5 font-mono text-[#D4AF37]">{row.phone}</td>
                        <td className="p-2.5 text-stone-300">{row.city}</td>
                        <td className="p-2.5 text-center font-mono">
                          {row.checkLimitToman > 0 ? `${row.checkLimitToman.toLocaleString('fa-IR')} ت` : 'نقدی'}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(idx)}
                            className="p-1 text-stone-400 hover:text-red-400 transition-colors"
                            title="حذف این ردیف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#2E3138] bg-[#181A1D] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 bg-[#2E3138] hover:bg-[#383B44] text-stone-300 font-bold text-xs rounded-xl transition-colors"
          >
            انصراف
          </button>

          <button
            type="button"
            disabled={parsedRows.length === 0}
            onClick={handleConfirmImport}
            className={`py-2.5 px-6 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md ${
              parsedRows.length > 0
                ? 'bg-[#D4AF37] hover:bg-[#C59F2D] text-[#18181B] cursor-pointer'
                : 'bg-stone-700 text-stone-400 cursor-not-allowed opacity-60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ثبت نهایی {parsedRows.length} مشتری در سامانه CRM</span>
          </button>
        </div>

      </div>
    </div>
  );
};
