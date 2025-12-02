/**
 * Email Service Examples
 * This file demonstrates how to use the email service
 * You can run this file to test your Brevo integration
 */

import { emailService } from './index'
import type { BookingData, CustomerData, TenantData, PaymentData, UserData } from './types'

/**
 * Example 1: Send Booking Confirmation
 */
export async function exampleBookingConfirmation() {
  const booking: BookingData = {
    id: 'BK-2025-001',
    eventDate: '2025-12-25',
    eventTime: '2:00 PM',
    location: '123 Main Street, Springfield, IL 62701',
    totalAmount: 299.99,
    status: 'confirmed',
    item: {
      id: 'item-1',
      name: 'Super Jumper Deluxe',
      description: 'Large bounce house with slide',
    },
  }

  const customer: CustomerData = {
    id: 'cust-1',
    name: 'John Doe',
    email: 'john.doe@example.com', // Replace with your test email
    phone: '(555) 123-4567',
  }

  const tenant: TenantData = {
    id: 'tenant-1',
    name: 'ABC Bounce Rentals',
    email: 'info@abcbounce.com',
    domain: 'abcbounce',
  }

  try {
    await emailService.sendBookingConfirmation(booking, customer, tenant)
    console.log('✅ Booking confirmation sent successfully!')
  } catch (error) {
    console.error('❌ Failed to send booking confirmation:', error)
  }
}

/**
 * Example 2: Send Booking Reminder
 */
export async function exampleBookingReminder() {
  const booking: BookingData = {
    id: 'BK-2025-002',
    eventDate: '2025-12-01',
    eventTime: '10:00 AM',
    location: '456 Oak Avenue, Springfield, IL 62702',
    totalAmount: 199.99,
    status: 'confirmed',
    item: {
      id: 'item-2',
      name: 'Princess Castle',
      description: 'Pink castle bounce house',
    },
  }

  const customer: CustomerData = {
    id: 'cust-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com', // Replace with your test email
  }

  const tenant: TenantData = {
    id: 'tenant-1',
    name: 'ABC Bounce Rentals',
  }

  try {
    await emailService.sendBookingReminder(booking, customer, tenant)
    console.log('✅ Booking reminder sent successfully!')
  } catch (error) {
    console.error('❌ Failed to send booking reminder:', error)
  }
}

/**
 * Example 3: Send Booking Cancellation
 */
export async function exampleBookingCancellation() {
  const booking: BookingData = {
    id: 'BK-2025-003',
    eventDate: '2025-12-15',
    eventTime: '3:00 PM',
    location: '789 Elm Street, Springfield, IL 62703',
    totalAmount: 249.99,
    status: 'cancelled',
    item: {
      id: 'item-3',
      name: 'Water Slide Combo',
    },
  }

  const customer: CustomerData = {
    id: 'cust-3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com', // Replace with your test email
  }

  const tenant: TenantData = {
    id: 'tenant-1',
    name: 'ABC Bounce Rentals',
  }

  const refundAmount = 124.99 // 50% refund

  try {
    await emailService.sendBookingCancellation(booking, customer, tenant, refundAmount)
    console.log('✅ Booking cancellation sent successfully!')
  } catch (error) {
    console.error('❌ Failed to send booking cancellation:', error)
  }
}

/**
 * Example 4: Send Payment Receipt
 */
export async function examplePaymentReceipt() {
  const booking: BookingData = {
    id: 'BK-2025-004',
    eventDate: '2026-01-10',
    eventTime: '1:00 PM',
    location: '321 Pine Road, Springfield, IL 62704',
    totalAmount: 349.99,
    status: 'confirmed',
    item: {
      id: 'item-4',
      name: 'Obstacle Course',
    },
  }

  const payment: PaymentData = {
    id: 'PAY-2025-001',
    amount: 174.99,
    paymentDate: '2025-11-30',
    paymentMethod: 'Credit Card (Stripe)',
    status: 'succeeded',
    booking,
  }

  const customer: CustomerData = {
    id: 'cust-4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com', // Replace with your test email
  }

  const tenant: TenantData = {
    id: 'tenant-1',
    name: 'ABC Bounce Rentals',
  }

  const remainingBalance = 175.00

  try {
    await emailService.sendPaymentReceipt(payment, booking, customer, tenant, remainingBalance)
    console.log('✅ Payment receipt sent successfully!')
  } catch (error) {
    console.error('❌ Failed to send payment receipt:', error)
  }
}

/**
 * Example 5: Send Payment Receipt (Paid in Full)
 */
