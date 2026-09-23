import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, CartItem, PurchaseMode, StorefrontOrder, CustomerUser, SiteSettings } from '../../types';
import { BRAND_INFO } from '../../data/brandInfo';
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
import { StorefrontAiAssistantModal } from './StorefrontAiAssistantModal';
import { StorefrontFloatingAiWidget } from './StorefrontFloatingAiWidget';
import { MobileCategoryStories } from './MobileCategoryStories';
import { InteractiveCategoryExplorer } from './InteractiveCategoryExplorer';
import { HorizontalProductShelf } from './HorizontalProductShelf';
import { StorefrontMidGridBanner } from './StorefrontMidGridBanner';
import { StorefrontVideoReels } from './StorefrontVideoReels';
import { FullCatalogModal } from './FullCatalogModal';
import { ResellerRoiCalculatorModal } from './ResellerRoiCalculatorModal';
import { OccasionPromoPopupModal } from './OccasionPromoPopupModal';
import { MobileNavigationDrawer } from './MobileNavigationDrawer';
import { MobileBottomNavBar } from './MobileBottomNavBar';
import { MobileFilterBottomSheet } from './MobileFilterBottomSheet';
import { StorefrontFooter } from './StorefrontFooter';
import { WomenSizeGuideModal } from './WomenSizeGuideModal';
import { FabricCareModal } from './FabricCareModal';
import { WomenFashionHighlightsBar } from './WomenFashionHighlightsBar';
import { WomenStyleLookbook } from './WomenStyleLookbook';
import { GarmentBackgroundPattern } from './GarmentBackgroundPattern';
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
  Check,
  LayoutGrid,
  Rows3,
  Layers,
  Sparkle,
  TrendingUp,
  Compass,
  Film,
  Calculator,
  X,
  Square
} from 'lucide-react';

