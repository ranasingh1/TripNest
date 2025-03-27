import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Calendar } from "lucide-react"

export default function ExperiencesTab() {
  const fields = [
    { label: "What", icon: <Search />, placeholder: "Activity or experience", type: "text" },
    { label: "Where", icon: <MapPin />, placeholder: "Location", type: "text" },
    { label: "When", icon: <Calendar />, placeholder: "", type: "date" }
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <Search className="mr-2 h-4 w-4" /> Find Experiences
      </Button>
    </>
  )
}
