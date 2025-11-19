"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10">
            <Image src="/images/logo.png" alt="Sneek Create Media Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-bold text-white">Harshaan Singh</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/" className="text-white/80 transition-colors hover:text-white">
            Home
          </Link>
          <Link href="/categories" className="text-white/80 transition-colors hover:text-white">
            Categories
          </Link>
          <Link href="#portfolio" className="text-white/80 transition-colors hover:text-white">
            Portfolio
          </Link>
          <Link href="#pricing" className="text-white/80 transition-colors hover:text-white">
            Pricing
          </Link>
          <Link href="#contact" className="text-white/80 transition-colors hover:text-white">
            Contact
          </Link>
          <Link href="/booking">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-lg">
              Book Now
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" className="ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 bg-black/95 backdrop-blur-md shadow-md md:hidden">
          <nav className="container mx-auto flex flex-col space-y-4 p-4">
            <Link
              href="/"
              className="p-2 text-white/80 transition-colors hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="p-2 text-white/80 transition-colors hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="#portfolio"
              className="p-2 text-white/80 transition-colors hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              href="#pricing"
              className="p-2 text-white/80 transition-colors hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="p-2 text-white/80 transition-colors hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/booking"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-lg">
                Book Now
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
