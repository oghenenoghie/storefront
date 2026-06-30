"use client";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";
import Link from "next/link";
import { Package, ChevronRight, LogOut, Heart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "gold" | "success" | "warning" | "destructive"> = {
  pending: "warning",
  paid: "secondary",
  processing: "secondary",
  shipped: "gold",
  delivered: "success",
  cancelled: "destructive",
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

  const initials = ((user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")) || user.username[0].toUpperCase();

  return (
    <div className="min-h-screen pt-24 bg-[#F7F4F0]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">

        {/* Profile header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <Avatar className="w-16 h-16 text-lg">
              <AvatarFallback className="bg-[#0A0A0A] text-white text-xl font-serif">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-label text-[#C9A96E] mb-1">My Account</p>
              <h1 className="font-serif text-3xl font-light" style={{ letterSpacing: "-0.02em" }}>
                {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
              </h1>
              <p className="text-[#8A8A8A] text-sm font-light">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-[#8A8A8A]"
            onClick={() => { logout(); router.push("/"); }}
          >
            <LogOut size={14} strokeWidth={1.5} />
            Sign Out
          </Button>
        </div>

        {/* Quick nav cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Orders", sub: `${orders.length} total`, href: "#orders", icon: Package },
            { label: "Wishlist", sub: "Saved items", href: "/wishlist", icon: Heart },
            { label: "Settings", sub: "Profile & preferences", href: "#", icon: Settings },
          ].map(({ label, sub, href, icon: Icon }) => (
            <Card key={label} className="rounded-none hover:border-[#C9A96E] transition-colors group cursor-pointer">
              <Link href={href}>
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-[#E2DDD8] group-hover:border-[#C9A96E] flex items-center justify-center transition-colors">
                      <Icon size={16} strokeWidth={1.5} className="text-[#8A8A8A] group-hover:text-[#C9A96E] transition-colors" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{label}</p>
                      <p className="text-[#8A8A8A] text-xs font-light">{sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} strokeWidth={1.5} className="text-[#E2DDD8] group-hover:text-[#C9A96E] transition-colors" />
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <Separator className="mb-10" />

        {/* Orders section */}
        <div id="orders">
          <h2 className="font-serif text-2xl font-light mb-6" style={{ letterSpacing: "-0.01em" }}>
            Order History
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
            </div>
          ) : orders.length === 0 ? (
            <Card className="rounded-none">
              <CardContent className="p-16 text-center">
                <Package size={36} strokeWidth={1} className="text-[#E2DDD8] mx-auto mb-4" />
                <CardTitle className="text-xl font-light text-[#8A8A8A] mb-2">No orders yet</CardTitle>
                <CardDescription className="mb-6">Your order history will appear here</CardDescription>
                <Button asChild variant="outline" className="rounded-none">
                  <Link href="/shop">Start Shopping →</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="rounded-none hover:border-[#C9A96E] transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <CardTitle className="text-base font-medium font-sans">
                          {order.order_number}
                        </CardTitle>
                        <CardDescription>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={statusVariant[order.status] ?? "outline"}>
                          {order.status}
                        </Badge>
                        <span className="font-serif text-xl font-light">
                          ${parseFloat(order.grand_total).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  {order.items.length > 0 && (
                    <>
                      <Separator />
                      <CardContent className="pt-4 space-y-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm text-[#5A5A5A] font-light">
                            <span>{item.product_name} × {item.quantity}</span>
                            <span>${parseFloat(item.line_total).toLocaleString()}</span>
                          </div>
                        ))}
                      </CardContent>
                    </>
                  )}
                  {order.tracking_events?.length > 0 && (
                    <CardContent className="pt-0">
                      <p className="text-xs text-[#C9A96E] font-medium mt-3">
                        Latest: {order.tracking_events[order.tracking_events.length - 1].message}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
