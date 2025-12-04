# Contract & Document Generation System

## Overview

This system provides complete contract and document management for bounce house rental businesses, including:

- **5 Pre-Built Templates** - Professional contracts ready to use
- **Variable Interpolation** - Dynamic content from booking data
- **Digital Signatures** - Capture and track customer signatures
- **Multi-Tenant** - Platform defaults + tenant customization
- **PDF Generation** - Professional documents on-demand
- **Full Dashboard** - Manage contracts, templates, and documents

## Quick Links

- **Quick Start**: `/CONTRACTS_QUICK_START.md` - Get started in 5 minutes
- **Full Documentation**: `/CONTRACTS_DOCUMENTATION.md` - Complete reference
- **Implementation Details**: `/CONTRACT_IMPLEMENTATION_SUMMARY.md` - Technical details

## File Structure

```
payload/src/
├── collections/
│   ├── ContractTemplates.ts       # Template collection
│   └── Contracts.ts                # Contract collection (enhanced)
├── endpoints/
│   ├── contracts.ts                # Contract API endpoints
│   └── documents.ts                # Document generation
├── lib/
│   └── documents/
│       ├── default-templates.ts    # 5 pre-built templates
│       ├── seed-templates.ts       # Seeding functions
│       ├── generator.ts            # PDF generation
│       └── contract-template.ts    # Contract PDF template

nuxt/app/pages/app/
├── contracts.vue                   # Contract management
├── templates.vue                   # Template management
└── documents.vue                   # Unified document view
```

## Collections

### ContractTemplates
Reusable contract templates with variable placeholders.

**Key Fields:**
- `name` - Template name
- `templateType` - rental-agreement, liability-waiver, etc.
- `content` - Rich text with {{variables}}
- `isDefault` - Platform default (read-only for tenants)
- `isActive` - Available for use

### Contracts
Generated contracts linked to bookings.

**Key Fields:**
- `contractNumber` - Auto-generated (CTR-2025-001)
- `bookingId` - Related booking
- `type` - Contract type
- `status` - draft, sent, signed, void
- `signatureUrl` - Digital signature
- `signerName`, `signerIP`, `signedAt` - Signature metadata

## API Endpoints

### Generate Contract
```
POST /api/contracts/generate
{
  "templateId": "...",
  "bookingId": "...",
  "customVariables": {}  // optional
}
```

### Sign Contract
```
POST /api/contracts/:id/sign
{
  "signerName": "John Smith",
  "signatureData": "data:image/png;base64,...",
  "ipAddress": "192.168.1.1"
}
```

### Send Contract
```
POST /api/contracts/:id/send
```

### Download PDF
```
GET /api/documents/contracts/:id/download
```

## Dashboard Pages

### /app/contracts
- View all contracts
- Generate from templates
- Download PDFs
- Send to customers
- Track signatures

### /app/templates
- View platform defaults
- Create custom templates
- Edit templates
- Manage active/inactive

### /app/documents
- Unified view (contracts + invoices)
- Statistics dashboard
- Filter by type
- Quick actions

## Variable System

Templates support 17+ dynamic variables:

**Business**: `{{tenantName}}`, `{{tenantPhone}}`, `{{tenantEmail}}`, `{{tenantAddress}}`

**Customer**: `{{customerName}}`, `{{customerPhone}}`, `{{customerEmail}}`, `{{customerAddress}}`

**Rental**: `{{itemName}}`, `{{itemCategory}}`, `{{startDate}}`, `{{endDate}}`, `{{deliveryAddress}}`

**Financial**: `{{totalPrice}}`, `{{depositPaid}}`, `{{balanceDue}}`

**System**: `{{currentDate}}`

### Example
```
This Rental Agreement is for {{customerName}} to rent {{itemName}}
on {{startDate}} for ${{totalPrice}}.
```

Becomes:
```
This Rental Agreement is for John Smith to rent Princess Castle
on December 15, 2025 for $250.00.
```

## Pre-Built Templates

1. **Standard Rental Agreement** - Complete rental contract
2. **Liability Waiver** - Release of liability and assumption of risk
3. **Damage Policy** - Normal wear vs. damage, fees, inspection
4. **Safety Rules** - Guidelines, restrictions, blower operation
5. **Weather Policy** - Cancellation conditions, refunds, rescheduling

All templates are professionally written and ready to use.

## Seeding

Default templates are seeded automatically:

```bash
docker compose exec payload pnpm seed
```

Or programmatically:

```typescript
import { seedContractTemplates } from './lib/documents/seed-templates'
await seedContractTemplates(payload)
```

## Workflow

1. **Create Booking** - Customer books bounce house
2. **Generate Contract** - Select template, auto-fill from booking
3. **Send to Customer** - Status changes to "sent"
4. **Customer Signs** - Digital signature captured
5. **Download PDF** - Professional document with signature

## Multi-Tenant Support

- **Platform Defaults** - Available to all tenants (read-only)
- **Custom Templates** - Tenants can create their own
- **Isolation** - Tenants only see their contracts
- **Super Admin** - Manage platform defaults

## Access Control

**Super Admins:**
- Manage platform defaults
- View all contracts
- Full system access

**Tenant Admins:**
- View defaults (read-only)
- Create/edit custom templates
- Generate contracts
- View tenant contracts

**Staff:**
- View contracts
- Cannot manage templates

## Integration Points

**Bookings Collection** - Source of contract data (customer, item, dates, pricing)

**Customers Collection** - Customer information for contracts

**Tenants Collection** - Business information, multi-tenant scoping

**Audit Logs** - Automatic tracking of contract changes

**Document Generator** - PDF creation infrastructure

## Security

- IP address tracking for signatures
- Timestamp verification
- Audit trail
- Tenant isolation
- Access control enforcement
- Read-only signed contracts

## Future Enhancements

- [ ] Email delivery via Brevo
- [ ] Public signing page
- [ ] PDF storage in Bunny CDN
- [ ] Bulk operations
- [ ] Template analytics
- [ ] DocuSign integration
- [ ] Multi-language support
- [ ] Version control

## Testing

### Manual Testing
1. Seed templates: `docker compose exec payload pnpm seed`
2. Create booking via dashboard
3. Generate contract from template
4. Verify variables interpolated
5. Download PDF
6. Test signature capture (via API)

### API Testing
```bash
# Generate contract
curl -X POST http://localhost:3004/api/contracts/generate \
  -H "Content-Type: application/json" \
  -d '{"templateId":"...","bookingId":"..."}'

# Download PDF
curl http://localhost:3004/api/documents/contracts/CONTRACT_ID/download \
  -o test.pdf
```

## Troubleshooting

**Templates not showing:**
```bash
docker compose exec payload pnpm seed
```

**Variables not replacing:**
- Check syntax: `{{variable}}` not `{variable}`
- Verify booking has complete data
- Variables are case-sensitive

**Permission denied:**
- Check user role
- Verify tenant scoping
- Super admin required for defaults

**PDF generation fails:**
- Check booking data complete
- Verify contract has content
- Check Payload logs

## Support

- Payload Logs: `docker compose logs payload`
- Audit Logs: `/admin/collections/audit-logs`
- Full Docs: `/CONTRACTS_DOCUMENTATION.md`
- Quick Start: `/CONTRACTS_QUICK_START.md`

## License

MIT

---

**Built with Payload CMS 3.64 + Nuxt 4.2**
