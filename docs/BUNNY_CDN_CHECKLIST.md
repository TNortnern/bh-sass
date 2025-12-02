# Bunny CDN Configuration Checklist

Quick reference checklist for setting up and verifying Bunny CDN storage in BH-SaaS.

## Pre-Setup Checklist

- [ ] Have access to Bunny.net account (or create one at https://bunny.net)
- [ ] Understand storage requirements (estimated GB per month)
- [ ] Know target audience region for optimal CDN performance
- [ ] Have access to BH-SaaS `.env` file

## Bunny Dashboard Setup

### Storage Zone Creation
- [ ] Log into Bunny Dashboard: https://panel.bunny.net
- [ ] Navigate to **Storage** → **Add Storage Zone**
- [ ] Enter Storage Zone name (e.g., `bouncehouse-media`)
- [ ] Select region (de, ny, la, sg, or syd)
- [ ] Click **Add Storage Zone**
- [ ] Copy Storage Zone name to clipboard
- [ ] Save to notes: `BUNNY_STORAGE_ZONE=_____________`

### API Key Retrieval
- [ ] Click on your Storage Zone
- [ ] Go to **FTP & API Access** tab
- [ ] Click **Show** on the Password field
- [ ] Copy the password (this is your API key)
- [ ] Save to notes: `BUNNY_API_KEY=_____________`

### Pull Zone (CDN) Creation
- [ ] Navigate to **Pull Zones** → **Add Pull Zone**
- [ ] Enter Pull Zone name (e.g., `bouncehouse-cdn`)
- [ ] Set **Origin Type**: Storage Zone
- [ ] Select your Storage Zone from dropdown
- [ ] Choose pricing region
- [ ] Click **Add Pull Zone**
- [ ] Copy CDN hostname (e.g., `yourzone.b-cdn.net`)
- [ ] Save to notes: `BUNNY_CDN_URL=https://_____________`

## BH-SaaS Configuration

### Environment File Setup
- [ ] Navigate to project root: `/Users/tnorthern/Documents/projects/bh-sass`
- [ ] Open or create `.env` file
- [ ] Add Bunny configuration:
  ```env
  BUNNY_STORAGE_ENABLED=true
  BUNNY_STORAGE_ZONE=your-storage-zone
  BUNNY_API_KEY=your-api-key
  BUNNY_CDN_URL=https://your-zone.b-cdn.net
  BUNNY_STORAGE_COLLECTIONS=media
  ```
- [ ] Replace placeholder values with actual credentials
- [ ] Save `.env` file
- [ ] Verify `.env` is in `.gitignore` (already done ✅)

### Restart Services
- [ ] Open terminal in project root
- [ ] Stop services: `docker-compose down`
- [ ] Start services: `docker-compose up -d`
- [ ] Wait for services to start (30-60 seconds)
- [ ] Check logs: `docker-compose logs payload | grep -i bunny`
- [ ] Look for: "Bunny CDN storage enabled for collections: media"

## Testing and Verification

### Upload Test
- [ ] Open browser: http://localhost:3003/admin
- [ ] Log into Payload admin
- [ ] Navigate to **Media** collection
- [ ] Click **Create New**
- [ ] Fill required fields:
  - [ ] Alt text: "Test upload"
  - [ ] Select tenant (if required)
- [ ] Upload a test image (any small JPG/PNG)
- [ ] Click **Save**
- [ ] Wait for upload to complete

### Bunny Storage Verification
- [ ] Go back to Bunny Dashboard
- [ ] Navigate to **Storage** → Your Zone
- [ ] Click **Browse Files**
- [ ] Verify test image appears in file list
- [ ] Note the filename (includes timestamp and random string)

### CDN Access Verification
- [ ] In Payload admin, click on uploaded media
- [ ] Copy the URL field value
- [ ] Open URL in new browser tab
- [ ] Image should load from CDN
- [ ] URL format should be: `https://yourzone.b-cdn.net/filename-timestamp-random.jpg`

### Error Checking
- [ ] Check Payload logs for errors: `docker-compose logs payload | tail -50`
- [ ] No "Failed to upload to Bunny CDN" messages
- [ ] No "Invalid Bunny CDN configuration" messages
- [ ] Document URL in Payload uses CDN URL (not local path)

## Optional: rb-payload Sync Setup

### If Syncing with rb-payload
- [ ] Navigate to rb-payload project: `/Users/tnorthern/Documents/projects/reusable-booking/rb-payload`
- [ ] Open or create `.env` file
- [ ] Add Bunny configuration (note different variable names):
  ```env
  BUNNY_STORAGE_API_KEY=your-api-key
  BUNNY_STORAGE_ZONE=your-storage-zone
  BUNNY_CDN_HOSTNAME=your-zone.b-cdn.net
  ```
- [ ] **Important**: Use same credentials as BH-SaaS
- [ ] **Important**: `BUNNY_CDN_HOSTNAME` does NOT include `https://`
- [ ] Save `.env` file
- [ ] Restart rb-payload: `docker-compose restart`
- [ ] Test upload from rb-payload
- [ ] Verify file appears in same Bunny Storage Zone
- [ ] Verify file is accessible via CDN from both projects

## Security Checklist

### API Key Security
- [ ] `.env` file is in `.gitignore`
- [ ] Never commit `.env` to git
- [ ] Use secrets manager in production (e.g., Railway secrets)
- [ ] Rotate API keys periodically (every 3-6 months)

### Bunny Security Settings
- [ ] Review Bunny security options:
  - [ ] Enable Token Authentication (if needed for private files)
  - [ ] Set Geographic Restrictions (if applicable)
  - [ ] Configure Rate Limiting (recommended)
  - [ ] Enable Hotlink Protection (optional)
- [ ] Configure CORS if needed for browser uploads
- [ ] Review access logs periodically

## Monitoring Setup

### Bunny Dashboard Monitoring
- [ ] Bookmark Bunny Dashboard: https://panel.bunny.net
- [ ] Check current usage:
  - [ ] Storage used (GB)
  - [ ] Bandwidth used (GB)
  - [ ] Request count
- [ ] Set up billing alerts (optional):
  - [ ] Go to Account → Billing
  - [ ] Configure email alerts for usage thresholds

### Application Monitoring
- [ ] Set up log monitoring for Bunny errors
- [ ] Monitor upload success rate
- [ ] Track CDN URL accessibility
- [ ] Monitor storage costs monthly

## Troubleshooting Checklist

### If Uploads Fail

- [ ] Verify `BUNNY_STORAGE_ENABLED=true` in `.env`
- [ ] Check API key is correct (no extra spaces)
- [ ] Verify Storage Zone name matches exactly
- [ ] Restart services: `docker-compose restart payload`
- [ ] Check Payload logs: `docker-compose logs payload | grep -i bunny`
- [ ] Test API key with curl:
  ```bash
  curl -X PUT \
    -H "AccessKey: your-api-key" \
    -d "test" \
    https://storage.bunnycdn.com/your-zone/test.txt
  ```
- [ ] Expected response: 201 Created

### If CDN URLs Don't Work

- [ ] Verify Pull Zone is connected to Storage Zone
- [ ] Check CDN hostname is correct in `.env`
- [ ] Ensure `https://` is included in `BUNNY_CDN_URL`
- [ ] Wait 1-2 minutes for CDN propagation
- [ ] Test direct storage URL first
- [ ] Check Pull Zone status in Bunny Dashboard
- [ ] Verify file actually exists in Storage Zone

### If Files Aren't Syncing Between Projects

- [ ] Verify both projects use same `BUNNY_STORAGE_ZONE`
- [ ] Verify both projects use same `BUNNY_API_KEY`
- [ ] Check files are actually in Bunny Storage (not just local)
- [ ] Verify Pull Zone is same for both projects
- [ ] Check filename matches exactly (including timestamp/random parts)

## Documentation References

### Quick Links
- **Setup Summary**: `/BUNNY_CDN_SETUP_SUMMARY.md`
- **Full Implementation**: `/payload/BUNNY_CDN_IMPLEMENTATION.md`
- **API Reference**: `/payload/src/lib/BUNNY_STORAGE.md`
- **Sync Guide**: `/payload/BUNNY_CDN_SYNC.md`
- **This Checklist**: `/docs/BUNNY_CDN_CHECKLIST.md`

### Environment Templates
- **Root**: `/.env.example`
- **Payload**: `/payload/.env.example`

### Code Files
- **Plugin**: `/payload/src/lib/bunnyStorage.ts`
- **Config**: `/payload/src/payload.config.ts`
- **Media Collection**: `/payload/src/collections/Media.ts`

## Success Criteria

Configuration is successful when:

- [x] **Code**: Plugin implemented in `/payload/src/lib/bunnyStorage.ts`
- [x] **Config**: Plugin registered in `/payload/src/payload.config.ts`
- [x] **Media**: Collection has `upload: true` enabled
- [x] **Docs**: All documentation files created
- [ ] **Credentials**: Bunny account created and credentials obtained
- [ ] **Environment**: `.env` configured with valid credentials
- [ ] **Enable**: `BUNNY_STORAGE_ENABLED=true` set
- [ ] **Test**: Test upload succeeds
- [ ] **Verify**: File appears in Bunny Storage Zone
- [ ] **CDN**: File accessible via CDN URL

**Current Status**: ✅ Configuration complete, ⏳ Waiting for credentials

## Post-Setup Tasks

### After First Successful Upload
- [ ] Delete test image from Bunny (if desired)
- [ ] Document actual Storage Zone name for team
- [ ] Document CDN URL pattern for team
- [ ] Update production deployment docs
- [ ] Consider enabling signed URLs for private files
- [ ] Set up monitoring/alerting for errors

### Production Deployment
- [ ] Use production Bunny credentials (separate from dev)
- [ ] Enable all recommended security features
- [ ] Set up billing alerts
- [ ] Document recovery procedures
- [ ] Test disaster recovery (delete and restore)
- [ ] Monitor costs after first month

## Cost Monitoring

### Monthly Review
- [ ] Check Bunny billing dashboard
- [ ] Storage used: _____ GB @ $0.01/GB = $____
- [ ] Bandwidth used: _____ GB @ $0.01-0.05/GB = $____
- [ ] Total cost: $____
- [ ] Compare to budget
- [ ] Review usage patterns
- [ ] Optimize if needed (e.g., image compression, cleanup old files)

## Support Contacts

### If Issues Arise
- **Bunny Support**: support@bunny.net
- **Bunny Docs**: https://docs.bunny.net
- **Bunny Status**: https://status.bunny.net
- **Internal Docs**: See Documentation References above

---

**Version**: 1.0
**Last Updated**: 2025-12-01
**Status**: Ready for credential configuration
