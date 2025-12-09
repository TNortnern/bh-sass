import type { GrapesJSTemplate } from './index'
import { templatePreviews, getTemplateThumbnail } from './template-previews'

export const proLocalBusiness: GrapesJSTemplate = {
  id: 'pro-local-business',
  name: 'Local Business Pro',
  description: 'Optimized for local SEO and community trust. Perfect for neighborhood rental businesses.',
  category: 'Professional',
  tags: ['local', 'seo', 'community', 'trust', 'neighborhood'],
  preview: templatePreviews['pro-local-business'],
  thumbnail: getTemplateThumbnail('pro-local-business'),
  config: {
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    accentColor: '#fbbf24',
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    features: [
      'Local SEO optimized',
      'Community focused',
      'Trust signals',
      'Map integration',
      'Local reviews'
    ]
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Local Business Pro - Community Rentals</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen bg-green-50">
    <div class="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 class="text-6xl font-bold text-green-900 mb-4">Local Business Pro Template</h1>
      <p class="text-2xl text-green-700 mb-8">Complete template coming soon</p>
      <p class="text-lg text-green-600">This template will focus on local SEO, community trust, and neighborhood appeal.</p>
    </div>
  </div>
</body>
</html>`
}
