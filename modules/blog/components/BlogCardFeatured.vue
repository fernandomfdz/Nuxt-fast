<template>
  <article class="group relative overflow-hidden rounded-2xl bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500">
    <!-- Imagen de fondo -->
    <div class="relative h-64 md:h-80 lg:h-96 overflow-hidden">
      <NuxtImg
        :src="article.image?.src || defaultImage"
        :alt="article.image?.alt || article.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        loading="eager"
        format="webp"
      />
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
      
      <!-- Categorías flotantes -->
      <div class="absolute top-6 left-6 flex flex-wrap gap-2">
        <BlogBadgeCategory
          v-for="category in article.categories"
          :key="category.slug || category.title"
          :category="category"
          variant="featured"
        />
      </div>
    </div>

    <!-- Contenido superpuesto -->
    <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
      <!-- Metadatos -->
      <div class="flex items-center gap-4 mb-4 text-sm text-white/80">
        <time :datetime="article.publishedAt" class="flex items-center gap-1">
          <Icon name="heroicons:calendar" class="w-4 h-4" />
          {{ formatDate(article.publishedAt) }}
        </time>
        <span class="flex items-center gap-1">
          <Icon name="heroicons:clock" class="w-4 h-4" />
          {{ readingTime }} min lectura
        </span>
      </div>

      <!-- Título -->
      <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
        <NuxtLink
          :to="`/blog/${article.slug}`"
          class="hover:text-primary-300 transition-colors duration-300"
        >
          {{ article.title }}
        </NuxtLink>
      </h2>

      <!-- Descripción -->
      <p class="text-lg text-white/90 mb-6 line-clamp-3 leading-relaxed">
        {{ article.description }}
      </p>

      <!-- Autor y CTA -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="w-12 h-12 rounded-full ring-2 ring-white/20">
              <img
                :src="article.author?.avatar || defaultAvatar"
                :alt="article.author?.name || 'Autor'"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              >
            </div>
          </div>
          <div>
            <p class="font-semibold text-white">
              {{ article.author?.name || 'Autor Anónimo' }}
            </p>
            <p class="text-sm text-white/70">
              {{ article.author?.job || 'Escritor' }}
            </p>
          </div>
        </div>

        <NuxtLink
          :to="`/blog/${article.slug}`"
          class="btn btn-primary btn-sm gap-2 hover:scale-105 transition-transform duration-300"
        >
          Leer más
          <Icon name="heroicons:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>

    <!-- Indicador de artículo destacado -->
    <div class="absolute top-6 right-6">
      <div class="bg-primary text-primary-content px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
        <Icon name="heroicons:star-solid" class="w-3 h-3" />
        Destacado
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">

interface Article {
  slug: string
  title: string
  description?: string
  publishedAt: string
  categories?: Array<{
    slug?: string
    title: string
    titleShort?: string
    description?: string
    descriptionShort?: string
  }>
  author?: {
    slug?: string
    name?: string
    job?: string
    description?: string
    avatar?: string
    socials?: Array<{
      name: string
      icon: string
      url: string
    }>
  }
  image?: {
    src?: string
    urlRelative?: string
    alt?: string
  }
  content?: {
    body?: string
  }
}

const props = defineProps<{
  article: Article
}>()

const { formatDate } = useBlog()

// Valores por defecto
const defaultImage = `https://picsum.photos/1200/600?random=${Math.floor(Math.random() * 100)}`
const defaultAvatar = 'https://picsum.photos/100/100?random=99'

// Calcular tiempo de lectura estimado
const readingTime = computed(() => {
  const wordsPerMinute = 200
  const content = props.article.content?.body || props.article.description || ''
  const wordCount = content.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 