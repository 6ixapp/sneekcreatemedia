import { Resend } from 'resend';

// Initialize Resend with proper error handling
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendBookingConfirmationEmail(bookingData: any) {
  const {
    service,
    date,
    time,
    address,
    contact = {},
    bookingRef,
    totalAmount,
    transactionId,
    paymentIntent,
    paymentMethod,
    paymentStatus,
    currency
  } = bookingData;

  // Service names mapping - Production pricing
  // Note: This is used for display purposes only - actual price comes from bookingData.totalAmount
  const services: Record<string, { name: string; price: number }> = {
    "mls-package": { name: "MLS Package", price: 250 },
    "mls-social-package": { name: "MLS + Social Package", price: 475 },
    "mls-sc-prime-package": { name: "MLS + SC Prime Package", price: 675 },
    hdr: { name: "HDR Photos", price: 250 },
    "3d-tour-rms": { name: "3D Tour & RMS", price: 100 },
    "essential-video": { name: "Essential Video", price: 300 },
    "sc-prime-reel": { name: "SC Prime Reel", price: 500 },
    "possession-video": { name: "Possession Video", price: 300 },
    drone: { name: "Drone Photos", price: 100 },
  };

  const serviceInfo = services[service] || { name: "Unknown Service", price: 0 };

  const formatCurrency = (value?: number, currencyCode = 'USD') => {
    const resolvedCurrency = currencyCode || 'USD';
    const amount = typeof value === 'number' ? value : Number(value);
    if (!amount || Number.isNaN(amount)) {
      return `-- ${resolvedCurrency}`;
    }
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: resolvedCurrency,
      }).format(amount);
    } catch {
      return `$${amount.toFixed(2)} ${resolvedCurrency}`;
    }
  };

  const formatDateLabel = (value?: string) => {
    if (!value) return 'Date to be confirmed';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
      day: 'numeric',
    });
  };

  const formatTimeLabel = (value?: string) => value?.trim() || 'Time to be confirmed';

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const formatMultiline = (value?: string) => {
    if (!value) return '';
    return escapeHtml(value).replace(/(?:\r\n|\r|\n)/g, '<br />');
  };

  const safeContact = {
    name: contact?.name?.trim() || 'Valued Client',
    email: contact?.email?.trim() || '',
    phone: contact?.phone?.trim() || 'Not provided',
    notes: contact?.notes ?? '',
  };

  const formattedDate = formatDateLabel(date);
  const formattedTime = formatTimeLabel(time);
  const safeAddress = address?.trim() || 'To be confirmed';
  const safeBookingRef = bookingRef || 'Pending-Reference';
  const amountDisplay = formatCurrency(totalAmount ?? serviceInfo.price, currency || 'USD');
  const paymentStatusLabel = paymentStatus?.toUpperCase() === 'PAID' ? 'Paid' : (paymentStatus || 'Pending');
  const paymentMethodLabel = paymentMethod || 'Credit Card';

  // Email to customer
  const customerEmailData = {
    from: process.env.RESEND_FROM_EMAIL!,
    to: [safeContact.email],
    subject: `Booking Confirmation · ${serviceInfo.name} (${safeBookingRef})`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <body style="margin:0;padding:0;background-color:#0f172a;font-family:'Helvetica Neue',Arial,sans-serif;color:#0f172a;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:24px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
                  <tr>
                    <td style="background:linear-gradient(120deg,#f97316,#fbbf24);padding:32px 24px;text-align:center;color:#ffffff;">
                      <div style="font-size:44px;line-height:1;">🎉</div>
                      <h1 style="margin:12px 0 4px;font-size:24px;">Booking Confirmed</h1>
                      <p style="margin:0;font-size:16px;">${serviceInfo.name}</p>
                      <p style="margin:14px 0 0;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;">Ref · ${safeBookingRef}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px 28px 8px;background-color:#ffffff;">
                      <p style="margin:0 0 20px;font-size:15px;color:#475569;">Hi ${safeContact.name}, we're excited to work with you. Here's a quick summary of your appointment.</p>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 12px;margin-bottom:12px;">
                        <tr>
                          <td style="width:50%;padding:16px;border:1px solid #f1f5f9;border-radius:12px;">
                            <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Appointment</p>
                            <p style="margin:0;font-size:15px;color:#0f172a;font-weight:600;">${formattedDate}</p>
                            <p style="margin:4px 0 0;font-size:13px;color:#475569;">${formattedTime}</p>
                          </td>
                          <td style="width:50%;padding:16px;border:1px solid #f1f5f9;border-radius:12px;">
                            <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Total</p>
                            <p style="margin:0;font-size:20px;color:#0f172a;font-weight:700;">${amountDisplay}</p>
                            <p style="margin:4px 0 0;font-size:13px;color:#475569;">${currency || 'USD'}</p>
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f1f5f9;border-radius:12px;padding:18px;margin-bottom:20px;">
                        <tr>
                          <td style="vertical-align:top;">
                            <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Property</p>
                            <p style="margin:0;font-size:15px;color:#0f172a;font-weight:600;">${safeAddress}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top:14px;border-top:1px solid #f1f5f9;">
                            <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Contact</p>
                            <p style="margin:0;font-size:15px;color:#0f172a;font-weight:600;">${safeContact.name}</p>
                            <p style="margin:4px 0 0;font-size:13px;color:#475569;">📧 ${safeContact.email}</p>
                            <p style="margin:2px 0 0;font-size:13px;color:#475569;">📞 ${safeContact.phone}</p>
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;background-color:#f5fbff;border:1px solid #d8eefc;padding:18px;margin-bottom:20px;">
                        <tr>
                          <td>
                            <p style="margin:0 0 6px;font-size:11px;color:#0c4a6e;letter-spacing:0.08em;text-transform:uppercase;">Payment</p>
                            <p style="margin:0;font-size:15px;color:#075985;font-weight:600;">${paymentStatusLabel}</p>
                            <p style="margin:4px 0 0;font-size:13px;color:#0c4a6e;">Method: ${paymentMethodLabel}</p>
                            ${transactionId ? `<p style="margin:4px 0 0;font-size:12px;color:#0c4a6e;font-family:monospace;">Transaction: ${transactionId}</p>` : ''}
                            ${paymentIntent && paymentIntent !== transactionId ? `<p style="margin:4px 0 0;font-size:12px;color:#0c4a6e;font-family:monospace;">Payment Intent: ${paymentIntent}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;background-color:#fefce8;border:1px solid #fef08a;padding:18px;margin-bottom:20px;">
                        <tr>
                          <td>
                            <p style="margin:0 0 10px;font-size:14px;color:#ca8a04;font-weight:600;">Next steps</p>
                            <ul style="margin:0;padding-left:18px;color:#854d0e;font-size:13px;line-height:1.7;">
                              <li>We'll send detailed prep instructions 24 hours ahead</li>
                              <li>Expect a confirmation call 1 hour before arrival</li>
                              <li>Need to reschedule? Reply to this email anytime</li>
                </ul>
                          </td>
                        </tr>
                      </table>
                      ${safeContact.notes ? `
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid #f1f5f9;padding:18px;margin-bottom:20px;">
                          <tr>
                            <td>
                              <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Special instructions</p>
                              <p style="margin:0;font-size:14px;color:#0f172a;">${formatMultiline(safeContact.notes)}</p>
                            </td>
                          </tr>
                        </table>
              ` : ''}
                      <p style="margin:0;font-size:13px;color:#475569;">If anything looks incorrect, reply to this email and our team will help right away.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px;background-color:#f8fafc;text-align:center;border-top:1px solid #e2e8f0;">
                      <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Need assistance? Email <a href="mailto:support@sneekcreatemedia.com" style="color:#f97316;text-decoration:none;">support@sneekcreatemedia.com</a> or call 1-800-SNEEK-CM.</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Sneek Create Media · Professional Real Estate Media Team</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  // Email to business owner
  const businessEmailData = {
    from: process.env.RESEND_FROM_EMAIL!,
    to: [process.env.RESEND_TO_EMAIL!],
    subject: `New booking · ${serviceInfo.name} (${safeBookingRef})`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <body style="margin:0;padding:0;background-color:#0f172a;font-family:'Helvetica Neue',Arial,sans-serif;color:#0f172a;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:24px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
                  <tr>
                    <td style="background:linear-gradient(120deg,#0ea5e9,#22d3ee);padding:30px 24px;color:#ffffff;text-align:center;">
                      <div style="font-size:40px;line-height:1;">📩</div>
                      <h1 style="margin:12px 0 4px;font-size:23px;">New booking received</h1>
                      <p style="margin:0;font-size:16px;">${serviceInfo.name}</p>
                      <p style="margin:12px 0 0;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;">Ref · ${safeBookingRef}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 28px 10px;background-color:#ffffff;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;background-color:#ecfeff;border:1px solid #bae6fd;padding:18px;margin-bottom:20px;">
                        <tr>
                          <td style="text-align:center;">
                            <p style="margin:0 0 6px;font-size:12px;color:#0f172a;letter-spacing:0.08em;text-transform:uppercase;">Revenue</p>
                            <p style="margin:0;font-size:26px;color:#0f172a;font-weight:700;">${amountDisplay}</p>
                            <p style="margin:6px 0 0;font-size:12px;color:#0369a1;">${paymentStatusLabel} • ${paymentMethodLabel}</p>
                            ${transactionId ? `<p style="margin:6px 0 0;font-size:12px;color:#0369a1;font-family:monospace;">Txn: ${transactionId}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 12px;margin-bottom:12px;">
                        <tr>
                          <td style="width:50%;padding:16px;border:1px solid #f1f5f9;border-radius:12px;">
                            <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Service</p>
                            <p style="margin:0;font-size:15px;color:#0f172a;font-weight:600;">${serviceInfo.name}</p>
                          </td>
                          <td style="width:50%;padding:16px;border:1px solid #f1f5f9;border-radius:12px;">
                            <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Schedule</p>
                            <p style="margin:0;font-size:15px;color:#0f172a;font-weight:600;">${formattedDate}</p>
                            <p style="margin:4px 0 0;font-size:13px;color:#475569;">${formattedTime}</p>
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f1f5f9;border-radius:12px;padding:18px;margin-bottom:20px;">
                        <tr>
                          <td>
                            <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Property</p>
                            <p style="margin:0;font-size:15px;color:#0f172a;font-weight:600;">${safeAddress}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top:14px;border-top:1px solid #f1f5f9;">
                            <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Client</p>
                            <p style="margin:0;font-size:15px;color:#0f172a;font-weight:600;">${safeContact.name}</p>
                            <p style="margin:4px 0 0;font-size:13px;color:#475569;">📧 ${safeContact.email}</p>
                            <p style="margin:2px 0 0;font-size:13px;color:#475569;">📞 ${safeContact.phone}</p>
                          </td>
                        </tr>
                        ${safeContact.notes ? `
                          <tr>
                            <td style="padding-top:14px;border-top:1px solid #f1f5f9;">
                              <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Notes</p>
                              <p style="margin:0;font-size:14px;color:#0f172a;">${formatMultiline(safeContact.notes)}</p>
                            </td>
                          </tr>
                ` : ''}
                      </table>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;background-color:#fef2f2;border:1px solid #fecaca;padding:16px;">
                        <tr>
                          <td>
                            <p style="margin:0 0 8px;font-size:13px;color:#b91c1c;font-weight:600;">Action items</p>
                            <ul style="margin:0;padding-left:18px;font-size:13px;color:#7f1d1d;line-height:1.6;">
                              <li>Add to calendar & confirm talent</li>
                              <li>Schedule gear prep for ${serviceInfo.name}</li>
                              <li>Send reminder + prep guide to client</li>
                </ul>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:22px;background-color:#f8fafc;text-align:center;border-top:1px solid #e2e8f0;">
                      <p style="margin:0;font-size:12px;color:#94a3b8;">Need booking data in another system? Forward this email to your automations inbox.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  try {
    // Validate email configuration
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not set');
      return {
        success: false,
        error: 'RESEND_API_KEY is not configured',
      };
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error('❌ RESEND_FROM_EMAIL is not set');
      return {
        success: false,
        error: 'RESEND_FROM_EMAIL is not configured',
      };
    }

    if (!process.env.RESEND_TO_EMAIL) {
      console.error('❌ RESEND_TO_EMAIL is not set');
      return {
        success: false,
        error: 'RESEND_TO_EMAIL is not configured',
      };
    }

    if (!safeContact.email) {
      console.error('❌ Customer email is missing');
      return {
        success: false,
        error: 'Customer email is required',
      };
    }

    console.log(`📧 Attempting to send emails:`, {
      customerEmail: safeContact.email,
      businessEmail: process.env.RESEND_TO_EMAIL,
      fromEmail: process.env.RESEND_FROM_EMAIL,
      bookingRef: bookingRef,
    });

    // Get Resend client
    const resendClient = getResendClient();

    // Send both emails
    const [customerEmail, businessEmail] = await Promise.all([
      resendClient.emails.send(customerEmailData),
      resendClient.emails.send(businessEmailData)
    ]);

    console.log(`✅ Email API responses:`, {
      customerEmailId: customerEmail.data?.id,
      customerEmailError: customerEmail.error,
      businessEmailId: businessEmail.data?.id,
      businessEmailError: businessEmail.error,
    });

    // Check if emails were actually sent
    if (customerEmail.error || businessEmail.error) {
      console.error('❌ Email sending errors:', {
        customerError: customerEmail.error,
        businessError: businessEmail.error,
      });
      return {
        success: false,
        error: `Email sending failed: ${customerEmail.error?.message || businessEmail.error?.message || 'Unknown error'}`,
        customerError: customerEmail.error,
        businessError: businessEmail.error,
      };
    }

    if (!customerEmail.data?.id || !businessEmail.data?.id) {
      console.error('❌ Email IDs not returned from Resend:', {
        customerEmailResponse: customerEmail,
        businessEmailResponse: businessEmail,
      });
      return {
        success: false,
        error: 'Email IDs not returned from Resend API',
      };
    }

    console.log(`✅ Both emails sent successfully:`, {
      customerEmailId: customerEmail.data.id,
      businessEmailId: businessEmail.data.id,
    });

    return {
      success: true,
      customerEmailId: customerEmail.data.id,
      businessEmailId: businessEmail.data.id,
    };
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}