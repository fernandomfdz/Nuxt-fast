<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-primary/20 text-primary">
    <Icon
      :name="name"
      class="w-6 h-6"
    />
  </div>
</template> 