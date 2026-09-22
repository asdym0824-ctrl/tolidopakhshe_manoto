import { UserRoleType } from '../types';

export interface AdminAccountCredential {
  role: UserRoleType;
  username: string;
  password: string;
  name: string;
  title: string;
  description: string;
  badgeBg: string;
  badgeText: string;
}

export const ADMIN_SECURITY_ACCOUNTS: Record<UserRoleType, AdminAccountCredential> = {
  super_admin: {
    role: 'super_admin',
    username: 'admin',
    password: 'manoto1403admin',
    name: 'حاج رضا اسدی',
    title: 'سوپر ادمین مرکزی (دسترسی کامل)',
    description: 'دسترسی نامحدود به تمامی بخش‌های مالی، فاکتورها، چک‌ها، انبار و تنظیمات',
    badgeBg: 'bg-[#18181B]',
    badgeText: 'text-[#D4AF37]',
  },
  content_admin: {
    role: 'content_admin',
    username: 'content',
    password: 'manoto1403content',
    name: 'واحد مدیریت محتوا و انبارداری',
    title: 'پنل مدیر محتوا و محصولات',
    description: 'دسترسی اختصاصی به موجودی کالاها، انبار، قیمت‌گذاری و ویرایش اجناس',
    badgeBg: 'bg-emerald-950',
    badgeText: 'text-emerald-300',
  },
  order_tracker: {
    role: 'order_tracker',
    username: 'orders',
    password: 'manoto1403orders',
    name: 'واحد پیگیری سفارشات',
    title: 'ادمین پیگیری سفارشات و ارسال',
    description: 'فقط مشاهده خریداران، اقلام سفارش و ثبت وضعیت بسته‌بندی و بارنامه',
    badgeBg: 'bg-amber-950',
    badgeText: 'text-amber-300',
  },
};

/**
 * Validates a role password strictly
 */
export function verifyRoleCredentials(role: UserRoleType, inputPassword: string): boolean {
  const account = ADMIN_SECURITY_ACCOUNTS[role];
  if (!account) return false;
  return account.password === inputPassword.trim();
}
