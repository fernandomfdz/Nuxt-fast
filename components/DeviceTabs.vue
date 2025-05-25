<script setup lang="ts">
const tabs = [
  {
    id: '1',
    title: 'Mobile',
    icon: 'heroicons:device-phone-mobile',
    content: {
      device: 'iPhone 13 Pro',
      screenSize: '6.1 inches',
      resolution: '2532 x 1170 pixels',
      processor: 'A15 Bionic chip',
      ram: '6 GB',
      storage: '256 GB',
      battery: '3095 mAh'
    }
  },
  {
    id: '2',
    title: 'Tablet',
    icon: 'heroicons:device-tablet',
    content: {
      device: 'iPad Pro (12.9-inch)',
      screenSize: '12.9 inches',
      resolution: '2732 x 2048 pixels',
      processor: 'A12X Bionic chip',
      ram: '4 GB',
      storage: '256 GB',
      battery: '10000 mAh'
    }
  },
  {
    id: '3',
    title: 'Desktop',
    icon: 'heroicons:computer-desktop',
    content: {
      device: 'MacBook Pro (16-inch)',
      screenSize: '16 inches',
      resolution: '3072 x 1920 pixels',
      processor: 'Apple M3 chip',
      ram: '16 GB',
      storage: '1 TB',
      battery: '10000 mAh'
    }
  }
]
</script>

<template>
  <BaseTabs :tabs="tabs">
    <template
      v-for="tab in tabs"
      :key="tab.id"
      #[tab.id]="{ tab }"
    >
      <div class="space-y-2">
        <p>
          <strong>Device:</strong> {{ tab.content.device }}
        </p>
        <p>
          <strong>Screen Size:</strong> {{ tab.content.screenSize }}
        </p>
        <p>
          <strong>Resolution:</strong> {{ tab.content.resolution }}
        </p>
        <p>
          <strong>Processor:</strong> {{ tab.content.processor }}
        </p>
        <p>
          <strong>RAM:</strong> {{ tab.content.ram }}
        </p>
        <p>
          <strong>Storage:</strong> {{ tab.content.storage }}
        </p>
        <p>
          <strong>Battery:</strong> {{ tab.content.battery }}
        </p>
      </div>
    </template>
  </BaseTabs>
</template> 