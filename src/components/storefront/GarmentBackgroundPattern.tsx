import React from 'react';

/**
 * GarmentBackgroundPattern
 * Clearly visible, fine, and floating apparel motifs for the atelier storefront background.
 * Includes:
 * 1. Crisp micro-vector pattern of women's apparel (شلوار بگ، شومیز، چوب‌لباسی، قیچی، مانکن)
 * 2. Scattered floating garment motifs with gentle floating/swaying animations (شناور و ریز)
 */

interface FloatingItem {
  id: string;
  top: string;
  left?: string;
  right?: string;
  size: number;
  rotation: number;
  animationClass: string;
  opacity: number;
  type: 'pants' | 'blouse' | 'hanger' | 'scissors' | 'mannequin' | 'button' | 'spool' | 'needle';
}

const FLOATING_ITEMS: FloatingItem[] = [
  // Upper hero/catalog transition zone
  { id: 'f-1', top: '120px', right: '4%', size: 36, rotation: 12, animationClass: 'animate-garment-float-1', opacity: 0.24, type: 'pants' },
  { id: 'f-2', top: '220px', left: '3%', size: 32, rotation: -8, animationClass: 'animate-garment-float-2', opacity: 0.22, type: 'hanger' },
  { id: 'f-3', top: '380px', right: '2%', size: 34, rotation: 15, animationClass: 'animate-garment-float-3', opacity: 0.25, type: 'blouse' },
  { id: 'f-4', top: '510px', left: '5%', size: 30, rotation: -14, animationClass: 'animate-garment-float-4', opacity: 0.22, type: 'scissors' },
  
  // Mid catalog zone
  { id: 'f-5', top: '750px', right: '3%', size: 40, rotation: 6, animationClass: 'animate-garment-float-2', opacity: 0.24, type: 'mannequin' },
  { id: 'f-6', top: '920px', left: '2%', size: 36, rotation: -10, animationClass: 'animate-garment-float-1', opacity: 0.25, type: 'pants' },
  { id: 'f-7', top: '1150px', right: '5%', size: 28, rotation: 18, animationClass: 'animate-garment-float-3', opacity: 0.22, type: 'button' },
  { id: 'f-8', top: '1350px', left: '4%', size: 34, rotation: -5, animationClass: 'animate-garment-float-4', opacity: 0.24, type: 'hanger' },
  
  // Lower catalog and review zone
  { id: 'f-9', top: '1600px', right: '2%', size: 35, rotation: 8, animationClass: 'animate-garment-float-1', opacity: 0.25, type: 'blouse' },
  { id: 'f-10', top: '1850px', left: '3%', size: 38, rotation: -12, animationClass: 'animate-garment-float-2', opacity: 0.24, type: 'pants' },
  { id: 'f-11', top: '2100px', right: '4%', size: 30, rotation: 20, animationClass: 'animate-garment-float-3', opacity: 0.22, type: 'spool' },
  { id: 'f-12', top: '2350px', left: '2%', size: 32, rotation: -6, animationClass: 'animate-garment-float-4', opacity: 0.23, type: 'scissors' },
  { id: 'f-13', top: '2600px', right: '3%', size: 42, rotation: 10, animationClass: 'animate-garment-float-1', opacity: 0.24, type: 'mannequin' },
  { id: 'f-14', top: '2850px', left: '4%', size: 34, rotation: -15, animationClass: 'animate-garment-float-2', opacity: 0.25, type: 'hanger' },
  { id: 'f-15', top: '3100px', right: '5%', size: 36, rotation: 14, animationClass: 'animate-garment-float-3', opacity: 0.24, type: 'pants' }
];

import { SiteBackgroundTheme } from '../../types';

interface GarmentBackgroundPatternProps {
  theme?: SiteBackgroundTheme;
  opacity?: number;
}

