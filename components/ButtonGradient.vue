<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
}>(), {
  title: 'Gradient Button'
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button
    class="btn btn-gradient animate-shimmer"
    @click="$emit('click', $event)"
  >
    {{ title }}
  </button>
</template> 