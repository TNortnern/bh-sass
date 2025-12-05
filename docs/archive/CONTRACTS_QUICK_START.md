# Contract System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Seed Default Templates

Run the seed script to populate default contract templates:

```bash
docker compose exec payload pnpm seed
```

This creates 5 professional templates:
- ✅ Standard Rental Agreement
- ✅ Liability Waiver
- ✅ Damage Policy
- ✅ Safety Rules Acknowledgment
- ✅ Weather Cancellation Policy

### Step 2: View Templates

1. Open your dashboard: `http://localhost:3005/app`
2. Navigate to Templates page (or go to `http://localhost:3005/app/templates`)
3. You'll see all 5 default templates marked as "Platform Default"

### Step 3: Create a Test Booking

You need a booking to generate a contract. Either:

**Option A: Create via Dashboard**
1. Go to `http://localhost:3005/app/bookings`
2. Create a new booking with customer, item, dates, and pricing

**Option B: Create via API**
```bash
curl -X POST http://localhost:3005/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "your-tenant-id",
    "customerId": "customer-id",
    "rentalItemId": "item-id",
    "startDate": "2025-12-15T09:00:00Z",
    "endDate": "2025-12-16T18:00:00Z",
    "totalPrice": 250,
    "status": "confirmed"
  }'
```

### Step 4: Generate Your First Contract

1. Go to `http://localhost:3005/app/contracts`
2. Click "Generate Contract" button
3. Select your test booking from the dropdown
4. Select "Standard Rental Agreement" template
5. Click "Generate"

**Result:** Contract created with all variables automatically filled!

### Step 5: Download the PDF

1. Find your new contract in the table
2. Click the download icon (📥)
3. PDF downloads with all booking details

**Done!** You now have a professional contract with your customer's name, rental details, dates, and pricing all filled in.

## 📋 Common Tasks

### View All Documents

Go to `http://localhost:3005/app/documents` to see:
- All contracts
- All invoices
- Statistics dashboard
- Filter by type

### Create Custom Template

1. Go to `http://localhost:3005/app/templates`
2. Click "Create Template"
3. Enter name, type, and description
4. Write your content with variables:
   ```
   This agreement is for {{customerName}} to rent {{itemName}}
   on {{startDate}} for ${{totalPrice}}.
   ```
5. Click "Create Template"

**For Rich Text Formatting:**
- After creating, click "Edit" to open Payload admin
- Use full rich text editor with headings, lists, bold, etc.

### Send Contract to Customer

1. Go to `http://localhost:3005/app/contracts`
2. Find contract in "draft" status
3. Click "Send" button
4. Status changes to "sent"
5. TODO: Email will be sent to customer (when email integration complete)

### Sign a Contract

**Via API:**
```javascript
const response = await fetch('/api/contracts/CONTRACT_ID/sign', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    signerName: 'John Smith',
    signatureData: 'data:image/png;base64,...', // Canvas signature
    ipAddress: '192.168.1.1'
  })
})
```

## 🎯 Available Variables

Use these in your templates (wrapped in `{{` and `}}`):

### Business Info
- `{{tenantName}}` → "BouncePro Demo Rentals"
- `{{tenantPhone}}` → "(555) 123-4567"
- `{{tenantEmail}}` → "info@bouncepro.com"
- `{{tenantAddress}}` → "123 Main St, City, ST 12345"

### Customer Info
- `{{customerName}}` → "John Smith"
- `{{customerPhone}}` → "(555) 987-6543"
- `{{customerEmail}}` → "john@example.com"
- `{{customerAddress}}` → "456 Oak Ave, City, ST 54321"

### Rental Details
- `{{itemName}}` → "Princess Castle Bounce House"
- `{{itemCategory}}` → "bounce_house"
- `{{startDate}}` → "December 15, 2025"
- `{{endDate}}` → "December 16, 2025"
- `{{deliveryAddress}}` → "789 Party Ln, City, ST 98765"

### Financial
- `{{totalPrice}}` → "250.00"
- `{{depositPaid}}` → "125.00"
- `{{balanceDue}}` → "125.00"

### System
- `{{currentDate}}` → "December 2, 2025"

## 🛠️ API Quick Reference

### Generate Contract
```bash
curl -X POST http://localhost:3005/api/contracts/generate \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "template-id",
    "bookingId": "booking-id"
  }'
```

### Sign Contract
```bash
curl -X POST http://localhost:3005/api/contracts/CONTRACT_ID/sign \
  -H "Content-Type: application/json" \
  -d '{
    "signerName": "John Smith",
    "signatureData": "data:image/png;base64,..."
  }'
```

### Download Contract
```bash
curl http://localhost:3005/api/documents/contracts/CONTRACT_ID/download \
  -o contract.pdf
```

## ❓ FAQ

**Q: Can I edit default templates?**
A: Default templates are read-only. Create a custom version by copying the content.

**Q: How do I add rich text formatting?**
A: Create template in dashboard, then edit in Payload admin (`/admin/collections/contract-templates`) for full formatting.

**Q: Can customers sign online?**
A: Digital signature API is ready. Public signing page coming soon.

**Q: What happens if booking data is missing?**
A: Variables show "N/A" if data is unavailable.

**Q: Can I generate multiple contract types for one booking?**
A: Yes! Generate rental agreement, liability waiver, safety rules, etc. for the same booking.

**Q: Are PDFs stored or generated on-demand?**
A: Currently generated on-demand. Storage coming soon.

## 🎓 Next Steps

1. **Customize Templates** - Edit defaults or create custom ones
2. **Test Full Workflow** - Create → Generate → Send → Sign
3. **Integrate with Bookings** - Auto-generate on booking confirmation
4. **Setup Email Delivery** - Configure Brevo for contract emails
5. **Add Public Signing** - Build customer-facing signature page

## 📚 Full Documentation

For complete details, see:
- `/CONTRACTS_DOCUMENTATION.md` - Full system documentation
- `/CONTRACT_IMPLEMENTATION_SUMMARY.md` - Technical implementation details

## 🆘 Troubleshooting

**Templates not showing?**
```bash
# Check if seeded
docker compose exec payload pnpm seed
```

**Variables not replacing?**
- Check syntax: `{{variableName}}` (double curly braces)
- Ensure booking has complete data
- Variables are case-sensitive

**Cannot generate contract?**
- Verify booking exists
- Check template is active
- Ensure proper authentication

**Need help?**
- Check Payload logs: `docker compose logs payload`
- View audit logs in admin panel
- Check network tab for API errors

---

**Happy Contracting! 🎉**