interface StorefrontViewProps {
  products: Product[];
  orders: StorefrontOrder[];
  siteSettings?: SiteSettings;
  onOrderPlaced: (order: StorefrontOrder) => void;
  onSwitchToAdmin: () => void;
  customerUsers: CustomerUser[];
  onRegisterCustomerUser: (user: CustomerUser) => void;
  onUpdateCustomerUser: (user: CustomerUser) => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  products,
  orders,
  siteSettings,
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
  const [aboutModalInitialTab, setAboutModalInitialTab] = useState<'all' | 'map' | 'metro'>('all');
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isFullCatalogOpen, setIsFullCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);
  const [isPromoPopupOpen, setIsPromoPopupOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFabricCareOpen, setIsFabricCareOpen] = useState(false);

  // Target product for the special occasion festival discount
  const promoProduct = useMemo(() => {
    const targetId = siteSettings?.promoPopup?.targetProductId;
    if (targetId) {
      const found = products.find(p => p.id === targetId);
      if (found) return found;
    }
    return products[0];
  }, [products, siteSettings?.promoPopup?.targetProductId]);

  // Landing Popup Auto-Trigger Effect (opens after a pleasant 1.2s delay on landing)
  useEffect(() => {
    const promoConfig = siteSettings?.promoPopup;
    if (!promoConfig || promoConfig.isActive === false) return;

    let isDismissed = false;
    try {
      if (promoConfig.showOncePerSession) {
        isDismissed = sessionStorage.getItem('manoto_dismissed_promo_session') === 'true';
      }
      const dismissedDate = localStorage.getItem('manoto_dismiss_promo_popup_date');
      if (dismissedDate === new Date().toDateString()) {
        isDismissed = true;
      }
    } catch {
      // ignore storage errors
    }

    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsPromoPopupOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [siteSettings?.promoPopup]);

  const handleOpenAboutModal = (tab: 'all' | 'map' | 'metro' = 'all') => {
    setAboutModalInitialTab(tab);
    setIsAboutModalOpen(true);
  };

  // Extract Mid-Grid Banners from siteSettings
  const midGridBanners = useMemo(() => {
    return siteSettings?.midGridBanners || [];
  }, [siteSettings?.midGridBanners]);

  const bestsellersBanner = useMemo(() => {
    return midGridBanners.find(b => b.position === 'after_bestsellers' && b.isActive);
  }, [midGridBanners]);

  const newArrivalsBanner = useMemo(() => {
    return midGridBanners.find(b => b.position === 'after_new_arrivals' && b.isActive);
  }, [midGridBanners]);

  const retailBanner = useMemo(() => {
    return midGridBanners.find(b => b.position === 'after_retail' && b.isActive);
  }, [midGridBanners]);

  const midCatalogBanners = useMemo(() => {
    return midGridBanners.filter(b => b.isActive && (b.position === 'mid_grid' || b.position === 'after_bestsellers' || b.position === 'after_new_arrivals'));
  }, [midGridBanners]);

  // Filters, Search & Display Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [salesModeFilter, setSalesModeFilter] = useState<'all' | 'retail_only' | 'wholesale_only'>('all');
  const [videoFilterOnly, setVideoFilterOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'bestseller' | 'price_asc' | 'price_desc'>('newest');
  const [layoutMode, setLayoutMode] = useState<'horizontal_shelves' | 'grid' | 'compact_list'>('horizontal_shelves');
  const [mobileArchiveView, setMobileArchiveView] = useState<'shelf' | 'grid'>('shelf');
  const [mobileGridColumns, setMobileGridColumns] = useState<'1' | '2'>('2');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [mobileToast, setMobileToast] = useState<{ show: boolean; productName: string; mode: string } | null>(null);

  const catalogRef = useRef<HTMLDivElement>(null);
  const productsSectionRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.category)));
    return ['همه', ...list];
  }, [products]);

  const availableFabrics = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.fabricType).filter(Boolean) as string[]));
    return list;
  }, [products]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'همه') count++;
    if (selectedFabric !== '') count++;
    if (salesModeFilter !== 'all') count++;
    if (videoFilterOnly) count++;
    if (sortBy !== 'newest') count++;
    return count;
  }, [selectedCategory, selectedFabric, salesModeFilter, videoFilterOnly, sortBy]);

  // Curated Subsets for Horizontal Shelves
  const bestsellerProducts = useMemo(() => {
    return products.filter(p => p.isBestSeller || (p.rating && p.rating >= 4.8));
  }, [products]);

  const newArrivalProducts = useMemo(() => {
    return products.filter(p => p.isNewArrival);
  }, [products]);

  const retailReadyProducts = useMemo(() => {
    return products.filter(p => p.allowRetailSale && (p.singleStock > 0 || p.packStock > 0));
  }, [products]);

  const categoryGroups = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map(p => p.category)));
    return uniqueCats.map(cat => ({
      category: cat,
      items: products.filter(p => p.category === cat)
    })).filter(group => group.items.length > 0);
  }, [products]);

  // Filtered & Sorted Products with Persian Normalization
  const filteredProducts = useMemo(() => {
    const rawQuery = searchQuery.trim();
    const qNorm = rawQuery
      .toLowerCase()
      .replace(/[\u200C\u200B]/g, ' ')
      .replace(/[ي]/g, 'ی')
      .replace(/[ك]/g, 'ک')
      .replace(/[آأإ]/g, 'ا')
      .replace(/[ة]/g, 'ه')
      .replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1584))
      .replace(/\s+/g, ' ')
      .trim();

    const tokens = qNorm.split(' ').filter(t => t.length > 0);

    return products.filter(product => {
      // Search Matching
      if (tokens.length > 0) {
        const nameNorm = (product.name || '')
          .toLowerCase()
          .replace(/[\u200C\u200B]/g, ' ')
          .replace(/[ي]/g, 'ی')
          .replace(/[ك]/g, 'ک')
          .replace(/[آأإ]/g, 'ا')
          .replace(/[ة]/g, 'ه');

        const skuNorm = (product.sku || '').toLowerCase();
        const fabricNorm = (product.fabricType || '')
          .toLowerCase()
          .replace(/[\u200C\u200B]/g, ' ')
          .replace(/[ي]/g, 'ی')
          .replace(/[ك]/g, 'ک');

        const catNorm = (product.category || '')
          .toLowerCase()
          .replace(/[\u200C\u200B]/g, ' ')
          .replace(/[ي]/g, 'ی')
          .replace(/[ك]/g, 'ک');

        const descNorm = (product.description || '')
          .toLowerCase()
          .replace(/[\u200C\u200B]/g, ' ')
          .replace(/[ي]/g, 'ی')
          .replace(/[ك]/g, 'ک');

        const colorsNorm = ((product.colors || []).join(' '))
          .toLowerCase()
          .replace(/[\u200C\u200B]/g, ' ')
          .replace(/[ي]/g, 'ی')
          .replace(/[ك]/g, 'ک');

        const combined = `${nameNorm} ${skuNorm} ${fabricNorm} ${catNorm} ${descNorm} ${colorsNorm}`;

        const isMatch = tokens.every(token => combined.includes(token));
        if (!isMatch) return false;
      }

      // Category
      if (selectedCategory !== 'همه' && product.category !== selectedCategory) {
        return false;
      }

      // Fabric Type Filter
      if (selectedFabric && product.fabricType !== selectedFabric) {
        return false;
      }

      // Video Only Filter
      if (videoFilterOnly && !product.videoUrl) {
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
  }, [products, searchQuery, selectedCategory, selectedFabric, salesModeFilter, videoFilterOnly, sortBy]);

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

    // Provide instant feedback for mobile shoppers
    setMobileToast({
      show: true,
      productName: product.name,
      mode: mode === 'wholesale_pack' ? `پک ${product.packSize} تایی عمده` : 'تک‌فروشی'
    });
    setTimeout(() => {
      setMobileToast(prev => prev ? { ...prev, show: false } : null);
    }, 4000);
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

  const scrollToProducts = () => {
    // Smoothly scroll directly to the products display section (bypassing reels and lookbook)
    setTimeout(() => {
      if (productsSectionRef.current) {
        const yOffset = -75; // Account for sticky top header
        const element = productsSectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      } else if (catalogRef.current) {
        catalogRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 40);
  };

  const handleViewAllProducts = () => {
    setIsFullCatalogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-[#18181B] selection:text-[#FAF8F5] w-full max-w-full overflow-x-hidden" dir="rtl">
      
      {/* Top Header */}
      <StorefrontHeader
        cartItemsCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenAboutModal={() => handleOpenAboutModal('all')}
        onOpenRoutingModal={() => handleOpenAboutModal('map')}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
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
        products={products}
        onSelectProduct={setSelectedProduct}
        onScrollToCatalog={handleViewAllProducts}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Structured Data JSON-LD Schema for Google Rich Snippets & Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ClothingStore",
                "@id": "https://manoto-dress.ir/#store",
                "name": "پوشاک من و تو (اسدی) - MANOTO DRESS",
                "description": "تولید و پخش مستقیم پوشاک و شلوار زنانه عمده در بازار بزرگ تهران، پاساژ المهدی ۴، پلاک ۲۴۲",
                "url": "https://manoto-dress.ir",
                "telephone": BRAND_INFO.primaryPhone,
                "priceRange": "$$",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": BRAND_INFO.mainAddressFa,
                  "addressLocality": "تهران",
                  "addressRegion": "تهران",
                  "postalCode": "11918",
                  "addressCountry": "IR"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": String(BRAND_INFO.coordinates.lat),
                  "longitude": String(BRAND_INFO.coordinates.lng)
                }
              },
              {
                "@type": "FAQPage",
                "@id": "https://manoto-dress.ir/#faq",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "نحوه ثبت سفارش عمده و ارسال به شهرستان چگونه است؟",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "کلیه سفارشات عمده در قالب پک‌های جور ۶، ۸ و ۱۲ تایی از طریق باربری‌های معتبر میدان شوش (وطن، پیام‌گیر) و تیپاکس با ارائه بیجک رسمی ۲۴ ساعته ارسال می‌شوند."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "آدرس خرید حضوری در بازار بزرگ تهران کجاست؟",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "تهران، بازار بزرگ تهران، سرای ملی، پاساژ المهدی ۴، پلاک ۲۴۲ (نزدیک ایستگاه مترو خیام و ۱۵ خرداد)."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* Main Content Area with Couture Apparel Shapes & Watermark Pattern */}
      <main className="flex-1 pb-16 md:pb-0 relative bg-[#FAF8F5]">
        <GarmentBackgroundPattern 
          theme={siteSettings?.siteBackgroundTheme || 'couture_craft'} 
          opacity={siteSettings?.customBackgroundPatternOpacity ?? 0.115} 
        />
        <div className="relative z-10">
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
              onScrollToCatalog={handleViewAllProducts}
              onFilterRetailOnly={() => {
                setSalesModeFilter('retail_only');
                scrollToProducts();
              }}
              onFilterWholesalePacks={() => {
                setSalesModeFilter('wholesale_only');
                scrollToProducts();
              }}
              onOpenRoutingModal={() => handleOpenAboutModal('map')}
              onOpenAboutModal={handleOpenAboutModal}
              onOpenTracking={() => setIsTrackingOpen(true)}
              totalProductsCount={products.length}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              onOpenFabricCare={() => setIsFabricCareOpen(true)}
            />

            {/* Women Fashion Highlights Bar (Atelier & Tailoring Features) */}
            <WomenFashionHighlightsBar
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              onOpenFabricCare={() => setIsFabricCareOpen(true)}
              onScrollToCatalog={scrollToProducts}
            />

            {/* Catalog & Filter Section */}
            <div ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
              
              {/* Mobile Stories & Horizontal Category Carousel */}
              <MobileCategoryStories
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  scrollToProducts();
                }}
                products={products}
                salesModeFilter={salesModeFilter}
                onSetSalesModeFilter={setSalesModeFilter}
                onToggleVideoOnly={() => setVideoFilterOnly(prev => !prev)}
                isVideoFilterActive={videoFilterOnly}
                onOpenPromoPopup={() => setIsPromoPopupOpen(true)}
                promoTitle={siteSettings?.promoPopup?.occasionTitle}
              />

              {/* Video Reels Showcase for interactive fashion showcase */}
              <StorefrontVideoReels
                products={products}
                onOpenProductModal={setSelectedProduct}
              />

              {/* Interactive Category Explorer Cards */}
              <InteractiveCategoryExplorer
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  scrollToProducts();
                }}
                products={products}
              />

              {/* Women's Fashion Lookbook & Styling Guide */}
              <WomenStyleLookbook
                products={products}
                onOpenProduct={setSelectedProduct}
                onFilterCategory={(cat) => {
                  setSelectedCategory(cat);
                  scrollToProducts();
                }}
                customBanners={siteSettings?.lookbookBanners}
              />

              {/* Active Search Notification Banner */}
              {searchQuery.trim() && (
                <div className="bg-[#18181B] text-[#FAF7F2] p-4 rounded-3xl border border-[#D4AF37]/50 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#27272A] text-[#D4AF37] flex items-center justify-center flex-shrink-0 shadow-xs border border-stone-700">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-stone-300">نتایج جستجو برای:</span>
                        <span className="text-sm font-black text-[#D4AF37]">«{searchQuery}»</span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        تعداد <span className="font-bold text-white font-mono">{filteredProducts.length}</span> مدل یافت شد
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-stone-700 shadow-xs cursor-pointer"
                  >
                    <X className="w-4 h-4 text-rose-400" />
                    <span>پاک کردن جستجو و نمایش کل کاتالوگ</span>
                  </button>
                </div>
              )}

              {/* Products & Catalog Display Section (Anchor for Category Clicks) */}
              <div ref={productsSectionRef} id="products-catalog-section" className="scroll-mt-24 space-y-4">
                {/* Active Category Header Banner when specific category is selected */}
                {selectedCategory !== 'همه' && (
                  <div className="bg-gradient-to-r from-[#18181B] via-stone-900 to-[#27272A] text-[#FAF7F2] p-3 sm:p-3.5 rounded-2xl border border-[#D4AF37]/40 shadow-xs flex items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-stone-300">دسته‌بندی فعال:</span>
                          <span className="text-xs sm:text-sm font-black text-[#D4AF37] truncate">{selectedCategory}</span>
                        </div>
                        <span className="text-[11px] text-stone-400 block truncate">
                          نمایش {filteredProducts.length} مدل شلوار زنانه موجود در کارگاه
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('همه');
                        scrollToProducts();
                      }}
                      className="px-2.5 sm:px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#FAF7F2] border border-white/20 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-stone-300" />
                      <span>مشاهده همه مدل‌ها</span>
                    </button>
                  </div>
                )}

              {/* DEDICATED MOBILE TOOLBAR (Fast Filters & Touch Controls) */}
              <div className="md:hidden space-y-2.5">
                <div className="flex items-center gap-2">
                  {/* Open Mobile Filter Sheet Button */}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex-1 py-2.5 px-3.5 bg-[#18181B] text-[#FAF8F5] rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs active:scale-[0.98] transition-all border border-stone-800"
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                      <span>فیلتر و دسته‌بندی</span>
                      {activeFiltersCount > 0 && (
                        <span className="bg-[#D4AF37] text-[#18181B] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400">
                      {filteredProducts.length} مدل
                    </span>
                  </button>

                  {/* Fast Sales Mode Pills for Mobile */}
                  <div className="flex items-center bg-white p-1 rounded-2xl border border-[#EAE5DC] shadow-xs text-xs">
                    <button
                      type="button"
                      onClick={() => setSalesModeFilter(salesModeFilter === 'retail_only' ? 'all' : 'retail_only')}
                      className={`px-2.5 py-1.5 rounded-xl font-bold transition-all text-[11px] flex items-center gap-1 ${
                        salesModeFilter === 'retail_only'
                          ? 'bg-[#967434] text-white shadow-xs'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>تکی</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSalesModeFilter(salesModeFilter === 'wholesale_only' ? 'all' : 'wholesale_only')}
                      className={`px-2.5 py-1.5 rounded-xl font-bold transition-all text-[11px] flex items-center gap-1 ${
                        salesModeFilter === 'wholesale_only'
                          ? 'bg-[#18181B] text-[#D4AF37] shadow-xs'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      <Package className="w-3 h-3 text-[#D4AF37]" />
                      <span>عمده</span>
                    </button>
                  </div>
                </div>

                {/* Active Filters Dismissible Chips on Mobile */}
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                    <span className="text-stone-500 font-medium shrink-0">فیلتر فعال:</span>
                    {selectedCategory !== 'همه' && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('همه')}
                        className="bg-amber-50 text-[#8C6D37] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-bold border border-amber-200/80 active:scale-95 transition-transform"
                      >
                        <span>دسته: {selectedCategory}</span>
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    {salesModeFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setSalesModeFilter('all')}
                        className="bg-stone-100 text-stone-800 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-bold border border-stone-200 active:scale-95 transition-transform"
                      >
                        <span>{salesModeFilter === 'retail_only' ? 'تک‌فروشی' : 'پک عمده'}</span>
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    {selectedFabric && (
                      <button
                        type="button"
                        onClick={() => setSelectedFabric('')}
                        className="bg-amber-50 text-[#8C6D37] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-bold border border-amber-200/80 active:scale-95 transition-transform"
                      >
                        <span>جنس: {selectedFabric}</span>
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    {videoFilterOnly && (
                      <button
                        type="button"
                        onClick={() => setVideoFilterOnly(false)}
                        className="bg-purple-50 text-purple-900 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-bold border border-purple-200/80 active:scale-95 transition-transform"
                      >
                        <span>ویدیو تنخور</span>
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('همه');
                        setSalesModeFilter('all');
                        setSelectedFabric('');
                        setVideoFilterOnly(false);
                        setSortBy('newest');
                      }}
                      className="text-stone-500 hover:text-stone-800 text-[10px] underline shrink-0 px-1"
                    >
                      حذف همه
                    </button>
                  </div>
                )}
              </div>

              {/* DESKTOP Toolbar: Layout Mode, Sales Mode Switch & Sorting */}
              <div className="hidden md:flex bg-white p-3.5 sm:p-4 rounded-3xl border border-[#EAE5DC] shadow-[0_2px_12px_rgba(24,24,27,0.03)] items-center justify-between gap-3">
                
                {/* Sales Mode Filter Tabs */}
                <div className="flex items-center bg-[#FAF8F5] p-1 rounded-2xl border border-[#EAE5DC] text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSalesModeFilter('all')}
                    className={`flex-1 py-1.5 px-3 rounded-xl transition-all text-center ${
                      salesModeFilter === 'all' ? 'bg-[#18181B] text-[#FAF8F5] shadow-xs' : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    همه ({products.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalesModeFilter('retail_only')}
                    className={`flex-1 py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1 text-center ${
                      salesModeFilter === 'retail_only' ? 'bg-[#967434] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>خرید تکی</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalesModeFilter('wholesale_only')}
                    className={`flex-1 py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1 text-center ${
                      salesModeFilter === 'wholesale_only' ? 'bg-[#18181B] text-[#FAF8F5] shadow-xs' : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>پک عمده</span>
                  </button>
                </div>

                {/* Right controls: View Mode Switcher + Sort */}
                <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap sm:flex-nowrap">
                  
                  {/* Video Filter Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setVideoFilterOnly(!videoFilterOnly)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border cursor-pointer ${
                      videoFilterOnly
                        ? 'bg-[#18181B] text-[#D4AF37] border-[#D4AF37] shadow-xs'
                        : 'bg-[#FAF8F5] text-stone-700 border-[#EAE5DC] hover:border-stone-800'
                    }`}
                    title="نمایش اختصاصی مدل‌های دارای فیلم و ویدیوی تنخور ژورنالی"
                  >
                    <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="hidden sm:inline">فیلم تنخور</span>
                    {videoFilterOnly && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>

                  {/* View Mode Switcher */}
                  <div className="flex items-center bg-[#FAF8F5] p-1 rounded-2xl border border-[#EAE5DC] text-xs">
                    <button
                      type="button"
                      onClick={() => setLayoutMode('horizontal_shelves')}
                      className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                        layoutMode === 'horizontal_shelves'
                          ? 'bg-[#18181B] text-[#FAF7F2] shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                      title="نمایش قفسه‌های سوایپی افقی (مخصوص گوشی)"
                    >
                      <Rows3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="hidden xs:inline">سوایپ افقی</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLayoutMode('grid')}
                      className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                        layoutMode === 'grid'
                          ? 'bg-[#18181B] text-[#FAF7F2] shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                      title="نمایش شبکه‌ای"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">شبکه</span>
                    </button>
                  </div>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-1.5 flex-1 sm:flex-none justify-end">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl px-2.5 py-1.5 text-xs text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#18181B]/20 w-full sm:w-auto"
                    >
                      <option value="newest">جدیدترین مدل‌ها</option>
                      <option value="bestseller">پرفروش‌ترین‌های راسته</option>
                      <option value="price_asc">ارزان‌ترین پک</option>
                      <option value="price_desc">گران‌ترین پک</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* Products Rendering Section */}
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
              ) : layoutMode === 'horizontal_shelves' && selectedCategory === 'همه' && !searchQuery.trim() ? (
                /* Rich Curated Horizontal Swipe Shelves */
                <div className="space-y-6">
                  
                  {/* 1. Hot Bestsellers Reel */}
                  {bestsellerProducts.length > 0 && (
                    <HorizontalProductShelf
                      id="shelf-bestsellers"
                      title="پرفروش‌ترین‌های راسته بازار بزرگ"
                      subtitle="مدل‌های پرتقاضا با بالاترین میزان رضایت مغازه‌داران"
                      badgeText="🔥 ویترین داغ"
                      badgeType="hot"
                      icon={Flame}
                      products={bestsellerProducts}
                      onOpenDetail={setSelectedProduct}
                      onQuickAddToCart={(prod, mode, qty) => {
                        handleAddToCart(prod, mode, qty);
                        setIsCartOpen(true);
                      }}
                      isPartnerLoggedIn={isPartnerLoggedIn}
                      showRankNumber={true}
                    />
                  )}

                  {/* Mid-Grid Banner 1 (After Bestsellers) */}
                  {bestsellersBanner && (
                    <StorefrontMidGridBanner
                      banner={bestsellersBanner}
                      onOpenWholesaleModal={() => setIsPartnerModalOpen(true)}
                      onOpenAboutModal={() => handleOpenAboutModal('all')}
                      onOpenRoutingMap={() => handleOpenAboutModal('map')}
                      onFilterRetail={() => {
                        setSalesModeFilter('retail_only');
                        setSelectedCategory('همه');
                      }}
                      onScrollCatalog={() => {
                        catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    />
                  )}

                  {/* 2. New Arrivals Reel */}
                  {newArrivalProducts.length > 0 && (
                    <HorizontalProductShelf
                      id="shelf-new-arrivals"
                      title="جدیدترین مدل‌های دوخت کارگاه"
                      subtitle="طرح‌ها و ژورنال‌های تازه ترخیص شده هفته جاری"
                      badgeText="✨ کالکشن جدید"
                      badgeType="new"
                      icon={Sparkles}
                      products={newArrivalProducts}
                      onOpenDetail={setSelectedProduct}
                      onQuickAddToCart={(prod, mode, qty) => {
                        handleAddToCart(prod, mode, qty);
                        setIsCartOpen(true);
                      }}
                      isPartnerLoggedIn={isPartnerLoggedIn}
                    />
                  )}

                  {/* Mid-Grid Banner 2 (After New Arrivals) */}
                  {newArrivalsBanner && (
                    <StorefrontMidGridBanner
                      banner={newArrivalsBanner}
                      onOpenWholesaleModal={() => setIsPartnerModalOpen(true)}
                      onOpenAboutModal={() => handleOpenAboutModal('all')}
                      onOpenRoutingMap={() => handleOpenAboutModal('map')}
                      onFilterRetail={() => {
                        setSalesModeFilter('retail_only');
                        setSelectedCategory('همه');
                      }}
                      onScrollCatalog={() => {
                        catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    />
                  )}

                  {/* 3. Retail Ready Shelf */}
                  {retailReadyProducts.length > 0 && (
                    <HorizontalProductShelf
                      id="shelf-retail-ready"
                      title="مدل‌های منتخب با امکان خرید تکی"
                      subtitle="خرید تکی به قیمت عمده تولیدی با ارسال سریع پستی"
                      badgeText="🛍️ ارسال تکی"
                      badgeType="retail"
                      icon={ShoppingBag}
                      products={retailReadyProducts}
                      onOpenDetail={setSelectedProduct}
                      onQuickAddToCart={(prod, mode, qty) => {
                        handleAddToCart(prod, mode, qty);
                        setIsCartOpen(true);
                      }}
                      isPartnerLoggedIn={isPartnerLoggedIn}
                    />
                  )}

                  {/* Mid-Grid Banner 3 (After Retail Ready Shelf) */}
                  {retailBanner && (
                    <StorefrontMidGridBanner
                      banner={retailBanner}
                      onOpenWholesaleModal={() => setIsPartnerModalOpen(true)}
                      onOpenAboutModal={() => handleOpenAboutModal('all')}
                      onOpenRoutingMap={() => handleOpenAboutModal('map')}
                      onFilterRetail={() => {
                        setSalesModeFilter('retail_only');
                        setSelectedCategory('همه');
                      }}
                      onScrollCatalog={() => {
                        catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    />
                  )}

                  {/* 4. Complete All Products Section (Horizontal Slider for mobile, Grid for desktop with toggle) */}
                  <div className="pt-4 border-t border-[#E6DEC8]/80 space-y-4">
                    {/* Header with Title and Mobile View Switcher */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#18181B] text-[#FAF7F2] flex items-center justify-center shadow-xs flex-shrink-0">
                          <LayoutGrid className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-stone-900 text-sm sm:text-base">
                              آرشیو کامل کاتالوگ ({filteredProducts.length} مدل)
                            </h3>
                            <span className="text-[10px] bg-stone-100 text-stone-700 border border-stone-300 font-bold px-2 py-0.5 rounded-full hidden xs:inline">
                              پوشاک من و تو
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">
                            {mobileArchiveView === 'shelf'
                              ? 'نمایش کشویی افقی محصولات (مخصوص تلفن همراه) یا مشاهده کل کاتالوگ'
                              : 'مشاهده همزمان کلیه تولیدات در چیدمان شبکه‌ای'}
                          </p>
                        </div>
                      </div>

                      {/* Mobile View Toggle Switcher (Visible on Mobile) */}
                      <div className="flex sm:hidden items-center justify-between bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#DDD5C0] text-xs">
                        <span className="text-[10px] font-bold text-stone-500 pr-1">چیدمان:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setMobileArchiveView('shelf')}
                            className={`py-1 px-2 rounded-xl font-bold flex items-center gap-1 text-[11px] transition-all ${
                              mobileArchiveView === 'shelf'
                                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            <Rows3 className="w-3 h-3 text-[#D4AF37]" />
                            <span>کشویی</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMobileArchiveView('grid');
                              setMobileGridColumns('2');
                            }}
                            className={`py-1 px-2 rounded-xl font-bold flex items-center gap-1 text-[11px] transition-all ${
                              mobileArchiveView === 'grid' && mobileGridColumns === '2'
                                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            <LayoutGrid className="w-3 h-3 text-[#D4AF37]" />
                            <span>۲ ستونه</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMobileArchiveView('grid');
                              setMobileGridColumns('1');
                            }}
                            className={`py-1 px-2 rounded-xl font-bold flex items-center gap-1 text-[11px] transition-all ${
                              mobileArchiveView === 'grid' && mobileGridColumns === '1'
                                ? 'bg-[#18181B] text-[#FAF7F2] shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            <Square className="w-3 h-3 text-[#D4AF37]" />
                            <span>تک‌ستونه</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* MOBILE DISPLAY: Horizontal Swipe Shelf or 2-Col / 1-Col Grid */}
                    <div className="block sm:hidden">
                      {mobileArchiveView === 'shelf' ? (
                        <div className="space-y-3">
                          <HorizontalProductShelf
                            id="shelf-all-products-mobile"
                            title="ورق بزنید (سوایپ افقی)"
                            subtitle="جهت راحتی در گوشی، محصولات را به چپ یا راست بکشید"
                            badgeText="کل کاتالوگ"
                            badgeType="wholesale"
                            icon={Rows3}
                            products={filteredProducts}
                            onOpenDetail={setSelectedProduct}
                            onQuickAddToCart={(prod, mode, qty) => {
                              handleAddToCart(prod, mode, qty);
                              setIsCartOpen(true);
                            }}
                            isPartnerLoggedIn={isPartnerLoggedIn}
                            onViewAll={() => {
                              setMobileArchiveView('grid');
                              setMobileGridColumns('2');
                            }}
                          />

                          {/* Quick Full-Catalog Expand Button for Mobile */}
                          <button
                            type="button"
                            onClick={() => {
                              setMobileArchiveView('grid');
                              setMobileGridColumns('2');
                            }}
                            className="w-full py-3 px-4 bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] border border-stone-800"
                          >
                            <LayoutGrid className="w-4 h-4 text-[#D4AF37]" />
                            <span>مشاهده همه {filteredProducts.length} مدل به صورت یکجا (شبکه ۲ ستونه)</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between bg-stone-100 p-2.5 rounded-2xl border border-stone-200">
                            <span className="text-xs font-bold text-stone-800">
                              نمایش {filteredProducts.length} مدل ({mobileGridColumns === '1' ? 'تک‌ستونه بزرگ' : '۲ ستونه'})
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setMobileGridColumns(mobileGridColumns === '1' ? '2' : '1')}
                                className="py-1 px-2.5 bg-white text-stone-800 border border-[#DDD5C0] rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-[#FAF7F2]"
                              >
                                {mobileGridColumns === '1' ? (
                                  <>
                                    <LayoutGrid className="w-3.5 h-3.5 text-[#8C6D37]" />
                                    <span>۲ ستونه</span>
                                  </>
                                ) : (
                                  <>
                                    <Square className="w-3.5 h-3.5 text-[#8C6D37]" />
                                    <span>۱ ستونه</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => setMobileArchiveView('shelf')}
                                className="py-1 px-2.5 bg-white text-stone-900 border border-[#DDD5C0] rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-[#FAF7F2]"
                              >
                                <Rows3 className="w-3.5 h-3.5 text-[#8C6D37]" />
                                <span>کشویی</span>
                              </button>
                            </div>
                          </div>

                          <div className={mobileGridColumns === '1' ? 'space-y-3.5' : 'grid grid-cols-2 gap-2.5'}>
                            {filteredProducts.map((product, idx) => {
                              const showBannerAfter = (idx + 1) === 4 && midCatalogBanners.length > 0;
                              const bannerItem = midCatalogBanners[0];
                              return (
                                <React.Fragment key={product.id}>
                                  <div className={mobileGridColumns === '1' ? 'max-w-md mx-auto w-full' : ''}>
                                    <ProductCard
                                      product={product}
                                      onOpenDetail={setSelectedProduct}
                                      onQuickAddToCart={(prod, mode, qty) => {
                                        handleAddToCart(prod, mode, qty);
                                        setIsCartOpen(true);
                                      }}
                                      isPartnerLoggedIn={isPartnerLoggedIn}
                                    />
                                  </div>
                                  {showBannerAfter && bannerItem && (
                                    <div className={mobileGridColumns === '1' ? 'py-1 max-w-md mx-auto w-full' : 'col-span-2 py-1'}>
                                      <StorefrontMidGridBanner
                                        banner={bannerItem}
                                        onOpenWholesaleModal={() => setIsPartnerModalOpen(true)}
                                        onOpenAboutModal={() => handleOpenAboutModal('all')}
                                        onOpenRoutingMap={() => handleOpenAboutModal('map')}
                                        onFilterRetail={() => {
                                          setSalesModeFilter('retail_only');
                                          setSelectedCategory('همه');
                                        }}
                                        onScrollCatalog={() => {
                                          catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                      />
                                    </div>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setMobileArchiveView('shelf');
                            }}
                            className="w-full py-2.5 px-4 bg-[#FAF7F2] text-stone-800 border border-[#DDD5C0] rounded-2xl text-xs font-bold hover:bg-white transition-all flex items-center justify-center gap-2"
                          >
                            <Rows3 className="w-3.5 h-3.5 text-[#8C6D37]" />
                            <span>برگشت به حالت کشویی افقی</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* DESKTOP & TABLET DISPLAY: Grid View with Mid-Grid Banner Injection */}
                    <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {filteredProducts.map((product, idx) => {
                        const showBannerAfter = (idx + 1) === 8 && midCatalogBanners.length > 0;
                        const bannerItem = midCatalogBanners[0];
                        return (
                          <React.Fragment key={product.id}>
                            <ProductCard
                              product={product}
                              onOpenDetail={setSelectedProduct}
                              onQuickAddToCart={(prod, mode, qty) => {
                                handleAddToCart(prod, mode, qty);
                                setIsCartOpen(true);
                              }}
                              isPartnerLoggedIn={isPartnerLoggedIn}
                            />
                            {showBannerAfter && bannerItem && (
                              <div className="col-span-full py-2">
                                <StorefrontMidGridBanner
                                  banner={bannerItem}
                                  onOpenWholesaleModal={() => setIsPartnerModalOpen(true)}
                                  onOpenAboutModal={() => handleOpenAboutModal('all')}
                                  onOpenRoutingMap={() => handleOpenAboutModal('map')}
                                  onFilterRetail={() => {
                                    setSalesModeFilter('retail_only');
                                    setSelectedCategory('همه');
                                  }}
                                  onScrollCatalog={() => {
                                    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ) : (
                /* When filtered or in grid mode: show Swipe Reel + Grid with Mid-Grid Banners */
                <div className="space-y-6">
                  {/* Top Horizontal Swipe Reel for the active filter */}
                  <HorizontalProductShelf
                    id="shelf-filtered-active"
                    title={selectedCategory === 'همه' ? 'نتایج جستجو و فیلترها' : selectedCategory}
                    subtitle={`نمایش افقی ${filteredProducts.length} مدل شلوار زنانه`}
                    badgeText="👈 سوایپ افقی"
                    badgeType="custom"
                    icon={Sparkles}
                    products={filteredProducts}
                    onOpenDetail={setSelectedProduct}
                    onQuickAddToCart={(prod, mode, qty) => {
                      handleAddToCart(prod, mode, qty);
                      setIsCartOpen(true);
                    }}
                    isPartnerLoggedIn={isPartnerLoggedIn}
                  />

                  {/* Grid View with Mid-Grid Banners */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700 px-1">
                      <span>نمایش شبکه‌ای کامل:</span>
                      <span className="text-stone-500 font-normal">
                        {filteredProducts.length} مدل
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
                      {filteredProducts.map((product, idx) => {
                        const pool = midCatalogBanners.length > 0 ? midCatalogBanners : midGridBanners.filter(b => b.isActive);
                        const showBanner = (idx + 1) % 6 === 0 && pool.length > 0 && idx < filteredProducts.length - 1;
                        const bIndex = Math.floor((idx + 1) / 6 - 1) % pool.length;
                        const bannerItem = pool[bIndex];

                        return (
                          <React.Fragment key={product.id}>
                            <ProductCard
                              product={product}
                              onOpenDetail={setSelectedProduct}
                              onQuickAddToCart={(prod, mode, qty) => {
                                handleAddToCart(prod, mode, qty);
                                setIsCartOpen(true);
                              }}
                              isPartnerLoggedIn={isPartnerLoggedIn}
                            />
                            {showBanner && bannerItem && (
                              <div className="col-span-full py-2">
                                <StorefrontMidGridBanner
                                  banner={bannerItem}
                                  onOpenWholesaleModal={() => setIsPartnerModalOpen(true)}
                                  onOpenAboutModal={() => handleOpenAboutModal('all')}
                                  onOpenRoutingMap={() => handleOpenAboutModal('map')}
                                  onFilterRetail={() => {
                                    setSalesModeFilter('retail_only');
                                    setSelectedCategory('همه');
                                  }}
                                  onScrollCatalog={() => {
                                    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* End of productsSectionRef */}
              </div>

            </div>
          </>
        )}
        </div>
      </main>

      {/* Footer */}
      <StorefrontFooter
        onOpenAboutModal={() => handleOpenAboutModal('all')}
        onOpenRoutingModal={() => handleOpenAboutModal('map')}
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
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenFabricCare={() => setIsFabricCareOpen(true)}
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
        initialTab={aboutModalInitialTab}
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
        onUpdateUser={(updatedUser) => {
          onUpdateCustomerUser(updatedUser);
          setLoggedInCustomer(updatedUser);
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

      {/* Floating Online Support, Direct Call & Smart AI Chatbot Widget (On Left) */}
      <StorefrontFloatingAiWidget
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAboutModal={handleOpenAboutModal}
      />

      {/* Interactive Storefront AI Assistant & FAQ Advisor Modal */}
      <StorefrontAiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        products={products}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onFilterRetailOnly={() => setSalesModeFilter('retail_only')}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Full-Screen Dedicated Catalog View & Large Product Showcase Modal */}
      <FullCatalogModal
        isOpen={isFullCatalogOpen}
        onClose={() => setIsFullCatalogOpen(false)}
        products={products}
        onSelectProduct={(product) => {
          setSelectedProduct(product);
        }}
        onAddToCart={handleAddToCart}
        cartItemsCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => {
          setIsFullCatalogOpen(false);
          setIsCartOpen(true);
        }}
        isPartnerLoggedIn={isPartnerLoggedIn}
      />

      {/* Reseller ROI Profit Calculator Modal */}
      <ResellerRoiCalculatorModal
        isOpen={isRoiModalOpen}
        onClose={() => setIsRoiModalOpen(false)}
        products={products}
        onAddToCart={handleAddToCart}
        isPartnerLoggedIn={isPartnerLoggedIn}
      />

      {/* Landing Occasion Festival Discount Popup Modal */}
      <OccasionPromoPopupModal
        isOpen={isPromoPopupOpen}
        onClose={() => setIsPromoPopupOpen(false)}
        config={siteSettings?.promoPopup}
        product={promoProduct}
        onSelectProduct={(p) => {
          setIsPromoPopupOpen(false);
          setSelectedProduct(p);
        }}
        onAddToCart={handleAddToCart}
        onOpenCart={() => setIsCartOpen(true)}
        isPartnerLoggedIn={isPartnerLoggedIn}
      />

      {/* Dedicated Women Sizing Table & Measurement Guide Modal */}
      <WomenSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Fabric Identification & Garment Care Guide Modal */}
      <FabricCareModal
        isOpen={isFabricCareOpen}
        onClose={() => setIsFabricCareOpen(false)}
        fabricType={selectedProduct?.fabricType}
      />


      {/* Mobile Hamburger Side Drawer Navigation */}
      <MobileNavigationDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToProducts();
        }}
        salesModeFilter={salesModeFilter}
        onSetSalesModeFilter={setSalesModeFilter}
        onScrollToCatalog={scrollToProducts}
        onOpenCart={() => setIsCartOpen(true)}
        cartItemsCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenAboutModal={handleOpenAboutModal}
        onOpenRoutingModal={() => handleOpenAboutModal('map')}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenRoiCalculator={() => setIsRoiModalOpen(true)}
        onOpenFullCatalog={() => setIsFullCatalogOpen(true)}
        onOpenPromoPopup={() => setIsPromoPopupOpen(true)}
        promoTitle={siteSettings?.promoPopup?.occasionTitle}
        promoDiscount={siteSettings?.promoPopup?.discountPercent}
        onOpenCustomerAuthOrPortal={() => {
          if (loggedInCustomer) {
            setIsCustomerPortalOpen(true);
          } else {
            setIsCustomerAuthOpen(true);
          }
        }}
        onSwitchToAdmin={onSwitchToAdmin}
        loggedInCustomer={loggedInCustomer}
        isPartnerLoggedIn={isPartnerLoggedIn}
        products={products}
        onSelectCategoryFilter={(cat) => {
          setSelectedCategory(cat);
          scrollToProducts();
        }}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenFabricCare={() => setIsFabricCareOpen(true)}
      />

      {/* Mobile Filter & Sort Bottom Sheet */}
      <MobileFilterBottomSheet
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToProducts();
        }}
        salesModeFilter={salesModeFilter}
        onSetSalesModeFilter={setSalesModeFilter}
        videoFilterOnly={videoFilterOnly}
        onToggleVideoFilter={() => setVideoFilterOnly(!videoFilterOnly)}
        sortBy={sortBy}
        onSetSortBy={setSortBy}
        availableFabrics={availableFabrics}
        selectedFabric={selectedFabric}
        onSelectFabric={setSelectedFabric}
        totalProductsCount={products.length}
        filteredCount={filteredProducts.length}
        onResetFilters={() => {
          setSelectedCategory('همه');
          setSelectedFabric('');
          setSalesModeFilter('all');
          setVideoFilterOnly(false);
          setSortBy('newest');
        }}
      />

      {/* Mobile Cart Feedback Toast (Floats above mobile bottom bar) */}
      {mobileToast?.show && (
        <div 
          className="fixed bottom-18 md:hidden inset-x-3 z-50 bg-[#18181B]/95 text-white p-3 rounded-2xl border border-[#D4AF37]/60 shadow-2xl flex items-center justify-between gap-2.5 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-200"
          dir="rtl"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </span>
            <div className="min-w-0">
              <span className="text-xs font-black block truncate text-stone-100">{mobileToast.productName}</span>
              <span className="text-[10.5px] text-[#D4AF37] block font-bold">به سبد خرید افزوده شد ({mobileToast.mode})</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileToast(null);
              setIsCartOpen(true);
            }}
            className="py-1.5 px-3.5 bg-gradient-to-r from-[#8C6D37] to-[#D4AF37] hover:from-[#73592B] hover:to-[#B89B58] text-[#18181B] font-black rounded-xl text-xs shrink-0 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>مشاهده سبد</span>
          </button>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar for Mobile & Smartphone View */}
      <MobileBottomNavBar
        cartItemsCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        activeSection={
          isCartOpen
            ? 'cart'
            : isTrackingOpen
            ? 'tracking'
            : isAiAssistantOpen
            ? 'ai'
            : isCustomerAuthOpen || isCustomerPortalOpen || isPartnerModalOpen
            ? 'profile'
            : 'home'
        }
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToCatalog={scrollToCatalog}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenCustomerAuthOrPortal={() => {
          if (loggedInCustomer) {
            setIsCustomerPortalOpen(true);
          } else {
            setIsCustomerAuthOpen(true);
          }
        }}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        loggedInCustomer={loggedInCustomer}
        isPartnerLoggedIn={isPartnerLoggedIn}
      />

    </div>
  );
};
