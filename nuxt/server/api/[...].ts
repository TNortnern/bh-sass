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

    const authorization = getHeader(event, 'authorization')
    if (authorization) headers['Authorization'] = authorization

    const contentType = getHeader(event, 'content-type')

    // Get body for non-GET requests
    let body: string | FormData | Buffer | undefined
    if (method !== 'GET' && method !== 'HEAD') {
      // Check if this is a multipart/form-data request (file upload)
      if (contentType?.includes('multipart/form-data')) {
        // For multipart form data, read and reconstruct the FormData
        const formData = await readMultipartFormData(event)
        if (formData) {
          const newFormData = new FormData()
          for (const field of formData) {
            if (field.filename) {
              // This is a file field
              const blob = new Blob([field.data], { type: field.type || 'application/octet-stream' })
              newFormData.append(field.name || 'file', blob, field.filename)
            } else {
              // This is a regular field
              newFormData.append(field.name || '', field.data.toString())
            }
          }
          body = newFormData
          // Don't set Content-Type for FormData - fetch will set it with the boundary
        }
      } else {
        // For other content types, read as raw body
        if (contentType) headers['Content-Type'] = contentType
        const rawBody = await readRawBody(event)
        if (rawBody) body = rawBody
      }
    } else {
      if (contentType) headers['Content-Type'] = contentType
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
