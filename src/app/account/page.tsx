"use client";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";
import Link from "next/link";
import { Package, ChevronRight, LogOut } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersApi.mine(),
    enabled: !!user,
  });

  const orders: Order[] = data?.data?.results ?? data?.data ?? [];

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 bg-[#F7F4F0]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-label text-[#C9A96E] mb-2">My Account</p>
            <h1 className="font-serif text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
              {user.first_name || user.username}
            </h1>
            <p className="text-[#8A8A8A] font-light text-sm mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-2 text-label text-[#8A8A8A] hover:text-[#0A0A0A] transition-colors"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Sign Out
          </button>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { label: "My Orders", sub: `${orders.length} orders`, href: "#orders", icon: Package },
            { label: "Wishlist", sub: "Saved items", href: "/wishlist", icon: Package },
            { label: "Settings", sub: "Profile & preferences", href: "#", icon: Package },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="bg-white border border-[#E2DDD8] p-6 flex items-center justify-between group hover:border-[#C9A96E] transition-colors"
            >
              <div>
                <p className="font-medium text-sm mb-1">{item.label}</p>
                <p className="text-[#8A8A8A] text-xs font-light">{item.sub}</p>
              </div>
              <ChevronRight size={16} strokeWidth={1.5} className="text-[#E2DDD8] group-hover:text-[#C9A96E] transition-colors" />
            </Link>
          ))}
        </div>

        {/* Orders */}
        <div id="orders">
          <h2 className="font-serif text-2xl font-light mb-6" style={{ letterSpacing: "-0.01em" }}>
            Order History
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-shimmer" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-[#E2DDD8] p-12 text-center">
              <Package size={32} strokeWidth={1} className="text-[#E2DDD8] mx-auto mb-4" />
              <p className="font-serif text-xl font-light text-[#8A8A8A]">No orders yet</p>
              <Link href="/shop" className="mt-4 inline-block text-label border-b border-[#0A0A0A] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors">
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-[#E2DDD8] p-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <p className="font-medium text-sm mb-1">{order.order_number}</p>
                      <p className="text-[#8A8A8A] text-xs font-light">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-[10px] tracking-widest uppercase px-3 py-1 border ${
                          statusColors[order.status] ?? "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="font-medium text-sm">${parseFloat(order.grand_total).toLocaleString()}</p>
                    </div>
                  </div>
                  {order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#F0ECE6]">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-[#5A5A5A] font-light py-1">
                          <span>{item.product_name} × {item.quantity}</span>
                          <span>${parseFloat(item.line_total).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
