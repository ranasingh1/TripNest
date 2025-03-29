"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Check,
  X,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const mockBookings = [
  {
    id: "booking-1",
    propertyId: "luxury-villa-bali",
    propertyName: "Luxury Villa with Ocean View",
    propertyImage: "/placeholder.svg?height=300&width=500&text=Luxury Villa",
    guestName: "John Smith",
    guestEmail: "john.smith@example.com",
    checkIn: new Date(2023, 6, 15),
    checkOut: new Date(2023, 6, 20),
    totalPrice: 1250,
    status: "confirmed",
    paymentId: "pay_123456",
    createdAt: new Date(2023, 5, 10),
  },
  {
    id: "booking-2",
    propertyId: "mountain-cabin-aspen",
    propertyName: "Cozy Mountain Cabin",
    propertyImage: "/placeholder.svg?height=300&width=500&text=Mountain Cabin",
    guestName: "Emily Johnson",
    guestEmail: "emily.johnson@example.com",
    checkIn: new Date(2023, 7, 5),
    checkOut: new Date(2023, 7, 10),
    totalPrice: 875,
    status: "confirmed",
    paymentId: "pay_234567",
    createdAt: new Date(2023, 6, 1),
  },
  {
    id: "booking-3",
    propertyId: "beachfront-apartment-cancun",
    propertyName: "Modern Beachfront Apartment",
    propertyImage: "/placeholder.svg?height=300&width=500&text=Beachfront Apartment",
    guestName: "Michael Brown",
    guestEmail: "michael.brown@example.com",
    checkIn: new Date(2023, 8, 12),
    checkOut: new Date(2023, 8, 18),
    totalPrice: 1170,
    status: "pending",
    paymentId: "pay_345678",
    createdAt: new Date(2023, 7, 15),
  },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState<typeof mockBookings>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setBookings(mockBookings)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter ? booking.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold text-black">Bookings</h1>
        <div className="mt-4 md:mt-0">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            <Calendar className="mr-2 h-4 w-4" />
            Export Calendar
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter ? `Status: ${statusFilter}` : "Filter by Status"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All Bookings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("confirmed")}>
                  Confirmed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Booked On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <img
                              src={booking.propertyImage || "/placeholder.svg"}
                              alt={booking.propertyName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="font-medium">
                            {booking.propertyName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.guestName}</div>
                          <div className="text-sm text-gray-500">
                            {booking.guestEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>
                            {formatDate(booking.checkIn)} -{" "}
                            {formatDate(booking.checkOut)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          ${booking.totalPrice}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>{formatDate(booking.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-500"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter
                  ? "No bookings match your search criteria"
                  : "You don't have any bookings yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
