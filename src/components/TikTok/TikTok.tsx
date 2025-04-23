"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface TikTokVideo {
  thumbnail_url: string
  title: string
  author_name: string
  html: string
  embed_html?: string
}

export function TikTok() {
  const [videos, setVideos] = useState<TikTokVideo[]>([])
  const [selectedVideo, setSelectedVideo] = useState<TikTokVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/tiktok")
        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }
        const data = await response.json()
        setVideos(data)
      } catch (err) {
        setError("An error occurred while fetching the videos.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Effect to load TikTok embed script when modal is opened
  useEffect(() => {
    if (selectedVideo) {
      const script = document.createElement("script")
      script.src = "https://www.tiktok.com/embed.js"
      script.async = true
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [selectedVideo])

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Cargando videos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between rounded-lg px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100">
              <Image
                src="/brixarlogo.jpeg"
                alt="Abogados Legalistas"
                width={48}
                height={48}
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Brixar Propiedades</h3>
              <p className="text-sm text-gray-500">@brixar.propiedades</p>
            </div>
          </div>
          <Link href="https://www.tiktok.com/@brixar.propiedades" target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md bg-[#FE2C55] px-6 py-2 font-medium text-white transition-colors hover:bg-[#ef233c] cursor-pointer"
            >
              Síguenos en TikTok
            </motion.button>
          </Link>
        </div>


        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video, index) => (
              <motion.div
                key={index}
                className="relative aspect-[9/16] cursor-pointer overflow-hidden rounded-lg bg-gray-100"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedVideo(video)}
              >
                <Image
                  src={video.thumbnail_url || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority={index < 4}
                />
                <div className="absolute inset-0 bg-black/20 transition-opacity hover:bg-black/40">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm text-white line-clamp-2">{video.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg rounded-lg bg-white p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -right-4 -top-4 rounded-full bg-white p-2 shadow-lg"
              >
                <X className="h-6 w-6" />
              </button>
              <div
                dangerouslySetInnerHTML={{
                  __html: `
                    <blockquote 
                      class="tiktok-embed" 
                      cite="https://www.tiktok.com/@legalistas.ar/video/${selectedVideo.embed_html || selectedVideo.html.match(/data-video-id="([^"]+)"/)?.[1] || ""
                    }"
                      data-video-id="${selectedVideo.embed_html || selectedVideo.html.match(/data-video-id="([^"]+)"/)?.[1] || ""
                    }"
                      data-autoplay="0"
                      data-no-analytics="1"
                      style="max-width: 100%;"
                    >
                      <section>
                        <a target="_blank" href="https://www.tiktok.com/@legalistas.ar?refer=embed">@legalistas.ar</a>
                      </section>
                    </blockquote>
                  `,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}