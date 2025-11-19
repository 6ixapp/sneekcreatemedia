// =========================
// ORIGINAL PAGE (COMMENTED)
// =========================

// import Hero from "./components/hero"
// import Gallery from "./components/gallery"
// import Pricing from "./components/pricing"
// import Testimonials from "./components/testimonials"
// import Contact from "./components/contact"
// import Footer from "./components/footer"
// import Navbar from "./components/navbar"
// import CalendlyWidget from "./components/calendly-widget"

// export default function Page() {
//   return (
//     <main className="min-h-screen bg-background text-foreground">
//       <Navbar />
//       <Hero />
//       <Gallery />
//       <Testimonials />
//       <Pricing />
//       <CalendlyWidget />
//       <Footer />
//     </main>
//   )
// }

// =========================
// NEW UNDER MAINTENANCE PAGE
// =========================

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">🚧 Under Maintenance 🚧</h1>
      <p className="text-lg max-w-xl">
        Our website is currently undergoing scheduled maintenance.  
        We’ll be back shortly. Thank you for your patience!
      </p>
    </main>
  );
}
