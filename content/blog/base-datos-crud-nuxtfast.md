---
title: Base de Datos y CRUD en NuxtFast - Guía Completa con MongoDB
description: Aprende a configurar MongoDB, crear modelos, implementar operaciones CRUD y gestionar datos en NuxtFast con ejemplos prácticos.
publishedAt: 2024-01-19
categories:
  - slug: tutorial
  - slug: database
author:
  slug: fer
image:
  src: https://picsum.photos/800/400?random=15
  urlRelative: https://picsum.photos/800/400?random=15
  alt: Base de datos y CRUD en NuxtFast
---

¿Quieres dominar la gestión de datos en NuxtFast? En esta guía completa aprenderás a configurar MongoDB, crear modelos robustos e implementar operaciones CRUD completas con ejemplos prácticos.

## 🗄️ Introducción a la Base de Datos

NuxtFast utiliza **MongoDB** como base de datos principal con **Mongoose** como ODM (Object Document Mapper), proporcionando:

- 🔗 **Conexión automática** - Gestión inteligente de conexiones
- 📋 **Modelos tipados** - Schemas con TypeScript
- 🔄 **CRUD completo** - Create, Read, Update, Delete
- 🛡️ **Validación** - Validación de datos automática
- 🚀 **Rendimiento** - Consultas optimizadas y caching

## 🚀 Configuración Inicial

### Variables de Entorno

Configura tu conexión a MongoDB en `.env`:

```env
# MongoDB Atlas (Recomendado)
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nuxtfast?retryWrites=true&w=majority

# MongoDB Local (Desarrollo)
MONGODB_URI=mongodb://localhost:27017/nuxtfast

# Configuración adicional
DB_NAME=nuxtfast
NODE_ENV=development
```

### Conexión a la Base de Datos

Crea `server/utils/db.ts`:

```typescript
import mongoose from 'mongoose'

interface ConnectionState {
  isConnected?: number
}

const connection: ConnectionState = {}

export const connectDB = async (): Promise<void> => {
  // Si ya estamos conectados, no hacer nada
  if (connection.isConnected) {
    console.log('✅ Ya conectado a MongoDB')
    return
  }

  try {
    const mongoUri = useRuntimeConfig().mongodbUri
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI no está definida en las variables de entorno')
    }

    // Configuración de conexión optimizada
    const db = await mongoose.connect(mongoUri, {
      bufferCommands: false,
      maxPoolSize: 10, // Máximo 10 conexiones en el pool
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
      socketTimeoutMS: 45000, // Timeout de socket de 45 segundos
      family: 4 // Usar IPv4
    })

    connection.isConnected = db.connections[0].readyState
    console.log('✅ Conectado a MongoDB:', db.connection.name)

  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    throw error
  }
}

// Cerrar conexión cuando la aplicación se cierre
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('🔌 Conexión a MongoDB cerrada')
  process.exit(0)
})
```

### Plugin de Inicialización

Crea `plugins/db.server.ts`:

```typescript
export default defineNitroPlugin(async () => {
  try {
    await connectDB()
    console.log('🚀 Base de datos inicializada')
  } catch (error) {
    console.error('💥 Error inicializando base de datos:', error)
  }
})
```

## 📋 Creación de Modelos

### Modelo Base

Crea `server/models/BaseModel.ts`:

```typescript
import mongoose, { Document, Schema } from 'mongoose'

export interface BaseDocument extends Document {
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export const baseSchemaOptions = {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  versionKey: false, // Elimina __v
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    }
  }
}

export const addBaseFields = (schema: Schema) => {
  schema.add({
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  })
  
  // Middleware para soft delete
  schema.pre(/^find/, function() {
    // Solo mostrar documentos activos por defecto
    if (!this.getQuery().includeInactive) {
      this.where({ isActive: { $ne: false } })
    }
  })
}
```

### Modelo de Producto (Ejemplo)

Crea `server/models/Product.ts`:

