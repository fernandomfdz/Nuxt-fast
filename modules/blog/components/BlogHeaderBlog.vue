<template>
  <header class="relative isolate">
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-tr from-neutral-focus/50 to-neutral/50" />
    </div>

    <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
          Blog
        </h1>
        <p class="mt-6 text-lg leading-8">
          Artículos sobre desarrollo web, SaaS, y más.
        </p>
      </div>

      <div class="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
        <div class="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 sm:grid-cols-2 md:flex lg:gap-x-10">
          <NuxtLink
            to="/blog"
            class="link-hover link"
          >
            Todos los artículos <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Composable simplificado por ahora hasta que configuremos correctamente Nuxt Content
</script>