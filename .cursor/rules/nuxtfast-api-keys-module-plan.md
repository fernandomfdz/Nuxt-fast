# 🧩 Plan de Implementación del Módulo `api-keys` para NuxtFast

## 🧠 Objetivo

Este módulo permite a los usuarios de NuxtFast generar y gestionar **API Keys seguras y configurables** para el acceso programático a su proyecto, ya sea a nivel personal o de organización.

## ✅ Funcionalidades que ofrece el módulo al activarse

### 1. Gestión de API Keys
- Visualización de API Keys creadas.
- Creación de nuevas API Keys con:
  - Nombre identificativo.
  - Scopes seleccionables.
  - Fecha de expiración (opcional).
  - Restricciones por IP.
  - **Rate limit**: número de peticiones por intervalo.
  - **Quota limit**: número total de peticiones permitidas.

### 2. Gestión organizacional (si el usuario es admin)
- Posibilidad de crear y gestionar claves a nivel de organización.
- API Keys vinculadas a `organizationId` visibles solo por admins.
- Filtro entre "Personales" y "Organizacionales".

### 3. Control de uso
- Visualización del consumo de cada clave:
  - Peticiones totales realizadas.
  - Última vez utilizada.
  - Breakdown por endpoint (si Better Auth lo permite).

### 4. Rotación y revocación de claves
- Posibilidad de **revocar** una API Key.
- Posibilidad de **rotar** una API Key (generar nueva y desactivar la anterior).

---

## 🧩 Elementos que modificará o añadirá al ecosistema de NuxtFast

### 🔧 Menú del Dashboard
- Añade entrada al menú lateral izquierdo:
  ```
  [🔑] API Keys → /dashboard/api-keys
  ```
- Visible solo si el usuario tiene permisos `apiKeys:read`.

### 👤 Perfil de usuario
- En `/dashboard/profile`, se añadirá una sección:
  - 🔑 Ver mis API Keys.
  - ➕ Botón para crear nueva API Key personal.
  - Tabla con estado, scopes, expiración, límites y uso.

### 🏢 Vista de Organización (si el módulo `organizations` está activado)
- En `/dashboard/organizations/:id`:
  - Nueva pestaña: `API Keys`.
  - Lista de claves creadas a nivel organizacional.
  - Posibilidad de crear y administrar claves si el usuario es admin.

---

## 📁 Estructura del módulo

```
modules/
└── api-keys/
    ├── config.ts
    ├── components/
    │   ├── ApiKeysList.vue
    │   ├── ApiKeyCreateForm.vue
    │   ├── ApiKeyLimitsForm.vue
    │   ├── ApiKeyUsageChart.vue
    │   ├── ApiKeyDrawer.vue
    ├── composables/
    │   ├── useApiKeys.ts
    │   ├── useApiKeyScopes.ts
    │   └── useApiKeyUsage.ts
    ├── pages/
    │   └── dashboard/
    │       └── api-keys/
    │           └── index.vue
    └── server/
        └── api/
            └── api-keys/
                ├── index.get.ts
                ├── index.post.ts
                ├── [id].patch.ts
                ├── [id].delete.ts
                ├── [id]/rotate.post.ts
                └── [id]/usage.get.ts
```

---

## 🧪 Permisos requeridos

Define en `config.ts`:

```ts
permissions: [
  'apiKeys:create',
  'apiKeys:read',
  'apiKeys:update',
  'apiKeys:delete'
]
```

---

## 📦 Integración con Better Auth

Este módulo depende del plugin `@better-auth/api-key` en el backend. Se debe tener configurado:

- `API_KEY_PLUGIN_ENABLED=true`
- `API_KEY_USAGE_TRACKING=true` (si se quiere mostrar consumo)
- Definir scopes posibles en un archivo `scopes.ts`.

---

## 🧠 Prompt de ejemplo para Claude 4 Sonnet

> Implementa un nuevo módulo `api-keys` para NuxtFast siguiendo el patrón del módulo `organizations`. El módulo debe permitir a usuarios y organizaciones (si el usuario es admin) crear, listar, revocar, rotar y configurar límites de uso para claves de API. Usa como base la API y documentación del plugin `@better-auth/api-key`. Añade una nueva entrada en el menú del dashboard y adapta las vistas de perfil de usuario y organizaciones para mostrar la gestión de claves según corresponda. **Utiliza DaisyUI para construir todos los componentes de la interfaz.** Coloca el código dentro del directorio `modules/api-keys/`, usando la Composition API con `<script setup>`.

---

## ✅ Consideraciones Finales

- El módulo debe funcionar de forma autónoma.
- Toda la configuración debe centralizarse en `config.ts`.
- Las rutas deben protegerse por permisos (`useAuth` y `useOrganizations`).
- Los componentes deben ser fácilmente adaptables a diferentes layouts de dashboard.
