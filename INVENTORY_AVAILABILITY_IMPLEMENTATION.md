# Inventory Availability/Blackout Management Implementation

## Summary

Added comprehensive blackout/availability management to the inventory detail page in BH-SaaS. Business owners can now manage item-specific blackout periods directly from the inventory detail view.

## Changes Made

### 1. Extended `useAvailability` Composable
**File**: `/nuxt/app/composables/useAvailability.ts`

**New Features**:
- `fetchBlackoutsForItem(rentalItemId)` - Fetch blackouts for a specific inventory item
- `upcomingBlackouts` - Computed property for blackouts in the next 30 days
- `pastBlackouts` - Computed property for historical blackouts
- `activeBlackouts` - Computed property for currently active blackouts

### 2. Updated Inventory Detail Page
**File**: `/nuxt/app/pages/app/inventory/[id]/index.vue`

**New Tab**: "Availability" tab added to the existing tabs (Overview, Units, Bookings, Stats)

**Features Implemented**:

#### Quick Stats Cards
- **Upcoming Blackouts**: Count of blackouts in next 30 days
- **Active Now**: Currently ongoing blackouts
- **Past**: Historical blackout count

#### Upcoming Blackouts Section
- List view of all blackouts scheduled for the next 30 days
- Each blackout shows:
  - Reason badge (color-coded: maintenance=orange, repair=red, booked=blue, seasonal=purple)
  - Date range with formatted dates
  - Optional notes
  - Delete action button
- "Add Blackout" button in header
- Empty state with helpful messaging

#### Active Blackouts Section (conditional)
- Only shown when there are currently active blackouts
- Red-highlighted cards to draw attention
- Same information display as upcoming blackouts
- Indicates item is currently unavailable

#### Past Blackouts Section (collapsible)
- Expandable/collapsible section for historical data
- Shows last 10 completed blackouts
- Slightly dimmed to indicate past status
- Click header to toggle visibility

#### Add Blackout Modal
- Pre-filled with current item (read-only display)
- Date range picker (start/end dates)
- Reason dropdown:
  - Maintenance
  - Repair
  - Already Booked
  - Seasonal Closure
  - Other
- Optional notes field (textarea)
- Info alert explaining what blocking this item means
- Form validation (requires dates)

#### Delete Confirmation
- Standard confirmation dialog using `UiConfirmDialog`
- Clear warning message
- Prevents accidental deletions

### 3. Data Flow

**On Page Load**:
1. Fetch inventory item details
2. Fetch bookings for the item (existing)
3. **NEW**: Fetch blackouts for this specific item using `fetchBlackoutsForItem(itemId)`

**Create Blackout**:
1. User clicks "Add Blackout" button
2. Modal opens with form pre-filled with today's date
3. User selects date range, reason, and optionally adds notes
4. On submit, creates blackout via Payload CMS API
5. Refreshes blackout list
6. Shows success toast notification

**Delete Blackout**:
1. User clicks "Delete" on a blackout
2. Confirmation dialog appears
3. On confirm, deletes via Payload CMS API
4. Auto-updates local state
5. Shows success toast notification

### 4. UI/UX Features

**Color Coding**:
- **Orange**: Maintenance-related
- **Red**: Repairs / Active alerts
- **Blue**: Already booked
- **Purple**: Seasonal closures
- **Gray**: Other reasons

**Responsive Design**:
- Stats cards: 3 columns on desktop, stacked on mobile
- Blackout cards: Full width with responsive padding
- Date display: Compact format with icons

**Empty States**:
- Friendly messaging when no blackouts exist
- Call-to-action to create first blackout
- Calendar-check icon for visual clarity

**Loading States**:
- Spinner animation while fetching blackouts
- Disabled buttons during save/delete operations
- Loading prop on buttons shows spinner

### 5. Integration Points

**Existing Collections** (Payload CMS):
- Uses existing `availability` collection
- No schema changes required

**API Endpoints**:
- `GET /api/availability` - Fetch blackouts with filters
- `POST /api/availability` - Create new blackout
- `DELETE /api/availability/:id` - Remove blackout

**Related Features**:
- Integrates with existing booking system
- Blackouts appear in availability checks
- Prevents double-bookings during blackout periods

