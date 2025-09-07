"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Navbar from "../components/navbar"
import { motion } from "framer-motion"
import Image from "next/image"

export default function PhotosPage() {
  const photos = [
    "/images/HDR/1.jpg",
    "/images/HDR/2.jpg",
    "/images/HDR/3.jpg",
    "/images/HDR/4.jpg",
    "/images/HDR/5.jpg",
    "/images/HDR/6.jpg",
    "/images/HDR/2(1).jpg",
    // Add more as needed
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-8 flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
          <motion.h1
            className="mb-4 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            HDR Photo Gallery
          </motion.h1>
          <motion.p
            className="max-w-2xl text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore high dynamic range photos showcasing beautiful interiors and exteriors.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {photos.map((src, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-lg bg-zinc-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative aspect-video w-full h-64">
                <Image
                  src={src}
                  alt={`HDR Photo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover rounded-lg"
                  quality={100}
                  priority={index < 2}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}