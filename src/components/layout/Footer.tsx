import Link from "next/link";
import { Globe, Send, Rss } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-3xl tracking-[0.12em] uppercase text-white">
              Oghie
            </Link>
            <p className="mt-4 text-[#8A8A8A] text-sm font-light leading-relaxed">
              Curated luxury fashion and lifestyle for the discerning individual.
            </p>
            <div className="flex gap-4 mt-6">
              {[Globe, Send, Rss].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 border border-[#2C2C2C] flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
                >
                  <Icon size={14} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-label text-[#8A8A8A] mb-5">Shop</p>
            <ul className="space-y-3">
              {["New Arrivals", "All Products", "Categories", "Sale"].map((l) => (
                <li key={l}>
                  <Link href="/shop" className="text-sm text-[#8A8A8A] hover:text-[#C9A96E] transition-colors font-light">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-label text-[#8A8A8A] mb-5">Account</p>
            <ul className="space-y-3">
              {[
                { label: "Sign In", href: "/login" },
                { label: "My Orders", href: "/account/orders" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Profile", href: "/account" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-[#8A8A8A] hover:text-[#C9A96E] transition-colors font-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-label text-[#8A8A8A] mb-5">Contact</p>
            <ul className="space-y-3 text-sm text-[#8A8A8A] font-light">
              <li>hello@oghiestore.com</li>
              <li>Mon – Fri, 9am – 6pm</li>
              <li className="mt-6">
                <p className="text-label text-[#8A8A8A] mb-3">Newsletter</p>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 bg-[#1A1A1A] border border-[#2C2C2C] px-4 py-2 text-sm text-white placeholder:text-[#5A5A5A] focus:outline-none focus:border-[#C9A96E] transition-colors"
                  />
                  <button className="bg-[#C9A96E] px-4 text-[#0A0A0A] text-label hover:bg-[#E0C896] transition-colors">
                    →
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1A1A1A] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#5A5A5A] text-xs font-light tracking-wide">
            © 2024 Oghie Store. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
              <a key={t} href="#" className="text-[#5A5A5A] text-xs hover:text-[#C9A96E] transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
