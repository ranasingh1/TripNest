"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  X,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editedBooking, setEditedBooking] = useState<any>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })



  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        if (!res.ok) {
          throw new Error("Failed to fetch booking details")
        }
        const data = await res.json()
        setBooking(data)

        // Initialize date range for the calendar
        if (data.checkIn && data.checkOut) {
          setDateRange({
            from: new Date(data.checkIn),
            to: new Date(data.checkOut),
          })
        }

        setEditedBooking(data)
      } catch (error: any) {
        console.error("Error fetching booking:", error)
        setError(error.message || "Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId])

  const formatDate = (date: string | Date) => {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) return "Invalid date"
    return format(parsedDate, "MMM dd, yyyy")
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock3 className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  

  if (loading && !booking) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/bookings")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="container mx-auto p-6">
      {/* Header with back button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-4 p-2" onClick={() => router.push("/dashboard/bookings")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-gray-500">Booking #{booking?._id?.substring(0, 8)}</p>
          </div>
        </div>

     
      </div>


      {/* Booking Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle>Booking Summary</CardTitle>
                {getStatusBadge(booking.status)}
              </div>
              <CardDescription>Created on {booking &&formatDate(booking?.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Property</h3>
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={booking?.propertyImage || "/placeholder.svg"}
                        alt={booking.propertyName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{booking.propertyName}</h4>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {booking.propertyLocation || "Location not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Stay Dates</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <div className="font-medium">Check-in</div>
                        <div className="text-gray-500">{formatDate(booking.checkIn)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <div className="font-medium">Check-out</div>
                        <div className="text-gray-500">{formatDate(booking.checkOut)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-gray-500">
                          {Math.ceil(
                            (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          nights
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Guest</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <div className="font-medium">{booking.name}</div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <div className="text-gray-500">{booking.email}</div>
                    </div>
                    {booking.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <div className="text-gray-500">{booking.phone}</div>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <div className="text-gray-500">{booking.guests || 1} guests</div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Special Requests</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{booking.specialRequests}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
              
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(booking.totalPrice || 0)}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md mt-4">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-700">Payment Status</span>
                  </div>
                  <Badge
                    className={
                      booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {booking.status === "confirmed" ? "Paid" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      
 
    </div>
  )
}

