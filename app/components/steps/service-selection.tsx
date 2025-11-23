"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export function ServiceSelection({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (service: string) => void
}) {
  // Production pricing - All services and packages
  const services = [
    {
      id: "mls-package",
      name: "MLS Package",
      price: 250,
      duration: "2-3 hours",
      description: "This package covers all MLS essentials to make your listing go live quickly and professionally.",
      includes: "HDR Photos, Drone Photos, 3D Tour & RMS",
      featured: true,
    },
    {
      id: "mls-social-package",
      name: "MLS + Social Package",
      price: 475,
      duration: "3-5 hours",
      description: "A complete package for agents who want both MLS-ready visuals and engaging social media content.",
      includes: "Everything in MLS Package + Essential Video",
    },
    {
      id: "mls-sc-prime-package",
      name: "MLS + SC Prime Package",
      price: 675,
      duration: "4-6 hours",
      description: "Our premium package designed for maximum exposure. Perfect for agents who want to make a strong impact online.",
      includes: "Everything in MLS Package + SC Prime Reel",
      featured: true,
    },
    {
      id: "hdr",
      name: "HDR Photos",
      price: 250,
      duration: "1-2 hours",
      description: "High-quality, professionally edited images that capture every detail of your property.",
      includes: "Professional HDR Photography",
    },
    {
      id: "3d-tour-rms",
      name: "3D Tour & RMS",
      price: 100,
      duration: "1-2 hours",
      description: "Interactive 3D virtual tours that allow buyers to explore the property remotely.",
      includes: "3D Tour + RMS Measurements",
    },
    {
      id: "essential-video",
      name: "Essential Video",
      price: 300,
      duration: "2-3 hours",
      description: "A short, professionally filmed property walkthrough video that highlights key features and flow.",
      includes: "Property Walkthrough Video",
    },
    {
      id: "sc-prime-reel",
      name: "SC Prime Reel",
      price: 500,
      duration: "2-4 hours",
      description: "Showcase your brand and personality along with the listing in the most premium way.",
      includes: "Cinematic Storytelling Reel",
    },
    {
      id: "possession-video",
      name: "Possession Video",
      price: 300,
      duration: "1-2 hours",
      description: "Capture your clients' key handover moments in a memorable, emotional video.",
      includes: "Client Handover Video",
    },
    {
      id: "drone",
      name: "Drone Photos",
      price: 100,
      duration: "0.5-1 hour",
      description: "Aerial shots that provide a stunning overview of the property and surrounding area.",
      includes: "Aerial Drone Photography",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 1: Select Services</h2>
        <p className="text-muted-foreground mb-6">Select the service package that best fits your needs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <Card
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={`p-6 transition-all h-full flex flex-col border cursor-pointer ${selected === service.id
                ? "bg-black border-primary ring-1 ring-primary"
                : "bg-black border-gray-800 hover:border-gray-600"
              }`}
          >
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">{service.name}</h3>
                {selected === service.id && <Check className="w-5 h-5 text-primary" />}
              </div>
              <div className="text-white font-bold text-2xl mb-3">${service.price.toFixed(2)}</div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm font-semibold mb-1">Includes:</p>
                <p className="text-white text-sm">{service.includes}</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-auto mb-4">{service.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                Duration: <span className="text-white font-semibold">{service.duration}</span>
              </p>
              {service.featured && <Badge className="bg-white text-black text-xs font-semibold hover:bg-gray-200">Most Popular</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}