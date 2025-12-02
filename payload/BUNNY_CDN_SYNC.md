# Bunny CDN Sync Guide: BH-SaaS ↔ rb-payload

This guide explains how to configure Bunny CDN storage to work across both the BH-SaaS project and the rb-payload project, ensuring uploaded images can be shared and synced between both systems.

## Overview

Both projects use Bunny CDN for media storage, but with slightly different implementations:

- **BH-SaaS**: Uses a custom Bunny storage plugin
- **rb-payload**: Uses the official `@payloadcms/plugin-cloud-storage` with a Bunny adapter

Despite different implementations, both can share the same Bunny CDN Storage Zone, allowing uploaded files to be accessible across both projects.

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   BH-SaaS       │         │   rb-payload    │
│   (Payload)     │         │   (Payload)     │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └─────────┬─────────────────┘
                   │
                   │ Both upload to same Storage Zone
                   ↓
         ┌─────────────────┐
         │ Bunny Storage   │
         │   Zone          │
         └────────┬────────┘
                  │
                  │ Served via
                  ↓
         ┌─────────────────┐
         │   Bunny CDN     │
         │  (Pull Zone)    │
         └─────────────────┘
```

## Environment Variable Mapping

The two projects use different environment variable names. Here's how they map:

| Purpose | BH-SaaS Variable | rb-payload Variable |
|---------|------------------|---------------------|
| Storage Zone Name | `BUNNY_STORAGE_ZONE` | `BUNNY_STORAGE_ZONE` |
| API Key | `BUNNY_API_KEY` | `BUNNY_STORAGE_API_KEY` |
| CDN URL | `BUNNY_CDN_URL` | `BUNNY_CDN_HOSTNAME` |
| Enable Flag | `BUNNY_STORAGE_ENABLED` | _(auto-enabled if vars set)_ |

## Step-by-Step Setup

### 1. Create Bunny CDN Account

1. Sign up at [bunny.net](https://bunny.net)
2. Verify your email and complete account setup

### 2. Create Storage Zone

1. Navigate to **Storage** → **Add Storage Zone**
2. Configure:
   - **Name**: Choose a descriptive name (e.g., `bouncehouse-media`)
   - **Region**: Select closest to your users
     - `de` - Frankfurt (Europe)
     - `ny` - New York (US East)
     - `la` - Los Angeles (US West)
     - `sg` - Singapore (Asia)
     - `syd` - Sydney (Australia)
   - **Replication**: Enable if you want geo-replication
3. Click **Add Storage Zone**
4. **Copy the Storage Zone name** for later

### 3. Get Storage API Key

1. Open your newly created Storage Zone
2. Go to **FTP & API Access** tab
3. Find the **Password** field (this is your API key)
4. Click **Show** and **Copy the password**
5. **Store this securely** - you'll need it for both projects

### 4. Create Pull Zone (CDN)

1. Navigate to **Pull Zones** → **Add Pull Zone**
2. Configure:
   - **Name**: Descriptive name (e.g., `bouncehouse-cdn`)
   - **Origin Type**: Select **Storage Zone**
   - **Storage Zone**: Select your storage zone from step 2
   - **Pricing Region**: Choose based on your needs
3. Click **Add Pull Zone**
4. After creation, find the **CDN Hostname**
   - Format: `your-zone.b-cdn.net`
5. **Copy the hostname** for configuration

### 5. Configure BH-SaaS

Edit `/Users/tnorthern/Documents/projects/bh-sass/.env`:

```env
# Bunny CDN Storage
BUNNY_STORAGE_ENABLED=true
BUNNY_STORAGE_ZONE=bouncehouse-media
BUNNY_API_KEY=paste-your-api-key-here
BUNNY_CDN_URL=https://your-zone.b-cdn.net
BUNNY_STORAGE_COLLECTIONS=media
```

**Important Notes:**
- `BUNNY_CDN_URL` must include `https://`
- `BUNNY_STORAGE_ENABLED` must be `true` to activate

### 6. Configure rb-payload

Edit `/Users/tnorthern/Documents/projects/reusable-booking/rb-payload/.env`:

```env
# Bunny CDN Storage
BUNNY_STORAGE_API_KEY=paste-your-api-key-here
BUNNY_STORAGE_ZONE=bouncehouse-media
BUNNY_CDN_HOSTNAME=your-zone.b-cdn.net
```

**Important Notes:**
- `BUNNY_CDN_HOSTNAME` should NOT include `https://` (just the hostname)
- rb-payload auto-enables if all three variables are set

### 7. Verify Configuration

#### Test BH-SaaS:
```bash
cd /Users/tnorthern/Documents/projects/bh-sass
docker-compose up -d
# Wait for services to start
# Navigate to http://localhost:3003/admin
# Upload an image in Media collection
# Check Bunny dashboard to verify upload
```

