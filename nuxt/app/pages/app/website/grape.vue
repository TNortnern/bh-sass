<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars, vue/no-v-html */
import { tailwindBlocks } from '~/data/tailwind-blocks'

definePageMeta({
  layout: false
})

const { savedBlocks, saveBlock, deleteBlock } = useSavedBlocks()

const isLoading = ref(true)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editor = ref<any>(null)
const activePanel = ref<'blocks' | 'layers' | 'styles'>('blocks')
const showTemplateModal = ref(true)
const selectedTemplateId = ref<string | null>(null)
const showHelpModal = ref(false)

// Save Component Modal
const showSaveComponentModal = ref(false)
const saveComponentName = ref('')
const saveComponentCategory = ref('My Components')
const selectedComponentHtml = ref('')
const hasSelection = ref(false)

// Watch for selection changes in GrapeJS
const updateSelectionState = () => {
  if (editor.value) {
    const selected = editor.value.getSelected()
    hasSelection.value = !!selected
  }
}

// Open save component modal with selected content
const openSaveComponentModal = () => {
  if (!editor.value) return

  const selected = editor.value.getSelected()
  if (!selected) {
    alert('Please select a component to save')
    return
  }

  // Get HTML of selected component
  selectedComponentHtml.value = selected.toHTML()
  saveComponentName.value = ''
  saveComponentCategory.value = 'My Components'
  showSaveComponentModal.value = true
}

// Save the selected component
const saveSelectedComponent = () => {
  if (!saveComponentName.value.trim()) return

  const block = saveBlock({
    name: saveComponentName.value.trim(),
    category: saveComponentCategory.value || 'My Components',
    html: selectedComponentHtml.value
  })

  // Add to GrapeJS block manager
  if (editor.value && block) {
    const blockManager = editor.value.Blocks
    blockManager.add(block.id, {
      label: block.name,
      category: 'My Components',
      media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>',
      content: block.html
    })
  }

  showSaveComponentModal.value = false
  saveComponentName.value = ''
}

// Delete a saved component
const deleteSavedComponent = (id: string) => {
  deleteBlock(id)
  // Also remove from GrapeJS if editor is active
  if (editor.value) {
    const blockManager = editor.value.Blocks
    const block = blockManager.get(id)
    if (block) {
      blockManager.remove(id)
    }
  }
}

// Multi-page support
interface WebsitePage {
  id: string
  name: string
  slug: string
  isHome: boolean
  content: string
  css: string
}

const pages = ref<WebsitePage[]>([
  { id: '1', name: 'Home', slug: '/', isHome: true, content: '', css: '' }
])
const currentPageId = ref('1')
const showPagesPanel = ref(false)
const newPageName = ref('')
const pagesSwitcherRef = ref<HTMLElement | null>(null)

const currentPage = computed(() => pages.value.find(p => p.id === currentPageId.value))

// Page management functions
const saveCurrentPageContent = () => {
  if (editor.value && currentPage.value) {
    currentPage.value.content = editor.value.getHtml()
    currentPage.value.css = editor.value.getCss()
  }
}

const switchPage = (pageId: string) => {
  if (pageId === currentPageId.value) {
    showPagesPanel.value = false
    return
  }

  // Save current page content
  saveCurrentPageContent()

  // Switch to new page
  currentPageId.value = pageId
  showPagesPanel.value = false

  // Load new page content
  const page = pages.value.find(p => p.id === pageId)
  if (editor.value && page) {
    editor.value.setComponents(page.content || '')
    editor.value.setStyle(page.css || '')
  }
}

const addPage = () => {
  if (!newPageName.value.trim()) return

  const slug = newPageName.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const newPage: WebsitePage = {
    id: Date.now().toString(),
    name: newPageName.value,
    slug: `/${slug}`,
    isHome: false,
    content: '',
    css: ''
  }

  pages.value.push(newPage)
  newPageName.value = ''

  // Switch to new page
  switchPage(newPage.id)
}

const deletePage = (pageId: string) => {
  const page = pages.value.find(p => p.id === pageId)
  if (!page || page.isHome) return

  pages.value = pages.value.filter(p => p.id !== pageId)

  // Switch to home if deleting current page
  if (currentPageId.value === pageId) {
    const homePage = pages.value.find(p => p.isHome)
    if (homePage) switchPage(homePage.id)
  }
}

const closePagesPanelOnClickOutside = (e: MouseEvent) => {
  if (showPagesPanel.value && pagesSwitcherRef.value && !pagesSwitcherRef.value.contains(e.target as Node)) {
    showPagesPanel.value = false
  }
}

// Preset templates for GrapeJS
const presetTemplates = [
  {
    id: 'complete',
    name: 'Complete Website',
    description: 'Hero, trust badges, about, gallery, CTA, and contact sections',
    icon: 'i-lucide-layout-template',
    color: '#f59e0b'
  },
  {
    id: 'minimal',
    name: 'Minimal Landing',
    description: 'Clean hero and CTA - perfect for quick landing pages',
    icon: 'i-lucide-minus-square',
    color: '#3b82f6'
  },
  {
    id: 'service',
    name: 'Service Focused',
    description: 'Hero, gallery grid, and contact - highlights your rentals',
    icon: 'i-lucide-grid-3x3',
    color: '#10b981'
  },
  {
    id: 'blank',
    name: 'Start from Scratch',
    description: 'Empty canvas - drag blocks to build your custom page',
    icon: 'i-lucide-file',
    color: '#6b7280'
  }
]

