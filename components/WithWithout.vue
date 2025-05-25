<script setup lang="ts">
interface ComparisonItem {
  text: string
  icon: 'check' | 'x'
}

const withoutItems: ComparisonItem[] = [
  { text: 'Crear facturas manualmente', icon: 'x' },
  { text: 'O pagar hasta $2 por factura', icon: 'x' },
  { text: 'Perder horas en soporte al cliente', icon: 'x' },
  { text: 'No poder actualizar detalles una vez enviados (IVA, NIF)', icon: 'x' },
  { text: 'No poder hacer facturas de compras anteriores', icon: 'x' }
]

const withItems: ComparisonItem[] = [
  { text: 'Facturas autoservicio', icon: 'check' },
  { text: 'Pago único para facturas ilimitadas', icon: 'check' },
  { text: 'Sin más soporte al cliente', icon: 'check' },
  { text: 'Facturas editables para cumplir normativas', icon: 'check' },
  { text: 'Facturas para cualquier pago, incluso pasados', icon: 'check' }
]
</script>

<template>
  <section class="bg-base-100">
    <div class="max-w-5xl mx-auto px-8 py-16 md:py-32">
      <h2 class="text-center font-extrabold text-3xl md:text-5xl tracking-tight mb-12 md:mb-20">
        ¿Cansado de gestionar facturas de Stripe?
      </h2>

      <div class="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12">
        <!-- Sin el producto -->
        <div class="bg-error/20 text-error p-8 md:p-12 rounded-lg w-full">
          <h3 class="font-bold text-lg mb-4">
            Facturas de Stripe sin ZenVoice
          </h3>

          <ul class="list-disc list-inside space-y-1.5">
            <li
              v-for="(item, index) in withoutItems"
              :key="index"
              class="flex gap-2 items-center"
            >
              <Icon
                name="heroicons:x-mark"
                class="w-4 h-4 shrink-0 opacity-75"
              />
              {{ item.text }}
            </li>
          </ul>
        </div>

        <!-- Con el producto -->
        <div class="bg-success/20 text-success p-8 md:p-12 rounded-lg w-full">
          <h3 class="font-bold text-lg mb-4">
            Facturas de Stripe + ZenVoice
          </h3>

          <ul class="list-disc list-inside space-y-1.5">
            <li
              v-for="(item, index) in withItems"
              :key="index"
              class="flex gap-2 items-center"
            >
              <Icon
                name="heroicons:check"
                class="w-4 h-4 shrink-0 opacity-75"
              />
              {{ item.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template> 