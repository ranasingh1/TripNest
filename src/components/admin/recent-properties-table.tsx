import Image from "next/image"
import Link from "next/link"
import { Edit, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Property {
  _id: string
  title: string
  location: string
  price: number
  images: string[]
}

interface RecentPropertiesTableProps {
  properties: Property[]
}

export default function RecentPropertiesTable({ properties }: RecentPropertiesTableProps) {
  if (properties.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No properties found. Create your first property to get started.
      </Card>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Property</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-16 relative rounded overflow-hidden mr-3">
                      <Image
                        src={property.images?.[0] || "/placeholder.svg?height=100&width=160"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium">{property.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{property.location}</td>
                <td className="px-6 py-4 font-medium">${property.price}/night</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/property/${property._id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/properties/edit/${property._id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