// Template HTML content
const getTemplateContent = (templateId: string): string => {
  const templates: Record<string, string> = {
    complete: `
      <section style="width: 100%; background: #0f172a; padding: 100px 24px; min-height: 550px; display: flex; align-items: center;">
        <div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;">
          <div>
            <p style="font-size: 14px; font-weight: 600; color: #f59e0b; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.05em; font-family: system-ui, sans-serif;">Party Rentals Done Right</p>
            <h1 style="font-size: 48px; font-weight: 700; color: white; margin: 0 0 20px 0; line-height: 1.15; font-family: system-ui, sans-serif;">Bounce Houses &amp; Inflatables for Every Occasion</h1>
            <p style="font-size: 18px; color: #94a3b8; margin: 0 0 32px 0; line-height: 1.6; font-family: system-ui, sans-serif;">Professional setup, fully insured, and sanitized after every rental. Serving your area with free delivery.</p>
            <div style="display: flex; gap: 12px;">
              <a href="#" style="display: inline-block; padding: 14px 28px; background: #f59e0b; color: #0f172a; font-weight: 600; border-radius: 6px; text-decoration: none; font-size: 15px; font-family: system-ui, sans-serif;">View Rentals</a>
              <a href="#" style="display: inline-block; padding: 14px 28px; background: transparent; color: white; font-weight: 500; border-radius: 6px; text-decoration: none; font-size: 15px; font-family: system-ui, sans-serif; border: 1px solid #334155;">Get a Quote</a>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 14px; font-family: system-ui, sans-serif;">Click to add your image</div>
        </div>
      </section>
      <section style="width: 100%; padding: 80px 24px; background: white;">
        <div style="max-width: 900px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 32px; font-weight: 700; color: #0f172a; margin: 0 0 48px 0; font-family: system-ui, sans-serif;">Why Families Choose Us</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;">
            <div style="text-align: center;">
              <div style="width: 48px; height: 48px; background: #fef3c7; border-radius: 8px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 24px;">✓</div>
              <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 8px 0; font-family: system-ui, sans-serif;">Fully Insured</h3>
              <p style="font-size: 14px; color: #64748b; margin: 0; font-family: system-ui, sans-serif;">$2M liability coverage included</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 48px; height: 48px; background: #fef3c7; border-radius: 8px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🚚</div>
              <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 8px 0; font-family: system-ui, sans-serif;">Free Delivery</h3>
              <p style="font-size: 14px; color: #64748b; margin: 0; font-family: system-ui, sans-serif;">Within 25 miles of our location</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 48px; height: 48px; background: #fef3c7; border-radius: 8px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 24px;">⭐</div>
              <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 8px 0; font-family: system-ui, sans-serif;">500+ Reviews</h3>
              <p style="font-size: 14px; color: #64748b; margin: 0; font-family: system-ui, sans-serif;">5-star average rating</p>
            </div>
          </div>
        </div>
      </section>
      <section style="width: 100%; padding: 64px 24px; background: #0f172a; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="font-size: 28px; font-weight: 700; color: white; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Ready to book?</h2>
          <p style="font-size: 16px; color: #94a3b8; margin: 0 0 24px 0; font-family: system-ui, sans-serif;">Call us at (555) 123-4567 or reserve online</p>
          <a href="#" style="display: inline-block; padding: 14px 32px; background: #f59e0b; color: #0f172a; font-weight: 600; border-radius: 6px; text-decoration: none; font-size: 15px; font-family: system-ui, sans-serif;">Check Availability</a>
        </div>
      </section>
    `,
    minimal: `
      <section style="width: 100%; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 120px 24px; text-align: center; min-height: 600px; display: flex; align-items: center; justify-content: center;">
        <div style="max-width: 700px; margin: 0 auto;">
          <h1 style="font-size: 64px; font-weight: 800; color: white; margin: 0 0 24px 0; line-height: 1.1; font-family: system-ui, sans-serif;">Premium Party Rentals</h1>
          <p style="font-size: 24px; color: rgba(255,255,255,0.9); margin: 0 0 48px 0; font-family: system-ui, sans-serif;">Bounce houses, water slides, and more - delivered to your door.</p>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <a href="#" style="display: inline-block; padding: 20px 40px; background: white; color: #1d4ed8; font-weight: 600; border-radius: 9999px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif;">Browse Rentals</a>
            <a href="#" style="display: inline-block; padding: 20px 40px; background: transparent; color: white; font-weight: 600; border-radius: 9999px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif; border: 2px solid rgba(255,255,255,0.3);">Get a Quote</a>
          </div>
        </div>
      </section>
      <section style="width: 100%; background: #111; padding: 80px 24px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="font-size: 36px; font-weight: 800; color: white; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Ready to Party?</h2>
          <p style="font-size: 18px; color: rgba(255,255,255,0.7); margin: 0 0 32px 0; font-family: system-ui, sans-serif;">Call us at (555) 123-4567 or book online today.</p>
          <a href="#" style="display: inline-block; padding: 18px 36px; background: #3b82f6; color: white; font-weight: 600; border-radius: 9999px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif;">Book Now</a>
        </div>
      </section>
    `,
    service: `
      <section style="width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 100px 24px; text-align: center; min-height: 450px; display: flex; align-items: center; justify-content: center;">
        <div style="max-width: 800px; margin: 0 auto;">
          <span style="display: inline-block; padding: 8px 20px; background: rgba(255,255,255,0.2); border-radius: 9999px; font-size: 14px; font-weight: 600; color: white; margin-bottom: 24px; font-family: system-ui, sans-serif;">Serving Your Area Since 2015</span>
          <h1 style="font-size: 52px; font-weight: 800; color: white; margin: 0 0 20px 0; line-height: 1.1; font-family: system-ui, sans-serif;">Premium Party Equipment Rentals</h1>
          <p style="font-size: 20px; color: rgba(255,255,255,0.9); margin: 0 0 36px 0; font-family: system-ui, sans-serif;">Quality bounce houses, water slides, and party essentials for unforgettable events.</p>
          <a href="#" style="display: inline-block; padding: 18px 36px; background: white; color: #059669; font-weight: 600; border-radius: 9999px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif;">View All Equipment</a>
        </div>
      </section>
      <section style="width: 100%; padding: 96px 24px; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 48px;">
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #10b981; margin-bottom: 12px; font-family: system-ui, sans-serif;">Our Equipment</span>
            <h2 style="font-size: 40px; font-weight: 800; color: #111; margin: 0; font-family: system-ui, sans-serif;">Featured Rentals</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
            <div style="background: linear-gradient(135deg, #d1fae5, #6ee7b7); border-radius: 16px; aspect-ratio: 1; min-height: 180px;"></div>
            <div style="background: linear-gradient(135deg, #fef3c7, #fcd34d); border-radius: 16px; aspect-ratio: 1; min-height: 180px;"></div>
            <div style="background: linear-gradient(135deg, #dbeafe, #93c5fd); border-radius: 16px; aspect-ratio: 1; min-height: 180px;"></div>
            <div style="background: linear-gradient(135deg, #fce7f3, #f9a8d4); border-radius: 16px; aspect-ratio: 1; min-height: 180px;"></div>
            <div style="background: linear-gradient(135deg, #e9d5ff, #c084fc); border-radius: 16px; aspect-ratio: 1; min-height: 180px;"></div>
            <div style="background: linear-gradient(135deg, #fee2e2, #fca5a5); border-radius: 16px; aspect-ratio: 1; min-height: 180px;"></div>
            <div style="background: linear-gradient(135deg, #cffafe, #67e8f9); border-radius: 16px; aspect-ratio: 1; min-height: 180px;"></div>
            <div style="background: linear-gradient(135deg, #d1fae5, #6ee7b7); border-radius: 16px; aspect-ratio: 1; min-height: 180px;"></div>
          </div>
        </div>
      </section>
      <section style="width: 100%; padding: 96px 24px; background: #f9fafb;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #10b981; margin-bottom: 12px; font-family: system-ui, sans-serif;">Contact Us</span>
          <h2 style="font-size: 40px; font-weight: 800; color: #111; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Ready to Book?</h2>
          <p style="font-size: 18px; color: #6b7280; margin: 0 0 40px 0; font-family: system-ui, sans-serif;">Give us a call or fill out the form below to reserve your equipment.</p>
          <div style="background: white; border-radius: 16px; padding: 40px; text-align: left; box-shadow: 0 10px 40px rgba(0,0,0,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; font-family: system-ui, sans-serif;">Name</label>
                <input type="text" placeholder="Your name" style="width: 100%; padding: 14px 16px; font-size: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; box-sizing: border-box; font-family: system-ui, sans-serif;" />
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; font-family: system-ui, sans-serif;">Phone</label>
                <input type="tel" placeholder="(555) 123-4567" style="width: 100%; padding: 14px 16px; font-size: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; box-sizing: border-box; font-family: system-ui, sans-serif;" />
              </div>
            </div>
            <div style="margin-bottom: 24px;">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; font-family: system-ui, sans-serif;">Message</label>
              <textarea placeholder="Tell us about your event..." style="width: 100%; padding: 14px 16px; font-size: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; min-height: 100px; resize: vertical; box-sizing: border-box; font-family: system-ui, sans-serif;"></textarea>
            </div>
            <button type="button" style="width: 100%; padding: 16px 32px; background: #10b981; color: white; font-size: 16px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; font-family: system-ui, sans-serif;">Send Message</button>
          </div>
        </div>
      </section>
    `,
    blank: ''
  }
  return templates[templateId] || ''
}

const loadTemplate = (templateId: string) => {
  selectedTemplateId.value = templateId
  showTemplateModal.value = false

  // If editor is already initialized, load the template
  if (editor.value) {
    editor.value.setComponents(getTemplateContent(templateId))
  }
}

// Load GrapeJS and plugins from CDN with better error handling
const loadGrapeJS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window).grapesjs) {
      console.log('GrapeJS already loaded')
      resolve()
      return
    }

    // Load CSS files first
    const cssFiles = [
      'https://unpkg.com/grapesjs@0.21.10/dist/css/grapes.min.css'
    ]

    cssFiles.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
      }
    })

    // Load main GrapeJS script
    const existingScript = document.querySelector('script[src*="grapesjs"]')
    if (existingScript) {
      // Wait for it to load if already appended
      const checkLoaded = setInterval(() => {
        if ((window).grapesjs) {
          clearInterval(checkLoaded)
          resolve()
        }
      }, 100)
      setTimeout(() => {
        clearInterval(checkLoaded)
        reject(new Error('GrapeJS load timeout'))
      }, 10000)
      return
    }

    const mainScript = document.createElement('script')
    mainScript.src = 'https://unpkg.com/grapesjs@0.21.10'
    mainScript.async = true
    mainScript.onload = () => {
      console.log('GrapeJS main script loaded')
      // Load blocks-basic plugin after main script
      const blocksPlugin = document.createElement('script')
      blocksPlugin.src = 'https://unpkg.com/grapesjs-blocks-basic@1.0.2'
      blocksPlugin.async = true
      blocksPlugin.onload = () => {
        console.log('GrapeJS blocks plugin loaded')
        resolve()
      }
      blocksPlugin.onerror = () => {
        console.warn('Blocks plugin failed to load, continuing without it')
        resolve() // Continue without plugin
      }
      document.head.appendChild(blocksPlugin)
    }
    mainScript.onerror = () => reject(new Error('Failed to load GrapeJS'))
    document.head.appendChild(mainScript)
  })
}

// Custom HTML block - allows pasting code from Tailwind UI, Shuffle.dev, etc.
const customHtmlBlock = {
  id: 'custom-html',
  label: 'Custom HTML',
  category: 'Custom',
  media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  content: `
    <section class="custom-html-block" style="padding: 60px 24px; background: #f9fafb; text-align: center; min-height: 200px;">
      <div style="max-width: 600px; margin: 0 auto;">
        <p style="font-size: 16px; color: #6b7280; font-family: system-ui, sans-serif;">
          🎨 Custom HTML Block - Double-click to edit the HTML directly or replace this placeholder with your code from Tailwind UI, Shuffle.dev, or any other source.
        </p>
      </div>
    </section>
  `
}

