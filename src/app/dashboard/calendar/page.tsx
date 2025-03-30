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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [confirmedDates, setConfirmedDates] = useState<Date[]>([]);
  const [pendingDates, setPendingDates] = useState<Date[]>([]);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/calendar-data");
      const data = await res.json();

      const parsedBookings = data?.bookings?.map((b: any) => ({
        ...b,
        checkIn: new Date(b.checkIn),
        checkOut: new Date(b.checkOut),
      }));

      const parsedProperties = data.properties.map((p: any) => ({
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
    const confirmed: Date[] = [];
    const pending: Date[] = [];

    properties.forEach((property) => {
      if (selectedProperty === "all" || property.id === selectedProperty) {
        blocked.push(...property.blockedDates);
      }
    });

    bookings.forEach((booking) => {
      if (selectedProperty === "all" || booking.propertyId === selectedProperty) {
        const range = eachDayBetween(booking.checkIn, booking.checkOut);
        if (booking.status === "confirmed") confirmed.push(...range);
        if (booking.status === "pending") pending.push(...range);
      }
    });

    setBlockedDates(blocked);
    setConfirmedDates(confirmed);
    setPendingDates(pending);
  }, [selectedProperty, bookings, properties]);

  const eachDayBetween = (start: Date, end: Date): Date[] => {
    const dates: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Availability Calendar</h1>

        <div className="w-60">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger>
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <Calendar
            month={month}
            onMonthChange={setMonth}
            mode="multiple"
            selected={[]}
            modifiers={{
              blocked: blockedDates,
              confirmed: confirmedDates,
              pending: pendingDates,
            }}
            modifiersClassNames={{
              blocked: "bg-gray-300 text-gray-800",
              confirmed: "bg-green-200 text-green-800",
              pending: "bg-yellow-200 text-yellow-800",
            }}
            classNames={{
              day: cn(
                "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
                "hover:bg-muted"
              ),
            }}
          />
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-4">
        <Badge className="bg-green-600 hover:bg-green-600">Confirmed</Badge>
        <Badge className="bg-yellow-500 hover:bg-yellow-500 text-black">Pending</Badge>
        <Badge className="bg-gray-500 hover:bg-gray-500">Blocked</Badge>
      </div>
    </div>
  );
}
