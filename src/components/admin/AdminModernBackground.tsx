import React from 'react';

/**
 * AdminModernBackground
 * --------------------------------------------------------------------------
 * Premium, bespoke thematic background for the Manoto Dress («من و تو») 
 * Admin Panel & Wholesale Management Dashboard.
 * 
 * Inspired by the storefront's signature garment background pattern, but tailored
 * specifically for the admin ecosystem:
 * 1. Crisp Watermark Vector Pattern Matrix:
 *    - شلوار بگ زنانه (Wide-leg baggy trousers - core product)
 *    - بارکد و اتیکت قیمت کالا (SKU price tag & barcode)
 *    - فاکتور فروش و ثبت سفارش عمده (Invoice & sales document)
 *    - نمودار میله‌ای تحلیل رشد فروش (Analytics growth chart)
 *    - مانکن ژورنالی و کارگاهی (Dress form mannequin)
 *    - قیچی خیاطی و برش الگو (Tailor shears)
 *    - طاقه پارچه کرپ و مازراتی (Textile fabric roll)
 *    - کارتن و مرسوله باربری بنکداری (Wholesale cargo box)
 *    - چوب‌لباسی رگال عمده (Garment hanger)
 * 
 * 2. Floating Thematic Admin Badges:
 *    - Subtly swaying & floating along screen margins with glassmorphism
 * 
 * 3. Multi-layer ambient lighting & contrast mask for 100% data readability.
 */

interface FloatingAdminMotif {
  id: string;
  top: string;
  left?: string;
  right?: string;
  size: number;
  rotation: number;
  animationClass: string;
  opacity: number;
  label: string;
  type: 'pants' | 'tag' | 'chart' | 'invoice' | 'mannequin' | 'scissors' | 'fabric' | 'cargo' | 'hanger' | 'shield';
}

const FLOATING_ADMIN_MOTIFS: FloatingAdminMotif[] = [
  // Top region (under header / summary KPIs)
  { id: 'adm-f-1', top: '130px', right: '1.5%', size: 34, rotation: 8, animationClass: 'animate-garment-float-1', opacity: 0.32, label: 'تولید شلوار', type: 'pants' },
  { id: 'adm-f-2', top: '190px', left: '1.5%', size: 32, rotation: -10, animationClass: 'animate-garment-float-2', opacity: 0.30, label: 'بارکد کالا', type: 'tag' },
  
  // Mid upper region
  { id: 'adm-f-3', top: '390px', right: '1.8%', size: 34, rotation: 12, animationClass: 'animate-garment-float-3', opacity: 0.32, label: 'نمودار فروش', type: 'chart' },
  { id: 'adm-f-4', top: '480px', left: '1.2%', size: 30, rotation: -8, animationClass: 'animate-garment-float-4', opacity: 0.30, label: 'قیچی برش', type: 'scissors' },
  
  // Mid region
  { id: 'adm-f-5', top: '710px', right: '1.2%', size: 36, rotation: -6, animationClass: 'animate-garment-float-2', opacity: 0.32, label: 'مانکن کارگاه', type: 'mannequin' },
  { id: 'adm-f-6', top: '840px', left: '1.8%', size: 32, rotation: 14, animationClass: 'animate-garment-float-1', opacity: 0.30, label: 'فاکتور عمده', type: 'invoice' },
  
  // Lower middle region
  { id: 'adm-f-7', top: '1090px', right: '1.6%', size: 32, rotation: 10, animationClass: 'animate-garment-float-3', opacity: 0.30, label: 'طاقه پارچه', type: 'fabric' },
  { id: 'adm-f-8', top: '1240px', left: '1.4%', size: 34, rotation: -12, animationClass: 'animate-garment-float-4', opacity: 0.32, label: 'باربری شوش', type: 'cargo' },
  
  // Lower table region
  { id: 'adm-f-9', top: '1480px', right: '1.4%', size: 32, rotation: -8, animationClass: 'animate-garment-float-1', opacity: 0.30, label: 'رگال من و تو', type: 'hanger' },
  { id: 'adm-f-10', top: '1680px', left: '1.6%', size: 34, rotation: 12, animationClass: 'animate-garment-float-2', opacity: 0.32, label: 'امنیت سیستم', type: 'shield' },
  { id: 'adm-f-11', top: '1920px', right: '1.8%', size: 32, rotation: 6, animationClass: 'animate-garment-float-3', opacity: 0.30, label: 'تولید بگ', type: 'pants' },
  { id: 'adm-f-12', top: '2150px', left: '1.2%', size: 30, rotation: -10, animationClass: 'animate-garment-float-4', opacity: 0.30, label: 'اتیکت انبار', type: 'tag' }
];

