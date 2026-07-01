"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

function AppInit() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const fetchCart = useCartStore((s) => s.fetchCart);
  useEffect(() => {
    fetchMe().then(() => {
      const token = localStorage.getItem("access_token");
      if (token) fetchCart();
    });
  }, [fetchMe, fetchCart]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => queryClient);
  return (
    <QueryClientProvider client={client}>
      <AppInit />
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.875rem",
            letterSpacing: "0.02em",
            borderRadius: "0",
            border: "1px solid #E0E0E0",
            background: "#FFFFFF",
            color: "#1A1A1A",
          },
          success: { iconTheme: { primary: "#1A1A1A", secondary: "#FFFFFF" } },
        }}
      />
    </QueryClientProvider>
  );
}
