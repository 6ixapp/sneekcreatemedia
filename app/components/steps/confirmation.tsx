"use client"

import { useEffect, useState } from "react"

type EmailStatus = "idle" | "sending" | "sent" | "error"
type CalendarStatus = "idle" | "checking" | "booked" | "busy" | "error"

export function Confirmation({ bookingData }: { bookingData: any }) {
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle")
  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus>("idle")
  const [bookingRef, setBookingRef] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [hasAttempted, setHasAttempted] = useState(false)
  
  const services: Record<string, string> = {
    hdr: "HDR Photos",
    "3d-tour": "RMS 3D Tour",
    drone: "Drone Photos",
    bundle: "House Listing Essential",
    "video-essential": "Listing Video - Essential",
    "video-premium": "Listing Video - Premium",
    possession: "Possession Video",
  }

  useEffect(() => {
    setEmailStatus("idle")
    setCalendarStatus("idle")
    setStatusMessage("")
    setBookingRef("")
    setHasAttempted(false)
  }, [bookingData?.date, bookingData?.time, bookingData?.service])

  useEffect(() => {
    const processBooking = async () => {
      if (!bookingData?.date || !bookingData?.time || !bookingData?.contact?.name) {
        setCalendarStatus("error")
        setStatusMessage("Missing required booking details. Please go back and complete the form.")
        setEmailStatus("error")
        return
      }

      try {
        setCalendarStatus("checking")
        setStatusMessage("Checking Google Calendar availability...")

        const calendarResponse = await fetch("/api/calendar/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: bookingData.date,
            time: bookingData.time,
            service: bookingData.service,
            name: bookingData.contact.name,
          }),
        })

        const calendarResult = await calendarResponse.json()

        if (!calendarResponse.ok || !calendarResult.success) {
          setCalendarStatus(calendarResponse.status === 409 ? "busy" : "error")
          setStatusMessage(
            calendarResult.message ||
              "The selected time slot is no longer available. Please choose a different date or time."
          )
          setEmailStatus("error")
          return
        }

        setCalendarStatus("booked")
        setStatusMessage("Time slot reserved in calendar. Sending confirmation emails...")

        const generatedRef = "BK" + Math.random().toString(36).substr(2, 9).toUpperCase()
        setBookingRef(generatedRef)
        setEmailStatus("sending")
        
        const response = await fetch("/api/booking/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...bookingData,
            bookingRef: generatedRef,
            calendarEventId: calendarResult.eventId,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          console.log("Booking confirmed:", result)
          setEmailStatus("sent")
          setStatusMessage("Booking confirmed and calendar event created successfully!")
        } else {
          const error = await response.json()
          console.error("Booking confirmation failed:", error)
          setEmailStatus("error")
          setStatusMessage(error?.error || "Failed to send confirmation emails. Please contact support.")
        }
      } catch (error) {
        console.error("Error processing booking:", error)
        setCalendarStatus("error")
        setEmailStatus("error")
        setStatusMessage("Unexpected error occurred while completing the booking. Please try again.")
      }
    }

    if (bookingData && !hasAttempted) {
      setHasAttempted(true)
      processBooking()
    }
  }, [bookingData, hasAttempted])

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <div className={`inline-block mb-4 p-3 rounded-full ${emailStatus === "sent" ? "bg-green-100" : "bg-blue-100"}`}>
          <svg className={`w-8 h-8 ${emailStatus === "sent" ? "text-green-600" : "text-blue-600"}`} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {emailStatus === "sent" ? "Booking Confirmed!" : "Finalizing Your Booking"}
        </h2>
        <p className="text-muted-foreground mb-4">
          {emailStatus === "sent" ? "Your booking has been successfully created" : "Please wait while we reserve your time slot"}
        </p>
        {bookingRef && (
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-lg font-mono">
            Booking Ref: {bookingRef}
          </div>
        )}
        {statusMessage && <p className="mt-4 text-sm text-muted-foreground">{statusMessage}</p>}
        
        <div className="mt-4">
          {calendarStatus === "checking" && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Verifying calendar availability...</span>
            </div>
          )}
          {calendarStatus === "busy" && (
            <div className="flex items-center gap-2 text-red-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L10 10.586 7.707 8.293a1 1 0 10-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L10 13.414l2.707 2.707a1 1 0 001.414-1.414L11.414 12l2.707-2.707z"
                  clipRule="evenodd"
                />
              </svg>
              <span>The selected slot is no longer available. Please go back and choose another time.</span>
            </div>
          )}
          {emailStatus === "sending" && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Sending confirmation emails...</span>
            </div>
          )}
          {emailStatus === "sent" && (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Confirmation emails sent successfully!</span>
            </div>
          )}
          {emailStatus === "error" && calendarStatus !== "busy" && (
            <div className="flex items-center gap-2 text-red-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>We could not complete the booking. Please try again or contact support.</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Service</p>
          <p className="font-semibold text-foreground">{services[bookingData.service] || "N/A"}</p>
        </div>
        <div className="p-4 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Date</p>
          <p className="font-semibold text-foreground">
            {bookingData.date ? new Date(bookingData.date).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div className="p-4 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Time</p>
          <p className="font-semibold text-foreground">{bookingData.time || "N/A"}</p>
        </div>
        <div className="p-4 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Client</p>
          <p className="font-semibold text-foreground">{bookingData.contact.name || "N/A"}</p>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-3">Next Steps</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span>{emailStatus === "sent" ? "✓" : emailStatus === "sending" ? "⏳" : emailStatus === "idle" ? "…" : "❌"}</span>
            <span>
              {emailStatus === "sent"
                ? `Confirmation email sent to ${bookingData.contact?.email || "your email"}`
                : "We will email you as soon as the booking is finalized"}
            </span>
          </li>
          <li className="flex gap-2">
            <span>{emailStatus === "sent" ? "✓" : "⏳"}</span>
            <span>Calendar invite (ICS file) attached to email</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Invoice with payment receipt included</span>
          </li>
          <li className="flex gap-2">
            <span>⏳</span>
            <span>Prep instructions will be sent 24 hours before appointment</span>
          </li>
          <li className="flex gap-2">
            <span>⏳</span>
            <span>We'll call you 1 hour before arrival to confirm</span>
          </li>
        </ul>
      </div>

      <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        <p>Have questions? Contact us at support@realestate-services.com or call 1-800-REAL-SVC</p>
      </div>
    </div>
  )
}

