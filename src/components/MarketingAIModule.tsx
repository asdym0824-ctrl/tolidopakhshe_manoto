import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Share2, 
  Bot, 
  Globe, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Copy, 
  Layers, 
  Image as ImageIcon,
  Check,
  TrendingUp,
  Search
} from 'lucide-react';
import { Product, SocialPost, AutoResponderRule, SiteSettings } from '../types';
import { SeoAssistantModule } from './SeoAssistantModule';

interface MarketingAIModuleProps {
  products: Product[];
  socialPosts: SocialPost[];
  autoResponders: AutoResponderRule[];
  siteSettings: SiteSettings;
  onUpdateSiteSettings?: (settings: SiteSettings) => void;
  onAddSocialPost: (post: SocialPost) => void;
  onAddAutoResponder: (rule: AutoResponderRule) => void;
}

export const MarketingAIModule: React.FC<MarketingAIModuleProps> = ({
  products,
  socialPosts,
  autoResponders,
  siteSettings,
  onUpdateSiteSettings,
  onAddSocialPost,
  onAddAutoResponder,
}) => {
  const [activeTab, setActiveTab] = useState<'seo_assistant' | 'ai_generator' | 'channels_scheduler' | 'auto_responder'>('seo_assistant');
  
  // AI Generator state
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [targetChannel, setTargetChannel] = useState<string>('تلگرام و روبیکا');
  const [generatedCaption, setGeneratedCaption] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Auto responder state
  const [rulesList, setRulesList] = useState<AutoResponderRule[]>(autoResponders);
  const [newKeyword, setNewKeyword] = useState('');
  const [newResponse, setNewResponse] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleGenerateAICaption = async () => {
    if (!selectedProduct) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct.name,
          fabricType: selectedProduct.fabricType,
          packSize: selectedProduct.packSize,
          colors: selectedProduct.colors.join('، '),
          pricePerPack: selectedProduct.baseWholesalePricePerPack,
          channel: targetChannel,
        })
      });

      const data = await response.json();
      if (data.success && data.caption) {
        setGeneratedCaption(data.caption);
      } else {
        // Fallback
        setGeneratedCaption(`🔥 بمب فروش بازار بزرگ تهران رسید 🔥

✨ مدل: ${selectedProduct.name}
🧵 جنس پارچه: ${selectedProduct.fabricType}
📦 بسته‌بندی: پک‌های ${selectedProduct.packSize} عددی (جور رنگ‌بندی کامل)
📐 سایز: ${selectedProduct.sizes}
💰 قیمت عمده هر پک: ${selectedProduct.baseWholesalePricePerPack.toLocaleString('fa-IR')} تومان (دونه‌ای ${selectedProduct.baseWholesalePricePerUnit.toLocaleString('fa-IR')} ت)

🚚 ارسال سریع با باربری وطن و تیپاکس به سراسر کشور
✍️ ثبت سفارش فوری در پیوی: @bazar_admin

#عمده_فروشی #پوشاک_زنانه #بازار_تهران #شلوار_زنانه`);
      }
    } catch (e) {
      console.error(e);
      setGeneratedCaption(`🔥 حراج ویژه عمده‌فروشی بازار بزرگ تهران 🔥

✨ مدل: ${selectedProduct.name}
📦 پک ${selectedProduct.packSize} عددی - قیمت هر پک: ${selectedProduct.baseWholesalePricePerPack.toLocaleString('fa-IR')} تومان
ارسال با باربری وطن.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSchedulePost = () => {
    if (!selectedProduct || !generatedCaption) return;

    const newPost: SocialPost = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      image: selectedProduct.image,
      caption: generatedCaption,
      hashtags: ['#عمده_فروشی', '#پوشاک_زنانه', '#بازار_بزرگ_تهران', '#شلوار_زنانه'],
      channels: {
        telegram: true,
        rubika: true,
        eitaa: true,
        bale: false,
        instagram: true,
      },
      scheduledTime: 'امروز، ساعت ۱۸:۳۰',
      status: 'scheduled',
    };

    onAddSocialPost(newPost);
    alert('پست با موفقیت برای ارسال خودکار زمان‌بندی شد!');
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleAddNewRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newResponse.trim()) return;

    const newRule: AutoResponderRule = {
      id: Date.now().toString(),
      title: `پاسخ خودکار به "${newKeyword.trim()}"`,
      keywords: newKeyword.split(',').map(k => k.trim()),
      response: newResponse.trim(),
      channels: ['تلگرام', 'ایتا', 'روبیکا', 'بله'],
      isActive: true,
    };

    onAddAutoResponder(newRule);
    setRulesList([newRule, ...rulesList]);
    setNewKeyword('');
    setNewResponse('');
  };

  return (
    <div id="marketing-ai-module" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Module Navigation Tabs */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="p-3 bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] rounded-2xl shadow-2xs">
              <Sparkles className="w-7 h-7" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-[#18181B]">
                  بازاریابی هوشمند، دستیار سئو و اتوماسیون کانال‌ها
                </h2>
                <span className="bg-[#FAF7F2] text-[#8C6D37] border border-[#DDD5C0] text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  رتبه ۱ گوگل و جذب مشتری
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                تولید محتوای هوشمند برای تسخیر صفحه اول گوگل، تولید کپشن تلگرام/ایتا و پاسخگویی خودکار
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>اتصال فعال به موتور هوش مصنوعی و کانال‌ها</span>
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#E6DEC8] text-xs overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('seo_assistant')}
            className={`px-4 py-2.5 rounded-xl font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'seo_assistant'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Globe className="w-4 h-4 text-[#D4AF37]" />
            <span>دستیار فوق‌تخصصی سئو و رتبه ۱ گوگل</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_generator')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ai_generator'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>تولید هوشمند کپشن و هشتگ کانال‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('channels_scheduler')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'channels_scheduler'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>زمان‌بندی ارسال به کانال‌ها ({socialPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('auto_responder')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'auto_responder'
                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                : 'text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>ربات پاسخگوی ۲۴ ساعته</span>
          </button>
        </div>
      </div>

      {/* Tab 1: SEO Assistant (Rendered via SeoAssistantModule) */}
      {activeTab === 'seo_assistant' && (
        <SeoAssistantModule
          products={products}
          siteSettings={siteSettings}
          onUpdateSiteSettings={onUpdateSiteSettings}
        />
      )}

      {/* Tab 2: AI Caption Generator */}
      {activeTab === 'ai_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Input Column */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 text-xs">
            <h3 className="font-black text-sm text-[#18181B] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#8C6D37]" />
              <span>انتخاب محصول و مشخصات برای تولید محتوا</span>
            </h3>

            <div>
              <label className="block font-bold text-stone-800 mb-1.5">انتخاب کالای ژورنالی از انبار:</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] text-xs font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku} - پک {p.packSize} تایی)</option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] space-y-2">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover rounded-lg border border-[#DDD5C0]"
                />
                <div className="grid grid-cols-2 gap-2 text-stone-700 text-[11px]">
                  <div><span>جنس:</span> <strong>{selectedProduct.fabricType}</strong></div>
                  <div><span>پک:</span> <strong className="text-[#8C6D37]">{selectedProduct.packSize} تایی</strong></div>
                  <div><span>رنگ‌ها:</span> <strong>{selectedProduct.colors.slice(0, 3).join('، ')}</strong></div>
                  <div><span>قیمت پک:</span> <strong>{selectedProduct.baseWholesalePricePerPack.toLocaleString('fa-IR')} ت</strong></div>
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-stone-800 mb-1.5">کانال و پلتفرم هدف:</label>
              <select
                value={targetChannel}
                onChange={(e) => setTargetChannel(e.target.value)}
                className="w-full bg-[#FAF7F2] p-2.5 rounded-xl border border-[#DDD5C0] text-xs font-bold text-stone-900 outline-none focus:border-[#D4AF37]"
              >
                <option value="تلگرام و روبیکا">تلگرام و روبیکا (فروش عمده سریع)</option>
                <option value="ایتا و بله">ایتا و بله (مشتریان سنتی و شهرستانی)</option>
                <option value="اینستاگرام">اینستاگرام (ریلز و پست ژورنالی)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateAICaption}
              disabled={isGenerating}
              className="w-full bg-[#18181B] hover:bg-stone-800 disabled:opacity-50 text-[#FAF7F2] font-black py-3 rounded-xl transition-all shadow-xs border border-[#3F3F46] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{isGenerating ? 'در حال تولید هوشمند کپشن با Gemini...' : 'تولید کپشن هوش مصنوعی با ۱ کلیک'}</span>
            </button>
          </div>

          {/* Right / Generated Preview Column */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
                <span className="font-black text-sm text-[#18181B]">پیش‌نمایش متن تولید شده</span>
                {generatedCaption && (
                  <button
                    onClick={handleCopyCaption}
                    className="text-xs bg-[#FAF7F2] hover:bg-[#E6DEC8] text-[#18181B] border border-[#DDD5C0] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
                  >
                    {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSuccess ? 'کپی شد!' : 'کپی متن'}</span>
                  </button>
                )}
              </div>

              {generatedCaption ? (
                <div className="mt-3 p-4 bg-[#FAF7F2] rounded-xl border border-[#DDD5C0] max-h-96 overflow-y-auto font-sans leading-relaxed text-xs text-stone-800 whitespace-pre-line">
                  {generatedCaption}
                </div>
              ) : (
                <div className="mt-8 text-center p-8 text-stone-400 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-[#D4AF37] animate-bounce" />
                  <p className="text-xs font-bold text-stone-600">برای تولید متن آماده انتشار روی دکمه تولید کپشن کلیک کنید.</p>
                </div>
              )}
            </div>

            {generatedCaption && (
              <div className="pt-4 border-t border-[#E6DEC8] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <span>آماده انتشار در:</span>
                  <span className="font-black text-stone-900">تلگرام • روبیکا • ایتا • بله • اینستا</span>
                </div>

                <button
                  onClick={handleSchedulePost}
                  className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all border border-[#3F3F46] flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>زمان‌بندی و انتشار در تمام کانال‌ها</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 3: Channels Scheduler */}
      {activeTab === 'channels_scheduler' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-3">
            <h3 className="font-black text-sm text-[#18181B]">پست‌های زمان‌بندی شده برای انتشار در پیام‌رسان‌ها</h3>
            
            <div className="divide-y divide-[#FAF7F2] text-xs">
              {socialPosts.map((post) => (
                <div key={post.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={post.image} alt={post.productName} className="w-14 h-14 rounded-xl object-cover border border-[#DDD5C0] shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-900">{post.productName}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{post.caption.slice(0, 80)}...</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">تلگرام</span>
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-md">روبیکا</span>
                        <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-md">ایتا</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="font-black text-[#8C6D37] bg-[#FAF7F2] px-3 py-1 rounded-xl border border-[#DDD5C0] text-[11px]">
                      {post.scheduledTime}
                    </span>
                    <button
                      onClick={() => alert('پست در کانال تلگرام و روبیکا منتشر شد!')}
                      className="bg-[#18181B] hover:bg-stone-800 text-[#FAF7F2] font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all border border-[#3F3F46]"
                    >
                      ارسال فوری
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Auto Responder Bot */}
      {activeTab === 'auto_responder' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
            <div>
              <h3 className="font-black text-sm text-[#18181B]">ربات پاسخگویی خودکار به سوالات مشتریان بازاری</h3>
              <p className="text-[11px] text-stone-500">پاسخ ۲۴ ساعته به سوالات موجودی، قیمت پک، چک و باربری در تلگرام و ایتا</p>
            </div>
          </div>

          <div className="space-y-3">
            {rulesList.map((rule) => (
              <div key={rule.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DDD5C0] space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-stone-900 font-black">{rule.title}</strong>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    فعال در {rule.channels.join('، ')}
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-stone-500 text-[11px]">کلمات کلیدی محرک:</span>
                  {rule.keywords.map((kw, idx) => (
                    <span key={idx} className="bg-white text-stone-800 px-2 py-0.5 rounded-lg border border-[#DDD5C0] text-[10px] font-bold">
                      {kw}
                    </span>
                  ))}
                </div>

                <p className="text-stone-800 bg-white p-3 rounded-xl border border-[#DDD5C0] whitespace-pre-line text-[11px] leading-relaxed">
                  {rule.response}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
