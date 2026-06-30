"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { productsApi } from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: Props) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
  const secondaryImage = product.images?.[1];

  const isSoldOut = !product.stock_quantity;

  // Compute discount % if compare price exists
  const comparePrice = (product as { compare_price?: string }).compare_price;
  const discountPct =
    comparePrice && parseFloat(comparePrice) > parseFloat(product.price)
      ? Math.round((1 - parseFloat(product.price) / parseFloat(comparePrice)) * 100)
      : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in to add items to cart"); return; }
    if (isSoldOut) return;
    setAdding(true);
    try {
      await addItem(product.id);
      toast.success(`${product.name} added to bag`);
    } catch {
      toast.error("Failed to add to bag");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in"); return; }
    try {
      if (wishlisted) {
        await productsApi.removeWishlist(product.id);
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await productsApi.addWishlist(product.id);
        setWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      {/* ── Image Area (3:4 ratio, bg cream) ── */}
      <div
        className={cn(
          "relative overflow-hidden bg-[#F0ECE6]",
          featured ? "aspect-[3/5]" : "aspect-[3/4]"
        )}
      >
        {/* Primary image */}
        {primaryImage && (
          <Image
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || product.name}
            fill
            className={cn(
              "object-cover transition-opacity duration-700",
              secondaryImage && !isSoldOut && "group-hover:opacity-0"
            )}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {/* Secondary image (swap on hover) */}
        {secondaryImage && !isSoldOut && (
          <Image
            src={secondaryImage.image_url}
            alt={secondaryImage.alt_text || product.name}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {/* Sold-out frost overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-[#0A0A0A] text-white text-[9px] font-medium tracking-[0.25em] uppercase px-4 py-2"
              style={{ fontFamily: "var(--font-sans)" }}>
              Sold Out
            </span>
          </div>
        )}

        {/* Category badge (top-left) */}
        {product.category_detail?.name && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#0A0A0A] text-[#C9A96E] text-[8px] font-medium tracking-[0.2em] uppercase px-2 py-1"
              style={{ fontFamily: "var(--font-sans)" }}>
              {product.category_detail.name}
            </span>
          </div>
        )}

        {/* Sale badge (top-right, only if discounted and in stock) */}
        {discountPct && !isSoldOut && (
          <div className="absolute top-3 right-3">
            <span className="bg-[#C9A96E] text-white text-[8px] font-medium tracking-[0.05em] px-2 py-1"
              style={{ fontFamily: "var(--font-sans)" }}>
              −{discountPct}%
            </span>
          </div>
        )}

        {/* Wishlist button (top-right when no sale badge) */}
        {!discountPct && (
          <button
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#F7F4F0]"
          >
            <Heart
              size={14}
              strokeWidth={1.5}
              fill={wishlisted ? "#C9A96E" : "none"}
              className={wishlisted ? "text-[#C9A96E]" : "text-[#0A0A0A]"}
            />
          </button>
        )}

        {/* Add to Bag overlay strip (slides up on hover) */}
        {!isSoldOut && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full h-11 bg-[#0A0A0A]/93 text-white text-[10px] font-medium tracking-[0.3em] uppercase flex items-center justify-center gap-2 hover:bg-[#0A0A0A] transition-colors disabled:opacity-60"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <ShoppingBag size={13} strokeWidth={1.5} />
              {adding ? "Adding…" : "Add to Bag"}
            </button>
          </div>
        )}
      </div>

      {/* ── Info Area ── */}
      <div className="pt-3.5 pb-3.5 space-y-1.5">
        {/* Product name */}
        <h3
          className="font-serif text-[1.125rem] font-light leading-snug group-hover:text-[#C9A96E] transition-colors"
          style={{ letterSpacing: "-0.01em" }}
        >
          {product.name}
        </h3>

        {/* Rating row */}
        {product.average_rating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={10}
                  strokeWidth={1.5}
                  fill={s <= Math.round(product.average_rating) ? "#C9A96E" : "none"}
                  className={s <= Math.round(product.average_rating) ? "text-[#C9A96E]" : "text-[#E2DDD8]"}
                />
              ))}
            </div>
            <span className="text-[10px] text-[#8A8A8A]" style={{ fontFamily: "var(--font-sans)" }}>
              {product.average_rating.toFixed(1)}
              {product.review_count > 0 && ` · ${product.review_count}`}
            </span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-serif text-[1.25rem] font-medium text-[#0A0A0A]">
            {product.currency_detail?.symbol ?? "$"}{parseFloat(product.price).toLocaleString()}
          </span>
          {comparePrice && parseFloat(comparePrice) > parseFloat(product.price) && (
            <span
              className="text-[0.8125rem] font-light text-[#8A8A8A] line-through"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {product.currency_detail?.symbol ?? "$"}{parseFloat(comparePrice).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
