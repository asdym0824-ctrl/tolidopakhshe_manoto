import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  PackageCheck, 
  Truck, 
  CheckCircle2, 
  ChevronLeft, 
  Clock, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { StorefrontOrder } from '../../types';
import { 
  ORDER_WORKFLOW_STEPS, 
  getOrderStageIndex, 
  isWorkflowStepCompleted, 
  isWorkflowStepActive,
  getNextWorkflowStatus
} from '../../data/orderWorkflow';

interface OrderWorkflowStepperProps {
  order: StorefrontOrder;
  onUpdateStatus: (
    newStatus: StorefrontOrder['orderStatus'], 
    carrierName?: string, 
    waybillNumber?: string, 
    notes?: string
  ) => void;
  onShowToast?: (msg: string) => void;
}

export const OrderWorkflowStepper: React.FC<OrderWorkflowStepperProps> = ({
  order,
  onUpdateStatus,
  onShowToast
}) => {
  const currentStage = getOrderStageIndex(order.orderStatus);
  const nextStatus = getNextWorkflowStatus(order.orderStatus);

  // Quick carrier & waybill inline fields for Step 3
  const [quickCarrier, setQuickCarrier] = useState(order.carrierName || 'باربری وطن (شوش)');
  const [quickWaybill, setQuickWaybill] = useState(order.waybillNumber || '');
  const [isWaybillOpen, setIsWaybillOpen] = useState(false);

  const handleStepTick = (targetStatus: StorefrontOrder['orderStatus'], stepTitle: string) => {
    onUpdateStatus(
      targetStatus,
      quickCarrier,
      quickWaybill || order.waybillNumber,
      `تغییر وضعیت به ${stepTitle}`
    );
    if (onShowToast) {
      onShowToast(`مرحله با موفقیت انجام شد: ${stepTitle}`);
    }
  };

  const handleNextAction = () => {
    if (!nextStatus) return;

    if (nextStatus === 'sent_to_carrier' && !order.waybillNumber && !quickWaybill) {
      // Prompt admin to enter waybill or open waybill box
      setIsWaybillOpen(true);
      return;
    }

    const stepDef = ORDER_WORKFLOW_STEPS.find(s => s.targetStatus === nextStatus);
    const title = stepDef ? stepDef.shortTitle : nextStatus;
    onUpdateStatus(
      nextStatus,
      quickCarrier,
      quickWaybill || order.waybillNumber,
      `انجام مرحله ${title}`
    );
    if (onShowToast) {
      onShowToast(`تیک مرحله ثبت شد: ${title}`);
    }
  };

  const handleRevertToStage = (targetStatus: StorefrontOrder['orderStatus']) => {
    onUpdateStatus(targetStatus, order.carrierName, order.waybillNumber, 'بازگردانی به مرحله قبل');
    if (onShowToast) {
      onShowToast('وضعیت سفارش به مرحله قبل بازگردانده شد.');
    }
  };

  const getStepIcon = (stepNum: 1 | 2 | 3 | 4) => {
    switch (stepNum) {
      case 1:
        return <ShieldCheck className="w-4 h-4" />;
      case 2:
        return <PackageCheck className="w-4 h-4" />;
      case 3:
        return <Truck className="w-4 h-4" />;
      case 4:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-[#FAF7F2] rounded-2xl border border-[#E6DEC8] p-3.5 sm:p-4 space-y-3.5" dir="rtl">
      
      {/* Stepper Header: Current Stage indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6DEC8]/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#18181B] text-[#D4AF37] flex items-center justify-center font-black text-xs">
            {currentStage === 0 ? '۰' : currentStage === 1 ? '۱' : currentStage === 2 ? '۲' : currentStage === 3 ? '۳' : '۴'}
          </div>
          <div>
            <span className="text-xs font-black text-stone-900 block">
              فرایند ۴ مرحله‌ای پردازش سفارش
            </span>
            <span className="text-[11px] text-stone-500 block">
              {currentStage === 0 && 'مشتری سفارش را ثبت کرده است • در انتظار تأیید ادمین'}
              {currentStage === 1 && 'مرحلهٔ ۱ انجام شد • در صف دسته‌بندی و بسته‌بندی انبار'}
              {currentStage === 2 && 'مرحلهٔ ۲ انجام شد • در صف ارسال به باربری / صدور بیجک'}
              {currentStage === 3 && 'مرحلهٔ ۳ انجام شد • مرسوله در مسیر مقصد است'}
              {currentStage === 4 && 'مرحلهٔ ۴ انجام شد • تحویل قطعی به خریدار'}
            </span>
          </div>
        </div>

        {/* Small reset button if completed or past step 1 */}
        {currentStage > 0 && (
          <button
            type="button"
            onClick={() => handleRevertToStage('registered')}
            className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 self-end sm:self-auto py-1 px-2 rounded-lg hover:bg-stone-200/60 transition-colors"
            title="بازنشانی به حالت ثبت اولیه"
          >
            <RotateCcw className="w-3 h-3" />
            <span>بازنشانی مراحل</span>
          </button>
        )}
      </div>

      {/* 4 Sequential Interactive Step Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {ORDER_WORKFLOW_STEPS.map((stepDef) => {
          const isCompleted = isWorkflowStepCompleted(order.orderStatus, stepDef.step);
          const isActive = isWorkflowStepActive(order.orderStatus, stepDef.step);
          const isPending = !isCompleted && !isActive;

          return (
            <div
              key={stepDef.id}
              className={`relative rounded-xl p-3 border transition-all flex flex-col justify-between gap-2.5 ${
                isCompleted
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                  : isActive
                  ? 'bg-white border-[#D4AF37] ring-2 ring-[#D4AF37]/30 text-stone-900 shadow-md'
                  : 'bg-stone-100/70 border-stone-200 text-stone-400 opacity-80'
              }`}
            >
              {/* Step Title & Status Icon */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-[#18181B] text-[#D4AF37]'
                      : 'bg-stone-300 text-stone-600'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepDef.step}
                  </span>

                  <div>
                    <h4 className={`text-xs font-black ${isCompleted ? 'text-emerald-900' : isActive ? 'text-stone-900' : 'text-stone-600'}`}>
                      {stepDef.title}
                    </h4>
                    <span className="text-[10px] text-stone-500 block">
                      مسئول: {stepDef.actor}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-stone-400">
                  {getStepIcon(stepDef.step)}
                </div>
              </div>

              {/* Status Note / Description */}
              <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                isCompleted ? 'text-emerald-800' : isActive ? 'text-stone-700' : 'text-stone-500'
              }`}>
                {stepDef.description}
              </p>

              {/* Action / Tick Area */}
              <div className="pt-2 border-t border-black/5 flex items-center justify-between gap-2">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>انجام شد ✓</span>
                  </div>
                ) : isActive ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (stepDef.targetStatus === 'sent_to_carrier' && !order.waybillNumber && !quickWaybill) {
                        setIsWaybillOpen(true);
                      } else {
                        handleStepTick(stepDef.targetStatus, stepDef.shortTitle);
                      }
                    }}
                    className="w-full py-1.5 px-3 bg-[#18181B] hover:bg-stone-800 active:scale-95 text-[#D4AF37] font-black rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>تیک زدن و تأیید</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStepTick(stepDef.targetStatus, stepDef.shortTitle)}
                    className="text-[11px] text-stone-500 hover:text-stone-800 underline decoration-dotted cursor-pointer py-0.5"
                    title="پرش مستقیم به این مرحله"
                  >
                    انتقال مستقیم
                  </button>
                )}

                {/* Specific Timestamps if saved */}
                {stepDef.step === 1 && order.adminConfirmedAt && (
                  <span className="text-[10px] text-stone-500 font-mono" title="زمان تایید ادمین">
                    {order.adminConfirmedAt.split('ساعت')[1] || order.adminConfirmedAt}
                  </span>
                )}
                {stepDef.step === 2 && order.packedAt && (
                  <span className="text-[10px] text-stone-500 font-mono" title="زمان بسته‌بندی">
                    {order.packedAt.split('ساعت')[1] || order.packedAt}
                  </span>
                )}
                {stepDef.step === 3 && order.shippedAt && (
                  <span className="text-[10px] text-stone-500 font-mono" title="زمان تحویل باربری">
                    {order.shippedAt.split('ساعت')[1] || order.shippedAt}
                  </span>
                )}
                {stepDef.step === 4 && order.deliveredAt && (
                  <span className="text-[10px] text-stone-500 font-mono" title="زمان تحویل">
                    {order.deliveredAt.split('ساعت')[1] || order.deliveredAt}
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Inline Waybill Drawer for Step 3 (ارسال و باربری) */}
      {(isWaybillOpen || (isWorkflowStepActive(order.orderStatus, 3) && !order.waybillNumber)) && (
        <div className="bg-purple-50/90 border border-purple-200 rounded-xl p-3 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-purple-700" />
              <span>ثبت اطلاعات بارنامه / بیجک باربری برای مرحلهٔ ۳:</span>
            </span>
            <button
              type="button"
              onClick={() => setIsWaybillOpen(false)}
              className="text-xs text-purple-700 hover:text-purple-900 font-bold"
            >
              بستن
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-purple-900 block mb-1">
                نام متصدی باربری / پیک:
              </label>
              <input
                type="text"
                value={quickCarrier}
                onChange={(e) => setQuickCarrier(e.target.value)}
                placeholder="مثلاً: باربری وطن یا تیپاکس"
                className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-bold text-stone-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-purple-900 block mb-1">
                شماره بیجک / بارنامه / کد رهگیری:
              </label>
              <input
                type="text"
                value={quickWaybill}
                onChange={(e) => setQuickWaybill(e.target.value)}
                placeholder="مثال: VTN-88421"
                className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-mono font-bold text-stone-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                handleStepTick('sent_to_carrier', 'ارسال');
                setIsWaybillOpen(false);
              }}
              className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>ثبت بیجک و تأیید مرحلهٔ ارسال</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Progressive Action Bar */}
      <div className="bg-white rounded-xl p-3 border border-[#E6DEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-xs font-bold text-stone-800">
            {nextStatus ? (
              <>
                گام بعدی: <strong className="text-stone-950 font-black">
                  {ORDER_WORKFLOW_STEPS.find(s => s.targetStatus === nextStatus)?.actionButtonLabel}
                </strong>
              </>
            ) : (
              <span className="text-emerald-700 font-black flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                تمامی ۴ مرحله با موفقیت انجام شد و سفارش تحویل داده شده است.
              </span>
            )}
          </span>
        </div>

        {nextStatus && (
          <button
            type="button"
            onClick={handleNextAction}
            className="px-4 py-2 bg-[#18181B] hover:bg-stone-800 active:scale-95 text-[#D4AF37] rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Check className="w-4 h-4 text-[#D4AF37]" />
            <span>
              زدن تیک: {ORDER_WORKFLOW_STEPS.find(s => s.targetStatus === nextStatus)?.shortTitle}
            </span>
            <ChevronLeft className="w-4 h-4 text-stone-400" />
          </button>
        )}
      </div>

    </div>
  );
};

function isActiveStage(orderStatus: StorefrontOrder['orderStatus'], stepNum: 1 | 2 | 3 | 4): boolean {
  return isWorkflowStepActive(orderStatus, stepNum);
}
