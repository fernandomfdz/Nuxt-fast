<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <UModal
    v-model="modelValue"
    :ui="{
      overlay: {
        background: 'bg-neutral-focus bg-opacity-50'
      },
      container: 'flex min-h-full overflow-hidden items-start md:items-center justify-center p-2',
      base: 'relative w-full max-w-3xl h-full overflow-visible transform text-left align-middle shadow-xl transition-all rounded-xl bg-base-100 p-6 md:p-8',
      transition: {
        enterActiveClass: 'ease-out duration-300',
        enterFromClass: 'opacity-0 scale-95',
        enterToClass: 'opacity-100 scale-100',
        leaveActiveClass: 'ease-in duration-200',
        leaveFromClass: 'opacity-100 scale-100',
        leaveToClass: 'opacity-0 scale-95'
      }
    }"
  >
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold">
        I'm a modal
      </h2>
      <button
        class="btn btn-square btn-ghost btn-sm"
        @click="$emit('update:modelValue', false)"
      >
        <Icon name="heroicons:x-mark" class="w-5 h-5" />
      </button>
    </div>

    <section>
      <slot>And here is my content</slot>
    </section>
  </UModal>
</template> 