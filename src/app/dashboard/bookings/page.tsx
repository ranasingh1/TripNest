"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import {
  Calendar,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Check,
  X,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, Toaster } from "sonner"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // State for modals
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [newStatus, setNewStatus] = useState<string>("")


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings",{
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!res.ok) {
          throw new Error("Error fetching bookings")
        }
        const data = await res.json()
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Filter bookings using booking.name, booking.email, and propertyName
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.propertyName?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter ? booking.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
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
            <Check className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
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

  // Open edit dialog
  const openEditDialog = (booking: any) => {
    setSelectedBooking(booking)
    setNewStatus(booking.status)
    setEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (booking: any) => {
    setSelectedBooking(booking)
    setDeleteDialogOpen(true)
  }

  const handleUpdateBooking = async () => {
    if (!selectedBooking || !newStatus) return

    try {
      setLoading(true)
      const res = await fetch(`/api/bookings/${selectedBooking._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error("Failed to update booking")
      }

      const updatedBooking = await res.json()

      setBookings((prev) => prev.map((b) => (b._id === updatedBooking._id ? updatedBooking : b)))

      toast.success("Booking updated successfully", {
        description: `Status changed to ${newStatus}`,
      })

      setEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating booking:", error)
      toast.error("Failed to update booking", {
        description: "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete booking and update property accordingly
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return

    try {
      setLoading(true)
      const res = await fetch(`/api/bookings/${selectedBooking._id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to delete booking")
      }

      // Remove the booking from local state
      setBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id))

      toast.success("Booking deleted successfully", {
        description: `Booking for ${selectedBooking.propertyName} has been removed`,
      })

      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting booking:", error)
      toast.error("Failed to delete booking", {
        description: "Please try again later",
      })
    } finally {
      setLoading(false)
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
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Bookings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("confirmed")}>Confirmed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>Cancelled</DropdownMenuItem>
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
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <img
                              src={booking.propertyImage || "/placeholder.svg"}
                              alt={booking.propertyName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="font-medium">{booking.propertyName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.name}</div>
                          <div className="text-sm text-gray-500">{booking.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">${booking.totalPrice}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>{formatDate(booking.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => (window.location.href = `/dashboard/bookings/${booking._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => openEditDialog(booking)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600"
                              onClick={() => openDeleteDialog(booking)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

      {/* Edit Status Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>Change the status for booking at {selectedBooking?.propertyName}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBooking} disabled={loading}>
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedBooking && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-md overflow-hidden">
                    <img
                      src={selectedBooking.propertyImage || "/placeholder.svg"}
                      alt={selectedBooking.propertyName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{selectedBooking.propertyName}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(selectedBooking.checkIn)} - {formatDate(selectedBooking.checkOut)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Guest: {selectedBooking.name}</div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBooking} disabled={loading}>
              {loading ? "Deleting..." : "Delete Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

