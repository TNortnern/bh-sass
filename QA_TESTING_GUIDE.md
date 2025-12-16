# BouncePro QA Testing Guide

> Comprehensive testing checklist for all features before launch

**Last Updated:** 2025-12-16
**Test Environment:** http://localhost:3005 (Nuxt) | http://localhost:3004 (Payload Admin)
**Test Credentials:** admin@admin.com / Loloo123!

---

## Table of Contents

1. [Widget System (Critical Path)](#1-widget-system-critical-path)
2. [Booking Flow](#2-booking-flow)
3. [Payment Processing](#3-payment-processing)
4. [Email Notifications](#4-email-notifications)
5. [Website Builder](#5-website-builder)
6. [Inventory Management](#6-inventory-management)
7. [Customer Management](#7-customer-management)
8. [Business Dashboard](#8-business-dashboard)
9. [Super Admin Features](#9-super-admin-features)
10. [Mobile Responsiveness](#10-mobile-responsiveness)
11. [Security Testing](#11-security-testing)
12. [Performance Testing](#12-performance-testing)

---

## 1. Widget System (Critical Path)

The widget allows customers to accept bookings without building a website. This is the **#1 priority** for launch.

### 1.1 Widget Generation

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Access widget page | Navigate to `/app/widgets` | Widget configuration page loads | [ ] |
| Default embed code | View embed code section | Shows iframe and script options | [ ] |
| Theme toggle | Switch between Light/Dark/Auto | Preview updates, code changes | [ ] |
| Primary color picker | Select custom color | Preview updates, color in embed code | [ ] |
| Copy iframe code | Click copy button for iframe | Code copied to clipboard | [ ] |
| Copy script code | Click copy button for script | Code copied to clipboard | [ ] |
| Widget type selection | Select Products/Featured/Categories | Code updates with correct type | [ ] |

### 1.2 Widget Embedding (External Site Simulation)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Iframe embedding | Paste iframe code in test HTML file | Widget renders correctly | [ ] |
| Script embedding | Paste script code in test HTML file | Widget renders correctly | [ ] |
| Cross-origin loading | Load widget from different domain | Widget loads without CORS errors | [ ] |
| Dynamic height resize | Interact with widget content | Iframe height adjusts automatically | [ ] |
| Multiple widgets | Add 2+ widgets on same page | All widgets function independently | [ ] |

### 1.3 Widget Product Display

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Product grid loads | Open widget | All rental items displayed | [ ] |
| Product images | View product cards | Images load correctly | [ ] |
| Product pricing | View product cards | Daily price shown correctly | [ ] |
| Category filter | Click category filter | Products filter correctly | [ ] |
| Search functionality | Type in search box | Products filter by name | [ ] |
| Sort by price | Change sort dropdown | Products reorder correctly | [ ] |
| Product detail click | Click product card | Modal or navigate based on mode | [ ] |

### 1.4 Widget Cart Functionality

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Add to cart | Select dates, click "Add to Cart" | Item added, cart badge updates | [ ] |
| Cart persistence | Refresh page | Cart items persist (localStorage) | [ ] |
| Update quantity | Change quantity in cart | Total updates correctly | [ ] |
| Remove from cart | Click remove button | Item removed, total updates | [ ] |
| Empty cart | Remove all items | "Cart empty" message shown | [ ] |
| Cart icon badge | Add multiple items | Badge shows correct count | [ ] |
| Cart total calculation | Add items with different prices | Total calculates correctly | [ ] |

### 1.5 Widget Checkout Flow

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Open checkout | Click "Checkout" button | Checkout form appears | [ ] |
| Contact info validation | Submit with empty fields | Validation errors shown | [ ] |
| Email validation | Enter invalid email | Email format error shown | [ ] |
| Phone validation | Enter invalid phone | Phone format error shown | [ ] |
| Address form | Fill delivery address | All fields accept input | [ ] |
| State dropdown | Select state | State saved correctly | [ ] |
| Event type dropdown | Select event type | Event type saved correctly | [ ] |
| Terms checkbox | Check terms agreement | Enables payment buttons | [ ] |
| Deposit option | Click "Pay Deposit" | Redirects to Stripe | [ ] |
| Full payment option | Click "Pay Full Amount" | Redirects to Stripe | [ ] |

### 1.6 Widget Behavior Modes

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Modal mode | Configure modal, click product | Product opens in modal overlay | [ ] |
| Navigate mode | Configure with custom URL | Clicks navigate to custom URL | [ ] |
| Hosted mode | Configure hosted mode | Clicks redirect to BouncePro site | [ ] |

### 1.7 Widget PostMessage API

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Cart updated event | Add item to cart | Parent receives `bh:cart:updated` | [ ] |
| Height changed event | Expand accordion | Parent receives `bh:height:changed` | [ ] |
| Ready event | Widget loads | Parent receives `bh:ready` | [ ] |

---

## 2. Booking Flow

### 2.1 Public Booking Page

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Access booking page | Navigate to `/book/{tenant-slug}` | Booking page loads | [ ] |
| Business info displayed | View header | Business name, logo, tagline shown | [ ] |
| Inventory grid | View products | All active items displayed | [ ] |
| Item filtering | Use category filter | Items filter correctly | [ ] |
| Item search | Use search box | Items filter by name | [ ] |
| Item sorting | Change sort order | Items reorder correctly | [ ] |

### 2.2 Item Detail Page

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Access item page | Click item from grid | Detail page loads | [ ] |
| Image gallery | View images | Main image + thumbnails work | [ ] |
| Image navigation | Click thumbnails | Main image changes | [ ] |
| Description | View description | Full description displayed | [ ] |
| Specifications | View specs | All specs (capacity, dimensions, etc.) | [ ] |
| Pricing | View pricing | Daily rate shown correctly | [ ] |
| Multi-day pricing | If configured | Discounted rates shown | [ ] |

### 2.3 Calendar & Availability

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Calendar display | View calendar | Current month displayed | [ ] |
| Past dates disabled | View past dates | Cannot select past dates | [ ] |
| Unavailable dates | View booked dates | Shown as unavailable | [ ] |
| Blackout dates | View maintenance/holidays | Shown as unavailable | [ ] |
| Select start date | Click available date | Date highlighted, prompts end | [ ] |
| Select end date | Click second date | Range selected, price updates | [ ] |
| Multi-day selection | Select 3+ day range | All days highlighted | [ ] |
| Clear dates | Click "Clear" button | Selection cleared | [ ] |
| Month navigation | Click prev/next arrows | Navigate months correctly | [ ] |

### 2.4 Quantity & Add-ons

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Quantity selector | Increase quantity | Quantity updates, max respected | [ ] |
| Quantity affects price | Change quantity | Total recalculates | [ ] |
| Add-ons display | View add-ons section | Available add-ons shown | [ ] |
| Select add-on | Check add-on checkbox | Add-on included in total | [ ] |
| Multiple add-ons | Select multiple | All add to total correctly | [ ] |

### 2.5 Checkout Page

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Cart summary | View cart section | All items, dates, totals shown | [ ] |
| Subtotal calculation | Review subtotal | Sum of item prices correct | [ ] |
| Delivery fee | Check delivery line | Delivery fee added | [ ] |
| Tax calculation | Check tax line | Tax calculated correctly | [ ] |
| Total amount | Check total | All fees summed correctly | [ ] |
| Deposit amount | Check deposit | 50% of total shown | [ ] |

---

## 3. Payment Processing

### 3.1 Stripe Integration

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Stripe redirect | Click payment button | Redirects to checkout.stripe.com | [ ] |
| Correct amount | View Stripe checkout | Amount matches order total | [ ] |
| Product description | View Stripe checkout | "Bounce House Rental" description | [ ] |
| Customer email | View Stripe checkout | Email pre-filled | [ ] |
| Test card payment | Use 4242 4242 4242 4242 | Payment succeeds | [ ] |
| Declined card test | Use 4000 0000 0000 0002 | Payment declined message | [ ] |
| 3D Secure test | Use 4000 0027 6000 3184 | 3DS authentication flows | [ ] |

### 3.2 Payment Completion

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Success redirect | Complete payment | Returns to confirmation page | [ ] |
| Confirmation page | View confirmation | Booking number, details shown | [ ] |
| Booking created | Check admin dashboard | Booking appears in system | [ ] |
| Payment status | Check booking | Status shows "deposit_paid" or "paid" | [ ] |
| Cancel redirect | Click cancel on Stripe | Returns to checkout page | [ ] |

### 3.3 Stripe Connect (Multi-tenant)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Connect onboarding | New tenant setup | Stripe Connect flow initiates | [ ] |
| Account status | Check settings | Shows connected/not connected | [ ] |
| Payment routing | Complete booking | Payment goes to tenant's Stripe | [ ] |
| Platform fee | Check Stripe dashboard | Platform fee deducted correctly | [ ] |

---

## 4. Email Notifications

### 4.1 Customer Emails

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Booking confirmation | Complete booking | Customer receives email | [ ] |
| Confirmation content | Check email | Booking details, dates, address | [ ] |
| Payment receipt | After payment | Receipt email sent | [ ] |
| Booking reminder | 24-48 hours before | Reminder email sent | [ ] |

### 4.2 Business Owner Emails

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| New booking alert | New booking created | Owner notified | [ ] |
| Payment received | Payment completes | Owner notified | [ ] |
| Cancellation alert | Booking cancelled | Owner notified | [ ] |

### 4.3 Email Configuration

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Brevo connection | Check email settings | Brevo API connected | [ ] |
| Custom sender | Configure sender name | Emails show custom sender | [ ] |
| Template customization | Edit email templates | Changes reflected in emails | [ ] |

---

## 5. Website Builder

### 5.1 Template Selection

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Access builder | Navigate to `/app/website` | Website builder loads | [ ] |
| View templates | Click "Templates" | All 10 templates displayed | [ ] |
| Preview template | Click preview on template | Preview modal shows | [ ] |
| Apply template | Click "Apply" | Template applied to site | [ ] |
| Confirm overwrite | If existing content | Confirmation dialog shown | [ ] |

### 5.2 GrapesJS Editor

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Open editor | Click "Edit Website" | GrapesJS editor loads | [ ] |
| Drag components | Drag block to canvas | Component placed correctly | [ ] |
| Edit text | Double-click text | Text becomes editable | [ ] |
| Change colors | Use style panel | Colors update live | [ ] |
| Add sections | Drag section block | Section added to page | [ ] |
| Reorder sections | Drag section up/down | Sections reorder | [ ] |
| Delete sections | Select and delete | Section removed | [ ] |
| Undo/Redo | Press Ctrl+Z / Ctrl+Y | Changes undone/redone | [ ] |
| Save changes | Click "Save" | Changes persisted | [ ] |

### 5.3 Template Preview

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Desktop preview | View at full width | Desktop layout shown | [ ] |
| Mobile preview | Resize to mobile | Mobile layout shown | [ ] |
| Navigation menu | Click hamburger | Mobile menu opens/closes | [ ] |
| Navigation links | Click nav links | Links work (or show anchors) | [ ] |
| Cart icon | View navigation | Cart icon with badge | [ ] |
| Book Now CTA | Click "Book Now" | Navigates to booking page | [ ] |

### 5.4 Published Site

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Access published site | Navigate to `/site/{tenant}` | Published site loads | [ ] |
| SEO meta tags | Inspect page source | Title, description present | [ ] |
| Tenant branding | View site | Correct logo, colors, name | [ ] |
| Contact info | View contact section | Correct phone, email, address | [ ] |
| Rental items | View items section | Real inventory displayed | [ ] |
| Booking link | Click booking CTA | Goes to booking page | [ ] |

---

## 6. Inventory Management

### 6.1 Rental Items CRUD

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View inventory | Navigate to `/app/inventory` | Inventory list loads | [ ] |
| Create item | Click "Add Item", fill form | Item created successfully | [ ] |
| Required fields | Submit empty form | Validation errors shown | [ ] |
| Image upload | Upload images | Images saved correctly | [ ] |
| Multiple images | Upload 3+ images | Gallery created | [ ] |
| Edit item | Click item, edit details | Changes saved | [ ] |
| Delete item | Click delete, confirm | Item deleted | [ ] |
| Duplicate item | Click duplicate | Copy created with "(Copy)" suffix | [ ] |

### 6.2 Item Configuration

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Category selection | Select category | Category saved | [ ] |
| Pricing setup | Enter daily rate | Price saved correctly | [ ] |
| Multi-day pricing | Add pricing tiers | Tiers saved and displayed | [ ] |
| Capacity setting | Enter capacity | Shown on item detail | [ ] |
| Dimensions | Enter dimensions | Shown on item detail | [ ] |
| Age range | Enter age range | Shown on item detail | [ ] |
| Setup requirements | Enter requirements | Shown on item detail | [ ] |
| Featured toggle | Toggle featured | Item appears in featured section | [ ] |
| Active toggle | Toggle active | Item hidden from bookings | [ ] |

### 6.3 Inventory Units (Physical Items)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View units | Navigate to item units | Units list shown | [ ] |
| Create unit | Add new unit | Unit created with ID | [ ] |
| Unit status | Change unit status | Status updated | [ ] |
| Assign to booking | Create booking | Unit assigned | [ ] |
| Maintenance mode | Mark for maintenance | Unit unavailable | [ ] |

### 6.4 rb-payload Sync

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Sync item | Click "Sync to rb-payload" | Item synced, ID stored | [ ] |
| Sync all items | Click "Sync All" | All items synced | [ ] |
| Sync status | View sync status | Shows synced/not synced | [ ] |
| Last synced | View timestamp | Shows last sync time | [ ] |
| Update synced item | Edit item, sync again | Changes propagate to rb-payload | [ ] |

---

## 7. Customer Management

### 7.1 Customer List

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View customers | Navigate to `/app/customers` | Customer list loads | [ ] |
| Search customers | Use search box | Filters by name/email | [ ] |
| Sort customers | Click column headers | Sorts correctly | [ ] |
| Pagination | Navigate pages | Pagination works | [ ] |

### 7.2 Customer Details

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View customer | Click customer row | Detail page loads | [ ] |
| Contact info | View info section | Name, email, phone shown | [ ] |
| Address info | View address section | Full address shown | [ ] |
| Booking history | View bookings section | Past bookings listed | [ ] |
| Total spent | View stats | Total amount calculated | [ ] |
| Last booking | View stats | Last booking date shown | [ ] |

### 7.3 Customer CRUD

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Create customer | Click "Add", fill form | Customer created | [ ] |
| Edit customer | Click edit, modify | Changes saved | [ ] |
| Delete customer | Click delete, confirm | Customer deleted | [ ] |
| Merge customers | Select duplicates, merge | Records combined | [ ] |

---

## 8. Business Dashboard

### 8.1 Dashboard Overview

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Access dashboard | Navigate to `/app` | Dashboard loads | [ ] |
| Revenue card | View revenue | Today/week/month totals | [ ] |
| Bookings card | View bookings | Booking counts shown | [ ] |
| Upcoming bookings | View list | Next bookings listed | [ ] |
| Recent activity | View activity feed | Recent events shown | [ ] |
| Quick actions | View action buttons | Functional shortcuts | [ ] |

### 8.2 Bookings Management

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View bookings | Navigate to `/app/bookings` | Bookings list loads | [ ] |
| Filter by status | Use status filter | Filters correctly | [ ] |
| Filter by date | Use date picker | Filters correctly | [ ] |
| Search bookings | Use search box | Finds by customer/ID | [ ] |
| View booking detail | Click booking | Full details shown | [ ] |
| Update status | Change booking status | Status updated | [ ] |
| Assign unit | Select inventory unit | Unit assigned | [ ] |
| Add notes | Add internal note | Note saved | [ ] |
| Print/export | Click print button | Printable version generated | [ ] |

### 8.3 Calendar View

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Access calendar | Navigate to `/app/calendar` | Calendar loads | [ ] |
| Month view | View month | Bookings shown on dates | [ ] |
| Week view | Switch to week | Week view displays | [ ] |
| Day view | Switch to day | Day view displays | [ ] |
| Click booking | Click event | Booking details shown | [ ] |
| Drag booking | Drag to new date | Booking rescheduled | [ ] |

### 8.4 Settings

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Business info | Edit business details | Changes saved | [ ] |
| Logo upload | Upload new logo | Logo updated sitewide | [ ] |
| Contact info | Edit contact details | Changes reflected | [ ] |
| Business hours | Set operating hours | Hours saved | [ ] |
| Service area | Configure service area | Saved correctly | [ ] |
| Tax settings | Configure tax rate | Applied to bookings | [ ] |
| Delivery settings | Configure delivery fee | Applied to checkout | [ ] |
| Email settings | Configure notifications | Settings saved | [ ] |
| Stripe settings | Connect/disconnect | Stripe status updates | [ ] |

---

## 9. Super Admin Features

### 9.1 Tenant Management

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Access admin | Navigate to `/admin` | Admin panel loads | [ ] |
| View tenants | Navigate to tenants list | All tenants shown | [ ] |
| Create tenant | Create new tenant | Tenant created | [ ] |
| Edit tenant | Modify tenant settings | Changes saved | [ ] |
| Impersonate tenant | Click impersonate | Logged in as tenant | [ ] |
| Impersonation banner | While impersonating | Banner shows, exit available | [ ] |
| Delete tenant | Delete tenant | Tenant removed | [ ] |

### 9.2 User Management

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View users | Navigate to users | All users listed | [ ] |
| Create user | Add new user | User created | [ ] |
| Assign role | Set user role | Role permissions applied | [ ] |
| Assign tenant | Link user to tenant | Access restricted to tenant | [ ] |
| Reset password | Reset user password | Password changed | [ ] |
| Disable user | Disable account | User cannot login | [ ] |

### 9.3 Platform Analytics

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Revenue dashboard | View platform revenue | Total revenue across tenants | [ ] |
| Booking analytics | View booking stats | Platform-wide stats | [ ] |
| User analytics | View user counts | Active users, growth | [ ] |
| Subscription tracking | View subscriptions | Plan distribution | [ ] |

### 9.4 System Settings

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| API keys | Manage API keys | CRUD operations work | [ ] |
| Webhooks | Configure webhooks | Webhook settings saved | [ ] |
| Audit log | View audit trail | Actions logged | [ ] |
| System health | View health checks | Service status shown | [ ] |

---

## 10. Mobile Responsiveness

### 10.1 Booking Pages (Mobile)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Booking page | View at 375px | Layout adapts correctly | [ ] |
| Item grid | View at 375px | Single column grid | [ ] |
| Item detail | View at 375px | Stacked layout | [ ] |
| Calendar | View at 375px | Calendar fits screen | [ ] |
| Checkout | View at 375px | Form usable on mobile | [ ] |

### 10.2 Dashboard (Mobile)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Dashboard | View at 375px | Cards stack vertically | [ ] |
| Navigation | View at 375px | Hamburger menu works | [ ] |
| Tables | View at 375px | Horizontal scroll or card view | [ ] |
| Forms | View at 375px | Inputs full width | [ ] |

### 10.3 Website Builder (Mobile)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Template preview | View at 375px | Mobile layout shown | [ ] |
| Navigation | Tap hamburger | Mobile menu toggles | [ ] |
| Hero section | View at 375px | Text readable, image scaled | [ ] |
| Product grid | View at 375px | 1-2 columns | [ ] |

---

## 11. Security Testing

### 11.1 Authentication

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Login required | Access /app without auth | Redirected to login | [ ] |
| Invalid credentials | Enter wrong password | Error message, no login | [ ] |
| Session timeout | Wait for timeout | Logged out automatically | [ ] |
| CSRF protection | Inspect forms | CSRF tokens present | [ ] |

### 11.2 Authorization

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Tenant isolation | Try accessing other tenant | Access denied | [ ] |
| Role enforcement | Staff accessing admin | Access denied | [ ] |
| API protection | Call API without auth | 401 response | [ ] |

### 11.3 Input Validation

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| XSS prevention | Enter script tags | Scripts sanitized | [ ] |
| SQL injection | Enter SQL in fields | Queries parameterized | [ ] |
| File upload | Upload non-image | Rejected or sanitized | [ ] |

---

## 12. Performance Testing

### 12.1 Load Times

| Test Case | Target | Actual | Status |
|-----------|--------|--------|--------|
| Dashboard load | < 2s | ___s | [ ] |
| Booking page load | < 2s | ___s | [ ] |
| Widget load | < 1.5s | ___s | [ ] |
| Image loading | < 1s per image | ___s | [ ] |

### 12.2 Stress Testing

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Multiple concurrent users | Simulate 50 users | System remains responsive | [ ] |
| Large inventory | 100+ items | Page loads within 3s | [ ] |
| Many bookings | 1000+ bookings | List paginates correctly | [ ] |

---

## Testing Checklist Summary

### Critical Path (Must Pass Before Launch)

- [ ] Widget can be embedded and accepts bookings
- [ ] Full booking flow works end-to-end
- [ ] Stripe payments process correctly
- [ ] Email confirmations sent
- [ ] Mobile responsive

### Important (Should Pass)

- [ ] Website builder templates work
- [ ] Inventory management complete
- [ ] Customer management complete
- [ ] Dashboard analytics accurate

### Nice to Have

- [ ] All edge cases handled
- [ ] Performance optimized
- [ ] Full audit trail

---

## Test Data Setup

### Stripe Test Cards

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Declined |
| 4000 0027 6000 3184 | Requires 3DS |
| 4000 0000 0000 9995 | Insufficient funds |

### Test Tenant

- Slug: `bouncepro-demo`
- URL: `/book/bouncepro-demo`
- Widget: `/embed/bouncepro-demo/products`

---

## Bug Report Template

```markdown
## Bug Description
[Brief description]

## Steps to Reproduce
1.
2.
3.

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[If applicable]

## Environment
- Browser:
- Device:
- Screen size:
- User role:
```

---

## Sign-off

| Area | Tester | Date | Status |
|------|--------|------|--------|
| Widget System | | | |
| Booking Flow | | | |
| Payments | | | |
| Email | | | |
| Website Builder | | | |
| Mobile | | | |
| Security | | | |

**Final Approval:** _________________ Date: _________
