import React from 'react';
import { BRAND_INFO } from '../../data/brandInfo';

export const RubikaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img 
    src="/images/social/rubika.png" 
    alt="لوگوی رسمی روبیکا" 
    className={`${className} object-contain rounded-md shrink-0`} 
    loading="lazy" 
  />
);

export const BaleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img 
    src="/images/social/bale.png" 
    alt="لوگوی رسمی پیام‌رسان بله" 
    className={`${className} object-contain rounded-md shrink-0`} 
    loading="lazy" 
  />
);

export const EitaaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img 
    src="/images/social/eitaa.png" 
    alt="لوگوی رسمی پیام‌رسان ایتا" 
    className={`${className} object-contain rounded-md shrink-0`} 
    loading="lazy" 
  />
);

export const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img 
    src="/images/social/telegram.png" 
    alt="لوگوی رسمی تلگرام" 
    className={`${className} object-contain rounded-md shrink-0`} 
    loading="lazy" 
  />
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
