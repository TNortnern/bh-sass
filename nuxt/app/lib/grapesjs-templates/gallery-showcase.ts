import type { GrapesJSTemplate } from './index'
import { templatePreviews, getTemplateThumbnail } from './template-previews'

export const galleryShowcase: GrapesJSTemplate = {
  id: 'gallery-showcase',
  name: 'Gallery Showcase',
  description: 'Image-heavy design for businesses with amazing visual inventory.',
  category: 'Specialized',
  tags: ['gallery', 'images', 'visual', 'photography', 'portfolio'],
  preview: templatePreviews['gallery-showcase'],
  thumbnail: getTemplateThumbnail('gallery-showcase'),
  config: {
    primaryColor: '#6366f1',
    secondaryColor: '#4f46e5',
    accentColor: '#ec4899',
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    features: [
      'Image focused',
      'Photo gallery',
      'Lightbox viewer',
      'Visual filtering',
      'Portfolio style'
    ]
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gallery Showcase - Visual Portfolio Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen bg-indigo-50">
    <div class="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 class="text-6xl font-bold text-indigo-900 mb-4">Gallery Showcase Template</h1>
      <p class="text-2xl text-indigo-700 mb-8">Complete template coming soon</p>
      <p class="text-lg text-indigo-600">This template will feature stunning image galleries and visual filtering for photo-rich businesses.</p>
    </div>
  </div>
</body>
</html>`
}
