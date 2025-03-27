import Link from "next/link"

const propertyTypes = [
  { type: "Villas", icon: "🏝️" },
  { type: "Cabins", icon: "🌲" },
  { type: "Beach Houses", icon: "🏖️" },
  { type: "Apartments", icon: "🏢" },
  { type: "Cottages", icon: "🏡" }
]

export default function PropertyTypes() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
          Browse by Property Type
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {propertyTypes.map((item, index) => (
            <Link
              key={index}
              href="#"
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
            >
              <div className="bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center h-full flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-base font-medium text-gray-800 group-hover:text-teal-600 transition-colors">
                  {item.type}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
