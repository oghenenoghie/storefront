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
    <div className="bg-[#F7F4F0] p-4 md:p-8 rounded-2xl">
      {/* Main image */}
      {primaryImage && (
        <div className="relative w-full h-60 md:h-80 rounded-xl overflow-hidden mb-6">
          <Image
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || product.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Details */}
      <div className="space-y-4">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#C9A96E] font-medium mb-1">
            {product.category_detail?.name}
          </p>
          <h3 className="font-serif text-2xl font-light" style={{ letterSpacing: "-0.01em" }}>
            {product.name}
          </h3>
        </div>

        <p className="text-[#5A5A5A] font-light text-sm leading-relaxed line-clamp-3">
          {product.description || "A premium piece from our curated collection."}
        </p>

        <div className="flex items-center justify-between">
          <p className="font-serif text-2xl font-light">
            {product.currency_detail?.symbol}
            {parseFloat(product.price).toLocaleString()}
          </p>
          {product.average_rating > 0 && (
            <div className="flex items-center gap-1.5">
              <Star size={13} strokeWidth={1.5} fill="#C9A96E" className="text-[#C9A96E]" />
              <span className="text-sm text-[#8A8A8A]">
                {product.average_rating.toFixed(1)} ({product.review_count})
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleAdd}
            disabled={!product.stock_quantity}
            className="flex-1 flex items-center justify-center gap-2 bg-[#0A0A0A] text-white text-[0.6875rem] tracking-[0.2em] uppercase font-medium py-3.5 hover:bg-[#C9A96E] transition-colors duration-300 disabled:opacity-40 rounded-none"
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
            {product.stock_quantity ? "Add to Bag" : "Sold Out"}
          </button>
          <Link
            href={`/shop/${product.slug}`}
            className="px-5 border border-[#0A0A0A] text-[0.6875rem] tracking-[0.2em] uppercase font-medium flex items-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
          >
            View
          </Link>
        </div>

        {/* Extra images */}
        {product.images?.length > 1 && (
          <div className="flex gap-2 pt-2">
            {product.images.slice(0, 4).map((img, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#E8E0D5]">
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
      <div className="py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-8">
          <div className="h-5 w-32 animate-shimmer mb-3" />
          <div className="h-10 w-64 animate-shimmer" />
        </div>
        <div className="flex gap-4 pl-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-56 md:w-96 h-80 md:h-[40rem] animate-shimmer rounded-3xl shrink-0" />
          ))}
        </div>
      </div>
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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <p className="text-[0.6875rem] tracking-[0.2em] uppercase font-medium text-[#C9A96E] mb-3">
          Swipe to Explore
        </p>
        <h2
          className="font-serif font-light"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
        >
          The Collection
        </h2>
      </div>
      <Carousel items={cards} />
    </section>
  );
}
