// Type declaration for GrapeJS loaded from CDN
declare global {
  interface Window {
    grapesjs: {
      init: (config: GrapesJSConfig) => GrapesJSEditor
    }
  }
}

interface GrapesJSConfig {
  container: string
  height?: string
  width?: string
  storageManager?: boolean | object
  panels?: { defaults: unknown[] }
  blockManager?: {
    appendTo: string
    blocks: GrapesJSBlock[]
  }
  layerManager?: {
    appendTo: string
  }
  styleManager?: {
    appendTo: string
    sectors: GrapesJSStyleSector[]
  }
  deviceManager?: {
    devices: GrapesJSDevice[]
  }
  canvas?: {
    styles?: string[]
  }
}

interface GrapesJSBlock {
  id: string
  label: string
  category: string
  content: string
}

interface GrapesJSStyleSector {
  name: string
  open?: boolean
  buildProps: string[]
}

interface GrapesJSDevice {
  name: string
  width: string
  widthMedia?: string
}

interface GrapesJSEditor {
  setComponents: (html: string) => void
  getHtml: () => string
  getCss: () => string
  on: (event: string, callback: (...args: unknown[]) => void) => void
  off: (event: string, callback: (...args: unknown[]) => void) => void
}

export {}
