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
          container: 'bg-gradient-to-br from-emerald-950 via-[#062e20] to-[#031c13] border-emerald-600/50 text-emerald-50 shadow-[0_12px_36px_rgba(2,44,29,0.4)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-xs',
          iconBg: 'bg-emerald-900/80 text-emerald-300 border-emerald-500/40',
          title: 'text-white',
          highlight: 'text-emerald-300',
          primaryBtn: 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 hover:brightness-110 text-stone-950 font-black shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-300/50',
          secondaryBtn: 'bg-emerald-900/50 hover:bg-emerald-900/80 text-emerald-100 border border-emerald-600/40 backdrop-blur-sm',
          patternGlow: 'bg-emerald-400/15'
        };
      case 'amber_bazaar':
        return {
          container: 'bg-gradient-to-br from-[#2a170e] via-[#3d2012] to-[#1c0f09] border-[#D4AF37]/50 text-amber-50 shadow-[0_12px_36px_rgba(61,32,18,0.4)]',
          badge: 'bg-amber-500/20 text-amber-300 border-[#D4AF37]/40 shadow-xs',
          iconBg: 'bg-amber-900/80 text-amber-300 border-amber-600/40',
          title: 'text-white',
          highlight: 'text-amber-300',
          primaryBtn: 'bg-gradient-to-r from-[#D4AF37] via-[#E8CB72] to-[#D4AF37] hover:brightness-110 text-[#18181B] font-black shadow-lg shadow-amber-950/60 ring-1 ring-[#D4AF37]/50',
          secondaryBtn: 'bg-amber-900/50 hover:bg-amber-900/80 text-amber-100 border border-amber-600/40 backdrop-blur-sm',
          patternGlow: 'bg-amber-400/15'
        };
      case 'purple_royal':
        return {
          container: 'bg-gradient-to-br from-[#1f102e] via-[#2f1547] to-[#140a1e] border-purple-500/50 text-purple-50 shadow-[0_12px_36px_rgba(47,21,71,0.4)]',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-400/40 shadow-xs',
          iconBg: 'bg-purple-900/80 text-purple-200 border-purple-500/40',
          title: 'text-white',
          highlight: 'text-purple-300',
          primaryBtn: 'bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 hover:brightness-110 text-stone-950 font-black shadow-lg shadow-purple-950/60 ring-1 ring-purple-300/50',
          secondaryBtn: 'bg-purple-900/50 hover:bg-purple-900/80 text-purple-100 border border-purple-500/40 backdrop-blur-sm',
          patternGlow: 'bg-purple-400/15'
        };
      case 'crimson_sale':
        return {
          container: 'bg-gradient-to-br from-[#2c0c14] via-[#42121e] to-[#1c070c] border-rose-600/50 text-rose-50 shadow-[0_12px_36px_rgba(66,18,30,0.4)]',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-xs',
          iconBg: 'bg-rose-900/80 text-rose-200 border-rose-500/40',
          title: 'text-white',
          highlight: 'text-rose-300',
          primaryBtn: 'bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500 hover:brightness-110 text-white font-black shadow-lg shadow-rose-950/60 ring-1 ring-rose-300/50',
          secondaryBtn: 'bg-rose-900/50 hover:bg-rose-900/80 text-rose-100 border border-rose-600/40 backdrop-blur-sm',
          patternGlow: 'bg-rose-400/15'
        };
      case 'gold_luxury':
      default:
        return {
          container: 'bg-gradient-to-br from-[#161618] via-[#222226] to-[#111113] border-[#D4AF37]/45 text-[#FAF7F2] shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/5',
          badge: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40 shadow-xs',
          iconBg: 'bg-[#3F3F46]/90 text-[#D4AF37] border-[#D4AF37]/35',
          title: 'text-white',
          highlight: 'text-[#D4AF37]',
          primaryBtn: 'bg-gradient-to-r from-[#D4AF37] via-[#F3E2A9] to-[#D4AF37] hover:brightness-110 text-[#18181B] font-black shadow-lg shadow-stone-950/60 ring-1 ring-[#D4AF37]/60',
          secondaryBtn: 'bg-white/10 hover:bg-white/15 text-[#FAF7F2] border border-white/20 backdrop-blur-sm',
          patternGlow: 'bg-[#D4AF37]/15'
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div 
      id={`storefront-mid-banner-${banner.id}`}
      className={`relative overflow-hidden rounded-3xl sm:rounded-4xl border p-5 sm:p-7 md:p-8 transition-all duration-300 ${theme.container} ${className}`}
      dir="rtl"
    >
      {/* Subtle Background Lighting Element */}
      <div className={`absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl pointer-events-none ${theme.patternGlow}`} />
      <div className={`absolute -bottom-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none ${theme.patternGlow}`} />

      {/* Atelier Watermark Label */}
      <div className="absolute top-3 left-4 text-[9px] font-mono tracking-widest text-white/20 uppercase pointer-events-none hidden sm:block">
        MANOTO DRESS • ATELIER
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        
        {/* Content Side */}
        <div className="space-y-3 max-w-2xl">
          
          {/* Badge & Tagline */}
          <div className="flex items-center gap-2 flex-wrap">
            {banner.badgeText && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border tracking-wide ${theme.badge}`}>
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
            className={`py-3.5 px-5 sm:px-6 rounded-2xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${theme.primaryBtn}`}
          >
            <span>{banner.buttonText}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Secondary CTA Button (if defined) */}
          {banner.secondaryButtonText && banner.secondaryButtonAction && (
            <button
              type="button"
              onClick={() => handleAction(banner.secondaryButtonAction!, banner.buttonTarget)}
              className={`py-3.5 px-4 sm:px-5 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${theme.secondaryBtn}`}
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
