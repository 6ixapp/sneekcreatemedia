"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactInfo({
  data,
  onUpdate,
}: {
  data: { name: string; phone: string; email: string; notes: string }
  onUpdate: (data: any) => void
}) {
  // Ensure data is properly initialized
  const contactData = data || { name: "", phone: "", email: "", notes: "" }
  
  const handleChange = (field: string, value: string) => {
    onUpdate({ ...contactData, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 4: Contact Information</h2>
        <p className="text-muted-foreground mb-6">Provide your contact details for booking confirmation</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={contactData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={contactData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={contactData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="john@example.com"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="notes">Special Instructions (Optional)</Label>
        <Textarea
          id="notes"
          value={contactData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Any special requests or notes..."
          rows={4}
          className="mt-2 resize-none"
        />
      </div>
    </div>
  )
}