export default function MarqueeStrip() {
  const items = [
    "Free Shipping on Orders Over $200",
    "New Season Collection Now Live",
    "Premium Quality Guaranteed",
    "Secure Checkout",
    "Easy Returns Within 30 Days",
  ];

  return (
    <div className="bg-[#C9A96E] py-3 overflow-hidden">
      <div
        className="flex gap-16 whitespace-nowrap"
        style={{
          animation: "marquee 30s linear infinite",
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-label text-[#0A0A0A] shrink-0">
            {item} <span className="mx-4 opacity-50">◆</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
