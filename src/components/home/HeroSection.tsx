import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end bg-[#0A0A0A] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1410] via-[#0A0A0A] to-[#0D0A08]" />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#C9A96E 1px, transparent 1px), linear-gradient(90deg, #C9A96E 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Gold accent circle */}
      <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] rounded-full bg-[#C9A96E]/5 blur-[100px]" />
      <div className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] rounded-full bg-[#C9A96E]/8 blur-[80px]" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pb-24 pt-40 w-full">
        <div className="max-w-3xl">
          <p className="text-label text-[#C9A96E] mb-8 animate-fadeUp">
            New Season Collection
          </p>
          <h1
            className="font-serif text-white mb-8"
            style={{
              fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              animationDelay: "0.1s",
            }}
          >
            Dressed for
            <br />
            <em className="not-italic text-[#C9A96E]">Every</em> Moment
          </h1>
          <p
            className="text-[#8A8A8A] text-lg font-light leading-relaxed mb-12 max-w-lg animate-fadeUp"
            style={{ animationDelay: "0.2s" }}
          >
            Discover a curated selection of premium fashion and lifestyle pieces
            crafted for the discerning individual.
          </p>
          <div className="flex flex-wrap gap-4 animate-fadeUp" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-[#C9A96E] text-[#0A0A0A] text-label px-8 py-4 hover:bg-[#E0C896] transition-colors duration-300"
            >
              Shop Now
              <span className="text-base">→</span>
            </Link>
            <Link
              href="/shop?category="
              className="inline-flex items-center gap-3 border border-[#3A3A3A] text-white text-label px-8 py-4 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors duration-300"
            >
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
              <p className="font-serif text-3xl text-white font-light">{s.value}</p>
              <p className="text-label text-[#5A5A5A] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-12 flex flex-col items-center gap-3 text-[#5A5A5A]">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#C9A96E]" />
        <p className="text-label" style={{ writingMode: "vertical-rl", letterSpacing: "0.2em" }}>
          Scroll
        </p>
      </div>
    </section>
  );
}
