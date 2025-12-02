/**
 * Composable for handling unsaved changes warnings
 * Shows a confirmation dialog instead of window.confirm
 */

export function useUnsavedChanges() {
  const hasUnsavedChanges = ref(false)
  const showLeaveDialog = ref(false)
  const pendingNavigation = ref<string | null>(null)
  const router = useRouter()

  // Set up the route guard
  onBeforeRouteLeave((to) => {
    if (hasUnsavedChanges.value && !pendingNavigation.value) {
      pendingNavigation.value = to.fullPath
      showLeaveDialog.value = true
      return false // Block navigation
    }
    return true
  })

  const confirmLeave = () => {
    showLeaveDialog.value = false
    hasUnsavedChanges.value = false
    if (pendingNavigation.value) {
      const path = pendingNavigation.value
      pendingNavigation.value = null
      router.push(path)
    }
  }

  const cancelLeave = () => {
    showLeaveDialog.value = false
    pendingNavigation.value = null
  }

  const markDirty = () => {
    hasUnsavedChanges.value = true
  }

  const markClean = () => {
    hasUnsavedChanges.value = false
  }

  return {
    hasUnsavedChanges,
    showLeaveDialog,
    confirmLeave,
    cancelLeave,
    markDirty,
    markClean
  }
}
