<script setup lang="ts">
import { config } from '~/config'
</script>

<template>
  <section class="relative hero overflow-hidden min-h-screen">
    <NuxtImg
      :src="config.cta.backgroundImage"
      alt="Fondo"
      class="object-cover w-full absolute inset-0"
      sizes="100vw"
      priority
    />
    <div class="relative hero-overlay bg-neutral bg-opacity-70" />
    <div class="relative hero-content text-center text-neutral-content p-8">
      <div class="flex flex-col items-center max-w-xl p-8 md:p-0">
        <h2 class="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
          {{ config.cta.title }}
        </h2>
        <p class="text-lg opacity-80 mb-12 md:mb-16">
          {{ config.cta.description }}
        </p>

        <button class="btn btn-primary btn-wide">
          {{ config.cta.buttonText }}{{ config.cta.buttonTextSuffix ? ' ' + config.cta.buttonTextSuffix : ' ' + config.appName }}
        </button>
      </div>
    </div>
  </section>
</template> 