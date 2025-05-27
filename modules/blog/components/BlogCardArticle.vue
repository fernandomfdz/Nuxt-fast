<template>
  <article class="relative not-only:group bg-base-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-base-300">
    <!-- Imagen del artículo -->
    <div class="relative h-48 overflow-hidden">
      <NuxtImg
        :src="article.image?.src || defaultImage"
        :alt="article.image?.alt || article.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        format="webp"
      />
      <!-- Overlay sutil -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      
      <!-- Categorías -->
      <div class="absolute top-3 left-3 flex flex-wrap gap-1">
        <BlogBadgeCategory
          v-for="category in article.categories?.slice(0, 2)"
          :key="category.slug || category.title"
          :category="category"
          variant="compact"
        />
      </div>

      <!-- Tiempo de lectura -->
      <div class="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
        {{ readingTime }} min
      </div>
    </div>

    <!-- Contenido de la tarjeta -->
    <div class="p-6">
      <!-- Metadatos -->
      <div class="flex items-center gap-3 mb-3 text-sm text-base-content/70">
        <time :datetime="article.publishedAt" class="flex items-center gap-1">
          <Icon name="heroicons:calendar" class="w-4 h-4" />
          {{ formatDate(article.publishedAt) }}
        </time>
        <span v-if="article.author?.name" class="flex items-center gap-1">
          <Icon name="heroicons:user" class="w-4 h-4" />
          {{ article.author.name }}
        </span>
      </div>

      <!-- Título -->
      <h3 class="text-xl font-bold text-base-content mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
        <NuxtLink
          :to="`/blog/${article.slug}`"
          class="line-clamp-2"
        >
          {{ article.title }}
        </NuxtLink>
      </h3>

      <!-- Descripción -->
      <p class="text-base-content/70 mb-4 line-clamp-3 leading-relaxed">
        {{ article.description || 'Descubre más sobre este interesante tema en nuestro blog.' }}
      </p>

      <!-- Footer de la tarjeta -->
      <div class="flex items-center justify-between">
        <!-- Información del autor -->
        <div class="flex items-center gap-2">
          <div class="avatar">
            <div class="w-8 h-8 rounded-full">
              <img
                :src="article.author?.avatar || defaultAvatar"
                :alt="article.author?.name || 'Autor'"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              >
            </div>
          </div>
          <div class="text-sm">
            <p class="font-medium text-base-content">
              {{ article.author?.name || 'Autor Anónimo' }}
            </p>
            <p class="text-base-content/50 text-xs">
              {{ article.author?.job || 'Escritor' }}
            </p>
          </div>
        </div>

        <!-- Botón de leer más -->
        <NuxtLink
          :to="`/blog/${article.slug}`"
          class="btn btn-ghost btn-sm gap-1 text-primary hover:bg-primary hover:text-primary-content transition-all duration-300"
        >
          Leer
          <Icon name="heroicons:arrow-right" class="w-3 h-3" />
        </NuxtLink>
      </div>
    </div>

    <!-- Indicador de hover -->
    <div class="absolute inset-0 border-2 border-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"/>
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
const defaultImage = `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 100)}`
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>