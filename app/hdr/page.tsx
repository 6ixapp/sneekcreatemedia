"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Navbar from "../components/navbar"
import { motion } from "framer-motion"
import Image from "next/image"

// Static imports for built-in optimization and blur placeholder
import img1 from "../../public/images/hdr/1.jpg"
import img2 from "../../public/images/HDR/2.jpg"
import img3 from "../../public/images/HDR/3.jpg"
import img4 from "../../public/images/HDR/4.jpg"
import img5 from "../../public/images/HDR/5.jpg"
import img6 from "../../public/images/HDR/6.jpg"
import img7 from "../../public/images/HDR/2(1).jpg"

export default function PhotosPage() {
  const photos = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
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
                  quality={85}
                  priority={index < 1}
                  placeholder="blur"
                  blurDataURL={src.blurDataURL}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}