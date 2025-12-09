export interface MaintenanceChecklistItem {
  task: string
  completed: boolean
  notes?: string
}

export interface MaintenancePhoto {
  url: string
  caption?: string
  type: 'before' | 'after' | 'during'
}

export interface MaintenanceDocument {
  url: string
  name: string
  type: 'certificate' | 'receipt' | 'invoice' | 'report' | 'other'
}

export interface MaintenanceRecord {
  id: string
  tenantId: string
  rentalItem: string | { id: string, name: string }
  inventoryUnit?: string | { id: string, label: string }
  type: 'inspection' | 'cleaning' | 'repair' | 'replacement' | 'certification'
  description: string
  scheduledDate: string
  completedDate?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  performedBy: string
  cost?: number
  notes?: string
  checklist?: MaintenanceChecklistItem[]
  photos?: MaintenancePhoto[]
  documents?: MaintenanceDocument[]
  nextMaintenanceDate?: string
  createdAt: string
  updatedAt: string
}

export interface MaintenanceSchedule {
  id: string
  tenantId: string
  rentalItem: string | { id: string, name: string }
  name: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'after_x_rentals'
  frequencyValue: number
  maintenanceType: 'inspection' | 'cleaning' | 'repair' | 'certification'
  checklist?: Array<{ task: string, required: boolean }>
  instructions?: string
  estimatedDuration?: number
  reminderDaysBefore: number
  isActive: boolean
  lastCompletedDate?: string
  nextDueDate?: string
  rentalCount?: number
  createdAt: string
  updatedAt: string
}

export interface MaintenanceStats {
  totalRecords: number
  overdue: number
  dueSoon: number
  completedThisMonth: number
  totalCost: number
  avgCost: number
}

