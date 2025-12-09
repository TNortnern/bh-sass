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
      sampleData: Record<string, unknown>
    }>(`${config.payloadApiUrl}/api/email/preview/${name}`)

    return response
  } catch (error: unknown) {
    console.error('Failed to fetch email preview:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to load preview'
    })
  }
})
