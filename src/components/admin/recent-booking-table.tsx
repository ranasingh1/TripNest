import { format } from "date-fns"
import { Calendar, User } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Booking {
  _id: string
  name: string
  email: string
  checkIn: string
  checkOut: string
  totalPrice: number
  propertyId: {
    _id: string
    title: string
  }
}

interface RecentBookingsTableProps {
  bookings: Booking[]
}

export default function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  if (bookings.length === 0) {
    return <Card className="p-6 text-center text-gray-500">No bookings found yet.</Card>
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Guest</th>
              <th className="px-6 py-3">Property</th>
              <th className="px-6 py-3">Dates</th>
              <th className="px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{booking.name}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">{booking.propertyId?.title || "Unknown Property"}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {format(new Date(booking.checkIn), "MMM d")} - {format(new Date(booking.checkOut), "MMM d, yyyy")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">${booking.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

