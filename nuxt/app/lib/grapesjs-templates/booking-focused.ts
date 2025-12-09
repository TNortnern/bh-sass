import type { GrapesJSTemplate } from './index'
import { templatePreviews, getTemplateThumbnail } from './template-previews'

export const bookingFocused: GrapesJSTemplate = {
  id: 'booking-focused',
  name: 'Booking-Focused',
  description: 'Heavy emphasis on booking flow and conversion. CTAs everywhere.',
  category: 'Specialized',
  tags: ['conversion', 'cta', 'booking', 'high-converting', 'sales'],
  preview: templatePreviews['booking-focused'],
  thumbnail: getTemplateThumbnail('booking-focused'),
  config: {
    primaryColor: '#ef4444',
    secondaryColor: '#dc2626',
    accentColor: '#fbbf24',
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    features: [
      'Conversion optimized',
      'Multiple CTAs',
      'Quick booking form',
      'Urgency elements',
      'Trust signals'
    ]
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking-Focused - High-Converting Rental Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen bg-red-50">
    <div class="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 class="text-6xl font-bold text-red-900 mb-4">Booking-Focused Template</h1>
      <p class="text-2xl text-red-700 mb-8">Complete template coming soon</p>
      <p class="text-lg text-red-600">This template will maximize conversions with strategic CTAs and booking-centric design.</p>
    </div>
  </div>
</body>
</html>`
}
