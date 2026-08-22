import React from 'react';
import { CartItem } from '../../types';
import { 
  X, 
  Trash2, 
  Package, 
  ShoppingBag, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck,
  TrendingDown,
  ShoppingBasket
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wholesalePacksCount = cartItems
    .filter(i => i.mode === 'wholesale_pack')
    .reduce((acc, item) => acc + item.quantity, 0);
  const retailUnitsCount = cartItems
    .filter(i => i.mode === 'retail_single')
    .reduce((acc, item) => acc + item.quantity, 0);

  const subtotalToman = cartItems.reduce((acc, item) => acc + item.totalPriceToman, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E6DEC8] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#18181B] flex items-center justify-center text-[#D4AF37]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-base">سبد خرید شما</h3>
                <p className="text-xs text-stone-500">
                  {wholesalePacksCount > 0 && `${wholesalePacksCount} پک عمده `}
                  {wholesalePacksCount > 0 && retailUnitsCount > 0 && '+ '}
                  {retailUnitsCount > 0 && `${retailUnitsCount} عدد تک‌فروشی`}
                  {totalItemsCount === 0 && 'سبد خرید در حال حاضر خالی است'}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-cart-drawer"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-[#E6DEC8]/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF7F2]">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#EDE5D3] rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBasket className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-700">سبد خرید شما خالی است</p>
                  <p className="text-xs text-stone-400 mt-1">
                    محصولات عمده پکی یا تک‌فروشی‌های موجود را به سبد خرید اضافه کنید.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 py-2 px-5 bg-[#18181B] hover:bg-[#27272A] text-[#FAF7F2] rounded-xl text-xs font-bold transition-colors"
                >
                  مشاهده کاتالوگ محصولات
                </button>
              </div>
            ) : (
              <>
                {/* Notice for mixed or wholesale orders */}
                {wholesalePacksCount > 0 && (
                  <div className="bg-[#FAF7F2] border border-[#DDD5C0] rounded-xl p-3 text-xs text-stone-800 flex items-start gap-2 shadow-xs">
                    <Package className="w-4 h-4 text-[#8C6D37] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#18181B]">سفارش عمده بازار بزرگ:</span>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        پک‌ها در کارگاه سلفون‌پیچ شده و همراه با بارنامه اختصاصی به باربری وطن، تیپاکس یا چاپار تحویل می‌گردند.
                      </p>
                    </div>
                  </div>
                )}

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    id={`cart-item-${item.id}`}
                    className="bg-white rounded-2xl border border-[#DDD5C0] p-3.5 shadow-xs space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover rounded-xl bg-stone-100 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-stone-400 hover:text-red-600 transition-colors p-1"
                              title="حذف از سبد"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Mode Badge & Specs */}
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {item.mode === 'wholesale_pack' ? (
                              <span className="bg-[#18181B] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Package className="w-3 h-3 text-[#D4AF37]" />
                                پک {item.product.packSize} تایی جور
                              </span>
                            ) : (
                              <span className="bg-[#FAF7F2] text-stone-800 border border-[#DDD5C0] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3 text-[#8C6D37]" />
                                خرید تکی (۱ عدد)
                              </span>
                            )}

                            {item.selectedColor && (
                              <span className="text-[10px] text-stone-500 bg-stone-50 px-1.5 py-0.5 rounded">
                                رنگ: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-[11px] text-stone-500">
                          واحد: {item.unitPriceToman.toLocaleString('fa-IR')} تومان
                        </div>
                      </div>
                    </div>

                    {/* Bottom row: Quantity stepper and line total */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div className="flex items-center border border-[#DDD5C0] bg-[#FAF7F2] rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              onUpdateQuantity(item.id, item.quantity - 1);
                            } else {
                              onRemoveItem(item.id);
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-left">
                        <span className="text-xs sm:text-sm font-black text-stone-900">
                          {item.totalPriceToman.toLocaleString('fa-IR')}{' '}
                          <span className="text-[10px] font-normal text-stone-500">تومان</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Quick action to clear cart */}
                <div className="text-left">
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-[11px] text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    خالی کردن کل سبد خرید
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E6DEC8] bg-[#FAF7F2] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>جمع کل اقلام:</span>
                  <span>{subtotalToman.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>هزینه بسته‌بندی و تحویل به باربری:</span>
                  <span className="text-emerald-700 font-medium">رایگان (ویژه سفارشات امروز)</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-[#E6DEC8]">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="text-[#18181B] text-base font-black">
                    {subtotalToman.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              <button
                type="button"
                id="btn-proceed-to-checkout"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 bg-[#18181B] hover:bg-[#27272A] active:bg-black text-[#FAF7F2] rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>تکمیل اطلاعات و ثبت نهایی سفارش</span>
                <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ضمانت سلامت فیزیکی پارچه و پیگیری بیجک</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
