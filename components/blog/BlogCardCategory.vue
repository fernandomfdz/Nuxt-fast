<template>
  <NuxtLink
    :to="`/blog/category/${category.slug || category.title.toLowerCase().replace(/\s+/g, '-')}`"
    class="group block p-6 bg-base-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/30"
  >
    <!-- Icono de la categoría -->
    <div class="flex items-center justify-between mb-4">
      <div class="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon :name="categoryIcon" class="w-6 h-6 text-primary" />
      </div>
      <div class="text-sm font-medium text-base-content/70 bg-base-200 px-2 py-1 rounded-full">
        {{ articleCount }} {{ articleCount === 1 ? 'artículo' : 'artículos' }}
      </div>
    </div>

    <!-- Título de la categoría -->
    <h3 class="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors duration-300">
      {{ category.title }}
    </h3>

    <!-- Descripción -->
    <p class="text-base-content/70 text-sm leading-relaxed mb-4 line-clamp-3">
      {{ category.description || category.descriptionShort || 'Explora artículos de esta categoría' }}
    </p>

    <!-- Footer con indicador -->
    <div class="flex items-center justify-between">
      <span class="text-sm text-base-content/50">
        Explorar categoría
      </span>
      <Icon 
        name="heroicons:arrow-right" 
        class="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform duration-300" 
      />
    </div>

    <!-- Indicador de hover -->
    <div class="absolute inset-0 border-2 border-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"/>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Category {
  slug: string
  title: string
  titleShort?: string
  description?: string
  descriptionShort?: string
}

const props = defineProps<{
  category: Category
  articleCount?: number
}>()

// Mapeo de iconos por categoría
const categoryIcons: Record<string, string> = {
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

// Obtener icono basado en el slug de la categoría
const categoryIcon = computed(() => {
  return categoryIcons[props.category.slug] || 'heroicons:folder'
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