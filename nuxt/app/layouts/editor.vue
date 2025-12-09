<script setup lang="ts">
/**
 * Editor Layout - Fullscreen minimal layout for page builders
 * No sidebar, no header - just the content
 */
</script>

<template>
  <div class="editor-layout min-h-screen bg-gray-950">
    <slot />
  </div>
</template>

<style>
.editor-layout {
  /* Remove any padding/margin from parent containers */
  margin: 0;
  padding: 0;
}

/* Ensure html/body don't add extra space */
html.editor-mode,
html.editor-mode body {
  overflow: hidden;
  margin: 0;
  padding: 0;
}
</style>