#### Test rb-payload:
```bash
cd /Users/tnorthern/Documents/projects/reusable-booking/rb-payload
docker-compose up -d
# Wait for services to start
# Navigate to http://localhost:3000/admin
# Upload an image in Media collection
# Check Bunny dashboard to verify upload
```

## Sharing Files Between Projects

### Same Storage Zone Strategy

By using the same `BUNNY_STORAGE_ZONE` in both projects:
- Files uploaded from BH-SaaS are accessible in rb-payload
- Files uploaded from rb-payload are accessible in BH-SaaS
- Both serve files from the same CDN URL

### File Organization

To avoid filename conflicts between projects, consider:

1. **Use prefixes in your Storage Zone** (recommended):
   ```env
   # BH-SaaS might use: /bh-saas/filename.jpg
   # rb-payload might use: /rb-payload/filename.jpg
   ```

2. **Use separate Storage Zones** (alternative):
   - Create `bh-saas-media` Storage Zone
   - Create `rb-payload-media` Storage Zone
   - Each project gets its own space

### Current Implementation

Both projects currently use unique filename generation:
- **BH-SaaS**: `filename-timestamp-random.ext`
- **rb-payload**: Payload's default naming with metadata

This minimizes collision risk even when sharing the same Storage Zone.

## Implementation Differences

### BH-SaaS Implementation

**Location**: `/Users/tnorthern/Documents/projects/bh-sass/payload/src/lib/bunnyStorage.ts`

**Features**:
- Custom plugin using Payload hooks
- `afterChange` hook uploads files after Payload saves locally
- `afterDelete` hook removes files from Bunny
- Unique filename generation with timestamp + random string
- Stores both local and CDN URLs

**Pros**:
- Full control over upload logic
- Can customize behavior easily
- No external plugin dependencies
- Fallback to local storage if Bunny fails

**Cons**:
- Custom implementation to maintain
- Files stored both locally and in Bunny (unless deleted)

### rb-payload Implementation

**Location**: `/Users/tnorthern/Documents/projects/reusable-booking/rb-payload/payload-rest/src/adapters/bunnyStorageAdapter.ts`

**Features**:
- Uses official `@payloadcms/plugin-cloud-storage` plugin
- Implements Payload's storage adapter interface
- Direct upload to Bunny (no local storage)
- Automatic URL generation
- Static handler for file access

**Pros**:
- Uses official Payload plugin (maintained by Payload team)
- Standard adapter interface
- No local storage needed
- Better integration with Payload

**Cons**:
- Less flexibility for customization
- Requires understanding of adapter interface

## Security Considerations

### API Key Protection

Both projects store the Bunny API key in environment variables:
- **Never commit** `.env` files to git
- **Use secrets management** in production (e.g., Railway secrets, Docker secrets)
- **Rotate keys** periodically

### Access Control

#### In Bunny Dashboard:
- Enable **Token Authentication** for additional security
- Set **Geographic Restrictions** if needed
- Configure **Rate Limiting** to prevent abuse
- Enable **Hotlink Protection** to prevent unauthorized embedding

#### In Payload CMS:
- BH-SaaS has collection-level access control (tenant isolation)
- rb-payload has role-based access control
- Both respect Payload's built-in authentication

### Public vs Private Files

**Current Setup**: Both projects serve files publicly via CDN

**For Private Files** (future enhancement):
- Bunny supports signed URLs with expiration
- BH-SaaS: Add signed URL generation to `bunnyStorage.ts`
- rb-payload: Implement `generateURL` with signed URLs

## Monitoring and Maintenance

### Bunny Dashboard Metrics

Monitor in Bunny dashboard:
- **Storage Usage**: Track GB stored
- **Bandwidth Usage**: Monitor CDN traffic
- **Request Count**: See how many files served
- **Geographic Distribution**: Where your users are

### Cost Tracking

Keep an eye on costs:
- Storage: ~$0.01/GB/month
- Bandwidth: $0.01-0.05/GB (region-dependent)
- Free tier: 100GB bandwidth/month

**Example costs**:
- 50GB storage: $0.50/month
- 1TB bandwidth: $10-50/month
- **Total**: Usually $10-50/month for small to medium projects

### Troubleshooting

#### Files Not Uploading

**BH-SaaS**:
1. Check `BUNNY_STORAGE_ENABLED=true`
2. Verify API key is correct
3. Check Payload logs: `docker-compose logs payload`
4. Test API key with curl:
   ```bash
   curl -X PUT \
     -H "AccessKey: your-api-key" \
     -d "test" \
     https://storage.bunnycdn.com/your-zone/test.txt
   ```

**rb-payload**:
1. Verify all three env vars are set
2. Check API key and zone name
3. Check logs: `docker-compose logs payload-rest`

