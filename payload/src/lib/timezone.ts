import axios from 'axios'
import type { Payload } from 'payload'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { addHours } from 'date-fns'

/**
 * Get timezone for a location using Google Maps Timezone API
 * Hybrid approach: Google Maps geolocation first, tenant fallback
 */
export async function getTimezoneForAddress(
  address: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
  },
  tenantTimezone: string,
  logger: Payload['logger']
): Promise<string> {
  try {
    // If no address or Google Maps API key not configured, use tenant timezone
    if (!address?.city || !process.env.GOOGLE_MAPS_API_KEY) {
      logger.debug(`[TIMEZONE] No address or API key, using tenant timezone: ${tenantTimezone}`)
      return tenantTimezone
    }

    // Format address for geocoding
    const geocodingAddress = [address.street, address.city, address.state, address.zipCode]
      .filter(Boolean)
      .join(', ')

    logger.debug(`[TIMEZONE] Looking up timezone for address: ${geocodingAddress}`)

    // Step 1: Geocode the address to get lat/lng
    const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: geocodingAddress,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 5000,
    })

    if (geocodeResponse.data.results.length === 0) {
      logger.warn(`[TIMEZONE] No geocoding results for address: ${geocodingAddress}, using tenant timezone`)
      return tenantTimezone
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location

    // Step 2: Get timezone for the lat/lng
    const timezoneResponse = await axios.get('https://maps.googleapis.com/maps/api/timezone/json', {
      params: {
        location: `${lat},${lng}`,
        timestamp: Math.floor(Date.now() / 1000),
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 5000,
    })

    if (timezoneResponse.data.status !== 'OK') {
      logger.warn(
        `[TIMEZONE] Timezone API returned ${timezoneResponse.data.status}, using tenant timezone: ${tenantTimezone}`
      )
      return tenantTimezone
    }

    const timezone = timezoneResponse.data.timeZoneId

    logger.debug(
      `[TIMEZONE] Successfully resolved timezone for address: ${geocodingAddress} -> ${timezone} (lat: ${lat}, lng: ${lng})`
    )

    return timezone
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    logger.warn(`[TIMEZONE] Error resolving address timezone: ${message}, using tenant timezone: ${tenantTimezone}`)
    return tenantTimezone
  }
}

/**
 * Convert a UTC date to customer's timezone and calculate reminder window
 * @param utcNow Current time in UTC
 * @param timezone Customer's timezone (IANA format, e.g., 'America/New_York')
 * @returns Object with reminder window start and end times in UTC
 */
export function calculateReminderWindowInTimezone(utcNow: Date, timezone: string): {
  reminderStart: Date
  reminderEnd: Date
  customerLocalTime: Date
} {
  try {
    // Convert UTC time to customer's local timezone using date-fns-tz
    // This handles DST transitions correctly
    const customerLocalTime = toZonedTime(utcNow, timezone)

    // Calculate reminder window in customer's local time (24-25 hours from now)
    // addHours uses the customer's timezone context for accurate calculation
    const reminderStartLocal = addHours(customerLocalTime, 24)
    const reminderEndLocal = addHours(customerLocalTime, 25)

    // Convert back to UTC using fromZonedTime
    // This properly accounts for DST when converting back to UTC
    const reminderStart = fromZonedTime(reminderStartLocal, timezone)
    const reminderEnd = fromZonedTime(reminderEndLocal, timezone)

    return {
      reminderStart,
      reminderEnd,
      customerLocalTime,
    }
  } catch (error) {
    // Fallback: use simple 24-25 hour window from UTC now
    const reminderStart = new Date(utcNow.getTime() + 24 * 60 * 60 * 1000)
    const reminderEnd = new Date(utcNow.getTime() + 25 * 60 * 60 * 1000)
    return {
      reminderStart,
      reminderEnd,
      customerLocalTime: utcNow,
    }
  }
}
