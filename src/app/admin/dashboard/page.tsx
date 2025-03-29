"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Building, BookOpen, DollarSign, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RecentPropertiesTable from "@/components/admin/recent-properties-table"
import RecentBookingsTable from "@/components/admin/recent-booking-table"

interface DashboardStats {
  totalProperties: number
  totalBookings: number
  totalRevenue: number
  occupancyRate: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
  })
  const [properties, setProperties] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

 }, [])

//   if (loading) {
//     return (
//       <div>
//         <Loader2 />
//       </div>
//     )
//   }

  return (
    <main>
      <header>
        <h1>Dashboard</h1>
      </header>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Building />
            <div>{stats.totalProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <BookOpen />
            <div>{stats.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <DollarSign />
            <div>${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart3 />
            <div>{stats.occupancyRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div>
          <h2>Recent Properties</h2>
          <Link href="/admin/properties">View all properties</Link>
        </div>
        <RecentPropertiesTable  properties={properties.slice(0, 5)} />
      </div>

      <div>
        <div>
          <h2>Recent Bookings</h2>
          <Link href="/admin/bookings">View all bookings</Link>
        </div>
        <RecentBookingsTable bookings={bookings.slice(0, 5)} />
      </div>
    </main>
  )
}
