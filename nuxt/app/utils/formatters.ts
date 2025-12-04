/**
 * Format enum values to user-friendly labels
 * Converts kebab-case or snake_case to Title Case
 * @param value - The enum value to format (e.g., "bounce-house", "in-progress")
 * @returns Formatted label (e.g., "Bounce House", "In Progress")
 */
export const formatEnumValue = (value: string): string => {
  if (!value) return ''
  return value
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Category labels mapping
 * Maps category enum values to user-friendly labels
 */
export const categoryLabels: Record<string, string> = {
  'bounce-house': 'Bounce House',
  'bounce_house': 'Bounce House',
  'water-slide': 'Water Slide',
  'water_slide': 'Water Slide',
  'combo-unit': 'Combo Unit',
  'combo_unit': 'Combo Unit',
  'combo': 'Combo',
  'obstacle-course': 'Obstacle Course',
  'obstacle_course': 'Obstacle Course',
  'game': 'Game',
  'interactive_game': 'Interactive Game',
  'interactive-game': 'Interactive Game',
  'tent_canopy': 'Tent/Canopy',
  'tent-canopy': 'Tent/Canopy',
  'table_chair': 'Table/Chair',
  'table-chair': 'Table/Chair',
  'concession': 'Concession',
  'accessory': 'Accessory',
  'other': 'Other'
}

/**
 * Status labels mapping
 * Maps status enum values to user-friendly labels
 */
export const statusLabels: Record<string, string> = {
  'pending': 'Pending',
  'confirmed': 'Confirmed',
  'in-progress': 'In Progress',
  'delivered': 'Delivered',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
  'active': 'Active',
  'inactive': 'Inactive',
  'discontinued': 'Discontinued'
}

/**
 * Payment status labels mapping
 * Maps payment status enum values to user-friendly labels
 */
export const paymentStatusLabels: Record<string, string> = {
  'unpaid': 'Unpaid',
  'deposit': 'Deposit Paid',
  'paid': 'Paid',
  'refunded': 'Refunded',
  'partial': 'Partially Paid'
}

/**
 * Get formatted category label
 * @param category - The category enum value
 * @returns Formatted category label
 */
export const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || formatEnumValue(category)
}

/**
 * Get formatted status label
 * @param status - The status enum value
 * @returns Formatted status label
 */
export const getStatusLabel = (status: string): string => {
  return statusLabels[status] || formatEnumValue(status)
}

/**
 * Get formatted payment status label
 * @param paymentStatus - The payment status enum value
 * @returns Formatted payment status label
 */
export const getPaymentStatusLabel = (paymentStatus: string): string => {
  return paymentStatusLabels[paymentStatus] || formatEnumValue(paymentStatus)
}

/**
 * Extract plain text from Payload's Lexical richText format
 * Recursively traverses the Lexical JSON structure and extracts text nodes
 * @param richText - The Lexical richText object from Payload
 * @returns Plain text string
 */
export const extractTextFromLexical = (richText: any): string => {
  if (!richText) return ''

  // If it's already a string, return it
  if (typeof richText === 'string') return richText

  // If it's not an object, return empty string
  if (typeof richText !== 'object') return ''

  // Extract text from Lexical format
  const extractFromNode = (node: any): string => {
    if (!node) return ''

    // If node has text property, it's a text node
    if (node.text) return node.text

    // If node has children, recursively extract from them
    if (node.children && Array.isArray(node.children)) {
      return node.children
        .map((child: any) => extractFromNode(child))
        .filter(Boolean)
        .join(' ')
    }

    return ''
  }

  // Start extraction from root
  if (richText.root) {
    return extractFromNode(richText.root).trim()
  }

  // If no root, try extracting directly
  return extractFromNode(richText).trim()
}
