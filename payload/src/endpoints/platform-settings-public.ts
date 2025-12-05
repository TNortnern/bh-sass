import type { Endpoint } from 'payload'

/**
 * GET /api/platform-settings/public
 * Public endpoint to check platform maintenance mode status
 * Does not require authentication
 * Returns only the maintenance mode settings, not the full platform-settings
 */
export const platformSettingsPublicEndpoint: Endpoint = {
  path: '/platform-settings/public',
  method: 'get',
  handler: async (req) => {
    try {
      // Fetch platform settings (bypass access control with overrideAccess)
      const settings = await req.payload.findGlobal({
        slug: 'platform-settings',
        overrideAccess: true, // Allow public access to read these settings
      })

      // Get client IP from request headers
      const clientIP =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        'unknown'

      // Check if client IP is in allowed list
      const allowedIPs = settings?.maintenanceMode?.allowedIPs || []
      const isIPAllowed = allowedIPs.some((item: { ip: string }) => item.ip === clientIP)

      // Return only maintenance mode info (don't expose other settings)
      return Response.json({
        maintenanceMode: {
          enabled: settings?.maintenanceMode?.enabled || false,
          message: settings?.maintenanceMode?.message,
          endTime: settings?.maintenanceMode?.endTime,
          // Don't expose the full IP list for security
          isIPAllowed,
        },
      })
    } catch (error) {
      // If we can't fetch settings, return maintenance disabled
      // This prevents blocking users if database is temporarily unavailable
      console.error('Failed to fetch platform settings:', error)
      return Response.json({
        maintenanceMode: {
          enabled: false,
        },
      })
    }
  },
}
