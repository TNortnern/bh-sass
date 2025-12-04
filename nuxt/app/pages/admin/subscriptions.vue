<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { data: subscriptions, pending } = useLazyFetch('/v1/admin/subscriptions', {
  credentials: 'include'
})
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Subscriptions</h1>
        <p class="page-description">Manage platform subscriptions and billing</p>
      </div>
    </div>

    <div v-if="pending" class="loading-state">
      <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
    </div>

    <div v-else class="placeholder">
      <UIcon name="i-lucide-credit-card" class="placeholder-icon" />
      <p class="placeholder-text">Subscription management coming soon</p>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  padding: 2rem;
  max-width: 1920px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.03em;
  margin: 0;
}

.page-description {
  font-size: 0.9375rem;
  color: #737373;
  margin: 0.5rem 0 0;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 4rem;
}

.placeholder-icon {
  font-size: 4rem;
  color: #404040;
  margin-bottom: 1rem;
}

.placeholder-text {
  font-size: 1.25rem;
  color: #737373;
  margin: 0;
}
</style>
