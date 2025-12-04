/**
 * Email Templates List API
 * GET /api/email-templates
 */
export default defineEventHandler(async () => {
  const templates = [
    {
      id: 'BOOKING_CONFIRMATION',
      name: 'Booking Confirmation',
      description: 'Sent when a booking is confirmed',
      trigger: 'On booking creation'
    },
    {
      id: 'BOOKING_REMINDER',
      name: 'Booking Reminder',
      description: 'Sent 24 hours before event',
      trigger: 'Scheduled - 24h before'
    },
    {
      id: 'BOOKING_CANCELLED',
      name: 'Booking Cancelled',
      description: 'Sent when booking is cancelled',
      trigger: 'On booking cancellation'
    },
    {
      id: 'PAYMENT_RECEIVED',
      name: 'Payment Received',
      description: 'Receipt sent after payment',
      trigger: 'On payment success'
    },
    {
      id: 'PASSWORD_RESET',
      name: 'Password Reset',
      description: 'Password reset link',
      trigger: 'On password reset request'
    },
    {
      id: 'WELCOME',
      name: 'Welcome',
      description: 'Welcome email for new users',
      trigger: 'On user registration'
    }
  ]

  return { templates }
})
