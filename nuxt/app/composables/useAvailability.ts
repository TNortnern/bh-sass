export interface Blackout {
  id: string
  rentalItemId: string
  rentalItemName?: string
  startDate: string
  endDate: string
  reason: 'maintenance' | 'repair' | 'booked' | 'seasonal' | 'other'
  notes?: string
  isActive: boolean
}

export const useAvailability = () => {
  const blackouts = ref<Blackout[]>([])
  const isLoading = ref(false)
  const toast = useToast()

  /**
   * Fetch blackouts from Payload CMS
   */
  const fetchBlackouts = async () => {
    isLoading.value = true
    try {
      const response = await $fetch<{ docs: Array<Record<string, unknown>> }>('/api/availability', {
        credentials: 'include',
        headers: useRequestHeaders(['cookie'])
      })

      blackouts.value = response.docs.map((item: Record<string, unknown>) => {
        const rentalItemId = item.rentalItemId as Record<string, unknown> | string | number | null | undefined
        const isRelation = rentalItemId && typeof rentalItemId === 'object' && 'id' in rentalItemId

        return {
          id: String(item.id || ''),
          rentalItemId: isRelation
            ? String(rentalItemId.id || '')
            : String(rentalItemId || ''),
          rentalItemName: isRelation && 'name' in rentalItemId
            ? String(rentalItemId.name || '')
            : undefined,
          startDate: String(item.startDate || ''),
          endDate: String(item.endDate || ''),
          reason: (item.reason || 'other') as Blackout['reason'],
          notes: item.notes ? String(item.notes) : undefined,
          isActive: Boolean(item.isActive ?? true)
        }
      })

      return { success: true }
    } catch (error: unknown) {
      const errorData = error as { data?: { message?: string } }
      console.error('Failed to fetch blackouts:', error)
      toast.add({
        title: 'Error',
        description: errorData.data?.message || 'Failed to load blackouts',
        color: 'error'
      })
      return { success: false, error }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch blackouts for a specific rental item
   */
  const fetchBlackoutsForItem = async (rentalItemId: string) => {
    isLoading.value = true
    try {
      const response = await $fetch<{ docs: Array<Record<string, unknown>> }>('/api/availability', {
        credentials: 'include',
        headers: useRequestHeaders(['cookie']),
        params: {
          where: {
            rentalItemId: { equals: parseInt(rentalItemId) }
          },
          sort: '-startDate',
          limit: 100
        }
      })

      blackouts.value = response.docs.map((item: Record<string, unknown>) => {
        const rentalItemId = item.rentalItemId as Record<string, unknown> | string | number | null | undefined
        const isRelation = rentalItemId && typeof rentalItemId === 'object' && 'id' in rentalItemId

        return {
          id: String(item.id || ''),
          rentalItemId: isRelation
            ? String(rentalItemId.id || '')
            : String(rentalItemId || ''),
          rentalItemName: isRelation && 'name' in rentalItemId
            ? String(rentalItemId.name || '')
            : undefined,
          startDate: String(item.startDate || ''),
          endDate: String(item.endDate || ''),
          reason: (item.reason || 'other') as Blackout['reason'],
          notes: item.notes ? String(item.notes) : undefined,
          isActive: Boolean(item.isActive ?? true)
        }
      })

      return { success: true, blackouts: blackouts.value }
    } catch (error: unknown) {
      const errorData = error as { data?: { message?: string } }
      console.error('Failed to fetch blackouts for item:', error)
      toast.add({
        title: 'Error',
        description: errorData.data?.message || 'Failed to load blackouts',
        color: 'error'
      })
      return { success: false, error, blackouts: [] }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new blackout
   */
  const createBlackout = async (data: {
    rentalItemId: string
    startDate: string
    endDate: string
    reason: Blackout['reason']
    notes?: string
  }) => {
    try {
      const response = await $fetch('/api/availability', {
        method: 'POST',
        credentials: 'include',
        headers: useRequestHeaders(['cookie']),
        body: {
          rentalItemId: parseInt(data.rentalItemId),
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason,
          notes: data.notes,
          isActive: true
        }
      })

      toast.add({
        title: 'Success',
        description: 'Blackout created successfully',
        color: 'success'
      })

      // Refresh blackouts list
      await fetchBlackouts()

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorData = error as { data?: { message?: string } }
      console.error('Failed to create blackout:', error)
      toast.add({
        title: 'Error',
        description: errorData.data?.message || 'Failed to create blackout',
        color: 'error'
      })
      return { success: false, error }
    }
  }

  /**
   * Update an existing blackout
   */
  const updateBlackout = async (id: string, data: Partial<Blackout>) => {
    try {
      const updateData: Record<string, unknown> = {}

      if (data.rentalItemId) updateData.rentalItemId = parseInt(data.rentalItemId)
      if (data.startDate) updateData.startDate = data.startDate
      if (data.endDate) updateData.endDate = data.endDate
      if (data.reason) updateData.reason = data.reason
      if (data.notes !== undefined) updateData.notes = data.notes
      if (data.isActive !== undefined) updateData.isActive = data.isActive

      await $fetch(`/api/availability/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: useRequestHeaders(['cookie']),
        body: updateData
      })

      toast.add({
        title: 'Success',
        description: 'Blackout updated successfully',
        color: 'success'
      })

      // Refresh blackouts list
      await fetchBlackouts()

      return { success: true }
    } catch (error: unknown) {
      const errorData = error as { data?: { message?: string } }
      console.error('Failed to update blackout:', error)
      toast.add({
        title: 'Error',
        description: errorData.data?.message || 'Failed to update blackout',
        color: 'error'
      })
      return { success: false, error }
    }
  }

  /**
   * Delete a blackout
   */
  const deleteBlackout = async (id: string) => {
    try {
      await $fetch(`/api/availability/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: useRequestHeaders(['cookie'])
      })

      toast.add({
        title: 'Success',
        description: 'Blackout deleted successfully',
        color: 'success'
      })

      // Refresh blackouts list
      await fetchBlackouts()

      return { success: true }
    } catch (error: unknown) {
      const errorData = error as { data?: { message?: string } }
      console.error('Failed to delete blackout:', error)
      toast.add({
        title: 'Error',
        description: errorData.data?.message || 'Failed to delete blackout',
        color: 'error'
      })
      return { success: false, error }
    }
  }

  /**
   * Get upcoming blackouts (next 30 days)
   */
  const upcomingBlackouts = computed(() => {
    const now = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(now.getDate() + 30)

    return blackouts.value.filter((blackout) => {
      const startDate = new Date(blackout.startDate)
      return startDate >= now && startDate <= thirtyDaysFromNow && blackout.isActive
    })
  })

  /**
   * Get past blackouts
   */
  const pastBlackouts = computed(() => {
    const now = new Date()

    return blackouts.value.filter((blackout) => {
      const endDate = new Date(blackout.endDate)
      return endDate < now
    })
  })

  /**
   * Get active blackouts (currently ongoing)
   */
  const activeBlackouts = computed(() => {
    const now = new Date()

    return blackouts.value.filter((blackout) => {
      const startDate = new Date(blackout.startDate)
      const endDate = new Date(blackout.endDate)
      return startDate <= now && endDate >= now && blackout.isActive
    })
  })

  return {
    blackouts,
    isLoading,
    upcomingBlackouts,
    pastBlackouts,
    activeBlackouts,
    fetchBlackouts,
    fetchBlackoutsForItem,
    createBlackout,
    updateBlackout,
    deleteBlackout
  }
}
