<script setup lang="ts">
import { config } from '~/config'
</script>

<template>
  <section class="bg-neutral text-neutral-content">
    <div class="max-w-7xl mx-auto px-8 py-16 md:py-32 text-center">
      <h2 class="max-w-3xl mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8">
        {{ config.problem.title }}
      </h2>
      <p class="max-w-xl mx-auto text-lg opacity-90 leading-relaxed mb-12 md:mb-20">
        {{ config.problem.description }}
      </p>

      <div class="flex flex-col md:flex-row justify-center items-center md:items-start gap-6">
        <div
          v-for="(item, index) in config.problem.items"
          :key="index"
          class="w-full md:w-48 flex flex-col gap-2 items-center justify-center"
        >
          <span class="text-4xl">{{ item.slice(0, 2) }}</span>
          <h3 class="font-bold">{{ item.slice(3) }}</h3>

          <BaseArrow
            v-if="index < config.problem.items.length - 1"
            :extra-style="index === 0 ? 'max-md:-scale-x-100 md:-rotate-90' : 'md:-scale-x-100 md:-rotate-90'"
          />
        </div>
      </div>
    </div>
  </section>
</template> 