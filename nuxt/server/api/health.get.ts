export default defineEventHandler(async () => {
  return {
    status: 'healthy',
    service: 'nuxt',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  }
})
