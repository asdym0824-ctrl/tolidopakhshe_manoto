import { ModuleTab, UserRoleType } from '../types';

export interface RoleConfig {
  role: UserRoleType;
  title: string;
  shortLabel: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  allowedTabs: ModuleTab[];
}

export const ROLE_PERMISSIONS: Record<UserRoleType, RoleConfig> = {
  super_admin: {
    role: 'super_admin',
    title: 'سوپر ادمین مرکزی (دسترسی کامل)',
    shortLabel: 'سوپر ادمین',
    description: 'دسترسی نامحدود به تمامی بخش‌های مالی، انبارداری، فروش، سایت و امنیت',
    badgeBg: 'bg-[#18181B]',
    badgeText: 'text-[#D4AF37]',
    allowedTabs: [
      'dashboard',
      'inventory',
      'production',
      'crm',
      'retail_customers',
      'sales',
      'finance',
      'marketing',
      'storefront',
      'logistics',
      'order_tracking',
      'roles'
    ],
  },
  content_admin: {
    role: 'content_admin',
    title: 'پنل مدیریت تولید محتوا و رسانه (دسترسی کامل به وب‌سایت، بنرها و انبار)',
    shortLabel: 'مدیر محتوا و سایت',
    description: 'دسترسی کامل به ویرایش بنرها، تبلیغات، بک‌گراند و تم سایت، پاپ‌آپ‌ها، کاتالوگ و مشخصات محصولات',
    badgeBg: 'bg-emerald-950',
    badgeText: 'text-emerald-300',
    allowedTabs: ['storefront', 'inventory', 'marketing'],
  },
  order_tracker: {
    role: 'order_tracker',
    title: 'ادمین پیگیری سفارشات (محدود به سفارش‌ها)',
    shortLabel: 'پیگیری سفارشات',
    description: 'فقط مشاهده خریداران، اقلام سفارش داده شده و پیگیری ارسال و بارنامه',
    badgeBg: 'bg-amber-950',
    badgeText: 'text-amber-300',
    allowedTabs: ['order_tracking'],
  },
};

export function isTabAllowedForRole(tab: ModuleTab, role: UserRoleType): boolean {
  const config = ROLE_PERMISSIONS[role];
  if (!config) return false;
  return config.allowedTabs.includes(tab);
}
