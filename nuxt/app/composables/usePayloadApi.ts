/**
 * Composable for making API calls to Payload CMS
 * Provides consistent error handling and credential management
 */

interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

interface PayloadParams {
  page?: number
  limit?: number
  sort?: string
  where?: Record<string, any>
  depth?: number
  [key: string]: any
}

export const usePayloadApi = () => {
  const { currentUser } = useAuth()

  /**
   * Get the tenant ID from the current user
   */
  function getTenantId(): string | null {
    if (!currentUser.value?.tenantId) return null
    if (typeof currentUser.value.tenantId === 'object') {
      return currentUser.value.tenantId.id
    }
    return currentUser.value.tenantId
  }

  /**
   * Fetch a list of documents from a Payload collection
   */
  async function fetchCollection<T>(
    collection: string,
    params?: PayloadParams
  ): Promise<PayloadListResponse<T>> {
    const response = await $fetch<PayloadListResponse<T>>(`/v1/${collection}`, {
      credentials: 'include',
      params: params || {}
    })

    return response
  }

  /**
   * Fetch a single document from a Payload collection
   */
  async function fetchDocument<T>(
    collection: string,
    id: string,
    params?: PayloadParams
  ): Promise<T> {
    const response = await $fetch<T>(`/v1/${collection}/${id}`, {
      credentials: 'include',
      params: params || {}
    })

    return response
  }

  /**
   * Create a new document in a Payload collection
   * Automatically includes tenantId for multi-tenant collections
   */
  async function createDocument<T>(
    collection: string,
    data: Partial<T>
  ): Promise<T> {
    const tenantId = getTenantId()
    const bodyData = tenantId ? { tenantId, ...data } : data

    const response = await $fetch<T>(`/v1/${collection}`, {
      method: 'POST',
      credentials: 'include',
      body: bodyData
    })

    return response
  }

  /**
   * Update a document in a Payload collection
   */
  async function updateDocument<T>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    const response = await $fetch<T>(`/v1/${collection}/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: data
    })

    return response
  }

  /**
   * Delete a document from a Payload collection
   */
  async function deleteDocument(
    collection: string,
    id: string
  ): Promise<void> {
    await $fetch(`/v1/${collection}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }

  return {
    fetchCollection,
    fetchDocument,
    createDocument,
    updateDocument,
    deleteDocument
  }
}
