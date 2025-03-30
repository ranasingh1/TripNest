"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Filter,
  Building,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/properties?user=true`, {
          headers: { Authorization: `Bearer ${
            localStorage.getItem("token")
          }` },
        });
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setPropertyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/properties/${propertyToDelete}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to delete");
        setProperties((prev) => prev.filter((p) => p._id !== propertyToDelete));
      } catch (err) {
        console.error("Error deleting:", err);
      } finally {
        setDeleteDialogOpen(false);
        setPropertyToDelete(null);
      }
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold">Properties</h1>
        <div className="mt-4 md:mt-0">
          <Link href="/dashboard/properties/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search properties..."
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
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Properties</DropdownMenuItem>
                <DropdownMenuItem>Active</DropdownMenuItem>
                <DropdownMenuItem>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Properties List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property: any) => (
            <Card
              key={property?._id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={property?.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {property.status}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{property.title}</h3>
                <p className="text-gray-500 mb-2">{property.location}</p>
                {property.inventory && property.inventory.length > 0 && (
                  <p className="text-gray-500 mb-2 text-sm">
                    Inventory:{" "}
                    {property.inventory
                      .map((d: string) => new Date(d).toLocaleDateString())
                      .join(", ")}
                  </p>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">${property.price}/night</span>
                  <span className="text-sm text-gray-500">{property.bookings} bookings</span>
                </div>
                <div className="flex justify-between">
                  <Link href={`/property/${property._id}`}>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/properties/edit/${property._id}`}>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteClick(property._id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Building className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No properties found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "No properties match your search criteria"
              : "You haven't added any properties yet"}
          </p>
          <Link href="/dashboard/properties/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
