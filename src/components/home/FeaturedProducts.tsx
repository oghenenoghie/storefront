"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import ErrorState from "@/components/ErrorState";
import Link from "next/link";

export default function FeaturedProducts() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products-featured"],
    queryFn: () => productsApi.list({ is_active: true, ordering: "-created_at" }),
  });

  const products: Product[] = data?.data?.results ?? data?.data ?? [];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-brand-label mb-3">Hand Picked</p>
            <h2 className="section-heading">New Arrivals</h2>
          </div>
          <Link
            href="/shop"
            className="text-label border-b border-[#1A1A1A] pb-0.5 hover:text-[#8C8C8C] hover:border-[#8C8C8C] transition-colors hidden md:block"
          >
            View All →
          </Link>
        </div>

        {isError ? (
          <ErrorState message="Couldn't load new arrivals." onRetry={() => refetch()} />
        ) : isLoading ? (
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
        ) : products.length === 0 ? (
          <p className="text-[#8C8C8C] text-sm">No products available yet.</p>
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
