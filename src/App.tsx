import React, { useState } from 'react';
import { 
  ModuleTab, 
  Product, 
  Customer, 
  Invoice, 
  CheckItem, 
  SocialPost, 
  AutoResponderRule, 
  UserRoleType,
  StorefrontOrder,
  CustomerUser,
  SiteSettings,
  FabricSupplier,
  TailorWorkshop,
  ProductionBatch
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_INVOICES, 
  INITIAL_CHECKS, 
  INITIAL_SOCIAL_POSTS, 
  INITIAL_AUTO_RESPONDERS,
  INITIAL_STOREFRONT_ORDERS,
  INITIAL_FABRIC_SUPPLIERS,
  INITIAL_TAILOR_WORKSHOPS,
  INITIAL_PRODUCTION_BATCHES
} from './data/mockData';

// Initial registered customer accounts for storefront & retail
const INITIAL_CUSTOMER_USERS: CustomerUser[] = [
  {
    id: 'usr-1',
    phone: '09131234567',
    fullName: 'حاج محمود کاظمی',
    storeName: 'پوشاک کاظمی اصفهان',
    province: 'اصفهان',
    city: 'اصفهان',
    address: 'میدان نقش جهان، بازار قیصریه، سرای مخلص، پلاک ۱۲',
    postalCode: '8146599123',
    isPartnerWholesale: true,
    registeredAt: '۱۴۰۳/۰۴/۱۵',
    totalOrdersCount: 2,
    totalSpentToman: 2340000,
  },
  {
    id: 'usr-2',
    phone: '09359876543',
    fullName: 'خانم سمیرا رضوانی',
    storeName: 'بوتیک مانلی مشهد',
    province: 'خراسان رضوی',
    city: 'مشهد',
    address: 'بلوار احمدآباد، نبش خیابان پاستور، مجتمع تجاری آلتون',
    postalCode: '9183746501',
    isPartnerWholesale: true,
    registeredAt: '۱۴۰۳/۰۵/۰۱',
    totalOrdersCount: 1,
    totalSpentToman: 1180000,
  },
  {
    id: 'usr-3',
    phone: '09351112233',
    fullName: 'نیلوفر رضایی',
    province: 'تهران',
    city: 'تهران',
    address: 'سعادت‌آباد، خیابان صرافها، پلاک ۱۸، واحد ۴',
    postalCode: '1998765432',
    isPartnerWholesale: false,
    registeredAt: '۱۴۰۳/۰۳/۰۲',
    totalOrdersCount: 1,
    totalSpentToman: 515000,
  },
  {
    id: 'usr-4',
    phone: '09129876543',
    fullName: 'پریسا کاشانی',
    province: 'تهران',
    city: 'تهران',
    address: 'پاسداران، بوستان دوم، کوچه مریم، پلاک ۹',
    postalCode: '1668749120',
    isPartnerWholesale: false,
    registeredAt: '۱۴۰۳/۰۲/۱۵',
    totalOrdersCount: 3,
    totalSpentToman: 1250000,
  },
  {
    id: 'usr-5',
    phone: '09173334455',
    fullName: 'زهرا دهقانی',
    province: 'فارس',
    city: 'شیراز',
    address: 'خیابان زند، کوچه ۴۴، مجتمع آفتاب',
    postalCode: '7134981200',
    isPartnerWholesale: false,
    registeredAt: '۱۴۰۳/۰۱/۲۰',
    totalOrdersCount: 4,
    totalSpentToman: 1890000,
  }
];

