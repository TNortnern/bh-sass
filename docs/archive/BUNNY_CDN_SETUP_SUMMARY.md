# Bunny CDN Setup Summary - BH-SaaS

## Current Status

✅ Bunny CDN storage plugin is implemented and configured
✅ Environment variables are documented in `.env.example` files
✅ Media collection is configured to use Bunny storage
✅ Sync documentation created for rb-payload integration
⏸️ **Disabled by default** - waiting for Bunny CDN credentials

## Required Environment Variables

### For BH-SaaS (`/Users/tnorthern/Documents/projects/bh-sass/.env`)

```env
BUNNY_STORAGE_ENABLED=true
BUNNY_STORAGE_ZONE=your-storage-zone-name
BUNNY_API_KEY=your-api-key-from-bunny-dashboard
BUNNY_CDN_URL=https://your-zone.b-cdn.net
BUNNY_STORAGE_COLLECTIONS=media
```

### For rb-payload (if syncing - `/Users/tnorthern/Documents/projects/reusable-booking/rb-payload/.env`)

```env
BUNNY_STORAGE_API_KEY=your-api-key-from-bunny-dashboard
BUNNY_STORAGE_ZONE=your-storage-zone-name
BUNNY_CDN_HOSTNAME=your-zone.b-cdn.net
```

## Environment Variable Details

| Variable | Description | Where to Get It | Example Value |
|----------|-------------|-----------------|---------------|
| `BUNNY_STORAGE_ENABLED` | Enable/disable Bunny storage | Set manually | `true` or `false` |
| `BUNNY_STORAGE_ZONE` | Storage Zone name | Bunny Dashboard → Storage → Zone name | `bouncehouse-media` |
| `BUNNY_API_KEY` (BH-SaaS)<br>`BUNNY_STORAGE_API_KEY` (rb-payload) | Storage API key (password) | Bunny Dashboard → Storage → Your Zone → FTP & API Access → Password | `abc123-def456-ghi789...` |
| `BUNNY_CDN_URL` (BH-SaaS)<br>`BUNNY_CDN_HOSTNAME` (rb-payload) | Pull Zone CDN hostname | Bunny Dashboard → Pull Zones → Your Zone → Hostname | BH-SaaS: `https://myzone.b-cdn.net`<br>rb-payload: `myzone.b-cdn.net` |
| `BUNNY_STORAGE_COLLECTIONS` | Collections to enable | Set manually | `media` (default) |

## Key Differences Between Projects

| Aspect | BH-SaaS | rb-payload |
|--------|---------|------------|
| API Key Variable | `BUNNY_API_KEY` | `BUNNY_STORAGE_API_KEY` |
| CDN URL Variable | `BUNNY_CDN_URL` | `BUNNY_CDN_HOSTNAME` |
| CDN URL Format | Includes `https://` | Hostname only |
| Enable Flag | `BUNNY_STORAGE_ENABLED=true` | Auto-enabled if vars set |
| Implementation | Custom plugin via hooks | Official cloud-storage plugin |

## Getting Bunny CDN Credentials

### Step 1: Create Bunny Account
- Visit: https://bunny.net
- Sign up for free account
- Verify email

### Step 2: Create Storage Zone
1. Go to **Storage** → **Add Storage Zone**
2. Enter name: `bouncehouse-media` (or your choice)
3. Select region:
   - `de` - Frankfurt, Germany (Europe)
   - `ny` - New York (US East)
   - `la` - Los Angeles (US West)
   - `sg` - Singapore (Asia)
   - `syd` - Sydney (Australia)
4. Click **Add Storage Zone**
5. ✏️ **Note the Storage Zone name**

### Step 3: Get API Key
1. Click on your Storage Zone
2. Go to **FTP & API Access** tab
3. Find the **Password** field
4. Click **Show** to reveal
5. ✏️ **Copy this password** (this is your API key)

### Step 4: Create Pull Zone (CDN)
1. Go to **Pull Zones** → **Add Pull Zone**
2. Enter name: `bouncehouse-cdn` (or your choice)
3. **Origin Type**: Select **Storage Zone**
4. **Storage Zone**: Select the zone from Step 2
5. **Pricing Region**: Choose based on your audience
6. Click **Add Pull Zone**
7. ✏️ **Copy the CDN Hostname** (e.g., `yourzone.b-cdn.net`)

