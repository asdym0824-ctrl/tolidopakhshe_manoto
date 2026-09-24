/**
 * persianWriting.ts
 * 
 * بر اساس استانداردهای مخزن persian-writing (علی حسین‌پور)
 * ویژهٔ خط و نگارش درست فارسی، وب‌فارسی، تایپوگرافی اصیل و زبان تجارت بازار
 * 
 * اصول کلیدی:
 * ۱. رعایت دقیق نیم‌فاصله‌ها (ZWNJ \u200C) در افعال و کلمات مرکب پوشاک
 * ۲. یکدست‌سازی ی و ک فارسی (جلوگیری از ی و ک عربی)
 * ۳. نمایش ارقام و قیمت‌ها با اعداد فارسی و واحد رسمی «تومان»
 * ۴. تصحیح علائم نگارشی فارسی (؟ ، ؛ « » ٪)
 * ۵. لحن طبیعی انسانی و اصیل بازار تهران (تولید و پخش من و تو)
 */

// جدول تبدیل ارقام لاتین و عربی به ارقام فارسی
const LATIN_TO_PERSIAN_DIGITS: Record<string, string> = {
  '0': '۰',
  '1': '۱',
  '2': '۲',
  '3': '۳',
  '4': '۴',
  '5': '۵',
  '6': '۶',
  '7': '۷',
  '8': '۸',
  '9': '۹',
};

const ARABIC_TO_PERSIAN_CHARS: Record<string, string> = {
  'ي': 'ی',
  'ى': 'ی',
  'ئ': 'ئ',
  'ك': 'ک',
  'ة': 'ه',
  'ۀ': 'هٔ',
  '۰': '۰',
  '۱': '۱',
  '۲': '۲',
  '۳': '۳',
  '۴': '۴',
  '۵': '۵',
  '۶': '۶',
  '۷': '۷',
  '۸': '۸',
  '۹': '۹',
};

/**
 * تبدیل هر عدد یا رشته شامل رقم به ارقام فارسی
 */
export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str.replace(/[0-9]/g, (w) => LATIN_TO_PERSIAN_DIGITS[w] || w);
}

/**
 * فرمت مبلغ به ریال/تومان با ارقام فارسی، جداسازی ۳ رقمی و فاصلهٔ نشکن (\u00A0)
 * مثال: formatPersianPrice(240000) => "۲۴۰,۰۰۰ تومان"
 */
export function formatPersianPrice(
  amount: number | null | undefined, 
  unit = 'تومان',
  showUnit = true
): string {
  if (amount === null || amount === undefined || isNaN(amount)) return `۰ ${unit}`;
  const rounded = Math.round(amount);
  const formattedWithCommas = rounded.toLocaleString('en-US'); // 240,000
  const persianDigitsWithCommas = toPersianDigits(formattedWithCommas);
  if (!showUnit) return persianDigitsWithCommas;
  return `${persianDigitsWithCommas}\u00A0${unit}`;
}

/**
 * نمایش درصد تخفیف به صورت استاندارد فارسی
 * مثال: formatPersianPercent(25) => "٪۲۵"
 */
export function formatPersianPercent(percent: number | null | undefined): string {
  if (!percent || percent <= 0) return '';
  return `٪${toPersianDigits(Math.round(percent))}`;
}

/**
 * نمایش تعداد به همراه واحد به صورت خوانا و بدون شکستگی خط
 * مثال: formatPersianCount(6, 'تایی') => "۶ تایی"
 */
export function formatPersianCount(count: number | null | undefined, unit: string): string {
  const c = count || 0;
  return `${toPersianDigits(c)}\u00A0${unit}`;
}

/**
 * اصلاح و استانداردسازی متن فارسی با اصول persian-writing
 * - جایگزینی ي و ك عربی با ی و ک فارسی
 * - رعایت نیم‌فاصله در پیشوندها (می‌، نمی‌) و پسوندها (ها، های، تر، ترین)
 * - اصلاح واژگان اختصاصی صنف پوشاک و بنکداری (تن‌خور، نیم‌بگ، بوت‌کات، سنگ‌شور، چاک‌دار)
 * - اصلاح علائم نگارشی (?, ;, ,, %) به (؟، ؛، ،، ٪)
 */
