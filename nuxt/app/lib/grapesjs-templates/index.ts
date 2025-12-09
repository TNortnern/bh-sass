/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * GrapesJS Template Registry
 * Elite pre-built templates for bounce house rental businesses
 */

import { starterClassic } from './starter-classic'
import { starterPlayful } from './starter-playful'
import { starterPremium } from './starter-premium'
import { proEnterprise } from './pro-enterprise'
import { proLocalBusiness } from './pro-local-business'
import { proEventFocused } from './pro-event-focused'
import { bookingFocused } from './booking-focused'
import { galleryShowcase } from './gallery-showcase'
import { trustBuilder } from './trust-builder'

export interface GrapesJSTemplate {
  id: string
  name: string
  description: string
  category: 'Starter' | 'Professional' | 'Specialized'
  tags: string[]
  preview: string // SVG or image URL
  thumbnail: string // Base64 or URL
  html: string
  css?: string
  components?: any // GrapesJS component structure
  styles?: any // GrapesJS style structure
  config: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fonts: {
      heading: string
      body: string
    }
    features: string[]
  }
}

export const templates: Record<string, GrapesJSTemplate> = {
  // Starter Templates
  'starter-classic': starterClassic,
  'starter-playful': starterPlayful,
  'starter-premium': starterPremium,

  // Professional Templates
  'pro-enterprise': proEnterprise,
  'pro-local-business': proLocalBusiness,
  'pro-event-focused': proEventFocused,

  // Specialized Templates
  'booking-focused': bookingFocused,
  'gallery-showcase': galleryShowcase,
  'trust-builder': trustBuilder
}

export const templateCategories = [
  {
    id: 'starter',
    name: 'Starter Templates',
    description: 'Perfect for getting started quickly with a professional look',
    templates: ['starter-classic', 'starter-playful', 'starter-premium']
  },
  {
    id: 'professional',
    name: 'Professional Templates',
    description: 'Advanced designs for established rental businesses',
    templates: ['pro-enterprise', 'pro-local-business', 'pro-event-focused']
  },
  {
    id: 'specialized',
    name: 'Specialized Templates',
    description: 'Purpose-built templates for specific business goals',
    templates: ['booking-focused', 'gallery-showcase', 'trust-builder']
  }
]

export function getTemplateById(id: string): GrapesJSTemplate | undefined {
  return templates[id]
}

export function getTemplatesByCategory(category: string): GrapesJSTemplate[] {
  return Object.values(templates).filter(t =>
    t.category.toLowerCase() === category.toLowerCase()
  )
}

export function getTemplatesByTag(tag: string): GrapesJSTemplate[] {
  return Object.values(templates).filter(t =>
    t.tags.includes(tag)
  )
}

export function getAllTemplates(): GrapesJSTemplate[] {
  return Object.values(templates)
}

export function searchTemplates(query: string): GrapesJSTemplate[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(templates).filter(t =>
    t.name.toLowerCase().includes(lowerQuery)
    || t.description.toLowerCase().includes(lowerQuery)
    || t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export default templates
