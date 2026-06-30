"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Heart, ChevronRight, Minus, Plus, Share2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import { Review } from "@/types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

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

  const handleWishlist = async () => {
    if (!user) { toast.error("Please sign in"); return; }
    try {
      await productsApi.addWishlist(product!.id);
      setWishlisted(true);
      toast.success("Added to wishlist");
    } catch {
      toast.error("Failed to add to wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-square" />
          <div className="space-y-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 text-center text-[#8A8A8A]">
        <p className="font-serif text-2xl font-light mb-4">Product not found</p>
        <Button asChild variant="outline"><Link href="/shop">Back to Shop</Link></Button>
      </div>
    );
  }

  const displayImg = product.images?.[selectedImage] ?? product.images?.[0];
  const inStock = product.stock_quantity > 0;

  return (
    <TooltipProvider>
      <div className="min-h-screen pt-20">
        {/* Breadcrumb */}
        <div className="border-b border-[#E2DDD8] bg-[#F7F4F0]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-3 flex items-center gap-2 text-xs text-[#8A8A8A]">
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

            {/* ── Images ── */}
            <div className="flex gap-3">
              {product.images?.length > 1 && (
                <div className="flex flex-col gap-2 w-16 shrink-0">
                  {product.images.map((img: { image_url: string; alt_text: string }, i: number) => (
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
                {!inStock && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <Badge variant="default" className="text-sm px-4 py-2">Sold Out</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* ── Details ── */}
            <div className="lg:sticky lg:top-24 self-start space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{product.category_detail?.name}</Badge>
                  {inStock
                    ? <Badge variant="success">In Stock</Badge>
                    : <Badge variant="outline" className="text-red-500 border-red-200">Out of Stock</Badge>}
                </div>
                <h1 className="font-serif font-light mb-3"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {product.name}
                </h1>

                {/* Stars */}
                {product.average_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={13} strokeWidth={1.5}
                          fill={s <= Math.round(product.average_rating) ? "#C9A96E" : "none"}
                          className={s <= Math.round(product.average_rating) ? "text-[#C9A96E]" : "text-[#E2DDD8]"} />
                      ))}
                    </div>
                    <span className="text-sm text-[#8A8A8A] font-light">
                      {product.average_rating.toFixed(1)} · {product.review_count} reviews
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <p className="font-serif text-4xl font-light">
                  {product.currency_detail?.symbol}{parseFloat(product.price).toLocaleString()}
                </p>
                <span className="text-xs text-[#8A8A8A]">{product.currency_detail?.code}</span>
              </div>

              <Separator />

              {/* Quantity */}
              <div className="space-y-2">
                <p className="text-label">Quantity</p>
                <div className="flex items-center border border-[#E2DDD8] w-fit">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-none"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus size={14} strokeWidth={1.5} />
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-none"
                    onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                    disabled={!inStock}
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </Button>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 rounded-none h-13 text-[0.6875rem] tracking-[0.2em]"
                  onClick={handleAddToCart}
                  disabled={adding || !inStock}
                >
                  <ShoppingBag size={15} strokeWidth={1.5} />
                  {adding ? "Adding…" : inStock ? "Add to Bag" : "Out of Stock"}
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-13 w-13 rounded-none shrink-0"
                      onClick={handleWishlist}
                    >
                      <Heart size={16} strokeWidth={1.5}
                        fill={wishlisted ? "#C9A96E" : "none"}
                        className={wishlisted ? "text-[#C9A96E]" : ""} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save to Wishlist</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-13 w-13 rounded-none shrink-0"
                      onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }}>
                      <Share2 size={15} strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
              </div>

              <Separator />

              {/* Tabs: Description / Reviews */}
              <Tabs defaultValue="description">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                </TabsList>

                <TabsContent value="description">
                  <p className="text-[#5A5A5A] font-light leading-relaxed text-sm">
                    {product.description || "No description available."}
                  </p>
                  <div className="mt-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="details">
                        <AccordionTrigger>Product Details</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between"><span className="text-[#8A8A8A]">SKU</span><span>{product.slug}</span></li>
                            <li className="flex justify-between"><span className="text-[#8A8A8A]">Category</span><span>{product.category_detail?.name}</span></li>
                            <li className="flex justify-between"><span className="text-[#8A8A8A]">Stock</span><span>{product.stock_quantity} units</span></li>
                            <li className="flex justify-between"><span className="text-[#8A8A8A]">Currency</span><span>{product.currency_detail?.code}</span></li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="care">
                        <AccordionTrigger>Care Instructions</AccordionTrigger>
                        <AccordionContent>
                          Handle with care. Store in a cool, dry place. Follow garment label instructions for washing and maintenance.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="font-serif text-lg font-light text-[#8A8A8A] mb-2">No reviews yet</p>
                      <p className="text-sm text-[#8A8A8A]">Be the first to review this product</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {reviews.map((r) => (
                        <div key={r.id} className="flex gap-4">
                          <Avatar className="shrink-0">
                            <AvatarFallback>{r.user?.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{r.user?.username ?? "Customer"}</span>
                              <div className="flex">
                                {[1,2,3,4,5].map((s) => (
                                  <Star key={s} size={11}
                                    fill={s <= r.rating ? "#C9A96E" : "none"}
                                    className={s <= r.rating ? "text-[#C9A96E]" : "text-[#E2DDD8]"} />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm font-medium mb-1">{r.title}</p>
                            <p className="text-sm text-[#5A5A5A] font-light">{r.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="shipping">
                  <div className="space-y-4 text-sm text-[#5A5A5A] font-light">
                    <p><strong className="text-[#0A0A0A] font-medium">Free Standard Shipping</strong> on orders over $200. Delivered in 5–7 business days.</p>
                    <p><strong className="text-[#0A0A0A] font-medium">Express Shipping</strong> available at checkout. Delivered in 2–3 business days.</p>
                    <p><strong className="text-[#0A0A0A] font-medium">Easy Returns</strong> within 30 days of delivery. Items must be unused and in original packaging.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
