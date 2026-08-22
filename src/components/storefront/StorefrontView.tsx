import React, { useState, useMemo, useRef } from 'react';
import { Product, CartItem, PurchaseMode, StorefrontOrder, CustomerUser } from '../../types';
import { StorefrontHeader } from './StorefrontHeader';
import { StorefrontHero } from './StorefrontHero';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutView } from './CheckoutView';
import { OrderTrackingModal } from './OrderTrackingModal';
import { WholesalePartnerModal } from './WholesalePartnerModal';
import { AboutAndContactModal } from './AboutAndContactModal';
import { CustomerAuthModal } from './CustomerAuthModal';
import { CustomerPortalModal } from './CustomerPortalModal';
import { StorefrontFooter } from './StorefrontFooter';
import { 
  Filter, 
  Package, 
  ShoppingBag, 
  SlidersHorizontal, 
  Sparkles, 
  Tag, 
  Flame, 
  ArrowUpDown,
  Search,
  Check
} from 'lucide-react';

interface StorefrontViewProps {
  products: Product[];
  orders: StorefrontOrder[];
  onOrderPlaced: (order: StorefrontOrder) => void;
  onSwitchToAdmin: () => void;
  customerUsers: CustomerUser[];
  onRegisterCustomerUser: (user: CustomerUser) => void;
  onUpdateCustomerUser: (user: CustomerUser) => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  products,
  orders,
  onOrderPlaced,
  onSwitchToAdmin,
  customerUsers,
  onRegisterCustomerUser,
  onUpdateCustomerUser,
}) => {
  // Global Storefront State
  const [currentView, setCurrentView] = useState<'catalog' | 'checkout'>('catalog');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPartnerLoggedIn, setIsPartnerLoggedIn] = useState(false);
  const [loggedInCustomer, setLoggedInCustomer] = useState<CustomerUser | null>(null);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [salesModeFilter, setSalesModeFilter] = useState<'all' | 'retail_only' | 'wholesale_only'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'bestseller' | 'price_asc' | 'price_desc'>('newest');

  const catalogRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.category)));
    return ['همه', ...list];
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = product.name.toLowerCase().includes(q);
        const matchSku = product.sku.toLowerCase().includes(q);
        const matchFabric = product.fabricType.toLowerCase().includes(q);
        const matchCat = product.category.toLowerCase().includes(q);
        if (!matchTitle && !matchSku && !matchFabric && !matchCat) return false;
      }

      // Category
      if (selectedCategory !== 'همه' && product.category !== selectedCategory) {
        return false;
      }

      // Sales Mode
      if (salesModeFilter === 'retail_only') {
        const isRetail = product.allowRetailSale && (product.singleStock > 0 || product.packStock > 0);
        if (!isRetail) return false;
      } else if (salesModeFilter === 'wholesale_only') {
        if (product.allowRetailSale) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (sortBy === 'price_asc') return a.baseWholesalePricePerPack - b.baseWholesalePricePerPack;
      if (sortBy === 'price_desc') return b.baseWholesalePricePerPack - a.baseWholesalePricePerPack;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, salesModeFilter, sortBy]);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    mode: PurchaseMode,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    // Pricing calculation
    const wholesaleUnitPrice = isPartnerLoggedIn ? product.colleaguePricePerUnit : product.baseWholesalePricePerUnit;
    const wholesalePackPrice = isPartnerLoggedIn ? product.colleaguePricePerPack : product.baseWholesalePricePerPack;
    const defaultMarkup = product.retailMarkupPercent || 35;
    const retailUnitPrice = product.retailPricePerUnit || Math.round((product.baseWholesalePricePerUnit * (1 + defaultMarkup / 100)) / 5000) * 5000;

    const unitPriceToman = mode === 'wholesale_pack' ? wholesalePackPrice : retailUnitPrice;
    const totalPriceToman = unitPriceToman * quantity;

    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => 
        item.productId === product.id && 
        item.mode === mode && 
        item.selectedColor === (selectedColor || 'جور رنگ‌بندی') &&
        item.selectedSize === (selectedSize || 'فری‌سایز')
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPriceToman: unitPriceToman * newQty
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        productId: product.id,
        product,
        mode,
        quantity,
        selectedColor: selectedColor || 'جور رنگ‌بندی',
        selectedSize: selectedSize || 'فری‌سایز',
        unitPriceToman,
        totalPriceToman
      };
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQty,
          totalPriceToman: item.unitPriceToman * newQty
        };
      }
      return item;
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-stone-900 flex flex-col selection:bg-[#18181B] selection:text-[#FAF7F2]" dir="rtl">
      
      {/* Top Header */}
      <StorefrontHeader
        cartItemsCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onSwitchToAdmin={onSwitchToAdmin}
        isPartnerLoggedIn={isPartnerLoggedIn}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loggedInCustomer={loggedInCustomer}
        onOpenCustomerAuthOrPortal={() => {
          if (loggedInCustomer) {
            setIsCustomerPortalOpen(true);
          } else {
            setIsCustomerAuthOpen(true);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'checkout' ? (
          <CheckoutView
            cartItems={cartItems}
            onBackToShop={() => setCurrentView('catalog')}
            onOrderPlaced={(order) => {
              // Also ensure customer is registered/linked
              if (!loggedInCustomer) {
                const autoCust: CustomerUser = {
                  id: `usr-${Date.now()}`,
                  fullName: order.customer.fullName,
                  phone: order.customer.phone,
                  storeName: order.customer.storeName,
                  province: order.customer.province,
                  city: order.customer.city,
                  address: order.customer.address,
                  postalCode: order.customer.postalCode,
                  registeredAt: 'امروز (ثبت همراه با سفارش)',
                };
                onRegisterCustomerUser(autoCust);
                setLoggedInCustomer(autoCust);
              }
              onOrderPlaced(order);
            }}
            onClearCart={handleClearCart}
            isPartnerLoggedIn={isPartnerLoggedIn}
            loggedInCustomer={loggedInCustomer}
          />
        ) : (
          <>
            {/* Hero Section */}
            <StorefrontHero
              onScrollToCatalog={scrollToCatalog}
              onFilterRetailOnly={() => {
                setSalesModeFilter('retail_only');
                scrollToCatalog();
              }}
              onFilterWholesalePacks={() => {
                setSalesModeFilter('wholesale_only');
                scrollToCatalog();
              }}
              totalProductsCount={products.length}
            />

            {/* Catalog & Filter Section */}
            <div ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
              
              {/* Category Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-2 px-4 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-[#18181B] text-[#FAF7F2] shadow-md border border-[#18181B]'
                        : 'bg-white text-stone-700 hover:bg-[#FAF7F2] hover:text-stone-900 border border-[#DDD5C0]'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat === 'همه' && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedCategory === cat ? 'bg-[#FAF7F2]/20 text-[#FAF7F2]' : 'bg-[#F4ECE1] text-stone-700'
                      }`}>
                        {products.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Toolbar: Sales Mode Switch & Sorting */}
              <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-[#E6DEC8] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                
                {/* Sales Mode Filter Tabs */}
                <div className="flex items-center bg-[#FAF7F2] p-1 rounded-2xl border border-[#E6DEC8] text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSalesModeFilter('all')}
                    className={`flex-1 py-1.5 px-3 rounded-xl transition-all ${
                      salesModeFilter === 'all' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    همه محصولات ({products.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalesModeFilter('retail_only')}
                    className={`flex-1 py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1 ${
                      salesModeFilter === 'retail_only' ? 'bg-[#8C6D37] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>دارای خرید تکی</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalesModeFilter('wholesale_only')}
                    className={`flex-1 py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1 ${
                      salesModeFilter === 'wholesale_only' ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs' : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>فقط پک عمده</span>
                  </button>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs text-stone-500 font-medium whitespace-nowrap flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#8C6D37]" />
                    <span>مرتب‌سازی:</span>
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-3 py-1.5 text-xs text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#18181B]/20"
                  >
                    <option value="newest">جدیدترین مدل‌های کارگاه</option>
                    <option value="bestseller">پرفروش‌ترین‌های بنکداری</option>
                    <option value="price_asc">ارزان‌ترین پک</option>
                    <option value="price_desc">گران‌ترین پک</option>
                  </select>
                </div>

              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#E6DEC8] p-12 text-center space-y-3">
                  <Package className="w-12 h-12 text-stone-400 mx-auto" />
                  <h3 className="font-bold text-stone-900 text-base">مدلی با فیلترهای انتخابی یافت نشد</h3>
                  <p className="text-xs text-stone-600">
                    می‌توانید فیلتر خرید تکی یا دسته‌بندی را تغییر داده و مجدداً امتحان کنید.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('همه');
                      setSalesModeFilter('all');
                      setSearchQuery('');
                    }}
                    className="py-2.5 px-5 bg-[#18181B] text-[#FAF7F2] rounded-xl text-xs font-bold hover:bg-[#27272A] transition-colors"
                  >
                    مشاهده کل کاتالوگ
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetail={setSelectedProduct}
                      onQuickAddToCart={(prod, mode, qty) => {
                        handleAddToCart(prod, mode, qty);
                        setIsCartOpen(true);
                      }}
                      isPartnerLoggedIn={isPartnerLoggedIn}
                    />
                  ))}
                </div>
              )}

            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <StorefrontFooter
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onSwitchToAdmin={onSwitchToAdmin}
      />

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, mode, qty, col, sz) => {
          handleAddToCart(prod, mode, qty, col, sz);
          setIsCartOpen(true);
        }}
        isPartnerLoggedIn={isPartnerLoggedIn}
        onSelectCategoryFilter={(cat) => setSelectedCategory(cat)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
      />

      <WholesalePartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        isLoggedIn={isPartnerLoggedIn}
        onToggleLogin={setIsPartnerLoggedIn}
      />

      <AboutAndContactModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Customer Account Authentication Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        registeredUsers={customerUsers}
        onLoginSuccess={(user) => {
          setLoggedInCustomer(user);
        }}
        onRegisterUser={(newUser) => {
          onRegisterCustomerUser(newUser);
          setLoggedInCustomer(newUser);
        }}
      />

      {/* Customer Account Portal & Order History Modal */}
      {loggedInCustomer && (
        <CustomerPortalModal
          isOpen={isCustomerPortalOpen}
          onClose={() => setIsCustomerPortalOpen(false)}
          currentUser={loggedInCustomer}
          orders={orders}
          onLogout={() => {
            setLoggedInCustomer(null);
          }}
          onUpdateProfile={(updated) => {
            setLoggedInCustomer(updated);
            onUpdateCustomerUser(updated);
          }}
          onOpenTrackingModalWithCode={(code) => {
            setIsCustomerPortalOpen(false);
            setIsTrackingOpen(true);
          }}
        />
      )}

    </div>
  );
};
