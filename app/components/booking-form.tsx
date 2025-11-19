"use client"

import { ServiceSelection } from "../components/steps/service-selection"
import { AddressSearch } from "../components/steps/address-search"
import { DateTimeSelection } from "../components/steps/date-time-selection"
import { ContactInfo } from "../components/steps/contact-info"
import { PaymentForm } from "../components/steps/payment-form"
import { Confirmation } from "../components/steps/confirmation"
import { Button } from "@/components/ui/button"

export function BookingForm({
  step,
  setStep,
  bookingData,
  setBookingData,
}: {
  step: number
  setStep: (step: number) => void
  bookingData: any
  setBookingData: (data: any) => void
}) {
  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    if (step === 6) {
      // Confirmation would trigger final booking
      console.log("Booking confirmed:", bookingData)
    }
  }

  return (
    <div className="space-y-8">
      {step === 1 && (
        <ServiceSelection
          selected={bookingData.service}
          onSelect={(service) => setBookingData({ ...bookingData, service })}
        />
      )}
      {step === 2 && (
        <AddressSearch
          selected={bookingData.address}
          onSelect={(address) => setBookingData({ ...bookingData, address })}
        />
      )}
      {step === 3 && (
        <DateTimeSelection
          service={bookingData.service}
          selectedDate={bookingData.date}
          selectedTime={bookingData.time}
          onDateSelect={(date) => setBookingData({ ...bookingData, date })}
          onTimeSelect={(time) => setBookingData({ ...bookingData, time: time || null })}
        />
      )}
      {step === 4 && (
        <ContactInfo data={bookingData.contact} onUpdate={(contact) => setBookingData({ ...bookingData, contact })} />
      )}
      {step === 5 && (
        <PaymentForm
          promoCode={bookingData.promoCode}
          onPromoCodeChange={(promoCode) => setBookingData({ ...bookingData, promoCode })}
          bookingData={bookingData}
        />
      )}
      {step === 6 && <Confirmation bookingData={bookingData} />}

      {/* Navigation */}
      <div className="flex gap-4 pt-8 border-t border-border">
        <Button variant="outline" onClick={handlePrev} disabled={step === 1}>
          Previous
        </Button>
        {step < 6 ? (
          <Button onClick={handleNext} className="ml-auto">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="ml-auto">
            Complete Booking
          </Button>
        )}
      </div>
    </div>
  )
}