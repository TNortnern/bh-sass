# Payload CMS Library Files

This directory contains custom integrations and utilities for Payload CMS.

## Bunny CDN Storage Adapter

A custom storage adapter for integrating Bunny CDN with Payload CMS.

### Files

- **bunnyStorage.ts** - Main plugin implementation
- **bunnyStorage.example.ts** - Usage examples and configuration patterns
- **BUNNY_STORAGE.md** - Comprehensive documentation
- **__tests__/bunnyStorage.test.ts** - Unit tests

### Quick Start

1. **Set Environment Variables** (in `.env`):
   ```env
   BUNNY_STORAGE_ENABLED=true
   BUNNY_STORAGE_ZONE=your-storage-zone
   BUNNY_API_KEY=your-api-key
   BUNNY_CDN_URL=https://your-zone.b-cdn.net
   ```

2. **Plugin is Already Configured** in `payload.config.ts`:
   ```typescript
   plugins: [
     bunnyStoragePlugin(createBunnyStorageFromEnv()),
   ]
   ```

3. **Upload Files** - Files uploaded through Payload admin will automatically be stored in Bunny CDN

### Features

- Automatic file upload to Bunny Storage Zone
- CDN URL generation for fast global delivery
- Unique filename generation to prevent conflicts
- Automatic cleanup on file deletion
- Graceful fallback to local storage if disabled
- Environment-based configuration
- Support for multiple collections

### Default Behavior

By default, Bunny storage is **disabled** (`BUNNY_STORAGE_ENABLED=false`). This means:

- Development uses local storage
- No Bunny credentials needed to get started
- Enable when ready for production

### Documentation

See [BUNNY_STORAGE.md](./BUNNY_STORAGE.md) for:
- Complete API reference
- Configuration options
- Getting Bunny CDN credentials
- Troubleshooting guide
- Cost optimization tips

### Testing

Run tests with:
```bash
pnpm test src/lib/__tests__/bunnyStorage.test.ts
```

## Email Integration

See `email/` directory for Brevo (email service) integration.
