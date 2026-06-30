"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cartApi } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sameAddress, setSameAddress] = useState(true);
  const [form, setForm] = useState({
    shipping_address: "",
    billing_address: "",
    notes: "",
  });

  useEffect(() => {
    if (!user) router.push("/login");
    else fetchCart();
  }, [user, router, fetchCart]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart) return;
    setLoading(true);
    try {
      await cartApi.checkout(cart.id, {
        shipping_address: form.shipping_address,
        billing_address: sameAddress ? form.shipping_address : form.billing_address,
        notes: form.notes,
      });
      await fetchCart();
      toast.success("Order placed successfully!");
      router.push("/account");
    } catch {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen pt-40 text-center">
        <p className="font-serif text-2xl font-light text-[#8A8A8A] mb-4">Your bag is empty</p>
        <Link href="/shop" className="text-label border-b border-[#0A0A0A] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors">
          Continue Shopping →
        </Link>
      </div>
    );
  }

  const sym = cart.items[0]?.product?.currency_detail?.symbol ?? "$";

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <p className="text-label text-[#C9A96E] mb-3">Secure Checkout</p>
        <h1 className="font-serif text-4xl font-light mb-12" style={{ letterSpacing: "-0.02em" }}>
          Complete Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping */}
            <div className="bg-[#F7F4F0] p-8">
              <h2 className="font-serif text-xl font-light mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-label block mb-2">Full Address</label>
                  <textarea
                    value={form.shipping_address}
                    onChange={(e) => set("shipping_address", e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-white border border-[#E2DDD8] px-4 py-3 text-sm font-light focus:outline-none focus:border-[#C9A96E] transition-colors resize-none"
                    placeholder="Street address, city, country"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) => setSameAddress(e.target.checked)}
                    className="accent-[#C9A96E]"
                  />
                  <span className="text-sm font-light">Billing address same as shipping</span>
                </label>
              </div>
            </div>

            {/* Billing */}
            {!sameAddress && (
              <div className="bg-[#F7F4F0] p-8">
                <h2 className="font-serif text-xl font-light mb-6">Billing Address</h2>
                <textarea
                  value={form.billing_address}
                  onChange={(e) => set("billing_address", e.target.value)}
                  required={!sameAddress}
                  rows={3}
                  className="w-full bg-white border border-[#E2DDD8] px-4 py-3 text-sm font-light focus:outline-none focus:border-[#C9A96E] transition-colors resize-none"
                  placeholder="Billing address"
                />
              </div>
            )}

            {/* Notes */}
            <div className="bg-[#F7F4F0] p-8">
              <h2 className="font-serif text-xl font-light mb-6">Order Notes (Optional)</h2>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={2}
                className="w-full bg-white border border-[#E2DDD8] px-4 py-3 text-sm font-light focus:outline-none focus:border-[#C9A96E] transition-colors resize-none"
                placeholder="Special instructions, delivery notes…"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A0A0A] text-white text-label py-5 hover:bg-[#C9A96E] transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "Placing Order…" : `Place Order — ${sym}${parseFloat(cart.grand_total).toLocaleString()}`}
            </button>
          </form>

          {/* Order summary */}
          <div>
            <div className="bg-[#F7F4F0] p-8 sticky top-24">
              <h2 className="font-serif text-xl font-light mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => {
                  const img = item.product.images?.find((i) => i.is_primary) ?? item.product.images?.[0];
                  return (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-16 h-20 bg-[#E8E0D5] relative shrink-0 overflow-hidden">
                        {img && <Image src={img.image_url} alt={img.alt_text} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-[#8A8A8A] font-light">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium shrink-0">
                        {sym}{parseFloat(item.line_total).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-[#E2DDD8] pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8A8A] font-light">Subtotal</span>
                  <span>{sym}{parseFloat(cart.subtotal).toLocaleString()}</span>
                </div>
                {parseFloat(cart.discount_total) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8A8A8A] font-light">Discount</span>
                    <span className="text-[#C9A96E]">−{sym}{parseFloat(cart.discount_total).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium border-t border-[#E2DDD8] pt-3">
                  <span>Total</span>
                  <span className="font-serif text-lg">{sym}{parseFloat(cart.grand_total).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
