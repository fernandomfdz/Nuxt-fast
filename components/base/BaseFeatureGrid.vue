<script setup lang="ts">
interface Feature {
  title: string
  description: string
  styles?: string
}

defineProps<{
  features: Feature[]
}>()
</script>

<template>
  <section class="flex justify-center items-center w-full bg-base-200/50 text-base-content py-20 lg:py-32">
    <div class="flex flex-col max-w-[82rem] gap-16 md:gap-20 px-4">
      <h2 class="max-w-3xl font-black text-4xl md:text-6xl tracking-[-0.01em]">
        <slot name="title">
          Características
        </slot>
        <span
          v-if="$slots.highlight"
          class="underline decoration-dashed underline-offset-8 decoration-base-300"
        >
          <slot name="highlight" />
        </span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(feature, i) in features"
          :key="i"
          :class="['rounded-box p-8 h-[24rem] group overflow-hidden', feature.styles]"
        >
          <div class="h-full flex flex-col">
            <h3 class="font-semibold text-xl mb-2">
              {{ feature.title }}
            </h3>
            <p class="opacity-90 mb-8">
              {{ feature.description }}
            </p>

            <div class="flex-1">
              <slot
                :name="`feature-${i}`"
                :feature="feature"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template> 