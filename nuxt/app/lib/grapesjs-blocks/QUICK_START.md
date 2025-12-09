# Quick Start Guide

Get started with the GrapesJS Block System in under 5 minutes.

## Installation

No installation needed! The block system is already part of your Nuxt app at:
```
/nuxt/app/lib/grapesjs-blocks/
```

## 1. Basic Usage (3 lines of code)

```typescript
import { initializeBlockSystem } from '~/lib/grapesjs-blocks'

const editor = grapesjs.init({ container: '#gjs' })
const blockSystem = await initializeBlockSystem(editor)
```

That's it! You now have 350+ blocks available with lazy loading.

## 2. Load Categories

```typescript
// Load hero blocks (loads on demand)
blockSystem.loadCategory('hero')

// Load more categories
blockSystem.loadCategory('features')
blockSystem.loadCategory('pricing')
blockSystem.loadCategory('testimonials')
```

## 3. Search Blocks

```typescript
// Search with debouncing
blockSystem.search('hero', (results) => {
  console.log(`Found ${results.length} blocks`)
})
```

## 4. Check Performance

```typescript
const stats = blockSystem.getCacheStats()
console.log('Loaded:', stats.loadedBlocks, '/', stats.totalBlocks)
// Loaded: 75 / 350 (78% memory saved!)
```

## Complete Example

```typescript
// composables/useWebsiteBuilder.ts
export const useWebsiteBuilder = () => {
  const editor = ref<Editor | null>(null)
  const blockSystem = ref<any>(null)

  const init = async () => {
    // Initialize GrapesJS
    const gjs = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      fromElement: true,
    })

    // Initialize block system
    const blocks = await initializeBlockSystem(gjs)

    // Load default category
    blocks.loadCategory('hero')

    editor.value = gjs
    blockSystem.value = blocks

    console.log('Total blocks:', blocks.getTotalBlockCount())
  }

  onMounted(() => {
    init()
  })

  return {
    editor,
    blockSystem,
  }
}
```

## In Your Vue Component

```vue
<template>
  <div class="website-builder">
    <!-- Search -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search blocks..."
      @input="handleSearch"
    />

    <!-- Category tabs -->
    <div class="categories">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="loadCategory(cat.id)"
      >
        <i :class="cat.icon" />
        {{ cat.label }}
      </button>
    </div>

    <!-- GrapesJS Editor -->
    <div id="gjs"></div>
  </div>
</template>

<script setup lang="ts">
const { editor, blockSystem } = useWebsiteBuilder()
const searchQuery = ref('')

const categories = getCategories()

const handleSearch = useDebounceFn(() => {
  if (searchQuery.value.trim()) {
    blockSystem.value?.search(searchQuery.value, (results) => {
      console.log(`Found ${results.length} blocks`)
    })
  } else {
    blockSystem.value?.restoreAllBlocks()
  }
}, 300)

const loadCategory = (categoryId: string) => {
  blockSystem.value?.loadCategory(categoryId)
}
</script>
```

## Available Categories

- **hero** - Hero Sections (25 blocks)
- **cta** - Call to Action (15 blocks)
- **features** - Features (30 blocks)
- **testimonials** - Testimonials (12 blocks)
- **pricing** - Pricing (18 blocks)
- **products** - Products & Inventory (20 blocks)
- **footer** - Footers (10 blocks)
- **forms** - Form Elements (40 blocks)
- **tables** - Tables (15 blocks)
- **navigation** - Navigation (25 blocks)
- ... and 13 more categories

## Performance Tips

1. **Load on demand** - Don't load all categories at once
   ```typescript
   // Good: Load when user clicks
   blockSystem.loadCategory('hero')

   // Bad: Load everything upfront
   allCategories.forEach(cat => blockSystem.loadCategory(cat.id))
   ```

2. **Use search** - Let users search instead of browsing
   ```typescript
   blockSystem.search('hero', callback)
   ```

3. **Unload when done** - Free memory for large sites
   ```typescript
   blockSystem.unloadCategory('hero')
   ```

## Next Steps

- Read the [full documentation](./README.md)
- Check [example usage](./example-usage.ts)
- Explore [type definitions](./types.ts)

## Troubleshooting

**Blocks not showing?**
```typescript
// Check if loaded
console.log(blockSystem.getLoadedBlockCount())

// Load category
blockSystem.loadCategory('hero')
```

**Performance slow?**
```typescript
// Check stats
console.log(blockSystem.getCacheStats())

// Clear cache
blockSystem.blockManager.clearCache()
```

## Need Help?

Check the full README.md for detailed documentation and advanced usage examples.
