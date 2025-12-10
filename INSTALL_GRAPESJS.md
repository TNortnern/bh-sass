# Install GrapesJS Website Builder

## Quick Start (Recommended)

Run the automated installation script:

```bash
cd /Users/tnorthern/Documents/projects/bh-sass
./nuxt/install-grapesjs.sh
```

This will:
1. Install required packages (`grapesjs` and `grapesjs-preset-webpage`)
2. Rebuild the Nuxt container if needed
3. Confirm successful installation

## Manual Installation

If you prefer to install manually:

### Using Docker (Recommended)

```bash
# Install packages
docker compose exec nuxt pnpm add grapesjs grapesjs-preset-webpage

# Rebuild container
docker compose up nuxt --build -d
```

### Using Host pnpm

```bash
cd nuxt
pnpm add grapesjs grapesjs-preset-webpage
```

## Verify Installation

After installation, verify the packages are installed:

```bash
docker compose exec nuxt pnpm list | grep grapesjs
```

You should see:
```
grapesjs 0.21.13
grapesjs-preset-webpage 1.0.3
```

## Access the Website Builder

Once installed and containers are running:

**URL**: http://localhost:3005/app/website/grapesjs-builder

## Documentation

- **Quick Start**: `/nuxt/app/pages/app/website/QUICK_REFERENCE.md`
- **Setup Guide**: `/nuxt/app/pages/app/website/GRAPES_SETUP.md`
- **Architecture**: `/nuxt/app/pages/app/website/ARCHITECTURE.md`
- **Implementation**: `/GRAPESJS_IMPLEMENTATION.md`
- **Files Summary**: `/GRAPESJS_FILES_SUMMARY.md`

## Troubleshooting

### "Command not found: ./nuxt/install-grapesjs.sh"

Make the script executable:
```bash
chmod +x ./nuxt/install-grapesjs.sh
```

### "Module not found: grapesjs"

The packages need to be installed first. Run the installation script or manual steps above.

### Docker container not rebuilding

Force rebuild:
```bash
docker compose up nuxt --build --force-recreate -d
```

### Page shows errors

1. Check packages are installed:
   ```bash
   docker compose exec nuxt pnpm list | grep grapesjs
   ```

2. Check browser console for specific errors

3. Restart containers:
   ```bash
   docker compose restart nuxt
   ```

## What Gets Installed

The following packages will be added to `nuxt/package.json`:

```json
{
  "dependencies": {
    "grapesjs": "^0.21.13",
    "grapesjs-preset-webpage": "^1.0.3"
  }
}
```

These packages provide:
- **grapesjs**: Core website builder framework
- **grapesjs-preset-webpage**: Additional webpage blocks and templates

## Next Steps

After installation:

1. **Access the builder**: http://localhost:3005/app/website/grapesjs-builder
2. **Read the quick reference**: `/nuxt/app/pages/app/website/QUICK_REFERENCE.md`
3. **Start building**: Drag blocks, edit content, save your website
4. **Export HTML**: Use the export button to download your website

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the comprehensive documentation in `/nuxt/app/pages/app/website/`
3. Check GrapesJS official docs: https://grapesjs.com/docs/

---

**Created**: 2025-12-06
**Last Updated**: 2025-12-06
