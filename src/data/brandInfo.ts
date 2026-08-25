export interface BrandContactInfo {
  brandNameFa: string;
  brandNameEn: string;
  brandTaglineFa: string;
  brandTaglineEn: string;
  managementName: string;
  primaryPhone: string;
  primaryPhoneDisplay: string;
  secondaryPhones: { phone: string; display: string }[];
  allPhones: { phone: string; display: string; label: string }[];
  telegramUsername: string;
  telegramUrl: string;
  eitaaRubikaUrl: string;
  whatsappDirectUrl: string;
  mainAddressFa: string;
  subwayRouteFa: string;
  addressEn: string;
  workingHours: string;
  shippingPartners: string[];
  coordinates: {
    lat: number;
    lng: number;
    title: string;
    googleMapsUrl: string;
    neshanUrl: string;
    baladUrl: string;
    wazeUrl: string;
    osmEmbedUrl: string;
  };
  landmarks: {
    metroMohammadieh: string;
    metroKhayam: string;
    metroPanzdahKhordad: string;
    parking: string;
    passageLocation: string;
  };
}

export const BRAND_INFO: BrandContactInfo = {
  brandNameFa: 'تولید و پخش پوشاک من و تو',
  brandNameEn: 'MANOTO DRESS',
  brandTaglineFa: 'تولید و پخش عمده و تک پوشاک زنانه (اسدی)',
  brandTaglineEn: 'MANOTO DRESS — Grand Bazaar Tehran',
  managementName: 'اسدی',
  primaryPhone: '09120369567',
  primaryPhoneDisplay: '۰۹۱۲ ۰۳۶ ۹۵۶۷',
  secondaryPhones: [
    { phone: '09353714911', display: '۰۹۳۵ ۳۷۱ ۴۹۱۱' },
    { phone: '09215935237', display: '۰۹۲۱ ۵۹۳ ۵۲۳۷' },
  ],
  allPhones: [
    { phone: '09120369567', display: '۰۹۱۲ ۰۳۶ ۹۵۶۷', label: 'مدیریت و سفارشات اصلی' },
    { phone: '09353714911', display: '۰۹۳۵ ۳۷۱ ۴۹۱۱', label: 'واحد فروش و تلگرام' },
    { phone: '09215935237', display: '۰۹۲۱ ۵۹۳ ۵۲۳۷', label: 'پشتیبانی و باربری' },
  ],
  telegramUsername: 'tolidopakhsh_manoto',
  telegramUrl: 'https://t.me/tolidopakhsh_manoto',
  eitaaRubikaUrl: 'https://t.me/tolidopakhsh_manoto',
  whatsappDirectUrl: 'https://wa.me/989120369567?text=%D8%B3%D9%84%D8%A7%D9%85%D8%8C%20%D8%A7%D8%B2%20%D8%B3%D8%A7%DB%8C%D8%AA%20%D9%BE%D9%88%D8%B4%D8%A7%DA%A9%20%D9%85%D9%86%20%D9%88%20%D8%AA%D9%88%20%D9%BE%DB%8C%D8%A7%D9%85%20%D9%85%DB%8C%E2%80%8C%D8%AF%D9%87%D9%85%20%D8%AC%D9%87%D8%AA%20%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B9%D9%85%D8%AF%D9%87%20%D9%88%20%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85%20%D9%85%D9%88%D8%AC%D9%88%D8%AF%DB%8C',
  mainAddressFa: 'بازار بزرگ تهران، بازار عباس‌آباد، پاساژ المهدی ۴، طبقه منفی یک (زیرزمین اول)، پلاک ۲۴۲',
  subwayRouteFa: 'مترو میدان محمدیه (خط ۱ و ۷) یا مترو خیام، بازار حاج قاسم، پاساژ المهدی ۴، ورودی یک، زیرزمین اول، پلاک ۲۴۲',
  addressEn: 'No. 242, Floor -1 (Basement 1), Al-Mahdi Passage 4, Haj Qasim & Abbas Abad Bazaar, Tehran Grand Bazaar, Tehran, Iran',
  workingHours: 'همه روزه ۸:۳۰ الی ۱۹:۰۰ • ارسال باربری هر عصر',
  shippingPartners: ['باربری وطن', 'پیام‌گیر', 'تیپاکس اکسپرس', 'چاپار', 'پست پیشتاز'],
  coordinates: {
    lat: 35.67185,
    lng: 51.42082,
    title: 'تولید و پخش پوشاک من و تو (پاساژ المهدی ۴، پلاک ۲۴۲)',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=35.67185,51.42082',
    neshanUrl: 'https://neshan.org/maps/@35.67185,51.42082,18z',
    baladUrl: 'https://balad.ir/location?latitude=35.67185&longitude=51.42082',
    wazeUrl: 'https://waze.com/ul?ll=35.67185,51.42082&navigate=yes',
    osmEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=51.4150%2C35.6675%2C51.4265%2C35.6760&layer=mapnik&marker=35.67185%2C51.42082',
  },
  landmarks: {
    metroMohammadieh: 'ایستگاه مترو میدان محمدیه (تقاطع خط ۱ تجریش-کهریزک و خط ۷) — ۷ دقیقه پیاده‌روی',
    metroKhayam: 'ایستگاه مترو خیام (خط ۱ قرمز) — ۵ دقیقه پیاده‌روی تا ورودی بازار حاج قاسم',
    metroPanzdahKhordad: 'ایستگاه مترو ۱۵ خرداد — دسترسی از سمت سبزه میدان و بازار عباس‌آباد',
    parking: 'پارکینگ عمومی خیابان خیام یا مصطفی خمینی (طرح ترافیک بازار)',
    passageLocation: 'پاساژ المهدی ۴ (یکی از مراکز اصلی بنکداری پوشاک زنانه بازار تهران)',
  }
};
