<script setup lang="ts">
import { ref } from 'vue'

// Provide ripple directive globally
const createRipple = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const circle = document.createElement('span')
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  const rect = button.getBoundingClientRect()
  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - rect.left - radius}px`
  circle.style.top = `${event.clientY - rect.top - radius}px`
  circle.classList.add('ripple-effect')

  const existingRipple = button.querySelector('.ripple-effect')
  if (existingRipple) {
    existingRipple.remove()
  }

  button.appendChild(circle)
}

// Make ripple function available globally
if (import.meta.client) {
  window.createRipple = createRipple
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Material Design Ripple Effect */
.ripple-effect {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms linear;
  background-color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Apply to buttons with ripple class */
.btn-ripple {
  position: relative;
  overflow: hidden;
}
</style>
