import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex items-end bg-[#F7F7F7] overflow-hidden min-h-[80vh]">
      {/* Subtle grid, monochrome */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-16 pb-20 pt-32 w-full">
        <div className="max-w-3xl">
          <p className="font-brand-label mb-8 animate-fadeUp">New Season Collection</p>
          <h1
            className="font-serif text-[#1A1A1A] mb-8 font-light"
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              lineHeight: 1.05,
              letterSpacing: "0.01em",
              animationDelay: "0.1s",
            }}
          >
            Dressed for
            <br />
            Every Moment
          </h1>
          <p
            className="text-[#8C8C8C] text-lg font-normal leading-relaxed mb-12 max-w-lg animate-fadeUp"
            style={{ animationDelay: "0.2s" }}
          >
            Discover a curated selection of premium fashion and lifestyle pieces
            crafted for the discerning individual.
          </p>
          <div className="flex flex-wrap gap-4 animate-fadeUp" style={{ animationDelay: "0.3s" }}>
            <Link href="/shop" className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white text-label px-8 py-4 hover:bg-[#333333] transition-colors duration-300">
              Shop Now
              <span className="text-base">→</span>
            </Link>
            <Link href="/shop?category=" className="inline-flex items-center gap-3 border border-[#1A1A1A] text-[#1A1A1A] text-label px-8 py-4 hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300">
              View Collections
            </Link>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-20 flex flex-wrap gap-12">
          {[
            { value: "500+", label: "Premium Products" },
            { value: "50+", label: "Luxury Brands" },
            { value: "10K+", label: "Happy Clients" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-serif text-3xl text-[#1A1A1A] font-light">{s.value}</p>
              <p className="font-brand-label mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 lg:right-16 hidden md:flex flex-col items-center gap-3 text-[#8C8C8C]">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#1A1A1A]" />
        <p className="text-label" style={{ writingMode: "vertical-rl", letterSpacing: "0.2em" }}>
          Scroll
        </p>
      </div>
    </section>
  );
}
