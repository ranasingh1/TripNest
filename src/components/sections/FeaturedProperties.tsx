"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import PropertyCard from "@/components/property-card";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties");
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Error fetching properties");
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const visibleProperties = showAll ? properties : properties.slice(0, 3);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Featured Properties
          </h2>
          {properties.length > 3 && (
            <Button
              variant="link"
              className="text-teal-600 font-medium group px-0"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : "View all"}
              <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          )}
        </div>

        {/* Properties Grid or Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden relative block h-64">
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : visibleProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center">No properties found.</div>
        )}
      </div>
    </section>
  );
}
