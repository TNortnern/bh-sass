import type { GrapesJSTemplate } from './index'
import { templatePreviews, getTemplateThumbnail } from './template-previews'

export const proEventFocused: GrapesJSTemplate = {
  id: 'pro-event-focused',
  name: 'Event-Focused Pro',
  description: 'Designed around event types (birthdays, corporate, school, etc.). Great for conversion.',
  category: 'Professional',
  tags: ['events', 'conversion', 'birthday', 'corporate', 'categories'],
  preview: templatePreviews['pro-event-focused'],
  thumbnail: getTemplateThumbnail('pro-event-focused'),
  config: {
    primaryColor: '#8b5cf6',
    secondaryColor: '#7c3aed',
    accentColor: '#f472b6',
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    features: [
      'Event type focused',
      'Category filtering',
      'Package deals',
      'High conversion',
      'Event planning tips'
    ]
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event-Focused Pro - Party Packages by Event Type</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen bg-purple-50">
    <div class="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 class="text-6xl font-bold text-purple-900 mb-4">Event-Focused Pro Template</h1>
      <p class="text-2xl text-purple-700 mb-8">Complete template coming soon</p>
      <p class="text-lg text-purple-600">This template will organize rentals by event type with package deals and category filtering.</p>
    </div>
  </div>
</body>
</html>`
}
