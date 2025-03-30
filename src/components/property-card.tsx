import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Users, Bed, Bath, Heart, Calendar, Wifi, Car, Utensils, Coffee } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface PropertyCardProps {
  property: {
    _id: string
    title: string
    description: string
    location: string
    price: number
    rating: number
    reviews: number
    images: string[]
    beds: number
    baths: number
    guests: number
    amenities: string[]
    isSuperhost?: boolean
    isNewListing?: boolean
    discount?: number
    availability?: string
  }
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const {
    _id,
    title,
    description,
    location,
    price,
    rating,
    reviews,
    images,
    beds,
    baths,
    guests,
    amenities,
    isSuperhost,
    isNewListing,
    discount,
    availability,
  } = property

  // Function to render amenity icon
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "kitchen":
        return <Utensils className="h-4 w-4" />
      case "pool":
        return <Bath className="h-4 w-4" />
      case "coffee":
        return <Coffee className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {/* Property Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors">
            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
          </button>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isSuperhost && <Badge className="bg-white text-teal-600 hover:bg-white">Superhost</Badge>}
            {isNewListing && <Badge className="bg-teal-600 hover:bg-teal-700">New</Badge>}
            {(discount ?? 0) > 0 && <Badge className="bg-red-500 hover:bg-red-600">{discount}% OFF</Badge>}
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center">
              <div className="flex items-center text-amber-400 mr-2">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-medium">{rating}</span>
              </div>
              <span className="text-sm">({reviews} reviews)</span>
            </div>
            <div className="text-lg font-bold">
              ${price}
              <span className="text-sm font-normal">/night</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-5 flex-grow flex flex-col">
        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1 text-teal-600" /> {location}
        </div>

        {/* Title */}
        <Link href={`/property/${_id}`} className="group-hover:text-teal-600 transition-colors">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" /> {beds} {beds === 1 ? "bed" : "beds"}
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" /> {baths} {baths === 1 ? "bath" : "baths"}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" /> {guests} {guests === 1 ? "guest" : "guests"}
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.slice(0, 4).map((amenity, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
              {getAmenityIcon(amenity)}
              {amenity}
            </Badge>
          ))}
          {amenities.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{amenities.length - 4} more
            </Badge>
          )}
        </div>

        {/* Availability */}
        {availability && (
          <div className="flex items-center text-sm mb-4">
            <Calendar className="h-4 w-4 mr-1 text-teal-600" />
            <span className={`${availability.includes("High") ? "text-green-600" : "text-amber-600"}`}>
              {availability}
            </span>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-auto pt-4">
          <Link href={`/property/${property._id}`} className="w-full">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default PropertyCard

