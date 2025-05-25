<script setup lang="ts">
defineProps<{
  userCount?: number
}>()
</script>

<template>
  <div class="flex -gap-1 items-center mt-auto">
    <!-- Decoración izquierda -->
    <Icon
      name="custom:quote-left"
      class="w-8 fill-base-content/40 rotate-12"
    />

    <div>
      <p class="text-base-content/80 text-sm text-center">
        {{ userCount || '1000+' }} usuarios satisfechos
      </p>
      <div class="flex flex-row justify-center gap-0 pt-1">
        <span
          v-for="i in 5"
          :key="i"
        >
          <Icon
            name="heroicons:star-solid"
            class="w-4 h-4 text-warning"
          />
        </span>
      </div>
    </div>

    <!-- Decoración derecha -->
    <Icon
      name="custom:quote-right"
      class="w-8 fill-base-content/40 -rotate-12"
    />
  </div>
</template> 