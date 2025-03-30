"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch('/api/destinations');
        if (!res.ok) {
          // console.log(res);
          
          throw new Error("Failed to fetch popular destinations");
        }
        const data = await res.json();
        setDestinations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  if (loading) return <div>Loading popular destinations...</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Heading + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Popular Destinations
          </h2>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((destination:any, index) => (
            <Link
              href="#"
              key={index}
              className="group rounded-lg overflow-hidden relative block h-64"
            >
              <Image
                src={destination?.image} // use an appropriate image or update logic to select one
                alt={destination.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-lg font-semibold">{destination.name}</h3>
                <p className="text-sm text-white/80">
                  {destination.properties} properties
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
