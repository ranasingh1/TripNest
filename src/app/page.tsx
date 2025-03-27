import Header from "@/components/layout/Header"
import HeroSection from "@/components/sections/HeroSection"
import PopularDestinations from "@/components/sections/PopularDestinations"
import PropertyTypes from "@/components/sections/PropertyTypes"
import FeaturedProperties from "@/components/sections/FeaturedProperties"
import SpecialDeals from "@/components/sections/SpecialDeals"
import Testimonials from "@/components/sections/Testimonials"
import NewsletterSignup from "@/components/sections/NewsletterSignup"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PopularDestinations />
        <PropertyTypes />
        <FeaturedProperties />
        <SpecialDeals />
        <Testimonials />
        <NewsletterSignup />
      </main>
    </div>
  )
}
