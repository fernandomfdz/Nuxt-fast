<script setup lang="ts">
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose
} from 'radix-vue'

const isOpen = ref(false)
</script>

<template>
  <Popover
    v-model:open="isOpen"
    class="relative z-10"
  >
    <PopoverTrigger class="btn">
      Botón Popover
      <Icon
        name="heroicons:chevron-down"
        class="w-5 h-5 duration-200"
        :class="{ 'transform rotate-180': isOpen }"
      />
    </PopoverTrigger>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-out"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <PopoverContent
        class="absolute left-0 z-10 mt-3 w-screen max-w-full sm:max-w-sm lg:max-w-2xl transform"
        :side-offset="5"
      >
        <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-base-content ring-opacity-5">
          <div class="relative grid gap-4 bg-base-100 p-4 lg:grid-cols-2">
            <PopoverClose class="text-sm flex items-center gap-3 p-2 cursor-pointer hover:bg-base-200 rounded-lg duration-200">
              <span class="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg bg-warning/20">
                <Icon
                  name="heroicons:exclamation-triangle"
                  class="w-6 h-6 text-warning"
                />
              </span>
              <div>
                <p class="font-bold">
                  Empezar
                </p>
                <p class="opacity-70">
                  Comienza tu viaje con nosotros
                </p>
              </div>
            </PopoverClose>

            <PopoverClose class="text-sm flex items-center gap-3 p-2 cursor-pointer hover:bg-base-200 rounded-lg duration-200">
              <span class="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg bg-warning/20">
                <Icon
                  name="heroicons:light-bulb"
                  class="w-6 h-6 text-warning"
                />
              </span>
              <div>
                <p class="font-bold">
                  Recompensas
                </p>
                <p class="opacity-70">
                  Descubre nuestros beneficios
                </p>
              </div>
            </PopoverClose>

            <PopoverClose class="text-sm flex items-center gap-3 p-2 cursor-pointer hover:bg-base-200 rounded-lg duration-200">
              <span class="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg bg-success/20">
                <Icon
                  name="heroicons:check-circle"
                  class="w-6 h-6 text-success"
                />
              </span>
              <div>
                <p class="font-bold">
                  Académico
                </p>
                <p class="opacity-70">
                  Explora nuestros recursos
                </p>
              </div>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </transition>
  </Popover>
</template> 