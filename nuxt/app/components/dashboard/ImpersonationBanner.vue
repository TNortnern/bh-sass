<script setup lang="ts">
const { isImpersonating, impersonatedTenant, stopImpersonation } = useImpersonation()

const handleExitImpersonation = async () => {
  await stopImpersonation()
}
</script>

<template>
  <div
    v-if="isImpersonating"
    class="impersonation-banner"
  >
    <div class="banner-content">
      <div class="banner-left">
        <div class="icon-wrapper">
          <UIcon
            name="i-lucide-eye"
            class="icon"
          />
        </div>
        <div class="text-content">
          <p class="banner-title">
            Impersonation Mode Active
          </p>
          <p class="banner-description">
            You are viewing as <strong>{{ impersonatedTenant?.name || 'Unknown Tenant' }}</strong>
          </p>
        </div>
      </div>
      <div class="banner-right">
        <UButton
          icon="i-lucide-log-out"
          label="Exit Impersonation"
          color="warning"
          variant="solid"
          size="md"
          @click="handleExitImpersonation"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.impersonation-banner {
  position: sticky;
  top: 0;
  z-index: 9999; /* High z-index like Django admin to ensure banner is always visible */
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-bottom: 2px solid #92400e;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.banner-content {
  max-width: 1920px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}

.icon {
  font-size: 1.25rem;
  color: #ffffff;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.banner-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.banner-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
}

.banner-description strong {
  font-weight: 600;
  color: #ffffff;
}

.banner-right {
  flex-shrink: 0;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .banner-content {
    padding: 0.875rem 1rem;
  }

  .icon-wrapper {
    width: 36px;
    height: 36px;
  }

  .icon {
    font-size: 1.125rem;
  }

  .banner-title {
    font-size: 0.8125rem;
  }

  .banner-description {
    font-size: 0.8125rem;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .banner-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .banner-right {
    width: 100%;
  }

  .banner-right button {
    width: 100%;
  }
}
</style>
