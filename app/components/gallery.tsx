"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Video data - Update embedUrl and title to change videos
  const videos = [
    
{
      title: "",
      embedUrl: "https://player.vimeo.com/video/1116393463",
    },

{
      title: "",
      embedUrl: "https://player.vimeo.com/video/1086480161",
    },
    
    {
      title: "",
      embedUrl: "https://player.vimeo.com/video/1085954269",
    },
  ]

  return (
    <section className="py-20" id="portfolio">
      <div ref={ref} className="container mx-auto px-4">
        <motion.h2
          className="mb-12 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 bg-clip-text text-center text-3xl font-bold tracking-tighter text-transparent sm:text-4xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          Featured Work
        </motion.h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-lg mx-auto w-full"
              style={{ maxWidth: "280px" }} // Smaller fixed width for videos
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Mobile-optimized video container with smaller size */}
              <div className="aspect-[9/16] overflow-hidden">
                <iframe
                  className="h-full w-full"
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-lg font-semibold text-white">{video.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/categories">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 px-8 py-6 text-lg hover:from-orange-600 hover:to-amber-700">
              Explore More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
