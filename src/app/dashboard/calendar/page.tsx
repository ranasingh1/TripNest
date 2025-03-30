"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/calendar-data", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();

      const parsedBookings = data?.bookings?.map((b: any) => ({
        ...b,
        checkIn: new Date(b.checkIn),
        checkOut: new Date(b.checkOut),
      }));

      const parsedProperties = data?.properties?.map((p: any) => ({
        ...p,
        blockedDates: p.blockedDates.map((d: string) => new Date(d)),
      }));

      setBookings(parsedBookings);
      setProperties(parsedProperties);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const blocked: Date[] = [];

    properties?.forEach((property) => {
      if (selectedProperty === "all" || property.id === selectedProperty) {
        blocked.push(...property.blockedDates);
      }
    });

    setBlockedDates(blocked);
  }, [selectedProperty, bookings, properties]);

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Availability Calendar</h1>
          <p className="text-muted-foreground text-sm mt-1">
            See blocked dates for your properties.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="bg-background border-muted">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties?.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-md border rounded-2xl w-full">
        <CardContent className="p-6 w-full">
          <div className="flex justify-center w-full">
            <Calendar
              month={month}
              onMonthChange={setMonth}
              mode="multiple"
              selected={[]}
              modifiers={{ blocked: blockedDates }}
              modifiersClassNames={{
                blocked: "bg-gray-400 text-white font-medium",
              }}
              className=""
              classNames={{
                day: cn(
                  "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
                  "hover:bg-muted transition rounded-md"
                ),
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
