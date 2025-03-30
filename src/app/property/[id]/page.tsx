"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  CalendarIcon,
  MapPin,
  Users,
  Bath,
  Wifi,
  Car,
  Utensils,
  Coffee,
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MinusIcon,
  PlusIcon,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { toast, Toaster } from "sonner"
import { cn } from "@/lib/utils"

export default function PropertyPage() {
  const { id } = useParams() // get property id from the route
  const router = useRouter()

  // State for property details fetched from API
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [globalError, setGlobalError] = useState("")

  // Booking form state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [bookingGuests, setBookingGuests] = useState(1)
  const [bookingName, setBookingName] = useState("")
  const [bookingEmail, setBookingEmail] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [priceDetails, setPriceDetails] = useState<any>(null)

  // Fetch property details from your API
  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`)
        if (!res.ok) throw new Error("Failed to fetch property")
        const data = await res.json()
        setProperty(data)
      } catch (err) {
        console.error("Error fetching property:", err)
        setGlobalError("Error fetching property data.")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProperty()
  }, [id])

  // Recalculate price details when date range changes
  useEffect(() => {
    if (!property || !date.from || !date.to) return
    const nights = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
    const basePrice = property.price * nights
    const serviceFee = basePrice * 0.12
    const cleaningFee = 50
    setPriceDetails({
      nights,
      basePrice,
      serviceFee,
      cleaningFee,
      total: basePrice + serviceFee + cleaningFee,
    })
  }, [date, property])

  // Image navigation handlers
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  // --- MOCK STRIPE PAYMENT ---
  const mockStripePayment = async (amount: number): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fakePaymentId = "pi_" + Math.random().toString(36).substr(2, 9);
        resolve(fakePaymentId);
      }, 1000);
    });
  };

  // Helper: Return true if a date is blocked in the property inventory
  const isDateBlocked = (date: Date): boolean => {
    if (!property || !property.inventory) return false;
    const tileDate = date.toISOString().slice(0, 10);
    return property.inventory.some((d: string | Date) =>
      new Date(d).toISOString().slice(0, 10) === tileDate
    );
  };

  // Handle booking submission (replace the booking API call as needed)
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError("")
    setIsBooking(true)

    if (!date.from || !date.to || !bookingName || !bookingEmail) {
      toast.error("Please fill in all required fields")
      setIsBooking(false)
      return
    }

    // Check if selected dates are available
    const selectedDates: string[] = []
    for (let d = new Date(date.from); d < date.to; d.setDate(d.getDate() + 1)) {
      selectedDates.push(d.toISOString().split("T")[0])
    }
    const blocked = property.inventory.map((d: Date) => new Date(d).toISOString().split("T")[0])
    if (selectedDates.some((d) => blocked.includes(d))) {
      toast.error("One or more selected dates are no longer available")
      setIsBooking(false)
      return
    }

    try {
      const stripePaymentId = await mockStripePayment(priceDetails?.total || 0);
      const bookingPayload = {
        propertyId: property._id,
        propertyName: property.title,
        propertyImage:
          property.images[0] && property.images[0].trim().length > 0
            ? property.images[0]
            : "/placeholder.svg",
        name: bookingName,
        email: bookingEmail,
        checkIn: date.from,
        checkOut: date.to,
        totalPrice: priceDetails?.total || 0,
        stripePaymentId,
        status: "confirmed",
      };

      const token = localStorage.getItem("token");
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Booking failed");
      }
      await res.json();

      toast.success("Booking Successful!", {
        description: "Your reservation has been confirmed.",
      })
      router.push("/")
    } catch (err: any) {
      console.error("Error during booking:", err)
      toast.error("Booking Failed", {
        description: err.message || "Please try again later",
      })
    } finally {
      setIsBooking(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">
        {globalError || "Property not found"}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Search
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Global error banner */}
        {globalError && (
          <div className="mb-6 rounded bg-red-100 text-red-700 p-4 text-center shadow">{globalError}</div>
        )}

        {/* Property Title and Actions */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-amber-500" />
                <span className="ml-1 font-medium">{property.rating}</span>
                <span className="mx-1">·</span>
                <span className="text-gray-600">{property.reviews} reviews</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Heart className="h-4 w-4" /> Save
              </Button>
            </div>
          </div>
        </div>

        {/* Property Images */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <div className="relative h-[500px]">
              <img
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>
          </div>
        </div>

        {/* Property Details & Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Host Info */}
            <div className="flex justify-between items-start mb-6 pb-6 border-b">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">
                  Hosted by {property.host.name}
                  {property.isSuperhost && <Badge className="ml-2 bg-rose-500">Superhost</Badge>}
                </h2>
                <p className="text-gray-600 mb-2">
                  {property.beds} beds · {property.baths} baths · Up to {property.guests} guests
                </p>
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Joined {property.host.joined}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-amber-500" />
                    {property.host.responseRate || 95}% response rate
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Responds in {property.host.responseTime || "an hour"}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <img
                    src={property.host.image || "/placeholder.svg"}
                    alt={property.host.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 pb-6 border-b">
              <h2 className="text-xl font-bold mb-4">About this place</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8 pb-6 border-b">
              <h2 className="text-xl font-bold mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    {(() => {
                      switch (amenity.toLowerCase()) {
                        case "wifi":
                          return <Wifi className="h-5 w-5 text-gray-600" />
                        case "parking":
                          return <Car className="h-5 w-5 text-gray-600" />
                        case "kitchen":
                          return <Utensils className="h-5 w-5 text-gray-600" />
                        case "pool":
                          return <Bath className="h-5 w-5 text-gray-600" />
                        case "coffee":
                          return <Coffee className="h-5 w-5 text-gray-600" />
                        default:
                          return (
                            <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                              {amenity[0]}
                            </div>
                          )
                      }
                    })()}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="mb-8 pb-6 border-b">
              <h2 className="text-xl font-bold mb-4">House Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-gray-600">{property.rules?.checkIn || "After 3:00 PM"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Checkout</p>
                    <p className="text-gray-600">{property.rules?.checkOut || "Before 11:00 AM"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 flex items-center justify-center rounded-full ${property.rules?.pets ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {property.rules?.pets ? "✓" : "✕"}
                  </div>
                  <div>
                    <p className="font-medium">Pets</p>
                    <p className="text-gray-600">{property.rules?.pets ? "Allowed" : "Not allowed"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 flex items-center justify-center rounded-full ${property.rules?.smoking ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {property.rules?.smoking ? "✓" : "✕"}
                  </div>
                  <div>
                    <p className="font-medium">Smoking</p>
                    <p className="text-gray-600">{property.rules?.smoking ? "Allowed" : "Not allowed"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 flex items-center justify-center rounded-full ${property.rules?.parties ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {property.rules?.parties ? "✓" : "✕"}
                  </div>
                  <div>
                    <p className="font-medium">Parties</p>
                    <p className="text-gray-600">{property.rules?.parties ? "Allowed" : "Not allowed"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {property.status && (
                  <Badge className={`mb-4 ${property.status === "Active" ? "bg-green-500" : "bg-amber-500"}`}>
                    {property.status}
                  </Badge>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-2xl font-bold">${property.price}</span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="ml-1">{property.rating}</span>
                    <span className="mx-1 text-gray-400">·</span>
                    <span className="text-gray-600 text-sm">{property.reviews} reviews</span>
                  </div>
                </div>

                {/* Booking form */}
                <form onSubmit={handleBooking}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Dates</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(date.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Select dates</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date.from}
                            selected={{
                              from: date.from,
                              to: date.to,
                            }}
                            onSelect={(range) => {
                              if (range?.from && range?.to) {
                                let isRangeBlocked = false
                                const start = new Date(range.from)
                                const end = new Date(range.to)

                                for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                                  if (isDateBlocked(new Date(d))) {
                                    isRangeBlocked = true
                                    break
                                  }
                                }

                                if (isRangeBlocked) {
                                  toast.error("Invalid Selection", {
                                    description: "Your selected range includes blocked dates",
                                  })
                                  return
                                }
                              }
                              setDate({ from: range?.from, to: range?.to })
                            }}
                            disabled={(date) => isDateBlocked(date) || date < new Date()}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Guests</label>
                      <div className="flex items-center space-x-4 mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setBookingGuests(Math.max(1, bookingGuests - 1))}
                          disabled={bookingGuests <= 1}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>
                            {bookingGuests} {bookingGuests === 1 ? "guest" : "guests"}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setBookingGuests(Math.min(property.guests, bookingGuests + 1))}
                          disabled={bookingGuests >= property.guests}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        className="mt-1"
                        placeholder="Enter your name"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        className="mt-1"
                        type="email"
                        placeholder="Enter your email"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                      />
                    </div>

                    {date.from && date.to && priceDetails && (
                      <div className="space-y-3 text-sm border-t pt-4">
                        <div className="flex justify-between">
                          <span>
                            ${property.price} x {priceDetails.nights} nights
                          </span>
                          <span>${priceDetails.basePrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cleaning fee</span>
                          <span>${priceDetails.cleaningFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service fee</span>
                          <span>${priceDetails.serviceFee}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                          <span className="font-bold">Total</span>
                          <span className="font-bold">${priceDetails.total}</span>
                        </div>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={!date.from || !date.to || isBooking}>
                      {isBooking ? "Processing..." : "Reserve"}
                    </Button>

                    <p className="text-center text-xs text-gray-500">You won't be charged yet</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}

