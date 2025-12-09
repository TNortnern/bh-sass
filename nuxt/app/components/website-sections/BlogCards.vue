<script setup lang="ts">
interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  author?: {
    name: string
    avatar?: string
  }
  category?: string
  readTime?: string
  link: string
}

interface Props {
  data: {
    headline: string
    subheadline: string
    posts: BlogPost[]
    columns: 2 | 3 | 4
    style: 'cards' | 'minimal' | 'featured'
    showAuthor?: boolean
    showDate?: boolean
    showCategory?: boolean
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

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <section
    class="blog-section"
    :class="[`style-${data.style}`]"
  >
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Blog</span>
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
      </div>

      <!-- Featured Style (first post larger) -->
      <div
        v-if="data.style === 'featured' && data.posts.length > 0"
        class="featured-layout"
      >
        <article class="featured-post">
          <a
            :href="data.posts[0].link"
            class="post-image featured-image"
          >
            <img
              v-if="data.posts[0].image"
              :src="data.posts[0].image"
              :alt="data.posts[0].title"
            >
            <div
              v-else
              class="image-placeholder"
            />
          </a>
          <div class="featured-content">
            <span
              v-if="data.showCategory && data.posts[0].category"
              class="post-category"
            >{{ data.posts[0].category }}</span>
            <h3 class="post-title featured-title">
              <a :href="data.posts[0].link">{{ data.posts[0].title }}</a>
            </h3>
            <p class="post-excerpt featured-excerpt">
              {{ data.posts[0].excerpt }}
            </p>
            <div class="post-meta">
              <div
                v-if="data.showAuthor && data.posts[0].author"
                class="post-author"
              >
                <div class="author-avatar">
                  <img
                    v-if="data.posts[0].author.avatar"
                    :src="data.posts[0].author.avatar"
                    :alt="data.posts[0].author.name"
                  >
                </div>
                <span class="author-name">{{ data.posts[0].author.name }}</span>
              </div>
              <span
                v-if="data.showDate"
                class="post-date"
              >{{ formatDate(data.posts[0].date) }}</span>
              <span
                v-if="data.posts[0].readTime"
                class="read-time"
              >{{ data.posts[0].readTime }}</span>
            </div>
          </div>
        </article>

        <div class="other-posts">
          <article
            v-for="post in data.posts.slice(1)"
            :key="post.id"
            class="post-card compact"
          >
            <a
              :href="post.link"
              class="post-image compact-image"
            >
              <img
                v-if="post.image"
                :src="post.image"
                :alt="post.title"
              >
              <div
                v-else
                class="image-placeholder"
              />
            </a>
            <div class="post-content">
              <span
                v-if="data.showCategory && post.category"
                class="post-category"
              >{{ post.category }}</span>
              <h3 class="post-title">
                <a :href="post.link">{{ post.title }}</a>
              </h3>
              <div class="post-meta">
                <span
                  v-if="data.showDate"
                  class="post-date"
                >{{ formatDate(post.date) }}</span>
                <span
                  v-if="post.readTime"
                  class="read-time"
                >{{ post.readTime }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Grid Layout (cards & minimal) -->
      <div
        v-else
        class="posts-grid"
        :class="[`cols-${data.columns}`]"
      >
        <article
          v-for="post in data.posts"
          :key="post.id"
          class="post-card"
        >
          <a
            :href="post.link"
            class="post-image"
          >
            <img
              v-if="post.image"
              :src="post.image"
              :alt="post.title"
            >
            <div
              v-else
              class="image-placeholder"
            />
          </a>
          <div class="post-content">
            <span
              v-if="data.showCategory && post.category"
              class="post-category"
            >{{ post.category }}</span>
            <h3 class="post-title">
              <a :href="post.link">{{ post.title }}</a>
            </h3>
            <p
              v-if="data.style === 'cards'"
              class="post-excerpt"
            >
              {{ post.excerpt }}
            </p>
            <div class="post-meta">
              <div
                v-if="data.showAuthor && post.author"
                class="post-author"
              >
                <div class="author-avatar">
                  <img
                    v-if="post.author.avatar"
                    :src="post.author.avatar"
                    :alt="post.author.name"
                  >
                </div>
                <span class="author-name">{{ post.author.name }}</span>
              </div>
              <span
                v-if="data.showDate"
                class="post-date"
              >{{ formatDate(post.date) }}</span>
              <span
                v-if="post.readTime"
                class="read-time"
              >{{ post.readTime }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-section {
  padding: 6rem 0;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
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
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: #111;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.section-headline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 8px;
}

.section-subheadline {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 500px;
  margin: 0 auto;
}

.section-subheadline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 4px;
}

/* Posts Grid */
.posts-grid {
  display: grid;
  gap: 2rem;
}

.posts-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.posts-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.posts-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Post Card */
.post-card {
  display: flex;
  flex-direction: column;
}

.post-image {
  display: block;
  aspect-ratio: 16/10;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1.25rem;
  background: #f3f4f6;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-card:hover .post-image img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.post-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #f59e0b;
  margin-bottom: 0.5rem;
}

.post-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.post-title a {
  color: #111;
  text-decoration: none;
  transition: color 0.15s;
}

.post-title a:hover {
  color: #f59e0b;
}

.post-excerpt {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8125rem;
  color: #9ca3af;
  flex-wrap: wrap;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
  color: #374151;
}

.read-time::before {
  content: '·';
  margin-right: 0.5rem;
}

/* Featured Layout */
.featured-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 3rem;
}

.featured-post {
  display: flex;
  flex-direction: column;
}

.featured-image {
  aspect-ratio: 16/9;
  margin-bottom: 1.5rem;
}

.featured-content {
  flex: 1;
}

.featured-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.featured-excerpt {
  font-size: 1rem;
}

.other-posts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card.compact {
  flex-direction: row;
  gap: 1rem;
}

.compact-image {
  width: 120px;
  flex-shrink: 0;
  aspect-ratio: 1;
  margin-bottom: 0;
}

.compact .post-content {
  justify-content: center;
}

.compact .post-title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

/* Minimal Style */
.style-minimal .post-image {
  aspect-ratio: 16/9;
  margin-bottom: 1rem;
}

.style-minimal .post-title {
  font-size: 1rem;
}

/* Cards Style */
.style-cards .post-card {
  background: #f9fafb;
  border-radius: 1rem;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}

.style-cards .post-card:hover {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.style-cards .post-image {
  border-radius: 0;
  margin-bottom: 0;
}

.style-cards .post-content {
  padding: 1.5rem;
}

@media (max-width: 1024px) {
  .posts-grid.cols-3,
  .posts-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .featured-layout {
    grid-template-columns: 1fr;
  }

  .other-posts {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .post-card.compact {
    flex: 1 1 calc(50% - 0.75rem);
  }
}

@media (max-width: 640px) {
  .blog-section {
    padding: 4rem 0;
  }

  .posts-grid.cols-2,
  .posts-grid.cols-3,
  .posts-grid.cols-4 {
    grid-template-columns: 1fr;
  }

  .post-card.compact {
    flex: 1 1 100%;
  }
}
</style>
