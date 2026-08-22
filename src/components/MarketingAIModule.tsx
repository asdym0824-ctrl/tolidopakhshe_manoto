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
  Check
} from 'lucide-react';
import { Product, SocialPost, AutoResponderRule } from '../types';

interface MarketingAIModuleProps {
  products: Product[];
  socialPosts: SocialPost[];
  autoResponders: AutoResponderRule[];
  onAddSocialPost: (post: SocialPost) => void;
  onAddAutoResponder: (rule: AutoResponderRule) => void;
}

export const MarketingAIModule: React.FC<MarketingAIModuleProps> = ({
  products,
  socialPosts,
  autoResponders,
  onAddSocialPost,
  onAddAutoResponder,
}) => {
  const [activeTab, setActiveTab] = useState<'ai_generator' | 'channels_scheduler' | 'auto_responder' | 'seo_assistant'>('ai_generator');
  
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
      id: `post-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      image: selectedProduct.image,
      caption: generatedCaption,
      hashtags: ['#عمده_فروشی', '#پوشاک_زنانه', '#بازار_بزرگ_تهران'],
      channels: {
        telegram: true,
        rubika: true,
        eitaa: true,
        bale: true,
        instagram: true,
      },
      scheduledTime: 'امروز ساعت ۱۸:۳۰',
      status: 'scheduled',
    };

    onAddSocialPost(newPost);
    alert('پست با موفقیت برای ارسال همزمان به ۵ پیام‌رسان زمان‌بندی شد!');
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div id="marketing-module" className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-100 text-purple-800 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                اتوماسیون بازاریابی، کپشن هوش مصنوعی و کانال‌ها
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                تولید ۱-کلیکی متن جذاب بازاری، انتشار همزمان در تلگرام، روبیکا، ایتا، بله و ربات پاسخگوی خودکار به مشتریان
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>اتصال فعال به ۵ پیام‌رسان</span>
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100 text-xs">
          <button
            onClick={() => setActiveTab('ai_generator')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ai_generator' ? 'bg-purple-600 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تولید هوشمند کپشن و هشتگ</span>
          </button>

          <button
            onClick={() => setActiveTab('channels_scheduler')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'channels_scheduler' ? 'bg-purple-600 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>زمان‌بندی ارسال به کانال‌ها ({socialPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('auto_responder')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'auto_responder' ? 'bg-purple-600 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>ربات پاسخگوی سوالات پرتکرار</span>
          </button>

          <button
            onClick={() => setActiveTab('seo_assistant')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'seo_assistant' ? 'bg-purple-600 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>دستیار سئو فروشگاه آنلاین</span>
          </button>
        </div>
      </div>

      {/* Tab 1: AI Caption Generator */}
      {activeTab === 'ai_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Input Column */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span>انتخاب محصول و مشخصات برای تولید محتوا</span>
            </h3>

            <div>
              <label className="block font-bold text-stone-700 mb-1">انتخاب کالای ژورنالی از انبار:</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs font-bold"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover rounded-lg border border-stone-200"
                />
                <div className="grid grid-cols-2 gap-1.5 text-stone-600 text-[11px]">
                  <div><span>جنس:</span> <strong>{selectedProduct.fabricType}</strong></div>
                  <div><span>پک:</span> <strong className="text-amber-800">{selectedProduct.packSize} تایی</strong></div>
                  <div><span>رنگ‌ها:</span> <strong>{selectedProduct.colors.slice(0, 3).join('، ')}</strong></div>
                  <div><span>قیمت پک:</span> <strong>{selectedProduct.baseWholesalePricePerPack.toLocaleString('fa-IR')} ت</strong></div>
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">کانال هدف:</label>
              <select
                value={targetChannel}
                onChange={(e) => setTargetChannel(e.target.value)}
                className="w-full bg-stone-50 p-2 rounded-xl border border-stone-200 text-xs"
              >
                <option value="تلگرام و روبیکا">تلگرام و روبیکا (فروش عمده سریع)</option>
                <option value="ایتا و بله">ایتا و بله (مشتریان سنتی و شهرستانی)</option>
                <option value="اینستاگرام">اینستاگرام (ریلز و پست ژورنالی)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateAICaption}
              disabled={isGenerating}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'در حال تولید هوشمند کپشن با Gemini...' : 'تولید کپشن هوش مصنوعی با ۱ کلیک'}</span>
            </button>
          </div>

          {/* Right / Generated Preview Column */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-bold text-sm text-stone-900">پیش‌نمایش متن تولید شده</span>
                {generatedCaption && (
                  <button
                    onClick={handleCopyCaption}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSuccess ? 'کپی شد!' : 'کپی متن'}</span>
                  </button>
                )}
              </div>

              {generatedCaption ? (
                <div className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-200 max-h-96 overflow-y-auto font-sans leading-relaxed text-xs text-stone-800 whitespace-pre-line">
                  {generatedCaption}
                </div>
              ) : (
                <div className="mt-8 text-center p-8 text-stone-400 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-stone-300 animate-bounce" />
                  <p className="text-xs">برای تولید متن آماده انتشار روی دکمه تولید کپشن کلیک کنید.</p>
                </div>
              )}
            </div>

            {generatedCaption && (
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <span>انتشار در:</span>
                  <span className="font-bold text-stone-800">تلگرام • روبیکا • ایتا • بله • اینستا</span>
                </div>

                <button
                  onClick={handleSchedulePost}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>زمان‌بندی و انتشار در تمام کانال‌ها</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Channels Scheduler */}
      {activeTab === 'channels_scheduler' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900">پست‌های زمان‌بندی شده برای انتشار در پیام‌رسان‌ها</h3>
            
            <div className="divide-y divide-stone-100 text-xs">
              {socialPosts.map((post) => (
                <div key={post.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={post.image} alt={post.productName} className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-900">{post.productName}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{post.caption.slice(0, 80)}...</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="bg-blue-100 text-blue-800 text-[9px] px-1.5 py-0.2 rounded">تلگرام</span>
                        <span className="bg-purple-100 text-purple-800 text-[9px] px-1.5 py-0.2 rounded">روبیکا</span>
                        <span className="bg-orange-100 text-orange-800 text-[9px] px-1.5 py-0.2 rounded">ایتا</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-[11px]">
                      {post.scheduledTime}
                    </span>
                    <button
                      onClick={() => alert('پست در کانال تلگرام و روبیکا منتشر شد!')}
                      className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
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

      {/* Tab 3: Auto Responder Bot */}
      {activeTab === 'auto_responder' && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-stone-900">ربات پاسخگویی خودکار به سوالات مشتریان بازاری</h3>
              <p className="text-[11px] text-stone-500">پاسخ ۲۴ ساعته به سوالات موجودی، قیمت پک، چک و باربری در تلگرام و ایتا</p>
            </div>
          </div>

          <div className="space-y-3">
            {rulesList.map((rule) => (
              <div key={rule.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-stone-900">{rule.title}</strong>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    فعال در {rule.channels.join('، ')}
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-stone-500 text-[11px]">کلمات کلیدی محرک:</span>
                  {rule.keywords.map((kw, idx) => (
                    <span key={idx} className="bg-stone-200 text-stone-800 px-1.5 py-0.2 rounded text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>

                <p className="text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200 whitespace-pre-line text-[11px] leading-relaxed">
                  {rule.response}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: SEO Assistant */}
      {activeTab === 'seo_assistant' && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-stone-900">دستیار سئو و تولید متا تگ‌های فروشگاه آنلاین</h3>
          <p className="text-stone-500 text-[11px]">بهینه‌سازی برای جستجوی گوگل خریداران عمده و مغازه‌داران شهرستان</p>
          
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div>
              <span className="text-stone-500 block mb-1">عنوان سئو بهینه شده:</span>
              <p className="font-bold text-stone-900">تولیدی و عمده‌فروشی شلوار زنانه بازار بزرگ تهران | پخش مستقیم پکی</p>
            </div>
            <div>
              <span className="text-stone-500 block mb-1">توضیحات متا (Meta Description):</span>
              <p className="text-stone-700 leading-relaxed">
                خرید عمده شلوار زنانه، شلوار بگ کتان لایت، شلوار راحتی نخی ۱۲ تایی و لگ غواصی با قیمت تولیدی راسته بازار تهران. ارسال فوری با باربری وطن و تیپاکس به سراسر کشور.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
