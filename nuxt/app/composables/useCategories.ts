/**
 * Composable for managing rental item categories
 */

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  image?: any
  sortOrder: number
  isActive: boolean
  itemCount?: number
  createdAt: string
  updatedAt: string
}

export const useCategories = () => {
  const { fetchCollection, createDocument, updateDocument, deleteDocument } = usePayloadApi()
  const toast = useToast()

  /**
   * Fetch all categories for the current tenant
   */
  async function fetchCategories(params?: { limit?: number; includeInactive?: boolean }) {
    try {
      const where: any = {}

      if (!params?.includeInactive) {
        where.isActive = { equals: true }
      }

      const response = await fetchCollection<Category>('categories', {
        limit: params?.limit || 100,
        sort: 'sortOrder',
        where: Object.keys(where).length > 0 ? where : undefined,
      })

      return response.docs
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to load categories',
        color: 'error',
      })
      return []
    }
  }

  /**
   * Fetch a single category by ID
   */
  async function fetchCategory(id: string) {
    try {
      return await fetchDocument<Category>('categories', id)
    } catch (error) {
      console.error('Error fetching category:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to load category',
        color: 'error',
      })
      return null
    }
  }

  /**
   * Create a new category
   */
  async function createCategory(data: Partial<Category>) {
    try {
      const category = await createDocument<Category>('categories', data)
      toast.add({
        title: 'Success',
        description: 'Category created successfully',
        color: 'success',
      })
      return category
    } catch (error) {
      console.error('Error creating category:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to create category',
        color: 'error',
      })
      throw error
    }
  }

  /**
   * Update a category
   */
  async function updateCategory(id: string, data: Partial<Category>) {
    try {
      const category = await updateDocument<Category>('categories', id, data)
      toast.add({
        title: 'Success',
        description: 'Category updated successfully',
        color: 'success',
      })
      return category
    } catch (error) {
      console.error('Error updating category:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to update category',
        color: 'error',
      })
      throw error
    }
  }

  /**
   * Delete a category
   */
  async function deleteCategory(id: string) {
    try {
      await deleteDocument('categories', id)
      toast.add({
        title: 'Success',
        description: 'Category deleted successfully',
        color: 'success',
      })
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to delete category',
        color: 'error',
      })
      throw error
    }
  }

  /**
   * Reorder categories
   */
  async function reorderCategories(categories: Category[]) {
    try {
      // Update sortOrder for all categories
      const promises = categories.map((cat, index) =>
        updateDocument('categories', cat.id, { sortOrder: index })
      )

      await Promise.all(promises)

      toast.add({
        title: 'Success',
        description: 'Categories reordered successfully',
        color: 'success',
      })
    } catch (error) {
      console.error('Error reordering categories:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to reorder categories',
        color: 'error',
      })
      throw error
    }
  }

  return {
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  }
}
