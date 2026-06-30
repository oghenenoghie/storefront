"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, User, Heart, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import SearchModal from "@/components/SearchModal";
import CartDrawer from "@/components/CartDrawer";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/shop?category=" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { cart } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const itemCount = cart?.items?.reduce((n, i) => n + i.quantity, 0) ?? 0;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#E2DDD8] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl font-light tracking-[0.12em] uppercase"
          >
            Oghie
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-label transition-colors hover:text-[#C9A96E] ${
                  pathname === l.href ? "text-[#C9A96E]" : "text-[#0A0A0A]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 flex items-center justify-center hover:text-[#C9A96E] transition-colors"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            {user ? (
              <Link
                href="/account"
                className="w-8 h-8 flex items-center justify-center hover:text-[#C9A96E] transition-colors"
                aria-label="Account"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-8 h-8 flex items-center justify-center hover:text-[#C9A96E] transition-colors"
                aria-label="Sign in"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
            )}
            {user && (
              <Link
                href="/wishlist"
                className="w-8 h-8 flex items-center justify-center hover:text-[#C9A96E] transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.5} />
              </Link>
            )}
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-8 h-8 flex items-center justify-center hover:text-[#C9A96E] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A96E] text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-500 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-[#E2DDD8]">
          <Link href="/" className="font-serif text-2xl tracking-[0.12em] uppercase" onClick={() => setMobileOpen(false)}>
            Oghie
          </Link>
          <button onClick={() => setMobileOpen(false)}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="p-10 flex flex-col gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-3xl font-light hover:text-[#C9A96E] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-8 pt-8 border-t border-[#E2DDD8] flex flex-col gap-4">
            <Link href={user ? "/account" : "/login"} onClick={() => setMobileOpen(false)} className="text-label">
              {user ? "My Account" : "Sign In"}
            </Link>
            {user && (
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="text-label">
                Wishlist
              </Link>
            )}
          </div>
        </nav>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
