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
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl shadow-2xs">
              <CreditCard className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#18181B]">
                حسابداری، چک‌داری صیادی و بهای تمام‌شده
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                رهگیری چک‌های مدت‌دار مشتریان، هشدار سررسید و مقایسه هزینه تامین‌کنندگان پارچه و خیاطان
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddCheckModalOpen(true)}
            className="text-xs bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#3F3F46]"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>+ ثبت چک صیادی دریافتی</span>
          </button>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E6DEC8] text-xs">
          <button
            onClick={() => setActiveSubTab('checks')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubTab === 'checks' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            مدیریت چک‌های صیادی ({checks.length})
          </button>

          <button
            onClick={() => setActiveSubTab('profit_loss')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubTab === 'profit_loss' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            گزارش سود و زیان دسته‌بندی‌ها
          </button>

          <button
            onClick={() => setActiveSubTab('suppliers_comparison')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubTab === 'suppliers_comparison' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-700 hover:bg-[#FAF7F2]'
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
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8]">
              <span className="text-xs text-[#8C6D37] font-bold block">مجموع چک‌های در جریان وصول:</span>
              <span className="text-xl font-black text-[#18181B] mt-1 block">
                {totalPendingAmount.toLocaleString('fa-IR')} تومان
              </span>
              <span className="text-[11px] text-stone-500">تعهدات مشتریان شهرستانی</span>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
              <span className="text-xs text-emerald-800 font-bold block">چک‌های وصول شده این ماه:</span>
              <span className="text-xl font-black text-emerald-950 mt-1 block">
                {totalClearedAmount.toLocaleString('fa-IR')} تومان
              </span>
              <span className="text-[11px] text-emerald-700">واریز مستقیم به حساب</span>
            </div>

            <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200">
              <span className="text-xs text-rose-800 font-bold block">هشدار سررسید نزدیک (۳ روز):</span>
              <span className="text-base font-black text-rose-900 mt-1 block">
                ۱ چک (۲۸,۵۰۰,۰۰۰ تومان)
              </span>
              <span className="text-[11px] text-rose-700">حاج داوود محمدی (اصفهان)</span>
            </div>
          </div>

          {/* Checks Table */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF7F2] text-stone-700 border-b border-[#E6DEC8] font-bold">
                  <tr>
                    <th className="p-3.5">مشتری صادرکننده</th>
                    <th className="p-3.5">شماره چک و صیادی ۱۶ رقمی</th>
                    <th className="p-3.5">بانک و شعبه</th>
                    <th className="p-3.5">مبلغ چک</th>
                    <th className="p-3.5">تاریخ سررسید</th>
                    <th className="p-3.5">وضعیت صیاد</th>
                    <th className="p-3.5">وضعیت وصول</th>
                    <th className="p-3.5 text-center">تغییر وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF7F2]">
                  {checks.map((chk) => (
                    <tr key={chk.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="p-3.5">
                        <span className="font-black text-stone-900 block">{chk.customerName}</span>
                        <span className="text-[11px] text-stone-500">{chk.storeName}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-stone-800 text-[11px] block">{chk.checkNumber}</span>
                        <span className="font-mono text-[10px] text-stone-400">{chk.sayadNumber}</span>
                      </td>
                      <td className="p-3.5 text-stone-700">{chk.bankName}</td>
                      <td className="p-3.5 font-black text-[#18181B]">
                        {chk.amountToman.toLocaleString('fa-IR')} ت
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-[#8C6D37] bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#DDD5C0] text-[11px]">
                          {chk.dueDate}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-emerald-800 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          ثبت صیاد بنفش
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          chk.status === 'cleared' ? 'bg-emerald-100 text-emerald-800' :
                          chk.status === 'in_collection' ? 'bg-amber-100 text-amber-900' :
                          chk.status === 'bounced' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-800'
                        }`}>
                          {chk.status === 'cleared' ? 'پاس شده' :
                           chk.status === 'in_collection' ? 'در جریان وصول' :
                           chk.status === 'bounced' ? 'برگشتی' : 'در انتظار سررسید'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {chk.status !== 'cleared' && (
                            <button
                              onClick={() => onUpdateCheckStatus(chk.id, 'cleared')}
                              className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors"
                            >
                              وصول شد
                            </button>
                          )}
                          {chk.status !== 'in_collection' && chk.status !== 'cleared' && (
                            <button
                              onClick={() => onUpdateCheckStatus(chk.id, 'in_collection')}
                              className="text-[10px] bg-[#FAF7F2] hover:bg-[#E6DEC8] text-[#18181B] font-bold px-2.5 py-1 rounded-lg border border-[#DDD5C0]"
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
        <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 text-xs">
          <h3 className="font-black text-sm text-[#18181B]">سود ناخالص و حاشیه سود به تفکیک دسته‌بندی پوشاک</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              { cat: 'شلوار بگ کتان لایت', margin: '۳۶٪', profitPerPack: '۴۸۰,۰۰۰ تومان', salesVolume: '۲۴۰ پک ماهانه' },
              { cat: 'شلوار راحتی نخی ۱۲ تایی', margin: '۴۱٪', profitPerPack: '۶۶۰,۰۰۰ تومان', salesVolume: '۳۸۰ پک ماهانه' },
              { cat: 'لگ غواصی کمر گنی', margin: '۳۷٪', profitPerPack: '۶۸۰,۰۰۰ تومان', salesVolume: '۱۵۰ پک ماهانه' },
              { cat: 'داکرون اداری/اسپرت', margin: '۳۵٪', profitPerPack: '۴۹۸,۰۰۰ تومان', salesVolume: '۱۱۰ پک ماهانه' },
              { cat: 'شلوار کارگو (همکاری)', margin: '۱۷٪', profitPerPack: '۲۰۰,۰۰۰ تومان', salesVolume: '۹۰ پک ماهانه' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC8] space-y-2">
                <span className="font-black text-[#18181B] block text-xs">{item.cat}</span>
                <div className="flex justify-between text-stone-700">
                  <span>حاشیه سود ناخالص:</span>
                  <strong className="text-emerald-800 font-black">{item.margin}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>سود ناخالص هر پک:</span>
                  <span className="font-bold text-stone-900">{item.profitPerPack}</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[10px] pt-2 border-t border-[#DDD5C0]">
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
          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
            <h3 className="font-black text-sm text-[#18181B] mb-3">مقایسه بنکداران و تامین‌کنندگان پارچه بازار تهران</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-[#E6DEC8]">
                  <tr>
                    <th className="p-3">نام تامین‌کننده</th>
                    <th className="p-3">نوع پارچه تخصصی</th>
                    <th className="p-3">میانگین قیمت متری</th>
                    <th className="p-3">نرخ پرتی و عیب پارچه</th>
                    <th className="p-3">سرعت تحویل طاقه</th>
                    <th className="p-3">امتیاز رضایت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF7F2]">
                  {fabricSuppliers.map((sup, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2]/60">
                      <td className="p-3 font-bold text-stone-900">{sup.name}</td>
                      <td className="p-3 text-stone-700">{sup.fabric}</td>
                      <td className="p-3 font-black text-[#8C6D37]">{sup.avgPricePerMeter.toLocaleString('fa-IR')} ت</td>
                      <td className="p-3 text-emerald-800 font-medium">{sup.defectRate}</td>
                      <td className="p-3 text-stone-600">{sup.deliverySpeed}</td>
                      <td className="p-3 font-bold text-[#D4AF37]">★ {sup.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tailor Workshops */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
            <h3 className="font-black text-sm text-[#18181B] mb-3">مقایسه کارگاه‌های خیاطی و برش‌کاری طرف قرارداد</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-[#E6DEC8]">
                  <tr>
                    <th className="p-3">نام کارگاه و خیاط</th>
                    <th className="p-3">مدل‌های تخصصی</th>
                    <th className="p-3">دستمزد هر عدد</th>
                    <th className="p-3">کیفیت دوخت</th>
                    <th className="p-3">ظرفیت دوخت روزانه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF7F2]">
                  {tailorWorkshops.map((t, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2]/60">
                      <td className="p-3 font-bold text-stone-900">{t.name}</td>
                      <td className="p-3 text-stone-700">{t.models}</td>
                      <td className="p-3 font-black text-[#18181B]">{t.wagePerUnit.toLocaleString('fa-IR')} ت</td>
                      <td className="p-3 text-emerald-800 font-medium">{t.qualityScore}</td>
                      <td className="p-3 text-stone-600 font-bold">{t.dailyCapacity}</td>
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
        <div className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6DEC8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <h3 className="text-base font-black text-[#18181B]">ثبت چک صیادی دریافتی</h3>
              <button onClick={() => setIsAddCheckModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSaveCheck} className="space-y-3 my-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">مشتری صادرکننده چک:</label>
                <select
                  value={newCheckForm.customerId}
                  onChange={(e) => setNewCheckForm({ ...newCheckForm, customerId: e.target.value })}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
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
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
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
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">شناسه ۱۶ رقمی صیادی:</label>
                  <input
                    type="text"
                    placeholder="7829104829104829"
                    value={newCheckForm.sayadNumber}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, sayadNumber: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-mono text-[11px] text-stone-900"
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
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">تاریخ سررسید چک:</label>
                  <input
                    type="text"
                    value={newCheckForm.dueDate}
                    onChange={(e) => setNewCheckForm({ ...newCheckForm, dueDate: e.target.value })}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => setIsAddCheckModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-[#FAF7F2] rounded-xl font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black px-5 py-2 rounded-xl shadow-xs"
                >
                  ثبت چک صیادی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
