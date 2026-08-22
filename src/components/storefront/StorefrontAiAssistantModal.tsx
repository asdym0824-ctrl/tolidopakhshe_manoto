import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  RefreshCw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  ExternalLink,
  ChevronDown,
  Maximize2,
  Minimize2,
  Sparkle,
  Zap,
  MessageSquareText,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Product } from '../../types';
import { BRAND_INFO } from '../../data/brandInfo';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: string;
    payload?: string;
  }[];
  source?: 'gemini' | 'knowledge_base' | 'fallback';
}

interface StorefrontAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOpenTracking: () => void;
  onOpenPartnerModal: () => void;
  onOpenAboutModal: () => void;
  onOpenRoutingModal?: () => void;
  onFilterRetailOnly: () => void;
  onSelectCategory: (category: string) => void;
}

const FREQUENT_QUESTIONS_CATEGORIES = [
  {
    id: 'general',
    title: '⭐ پرتکرارترین‌ها',
    icon: Sparkles,
    questions: [
      'آیا امکان خرید تکی هم از سایت وجود دارد؟',
      'حداقل خرید عمده چند تاست و پک‌ها چندتایی هستن؟',
      'هزینه و زمان ارسال به شهرستان با باربری و تیپاکس؟',
      'شرایط خرید با چک صیادی بنفش چیه؟',
      'آدرس دقیق مغازه در بازار بزرگ تهران کجاست؟',
      'جنس پارچه‌ها و ضمانت عدم آبرفت چطوریه؟',
      'چطور وضعیت سفارش و بارنامه خودم را پیگیری کنم؟',
      'راهنمای انتخاب سایز و تنخور شلوارهای زنانه'
    ]
  },
  {
    id: 'wholesale',
    title: '📦 خرید عمده و همکار',
    icon: Package,
    questions: [
      'نحوه فعال‌سازی قیمت همکاری و بنکداری در سایت؟',
      'ارسال روزانه با باربری وطن و پیام‌گیر چطور انجام میشه؟',
      'آیا برای خرید تیراژ بالا تخفیف کارتنی دارید؟',
      'پرفروش‌ترین مدل‌های شلوار برای مغازه و بوتیک چیست؟'
    ]
  },
  {
    id: 'retail',
    title: '🛍️ خرید تکی و آنلاین',
    icon: ShoppingBag,
    questions: [
      'چطور در سایت خرید تکی ثبت کنم؟',
      'آیا امکان ارسال فوری با پیک در تهران هست؟',
      'در صورت مشکل سایز یا زدگی امکان تعویض وجود داره؟',
      'کد رهگیری پستی و تیپاکس کی پیامک میشه؟'
    ]
  },
  {
    id: 'store_visit',
    title: '📍 خرید حضوری و بازار',
    icon: MapPin,
    questions: [
      'نزدیک‌ترین ایستگاه مترو به پاساژ المهدی ۴ کجاست؟',
      'ساعات کاری تولیدی در روزهای عادی و تعطیل؟',
      'شماره تماس مستقیم مدیریت آقای اسدی چیست؟'
    ]
  }
];

