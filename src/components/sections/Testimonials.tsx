import TestimonialCard from "../cards/TestimonialCards"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    quote:
      "StayScape made finding our dream vacation home so easy. The property was exactly as described and the host was amazing!",
  },
  {
    name: "David Chen",
    location: "Toronto, Canada",
    quote:
      "We've used StayScape for our last three family vacations and have never been disappointed. The selection of properties is outstanding.",
  },
  {
    name: "Maria Rodriguez",
    location: "Madrid, Spain",
    quote:
      "As someone who travels frequently for work, I appreciate how simple StayScape makes it to find comfortable accommodations anywhere in the world.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Guests Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
