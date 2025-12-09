import type { GrapesJSTemplate } from './index'
import { templatePreviews, getTemplateThumbnail } from './template-previews'

export const trustBuilder: GrapesJSTemplate = {
  id: 'trust-builder',
  name: 'Trust Builder',
  description: 'Testimonials, reviews, and safety certifications prominently displayed.',
  category: 'Specialized',
  tags: ['trust', 'testimonials', 'reviews', 'safety', 'credibility'],
  preview: templatePreviews['trust-builder'],
  thumbnail: getTemplateThumbnail('trust-builder'),
  config: {
    primaryColor: '#06b6d4',
    secondaryColor: '#0891b2',
    accentColor: '#fbbf24',
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    features: [
      'Trust signals',
      'Customer reviews',
      'Safety badges',
      'Certifications',
      'Social proof'
    ]
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trust Builder - Credibility-Focused Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen bg-cyan-50">
    <div class="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 class="text-6xl font-bold text-cyan-900 mb-4">Trust Builder Template</h1>
      <p class="text-2xl text-cyan-700 mb-8">Complete template coming soon</p>
      <p class="text-lg text-cyan-600">This template will emphasize trust signals, testimonials, reviews, and safety certifications.</p>
    </div>
  </div>
</body>
</html>`
}
