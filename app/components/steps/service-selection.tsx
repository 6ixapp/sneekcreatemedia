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
      description: "HDR Photos, Drone Photos, 3D Tour & RMS. This package covers all MLS essentials to make your listing go live quickly and professionally.",
      featured: true,
    },
    {
      id: "mls-social-package",
      name: "MLS + Social Package",
      price: 475,
      duration: "3-5 hours",
      description: "Includes everything in the MLS Package, plus Essential Video. A complete package for agents who want both MLS-ready visuals and engaging social media content to attract potential buyers.",
    },
    {
      id: "mls-sc-prime-package",
      name: "MLS + SC Prime Package",
      price: 675,
      duration: "4-6 hours",
      description: "Includes everything in the MLS Package, plus SC Prime Reel. Our premium package designed for maximum exposure. Perfect for agents who want to make a strong impact online by combining cinematic storytelling with high-quality visuals that elevate both your listings and your personal brand.",
      featured: true,
    },
    {
      id: "hdr",
      name: "HDR Photos",
      price: 250,
      duration: "1-2 hours",
      description: "High-quality, professionally edited images that capture every detail of your property. Perfect for MLS listings.",
    },
    {
      id: "3d-tour-rms",
      name: "3D Tour & RMS",
      price: 100,
      duration: "1-2 hours",
      description: "Interactive 3D virtual tours that allow buyers to explore the property remotely. Includes accurate RMS measurements and floor plans for full compliance.",
    },
    {
      id: "essential-video",
      name: "Essential Video",
      price: 300,
      duration: "2-3 hours",
      description: "A short, professionally filmed property walkthrough video that highlights key features and flow. A slower-paced style with no flashy edits — perfect for agents who prefer not to be on camera.",
    },
    {
      id: "sc-prime-reel",
      name: "SC Prime Reel",
      price: 500,
      duration: "2-4 hours",
      description: "Showcase your brand and personality along with the listing in the most premium way. Perfect for social media exposure and personal brand building.",
    },
    {
      id: "possession-video",
      name: "Possession Video",
      price: 300,
      duration: "1-2 hours",
      description: "Capture your clients' key handover moments in a memorable, emotional video. Great for client gifts and social-proof marketing.",
    },
    {
      id: "drone",
      name: "Drone Photos",
      price: 100,
      duration: "0.5-1 hour",
      description: "Aerial shots that provide a stunning overview of the property and surrounding area. Highlights scale, location, and neighborhood appeal.",
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 1: Choose Service</h2>
        <p className="text-muted-foreground mb-6">Select the service package that best fits your needs</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <Card
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={`p-4 cursor-pointer transition-all ${
              selected === service.id
                ? "border-primary bg-primary/10 ring-2 ring-primary"
                : "border-border hover:border-primary/50 hover:bg-secondary/10"
            } ${service.featured ? "md:col-span-2" : ""}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-foreground">{service.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">
                  ${service.price.toFixed(2)}
                </span>
                {selected === service.id && <Check className="w-5 h-5 text-primary" />}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
            <p className="text-xs text-muted-foreground mb-3">Duration: {service.duration}</p>
            {service.featured && <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>}
          </Card>
        ))}
      </div>
    </div>
  )
}