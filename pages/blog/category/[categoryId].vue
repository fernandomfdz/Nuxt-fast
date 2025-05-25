<template>
  <div class="container mx-auto px-4 py-12">
    <header class="text-center">
      <h1 class="text-4xl font-bold tracking-tight text-base-content sm:text-5xl">
        {{ category?.title || 'Categoría' }}
      </h1>
      <p v-if="category?.description" class="mt-4 text-lg text-base-content/70">
        {{ category.description }}
      </p>
    </header>

    <main class="mt-12">
      <div v-if="articles.length > 0" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <BlogCardArticle
          v-for="article in articles"
          :key="article.path || article.slug"
          :article="article"
        />
      </div>
      <div v-else class="text-center py-8">
        <p class="text-base-content/60">No se encontraron artículos en esta categoría</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useBlog } from '~/composables/useBlog'

definePageMeta({
  layout: 'blog'
})

const route = useRoute()
const { getArticlesByCategory } = useBlog()

const articles = await getArticlesByCategory(route.params.categoryId as string)

// Buscar la categoría desde los artículos encontrados
const category = articles.length > 0 
  ? articles[0].categories?.find(cat => cat.slug === route.params.categoryId)
  : null

if (!articles.length) {
  throw createError({
    statusCode: 404,
    message: 'Categoría no encontrada'
  })
}

useHead({
  title: `${category?.title || 'Categoría'} - Blog`,
  meta: [
    {
      name: 'description',
      content: category?.description || `Artículos de la categoría ${category?.title || route.params.categoryId}`
    }
  ]
})
</script> 