export type ModuleTab = 
  | 'dashboard'
  | 'inventory'
  | 'production'
  | 'crm'
  | 'retail_customers'
  | 'sales'
  | 'finance'
  | 'marketing'
  | 'storefront'
  | 'logistics'
  | 'roles';

export type PackSize = 4 | 6 | 8 | 12;

export type ProductSource = 'self_produced' | 'partner_sourced';

export type ProductStatus = 'active' | 'low_stock' | 'out_of_stock' | 'draft';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string; // e.g. شلوار بگ, شلوار اسلش, شلوار راحتی, لگ و ساپورت, جاگر, داکرون, کارگو
  image: string;
  galleryImages?: string[];
  videoUrl?: string; // ویدیو معرفی، تنخور ژورنالی، تست کشسانی و دوخت (MP4 یا لینک مستقیم/آپارات)
  videoTitle?: string; // عنوان ویدیو مانند "ویدیو تنخور ژورنالی و تست پارچه"
  
  // Cost breakdown (به ازای هر عدد)
  fabricCost: number; // هزینه پارچه هر عدد
  tailoringCost: number; // دستمزد دوخت و برش
  trimsCost: number; // خرج‌کار (کش، نخ، دکمه، جیب)
  finishingCost: number; // اتو، بسته‌بندی و سلفون
  totalCostPrice: number; // بهای تمام شده هر عدد
  
  // Pricing
  packSize: PackSize; // تعداد در هر بسته (۴، ۶، ۸، ۱۲)
  baseWholesalePricePerUnit: number; // قیمت عمده هر عدد (مشتری عادی کانال)
  baseWholesalePricePerPack: number; // قیمت عمده هر پک
  colleaguePricePerUnit: number; // قیمت همکاری/هم‌صنف (ارزان‌تر)
  colleaguePricePerPack: number;
  retailPricePerUnit?: number; // قیمت تک‌فروشی پیشنهادی یا فروش مستقیم تک‌فروشی
  
  // Commercial Wholesale / Retail Logic
  allowRetailSale?: boolean; // آیا این مدل امکان فروش تکی به مشتری نهایی را دارد؟
  retailMarkupPercent?: number; // درصد مارک‌آپ تک‌فروشی نسبت به عمده (پیش‌فرض ۳۵٪)
  
  // Stock
  packStock: number; // موجودی به تعداد پک
  singleStock: number; // تعداد تکی (در صورت باز شدن پک یا موجودی تک)
  minPackStockAlert: number; // هشدار کسری موجودی پک
  
  // Source
  source: ProductSource;
  partnerSupplierName?: string; // نام همکار یا بنکدار
  fabricSupplierName?: string; // نام پارچه‌فروش (مثلاً بازار پارچه مولوی یا بنکداری شوش)
  tailorName?: string; // نام خیاط / کارگاه دوخت
  
  // Attributes & Storefront Features
  fabricType: string; // داکرون، پنبه سوپر، لینن، ابروبادی، کتان لایت، غواصی، نیل
  colors: string[]; // رنگ‌بندی
  sizes: string; // مثلاً فری‌سایز (۳۸ تا ۴۶) یا ۳۸، ۴۰، ۴۲، ۴۴
  description: string;
  tags: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseMode = 'wholesale_pack' | 'retail_single';

export interface CartItem {
  id: string; // unique item id
  productId: string;
  product: Product;
  mode: PurchaseMode; // عمده پکی یا خرید تکی
  quantity: number; // تعداد پک‌ها یا تعداد عدد تکی
  selectedColor?: string;
  selectedSize?: string;
  unitPriceToman: number; // قیمت واحد (قیمت هر پک در حالت عمده، یا قیمت هر عدد در حالت تکی)
  totalPriceToman: number;
}

export interface StorefrontCustomerInfo {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
  notes?: string;
  isPartnerWholesale?: boolean;
  storeName?: string;
}

export type StorefrontShippingMethod = 'peyk_instant' | 'barbari_vatan' | 'tipax' | 'chapar' | 'peyk_tehran' | 'post_pishtaz';

export interface InstantCourierInfo {
  provider: 'snapp_box' | 'alopeyk' | 'tapsi_pack' | 'dedicated_bazaar';
  urgency: 'immediate_2h' | 'today_evening' | 'custom_time';
  deliveryNote?: string;
  driverName?: string;
  driverPhone?: string;
}

