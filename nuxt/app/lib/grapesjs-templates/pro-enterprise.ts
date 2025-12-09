import type { GrapesJSTemplate } from './index'
import { templatePreviews, getTemplateThumbnail } from './template-previews'

export const proEnterprise: GrapesJSTemplate = {
  id: 'pro-enterprise',
  name: 'Enterprise Professional',
  description: 'Corporate-style template for large rental companies with multiple locations.',
  category: 'Professional',
  tags: ['corporate', 'enterprise', 'professional', 'multi-location'],
  preview: templatePreviews['pro-enterprise'],
  thumbnail: getTemplateThumbnail('pro-enterprise'),
  config: {
    primaryColor: '#3b82f6',
    secondaryColor: '#1f2937',
    accentColor: '#10b981',
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    features: [
      'Multi-location support',
      'Corporate branding',
      'Team directory',
      'Advanced features',
      'Enterprise ready'
    ]
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enterprise Rentals - Professional Event Solutions</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">Enterprise Professional Template</h1>
      <p class="text-2xl text-gray-600 mb-8">Complete template coming soon</p>
      <p class="text-lg text-gray-500">This template will include corporate features, multi-location support, and advanced functionality.</p>
    </div>
  </div>
</body>
</html>`
}
