// "use client"

// import type React from "react"

// import { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import {
//   CalendarIcon,
//   MapPin,
//   Users,
//   Bath,
//   Wifi,
//   Car,
//   Utensils,
//   Coffee,
//   Star,
//   ChevronLeft,
//   ChevronRight,
//   Heart,
//   Share2,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"

// // Mock data for the property
// const getPropertyData = (id: string) => {
//   const properties = [
//     {
//       id: "luxury-villa-bali",
//       title: "Luxury Villa with Ocean View",
//       description:
//         "Experience paradise in this stunning oceanfront villa with private pool and breathtaking views. This spacious property features 4 bedrooms, 3 bathrooms, a fully equipped kitchen, and a large outdoor area perfect for entertaining. Located just minutes from the beach, restaurants, and shopping.",
//       location: "Bali, Indonesia",
//       price: 250,
//       rating: 4.9,
//       reviews: 128,
//       images: [
//         "/placeholder.svg?height=600&width=800&text=Luxury Villa - Main",
//         "/placeholder.svg?height=600&width=800&text=Luxury Villa - Pool",
//         "/placeholder.svg?height=600&width=800&text=Luxury Villa - Bedroom",
//         "/placeholder.svg?height=600&width=800&text=Luxury Villa - Kitchen",
//         "/placeholder.svg?height=600&width=800&text=Luxury Villa - View",
//       ],
//       beds: 4,
//       baths: 3,
//       guests: 8,
//       amenities: ["Pool", "Ocean View", "WiFi", "Kitchen", "Air Conditioning", "Beach Access", "Parking", "BBQ Grill"],
//       isSuperhost: true,
//       isNewListing: false,
//       discount: 0,
//       availability: "High availability",
//       host: {
//         name: "Michael Chen",
//         image: "/placeholder.svg?height=100&width=100&text=MC",
//         responseRate: 98,
//         responseTime: "within an hour",
//         joined: "January 2018",
//       },
//       rules: {
//         checkIn: "3:00 PM",
//         checkOut: "11:00 AM",
//         pets: false,
//         smoking: false,
//         parties: false,
//       },
//       location_details: {
//         address: "Jalan Pantai Balangan, Bali, Indonesia",
//         coordinates: { lat: -8.7915, lng: 115.1219 },
//       },
//     },
//     {
//       id: "mountain-cabin-aspen",
//       title: "Cozy Mountain Cabin",
//       description:
//         "Rustic yet modern cabin nestled in the mountains, perfect for a peaceful getaway in nature. This beautiful cabin features 2 bedrooms, 2 bathrooms, a wood-burning fireplace, and stunning mountain views from every window. Enjoy hiking, skiing, and other outdoor activities just minutes away.",
//       location: "Aspen, Colorado",
//       price: 175,
//       rating: 4.8,
//       reviews: 96,
//       images: [
//         "/placeholder.svg?height=600&width=800&text=Mountain Cabin - Main",
//         "/placeholder.svg?height=600&width=800&text=Mountain Cabin - Interior",
//         "/placeholder.svg?height=600&width=800&text=Mountain Cabin - Bedroom",
//         "/placeholder.svg?height=600&width=800&text=Mountain Cabin - View",
//       ],
//       beds: 2,
//       baths: 2,
//       guests: 4,
//       amenities: ["Fireplace", "Mountain View", "WiFi", "Kitchen", "Heating", "Parking", "Hot Tub", "Ski-in/Ski-out"],
//       isSuperhost: false,
//       isNewListing: false,
//       discount: 15,
//       availability: "Limited availability",
//       host: {
//         name: "Sarah Johnson",
//         image: "/placeholder.svg?height=100&width=100&text=SJ",
//         responseRate: 95,
//         responseTime: "within a day",
//         joined: "March 2019",
//       },
//       rules: {
//         checkIn: "4:00 PM",
//         checkOut: "10:00 AM",
//         pets: true,
//         smoking: false,
//         parties: false,
//       },
//       location_details: {
//         address: "123 Mountain Road, Aspen, CO, USA",
//         coordinates: { lat: 39.1911, lng: -106.8175 },
//       },
//     },
//     {
//       id: "beachfront-apartment-cancun",
//       title: "Modern Beachfront Apartment",
//       description:
//         "Stylish apartment with direct beach access and stunning views of the Caribbean Sea. This modern apartment features 2 bedrooms, 2 bathrooms, a fully equipped kitchen, and a spacious balcony overlooking the ocean. Located in a secure complex with pool, gym, and 24-hour security.",
//       location: "Cancun, Mexico",
//       price: 195,
//       rating: 4.7,
//       reviews: 84,
//       images: [
//         "/placeholder.svg?height=600&width=800&text=Beachfront Apartment - Main",
//         "/placeholder.svg?height=600&width=800&text=Beachfront Apartment - Living",
//         "/placeholder.svg?height=600&width=800&text=Beachfront Apartment - Bedroom",
//         "/placeholder.svg?height=600&width=800&text=Beachfront Apartment - View",
//         "/placeholder.svg?height=600&width=800&text=Beachfront Apartment - Beach",
//       ],
//       beds: 2,
//       baths: 2,
//       guests: 4,
//       amenities: ["Beach Access", "Ocean View", "WiFi", "Pool", "Air Conditioning", "Gym", "Security", "Balcony"],
//       isSuperhost: true,
//       isNewListing: true,
//       discount: 0,
//       availability: "High availability",
//       host: {
//         name: "Carlos Rodriguez",
//         image: "/placeholder.svg?height=100&width=100&text=CR",
//         responseRate: 99,
//         responseTime: "within an hour",
//         joined: "June 2020",
//       },
//       rules: {
//         checkIn: "3:00 PM",
//         checkOut: "12:00 PM",
//         pets: false,
//         smoking: false,
//         parties: false,
//       },
//       location_details: {
//         address: "Zona Hotelera, Cancun, Quintana Roo, Mexico",
//         coordinates: { lat: 21.1619, lng: -86.8515 },
//       },
//     },
//   ]