export async function examplePaymentReceiptFullyPaid() {
  const booking: BookingData = {
    id: 'BK-2025-005',
    eventDate: '2026-02-14',
    eventTime: '11:00 AM',
    location: '555 Maple Drive, Springfield, IL 62705',
    totalAmount: 199.99,
    status: 'confirmed',
    item: {
      id: 'item-5',
      name: 'Mini Bouncer',
    },
  }

  const payment: PaymentData = {
    id: 'PAY-2025-002',
    amount: 199.99,
    paymentDate: '2025-11-30',
    paymentMethod: 'Credit Card (Stripe)',
    status: 'succeeded',
    booking,
  }

  const customer: CustomerData = {
    id: 'cust-5',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com', // Replace with your test email
  }

  const tenant: TenantData = {
    id: 'tenant-1',
    name: 'ABC Bounce Rentals',
  }

  try {
    await emailService.sendPaymentReceipt(payment, booking, customer, tenant) // No remaining balance = paid in full
    console.log('✅ Payment receipt (paid in full) sent successfully!')
  } catch (error) {
    console.error('❌ Failed to send payment receipt:', error)
  }
}

/**
 * Example 6: Send Password Reset
 */
export async function examplePasswordReset() {
  const user: UserData = {
    id: 'user-1',
    name: 'David Miller',
    email: 'david.miller@example.com', // Replace with your test email
  }

  const resetLink = 'https://app.bouncepro.com/reset-password?token=abc123xyz789'

  try {
    await emailService.sendPasswordReset(user, resetLink)
    console.log('✅ Password reset email sent successfully!')
  } catch (error) {
    console.error('❌ Failed to send password reset:', error)
  }
}

/**
 * Example 7: Send Welcome Email
 */
export async function exampleWelcomeEmail() {
  const user: UserData = {
    id: 'user-2',
    name: 'Emily Davis',
    email: 'emily.davis@example.com', // Replace with your test email
  }

  const tenant: TenantData = {
    id: 'tenant-1',
    name: 'ABC Bounce Rentals',
    email: 'info@abcbounce.com',
    domain: 'abcbounce',
  }

  try {
    await emailService.sendWelcome(user, tenant)
    console.log('✅ Welcome email sent successfully!')
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error)
  }
}

/**
 * Example 8: Send Custom Email
 */
export async function exampleCustomEmail() {
  const htmlContent = `
    <h1>Special Holiday Promotion!</h1>
    <p>Dear Valued Customer,</p>
    <p>Get 20% off all bookings made this weekend!</p>
    <p>Use code: <strong>HOLIDAY20</strong></p>
    <p>This offer expires Monday at midnight.</p>
    <p>Best regards,<br>The BouncePro Team</p>
  `

  const textContent = `
Special Holiday Promotion!

Dear Valued Customer,

Get 20% off all bookings made this weekend!

Use code: HOLIDAY20

This offer expires Monday at midnight.

Best regards,
The BouncePro Team
  `

  try {
    await emailService.sendCustomEmail(
      { email: 'customer@example.com', name: 'Valued Customer' }, // Replace with your test email
      'Special Holiday Promotion - 20% Off!',
      htmlContent,
      textContent,
      ['promotion', 'holiday']
    )
    console.log('✅ Custom email sent successfully!')
  } catch (error) {
    console.error('❌ Failed to send custom email:', error)
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🚀 Starting email examples...\n')

  console.log('1️⃣  Sending booking confirmation...')
  await exampleBookingConfirmation()

  console.log('\n2️⃣  Sending booking reminder...')
  await exampleBookingReminder()

  console.log('\n3️⃣  Sending booking cancellation...')
  await exampleBookingCancellation()

  console.log('\n4️⃣  Sending payment receipt (partial)...')
  await examplePaymentReceipt()

  console.log('\n5️⃣  Sending payment receipt (paid in full)...')
  await examplePaymentReceiptFullyPaid()

  console.log('\n6️⃣  Sending password reset...')
  await examplePasswordReset()

  console.log('\n7️⃣  Sending welcome email...')
  await exampleWelcomeEmail()

  console.log('\n8️⃣  Sending custom email...')
  await exampleCustomEmail()

  console.log('\n✨ All examples completed!')
}

/**
 * To run this file:
 *
 * 1. Make sure BREVO_API_KEY is set in your .env file
 * 2. Replace all email addresses with your test email
 * 3. Run one of the following:
 *
 * // Run all examples
 * node --loader ts-node/esm src/lib/email/example.ts
 *
 * // Or import and run individual examples in your code
 * import { exampleBookingConfirmation } from '@/lib/email/example'
 * await exampleBookingConfirmation()
 */

// Uncomment to run when executing this file directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   runAllExamples().catch(console.error)
// }
