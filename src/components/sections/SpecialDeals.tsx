"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

const deals = [
  {
    title: "Summer Getaways",
    description: "Save up to 25% on beach destinations worldwide",
    buttonText: "View Deals",
    image:
      "https://res.cloudinary.com/dawgt41cb/image/upload/v1743363552/r1xhzds53zvrpy8rwzdo.jpg",
  },
  {
    title: "Last Minute Escapes",
    description: "Incredible deals on properties available this month",
    buttonText: "Book Now",
    image:
      "https://res.cloudinary.com/dawgt41cb/image/upload/v1743363560/lbxlhte2qzv34kxzuaxq.jpg",
  },
];

export default function SpecialDeals() {
  const handleClick = () => {
    toast("Feature coming soon");
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
          Special Deals & Offers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {deals.map((deal, index) => (
            <div
              key={index}
              className="relative h-80 rounded-lg overflow-hidden group"
            >
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white max-w-md">
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                  {deal.title}
                </h3>
                <p className="text-sm sm:text-base mb-4">{deal.description}</p>
                <Button
                  className="bg-white text-teal-600 hover:bg-gray-100 font-medium"
                  onClick={handleClick}
                >
                  {deal.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Toaster />
      </div>
    </section>
  );
}
