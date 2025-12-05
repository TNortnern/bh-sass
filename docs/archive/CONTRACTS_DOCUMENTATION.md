# Contract & Document Generation System

## Overview

The bounce house rental SaaS now includes a complete document and contract management system that allows businesses to:
- Generate professional contracts from reusable templates
- Collect digital signatures
- Manage invoices and packing slips
- Track document status and history
- Use variable interpolation for dynamic content

## Architecture

### Collections

#### 1. **ContractTemplates** (`/api/contract-templates`)
Stores reusable contract templates with variable placeholders.

**Fields:**
- `name` - Template name (e.g., "Standard Rental Agreement")
- `templateType` - Type: rental-agreement, liability-waiver, damage-policy, safety-rules, weather-policy, custom
- `description` - Brief description
- `content` - Rich text content with {{variables}}
- `isDefault` - Platform-wide default (only super_admins can create)
- `requiresSignature` - Whether signature is required
- `isActive` - Active templates available for use
- `tenantId` - Null for platform defaults, or specific tenant ID

**Access Control:**
- Super admins: Full access to all templates
- Tenant admins: Can read defaults + their own templates, create/edit/delete their own
- Default templates cannot be deleted by tenants

#### 2. **Contracts** (Existing, Enhanced)
Stores generated contracts linked to bookings.

**Fields:**
- `contractNumber` - Auto-generated (e.g., "CTR-2025-001")
- `bookingId` - Related booking
- `customerId` - Customer signing the contract
- `type` - Contract type (matches template types)
- `content` - Generated content (variables interpolated)
- `status` - draft, sent, signed, void
- `sentAt` - When sent to customer
- `signedAt` - When customer signed
- `signatureUrl` - Digital signature image
- `signerName` - Name of signer
- `signerIP` - IP address for verification
- `pdfUrl` - Generated PDF URL (future)

## Pre-Built Templates

The system includes 5 default templates:

### 1. Standard Rental Agreement
Complete rental agreement with terms, conditions, payment, liability, and cancellation policy.

### 2. Liability Waiver
Release of liability and assumption of risk for inflatable equipment use.

### 3. Damage Policy
Policy regarding normal wear vs. excessive damage, prohibited activities, and damage fees.

### 4. Safety Rules Acknowledgment
Safety guidelines, weather restrictions, age limits, prohibited items, and blower operation.

### 5. Weather Cancellation Policy
Conditions requiring cancellation, refund policies, and rescheduling options.

## Variable System

### Available Variables

Templates support dynamic variable interpolation using `{{variableName}}` syntax:

**Tenant Variables:**
- `{{tenantName}}` - Business name
- `{{tenantPhone}}` - Business phone
- `{{tenantEmail}}` - Business email
- `{{tenantAddress}}` - Full business address

**Customer Variables:**
- `{{customerName}}` - Customer full name
- `{{customerPhone}}` - Customer phone
- `{{customerEmail}}` - Customer email
- `{{customerAddress}}` - Full customer address

**Rental Variables:**
- `{{itemName}}` - Rental item name
- `{{itemCategory}}` - Rental item category
- `{{startDate}}` - Rental start date (formatted)
- `{{endDate}}` - Rental end date (formatted)
- `{{deliveryAddress}}` - Full delivery address

**Financial Variables:**
- `{{totalPrice}}` - Total rental price (formatted)
- `{{depositPaid}}` - Deposit amount paid (formatted)
- `{{balanceDue}}` - Balance due (formatted)

**System Variables:**
- `{{currentDate}}` - Current date (formatted)

### Example Usage

```
This Rental Agreement is entered into on {{currentDate}} between
{{tenantName}} ("Lessor") and {{customerName}} ("Lessee").

RENTAL ITEM: {{itemName}}
RENTAL PERIOD: {{startDate}} to {{endDate}}
TOTAL PRICE: ${{totalPrice}}
DEPOSIT PAID: ${{depositPaid}}
BALANCE DUE: ${{balanceDue}}
```

When generated for a booking, variables are automatically replaced:

```
This Rental Agreement is entered into on December 2, 2025 between
BouncePro Demo Rentals ("Lessor") and John Smith ("Lessee").

RENTAL ITEM: Princess Castle Bounce House
RENTAL PERIOD: December 15, 2025 to December 16, 2025
TOTAL PRICE: $250.00
DEPOSIT PAID: $125.00
BALANCE DUE: $125.00
```

## API Endpoints

### Generate Contract from Template
```http
POST /api/contracts/generate
Content-Type: application/json

{
  "templateId": "template-id-here",
  "bookingId": "booking-id-here",
  "customVariables": {  // Optional overrides
    "someVariable": "custom value"
  }
}

Response:
{
  "success": true,
  "contractId": "contract-id",
  "contractNumber": "CTR-2025-001",
  "message": "Contract generated successfully"
}
```

### Sign Contract
```http
POST /api/contracts/:contractId/sign
Content-Type: application/json

{
  "signerName": "John Smith",
  "signatureData": "data:image/png;base64,...",
  "ipAddress": "192.168.1.1"  // Optional
}

Response:
{
  "success": true,
  "contract": {
    "id": "contract-id",
    "contractNumber": "CTR-2025-001",
    "status": "signed",
    "signedAt": "2025-12-02T10:30:00Z"
  }
}
```

### Send Contract for Signature
```http
POST /api/contracts/:contractId/send

Response:
{
  "success": true,
  "message": "Contract sent to customer for signature",
  "contractNumber": "CTR-2025-001"
}
```

### Download Contract PDF
```http
GET /api/documents/contracts/:contractId/download

Response: PDF file download
```

## Dashboard Pages

