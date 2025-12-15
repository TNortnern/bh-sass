import type { Payload } from 'payload'
import { emailService } from '../lib/email'
import { getTimezoneForAddress, calculateReminderWindowInTimezone } from '../lib/timezone'

// Store interval reference for graceful shutdown
let bookingReminderInterval: NodeJS.Timeout | null = null

/**
 * Booking reminder job - sends 24-hour before booking reminders
 * Uses timezone-aware calculation for accurate reminder timing
 * Runs every hour, finds bookings scheduled for 24-25 hours from now in customer's timezone
 */
export async function startBookingReminderJob(payload: Payload): Promise<NodeJS.Timeout> {
  payload.logger.info('[REMINDER] Starting booking reminder job (runs every 60 minutes)')

  // Setup graceful shutdown handlers
  setupShutdownHandlers(payload)

  // Run immediately on startup
  await processBookingReminders(payload).catch((error) => {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(`[REMINDER] Initial run error: ${message}`)
  })

  // Then run every hour
  bookingReminderInterval = setInterval(
    async () => {
      try {
        await processBookingReminders(payload)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        payload.logger.error(`[REMINDER] Interval run error: ${message}`)
      }
    },
    60 * 60 * 1000, // 60 minutes
  )

  return bookingReminderInterval
}

/**
 * Stop the booking reminder job
 */
export function stopBookingReminderJob(interval: NodeJS.Timeout | null): void {
  if (interval) {
    clearInterval(interval)
    bookingReminderInterval = null
  }
}

/**
 * Setup Node.js signal handlers for graceful shutdown
 */
function setupShutdownHandlers(payload: Payload): void {
  const shutdownHandler = async (signal: string) => {
    payload.logger.info(`[REMINDER] Received ${signal}, cleaning up reminder job...`)
    stopBookingReminderJob(bookingReminderInterval)
    payload.logger.info('[REMINDER] Booking reminder job stopped')
  }

  // Only setup once
  if (!process.listenerCount('SIGTERM')) {
    process.on('SIGTERM', () => shutdownHandler('SIGTERM'))
  }
  if (!process.listenerCount('SIGINT')) {
    process.on('SIGINT', () => shutdownHandler('SIGINT'))
  }
}

/**
 * Process bookings and send reminders to customers 24 hours before event
 * Uses timezone-aware calculation for accurate reminder timing
 */
