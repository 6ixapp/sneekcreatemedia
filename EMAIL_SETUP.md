# Email Setup Instructions

## Resend Email Configuration

This application uses Resend for sending booking confirmation emails. Follow these steps to set it up:

### 1. Get Resend API Key

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to API Keys in your dashboard
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

Update your `.env.local` file with the following variables:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=your_business_email@yourdomain.com

# Next.js Environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Domain Verification (For Production)

For production use, you'll need to verify your domain with Resend:

1. Add your domain in the Resend dashboard
2. Add the required DNS records to verify ownership
3. Update `RESEND_FROM_EMAIL` to use your verified domain

### 4. Test the Setup

1. Complete a booking through the booking flow
2. Check that emails are sent to both:
   - Customer confirmation email
   - Business notification email

## Email Features

### Customer Email Includes:
- Booking confirmation with reference number
- Service details (name, date, time, address)
- Contact information
- Order summary with total amount
- Next steps and what to expect
- Professional HTML styling

### Business Email Includes:
- New booking notification
- Revenue amount highlighted
- Complete booking details
- Customer contact information
- Action items checklist
- Professional HTML styling

## Customization

You can customize the email templates in `lib/email.ts`:
- Update email styling and branding
- Modify email content
- Add additional booking information
- Change email subjects and formatting

## Troubleshooting

- Ensure your Resend API key is correctly set
- Check that your domain is verified for production
- Verify email addresses are valid
- Check server logs for email sending errors
- Test with different email providers to ensure deliverability