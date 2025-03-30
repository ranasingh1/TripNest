"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomesGuestsLove() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/popular-properties');
        if (!res.ok) {
          throw new Error("Failed to fetch popular properties");
        }
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  if (loading) return <div>Loading popular properties...</div>;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Homes Guests Love
          </h2>
        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Link
              href={`/properties/${property._id}`}
              key={property._id}
              className="group rounded-lg overflow-hidden relative block h-64"
            >
              <Image
                src={property.image}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-lg font-semibold">{property.title}</h3>
                <p className="text-sm">
                  {property.bookings} bookings
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
