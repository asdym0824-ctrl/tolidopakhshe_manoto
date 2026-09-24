import { StorefrontOrder } from '../types';

export interface OrderWorkflowStepDef {
  step: 1 | 2 | 3 | 4;
  id: 'step_confirm' | 'step_pack' | 'step_ship' | 'step_deliver';
  targetStatus: StorefrontOrder['orderStatus'];
  title: string;
  shortTitle: string;
  actor: string;
  description: string;
  actionButtonLabel: string;
  completedBadgeText: string;
  customerNote: string;
}

export const ORDER_WORKFLOW_STEPS: OrderWorkflowStepDef[] = [
  {
    step: 1,
    id: 'step_confirm',
    targetStatus: 'confirmed',
    title: 'مرحلهٔ اول: تأیید سفارش',
    shortTitle: 'تأیید سفارش',
    actor: 'ادمین مخصوص سفارش‌ها',
    description: 'بررسی اقلام فاکتور، وضعیت پرداخت و تأیید نهایی سفارش توسط ادمین',
    actionButtonLabel: 'تأیید سفارش (ادمین مخصوص)',
    completedBadgeText: 'تأیید شده توسط ادمین',
    customerNote: 'سفارش توسط ادمین مخصوص بررسی و تأیید شد.',
  },
  {
    step: 2,
    id: 'step_pack',
    targetStatus: 'packed',
    title: 'مرحلهٔ دوم: دسته‌بندی و بسته‌بندی',
    shortTitle: 'دسته‌بندی',
    actor: 'انبار و آماده‌سازی بازار',
    description: 'تفکیک مدل‌ها، دسته‌بندی رنگ و سایز، و بسته‌بندی محکم کارتن در انبار',
    actionButtonLabel: 'تکمیل دسته‌بندی و بسته‌بندی',
    completedBadgeText: 'دسته‌بندی و بسته‌بندی شده',
    customerNote: 'اقلام سفارش شما دسته‌بندی و آماده ارسال شد.',
  },
  {
    step: 3,
    id: 'step_ship',
    targetStatus: 'sent_to_carrier',
    title: 'مرحلهٔ سوم: ارسال مرسوله',
    shortTitle: 'ارسال',
    actor: 'متصدی باربری و ناوگان',
    description: 'تحویل بار به باربری وطن، تیپاکس یا پیک بازار و صدور شماره بیجک',
    actionButtonLabel: 'تأیید ارسال و صدور بیجک',
    completedBadgeText: 'ارسال شده (دارای بیجک)',
    customerNote: 'مرسوله به متصدی باربری تحویل شد و شماره بارنامه صادر شد.',
  },
  {
    step: 4,
    id: 'step_deliver',
    targetStatus: 'delivered',
    title: 'مرحلهٔ چهارم: تحویل خریدار',
    shortTitle: 'تحویل خریدار',
    actor: 'خریدار در مقصد',
    description: 'تحویل نهایی کالا به دست همکار یا مشتری در مقصد',
    actionButtonLabel: 'تأیید نهایی تحویل به خریدار',
    completedBadgeText: 'تحویل داده شده به خریدار',
    customerNote: 'مرسوله با موفقیت تحویل خریدار گرامی شد.',
  },
];

/**
 * Returns the current stage index (0 = registered, 1 = confirmed, 2 = packed/processing, 3 = sent_to_carrier, 4 = delivered)
 */
export function getOrderStageIndex(status: StorefrontOrder['orderStatus']): number {
  switch (status) {
    case 'registered':
      return 0;
    case 'confirmed':
      return 1;
    case 'processing':
    case 'packed':
      return 2;
    case 'sent_to_carrier':
      return 3;
    case 'delivered':
      return 4;
    default:
      return 0;
  }
}

/**
 * Determines whether a step is completely finished
 */
export function isWorkflowStepCompleted(orderStatus: StorefrontOrder['orderStatus'], stepNumber: 1 | 2 | 3 | 4): boolean {
  const currentStage = getOrderStageIndex(orderStatus);
  return currentStage >= stepNumber;
}

/**
 * Determines whether a step is currently active (next action required)
 */
export function isWorkflowStepActive(orderStatus: StorefrontOrder['orderStatus'], stepNumber: 1 | 2 | 3 | 4): boolean {
  const currentStage = getOrderStageIndex(orderStatus);
  return currentStage === stepNumber - 1;
}

/**
 * Returns the target status when clicking the next action
 */
export function getNextWorkflowStatus(orderStatus: StorefrontOrder['orderStatus']): StorefrontOrder['orderStatus'] | null {
  const currentStage = getOrderStageIndex(orderStatus);
  switch (currentStage) {
    case 0: // registered -> confirmed
      return 'confirmed';
    case 1: // confirmed -> packed
      return 'packed';
    case 2: // packed -> sent_to_carrier
      return 'sent_to_carrier';
    case 3: // sent_to_carrier -> delivered
      return 'delivered';
    default:
      return null;
  }
}

/**
 * Formats current Persian timestamp
 */
export function getCurrentFaTimestamp(): string {
  const now = new Date();
  const d = now.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const t = now.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${d} ساعت ${t}`;
}
