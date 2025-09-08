"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useParams } from "next/navigation"
import Navbar from "../../components/navbar"

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Category data mapping - Update video URLs and titles as needed
  const categoryData = {
    "real-estate": {
      title: "Real Estate",
      description:
        "",
      color: "from-orange-500 to-amber-600",
      videos: [
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085539222?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085540189?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085540225?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085540636?badge=0&autopause=0&player_id=0&app_id=58479",
        },
      ],
      photos: [],
    },
    events: {
      title: "Events",
      description:
        "",
      color: "from-purple-500 to-pink-400",
      videos: [
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085541918",
        },
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085541845",
        },
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085953725",
        },
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085541946",
        },
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085542063",
        },
      ],
      photos: [],
    },
    commercial: {
      title: "Restaurant",
      description:
        "",
      color: "from-amber-500 to-yellow-400",
      videos: [
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085576925?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085577008?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
          title: "",
          embedUrl: "https://player.vimeo.com/video/1085577077?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
  title: "",
  embedUrl: "https://player.vimeo.com/video/1085577038?badge=0&autopause=0&player_id=0&app_id=58479"
}

      ],
      
    },
    "content-creation": {
      title: "Content Creation",
      description:
        "Developing engaging digital content for the modern media landscape. My content creation services focus on producing high-quality videos optimized for social media platforms, websites, and digital marketing campaigns. I help creators and businesses build their online presence through consistent, visually appealing content that resonates with target audiences.",
      color: "from-green-500 to-emerald-400",
      videos: [
        {
          title: "Instagram Reel Series",
          embedUrl: "https://player.vimeo.com/video/1085539222?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
          title: "YouTube Channel Intro",
          embedUrl: "https://player.vimeo.com/video/1085540189?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
          title: "TikTok Campaign",
          embedUrl: "https://player.vimeo.com/video/1085540225?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
          title: "Tutorial Series",
          embedUrl: "https://player.vimeo.com/video/1085540636?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
          title: "Behind-the-Scenes",
          embedUrl: "https://player.vimeo.com/video/1085539222?badge=0&autopause=0&player_id=0&app_id=58479",
        },
        {
          title: "Lifestyle Content",
          embedUrl: "https://player.vimeo.com/video/1085540189?badge=0&autopause=0&player_id=0&app_id=58479",
        },
      ],
      photos: [],
    },
  }

  // Get current category data or default to first category if not found
  const currentCategory = categoryData[category as keyof typeof categoryData] || Object.values(categoryData)[0]

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <Link href="/categories">
            <Button variant="outline" className="mb-8 flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Categories
            </Button>
          </Link>
          <motion.h1
            className={`mb-4 bg-gradient-to-r ${currentCategory.color} bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {currentCategory.title}
          </motion.h1>
          <motion.p
            className="max-w-3xl text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {currentCategory.description}
          </motion.p>
        </div>

        {/* Videos Section - Mobile optimized with max-height */}
        <div className="mb-16">
          <motion.h2
            className={`mb-8 bg-gradient-to-r ${currentCategory.color} bg-clip-text text-2xl font-bold text-transparent`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Video Projects
          </motion.h2>
          <div ref={ref} className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
            {currentCategory.videos.map((video, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="flex justify-center items-center mx-auto overflow-hidden rounded-xl">
                  <div className="aspect-[9/16] max-w-[140px] w-full">
                    <iframe
                      className="h-full w-full rounded-xl"
                      src={video.embedUrl}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Photos Section - Only for Commercial category */}
        {category === "commercial" && currentCategory.photos && currentCategory.photos.length > 0 && (
          <div className="mt-16">
            <motion.h2
              className={`mb-8 bg-gradient-to-r ${currentCategory.color} bg-clip-text text-2xl font-bold text-transparent`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Photography Projects
            </motion.h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {currentCategory.photos.map((photo, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.image || "/placeholder.svg"}
                      alt={photo.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-lg font-semibold text-white">{photo.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
