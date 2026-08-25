import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  X, 
  Play, 
  Pause, 
  Check, 
  Film, 
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';

interface VideoUploaderProps {
  id?: string;
  label?: string;
  value?: string;
  onChange: (videoUrl: string) => void;
  videoTitle?: string;
  onTitleChange?: (title: string) => void;
  helpText?: string;
}

// Sample garment fitting and fabric demonstration vertical/compact video clips
const PRESET_GARMENT_VIDEOS = [
  {
    name: 'ویدیو تنخور و چرخش مدل (شلوار بگ)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-a-pair-of-brown-pants-42045-large.mp4',
    desc: 'نمایش فرم تنخور در حرکت و زوایای مختلف',
  },
  {
    name: 'ویدیو تست بافت و ریزش پارچه لینن',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-and-showing-a-light-brown-fabric-42048-large.mp4',
    desc: 'نمای نزدیک از تاروپود و لطافت پارچه',
  },
  {
    name: 'ویدیو دوخت و جزئیات کمر کشی و جیب',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-working-on-a-garment-41584-large.mp4',
    desc: 'نمایش دوخت تمیز کارگاهی و خرج‌کار',
  },
  {
    name: 'ویدیو استایل و ست شلوار با کفش و مانتو',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-casual-urban-outfit-42049-large.mp4',
    desc: 'ایده ست برای جذب و سفارش بیشتر خریداران',
  },
];

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  id = 'product-video-uploader',
  label = 'ویدیو معرفی و تنخور ژورنالی کالا (نمایش در ویترین):',
  value = '',
  onChange,
  videoTitle = '',
  onTitleChange,
  helpText = 'ویدیو تنخور، لمس پارچه یا تست کشسانی را از گوشی آپلود کنید، لینک مستقیم قرار دهید یا از ویدیوهای آماده انتخاب کنید.',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'link' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(value || '');
  }, [value]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check type
    if (!file.type.startsWith('video/')) {
      setErrorMessage('فایل انتخاب شده باید از نوع ویدیو باشد (MP4، WebM، MOV)');
      return;
    }

    // Check size (warn if > 30MB for local storage safety)
    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage('حجم ویدیو بیش از ۳۰ مگابایت است. پیشنهاد می‌شود از ویدیوهای کوتاه فشرده استفاده کنید یا لینک مستقیم قرار دهید.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange(result);
      setUrlInput(result);
      if (onTitleChange && !videoTitle) {
        onTitleChange(file.name.replace(/\.[^/.]+$/, ''));
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setErrorMessage('خطا در خواندن فایل ویدیویی.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyLink = () => {
    if (!urlInput.trim()) {
      onChange('');
      return;
    }
    setErrorMessage(null);
    onChange(urlInput.trim());
  };

  const handleSelectPreset = (presetUrl: string, presetName: string) => {
    setErrorMessage(null);
    onChange(presetUrl);
    setUrlInput(presetUrl);
    if (onTitleChange) {
      onTitleChange(presetName);
    }
  };

  const handleRemoveVideo = () => {
    onChange('');
    setUrlInput('');
    if (onTitleChange) onTitleChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div id={id} className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
          <Film className="w-4 h-4 text-[#8C6D37]" />
          <span>{label}</span>
        </label>
        {value && (
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-700" />
            ویدیو ضمیمه شد
          </span>
        )}
      </div>

      {helpText && (
        <p className="text-[11px] text-stone-500 leading-relaxed">
          {helpText}
        </p>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#DDD5C0] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>آپلود از گوشی / کامپیوتر</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('link')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'link'
              ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>لینک مستقیم ویدیو</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'presets'
              ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>ویدیوهای آماده ژورنالی</span>
        </button>
      </div>

      {/* TAB 1: File Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileUpload}
            className="hidden"
            id={`${id}-file-input`}
          />
          <label
            htmlFor={`${id}-file-input`}
            className="flex flex-col items-center justify-center p-4 sm:p-5 border-2 border-dashed border-[#DDD5C0] hover:border-[#8C6D37] rounded-xl bg-white hover:bg-[#F5EFEB] cursor-pointer transition-all text-center space-y-1.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#8C6D37] group-hover:scale-110 flex items-center justify-center transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-stone-900">
              برای انتخاب ویدیو کلیک کنید یا فایل را بکشید و رها کنید
            </span>
            <span className="text-[10px] text-stone-500">
              فرمت‌های مجاز: MP4, WebM, MOV (فیلم کوتاه تنخور، پرو، تست دوخت و کشسانی)
            </span>
          </label>
        </div>
      )}

      {/* TAB 2: Link Input */}
      {activeTab === 'link' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              dir="ltr"
              placeholder="https://example.com/video-pant-model.mp4"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 bg-white text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-mono focus:border-[#18181B] outline-none"
            />
            <button
              type="button"
              onClick={handleApplyLink}
              className="bg-[#18181B] hover:bg-stone-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              ثبت لینک
            </button>
          </div>
          <span className="text-[10px] text-stone-500 block">
            لینک مستقیم فایل ویدیویی (MP4) از هاست، سرور دانلود یا کلود
          </span>
        </div>
      )}

      {/* TAB 3: Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_GARMENT_VIDEOS.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectPreset(preset.url, preset.name)}
              className={`p-2.5 rounded-xl text-right transition-all border flex items-start gap-2.5 ${
                value === preset.url
                  ? 'bg-amber-50 border-[#D4AF37] ring-1 ring-[#D4AF37]'
                  : 'bg-white border-[#DDD5C0] hover:border-stone-400'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-[#18181B] text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-stone-900 block truncate">{preset.name}</span>
                <span className="text-[10px] text-stone-500 block mt-0.5 line-clamp-1">{preset.desc}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#8C6D37]" />
          <span>در حال پردازش و آماده‌سازی فایل ویدیویی... لطفاً شکیبا باشید.</span>
        </div>
      )}

      {/* Video Preview & Controls Card */}
      {value && (
        <div className="mt-3 p-3 bg-white rounded-xl border border-[#DDD5C0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#8C6D37]" />
              پیش‌نمایش ویدیو در ویترین:
            </span>
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="text-[11px] text-red-600 hover:text-red-800 font-bold flex items-center gap-1 hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              حذف ویدیو
            </button>
          </div>

          {/* Player box */}
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-56 flex items-center justify-center">
            <video
              ref={videoRef}
              src={value}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>

          {/* Optional Video Title input */}
          {onTitleChange && (
            <div className="pt-1">
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                عنوان یا متن کوتاه ویدیو (اختیاری):
              </label>
              <input
                type="text"
                placeholder="مثلاً: ویدیو تست تنخور و کشسانی پارچه در تن مانکن"
                value={videoTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs p-2 rounded-lg border border-[#DDD5C0] focus:bg-white focus:border-[#18181B] outline-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
