<template>
  <div class="min-h-screen bg-base-100">
    <article class="container mx-auto px-4 py-12">
      <!-- Header del artículo -->
      <header class="max-w-4xl mx-auto text-center mb-16">
        <!-- Categorías -->
        <div v-if="finalArticle.categories?.length" class="flex justify-center flex-wrap gap-2 mb-6">
          <BlogBadgeCategory
            v-for="category in finalArticle.categories"
            :key="category.slug || category.title"
            :category="category"
            variant="large"
          />
        </div>

        <!-- Título principal -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-base-content leading-tight">
          {{ finalArticle.title }}
        </h1>

        <!-- Descripción -->
        <p v-if="finalArticle.description" class="text-xl md:text-2xl text-base-content/80 mb-8 leading-relaxed max-w-3xl mx-auto">
          {{ finalArticle.description }}
        </p>

        <!-- Metadatos del artículo -->
        <div class="flex flex-wrap justify-center items-center gap-6 text-base-content/60 mb-8">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:calendar" class="w-5 h-5" />
            <time :datetime="finalArticle.publishedAt">
              {{ formatDate(finalArticle.publishedAt) }}
            </time>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="heroicons:clock" class="w-5 h-5" />
            <span>{{ readingTime }} min de lectura</span>
          </div>
          <div v-if="finalArticle.author?.name" class="flex items-center gap-2">
            <Icon name="heroicons:user" class="w-5 h-5" />
            <span>Por {{ finalArticle.author.name }}</span>
          </div>
        </div>

        <!-- Información del autor -->
        <div v-if="finalArticle.author" class="flex items-center justify-center gap-4 p-6 bg-base-200/50 rounded-2xl max-w-md mx-auto">
          <div v-if="finalArticle.author.avatar" class="avatar">
            <div class="w-16 h-16 rounded-full ring-2 ring-primary/20">
              <img
                :src="finalArticle.author.avatar"
                :alt="finalArticle.author.name || 'Author'"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              >
            </div>
          </div>
          
          <div class="text-left">
            <NuxtLink
              v-if="finalArticle.author.slug"
              :to="`/blog/author/${finalArticle.author.slug}`"
              class="text-lg font-semibold hover:text-primary transition-colors duration-300 text-base-content"
            >
              {{ finalArticle.author.name }}
            </NuxtLink>
            <span v-else class="text-lg font-semibold text-base-content">
              {{ finalArticle.author.name }}
            </span>
            
            <p v-if="finalArticle.author.job" class="text-base-content/70 text-sm">
              {{ finalArticle.author.job }}
            </p>
          </div>
        </div>
      </header>

      <!-- Imagen destacada -->
      <div v-if="finalArticle.image?.src" class="max-w-5xl mx-auto mb-16">
        <div class="relative overflow-hidden rounded-2xl shadow-2xl">
          <NuxtImg
            :src="finalArticle.image.src"
            :alt="finalArticle.image.alt || finalArticle.title"
            class="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            format="webp"
            loading="eager"
          />
        </div>
      </div>

      <!-- Contenido del artículo -->
      <div class="max-w-4xl mx-auto">
        <div class="prose prose-lg md:prose-xl max-w-none">
          <ContentRenderer :value="article" />
        </div>
      </div>

      <!-- Footer del artículo -->
      <footer class="max-w-4xl mx-auto mt-16 pt-12 border-t border-base-content/10">
        <!-- Tags/Categorías -->
        <div v-if="finalArticle.categories?.length" class="mb-8">
          <h3 class="text-lg font-semibold text-base-content mb-4">Categorías relacionadas:</h3>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="category in finalArticle.categories"
              :key="category.slug || category.title"
              :to="`/blog/category/${category.slug}`"
              class="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm font-medium transition-colors duration-300"
            >
              <Icon :name="getCategoryIcon(category.slug)" class="w-4 h-4" />
              {{ category.titleShort || category.title }}
            </NuxtLink>
          </div>
        </div>

        <!-- Información del autor expandida -->
        <div v-if="finalArticle.author" class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 mb-12">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div v-if="finalArticle.author.avatar" class="avatar">
              <div class="w-20 h-20 rounded-full ring-4 ring-primary/20">
                <img
                  :src="finalArticle.author.avatar"
                  :alt="finalArticle.author.name || 'Author'"
                  class="w-full h-full object-cover"
                  referrerpolicy="no-referrer"
                >
              </div>
            </div>
            
            <div class="flex-1 text-center md:text-left">
              <h3 class="text-xl font-bold text-base-content mb-2">
                Sobre {{ finalArticle.author.name }}
              </h3>
              <p v-if="finalArticle.author.job" class="text-primary font-medium mb-3">
                {{ finalArticle.author.job }}
              </p>
              <p v-if="finalArticle.author.description" class="text-base-content/80 leading-relaxed mb-4">
                {{ finalArticle.author.description }}
              </p>
              
              <!-- Redes sociales del autor -->
              <div v-if="finalArticle.author.socials?.length" class="flex justify-center md:justify-start gap-3">
                <a
                  v-for="social in finalArticle.author.socials"
                  :key="social.name"
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-ghost btn-sm btn-circle hover:btn-primary transition-all duration-300"
                  :title="`Seguir en ${social.name}`"
                >
                  <Icon :name="social.icon" class="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Artículos relacionados -->
        <div v-if="relatedArticles.length > 0" class="mb-12">
          <h3 class="text-2xl font-bold text-base-content mb-6 text-center">
            Artículos Relacionados
          </h3>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BlogCardArticle
              v-for="relatedArticle in relatedArticles"
              :key="relatedArticle.slug"
              :article="relatedArticle"
              class="transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <!-- Navegación entre artículos -->
        <div class="pt-8 border-t border-base-content/10">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-base-content mb-6">
              ¿Te gustó este artículo?
            </h3>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink
                to="/blog"
                class="btn btn-primary gap-2"
              >
                <Icon name="heroicons:arrow-left" class="w-4 h-4" />
                Ver más artículos
              </NuxtLink>
              <button 
                class="btn btn-outline gap-2"
                @click="openShareModal"
              >
                <Icon name="heroicons:share" class="w-4 h-4" />
                Compartir artículo
              </button>
            </div>
          </div>
        </div>
      </footer>
    </article>

    <!-- Modal de compartir -->
    <ShareModal
      :is-open="isShareModalOpen"
      :title="finalArticle.title"
      :text="shareText"
      :url="shareUrl"
      @close="closeShareModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'blog'
})

