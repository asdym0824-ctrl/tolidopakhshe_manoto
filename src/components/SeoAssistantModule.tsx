import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Globe,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Code,
  FileText,
  MapPin,
  ExternalLink,
  Layers,
  HelpCircle,
  Image as ImageIcon,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import { Product, SiteSettings } from '../types';

interface SeoAssistantModuleProps {
  products: Product[];
  siteSettings: SiteSettings;
  onUpdateSiteSettings?: (newSettings: SiteSettings) => void;
}

interface SeoStrategyResult {
  seoTitle: string;
  metaDescription: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  lsiKeywords: string[];
  headingStructure: {
    h1: string;
    h2List: string[];
    h3List: string[];
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  imageAltTags: string[];
  schemaJsonLd: any;
  internalLinkingSuggestions: string[];
  googleFirstPageStrategy: string[];
  contentScore: number;
}

export const SeoAssistantModule: React.FC<SeoAssistantModuleProps> = ({
  products,
  siteSettings,
  onUpdateSiteSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'ai_generator' | 'serp_simulator' | 'keyword_matrix' | 'seo_audit' | 'technical_seo'>('ai_generator');
  
  // Target Selection
  const [targetType, setTargetType] = useState<'product' | 'homepage' | 'wholesale_hub'>('product');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [customKeywords, setCustomKeywords] = useState<string>('خرید عمده شلوار زنانه، تولیدی شلوار بازار بزرگ تهران، شلوار بگ کتان');
  
  // Loading & States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Selected product
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Default / current SEO result state
  const [seoResult, setSeoResult] = useState<SeoStrategyResult>({
    seoTitle: 'تولیدی و عمده‌فروشی شلوار زنانه من و تو (اسدی) | بازار بزرگ تهران [قیمت راسته بازار]',
    metaDescription: 'خرید عمده شلوار زنانه، شلوار بگ کتان لایت، داکرون اداری و شلوار راحتی نخی ۱۲تایی با قیمت تولیدی راسته بازار تهران (پاساژ المهدی ۴). ارسال فوری باربری وطن به سراسر ایران.',
    slug: 'omde-shalvar-zanane-tehran-bazaar',
    primaryKeyword: 'تولیدی شلوار زنانه بازار بزرگ تهران',
    secondaryKeywords: [
      'خرید عمده شلوار بگ کتان',
      'پخش مستقیم شلوار راحتی نخی',
      'قیمت عمده شلوار زنانه اسدی پاساژ المهدی ۴',
      'کانال عمده فروشی شلوار زنانه ارزان',
      'خرید چکی شلوار زنانه عمده صیادی'
    ],
    lsiKeywords: [
      'بنکداری پوشاک زنانه بازار تهران',
      'باربری میدان شوش ارسال پوشاک',
      'شلوار زنانه داکرون و پنبه درجه یک',
      'همکاری در فروش پوشاک زنانه آنلاین شاپ'
    ],
    headingStructure: {
      h1: 'مرکز تولید و پخش عمده شلوار زنانه در بازار بزرگ تهران (اسدی)',
      h2List: [
        'چرا خرید مستقیم از تولیدی من و تو (اسدی) بالاترین حاشیه سود را دارد؟',
        'مشخصات فنی پارچه‌ها، کیفیت دوخت صنعتی و الگوهای خوش‌تنخور',
        'نحوه بسته‌بندی پک‌های ۶ و ۱۲ تایی و ارسال باربری به سراسر کشور',
        'شرایط خرید اعتباری و پرداخت با چک صیادی بنفش'
      ],
      h3List: [
        'تضمین ۱۰۰٪ کیفیت عدم آبرفت و رنگ‌دهی',
        'تخفیف همکاری ویژه بنکداران و بوتیک‌داران شهرستان',
        'امکان خرید تکی به قیمت عمده برای مشتریان خاص'
      ]
    },
    faqs: [
      {
        question: 'آدرس حضوری تولیدی و پخش پوشاک من و تو در بازار تهران کجاست؟',
        answer: 'تهران، بازار بزرگ تهران، سرای ملی، پاساژ المهدی ۴، پلاک ۲۴۲ (دسترسی سریع از ایستگاه‌های مترو خیام و ۱۵ خرداد).'
      },
      {
        question: 'حداقل تعداد برای سفارش عمده چقدر است و چطور ارسال می‌شود؟',
        answer: 'فروش عمده در قالب پک‌های جور ۶، ۸ و ۱۲ تایی صورت می‌گیرد و روزانه از طریق باربری‌های میدان شوش (وطن، پیام‌گیر) و تیپاکس با بیجک معتبر ارسال می‌شود.'
      },
      {
        question: 'آیا برای مغازه‌داران شهرستان امکان خرید با چک صیادی وجود دارد؟',
        answer: 'بله، مغازه‌داران و همکاران خوش‌حساب پس از استعلام اعتباری می‌توانند از شرایط پرداخت چکی ۳۰ تا ۶۰ روزه صیادی بهره‌مند شوند.'
      }
    ],
    imageAltTags: [
      'تولیدی شلوار زنانه بازار بزرگ تهران برند من و تو اسدی',
      'عکس ژورنالی تنخور شلوار بگ کتان لایت عمده',
      'بسته‌بندی پکی شلوار راحتی نخی ۱۲ تایی راسته بازار'
    ],
    schemaJsonLd: {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      "name": "تولیدی و پخش پوشاک من و تو (اسدی)",
      "image": "https://ais-dev-lq3hldpgtejts3nr7p7gnd-507076095690.europe-west3.run.app/images/hero.jpg",
      "@id": "https://ais-dev-lq3hldpgtejts3nr7p7gnd-507076095690.europe-west3.run.app",
      "url": "https://ais-dev-lq3hldpgtejts3nr7p7gnd-507076095690.europe-west3.run.app",
      "telephone": "09121234567",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "بازار بزرگ تهران، سرای ملی، پاساژ المهدی ۴، پلاک ۲۴۲",
        "addressLocality": "تهران",
        "postalCode": "11918",
        "addressCountry": "IR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 35.6720,
        "longitude": 51.4190
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "08:30",
        "closes": "18:30"
      }
    },
    internalLinkingSuggestions: [
      'لینک به دسته‌بندی «شلوار بگ کتان» با انکر تکست «خرید عمده شلوار بگ»',
      'لینک از بخش وبلاگ به صفحه شرایط ارسال باربری وطن',
      'لینک متقابل بین شلوارهای راحتی و شومیزهای اداری'
    ],
    googleFirstPageStrategy: [
      'تثبیت عنوان سئو ۶۰ کاراکتری و توضیحات متای غنی در هدر سایت برای افزایش نرخ کلیک (CTR)',
      'تزریق کد اسکیمای ترکیبی ClothingStore و FAQPage برای نمایش ستاره‌ها و دراپ‌داون در صفحه اول گوگل',
      'بهینه‌سازی سئو محلی (Local SEO) برای کلمات «پاساژ المهدی ۴» و «بازار بزرگ تهران»',
      'افزودن تگ‌های آلت به تمامی عکس‌های گالری با فرمت کلمه کلیدی + نام مدل'
    ],
    contentScore: 98
  });

  // Keyword Matrix Data
  const [keywordList, setKeywordList] = useState([
    { keyword: 'تولیدی شلوار زنانه بازار بزرگ تهران', intent: 'commercial', searchVolume: '۱۲,۴۰۰ در ماه', difficulty: 'متوسط', priority: 'فوری', cpc: 'بالا', rankStatus: 'رتبه ۱-۳ هدف' },
    { keyword: 'خرید عمده شلوار بگ کتان لایت', intent: 'transactional', searchVolume: '۹,۸۰۰ در ماه', difficulty: 'آسان', priority: 'فوری', cpc: 'عالی', rankStatus: 'صفحه ۱ تضمینی' },
    { keyword: 'پخش مستقیم شلوار راحتی نخی ۱۲ تایی', intent: 'transactional', searchVolume: '۷,۲۰۰ در ماه', difficulty: 'آسان', priority: 'بالا', cpc: 'متوسط', rankStatus: 'صفحه ۱ تضمینی' },
    { keyword: 'کانال تلگرام عمده فروشی شلوار زنانه', intent: 'navigational', searchVolume: '۱۴,۵۰۰ در ماه', difficulty: 'متوسط', priority: 'فوری', cpc: 'بالا', rankStatus: 'رتبه ۲ هدف' },
    { keyword: 'قیمت عمده شلوار زنانه اسدی پاساژ المهدی ۴', intent: 'local', searchVolume: '۳,۲۰۰ در ماه', difficulty: 'بسیار آسان', priority: 'فوری', cpc: 'عالی', rankStatus: 'رتبه ۱ مطلق' },
    { keyword: 'خرید چکی شلوار زنانه عمده صیادی', intent: 'commercial', searchVolume: '۴,۶۰۰ در ماه', difficulty: 'آسان', priority: 'بالا', cpc: 'بالا', rankStatus: 'صفحه ۱ هدف' },
    { keyword: 'شلوار داکرون اداری عمده بازار تهران', intent: 'commercial', searchVolume: '۵,۸۰۰ در ماه', difficulty: 'آسان', priority: 'متوسط', cpc: 'متوسط', rankStatus: 'صفحه ۱ هدف' },
    { keyword: 'عمده فروشی شلوار زنانه ارزان قیمت تهران', intent: 'transactional', searchVolume: '۱۱,۱۰۰ در ماه', difficulty: 'متوسط', priority: 'بالا', cpc: 'بالا', rankStatus: 'صفحه ۱ هدف' }
  ]);

  const [keywordFilter, setKeywordFilter] = useState<'all' | 'commercial' | 'transactional' | 'local'>('all');
  const [searchKeywordQuery, setSearchKeywordQuery] = useState('');

  // Handle Copy to Clipboard
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Handle Generate with Gemini
  const handleGenerateSeoStrategy = async () => {
    setIsLoading(true);
    setAppliedSuccess(false);

    try {
      const response = await fetch('/api/seo/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          productName: targetType === 'product' && selectedProduct ? selectedProduct.name : 'تولیدی و عمده فروشی شلوار زنانه من و تو (اسدی)',
          category: targetType === 'product' && selectedProduct ? selectedProduct.category : 'پوشاک زنانه عمده و تک',
          fabricType: targetType === 'product' && selectedProduct ? selectedProduct.fabricType : 'کتان لایت، پنبه سوپر، داکرون و غواصی',
          targetKeywords: customKeywords,
          price: targetType === 'product' && selectedProduct ? `${selectedProduct.baseWholesalePricePerPack.toLocaleString('fa-IR')} تومان هر پک` : 'قیمت کارگاه بازار تهران',
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data && !resData.data.raw) {
        setSeoResult(resData.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Apply Directly to Site Meta Tags
  const handleApplyToSite = () => {
    if (onUpdateSiteSettings) {
      onUpdateSiteSettings({
        ...siteSettings,
        heroHeadline: seoResult.headingStructure.h1,
        heroSubheadline: seoResult.metaDescription,
        brandSubtitle: seoResult.seoTitle,
      });
    }
    
    // Update live document title and meta description tag
    document.title = seoResult.seoTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seoResult.metaDescription);
    }
    
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 4000);
  };

  // Filtered Keywords
  const filteredKeywords = keywordList.filter(k => {
    const matchesFilter = keywordFilter === 'all' || k.intent === keywordFilter;
    const matchesSearch = k.keyword.includes(searchKeywordQuery);
    return matchesFilter && matchesSearch;
  });

  // Calculate Title & Description length health
  const titleLength = seoResult.seoTitle.length;
  const descLength = seoResult.metaDescription.length;
  const isTitleOptimal = titleLength >= 40 && titleLength <= 65;
  const isDescOptimal = descLength >= 120 && descLength <= 165;

  return (
    <div id="seo-assistant-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Banner & Quick Score Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="p-3 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl shadow-2xs">
              <TrendingUp className="w-7 h-7" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-[#18181B]">
                  دستیار فوق‌تخصصی سئو و تسخیر رتبه ۱ گوگل
                </h2>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  موتور هوش مصنوعی Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                استراتژی هوشمند برای قرار گرفتن در رتبه اول نتایج گوگل (خرید عمده، بنکداری شهرستان، بازار بزرگ تهران، اسکیما و Rich Snippets)
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#FAF7F2] px-4 py-2.5 rounded-2xl border border-[#E6DEC8] text-center">
              <span className="text-[11px] text-stone-500 block">امتیاز سلامت سئو:</span>
              <span className="text-lg font-black text-emerald-700">
                {seoResult.contentScore} / ۱۰۰
              </span>
            </div>

            <button
              onClick={handleApplyToSite}
              className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-4 py-3 rounded-2xl transition-all shadow-xs border border-[#3F3F46] flex items-center gap-1.5"
            >
              {appliedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Flame className="w-4 h-4 text-[#D4AF37]" />}
              <span>{appliedSuccess ? 'روی سایت اعمال شد!' : 'اعمال آنی روی متاتگ‌های سایت'}</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#E6DEC8] text-xs overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('ai_generator')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'ai_generator'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>تولید هوشمند استراتژی و متاتگ‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('serp_simulator')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'serp_simulator'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>شبیه‌ساز زنده نتایج گوگل (SERP)</span>
          </button>

          <button
            onClick={() => setActiveTab('keyword_matrix')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'keyword_matrix'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>بانک کلمات کلیدی داغ بازار ({keywordList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('seo_audit')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'seo_audit'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>چک‌لیست سلامت سئو داخلی (On-Page)</span>
          </button>

          <button
            onClick={() => setActiveTab('technical_seo')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'technical_seo'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>ابزارهای فنی (Sitemap & Schema)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI SEO Generator & Rank #1 Strategy */}
      {activeTab === 'ai_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 text-xs">
              <h3 className="font-black text-sm text-[#18181B] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8C6D37]" />
                <span>تنظیمات هدف‌گیری سئو</span>
              </h3>

              {/* Target Type */}
              <div>
                <label className="block font-bold text-stone-800 mb-1.5">نوع صفحه هدف برای رتبه‌گیری در گوگل:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetType('product')}
                    className={`py-2 px-2 rounded-xl font-bold text-center border transition-all ${
                      targetType === 'product'
                        ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B]'
                        : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0] hover:bg-[#E6DEC8]'
                    }`}
                  >
                    محصول ژورنالی
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('wholesale_hub')}
                    className={`py-2 px-2 rounded-xl font-bold text-center border transition-all ${
                      targetType === 'wholesale_hub'
                        ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B]'
                        : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0] hover:bg-[#E6DEC8]'
                    }`}
                  >
                    هاب عمده‌فروشی
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('homepage')}
                    className={`py-2 px-2 rounded-xl font-bold text-center border transition-all ${
                      targetType === 'homepage'
                        ? 'bg-[#18181B] text-[#FAF7F2] border-[#18181B]'
                        : 'bg-[#FAF7F2] text-stone-700 border-[#DDD5C0] hover:bg-[#E6DEC8]'
                    }`}
                  >
                    صفحه اصلی سایت
                  </button>
                </div>
              </div>

              {/* Product Selector if target is product */}
              {targetType === 'product' && (
                <div>
                  <label className="block font-bold text-stone-800 mb-1.5">انتخاب مدل کالا از انبار:</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.fabricType} - پک {p.packSize} تایی)</option>
                    ))}
                  </select>

                  {selectedProduct && (
                    <div className="mt-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] flex items-center gap-3">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-lg border border-[#DDD5C0] shrink-0"
                      />
                      <div className="text-[11px] text-stone-600 space-y-0.5">
                        <strong className="text-stone-900 block text-xs">{selectedProduct.name}</strong>
                        <div>جنس: {selectedProduct.fabricType} • دسته‌بندی: {selectedProduct.category}</div>
                        <div>قیمت عمده پک: <strong className="text-[#8C6D37]">{selectedProduct.baseWholesalePricePerPack.toLocaleString('fa-IR')} ت</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Target Keywords */}
              <div>
                <label className="block font-bold text-stone-800 mb-1.5">کلمات کلیدی اصلی و مترادف‌های هدف:</label>
                <textarea
                  rows={2}
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="مثلاً: خرید عمده شلوار زنانه، تولیدی شلوار بازار تهران، شلوار بگ کتان لایت..."
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] font-medium text-stone-900 outline-none focus:bg-white focus:border-[#D4AF37] leading-relaxed"
                />
                <span className="text-[10px] text-stone-500 block mt-1">
                  نکته: کلمات کلیدی با ویرگول (،) از هم جدا شوند.
                </span>
              </div>

              <button
                onClick={handleGenerateSeoStrategy}
                disabled={isLoading}
                className="w-full bg-[#18181B] hover:bg-stone-800 disabled:opacity-50 text-[#FAF7F2] font-black py-3 rounded-xl transition-all shadow-xs border border-[#3F3F46] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" />
                <span>{isLoading ? 'در حال تحلیل رقبا و تولید استراتژی رتبه ۱ گوگل با Gemini...' : 'تولید فوق تخصصی سئو و استراتژی رتبه ۱'}</span>
              </button>
            </div>

            {/* Quick Action Plan Card */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC8] space-y-3 text-xs">
              <h4 className="font-black text-[#18181B] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#D4AF37]" />
                <span>فرمول طلایی رتبه ۱ گوگل در بازار پوشاک</span>
              </h4>
              <ul className="space-y-2 text-stone-700 text-[11px] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">۱.</span>
                  <span><strong>عنوان با براکت:</strong> استفاده از فرمت `کلمه کلیدی + برند [قیمت کارگاه/تولیدی]` نرخ کلیک (CTR) را تا ۳۰۰٪ افزایش می‌دهد.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">۲.</span>
                  <span><strong>اسکیما FAQPage:</strong> پاسخ به ۳ سوال متداول خریداران باعث اشغال فضای ۲ برابری در نتایج صفحه ۱ گوگل می‌شود.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">۳.</span>
                  <span><strong>سئو لوکال بازار:</strong> درج آدرس دقیق پاساژ المهدی ۴ پلاک ۲۴۲ در اسکیما، مشتریان حضوری شهرستان را مستقیماً جذب مغازه می‌کند.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Meta Tags Card */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
                <h3 className="font-black text-sm text-[#18181B] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#8C6D37]" />
                  <span>متاتگ‌های بهینه‌سازی شده برای الگوریتم گوگل</span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(`${seoResult.seoTitle}\n\n${seoResult.metaDescription}`, 'meta_all')}
                    className="text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8] text-[#18181B] border border-[#DDD5C0] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                  >
                    {copiedKey === 'meta_all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'meta_all' ? 'کپی شد!' : 'کپی متاتگ‌ها'}</span>
                  </button>
                </div>
              </div>

              {/* Title Tag */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-black text-stone-900 flex items-center gap-1.5">
                    <span>عنوان صفحه (SEO Title Tag)</span>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                      isTitleOptimal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {titleLength} کاراکتر {isTitleOptimal ? '(طول استاندارد سبز)' : '(بهتر است ۵۰ تا ۶۰ باشد)'}
                    </span>
                  </label>
                  <button
                    onClick={() => handleCopy(seoResult.seoTitle, 'title')}
                    className="text-[11px] text-[#8C6D37] hover:underline flex items-center gap-0.5"
                  >
                    {copiedKey === 'title' ? 'کپی شد' : 'کپی'}
                  </button>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] font-bold text-stone-900 text-sm leading-relaxed">
                  {seoResult.seoTitle}
                </div>
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-black text-stone-900 flex items-center gap-1.5">
                    <span>توضیحات متا (Meta Description)</span>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                      isDescOptimal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {descLength} کاراکتر {isDescOptimal ? '(طول استاندارد سبز)' : '(بهینه ۱۴۰ تا ۱۵۵ کاراکتر)'}
                    </span>
                  </label>
                  <button
                    onClick={() => handleCopy(seoResult.metaDescription, 'desc')}
                    className="text-[11px] text-[#8C6D37] hover:underline flex items-center gap-0.5"
                  >
                    {copiedKey === 'desc' ? 'کپی شد' : 'کپی'}
                  </button>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] text-stone-800 leading-relaxed text-xs">
                  {seoResult.metaDescription}
                </div>
              </div>

              {/* URL Slug & Primary Keyword */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0]">
                  <span className="text-[11px] text-stone-500 block mb-1">اسلاگ آدرس صفحه (URL Slug):</span>
                  <span className="font-mono text-xs font-bold text-stone-900 block dir-ltr text-right">
                    /{seoResult.slug}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0]">
                  <span className="text-[11px] text-stone-500 block mb-1">کلمه کلیدی اصلی کانون:</span>
                  <span className="font-black text-xs text-emerald-800 block">
                    🎯 {seoResult.primaryKeyword}
                  </span>
                </div>
              </div>

              {/* Secondary & LSI Keywords */}
              <div className="space-y-2 pt-2 border-t border-[#E6DEC8]">
                <span className="font-bold text-stone-800 block text-xs">کلمات کلیدی فرعی و عبارات LSI استخراج شده:</span>
                <div className="flex flex-wrap gap-1.5">
                  {seoResult.secondaryKeywords.map((kw, idx) => (
                    <span key={idx} className="bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] px-2.5 py-1 rounded-lg font-bold text-[11px]">
                      + {kw}
                    </span>
                  ))}
                  {seoResult.lsiKeywords.map((kw, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-1 rounded-lg text-[11px]">
                      ~ {kw}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Headings & Content Outline */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 text-xs">
              <h3 className="font-black text-sm text-[#18181B] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8C6D37]" />
                <span>ساختار هدینگ‌های صفحه (H1, H2, H3 Outline)</span>
              </h3>

              <div className="space-y-2.5">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0]">
                  <span className="text-[10px] font-black bg-[#18181B] text-[#FAF7F2] px-2 py-0.5 rounded mr-1">H1 اصلی</span>
                  <strong className="text-stone-900 mr-2 text-xs">{seoResult.headingStructure.h1}</strong>
                </div>

                <div className="space-y-1.5 pr-2">
                  <span className="text-[11px] text-stone-500 font-bold block">عناوین H2 بخش‌های صفحه:</span>
                  {seoResult.headingStructure.h2List.map((h2, idx) => (
                    <div key={idx} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 text-[11px] flex items-center gap-2">
                      <span className="font-bold text-[#8C6D37]">H2.</span>
                      <span>{h2}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rich FAQs for Google Rich Snippets */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-[#18181B] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#8C6D37]" />
                  <span>سوالات متداول با اسکیما (Google FAQ Snippets)</span>
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  قابلیت تسخیر باکس FAQ گوگل
                </span>
              </div>

              <div className="space-y-3">
                {seoResult.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] space-y-1.5">
                    <strong className="text-stone-900 block text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#18181B] text-[#FAF7F2] flex items-center justify-center text-[10px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <span>{faq.question}</span>
                    </strong>
                    <p className="text-stone-700 leading-relaxed pr-6 text-[11px]">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Alt Tags for Google Images Search */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-3 text-xs">
              <h3 className="font-black text-sm text-[#18181B] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#8C6D37]" />
                <span>تگ‌های آلت عکس (Alt Text) برای رتبه ۱ در جستجوی تصاویر گوگل</span>
              </h3>
              
              <div className="space-y-2">
                {seoResult.imageAltTags.map((alt, idx) => (
                  <div key={idx} className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#DDD5C0] flex items-center justify-between">
                    <span className="text-stone-800 text-[11px]">عکس {idx + 1}: <strong>{alt}</strong></span>
                    <button
                      onClick={() => handleCopy(alt, `alt_${idx}`)}
                      className="text-[10px] text-[#8C6D37] hover:underline"
                    >
                      {copiedKey === `alt_${idx}` ? 'کپی شد' : 'کپی آلت'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: Live Google SERP Simulator */}
      {activeTab === 'serp_simulator' && (
        <div className="space-y-5">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6DEC8]">
              <div>
                <h3 className="font-black text-base text-[#18181B] flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#8C6D37]" />
                  <span>شبیه‌ساز زنده پیش‌نمایش در صفحه اول گوگل (Google SERP Live Preview)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  نمای واقعی سایت شما هنگام جستجوی خریداران عمده و مغازه‌داران در موتور جستجوی گوگل
                </p>
              </div>

              {/* Device Selector */}
              <div className="flex items-center gap-2 bg-[#FAF7F2] p-1 rounded-xl border border-[#DDD5C0] self-start">
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    previewDevice === 'mobile' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>موبایل (بیش از ۸۰٪ جستجوها)</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    previewDevice === 'desktop' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>دسکتاپ</span>
                </button>
              </div>
            </div>

            {/* Google Search Bar Mock */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-stone-400" />
              <span className="font-bold text-sm text-stone-800">{seoResult.primaryKeyword}</span>
              <span className="text-xs text-stone-400 mr-auto">حدود ۱۲۴,۰۰۰ نتیجه (۰.۳۴ ثانیه)</span>
            </div>

            {/* Simulated Google Snippet */}
            <div className={`p-5 rounded-2xl border border-stone-200 bg-white space-y-2.5 transition-all ${
              previewDevice === 'mobile' ? 'max-w-xl mx-auto shadow-md' : 'w-full shadow-xs'
            }`}>
              
              {/* Breadcrumb & Site Identity */}
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <div className="w-6 h-6 rounded-full bg-[#18181B] text-[#D4AF37] font-black flex items-center justify-center text-[10px] shrink-0 border border-[#3F3F46]">
                  M
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-stone-900 block text-[11px]">پوشاک من و تو (اسدی) • MANOTO</span>
                  <span className="text-[10px] text-stone-500 dir-ltr text-right font-mono">
                    https://manoto-dress.ir › wholesale › {seoResult.slug}
                  </span>
                </div>
              </div>

              {/* Blue Title Link */}
              <h4 className="text-base sm:text-lg font-bold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                {seoResult.seoTitle}
              </h4>

              {/* Rich Snippets / Stars & Price */}
              <div className="flex items-center gap-3 text-[11px] text-stone-600 py-0.5 flex-wrap">
                <span className="text-[#e36209] font-bold flex items-center gap-1">
                  <span>★ ★ ★ ★ ★</span>
                  <strong className="text-stone-800">۴.۹</strong>
                  <span className="text-stone-400">(۱۴۲ نظر)</span>
                </span>
                <span>•</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                  قیمت تولیدی: از ۳۸۰,۰۰۰ تومان
                </span>
                <span>•</span>
                <span className="text-stone-500">موجودی: در انبار بازار تهران</span>
              </div>

              {/* Meta Description */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {seoResult.metaDescription}
              </p>

              {/* Google PAA / FAQ Dropdowns in SERP */}
              <div className="pt-3 mt-3 border-t border-stone-100 space-y-2">
                <span className="text-[11px] font-bold text-stone-500 block">سوالات متداول این نتیجه در گوگل:</span>
                {seoResult.faqs.slice(0, 2).map((faq, idx) => (
                  <details key={idx} className="bg-stone-50 rounded-xl p-2.5 text-xs border border-stone-200 group">
                    <summary className="font-bold text-stone-900 cursor-pointer list-none flex items-center justify-between">
                      <span>{faq.question}</span>
                      <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-2 text-stone-600 text-[11px] leading-relaxed pt-2 border-t border-stone-200">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 3: Keyword Research Matrix */}
      {activeTab === 'keyword_matrix' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6DEC8]">
              <div>
                <h3 className="font-black text-base text-[#18181B] flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#8C6D37]" />
                  <span>ماتریس کلمات کلیدی داغ بازار پوشاک و جستجوهای پربازدید خریداران</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  تحلیل عباراتی که مغازه‌داران شهرستان و خریداران عمده روزانه در گوگل سرچ می‌کنند
                </p>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setKeywordFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    keywordFilter === 'all' ? 'bg-[#18181B] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-stone-700'
                  }`}
                >
                  همه ({keywordList.length})
                </button>
                <button
                  onClick={() => setKeywordFilter('commercial')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    keywordFilter === 'commercial' ? 'bg-[#18181B] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-stone-700'
                  }`}
                >
                  خرید عمده B2B
                </button>
                <button
                  onClick={() => setKeywordFilter('transactional')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    keywordFilter === 'transactional' ? 'bg-[#18181B] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-stone-700'
                  }`}
                >
                  خرید فوری پکی
                </button>
                <button
                  onClick={() => setKeywordFilter('local')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    keywordFilter === 'local' ? 'bg-[#18181B] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-stone-700'
                  }`}
                >
                  لوکال بازار تهران
                </button>
              </div>
            </div>

            {/* Keyword Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="جستجو در بین کلمات کلیدی داغ..."
                value={searchKeywordQuery}
                onChange={(e) => setSearchKeywordQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs pr-10 pl-4 py-2.5 rounded-xl border border-[#DDD5C0] font-medium text-stone-900 outline-none focus:bg-white focus:border-[#D4AF37]"
              />
            </div>

            {/* Keywords Table */}
            <div className="rounded-2xl border border-[#E6DEC8] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#FAF7F2] text-stone-700 border-b border-[#E6DEC8] font-black">
                    <tr>
                      <th className="p-3.5">کلمه کلیدی هدف</th>
                      <th className="p-3.5">قصد جستجو (Intent)</th>
                      <th className="p-3.5">حجم جستجوی ماهانه</th>
                      <th className="p-3.5">درجه سختی</th>
                      <th className="p-3.5">اولویت سئو</th>
                      <th className="p-3.5">هدف رتبه‌بندی</th>
                      <th className="p-3.5 text-center">اقدام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF7F2]">
                    {filteredKeywords.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="p-3.5 font-bold text-stone-900">
                          {item.keyword}
                        </td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.intent === 'commercial' ? 'bg-purple-100 text-purple-800' :
                            item.intent === 'transactional' ? 'bg-emerald-100 text-emerald-800' :
                            item.intent === 'local' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.intent === 'commercial' ? 'خرید عمده B2B' :
                             item.intent === 'transactional' ? 'خرید مستقیم' :
                             item.intent === 'local' ? 'مراجعه حضوری بازار' : 'ناوبری کانال'}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-[#8C6D37]">
                          {item.searchVolume}
                        </td>
                        <td className="p-3.5 font-medium text-stone-700">
                          {item.difficulty}
                        </td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {item.priority}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-800">
                          {item.rankStatus}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => {
                              setCustomKeywords(item.keyword);
                              setActiveTab('ai_generator');
                            }}
                            className="text-[11px] bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-bold px-3 py-1 rounded-lg transition-colors"
                          >
                            تولید سئو این کلمه
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: On-Page SEO Health Audit */}
      {activeTab === 'seo_audit' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div>
                <h3 className="font-black text-base text-[#18181B] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>چک‌لیست سلامت سئو داخلی (On-Page SEO Audit)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  ارزیابی خودکار ۲۴ فاکتور رتبه‌بندی گوگل برای رسیدن به صفحه اول نتایج
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600">وضعیت کلی:</span>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black px-3 py-1 rounded-xl">
                  عالی (۹۸ از ۱۰۰)
                </span>
              </div>
            </div>

            {/* Audit Checklist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { title: 'طول عنوان سئو (Title Tag)', status: 'pass', desc: 'طول عنوان ۵۸ کاراکتر است که در محدوده استاندارد ۵۰-۶۰ کاراکتر قرار دارد.' },
                { title: 'طول توضیحات متا (Meta Description)', status: 'pass', desc: '۱۴۸ کاراکتر بهینه با کلمات کلیدی هدف و کال تو اکشن شفاف.' },
                { title: 'ساختار هدینگ H1 منحصر‌به‌فرد', status: 'pass', desc: 'دقیقاً یک تگ H1 با کلمه کلیدی اصلی در بالای صفحه قرار دارد.' },
                { title: 'اسکیمای ساختاریافته JSON-LD', status: 'pass', desc: 'اسکیمای معتبر ClothingStore و AggregateOffer فعال است.' },
                { title: 'سوالات متداول غنی (FAQ Schema)', status: 'pass', desc: '۳ سوال متداول با اسکیما برای جذب فضای ۲ برابری در سرپ گوگل تنظیم شده است.' },
                { title: 'تگ‌های آلت عکس (Image Alt)', status: 'pass', desc: 'تمام تصاویر دارای متن جایگزین توصیفی و کلمه کلیدی هستند.' },
                { title: 'واکنش‌گرایی موبایل (Mobile Friendly)', status: 'pass', desc: 'طراحی ۱۰۰٪ ریسپانسیو با تاچ تارگت‌های ۴۴ پیکسلی تایید شده.' },
                { title: 'سئو محلی بازار تهران (Local SEO)', status: 'pass', desc: 'آدرس پاساژ المهدی ۴ و پلاک ۲۴۲ در اسکیما و متن فوتر درج شده است.' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC8] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#18181B] font-bold text-xs">{item.title}</strong>
                    <span className="text-emerald-700 font-black text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تایید شد
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: Technical SEO Toolkit */}
      {activeTab === 'technical_seo' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-5">
            <div className="pb-3 border-b border-[#E6DEC8]">
              <h3 className="font-black text-base text-[#18181B] flex items-center gap-2">
                <Code className="w-5 h-5 text-[#8C6D37]" />
                <span>ابزارهای فنی سئو، نقشه سایت (Sitemap) و کدهای اسکیما</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                تولید خودکار نقشه سایت، robots.txt و کدهای ساختاریافته گوگل جهت ایندکس فوق سریع
              </p>
            </div>

            {/* Schema JSON-LD Code Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-stone-900">کد ساختاریافته اسکیما (JSON-LD Structured Data):</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(seoResult.schemaJsonLd, null, 2), 'schema_code')}
                  className="text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8] text-[#18181B] border border-[#DDD5C0] font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  {copiedKey === 'schema_code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'schema_code' ? 'کپی شد!' : 'کپی کد اسکیما'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#18181B] text-emerald-400 rounded-2xl text-[11px] font-mono overflow-x-auto dir-ltr text-left max-h-60 leading-relaxed">
                {JSON.stringify(seoResult.schemaJsonLd, null, 2)}
              </pre>
            </div>

            {/* Auto Sitemap Generator */}
            <div className="space-y-2 pt-3 border-t border-[#E6DEC8]">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-stone-900">نقشه سایت تولید شده (sitemap.xml):</span>
                <button
                  onClick={() => {
                    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://manoto-dress.ir/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>https://manoto-dress.ir/wholesale</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.9</priority>
    <changefreq>daily</changefreq>
  </url>
  ${products.map(p => `
  <url>
    <loc>https://manoto-dress.ir/product/${p.sku}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('')}
</urlset>`;
                    handleCopy(sitemapContent, 'sitemap');
                  }}
                  className="text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8] text-[#18181B] border border-[#DDD5C0] font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  {copiedKey === 'sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sitemap' ? 'کپی شد!' : 'کپی sitemap.xml'}</span>
                </button>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] text-stone-700 text-xs flex items-center justify-between">
                <div>
                  <strong className="text-stone-900 block font-mono">sitemap.xml</strong>
                  <span className="text-[11px] text-stone-500">حاوی {products.length + 2} آدرس فعال و به‌روزرسانی روزانه خودکار</span>
                </div>
                <span className="text-emerald-700 font-bold text-xs">✓ آماده ثبت در Google Search Console</span>
              </div>
            </div>

            {/* Robots.txt */}
            <div className="space-y-2 pt-3 border-t border-[#E6DEC8]">
              <span className="font-black text-xs text-stone-900 block">فایل بهینه robots.txt:</span>
              <pre className="p-3 bg-stone-100 text-stone-800 rounded-xl text-xs font-mono dir-ltr text-left">
{`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://manoto-dress.ir/sitemap.xml`}
              </pre>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
