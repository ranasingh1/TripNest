import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Search } from "lucide-react"

export default function FlightsTab() {
  const fields = [
    { label: "From", icon: <MapPin />, placeholder: "Departure", type: "text" },
    { label: "To", icon: <MapPin />, placeholder: "Destination", type: "text" },
    { label: "Departure", icon: <Calendar />, placeholder: "", type: "date" },
    { label: "Return", icon: <Calendar />, placeholder: "", type: "date" }
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {fields.map((field, idx) => (
          <div className="space-y-2" key={idx}>
            <label className="text-sm font-medium">{field.label}</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4">
                {field.icon}
              </div>
              <Input
                type={field.type}
                placeholder={field.placeholder}
                className="pl-10"
              />
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700">
        <Search className="mr-2 h-4 w-4" /> Search Flights
      </Button>
    </>
  )
}
