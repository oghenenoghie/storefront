"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { Product, Category } from "@/types";
import ProductCard from "@/components/ProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Suspense } from "react";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const ordering = searchParams.get("ordering") || "-created_at";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const inStock = searchParams.get("in_stock") || "";

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.push(`/shop?${p.toString()}`);
  };

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productsApi.categories(),
  });
  const categories: Category[] = catData?.data?.results ?? catData?.data ?? [];

  const { data, isLoading } = useQuery({
    queryKey: ["products", category, ordering, minPrice, maxPrice, inStock],
    queryFn: () =>
      productsApi.list({
        is_active: true,
        ...(category && { category }),
        ordering,
        ...(minPrice && { min_price: minPrice }),
        ...(maxPrice && { max_price: maxPrice }),
        ...(inStock && { in_stock: inStock }),
      }),
  });

  const products: Product[] = data?.data?.results ?? data?.data ?? [];

  const sortOptions = [
    { value: "-created_at", label: "Newest" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
    { value: "name", label: "Name A–Z" },
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Page header */}
      <div className="border-b border-[#E2DDD8] bg-[#F7F4F0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
          <p className="text-label text-[#C9A96E] mb-2">All Products</p>
          <h1 className="font-serif text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
            {category
              ? categories.find((c) => c.slug === category)?.name ?? "Shop"
              : "Shop"}
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Category pills */}
            <button
              onClick={() => setParam("category", "")}
              className={`text-label px-4 py-2 border transition-colors ${
                !category
                  ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                  : "border-[#E2DDD8] hover:border-[#0A0A0A]"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setParam("category", c.slug)}
                className={`text-label px-4 py-2 border transition-colors ${
                  category === c.slug
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "border-[#E2DDD8] hover:border-[#0A0A0A]"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 text-label hover:text-[#C9A96E] transition-colors"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              Filters
            </button>
            <select
              value={ordering}
              onChange={(e) => setParam("ordering", e.target.value)}
              className="text-label border border-[#E2DDD8] px-3 py-2 bg-white focus:outline-none focus:border-[#C9A96E] cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {products.length > 0 && (
              <span className="text-[#8A8A8A] text-sm font-light">{products.length} items</span>
            )}
          </div>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="bg-[#F7F4F0] border border-[#E2DDD8] p-6 mb-8 flex flex-wrap gap-8">
            <div>
              <p className="text-label mb-3">Price Range</p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setParam("min_price", e.target.value)}
                  className="w-24 border border-[#E2DDD8] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                />
                <span className="text-[#8A8A8A]">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setParam("max_price", e.target.value)}
                  className="w-24 border border-[#E2DDD8] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                />
              </div>
            </div>
            <div>
              <p className="text-label mb-3">Availability</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock === "true"}
                  onChange={(e) => setParam("in_stock", e.target.checked ? "true" : "")}
                  className="accent-[#C9A96E]"
                />
                <span className="text-sm font-light">In Stock Only</span>
              </label>
            </div>
            <button
              onClick={() => {
                setParam("min_price", "");
                setParam("max_price", "");
                setParam("in_stock", "");
              }}
              className="flex items-center gap-1 text-label text-[#8A8A8A] hover:text-[#0A0A0A] transition-colors self-end"
            >
              <X size={12} /> Clear Filters
            </button>
          </div>
        )}

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] animate-shimmer mb-4" />
                <div className="h-3 animate-shimmer mb-2 w-2/3" />
                <div className="h-4 animate-shimmer mb-2" />
                <div className="h-3 animate-shimmer w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-3xl font-light text-[#C0B8B0] mb-3">No products found</p>
            <p className="text-[#8A8A8A] font-light">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