### Step 5: Configure BH-SaaS

Edit `/Users/tnorthern/Documents/projects/bh-sass/.env`:

```env
BUNNY_STORAGE_ENABLED=true
BUNNY_STORAGE_ZONE=bouncehouse-media
BUNNY_API_KEY=paste-the-password-from-step-3
BUNNY_CDN_URL=https://yourzone.b-cdn.net
```

### Step 6: Test Upload

1. Start BH-SaaS:
   ```bash
   cd /Users/tnorthern/Documents/projects/bh-sass
   docker-compose up -d
   ```

2. Open admin panel: http://localhost:3003/admin

3. Navigate to **Media** collection

4. Upload a test image

5. Check Bunny Dashboard:
   - Go to **Storage** → Your Zone
   - Verify file appears in file list

6. Test CDN URL:
   - Copy the CDN URL from uploaded media
   - Open in browser: `https://yourzone.b-cdn.net/filename.jpg`
   - Image should load from CDN

## Files and Locations

### Configuration Files
- `/Users/tnorthern/Documents/projects/bh-sass/.env.example` - Root environment template (updated ✅)
- `/Users/tnorthern/Documents/projects/bh-sass/payload/.env.example` - Payload-specific template (updated ✅)
- `/Users/tnorthern/Documents/projects/bh-sass/.env` - Your actual config (create and edit this)

### Implementation Files
- `/Users/tnorthern/Documents/projects/bh-sass/payload/src/lib/bunnyStorage.ts` - Main plugin code
- `/Users/tnorthern/Documents/projects/bh-sass/payload/src/payload.config.ts` - Payload config with plugin
- `/Users/tnorthern/Documents/projects/bh-sass/payload/src/collections/Media.ts` - Media collection

### Documentation Files
- `/Users/tnorthern/Documents/projects/bh-sass/payload/BUNNY_CDN_IMPLEMENTATION.md` - Full implementation guide
- `/Users/tnorthern/Documents/projects/bh-sass/payload/src/lib/BUNNY_STORAGE.md` - API reference
- `/Users/tnorthern/Documents/projects/bh-sass/payload/BUNNY_CDN_SYNC.md` - Sync with rb-payload guide (new ✅)
- `/Users/tnorthern/Documents/projects/bh-sass/BUNNY_CDN_SETUP_SUMMARY.md` - This file (new ✅)

## Verification Checklist

Before enabling Bunny CDN, verify:

- [ ] Bunny account created
- [ ] Storage Zone created and named
- [ ] Storage Zone API key (password) obtained
- [ ] Pull Zone created and connected to Storage Zone
- [ ] Pull Zone CDN hostname obtained
- [ ] `.env` file updated with all credentials
- [ ] `BUNNY_STORAGE_ENABLED=true` set in `.env`
- [ ] Docker services restarted: `docker-compose restart`
- [ ] Test upload performed successfully
- [ ] File appears in Bunny Storage Zone
- [ ] CDN URL is accessible

## Media Collection Configuration

The Media collection at `/payload/src/collections/Media.ts` is configured with:

```typescript
export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,  // ✅ Upload enabled
  // ... access control and fields
}
```

The plugin automatically hooks into this collection when enabled via:

```typescript
// payload.config.ts
plugins: [
  bunnyStoragePlugin(createBunnyStorageFromEnv()),
]
```

When `BUNNY_STORAGE_ENABLED=true`, the plugin:
1. Lets Payload save files locally first
2. Uploads to Bunny via `afterChange` hook
3. Updates document with CDN URL
4. Deletes from Bunny on `afterDelete`

## Syncing with rb-payload

To enable media sharing between BH-SaaS and rb-payload:

1. Use the **same Storage Zone** in both projects
2. Use the **same API Key** in both projects
3. Use the **same Pull Zone** in both projects
4. Files uploaded from either project will be accessible via shared CDN

**See detailed sync guide**: `/payload/BUNNY_CDN_SYNC.md`

## Cost Estimate

Bunny CDN pricing (as of 2024):

