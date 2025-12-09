/**
 * POST /api/upload-from-url
 * Download an image from URL and re-upload to Bunny CDN
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const storageApiKey = config.bunnyStorageApiKey || process.env.BUNNY_STORAGE_API_KEY
  const storageZone = config.bunnyStorageZone || process.env.BUNNY_STORAGE_ZONE
  const cdnHostname = config.bunnyCdnHostname || process.env.BUNNY_CDN_HOSTNAME
  const storageHostname = config.bunnyStorageHostname || process.env.BUNNY_STORAGE_HOSTNAME || 'storage.bunnycdn.com'

  if (!storageApiKey || !storageZone || !cdnHostname) {
    throw createError({
      statusCode: 500,
      message: 'Bunny CDN not configured'
    })
  }

  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL is required'
    })
  }

  // Validate URL
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    throw createError({
      statusCode: 400,
      message: 'Invalid URL provided'
    })
  }

  // Check if already a Bunny CDN URL
  if (url.includes(cdnHostname) || url.includes('b-cdn.net')) {
    return {
      success: true,
      url: url,
      message: 'URL is already hosted on Bunny CDN'
    }
  }

  try {
    // Download the image
    const imageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BH-SaaS/1.0; +https://bouncepro.app)'
      }
    })

    if (!imageResponse.ok) {
      throw createError({
        statusCode: 400,
        message: `Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`
      })
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

    // Validate it's an image
    if (!contentType.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        message: 'URL does not point to a valid image'
      })
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const imageData = Buffer.from(imageBuffer)

    // Limit file size (10MB)
    if (imageData.length > 10 * 1024 * 1024) {
      throw createError({
        statusCode: 400,
        message: 'Image is too large (max 10MB)'
      })
    }

    // Generate filename from URL or create new one
    const urlPath = parsedUrl.pathname
    const originalExt = urlPath.split('.').pop()?.toLowerCase() || 'jpg'
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    const extension = validExtensions.includes(originalExt) ? originalExt : 'jpg'

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const filename = `inventory/${timestamp}-${randomString}.${extension}`

    // Upload to Bunny CDN Storage
    const uploadUrl = `https://${storageHostname}/${storageZone}/${filename}`

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': storageApiKey,
        'Content-Type': contentType
      },
      body: imageData
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Bunny CDN upload error:', errorText)
      throw createError({
        statusCode: uploadResponse.status,
        message: `Upload failed: ${errorText}`
      })
    }

    // Return CDN URL
    const cdnUrl = `https://${cdnHostname}/${filename}`

    return {
      success: true,
      url: cdnUrl,
      filename,
      originalUrl: url,
      size: imageData.length,
      type: contentType
    }
  } catch (error: unknown) {
    console.error('Upload from URL error:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: (error as Error).message || 'Failed to upload image from URL'
    })
  }
})
