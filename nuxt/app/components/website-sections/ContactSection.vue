<script setup lang="ts">
interface Props {
  data: {
    headline: string
    subheadline: string
    phone: string
    email: string
    address: string
    hours: string
    mapEmbed?: string
    showForm: boolean
  }
  editable?: boolean
}

withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<{
  update: [field: string, value: unknown]
}>()

const handleTextUpdate = (field: string, event: Event) => {
  const target = event.target as HTMLElement
  emit('update', field, target.innerText)
}

// Form state (for demo purposes)
const formData = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const handleSubmit = () => {
  // In production, this would submit to an API
  console.log('Form submitted:', formData.value)
}
</script>

<template>
  <section
    id="contact"
    class="contact-section"
  >
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info">
          <span class="section-eyebrow">Contact Us</span>
          <h2
            class="section-headline"
            :contenteditable="editable"
            @blur="handleTextUpdate('headline', $event)"
          >
            {{ data.headline }}
          </h2>
          <p
            class="section-subheadline"
            :contenteditable="editable"
            @blur="handleTextUpdate('subheadline', $event)"
          >
            {{ data.subheadline }}
          </p>

          <div class="info-list">
            <div class="info-item">
              <div class="info-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <div class="info-content">
                <span class="info-label">Phone</span>
                <a
                  :href="`tel:${data.phone}`"
                  class="info-value"
                >{{ data.phone }}</a>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><rect
                  width="20"
                  height="16"
                  x="2"
                  y="4"
                  rx="2"
                /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <div class="info-content">
                <span class="info-label">Email</span>
                <a
                  :href="`mailto:${data.email}`"
                  class="info-value"
                >{{ data.email }}</a>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle
                  cx="12"
                  cy="10"
                  r="3"
                /></svg>
              </div>
              <div class="info-content">
                <span class="info-label">Location</span>
                <span class="info-value">{{ data.address }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><circle
                  cx="12"
                  cy="12"
                  r="10"
                /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div class="info-content">
                <span class="info-label">Hours</span>
                <span class="info-value">{{ data.hours }}</span>
              </div>
            </div>
          </div>

          <div class="social-links">
            <a
              href="#"
              class="social-link"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              ><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a
              href="#"
              class="social-link"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              ><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
          </div>
        </div>

        <div
          v-if="data.showForm"
          class="contact-form-wrapper"
        >
          <form
            class="contact-form"
            @submit.prevent="handleSubmit"
          >
            <div class="form-group">
              <label for="name">Your Name</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="John Doe"
                required
              >
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  placeholder="john@example.com"
                  required
                >
              </div>
              <div class="form-group">
                <label for="phone">Phone</label>
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                >
              </div>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                v-model="formData.message"
                rows="4"
                placeholder="Tell us about your event..."
                required
              />
            </div>
            <button
              type="submit"
              class="submit-button"
            >
              Send Message
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
            </button>
          </form>
        </div>

        <div
          v-else-if="data.mapEmbed"
          class="map-wrapper"
        >
          <iframe
            :src="data.mapEmbed"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  padding: 6rem 0;
  background: #111;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #f59e0b;
  margin-bottom: 0.75rem;
}

.section-headline {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.section-headline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 8px;
}

.section-subheadline {
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.section-subheadline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 4px;
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  padding-top: 0.25rem;
}

.info-label {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1rem;
  color: white;
  text-decoration: none;
}

a.info-value:hover {
  color: #f59e0b;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.social-link {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: #f59e0b;
  transform: translateY(-2px);
}

/* Form */
.contact-form-wrapper {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea {
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #f59e0b;
  background: white;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #111;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.submit-button:hover {
  background: #333;
  transform: translateY(-1px);
}

/* Map */
.map-wrapper {
  border-radius: 1rem;
  overflow: hidden;
  height: 100%;
  min-height: 400px;
}

@media (max-width: 768px) {
  .contact-section {
    padding: 4rem 0;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .contact-form-wrapper {
    padding: 1.5rem;
  }
}
</style>