## Usage

### For Business Owners

1. Navigate to Inventory → Select an Item → Click "Availability" tab
2. View upcoming, active, and past blackouts at a glance
3. Click "Add Blackout" to block dates for maintenance, repairs, etc.
4. Delete blackouts to make item available again

### Example Workflows

**Maintenance Scheduling**:
1. Go to item detail page
2. Click Availability tab
3. Click "Add Blackout"
4. Select date range for maintenance
5. Choose "Maintenance" as reason
6. Add notes: "Annual deep cleaning and inspection"
7. Save - item is now blocked for those dates

**Emergency Repair**:
1. Open item that needs repair
2. Go to Availability tab
3. Click "Add Blackout"
4. Select immediate date range
5. Choose "Repair" as reason
6. Add notes: "Torn seam needs repair"
7. Save - customers can't book this item until repair is complete

**Seasonal Closure**:
1. Select water slide item
2. Go to Availability tab
3. Create blackout for winter months
4. Choose "Seasonal Closure"
5. Notes: "Water slides unavailable November-March"

## Technical Details

### State Management
- Uses Nuxt `useState` for reactive state
- Composable handles all API calls
- Auto-updates UI on mutations

### Date Handling
- Uses `date-fns` for formatting
- ISO date strings for API communication
- Timezone-aware (uses Payload's timezone settings)

### Type Safety
- TypeScript interfaces for `Blackout` type
- Proper typing for all composable functions
- Type-safe API responses

### Performance
- Only fetches blackouts for current item (scoped query)
- Computed properties for filtering (no re-fetching)
- Efficient re-rendering with Vue's reactivity

## Future Enhancements

### Potential Additions

1. **Unit-Level Blackouts** (if item has multiple units):
   - Show which specific units are blocked
   - Add blackout for individual units vs all units
   - Visual indicator per unit in Units tab

2. **Calendar View**:
   - Mini calendar showing blackout dates
   - Click date to add blackout
   - Visual month-view with highlighted unavailable dates
   - Integration with bookings overlay

3. **Recurring Blackouts**:
   - Weekly maintenance windows (e.g., every Monday)
   - Annual seasonal closures
   - Pattern-based scheduling

4. **Blackout Templates**:
   - Pre-defined maintenance schedules
   - Quick-apply common patterns
   - Bulk operations (apply to multiple items)

5. **Integration Enhancements**:
   - Sync with rb-payload blackouts
   - Push blackouts to booking engine
   - Calendar feed export (iCal)

6. **Analytics**:
   - Utilization vs blackout ratio
   - Most common blackout reasons
   - Revenue impact of blackouts

## Testing Checklist

- [x] Availability tab appears in inventory detail page
- [x] Tab navigation works correctly
- [x] Blackouts load when tab is opened
- [x] Quick stats cards show correct counts
- [x] "Add Blackout" button opens modal
- [x] Modal form validation works
- [x] Creating blackout saves to database
- [x] New blackout appears in list immediately
- [x] Success toast appears after creation
- [x] Delete button opens confirmation dialog
- [x] Confirming delete removes blackout
- [x] Delete updates UI immediately
- [x] Past blackouts section is collapsible
- [x] Empty states display correctly
- [x] Loading states work properly
- [x] Error handling displays toast notifications
- [x] Responsive layout on mobile
- [x] Dark mode styling correct

## Files Modified

1. `/nuxt/app/composables/useAvailability.ts` - Extended with new methods
2. `/nuxt/app/pages/app/inventory/[id]/index.vue` - Added Availability tab and modals

## Files Created

None (used existing composable and page structure)

## Dependencies

No new dependencies required. Uses existing:
- `date-fns` for date formatting
- Nuxt UI components (`UCard`, `UBadge`, `UModal`, etc.)
- Payload CMS API (existing endpoints)

## API Compatibility

Fully compatible with existing Payload CMS `availability` collection:
- Collection slug: `availability`
- Fields: `rentalItemId`, `startDate`, `endDate`, `reason`, `notes`, `isActive`
- Access control: Uses existing tenant-scoped permissions
- No schema changes required

---

**Implementation Date**: 2025-12-08
**Status**: Complete ✅
