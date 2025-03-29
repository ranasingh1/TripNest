"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const mockBookings = [
  {
    id: "booking-1",
    propertyId: "luxury-villa-bali",
    propertyName: "Luxury Villa with Ocean View",
    guestName: "John Smith",
    checkIn: new Date(2023, 6, 15),
    checkOut: new Date(2023, 6, 20),
    status: "confirmed",
  },
  {
    id: "booking-2",
    propertyId: "mountain-cabin-aspen",
    propertyName: "Cozy Mountain Cabin",
    guestName: "Emily Johnson",
    checkIn: new Date(2023, 7, 5),
    checkOut: new Date(2023, 7, 10),
    status: "confirmed",
  },
  {
    id: "booking-3",
    propertyId: "beachfront-apartment-cancun",
    propertyName: "Modern Beachfront Apartment",
    guestName: "Michael Brown",
    checkIn: new Date(2023, 8, 12),
    checkOut: new Date(2023, 8, 18),
    status: "pending",
  },
]

const mockProperties = [
  {
    id: "luxury-villa-bali",
    title: "Luxury Villa with Ocean View",
    location: "Bali, Indonesia",
    blockedDates: [new Date(2023, 6, 10), new Date(2023, 6, 11), new Date(2023, 6, 12)],
  },
  {
    id: "mountain-cabin-aspen",
    title: "Cozy Mountain Cabin",
    location: "Aspen, Colorado",
    blockedDates: [new Date(2023, 7, 20), new Date(2023, 7, 21)],
  },
  {
    id: "beachfront-apartment-cancun",
    title: "Modern Beachfront Apartment",
    location: "Cancun, Mexico",
    blockedDates: [new Date(2023, 8, 5), new Date(2023, 8, 6)],
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [bookings, setBookings] = useState<typeof mockBookings>([])
  const [properties, setProperties] = useState<typeof mockProperties>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setBookings(mockBookings)
        setProperties(mockProperties)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }

  const getBookingForDate = (date: Date) => {
    return bookings.filter((booking) => {
      if (selectedProperty && booking.propertyId !== selectedProperty) return false

      const checkInTime = booking.checkIn.getTime()
      const checkOutTime = booking.checkOut.getTime()
      const dateTime = date.getTime()

      return dateTime >= checkInTime && dateTime <= checkOutTime
    })
  }

  const isDateBlocked = (date: Date) => {
    if (!selectedProperty) return false

    const property = properties.find((p) => p.id === selectedProperty)
    if (!property) return false

    return property.blockedDates.some((blockedDate) => isSameDay(blockedDate, date))
  }

  const getCellClass = (date: Date) => {
    const dateBookings = getBookingForDate(date)
    const blocked = isDateBlocked(date)

    if (blocked) return "bg-gray-200"
    if (dateBookings.length > 0) {
      const confirmed = dateBookings.some((b) => b.status === "confirmed")
      const pending = dateBookings.some((b) => b.status === "pending")
      if (confirmed) return "bg-green-100"
      if (pending) return "bg-yellow-100"
    }
    return "bg-white"
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold text-black">Availability Calendar</h1>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium text-lg">{format(currentDate, "MMMM yyyy")}</div>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-full md:w-64">
            <Select value={selectedProperty || ""} onValueChange={(value: any) => setSelectedProperty(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        {loading ? (
          <CardContent className="p-6">
            <Skeleton className="h-8 w-64 mb-6 bg-gray-200" />
            <div className="grid grid-cols-7 gap-4">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full bg-gray-200" />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4 mt-4">
              {[...Array(35)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full bg-gray-200" />
              ))}
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <div className="grid grid-cols-7 text-center font-medium border-b border-gray-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-2 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {getDaysInMonth().map((date, i) => {
                const dateBookings = getBookingForDate(date)
                const cellClass = getCellClass(date)

                return (
                  <div
                    key={i}
                    className={`min-h-24 p-2 border-r border-b border-gray-200 last:border-r-0 ${cellClass}`}
                  >
                    <div className="font-medium mb-1">{format(date, "d")}</div>

                    {dateBookings.length > 0 ? (
                      <div className="space-y-1">
                        {dateBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className={`text-xs p-1 rounded ${
                              booking.status === "confirmed"
                                ? "bg-green-200 text-green-800"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            <div className="font-medium truncate">{booking.propertyName}</div>
                            <div className="truncate">{booking.guestName}</div>
                          </div>
                        ))}
                      </div>
                    ) : isDateBlocked(date) ? (
                      <div className="text-xs p-1 bg-gray-300 text-gray-700 rounded">Blocked</div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </CardContent>
        )}
      </Card>

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-600 mr-2"></div>
          <span className="text-sm text-black">Confirmed Booking</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-600 mr-2"></div>
          <span className="text-sm text-black">Pending Booking</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-600 mr-2"></div>
          <span className="text-sm text-black">Blocked Date</span>
        </div>
      </div>
    </div>
  )
}
