<script setup lang="ts">
interface Feature {
  title: string
  description: string
  type?: 'video' | 'image'
  path?: string
  format?: string
  alt?: string
  icon: string
}

defineProps<{
  features: Feature[]
}>()

const featureSelected = ref(0)

const setFeatureSelected = (index: number) => {
  featureSelected.value = index
}
</script>

<template>
  <section
    id="features"
    class="py-24 md:py-32 space-y-24 md:space-y-32 max-w-7xl mx-auto bg-base-100"
  >
    <div class="px-8">
      <h2 class="font-extrabold text-4xl lg:text-6xl tracking-tight mb-12 md:mb-24">
        <slot name="title">
          Características Principales
        </slot>
        <span
          v-if="$slots.subtitle"
          class="bg-neutral text-neutral-content px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed whitespace-nowrap"
        >
          <slot name="subtitle" />
        </span>
      </h2>

      <div class="flex flex-col md:flex-row gap-12 md:gap-24">
        <div class="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          <!-- Lista de características -->
          <ul class="w-full">
            <li
              v-for="(feature, i) in features"
              :key="feature.title"
            >
              <button
                class="relative flex gap-2 items-center w-full py-5 text-base font-medium text-left md:text-lg transition-colors duration-200"
                :aria-expanded="featureSelected === i"
                @click.prevent="setFeatureSelected(i)"
              >
                <span
                  class="duration-200 transition-colors"
                  :class="{ 'text-primary': featureSelected === i }"
                >
                  <Icon
                    :name="feature.icon"
                    class="w-6 h-6"
                  />
                </span>
                <span
                  class="flex-1 text-base-content transition-colors duration-200"
                  :class="{ 'text-primary font-semibold': featureSelected === i }"
                >
                  <h3 class="inline">
                    {{ feature.title }}
                  </h3>
                </span>
              </button>

              <div
                class="grid transition-all duration-300 ease-in-out"
                :class="{
                  'grid-rows-[1fr] opacity-100': featureSelected === i,
                  'grid-rows-[0fr] opacity-0': featureSelected !== i
                }"
              >
                <div class="overflow-hidden">
                  <div class="pb-5 leading-relaxed text-base-content-secondary">
                    {{ feature.description }}
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- Media -->
          <div
            v-for="(feature, i) in features"
            v-show="featureSelected === i"
            :key="feature.title"
            class="rounded-2xl aspect-square w-full sm:w-[26rem]"
          >
            <video
              v-if="feature.type === 'video'"
              class="rounded-2xl aspect-square w-full"
              autoplay
              muted
              loop
              playsinline
              controls
              width="500"
              height="500"
            >
              <source
                :src="feature.path"
                :type="feature.format"
              >
            </video>

            <NuxtImg
              v-else-if="feature.type === 'image'"
              :src="feature.path"
              :alt="feature.alt"
              class="rounded-2xl aspect-square w-full object-cover object-center"
              width="500"
              height="500"
            />

            <!-- Placeholder para características sin media -->
            <div
              v-else
              class="rounded-2xl aspect-square w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"
            >
              <Icon
                :name="feature.icon"
                class="text-primary/60"
                style="width: 100px; height: 100px;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template> 