"use client"

import { useState } from "react"
import { BookingForm } from "../components/booking-form"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    service: null,
    address: null,
    date: null,
    time: null,
    contact: {
      name: "",
      phone: "", 
      email: "",
      notes: ""
    },
    promoCode: "",
  })

  const steps = [
    "Choose Service",
    "Property Address", 
    "Date & Time",
    "Contact & Extras",
    "Payment",
    "Confirmation"
  ]

  const progressPercentage = (step / steps.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Your Service</h1>
            <p className="text-muted-foreground">Complete your booking in just a few simple steps</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Step {step} of {steps.length}</span>
              <span className="text-sm text-muted-foreground">{steps[step - 1]}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <BookingForm
                  step={step}
                  setStep={setStep}
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                />
              </Card>
            </div>
            
            {/* Order Summary Sidebar - Only show on larger screens and when there's something to show */}
            <div className="hidden lg:block">
              <div className="sticky top-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  {bookingData.service ? (
                    <div className="space-y-4">
                      <div className="pb-4 border-b border-border">
                        <p className="text-sm text-muted-foreground">Service</p>
                        <p className="font-semibold">
                          {bookingData.service === 'mls-package' && 'MLS Package'}
                          {bookingData.service === 'mls-social-package' && 'MLS + Social Package'}
                          {bookingData.service === 'mls-sc-prime-package' && 'MLS + SC Prime Package'}
                          {bookingData.service === 'hdr' && 'HDR Photos'}
                          {bookingData.service === '3d-tour-rms' && '3D Tour & RMS'}
                          {bookingData.service === 'essential-video' && 'Essential Video'}
                          {bookingData.service === 'sc-prime-reel' && 'SC Prime Reel'}
                          {bookingData.service === 'possession-video' && 'Possession Video'}
                          {bookingData.service === 'drone' && 'Drone Photos'}
                        </p>
                      </div>
                      
                      {bookingData.address && (
                        <div className="pb-4 border-b border-border">
                          <p className="text-sm text-muted-foreground">Property Address</p>
                          <p className="font-semibold text-sm">{bookingData.address}</p>
                        </div>
                      )}
                      
                      {bookingData.date && (
                        <div className="pb-4 border-b border-border">
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-semibold">{new Date(bookingData.date).toLocaleDateString()}</p>
                        </div>
                      )}
                      
                      {bookingData.time && (
                        <div className="pb-4 border-b border-border">
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="font-semibold">{bookingData.time}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Select a service to see pricing details</p>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}