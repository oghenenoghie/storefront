"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { Category } from "@/types";
import Link from "next/link";

const categoryColors = [
  "from-[#1A1410] to-[#0D0A08]",
  "from-[#0D1A10] to-[#080D0A]",
  "from-[#0D0D1A] to-[#080810]",
  "from-[#1A100D] to-[#0D0808]",
];

export default function FeaturedCategories() {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productsApi.categories(),
  });

  const categories: Category[] = data?.data?.results ?? data?.data ?? [];

  return (
    <section className="py-20 lg:py-28 bg-[#F7F4F0]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-label text-[#C9A96E] mb-3">Browse by</p>
            <h2
              className="font-serif font-light"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-label border-b border-[#0A0A0A] pb-0.5 hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors hidden md:block"
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
            {categories.slice(0, 4).map((cat, i) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`group relative aspect-square bg-gradient-to-br ${categoryColors[i % categoryColors.length]} overflow-hidden flex items-end p-6`}
              >
                <div className="absolute inset-0 bg-[#C9A96E]/0 group-hover:bg-[#C9A96E]/10 transition-colors duration-500" />
                <div className="relative z-10">
                  <p className="font-serif text-2xl font-light text-white mb-1 group-hover:text-[#C9A96E] transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-label text-[#5A5A5A] group-hover:text-[#C9A96E]/70 transition-colors">
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
