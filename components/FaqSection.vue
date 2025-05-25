<script setup lang="ts">
import { config } from '~/config'
</script>

<template>
  <BaseFaq :items="config.faq.items">
    <template #subtitle>
      {{ config.faq.subtitle }}
    </template>
    <template #title>
      {{ config.faq.title }}
    </template>
  </BaseFaq>
</template> 