export default defineNuxtPlugin(() => {
  // Solo ejecutar en el cliente
  if (import.meta.client) {
    // Obtener tema guardado o usar 'system' por defecto
    const savedTheme = localStorage.getItem('theme') || 'system'
    
    // Función para aplicar el tema
    const applyTheme = (theme: string) => {
      const html = document.documentElement
      
      if (theme === 'system') {
        // Detectar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        html.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
      } else {
        html.setAttribute('data-theme', theme)
      }
    }
    
    // Aplicar tema inicial
    applyTheme(savedTheme)
    
    // Escuchar cambios en la preferencia del sistema
    if (savedTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        if (localStorage.getItem('theme') === 'system') {
          applyTheme('system')
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
    }
  }
}) 