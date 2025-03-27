import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

type Testimonial = {
  name: string
  location: string
  quote: string
}

export default function TestimonialCard({ name, location, quote }: Testimonial) {
  return (
    <Card className="bg-white">
      <CardContent className="p-8">
        <div className="flex items-center text-amber-500 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current" />
          ))}
        </div>
        <p className="text-gray-700 mb-6 italic">"{quote}"</p>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
            {name.charAt(0)}
          </div>
          <div className="ml-4">
            <h4 className="font-bold">{name}</h4>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
