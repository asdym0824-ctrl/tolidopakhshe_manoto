import React, { useState } from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Building, 
  Scissors, 
  Plus, 
  Search, 
  Filter,
  Check
} from 'lucide-react';
import { CheckItem, Customer } from '../types';

interface FinanceModuleProps {
  checks: CheckItem[];
  customers: Customer[];
  onAddCheck: (check: CheckItem) => void;
  onUpdateCheckStatus: (checkId: string, status: 'pending' | 'in_collection' | 'cleared' | 'bounced') => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  checks,
  customers,
  onAddCheck,
  onUpdateCheckStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'checks' | 'profit_loss' | 'suppliers_comparison'>('checks');
  const [isAddCheckModalOpen, setIsAddCheckModalOpen] = useState(false);

  // New Check form
  const [newCheckForm, setNewCheckForm] = useState({
    checkNumber: '',
    sayadNumber: '',
    bankName: 'بانک صادرات (شعبه بازار)',
    amountToman: 25000000,
    issueDate: '۱۴۰۳/۰۲/۲۵',
    dueDate: '۱۴۰۳/۰۳/۱۵',
    customerId: customers[0]?.id || '',
    registeredInSayad: true,
    notes: '',
  });

  const totalPendingAmount = checks
    .filter(c => c.status === 'pending' || c.status === 'in_collection')
    .reduce((s, c) => s + c.amountToman, 0);

  const totalClearedAmount = checks
    .filter(c => c.status === 'cleared')
    .reduce((s, c) => s + c.amountToman, 0);

  // Supplier and Tailor Comparison Data
  const fabricSuppliers = [
    { name: 'پارچه‌سرای نساجی مولوی (حاج محمود)', fabric: 'کتان لایت و داکرون', avgPricePerMeter: 85000, defectRate: 'کمتر از ۱٪', deliverySpeed: 'همان روز', rating: 4.9 },
    { name: 'نساجی اصفهان بافت (شعبه بازار)', fabric: 'نخ پنبه ۱۰۰٪', avgPricePerMeter: 48000, defectRate: '۱.۲٪', deliverySpeed: '۲۴ ساعته', rating: 4.8 },
    { name: 'بازرگانی پارچه قادری (سیروس)', fabric: 'ابروبادی و کرپ', avgPricePerMeter: 70000, defectRate: '۲٪', deliverySpeed: '۲ روزه', rating: 4.5 },
    { name: 'واردات غواصی کره‌ای (پاساژ رضایی)', fabric: 'غواصی ۴۰۰ گرم', avgPricePerMeter: 95000, defectRate: '۰٪', deliverySpeed: 'موجودی انبار', rating: 5.0 },
  ];

  const tailorWorkshops = [
    { name: 'کارگاه دوخت استاد رحمان (خیام)', models: 'شلوار بگ و داکرون', wagePerUnit: 35000, qualityScore: 'عالی (پنج‌لا دوز)', dailyCapacity: '۲۰۰ عدد' },
    { name: 'کارگاه خیاطی برادران شفیعی', models: 'شلوار راحتی نخی ۱۲ تایی', wagePerUnit: 20000, qualityScore: 'سرعتی و مناسب حراجی', dailyCapacity: '۵۰۰ عدد' },
    { name: 'تولیدی تخصصی لگ آریا', models: 'لگ غواصی کمر گنی', wagePerUnit: 28000, qualityScore: 'تخصصی کش‌دوزی', dailyCapacity: '۱۵۰ عدد' },
    { name: 'کارگاه خیاطی امید', models: 'جاگر و اسپرت', wagePerUnit: 32000, qualityScore: 'جیب‌دوزی تمیز', dailyCapacity: '۱۸۰ عدد' },
  ];

