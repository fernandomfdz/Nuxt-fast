import { useShare as useVueUseShare } from '@vueuse/core'

export interface ShareOptions {
  title: string
  text: string
  url: string
}

export interface SocialShareOptions {
  platform: 'whatsapp' | 'twitter' | 'telegram' | 'instagram' | 'copy'
  title: string
  text: string
  url: string
}

export const useShare = () => {
  const { share: nativeShare, isSupported } = useVueUseShare()

  // Función para compartir nativamente (Web Share API)
  const shareNative = async (options: ShareOptions) => {
    if (isSupported.value) {
      try {
        await nativeShare(options)
        return true
      } catch (error) {
        console.error('Error sharing:', error)
        return false
      }
    }
    return false
  }

  // Función para copiar al portapapeles
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fallback para navegadores que no soportan clipboard API
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const result = document.execCommand('copy')
        document.body.removeChild(textArea)
        return result
      } catch (fallbackError) {
        console.error('Error copying to clipboard:', fallbackError)
        return false
      }
    }
  }

  // Función para compartir en redes sociales específicas
  const shareToSocial = (options: SocialShareOptions) => {
    const { platform, title: _title, text, url } = options
    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(url)

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      instagram: '', // Instagram no permite compartir URLs directamente
      copy: url
    }

    if (platform === 'copy') {
      return copyToClipboard(url)
    }

    if (platform === 'instagram') {
      // Para Instagram, solo podemos copiar el enlace
      copyToClipboard(url)
      // Mostrar mensaje informativo
      return false
    }

    const shareUrl = shareUrls[platform]
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      return true
    }

    return false
  }

  // Función principal de compartir que intenta usar Web Share API primero
  const shareContent = async (options: ShareOptions) => {
    // Intentar usar Web Share API nativo primero
    const nativeShareSuccess = await shareNative(options)
    
    if (!nativeShareSuccess) {
      // Si no funciona, mostrar opciones de redes sociales
      return false
    }
    
    return true
  }

  return {
    shareContent,
    shareToSocial,
    copyToClipboard,
    isNativeShareSupported: isSupported
  }
} 