<!-- OrganizationCreatePage -->
<template>
  <div class="p-8 pb-24">
    <section class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center space-x-4 mb-8">
        <NuxtLink :to="orgConfig?.listUrl || '/settings/organizations'" class="btn btn-ghost">
          <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
          Volver a Organizaciones
        </NuxtLink>
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold">Crear Organización</h1>
          <p class="text-lg text-base-content/70 mt-2">Configura tu nueva organización</p>
        </div>
      </div>

      <!-- Formulario -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <!-- Nombre de la organización -->
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text font-medium">Nombre de la Organización</span>
                <span class="label-text-alt text-error">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Mi Empresa"
                class="input input-bordered"
                :class="{ 'input-error': errors.name }"
                @input="generateSlug"
              >
              <label v-if="errors.name" class="label">
                <span class="label-text-alt text-error">{{ errors.name }}</span>
              </label>
            </div>

            <!-- Slug -->
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text font-medium">Identificador (Slug)</span>
                <span class="label-text-alt text-error">*</span>
              </label>
              <div class="input-group">
                <span class="bg-base-300 px-3 py-2 text-sm border border-base-300 rounded-l-lg">
                  nuxtfa.st/organizations/
                </span>
                <input
                  v-model="form.slug"
                  type="text"
                  placeholder="mi-empresa"
                  class="input input-bordered flex-1 rounded-l-none"
                  :class="{ 'input-error': errors.slug }"
                  @blur="checkSlug"
                >
              </div>
              <label class="label">
                <span class="label-text-alt">
                  Solo letras minúsculas, números y guiones
                </span>
                <span v-if="slugAvailable === true" class="label-text-alt text-success">
                  ✓ Disponible
                </span>
                <span v-else-if="slugAvailable === false" class="label-text-alt text-error">
                  ✗ No disponible
                </span>
              </label>
              <label v-if="errors.slug" class="label">
                <span class="label-text-alt text-error">{{ errors.slug }}</span>
              </label>
            </div>

            <!-- Logo -->
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text font-medium">Logo (URL)</span>
                <span class="label-text-alt">Opcional</span>
              </label>
              <input
                v-model="form.logo"
                type="url"
                placeholder="https://ejemplo.com/logo.png"
                class="input input-bordered"
                :class="{ 'input-error': errors.logo }"
              >
              <label v-if="errors.logo" class="label">
                <span class="label-text-alt text-error">{{ errors.logo }}</span>
              </label>
            </div>

            <!-- Descripción -->
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text font-medium">Descripción</span>
                <span class="label-text-alt">Opcional</span>
              </label>
              <textarea
                v-model="form.description"
                class="textarea textarea-bordered"
                placeholder="Describe tu organización..."
                rows="3"
              />
            </div>

            <!-- Vista previa -->
            <div v-if="form.name" class="mb-6">
              <h3 class="font-medium mb-2">Vista previa:</h3>
              <div class="mockup-window border bg-base-300">
                <div class="flex justify-center px-4 py-16 bg-base-200">
                  <OrganizationCard
                    :organization="{
                      id: 'preview',
                      name: form.name,
                      slug: form.slug || 'mi-organizacion',
                      logo: form.logo,
                      createdAt: new Date().toISOString(),
                      metadata: form.description ? { description: form.description } : undefined
                    }"
                    :is-active="false"
                  />
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-between items-center">
              <NuxtLink to="/organizations" class="btn btn-ghost">
                Cancelar
              </NuxtLink>
              
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="!canSubmit || isSubmitting"
                :class="{ 'loading': isSubmitting }"
              >
                {{ isSubmitting ? 'Creando...' : 'Crear Organización' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'

// Usar layout dashboard
definePageMeta({
  layout: 'dashboard'
})

// Meta tags
useHead({
  title: 'Crear Organización',
  meta: [
    { name: 'description', content: 'Crea una nueva organización para tu equipo' }
  ]
})

// Composables
const { createOrganization, checkSlugAvailability } = useOrganizations()
const router = useRouter()

// Estado del formulario
const form = reactive({
  name: '',
  slug: '',
  logo: '',
  description: ''
})

const errors = reactive({
  name: '',
  slug: '',
  logo: ''
})

const isSubmitting = ref(false)
const slugAvailable = ref<boolean | null>(null)

// Computed
const canSubmit = computed(() => {
  return form.name.trim() && 
         form.slug.trim() && 
         slugAvailable.value === true &&
         !Object.values(errors).some(error => error)
})

// Generar slug automáticamente desde el nombre
const generateSlug = () => {
  if (!form.slug || form.slug === slugify(form.name)) {
    form.slug = slugify(form.name)
    slugAvailable.value = null
  }
}

// Función para convertir texto a slug
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-|-$/g, '') // Remover guiones al inicio y final
}

// Verificar disponibilidad del slug
const checkSlug = async () => {
  if (!form.slug) {
    slugAvailable.value = null
    return
  }

  // Validar formato del slug
  const slugPattern = /^[a-z0-9-]+$/
  if (!slugPattern.test(form.slug)) {
    errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones'
    slugAvailable.value = false
    return
  }

  errors.slug = ''

  try {
    const available = await checkSlugAvailability(form.slug)
    slugAvailable.value = available
  } catch (error) {
    console.error('Error al verificar slug:', error)
    slugAvailable.value = null
  }
}

// Validar formulario
const validateForm = () => {
  // Limpiar errores
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validar nombre
  if (!form.name.trim()) {
    errors.name = 'El nombre es requerido'
    isValid = false
  } else if (form.name.trim().length > 100) {
    errors.name = 'El nombre es muy largo (máximo 100 caracteres)'
    isValid = false
  }

  // Validar slug
  if (!form.slug.trim()) {
    errors.slug = 'El identificador es requerido'
    isValid = false
  } else if (!/^[a-z0-9-]+$/.test(form.slug)) {
    errors.slug = 'El identificador solo puede contener letras minúsculas, números y guiones'
    isValid = false
  } else if (slugAvailable.value !== true) {
    errors.slug = 'El identificador no está disponible'
    isValid = false
  }

  // Validar logo (si se proporciona)
  if (form.logo && !/^https?:\/\/.+/.test(form.logo)) {
    errors.logo = 'El logo debe ser una URL válida'
    isValid = false
  }

  return isValid
}

// Manejar envío del formulario
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const organizationData = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      ...(form.logo && { logo: form.logo }),
      ...(form.description && { 
        metadata: { description: form.description.trim() } 
      })
    }

    const organization = await createOrganization(organizationData)
    
    // Redirigir a la página de organizaciones
    await router.push('/organizations')
    
    // Mostrar mensaje de éxito (si tienes un sistema de notificaciones)
    console.log('Organización creada exitosamente:', organization)
    
  } catch (error) {
    console.error('Error al crear organización:', error)
    // Aquí podrías mostrar un toast de error
  } finally {
    isSubmitting.value = false
  }
}

// Verificar slug cuando cambie
watch(() => form.slug, () => {
  slugAvailable.value = null
  if (form.slug) {
    checkSlug()
  }
})
</script> 