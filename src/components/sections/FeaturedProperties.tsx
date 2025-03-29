  "use client"
  import { Button } from "@/components/ui/button"
  import { ChevronRight } from "lucide-react"
  import PropertyCard from "@/components/property-card"
  import { useEffect } from "react"

  const featuredProperties = [
    {
      id: "luxury-villa-bali",
      title: "Luxury Villa with Ocean View",
      description:
        "Experience paradise in this stunning oceanfront villa with private pool and breathtaking views.",
      location: "Bali, Indonesia",
      price: 250,
      rating: 4.9,
      reviews: 128,
      images: ["/"],
      beds: 4,
      baths: 3,
      guests: 8,
      amenities: ["Pool", "Ocean View", "WiFi", "Kitchen", "Air Conditioning"],
      isSuperhost: true,
      isNewListing: false,
      discount: 0,
      availability: "High availability",
    },
    {
      id: "mountain-cabin-aspen",
      title: "Cozy Mountain Cabin",
      description:
        "Rustic yet modern cabin nestled in the mountains, perfect for a peaceful getaway in nature.",
      location: "Aspen, Colorado",
      price: 175,
      rating: 4.8,
      reviews: 96,
      images: ["/"],
      beds: 2,
      baths: 2,
      guests: 4,
      amenities: ["Fireplace", "Mountain View", "WiFi", "Kitchen", "Heating"],
      isSuperhost: false,
      isNewListing: false,
      discount: 15,
      availability: "Limited availability",
    },
    {
      id: "beachfront-apartment-cancun",
      title: "Modern Beachfront Apartment",
      description:
        "Stylish apartment with direct beach access and stunning views of the Caribbean Sea.",
      location: "Cancun, Mexico",
      price: 195,
      rating: 4.7,
      reviews: 84,
      images: ["/"],
      beds: 2,
      baths: 2,
      guests: 4,
      amenities: ["Beach Access", "Ocean View", "WiFi", "Pool", "Air Conditioning"],
      isSuperhost: true,
      isNewListing: true,
      discount: 0,
      availability: "High availability",
    },
  ]

  export default function FeaturedProperties() {
    useEffect(()=>{
      const fetchProperties = async () => {
      const res = await fetch('/api/properties');
      }
      fetchProperties();
    }, [])

    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <Button
              variant="link"
              className="text-teal-600 font-medium group px-0"
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>
    )
  }