export const StorefrontAiAssistantModal: React.FC<StorefrontAiAssistantModalProps> = ({
  isOpen,
  onClose,
  products,
  onOpenTracking,
  onOpenPartnerModal,
  onOpenAboutModal,
  onOpenRoutingModal,
  onFilterRetailOnly,
  onSelectCategory,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `سلام و احترام! 🌸 به **دستیار هوشمند تولیدی و پخش پوشاک من و تو (اسدی)** در بازار بزرگ تهران خوش آمدید.\n\nمن ۲۴ ساعته پاسخگوی تمام سوالات شما درباره **خرید عمده، خرید تکی، ارسال باربری وطن، جنس پارچه‌ها، آدرس حضوری بازار و پیگیری سفارشات** هستم.\n\nمی‌توانید از پرسش‌های آماده زیر استفاده کنید یا سوال دلخواهتان را بنویسید!`,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: '🛍️ مشاهده کاتالوگ شلوارها', actionType: 'view_catalog' },
        { label: '👑 ورود به پنل قیمت همکار', actionType: 'open_partner_modal' },
        { label: '🚚 پیگیری سفارش و بارنامه', actionType: 'open_tracking' }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFaqTab, setActiveFaqTab] = useState('general');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    // Build context summary from products
    const productContext = products.slice(0, 8).map(p => 
      `- ${p.name} (کد: ${p.sku}) | جنس: ${p.fabricType} | عمده: ${p.baseWholesalePricePerPack.toLocaleString('fa-IR')} ت (${p.packSize} تایی) | تک: ${p.allowRetailSale && p.retailPricePerUnit ? p.retailPricePerUnit.toLocaleString('fa-IR') + ' ت' : 'فقط عمده'}`
    ).join('\n');

    try {
      const historyPayload = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const res = await fetch('/api/storefront/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          productContext
        })
      });

      const data = await res.json();

      if (data && data.reply) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: data.suggestedActions || [],
          source: data.source
        };
        setMessages(prev => [...prev, botMsg]);

        // Text-to-speech if active
        if (isSpeechEnabled && 'speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(data.reply.replace(/[*_#\-]/g, ''));
            utterance.lang = 'fa-IR';
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: `پوزش بابت تاخیر در شبکه! تولیدی پوشاک من و تو (اسدی) در بازار بزرگ تهران (پاساژ المهدی ۴، پلاک ۲۴۲) همه روزه آماده خدمت‌رسانی است. برای پاسخ سریع با شماره ۰۹۱۲۰۳۶۹۵۶۷ تماس بگیرید یا در تلگرام با @tolidopakhsh_manoto در ارتباط باشید.`,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: '📞 تماس با مدیریت (اسدی)', actionType: 'call_phone' },
          { label: '📍 آدرس در بازار', actionType: 'open_about' }
        ]
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: string; payload?: string }) => {
    switch (action.actionType) {
      case 'open_tracking':
        onClose();
        onOpenTracking();
        break;
      case 'open_partner_modal':
        onClose();
        onOpenPartnerModal();
        break;
      case 'open_about':
        onClose();
        onOpenAboutModal();
        break;
      case 'open_routing':
      case 'open_location':
        onClose();
        if (onOpenRoutingModal) {
          onOpenRoutingModal();
        } else {
          onOpenAboutModal();
        }
        break;
      case 'filter_retail_only':
        onClose();
        onFilterRetailOnly();
        break;
      case 'filter_category':
        onClose();
        if (action.payload) onSelectCategory(action.payload);
        break;
      case 'view_catalog':
        onClose();
        window.scrollTo({ top: 500, behavior: 'smooth' });
        break;
      case 'call_phone':
        window.open(`tel:${BRAND_INFO.primaryPhone}`, '_self');
        break;
      case 'open_telegram':
        window.open(BRAND_INFO.telegramUrl, '_blank');
        break;
      default:
        break;
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'گفتگو پاکسازی شد. سوال جدید خود را بفرمایید! 🌸',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      
      {/* Container Modal */}
      <div 
        className={`bg-white w-full flex flex-col shadow-2xl transition-all duration-300 rounded-t-3xl sm:rounded-3xl border border-[#E6DEC8] overflow-hidden ${
          isExpanded 
            ? 'h-[96vh] sm:max-w-5xl' 
            : 'h-[88vh] sm:h-[680px] sm:max-w-2xl'
        }`}
      >
        {/* Header */}
        <div className="bg-[#18181B] text-[#FAF7F2] p-4 px-5 border-b border-stone-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-amber-200 text-[#18181B] flex items-center justify-center shadow-md font-black">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#18181B] rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-[#FAF7F2] flex items-center gap-1.5">
                  دستیار هوشمند من و تو
                  <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] px-2 py-0.2 rounded-full font-mono">
                    AI 3.7
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-stone-400">
                مشاور تخصصی خرید عمده، تک‌فروشی و راهنمای بازار تهران
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Speech Toggle */}
            <button
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className={`p-2 rounded-xl text-xs transition-colors ${
                isSpeechEnabled 
                  ? 'bg-[#D4AF37] text-[#18181B] font-bold' 
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
              title={isSpeechEnabled ? 'غیرفعال کردن خوانش صوتی' : 'فعال کردن خوانش صوتی فارسی'}
            >
              {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 text-xs transition-colors"
              title="پاک کردن تاریخچه گفتگو"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Expand / Minimize */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:flex p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 text-xs transition-colors"
              title={isExpanded ? 'کوچک کردن' : 'بزرگ کردن پنجره'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick FAQ Pills Carousel */}
        <div className="bg-[#FAF7F2] p-2.5 px-4 border-b border-[#E6DEC8] flex-shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {FREQUENT_QUESTIONS_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeFaqTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFaqTab(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all text-[11px] ${
                    isActive 
                      ? 'bg-[#18181B] text-[#D4AF37] shadow-xs' 
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-[#E6DEC8]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Quick FAQ question pills of active tab */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 text-[11px] no-scrollbar">
            {FREQUENT_QUESTIONS_CATEGORIES.find(c => c.id === activeFaqTab)?.questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="bg-white hover:bg-amber-50 hover:border-[#D4AF37] text-stone-700 hover:text-stone-900 border border-[#E6DEC8] px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-2xs font-medium text-[11px] flex-shrink-0 flex items-center gap-1 group"
              >
                <span>{q}</span>
                <ArrowLeft className="w-2.5 h-2.5 text-stone-400 group-hover:text-[#8C6D37] transition-transform group-hover:-translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-stone-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-2xs ${
                  isUser 
                    ? 'bg-stone-800 text-white' 
                    : 'bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/30'
                }`}>
                  {isUser ? 'شما' : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#18181B] text-[#FAF7F2] rounded-tl-xs'
                      : 'bg-white text-stone-800 border border-[#E6DEC8] rounded-tr-xs'
                  }`}>
                    {/* Message text with newline formatting */}
                    <div className="space-y-1.5 whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Action buttons if available from AI */}
                    {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-[#E6DEC8]/60 flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(act)}
                            className="bg-[#FAF7F2] hover:bg-[#8C6D37] hover:text-white text-[#18181B] border border-[#DDD5C0] font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
                          >
                            <span>{act.label}</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Footer: Timestamp & Copy */}
                  <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-stone-400">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-stone-600 transition-colors flex items-center gap-0.5"
                        title="کپی کردن متن پاسخ"
                      >
                        {copiedId === msg.id ? (
                          <span className="text-emerald-600 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> کپی شد
                          </span>
                        ) : (
                          <Copy className="w-2.5 h-2.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 flex-row items-center">
              <div className="w-8 h-8 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-2xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-[#E6DEC8] p-3 rounded-2xl rounded-tr-xs shadow-2xs flex items-center gap-2 text-xs text-stone-500">
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D37] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D37] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D37] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[11px] font-medium">دستیار در حال بررسی و تایپ پاسخ...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E6DEC8] flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="هر سوالی درباره قیمت عمده، خرید تکی، ارسال یا جنس کارها دارید بپرسید..."
              className="flex-1 bg-stone-50 border border-[#DDD5C0] focus:border-[#8C6D37] focus:bg-white rounded-2xl px-4 py-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none transition-all"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className={`p-3 rounded-2xl font-bold transition-all flex items-center justify-center shadow-xs flex-shrink-0 ${
                inputQuery.trim() && !isLoading
                  ? 'bg-[#18181B] text-[#D4AF37] hover:bg-stone-800 active:scale-95'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
              title="ارسال پیام"
            >
              <Send className="w-4 h-4 transform rotate-180" />
            </button>
          </form>

          {/* Quick Footer Links */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[10px] text-stone-500">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[#8C6D37] font-bold">
                <Sparkles className="w-3 h-3" /> پشتیبانی هوشمند Gemini
              </span>
              <span>•</span>
              <span>پاسخگویی آنی</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${BRAND_INFO.primaryPhone}`}
                className="hover:text-[#8C6D37] transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>تماس: {BRAND_INFO.primaryPhoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
