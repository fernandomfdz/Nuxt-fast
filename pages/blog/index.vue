<template>
  <div class="min-h-screen bg-base-100">
    <!-- Hero Section Compacto con Artículo Destacado -->
    <section class="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Contenido del Hero -->
          <div class="text-center lg:text-left">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-base-content">
              Blog de <span class="text-primary">NuxtFast</span>
            </h1>
            <p class="text-lg md:text-xl text-base-content/80 mb-8 leading-relaxed">
              Descubre las últimas tendencias en desarrollo web, tutoriales paso a paso y las mejores prácticas para crear aplicaciones modernas con Nuxt.js
            </p>
            <div class="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-base-content/60">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:document-text" class="w-4 h-4" />
                <span>{{ totalArticles }} artículos</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="heroicons:tag" class="w-4 h-4" />
                <span>{{ totalCategories }} categorías</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="heroicons:clock" class="w-4 h-4" />
                <span>Actualizado semanalmente</span>
              </div>
            </div>
          </div>

          <!-- Artículo Destacado -->
          <div v-if="featuredArticle" class="lg:pl-8">
            <BlogCardFeatured :article="featuredArticle" />
          </div>
        </div>
      </div>
    </section>

    <!-- Filtros por Categoría -->
    <section class="py-8 bg-base-200/30 border-b border-base-300">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            class="btn btn-sm"
            :class="selectedCategory === null ? 'btn-primary' : 'btn-ghost'"
            @click="selectCategory(null)"
          >
            <Icon name="heroicons:squares-2x2" class="w-4 h-4 mr-1" />
            Todos
            <span class="badge badge-sm ml-2">{{ totalArticles }}</span>
          </button>
          
          <button
            v-for="category in categories"
            :key="category.slug"
            class="btn btn-sm"
            :class="selectedCategory === category.slug ? 'btn-primary' : 'btn-ghost'"
            @click="selectCategory(category.slug)"
          >
            <Icon :name="getCategoryIcon(category.slug)" class="w-4 h-4 mr-1" />
            {{ category.titleShort || category.title }}
            <span class="badge badge-sm ml-2">{{ getArticleCountByCategory(category.slug) }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="py-16 md:py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-4">
            {{ selectedCategory ? `Artículos de ${getCategoryName(selectedCategory)}` : 'Últimos Artículos' }}
          </h2>
          <p class="text-lg text-base-content/70">
            {{ selectedCategory ? `Explora contenido sobre ${getCategoryName(selectedCategory).toLowerCase()}` : 'Explora nuestro contenido más reciente' }}
          </p>
        </div>

        <div v-if="filteredArticlesToDisplay.length > 0" class="grid gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <BlogCardArticle
            v-for="article in filteredArticlesToDisplay"
            :key="article.slug"
            :article="article"
            class="transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div v-else class="text-center py-16">
          <Icon name="heroicons:document-text" class="w-16 h-16 text-base-content/30 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-base-content mb-2">
            {{ selectedCategory ? 'No hay artículos en esta categoría' : 'No hay artículos disponibles' }}
          </h3>
          <p class="text-base-content/60">
            {{ selectedCategory ? 'Prueba con otra categoría o vuelve pronto para más contenido.' : 'Estamos trabajando en contenido increíble. ¡Vuelve pronto!' }}
          </p>
          <button 
            v-if="selectedCategory"
            class="btn btn-primary mt-4"
            @click="selectCategory(null)"
          >
            Ver todos los artículos
          </button>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreArticles" class="text-center mt-12">
          <button 
            class="btn btn-primary btn-lg"
            :class="{ 'loading': isLoadingMore }"
            @click="loadMoreArticles"
          >
            <Icon v-if="!isLoadingMore" name="heroicons:arrow-down" class="w-5 h-5 mr-2" />
            {{ isLoadingMore ? 'Cargando...' : 'Ver Más Artículos' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 md:py-20 bg-base-200/50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Explora por Categorías
          </h2>
          <p class="text-lg text-base-content/70">
            Encuentra el contenido que más te interesa
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          <BlogCardCategory
            v-for="category in categories"
            :key="category.slug"
            :category="category"
            :article-count="getArticleCountByCategory(category.slug)"
          />
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 md:py-20 bg-primary/5">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <Icon name="heroicons:envelope" class="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Mantente Actualizado
          </h2>
          <p class="text-lg text-base-content/70 mb-8">
            Recibe los últimos artículos y tutoriales directamente en tu bandeja de entrada
          </p>
          <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              v-model="newsletterEmail" 
              type="email" 
              placeholder="tu@email.com"
              class="input input-bordered flex-1"
            >
            <button class="btn btn-primary">
              Suscribirse
            </button>
          </div>
          <p class="text-sm text-base-content/60 mt-4">
            Sin spam. Cancela cuando quieras.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useBlog } from '~/composables/useBlog'

definePageMeta({
  layout: 'blog'
})

// SEO
useHead({
  title: 'Blog - NuxtFast',
  meta: [
    {
      name: 'description',
      content: 'Descubre las últimas tendencias en desarrollo web, tutoriales paso a paso y las mejores prácticas para crear aplicaciones modernas con Nuxt.js'
    },
    {
      property: 'og:title',
      content: 'Blog - NuxtFast'
    },
    {
      property: 'og:description',
      content: 'Descubre las últimas tendencias en desarrollo web, tutoriales paso a paso y las mejores prácticas para crear aplicaciones modernas con Nuxt.js'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

const { articles, getCategories } = useBlog()

// Estado reactivo
const articlesPerPage = 6
const currentPage = ref(1)
const isLoadingMore = ref(false)
const newsletterEmail = ref('')
const selectedCategory = ref<string | null>(null)

// Obtener categorías
const { data: categoriesData } = await useAsyncData('categories', () => getCategories())
const categories = computed(() => categoriesData.value || [])


// Procesar artículos con datos por defecto
const processedArticles = computed(() => {
  const articlesList = articles.value || []
  
  return articlesList.map(article => ({
    ...article,
    // Generar datos por defecto si no existen
    publishedAt: article.publishedAt || new Date().toISOString().split('T')[0],
    author: article.author || {
      slug: 'default',
      name: 'Equipo NuxtFast',
      job: 'Desarrolladores',
      description: 'El equipo de desarrollo de NuxtFast',
      avatar: 'https://picsum.photos/100/100?random=99',
      socials: []
    },
    // Asegurar que las categorías estén enriquecidas
    categories: article.categories?.length ? article.categories : [{
      slug: 'general',
      title: 'General',
      titleShort: 'General',
      description: 'Artículos generales sobre desarrollo',
      descriptionShort: 'Artículos generales'
    }],
    image: article.image || {
      src: `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}`,
      urlRelative: `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}`,
      alt: article.title || 'Imagen del artículo'
    },
    description: article.description || 'Descubre más sobre este interesante tema en nuestro blog.'
  }))
})

// Artículos ordenados por fecha (más recientes primero)
const sortedArticles = computed(() => {
  return [...processedArticles.value]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
})

// Artículo destacado (el más reciente)
const featuredArticle = computed(() => sortedArticles.value[0] || null)

// Artículos filtrados por categoría
const filteredArticles = computed(() => {
  const articles = sortedArticles.value.slice(1) // Excluir el destacado
  
  if (!selectedCategory.value) {
    return articles
  }
  
  return articles.filter(article => 
    article.categories?.some(cat => cat.slug === selectedCategory.value)
  )
})

// Artículos para mostrar con paginación
const filteredArticlesToDisplay = computed(() => {
  const endIndex = currentPage.value * articlesPerPage
  return filteredArticles.value.slice(0, endIndex)
})

// Verificar si hay más artículos
const hasMoreArticles = computed(() => {
  return currentPage.value * articlesPerPage < filteredArticles.value.length
})

// Estadísticas
const totalArticles = computed(() => processedArticles.value.length)
const totalCategories = computed(() => categories.value.length)

// Función para seleccionar categoría
const selectCategory = (categorySlug: string | null) => {
  selectedCategory.value = categorySlug
  currentPage.value = 1 // Resetear paginación
}

// Función para obtener el nombre de la categoría
const getCategoryName = (categorySlug: string) => {
  const category = categories.value.find(cat => cat.slug === categorySlug)
  return category?.title || categorySlug
}

// Función para obtener icono de categoría
const getCategoryIcon = (categorySlug: string) => {
  const iconMap: Record<string, string> = {
    'feature': 'heroicons:star',
    'tutorial': 'heroicons:academic-cap',
    'news': 'heroicons:newspaper',
    'guide': 'heroicons:book-open',
    'tips': 'heroicons:light-bulb',
    'review': 'heroicons:chat-bubble-left-right',
    'general': 'heroicons:document-text',
    'tech': 'heroicons:cpu-chip',
    'design': 'heroicons:paint-brush',
    'development': 'heroicons:code-bracket'
  }
  return iconMap[categorySlug] || 'heroicons:tag'
}

// Función para cargar más artículos
const loadMoreArticles = async () => {
  isLoadingMore.value = true
  await new Promise(resolve => setTimeout(resolve, 500)) // Simular carga
  currentPage.value++
  isLoadingMore.value = false
}

// Función para obtener el número de artículos por categoría
const getArticleCountByCategory = (categorySlug: string) => {
  const count = processedArticles.value.filter(article => {
    // Verificar si el artículo tiene categorías
    if (!article.categories || !Array.isArray(article.categories)) {
      return false
    }
    
    // Buscar si alguna categoría coincide
    return article.categories.some(cat => {
      // Manejar tanto objetos con slug como strings
      const catSlug = typeof cat === 'string' ? cat : cat?.slug
      return catSlug === categorySlug
    })
  }).length
  
  return count
}

// Resetear paginación cuando cambia la categoría
watch(selectedCategory, () => {
  currentPage.value = 1
})
</script> 