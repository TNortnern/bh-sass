/**
 * Catch-all API proxy to Payload CMS
 * This handles any /api/* requests that aren't matched by specific routes
 * (e.g., rental-items, upload, widget are handled by their own routes)
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

  // Get the full path after /api/
  const path = event.path

  // Forward the request to Payload
  const targetUrl = `${payloadUrl}${path}`

  try {
    // Get request details
    const method = event.method
    const headers: Record<string, string> = {}

    // Forward relevant headers
    const cookieHeader = getHeader(event, 'cookie')
    if (cookieHeader) headers['Cookie'] = cookieHeader

    const contentType = getHeader(event, 'content-type')
    if (contentType) headers['Content-Type'] = contentType

    const authorization = getHeader(event, 'authorization')
    if (authorization) headers['Authorization'] = authorization

    // Get body for non-GET requests
    let body: string | undefined
    if (method !== 'GET' && method !== 'HEAD') {
      const rawBody = await readRawBody(event)
      if (rawBody) body = rawBody
    }

    // Make the proxied request
    const response = await fetch(targetUrl, {
      method,
      headers,
      body
    })

    // Forward response headers
    const responseContentType = response.headers.get('content-type')
    if (responseContentType) {
      setHeader(event, 'content-type', responseContentType)
    }

    // Set status code
    setResponseStatus(event, response.status)

    // Return response body
    const responseText = await response.text()
    try {
      return JSON.parse(responseText)
    } catch {
      return responseText
    }
  } catch (error: any) {
    console.error('Proxy error:', error)
    throw createError({
      statusCode: 502,
      message: `Proxy error: ${error.message}`
    })
  }
})
