import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product, StorefrontStoryItem, StoryHighlightColor, TrainMotionSpeed } from '../../types';
import { 
  Sparkles, 
  Package, 
  ShoppingBag, 
  Flame, 
  Layers, 
  Film, 
  Play, 
  Gift, 
  ChevronLeft, 
  ChevronRight,
  Pause,
  Info,
  X,
  ExternalLink,
  Scissors
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persianWriting';
import { DEFAULT_STOREFRONT_STORIES } from '../../data/defaultStories';

interface MobileCategoryStoriesProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  products: Product[];
  salesModeFilter: 'all' | 'retail_only' | 'wholesale_only';
  onSetSalesModeFilter: (filter: 'all' | 'retail_only' | 'wholesale_only') => void;
  onToggleVideoOnly?: () => void;
  isVideoFilterActive?: boolean;
  onOpenPromoPopup?: () => void;
  promoTitle?: string;
  stories?: StorefrontStoryItem[];
  trainSpeed?: TrainMotionSpeed;
  onOpenStoryDetail?: (story: StorefrontStoryItem) => void;
}

export const MobileCategoryStories: React.FC<MobileCategoryStoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  products,
  salesModeFilter,
  onSetSalesModeFilter,
  onToggleVideoOnly,
  isVideoFilterActive = false,
  onOpenPromoPopup,
  promoTitle,
  stories: incomingStories,
  trainSpeed: incomingSpeed,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Use incoming stories if available, otherwise DEFAULT_STOREFRONT_STORIES
  const activeStories: StorefrontStoryItem[] = (
    incomingStories && incomingStories.length > 0 
      ? incomingStories 
      : DEFAULT_STOREFRONT_STORIES
  ).filter(s => s.isActive);

  // Train auto-play state & interactive pause
  const [isTrainPausedByUser, setIsTrainPausedByUser] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Drag-to-scroll support for mouse & touch
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollStartRef = useRef<number>(0);

  // Story Detail Modal State (when clicking on story_modal or story with description)
  const [activeStoryModal, setActiveStoryModal] = useState<StorefrontStoryItem | null>(null);

  // Pause train on interaction (hover, touch, wheel)
  const pauseMotion = useCallback(() => {
    setIsInteracting(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
  }, []);

  // Resume train after gentle pause
  const resumeMotion = useCallback(() => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 1800);
  }, []);

  // Continuous Silky Smooth Train Motion (حالت قطاری روان)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Determine speed in pixels per second
    const speedSetting = incomingSpeed || 'very_slow';
    let pxPerSecond = 16; // very_slow default: ultra calm, readable, relaxing train glide
    if (speedSetting === 'slow') pxPerSecond = 26;
    if (speedSetting === 'medium') pxPerSecond = 42;
    if (speedSetting === 'paused' || isTrainPausedByUser) pxPerSecond = 0;

    if (pxPerSecond === 0) return;

    let animId: number;
    let lastTime = performance.now();
    let scrollDirection = -1; // -1 moves forward through RTL line (leftwards)
    let idleEdgeCounter = 0;

    const tick = (currentTime: number) => {
      const deltaSec = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isInteracting && !isTrainPausedByUser && el) {
        const step = Math.min(pxPerSecond * deltaSec, 3.5);
        const prevScroll = el.scrollLeft;
        
        // Execute frame scroll step (behavior: 'auto' prevents browser animation locks)
        el.scrollBy({ left: scrollDirection * step, behavior: 'auto' });

        // If the scroll didn't move (reached end or start edge), wait a moment and reverse
        const movedDelta = Math.abs(el.scrollLeft - prevScroll);
        if (movedDelta < 0.05) {
          idleEdgeCounter++;
          if (idleEdgeCounter > 15) { // reached boundary
            scrollDirection = -scrollDirection; // reverse train direction smoothly
            idleEdgeCounter = 0;
          }
        } else {
          idleEdgeCounter = 0;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [isInteracting, isTrainPausedByUser, incomingSpeed]);

  // Manual scroll buttons
  const handleScrollBy = (offset: number) => {
    pauseMotion();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
    resumeMotion();
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollStartRef.current = scrollContainerRef.current.scrollLeft;
    pauseMotion();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    scrollContainerRef.current.scrollLeft = scrollStartRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    resumeMotion();
  };

  // Ring gradient styling helper
  const getStoryRingClass = (color?: StoryHighlightColor, isSelected?: boolean) => {
    if (isSelected) {
      return 'bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-amber-200 scale-105 shadow-md ring-2 ring-[#D4AF37]/80 ring-offset-2 animate-story-glow';
    }
    switch (color) {
      case 'rose':
        return 'bg-gradient-to-tr from-rose-500 via-amber-500 to-yellow-300 shadow-xs animate-story-glow group-hover:scale-108';
      case 'purple':
        return 'bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 shadow-xs animate-story-glow group-hover:scale-108';
      case 'emerald':
        return 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-300 shadow-xs group-hover:scale-108';
      case 'amber':
        return 'bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-300 shadow-xs group-hover:scale-108';
      case 'blue':
        return 'bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-300 shadow-xs group-hover:scale-108';
      case 'gold':
      default:
        return 'bg-gradient-to-tr from-[#8C6D37] via-[#D4AF37] to-amber-200 shadow-xs group-hover:scale-108';
    }
  };

  // Handle click on a story item
  const handleStoryClick = (story: StorefrontStoryItem) => {
    pauseMotion();

    switch (story.actionType) {
      case 'category':
        if (story.actionValue) {
          onSelectCategory(story.actionValue);
        } else {
          onSelectCategory('همه');
        }
        window.scrollTo({ top: 480, behavior: 'smooth' });
        break;

      case 'video_reels':
        if (onToggleVideoOnly) {
          onToggleVideoOnly();
        }
        break;

      case 'promo_popup':
        if (onOpenPromoPopup) {
          onOpenPromoPopup();
        }
        break;

      case 'retail_mode':
        onSetSalesModeFilter(salesModeFilter === 'retail_only' ? 'all' : 'retail_only');
        break;

      case 'custom_url':
        if (story.actionValue) {
          window.open(story.actionValue, '_blank', 'noopener,noreferrer');
        }
        break;

      case 'story_modal':
      default:
        setActiveStoryModal(story);
        break;
    }
  };

  return (
    <div 
      id="storefront-stories-carousel"
      className="relative overflow-hidden rounded-3xl p-3.5 sm:p-4.5 space-y-3.5 bg-white/95 backdrop-blur-xl border border-[#EAE4D9] shadow-[0_4px_24px_rgba(24,24,27,0.05)] transition-all duration-300" 
      dir="rtl"
    >
      {/* Subtle Atelier Ambient Glows (Child 1 & 2) */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      
      {/* Top Header with Controls (Child 3) */}
      <div className="flex items-center justify-between px-1 relative z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#18181B] text-[#D4AF37] flex items-center justify-center shadow-xs">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-stone-900">استوری و دسته‌بندی مدل‌ها</span>
              <span className="text-[9px] font-bold text-[#8C6D37] bg-amber-50 border border-[#D4AF37]/30 px-1.5 py-0.5 rounded-md">
                من و تو
              </span>
            </div>
            <p className="text-[10px] text-stone-500 hidden xs:block">
              حرکت روان قطاری • لمس کنید یا برای توقف موقت دست نگه دارید
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Train Auto-Glide Play/Pause Indicator Button */}
          <button
            type="button"
            onClick={() => setIsTrainPausedByUser(prev => !prev)}
            className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold border transition-all cursor-pointer shadow-2xs ${
              !isTrainPausedByUser
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-[#8C6D37] border-[#D4AF37]/40 hover:bg-amber-100'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
            }`}
            title="تغییر وضعیت حرکت خودکار قطار استوری‌ها"
          >
            {!isTrainPausedByUser ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>🚂 قطار روان: فعال</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-stone-600 fill-stone-600" />
                <span>شروع حرکت قطار</span>
              </>
            )}
          </button>

          {/* Quick manual scroll buttons */}
          <div className="hidden sm:flex items-center gap-0.5 bg-stone-100 p-0.5 rounded-full border border-stone-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => handleScrollBy(200)}
              className="p-1 rounded-full hover:bg-white text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              title="ورق زدن به راست"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollBy(-200)}
              className="p-1 rounded-full hover:bg-white text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              title="ورق زدن به چپ"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Child 4: Continuous Train Stories Carousel (Target of CSS Selector) */}
      <div 
        ref={scrollContainerRef}
        onMouseEnter={pauseMotion}
        onMouseLeave={resumeMotion}
        onTouchStart={pauseMotion}
        onTouchEnd={resumeMotion}
        onWheel={pauseMotion}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar select-none cursor-grab active:cursor-grabbing relative z-10 touch-pan-y overscroll-x-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {activeStories.map((story) => {
          const isCategorySelected = story.actionType === 'category' && selectedCategory === (story.actionValue || 'همه');
          const isRetailSelected = story.actionType === 'retail_mode' && salesModeFilter === 'retail_only';
          const isVideoSelected = story.actionType === 'video_reels' && isVideoFilterActive;
          const isSelected = isCategorySelected || isRetailSelected || isVideoSelected;

          return (
            <button
              key={story.id}
              type="button"
              onClick={() => handleStoryClick(story)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Circle Wrapper with Dynamic Glowing Ring */}
              <div 
                className={`relative p-0.5 rounded-full transition-all duration-300 ${getStoryRingClass(story.highlightRingColor, isSelected)}`}
              >
                <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-stone-900 border-2 border-white relative flex items-center justify-center">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  
                  {/* Subtle dark overlay for contrast */}
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />

                  {/* Icon overlay for video reels or promos */}
                  {story.actionType === 'video_reels' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-5 h-5 text-white fill-white drop-shadow-md animate-pulse" />
                    </div>
                  )}

                  {story.actionType === 'promo_popup' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-rose-950/20">
                      <Gift className="w-4 h-4 text-yellow-300 drop-shadow-md animate-bounce" />
                    </div>
                  )}

                  {story.actionType === 'retail_mode' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/20">
                      <ShoppingBag className="w-4 h-4 text-emerald-200 drop-shadow-md" />
                    </div>
                  )}
                </div>

                {/* Badge text (e.g., داغ، جدید، ریلز، تخفیف، تولیدی) */}
                {story.badgeText && (
                  <span
                    className={`absolute -bottom-1 -right-1 text-[8.5px] font-black px-1.5 py-0.2 rounded-full shadow-xs transition-transform duration-200 group-hover:scale-110 flex items-center gap-0.5 ${
                      isSelected
                        ? 'bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/60'
                        : story.badgeType === 'hot'
                        ? 'bg-rose-600 text-white'
                        : story.badgeType === 'video'
                        ? 'bg-purple-600 text-white'
                        : story.badgeType === 'discount'
                        ? 'bg-amber-600 text-white'
                        : 'bg-[#18181B] text-[#D4AF37] border border-[#D4AF37]/30'
                    }`}
                  >
                    {story.badgeText}
                  </span>
                )}
              </div>

              {/* Story Title */}
              <span
                className={`text-[11px] font-bold text-center max-w-[70px] truncate transition-colors ${
                  isSelected ? 'text-[#18181B] font-black' : 'text-stone-700 group-hover:text-stone-900'
                }`}
              >
                {story.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Story Detail Modal (When user taps on an informational story) */}
      {activeStoryModal && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          dir="rtl"
          onClick={() => setActiveStoryModal(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden border border-[#E6DEC8] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Image Banner */}
            <div className="relative h-60 w-full overflow-hidden bg-stone-900">
              <img 
                src={activeStoryModal.image} 
                alt={activeStoryModal.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <button
                type="button"
                onClick={() => setActiveStoryModal(null)}
                className="absolute top-3 left-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 right-4 left-4 text-white">
                {activeStoryModal.badgeText && (
                  <span className="bg-[#D4AF37] text-[#18181B] text-[10px] font-black px-2 py-0.5 rounded-md mb-1.5 inline-block">
                    {activeStoryModal.badgeText}
                  </span>
                )}
                <h3 className="text-base font-black">{activeStoryModal.title}</h3>
                {activeStoryModal.subtitle && (
                  <p className="text-xs text-stone-200 mt-0.5">{activeStoryModal.subtitle}</p>
                )}
              </div>
            </div>

            {/* Content & Details */}
            <div className="p-5 space-y-4 text-xs">
              {activeStoryModal.storyDescription && (
                <p className="text-stone-700 leading-relaxed font-normal">
                  {activeStoryModal.storyDescription}
                </p>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStoryModal(null);
                    onSelectCategory('همه');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#18181B] text-[#D4AF37] font-black hover:bg-black transition-colors text-center cursor-pointer shadow-xs"
                >
                  مشاهده مدل‌های کارگاه در ویترین
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoryModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
