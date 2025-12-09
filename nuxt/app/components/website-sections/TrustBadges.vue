<script setup lang="ts">
interface Badge {
  id: string
  icon: string
  title: string
  description: string
}

interface Props {
  data: {
    badges: Badge[]
    layout: 'row' | 'grid'
  }
  editable?: boolean
}

withDefaults(defineProps<Props>(), {
  editable: false
})

const iconMap: Record<string, string> = {
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`
}
</script>

<template>
  <section class="trust-badges">
    <div class="container">
      <div
        class="badges-wrapper"
        :class="{ 'layout-grid': data.layout === 'grid' }"
      >
        <div
          v-for="badge in data.badges"
          :key="badge.id"
          class="badge-item"
        >
          <div
            class="badge-icon"
            v-html="iconMap[badge.icon] || iconMap.check"
          />
          <div class="badge-content">
            <h3 class="badge-title">
              {{ badge.title }}
            </h3>
            <p class="badge-description">
              {{ badge.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust-badges {
  padding: 4rem 0;
  background: #111;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.badges-wrapper {
  display: flex;
  justify-content: center;
  gap: 4rem;
}

.badges-wrapper.layout-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.badge-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  margin-bottom: 1rem;
}

.badge-title {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.375rem;
}

.badge-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  max-width: 200px;
}

@media (max-width: 1024px) {
  .badges-wrapper {
    flex-wrap: wrap;
    gap: 2rem;
  }

  .badges-wrapper.layout-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .badge-item {
    flex: 1 1 calc(50% - 1rem);
    min-width: 200px;
  }
}

@media (max-width: 640px) {
  .trust-badges {
    padding: 3rem 0;
  }

  .badges-wrapper,
  .badges-wrapper.layout-grid {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .badge-item {
    flex: none;
    width: 100%;
  }
}
</style>
