"use client"

import { useState } from "react"

export function DateTimeSelection({
  service,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: {
  service: string | null
  selectedDate: string | null
  selectedTime: string | null
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string | null) => void
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10))
  const [slotStatuses, setSlotStatuses] = useState<Record<string, "idle" | "checking" | "available" | "busy" | "error">>({})
  const [message, setMessage] = useState<string>("")

  // Generate sample available dates (next 30 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date)
      }
    }
    return dates
  }

  const availableDates = getAvailableDates()
  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]

  const getSlotKey = (date: string | null, time: string) => `${date ?? "no-date"}_${time}`

  const handleTimeClick = async (time: string) => {
    if (!selectedDate) {
      setMessage("Please select a date first.")
      return
    }

    if (!service) {
      setMessage("Please choose a service first.")
      return
    }

    setMessage("")
    const slotKey = getSlotKey(selectedDate, time)
    setSlotStatuses((prev) => ({ ...prev, [slotKey]: "checking" }))

    try {
      const response = await fetch("/api/calendar/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          time,
          service,
          name: bookingDataNameFallback(service),
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSlotStatuses((prev) => ({ ...prev, [slotKey]: "available" }))
        onTimeSelect(time)
        setMessage("Slot is available and reserved for you temporarily.")
      } else {
        setSlotStatuses((prev) => ({ ...prev, [slotKey]: "busy" }))
        if (selectedTime === time) {
          onTimeSelect(null)
        }
        setMessage(result?.message || "This time slot is no longer available. Please choose another.")
      }
    } catch (error) {
      console.error("Calendar availability check failed:", error)
      setSlotStatuses((prev) => ({ ...prev, [slotKey]: "error" }))
      if (selectedTime === time) {
        onTimeSelect(null)
      }
      setMessage("We couldn't verify availability. Please try again or pick another slot.")
    }
  }

  const bookingDataNameFallback = (serviceName: string) => {
    return `${serviceName} availability check`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 3: Choose Date & Time</h2>
        <p className="text-muted-foreground mb-4">Select an available date and time slot</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Select Date</label>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {availableDates.slice(0, 14).map((date) => {
            const dateStr = date.toISOString().split("T")[0]
            const isSelected = selectedDate === dateStr
            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(dateStr)}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div>{date.getDate()}</div>
                <div className="text-xs opacity-75">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Select Time</label>
          {message && <p className="text-sm text-muted-foreground mb-3">{message}</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                disabled={
                  slotStatuses[getSlotKey(selectedDate, time)] === "busy" ||
                  slotStatuses[getSlotKey(selectedDate, time)] === "checking"
                }
                className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                  slotStatuses[getSlotKey(selectedDate, time)] === "busy"
                    ? "border-red-300 bg-red-50 text-red-400 cursor-not-allowed"
                    : selectedTime === time
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{time}</span>
                  {slotStatuses[getSlotKey(selectedDate, time)] === "checking" && (
                    <span className="text-xs animate-pulse">Checking…</span>
                  )}
                  {slotStatuses[getSlotKey(selectedDate, time)] === "busy" && (
                    <span className="text-xs text-red-500">Busy</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}