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

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
  const secondaryImage = product.images?.[1];

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in to add items to cart"); return; }
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
      await productsApi.addWishlist(product.id);
      setWishlisted(true);
      toast.success("Added to wishlist");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-[#F0ECE6] overflow-hidden mb-4">
        {primaryImage && (
          <Image
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || product.name}
            fill
            className={`object-cover transition-opacity duration-700 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
        {secondaryImage && (
          <Image
            src={secondaryImage.image_url}
            alt={secondaryImage.alt_text || product.name}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {/* Overlay actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
          <button
            onClick={handleAddToCart}
            disabled={adding || !product.stock_quantity}
            className="flex-1 bg-white/95 backdrop-blur-sm text-[#0A0A0A] text-label py-3 hover:bg-[#0A0A0A] hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={13} strokeWidth={1.5} />
            {product.stock_quantity ? (adding ? "Adding…" : "Add to Bag") : "Out of Stock"}
          </button>
          <button
            onClick={handleWishlist}
            className="w-11 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            <Heart size={14} strokeWidth={1.5} fill={wishlisted ? "currentColor" : "none"} className={wishlisted ? "text-[#C9A96E]" : ""} />
          </button>
        </div>

        {/* Badge */}
        {!product.stock_quantity && (
          <div className="absolute top-3 left-3 bg-[#0A0A0A] text-white text-[9px] tracking-widest uppercase px-2 py-1">
            Sold Out
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-[#8A8A8A] mb-1">
          {product.category_detail?.name}
        </p>
        <h3 className="font-serif text-lg font-light leading-tight group-hover:text-[#C9A96E] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-medium">
            {product.currency_detail?.symbol}
            {parseFloat(product.price).toLocaleString()}
          </p>
          {product.average_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={11} strokeWidth={1.5} fill="currentColor" className="text-[#C9A96E]" />
              <span className="text-xs text-[#8A8A8A]">{product.average_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