export interface StorefrontOrder {
  id: string;
  orderNumber: string; // e.g. MNT-1403-8821
  trackingCode: string; // کد رهگیری اختصاصی برای استعلام در سایت
  customer: StorefrontCustomerInfo;
  items: CartItem[];
  subtotalToman: number;
  discountToman: number;
  shippingCostToman: number;
  finalAmountToman: number;
  shippingMethod: StorefrontShippingMethod;
  shippingMethodTitle: string;
  instantCourierInfo?: InstantCourierInfo;
  paymentMethod: 'online_gateway' | 'card_to_card' | 'wholesale_check';
  paymentStatus: 'paid' | 'pending_verification' | 'pending_check';
  orderStatus: 'registered' | 'processing' | 'packed' | 'sent_to_carrier' | 'delivered';
  waybillNumber?: string; // شماره بارنامه / بیجک باربری یا کد رهگیری تیپاکس
  carrierName?: string;
  createdAt: string;
  estimatedDeliveryDate?: string;
}

export type CustomerType = 'shop_keeper' | 'partner_wholesale' | 'online_shop' | 'retail';
export type CustomerTier = 'tier_colleague' | 'tier_wholesale_1' | 'tier_wholesale_2';
export type PaymentTerms = 'cash_only' | 'check_eligible' | 'credit';

export type WholesaleLoyaltyTier = 'partner_regular' | 'partner_silver' | 'partner_gold_vip';

export interface Customer {
  id: string;
  name: string;
  storeName: string;
  phone: string;
  city: string;
  province: string;
  type: CustomerType;
  tier: CustomerTier;
  
  // Wholesale Loyalty & Volume Incentive Program (Fix 3)
  wholesaleLoyaltyTier?: WholesaleLoyaltyTier;
  totalPacksPurchased?: number;
  referralCount?: number;
  referredByCustomerId?: string;

  // Trust & Check limits
  trustScore: number; // 1 to 100
  paymentTerms: PaymentTerms;
  checkLimitToman: number; // سقف اعتبار چک به تومان
  currentActiveCheckToman: number; // مجموع چک‌های پاس‌نشده
  
  // Stats
  totalPurchasesToman: number;
  orderCount: number;
  lastOrderDate: string;
  lastContactDate: string;
  
  // Channel & Logistics
  channelSource: 'telegram' | 'eitaa' | 'rubika' | 'bale' | 'instagram' | 'in_person';
  telegramUsername?: string;
  preferredShipping: 'باربری وطن' | 'تیپاکس' | 'چاپار' | 'پست پیشتاز' | 'باربری پیام‌گیر';
  
  tags: string[];
  notes: string;
  followUpRequired?: boolean;
  followUpReason?: string;
}

export type CheckOutcome = 'cleared_on_time' | 'cleared_late' | 'bounced';

export interface CheckItem {
  id: string;
  checkNumber: string;
  sayadNumber: string;
  bankName: string;
  amountToman: number;
  issueDate: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  storeName: string;
  status: 'pending' | 'in_collection' | 'cleared' | 'bounced';
  outcome?: CheckOutcome;
  registeredInSayad: boolean;
  notes: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  sku: string;
  packCount: number;
  packSize: PackSize;
  totalUnits: number;
  pricePerPack: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  storeName: string;
  phone: string;
  city: string;
  date: string;
  items: InvoiceItem[];
  subtotalToman: number;
  discountToman: number;
  shippingCostToman: number;
  finalAmountToman: number;
  paymentType: 'cash' | 'check' | 'split';
  checkDetails?: string;
  status: 'paid' | 'pending_check' | 'processing' | 'shipped' | 'delivered';
  shippingMethod: string;
  trackingCode?: string;
  notes?: string;
}

export interface Shipment {
  id: string;
  invoiceNumber: string;
  customerName: string;
  phone: string;
  destinationCity: string;
  carrier: 'باربری وطن' | 'تیپاکس' | 'چاپار' | 'پست پیشتاز' | 'باربری پیام‌گیر';
  waybillNumber: string; // شماره بیجک / کد رهگیری
  packageCount: number; // تعداد کارتن یا کیسه گونی
  shippingDate: string;
  status: 'registered' | 'in_transit' | 'delivered';
  smsNotificationSent: boolean;
}

export interface SocialPost {
  id: string;
  productId: string;
  productName: string;
  image: string;
  caption: string;
  hashtags: string[];
  channels: {
    telegram: boolean;
    rubika: boolean;
    eitaa: boolean;
    bale: boolean;
    instagram: boolean;
  };
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'draft';
  publishedAt?: string;
}

