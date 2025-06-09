<script setup lang="ts">
interface Props {
  organization?: {
    id?: string
    name?: string
    slug?: string
    metadata?: {
      description?: string
      logo?: string
    }
  }
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false
})

const emit = defineEmits<{
  'submit': [data: {
    name: string
    slug: string
    description?: string
    logo?: string
  }]
  'cancel': []
}>()

// Formulario reactivo
const form = reactive({
  name: props.organization?.name || '',
  slug: props.organization?.slug || '',
  description: props.organization?.metadata?.description || '',
  logo: props.organization?.metadata?.logo || 'heroicons:building-office'
})

// Validación
const errors = reactive({
  name: '',
  slug: ''
})

// Iconos disponibles
const availableIcons = [
  'heroicons:building-office',
  'heroicons:building-storefront',
  'heroicons:home-modern',
  'heroicons:academic-cap',
  'heroicons:beaker',
  'heroicons:briefcase',
  'heroicons:chart-bar',
  'heroicons:cog-6-tooth',
  'heroicons:computer-desktop',
  'heroicons:cube',
  'heroicons:fire',
  'heroicons:globe-alt',
  'heroicons:heart',
  'heroicons:light-bulb',
  'heroicons:rocket-launch',
  'heroicons:star',
  'heroicons:trophy'
]

// Generar slug automáticamente desde el nombre
watch(() => form.name, (newName) => {
  if (!props.isEditing) {
    form.slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
})

// Validar formulario
const validateForm = () => {
  errors.name = ''
  errors.slug = ''
  
  if (!form.name.trim()) {
    errors.name = 'El nombre es requerido'
    return false
  }
  
  if (!form.slug.trim()) {
    errors.slug = 'El slug es requerido'
    return false
  }
  
  if (!/^[a-z0-9-]+$/.test(form.slug)) {
    errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones'
    return false
  }
  
  return true
}

// Enviar formulario
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || undefined,
      logo: form.logo
    })
  }
}

// Cancelar
const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Nombre -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">Nombre de la organización</span>
        <span class="label-text-alt text-error">*</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Mi Empresa"
        class="input input-bordered"
        :class="{ 'input-error': errors.name }"
        required
      >
      <label v-if="errors.name" class="label">
        <span class="label-text-alt text-error">{{ errors.name }}</span>
      </label>
    </div>

    <!-- Slug -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">Identificador único (slug)</span>
        <span class="label-text-alt text-error">*</span>
      </label>
      <input
        v-model="form.slug"
        type="text"
        placeholder="mi-empresa"
        class="input input-bordered"
        :class="{ 'input-error': errors.slug }"
        :readonly="isEditing"
        required
      >
      <label class="label">
        <span class="label-text-alt">
          {{ isEditing ? 'El slug no se puede cambiar' : 'Se genera automáticamente desde el nombre' }}
        </span>
      </label>
      <label v-if="errors.slug" class="label">
        <span class="label-text-alt text-error">{{ errors.slug }}</span>
      </label>
    </div>

    <!-- Descripción -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">Descripción</span>
      </label>
      <textarea
        v-model="form.description"
        class="textarea textarea-bordered"
        placeholder="Describe brevemente tu organización..."
        rows="3"
      />
    </div>

    <!-- Icono -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">Icono</span>
      </label>
      <div class="grid grid-cols-6 gap-2">
        <button
          v-for="icon in availableIcons"
          :key="icon"
          type="button"
          class="btn btn-square btn-outline"
          :class="{ 'btn-primary': form.logo === icon }"
          @click="form.logo = icon"
        >
          <Icon :name="icon" class="w-5 h-5" />
        </button>
      </div>
      <label class="label">
        <span class="label-text-alt">Selecciona un icono para tu organización</span>
      </label>
    </div>

    <!-- Vista previa -->
    <div class="card bg-base-200 border">
      <div class="card-body">
        <h3 class="card-title text-sm">Vista previa</h3>
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
              <Icon :name="form.logo" class="w-6 h-6" />
            </div>
          </div>
          <div>
            <h4 class="font-semibold">{{ form.name || 'Nombre de la organización' }}</h4>
            <p class="text-sm text-base-content/70">{{ form.slug || 'slug-organizacion' }}</p>
            <p v-if="form.description" class="text-xs text-base-content/60 mt-1">
              {{ form.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3">
      <button
        type="button"
        class="btn btn-ghost"
        @click="handleCancel"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="btn btn-primary"
      >
        {{ isEditing ? 'Actualizar' : 'Crear' }} Organización
      </button>
    </div>
  </form>
</template> 