<script setup lang="ts">
import { config } from '~/config'
</script>

<template>
  <BaseFeatureAccordion :features="config.features.items">
    <template #title>
      {{ config.features.title }}
    </template>
    <template #subtitle>
      {{ config.features.subtitle }}
    </template>
  </BaseFeatureAccordion>
</template> 