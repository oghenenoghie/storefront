"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Heart, Star, ChevronRight, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import { Review } from "@/types";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsApi.get(slug),
    enabled: !!slug,
  });

  const { data: reviewData } = useQuery({
    queryKey: ["reviews", slug],
    queryFn: () => productsApi.reviews(slug),
    enabled: !!slug,
  });

  const product = data?.data;
  const reviews: Review[] = reviewData?.data?.results ?? reviewData?.data ?? [];

  const handleAddToCart = async () => {
    if (!user) { toast.error("Please sign in to add items to cart"); return; }
    if (!product) return;
    setAdding(true);
    try {
      await addItem(product.id, quantity);
      toast.success(`${product.name} added to bag`);
    } catch {
      toast.error("Failed to add to bag");
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-square animate-shimmer" />
          <div className="space-y-6">
            <div className="h-5 animate-shimmer w-1/3" />
            <div className="h-10 animate-shimmer" />
            <div className="h-6 animate-shimmer w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="pt-40 text-center text-[#8A8A8A]">Product not found</div>;

  const primaryIdx = product.images?.findIndex((i: { is_primary: boolean }) => i.is_primary) ?? 0;
  const displayImg = product.images?.[selectedImage] ?? product.images?.[primaryIdx];

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-[#E2DDD8] bg-[#F7F4F0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center gap-2 text-xs text-[#8A8A8A]">
          <Link href="/" className="hover:text-[#C9A96E] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-[#C9A96E] transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop?category=${product.category_detail?.slug}`} className="hover:text-[#C9A96E] transition-colors">
            {product.category_detail?.name}
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0A0A0A]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex flex-col gap-2 w-16">
                {product.images.map((img: { image_url: string; alt_text: string; is_primary: boolean }, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-[#C9A96E]" : "border-transparent hover:border-[#E2DDD8]"
                    }`}
                  >
                    <Image src={img.image_url} alt={img.alt_text} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Main image */}
            <div className="flex-1 relative aspect-square bg-[#F0ECE6] overflow-hidden">
              {displayImg && (
                <Image
                  src={displayImg.image_url}
                  alt={displayImg.alt_text || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-label text-[#C9A96E] mb-3">{product.category_detail?.name}</p>
            <h1
              className="font-serif font-light mb-4"
              style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            {product.average_rating > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      strokeWidth={1.5}
                      fill={s <= Math.round(product.average_rating) ? "#C9A96E" : "none"}
                      className={s <= Math.round(product.average_rating) ? "text-[#C9A96E]" : "text-[#E2DDD8]"}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#8A8A8A] font-light">
                  {product.average_rating.toFixed(1)} ({product.review_count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <p className="text-3xl font-light mb-8 font-serif">
              {product.currency_detail?.symbol}
              {parseFloat(product.price).toLocaleString()}
            </p>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? "bg-green-500" : "bg-red-400"}`} />
              <span className="text-sm font-light text-[#8A8A8A]">
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-label mb-3">Quantity</p>
              <div className="flex items-center border border-[#E2DDD8] w-fit">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-[#F7F4F0] transition-colors"
                >
                  <Minus size={14} strokeWidth={1.5} />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-[#F7F4F0] transition-colors"
                >
                  <Plus size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={adding || !product.stock_quantity}
                className="flex-1 bg-[#0A0A0A] text-white text-label py-4 hover:bg-[#C9A96E] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <ShoppingBag size={15} strokeWidth={1.5} />
                {adding ? "Adding…" : product.stock_quantity ? "Add to Bag" : "Out of Stock"}
              </button>
              <button className="w-14 border border-[#E2DDD8] flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors">
                <Heart size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E2DDD8] mb-8" />

            {/* Tabs */}
            <div>
              <div className="flex border-b border-[#E2DDD8] mb-6">
                {(["description", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-label pb-4 mr-8 border-b-2 transition-colors capitalize ${
                      activeTab === tab
                        ? "border-[#C9A96E] text-[#C9A96E]"
                        : "border-transparent text-[#8A8A8A] hover:text-[#0A0A0A]"
                    }`}
                  >
                    {tab} {tab === "reviews" && `(${reviews.length})`}
                  </button>
                ))}
              </div>

              {activeTab === "description" ? (
                <p className="text-[#5A5A5A] font-light leading-relaxed text-sm">
                  {product.description || "No description available."}
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-[#8A8A8A] font-light text-sm">No reviews yet. Be the first!</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="border-b border-[#F0ECE6] pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              fill={s <= r.rating ? "#C9A96E" : "none"}
                              className={s <= r.rating ? "text-[#C9A96E]" : "text-[#E2DDD8]"}
                            />
                          ))}
                        </div>
                        <p className="font-medium text-sm mb-1">{r.title}</p>
                        <p className="text-[#5A5A5A] text-sm font-light">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
