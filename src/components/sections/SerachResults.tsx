"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import PropertyCard from "@/components/property-card";
import { Toaster } from "sonner";

export default function SearchResults({ properties }: { properties: any[] }) {
  const router = useRouter();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Search Results</h2>
          <Button
            variant="link"
            className="text-teal-600 font-medium group px-0"
            onClick={() => router.push("/")}
          >
            Back to search
            <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center">No properties found.</div>
        )}
      </div>
      <Toaster />
    </section>
  );
}