const INITIAL_SITE_SETTINGS: SiteSettings = {
  brandName: 'پوشاک من و تو',
  brandSubtitle: 'تولید و پخش شلوار زنانه اسدی • بازار بزرگ تهران',
  mainAddress: 'تهران، بازار بزرگ، سرای ملی، پاساژ المهدی ۴، پلاک ۲۴۲',
  subwayAddress: 'دسترسی سریع: ۵ دقیقه از ایستگاه‌های مترو خیام یا ۱۵ خرداد',
  primaryPhone: '09123456789',
  salesPhone: '02155667788',
  supportPhone: '09351234567',
  telegramChannel: '@manoto_pants',
  telegramChannelUrl: 'https://t.me/manoto_pants',
  heroHeadline: 'تولید و پخش عمده شلوار زنانه بازار بزرگ تهران',
  heroSubheadline: 'شلوارهای بگ کتان لایت، راحتی نخی و کارگو بدون واسطه با قیمت مستقیم کارگاه',
  announcementNotice: '🌟 ارسال فوری بار با باربری وطن و چاپار به تمام استان‌ها • مدل‌های جدید کالکشن تابستانه آماده ثبت سفارش',
  isRetailSaleActive: true,
  minFreeShippingToman: 5000000,
};

// Component Imports
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { InventoryModule } from './components/InventoryModule';
import { ProductionModule } from './components/ProductionModule';
import { CustomerCRMModule } from './components/CustomerCRMModule';
import { RetailCustomersModule } from './components/RetailCustomersModule';
import { SalesInvoiceModule } from './components/SalesInvoiceModule';
import { FinanceModule } from './components/FinanceModule';
import { MarketingAIModule } from './components/MarketingAIModule';
import { StorefrontModule } from './components/StorefrontModule';
import { LogisticsModule } from './components/LogisticsModule';
import { RolesSettingsModule } from './components/RolesSettingsModule';
import { MobileQuickActionFAB } from './components/common/MobileQuickActionFAB';
import { QuickNaturalLanguageEntryModal } from './components/common/QuickNaturalLanguageEntryModal';

