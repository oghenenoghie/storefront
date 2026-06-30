"use client";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props { open: boolean; onClose: () => void; }

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, updateItem, removeItem } = useCartStore();
  const { user } = useAuthStore();

  const sym = cart?.items?.[0]?.product?.currency_detail?.symbol ?? "$";

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-[55]" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[56] transform transition-transform duration-500 flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2DDD8]">
          <div className="flex items-center gap-2">
            <h2 className="text-label">Shopping Bag</h2>
            {cart?.items?.length ? (
              <Badge variant="gold" className="text-[9px] px-1.5 py-0.5">{cart.items.reduce((n, i) => n + i.quantity, 0)}</Badge>
            ) : null}
          </div>
          <Button variant="ghost" size="icon" className="rounded-none -mr-2" onClick={onClose}>
            <X size={18} strokeWidth={1.5} />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <ShoppingBag size={40} strokeWidth={1} className="text-[#E2DDD8]" />
              <p className="font-serif text-xl font-light">Sign in to view your bag</p>
              <Button asChild className="rounded-none w-full">
                <Link href="/login" onClick={onClose}>Sign In</Link>
              </Button>
            </div>
          ) : !cart?.items?.length ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <ShoppingBag size={40} strokeWidth={1} className="text-[#E2DDD8]" />
              <p className="font-serif text-xl font-light">Your bag is empty</p>
              <Button asChild variant="outline" className="rounded-none">
                <Link href="/shop" onClick={onClose}>Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full px-6 py-6">
              <div className="space-y-6 pr-2">
                {cart.items.map((item) => {
                  const img = item.product.images?.find((i) => i.is_primary) ?? item.product.images?.[0];
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-[#F0ECE6] relative shrink-0 overflow-hidden">
                        {img && <Image src={img.image_url} alt={img.alt_text} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <Link href={`/shop/${item.product.slug}`} onClick={onClose}
                            className="font-medium text-sm leading-tight hover:text-[#C9A96E] transition-colors line-clamp-2">
                            {item.product.name}
                          </Link>
                          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-none shrink-0 -mt-0.5"
                            onClick={() => removeItem(item.id)}>
                            <X size={12} />
                          </Button>
                        </div>
                        <Badge variant="secondary" className="mt-1 text-[9px]">{item.product.category_detail?.name}</Badge>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[#E2DDD8]">
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none"
                              onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}>
                              <Minus size={11} />
                            </Button>
                            <span className="w-7 text-center text-xs">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none"
                              onClick={() => updateItem(item.id, item.quantity + 1)}>
                              <Plus size={11} />
                            </Button>
                          </div>
                          <p className="text-sm font-medium">{sym}{parseFloat(item.line_total).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        {cart?.items?.length ? (
          <div className="border-t border-[#E2DDD8] px-6 py-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#8A8A8A] font-light">Subtotal</span>
              <span className="font-medium">{sym}{parseFloat(cart.subtotal).toLocaleString()}</span>
            </div>
            {parseFloat(cart.discount_total) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8A8A] font-light">Discount</span>
                <Badge variant="gold">−{sym}{parseFloat(cart.discount_total).toLocaleString()}</Badge>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="font-serif text-lg">{sym}{parseFloat(cart.grand_total).toLocaleString()}</span>
            </div>
            <Button asChild size="lg" className="w-full rounded-none tracking-[0.15em] mt-1">
              <Link href="/checkout" onClick={onClose}>Proceed to Checkout</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="w-full text-[#8A8A8A]">
              <Link href="/shop" onClick={onClose}>Continue Shopping</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
}
