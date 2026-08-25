import React from 'react';
import { StorefrontBanner, StorefrontBannerAction } from '../../types';
import { BRAND_INFO } from '../../data/brandInfo';
import { 
  Flame, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Package, 
  Scissors, 
  Store, 
  Tag, 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  PhoneCall, 
  MapPin, 
  ShoppingBag,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

interface StorefrontMidGridBannerProps {
  banner: StorefrontBanner;
  onOpenWholesaleModal?: () => void;
  onOpenAboutModal?: () => void;
  onOpenRoutingMap?: () => void;
  onFilterRetail?: () => void;
  onScrollCatalog?: () => void;
  className?: string;
}

export const StorefrontMidGridBanner: React.FC<StorefrontMidGridBannerProps> = ({
  banner,
  onOpenWholesaleModal,
  onOpenAboutModal,
  onOpenRoutingMap,
  onFilterRetail,
  onScrollCatalog,
  className = '',
}) => {
  if (!banner.isActive) return null;

  const handleAction = (action: StorefrontBannerAction, target?: string) => {
    switch (action) {
      case 'wholesale_modal':
        onOpenWholesaleModal?.();
        break;
      case 'about_modal':
        onOpenAboutModal?.();
        break;
      case 'routing_map':
        onOpenRoutingMap?.();
        break;
      case 'telegram':
        window.open(target || BRAND_INFO.telegramUrl, '_blank', 'noopener,noreferrer');
        break;
      case 'whatsapp':
        window.open(target || BRAND_INFO.whatsappDirectUrl, '_blank', 'noopener,noreferrer');
        break;
      case 'call_sales':
        window.location.href = `tel:${target || BRAND_INFO.primaryPhone}`;
        break;
      case 'retail_filter':
        onFilterRetail?.();
        break;
      case 'scroll_catalog':
        onScrollCatalog?.();
        break;
      default:
        break;
    }
  };

  // Render Icon
  const renderIcon = () => {
    const iconClass = "w-5 h-5 sm:w-6 sm:h-6";
    switch (banner.iconType) {
      case 'flame':
        return <Flame className={iconClass} />;
      case 'sparkles':
        return <Sparkles className={iconClass} />;
      case 'truck':
        return <Truck className={iconClass} />;
      case 'shield':
        return <ShieldCheck className={iconClass} />;
      case 'package':
        return <Package className={iconClass} />;
      case 'scissors':
        return <Scissors className={iconClass} />;
      case 'store':
        return <Store className={iconClass} />;
      case 'tag':
      default:
        return <Tag className={iconClass} />;
    }
  };

  // Theme Styles
  const getThemeStyles = () => {
    switch (banner.styleVariant) {
      case 'dark_emerald':
        return {
          container: 'bg-gradient-to-br from-emerald-950 via-[#062e20] to-[#031c13] border-emerald-700/40 text-emerald-50',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          iconBg: 'bg-emerald-900/60 text-emerald-400 border-emerald-600/40',
          title: 'text-white',
          highlight: 'text-emerald-400',
          primaryBtn: 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black shadow-lg shadow-emerald-950/50',
          secondaryBtn: 'bg-emerald-900/40 hover:bg-emerald-900/70 text-emerald-200 border-emerald-700/50',
          patternGlow: 'bg-emerald-500/10'
        };
      case 'amber_bazaar':
        return {
          container: 'bg-gradient-to-br from-[#2a170e] via-[#3d2012] to-[#1c0f09] border-amber-700/40 text-amber-50',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          iconBg: 'bg-amber-900/60 text-amber-400 border-amber-600/40',
          title: 'text-white',
          highlight: 'text-amber-400',
          primaryBtn: 'bg-[#D4AF37] hover:bg-[#c49f2e] text-[#18181B] font-black shadow-lg shadow-amber-950/50',
          secondaryBtn: 'bg-amber-900/40 hover:bg-amber-900/70 text-amber-200 border-amber-700/50',
          patternGlow: 'bg-amber-500/10'
        };
      case 'purple_royal':
        return {
          container: 'bg-gradient-to-br from-[#1f102e] via-[#2f1547] to-[#140a1e] border-purple-600/40 text-purple-50',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          iconBg: 'bg-purple-900/60 text-purple-300 border-purple-600/40',
          title: 'text-white',
          highlight: 'text-purple-300',
          primaryBtn: 'bg-purple-500 hover:bg-purple-400 text-stone-950 font-black shadow-lg shadow-purple-950/50',
          secondaryBtn: 'bg-purple-900/40 hover:bg-purple-900/70 text-purple-200 border-purple-600/50',
          patternGlow: 'bg-purple-500/10'
        };
      case 'crimson_sale':
        return {
          container: 'bg-gradient-to-br from-[#2c0c14] via-[#42121e] to-[#1c070c] border-rose-700/40 text-rose-50',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          iconBg: 'bg-rose-900/60 text-rose-300 border-rose-600/40',
          title: 'text-white',
          highlight: 'text-rose-400',
          primaryBtn: 'bg-rose-500 hover:bg-rose-400 text-white font-black shadow-lg shadow-rose-950/50',
          secondaryBtn: 'bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 border-rose-700/50',
          patternGlow: 'bg-rose-500/10'
        };
      case 'gold_luxury':
      default:
        return {
          container: 'bg-gradient-to-br from-[#18181B] via-[#27272A] to-[#121215] border-[#D4AF37]/35 text-[#FAF7F2]',
          badge: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30',
          iconBg: 'bg-[#3F3F46]/80 text-[#D4AF37] border-[#D4AF37]/30',
          title: 'text-[#FAF7F2]',
          highlight: 'text-[#D4AF37]',
          primaryBtn: 'bg-[#D4AF37] hover:bg-[#c49f2e] text-[#18181B] font-black shadow-lg shadow-stone-950/50',
          secondaryBtn: 'bg-[#27272A] hover:bg-[#3F3F46] text-[#FAF7F2] border-stone-700',
          patternGlow: 'bg-[#D4AF37]/10'
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div 
      id={`storefront-mid-banner-${banner.id}`}
      className={`relative overflow-hidden rounded-3xl border p-5 sm:p-7 md:p-8 transition-all duration-300 shadow-md ${theme.container} ${className}`}
      dir="rtl"
    >
      {/* Subtle Background Lighting Element */}
      <div className={`absolute -top-16 -left-16 w-56 h-56 rounded-full blur-3xl pointer-events-none ${theme.patternGlow}`} />
      <div className={`absolute -bottom-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none ${theme.patternGlow}`} />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        
        {/* Content Side */}
        <div className="space-y-3 max-w-2xl">
          
          {/* Badge & Tagline */}
          <div className="flex items-center gap-2 flex-wrap">
            {banner.badgeText && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border tracking-wide shadow-2xs ${theme.badge}`}>
                {renderIcon()}
                <span>{banner.badgeText}</span>
              </span>
            )}
            
            {banner.tagline && (
              <span className="text-[11px] sm:text-xs text-stone-300 font-medium hidden xs:inline">
                • {banner.tagline}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-base sm:text-xl md:text-2xl font-black leading-tight tracking-tight ${theme.title}`}>
            {banner.title}
          </h3>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
            {banner.subtitle}
          </p>

        </div>

        {/* Action Buttons Side */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          
          {/* Main CTA Button */}
          <button
            type="button"
            onClick={() => handleAction(banner.buttonAction, banner.buttonTarget)}
            className={`py-3 px-5 sm:px-6 rounded-2xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${theme.primaryBtn}`}
          >
            <span>{banner.buttonText}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Secondary CTA Button (if defined) */}
          {banner.secondaryButtonText && banner.secondaryButtonAction && (
            <button
              type="button"
              onClick={() => handleAction(banner.secondaryButtonAction!, banner.buttonTarget)}
              className={`py-3 px-4 sm:px-5 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${theme.secondaryBtn}`}
            >
              <span>{banner.secondaryButtonText}</span>
              <ChevronLeft className="w-3.5 h-3.5 opacity-70" />
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
