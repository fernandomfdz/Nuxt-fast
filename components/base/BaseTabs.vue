<script setup lang="ts">
interface Tab {
  id: string
  title: string
  icon?: string
  content: string
}

const props = defineProps<{
  tabs: Tab[]
}>()

const activeTab = ref(props.tabs[0].id)
</script>

<template>
  <section class="max-w-xl mx-auto space-y-4">
    <!-- TAB HEADER -->
    <div
      class="grid rounded-xl bg-base-200 p-1"
      :style="{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }"
    >
      <a
        v-for="tab in tabs"
        :key="tab.id"
        role="tab"
        class="flex cursor-pointer select-none items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium"
        :class="[
          activeTab === tab.id
            ? 'animate-opacity bg-base-100 shadow'
            : 'text-base-content/75'
        ]"
        @click="activeTab = tab.id"
      >
        <Icon
          v-if="tab.icon"
          :name="tab.icon"
          class="w-5 h-5"
        />
        {{ tab.title }}
      </a>
    </div>

    <!-- TAB CONTENT -->
    <div
      :key="activeTab"
      class="animate-opacity"
    >
      <slot
        :name="activeTab"
        :tab="tabs.find(tab => tab.id === activeTab)"
      />
    </div>
  </section>
</template> 