//   return properties.find((property) => property.id === id) || properties[0]
// }

// export default function PropertyPage({ params }: { params: { id: string } }) {
//   const property = getPropertyData(params.id)
//   const [currentImageIndex, setCurrentImageIndex] = useState(0)
//   const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
//     from: undefined,
//     to: undefined,
//   })
//   const [guests, setGuests] = useState(1)
//   const [isBooking, setIsBooking] = useState(false)
//   const router = useRouter()

//   // Calculate total price
//   const calculateTotalPrice = () => {
//     if (!date.from || !date.to) return 0

//     const nights = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
//     const basePrice = property.price * nights
//     const serviceFee = basePrice * 0.12
//     const cleaningFee = 50

//     return {
//       basePrice,
//       nights,
//       serviceFee,
//       cleaningFee,
//       total: basePrice + serviceFee + cleaningFee,
//     }
//   }

//   const priceDetails = calculateTotalPrice()

//   // Handle image navigation
//   const nextImage = () => {
//     setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
//   }

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
//   }

//   // Handle booking
//   const handleBooking = (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsBooking(true)
//     // In a real app, this would submit to an API
//     setTimeout(() => {
//       alert("Booking successful! You'll receive a confirmation email shortly.")
//       router.push("/")
//     }, 1500)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header with back button */}
//       <header className="bg-white border-b sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-4 flex items-center">
//           <Link href="/" className="flex items-center text-gray-600 hover:text-teal-600 transition-colors">
//             <ChevronLeft className="h-5 w-5 mr-1" />
//             Back to Search
//           </Link>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         {/* Property Title and Actions */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center">
//                 <Star className="h-5 w-5 text-amber-500 fill-current" />
//                 <span className="ml-1 font-medium">{property.rating}</span>
//                 <span className="mx-1">·</span>
//                 <span className="text-gray-600">{property.reviews} reviews</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <MapPin className="h-4 w-4 mr-1" />
//                 {property.location}
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" className="flex items-center gap-1">
//                 <Share2 className="h-4 w-4" /> Share
//               </Button>
//               <Button variant="outline" size="sm" className="flex items-center gap-1">
//                 <Heart className="h-4 w-4" /> Save
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Property Images */}
//         <div className="relative mb-8 rounded-xl overflow-hidden">
//           <div className="relative h-[500px]">
//             <Image
//               src={property.images[currentImageIndex] || "/placeholder.svg"}
//               alt={`${property.title} - Image ${currentImageIndex + 1}`}
//               fill
//               className="object-cover"
//             />
//             <Button
//               variant="outline"
//               size="icon"
//               className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
//               onClick={prevImage}
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//             <Button
//               variant="outline"
//               size="icon"
//               className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
//               onClick={nextImage}
//             >
//               <ChevronRight className="h-5 w-5" />
//             </Button>
//             <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
//               {currentImageIndex + 1} / {property.images.length}
//             </div>
//           </div>
//         </div>

