import Image from "next/image"
import SearchTabs from "./SearchTabs"

export default function HeroSection() {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] w-full">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://res.cloudinary.com/dawgt41cb/image/upload/v1743355199/pwj2rgie5hltmh1nqcrl.jpg"
          alt="Beautiful vacation destination"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col justify-center h-full">
        <div className="max-w-3xl text-center md:text-left mx-auto md:mx-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Find Your Perfect Getaway
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8">
            Discover and book unique accommodations around the world.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto md:mx-0">
          <SearchTabs />
        </div>
      </div>
    </section>
  )
}