- **Storage**: ~$0.01 per GB per month
- **Bandwidth**: $0.01-0.05 per GB (varies by region)
- **Free Tier**: 100 GB bandwidth per month

**Example monthly costs**:
- 10 GB storage: $0.10
- 500 GB bandwidth: $5.00 - $25.00
- **Total**: ~$5 - $25/month for typical SaaS usage

**Much cheaper than alternatives**:
- AWS S3: ~3-5x more expensive
- Cloudinary: ~10x more expensive
- Google Cloud Storage: ~2-3x more expensive

## Troubleshooting

### Uploads Not Going to Bunny

**Check**:
1. `BUNNY_STORAGE_ENABLED=true` in `.env`
2. All environment variables are set correctly
3. Payload container restarted: `docker-compose restart payload`
4. Check logs: `docker-compose logs payload | grep -i bunny`

**Test API key manually**:
```bash
curl -X PUT \
  -H "AccessKey: your-api-key" \
  -d "test content" \
  https://storage.bunnycdn.com/your-zone-name/test.txt

# Should return 201 Created
```

### CDN URLs Not Working

**Check**:
1. Pull Zone is connected to Storage Zone
2. CDN hostname is correct (no typos)
3. Format includes `https://` for BH-SaaS
4. Wait 1-2 minutes for CDN propagation
5. Test direct storage URL first

**Test storage access**:
```bash
# Should list files (requires API key)
curl -H "AccessKey: your-api-key" \
  https://storage.bunnycdn.com/your-zone-name/
```

### Permission Errors

**Solutions**:
1. Regenerate API key in Bunny Dashboard
2. Update `.env` with new key
3. Restart services: `docker-compose restart`
4. Verify Storage Zone settings allow API access

## Security Notes

### API Key Protection
- ⚠️ **Never commit** `.env` files to git (already in `.gitignore`)
- ✅ Use environment variables or secrets manager in production
- ✅ Rotate API keys periodically
- ✅ Limit API key permissions to minimum required

### File Access
- 📂 **Current setup**: Files are publicly accessible via CDN
- 🔒 **For private files**: Implement signed URLs (future enhancement)
- 🛡️ **Consider enabling**: Token authentication, hotlink protection, rate limiting

### Production Recommendations
1. Enable Bunny's security features:
   - Token authentication
   - Geographic restrictions
   - Rate limiting
   - DDoS protection
2. Use separate Storage Zones for dev/staging/production
3. Enable access logs for monitoring
4. Set up alerts for unusual activity

## Quick Commands

```bash
# Start services
cd /Users/tnorthern/Documents/projects/bh-sass
docker-compose up -d

# View logs
docker-compose logs -f payload

# Restart after config change
docker-compose restart

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

## Next Steps

1. ✅ **Setup Complete** - All configuration is in place
2. ⏳ **Obtain Credentials** - Create Bunny account and get credentials
3. ⏳ **Configure Environment** - Add credentials to `.env`
4. ⏳ **Enable Plugin** - Set `BUNNY_STORAGE_ENABLED=true`
5. ⏳ **Test Upload** - Upload test image via admin panel
6. ⏳ **Verify CDN** - Check file is accessible via CDN URL
7. ⏳ **Optional: Sync with rb-payload** - Configure rb-payload with same credentials

## Support and Documentation

### Internal Documentation
- **Main Implementation Guide**: `/payload/BUNNY_CDN_IMPLEMENTATION.md`
- **API Reference**: `/payload/src/lib/BUNNY_STORAGE.md`
- **Sync Guide**: `/payload/BUNNY_CDN_SYNC.md`
- **This Summary**: `/BUNNY_CDN_SETUP_SUMMARY.md`

### External Resources
- **Bunny CDN Docs**: https://docs.bunny.net
- **Bunny Support**: support@bunny.net
- **Bunny Dashboard**: https://panel.bunny.net

### Code References
- **Plugin Implementation**: `/payload/src/lib/bunnyStorage.ts`
- **Payload Config**: `/payload/src/payload.config.ts`
- **Media Collection**: `/payload/src/collections/Media.ts`

---

**Status**: ✅ Configuration complete, waiting for Bunny CDN credentials to enable.

**Last Updated**: 2025-12-01
