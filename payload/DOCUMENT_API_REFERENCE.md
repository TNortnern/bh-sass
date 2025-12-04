# Document Generation API Reference

Quick reference for using the document generation endpoints.

## Endpoints

### Generate Document
**POST** `/api/documents/generate`

Generate a new PDF document from a booking.

**Request:**
```json
{
  "type": "invoice | contract | packing-slip",
  "bookingId": "string"
}
```

**Response:**
- Status: `200 OK`
- Content-Type: `application/pdf`
- Body: PDF file (binary)

**Example:**
```bash
curl -X POST http://localhost:3004/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "invoice",
    "bookingId": "67876543212345678901234"
  }' \
  --output invoice.pdf
```

---

### Download Document
**GET** `/api/documents/:collection/:id/download`

Download an existing invoice or contract.

**Parameters:**
- `collection`: `invoices` or `contracts`
- `id`: Document ID

**Response:**
- Status: `200 OK`
- Content-Type: `application/pdf`
- Body: PDF file (binary)

**Example:**
```bash
curl http://localhost:3004/api/documents/invoices/67890/download \
  --output invoice.pdf
```

---

### Preview Document
**POST** `/api/documents/preview`

Preview a document inline (same as generate but for viewing).

**Request:**
```json
{
  "type": "invoice | contract | packing-slip",
  "bookingId": "string"
}
```

**Response:**
- Status: `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `inline`
- Body: PDF file (binary)

**Example:**
```bash
curl -X POST http://localhost:3004/api/documents/preview \
  -H "Content-Type: application/json" \
  -d '{
    "type": "packing-slip",
    "bookingId": "67876543212345678901234"
  }' \
  --output preview.pdf
```

## Document Types

| Type | Description | Filename Format |
|------|-------------|-----------------|
| `invoice` | Itemized billing document | `invoice-INV-YYYY-###.pdf` |
| `contract` | Rental agreement | `contract-CTR-YYYY-###.pdf` |
| `packing-slip` | Delivery checklist | `packing-slip-PKG-YYYY-###.pdf` |

## Error Responses

**400 Bad Request**
```json
{
  "error": "Missing required fields: type and bookingId"
}
```

**404 Not Found**
```json
{
  "error": "Document not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to generate document",
  "message": "Booking 123 not found"
}
```

## Integration Examples

### React/Vue Component

```typescript
async function generateInvoice(bookingId: string) {
  const response = await fetch('/api/documents/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'invoice',
      bookingId
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  // Download
  const a = document.createElement('a')
  a.href = url
  a.download = `invoice-${bookingId}.pdf`
  a.click()

  URL.revokeObjectURL(url)
}
```

### Server-Side (Payload Hook)

```typescript
import { generateAllDocuments } from '@/lib/documents/generator'

// In afterChange hook
async ({ doc, operation, req }) => {
  if (operation === 'create' && doc.status === 'confirmed') {
    // Generate all documents
    const { invoice, contract, packingSlip } =
      await generateAllDocuments(req.payload, doc.id)

    // Store PDFs in Bunny CDN or send via email
    // ... your logic here
  }
}
```

### Email Integration

```typescript
import { generateInvoice } from '@/lib/documents/generator'
import { emailService } from '@/lib/email'

async function sendInvoiceEmail(bookingId: string) {
  const { buffer, invoiceData } = await generateInvoice(payload, bookingId)

  await emailService.send({
    to: invoiceData.customer.email,
    subject: `Invoice ${invoiceData.invoice.invoiceNumber}`,
    template: 'invoice',
    data: invoiceData,
    attachments: [
      {
        filename: `invoice-${invoiceData.invoice.invoiceNumber}.pdf`,
        content: buffer
      }
    ]
  })
}
```

## Programmatic Usage

### Generate Invoice

```typescript
import { generateInvoice } from '@/lib/documents/generator'

const { buffer, invoiceData } = await generateInvoice(payload, bookingId)

// buffer: PDF Buffer
// invoiceData: Complete invoice data used for generation
```

### Generate Contract

```typescript
import { generateContract } from '@/lib/documents/generator'

const { buffer, contractData } = await generateContract(payload, bookingId)
```

### Generate Packing Slip

```typescript
import { generatePackingSlip } from '@/lib/documents/generator'

const { buffer, packingSlipData } = await generatePackingSlip(payload, bookingId)
```

### Generate All

```typescript
import { generateAllDocuments } from '@/lib/documents/generator'

const { invoice, contract, packingSlip } =
  await generateAllDocuments(payload, bookingId)

// Each is a Buffer
```

## Nuxt UI Dashboard Integration

### Add to Booking Detail Page

```vue
<template>
  <UButton
    icon="i-lucide-file-text"
    label="Generate Invoice"
    @click="downloadInvoice"
  />
  <UButton
    icon="i-lucide-file-signature"
    label="Generate Contract"
    @click="downloadContract"
  />
  <UButton
    icon="i-lucide-package"
    label="Generate Packing Slip"
    @click="downloadPackingSlip"
  />
</template>

<script setup>
const props = defineProps<{ bookingId: string }>()

async function downloadDocument(type: string) {
  const response = await $fetch('/api/documents/generate', {
    method: 'POST',
    body: { type, bookingId: props.bookingId },
    responseType: 'blob'
  })

  const url = URL.createObjectURL(response)
  const a = document.createElement('a')
  a.href = url
  a.download = `${type}-${props.bookingId}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

const downloadInvoice = () => downloadDocument('invoice')
const downloadContract = () => downloadDocument('contract')
const downloadPackingSlip = () => downloadDocument('packing-slip')
</script>
```

## Testing

### cURL Examples

```bash
# Generate invoice
curl -X POST http://localhost:3004/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"invoice","bookingId":"123"}' \
  -o invoice.pdf

# Download existing invoice
curl http://localhost:3004/api/documents/invoices/456/download \
  -o invoice.pdf

# Preview packing slip
curl -X POST http://localhost:3004/api/documents/preview \
  -H "Content-Type: application/json" \
  -d '{"type":"packing-slip","bookingId":"123"}' \
  -o preview.pdf
```

### Postman Collection

```json
{
  "info": {
    "name": "Document Generation API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Generate Invoice",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/documents/generate",
        "body": {
          "mode": "raw",
          "raw": "{\"type\":\"invoice\",\"bookingId\":\"{{bookingId}}\"}"
        }
      }
    }
  ]
}
```

## Performance Notes

- Document generation is synchronous and takes ~100-500ms per document
- For bulk operations, consider using background jobs
- PDFs are generated on-demand (not cached)
- Buffer size typically 50-200KB per document

## Security

- All endpoints respect tenant isolation
- Access control enforced via Payload's built-in auth
- No sensitive data in URLs (use POST for generation)
- PDFs contain only data accessible to the requesting user
