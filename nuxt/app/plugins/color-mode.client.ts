export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  // Set dark mode as default if no preference is set
  if (!colorMode.preference || colorMode.preference === 'system') {
    colorMode.preference = 'dark'
  }
})