// Storefront & Auth Imports
import { StorefrontView } from './components/storefront/StorefrontView';
import { AdminAuthGate } from './components/admin/AdminAuthGate';
import { calculateTotalUnitStock } from './utils/stockUtils';
import { isTabAllowedForRole, ROLE_PERMISSIONS } from './utils/rolePermissions';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function App() {
  // Application Zone State: 'storefront' (Public Store) | 'admin_auth' | 'admin_dashboard'
  const [appZone, setAppZone] = useState<'storefront' | 'admin_auth' | 'admin_dashboard'>('storefront');
  
  // Real Admin Authentication state backed by sessionStorage
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('manoto_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Admin Navigation State
  const [currentTab, setCurrentTab] = useState<ModuleTab>('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState<UserRoleType>('super_admin');

  // Domain Entity States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [checks, setChecks] = useState<CheckItem[]>(INITIAL_CHECKS);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [autoResponders, setAutoResponders] = useState<AutoResponderRule[]>(INITIAL_AUTO_RESPONDERS);
  const [storefrontOrders, setStorefrontOrders] = useState<StorefrontOrder[]>(INITIAL_STOREFRONT_ORDERS);
  const [customerUsers, setCustomerUsers] = useState<CustomerUser[]>(INITIAL_CUSTOMER_USERS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  
  // Production Management States (Super Admin)
  const [fabricSuppliers, setFabricSuppliers] = useState<FabricSupplier[]>(INITIAL_FABRIC_SUPPLIERS);
  const [tailorWorkshops, setTailorWorkshops] = useState<TailorWorkshop[]>(INITIAL_TAILOR_WORKSHOPS);
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>(INITIAL_PRODUCTION_BATCHES);

  // Quick Action Modal States
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isQuickEntryModalOpen, setIsQuickEntryModalOpen] = useState(false);

  // Direct Stock Update handler (for quick entry)
  const handleUpdateProductStock = (productId: string, newPackStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          packStock: newPackStock,
          totalUnitStock: calculateTotalUnitStock(newPackStock, p.packSize, p.singleStock)
        };
      }
      return p;
    }));
  };

  // Full System State Restore Handler (Fix 4)
  const handleRestoreFullState = (restored: any) => {
    if (restored.products && Array.isArray(restored.products)) setProducts(restored.products);
    if (restored.customers && Array.isArray(restored.customers)) setCustomers(restored.customers);
    if (restored.invoices && Array.isArray(restored.invoices)) setInvoices(restored.invoices);
    if (restored.checks && Array.isArray(restored.checks)) setChecks(restored.checks);
    if (restored.fabricSuppliers && Array.isArray(restored.fabricSuppliers)) setFabricSuppliers(restored.fabricSuppliers);
    if (restored.tailorWorkshops && Array.isArray(restored.tailorWorkshops)) setTailorWorkshops(restored.tailorWorkshops);
    if (restored.productionBatches && Array.isArray(restored.productionBatches)) setProductionBatches(restored.productionBatches);
    if (restored.customerUsers && Array.isArray(restored.customerUsers)) setCustomerUsers(restored.customerUsers);
    if (restored.siteSettings && typeof restored.siteSettings === 'object') setSiteSettings(restored.siteSettings);
  };

  // Reset to Default Factory Sample Data (Fix 4)
  const handleResetToSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setInvoices(INITIAL_INVOICES);
    setChecks(INITIAL_CHECKS);
    setFabricSuppliers(INITIAL_FABRIC_SUPPLIERS);
    setTailorWorkshops(INITIAL_TAILOR_WORKSHOPS);
    setProductionBatches(INITIAL_PRODUCTION_BATCHES);
    setCustomerUsers(INITIAL_CUSTOMER_USERS);
    setSiteSettings(INITIAL_SITE_SETTINGS);
  };

  // Admin Authentication handlers
  const handleAdminAuthenticated = () => {
    try {
      sessionStorage.setItem('manoto_admin_authenticated', 'true');
    } catch (e) {
      console.warn('Session storage write error', e);
    }
    setIsAdminAuthenticated(true);
    setAppZone('admin_dashboard');
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('manoto_admin_authenticated');
    } catch (e) {
      console.warn('Session storage remove error', e);
    }
    setIsAdminAuthenticated(false);
    setAppZone('storefront');
  };

  // Customer Account handlers
  const handleRegisterCustomerUser = (newUser: CustomerUser) => {
    setCustomerUsers(prev => {
      const idx = prev.findIndex(u => u.phone === newUser.phone);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...newUser };
        return updated;
      }
      return [newUser, ...prev];
    });
  };

  const handleUpdateCustomerUser = (updatedUser: CustomerUser) => {
    setCustomerUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // Computed alert badges
  const lowStockCount = products.filter(p => p.packStock <= p.minPackStockAlert).length;
  const checkAlertCount = checks.filter(c => c.status === 'pending' || c.status === 'in_collection').length;
  const followUpCount = customers.filter(c => c.followUpRequired).length;

  // Handlers for Storefront Order placement & Sync with Admin Inventory/Invoicing
  const handleStorefrontOrderPlaced = (order: StorefrontOrder) => {
    setStorefrontOrders([order, ...storefrontOrders]);

    // 1. Deduct stock from products using standardized calculateTotalUnitStock
    order.items.forEach(item => {
      setProducts(prev => prev.map(p => {
        if (p.id === item.productId) {
          if (item.mode === 'wholesale_pack') {
            const newPackStock = Math.max(0, p.packStock - item.quantity);
            return {
              ...p,
              packStock: newPackStock,
              totalUnitStock: calculateTotalUnitStock(newPackStock, p.packSize, p.singleStock)
            };
          } else {
            const newSingleStock = Math.max(0, (p.singleStock || 0) - item.quantity);
            return {
              ...p,
              singleStock: newSingleStock,
              totalUnitStock: calculateTotalUnitStock(p.packStock, p.packSize, newSingleStock)
            };
          }
        }
        return p;
      }));
    });

    // 2. Automatically create an invoice in the Admin system
    const syncInvoice: Invoice = {
      id: `inv-${order.orderNumber.replace(/[^0-9]/g, '') || Date.now()}`,
      invoiceNumber: order.orderNumber,
      customerId: order.customer.phone,
      customerName: order.customer.fullName,
      storeName: order.customer.storeName || 'سفارش آنلاین وب‌سایت',
      phone: order.customer.phone,
      city: order.customer.city,
      date: order.createdAt,
      items: order.items.map(it => ({
        productId: it.productId,
        productName: it.product.name,
        sku: it.product.sku,
        packCount: it.mode === 'wholesale_pack' ? it.quantity : 1,
        packSize: it.product.packSize,
        totalUnits: it.mode === 'wholesale_pack' ? it.quantity * it.product.packSize : it.quantity,
        pricePerPack: it.mode === 'wholesale_pack' ? it.unitPriceToman : it.unitPriceToman * it.product.packSize,
        totalPrice: it.totalPriceToman,
      })),
      subtotalToman: order.subtotalToman,
      discountToman: order.discountToman,
      shippingCostToman: order.shippingCostToman,
      finalAmountToman: order.finalAmountToman,
      paymentType: order.paymentMethod === 'wholesale_check' ? 'check' : 'cash',
      status: order.paymentStatus === 'paid' ? 'paid' : (order.paymentMethod === 'wholesale_check' ? 'pending_check' : 'processing'),
      shippingMethod: order.shippingMethodTitle,
      trackingCode: order.waybillNumber,
      notes: `ثبت آنلاین از فروشگاه پوشاک من و تو • روش ارسال: ${order.shippingMethodTitle} • آدرس: ${order.customer.address}`,
    };

    setInvoices(prev => [syncInvoice, ...prev]);
  };

  // Handlers for Inventory
  const handleAddProduct = (newProd: Product) => {
    setProducts([newProd, ...products]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(products.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const handleBulkUpdatePrices = (percentage: number, category?: string) => {
    const multiplier = 1 + percentage / 100;
    setProducts(products.map(prod => {
      if (category && category !== 'all' && prod.category !== category) {
        return prod;
      }
      const newWholesaleUnit = Math.round((prod.baseWholesalePricePerUnit * multiplier) / 1000) * 1000;
      const newWholesalePack = newWholesaleUnit * prod.packSize;
      const newColleagueUnit = Math.max(newWholesaleUnit - 15000, 10000);
      const newColleaguePack = newColleagueUnit * prod.packSize;

      return {
        ...prod,
        baseWholesalePricePerUnit: newWholesaleUnit,
        baseWholesalePricePerPack: newWholesalePack,
        colleaguePricePerUnit: newColleagueUnit,
        colleaguePricePerPack: newColleaguePack,
      };
    }));
  };

  // Handlers for Customers & CRM
  const handleAddCustomer = (newCust: Customer) => {
    setCustomers([newCust, ...customers]);
  };

  const handleUpdateCustomer = (updatedCust: Customer) => {
    setCustomers(customers.map(c => c.id === updatedCust.id ? updatedCust : c));
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
  };

  const handleImportCustomers = (importedList: Customer[]) => {
    setCustomers([...importedList, ...customers]);
  };

  // Handlers for Invoices
  const handleAddInvoice = (newInv: Invoice) => {
    setInvoices([newInv, ...invoices]);
    // Deduct stock using standardized calculateTotalUnitStock
    newInv.items.forEach(item => {
      setProducts(prev => prev.map(p => {
        if (p.id === item.productId) {
          const newPackStock = Math.max(0, p.packStock - item.packCount);
          return {
            ...p,
            packStock: newPackStock,
            totalUnitStock: calculateTotalUnitStock(newPackStock, p.packSize, p.singleStock),
          };
        }
        return p;
      }));
    });
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, status: any) => {
    setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status } : inv));
  };

  // Handlers for Production & Workflows
  const handleAddSupplier = (newSup: FabricSupplier) => {
    setFabricSuppliers(prev => [newSup, ...prev]);
  };

  const handleAddWorkshop = (newWs: TailorWorkshop) => {
    setTailorWorkshops(prev => [newWs, ...prev]);
  };

  const handleAddBatch = (newBatch: ProductionBatch) => {
    setProductionBatches(prev => [newBatch, ...prev]);
  };

  const handleUpdateBatchStatus = (batchId: string, status: ProductionBatch['status']) => {
    setProductionBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return {
          ...b,
          status,
          ...(status === 'delivered_to_warehouse' ? { actualDeliveryDate: new Date().toLocaleDateString('fa-IR') } : {})
        };
      }
      return b;
    }));
  };

  // Handlers for Finance & Checks
  const handleAddCheck = (newChk: CheckItem) => {
    setChecks([newChk, ...checks]);
  };

  const handleUpdateCheckStatus = (checkId: string, status: 'pending' | 'in_collection' | 'cleared' | 'bounced') => {
    setChecks(checks.map(c => c.id === checkId ? { ...c, status } : c));
  };

  // Handlers for Marketing & AI
  const handleAddSocialPost = (newPost: SocialPost) => {
    setSocialPosts([newPost, ...socialPosts]);
  };

  const handleAddAutoResponder = (newRule: AutoResponderRule) => {
    setAutoResponders([newRule, ...autoResponders]);
  };

  // ----------------------------------------------------
  // ZONE ROUTING: PUBLIC STOREFRONT (/) VS ADMIN (/admin)
  // ----------------------------------------------------

  // 1. If currently in Public Storefront:
  if (appZone === 'storefront') {
    return (
      <StorefrontView
        products={products}
        orders={storefrontOrders}
        onOrderPlaced={handleStorefrontOrderPlaced}
        onSwitchToAdmin={() => {
          if (isAdminAuthenticated) {
            setAppZone('admin_dashboard');
          } else {
            setAppZone('admin_auth');
          }
        }}
        customerUsers={customerUsers}
        onRegisterCustomerUser={handleRegisterCustomerUser}
        onUpdateCustomerUser={handleUpdateCustomerUser}
      />
    );
  }

  // 2. If in Admin Auth Login Gate:
  if (appZone === 'admin_auth') {
    return (
      <AdminAuthGate
        onAuthenticated={handleAdminAuthenticated}
        onBackToStorefront={() => setAppZone('storefront')}
      />
    );
  }

  // Check tab permission for active role
  const isTabPermitted = isTabAllowedForRole(currentTab, currentUserRole);
  const activeRoleConfig = ROLE_PERMISSIONS[currentUserRole] || ROLE_PERMISSIONS.super_admin;

  // 3. Admin Dashboard Zone
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] font-sans flex flex-col antialiased selection:bg-[#D4AF37] selection:text-[#18181B]" dir="rtl">
      
      {/* Global Admin Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        products={products}
        customers={customers}
        checks={checks}
        invoices={invoices}
        currentUserRole={currentUserRole}
        onSwitchUserRole={(role) => setCurrentUserRole(role as UserRoleType)}
        onOpenQuickNewProduct={() => {
          setCurrentTab('inventory');
          setIsNewProductModalOpen(true);
        }}
        onOpenQuickNewInvoice={() => {
          setCurrentTab('sales');
          setIsNewInvoiceModalOpen(true);
        }}
        onOpenQuickEntry={() => setIsQuickEntryModalOpen(true)}
        onOpenStorefront={() => setAppZone('storefront')}
        onLogout={handleAdminLogout}
      />

      {/* Main Container Layout with Sidebar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Right/Side Navigation (RTL layout) */}
          <aside className="lg:col-span-3">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              lowStockCount={lowStockCount}
              checkAlertCount={checkAlertCount}
              followUpCount={followUpCount}
              currentUserRole={currentUserRole}
              onOpenStorefront={() => setAppZone('storefront')}
              onLogout={handleAdminLogout}
            />
          </aside>

          {/* Main Module Content Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* RBAC Guard Check */}
            {!isTabPermitted ? (
              <div className="bg-white p-8 rounded-3xl border border-[#E6DEC8] text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
                  <ShieldAlert className="w-8 h-8 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    عدم دسترسی به این بخش
                  </h3>
                  <p className="text-xs text-stone-600 max-w-md mx-auto mt-1">
                    نقش کاربری فعلی شما (<strong className="text-stone-900 font-bold">{activeRoleConfig.title}</strong>) مجوز دسترسی به این ماژول را ندارد.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    className="inline-flex items-center gap-2 bg-[#18181B] text-[#FAF7F2] px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>بازگشت به داشبورد مجاز</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* View 1: Executive Dashboard */}
                {currentTab === 'dashboard' && (
                  <DashboardView
                    products={products}
                    customers={customers}
                    checks={checks}
                    invoices={invoices}
                    productionBatches={productionBatches}
                    onNavigate={setCurrentTab}
                    onOpenBulkPriceModal={() => {
                      setCurrentTab('inventory');
                      setIsBulkModalOpen(true);
                    }}
                    onOpenNewProductModal={() => {
                      setCurrentTab('inventory');
                      setIsNewProductModalOpen(true);
                    }}
                    onOpenNewInvoiceModal={() => {
                      setCurrentTab('sales');
                      setIsNewInvoiceModalOpen(true);
                    }}
                    onOpenQuickEntry={() => setIsQuickEntryModalOpen(true)}
                  />
                )}

                {/* View 2: Inventory Module */}
                {currentTab === 'inventory' && (
                  <InventoryModule
                    products={products}
                    invoices={invoices}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onBulkUpdatePrices={handleBulkUpdatePrices}
                    isBulkModalOpen={isBulkModalOpen}
                    setIsBulkModalOpen={setIsBulkModalOpen}
                    isNewProductModalOpen={isNewProductModalOpen}
                    setIsNewProductModalOpen={setIsNewProductModalOpen}
                    onNavigateToProduction={() => setCurrentTab('production')}
                  />
                )}

                {/* View 2.5: Production & Workshops Module (Super Admin) */}
                {currentTab === 'production' && (
                  <ProductionModule
                    fabricSuppliers={fabricSuppliers}
                    tailorWorkshops={tailorWorkshops}
                    productionBatches={productionBatches}
                    onAddSupplier={handleAddSupplier}
                    onAddWorkshop={handleAddWorkshop}
                    onAddBatch={handleAddBatch}
                    onUpdateBatchStatus={handleUpdateBatchStatus}
                  />
                )}

                {/* View 3: Customers & CRM Module */}
                {currentTab === 'crm' && (
                  <CustomerCRMModule
                    customers={customers}
                    checks={checks}
                    invoices={invoices}
                    onAddCustomer={handleAddCustomer}
                    onUpdateCustomer={handleUpdateCustomer}
                    onDeleteCustomer={handleDeleteCustomer}
                    onImportCustomers={handleImportCustomers}
                  />
                )}

                {/* View 3.5: Retail Customers & Storefront Direct Buyers Module */}
                {currentTab === 'retail_customers' && (
                  <RetailCustomersModule
                    customerUsers={customerUsers}
                    orders={storefrontOrders}
                    wholesaleCustomers={customers}
                    onAddRetailCustomer={handleRegisterCustomerUser}
                    onUpdateRetailCustomer={handleUpdateCustomerUser}
                  />
                )}

                {/* View 4: Sales & Multi-tier Invoicing Module */}
                {currentTab === 'sales' && (
                  <SalesInvoiceModule
                    invoices={invoices}
                    customers={customers}
                    products={products}
                    checks={checks}
                    onAddInvoice={handleAddInvoice}
                    onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
                    isNewInvoiceModalOpen={isNewInvoiceModalOpen}
                    setIsNewInvoiceModalOpen={setIsNewInvoiceModalOpen}
                  />
                )}

                {/* View 5: Finance & Checks Module */}
                {currentTab === 'finance' && (
                  <FinanceModule
                    checks={checks}
                    customers={customers}
                    products={products}
                    invoices={invoices}
                    onAddCheck={handleAddCheck}
                    onUpdateCheckStatus={handleUpdateCheckStatus}
                    onNavigateToProduction={() => setCurrentTab('production')}
                  />
                )}

                {/* View 6: Marketing Automation & AI Module */}
                {currentTab === 'marketing' && (
                  <MarketingAIModule
                    products={products}
                    socialPosts={socialPosts}
                    autoResponders={autoResponders}
                    siteSettings={siteSettings}
                    onUpdateSiteSettings={setSiteSettings}
                    onAddSocialPost={handleAddSocialPost}
                    onAddAutoResponder={handleAddAutoResponder}
                  />
                )}

                {/* View 7: B2B Storefront & Website Settings Module */}
                {currentTab === 'storefront' && (
                  <StorefrontModule
                    products={products}
                    siteSettings={siteSettings}
                    onUpdateSiteSettings={setSiteSettings}
                    customerUsers={customerUsers}
                    orders={storefrontOrders}
                    onOpenLiveStorefront={() => setAppZone('storefront')}
                  />
                )}

                {/* View 8: Logistics & Dispatch Module */}
                {currentTab === 'logistics' && (
                  <LogisticsModule
                    invoices={invoices}
                  />
                )}

                {/* View 9: Roles & Security Module */}
                {currentTab === 'roles' && (
                  <RolesSettingsModule
                    currentRole={currentUserRole}
                    onRoleChange={setCurrentUserRole}
                    products={products}
                    customers={customers}
                    invoices={invoices}
                    checks={checks}
                    fabricSuppliers={fabricSuppliers}
                    tailorWorkshops={tailorWorkshops}
                    productionBatches={productionBatches}
                    customerUsers={customerUsers}
                    siteSettings={siteSettings}
                    onRestoreFullState={handleRestoreFullState}
                    onResetToSampleData={handleResetToSampleData}
                  />
                )}
              </>
            )}

          </main>
        </div>
      </div>

      {/* Floating Action Button (FAB) for Mobile Daily Usage */}
      <MobileQuickActionFAB
        currentUserRole={currentUserRole}
        onOpenNewInvoice={() => {
          setCurrentTab('sales');
          setIsNewInvoiceModalOpen(true);
        }}
        onOpenNewProduct={() => {
          setCurrentTab('inventory');
          setIsNewProductModalOpen(true);
        }}
        onOpenNewCustomer={() => {
          setCurrentTab('crm');
        }}
        onOpenNewBatch={() => {
          setCurrentTab('production');
        }}
        onOpenQuickEntry={() => setIsQuickEntryModalOpen(true)}
      />

      {/* Natural Language AI Quick Entry Modal */}
      <QuickNaturalLanguageEntryModal
        isOpen={isQuickEntryModalOpen}
        onClose={() => setIsQuickEntryModalOpen(false)}
        products={products}
        customers={customers}
        onAddInvoice={handleAddInvoice}
        onUpdateProductStock={handleUpdateProductStock}
        onAddNewCustomer={handleAddCustomer}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E6DEC8] bg-[#FAF7F2] py-4 text-center text-xs text-[#8C6D37]">
        <p>سیستم یکپارچه مدیریت تولید و بنکداری پوشاک من و تو (اسدی) • بازار بزرگ تهران • پاساژ المهدی ۴، پلاک ۲۴۲</p>
      </footer>

    </div>
  );
}