#### CDN URLs Not Working

1. Verify Pull Zone is connected to Storage Zone
2. Check CDN hostname format:
   - BH-SaaS: `https://your-zone.b-cdn.net`
   - rb-payload: `your-zone.b-cdn.net`
3. Wait for CDN propagation (usually seconds, max 5 minutes)
4. Test direct storage access vs CDN access

#### Permission Errors

1. Regenerate API key in Bunny dashboard
2. Update `.env` files in both projects
3. Restart services: `docker-compose restart`

## Migrating Existing Files

If you have existing files in local storage and want to migrate to Bunny:

### For BH-SaaS:

```bash
# SSH into payload container
docker-compose exec payload sh

# Run migration script (create this script as needed)
# Example: Upload all files from /media to Bunny
```

### For rb-payload:

Files uploaded after Bunny configuration will go to Bunny automatically. For existing files, write a migration script.

## Future Enhancements

### Potential Features:

1. **Signed URLs for Private Files**
   - Implement token-based access
   - Set expiration times
   - Protect sensitive documents

2. **Image Optimization**
   - Use Bunny Optimizer
   - Automatic resizing and format conversion
   - WebP/AVIF support

3. **Automatic File Cleanup**
   - Remove local copies after Bunny upload (BH-SaaS)
   - Implement retention policies
   - Lifecycle management

4. **Multi-region Support**
   - Replicate across regions
   - Edge locations for faster delivery
   - Automatic region selection

5. **CDN Purge Integration**
   - Clear CDN cache on file update
   - Selective cache invalidation
   - Automatic purge on delete

## Quick Reference

### BH-SaaS Configuration

```env
BUNNY_STORAGE_ENABLED=true
BUNNY_STORAGE_ZONE=your-storage-zone
BUNNY_API_KEY=your-api-key
BUNNY_CDN_URL=https://your-zone.b-cdn.net
```

### rb-payload Configuration

```env
BUNNY_STORAGE_API_KEY=your-api-key
BUNNY_STORAGE_ZONE=your-storage-zone
BUNNY_CDN_HOSTNAME=your-zone.b-cdn.net
```

### Key Differences

| Aspect | BH-SaaS | rb-payload |
|--------|---------|------------|
| Plugin Type | Custom Hook Plugin | Official Cloud Storage Plugin |
| API Key Var | `BUNNY_API_KEY` | `BUNNY_STORAGE_API_KEY` |
| CDN Var | `BUNNY_CDN_URL` (with https://) | `BUNNY_CDN_HOSTNAME` (no protocol) |
| Enable Flag | `BUNNY_STORAGE_ENABLED` | Auto (if vars present) |
| Local Storage | Keeps local copies | Direct to Bunny only |
| File Naming | Custom timestamp+random | Payload default |

## Testing Sync

To verify files sync correctly:

1. **Upload from BH-SaaS**:
   ```bash
   # Upload image via BH-SaaS admin
   # Note the filename
   ```

2. **Check Bunny Dashboard**:
   ```
   Storage → Your Zone → Files
   # Verify file appears
   ```

3. **Access from rb-payload**:
   ```bash
   # If using same Storage Zone, file is accessible
   # URL: https://your-zone.b-cdn.net/filename.jpg
   ```

4. **Upload from rb-payload**:
   ```bash
   # Upload image via rb-payload admin
   # Note the filename
   ```

5. **Verify in Bunny and BH-SaaS**:
   ```bash
   # File should be visible in Bunny dashboard
   # URL accessible from both projects
   ```

## Support

### BH-SaaS Documentation
- Main docs: `/payload/BUNNY_CDN_IMPLEMENTATION.md`
- API reference: `/payload/src/lib/BUNNY_STORAGE.md`
- Code: `/payload/src/lib/bunnyStorage.ts`

### rb-payload Documentation
- Adapter code: `/payload-rest/src/adapters/bunnyStorageAdapter.ts`
- Configuration: `/payload-rest/src/payload.config.ts`
- Environment: `/.env.example`

### External Resources
- Bunny CDN Docs: https://docs.bunny.net
- Payload Cloud Storage: https://payloadcms.com/docs/plugins/cloud-storage
- Bunny Support: support@bunny.net

## Summary

Both BH-SaaS and rb-payload can share the same Bunny CDN Storage Zone by configuring the same Storage Zone name and API key. While they use different implementation approaches, files uploaded from either project will be accessible via the shared CDN URL, enabling true cross-project media synchronization.

**Key Steps**:
1. Create one Bunny Storage Zone
2. Create one Pull Zone (CDN) connected to it
3. Configure both projects with the same credentials (different variable names)
4. Test uploads from both projects
5. Verify files are accessible via CDN from both systems

**Result**: Unified media storage across both projects, with fast global delivery via Bunny CDN.
