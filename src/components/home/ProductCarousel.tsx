"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardContent({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const handleAdd = async () => {
    if (!user) { toast.error("Please sign in to add items to cart"); return; }
    try {
      await addItem(product.id);
      toast.success(`${product.name} added to bag`);
    } catch {
      toast.error("Failed to add to bag");
    }
  };

  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];

  return (
    <div className="bg-white border border-[#E0E0E0] p-5 md:p-8">
      {/* Main image */}
      {primaryImage && (
        <div className="relative w-full h-56 md:h-72 overflow-hidden bg-[#F7F7F7] mb-5">
          <Image
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || product.name}
            fill
            className="object-cover"
          />
          {!product.stock_quantity && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <Badge variant="default">Sold Out</Badge>
            </div>
          )}
        </div>
      )}

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge variant="secondary" className="mb-2">{product.category_detail?.name}</Badge>
            <h3 className="font-product-title" style={{ letterSpacing: "0.01em" }}>
              {product.name}
            </h3>
          </div>
          <p className="font-serif text-xl font-light shrink-0">
            {product.currency_detail?.symbol}{parseFloat(product.price).toLocaleString()}
          </p>
        </div>

        {product.average_rating > 0 && (
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={11} strokeWidth={1.5}
                fill={s <= Math.round(product.average_rating) ? "#1A1A1A" : "none"}
                className={s <= Math.round(product.average_rating) ? "text-[#1A1A1A]" : "text-[#E0E0E0]"} />
            ))}
            <span className="text-xs text-[#8C8C8C] ml-1">
              {product.average_rating.toFixed(1)} · {product.review_count} reviews
            </span>
          </div>
        )}

        <p className="text-[#6A6A6A] font-normal text-sm leading-relaxed line-clamp-2">
          {product.description || "A premium piece from our curated collection."}
        </p>

        <Separator />

        <div className="flex gap-2 pt-1">
          <Button
            onClick={handleAdd}
            disabled={!product.stock_quantity}
            className="flex-1 text-[0.6875rem] tracking-[0.15em] gap-2"
          >
            <ShoppingBag size={13} strokeWidth={1.5} />
            {product.stock_quantity ? "Add to Bag" : "Sold Out"}
          </Button>
          <Button asChild variant="outline" className="px-4">
            <Link href={`/shop/${product.slug}`}>View →</Link>
          </Button>
        </div>

        {/* Thumbnail strip */}
        {product.images?.length > 1 && (
          <div className="flex gap-2 pt-1">
            {product.images.slice(0, 5).map((img, i) => (
              <div key={i} className="relative w-12 h-12 overflow-hidden bg-[#F7F7F7] border border-[#E0E0E0]">
                <Image src={img.image_url} alt={img.alt_text || ""} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductCarousel() {
  const { data, isLoading } = useQuery({
    queryKey: ["products-carousel"],
    queryFn: () => productsApi.list({ is_active: true, ordering: "-created_at" }),
  });

  const products: Product[] = data?.data?.results ?? data?.data ?? [];

  if (isLoading) {
    return (
      <section className="py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-16 mb-8 space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-56" />
        </div>
        <div className="flex gap-4 pl-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-56 md:w-96 h-80 md:h-[40rem] shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  const cards = products.map((product, i) => {
    const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0];
    return (
      <Card
        key={product.id}
        index={i}
        layout
        card={{
          src: primaryImage?.image_url ?? "/next.svg",
          title: product.name,
          category: product.category_detail?.name ?? "",
          content: <ProductCardContent product={product} />,
        }}
      />
    );
  });

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-16">
        <p className="font-brand-label mb-3">Swipe to Explore</p>
        <h2 className="section-heading">The Collection</h2>
      </div>
      <Carousel items={cards} />
    </section>
  );
}
