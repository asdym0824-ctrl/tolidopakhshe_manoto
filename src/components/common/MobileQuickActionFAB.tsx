import React, { useState } from 'react';
import { 
  Plus, 
  Receipt, 
  PackagePlus, 
  UserPlus, 
  Scissors, 
  Sparkles, 
  X,
  Zap
} from 'lucide-react';
import { UserRoleType } from '../../types';
import { isTabAllowedForRole } from '../../utils/rolePermissions';

interface MobileQuickActionFABProps {
  currentUserRole: UserRoleType;
  onOpenNewInvoice: () => void;
  onOpenNewProduct: () => void;
  onOpenNewCustomer: () => void;
  onOpenNewBatch: () => void;
  onOpenQuickEntry: () => void;
}

export const MobileQuickActionFAB: React.FC<MobileQuickActionFABProps> = ({
  currentUserRole,
  onOpenNewInvoice,
  onOpenNewProduct,
  onOpenNewCustomer,
  onOpenNewBatch,
  onOpenQuickEntry,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check RBAC permissions for each action
  const canCreateInvoice = isTabAllowedForRole('sales', currentUserRole);
  const canCreateProduct = isTabAllowedForRole('inventory', currentUserRole);
  const canCreateCustomer = isTabAllowedForRole('crm', currentUserRole);
  const canCreateBatch = isTabAllowedForRole('production', currentUserRole);
  const canUseQuickEntry = canCreateInvoice || canCreateProduct;

  const actions = [
    {
      id: 'quick-entry',
      label: 'ثبت سریع با یک خط (هوشمند)',
      icon: Zap,
      allowed: canUseQuickEntry,
      color: 'bg-[#D4AF37] text-[#18181B] border-[#18181B]',
      onClick: () => {
        setIsOpen(false);
        onOpenQuickEntry();
      },
    },
    {
      id: 'new-invoice',
      label: 'صدور فاکتور عمده جدید',
      icon: Receipt,
      allowed: canCreateInvoice,
      color: 'bg-[#18181B] text-[#FAF7F2] border-[#3F3F46]',
      onClick: () => {
        setIsOpen(false);
        onOpenNewInvoice();
      },
    },
    {
      id: 'new-product',
      label: 'ثبت کالای جدید در انبار',
      icon: PackagePlus,
      allowed: canCreateProduct,
      color: 'bg-stone-800 text-[#FAF7F2] border-stone-700',
      onClick: () => {
        setIsOpen(false);
        onOpenNewProduct();
      },
    },
    {
      id: 'new-customer',
      label: 'ثبت مشتری / همکار جدید',
      icon: UserPlus,
      allowed: canCreateCustomer,
      color: 'bg-stone-800 text-[#FAF7F2] border-stone-700',
      onClick: () => {
        setIsOpen(false);
        onOpenNewCustomer();
      },
    },
    {
      id: 'new-batch',
      label: 'ثبت پارت تولید جدید',
      icon: Scissors,
      allowed: canCreateBatch,
      color: 'bg-stone-800 text-[#FAF7F2] border-stone-700',
      onClick: () => {
        setIsOpen(false);
        onOpenNewBatch();
      },
    },
  ].filter(a => a.allowed);

  if (actions.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden print:hidden" dir="rtl">
      {/* Backdrop overlay when open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity animate-in fade-in"
        />
      )}

      {/* Expanded Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 z-50 flex flex-col items-end gap-2.5 mb-2 w-64 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-stone-900/90 text-stone-300 text-[10px] px-2.5 py-1 rounded-full font-bold self-center mb-1">
            عملیات سریع حجره
          </div>

          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-xl transition-all active:scale-95 cursor-pointer ${action.color}`}
              >
                <span className="text-xs font-black truncate">{action.label}</span>
                <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Floating Action Button (FAB) */}
      <button
        id="mobile-fab-main-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all transform active:scale-90 border-2 z-50 cursor-pointer ${
          isOpen 
            ? 'bg-[#18181B] text-[#FAF7F2] border-[#D4AF37] rotate-90' 
            : 'bg-[#D4AF37] text-[#18181B] border-[#18181B] ring-4 ring-black/10'
        }`}
        aria-label="دکمه عملیات سریع"
        title="عملیات سریع"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-7 h-7 stroke-[2.5]" />
        )}
      </button>
    </div>
  );
};
