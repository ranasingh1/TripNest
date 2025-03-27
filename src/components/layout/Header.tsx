import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="border-b sticky top-0 z-10 bg-white   ">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between ">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-teal-600">TripNest</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 ">
            {["Destinations", "Properties", "Deals", "About Us"].map((item) => (
              <Link key={item} href="#" className="text-sm font-bold hover:text-teal-600 transition-colors">
              {item}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:flex font-bold ">List Your Property</Button>
          <Link href="/login"><Button variant="outline" className="hidden sm:flex font-bold">Sign In</Button></Link>
        </div>
      </div>
    </header>
  )
}
