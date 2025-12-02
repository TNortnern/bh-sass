# Bunny CDN Storage Adapter for Payload CMS

This custom storage adapter integrates Bunny CDN with Payload CMS for efficient file storage and delivery.

## Features

- Upload files to Bunny Storage Zone
- Serve files via Bunny CDN for fast global delivery
- Automatic file naming with unique identifiers
- Delete operations for cleanup
- Environment-based configuration
- Graceful fallback to local storage if disabled
- Support for multiple collections

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Enable/disable Bunny CDN storage (default: false)
BUNNY_STORAGE_ENABLED=true

# Bunny Storage Zone name (required)
BUNNY_STORAGE_ZONE=your-storage-zone

# Bunny Storage API key (required)
BUNNY_API_KEY=your-api-key-here

# Bunny CDN URL (required)
BUNNY_CDN_URL=https://your-zone.b-cdn.net

# Optional: Collections to use Bunny storage (default: media)
BUNNY_STORAGE_COLLECTIONS=media,assets
```

### Payload Config Setup

The adapter is already integrated in `payload.config.ts`:

```typescript
import { bunnyStoragePlugin, createBunnyStorageFromEnv } from './lib/bunnyStorage'

export default buildConfig({
  // ... other config
  plugins: [
    bunnyStoragePlugin(createBunnyStorageFromEnv()),
  ],
})
```

## How It Works

1. **File Upload**: When a file is uploaded to Payload, it's initially stored locally
2. **Bunny Upload**: The `afterChange` hook uploads the file to Bunny Storage
3. **URL Update**: The document is updated with the Bunny CDN URL
4. **File Access**: Files are served from Bunny CDN via the `url` field
5. **Deletion**: When a document is deleted, the file is removed from Bunny Storage

## API Reference

### `bunnyStoragePlugin(config)`

Creates a Payload plugin for Bunny CDN storage.

**Parameters:**
- `config` (BunnyStorageConfig): Storage configuration

**Returns:** Payload Plugin

### `createBunnyStorageFromEnv()`

Helper function to create config from environment variables.

**Returns:** BunnyStorageConfig

### BunnyStorageConfig Interface

```typescript
interface BunnyStorageConfig {
  storageZone: string        // Bunny Storage Zone name
  apiKey: string            // Bunny Storage API key
  cdnUrl: string            // Bunny CDN pull zone URL
  storageApiUrl?: string    // Optional: Custom storage API endpoint
  collections?: string[]    // Optional: Collections to enable (default: ['media'])
  enabled?: boolean         // Optional: Enable/disable (default: false)
}
```

## Getting Bunny CDN Credentials

1. **Sign up** at [bunny.net](https://bunny.net)
2. **Create a Storage Zone**:
   - Go to Storage > Add Storage Zone
   - Choose a region close to your users
   - Note the Storage Zone name
3. **Get API Key**:
   - Go to Storage > Manage > FTP & API Access
   - Copy the Password (this is your API key)
4. **Create Pull Zone** (CDN):
   - Go to Pull Zones > Add Pull Zone
   - Connect it to your Storage Zone
   - Note the CDN hostname (e.g., `your-zone.b-cdn.net`)

## Bunny Storage API Endpoints

- **Upload**: `PUT https://storage.bunnycdn.com/{storageZone}/{path}/{fileName}`
- **Delete**: `DELETE https://storage.bunnycdn.com/{storageZone}/{path}/{fileName}`
- **Header**: `AccessKey: {your-api-key}`

## File Naming

Files are renamed with a unique identifier to prevent conflicts:

```
original-filename-{timestamp}-{random}.ext
```

Example: `bounce-house-1234567890-abc123.jpg`

The original filename is sanitized to remove special characters.

## Error Handling

- If Bunny CDN upload fails, the file remains in local storage
- If Bunny CDN delete fails, the document is still deleted from Payload
- All errors are logged but don't block operations
- This ensures the system continues to work even if Bunny is unavailable

## Local Storage Fallback

By default, Bunny storage is **disabled** (`BUNNY_STORAGE_ENABLED=false`). This means:

- Files are stored locally in development
- No Bunny CDN configuration required to start
- Enable Bunny when you're ready for production

## Testing

To test the Bunny integration:

1. Set up your Bunny credentials in `.env`
2. Set `BUNNY_STORAGE_ENABLED=true`
3. Upload a file through Payload admin
4. Check the file appears in your Bunny Storage Zone
5. Verify the CDN URL is accessible

## Troubleshooting

### Files not uploading to Bunny

- Check `BUNNY_STORAGE_ENABLED=true` is set
- Verify API key is correct (check Bunny dashboard)
- Ensure Storage Zone name matches exactly
- Check Payload logs for error messages

### CDN URLs not working

- Verify Pull Zone is connected to Storage Zone
- Check CDN URL format: `https://your-zone.b-cdn.net`
- Allow time for CDN propagation (usually instant, but can take minutes)

### Permission errors

- Ensure API key has read/write permissions
- Check Storage Zone access settings

## Cost Optimization

Bunny CDN is very affordable:

- **Storage**: ~$0.01/GB/month
- **Bandwidth**: $0.01-0.05/GB (varies by region)
- **Free tier**: 100GB bandwidth/month

Tips:
- Enable CDN caching headers
- Use image optimization features
- Set appropriate cache TTLs
- Consider regional storage zones

## Security

- API keys are stored in environment variables (never in code)
- Files can be public (CDN) or private (with signed URLs - future feature)
- Consider enabling Bunny's security features:
  - Token authentication
  - Geographic restrictions
  - Rate limiting

## Future Enhancements

Possible improvements:

- [ ] Signed URL support for private files
- [ ] Image optimization via Bunny Optimizer
- [ ] Video streaming support
- [ ] Automatic local file cleanup after upload
- [ ] Retry logic for failed uploads
- [ ] Progress tracking for large files
- [ ] Multi-region support
- [ ] Bunny Purge API integration

## Support

For issues or questions:

- Check Bunny CDN documentation: https://docs.bunny.net
- Review Payload CMS plugin docs: https://payloadcms.com/docs/plugins
- Check application logs for detailed error messages
