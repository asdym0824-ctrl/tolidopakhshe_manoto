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
      'roles'
    ],
  },
  accountant: {
    role: 'accountant',
    title: 'حسابدار و امور مالی',
    shortLabel: 'حسابداری',
    description: 'دسترسی به داشبورد، امور مالی و چک‌ها، فاکتورهای فروش و سوابق مشتریان',
    badgeBg: 'bg-emerald-900',
    badgeText: 'text-emerald-300',
    allowedTabs: ['dashboard', 'finance', 'sales', 'crm'],
  },
  warehouse_manager: {
    role: 'warehouse_manager',
    title: 'مدیر انبار و لجستیک',
    shortLabel: 'انبار و لجستیک',
    description: 'دسترسی به کنترل موجودی پک‌ها، بهای تمام‌شده و بیجک‌های باربری',
    badgeBg: 'bg-amber-900',
    badgeText: 'text-amber-300',
    allowedTabs: ['dashboard', 'inventory', 'logistics'],
  },
  content_admin: {
    role: 'content_admin',
    title: 'مدیر محتوا و سایت',
    shortLabel: 'محتوا و وب‌سایت',
    description: 'دسترسی به هوش مصنوعی بازاریابی، مدیریت محصولات و تنظیمات ویترین آنلاین',
    badgeBg: 'bg-purple-900',
    badgeText: 'text-purple-300',
    allowedTabs: ['dashboard', 'marketing', 'storefront'],
  },
  marketer: {
    role: 'marketer',
    title: 'کارشناس بازاریابی و فروش',
    shortLabel: 'بازاریابی و CRM',
    description: 'دسترسی به دستیار هوش مصنوعی، ارتباط با مشتریان بازار و خریداران سایت',
    badgeBg: 'bg-blue-900',
    badgeText: 'text-blue-300',
    allowedTabs: ['dashboard', 'marketing', 'crm', 'retail_customers'],
  },
};

export function isTabAllowedForRole(tab: ModuleTab, role: UserRoleType): boolean {
  const config = ROLE_PERMISSIONS[role];
  if (!config) return false;
  return config.allowedTabs.includes(tab);
}
