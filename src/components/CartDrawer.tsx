"use client";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, updateItem, removeItem } = useCartStore();
  const { user } = useAuthStore();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-[55]" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[56] transform transition-transform duration-500 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2DDD8]">
          <h2 className="text-label">Shopping Bag ({cart?.items?.length ?? 0})</h2>
          <button onClick={onClose} className="hover:text-[#C9A96E] transition-colors">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} strokeWidth={1} className="text-[#E2DDD8]" />
              <p className="font-serif text-xl font-light">Sign in to view your bag</p>
              <Link
                href="/login"
                onClick={onClose}
                className="btn-primary"
              >
                Sign In
              </Link>
            </div>
          ) : !cart?.items?.length ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} strokeWidth={1} className="text-[#E2DDD8]" />
              <p className="font-serif text-xl font-light">Your bag is empty</p>
              <Link href="/shop" onClick={onClose} className="text-label border-b border-[#0A0A0A] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors pb-0.5">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => {
                const img = item.product.images?.find((i) => i.is_primary) ?? item.product.images?.[0];
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-[#F0ECE6] relative shrink-0">
                      {img && (
                        <Image src={img.image_url} alt={img.alt_text} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/shop/${item.product.slug}`}
                          onClick={onClose}
                          className="font-medium text-sm leading-tight hover:text-[#C9A96E] transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#8A8A8A] hover:text-[#0A0A0A] transition-colors shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-[#8A8A8A] text-xs mt-1">{item.product.category_detail?.name}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#E2DDD8]">
                          <button
                            onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#F7F4F0] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#F7F4F0] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-sm font-medium">
                          {item.product.currency_detail?.symbol}{parseFloat(item.line_total).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart?.items?.length ? (
          <div className="border-t border-[#E2DDD8] px-6 py-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#8A8A8A] font-light">Subtotal</span>
              <span className="font-medium">
                {cart.items[0]?.product?.currency_detail?.symbol}
                {parseFloat(cart.subtotal).toLocaleString()}
              </span>
            </div>
            {parseFloat(cart.discount_total) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8A8A] font-light">Discount</span>
                <span className="text-[#C9A96E]">
                  −{cart.items[0]?.product?.currency_detail?.symbol}
                  {parseFloat(cart.discount_total).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between font-medium border-t border-[#E2DDD8] pt-4">
              <span>Total</span>
              <span>
                {cart.items[0]?.product?.currency_detail?.symbol}
                {parseFloat(cart.grand_total).toLocaleString()}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-[#0A0A0A] text-white text-label py-4 text-center hover:bg-[#C9A96E] transition-colors duration-300"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              onClick={onClose}
              className="block text-center text-label text-[#8A8A8A] hover:text-[#0A0A0A] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
