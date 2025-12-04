/**
 * Email Template Preview API
 * GET /api/email-templates/:name/preview
 * Returns rendered HTML preview with sample data
 */
export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')

  if (!name) {
    throw createError({ statusCode: 400, message: 'Template name required' })
  }

  const config = useRuntimeConfig()

  try {
    // Fetch preview from Payload
    const response = await $fetch<{
      name: string
      subject: string
      html: string
      text: string
      sampleData: Record<string, any>
    }>(`${config.payloadApiUrl}/api/email/preview/${name}`)

    return response
  } catch (error: any) {
    console.error('Failed to fetch email preview:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to load preview'
    })
  }
})
