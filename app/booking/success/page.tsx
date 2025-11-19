"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const bookingRef = searchParams.get('booking_ref')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [emailStatus, setEmailStatus] = useState<'sending' | 'sent' | 'error'>('sending')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handlePaymentSuccess = useCallback(async () => {
    if (!sessionId) {
      setStatus('error')
      setErrorMessage('No session ID provided')
      return
    }

    try {
      // Retrieve payment details (emails are sent via webhook, not here)
      const response = await fetch('/api/stripe/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Check if payment was actually successful
        if (result.success && result.paymentDetails?.payment_status === 'paid') {
          setPaymentDetails(result.paymentDetails)
          setStatus('success')
          // Email status: true if webhook processed, false if still processing
          // Webhook sends emails asynchronously, so false doesn't mean error
          setEmailStatus(result.emailSent ? 'sent' : 'sending')
        } else {
          // Payment not completed
          setStatus('error')
          setEmailStatus('error')
          setErrorMessage(result.message || result.error || 'Payment not completed')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Payment verification failed:', errorData)
        setStatus('error')
        setEmailStatus('error')
        setErrorMessage(errorData.error || errorData.message || 'Failed to verify payment')
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      setStatus('error')
      setEmailStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }, [sessionId])

  useEffect(() => {
    if (sessionId) {
      handlePaymentSuccess()
    } else {
      setStatus('error')
      setErrorMessage('No session ID found in URL')
    }
  }, [sessionId, handlePaymentSuccess])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Processing Payment...</h2>
          <p className="text-muted-foreground">Please wait while we confirm your payment and send confirmation emails.</p>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">Payment Processing Failed</h2>
          <p className="text-muted-foreground mb-4">
            {errorMessage || 'There was an issue processing your payment. Please contact support.'}
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <a href="/booking" className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
              Try Again
            </a>
            <a href="/" className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90">
              Go Home
            </a>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground">Your booking has been confirmed and payment processed</p>
            </div>

            {/* Payment Details */}
            {paymentDetails && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-green-700 mb-1">Booking Reference</p>
                    <p className="font-mono font-bold text-green-800">
                      {paymentDetails.metadata?.booking_ref || bookingRef || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Booking Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{paymentDetails.metadata?.service_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{paymentDetails.metadata?.date ? new Date(paymentDetails.metadata.date).toLocaleDateString() : 'TBD'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{paymentDetails.metadata?.time || 'TBD'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Payment Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Amount Paid:</span>
                        <span className="font-medium">${(paymentDetails.amount_total / 100).toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span>Credit Card</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction ID:</span>
                        <span className="font-mono text-xs">{paymentDetails.payment_intent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-green-600 font-medium">Paid</span>
                      </div>
                    </div>
                  </div>
                </div>

                {paymentDetails.metadata?.address && (
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Property Address</h3>
                    <p className="text-sm">{paymentDetails.metadata.address}</p>
                  </div>
                )}

                {/* Email Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {emailStatus === 'sent' ? (
                        <>
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-green-700">
                            ✅ Confirmation email sent to {paymentDetails.customer_email}
                          </span>
                        </>
                      ) : emailStatus === 'sending' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-700">
                            ⏳ Confirmation email being processed and will be sent to {paymentDetails.customer_email}
                          </span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-amber-700">
                            ⚠️ Email status unknown. Please check your inbox or contact support.
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {emailStatus === 'sent' ? (
                        <>
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-green-700">✅ Business notification sent</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-700">⏳ Business notification being processed</span>
                        </>
                      )}
                    </div>
                    {emailStatus === 'sending' && (
                      <p className="text-xs text-blue-600 mt-2">
                        Note: Emails are sent securely via webhook after payment confirmation. This may take a few moments.
                      </p>
                    )}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-amber-800">What's Next?</h3>
                  <ul className="space-y-2 text-sm text-amber-700">
                    <li>✅ We'll send prep instructions 24 hours before your appointment</li>
                    <li>✅ Calendar invite has been sent to your email</li>
                    <li>✅ We'll call you 1 hour before arrival to confirm</li>
                    <li>✅ Receipt and invoice are available in your email</li>
                  </ul>
                </div>

                <div className="text-center pt-4">
                  <a href="/" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90">
                    Return to Home
                  </a>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Please wait...</p>
          </Card>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}