export const AdminModernBackground: React.FC = () => {
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" 
      aria-hidden="true"
    >
      {/* 1. Base Multi-stop Atmospheric Foundation Gradient */}
      <div 
        className="absolute inset-0 bg-[#FAF7F2]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 90% 10%, rgba(212, 175, 55, 0.08) 0%, transparent 45%),
            radial-gradient(circle at 10% 20%, rgba(24, 24, 27, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.7) 0%, transparent 75%),
            radial-gradient(circle at 15% 70%, rgba(16, 185, 129, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 85% 80%, rgba(197, 160, 89, 0.07) 0%, transparent 45%),
            linear-gradient(180deg, #FAF7F2 0%, #F5F0E6 100%)
          `,
        }}
      />

      {/* 2. Soft Animated Ambient Atmosphere Blobs */}
      <div 
        className="absolute -top-24 -right-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-[#D4AF37]/15 via-[#C5A059]/10 to-transparent blur-[95px] animate-admin-blob-1 transform-gpu"
      />
      <div 
        className="absolute top-12 -left-28 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-[#18181B]/[0.05] via-stone-400/[0.04] to-transparent blur-[110px] animate-admin-blob-2 transform-gpu"
      />
      <div 
        className="absolute top-[42%] -left-20 w-[28rem] h-[28rem] rounded-full bg-gradient-to-r from-emerald-600/[0.04] via-[#D4AF37]/[0.03] to-transparent blur-[100px] animate-admin-blob-3 transform-gpu"
      />
      <div 
        className="absolute -bottom-24 right-1/4 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tl from-[#C5A059]/[0.08] via-amber-200/[0.05] to-transparent blur-[105px] animate-admin-blob-4 transform-gpu"
      />

      {/* ========================================================================= */}
      {/* 3. BESPOKE THEMATIC VECTOR WATERMARK PATTERN (نقش وکتور اختصاصی پنل مدیریت)  */}
      {/* Clearly visible, crisp, rich with apparel, warehouse, & admin commerce icons */}
      {/* Opacity boosted to ~0.12 so it stands out like the storefront pattern       */}
      {/* ========================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full text-[#8C6D37] opacity-[0.125] mix-blend-multiply"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="admin-garment-commerce-pattern"
            width="180"
            height="180"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(3)"
          >
            {/* 1. Wide-Leg Baggy Trousers (شلوار بگ من و تو) */}
            <g transform="translate(18, 14)">
              <path
                d="M 6 4 L 28 4 L 31 9 L 35 44 L 21 44 L 17 21 L 13 44 L 0 44 L 3 9 Z"
                fill="currentColor"
                fillOpacity="0.10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="5" y1="8" x2="29" y2="8" stroke="currentColor" strokeWidth="1.2" />
              <line x1="8" y1="13" x2="8" y2="40" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 2" />
              <line x1="27" y1="13" x2="27" y2="40" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 2" />
            </g>

            {/* 2. Barcode & Price SKU Tag (اتیکت بارکددار کالا و انبارداری) */}
            <g transform="translate(112, 16)">
              <path
                d="M 5 2 L 23 2 L 27 7 L 27 34 L 1 34 L 1 7 Z"
                fill="currentColor"
                fillOpacity="0.08"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="14" cy="7" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* Barcode lines */}
              <line x1="6" y1="14" x2="6" y2="28" stroke="currentColor" strokeWidth="1.6" />
              <line x1="10" y1="14" x2="10" y2="28" stroke="currentColor" strokeWidth="1" />
              <line x1="13" y1="14" x2="13" y2="28" stroke="currentColor" strokeWidth="1.8" />
              <line x1="17" y1="14" x2="17" y2="28" stroke="currentColor" strokeWidth="0.9" />
              <line x1="21" y1="14" x2="21" y2="28" stroke="currentColor" strokeWidth="1.4" />
            </g>

            {/* 3. Sales Growth Chart & Analytics (نمودار رشد فروش و مدیریت) */}
            <g transform="translate(18, 102)">
              <rect x="2" y="2" width="34" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
              {/* Trend bar chart columns */}
              <rect x="6" y="18" width="4" height="8" rx="0.8" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.8" />
              <rect x="13" y="13" width="4" height="13" rx="0.8" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.8" />
              <rect x="20" y="8" width="4" height="18" rx="0.8" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 5 16 L 14 11 L 22 6 L 29 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* 4. Coat Hanger (چوب‌لباسی رگال عمده) */}
            <g transform="translate(108, 98)">
              <path
                d="M 14 5 C 14 0, 23 0, 23 6 C 23 11, 18 12, 18 15 L 36 26 C 37 27, 37 29, 35 29 L 2 29 C 0 29, 0 27, 2 26 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="2" y1="29" x2="35" y2="29" stroke="currentColor" strokeWidth="1.3" />
            </g>

            {/* 5. Tailor's Shears (قیچی برش پارچه) */}
            <g transform="translate(68, 54)">
              <circle cx="8" cy="8" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="8" cy="22" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M 12 10 L 30 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 12 20 L 30 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="18" cy="15" r="1.3" fill="currentColor" />
            </g>

            {/* 6. Wholesale Cargo Package (کارتن بسته‌بندی مرسوله باربری) */}
            <g transform="translate(68, 138)">
              <polygon points="16,3 30,10 16,17 2,10" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" />
              <polygon points="2,10 16,17 16,31 2,24" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.3" />
              <polygon points="30,10 16,17 16,31 30,24" fill="currentColor" fillOpacity="0.10" stroke="currentColor" strokeWidth="1.3" />
              {/* Packaging tape line */}
              <line x1="16" y1="3" x2="16" y2="17" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
            </g>

            {/* 7. Tailor Dress Form / Mannequin (مانکن کارگاهی و ژورنالی) */}
            <g transform="translate(148, 52)">
              <circle cx="10" cy="3" r="1.5" fill="currentColor" />
              <path
                d="M 7 5 Q 3 7 3 12 Q 3 16 6 18 Q 7 19 7 24 L 13 24 Q 13 19 14 18 Q 17 16 17 12 Q 17 7 13 5 Z"
                fill="currentColor"
                fillOpacity="0.12"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <line x1="10" y1="24" x2="10" y2="30" stroke="currentColor" strokeWidth="1.3" />
              <line x1="6" y1="30" x2="14" y2="30" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </g>

            {/* 8. Official Invoice Document (فاکتور رسمی و چک‌مارک فروش) */}
            <g transform="translate(2, 58)">
              <rect x="2" y="2" width="22" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <line x1="6" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.2" />
              <line x1="6" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" />
              <line x1="6" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" />
              <line x1="6" y1="21" x2="14" y2="21" stroke="currentColor" strokeWidth="1" />
              {/* Mini check mark */}
              <path d="M 16 23 L 18 25 L 21 21" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </pattern>

          {/* Top-down gentle fade mask so content area stays clean */}
          <radialGradient id="admin-thematic-mask-gradient" cx="50%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </radialGradient>
          <mask id="admin-thematic-mask">
            <rect width="100%" height="100%" fill="url(#admin-thematic-mask-gradient)" />
          </mask>
        </defs>

        <rect width="100%" height="100%" fill="url(#admin-garment-commerce-pattern)" mask="url(#admin-thematic-mask)" />
      </svg>

      {/* ========================================================================= */}
      {/* 4. DYNAMIC FLOATING THEMATIC ADMIN BADGES (نشان‌های متحرک و شناور حاشیه پنل) */}
      {/* Smoothly sway and float in left/right gutters without covering dashboard data*/}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_ADMIN_MOTIFS.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.animationClass}`}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              opacity: item.opacity,
              transform: `rotate(${item.rotation}deg)`,
              color: '#8C6D37'
            }}
          >
            <div 
              className="p-1.5 rounded-xl bg-white/70 backdrop-blur-[3px] border border-[#D4AF37]/35 shadow-[0_4px_12px_-2px_rgba(24,24,27,0.06)] hover:border-[#D4AF37] transition-all flex items-center justify-center"
              title={item.label}
            >
              {/* Wide-Leg Trousers Icon */}
              {item.type === 'pants' && (
                <svg width={item.size} height={item.size} viewBox="0 0 40 48" fill="none" stroke="currentColor">
                  <path
                    d="M 8 4 L 32 4 L 35 10 L 39 44 L 23 44 L 20 20 L 17 44 L 1 44 L 5 10 Z"
                    fill="currentColor"
                    fillOpacity="0.15"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="7" y1="8" x2="33" y2="8" stroke="currentColor" strokeWidth="1.8" />
                  <line x1="10" y1="14" x2="10" y2="40" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                  <line x1="30" y1="14" x2="30" y2="40" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                </svg>
              )}

              {/* Barcode & Price Tag Icon */}
              {item.type === 'tag' && (
                <svg width={item.size} height={item.size} viewBox="0 0 36 44" fill="none" stroke="currentColor">
                  <path
                    d="M 6 3 L 28 3 L 34 10 L 34 40 L 2 40 L 2 10 Z"
                    fill="currentColor"
                    fillOpacity="0.12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="18" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="7" y1="18" x2="7" y2="34" stroke="currentColor" strokeWidth="2.2" />
                  <line x1="12" y1="18" x2="12" y2="34" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="16" y1="18" x2="16" y2="34" stroke="currentColor" strokeWidth="2.4" />
                  <line x1="21" y1="18" x2="21" y2="34" stroke="currentColor" strokeWidth="1" />
                  <line x1="26" y1="18" x2="26" y2="34" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              )}

              {/* Analytics & Sales Chart Icon */}
              {item.type === 'chart' && (
                <svg width={item.size} height={item.size} viewBox="0 0 40 36" fill="none" stroke="currentColor">
                  <rect x="2" y="2" width="36" height="32" rx="4" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
                  <rect x="6" y="18" width="5" height="11" rx="1" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1" />
                  <rect x="14" y="12" width="5" height="17" rx="1" fill="currentColor" fillOpacity="0.45" stroke="currentColor" strokeWidth="1" />
                  <rect x="22" y="6" width="5" height="23" rx="1" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="1" />
                  <path d="M 5 16 L 15 10 L 24 5 L 34 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}

              {/* Official Wholesale Invoice Icon */}
              {item.type === 'invoice' && (
                <svg width={item.size} height={item.size} viewBox="0 0 34 40" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="28" height="34" rx="3" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
                  <line x1="8" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="8" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />
                  <line x1="8" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />
                  <line x1="8" y1="28" x2="16" y2="28" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M 20 29 L 23 32 L 28 26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}

              {/* Tailor Shears Icon */}
              {item.type === 'scissors' && (
                <svg width={item.size} height={item.size} viewBox="0 0 36 36" fill="none" stroke="currentColor">
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="8" cy="28" r="5.5" stroke="currentColor" strokeWidth="2" />
                  <path d="M 13 11 L 34 29" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M 13 25 L 34 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="21" cy="18" r="2" fill="currentColor" />
                </svg>
              )}

              {/* Dress Form Mannequin Icon */}
              {item.type === 'mannequin' && (
                <svg width={item.size} height={item.size} viewBox="0 0 36 50" fill="none" stroke="currentColor">
                  <circle cx="18" cy="6" r="2.5" fill="currentColor" />
                  <path
                    d="M 14 10 Q 8 13 8 20 Q 8 26 12 30 Q 14 32 14 38 L 22 38 Q 22 32 24 30 Q 28 26 28 20 Q 28 13 22 10 Z"
                    fill="currentColor"
                    fillOpacity="0.18"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line x1="18" y1="38" x2="18" y2="48" stroke="currentColor" strokeWidth="2" />
                  <line x1="11" y1="48" x2="25" y2="48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}

              {/* Fabric Roll Icon */}
              {item.type === 'fabric' && (
                <svg width={item.size} height={item.size} viewBox="0 0 40 36" fill="none" stroke="currentColor">
                  <ellipse cx="12" cy="18" rx="8" ry="14" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.12" />
                  <ellipse cx="12" cy="18" rx="3.5" ry="6.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M 12 4 L 32 4 C 36 4, 38 10, 38 18 C 38 26, 36 32, 32 32 L 12 32" stroke="currentColor" strokeWidth="2" />
                  <line x1="12" y1="18" x2="38" y2="18" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
                </svg>
              )}

              {/* Logistics Freight Cargo Box Icon */}
              {item.type === 'cargo' && (
                <svg width={item.size} height={item.size} viewBox="0 0 38 38" fill="none" stroke="currentColor">
                  <polygon points="19,3 35,11 19,19 3,11" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8" />
                  <polygon points="3,11 19,19 19,35 3,27" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.8" />
                  <polygon points="35,11 19,19 19,35 35,27" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" />
                  <line x1="19" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />
                </svg>
              )}

              {/* Coat Hanger Icon */}
              {item.type === 'hanger' && (
                <svg width={item.size} height={item.size} viewBox="0 0 44 36" fill="none" stroke="currentColor">
                  <path
                    d="M 18 8 C 18 1, 28 1, 28 9 C 28 15, 22 17, 22 20 L 41 30 C 43 31, 42 33, 40 33 L 4 33 C 2 33, 1 31, 3 30 Z"
                    fill="currentColor"
                    fillOpacity="0.1"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="3" y1="33" x2="40" y2="33" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}

              {/* Admin Security Shield Icon */}
              {item.type === 'shield' && (
                <svg width={item.size} height={item.size} viewBox="0 0 36 40" fill="none" stroke="currentColor">
                  <path
                    d="M 18 3 L 32 8 C 32 23, 24 33, 18 37 C 12 33, 4 23, 4 8 Z"
                    fill="currentColor"
                    fillOpacity="0.15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path d="M 11 19 L 16 24 L 25 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 5. Center Clarity & Contrast Vignette */}
      {/* Keeps tables, charts, forms, and cards crisp and completely readable */}
      <div 
        className="absolute inset-0 bg-radial from-white/40 via-transparent to-[#FAF7F2]/45 pointer-events-none"
      />
    </div>
  );
};
