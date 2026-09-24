import React from 'react';
import { 
  Check, 
  ShieldCheck, 
  PackageCheck, 
  Truck, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { StorefrontOrder } from '../../types';
import { 
  ORDER_WORKFLOW_STEPS, 
  getOrderStageIndex, 
  isWorkflowStepCompleted, 
  isWorkflowStepActive 
} from '../../data/orderWorkflow';

interface CustomerOrderStepperProps {
  order: StorefrontOrder;
  compact?: boolean;
}

export const CustomerOrderStepper: React.FC<CustomerOrderStepperProps> = ({ 
  order,
  compact = false 
}) => {
  const currentStage = getOrderStageIndex(order.orderStatus);

  const getStepIcon = (stepNum: 1 | 2 | 3 | 4) => {
    switch (stepNum) {
      case 1:
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 2:
        return <PackageCheck className="w-3.5 h-3.5" />;
      case 3:
        return <Truck className="w-3.5 h-3.5" />;
      case 4:
        return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full space-y-2.5" dir="rtl">
      
      {/* Step Header Summary */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-stone-800">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>وضعیت گام‌به‌گام سفارش:</span>
        </div>

        <span className="font-black text-xs px-2.5 py-0.5 rounded-full border bg-white border-[#DDD5C0] text-stone-900 shadow-2xs">
          {currentStage === 0 && 'ثبت اولیه توسط شما (در صف بررسی ادمین)'}
          {currentStage === 1 && 'مرحله ۱: تأیید شده توسط ادمین من و تو'}
          {currentStage === 2 && 'مرحله ۲: دسته‌بندی و بسته‌بندی در انبار'}
          {currentStage === 3 && 'مرحله ۳: ارسال شده به باربری / تیپاکس'}
          {currentStage === 4 && 'مرحله ۴: تحویل موفق به خریدار'}
        </span>
      </div>

      {/* Responsive Visual Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ORDER_WORKFLOW_STEPS.map((s) => {
          const isCompleted = isWorkflowStepCompleted(order.orderStatus, s.step);
          const isActive = isWorkflowStepActive(order.orderStatus, s.step);

          return (
            <div
              key={s.id}
              className={`rounded-xl p-2.5 border transition-all flex flex-col justify-between gap-1.5 ${
                isCompleted
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs'
                  : isActive
                  ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-400 text-amber-950 shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-400'
              }`}
            >
              {/* Step indicator and Icon */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-amber-500 text-stone-950 animate-pulse'
                      : 'bg-stone-200 text-stone-600'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.step}
                  </span>
                  <span className={`text-[11px] font-black line-clamp-1 ${
                    isCompleted ? 'text-emerald-900' : isActive ? 'text-amber-950' : 'text-stone-600'
                  }`}>
                    {s.shortTitle}
                  </span>
                </div>

                <div className="shrink-0 opacity-70">
                  {getStepIcon(s.step)}
                </div>
              </div>

              {/* Status Note */}
              <p className={`text-[10px] leading-tight line-clamp-2 ${
                isCompleted ? 'text-emerald-800' : isActive ? 'text-amber-900 font-medium' : 'text-stone-400'
              }`}>
                {isCompleted ? s.completedBadgeText : isActive ? s.customerNote : 'در انتظار مراحل قبل'}
              </p>

              {/* Additional Context (Waybill or Date) */}
              {s.step === 3 && order.waybillNumber && isCompleted && (
                <div className="mt-0.5 text-[10px] bg-white/80 px-1.5 py-0.5 rounded border border-emerald-200 font-mono text-emerald-900 truncate">
                  بیجک: {order.waybillNumber}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
