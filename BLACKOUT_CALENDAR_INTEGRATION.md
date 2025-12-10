# Blackout Calendar Integration Summary

## Overview
Integrated blackout date display and management into the existing calendar page at `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/pages/app/calendar.vue`.

## Changes Made

### 1. New Composable: `useAvailability.ts`
**Location:** `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useAvailability.ts`

**Features:**
- `fetchBlackouts()` - Fetch all blackouts from Payload API
- `fetchBlackoutsForItem(rentalItemId)` - Fetch blackouts for specific item
- `createBlackout(data)` - Create new blackout
- `updateBlackout(id, data)` - Update existing blackout
- `deleteBlackout(id)` - Delete blackout
- Computed properties: `upcomingBlackouts`, `pastBlackouts`, `activeBlackouts`

### 2. Calendar Page Updates

#### Type Additions
- Added `CalendarBlackout` interface with fields:
  - `id`, `item`, `startDate`, `endDate`, `reason`, `notes`
- Updated `CalendarDay` to include `blackouts: CalendarBlackout[]`

#### State Management
- Added `showBookings` and `showBlackouts` toggles (both default to `true`)
- Added blackout modal states: `isBlackoutModalOpen`, `isNewBlackoutModalOpen`
- Added `selectedBlackout` and blackout form state

#### Calendar Display
**Month View:**
- Shows blackouts alongside bookings in calendar cells
- Blackouts have striped pattern (via CSS) to differentiate from bookings
- Blackouts show with ban icon (`i-lucide-ban`)
- Different colors per reason:
  - Purple: Maintenance
  - Orange: Repair
  - Gray: Already Booked
  - Blue: Seasonal Closure
  - Gray: Other
- On hover for empty days: Shows buttons for both "Add Booking" and "Add Blackout"
- Right-click context menu on any day opens "Add Blackout" modal

**Filtering:**
- Toggle visibility of bookings and blackouts separately
- Blackouts respect item filters
- Show/Hide section added to sidebar filters

**Legend:**
- Split into two sections: "Bookings" and "Blackouts (Striped)"
- Shows all booking statuses (Pending, Confirmed, Delivered, Completed, Cancelled)
- Shows all blackout reasons with striped indicators

#### User Interactions

**View Blackout:**
- Click on blackout in calendar to open details modal
- Shows: Item, Date Range, Reason, Notes
- Actions: Close, Delete

**Create Blackout:**
- Right-click any day OR click "Add Blackout" button on empty day
- Select rental item from list
- Choose start/end dates
- Select reason (Maintenance, Repair, Already Booked, Seasonal, Other)
- Add optional notes
- Validates required fields before submission

**Visual Indicators:**
- Striped pattern on blackout items (CSS gradient)
- Ban icon on blackout items in calendar
- Different background colors per blackout reason
- Slightly transparent (80% opacity) to distinguish from bookings

### 3. Styling
Added `bg-stripe` CSS class for striped pattern effect using repeating linear gradient.

## API Integration

**Endpoints Used:**
- `GET /api/availability` - Fetch all blackouts
- `POST /api/availability` - Create blackout
- `PATCH /api/availability/:id` - Update blackout
- `DELETE /api/availability/:id` - Delete blackout

**Data Flow:**
1. Calendar fetches both bookings and blackouts on mount
2. Blackouts filtered by date range for each calendar day
3. Both bookings and blackouts shown in calendar cells
4. Toggles control visibility without refetching data

## Features Implemented

✅ Show blackouts alongside bookings in calendar
✅ Different visual style (striped pattern) for blackouts vs bookings
✅ Color-coded by blackout reason
✅ Filter toggles for show/hide bookings and blackouts
✅ Click on empty day to add booking or blackout
✅ Right-click context menu to add blackout
✅ Click blackout to view/delete details
✅ Hover shows blackout details (via title attribute)
✅ Legend showing all booking statuses and blackout reasons
✅ Works in month view (week and day views exist but not updated)

## Usage

### Adding a Blackout
1. Navigate to Calendar page (`/app/calendar`)
2. Right-click on any day OR click empty day and select "Blackout" button
3. Select the rental item to blackout
4. Choose start and end dates
5. Select reason (Maintenance, Repair, etc.)
6. Add optional notes
7. Click "Create Blackout"

### Viewing Blackouts
- Blackouts appear in calendar with striped background
- Each has a ban icon and shows the item name
- Different colors based on reason
- Hover to see tooltip with full details

### Deleting Blackouts
1. Click on a blackout in the calendar
2. Review details in modal
3. Click "Delete Blackout" button
4. Blackout is removed and calendar refreshes

### Filtering
- Use sidebar "Show/Hide" toggles to hide/show bookings or blackouts
- Use existing item filter to filter both bookings and blackouts by item

## Notes for Future Enhancement

1. **Week/Day Views**: Currently only month view shows blackouts. Week and day views could be enhanced similarly.
2. **Recurring Blackouts**: Could add support for recurring maintenance schedules.
3. **Blackout Templates**: Pre-configured blackout templates for common scenarios.
4. **Conflict Detection**: Show warnings if creating blackout on days with existing bookings.
5. **Bulk Operations**: Select multiple dates at once for blackout creation.
6. **Export/Import**: Export blackout schedule or import from calendar files.
