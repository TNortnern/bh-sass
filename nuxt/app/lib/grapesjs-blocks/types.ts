/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Type Definitions for GrapesJS Block System
 */

import type { Editor, Block, BlockProperties } from 'grapesjs'

/**
 * Block category definition
 */
export interface BlockCategory {
  id: string
  label: string
  icon: string
  order: number
  open?: boolean
}

/**
 * GrapesJS block with metadata
 */
export interface GrapesBlock {
  id: string
  label: string
  category: string
  content: string
  media?: string
  attributes?: Record<string, any>
  activate?: boolean
  select?: boolean
  resetId?: boolean
}

/**
 * Block manager configuration options
 */
export interface BlockManagerOptions {
  editor: Editor
  categories: BlockCategory[]
  enableVirtualScroll?: boolean
  virtualScrollItemHeight?: number
  searchDebounceMs?: number
  cacheSize?: number
}

/**
 * Block manager cache statistics
 */
export interface CacheStats {
  cacheSize: number
  maxCacheSize: number
  loadedCategories: number
  totalCategories: number
  totalBlocks: number
  loadedBlocks: number
}

/**
 * Block system initialization result
 */
export interface BlockSystemResult {
  blockManager: any
  loadCategory: (categoryId: string) => void
  unloadCategory: (categoryId: string) => void
  search: (query: string, callback: (results: GrapesBlock[]) => void) => void
  restoreAllBlocks: () => void
  getCacheStats: () => CacheStats
  getTotalBlockCount: () => number
  getLoadedBlockCount: () => number
}

/**
 * HyperUI block structure
 */
export interface HyperUIBlock {
  id: string
  name: string
  category: 'marketing' | 'application' | 'neobrutalism'
  type: string
  variant: number
  html: string
}

/**
 * Nuxt UI block structure
 */
export interface NuxtUIBlock {
  id: string
  name: string
  category: 'hero' | 'section' | 'cta' | 'features' | 'testimonials' | 'pricing' | 'footer'
  description: string
  icon: string
  template: string
  defaultData: Record<string, any>
  supportsAutoPopulate: boolean
  autoPopulateType?: string
}

/**
 * Block statistics
 */
export interface BlockStatistics {
  hyperUI: {
    total: number
    typeCount: Record<string, number>
    categoryCount: Record<string, number>
    types: string[]
    categories: string[]
  }
  nuxtUI: {
    total: number
    categoryCount: Record<string, number>
    autoPopulateBlocks: number
    categories: string[]
  }
  total: number
  categories: number
}

/**
 * Search result
 */
export interface SearchResult {
  blocks: GrapesBlock[]
  query: string
  count: number
}

/**
 * Category mapping
 */
export type CategoryMapping = Record<string, string>

/**
 * Block adapter interface
 */
export interface BlockAdapter<T> {
  convertBlock(block: T): GrapesBlock
  convertBlocks(blocks: T[]): GrapesBlock[]
  groupByCategory(blocks: GrapesBlock[]): Map<string, GrapesBlock[]>
  getStatistics(blocks: T[]): any
}

/**
 * Virtual scroll helper options
 */
export interface VirtualScrollOptions {
  container: HTMLElement
  items: any[]
  itemHeight: number
  bufferSize?: number
}

/**
 * Block preview options
 */
export interface BlockPreviewOptions {
  width?: number
  height?: number
  format?: 'svg' | 'png' | 'base64'
  quality?: number
}

/**
 * Lazy loading options
 */
export interface LazyLoadingOptions {
  threshold?: number
  rootMargin?: string
  preloadCategories?: string[]
}

/**
 * Performance monitoring options
 */
export interface PerformanceMonitoringOptions {
  enabled?: boolean
  interval?: number
  logToConsole?: boolean
  onStats?: (stats: CacheStats) => void
}

/**
 * Block filter options
 */
export interface BlockFilterOptions {
  category?: string
  search?: string
  tags?: string[]
  source?: 'hyperui' | 'nuxt-ui' | 'all'
}

/**
 * Block sort options
 */
export interface BlockSortOptions {
  field: 'name' | 'category' | 'id'
  direction: 'asc' | 'desc'
}

/**
 * Block export options
 */
export interface BlockExportOptions {
  format: 'json' | 'html' | 'grapesjs'
  includeMedia?: boolean
  includeAttributes?: boolean
  prettify?: boolean
}

/**
 * Block import options
 */
export interface BlockImportOptions {
  validateStructure?: boolean
  mergeWithExisting?: boolean
  overwriteDuplicates?: boolean
}