export interface AutoResponderRule {
  id: string;
  title: string;
  keywords: string[];
  response: string;
  channels: string[];
  isActive: boolean;
}

export type UserRoleType = 'super_admin' | 'content_admin' | 'accountant' | 'warehouse_manager' | 'marketer';

export interface UserRole {
  id: string;
  name: string;
  role: UserRoleType;
  roleTitle: string;
  phone: string;
  permissions: string[];
  lastActive: string;
}

export interface CustomerUser {
  id: string;
  phone: string;
  fullName: string;
  storeName?: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
  password?: string;
  isPartnerWholesale?: boolean;
  registeredAt: string;
  lastLoginAt?: string;
  totalOrdersCount?: number;
  totalSpentToman?: number;
}

export type StorefrontBannerPosition = 'after_bestsellers' | 'after_new_arrivals' | 'after_retail' | 'mid_grid';

export type StorefrontBannerAction = 
  | 'wholesale_modal' 
  | 'about_modal' 
  | 'routing_map' 
  | 'telegram' 
  | 'whatsapp' 
  | 'call_sales' 
  | 'retail_filter' 
  | 'scroll_catalog';

export type StorefrontBannerStyle = 'gold_luxury' | 'dark_emerald' | 'amber_bazaar' | 'purple_royal' | 'crimson_sale';

export type StorefrontBannerIcon = 'flame' | 'sparkles' | 'truck' | 'shield' | 'package' | 'scissors' | 'store' | 'tag';

export interface StorefrontBanner {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  tagline?: string;
  buttonText: string;
  buttonAction: StorefrontBannerAction;
  buttonTarget?: string;
  secondaryButtonText?: string;
  secondaryButtonAction?: StorefrontBannerAction;
  styleVariant: StorefrontBannerStyle;
  iconType: StorefrontBannerIcon;
  position: StorefrontBannerPosition;
  isActive: boolean;
}

export interface SiteSettings {
  brandName: string;
  brandSubtitle: string;
  mainAddress: string;
  subwayAddress: string;
  primaryPhone: string;
  salesPhone: string;
  supportPhone: string;
  telegramChannel: string;
  telegramChannelUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcementNotice: string;
  isRetailSaleActive: boolean;
  minFreeShippingToman: number;
  midGridBanners?: StorefrontBanner[];
}

export interface FabricSupplier {
  id: string;
  name: string;
  managerName: string;
  phone: string;
  marketLocation: string; // e.g. بازار مولوی، سرای آزادی
  fabricTypes: string[]; // e.g. ['کتان لایت', 'داکرون', 'لینن']
  avgPricePerMeter: number; // تومان
  rollLengthMeters: number; // متراژ طاقه
  defectRate: string; // کمتر از ۱٪
  deliverySpeed: string; // همان روز / ۲۴ ساعته
  paymentTerms: string; // نقدی با ۲٪ تخفیف / چک صیادی ۳۰ روزه
  rating: number; // 1 to 5
  notes?: string;
  lastPurchaseDate?: string;
}

export interface TailorWorkshop {
  id: string;
  name: string;
  masterName: string;
  phone: string;
  address: string; // e.g. بازار خیام، کوچه کربلایی
  specialtyModels: string[]; // e.g. ['شلوار بگ', 'داکرون اداری', 'لگ غواصی']
  wagePerUnit: number; // دستمزد دوخت هر عدد به تومان
  qualityScore: string; // عالی (پنج‌لا دوز)، تخصصی کش‌دوزی
  dailyCapacity: number; // تعداد در روز
  typicalLeadTimeDays: number; // زمان آماده‌سازی (روز)
  rating: number;
  notes?: string;
  currentActiveBatchesCount?: number;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string; // e.g. PRD-1403-101
  productName: string;
  category: string;
  fabricSupplierId: string;
  fabricSupplierName: string;
  fabricType: string;
  fabricMetersUsed: number; // متراژ پارچه مصرفی
  fabricCostPerMeter: number;
  tailorWorkshopId: string;
  tailorWorkshopName: string;
  wagePerUnit: number;
  plannedUnitCount: number; // تعداد خروجی برنامه‌ریزی شده (مثلا ۶۰۰ عدد)
  status: 'fabric_ordered' | 'cutting' | 'sewing' | 'finishing_ironing' | 'delivered_to_warehouse';
  startDate: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  totalCostToman: number;
  costPerUnitToman: number;
  notes?: string;
}

