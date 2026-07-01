"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { Category } from "@/types";
import Link from "next/link";

export default function FeaturedCategories() {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productsApi.categories(),
  });

  const categories: Category[] = data?.data?.results ?? data?.data ?? [];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-brand-label mb-3">Browse by</p>
            <h2 className="section-heading">Category</h2>
          </div>
          <Link
            href="/shop"
            className="text-label border-b border-[#1A1A1A] pb-0.5 hover:text-[#8C8C8C] hover:border-[#8C8C8C] transition-colors hidden md:block"
          >
            All Categories →
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-square bg-[#F7F7F7] border border-[#E0E0E0] overflow-hidden flex items-end p-6 hover:border-[#1A1A1A] transition-colors duration-300"
              >
                <div className="relative z-10">
                  <p className="font-serif text-2xl font-light text-[#1A1A1A] mb-1">
                    {cat.name}
                  </p>
                  <p className="font-brand-label group-hover:text-[#1A1A1A] transition-colors">
                    Explore →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