```typescript
import mongoose, { Schema, Document } from 'mongoose'
import { BaseDocument, baseSchemaOptions, addBaseFields } from './BaseModel'

export interface IProduct extends BaseDocument {
  name: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  sku: string
  tags: string[]
  specifications: Record<string, any>
  isPublished: boolean
  publishedAt?: Date
  author: mongoose.Types.ObjectId
  reviews: {
    rating: number
    comment: string
    user: mongoose.Types.ObjectId
    createdAt: Date
  }[]
  averageRating: number
  totalReviews: number
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo'],
    index: true
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: {
      values: ['electronics', 'clothing', 'books', 'home', 'sports', 'other'],
      message: 'Categoría no válida'
    },
    index: true
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v)
      },
      message: 'URL de imagen no válida'
    }
  }],
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  sku: {
    type: String,
    required: [true, 'El SKU es requerido'],
    unique: true,
    uppercase: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  specifications: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },
  publishedAt: {
    type: Date,
    index: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El autor es requerido'],
    index: true
  },
  reviews: [{
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'El comentario no puede exceder 500 caracteres']
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  }
}, baseSchemaOptions)

// Agregar campos base
addBaseFields(productSchema)

// Índices compuestos para consultas optimizadas
productSchema.index({ category: 1, price: 1 })
productSchema.index({ tags: 1, isPublished: 1 })
productSchema.index({ name: 'text', description: 'text', tags: 'text' })

// Middleware pre-save
productSchema.pre('save', function(next) {
  // Auto-generar SKU si no existe
  if (!this.sku) {
    this.sku = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  }
  
  // Establecer publishedAt cuando se publica
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  
  next()
})

// Método para calcular rating promedio
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0
    this.totalReviews = 0
  } else {
    const sum = this.reviews.reduce((acc: number, review: any) => acc + review.rating, 0)
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10
    this.totalReviews = this.reviews.length
  }
}

// Método estático para buscar productos
productSchema.statics.findPublished = function() {
  return this.find({ isPublished: true, stock: { $gt: 0 } })
}

// Virtual para URL del producto
productSchema.virtual('url').get(function() {
  return `/products/${this._id}`
})

export const Product = mongoose.model<IProduct>('Product', productSchema)
```

## 🔌 API Routes CRUD

### Crear Producto

Crea `server/api/products/index.post.ts`:

```typescript
import { Product } from '~/server/models/Product'
import { requireAuth } from '~/server/utils/auth'
import { z } from 'zod'

// Schema de validación
const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  price: z.number().min(0),
  category: z.enum(['electronics', 'clothing', 'books', 'home', 'sports', 'other']),
  images: z.array(z.string().url()).optional(),
  stock: z.number().min(0).default(0),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
  isPublished: z.boolean().default(false)
})

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación
    const session = await requireAuth(event)
    
    // Conectar a la base de datos
    await connectDB()
    
    // Leer y validar datos
    const body = await readBody(event)
    const validatedData = createProductSchema.parse(body)
    
    // Verificar SKU único si se proporciona
    if (validatedData.sku) {
      const existingProduct = await Product.findOne({ sku: validatedData.sku })
      if (existingProduct) {
        throw createError({
          statusCode: 400,
          statusMessage: 'El SKU ya existe'
        })
      }
    }
    
    // Crear producto
    const product = new Product({
      ...validatedData,
      author: session.user.id
    })
    
    await product.save()
    
    // Poblar datos del autor
    await product.populate('author', 'name email')
    
    return {
      success: true,
      data: product,
      message: 'Producto creado exitosamente'
    }
    
  } catch (error) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de entrada inválidos',
        data: error.errors
      })
    }
    
    if (error.name === 'ValidationError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Error de validación',
        data: error.errors
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
```

### Obtener Productos

Crea `server/api/products/index.get.ts`:

```typescript
import { Product } from '~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    
    // Obtener parámetros de consulta
    const query = getQuery(event)
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      published = 'true'
    } = query
    
    // Construir filtros
    const filters: any = {}
    
    if (published === 'true') {
      filters.isPublished = true
    }
    
    if (category) {
      filters.category = category
    }
    
    if (minPrice || maxPrice) {
      filters.price = {}
      if (minPrice) filters.price.$gte = Number(minPrice)
      if (maxPrice) filters.price.$lte = Number(maxPrice)
    }
    
    // Búsqueda de texto
    if (search) {
      filters.$text = { $search: search }
    }
    
    // Configurar paginación
    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))
    const skip = (pageNum - 1) * limitNum
    
    // Configurar ordenamiento
    const sortOptions: any = {}
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1
    
    // Ejecutar consultas en paralelo
    const [products, totalCount] = await Promise.all([
      Product.find(filters)
        .populate('author', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(), // Usar lean() para mejor rendimiento
      Product.countDocuments(filters)
    ])
    
    // Calcular metadatos de paginación
    const totalPages = Math.ceil(totalCount / limitNum)
    const hasNextPage = pageNum < totalPages
    const hasPrevPage = pageNum > 1
    
    return {
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        category,
        minPrice,
        maxPrice,
        search,
        published
      }
    }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener productos'
    })
  }
})
```

