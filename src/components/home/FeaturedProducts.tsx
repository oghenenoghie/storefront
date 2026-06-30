"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["products-featured"],
    queryFn: () => productsApi.list({ is_active: true, ordering: "-created_at" }),
  });

  const products: Product[] = data?.data?.results ?? data?.data ?? [];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-label text-[#C9A96E] mb-3">Hand Picked</p>
            <h2
              className="font-serif font-light"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-label border-b border-[#0A0A0A] pb-0.5 hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors hidden md:block"
          >
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] animate-shimmer mb-4" />
                <div className="h-3 animate-shimmer mb-2 w-2/3" />
                <div className="h-4 animate-shimmer mb-2" />
                <div className="h-3 animate-shimmer w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
