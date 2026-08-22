import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Link as LinkIcon, 
  Sparkles, 
  Check, 
  Layers, 
  RefreshCw,
  Plus,
  Eye,
  Camera
} from 'lucide-react';

interface ImageUploaderProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (imageUrl: string) => void;
  galleryValues?: string[];
  onGalleryChange?: (images: string[]) => void;
  allowGallery?: boolean;
  helpText?: string;
}

// Preset high quality wholesale apparel catalog photos
const PRESET_APPAREL_PHOTOS = [
  {
    name: 'شلوار بگ کتان کرم',
    url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=700&auto=format&fit=crop&q=80',
  },
  {
    name: 'شلوار بگ ذغالی ژورنالی',
    url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80',
  },
  {
    name: 'شلوار جاگر پنبه‌ای مشکی',
    url: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=700&auto=format&fit=crop&q=80',
  },
  {
    name: 'لگ غواصی براق مجلسی',
    url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=700&auto=format&fit=crop&q=80',
  },
  {
    name: 'شلوار کارگو ۶ جیب زیتونی',
    url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&auto=format&fit=crop&q=80',
  },
  {
    name: 'شلوار داکرون اداری طوسی',
    url: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=700&auto=format&fit=crop&q=80',
  },
  {
    name: 'دامن شلواری لینن کرم',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80',
  },
  {
    name: 'اسلش دورس اسپرت',
    url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=700&auto=format&fit=crop&q=80',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id = 'product-image-uploader',
  label = 'تصویر مدل و کاتالوگ ژورنالی:',
  value,
  onChange,
  galleryValues = [],
  onGalleryChange,
  allowGallery = true,
  helpText = 'عکس لباس را از گالری/کامپیوتر بکشید، یا از دوربین و کاتالوگ آماده انتخاب کنید',
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const [showPreviewModal, setShowPreviewModal] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Sync url input with value
  useEffect(() => {
    setUrlInput(value || '');
  }, [value]);

  // Compress and convert image file to optimized Base64
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('فایل انتخاب شده باید از نوع تصویر باشد'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Resize if too large to save memory while keeping high quality
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
            resolve(optimizedBase64);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const base64 = await processImageFile(file);
      onChange(base64);
      setUrlInput(base64);
    } catch (err) {
      console.error(err);
      alert('خطا در بارگذاری تصویر. لطفاً تصویر دیگری انتخاب کنید.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onGalleryChange) return;

    try {
      setIsProcessing(true);
      const fileList = Array.from(files) as File[];
      const promises = fileList.map((file) => processImageFile(file));
      const base64List = await Promise.all(promises);
      onGalleryChange([...galleryValues, ...base64List]);
    } catch (err) {
      console.error(err);
      alert('خطا در بارگذاری تصاویر گالری.');
    } finally {
      setIsProcessing(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const base64 = await processImageFile(file);
      onChange(base64);
      setUrlInput(base64);
    } catch (err) {
      console.error(err);
      alert('خطا در بارگذاری فایل انداخته شده.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleRemoveMainImage = () => {
    onChange('');
    setUrlInput('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    if (!onGalleryChange) return;
    onGalleryChange(galleryValues.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div id={id} className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="block text-xs font-black text-stone-900 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-[#8C6D37]" />
          <span>{label}</span>
        </label>

        {/* Mode Selector Buttons */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-[11px] font-bold border border-stone-200">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeMode === 'upload'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-3 h-3 text-[#8C6D37]" />
            <span>آپلود از دستگاه / دوربین</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('presets')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeMode === 'presets'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>کاتالوگ آماده بازار</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeMode === 'url'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LinkIcon className="w-3 h-3 text-stone-500" />
            <span>لینک اینترنتی</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Direct File Upload & Drag-and-Drop */}
      {activeMode === 'upload' && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {!value ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 ${
                isDragging
                  ? 'border-[#8C6D37] bg-[#FAF7F2]'
                  : 'border-stone-300 hover:border-[#8C6D37] bg-stone-50/60 hover:bg-[#FAF7F2]'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DDD5C0] shadow-xs flex items-center justify-center text-[#8C6D37]">
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-xs font-black text-stone-900">
                  {isProcessing ? 'در حال بهینه‌سازی و ذخیره تصویر...' : 'برای آپلود عکس کلیک کنید یا عکس را اینجا بکشید'}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  پشتیبانی از فرمت‌های JPG, PNG, WEBP (کیفیت بالا، حداکثر ۱۰ مگابایت)
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-white border border-[#DDD5C0] text-stone-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                  <Camera className="w-3 h-3 text-[#8C6D37]" />
                  پشتیبانی از دوربین موبایل
                </span>
                <span className="text-[10px] bg-white border border-[#DDD5C0] text-stone-700 px-2.5 py-1 rounded-lg font-bold">
                  فشرده‌سازی خودکار
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#DDD5C0] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative group cursor-pointer" onClick={() => setShowPreviewModal(value)}>
                  <img
                    src={value}
                    alt="تصویر شاخص مدل"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-xl border border-[#DDD5C0] shadow-xs"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-black text-stone-900 block flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                    عکس اصلی کالا با موفقیت بارگذاری شد
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {value.startsWith('data:') ? 'فایل تصویر محلی (ذخیره‌شده)' : 'آدرس تصویر اینترنتی'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C0] text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تغییر عکس</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveMainImage}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold p-1.5 rounded-xl transition-all"
                  title="حذف تصویر"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Apparel Presets Catalog */}
      {activeMode === 'presets' && (
        <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#DDD5C0] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800">
              تصاویر کاتالوگ آماده پوشاک بازار بزرگ (انتخاب سریع با ۱ کلیک):
            </span>
            <span className="text-[10px] text-[#8C6D37] font-black">ژورنال باکیفیت</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {PRESET_APPAREL_PHOTOS.map((preset, idx) => {
              const isSelected = value === preset.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(preset.url);
                    setUrlInput(preset.url);
                  }}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                    isSelected ? 'border-[#8C6D37] ring-2 ring-[#8C6D37]/30 scale-105' : 'border-stone-200 hover:border-[#8C6D37]'
                  }`}
                  title={preset.name}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#8C6D37]/40 flex items-center justify-center text-white">
                      <Check className="w-5 h-5 font-black" />
                    </div>
                  )}
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] p-0.5 text-center truncate">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 3: Direct URL */}
      {activeMode === 'url' && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              dir="ltr"
              placeholder="https://example.com/photo.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-[#FAF7F2] text-xs p-2.5 rounded-xl border border-[#DDD5C0] font-mono text-stone-900 outline-none focus:border-[#8C6D37]"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="bg-[#18181B] hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0"
          >
            ثبت لینک
          </button>
        </div>
      )}

      {/* Additional Gallery / Colorways Photos (Optional) */}
      {allowGallery && onGalleryChange && (
        <div className="pt-2 border-t border-[#E6DEC8]/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span className="text-[11px] font-bold text-stone-800">
                تصاویر گالری و ژورنال تکمیلی (رنگ‌بندی / تنخور):
              </span>
            </div>
            <span className="text-[10px] text-stone-500 font-bold">
              {galleryValues.length} تصویر افزوده شده
            </span>
          </div>

          <input
            type="file"
            ref={galleryInputRef}
            onChange={handleGalleryFilesChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="w-14 h-14 rounded-xl border-2 border-dashed border-stone-300 hover:border-[#8C6D37] bg-stone-50 hover:bg-[#FAF7F2] flex flex-col items-center justify-center text-stone-500 hover:text-[#8C6D37] shrink-0 transition-all"
              title="افزودن عکس بیشتر"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[9px] font-bold mt-0.5">+عکس</span>
            </button>

            {galleryValues.map((imgUrl, idx) => (
              <div key={idx} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-[#DDD5C0] shrink-0">
                <img
                  src={imgUrl}
                  alt={`گالری ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(idx)}
                  className="absolute top-0.5 right-0.5 bg-red-600/90 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="حذف"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Preview Modal */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPreviewModal(null)}
        >
          <div className="relative max-w-xl max-h-[85vh] bg-white p-2 rounded-2xl shadow-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPreviewModal(null)}
              className="absolute top-3 right-3 bg-black/70 text-white p-1.5 rounded-full hover:bg-black z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={showPreviewModal}
              alt="بزرگنمایی تصویر کالا"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {helpText && (
        <p className="text-[10px] text-stone-500 leading-normal">
          💡 {helpText}
        </p>
      )}
    </div>
  );
};