### Obtener Producto por ID

Crea `server/api/products/[id].get.ts`:

```typescript
import { Product } from '~/server/models/Product'
import { isValidObjectId } from 'mongoose'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    
    const id = getRouterParam(event, 'id')
    
    // Validar ObjectId
    if (!isValidObjectId(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto inválido'
      })
    }
    
    // Buscar producto
    const product = await Product.findById(id)
      .populate('author', 'name email image')
      .populate('reviews.user', 'name image')
    
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
      })
    }
    
    // Incrementar vistas (opcional)
    // await Product.findByIdAndUpdate(id, { $inc: { views: 1 } })
    
    return {
      success: true,
      data: product
    }
    
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener el producto'
    })
  }
})
```

### Actualizar Producto

Crea `server/api/products/[id].put.ts`:

```typescript
import { Product } from '~/server/models/Product'
import { requireAuth } from '~/server/utils/auth'
import { z } from 'zod'

const updateProductSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(2000).optional(),
  price: z.number().min(0).optional(),
  category: z.enum(['electronics', 'clothing', 'books', 'home', 'sports', 'other']).optional(),
  images: z.array(z.string().url()).optional(),
  stock: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
  isPublished: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación
    const session = await requireAuth(event)
    
    await connectDB()
    
    const id = getRouterParam(event, 'id')
    
    if (!isValidObjectId(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto inválido'
      })
    }
    
    // Buscar producto
    const product = await Product.findById(id)
    
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
      })
    }
    
    // Verificar permisos (solo el autor o admin puede editar)
    if (product.author.toString() !== session.user.id && session.user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos para editar este producto'
      })
    }
    
    // Validar datos
    const body = await readBody(event)
    const validatedData = updateProductSchema.parse(body)
    
    // Actualizar producto
    Object.assign(product, validatedData)
    
    // Si se está publicando por primera vez, establecer publishedAt
    if (validatedData.isPublished && !product.publishedAt) {
      product.publishedAt = new Date()
    }
    
    await product.save()
    
    // Poblar datos relacionados
    await product.populate('author', 'name email')
    
    return {
      success: true,
      data: product,
      message: 'Producto actualizado exitosamente'
    }
    
  } catch (error) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de entrada inválidos',
        data: error.errors
      })
    }
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al actualizar el producto'
    })
  }
})
```

### Eliminar Producto (Soft Delete)

Crea `server/api/products/[id].delete.ts`:

```typescript
import { Product } from '~/server/models/Product'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    
    await connectDB()
    
    const id = getRouterParam(event, 'id')
    
    if (!isValidObjectId(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto inválido'
      })
    }
    
    const product = await Product.findById(id)
    
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
      })
    }
    
    // Verificar permisos
    if (product.author.toString() !== session.user.id && session.user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos para eliminar este producto'
      })
    }
    
    // Soft delete
    product.isActive = false
    await product.save()
    
    return {
      success: true,
      message: 'Producto eliminado exitosamente'
    }
    
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al eliminar el producto'
    })
  }
})
```

## 🎨 Componentes Frontend

### Composable para Productos

Crea `composables/useProducts.ts`:

```typescript
import type { IProduct } from '~/server/models/Product'

interface ProductFilters {
  page?: number
  limit?: number
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const useProducts = () => {
  const products = ref<IProduct[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  const fetchProducts = async (filters: ProductFilters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch('/api/products', {
        query: filters
      })
      
      products.value = data.data
      pagination.value = data.pagination
      
    } catch (err: any) {
      error.value = err.message || 'Error al cargar productos'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch(`/api/products/${id}`)
      return data.data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar producto'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData: Partial<IProduct>) => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch('/api/products', {
        method: 'POST',
        body: productData
      })
      
      return data.data
    } catch (err: any) {
      error.value = err.message || 'Error al crear producto'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: string, productData: Partial<IProduct>) => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: productData
      })
      
      return data.data
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar producto'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await $fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })
      
      // Remover de la lista local
      products.value = products.value.filter(p => p.id !== id)
      
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar producto'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
```

### Lista de Productos

Crea `components/ProductList.vue`:

