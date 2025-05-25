<script setup lang="ts">
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'radix-vue'

interface FaqItem {
  question: string
  answer: string
}

defineProps<{
  items: FaqItem[]
}>()
</script>

<template>
  <section id="faq" class="bg-base-200">
    <div class="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      <div class="flex flex-col text-left basis-1/2">
        <p class="inline-block font-semibold text-primary mb-4">
          <slot name="subtitle">FAQ</slot>
        </p>
        <p class="sm:text-4xl text-3xl font-extrabold text-base-content">
          <slot name="title">Frequently Asked Questions</slot>
        </p>
      </div>

      <div class="basis-1/2">
        <AccordionRoot
          type="multiple"
          class="w-full"
        >
          <AccordionItem
            v-for="(item, index) in items"
            :key="index"
            :value="`item-${index}`"
            class="border-t border-base-content/10"
          >
            <AccordionTrigger class="flex justify-between items-center w-full py-5 text-left text-base md:text-lg font-semibold text-base-content hover:text-primary transition-colors [&[data-state=open]]:text-primary">
              {{ item.question }}
              <Icon 
                name="heroicons:chevron-down" 
                class="h-4 w-4 shrink-0 transition-transform duration-200 [&[data-state=open]]:rotate-180" 
              />
            </AccordionTrigger>
            
            <AccordionContent class="pb-5 text-base-content/80 leading-relaxed">
              <slot
                :name="`answer-${index}`"
                :item="item"
              >
                {{ item.answer }}
              </slot>
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
      </div>
    </div>
  </section>
</template> 