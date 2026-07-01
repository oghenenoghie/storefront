import { Truck, RotateCcw, ShieldCheck, CreditCard } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", sub: "On orders over $200" },
  { icon: RotateCcw, title: "Easy Returns", sub: "30-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", sub: "SSL encrypted checkout" },
  { icon: CreditCard, title: "Buy Now, Pay Later", sub: "Flexible payment options" },
];

export default function TrustBar() {
  return (
    <section className="border-t border-[#E0E0E0]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#E0E0E0]">
          {features.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="py-10 px-8 flex items-center gap-4 group">
              <div className="w-10 h-10 border border-[#E0E0E0] flex items-center justify-center group-hover:border-[#1A1A1A] transition-colors shrink-0">
                <Icon size={16} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-[#8C8C8C] text-xs font-normal mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