//         {/* Property Details and Booking */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Property Details */}
//           <div className="lg:col-span-2">
//             {/* Host Info */}
//             <div className="flex justify-between items-start mb-6 pb-6 border-b">
//               <div>
//                 <h2 className="text-xl font-bold mb-1">
//                   Hosted by {property.host.name}
//                   {property.isSuperhost && <Badge className="ml-2 bg-rose-500">Superhost</Badge>}
//                 </h2>
//                 <p className="text-gray-600">
//                   {property.beds} beds · {property.baths} baths · Up to {property.guests} guests
//                 </p>
//               </div>
//               <div className="flex-shrink-0">
//                 <div className="relative h-14 w-14 rounded-full overflow-hidden">
//                   <Image
//                     src={property.host.image || "/placeholder.svg"}
//                     alt={property.host.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Property Description */}
//             <div className="mb-8 pb-6 border-b">
//               <h2 className="text-xl font-bold mb-4">About this place</h2>
//               <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
//             </div>

//             {/* Amenities */}
//             <div className="mb-8 pb-6 border-b">
//               <h2 className="text-xl font-bold mb-4">What this place offers</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {property.amenities.map((amenity, index) => (
//                   <div key={index} className="flex items-center gap-3">
//                     {(() => {
//                       switch (amenity.toLowerCase()) {
//                         case "wifi":
//                           return <Wifi className="h-5 w-5 text-gray-600" />
//                         case "parking":
//                           return <Car className="h-5 w-5 text-gray-600" />
//                         case "kitchen":
//                           return <Utensils className="h-5 w-5 text-gray-600" />
//                         case "pool":
//                           return <Bath className="h-5 w-5 text-gray-600" />
//                         case "coffee":
//                           return <Coffee className="h-5 w-5 text-gray-600" />
//                         default:
//                           return (
//                             <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
//                               {amenity[0]}
//                             </div>
//                           )
//                       }
//                     })()}
//                     <span>{amenity}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* House Rules */}
//             <div className="mb-8 pb-6 border-b">
//               <h2 className="text-xl font-bold mb-4">House rules</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex items-center gap-3">
//                   <CalendarIcon className="h-5 w-5 text-gray-600" />
//                   <div>
//                     <p className="font-medium">Check-in</p>
//                     <p className="text-gray-600">{property.rules.checkIn}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <CalendarIcon className="h-5 w-5 text-gray-600" />
//                   <div>
//                     <p className="font-medium">Check-out</p>
//                     <p className="text-gray-600">{property.rules.checkOut}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Users className="h-5 w-5 text-gray-600" />
//                   <div>
//                     <p className="font-medium">Pets</p>
//                     <p className="text-gray-600">{property.rules.pets ? "Allowed" : "Not allowed"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">S</div>
//                   <div>
//                     <p className="font-medium">Smoking</p>
//                     <p className="text-gray-600">{property.rules.smoking ? "Allowed" : "Not allowed"}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Reviews */}
//             <div className="mb-8">
//               <div className="flex items-center mb-4">
//                 <Star className="h-5 w-5 text-amber-500 fill-current" />
//                 <span className="ml-1 font-medium">{property.rating}</span>
//                 <span className="mx-1">·</span>
//                 <span className="text-gray-600">{property.reviews} reviews</span>
//               </div>

