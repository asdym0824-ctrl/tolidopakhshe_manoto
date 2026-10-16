import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Eye, 
  Check, 
  X, 
  Play, 
  Flame, 
  Gift, 
  ShoppingBag, 
  Film, 
  Palette, 
  Sliders, 
  RotateCcw,
  Tag,
  Link as LinkIcon,
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';
import { 
  Product, 
  SiteSettings, 
  StorefrontStoryItem, 
  StoryActionType, 
  StoryHighlightColor, 
  TrainMotionSpeed 
} from '../../types';
import { DEFAULT_STOREFRONT_STORIES } from '../../data/defaultStories';
import { toPersianDigits } from '../../utils/persianWriting';

interface StoryContentManagerProps {
  products: Product[];
  siteSettings: SiteSettings;
  onUpdateSiteSettings?: (settings: SiteSettings) => void;
}

const PRESET_SAMPLE_IMAGES = [
  { label: 'شلوار بگ کتان لایت', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80' },
  { label: 'شلوار نیم‌بگ راسته', url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80' },
  { label: 'شلوار کارگو شش‌جیب', url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop&q=80' },
  { label: 'بوت‌کات کرپ مازراتی', url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&auto=format&fit=crop&q=80' },
  { label: 'پشت صحنه کارگاه خیاطی', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80' },
  { label: 'طاقه پارچه کتان بازار مولوی', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80' },
  { label: 'استایل دخترانه خیام', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80' },
  { label: 'تن‌خور ژورنالی مجلسی', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80' },
];

export const StoryContentManager: React.FC<StoryContentManagerProps> = ({
  products,
  siteSettings,
  onUpdateSiteSettings,
}) => {
  // Current stories from siteSettings or fallback to default
  const stories: StorefrontStoryItem[] = siteSettings.storefrontStories && siteSettings.storefrontStories.length > 0
    ? siteSettings.storefrontStories
    : DEFAULT_STOREFRONT_STORIES;

  const trainSpeed: TrainMotionSpeed = siteSettings.storiesTrainSpeed || 'very_slow';

  // Modal / Form state for adding/editing a story
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  
  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formActionType, setFormActionType] = useState<StoryActionType>('category');
  const [formActionValue, setFormActionValue] = useState('شلوار بگ');
  const [formBadgeText, setFormBadgeText] = useState('جدید');
  const [formBadgeType, setFormBadgeType] = useState<StorefrontStoryItem['badgeType']>('new');
  const [formHighlightColor, setFormHighlightColor] = useState<StoryHighlightColor>('gold');
  const [formStoryDescription, setFormStoryDescription] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Extract unique categories from products
  const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Save stories update helper
  const handleSaveStories = (newStories: StorefrontStoryItem[], newSpeed?: TrainMotionSpeed) => {
    if (!onUpdateSiteSettings) return;
    const updatedSettings: SiteSettings = {
      ...siteSettings,
      storefrontStories: newStories,
      ...(newSpeed !== undefined ? { storiesTrainSpeed: newSpeed } : {}),
    };
    onUpdateSiteSettings(updatedSettings);
  };

  // Open modal to add new story
  const handleOpenAddModal = () => {
    setEditingStoryId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormImage(products[0]?.image || PRESET_SAMPLE_IMAGES[0].url);
    setFormVideoUrl('');
    setFormActionType('category');
    setFormActionValue(uniqueCategories[0] || 'شلوار بگ');
    setFormBadgeText('جدید');
    setFormBadgeType('new');
    setFormHighlightColor('gold');
    setFormStoryDescription('');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  // Open modal to edit existing story
  const handleOpenEditModal = (story: StorefrontStoryItem) => {
    setEditingStoryId(story.id);
    setFormTitle(story.title);
    setFormSubtitle(story.subtitle || '');
    setFormImage(story.image);
    setFormVideoUrl(story.videoUrl || '');
    setFormActionType(story.actionType);
    setFormActionValue(story.actionValue || '');
    setFormBadgeText(story.badgeText || '');
    setFormBadgeType(story.badgeType || 'custom');
    setFormHighlightColor(story.highlightRingColor || 'gold');
    setFormStoryDescription(story.storyDescription || '');
    setFormIsActive(story.isActive);
    setIsModalOpen(true);
  };

  // Handle submit form (add or update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('لطفاً عنوان استوری را وارد کنید.');
      return;
    }
    if (!formImage.trim()) {
      alert('لطفاً تصویر استوری را انتخاب یا آدرس آن را وارد فرمایید.');
      return;
    }

    if (editingStoryId) {
      // Update
      const updated = stories.map(s => {
        if (s.id === editingStoryId) {
          return {
            ...s,
            title: formTitle.trim(),
            subtitle: formSubtitle.trim() || undefined,
            image: formImage.trim(),
            videoUrl: formVideoUrl.trim() || undefined,
            actionType: formActionType,
            actionValue: formActionValue.trim(),
            badgeText: formBadgeText.trim() || undefined,
            badgeType: formBadgeType,
            highlightRingColor: formHighlightColor,
            storyDescription: formStoryDescription.trim() || undefined,
            isActive: formIsActive,
          };
        }
        return s;
      });
      handleSaveStories(updated);
      showToast('استوری موردنظر با موفقیت به‌روزرسانی شد.');
    } else {
      // Add new
      const newStory: StorefrontStoryItem = {
        id: `story-${Date.now()}`,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        image: formImage.trim(),
        videoUrl: formVideoUrl.trim() || undefined,
        actionType: formActionType,
        actionValue: formActionValue.trim(),
        badgeText: formBadgeText.trim() || undefined,
        badgeType: formBadgeType,
        highlightRingColor: formHighlightColor,
        storyDescription: formStoryDescription.trim() || undefined,
        isActive: formIsActive,
        order: stories.length + 1,
        createdAt: new Date().toLocaleDateString('fa-IR'),
      };
      handleSaveStories([...stories, newStory]);
      showToast('استوری جدید با موفقیت به قطار استوری‌های ویترین افزوده شد.');
    }

    setIsModalOpen(false);
  };

  // Toggle active status
  const handleToggleActive = (id: string) => {
    const updated = stories.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s);
    handleSaveStories(updated);
    showToast('وضعیت انتشار استوری تغییر کرد.');
  };

  // Delete story
  const handleDeleteStory = (id: string) => {
    if (!window.confirm('آیا از حذف این استوری از نوار قطاری اطمینان دارید؟')) return;
    const updated = stories.filter(s => s.id !== id);
    handleSaveStories(updated);
    showToast('استوری با موفقیت حذف شد.');
  };

  // Move up or down
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stories.length) return;

    const copy = [...stories];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // reassign order numbers
    const reordered = copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    handleSaveStories(reordered);
  };

  // Reset to default stories
  const handleResetToDefault = () => {
    if (!window.confirm('آیا می‌خواهید استوری‌ها به چینش اولیه و استاندارد تولیدی من و تو بازگردند؟')) return;
    handleSaveStories(DEFAULT_STOREFRONT_STORIES);
    showToast('استوری‌ها به حالت پیش‌فرض بازگردانی شدند.');
  };

  // Change speed
  const handleSetSpeed = (newSpeed: TrainMotionSpeed) => {
    handleSaveStories(stories, newSpeed);
    showToast(
      newSpeed === 'very_slow' ? 'سرعت قطار استوری روی خیلی آروم (روان و ملایم) تنظیم شد.' :
      newSpeed === 'slow' ? 'سرعت قطار استوری روی آرام تنظیم شد.' :
      newSpeed === 'medium' ? 'سرعت قطار استوری روی متوسط تنظیم شد.' :
      'حرکت خودکار متوقف شد.'
    );
  };

  // Color helper for preview badges
  const getRingGradientClass = (color?: StoryHighlightColor) => {
    switch (color) {
      case 'rose': return 'from-rose-500 via-amber-500 to-yellow-300';
      case 'purple': return 'from-purple-600 via-pink-500 to-amber-400';
      case 'emerald': return 'from-emerald-600 via-teal-500 to-amber-300';
      case 'amber': return 'from-amber-600 via-orange-500 to-yellow-300';
      case 'blue': return 'from-blue-600 via-cyan-500 to-indigo-300';
      case 'gold':
      default:
        return 'from-[#8C6D37] via-[#D4AF37] to-amber-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/40 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black animate-in fade-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Overview & Action Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6DEC8] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#18181B] to-stone-800 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30 shadow-xs flex-shrink-0">
              <Film className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-[#18181B]">
                  مدیریت و تولید استوری‌های قطاری ویترین سایت
                </h3>
                <span className="bg-amber-50 text-[#8C6D37] border border-[#D4AF37]/40 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>🚂 حرکت پیوسته قطاری</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                استوری‌ها در بالای ویترین به صورت یک قطار روان و مداوم حرکت می‌کنند. از اینجا استوری جدید بسازید یا ویرایش کنید.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="بازگردانی به استوری‌های اولیه"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>پیش‌فرض</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-[#18181B] hover:bg-black text-[#D4AF37] text-xs font-black transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ استوری جدید به قطار</span>
            </button>
          </div>
        </div>

        {/* Speed & Motion Controls */}
        <div className="mt-5 pt-4 border-t border-[#E6DEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <span className="font-bold text-stone-700 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#8C6D37]" />
              <span>سرعت حرکت قطاری:</span>
            </span>
            <div className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#DDD5C0] shadow-2xs sm:shadow-none">
              <button
                type="button"
                onClick={() => handleSetSpeed('very_slow')}
                className={`py-2 sm:py-1.5 px-2.5 sm:px-3 rounded-lg font-black transition-all cursor-pointer text-center flex items-center justify-center text-[11px] sm:text-xs ${
                  trainSpeed === 'very_slow'
                    ? 'bg-[#18181B] text-[#D4AF37] shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                خیلی آروم (پیشنهادی)
              </button>
              <button
                type="button"
                onClick={() => handleSetSpeed('slow')}
                className={`py-2 sm:py-1.5 px-2.5 sm:px-3 rounded-lg font-bold transition-all cursor-pointer text-center flex items-center justify-center text-[11px] sm:text-xs ${
                  trainSpeed === 'slow'
                    ? 'bg-[#18181B] text-[#D4AF37] shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                آرام
              </button>
              <button
                type="button"
                onClick={() => handleSetSpeed('medium')}
                className={`py-2 sm:py-1.5 px-2.5 sm:px-3 rounded-lg font-bold transition-all cursor-pointer text-center flex items-center justify-center text-[11px] sm:text-xs ${
                  trainSpeed === 'medium'
                    ? 'bg-[#18181B] text-[#D4AF37] shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                متوسط
              </button>
              <button
                type="button"
                onClick={() => handleSetSpeed('paused')}
                className={`py-2 sm:py-1.5 px-2.5 sm:px-3 rounded-lg font-bold transition-all cursor-pointer text-center flex items-center justify-center text-[11px] sm:text-xs ${
                  trainSpeed === 'paused'
                    ? 'bg-rose-900 text-rose-100 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                توقف خودکار
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-stone-500 font-bold text-[11px]">
            <span>مجموع استوری‌ها: {toPersianDigits(stories.length)} عدد</span>
            <span>•</span>
            <span className="text-emerald-700 font-black">فعال در ویترین: {toPersianDigits(stories.filter(s => s.isActive).length)} عدد</span>
          </div>
        </div>
      </div>

      {/* Live Train Preview inside Admin Panel */}
      <div className="bg-[#FAF7F2] p-4.5 sm:p-5 rounded-2xl border border-[#DDD5C0] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black text-stone-900">پیش‌نمایش زنده قطار استوری‌ها در ویترین:</span>
          </div>
          <span className="text-[10px] text-stone-500">هنگام لمس یا هاور ماوس می‌ایستد</span>
        </div>

        {/* Stories Train Bar */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-3.5 border border-[#E6DEC8] shadow-2xs">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar select-none">
            {stories.filter(s => s.isActive).map((st) => (
              <div
                key={st.id}
                onClick={() => handleOpenEditModal(st)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer"
                title="برای ویرایش کلیک کنید"
              >
                <div className={`relative p-0.5 rounded-full bg-gradient-to-tr ${getRingGradientClass(st.highlightRingColor)} group-hover:scale-105 transition-transform shadow-xs`}>
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-stone-100 border-2 border-white relative">
                    <img 
                      src={st.image} 
                      alt={st.title} 
                      className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-300" 
                    />
                  </div>
                  {st.badgeText && (
                    <span className="absolute -bottom-1 -right-1 text-[8.5px] font-black px-1.5 py-0.2 rounded-full shadow-xs bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/40">
                      {st.badgeText}
                    </span>
                  )}
                </div>
                <span className="text-[10.5px] font-bold text-stone-800 text-center max-w-[64px] truncate group-hover:text-[#8C6D37]">
                  {st.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stories List & Management Cards */}
      <div className="bg-white rounded-2xl border border-[#E6DEC8] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E6DEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#8C6D37]" />
            <h4 className="text-sm font-black text-stone-900">لیست و اولویت استوری‌های قطار</h4>
          </div>
          <span className="text-xs text-stone-500 font-bold">
            با دکمه‌های فلش اولویت نمایش در قطار را تغییر دهید
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {stories.map((story, index) => (
            <div 
              key={story.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-colors ${
                story.isActive ? 'hover:bg-[#FAF7F2]/60' : 'bg-stone-50/70 opacity-65'
              }`}
            >
              {/* Story info */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Order Index & controls */}
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-900 disabled:opacity-20 cursor-pointer"
                    title="حرکت به جلو در قطار"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-black text-stone-700 w-5 text-center">
                    {toPersianDigits(index + 1)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === stories.length - 1}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-900 disabled:opacity-20 cursor-pointer"
                    title="حرکت به عقب در قطار"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Circle Avatar */}
                <div className={`relative p-0.5 rounded-full bg-gradient-to-tr ${getRingGradientClass(story.highlightRingColor)} shrink-0 shadow-xs`}>
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 border border-white">
                    <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                  </div>
                  {story.badgeText && (
                    <span className="absolute -bottom-1 -right-1 text-[8px] font-black px-1.5 py-0.2 rounded-full bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/30">
                      {story.badgeText}
                    </span>
                  )}
                </div>

                {/* Text & Meta */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-stone-900 truncate">{story.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 shrink-0">
                      {story.actionType === 'category' ? `دسته: ${story.actionValue || 'همه'}` :
                       story.actionType === 'video_reels' ? 'ویدیو تن‌خور ژورنالی' :
                       story.actionType === 'promo_popup' ? 'آفر جشنواره' :
                       story.actionType === 'retail_mode' ? 'تک‌فروشی آنلاین' :
                       story.actionType === 'story_modal' ? 'پنجره جزییات استوری' : 'لینک اختصاصی'}
                    </span>
                    {!story.isActive && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                        مخفی در ویترین
                      </span>
                    )}
                  </div>
                  {story.subtitle && (
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{story.subtitle}</p>
                  )}
                  {story.storyDescription && (
                    <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{story.storyDescription}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <button
                  type="button"
                  onClick={() => handleToggleActive(story.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    story.isActive
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-300'
                  }`}
                >
                  {story.isActive ? 'فعال ✓' : 'غیرفعال'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(story)}
                    className="p-2 rounded-xl border border-stone-200 hover:border-[#D4AF37] hover:bg-[#FAF7F2] text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                    title="ویرایش استوری"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteStory(story.id)}
                    className="p-2 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="حذف استوری"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add or Edit Story */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          dir="rtl"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-xl p-5 sm:p-6 space-y-5 border border-[#E6DEC8] shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    {editingStoryId ? 'ویرایش استوری قطاری' : 'افزودن استوری جدید به قطار ویترین'}
                  </h3>
                  <p className="text-[11px] text-stone-500">تنظیم تصویر، برچسب، عملکرد و هاله رنگی استوری</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              
              {/* Row 1: Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    عنوان استوری * (کوتاه و جذاب)
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="مثلاً: کالکشن جدید کرپ مازراتی"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] text-xs font-bold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    زیرعنوان یا توضیح تکمیلی
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="مثلاً: دوخت ۵ لا و خط اتوی ماندگار"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] text-xs text-stone-900"
                  />
                </div>
              </div>

              {/* Row 2: Image Selection */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  آدرس تصویر دایره استوری *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] text-xs text-stone-900 ltr text-left"
                  />
                  {formImage && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-300 flex-shrink-0">
                      <img src={formImage} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Preset quick image picks */}
                <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-[10px] text-stone-500 whitespace-nowrap">انتخاب سریع:</span>
                  {PRESET_SAMPLE_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormImage(preset.url)}
                      className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-[#FAF7F2] hover:text-[#8C6D37] border border-stone-200 text-[10px] font-bold text-stone-700 whitespace-nowrap cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Action Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    هنگام کلیک چه کاری انجام شود؟
                  </label>
                  <select
                    value={formActionType}
                    onChange={(e) => setFormActionType(e.target.value as StoryActionType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] text-xs font-bold text-stone-900 bg-white"
                  >
                    <option value="category">فیلتر و هدایت به دسته‌بندی کالا</option>
                    <option value="video_reels">پخش و فیلتر ویدیو تن‌خور ژورنالی</option>
                    <option value="promo_popup">باز کردن پنجره جشنواره و آفر تخفیف</option>
                    <option value="retail_mode">فعال کردن حالت خرید تکی / آنلاین</option>
                    <option value="story_modal">نمایش پنجره اختصاصی و توضیحات استوری</option>
                    <option value="custom_url">لینک خارجی (کانال تلگرام، ایتا و...)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    مقدار / دسته‌بندی هدف
                  </label>
                  {formActionType === 'category' ? (
                    <select
                      value={formActionValue}
                      onChange={(e) => setFormActionValue(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] text-xs font-bold text-stone-900 bg-white"
                    >
                      <option value="همه">همه مدل‌های ویترین</option>
                      {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formActionValue}
                      onChange={(e) => setFormActionValue(e.target.value)}
                      placeholder={formActionType === 'custom_url' ? 'https://t.me/manoto_pants' : 'توضیح هدف یا لینک'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] text-xs text-stone-900"
                    />
                  )}
                </div>
              </div>

              {/* Row 4: Badge & Color ring */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    متن بج کوچک بالای استوری (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={formBadgeText}
                    onChange={(e) => setFormBadgeText(e.target.value)}
                    placeholder="مثلاً: داغ، جدید، ریلز، تخفیف، تولیدی"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] text-xs font-bold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    رنگ هاله و حلقه نورانی دور استوری
                  </label>
                  <select
                    value={formHighlightColor}
                    onChange={(e) => setFormHighlightColor(e.target.value as StoryHighlightColor)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] text-xs font-bold text-stone-900 bg-white"
                  >
                    <option value="gold">طلایی سلطنتی (پیش‌فرض برند)</option>
                    <option value="rose">یاقوتی و زرشکی (جشنواره / تخفیف)</option>
                    <option value="purple">بنفش ژورنالی (ریلز و ویدیو)</option>
                    <option value="emerald">زمردی بازار (تک‌فروشی و جدید)</option>
                    <option value="amber">کهربایی خنک (لینن و تابستانه)</option>
                    <option value="blue">آبی کلاسیک (کارگاه و تولید)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Detailed Description for modal */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  متن توضیحات کامل استوری (در صورت کلیک مشتری)
                </label>
                <textarea
                  rows={2}
                  value={formStoryDescription}
                  onChange={(e) => setFormStoryDescription(e.target.value)}
                  placeholder="توضیحات پارچه، تن‌خور، ضمانت برش و ارسال مستقیم از بازار بزرگ..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] text-xs text-stone-900 resize-none"
                />
              </div>

              {/* Status checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-story-active"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#D4AF37] rounded border-stone-300 focus:ring-[#D4AF37]"
                />
                <label htmlFor="chk-story-active" className="font-bold text-stone-800 cursor-pointer">
                  این استوری بلافاصله در قطار متحرک ویترین نمایش داده شود (فعال)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold transition-all cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#18181B] hover:bg-black text-[#D4AF37] font-black transition-all shadow-md cursor-pointer"
                >
                  {editingStoryId ? 'ذخیره تغییرات استوری' : 'افزودن به قطار استوری'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
