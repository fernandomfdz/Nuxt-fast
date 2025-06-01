<template>
  <div>
		<Header />
		<main>
			<Hero />
			
			<!-- Sección de Organizaciones (solo para usuarios autenticados) -->
			<OrganizationsSection v-if="showOrganizationsSection" />
			
			<ProblemSection />
			<FeaturesSection />
			<PricingSection />
			<FaqSection />
			<CtaSection />
		</main>
		<Footer />
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'

// Verificar si mostrar la sección de organizaciones
const { isAuthenticated } = useAuth()
const { enabledModules } = useNuxtFastModules()

const showOrganizationsSection = computed(() => {
  const orgConfig = config.modules?.organizations
  return orgConfig?.enabled && 
         orgConfig?.showInNavigation && 
         isAuthenticated.value &&
         enabledModules.value.includes('organizations')
})
</script> 