```vue
<template>
  <div class="space-y-6">
    <!-- Filtros -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Filtros</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Búsqueda -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Buscar</span>
            </label>
            <input 
              v-model="filters.search"
              type="text" 
              placeholder="Nombre, descripción..."
              class="input input-bordered"
              @input="debouncedSearch"
            >
          </div>
          
          <!-- Categoría -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Categoría</span>
            </label>
            <select v-model="filters.category" class="select select-bordered">
              <option value="">Todas</option>
              <option value="electronics">Electrónicos</option>
              <option value="clothing">Ropa</option>
              <option value="books">Libros</option>
              <option value="home">Hogar</option>
              <option value="sports">Deportes</option>
              <option value="other">Otros</option>
            </select>
          </div>
          
          <!-- Precio mínimo -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Precio mín.</span>
            </label>
            <input 
              v-model.number="filters.minPrice"
              type="number" 
              min="0"
              step="0.01"
              class="input input-bordered"
            >
          </div>
          
          <!-- Precio máximo -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Precio máx.</span>
            </label>
            <input 
              v-model.number="filters.maxPrice"
              type="number" 
              min="0"
              step="0.01"
              class="input input-bordered"
            >
          </div>
        </div>
        
        <div class="card-actions justify-end">
          <button @click="applyFilters" class="btn btn-primary">
            Aplicar Filtros
          </button>
          <button @click="clearFilters" class="btn btn-outline">
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-error">
      <Icon name="heroicons:exclamation-triangle" class="w-6 h-6" />
      <span>{{ error }}</span>
    </div>

    <!-- Productos -->
    <div v-else-if="products.length > 0" class="space-y-6">
      <!-- Grid de productos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard 
          v-for="product in products" 
          :key="product.id"
          :product="product"
          @edit="editProduct"
          @delete="deleteProduct"
        />
      </div>
      
      <!-- Paginación -->
      <div class="flex justify-center">
        <div class="join">
          <button 
            class="join-item btn"
            :disabled="!pagination.hasPrevPage"
            @click="goToPage(pagination.currentPage - 1)"
          >
            «
          </button>
          
          <button class="join-item btn btn-active">
            Página {{ pagination.currentPage }} de {{ pagination.totalPages }}
          </button>
          
          <button 
            class="join-item btn"
            :disabled="!pagination.hasNextPage"
            @click="goToPage(pagination.currentPage + 1)"
          >
            »
          </button>
        </div>
      </div>
    </div>

    <!-- Sin productos -->
    <div v-else class="text-center py-12">
      <Icon name="heroicons:cube" class="w-16 h-16 text-base-content/30 mx-auto mb-4" />
      <h3 class="text-xl font-semibold mb-2">No hay productos</h3>
      <p class="text-base-content/60">No se encontraron productos con los filtros aplicados.</p>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'

const { products, loading, error, pagination, fetchProducts, deleteProduct: deleteProductApi } = useProducts()

// Filtros reactivos
const filters = reactive({
  search: '',
  category: '',
  minPrice: null,
  maxPrice: null,
  page: 1,
  limit: 12,
  sortBy: 'createdAt',
  sortOrder: 'desc'
})

// Búsqueda con debounce
const debouncedSearch = debounce(() => {
  applyFilters()
}, 500)

const applyFilters = async () => {
  filters.page = 1
  await fetchProducts(filters)
}

const clearFilters = async () => {
  Object.assign(filters, {
    search: '',
    category: '',
    minPrice: null,
    maxPrice: null,
    page: 1
  })
  await fetchProducts(filters)
}

const goToPage = async (page: number) => {
  filters.page = page
  await fetchProducts(filters)
}

const editProduct = (product) => {
  // Navegar a página de edición
  navigateTo(`/admin/products/${product.id}/edit`)
}

const deleteProduct = async (product) => {
  if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
    try {
      await deleteProductApi(product.id)
      // Recargar lista
      await fetchProducts(filters)
    } catch (error) {
      alert('Error al eliminar el producto')
    }
  }
}

// Cargar productos al montar
onMounted(() => {
  fetchProducts(filters)
})

// Observar cambios en filtros
watch([() => filters.category, () => filters.minPrice, () => filters.maxPrice], () => {
  applyFilters()
})
</script>
```

### Tarjeta de Producto

Crea `components/ProductCard.vue`:

