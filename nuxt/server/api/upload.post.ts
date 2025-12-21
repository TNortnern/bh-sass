/**
 * Image Upload API
 * Uploads to Bunny CDN if configured, otherwise falls back to Payload media
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const storageApiKey = config.bunnyStorageApiKey || process.env.BUNNY_STORAGE_API_KEY
  const storageZone = config.bunnyStorageZone || process.env.BUNNY_STORAGE_ZONE
  const cdnHostname = config.bunnyCdnHostname || process.env.BUNNY_CDN_HOSTNAME
  const storageHostname = config.bunnyStorageHostname || process.env.BUNNY_STORAGE_HOSTNAME || 'storage.bunnycdn.com'

  const useBunnyCdn = storageApiKey && storageZone && cdnHostname

  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No file uploaded'
    })
  }

  const file = formData.find(part => part.name === 'file')

  if (!file || !file.data) {
    throw createError({
      statusCode: 400,
      message: 'No file found in request'
    })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const originalName = file.filename || 'upload'
  const extension = originalName.split('.').pop() || 'jpg'
  const sanitizedName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9]/g, '-') // Replace special chars
    .substring(0, 50) // Limit length
  const filename = `inventory/${timestamp}-${randomString}-${sanitizedName}.${extension}`

  try {
    // Use Bunny CDN if configured
    if (useBunnyCdn) {
      const uploadUrl = `https://${storageHostname}/${storageZone}/${filename}`

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'AccessKey': storageApiKey!,
          'Content-Type': file.type || 'application/octet-stream'
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body: file.data as any
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Bunny CDN upload error:', errorText)
        throw createError({
          statusCode: response.status,
          message: `Upload failed: ${errorText}`
        })
      }

      // Return CDN URL
      const cdnUrl = `https://${cdnHostname}/${filename}`

      return {
        success: true,
        url: cdnUrl,
        filename,
        originalName: file.filename,
        size: file.data.length,
        type: file.type
      }
    }

    // Fallback: Upload to Payload media collection
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // Create a new FormData for Payload
    const payloadFormData = new FormData()
    // Convert Buffer to Uint8Array for Blob compatibility
    const uint8Array = new Uint8Array(file.data)
    const blob = new Blob([uint8Array], { type: file.type || 'application/octet-stream' })
    payloadFormData.append('file', blob, file.filename || 'upload.jpg')
    payloadFormData.append('_payload', JSON.stringify({
      alt: file.filename || 'Uploaded image'
    }))

    // Forward cookies for authentication
    const cookieHeader = getHeader(event, 'cookie')
    const headers: Record<string, string> = {}
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }

    const payloadResponse = await fetch(`${payloadUrl}/api/media`, {
      method: 'POST',
      headers,
      body: payloadFormData
    })

    if (!payloadResponse.ok) {
      const errorText = await payloadResponse.text()
      console.error('Payload media upload error:', errorText)
      throw createError({
        statusCode: payloadResponse.status,
        message: `Upload failed: ${errorText}`
      })
    }

    const responseData = await payloadResponse.json() as { doc?: { url?: string, filename?: string } }

    // Payload returns the media document with a URL
    const mediaUrl = responseData.doc?.url
    if (!mediaUrl) {
      throw createError({
        statusCode: 500,
        message: 'Upload succeeded but no URL returned'
      })
    }

    return {
      success: true,
      url: mediaUrl,
      filename: responseData.doc?.filename || filename,
      originalName: file.filename,
      size: file.data.length,
      type: file.type
    }
  } catch (error: unknown) {
    console.error('Upload error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      message: message || 'Upload failed'
    })
  }
})
