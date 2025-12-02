# Database Seeding

This document explains how to seed the database with demo data including demo users.

## Demo User Credentials

The seed script creates three demo users for testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@bouncepro.demo` | `demo123!` |
| Owner | `owner@bouncepro.demo` | `demo123!` |
| Staff | `staff@bouncepro.demo` | `demo123!` |

## Running the Seed

### Using Docker

If the Payload container is running in Docker:

```bash
docker exec bh_payload pnpm seed
```

### Using Local Environment

If running Payload locally:

```bash
cd /path/to/payload
pnpm seed
```

## What Gets Seeded

The seed script creates:

1. **Demo Tenant**: BouncePro Demo Rentals
   - Pre-configured with settings for a bounce house rental business
   - Delivery settings, booking policies, etc.

2. **Demo Users** (3 users):
   - Super Admin (`admin@bouncepro.demo`)
   - Tenant Admin/Owner (`owner@bouncepro.demo`)
   - Staff (`staff@bouncepro.demo`)

3. **Rental Items** (5 items):
   - Small Bounce House
   - Large Bounce House
   - Water Slide
   - Obstacle Course
   - Combo Bounce + Slide

4. **Sample Customers** (3 customers):
   - Sarah Johnson (VIP)
   - Michael Chen (Regular)
   - Emily Rodriguez (New)

## Verifying the Seed

You can verify the demo users were created successfully by testing login:

### Via Payload API

```bash
curl -X POST 'http://localhost:3004/api/users/login' \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"admin@bouncepro.demo","password":"demo123!"}'
```

Successful response will include a JWT token.

### Via Nuxt Frontend

1. Navigate to `http://localhost:3005/auth/login`
2. Click one of the demo account buttons
3. Click "Sign in"
4. You should be redirected to the dashboard

## Seed Script Location

The seed script is located at:
```
/Users/tnorthern/Documents/projects/bh-sass/payload/src/seed.ts
```

It's registered in `package.json` as:
```json
{
  "scripts": {
    "seed": "cross-env NODE_OPTIONS=--no-deprecation tsx src/seed.ts"
  }
}
```

## Re-seeding

The seed script will:
- Delete all existing data (tenants, users, rental items, customers, bookings)
- Recreate everything from scratch

**Warning**: This is destructive! Only run in development environments.

## Troubleshooting

### "Users already exist" error

If you see validation errors about existing emails, the seed script's deletion phase may have failed. You can:

1. Manually delete users from the Payload admin panel
2. Or connect to the database directly and truncate tables

### Collection validation errors

If you see "The following field is invalid" errors, check that:
- The seed data matches the collection schema in `/src/collections/`
- All required fields are provided
- Field types match (e.g., `category` values match the select options)