```vue
<template>
  <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
    <!-- Imagen -->
    <figure class="relative">
      <img 
        :src="product.images?.[0] || '/placeholder-product.jpg'" 
        :alt="product.name"
        class="w-full h-48 object-cover"
      >
      
      <!-- Badge de estado -->
      <div class="absolute top-2 left-2">
        <div 
          class="badge"
          :class="{
            'badge-success': product.isPublished && product.stock > 0,
            'badge-warning': product.isPublished && product.stock === 0,
            'badge-error': !product.isPublished
          }"
        >
          {{ getStatusText() }}
        </div>
      </div>
      
      <!-- Rating -->
      <div v-if="product.averageRating > 0" class="absolute top-2 right-2">
        <div class="badge badge-primary">
          <Icon name="heroicons:star-solid" class="w-3 h-3 mr-1" />
          {{ product.averageRating }}
        </div>
      </div>
    </figure>
    
    <div class="card-body">
      <!-- Título y categoría -->
      <div class="flex justify-between items-start mb-2">
        <h2 class="card-title text-lg">{{ product.name }}</h2>
        <div class="badge badge-outline">{{ getCategoryName() }}</div>
      </div>
      
      <!-- Descripción -->
      <p class="text-sm text-base-content/70 line-clamp-2">
        {{ product.description }}
      </p>
      
      <!-- Precio y stock -->
      <div class="flex justify-between items-center mt-4">
        <div class="text-2xl font-bold text-primary">
          ${{ formatPrice(product.price) }}
        </div>
        <div class="text-sm text-base-content/60">
          Stock: {{ product.stock }}
        </div>
      </div>
      
      <!-- Tags -->
      <div v-if="product.tags?.length" class="flex flex-wrap gap-1 mt-2">
        <div 
          v-for="tag in product.tags.slice(0, 3)" 
          :key="tag"
          class="badge badge-sm badge-ghost"
        >
          {{ tag }}
        </div>
        <div v-if="product.tags.length > 3" class="badge badge-sm badge-ghost">
          +{{ product.tags.length - 3 }}
        </div>
      </div>
      
      <!-- Acciones -->
      <div class="card-actions justify-end mt-4">
        <button 
          @click="$emit('view', product)"
          class="btn btn-sm btn-outline"
        >
          <Icon name="heroicons:eye" class="w-4 h-4" />
          Ver
        </button>
        
        <button 
          @click="$emit('edit', product)"
          class="btn btn-sm btn-primary"
        >
          <Icon name="heroicons:pencil" class="w-4 h-4" />
          Editar
        </button>
        
        <button 
          @click="$emit('delete', product)"
          class="btn btn-sm btn-error"
        >
          <Icon name="heroicons:trash" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
interface Props {
  product: any
}

const props = defineProps<Props>()

defineEmits(['view', 'edit', 'delete'])

const getStatusText = () => {
  if (!props.product.isPublished) return 'Borrador'
  if (props.product.stock === 0) return 'Agotado'
  return 'Disponible'
}

const getCategoryName = () => {
  const categories = {
    electronics: 'Electrónicos',
    clothing: 'Ropa',
    books: 'Libros',
    home: 'Hogar',
    sports: 'Deportes',
    other: 'Otros'
  }
  return categories[props.product.category] || props.product.category
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
```

## 🔍 Consultas Avanzadas

### Agregaciones

```typescript
// server/api/products/stats.get.ts
export default defineEventHandler(async (event) => {
  await connectDB()
  
  const stats = await Product.aggregate([
    {
      $match: { isPublished: true, isActive: true }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        totalStock: { $sum: '$stock' },
        avgRating: { $avg: '$averageRating' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ])
  
  return { success: true, data: stats }
})
```

### Búsqueda con Texto Completo

```typescript
// server/api/products/search.get.ts
export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)
  
  if (!q) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Parámetro de búsqueda requerido'
    })
  }
  
  await connectDB()
  
  const products = await Product.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(20)
  .populate('author', 'name')
  
  return { success: true, data: products }
})
```

## 🎯 Conclusión

¡Felicidades! Ahora dominas completamente la gestión de datos en NuxtFast:

- ✅ **Conexión a MongoDB** configurada y optimizada
- ✅ **Modelos robustos** con validación y middleware
- ✅ **API CRUD completa** con autenticación y autorización
- ✅ **Componentes frontend** reactivos y funcionales
- ✅ **Consultas avanzadas** y agregaciones
- ✅ **Mejores prácticas** de seguridad y rendimiento

### Próximos Pasos

1. **Implementa caching** con Redis para mejor rendimiento
2. **Agrega validación** más avanzada con Joi o Yup
3. **Implementa búsqueda** con Elasticsearch
4. **Agrega tests** unitarios y de integración
5. **Configura backups** automáticos de la base de datos

¿Necesitas ayuda implementando alguna funcionalidad específica? ¡La comunidad de NuxtFast está aquí para apoyarte!

---

*¿Te ha sido útil esta guía? Compártela con otros desarrolladores y ayúdanos a hacer crecer la comunidad.* 🚀 