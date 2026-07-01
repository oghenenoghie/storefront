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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const itemCount = cart?.items?.reduce((n, i) => n + i.quantity, 0) ?? 0;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <div className="announcement-bar">
        Free Shipping on Orders Over $200 · New Season Collection Now Live
      </div>

      <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-16 h-[60px] grid grid-cols-3 items-center">
          {/* Left: mobile menu trigger + desktop nav */}
          <div className="flex items-center gap-8">
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-[0.75rem] tracking-[0.05em] uppercase transition-colors hover:text-[#1A1A1A] ${
                    pathname === l.href ? "text-[#1A1A1A] underline underline-offset-4" : "text-[#8C8C8C]"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <Link
            href="/"
            className="justify-self-center font-serif text-lg font-light tracking-[0.3em] uppercase text-[#1A1A1A]"
          >
            Oghie
          </Link>

          {/* Right: icons */}
          <div className="flex items-center justify-end gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 hidden sm:flex items-center justify-center hover:text-[#8C8C8C] transition-colors"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            {user ? (
              <Link
                href="/account"
                className="w-8 h-8 flex items-center justify-center hover:text-[#8C8C8C] transition-colors"
                aria-label="Account"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-8 h-8 flex items-center justify-center hover:text-[#8C8C8C] transition-colors"
                aria-label="Sign in"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
            )}
            {user && (
              <Link
                href="/wishlist"
                className="w-8 h-8 hidden sm:flex items-center justify-center hover:text-[#8C8C8C] transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.5} />
              </Link>
            )}
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-8 h-8 flex items-center justify-center hover:text-[#8C8C8C] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1A1A1A] text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-500 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-[#E0E0E0]">
          <Link href="/" className="font-serif text-lg tracking-[0.3em] uppercase" onClick={() => setMobileOpen(false)}>
            Oghie
          </Link>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="p-10 flex flex-col gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-3xl font-light hover:text-[#8C8C8C] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-8 pt-8 border-t border-[#E0E0E0] flex flex-col gap-4">
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