async function processBookingReminders(payload: Payload): Promise<void> {
  const startTime = Date.now()
  let totalBookingsChecked = 0
  let successCount = 0
  let failureCount = 0

  try {
    // Use a simple UTC window for initial query (broader range to be safe)
    const now = new Date()
    const queryStart = new Date(now.getTime() + 23 * 60 * 60 * 1000) // 23 hours
    const queryEnd = new Date(now.getTime() + 26 * 60 * 60 * 1000) // 26 hours

    payload.logger.info(
      `[REMINDER] Starting job run - querying bookings between ${queryStart.toISOString()} and ${queryEnd.toISOString()}`
    )

    // Query bookings in the approximate window where reminder might need to be sent
    const bookingsResult = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          {
            startDate: {
              greater_than_equal: queryStart.toISOString(),
            },
          },
          {
            startDate: {
              less_than: queryEnd.toISOString(),
            },
          },
          {
            reminderSent: {
              equals: false,
            },
          },
        ],
      },
      limit: 1000,
    })

    totalBookingsChecked = bookingsResult.docs.length

    if (totalBookingsChecked === 0) {
      payload.logger.info('[REMINDER] No reminders to send this run')
      return
    }

    payload.logger.info(`[REMINDER] Found ${totalBookingsChecked} candidate bookings for reminder`)

    // Process each booking reminder in non-blocking way
    setImmediate(async () => {
      for (const booking of bookingsResult.docs) {
        try {
          // Get customer data
          const customerId = typeof booking.customerId === 'object' ? booking.customerId.id : booking.customerId
          const customer = typeof booking.customerId === 'object'
            ? booking.customerId
            : await payload.findByID({ collection: 'customers', id: customerId })

          if (!customer?.email) {
            payload.logger.warn(`[REMINDER] Booking ${booking.id}: customer has no email`)
            failureCount++
            continue
          }

          // Get tenant data
          const tenantId = typeof booking.tenantId === 'object' ? booking.tenantId.id : booking.tenantId
          const tenant = typeof booking.tenantId === 'object'
            ? booking.tenantId
            : await payload.findByID({ collection: 'tenants', id: tenantId })

          if (!tenant) {
            payload.logger.warn(`[REMINDER] Booking ${booking.id}: tenant not found`)
            failureCount++
            continue
          }

          // Get timezone for delivery address (hybrid approach)
          const tenantDefaultTimezone = tenant.settings?.timezone || 'America/New_York'
          const timezone = await getTimezoneForAddress(booking.deliveryAddress, tenantDefaultTimezone, payload.logger)

          // Calculate reminder window in customer's timezone
          const reminderWindow = calculateReminderWindowInTimezone(now, timezone)

          // Check if booking start date falls within the 24-25 hour window (in customer's timezone)
          const bookingStartDate = new Date(booking.startDate)
          const isInReminderWindow =
            bookingStartDate >= reminderWindow.reminderStart && bookingStartDate < reminderWindow.reminderEnd

          if (!isInReminderWindow) {
            payload.logger.debug(
              `[REMINDER] Booking ${booking.id}: start date ${bookingStartDate.toISOString()} not in customer's reminder window`
            )
            continue
          }

          // Get rental item data
          const rentalItemId = typeof booking.rentalItemId === 'object' ? booking.rentalItemId.id : booking.rentalItemId
          const rentalItem = typeof booking.rentalItemId === 'object'
            ? booking.rentalItemId
            : await payload.findByID({ collection: 'rental-items', id: rentalItemId })

          // Format location
          const location = booking.deliveryAddress
            ? `${booking.deliveryAddress.street}, ${booking.deliveryAddress.city}, ${booking.deliveryAddress.state} ${booking.deliveryAddress.zipCode}`
            : 'TBD'

          // Send reminder email (may throw if email service fails)
          try {
            await emailService.sendBookingReminder(
              {
                id: booking.id,
                eventDate: booking.startDate,
                eventTime: new Date(booking.startDate).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZone: timezone,
                }),
                location,
                totalAmount: booking.totalPrice || 0,
                status: booking.status,
                item: rentalItem ? { id: rentalItem.id, name: rentalItem.name } : undefined,
              },
              {
                id: customer.id,
                name: `${customer.firstName} ${customer.lastName}`,
                email: customer.email,
                phone: customer.phone,
              },
              {
                id: tenant.id,
                name: tenant.name,
                domain: tenant.slug,
              },
            )

            // Mark booking as reminded ONLY after email is successfully sent
            await payload.update({
              collection: 'bookings',
              id: booking.id,
              data: {
                reminderSent: true,
                reminderSentAt: new Date().toISOString(),
              },
            })

            successCount++
            payload.logger.info(
              `[REMINDER] Booking ${booking.id}: reminder sent (timezone: ${timezone}, customer: ${customer.email})`
            )
          } catch (emailError) {
            const emailMessage = emailError instanceof Error ? emailError.message : 'Unknown error'
            payload.logger.error(`[REMINDER] Booking ${booking.id}: email send failed: ${emailMessage}`)
            failureCount++
            // Don't mark as reminded if email failed - will retry next run
          }
        } catch (error) {
          failureCount++
          const message = error instanceof Error ? error.message : 'Unknown error'
          payload.logger.error(`[REMINDER] Booking ${booking.id}: processing failed: ${message}`)
          // Continue with next booking even if one fails
        }
      }

      // Log summary AFTER all bookings have been processed
      const duration = Date.now() - startTime
      payload.logger.info(
        `[REMINDER] Job completed: checked=${totalBookingsChecked}, sent=${successCount}, failed=${failureCount}, duration=${duration}ms`
      )
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(`[REMINDER] Query error: ${message}`)
    // Don't throw - allow next interval to run
  }
}