export function cleanPersianTypography(text: string): string {
  if (!text) return '';

  let res = text;

  // ۱. اصلاح حروف عربی به فارسی
  res = res.replace(/[يكىة]/g, (ch) => ARABIC_TO_PERSIAN_CHARS[ch] || ch);

  // ۲. حذف نیم‌فاصله‌های پیاپی یا فاصله قبل از نیم‌فاصله
  res = res.replace(/[\u200C\u200B]+/g, '\u200C');
  res = res.replace(/\s+\u200C/g, '\u200C');
  res = res.replace(/\u200C\s+/g, '\u200C');

  // ۳. علائم نگارشی فارسی
  res = res.replace(/\?/g, '؟');
  res = res.replace(/;/g, '؛');
  // جایگزینی ویرگول انگلیسی با فارسی (تنها در صورتی که بعد از حرف فارسی باشد نه بین اعداد)
  res = res.replace(/([آ-ی])\s*,\s*/g, '$1، ');

  // ۴. اصطلاحات و کلمات مرکب ویژه پوشاک، بازار و زبان اداری-تجاری
  const fashionTerms: [RegExp, string][] = [
    // افعال و پیشوندها
    [/\bمی\s+([آ-ی])/g, 'می‌$1'],
    [/\bنمی\s+([آ-ی])/g, 'نمی‌$1'],
    // پسوندها
    [/([آ-ی])\s+ها\b/g, '$1‌ها'],
    [/([آ-ی])\s+های\b/g, '$1‌های'],
    [/([آ-ی])\s+تر\b/g, '$1‌تر'],
    [/([آ-ی])\s+ترین\b/g, '$1‌ترین'],
    // کلمات مرکب صنف پوشاک من و تو
    [/تنخور/g, 'تن‌خور'],
    [/نیم\s*بگ/g, 'نیم‌بگ'],
    [/بوت\s*کات/g, 'بوت‌کات'],
    [/مام\s*استایل/g, 'مام‌استایل'],
    [/مام\s*فیت/g, 'مام‌فیت'],
    [/چاکدار/g, 'چاک‌دار'],
    [/جیبدار/g, 'جیب‌دار'],
    [/خوشپوش/g, 'خوش‌پوش'],
    [/سنگشور/g, 'سنگ‌شور'],
    [/کش‌دوزی/g, 'کش‌دوزی'],
    [/کشدوزی/g, 'کش‌دوزی'],
    [/دست\s*دوز/g, 'دست‌دوز'],
    [/دست\s*ساز/g, 'دست‌ساز'],
    [/خرج\s*کار/g, 'خرج‌کار'],
    // عبارات بازار و سفارش
    [/سفارشات/g, 'سفارش‌ها'],
    [/بسته\s*بندی/g, 'بسته‌بندی'],
    [/سایز\s*بندی/g, 'سایزبندی'],
    [/رنگ\s*بندی/g, 'رنگ‌بندی'],
    [/الگو\s*سازی/g, 'الگوسازی'],
    [/تک\s*فروشی/g, 'تک‌فروشی'],
    [/عمده\s*فروشی/g, 'عمده‌فروشی'],
    [/تمام\s*شده/g, 'تمام‌شده'],
    [/ثبت\s*شده/g, 'ثبت‌شده'],
    [/ارسال\s*شده/g, 'ارسال‌شده'],
    [/به\s*روز\s*رسانی/g, 'به‌روزرسانی'],
    [/بروزرسانی/g, 'به‌روزرسانی'],
    [/همه\s*روزه/g, 'همه‌روزه'],
    [/پاسخگویی/g, 'پاسخ‌گویی'],
    [/پاسخگو/g, 'پاسخ‌گو'],
    [/شستشو/g, 'شست‌وشو'],
    [/جستجو/g, 'جست‌وجو'],
    [/گفتگو/g, 'گفت‌وگو'],
    [/به\s*عنوان/g, 'به‌عنوان'],
    [/به\s*ویژه/g, 'به‌ویژه'],
    [/به\s*صورت/g, 'به‌صورت'],
    [/به\s*همراه/g, 'به‌همراه'],
    [/سبزه\s*میدان/g, 'سبزه‌میدان'],
  ];

  for (const [pattern, replacement] of fashionTerms) {
    res = res.replace(pattern, replacement);
  }

  // ۵. حذف فواصل اضافه قبل از نشانه‌های سجاوندی
  res = res.replace(/\s+([،؛:؟!])/g, '$1');

  // ۶. اصلاح «می‌باشد» به «است» در متون توضیحی عمومی
  res = res.replace(/\sمی‌باشد\b/g, ' است');

  return res;
}
