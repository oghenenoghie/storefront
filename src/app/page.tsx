import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductCarousel from "@/components/home/ProductCarousel";
import EditorialBanner from "@/components/home/EditorialBanner";
import TrustBar from "@/components/home/TrustBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <ProductCarousel />
      <EditorialBanner />
      <TrustBar />
    </>
  );
}
