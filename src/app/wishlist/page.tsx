"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { WishlistItem } from "@/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Heart } from "lucide-react";
import ErrorState from "@/components/ErrorState";

export default function WishlistPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => productsApi.wishlist(),
    enabled: !!user,
  });

  const wishlist: WishlistItem[] = data?.data?.results ?? data?.data ?? [];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <p className="text-label text-[#8C8C8C] mb-3">Saved Items</p>
        <h1 className="font-serif text-4xl font-light mb-12" style={{ letterSpacing: "-0.02em" }}>
          Wishlist
        </h1>

        {isError ? (
          <ErrorState message="Couldn't load your wishlist." onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] animate-shimmer mb-4" />
                <div className="h-4 animate-shimmer mb-2" />
                <div className="h-3 animate-shimmer w-1/3" />
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={40} strokeWidth={1} className="text-[#E0E0E0] mx-auto mb-4" />
            <p className="font-serif text-2xl font-light text-[#8C8C8C] mb-3">Your wishlist is empty</p>
            <Link href="/shop" className="text-label border-b border-[#1A1A1A] hover:opacity-60 transition-opacity">
              Explore Products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {wishlist.map((item) => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
