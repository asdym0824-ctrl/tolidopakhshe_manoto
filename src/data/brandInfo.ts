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
  mainAddressFa: string;
  subwayRouteFa: string;
  addressEn: string;
  workingHours: string;
  shippingPartners: string[];
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
  mainAddressFa: 'بازار بزرگ تهران، بازار عباس‌آباد، پاساژ المهدی ۴، طبقه منفی یک، پلاک ۲۴۲',
  subwayRouteFa: 'مترو محمدیه، بازار حاج قاسم، پاساژ المهدی ۴، ورودی یک، زیرزمین اول، پلاک ۲۴۲',
  addressEn: 'No. 242, 1st Floor, Al-Mohdi Passage 4, Haj Qasim Bazaar, Grand Bazaar, Tehran, Iran',
  workingHours: 'همه روزه ۸:۳۰ الی ۱۹:۰۰ • ارسال باربری هر عصر',
  shippingPartners: ['باربری وطن', 'پیام‌گیر', 'تیپاکس اکسپرس', 'چاپار', 'پست پیشتاز'],
};
