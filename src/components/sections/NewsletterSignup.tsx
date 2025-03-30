"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";


export default function NewsletterSignup() {
  return (
    <section className="py-16 bg-teal-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Get Inspired for Your Next Trip
          </h2>
          <p className="text-sm sm:text-base mb-8 text-white/90">
            Subscribe to our newsletter and receive exclusive offers, travel guides, 
            and inspiration for your next adventure.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              toast("Subscribed successfully!");

            }}
            className="flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto"
          >
            <Input
              type="email"
              required
              placeholder="Your email address"
              className="bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:ring-white focus:border-white flex-1"
            />
            <Button
              type="submit"
              className="bg-white text-teal-600 hover:bg-gray-100 font-semibold"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