export const GarmentBackgroundPattern: React.FC<GarmentBackgroundPatternProps> = ({
  theme = 'couture_craft',
  opacity = 0.115,
}) => {
  const patternColor = theme === 'dark_luxury' ? 'text-amber-300' : theme === 'minimal_silk' ? 'text-stone-400' : 'text-[#967434]';
  const effectiveOpacity = theme === 'minimal_silk' ? Math.max(0.05, opacity * 0.7) : opacity;

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" 
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. CRISP, CLEARLY VISIBLE WATERMARK GRID PATTERN (نقش ریز سرتاسری پوشاک)     */}
      {/* ========================================================================= */}
      <svg
        className={`absolute inset-0 w-full h-full ${patternColor}`}
        style={{ opacity: effectiveOpacity }}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="garment-crisp-pattern"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(4)"
          >
            {/* Coat Hanger (چوب‌لباسی فلزی) */}
            <g transform="translate(18, 16)">
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

            {/* Women's Wide-Leg Baggy Trousers (شلوار بگ زنانه) */}
            <g transform="translate(100, 12)">
              <path
                d="M 6 3 L 28 3 L 30 8 L 34 44 L 20 44 L 17 20 L 14 44 L 0 44 L 4 8 Z"
                fill="currentColor"
                fillOpacity="0.08"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="5" y1="7" x2="29" y2="7" stroke="currentColor" strokeWidth="1.2" />
              {/* Crease lines */}
              <line x1="8" y1="12" x2="8" y2="40" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 2" />
              <line x1="26" y1="12" x2="26" y2="40" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 2" />
            </g>

            {/* Tailor's Scissors (قیچی خیاطی) */}
            <g transform="translate(20, 96)">
              <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="24" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 12 10 L 32 26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M 12 22 L 32 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="20" cy="16" r="1.5" fill="currentColor" />
            </g>

            {/* Women's Stylish Blouse / Top (شومیز مجلسی زنانه) */}
            <g transform="translate(104, 92)">
              <path
                d="M 10 5 L 16 2 L 22 5 L 32 10 L 28 17 L 24 15 L 24 38 L 8 38 L 8 15 L 4 17 L 0 10 Z"
                fill="currentColor"
                fillOpacity="0.08"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M 12 3 Q 16 11 20 3" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <line x1="16" y1="12" x2="16" y2="36" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* Sewing Button 4-holes (دکمه خیاطی) */}
            <g transform="translate(68, 42)">
              <circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="7.5" cy="7.5" r="0.9" fill="currentColor" />
              <circle cx="10.5" cy="7.5" r="0.9" fill="currentColor" />
              <circle cx="7.5" cy="10.5" r="0.9" fill="currentColor" />
              <circle cx="10.5" cy="10.5" r="0.9" fill="currentColor" />
            </g>

            {/* Needle with Thread (سوزن و نخ) */}
            <g transform="translate(68, 118)">
              <line x1="2" y1="2" x2="20" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="3.5" cy="3.5" r="0.8" fill="currentColor" />
              <path
                d="M 3 3 Q -2 8, 5 10 T 16 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#garment-crisp-pattern)" />
      </svg>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC FLOATING APPAREL BADGES & MOTIFS (اشکال ریز و متحرک شناور)      */}
      {/* Smoothly float, sway, and drift along page margins and gutters           */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_ITEMS.map((item) => (
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
            <div className="p-1 rounded-xl bg-white/40 backdrop-blur-[1px] border border-[#D4AF37]/30 shadow-2xs">
              {item.type === 'pants' && (
                <svg width={item.size} height={item.size} viewBox="0 0 40 48" fill="none" stroke="currentColor">
                  {/* Wide-Leg Trousers */}
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

              {item.type === 'blouse' && (
                <svg width={item.size} height={item.size} viewBox="0 0 44 44" fill="none" stroke="currentColor">
                  {/* Stylish Blouse */}
                  <path
                    d="M 14 6 L 22 2 L 30 6 L 42 12 L 38 20 L 32 18 L 32 42 L 12 42 L 12 18 L 6 20 L 2 12 Z"
                    fill="currentColor"
                    fillOpacity="0.15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M 16 4 Q 22 14 28 4" stroke="currentColor" strokeWidth="1.8" />
                  <line x1="22" y1="14" x2="22" y2="38" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 2" />
                </svg>
              )}

              {item.type === 'hanger' && (
                <svg width={item.size} height={item.size} viewBox="0 0 44 36" fill="none" stroke="currentColor">
                  {/* Coat Hanger */}
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

              {item.type === 'scissors' && (
                <svg width={item.size} height={item.size} viewBox="0 0 36 36" fill="none" stroke="currentColor">
                  {/* Tailor Scissors */}
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="8" cy="28" r="5.5" stroke="currentColor" strokeWidth="2" />
                  <path d="M 13 11 L 34 29" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M 13 25 L 34 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="21" cy="18" r="2" fill="currentColor" />
                </svg>
              )}

              {item.type === 'mannequin' && (
                <svg width={item.size} height={item.size} viewBox="0 0 36 50" fill="none" stroke="currentColor">
                  {/* Dress Form Mannequin */}
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

              {item.type === 'button' && (
                <svg width={item.size} height={item.size} viewBox="0 0 32 32" fill="none" stroke="currentColor">
                  {/* Sewing Button */}
                  <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
                  <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="12" cy="12" r="1.8" fill="currentColor" />
                  <circle cx="20" cy="12" r="1.8" fill="currentColor" />
                  <circle cx="12" cy="20" r="1.8" fill="currentColor" />
                  <circle cx="20" cy="20" r="1.8" fill="currentColor" />
                </svg>
              )}

              {item.type === 'spool' && (
                <svg width={item.size} height={item.size} viewBox="0 0 32 32" fill="none" stroke="currentColor">
                  {/* Thread Spool */}
                  <rect x="6" y="4" width="20" height="4" rx="1.5" fill="currentColor" />
                  <rect x="9" y="8" width="14" height="16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="9" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="9" y1="16" x2="23" y2="16" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="9" y1="20" x2="23" y2="20" stroke="currentColor" strokeWidth="1.2" />
                  <rect x="6" y="24" width="20" height="4" rx="1.5" fill="currentColor" />
                </svg>
              )}

              {item.type === 'needle' && (
                <svg width={item.size} height={item.size} viewBox="0 0 32 32" fill="none" stroke="currentColor">
                  {/* Needle with thread */}
                  <line x1="4" y1="4" x2="28" y2="28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="6" cy="6" r="1.2" fill="white" />
                  <path d="M 6 6 Q 0 14, 10 16 T 24 14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Gentle Warm Textile Ambient Radial Blurs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EAD49B]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 left-0 w-96 h-96 bg-[#B8D5C4]/15 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
