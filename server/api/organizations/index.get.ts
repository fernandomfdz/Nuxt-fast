export default defineEventHandler(async (_event) => {
  // Mock de datos para probar
  return {
    organizations: [
      {
        id: '1',
        name: 'Mi Primera Organización',
        slug: 'mi-primera-organizacion',
        createdAt: new Date().toISOString(),
        metadata: {
          description: 'Esta es mi primera organización de prueba'
        }
      }
    ]
  }
}) 