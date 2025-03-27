import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const destinations = [
  { name: "Bali, Indonesia", properties: 1243 },
  { name: "Santorini, Greece", properties: 876 },
  { name: "Tulum, Mexico", properties: 654 },
  { name: "Kyoto, Japan", properties: 932 }
]

export default function PopularDestinations() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Heading + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Popular Destinations
          </h2>
          <Button variant="link" className="text-teal-600 font-medium group">
            View all{" "}
            <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Link
              href="#"
              key={index}
              className="group rounded-lg overflow-hidden relative block h-64"
            >
              <Image
                src={"/"}
                alt={destination.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-lg font-semibold">{destination.name}</h3>
                <p className="text-sm text-white/80">
                  {destination.properties} properties
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
