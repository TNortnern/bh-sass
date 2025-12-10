export default defineNuxtPlugin(() => {
  // This plugin ensures GrapesJS is only loaded on the client side
  // The actual import happens in the composable when needed
  if (import.meta.client) {
    console.log('[GrapesJS Plugin] Client-side initialization ready')
  }
})
