<script setup lang="ts">
import { config } from '~/config'

defineProps<{
  priority?: boolean
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row justify-center items-center md:items-start gap-3">
    <!-- AVATARS -->
    <div class="-space-x-5 avatar-group justy-start">
      <div
        v-for="(testimonial, i) in config.testimonials.items.slice(0, 5)"
        :key="i"
        class="avatar w-12 h-12"
      >
        <NuxtImg
          :src="testimonial.img"
          :alt="testimonial.name"
          :priority="priority"
          width="50"
          height="50"
        />
      </div>
    </div>

    <!-- RATING -->
    <div class="flex flex-col justify-center items-center md:items-start gap-1">
      <div class="rating">
        <div class="mask mask-star-2 bg-warning" aria-label="1 star"/>
        <div class="mask mask-star-2 bg-warning" aria-label="2 star"/>
        <div class="mask mask-star-2 bg-warning" aria-label="3 star"/>
        <div class="mask mask-star-2 bg-warning" aria-label="4 star"/>
        <div class="mask mask-star-2 bg-warning" aria-label="5 star"  aria-current="true"/>
      </div>

      <div class="text-base text-base-content/80">
        <span class="font-semibold text-base-content">{{ config.testimonials.items.length * 10 + 2 }}</span> makers ship faster
      </div>
    </div>
  </div>
</template> 