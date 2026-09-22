import React from 'react';
import { BRAND_INFO } from '../../data/brandInfo';

export const RubikaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="13" fill="url(#rubika-grad)" />
    <defs>
      <linearGradient id="rubika-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6C2897" />
        <stop offset="0.5" stopColor="#8E24AA" />
        <stop offset="1" stopColor="#E91E63" />
      </linearGradient>
    </defs>
    <g transform="translate(10, 10)">
      <path d="M14 2L26 14L14 26L2 14Z" fill="#FFFFFF" opacity="0.25" />
      <path d="M14 2L26 14L14 14Z" fill="#00E5FF" />
      <path d="M26 14L14 26L14 14Z" fill="#FF1744" />
      <path d="M14 26L2 14L14 14Z" fill="#FFC400" />
      <path d="M2 14L14 2L14 14Z" fill="#7C4DFF" />
      <circle cx="14" cy="14" r="3.5" fill="#FFFFFF" />
    </g>
  </svg>
);

export const BaleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="13" fill="url(#bale-grad)" />
    <defs>
      <linearGradient id="bale-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0B8F55" />
        <stop offset="1" stopColor="#14B866" />
      </linearGradient>
    </defs>
    <path 
      d="M24 10C16.268 10 10 16.268 10 24C10 27.64 11.39 30.95 13.68 33.45L11.5 38L16.3 36.25C18.55 37.38 21.18 38 24 38C31.732 38 38 31.732 38 24C38 16.268 31.732 10 24 10ZM24 32.5C19.306 32.5 15.5 28.694 15.5 24C15.5 19.306 19.306 15.5 24 15.5C28.694 15.5 32.5 19.306 32.5 24C32.5 28.694 28.694 32.5 24 32.5Z" 
      fill="#FFFFFF" 
    />
    <path 
      d="M24 19C21.239 19 19 21.239 19 24C19 26.761 21.239 29 24 29C26.761 29 29 26.761 29 24" 
      stroke="#FFFFFF" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
  </svg>
);

export const EitaaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="13" fill="url(#eitaa-grad)" />
    <defs>
      <linearGradient id="eitaa-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D84315" />
        <stop offset="0.6" stopColor="#E65100" />
        <stop offset="1" stopColor="#FF6D00" />
      </linearGradient>
    </defs>
    <path 
      d="M14 26C15.5 21 20 14 28 12C26.5 16 26 19 27.5 22C29 25 32 27 34 27C30.5 33 24 36 17 34C15 33.5 13.5 30 14 26Z" 
      fill="#FFFFFF" 
    />
    <path 
      d="M20 25C22 21 25.5 17 31 16C29.5 19 29.5 22 31 24C28 27.5 24 28 20 25Z" 
      fill="#D84315" 
    />
    <circle cx="31" cy="13" r="2.5" fill="#FFFFFF" />
  </svg>
);

export const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="13" fill="url(#telegram-grad)" />
    <defs>
      <linearGradient id="telegram-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E88E5" />
        <stop offset="1" stopColor="#29B6F6" />
      </linearGradient>
    </defs>
    <path 
      d="M12 24L35 14L30 34L23.5 28L20 31.5V26L30.5 17.5L18.5 24.5L12 24Z" 
      fill="#FFFFFF" 
    />
  </svg>
);

export interface SocialLinksRowProps {
  variant?: 'compact_icons' | 'cards' | 'footer_chips';
  className?: string;
}

export const SocialLinksRow: React.FC<SocialLinksRowProps> = ({
  variant = 'compact_icons',
  className = ''
}) => {
  const links = [
    {
      id: 'telegram',
      title: 'کانال تلگرام',
      sub: '@' + BRAND_INFO.telegramUsername,
      url: BRAND_INFO.telegramUrl,
      icon: <TelegramIcon className="w-5 h-5 shrink-0" />,
      color: 'hover:border-sky-500 hover:shadow-sky-500/20 text-sky-300',
      badgeBg: 'bg-sky-500/10 border-sky-500/30'
    },
    {
      id: 'rubika',
      title: 'کانال روبیکا',
      sub: 'روبیکا من و تو',
      url: BRAND_INFO.rubikaUrl,
      icon: <RubikaIcon className="w-5 h-5 shrink-0" />,
      color: 'hover:border-purple-500 hover:shadow-purple-500/20 text-purple-300',
      badgeBg: 'bg-purple-500/10 border-purple-500/30'
    },
    {
      id: 'bale',
      title: 'کانال پیام‌رسان بله',
      sub: 'بله من و تو',
      url: BRAND_INFO.baleUrl,
      icon: <BaleIcon className="w-5 h-5 shrink-0" />,
      color: 'hover:border-emerald-500 hover:shadow-emerald-500/20 text-emerald-300',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'eitaa',
      title: 'کانال پیام‌رسان ایتا',
      sub: 'ایتا من و تو',
      url: BRAND_INFO.eitaaUrl,
      icon: <EitaaIcon className="w-5 h-5 shrink-0" />,
      color: 'hover:border-orange-500 hover:shadow-orange-500/20 text-orange-300',
      badgeBg: 'bg-orange-500/10 border-orange-500/30'
    }
  ];

  if (variant === 'compact_icons') {
    return (
      <div className={`flex items-center gap-2 flex-wrap ${className}`}>
        {links.map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.title}
            className="p-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 hover:scale-110 active:scale-95 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center cursor-pointer group"
          >
            {link.icon}
          </a>
        ))}
      </div>
    );
  }

  // Footer chips with title + icon
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map(link => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={link.title}
          className={`px-2.5 py-1.5 rounded-xl border border-stone-800 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white flex items-center gap-2 transition-all text-xs font-bold shadow-sm active:scale-95 group ${link.color}`}
        >
          {link.icon}
          <span className="text-[11px] font-medium">{link.title}</span>
        </a>
      ))}
    </div>
  );
};
