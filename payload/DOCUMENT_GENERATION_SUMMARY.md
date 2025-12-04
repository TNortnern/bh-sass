# Document Generation System - Implementation Summary

## Overview

This document generation system allows BouncePro to automatically generate professional PDF documents for invoices, contracts, and packing slips. The system is fully integrated with the booking workflow and includes support for tenant branding.

## Features Implemented

### 1. PDF Library Installation
- **PDFKit** (`^0.15.0`) - Core PDF generation library
- **QRCode** (`^1.5.4`) - QR code generation for packing slips
- Type definitions: `@types/pdfkit` and `@types/qrcode`

### 2. Collections

#### Invoices Collection (`/collections/Invoices.ts`)
- Auto-generated invoice numbers (format: `INV-YYYY-###`)
- Line items with automatic total calculation
- Subtotal, tax, discount, and total amount tracking
- Invoice status: `draft`, `sent`, `paid`, `void`
- Payment tracking with due dates
- Linked to bookings, customers, and tenants
- Full audit trail support

#### Contracts Collection (`/collections/Contracts.ts`)
- Auto-generated contract numbers (format: `CTR-YYYY-###`)
- Contract types: `rental-agreement`, `liability-waiver`, `custom`
- Rich text content support (Lexical editor)
- Digital signature tracking (URL, name, IP address)
- Contract status: `draft`, `sent`, `signed`, `void`
- Send and sign date tracking
- Linked to bookings, customers, and tenants

### 3. Document Templates

#### Invoice Template (`/lib/documents/invoice-template.ts`)
**Includes:**
- Company logo and business information
- Bill-to customer information
- Invoice number and dates
- Rental period details
- Line items table with quantities, unit prices, and totals
- Subtotal, tax, discount, and total calculations
- Payment terms and notes
- Professional formatting with proper pagination

#### Contract Template (`/lib/documents/contract-template.ts`)
**Includes:**
- Agreement header with contract number
- Lessor (business) and Lessee (customer) information
- Rental details (item, period, delivery address)
- Terms and conditions (Lexical rich text converted to PDF)
- Signature section for both parties
- Digital signature placeholder
- Professional legal document formatting

#### Packing Slip Template (`/lib/documents/packing-slip-template.ts`)
**Includes:**
- Company contact information
- Customer and delivery details
- Delivery and pickup date/time
- Items list with quantities
- Setup requirements and instructions
- Safety notes
- Special delivery instructions
- QR code for quick booking lookup
- Contact information for issues

### 4. Document Generation Utilities

#### Core Functions (`/lib/documents/generator.ts`)
- `generateInvoice(payload, bookingId)` - Generate invoice PDF from booking
- `generateContract(payload, bookingId)` - Generate contract PDF from booking
- `generatePackingSlip(payload, bookingId)` - Generate packing slip PDF from booking
- `generateAllDocuments(payload, bookingId)` - Generate all three documents at once

#### Helper Functions (`/lib/documents/utils.ts`)
- `formatCurrency(amount, currency)` - Format monetary values
- `formatDate(date, formatStr)` - Format dates
- `formatDocumentDate(date)` - Format dates for documents
- `formatDateTime(date)` - Format date and time
- `calculateTax(subtotal, taxRate)` - Calculate tax amounts
- `getRelationshipId(field)` - Safe extraction of relationship IDs
- `getRelationshipValue<T>(field)` - Safe extraction of relationship values

### 5. API Endpoints

#### POST `/api/documents/generate`
Generate a new document (invoice, contract, or packing slip).

**Request Body:**
```json
{
  "type": "invoice | contract | packing-slip",
  "bookingId": "booking_id_here"
}
```

**Response:**
- PDF file download with appropriate filename
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="..."`

#### GET `/api/documents/:collection/:id/download`
Download an existing invoice or contract PDF.

**Parameters:**
- `collection`: `invoices` or `contracts`
- `id`: Document ID

**Response:**
- Freshly generated PDF from the latest data
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="..."`

#### POST `/api/documents/preview`
Preview a document without saving (same as generate but inline display).

**Request Body:**
```json
{
  "type": "invoice | contract | packing-slip",
  "bookingId": "booking_id_here"
}
```

**Response:**
- PDF displayed inline in browser
- Content-Type: `application/pdf`
- Content-Disposition: `inline`

### 6. Data Flow