  const handleSaveCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === newCheckForm.customerId);

    const newCheck: CheckItem = {
      id: `chk-${Date.now()}`,
      checkNumber: newCheckForm.checkNumber || `${Math.floor(10000000 + Math.random() * 90000000)}`,
      sayadNumber: newCheckForm.sayadNumber || `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
      bankName: newCheckForm.bankName,
      amountToman: Number(newCheckForm.amountToman),
      issueDate: newCheckForm.issueDate,
      dueDate: newCheckForm.dueDate,
      customerId: newCheckForm.customerId,
      customerName: cust?.name || 'مشتری بازار',
      storeName: cust?.storeName || 'فروشگاه',
      status: 'pending',
      registeredInSayad: newCheckForm.registeredInSayad,
      notes: newCheckForm.notes,
    };

    onAddCheck(newCheck);
    setIsAddCheckModalOpen(false);
  };

  return (
    <div id="finance-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                حسابداری، چک‌داری صیادی و بهای تمام‌شده
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                رهگیری چک‌های مدت‌دار مشتریان، هشدار ۳ روز مانده به سررسید و مقایسه هزینه تامین‌کنندگان پارچه و خیاطان
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddCheckModalOpen(true)}
            className="text-xs bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ ثبت چک صیادی دریافتی</span>
          </button>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100 text-xs">
          <button
            onClick={() => setActiveSubTab('checks')}
            className={`px-3 py-1.8 rounded-xl font-bold transition-all ${
              activeSubTab === 'checks' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            مدیریت چک‌های صیادی ({checks.length})
          </button>

          <button
            onClick={() => setActiveSubTab('profit_loss')}
            className={`px-3 py-1.8 rounded-xl font-bold transition-all ${
              activeSubTab === 'profit_loss' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            گزارش سود و زیان دسته‌بندی‌ها
          </button>

          <button
            onClick={() => setActiveSubTab('suppliers_comparison')}
            className={`px-3 py-1.8 rounded-xl font-bold transition-all ${
              activeSubTab === 'suppliers_comparison' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            مقایسه پارچه‌فروشان و خیاطان
          </button>
        </div>
      </div>

      {/* Subtab 1: Checks Management */}
      {activeSubTab === 'checks' && (
        <div className="space-y-4">
          
          {/* Summary Metric Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 font-bold block">مجموع چک‌های در جریان وصول:</span>
              <span className="text-xl font-black text-amber-950 mt-1 block">
                {totalPendingAmount.toLocaleString('fa-IR')} تومان
              </span>
              <span className="text-[11px] text-amber-700">تعهدات مشتریان شهرستانی</span>
            </div>

            <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
              <span className="text-xs text-emerald-800 font-bold block">چک‌های وصول شده این ماه:</span>
              <span className="text-xl font-black text-emerald-950 mt-1 block">
                {totalClearedAmount.toLocaleString('fa-IR')} تومان
              </span>
              <span className="text-[11px] text-emerald-700">واریز مستقیم به حساب</span>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-700 font-bold block">هشدار سررسید نزدیک (۳ روز):</span>
              <span className="text-base font-black text-rose-700 mt-1 block">
                ۱ چک (۲۸,۵۰۰,۰۰۰ تومان)
              </span>
              <span className="text-[11px] text-stone-500">حاج داوود محمدی (اصفهان)</span>
            </div>
          </div>

          {/* Checks Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-100/80 text-stone-600 border-b border-stone-200 font-bold">
                  <tr>
                    <th className="p-3">مشتری صادرکننده</th>
                    <th className="p-3">شماره چک و صیادی ۱۶ رقمی</th>
                    <th className="p-3">بانک و شعبه</th>
                    <th className="p-3">مبلغ چک</th>
                    <th className="p-3">تاریخ سررسید</th>
                    <th className="p-3">وضعیت صیاد</th>
                    <th className="p-3">وضعیت وصول</th>
                    <th className="p-3 text-center">تغییر وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70">
                  {checks.map((chk) => (
                    <tr key={chk.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3">
                        <span className="font-bold text-stone-900 block">{chk.customerName}</span>
                        <span className="text-[11px] text-stone-500">{chk.storeName}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-stone-800 text-[11px] block">{chk.checkNumber}</span>
                        <span className="font-mono text-[10px] text-stone-500">{chk.sayadNumber}</span>
                      </td>
                      <td className="p-3 text-stone-700">{chk.bankName}</td>
                      <td className="p-3 font-black text-stone-900">
                        {chk.amountToman.toLocaleString('fa-IR')} ت
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                          {chk.dueDate}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-emerald-750 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ثبت صیاد بنفش
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          chk.status === 'cleared' ? 'bg-emerald-100 text-emerald-800' :
                          chk.status === 'in_collection' ? 'bg-amber-100 text-amber-800' :
                          chk.status === 'bounced' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {chk.status === 'cleared' ? 'پاس شده' :
                           chk.status === 'in_collection' ? 'در جریان وصول' :
                           chk.status === 'bounced' ? 'برگشتی' : 'در انتظار سررسید'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {chk.status !== 'cleared' && (
                            <button
                              onClick={() => onUpdateCheckStatus(chk.id, 'cleared')}
                              className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded transition-colors"
                            >
                              وصول شد
                            </button>
                          )}
                          {chk.status !== 'in_collection' && chk.status !== 'cleared' && (
                            <button
                              onClick={() => onUpdateCheckStatus(chk.id, 'in_collection')}
                              className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-2 py-1 rounded"
                            >
                              خواباندن به حساب
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Profit & Loss */}
      {activeSubTab === 'profit_loss' && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-stone-900">سود ناخالص و حاشیه سود به تفکیک دسته‌بندی پوشاک</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { cat: 'شلوار بگ کتان لایت', margin: '۳۶٪', profitPerPack: '۴۸۰,۰۰۰ تومان', salesVolume: '۲۴۰ پک ماهانه' },
              { cat: 'شلوار راحتی نخی ۱۲ تایی', margin: '۴۱٪', profitPerPack: '۶۶۰,۰۰۰ تومان', salesVolume: '۳۸۰ پک ماهانه' },
              { cat: 'لگ غواصی کمر گنی', margin: '۳۷٪', profitPerPack: '۶۸۰,۰۰۰ تومان', salesVolume: '۱۵۰ پک ماهانه' },
              { cat: 'داکرون اداری/اسپرت', margin: '۳۵٪', profitPerPack: '۴۹۸,۰۰۰ تومان', salesVolume: '۱۱۰ پک ماهانه' },
              { cat: 'شلوار کارگو (همکاری)', margin: '۱۷٪', profitPerPack: '۲۰۰,۰۰۰ تومان', salesVolume: '۹۰ پک ماهانه' },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <span className="font-bold text-stone-900 block text-xs">{item.cat}</span>
                <div className="flex justify-between text-stone-600">
                  <span>حاشیه سود ناخالص:</span>
                  <strong className="text-emerald-700 font-black">{item.margin}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>سود ناخالص هر پک:</span>
                  <span>{item.profitPerPack}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-[10px] pt-1 border-t border-stone-200">
                  <span>حجم فروش:</span>
                  <span>{item.salesVolume}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Fabric Suppliers & Tailors Comparison */}
      {activeSubTab === 'suppliers_comparison' && (
        <div className="space-y-4">
          
          {/* Fabric Suppliers */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <h3 className="font-bold text-sm text-stone-900 mb-3">مقایسه بنکداران و تامین‌کنندگان پارچه بازار تهران</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">نام تامین‌کننده</th>
                    <th className="p-2.5">نوع پارچه تخصصی</th>
                    <th className="p-2.5">میانگین قیمت متری</th>
                    <th className="p-2.5">نرخ پرتی و عیب پارچه</th>
                    <th className="p-2.5">سرعت تحویل طاقه</th>
                    <th className="p-2.5">امتیاز رضایت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {fabricSuppliers.map((sup, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="p-2.5 font-bold text-stone-900">{sup.name}</td>
                      <td className="p-2.5 text-stone-700">{sup.fabric}</td>
                      <td className="p-2.5 font-bold text-amber-800">{sup.avgPricePerMeter.toLocaleString('fa-IR')} ت</td>
                      <td className="p-2.5 text-emerald-700 font-medium">{sup.defectRate}</td>
                      <td className="p-2.5 text-stone-600">{sup.deliverySpeed}</td>
                      <td className="p-2.5 font-bold text-stone-900">★ {sup.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tailor Workshops */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <h3 className="font-bold text-sm text-stone-900 mb-3">مقایسه کارگاه‌های خیاطی و برش‌کاری طرف قرارداد</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">نام کارگاه و خیاط</th>
                    <th className="p-2.5">مدل‌های تخصصی</th>
                    <th className="p-2.5">دستمزد هر عدد</th>
                    <th className="p-2.5">کیفیت دوخت</th>
                    <th className="p-2.5">ظرفیت دوخت روزانه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {tailorWorkshops.map((t, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="p-2.5 font-bold text-stone-900">{t.name}</td>
                      <td className="p-2.5 text-stone-700">{t.models}</td>
                      <td className="p-2.5 font-bold text-stone-900">{t.wagePerUnit.toLocaleString('fa-IR')} ت</td>
                      <td className="p-2.5 text-emerald-700 font-medium">{t.qualityScore}</td>
                      <td className="p-2.5 text-stone-600 font-bold">{t.dailyCapacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: Add Check */}
      {isAddCheckModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">ثبت چک صیادی دریافتی</h3>
              <button onClick={() => setIsAddCheckModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSaveCheck} className="space-y-3 my-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">مشتری صادرکننده چک:</label>
                <select
                  value={newCheckForm.customerId}
                  onChange={(e) => setNewCheckForm({ ...newCheckForm, customerId: e.target.value })}
                  className="w-full bg-stone-50 p-2 rounded-lg border border-stone-200"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.storeName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">مبلغ چک (تومان):</label>
                <input
                  type="number"
                  value={newCheckForm.amountToman}
                  onChange={(e) => setNewCheckForm({ ...newCheckForm, amountToman: Number(e.target.value) })}
                  className="w-full bg-stone-50 p-2 rounded-lg border border-stone-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شماره سریال چک:</label>
                  <input
                    type="text"
                    placeholder="48201948"
                    value={newCheckForm.checkNumber}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, checkNumber: e.target.value })}
                    className="w-full bg-stone-50 p-2 rounded-lg border border-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شناسه ۱۶ رقمی صیادی:</label>
                  <input
                    type="text"
                    placeholder="7829104829104829"
                    value={newCheckForm.sayadNumber}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, sayadNumber: e.target.value })}
                    className="w-full bg-stone-50 p-2 rounded-lg border border-stone-200 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">بانک صادرکننده:</label>
                  <input
                    type="text"
                    value={newCheckForm.bankName}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, bankName: e.target.value })}
                    className="w-full bg-stone-50 p-2 rounded-lg border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">تاریخ سررسید چک:</label>
                  <input
                    type="text"
                    value={newCheckForm.dueDate}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, dueDate: e.target.value })}
                    className="w-full bg-stone-50 p-2 rounded-lg border border-stone-200 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddCheckModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  ثبت چک
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
