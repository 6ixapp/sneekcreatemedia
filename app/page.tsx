import Hero from "./components/hero"
import Gallery from "./components/gallery"
import Pricing from "./components/pricing"
import Testimonials from "./components/testimonials"
import Contact from "./components/contact"
import Footer from "./components/footer"
import Navbar from "./components/navbar"
import CalendlyWidget from "./components/calendly-widget"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Gallery />
      <Testimonials />
      <Pricing />
      <CalendlyWidget />
      <Footer />
    </main>
  )
}
