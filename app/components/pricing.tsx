"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Check, Video, Camera, Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const pricingPlans = [
    {
      name: "Premium Signature Reel",
      price: "$500",
      description: "Agent On Camera, 3D Text, Script Provided, Fast Paced Edits",
      features: [
        "Agent On Camera",
        "3D Text",
        "Script Provided",
        "Fast Paced Edits",
      ],
      popular: true,
      color: "from-orange-500 to-amber-600",
      shadowColor: "shadow-orange-500/20",
      icon: Video,
      href: "/sigature",
    },
    {
      name: "RMS, 3D Tour & HDR Photos",
      price: "From $250",
      description:
        "Drone HDR Photos with Labels, Up to 50+ Photos (all inside/outside the house)",
      features: [
        "Drone HDR Photos with Labels",
        "Up to 50+ Photos (interior & exterior)",
        "0-1500 Sqft - $250",
        "1500-3000 Sqft - $300",
        "3000-4500 Sqft - $400",
      ],
      popular: false,
      color: "from-purple-500 to-indigo-600",
      shadowColor: "shadow-purple-500/20",
      icon: Camera,
      href: "/hdr",
    },
    {
      name: "Monthly Video Package",
      price: "From $1000",
      description: "8 or 15 Videos Per Month. Consistent format. Fast Delivery.",
      features: [
        "8 Videos Per Month - $1000",
        "15 Videos Per Month - $1500",
        "Streamlined, consistent video format",
        "24 Hour turnaround time",
        "Shoot 4-6 times a month",
        "Does not include 3D Text/Graphics",
        "For Possession, Pre-Construction, Listing & Similar Videos",
      ],
      popular: false,
      color: "from-blue-500 to-cyan-400",
      shadowColor: "shadow-blue-500/20",
      icon: Layers,
      href: "/monthly",
    },
  ]

  return (
    <section className="bg-zinc-900 py-20" id="pricing">
      <div ref={ref} className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl">
            Plans & Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Choose the perfect package for your project. Custom packages are also available upon request.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <Card
                className={`relative overflow-hidden border-0 bg-zinc-800/50 backdrop-blur-sm ${plan.shadowColor} ${
                  plan.popular ? `shadow-lg` : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -right-12 top-7 z-10 rotate-45 bg-gradient-to-r from-orange-500 to-amber-600 px-12 py-1 text-xs font-semibold text-white">
                    POPULAR
                  </div>
                )}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${plan.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="mb-2 flex items-center">
                    <div
                      className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${plan.color}`}
                    >
                      <plan.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className={`bg-gradient-to-r ${plan.color} bg-clip-text text-2xl text-transparent`}>
                      {plan.name}
                    </CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className={`bg-gradient-to-r ${plan.color} bg-clip-text text-4xl font-bold text-transparent`}>
                      {plan.price}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r ${plan.color}`}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Small "View More" button */}
                  <Link href={plan.href}>
                    <span
                      className={`inline-block text-center rounded px-4 py-1.5 bg-gradient-to-r ${plan.color} text-white font-medium text-sm shadow-sm transition hover:scale-105 hover:shadow-lg active:scale-95`}
                    >
                      View More
                    </span>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}