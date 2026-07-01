"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { Product, Category } from "@/types";
import ProductCard from "@/components/ProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const clearAll = () => {
    router.push("/shop");
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

  const activeFilters = [
    category && { label: categories.find(c => c.slug === category)?.name ?? category, key: "category" },
    minPrice && { label: `Min $${minPrice}`, key: "min_price" },
    maxPrice && { label: `Max $${maxPrice}`, key: "max_price" },
    inStock && { label: "In Stock", key: "in_stock" },
  ].filter(Boolean) as { label: string; key: string }[];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-[#E0E0E0] bg-[#F7F7F7]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
          <p className="text-label text-[#8C8C8C] mb-2">All Products</p>
          <h1 className="font-serif text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
            {category ? categories.find((c) => c.slug === category)?.name ?? "Shop" : "Shop"}
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Category pills */}
          <ScrollArea className="max-w-full">
            <div className="flex items-center gap-2 pb-1">
              <Button
                variant={!category ? "default" : "outline"}
                size="sm"
                className="rounded-none shrink-0"
                onClick={() => setParam("category", "")}
              >
                All
              </Button>
              {categories.map((c) => (
                <Button
                  key={c.id}
                  variant={category === c.slug ? "default" : "outline"}
                  size="sm"
                  className="rounded-none shrink-0"
                  onClick={() => setParam("category", c.slug)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="dark" className="ml-1 text-[9px] h-4 px-1.5">{activeFilters.length}</Badge>
              )}
            </Button>
            <Select value={ordering} onValueChange={(v) => setParam("ordering", v)}>
              <SelectTrigger className="w-44 rounded-none">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-created_at">Newest</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="-price">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
                <SelectItem value="-average_rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
            {products.length > 0 && (
              <span className="text-[#8C8C8C] text-sm font-light hidden md:block">
                {products.length} item{products.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-label text-[#8C8C8C]">Active:</span>
            {activeFilters.map((f) => (
              <Badge key={f.key} variant="secondary" className="gap-1 pl-2.5 pr-1.5 py-1 cursor-pointer"
                onClick={() => setParam(f.key, "")}>
                {f.label}
                <X size={10} className="ml-0.5" />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="text-xs h-6 text-[#8C8C8C]" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        )}

        {/* Filter panel */}
        {filtersOpen && (
          <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-6 mb-6">
            <div className="flex flex-wrap gap-8 items-end">
              <div className="space-y-2">
                <Label>Min Price</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setParam("min_price", e.target.value)}
                  className="w-28 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Price</Label>
                <Input
                  type="number"
                  placeholder="9999"
                  value={maxPrice}
                  onChange={(e) => setParam("max_price", e.target.value)}
                  className="w-28 rounded-none"
                />
              </div>
              <Separator orientation="vertical" className="h-10 hidden md:block" />
              <div className="space-y-2">
                <Label>Availability</Label>
                <label className="flex items-center gap-2 cursor-pointer h-10">
                  <input
                    type="checkbox"
                    checked={inStock === "true"}
                    onChange={(e) => setParam("in_stock", e.target.checked ? "true" : "")}
                    className="accent-[#1A1A1A] w-4 h-4"
                  />
                  <span className="text-sm font-light">In Stock Only</span>
                </label>
              </div>
              <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1 text-[#8C8C8C] self-end">
                <X size={12} /> Clear
              </Button>
            </div>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4]" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-3xl font-light text-[#B0B0B0] mb-3">No products found</p>
            <p className="text-[#8C8C8C] font-light mb-6">Try adjusting your filters</p>
            <Button variant="outline" className="rounded-none" onClick={clearAll}>Clear Filters</Button>
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
  return <Suspense><ShopContent /></Suspense>;
}
