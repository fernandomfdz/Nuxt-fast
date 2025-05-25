<template>
  <div class="flex-shrink-0">
    <img
      :src="src"
      :alt="alt"
      :class="[
        'rounded-full object-cover',
        sizeClasses
      ]"
    >
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md'
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-8 h-8'
    case 'lg':
      return 'w-16 h-16'
    default:
      return 'w-12 h-12'
  }
})
</script> 