const route = useRoute()
const { getArticleBySlug, getRelatedArticles, formatDate } = useBlog()

const article = await getArticleBySlug(route.params.articleId as string)

if (!article) {
  throw createError({
    statusCode: 404,
    message: 'Artículo no encontrado'
  })
}

// Estado para el modal de compartir
const isShareModalOpen = ref(false)

// Procesar artículo con datos por defecto
const processedArticle = computed(() => ({
  ...article,
  publishedAt: article.publishedAt || new Date().toISOString().split('T')[0],
  author: article.author || {
    slug: 'default',
    name: 'Equipo NuxtFast',
    job: 'Desarrolladores',
    description: 'El equipo de desarrollo de NuxtFast, comprometido con crear contenido de calidad para la comunidad.',
    avatar: 'https://picsum.photos/100/100?random=99',
    socials: []
  },
  categories: article.categories?.length ? article.categories : [{
    slug: 'general',
    title: 'General',
    titleShort: 'General',
    description: 'Artículos generales sobre desarrollo',
    descriptionShort: 'Artículos generales'
  }],
  image: article.image || {
    src: `https://picsum.photos/1200/600?random=${Math.floor(Math.random() * 100)}`,
    urlRelative: `https://picsum.photos/1200/600?random=${Math.floor(Math.random() * 100)}`,
    alt: article.title || 'Imagen del artículo'
  },
  description: article.description || 'Descubre más sobre este interesante tema en nuestro blog.'
}))

// Usar el artículo procesado
const finalArticle = processedArticle.value

// Obtener artículos relacionados
const { data: relatedArticlesData } = await useAsyncData(`related-${finalArticle.slug}`, () => 
  getRelatedArticles(finalArticle, 3)
)
const relatedArticles = computed(() => relatedArticlesData.value || [])

// Calcular tiempo de lectura
const readingTime = computed(() => {
  const wordsPerMinute = 200
  const content = finalArticle.content?.body || finalArticle.description || ''
  const wordCount = content.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
})

// Función para obtener icono de categoría
const getCategoryIcon = (categorySlug: string) => {
  const iconMap: Record<string, string> = {
    'feature': 'heroicons:star',
    'tutorial': 'heroicons:academic-cap',
    'development': 'heroicons:code-bracket',
    'daisyui': 'heroicons:paint-brush',
    'nuxt': 'heroicons:bolt',
    'auth': 'heroicons:shield-check',
    'database': 'heroicons:circle-stack',
    'general': 'heroicons:document-text'
  }
  return iconMap[categorySlug] || 'heroicons:tag'
}

// Datos para compartir
const shareUrl = computed(() => {
  if (import.meta.client) {
    return window.location.href
  }
  return `${useRuntimeConfig().public.siteUrl || 'https://nuxtfast.com'}/blog/${route.params.articleId}`
})

const shareText = computed(() => {
  return `${finalArticle.description} - Leído en NuxtFast`
})

// Funciones para el modal de compartir
const openShareModal = () => {
  isShareModalOpen.value = true
}

const closeShareModal = () => {
  isShareModalOpen.value = false
}

// SEO mejorado
useHead({
  title: finalArticle.title,
  meta: [
    {
      name: 'description',
      content: finalArticle.description
    },
    {
      property: 'og:title',
      content: finalArticle.title
    },
    {
      property: 'og:description',
      content: finalArticle.description
    },
    {
      property: 'og:url',
      content: shareUrl.value
    },
    {
      property: 'og:image',
      content: finalArticle.image.src
    },
    {
      property: 'og:locale',
      content: 'es_ES'
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      property: 'article:author',
      content: finalArticle.author.name
    },
    {
      property: 'article:published_time',
      content: finalArticle.publishedAt
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: finalArticle.title
    },
    {
      name: 'twitter:description',
      content: finalArticle.description
    },
    {
      name: 'twitter:image',
      content: finalArticle.image.src
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: shareUrl.value
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: finalArticle.title,
        description: finalArticle.description,
        image: finalArticle.image.src,
        datePublished: finalArticle.publishedAt,
        dateModified: finalArticle.publishedAt,
        author: {
          '@type': 'Person',
          name: finalArticle.author.name,
          jobTitle: finalArticle.author.job,
          description: finalArticle.author.description
        },
        publisher: {
          '@type': 'Organization',
          name: 'NuxtFast',
          logo: {
            '@type': 'ImageObject',
            url: '/logo.png'
          }
        }
      })
    }
  ]
})
</script>