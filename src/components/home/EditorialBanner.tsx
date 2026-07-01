import Link from "next/link";

export default function EditorialBanner() {
  return (
    <section className="py-20 lg:py-28 bg-[#1A1A1A]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: text */}
          <div className="bg-[#1A1A1A] border border-[#2C2C2C] p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <p className="font-brand-label text-[#8C8C8C] mb-6">The Edit</p>
              <h2
                className="font-serif text-white font-light mb-6"
                style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.05, letterSpacing: "0.01em" }}
              >
                Style Elevated
                <br />
                Beyond Trends
              </h2>
              <p className="text-[#8C8C8C] font-normal leading-relaxed text-sm mb-10 max-w-sm">
                Our curators travel the world to bring you pieces that transcend
                seasons. Each item selected for its exceptional quality,
                craftsmanship, and enduring style.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-white text-[#1A1A1A] text-label px-8 py-4 hover:bg-[#E0E0E0] transition-colors"
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
            ].map((item) => (
              <div
                key={item.title}
                className="border border-[#2C2C2C] p-8 hover:bg-[#262626] transition-colors cursor-pointer group"
              >
                <div className="w-6 h-px bg-[#8C8C8C] mb-4 group-hover:w-10 group-hover:bg-white transition-all duration-300" />
                <p className="font-serif text-lg text-white font-light mb-2">
                  {item.title}
                </p>
                <p className="text-[#6A6A6A] text-xs font-normal leading-relaxed">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
