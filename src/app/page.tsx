import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import EditorialBanner from "@/components/home/EditorialBanner";
import TrustBar from "@/components/home/TrustBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <FeaturedCategories />
      <FeaturedProducts />
      <EditorialBanner />
      <TrustBar />
    </>
  );
}