### 1. Contracts Page (`/app/contracts`)

**Features:**
- View all contracts with filtering
- Generate new contracts from templates
- View contract details
- Download PDFs
- Send contracts to customers
- Track signature status

**Columns:**
- Contract Number
- Customer Name
- Type
- Status (draft/sent/signed/void)
- Signed Date
- Created Date
- Actions (view, download, send)

### 2. Templates Page (`/app/templates`)

**Features:**
- View all available templates (defaults + custom)
- Create new custom templates
- Edit custom templates (redirects to Payload admin for rich text)
- Delete custom templates (defaults protected)
- See which templates are platform defaults
- Activate/deactivate templates

**Columns:**
- Template Name
- Type
- Source (Platform Default / Custom)
- Signature Required
- Status (Active/Inactive)
- Created Date
- Actions (view, edit, delete)

### 3. Documents Page (`/app/documents`)

**Features:**
- Unified view of all documents (contracts + invoices)
- Filterable tabs: All, Contracts, Invoices
- Statistics dashboard
- Quick actions for generation
- Bulk download (future)

**Stats:**
- Total Documents
- Contracts Count
- Invoices Count
- Signed Count
- Paid Count

## Workflow

### Creating a Contract

1. **From Dashboard:**
   - Go to `/app/contracts`
   - Click "Generate Contract"
   - Select a booking from dropdown
   - Select a template
   - Click "Generate"

2. **Via API:**
   ```javascript
   const response = await fetch('/api/contracts/generate', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       templateId: 'template-id',
       bookingId: 'booking-id'
     })
   })
   ```

3. **What Happens:**
   - System fetches template
   - Loads booking data (customer, item, dates, etc.)
   - Replaces all `{{variables}}` with actual data
   - Creates contract record
   - Contract status set to "draft"

### Sending a Contract

1. Contract must be in "draft" status
2. Click "Send" button or call API
3. Status changes to "sent"
4. `sentAt` timestamp recorded
5. TODO: Email sent to customer with signing link

### Signing a Contract

1. Customer receives email with signing link
2. Customer reviews contract
3. Customer draws/uploads signature
4. System records:
   - Signature image
   - Signer name
   - IP address
   - Timestamp
5. Status changes to "signed"
6. TODO: Generate and store final PDF

## Seeding

Default templates are automatically seeded when running:

```bash
docker compose exec payload pnpm seed
```

Or programmatically:

```typescript
import { seedContractTemplates } from './lib/documents/seed-templates'

await seedContractTemplates(payload)
```

### Tenant-Specific Templates

Create copies of default templates for a tenant:

```typescript
import { seedTenantTemplates } from './lib/documents/seed-templates'

await seedTenantTemplates(payload, tenantId)
```

This creates customizable copies that tenants can modify without affecting platform defaults.

## Customization

### Creating Custom Templates

**Via Dashboard:**
1. Go to `/app/templates`
2. Click "Create Template"
3. Fill in basic info (name, type, description)
4. Enter content with `{{variables}}`
5. For rich text formatting, edit in Payload admin after creation

**Via Payload Admin:**
1. Go to `/admin/collections/contract-templates`
2. Click "Create New"
3. Use full Lexical rich text editor
4. Add headings, lists, formatting
5. Insert variables inline

**Via API:**
```javascript
const template = await fetch('/api/contract-templates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Custom Agreement',
    templateType: 'custom',
    description: 'My custom contract',
    content: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'Agreement for {{customerName}}...' }
            ]
          }
        ]
      }
    },
    requiresSignature: true,
    isActive: true
  })
})
```

## Best Practices

### Template Management

1. **Use Defaults as Starting Point** - Clone platform defaults for customization
2. **Test with Sample Data** - Generate test contracts before using in production
3. **Version Control** - Keep templates active but create new versions for changes
4. **Clear Naming** - Use descriptive names like "Winter 2025 Rental Agreement"

### Variable Usage

1. **Always Use Curly Braces** - `{{variable}}` not `{variable}`
2. **Check Availability** - Only use variables listed in the system
3. **Formatting** - Dates and currency are pre-formatted, don't add extra formatting
4. **Fallbacks** - System shows "N/A" for missing data

### Security

1. **IP Tracking** - Automatically recorded for signatures
2. **Timestamp Verification** - All actions timestamped
3. **Audit Trail** - Contract changes logged via audit system
4. **Access Control** - Tenants only see their contracts
5. **Read-Only Signed** - Once signed, content cannot be modified

## Future Enhancements

- [ ] PDF generation and storage for signed contracts
- [ ] Email delivery of contracts with signing links
- [ ] Embedded signature widget (iFrame or web component)
- [ ] Bulk contract generation for multiple bookings
- [ ] Contract expiration and renewal
- [ ] Advanced variable system (calculations, conditionals)
- [ ] Multi-language template support
- [ ] Template versioning and change history
- [ ] Analytics: most used templates, signature rates
- [ ] Integration with DocuSign/HelloSign for advanced signing

## Troubleshooting

### Variables Not Replacing

- Check variable syntax: must be `{{variableName}}`
- Ensure booking has complete data
- Verify variable name matches exactly (case-sensitive)

### Template Not Appearing

- Check `isActive` is true
- Verify access permissions (tenantId)
- Refresh template list

### Cannot Edit Default Template

- Default templates are read-only for tenants
- Clone the template to create custom version
- Only super_admins can edit defaults

### Signature Not Saving

- Check signature data is valid base64 image
- Verify contract is in "sent" status
- Ensure proper permissions

## Support

For issues or questions:
- Check Payload logs: `docker compose logs payload`
- View audit logs in admin panel
- Contact platform support
