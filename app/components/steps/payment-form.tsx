"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

interface PaymentFormProps {
  promoCode: string
  onPromoCodeChange: (code: string) => void
  bookingData?: any
  totalAmount?: number
  onPaymentSuccess?: () => void
}

export function PaymentForm({
  promoCode,
  onPromoCodeChange,
  bookingData,
  totalAmount = 299.99,
  onPaymentSuccess,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [error, setError] = useState("")

  const getServiceName = (serviceId: string) => {
    const services: Record<string, string> = {
      "mls-package": "MLS Package",
      "mls-social-package": "MLS + Social Package",
      "mls-sc-prime-package": "MLS + SC Prime Package",
      hdr: "HDR Photos",
      "3d-tour-rms": "3D Tour & RMS",
      "essential-video": "Essential Video",
      "sc-prime-reel": "SC Prime Reel",
      "possession-video": "Possession Video",
      drone: "Drone Photos",
    };
    return services[serviceId] || "Unknown Service";
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setError("")

    try {
      // Create Stripe checkout session with booking data
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingData,
          totalAmount,
        }),
      });

      if (response.ok) {
        const { checkoutUrl } = await response.json();
        window.location.href = checkoutUrl;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment processing failed")
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 5: Review & Pay</h2>
        <p className="text-muted-foreground mb-6">Review your booking and complete the payment</p>
      </div>

      <div className="space-y-4">
        {/* Order Summary */}
        {bookingData && (
          <div className="p-4 bg-secondary/5 border border-border rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Service:</span>
                <span className="font-medium">{getServiceName(bookingData.service)}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{bookingData.date ? new Date(bookingData.date).toLocaleDateString() : 'TBD'}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{bookingData.time || 'TBD'}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="promo">Promo Code (Optional)</Label>
          <Input
            id="promo"
            type="text"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="mt-2"
          />
          {promoCode && (
            <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Promo code "{promoCode}" would be applied
            </p>
          )}
        </div>

        <div className="p-4 bg-secondary/10 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-3">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium">Credit/Debit Card (Stripe)</span>
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Secure payment processing powered by Stripe</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            By proceeding with payment, you agree to our Terms & Conditions and Privacy Policy. You will receive an
            automated confirmation email with invoice and calendar invite.
          </p>
        </div>
      </div>

      <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
        {isProcessing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
      </Button>
    </div>
  )
}