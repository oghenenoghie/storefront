import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#1A1A1A] py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <p className="font-brand-label mb-4">Our Story</p>
          <h1
            className="font-serif text-white font-light"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", letterSpacing: "0.01em", lineHeight: 1.05 }}
          >
            Curated for the
            <br />
            Discerning Individual
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-3xl font-light mb-6" style={{ letterSpacing: "-0.02em" }}>
              Who We Are
            </h2>
            <div className="space-y-4 text-[#5A5A5A] font-light leading-relaxed">
              <p>
                Oghie Store was founded with a singular vision: to bring exceptional
                fashion and lifestyle pieces to those who appreciate the finer things.
                We believe that true luxury lies not in excess, but in the perfect
                balance of quality, design, and purpose.
              </p>
              <p>
                Each product in our collection is carefully curated by our team of
                style experts who travel the world to discover pieces that combine
                exceptional craftsmanship with enduring aesthetic appeal.
              </p>
              <p>
                We partner with artisans and designers who share our commitment to
                sustainability, ethical production, and timeless quality — ensuring
                that every purchase supports a better future for fashion.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            {[
              { n: "500+", label: "Premium Products" },
              { n: "50+", label: "Brand Partners" },
              { n: "10,000+", label: "Satisfied Clients" },
              { n: "30+", label: "Countries Shipped To" },
            ].map((s) => (
              <div key={s.n} className="flex items-center gap-6 border-b border-[#E0E0E0] pb-6">
                <p className="font-serif text-4xl text-[#1A1A1A] font-light w-28 shrink-0">{s.n}</p>
                <p className="text-[#5A5A5A] font-light">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mt-20 pt-20 border-t border-[#E0E0E0]">
          <p className="text-label text-[#8C8C8C] mb-3 text-center">What Drives Us</p>
          <h2 className="font-serif text-3xl font-light text-center mb-12" style={{ letterSpacing: "-0.02em" }}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Uncompromising Quality",
                text: "Every item in our collection meets our strict standards for materials, construction, and longevity.",
              },
              {
                title: "Ethical Sourcing",
                text: "We work exclusively with partners who maintain fair labour practices and sustainable production methods.",
              },
              {
                title: "Timeless Design",
                text: "We curate pieces that transcend trends — items you will cherish for years, not just a single season.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-[#F7F7F7] p-8">
                <div className="w-8 h-px bg-[#1A1A1A] mb-5" />
                <h3 className="font-serif text-xl font-light mb-3">{v.title}</h3>
                <p className="text-[#5A5A5A] font-light text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white text-label px-10 py-4 hover:bg-[#333333] transition-colors duration-300"
          >
            Explore Our Collection →
          </Link>
        </div>
      </div>
    </div>
  );
}