```
Booking Created
     |
     v
Generate Documents Endpoint Called
     |
     v
Fetch Booking with Deep Relationships (depth: 3)
     |
     +-- Tenant (business info, logo)
     +-- Customer (contact info, address)
     +-- Rental Item (details, specs)
     |
     v
Create/Find Document Records
     |
     +-- Invoice (auto-create with line items)
     +-- Contract (auto-create with default terms)
     |
     v
Generate PDF Using Templates
     |
     +-- Apply tenant branding
     +-- Format data for display
     +-- Handle missing data gracefully (show "N/A")
     |
     v
Return PDF Buffer
     |
     v
Stream to Client / Save to Storage
```

### 7. Error Handling

- **Graceful degradation**: Missing data displays "N/A" instead of crashing
- **Validation**: Checks for required fields before generation
- **Type safety**: Full TypeScript support with proper type guards
- **Error logging**: All errors logged with context
- **User-friendly messages**: Clear error responses for API consumers

### 8. Testing

Unit tests created in `/tests/document-generation.test.ts`:
- Currency formatting tests
- Date formatting tests
- Invoice data structure validation
- Contract data structure validation
- Packing slip data structure validation
- Missing data handling tests

## Usage Examples

### Generate Invoice for a Booking

```typescript
// POST /api/documents/generate
const response = await fetch('/api/documents/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'invoice',
    bookingId: '67876543212345678901234'
  })
})

const blob = await response.blob()
// Download or display PDF
```

### Download Existing Invoice

```typescript
// GET /api/documents/invoices/{id}/download
const response = await fetch('/api/documents/invoices/67890/download')
const blob = await response.blob()
// Download PDF
```

### Generate All Documents

```typescript
import { generateAllDocuments } from '@/lib/documents/generator'

const { invoice, contract, packingSlip } = await generateAllDocuments(
  payload,
  bookingId
)

// Store or send PDFs
```

## Future Enhancements

### Planned Features
1. **Bunny CDN Integration**: Upload generated PDFs to CDN for faster access
2. **Email Integration**: Auto-send documents via Brevo when status changes
3. **Document Versioning**: Track document changes over time
4. **Custom Templates**: Allow tenants to customize document templates
5. **Bulk Generation**: Generate documents for multiple bookings at once
6. **Digital Signatures**: Integrate e-signature providers (DocuSign, HelloSign)
7. **Document Archive**: Store generated PDFs in database
8. **Webhook Notifications**: Trigger webhooks when documents are generated
9. **Multi-language Support**: Generate documents in customer's language
10. **Custom Branding**: Allow tenants to customize colors, fonts, logos

### Technical Improvements
- Caching for frequently accessed documents
- Background job processing for large batch operations
- Document thumbnail generation
- PDF compression for smaller file sizes
- Template hot-reloading for development

## Configuration

### Environment Variables
None required - works out of the box with existing Payload setup.

### Optional Configuration
- Tenant logo: Upload logo in Payload admin for branded documents
- Contract terms: Edit contract content in Payload admin
- Invoice line items: Customize in booking creation

## Dependencies

```json
{
  "dependencies": {
    "pdfkit": "^0.15.0",
    "qrcode": "^1.5.4"
  },
  "devDependencies": {
    "@types/pdfkit": "^0.13.5",
    "@types/qrcode": "^1.5.5"
  }
}
```

## File Structure

```
payload/
├── src/
│   ├── collections/
│   │   ├── Invoices.ts           # Invoice collection schema
│   │   └── Contracts.ts          # Contract collection schema
│   ├── lib/
│   │   └── documents/
│   │       ├── types.ts          # TypeScript interfaces
│   │       ├── utils.ts          # Formatting utilities
│   │       ├── generator.ts      # Main generation logic
│   │       ├── invoice-template.ts      # Invoice PDF template
│   │       ├── contract-template.ts     # Contract PDF template
│   │       ├── packing-slip-template.ts # Packing slip PDF template
│   │       └── index.ts          # Public exports
│   └── endpoints/
│       └── documents.ts          # API endpoints
└── tests/
    └── document-generation.test.ts  # Unit tests
```

## Notes

- All documents are generated on-demand (not pre-generated)
- PDFs are created using PDFKit for maximum control and customization
- Documents inherit tenant branding automatically
- All currency values use tenant's configured currency (default: USD)
- Dates are formatted using tenant's timezone (default: America/New_York)
- QR codes on packing slips link to booking details

## Support

For issues or questions:
1. Check the test file for usage examples
2. Review the generator.ts file for API details
3. Examine template files for customization options
4. Refer to PDFKit documentation for advanced PDF features
