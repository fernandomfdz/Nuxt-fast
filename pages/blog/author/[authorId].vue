<template>
  <div class="container mx-auto px-4 py-12">
    <header class="mx-auto max-w-2xl text-center">
      <!-- Avatar con DaisyUI -->
      <div v-if="author?.avatar" class="mb-8 flex justify-center">
        <div class="avatar">
          <div class="w-24 h-24 rounded-full">
            <img
              :src="author.avatar"
              :alt="author.name || 'Author'"
              class="w-full h-full object-cover"
              referrerpolicy="no-referrer"
            >
          </div>
        </div>
      </div>

      <h1 class="text-4xl font-bold tracking-tight text-base-content sm:text-5xl">
        {{ author?.name || 'Autor' }}
      </h1>
      
      <p v-if="author?.job" class="mt-2 text-lg text-base-content/70">
        {{ author.job }}
      </p>
      
      <p v-if="author?.description" class="mt-4 text-base-content/60">
        {{ author.description }}
      </p>

      <!-- Redes sociales -->
      <div v-if="author?.socials?.length" class="mt-6 flex justify-center space-x-4">
        <NuxtLink
          v-for="social in author.socials"
          :key="social.name"
          :to="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-base-content/60 hover:text-primary transition-colors"
        >
          <span class="sr-only">{{ social.name }}</span>
          <Icon :name="social.icon" class="h-6 w-6" />
        </NuxtLink>
      </div>
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
        <p class="text-base-content/60">No se encontraron artículos de este autor</p>
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
const { getArticlesByAuthor } = useBlog()

const articles = await getArticlesByAuthor(route.params.authorId as string)

if (!articles.length) {
  throw createError({
    statusCode: 404,
    message: 'Autor no encontrado'
  })
}

const author = articles[0]?.author

useHead({
  title: `${author?.name || 'Autor'} - Blog`,
  meta: [
    {
      name: 'description',
      content: author?.description || `Artículos escritos por ${author?.name || route.params.authorId}`
    }
  ]
})
</script> 