"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building, BookOpen, Calendar, DollarSign, TrendingUp, Users, PlusCircle, Star } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/authContext"

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    properties: 0,
    bookings: 0,
    revenue: 0,
    occupancyRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setStats({
          properties: 3,
          bookings: 12,
          revenue: 2450,
          occupancyRate: 68,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.displayName || user?.email?.split("@")[0] || "User"}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/dashboard/properties/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building className="h-8 w-8 text-teal-600 mr-3" />
              <div>
                <div className="text-3xl font-bold">
                  {loading ? <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : stats.properties}
                </div>
                <p className="text-xs text-green-500 mt-1">Active listings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-teal-600 mr-3" />
              <div>
                <div className="text-3xl font-bold">
                  {loading ? <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : stats.bookings}
                </div>
                <p className="text-xs text-green-500 mt-1">Total reservations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-teal-600 mr-3" />
              <div>
                <div className="text-3xl font-bold">
                  {loading ? <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : `$${stats.revenue}`}
                </div>
                <p className="text-xs text-green-500 mt-1">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-teal-600 mr-3" />
              <div>
                <div className="text-3xl font-bold">
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `${stats.occupancyRate}%`
                  )}
                </div>
                <p className="text-xs text-green-500 mt-1">+4% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/properties/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Building className="h-12 w-12 text-teal-600 mb-4" />
              <h3 className="font-bold mb-2">Add New Property</h3>
              <p className="text-gray-500 text-sm">List a new vacation rental property</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/calendar">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Calendar className="h-12 w-12 text-teal-600 mb-4" />
              <h3 className="font-bold mb-2">Manage Availability</h3>
              <p className="text-gray-500 text-sm">Update your property availability calendar</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/bookings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-teal-600 mb-4" />
              <h3 className="font-bold mb-2">View Bookings</h3>
              <p className="text-gray-500 text-sm">Manage your current and upcoming reservations</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : stats.bookings > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center border-b pb-4">
                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <Users className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium">New booking for Luxury Villa</p>
                  <p className="text-sm text-gray-500">John Smith booked for May 15-20, 2023</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">2 hours ago</div>
              </div>

              <div className="flex items-center border-b pb-4">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Payment received</p>
                  <p className="text-sm text-gray-500">$850 payment for Mountain Cabin booking</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">Yesterday</div>
              </div>

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">New 5-star review</p>
                  <p className="text-sm text-gray-500">Maria Rodriguez left a review for Beachfront Apartment</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">2 days ago</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No recent activity to display</p>
              <p className="text-sm text-gray-400 mt-1">Add your first property to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

