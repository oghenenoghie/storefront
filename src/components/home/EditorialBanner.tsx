import Link from "next/link";

export default function EditorialBanner() {
  return (
    <section className="py-20 lg:py-28 bg-[#0A0A0A]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: text */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <p className="text-label text-[#C9A96E] mb-6">The Edit</p>
              <h2
                className="font-serif text-white font-light mb-6"
                style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.025em" }}
              >
                Style Elevated
                <br />
                <em className="text-[#C9A96E]">Beyond</em> Trends
              </h2>
              <p className="text-[#8A8A8A] font-light leading-relaxed text-sm mb-10 max-w-sm">
                Our curators travel the world to bring you pieces that transcend
                seasons. Each item selected for its exceptional quality,
                craftsmanship, and enduring style.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-[#C9A96E] text-[#0A0A0A] text-label px-8 py-4 hover:bg-[#E0C896] transition-colors"
              >
                Explore Collection →
              </Link>
            </div>
          </div>

          {/* Right: feature boxes */}
          <div className="grid grid-cols-2">
            {[
              { title: "Signature Pieces", sub: "Timeless essentials for every wardrobe" },
              { title: "New Season", sub: "Fresh arrivals every week" },
              { title: "Designer Picks", sub: "Curated by our style editors" },
              { title: "Exclusives", sub: "Limited edition drops" },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-[#1A1A1A] p-8 hover:bg-[#1A1A1A] transition-colors cursor-pointer group"
              >
                <div className="w-6 h-px bg-[#C9A96E] mb-4 group-hover:w-10 transition-all duration-300" />
                <p className="font-serif text-lg text-white font-light mb-2 group-hover:text-[#C9A96E] transition-colors">
                  {item.title}
                </p>
                <p className="text-[#5A5A5A] text-xs font-light leading-relaxed">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