// Custom blocks for bounce house rental sites - Tailwind UI / shuffle.dev style
// NOTE: Simplified for better performance
// Merges general Tailwind blocks with bounce house specific blocks
const getCustomBlocks = () => [
  // Include all curated Tailwind blocks from the library
  ...tailwindBlocks,

  // BOUNCE HOUSE SPECIFIC BLOCKS
  // HERO SECTIONS
  {
    id: 'bh-hero',
    label: 'Hero - Gradient',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="6" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="2"/><line x1="6" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <section class="bh-hero" style="width: 100%; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 100px 24px; text-align: center; min-height: 500px; display: flex; align-items: center; justify-content: center;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 56px; font-weight: 800; color: white; margin: 0 0 20px 0; line-height: 1.1; font-family: system-ui, -apple-system, sans-serif;">Make Your Party Unforgettable</h1>
          <p style="font-size: 22px; color: rgba(255,255,255,0.9); margin: 0 0 36px 0; font-family: system-ui, -apple-system, sans-serif;">Premium bounce houses and party rentals delivered to your door. Safe, clean, and ready for fun.</p>
          <a href="#" style="display: inline-block; padding: 18px 36px; background: white; color: #111; font-weight: 600; border-radius: 9999px; text-decoration: none; font-size: 18px; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">Browse Rentals</a>
        </div>
      </section>
    `
  },
  {
    id: 'bh-hero-image',
    label: 'Hero - With Image',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="10" r="2" fill="currentColor"/><path d="M22 20 L16 14 L12 18 L8 14 L2 20" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <section style="width: 100%; padding: 80px 24px; background: #fff;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;">
          <div>
            <span style="display: inline-block; padding: 8px 16px; background: #fef3c7; border-radius: 9999px; font-size: 14px; font-weight: 600; color: #b45309; margin-bottom: 20px; font-family: system-ui, sans-serif;">Premium Party Rentals</span>
            <h1 style="font-size: 52px; font-weight: 800; color: #111; margin: 0 0 24px 0; line-height: 1.1; font-family: system-ui, sans-serif;">Bounce Into Your Best Party Ever</h1>
            <p style="font-size: 18px; color: #6b7280; line-height: 1.7; margin: 0 0 32px 0; font-family: system-ui, sans-serif;">From colorful bounce houses to thrilling water slides, we bring the fun to your backyard. Fully insured, professionally maintained, and delivered with care.</p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="#" style="display: inline-flex; align-items: center; gap: 8px; padding: 16px 28px; background: #f59e0b; color: #000; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif;">Browse Equipment →</a>
              <a href="#" style="display: inline-flex; align-items: center; gap: 8px; padding: 16px 28px; background: #f3f4f6; color: #374151; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif;">Get a Quote</a>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, #fef3c7, #fcd34d); border-radius: 24px; aspect-ratio: 4/3; min-height: 400px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);"></div>
        </div>
      </section>
    `
  },
  {
    id: 'bh-hero-dark',
    label: 'Hero - Dark',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" opacity="0.3"/><line x1="6" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="2"/><line x1="6" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <section style="width: 100%; background: #0a0a0a; padding: 120px 24px; min-height: 600px; display: flex; align-items: center;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;">
          <div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🎪</div>
              <span style="font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.1em; font-family: system-ui, sans-serif;">Party Rentals</span>
            </div>
            <h1 style="font-size: 64px; font-weight: 800; color: white; margin: 0 0 24px 0; line-height: 1.05; font-family: system-ui, sans-serif;">The Ultimate Party Experience</h1>
            <p style="font-size: 20px; color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 40px 0; font-family: system-ui, sans-serif;">Transform any event into an unforgettable celebration with our premium bounce houses and party equipment.</p>
            <div style="display: flex; gap: 16px;">
              <a href="#" style="padding: 18px 32px; background: #f59e0b; color: #000; font-weight: 700; border-radius: 9999px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif;">Start Planning</a>
              <a href="#" style="padding: 18px 32px; background: transparent; color: white; font-weight: 600; border-radius: 9999px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif; border: 2px solid rgba(255,255,255,0.2);">View Gallery</a>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="background: linear-gradient(135deg, #fef3c7, #fcd34d); border-radius: 20px; aspect-ratio: 1; animation: float 6s ease-in-out infinite;"></div>
            <div style="background: linear-gradient(135deg, #dbeafe, #93c5fd); border-radius: 20px; aspect-ratio: 1; margin-top: 40px;"></div>
            <div style="background: linear-gradient(135deg, #d1fae5, #6ee7b7); border-radius: 20px; aspect-ratio: 1; margin-top: -40px;"></div>
            <div style="background: linear-gradient(135deg, #fce7f3, #f9a8d4); border-radius: 20px; aspect-ratio: 1;"></div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'bh-hero-video-bg',
    label: 'Hero - Video BG',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="10,8 16,12 10,16" fill="currentColor"/></svg>',
    content: `
      <section style="position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; overflow: hidden;">
        <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%);"></div>
        <div style="position: relative; z-index: 10; text-align: center; padding: 40px 24px; max-width: 900px;">
          <h1 style="font-size: 72px; font-weight: 800; color: white; margin: 0 0 24px 0; line-height: 1; font-family: system-ui, sans-serif; text-shadow: 0 4px 30px rgba(0,0,0,0.3);">Party Like Never Before</h1>
          <p style="font-size: 24px; color: rgba(255,255,255,0.9); margin: 0 0 48px 0; font-family: system-ui, sans-serif;">Premium bounce house rentals for unforgettable celebrations.</p>
          <a href="#" style="display: inline-flex; align-items: center; gap: 12px; padding: 20px 40px; background: white; color: #111; font-weight: 700; border-radius: 9999px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">Book Your Party →</a>
        </div>
      </section>
    `
  },
  // FEATURE SECTIONS
  {
    id: 'bh-features',
    label: 'Trust Badges',
    category: 'Features',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <section class="bh-features" style="width: 100%; padding: 80px 24px; background: #111;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: center; gap: 64px; flex-wrap: wrap;">
          <div style="text-align: center; max-width: 200px;">
            <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-size: 28px;">&#10003;</div>
            <h3 style="font-size: 16px; font-weight: 700; color: white; margin: 0 0 6px 0; font-family: system-ui, sans-serif;">Fully Insured</h3>
            <p style="font-size: 14px; color: rgba(255,255,255,0.6); margin: 0; font-family: system-ui, sans-serif;">Complete coverage for peace of mind</p>
          </div>
          <div style="text-align: center; max-width: 200px;">
            <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-size: 28px;">&#128666;</div>
            <h3 style="font-size: 16px; font-weight: 700; color: white; margin: 0 0 6px 0; font-family: system-ui, sans-serif;">Free Delivery</h3>
            <p style="font-size: 14px; color: rgba(255,255,255,0.6); margin: 0; font-family: system-ui, sans-serif;">Within 25 miles for all rentals</p>
          </div>
          <div style="text-align: center; max-width: 200px;">
            <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-size: 28px;">&#11088;</div>
            <h3 style="font-size: 16px; font-weight: 700; color: white; margin: 0 0 6px 0; font-family: system-ui, sans-serif;">5-Star Service</h3>
            <p style="font-size: 14px; color: rgba(255,255,255,0.6); margin: 0; font-family: system-ui, sans-serif;">Rated excellent by 500+ customers</p>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'bh-features-grid',
    label: 'Features Grid',
    category: 'Features',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <section style="width: 100%; padding: 96px 24px; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 64px;">
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b; margin-bottom: 12px; font-family: system-ui, sans-serif;">Why Choose Us</span>
            <h2 style="font-size: 40px; font-weight: 800; color: #111; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Everything You Need for a Perfect Party</h2>
            <p style="font-size: 18px; color: #6b7280; max-width: 600px; margin: 0 auto; font-family: system-ui, sans-serif;">From start to finish, we handle every detail so you can focus on making memories.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;">
            <div style="padding: 32px; background: #f9fafb; border-radius: 16px;">
              <div style="width: 56px; height: 56px; background: #fef3c7; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🚚</div>
              <h3 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Free Delivery & Setup</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">We deliver, set up, and pick up at no extra charge within our service area.</p>
            </div>
            <div style="padding: 32px; background: #f9fafb; border-radius: 16px;">
              <div style="width: 56px; height: 56px; background: #dbeafe; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🛡️</div>
              <h3 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Fully Insured</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">All our equipment is covered by comprehensive liability insurance.</p>
            </div>
            <div style="padding: 32px; background: #f9fafb; border-radius: 16px;">
              <div style="width: 56px; height: 56px; background: #d1fae5; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">✨</div>
              <h3 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Sanitized Equipment</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Every piece is thoroughly cleaned and sanitized between rentals.</p>
            </div>
            <div style="padding: 32px; background: #f9fafb; border-radius: 16px;">
              <div style="width: 56px; height: 56px; background: #fce7f3; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📅</div>
              <h3 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Easy Online Booking</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Book anytime with our simple online reservation system.</p>
            </div>
            <div style="padding: 32px; background: #f9fafb; border-radius: 16px;">
              <div style="width: 56px; height: 56px; background: #e9d5ff; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">⏰</div>
              <h3 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">On-Time Service</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">We respect your schedule with punctual delivery and pickup.</p>
            </div>
            <div style="padding: 32px; background: #f9fafb; border-radius: 16px;">
              <div style="width: 56px; height: 56px; background: #fef3c7; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">💬</div>
              <h3 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">24/7 Support</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Need help? Our team is always available to assist you.</p>
            </div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'bh-stats',
    label: 'Stats Section',
    category: 'Features',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="14" width="4" height="6" fill="currentColor"/><rect x="10" y="10" width="4" height="10" fill="currentColor"/><rect x="16" y="6" width="4" height="14" fill="currentColor"/></svg>',
    content: `
      <section style="width: 100%; padding: 80px 24px; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center;">
            <div>
              <span style="font-size: 56px; font-weight: 800; color: white; line-height: 1; font-family: system-ui, sans-serif; display: block;">8+</span>
              <span style="font-size: 16px; color: rgba(255,255,255,0.9); margin-top: 8px; font-family: system-ui, sans-serif; display: block;">Years in Business</span>
            </div>
            <div>
              <span style="font-size: 56px; font-weight: 800; color: white; line-height: 1; font-family: system-ui, sans-serif; display: block;">5K+</span>
              <span style="font-size: 16px; color: rgba(255,255,255,0.9); margin-top: 8px; font-family: system-ui, sans-serif; display: block;">Parties Served</span>
            </div>
            <div>
              <span style="font-size: 56px; font-weight: 800; color: white; line-height: 1; font-family: system-ui, sans-serif; display: block;">50+</span>
              <span style="font-size: 16px; color: rgba(255,255,255,0.9); margin-top: 8px; font-family: system-ui, sans-serif; display: block;">Rental Options</span>
            </div>
            <div>
              <span style="font-size: 56px; font-weight: 800; color: white; line-height: 1; font-family: system-ui, sans-serif; display: block;">4.9</span>
              <span style="font-size: 16px; color: rgba(255,255,255,0.9); margin-top: 8px; font-family: system-ui, sans-serif; display: block;">Average Rating</span>
            </div>
          </div>
        </div>
      </section>
    `
  },
  // PRICING SECTIONS
  {
    id: 'bh-pricing',
    label: 'Pricing Table',
    category: 'Pricing',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/><line x1="9" y1="21" x2="9" y2="9" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <section style="width: 100%; padding: 96px 24px; background: #f9fafb;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 64px;">
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b; margin-bottom: 12px; font-family: system-ui, sans-serif;">Pricing</span>
            <h2 style="font-size: 40px; font-weight: 800; color: #111; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Simple, Transparent Pricing</h2>
            <p style="font-size: 18px; color: #6b7280; font-family: system-ui, sans-serif;">No hidden fees. Delivery and setup included.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            <div style="background: white; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb;">
              <span style="font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-family: system-ui, sans-serif;">Basic</span>
              <div style="margin: 16px 0 24px;">
                <span style="font-size: 48px; font-weight: 800; color: #111; font-family: system-ui, sans-serif;">$149</span>
                <span style="font-size: 16px; color: #6b7280; font-family: system-ui, sans-serif;">/day</span>
              </div>
              <ul style="list-style: none; padding: 0; margin: 0 0 32px 0;">
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Standard bounce house</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Up to 8 hours rental</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Free delivery & setup</li>
              </ul>
              <a href="#" style="display: block; text-align: center; padding: 14px 24px; background: #f3f4f6; color: #374151; font-weight: 600; border-radius: 8px; text-decoration: none; font-family: system-ui, sans-serif;">Book Now</a>
            </div>
            <div style="background: #111; border-radius: 16px; padding: 40px; position: relative; transform: scale(1.05);">
              <span style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 6px 16px; background: #f59e0b; color: #000; font-size: 12px; font-weight: 700; border-radius: 9999px; font-family: system-ui, sans-serif;">MOST POPULAR</span>
              <span style="font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.05em; font-family: system-ui, sans-serif;">Premium</span>
              <div style="margin: 16px 0 24px;">
                <span style="font-size: 48px; font-weight: 800; color: white; font-family: system-ui, sans-serif;">$249</span>
                <span style="font-size: 16px; color: rgba(255,255,255,0.7); font-family: system-ui, sans-serif;">/day</span>
              </div>
              <ul style="list-style: none; padding: 0; margin: 0 0 32px 0;">
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: rgba(255,255,255,0.9); font-family: system-ui, sans-serif;"><span style="color: #f59e0b;">✓</span> Large combo unit</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: rgba(255,255,255,0.9); font-family: system-ui, sans-serif;"><span style="color: #f59e0b;">✓</span> Up to 10 hours rental</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: rgba(255,255,255,0.9); font-family: system-ui, sans-serif;"><span style="color: #f59e0b;">✓</span> Free delivery & setup</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: rgba(255,255,255,0.9); font-family: system-ui, sans-serif;"><span style="color: #f59e0b;">✓</span> Tables & chairs included</li>
              </ul>
              <a href="#" style="display: block; text-align: center; padding: 14px 24px; background: #f59e0b; color: #000; font-weight: 600; border-radius: 8px; text-decoration: none; font-family: system-ui, sans-serif;">Book Now</a>
            </div>
            <div style="background: white; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb;">
              <span style="font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-family: system-ui, sans-serif;">Ultimate</span>
              <div style="margin: 16px 0 24px;">
                <span style="font-size: 48px; font-weight: 800; color: #111; font-family: system-ui, sans-serif;">$399</span>
                <span style="font-size: 16px; color: #6b7280; font-family: system-ui, sans-serif;">/day</span>
              </div>
              <ul style="list-style: none; padding: 0; margin: 0 0 32px 0;">
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Water slide or obstacle</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Full day rental</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Free delivery & setup</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Full party package</li>
              </ul>
              <a href="#" style="display: block; text-align: center; padding: 14px 24px; background: #f3f4f6; color: #374151; font-weight: 600; border-radius: 8px; text-decoration: none; font-family: system-ui, sans-serif;">Book Now</a>
            </div>
          </div>
        </div>
      </section>
    `
  },
  // FAQ SECTION
  {
    id: 'bh-faq',
    label: 'FAQ Section',
    category: 'Content',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><text x="12" y="17" text-anchor="middle" font-size="12" fill="currentColor">?</text></svg>',
    content: `
      <section style="width: 100%; padding: 96px 24px; background: white;">
        <div style="max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 64px;">
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b; margin-bottom: 12px; font-family: system-ui, sans-serif;">FAQ</span>
            <h2 style="font-size: 40px; font-weight: 800; color: #111; margin: 0; font-family: system-ui, sans-serif;">Frequently Asked Questions</h2>
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px;">
              <h3 style="font-size: 17px; font-weight: 700; color: #111; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">How far in advance should I book?</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.7; margin: 0; font-family: system-ui, sans-serif;">We recommend booking at least 1-2 weeks in advance, especially for weekend events. Popular dates during summer can fill up quickly!</p>
            </div>
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px;">
              <h3 style="font-size: 17px; font-weight: 700; color: #111; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">What happens if it rains?</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.7; margin: 0; font-family: system-ui, sans-serif;">We offer free rescheduling for weather-related cancellations. Just let us know 24 hours in advance and we'll find a new date that works for you.</p>
            </div>
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px;">
              <h3 style="font-size: 17px; font-weight: 700; color: #111; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Do I need to provide power?</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.7; margin: 0; font-family: system-ui, sans-serif;">Yes, our inflatables require a standard 110v outlet within 100 feet. We can also provide a generator rental if needed.</p>
            </div>
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px;">
              <h3 style="font-size: 17px; font-weight: 700; color: #111; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Is supervision required?</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.7; margin: 0; font-family: system-ui, sans-serif;">Yes, adult supervision is required at all times. We provide safety instructions upon delivery.</p>
            </div>
          </div>
        </div>
      </section>
    `
  },
  // NAVIGATION
  {
    id: 'bh-navbar',
    label: 'Navigation Bar',
    category: 'Navigation',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <nav style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: white; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🎪</div>
          <span style="font-size: 20px; font-weight: 800; color: #111; font-family: system-ui, sans-serif;">BounceKingdom</span>
        </div>
        <div style="display: flex; align-items: center; gap: 32px;">
          <a href="#" style="font-size: 15px; color: #374151; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Home</a>
          <a href="#" style="font-size: 15px; color: #374151; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Rentals</a>
          <a href="#" style="font-size: 15px; color: #374151; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">About</a>
          <a href="#" style="font-size: 15px; color: #374151; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Contact</a>
        </div>
        <a href="#" style="padding: 12px 24px; background: #f59e0b; color: #000; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 14px; font-family: system-ui, sans-serif;">Book Now</a>
      </nav>
    `
  },
  {
    id: 'bh-navbar-dark',
    label: 'Navigation Dark',
    category: 'Navigation',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="4" rx="1" fill="currentColor" opacity="0.3"/><line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <nav style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #111;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🎪</div>
          <span style="font-size: 20px; font-weight: 800; color: white; font-family: system-ui, sans-serif;">BounceKingdom</span>
        </div>
        <div style="display: flex; align-items: center; gap: 32px;">
          <a href="#" style="font-size: 15px; color: rgba(255,255,255,0.9); text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Home</a>
          <a href="#" style="font-size: 15px; color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Rentals</a>
          <a href="#" style="font-size: 15px; color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">About</a>
          <a href="#" style="font-size: 15px; color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Contact</a>
        </div>
        <a href="#" style="padding: 12px 24px; background: #f59e0b; color: #000; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 14px; font-family: system-ui, sans-serif;">Book Now</a>
      </nav>
    `
  },
  // FOOTER
  {
    id: 'bh-footer',
    label: 'Footer',
    category: 'Navigation',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="16" width="20" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <footer style="padding: 64px 24px 32px; background: #111;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🎪</div>
                <span style="font-size: 20px; font-weight: 800; color: white; font-family: system-ui, sans-serif;">BounceKingdom</span>
              </div>
              <p style="font-size: 15px; color: rgba(255,255,255,0.6); line-height: 1.7; margin: 0; font-family: system-ui, sans-serif;">Making parties unforgettable since 2015. Premium bounce houses and party rentals delivered to your door.</p>
            </div>
            <div>
              <h4 style="font-size: 14px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 20px 0; font-family: system-ui, sans-serif;">Company</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 14px; color: rgba(255,255,255,0.6); text-decoration: none; font-family: system-ui, sans-serif;">About Us</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 14px; color: rgba(255,255,255,0.6); text-decoration: none; font-family: system-ui, sans-serif;">Our Team</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 14px; color: rgba(255,255,255,0.6); text-decoration: none; font-family: system-ui, sans-serif;">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 style="font-size: 14px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 20px 0; font-family: system-ui, sans-serif;">Services</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 14px; color: rgba(255,255,255,0.6); text-decoration: none; font-family: system-ui, sans-serif;">Bounce Houses</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 14px; color: rgba(255,255,255,0.6); text-decoration: none; font-family: system-ui, sans-serif;">Water Slides</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 14px; color: rgba(255,255,255,0.6); text-decoration: none; font-family: system-ui, sans-serif;">Party Packages</a></li>
              </ul>
            </div>
            <div>
              <h4 style="font-size: 14px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 20px 0; font-family: system-ui, sans-serif;">Contact</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px; font-size: 14px; color: rgba(255,255,255,0.6); font-family: system-ui, sans-serif;">(555) 123-4567</li>
                <li style="margin-bottom: 12px; font-size: 14px; color: rgba(255,255,255,0.6); font-family: system-ui, sans-serif;">hello@bouncekingdom.com</li>
              </ul>
            </div>
          </div>
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; text-align: center;">
            <p style="font-size: 14px; color: rgba(255,255,255,0.4); margin: 0; font-family: system-ui, sans-serif;">© 2025 BounceKingdom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `
  },
  // CARDS & COMPONENTS
  {
    id: 'bh-rental-card',
    label: 'Rental Card',
    category: 'Cards',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="3" width="18" height="10" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <div class="bh-card" style="background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; max-width: 320px; display: inline-block;">
        <div style="aspect-ratio: 4/3; background: linear-gradient(135deg, #fef3c7, #fcd34d); min-height: 180px;"></div>
        <div style="padding: 20px;">
          <span style="display: inline-block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #f59e0b; margin-bottom: 8px; font-family: system-ui, sans-serif;">Bounce House</span>
          <h3 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 12px 0; line-height: 1.3; font-family: system-ui, sans-serif;">Rainbow Castle</h3>
          <div style="display: flex; align-items: baseline; gap: 4px;">
            <span style="font-size: 24px; font-weight: 800; color: #111; font-family: system-ui, sans-serif;">$199</span>
            <span style="font-size: 14px; color: #6b7280; font-family: system-ui, sans-serif;">/ day</span>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'bh-rental-card-horizontal',
    label: 'Rental Card Wide',
    category: 'Cards',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="2" y="6" width="8" height="12" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <div style="display: flex; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; max-width: 600px;">
        <div style="width: 240px; flex-shrink: 0; background: linear-gradient(135deg, #dbeafe, #93c5fd);"></div>
        <div style="padding: 24px; flex: 1;">
          <span style="display: inline-block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #3b82f6; margin-bottom: 8px; font-family: system-ui, sans-serif;">Water Slide</span>
          <h3 style="font-size: 20px; font-weight: 700; color: #111; margin: 0 0 12px 0; line-height: 1.3; font-family: system-ui, sans-serif;">Tropical Paradise Slide</h3>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">22ft tall water slide with splash pool. Perfect for hot summer days!</p>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: baseline; gap: 4px;">
              <span style="font-size: 24px; font-weight: 800; color: #111; font-family: system-ui, sans-serif;">$349</span>
              <span style="font-size: 14px; color: #6b7280; font-family: system-ui, sans-serif;">/ day</span>
            </div>
            <a href="#" style="padding: 10px 20px; background: #3b82f6; color: white; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 14px; font-family: system-ui, sans-serif;">Book Now</a>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'bh-testimonial',
    label: 'Testimonial',
    category: 'Components',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h8l4 4V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <div class="bh-testimonial" style="background: #f9fafb; border-radius: 16px; padding: 32px; max-width: 400px; display: inline-block;">
        <div style="display: flex; gap: 4px; margin-bottom: 20px;">
          <span style="color: #f59e0b; font-size: 18px;">&#9733;</span>
          <span style="color: #f59e0b; font-size: 18px;">&#9733;</span>
          <span style="color: #f59e0b; font-size: 18px;">&#9733;</span>
          <span style="color: #f59e0b; font-size: 18px;">&#9733;</span>
          <span style="color: #f59e0b; font-size: 18px;">&#9733;</span>
        </div>
        <blockquote style="font-size: 17px; color: #374151; line-height: 1.7; margin: 0 0 24px 0; font-family: system-ui, sans-serif;">"The kids had an absolute blast! Setup was quick and the bounce house was spotlessly clean. Highly recommend!"</blockquote>
        <div style="display: flex; align-items: center; gap: 14px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 50%;"></div>
          <div>
            <strong style="font-size: 15px; font-weight: 700; color: #111; font-family: system-ui, sans-serif; display: block;">Sarah M.</strong>
            <span style="font-size: 13px; color: #6b7280; font-family: system-ui, sans-serif;">Birthday Party Mom</span>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'bh-cta',
    label: 'CTA Banner',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <section class="bh-cta" style="width: 100%; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 80px 24px; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h2 style="font-size: 40px; font-weight: 800; color: white; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Ready to Book Your Party?</h2>
          <p style="font-size: 20px; color: rgba(255,255,255,0.9); margin: 0 0 32px 0; font-family: system-ui, sans-serif;">Get a free quote in minutes. No obligation.</p>
          <a href="#" style="display: inline-flex; align-items: center; gap: 10px; padding: 18px 36px; background: white; color: #111; font-weight: 600; border-radius: 9999px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif;">Get Started &rarr;</a>
        </div>
      </section>
    `
  },
  {
    id: 'bh-about',
    label: 'About Section',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="18" fill="none" stroke="currentColor" stroke-width="2"/><line x1="14" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/><line x1="14" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/><line x1="14" y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <section class="bh-about" style="width: 100%; padding: 96px 24px; background: #f9fafb;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;">
          <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); border-radius: 16px; aspect-ratio: 4/3; min-height: 300px;"></div>
          <div>
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b; margin-bottom: 16px; font-family: system-ui, sans-serif;">About Us</span>
            <h2 style="font-size: 40px; font-weight: 800; color: #111; margin: 0 0 24px 0; line-height: 1.2; font-family: system-ui, sans-serif;">Your Local Family-Owned Party Rental Company</h2>
            <p style="font-size: 17px; color: #4b5563; line-height: 1.75; margin: 0 0 32px 0; font-family: system-ui, sans-serif;">Since 2015, we've been bringing joy to families across the greater metro area. What started as a single bounce house has grown into a full-service party rental company serving thousands of happy customers.</p>
            <div style="display: flex; gap: 48px; padding: 24px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
              <div>
                <span style="font-size: 36px; font-weight: 800; color: #111; line-height: 1; font-family: system-ui, sans-serif; display: block;">8+</span>
                <span style="font-size: 14px; color: #6b7280; margin-top: 4px; font-family: system-ui, sans-serif; display: block;">Years Experience</span>
              </div>
              <div>
                <span style="font-size: 36px; font-weight: 800; color: #111; line-height: 1; font-family: system-ui, sans-serif; display: block;">5,000+</span>
                <span style="font-size: 14px; color: #6b7280; margin-top: 4px; font-family: system-ui, sans-serif; display: block;">Events Served</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'bh-contact',
    label: 'Contact Form',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="2,4 12,13 22,4" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <section class="bh-contact" style="width: 100%; padding: 96px 24px; background: #111;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px;">
          <div>
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b; margin-bottom: 12px; font-family: system-ui, sans-serif;">Contact Us</span>
            <h2 style="font-size: 40px; font-weight: 800; color: white; margin: 0 0 16px 0; line-height: 1.2; font-family: system-ui, sans-serif;">Get In Touch</h2>
            <p style="font-size: 17px; color: rgba(255,255,255,0.7); margin: 0 0 40px 0; font-family: system-ui, sans-serif;">Have questions? We're here to help make your event amazing.</p>
            <div style="margin-bottom: 24px; display: flex; align-items: flex-start; gap: 16px;">
              <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-size: 20px;">&#128222;</div>
              <div>
                <span style="display: block; font-size: 13px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; font-family: system-ui, sans-serif;">Phone</span>
                <span style="font-size: 16px; color: white; font-family: system-ui, sans-serif;">(555) 123-4567</span>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 16px;">
              <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-size: 20px;">&#9993;</div>
              <div>
                <span style="display: block; font-size: 13px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; font-family: system-ui, sans-serif;">Email</span>
                <span style="font-size: 16px; color: white; font-family: system-ui, sans-serif;">hello@bouncekingdom.com</span>
              </div>
            </div>
          </div>
          <div style="background: white; border-radius: 16px; padding: 40px;">
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; font-family: system-ui, sans-serif;">Your Name</label>
              <input type="text" placeholder="John Doe" style="width: 100%; padding: 14px 16px; font-size: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; box-sizing: border-box; font-family: system-ui, sans-serif;" />
            </div>
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; font-family: system-ui, sans-serif;">Email</label>
              <input type="email" placeholder="john@example.com" style="width: 100%; padding: 14px 16px; font-size: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; box-sizing: border-box; font-family: system-ui, sans-serif;" />
            </div>
            <div style="margin-bottom: 24px;">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; font-family: system-ui, sans-serif;">Message</label>
              <textarea placeholder="Tell us about your event..." style="width: 100%; padding: 14px 16px; font-size: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; min-height: 120px; resize: vertical; box-sizing: border-box; font-family: system-ui, sans-serif;"></textarea>
            </div>
            <button type="button" style="width: 100%; padding: 16px 32px; background: #111; color: white; font-size: 16px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; font-family: system-ui, sans-serif;">Send Message</button>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'bh-gallery',
    label: 'Gallery Grid',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    content: `
      <section class="bh-gallery" style="width: 100%; padding: 96px 24px; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 48px;">
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b; margin-bottom: 12px; font-family: system-ui, sans-serif;">Our Rentals</span>
            <h2 style="font-size: 40px; font-weight: 800; color: #111; margin: 0; font-family: system-ui, sans-serif;">Featured Equipment</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            <div style="background: linear-gradient(135deg, #fef3c7, #fcd34d); border-radius: 16px; aspect-ratio: 1; min-height: 200px;"></div>
            <div style="background: linear-gradient(135deg, #fee2e2, #fca5a5); border-radius: 16px; aspect-ratio: 1; min-height: 200px;"></div>
            <div style="background: linear-gradient(135deg, #dbeafe, #93c5fd); border-radius: 16px; aspect-ratio: 1; min-height: 200px;"></div>
            <div style="background: linear-gradient(135deg, #d1fae5, #6ee7b7); border-radius: 16px; aspect-ratio: 1; min-height: 200px;"></div>
            <div style="background: linear-gradient(135deg, #e9d5ff, #c084fc); border-radius: 16px; aspect-ratio: 1; min-height: 200px;"></div>
            <div style="background: linear-gradient(135deg, #fef3c7, #fcd34d); border-radius: 16px; aspect-ratio: 1; min-height: 200px;"></div>
          </div>
        </div>
      </section>
    `
  }
]

// Helper to add blocks in batches to prevent UI freezing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addBlocksInBatches = (blockManager: any, blocks: Record<string, unknown>[], batchSize = 3) => {
  return new Promise<void>((resolve) => {
    let index = 0

    const addBatch = () => {
      const batch = blocks.slice(index, index + batchSize)
      batch.forEach((block) => {
        blockManager.add(block.id, {
          label: block.label,
          category: block.category,
          media: block.media,
          content: block.content
        })
      })
      index += batchSize

      if (index < blocks.length) {
        // Use requestAnimationFrame for smoother loading
        requestAnimationFrame(addBatch)
      } else {
        resolve()
      }
    }

    // Start adding blocks
    requestAnimationFrame(addBatch)
  })
}

// Initialize GrapeJS editor
const initEditor = async () => {
  try {
    await loadGrapeJS()

    // Wait for next tick to ensure DOM is ready
    await nextTick()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grapesjs = (window as any).grapesjs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blocksBasic = (window as any)['grapesjs-blocks-basic']

    // Initialize the editor with minimal config first
    editor.value = grapesjs.init({
      container: '#gjs',
      height: '100%',
      width: 'auto',
      fromElement: false,
      storageManager: false,
      // Disable autoscroll on component drag (reduces lag)
      dragMode: 'absolute',
      // Configure plugins - load basic blocks only
      plugins: blocksBasic ? [blocksBasic] : [],
      pluginsOpts: blocksBasic
        ? {
            'grapesjs-blocks-basic': {
              flexGrid: true,
              blocks: ['column1', 'column2', 'column3', 'text', 'link', 'image', 'video'],
              category: 'Basic'
            }
          }
        : {},
      // Configure panels - remove defaults for custom UI
      panels: { defaults: [] },
      // Device manager for responsive preview
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px', widthMedia: '992px' },
          { name: 'Mobile', width: '375px', widthMedia: '480px' }
        ]
      },
      // Style manager configuration
      styleManager: {
        appendTo: '#styles-container',
        sectors: [
          {
            name: 'Dimension',
            open: true,
            buildProps: ['width', 'height', 'min-height', 'max-width', 'padding', 'margin']
          },
          {
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration']
          },
          {
            name: 'Background',
            open: false,
            buildProps: ['background-color', 'background-image', 'background-repeat', 'background-position', 'background-size']
          },
          {
            name: 'Border',
            open: false,
            buildProps: ['border-radius', 'border', 'box-shadow']
          },
          {
            name: 'Layout',
            open: false,
            buildProps: ['display', 'flex-direction', 'justify-content', 'align-items', 'gap']
          }
        ]
      },
      // Canvas styles
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
        ]
      }
    })

    // Add Custom HTML block first (most important for user)
    const blockManager = editor.value.Blocks
    blockManager.add(customHtmlBlock.id, {
      label: customHtmlBlock.label,
      category: customHtmlBlock.category,
      media: customHtmlBlock.media,
      content: customHtmlBlock.content
    })

    // Load ALL custom blocks BEFORE rendering the block manager

    // This ensures all preset blocks (Heroes, Features, etc.) are visible

    const customBlocks = getCustomBlocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await addBlocksInBatches(blockManager, customBlocks as any[], 5) // Larger batch for faster loading

    // Now render managers to custom containers (after all blocks are added)
    const blocksEl = document.getElementById('blocks-container')
    if (blocksEl) {
      blocksEl.appendChild(editor.value.BlockManager.render())
    }

    const layersEl = document.getElementById('layers-container')
    if (layersEl) {
      layersEl.appendChild(editor.value.LayerManager.render())
    }

    const stylesEl = document.getElementById('styles-container')
    if (stylesEl) {
      stylesEl.appendChild(editor.value.StyleManager.render())
    }

    // Set content based on selected template (if any)
    if (selectedTemplateId.value) {
      editor.value.setComponents(getTemplateContent(selectedTemplateId.value))
    }

    // Load saved blocks from localStorage
    if (savedBlocks.value.length > 0) {
      savedBlocks.value.forEach((block) => {
        blockManager.add(block.id, {
          label: block.name,
          category: 'My Components',
          media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>',
          content: block.html
        })
      })
    }

    // Listen for selection changes
    editor.value.on('component:selected', updateSelectionState)
    editor.value.on('component:deselected', updateSelectionState)

    // Show editor now that everything is loaded
    isLoading.value = false
  } catch (error) {
    console.error('Failed to initialize GrapeJS:', error)
    isLoading.value = false
  }
}

// Device switcher
const switchDevice = (device: string) => {
  if (editor.value) {
    editor.value.setDevice(device)
  }
}

// Get current device
const currentDevice = ref('Desktop')
watch(editor, (ed) => {
  if (ed) {
    ed.on('device:change', () => {
      currentDevice.value = ed.getDevice()
    })
  }
})

// Preview mode
const togglePreview = () => {
  if (editor.value) {
    editor.value.Commands.run('preview')
  }
}

// Undo/Redo
const undo = () => editor.value?.UndoManager.undo()
const redo = () => editor.value?.UndoManager.redo()

onMounted(async () => {
  // Add click outside listener for pages panel
  window.addEventListener('click', closePagesPanelOnClickOutside)

  // Add keyboard shortcuts
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showPagesPanel.value) {
      showPagesPanel.value = false
    }
  }
  window.addEventListener('keydown', handleKeydown)

  // Initialize editor with a small delay to ensure DOM is ready
  await nextTick()
  setTimeout(() => {
    initEditor()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('click', closePagesPanelOnClickOutside)

  if (editor.value) {
    try {
      editor.value.destroy()
    } catch (e) {
      console.warn('Error destroying editor:', e)
    }
  }
})
</script>

<template>
  <div class="grape-editor">
    <!-- Top Bar -->
    <header class="editor-header">
      <div class="header-left">
        <NuxtLink
          to="/app/website"
          class="back-link"
        >
          <UIcon name="i-lucide-arrow-left" />
          <span>Back</span>
        </NuxtLink>
        <span class="divider" />

        <!-- Page Switcher -->
        <div
          ref="pagesSwitcherRef"
          class="page-switcher-container"
        >
          <button
            class="page-switcher"
            @click.stop="showPagesPanel = !showPagesPanel"
          >
            <UIcon name="i-lucide-file-text" />
            <span>{{ currentPage?.name || 'Home' }}</span>
            <UIcon
              name="i-lucide-chevron-down"
              class="chevron"
              :class="{ rotated: showPagesPanel }"
            />
          </button>

          <!-- Pages Dropdown Panel -->
          <Transition name="dropdown">
            <div
              v-if="showPagesPanel"
              class="pages-panel"
            >
              <div class="pages-panel-header">
                <span>Pages</span>
                <span class="page-count">{{ pages.length }}</span>
              </div>
              <div class="pages-list">
                <button
                  v-for="page in pages"
                  :key="page.id"
                  class="page-item"
                  :class="{ active: currentPageId === page.id }"
                  @click="switchPage(page.id)"
                >
                  <UIcon
                    :name="page.isHome ? 'i-lucide-home' : 'i-lucide-file'"
                    class="page-icon"
                  />
                  <span class="page-name">{{ page.name }}</span>
                  <span
                    v-if="page.isHome"
                    class="home-badge"
                  >Home</span>
                  <button
                    v-if="!page.isHome"
                    class="delete-page-btn"
                    @click.stop="deletePage(page.id)"
                  >
                    <UIcon name="i-lucide-x" />
                  </button>
                </button>
              </div>
              <div class="add-page-section">
                <input
                  v-model="newPageName"
                  type="text"
                  placeholder="New page name..."
                  class="new-page-input"
                  @keydown.enter="addPage"
                >
                <button
                  class="add-page-btn"
                  :disabled="!newPageName.trim()"
                  @click="addPage"
                >
                  <UIcon name="i-lucide-plus" />
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <span class="prototype-badge">Prototype</span>
      </div>

      <div class="header-center">
        <!-- Undo/Redo -->
        <div class="action-group">
          <button
            class="action-btn"
            title="Undo"
            @click="undo"
          >
            <UIcon name="i-lucide-undo-2" />
          </button>
          <button
            class="action-btn"
            title="Redo"
            @click="redo"
          >
            <UIcon name="i-lucide-redo-2" />
          </button>
        </div>

        <!-- Device selector -->
        <div class="device-selector">
          <button
            class="device-btn"
            :class="{ active: currentDevice === 'Desktop' }"
            title="Desktop"
            @click="switchDevice('Desktop')"
          >
            <UIcon name="i-lucide-monitor" />
          </button>
          <button
            class="device-btn"
            :class="{ active: currentDevice === 'Tablet' }"
            title="Tablet"
            @click="switchDevice('Tablet')"
          >
            <UIcon name="i-lucide-tablet" />
          </button>
          <button
            class="device-btn"
            :class="{ active: currentDevice === 'Mobile' }"
            title="Mobile"
            @click="switchDevice('Mobile')"
          >
            <UIcon name="i-lucide-smartphone" />
          </button>
        </div>
      </div>

      <div class="header-right">
        <button
          class="header-btn"
          :class="{ disabled: !hasSelection }"
          :disabled="!hasSelection"
          title="Select a component to save"
          @click="openSaveComponentModal"
        >
          <UIcon name="i-lucide-bookmark-plus" />
          <span>Save Block</span>
        </button>
        <button
          class="header-btn"
          @click="showTemplateModal = true"
        >
          <UIcon name="i-lucide-layout-template" />
          <span>Templates</span>
        </button>
        <button
          class="header-btn"
          title="Editor Help"
          @click="showHelpModal = true"
        >
          <UIcon name="i-lucide-help-circle" />
          <span>Help</span>
        </button>
        <button
          class="header-btn"
          @click="togglePreview"
        >
          <UIcon name="i-lucide-eye" />
          <span>Preview</span>
        </button>
        <button class="header-btn primary">
          <UIcon name="i-lucide-save" />
          <span>Save</span>
        </button>
      </div>
    </header>

    <div class="editor-body">
      <!-- Left Sidebar -->
      <aside class="editor-sidebar">
        <div class="sidebar-tabs">
          <button
            class="tab-btn"
            :class="{ active: activePanel === 'blocks' }"
            @click="activePanel = 'blocks'"
          >
            <UIcon name="i-lucide-layout-grid" />
            <span>Blocks</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activePanel === 'layers' }"
            @click="activePanel = 'layers'"
          >
            <UIcon name="i-lucide-layers" />
            <span>Layers</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activePanel === 'styles' }"
            @click="activePanel = 'styles'"
          >
            <UIcon name="i-lucide-paintbrush" />
            <span>Styles</span>
          </button>
        </div>

        <div class="sidebar-content">
          <div
            id="blocks-container"
            :class="{ hidden: activePanel !== 'blocks' }"
          />
          <div
            id="layers-container"
            :class="{ hidden: activePanel !== 'layers' }"
          />
          <div
            id="styles-container"
            :class="{ hidden: activePanel !== 'styles' }"
          />
        </div>
      </aside>

      <!-- Canvas -->
      <main class="editor-canvas">
        <div
          v-if="isLoading"
          class="loading-state"
        >
          <div class="spinner" />
          <span>Loading GrapeJS Editor...</span>
        </div>
        <div id="gjs" />
      </main>
    </div>

    <!-- Template Selector Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showTemplateModal"
          class="template-modal-overlay"
          @click.self="showTemplateModal = false"
        >
          <div class="template-modal">
            <div class="modal-header">
              <h2>Choose a Template</h2>
              <p>Select a starting point for your website</p>
            </div>

            <div class="template-grid">
              <button
                v-for="template in presetTemplates"
                :key="template.id"
                class="template-card"
                :class="{ selected: selectedTemplateId === template.id }"
                @click="loadTemplate(template.id)"
              >
                <div
                  class="template-icon"
                  :style="{ backgroundColor: template.color + '20', color: template.color }"
                >
                  <UIcon
                    :name="template.icon"
                    class="text-2xl"
                  />
                </div>
                <h3>{{ template.name }}</h3>
                <p>{{ template.description }}</p>
              </button>
            </div>

            <div class="modal-footer">
              <button
                class="close-btn"
                @click="showTemplateModal = false"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Save Component Modal -->
      <Transition name="modal">
        <div
          v-if="showSaveComponentModal"
          class="template-modal-overlay"
          @click.self="showSaveComponentModal = false"
        >
          <div class="save-component-modal">
            <div class="modal-header">
              <h2>Save as Reusable Block</h2>
              <p>Give your block a name so you can reuse it later</p>
            </div>

            <div class="save-form">
              <div class="form-group">
                <label>Block Name</label>
                <input
                  v-model="saveComponentName"
                  type="text"
                  placeholder="e.g., My Hero Section"
                  class="form-input"
                  @keydown.enter="saveSelectedComponent"
                >
              </div>

              <div class="form-group">
                <label>Category</label>
                <input
                  v-model="saveComponentCategory"
                  type="text"
                  placeholder="My Components"
                  class="form-input"
                >
              </div>

              <div class="preview-section">
                <label>Preview</label>
                <div
                  class="html-preview"
                  v-html="selectedComponentHtml"
                />
              </div>
            </div>

            <div class="modal-footer">
              <button
                class="close-btn"
                @click="showSaveComponentModal = false"
              >
                Cancel
              </button>
              <button
                class="save-btn"
                :disabled="!saveComponentName.trim()"
                @click="saveSelectedComponent"
              >
                <UIcon name="i-lucide-bookmark-check" />
                Save Block
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Help Modal -->
      <Transition name="modal">
        <div
          v-if="showHelpModal"
          class="template-modal-overlay"
          @click.self="showHelpModal = false"
        >
          <div class="help-modal">
            <div class="modal-header">
              <h2>How to Use the Editor</h2>
              <button
                class="close-icon-btn"
                @click="showHelpModal = false"
              >
                <UIcon name="i-lucide-x" />
              </button>
            </div>

            <div class="help-content">
              <div class="help-section">
                <h3><UIcon name="i-lucide-image" /> Adding Images</h3>
                <ol>
                  <li>Click on any placeholder box in the canvas</li>
                  <li>Go to the <strong>Styles</strong> tab in the left sidebar</li>
                  <li>Find <strong>Background</strong> section and click to expand</li>
                  <li>Use <strong>Background Image</strong> to add your image URL</li>
                  <li>Set <strong>Background Size</strong> to "cover" for best results</li>
                </ol>
                <p class="help-tip">
                  💡 Tip: You can also drag an "Image" block from the Basic category and double-click to set the source.
                </p>
              </div>

              <div class="help-section">
                <h3><UIcon name="i-lucide-layout-grid" /> Working with Grids</h3>
                <ol>
                  <li>Click on a grid container (the parent element)</li>
                  <li>Open the <strong>Styles</strong> tab</li>
                  <li>Find <strong>Layout</strong> section</li>
                  <li>Adjust <strong>display</strong>, <strong>gap</strong>, and <strong>grid-template-columns</strong></li>
                </ol>
                <p class="help-tip">
                  💡 Tip: For columns, use values like "repeat(3, 1fr)" for 3 equal columns or "1fr 2fr" for a 1:2 ratio.
                </p>
              </div>

              <div class="help-section">
                <h3><UIcon name="i-lucide-type" /> Editing Text</h3>
                <ol>
                  <li><strong>Double-click</strong> any text to edit it inline</li>
                  <li>Click once to select, then use Styles to change font, color, size</li>
                </ol>
              </div>

              <div class="help-section">
                <h3><UIcon name="i-lucide-layers" /> Using Layers</h3>
                <ol>
                  <li>Switch to the <strong>Layers</strong> tab to see your page structure</li>
                  <li>Click on layer names to select elements that are hard to click</li>
                  <li>Drag layers to reorder elements</li>
                </ol>
              </div>

              <div class="help-section">
                <h3><UIcon name="i-lucide-keyboard" /> Keyboard Shortcuts</h3>
                <ul class="shortcuts-list">
                  <li><kbd>Ctrl/Cmd + Z</kbd> Undo</li>
                  <li><kbd>Ctrl/Cmd + Shift + Z</kbd> Redo</li>
                  <li><kbd>Delete</kbd> Remove selected element</li>
                  <li><kbd>Ctrl/Cmd + C/V</kbd> Copy/Paste element</li>
                </ul>
              </div>
            </div>

            <div class="modal-footer">
              <button
                class="primary-btn"
                @click="showHelpModal = false"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style>
/* GrapeJS base overrides - must be global */
.gjs-one-bg {
  background-color: #1a1a1a !important;
}

.gjs-two-color {
  color: #ddd !important;
}

.gjs-three-bg {
  background-color: #f59e0b !important;
}

.gjs-four-color,
.gjs-four-color-h:hover {
  color: #f59e0b !important;
}

/* Block styles */
.gjs-block {
  width: auto !important;
  min-height: auto !important;
  padding: 12px !important;
  background: #262626 !important;
  border: 1px solid #404040 !important;
  border-radius: 8px !important;
  margin: 4px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 8px !important;
  cursor: grab !important;
}

.gjs-block:hover {
  border-color: #f59e0b !important;
  background: #333 !important;
}

.gjs-block svg {
  width: 28px !important;
  height: 28px !important;
  color: #888 !important;
}

.gjs-block:hover svg {
  color: #f59e0b !important;
}

.gjs-block-label {
  font-size: 11px !important;
  font-weight: 500 !important;
  color: #aaa !important;
  text-align: center !important;
}

/* Category styles */
.gjs-block-category {
  background: transparent !important;
}

.gjs-block-category .gjs-title {
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  padding: 16px 12px 8px !important;
  background: transparent !important;
  border-bottom: 1px solid #333 !important;
  color: #666 !important;
}

.gjs-blocks-c {
  padding: 8px !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 4px !important;
}

/* Layer styles */
.gjs-layer {
  background: #262626 !important;
  border-radius: 6px !important;
  margin: 4px 8px !important;
}

.gjs-layer:hover {
  background: #333 !important;
}

.gjs-layer-name {
  color: #ddd !important;
}

/* Style manager styles */
.gjs-sm-sector {
  background: transparent !important;
}

.gjs-sm-sector-title {
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  padding: 16px 12px 8px !important;
  background: transparent !important;
  border-bottom: 1px solid #333 !important;
  color: #666 !important;
}

.gjs-sm-properties {
  padding: 12px !important;
}

.gjs-sm-label {
  color: #888 !important;
  font-size: 11px !important;
  margin-bottom: 4px !important;
}

.gjs-field {
  background: #262626 !important;
  border: 1px solid #404040 !important;
  border-radius: 6px !important;
}

.gjs-field:focus-within {
  border-color: #f59e0b !important;
}

.gjs-field input,
.gjs-field select {
  color: #fff !important;
  background: transparent !important;
}

/* Canvas frame */
.gjs-cv-canvas {
  background: #0a0a0a !important;
}

.gjs-frame-wrapper {
  background: white !important;
}

/* Toolbar on components */
.gjs-toolbar {
  background: #262626 !important;
  border-radius: 6px !important;
}

.gjs-toolbar-item {
  color: #ddd !important;
}

.gjs-toolbar-item:hover {
  color: #f59e0b !important;
}

/* Component selection */
.gjs-selected {
  outline: 2px solid #f59e0b !important;
  outline-offset: -2px !important;
}

.gjs-hovered {
  outline: 1px dashed #666 !important;
}

/* Rich text editor */
.gjs-rte-toolbar {
  background: #262626 !important;
  border-radius: 6px !important;
  border: 1px solid #404040 !important;
}

.gjs-rte-actionbar {
  background: transparent !important;
}

.gjs-rte-action {
  color: #ddd !important;
  border-color: #404040 !important;
}

.gjs-rte-action:hover {
  color: #f59e0b !important;
}
</style>

<style scoped>
.grape-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0a0a0a;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Header */
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 56px;
  background: #111;
  border-bottom: 1px solid #262626;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #888;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.15s;
}

.back-link:hover {
  color: #fff;
}

.divider {
  width: 1px;
  height: 20px;
  background: #333;
}

.editor-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.prototype-badge {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  background: #7c3aed;
  color: #fff;
  border-radius: 9999px;
}

/* Page Switcher */
.page-switcher-container {
  position: relative;
}

.page-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.page-switcher:hover {
  background: #262626;
  border-color: #444;
}

.page-switcher .chevron {
  color: #666;
  transition: transform 0.2s;
}

.page-switcher .chevron.rotated {
  transform: rotate(180deg);
}

.pages-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 280px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  overflow: hidden;
}

.pages-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  font-size: 13px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.page-count {
  padding: 2px 8px;
  background: #333;
  border-radius: 9999px;
  font-size: 11px;
  color: #aaa;
}

.pages-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
}

.page-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #ccc;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.page-item:hover {
  background: #262626;
}

.page-item.active {
  background: #333;
  color: #fff;
}

.page-icon {
  color: #666;
  flex-shrink: 0;
}

.page-item.active .page-icon {
  color: #f59e0b;
}

.page-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-badge {
  padding: 2px 8px;
  background: rgba(245, 158, 11, 0.2);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #f59e0b;
  text-transform: uppercase;
}

.delete-page-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s;
}

.page-item:hover .delete-page-btn {
  opacity: 1;
}

.delete-page-btn:hover {
  background: #ef4444;
  color: white;
}

.add-page-section {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #333;
}

.new-page-input {
  flex: 1;
  padding: 8px 12px;
  background: #262626;
  border: 1px solid #333;
  border-radius: 6px;
  color: #fff;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
}

.new-page-input:focus {
  border-color: #f59e0b;
}

.new-page-input::placeholder {
  color: #666;
}

.add-page-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f59e0b;
  border: none;
  border-radius: 6px;
  color: #000;
  cursor: pointer;
  transition: all 0.15s;
}

.add-page-btn:hover:not(:disabled) {
  background: #d97706;
}

.add-page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Dropdown transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.header-center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-group {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #1a1a1a;
  border-radius: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn:hover {
  color: #fff;
  background: #262626;
}

.device-selector {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #1a1a1a;
  border-radius: 8px;
}

.device-btn {
  width: 36px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.device-btn:hover {
  color: #fff;
  background: #262626;
}

.device-btn.active {
  color: #fff;
  background: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #262626;
  border: 1px solid #333;
  border-radius: 6px;
  color: #ddd;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.header-btn:hover {
  background: #333;
  border-color: #444;
}

.header-btn.primary {
  background: #f59e0b;
  border-color: #f59e0b;
  color: #000;
}

.header-btn.primary:hover {
  background: #d97706;
  border-color: #d97706;
}

/* Body */
.editor-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.editor-sidebar {
  width: 280px;
  background: #111;
  border-right: 1px solid #262626;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #262626;
}

.tab-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #666;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.tab-btn:hover {
  color: #aaa;
  background: #1a1a1a;
}

.tab-btn.active {
  color: #f59e0b;
  background: #1a1a1a;
  border-bottom-color: #f59e0b;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.sidebar-content .hidden {
  display: none;
}

#blocks-container,
#layers-container,
#styles-container {
  min-height: 100%;
}

/* Canvas */
.editor-canvas {
  flex: 1;
  background: #1a1a1a;
  overflow: hidden;
  position: relative;
}

#gjs {
  height: 100%;
  width: 100%;
}

.loading-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #666;
  background: #1a1a1a;
  z-index: 10;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #333;
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Template Modal */
.template-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
}

.template-modal {
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid #333;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #262626;
  text-align: center;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
}

.modal-header p {
  font-size: 14px;
  color: #888;
  margin: 0;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 24px;
}

.template-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background: #262626;
  border: 2px solid #333;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.template-card:hover {
  border-color: #555;
  background: #2a2a2a;
}

.template-card.selected {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.template-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.template-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0 0 6px 0;
}

.template-card p {
  font-size: 13px;
  color: #888;
  margin: 0;
  line-height: 1.4;
}

.modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  padding: 10px 20px;
  background: #333;
  border: 1px solid #444;
  border-radius: 8px;
  color: #ddd;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.close-btn:hover {
  background: #444;
  border-color: #555;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .template-modal,
.modal-leave-active .template-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .template-modal,
.modal-leave-to .template-modal {
  transform: scale(0.95);
  opacity: 0;
}

@media (max-width: 640px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
}

/* Disabled button state */
.header-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.header-btn.disabled:hover {
  background: transparent;
}

/* Save Component Modal */
.save-component-modal {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.save-form {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #888;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #262626;
  border: 1px solid #404040;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.15s;
}

.form-input:focus {
  border-color: #f59e0b;
  background: #2a2a2a;
}

.form-input::placeholder {
  color: #666;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-section label {
  font-size: 13px;
  font-weight: 600;
  color: #888;
}

.html-preview {
  max-height: 200px;
  overflow: auto;
  padding: 16px;
  background: #262626;
  border: 1px solid #404040;
  border-radius: 8px;
  transform: scale(0.5);
  transform-origin: top left;
  width: 200%;
  pointer-events: none;
}

.save-component-modal .modal-footer {
  gap: 12px;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f59e0b;
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.save-btn:hover:not(:disabled) {
  background: #fbbf24;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal transitions for save component modal */
.modal-enter-active .save-component-modal,
.modal-leave-active .save-component-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .save-component-modal,
.modal-leave-to .save-component-modal {
  transform: scale(0.95);
  opacity: 0;
}

/* Help Modal */
.help-modal {
  background: #1a1a1a;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
}

.help-modal .modal-header {
  padding: 24px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.help-modal .modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.close-icon-btn {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.15s;
}

.close-icon-btn:hover {
  background: #333;
  color: white;
}

.help-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.help-section {
  margin-bottom: 24px;
}

.help-section:last-child {
  margin-bottom: 0;
}

.help-section h3 {
  font-size: 15px;
  font-weight: 600;
  color: #f59e0b;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-section ol,
.help-section ul {
  margin: 0 0 12px 0;
  padding-left: 20px;
  color: #ccc;
  font-size: 14px;
  line-height: 1.8;
}

.help-section ol li,
.help-section ul li {
  margin-bottom: 4px;
}

.help-section strong {
  color: white;
}

.help-tip {
  background: #262626;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13px;
  color: #aaa;
  margin: 0;
  border-left: 3px solid #f59e0b;
}

.shortcuts-list {
  list-style: none;
  padding: 0;
}

.shortcuts-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #333;
}

.shortcuts-list li:last-child {
  border-bottom: none;
}

.shortcuts-list kbd {
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 12px;
  color: white;
  min-width: 140px;
  text-align: center;
}

.help-modal .modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: flex-end;
}

.primary-btn {
  background: #f59e0b;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.primary-btn:hover {
  background: #fbbf24;
}

/* Modal transitions for help modal */
.modal-enter-active .help-modal,
.modal-leave-active .help-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .help-modal,
.modal-leave-to .help-modal {
  transform: scale(0.95);
  opacity: 0;
}
</style>
