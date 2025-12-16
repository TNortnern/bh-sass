<template>
  <div class="embed-layout min-h-screen bg-transparent">
    <slot />
  </div>
</template>

<style scoped>
.embed-layout {
  /* Clean layout for embedding - no headers, footers, or chrome */
  isolation: isolate;
}

/* Allow transparent background for iframe embedding */
:deep(body) {
  background: transparent;
}
</style>
