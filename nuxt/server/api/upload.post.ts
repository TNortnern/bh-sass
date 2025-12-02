/**
 * Bunny CDN Upload API
 * Handles file uploads to Bunny CDN storage
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
    // Upload to Bunny CDN Storage
    const uploadUrl = `https://${storageHostname}/${storageZone}/${filename}`

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': storageApiKey,
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: file.data
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
  } catch (error: any) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Upload failed'
    })
  }
})