//               {/* Sample Reviews */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {[
//                   {
//                     name: "Emma Wilson",
//                     date: "August 2023",
//                     text: "Amazing place! The views are incredible and the host was very responsive. Would definitely stay here again.",
//                     avatar: "/placeholder.svg?height=50&width=50&text=EW",
//                   },
//                   {
//                     name: "David Thompson",
//                     date: "July 2023",
//                     text: "Perfect location and beautiful property. Everything was clean and well-maintained. Highly recommend!",
//                     avatar: "/placeholder.svg?height=50&width=50&text=DT",
//                   },
//                 ].map((review, index) => (
//                   <div key={index} className="border rounded-lg p-4">
//                     <div className="flex items-center mb-3">
//                       <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
//                         <Image
//                           src={review.avatar || "/placeholder.svg"}
//                           alt={review.name}
//                           fill
//                           className="object-cover"
//                         />
//                       </div>
//                       <div>
//                         <p className="font-medium">{review.name}</p>
//                         <p className="text-sm text-gray-500">{review.date}</p>
//                       </div>
//                     </div>
//                     <p className="text-gray-700">{review.text}</p>
//                   </div>
//                 ))}
//               </div>

//               <Button variant="outline" className="mt-4">
//                 Show all {property.reviews} reviews
//               </Button>
//             </div>
//           </div>

//           {/* Right Column - Booking Card */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-24">
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-start mb-6">
//                   <div>
//                     <span className="text-2xl font-bold">${property.price}</span>
//                     <span className="text-gray-600"> / night</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Star className="h-4 w-4 text-amber-500 fill-current" />
//                     <span className="ml-1">{property.rating}</span>
//                     <span className="mx-1 text-gray-400">·</span>
//                     <span className="text-gray-600 text-sm">{property.reviews} reviews</span>
//                   </div>
//                 </div>

//                 <form onSubmit={handleBooking}>
//                   <div className="border rounded-lg overflow-hidden mb-4">
//                     <div className="grid grid-cols-1 divide-y">
//                       <div className="p-4">
//                         <div className="text-sm font-medium mb-1">Dates</div>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button variant="outline" className="w-full justify-start text-left font-normal">
//                               <CalendarIcon className="mr-2 h-4 w-4" />
//                               {date.from ? (
//                                 date.to ? (
//                                   <>
//                                     {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
//                                   </>
//                                 ) : (
//                                   format(date.from, "MMM d, yyyy")
//                                 )
//                               ) : (
//                                 <span>Select dates</span>
//                               )}
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0" align="start">
//                             <Calendar
//                               initialFocus
//                               mode="range"
//                               defaultMonth={new Date()}
//                               selected={date}
//                               onSelect={setDate}
//                               numberOfMonths={2}
//                             />
//                           </PopoverContent>
//                         </Popover>
//                       </div>
//                       <div className="p-4">
//                         <div className="text-sm font-medium mb-1">Guests</div>
//                         <div className="flex items-center">
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="icon"
//                             className="h-8 w-8"
//                             onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
//                           >
//                             -
//                           </Button>
//                           <span className="mx-4">
//                             {guests} {guests === 1 ? "guest" : "guests"}
//                           </span>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="icon"
//                             className="h-8 w-8"
//                             onClick={() => setGuests((prev) => Math.min(property.guests, prev + 1))}
//                           >
//                             +
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full bg-teal-600 hover:bg-teal-700 mb-4"
//                     disabled={!date.from || !date.to || isBooking}
//                   >
//                     {isBooking ? "Processing..." : "Reserve"}
//                   </Button>

//                   {date.from && date.to && (
//                     <div className="space-y-3 text-sm">
//                       <div className="flex justify-between">
//                         <span>
//                           ${property.price} x {priceDetails.nights} nights
//                         </span>
//                         <span>${priceDetails.basePrice}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Cleaning fee</span>
//                         <span>${priceDetails.cleaningFee}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Service fee</span>
//                         <span>${priceDetails.serviceFee}</span>
//                       </div>
//                       <div className="flex justify-between border-t pt-3 mt-3">
//                         <span className="font-bold">Total</span>
//                         <span className="font-bold">${priceDetails.total}</span>
//                       </div>
//                     </div>
//                   )}

//                   <p className="text-center text-xs text-gray-500 mt-4">You won't be charged yet</p>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

