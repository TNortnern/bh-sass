# Public Tenant Website Implementation

## Overview

The public tenant website feature allows each tenant to have their own branded, public-facing website that showcases their business, rental items, and contact information.

## Files Created

### 1. Server API Route
**File:** `/nuxt/server/routes/api/tenants-public/[slug].get.ts`

**Endpoint:** `GET /api/tenants-public/:slug`

**Purpose:** Fetches tenant data including branding, settings, and website configuration for public display.

**Response Structure:**
```typescript
{
  id: string
  name: string
  slug: string
  description: string
  logo: { url: string, alt: string }
  phone: string
  email: string
  address: { street, city, state, zip }
  businessHours: { monday, tuesday, etc. }
  serviceArea: { radius, unit, zipCodes }
  branding: {
    businessName: string
    tagline: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
  settings: {
    timezone: string
    currency: string
    bookingSettings: { ... }
    deliverySettings: { ... }
  }
  website: {
    enabled: boolean
    showServices: boolean
    showTestimonials: boolean
    showGallery: boolean
    aboutContent: string
    seo: { title, description, keywords }
  }
}
```

**Features:**
- Only returns active tenants
- Filters by slug
- Returns 404 if tenant not found or inactive
- Includes all public-facing data needed for website

### 2. Public Website Page
**File:** `/nuxt/app/pages/site/[tenant].vue`

**Route:** `/site/:tenantSlug`

**Purpose:** Renders a public-facing website for each tenant with their branding and content.

## Page Sections

### 1. Hero Section (Always Shown)
- **Logo**: Tenant's logo image
- **Business Name**: From branding.businessName or tenant.name
- **Tagline**: From branding.tagline
- **Description**: From tenant.description
- **CTA Buttons**:
  - "Browse Rentals" → links to `/book/:tenant`
  - "Call Now" → tel: link with formatted phone

### 2. About Section (Conditional)
- **Shows If**: `tenant.website.aboutContent` exists
- **Content**: Displays the about text from tenant.description

### 3. Services/Rentals Section (Conditional)
- **Shows If**: `tenant.website.showServices` is true AND items exist
- **Content**: Grid of rental items (first 6 featured)
- **Item Cards**: Image, name, price, description
- **Links**: Each card links to `/book/:tenant/:itemSlug`
- **CTA**: "View All Rentals" button

### 4. Contact Section (Always Shown)
- **Phone**: Clickable tel: link with formatted number
- **Email**: Clickable mailto: link
- **Address**: Full address display
- **Service Area**: Delivery radius information
- **Business Hours**: Table of weekly hours

### 5. CTA Section (Always Shown)
- Final call-to-action to start booking
- Links to booking flow

### 6. Footer (Always Shown)
- Copyright notice
- "Powered by BouncePro" branding

## Branding & Theming

The page applies tenant-specific colors via CSS variables:

```css
--primary-color: tenant.branding.primaryColor (default: #fbbf24)
--secondary-color: tenant.branding.secondaryColor (default: #3b82f6)
--accent-color: tenant.branding.accentColor (default: #10b981)
```

Colors are applied to:
- Gradient backgrounds
- Button highlights
- Icon backgrounds
- Hover states

## SEO

The page automatically sets:
- `<title>`: From tenant.website.seo.title or tenant.name
- `<meta name="description">`: From tenant.website.seo.description or tenant.description
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card meta tags

## Usage Examples

### Example 1: Basic Tenant Website
```
URL: https://yourdomain.com/site/bounce-kingdom
```

This will display Bounce Kingdom's public website with:
- Hero section with their logo and branding
- About section (if description exists)
- Services grid showing their rental items
- Contact information
- Business hours

### Example 2: Direct Booking Link
The page includes prominent CTAs that link to:
```
/book/bounce-kingdom
```

This takes customers directly to the booking flow.

## Error Handling

### Tenant Not Found
- Shows 404 error message
- Provides "Go Home" button

### Website Not Enabled
- Redirects to 404 page
- Currently defaults to `enabled: true` for all active tenants

### Loading State
- Shows spinner while fetching tenant data
- Displays "Loading..." message

## Future Enhancements

### Testimonials Section (TODO)
- Requires new `Testimonials` collection
- Set `website.showTestimonials` to true to enable

### Gallery Section (TODO)
- Requires gallery/media management
- Set `website.showGallery` to true to enable

### Website Configuration UI (TODO)
Add to tenant settings dashboard:
- Toggle website enabled/disabled
- Toggle individual sections (services, testimonials, gallery)
- Edit about content
- Upload gallery images
- Manage testimonials
- Edit SEO settings

### Custom Domains (TODO)
- Map custom domains to tenant slugs
- Example: `www.bouncekingdom.com` → `/site/bounce-kingdom`

## Testing

### Test the API Endpoint
```bash
curl http://localhost:3005/api/tenants-public/bounce-kingdom
```

### Test the Public Page
1. Start the app: `docker compose up -d`
2. Visit: `http://localhost:3005/site/bounce-kingdom`
3. Verify:
   - Hero section displays with branding
   - Rental items are shown (if any exist)
   - Contact information is correct
   - CTAs link to booking flow

## Integration with Existing Features

### Booking Flow
- "Browse Rentals" and "Start Booking" buttons link to `/book/:tenant`
- Uses existing public booking flow at `/book/[tenant]/index.vue`

### Public API Routes
- Uses existing `/api/public/items/:tenantId` for rental items
- Uses new `/api/tenants-public/:slug` for tenant data

### Branding System
- Reads from existing `tenant.branding` fields
- Uses existing color scheme configuration

## Notes

- The page is fully responsive (mobile, tablet, desktop)
- Dark mode is supported via Nuxt UI
- All images use lazy loading
- Links are prefetched for faster navigation
- Page uses SSR for better SEO
