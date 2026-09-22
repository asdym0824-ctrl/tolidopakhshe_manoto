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

export const MobileQuickActionFAB: React.FC<MobileQuickActionFABProps> = () => {
  // Floating action button removed to avoid cluttering and degradation of mobile dashboard
  return null;
};
