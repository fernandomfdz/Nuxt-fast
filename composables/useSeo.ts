import { config } from '~/config'

interface SEOTags {
  title?: string
  description?: string
  keywords?: string[]
  openGraph?: {
    title?: string
    description?: string
    url?: string
    image?: string
  }
  canonicalUrlRelative?: string
  extraTags?: Record<string, any>
}

/**
 * Composable para manejar las etiquetas SEO en la aplicación.
 * Ya está añadido en el layout por defecto, pero se recomienda establecer la URL canónica para cada página.
 * @example
 * ```ts
 * const { setSEOTags } = useSeo()
 * setSEOTags({ canonicalUrlRelative: '/' })
 * ```
 */
export const useSeo = () => {
  const setSEOTags = ({
    title,
    description,
    keywords,
    openGraph,
    canonicalUrlRelative,
    extraTags
  }: SEOTags = {}) => {
    const seoMeta = {
      title: title || config.appName,
      description: description || config.appDescription,
      keywords: keywords || [config.appName],
      applicationName: config.appName,
      ogTitle: openGraph?.title || config.appName,
      ogDescription: openGraph?.description || config.appDescription,
      ogUrl: openGraph?.url || `https://${config.domainName}/`,
      ogSiteName: openGraph?.title || config.appName,
      ogLocale: 'es_ES',
      ogType: 'website',
      twitterTitle: openGraph?.title || config.appName,
      twitterDescription: openGraph?.description || config.appDescription,
      twitterCard: 'summary_large_image',
      twitterCreator: '@marc_louvion',
      ...extraTags
    }

    // Si se proporciona una URL canónica, la añadimos
    if (canonicalUrlRelative) {
      seoMeta.canonical = canonicalUrlRelative
    }

    // Usar el composable useHead de Nuxt
    useHead({
      title: seoMeta.title,
      meta: [
        { name: 'description', content: seoMeta.description },
        { name: 'keywords', content: seoMeta.keywords.join(', ') },
        { name: 'application-name', content: seoMeta.applicationName },
        { property: 'og:title', content: seoMeta.ogTitle },
        { property: 'og:description', content: seoMeta.ogDescription },
        { property: 'og:url', content: seoMeta.ogUrl },
        { property: 'og:site_name', content: seoMeta.ogSiteName },
        { property: 'og:locale', content: seoMeta.ogLocale },
        { property: 'og:type', content: seoMeta.ogType },
        { name: 'twitter:title', content: seoMeta.twitterTitle },
        { name: 'twitter:description', content: seoMeta.twitterDescription },
        { name: 'twitter:card', content: seoMeta.twitterCard },
        { name: 'twitter:creator', content: seoMeta.twitterCreator }
      ],
      link: canonicalUrlRelative
        ? [{ rel: 'canonical', href: canonicalUrlRelative }]
        : []
    })
  }

  /**
   * Genera datos estructurados para resultados enriquecidos en Google.
   * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
   */
  const setSchemaMarkup = () => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'http://schema.org',
            '@type': 'SoftwareApplication',
            name: config.appName,
            description: config.appDescription,
            image: `https://${config.domainName}/icon.png`,
            url: `https://${config.domainName}/`,
            author: {
              '@type': 'Person',
              name: 'Marc Lou'
            },
            datePublished: '2023-08-01',
            applicationCategory: 'EducationalApplication',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '12'
            },
            offers: [
              {
                '@type': 'Offer',
                price: '9.00',
                priceCurrency: 'USD'
              }
            ]
          })
        }
      ]
    })
  }

  return {
    setSEOTags,
    setSchemaMarkup
  }
} 