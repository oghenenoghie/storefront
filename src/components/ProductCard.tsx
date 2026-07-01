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
    <Link href={`/shop/${product.slug}`} className="group product-card">
      {/* Image */}
      <div
        className={cn(
          "product-card-image",
          featured && "aspect-[3/5]"
        )}
      >
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
            <span className="bg-[#1A1A1A] text-white text-[9px] font-medium tracking-[0.25em] uppercase px-4 py-2">
              Sold Out
            </span>
          </div>
        )}

        {/* Category badge (top-left) */}
        {product.category_detail?.name && (
          <div className="absolute top-3 left-3">
            <span className="bg-white/95 backdrop-blur-sm text-[#1A1A1A] text-[8px] font-medium tracking-[0.2em] uppercase px-2 py-1">
              {product.category_detail.name}
            </span>
          </div>
        )}

        {/* Sale badge (top-right, only if discounted and in stock) */}
        {discountPct && !isSoldOut && (
          <div className="absolute top-3 right-3">
            <span className="bg-[#1A1A1A] text-white text-[8px] font-medium tracking-[0.05em] px-2 py-1">
              −{discountPct}%
            </span>
          </div>
        )}

        {/* Wishlist button (top-right when no sale badge) */}
        {!discountPct && (
          <button
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#1A1A1A] hover:text-white"
          >
            <Heart size={14} strokeWidth={1.5} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        )}

        {/* Add to Bag overlay strip (slides up on hover) */}
        {!isSoldOut && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full h-11 bg-[#1A1A1A]/93 text-white text-[10px] font-medium tracking-[0.3em] uppercase flex items-center justify-center gap-2 hover:bg-[#1A1A1A] transition-colors disabled:opacity-60"
            >
              <ShoppingBag size={13} strokeWidth={1.5} />
              {adding ? "Adding…" : "Add to Bag"}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="product-card-info">
        <p className="font-brand-label">
          {product.category_detail?.name}
        </p>
        <h3 className="product-card-name leading-snug">
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
                  fill={s <= Math.round(product.average_rating) ? "#1A1A1A" : "none"}
                  className={s <= Math.round(product.average_rating) ? "text-[#1A1A1A]" : "text-[#E0E0E0]"}
                />
              ))}
            </div>
            <span className="text-[10px] text-[#8C8C8C]">
              {product.average_rating.toFixed(1)}
              {product.review_count > 0 && ` · ${product.review_count}`}
            </span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="product-card-price font-medium">
            {product.currency_detail?.symbol ?? "$"}{parseFloat(product.price).toLocaleString()}
          </span>
          {comparePrice && parseFloat(comparePrice) > parseFloat(product.price) && (
            <span className="text-[0.8125rem] font-normal text-[#8C8C8C] line-through">
              {product.currency_detail?.symbol ?? "$"}{parseFloat(comparePrice).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
