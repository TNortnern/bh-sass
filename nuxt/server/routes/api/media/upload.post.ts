export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // Get current user
    const userResponse = await $fetch<any>(`${payloadUrl}/api/users/me`, {
      headers: {
        Cookie: event.headers.get('cookie') || '',
      },
    })

    if (!userResponse || !userResponse.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    // Get tenant ID
    const tenantId = typeof userResponse.user.tenantId === 'object'
      ? userResponse.user.tenantId.id
      : userResponse.user.tenantId

    // Parse multipart form data
    const form = await readMultipartFormData(event)
    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No file uploaded',
      })
    }

    const fileItem = form.find(item => item.name === 'file')
    if (!fileItem || !fileItem.data) {
      throw createError({
        statusCode: 400,
        message: 'No file found in upload',
      })
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (fileItem.data.length > maxSize) {
      throw createError({
        statusCode: 413,
        message: 'File size exceeds 5MB limit',
      })
    }

    // Create FormData for Payload API
    const formData = new FormData()
    const blob = new Blob([fileItem.data], { type: fileItem.type || 'application/octet-stream' })
    formData.append('file', blob, fileItem.filename || 'upload')
    formData.append('alt', fileItem.filename || 'Uploaded image')
    if (tenantId) {
      formData.append('tenantId', tenantId)
    }

    // Upload to Payload
    const uploadResponse = await $fetch<any>(`${payloadUrl}/api/media`, {
      method: 'POST',
      headers: {
        Cookie: event.headers.get('cookie') || '',
      },
      body: formData,
    })

    // Return the uploaded media document
    return {
      id: uploadResponse.doc.id,
      url: uploadResponse.doc.url,
      filename: uploadResponse.doc.filename,
      mimeType: uploadResponse.doc.mimeType,
      filesize: uploadResponse.doc.filesize,
    }
  } catch (error: any) {
    console.error('Failed to upload media:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error?.data?.errors?.[0]?.message || 'Failed to upload file',
    })
  }
})