export const useMaintenance = () => {
  const records = useState<MaintenanceRecord[]>('maintenance:records', () => [])
  const schedules = useState<MaintenanceSchedule[]>('maintenance:schedules', () => [])
  const dueSoon = useState<MaintenanceRecord[]>('maintenance:dueSoon', () => [])
  const overdue = useState<MaintenanceRecord[]>('maintenance:overdue', () => [])
  const isLoading = useState<boolean>('maintenance:loading', () => false)
  const error = useState<string | null>('maintenance:error', () => null)

  // Computed stats
  const stats = computed<MaintenanceStats>(() => {
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const completedThisMonth = records.value.filter(
      r => r.status === 'completed' && r.completedDate && new Date(r.completedDate) >= firstOfMonth
    ).length

    const totalCost = records.value
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.cost || 0), 0)

    const completedCount = records.value.filter(r => r.status === 'completed').length
    const avgCost = completedCount > 0 ? totalCost / completedCount : 0

    return {
      totalRecords: records.value.length,
      overdue: overdue.value.length,
      dueSoon: dueSoon.value.length,
      completedThisMonth,
      totalCost,
      avgCost
    }
  })

  /**
   * Fetch maintenance records due within the next N days
   */
  const fetchDueItems = async (days = 7, itemId?: string) => {
    isLoading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        days: days.toString(),
        ...(itemId && { itemId })
      })

      const response = await $fetch<{
        success: boolean
        records: {
          overdue: MaintenanceRecord[]
          dueSoon: MaintenanceRecord[]
          all: MaintenanceRecord[]
        }
      }>(`/api/maintenance/due?${params}`, {
        credentials: 'include'
      })

      if (response.success) {
        overdue.value = response.records.overdue
        dueSoon.value = response.records.dueSoon
        records.value = response.records.all
      }

      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch due maintenance'
      console.error('Failed to fetch due maintenance:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch all maintenance records
   */
  const fetchRecords = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ docs: MaintenanceRecord[] }>('/api/maintenance-records', {
        credentials: 'include'
      })

      records.value = response.docs || []
      return { success: true, records: records.value }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch maintenance records'
      console.error('Failed to fetch maintenance records:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch maintenance record by ID
   */
  const fetchRecord = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const record = await $fetch<MaintenanceRecord>(`/api/maintenance-records/${id}`, {
        credentials: 'include'
      })

      return { success: true, record }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch maintenance record'
      console.error('Failed to fetch maintenance record:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new maintenance record
   */
  const createRecord = async (data: Partial<MaintenanceRecord>) => {
    isLoading.value = true
    error.value = null

    try {
      // Payload returns the created document directly (not wrapped in { doc: ... })
      const newRecord = await $fetch<MaintenanceRecord>('/api/maintenance-records', {
        method: 'POST',
        credentials: 'include',
        body: data
      })

      // Add to local state
      records.value.push(newRecord)

      // Also update due lists if the record is scheduled/in_progress
      if (newRecord.status === 'scheduled' || newRecord.status === 'in_progress') {
        const scheduledDate = new Date(newRecord.scheduledDate)
        const now = new Date()

        if (scheduledDate < now) {
          overdue.value.push(newRecord)
        } else {
          dueSoon.value.push(newRecord)
        }
      }

      return { success: true, record: newRecord }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create maintenance record'
      console.error('Failed to create maintenance record:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update a maintenance record
   */
  const updateRecord = async (id: string, data: Partial<MaintenanceRecord>) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedRecord = await $fetch<MaintenanceRecord>(`/api/maintenance-records/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: data
      })

      const index = records.value.findIndex(r => r.id === id)
      if (index !== -1) {
        records.value[index] = updatedRecord
      }

      return { success: true, record: updatedRecord }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update maintenance record'
      console.error('Failed to update maintenance record:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Complete a maintenance record
   */
  const completeMaintenance = async (
    recordId: string,
    data: {
      completedDate?: string
      performedBy: string
      checklist?: MaintenanceChecklistItem[]
      notes?: string
      cost?: number
      nextMaintenanceDate?: string
    }
  ) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean, record: MaintenanceRecord }>(
        '/api/maintenance/complete',
        {
          method: 'POST',
          credentials: 'include',
          body: { recordId, ...data }
        }
      )

      if (response.success) {
        // Update local state
        const index = records.value.findIndex(r => r.id === recordId)
        if (index !== -1) {
          records.value[index] = response.record
        }

        // Remove from due lists
        overdue.value = overdue.value.filter(r => r.id !== recordId)
        dueSoon.value = dueSoon.value.filter(r => r.id !== recordId)
      }

      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete maintenance'
      console.error('Failed to complete maintenance:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a maintenance record
   */
  const deleteRecord = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/maintenance-records/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      records.value = records.value.filter(r => r.id !== id)
      overdue.value = overdue.value.filter(r => r.id !== id)
      dueSoon.value = dueSoon.value.filter(r => r.id !== id)

      return { success: true }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete maintenance record'
      console.error('Failed to delete maintenance record:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch all maintenance schedules
   */
  const fetchSchedules = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ docs: MaintenanceSchedule[] }>('/api/maintenance-schedules', {
        credentials: 'include'
      })

      schedules.value = response.docs || []
      return { success: true, schedules: schedules.value }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch maintenance schedules'
      console.error('Failed to fetch maintenance schedules:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new maintenance schedule
   */
  const createSchedule = async (data: Partial<MaintenanceSchedule>) => {
    isLoading.value = true
    error.value = null

    try {
      const newSchedule = await $fetch<MaintenanceSchedule>('/api/maintenance-schedules', {
        method: 'POST',
        credentials: 'include',
        body: data
      })

      schedules.value.push(newSchedule)
      return { success: true, schedule: newSchedule }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create maintenance schedule'
      console.error('Failed to create maintenance schedule:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update a maintenance schedule
   */
  const updateSchedule = async (id: string, data: Partial<MaintenanceSchedule>) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedSchedule = await $fetch<MaintenanceSchedule>(`/api/maintenance-schedules/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: data
      })

      const index = schedules.value.findIndex(s => s.id === id)
      if (index !== -1) {
        schedules.value[index] = updatedSchedule
      }

      return { success: true, schedule: updatedSchedule }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update maintenance schedule'
      console.error('Failed to update maintenance schedule:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a maintenance schedule
   */
  const deleteSchedule = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/maintenance-schedules/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      schedules.value = schedules.value.filter(s => s.id !== id)
      return { success: true }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete maintenance schedule'
      console.error('Failed to delete maintenance schedule:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get maintenance history for a rental item
   */
  const getItemHistory = async (itemId: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{
        success: boolean
        stats: {
          totalRecords: number
          completedCount: number
          totalCost: number
          avgCost: number
          typeBreakdown: Record<string, number>
        }
        records: MaintenanceRecord[]
      }>(`/api/rental-items/${itemId}/maintenance-history`, {
        credentials: 'include'
      })

      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch maintenance history'
      console.error('Failed to fetch maintenance history:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    records: readonly(records),
    schedules: readonly(schedules),
    dueSoon: readonly(dueSoon),
    overdue: readonly(overdue),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    stats,

    // Actions - Records
    fetchRecords,
    fetchRecord,
    createRecord,
    updateRecord,
    deleteRecord,
    completeMaintenance,
    fetchDueItems,
    getItemHistory,

    // Actions - Schedules
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
  }
}
