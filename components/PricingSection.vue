<script setup lang="ts">
import { config } from '~/config'

interface PricingFeature {
  name: string
}

interface PricingPlan {
  priceId: string
  name: string
  description?: string
  price: number
  priceAnchor?: number
  isFeatured?: boolean
  features?: PricingFeature[]
}
</script>

<template>
  <section
    id="pricing"
    class="bg-base-200 overflow-hidden"
  >
    <div class="py-24 px-8 max-w-5xl mx-auto">
      <div class="flex flex-col text-center w-full mb-20">
        <p class="font-medium text-primary mb-8">
          Precios
        </p>
        <h2 class="font-bold text-3xl lg:text-5xl tracking-tight">
          ¡Ahorra horas de código repetitivo y lanza más rápido!
        </h2>
      </div>

      <div class="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
        <div
          v-for="plan in config.stripe.plans"
          :key="plan.priceId"
          class="relative w-full max-w-lg"
        >
          <!-- Etiqueta Popular -->
          <div
            v-if="plan.isFeatured"
            class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <span class="badge text-xs text-primary-content font-semibold border-0 bg-primary">
              POPULAR
            </span>
          </div>

          <!-- Borde destacado -->
          <div
            v-if="plan.isFeatured"
            class="absolute -inset-[1px] rounded-[9px] bg-primary z-10"
          />

          <div class="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
            <!-- Cabecera del plan -->
            <div class="flex justify-between items-center gap-4">
              <div>
                <p class="text-lg lg:text-xl font-bold">
                  {{ plan.name }}
                </p>
                <p
                  v-if="plan.description"
                  class="text-base-content/80 mt-2"
                >
                  {{ plan.description }}
                </p>
              </div>
            </div>

            <!-- Precio -->
            <div class="flex gap-2">
              <div
                v-if="plan.priceAnchor"
                class="flex flex-col justify-end mb-[4px] text-lg"
              >
                <p class="relative">
                  <span class="absolute bg-base-content h-[1.5px] inset-x-0 top-[53%]" />
                  <span class="text-base-content/80">
                    ${{ plan.priceAnchor }}
                  </span>
                </p>
              </div>
              <p class="text-5xl tracking-tight font-extrabold">
                ${{ plan.price }}
              </p>
              <div class="flex flex-col justify-end mb-[4px]">
                <p class="text-xs text-base-content/60 uppercase font-semibold">
                  USD
                </p>
              </div>
            </div>

            <!-- Características -->
            <ul
              v-if="plan.features"
              class="space-y-2.5 leading-relaxed text-base flex-1"
            >
              <li
                v-for="(feature, i) in plan.features"
                :key="i"
                class="flex items-center gap-2"
              >
                <Icon
                  name="heroicons:check"
                  class="w-[18px] h-[18px] opacity-80 shrink-0"
                />
                <span>{{ feature.name }}</span>
              </li>
            </ul>

            <!-- Botón y texto adicional -->
            <div class="space-y-2">
              <ButtonCheckout :price-id="plan.priceId" />

              <p class="flex items-center justify-center gap-2 text-sm text-center text-base-content/80 font-medium relative">
                Paga una vez. Accede para siempre.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template> 