// components/sections/tabs/StaysTab.tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Search } from "lucide-react"

export default function StaysTab() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Where", icon: <MapPin />, placeholder: "Destination", type: "text" },
          { label: "Check in", icon: <Calendar />, type: "date" },
          { label: "Check out", icon: <Calendar />, type: "date" },
          { label: "Guests", icon: <Users />, placeholder: "2 adults", type: "text" }
        ].map((field, idx) => (
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
        <Search className="mr-2 h-4 w-4" /> Search
      </Button>
    </>
  )
}
