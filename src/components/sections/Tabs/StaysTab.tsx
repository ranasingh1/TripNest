"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation"; 

export default function StaysTab() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (guests) params.append("guests", guests);

    try {
      router.push(`/search?${params.toString()}`);
      
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(`Search error: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Where</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4">
              <MapPin />
            </div>
            <Input
              type="text"
              placeholder="Destination"
              className="pl-10"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Check in</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4">
              <Calendar />
            </div>
            <Input
              type="date"
              className="pl-10"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Check out</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4">
              <Calendar />
            </div>
            <Input
              type="date"
              className="pl-10"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Guests</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4">
              <Users />
            </div>
            <Input
              type="text"
              placeholder="2 adults"
              className="pl-10"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Button
        className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
        onClick={handleSearch}
      >
        <Search className="mr-2 h-4 w-4" /> Search
      </Button>
      <Toaster />
    </>
  );
}
