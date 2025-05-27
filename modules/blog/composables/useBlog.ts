export interface Category {
  slug: string
  title: string
  titleShort?: string
  description: string
  descriptionShort?: string
}

export interface Social {
  name: string
  icon: string
  url: string
}

export interface Author {
  slug?: string
  name: string
  job?: string
  description?: string
  avatar?: string
  socials?: Social[]
}

export interface Article {
  slug: string
  title: string
  description?: string
  categories?: Category[]
  author?: Author
  publishedAt: string
  image?: {
    src: string
    urlRelative?: string
    alt?: string
  }
  content?: {
    body: string
  }
  // Campos adicionales de Nuxt Content v3
  path?: string
  id?: string
  type?: string
  body?: unknown
} 

export const useBlog = () => {
  // Cache para las categorías y autores
  let categoriesCache: Category[] | null = null
  let authorsCache: Author[] | null = null

  // Función para obtener categorías completas
  const getCategoriesData = async (): Promise<Category[]> => {
    if (categoriesCache) return categoriesCache

    try {
      const categoriesFile = await $fetch('/api/categories') as { categories: Category[] }
      categoriesCache = categoriesFile?.categories || []
      return categoriesCache
    } catch (error) {
      console.error('Error getting categories data:', error)
      categoriesCache = []
      return categoriesCache
    }
  }

  // Función para obtener autores completos
  const getAuthorsData = async (): Promise<Author[]> => {
    if (authorsCache) return authorsCache

    try {
      const authorsFile = await $fetch('/api/authors') as { authors: Author[] }
      authorsCache = authorsFile?.authors || []
      return authorsCache
    } catch (error) {
      console.error('Error getting authors data:', error)
      authorsCache = []
      return authorsCache
    }
  }

  // Función para enriquecer categorías y autor de artículos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enrichArticleCategories = async (article: any): Promise<Article> => {
    const allCategories = await getCategoriesData()
    const allAuthors = await getAuthorsData()
    
    // En Nuxt Content v3, los datos del frontmatter están en article directamente
    const categories = article.categories || []
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enrichedCategories = categories.map((cat: any) => {
      // Si la categoría solo tiene slug, buscar la información completa
      if (typeof cat === 'object' && cat.slug && !cat.title) {
        const fullCategory = allCategories.find(fullCat => fullCat.slug === cat.slug)
        return fullCategory || cat
      }
      return cat
    })

    // Enriquecer autor si solo tiene slug
    let enrichedAuthor = article.author
    if (article.author && typeof article.author === 'object' && article.author.slug && !article.author.name) {
      const fullAuthor = allAuthors.find(author => author.slug === article.author.slug)
      enrichedAuthor = fullAuthor || article.author
    }

    // Extraer slug del path
    const slug = article.path?.replace('/blog/', '') || article.slug || 'untitled'

    return {
      ...article,
      slug,
      categories: enrichedCategories,
      author: enrichedAuthor,
      publishedAt: article.publishedAt || new Date().toISOString().split('T')[0]
    } as Article
  }

  // Obtener todos los artículos usando queryCollection de Nuxt Content v3
  const { data: articles } = useAsyncData('blog-articles', async () => {
    try {
      // Usar la nueva API de Nuxt Content v3
      const rawArticles = await queryCollection('content')
        .where('path', 'LIKE', '/blog/%')
        .where('path', 'NOT LIKE', '/blog/categories%')
        .where('path', 'NOT LIKE', '/blog/authors%')
        .all()
      
      // Enriquecer artículos con categorías completas
      const enrichedArticles = await Promise.all(
        rawArticles.map(article => enrichArticleCategories(article))
      )
      
      // Ordenar por fecha de publicación (más recientes primero)
      return enrichedArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    } catch (error) {
      console.error('Error loading articles:', error)
      return []
    }
  })

  const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    try {
      const article = await queryCollection('content')
        .where('path', '=', `/blog/${slug}`)
        .first()
      
      if (!article) return null
      
      return await enrichArticleCategories(article)
    } catch (error) {
      console.error('Error getting article by slug:', error)
      return null
    }
  }

  const getArticlesByCategory = async (categorySlug: string): Promise<Article[]> => {
    try {
      const allArticles = articles.value || []
      
      const filtered = allArticles.filter(article => 
        article.categories?.some(cat => cat.slug === categorySlug)
      )
      
      return filtered
    } catch (error) {
      console.error('Error getting articles by category:', error)
      return []
    }
  }

  const getRelatedArticles = async (currentArticle: Article, limit: number = 3): Promise<Article[]> => {
    try {
      const allArticles = articles.value || []
      
      // Filtrar artículos que no sean el actual
      const otherArticles = allArticles.filter(article => article.slug !== currentArticle.slug)
      
      // Obtener categorías del artículo actual
      const currentCategories = currentArticle.categories?.map(cat => cat.slug) || []
      
      // Calcular puntuación de relevancia para cada artículo
      const articlesWithScore = otherArticles.map(article => {
        const articleCategories = article.categories?.map(cat => cat.slug) || []
        const sharedCategories = articleCategories.filter(cat => currentCategories.includes(cat))
        
        return {
          article,
          score: sharedCategories.length
        }
      })
      
      // Ordenar por puntuación (más categorías compartidas primero) y luego por fecha
      const sortedArticles = articlesWithScore
        .filter(item => item.score > 0) // Solo artículos con al menos una categoría compartida
        .sort((a, b) => {
          if (a.score !== b.score) {
            return b.score - a.score // Mayor puntuación primero
          }
          // Si tienen la misma puntuación, ordenar por fecha (más recientes primero)
          return new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime()
        })
        .slice(0, limit)
        .map(item => item.article)
      
      // Si no hay suficientes artículos relacionados, completar con los más recientes
      if (sortedArticles.length < limit) {
        const recentArticles = otherArticles
          .filter(article => !sortedArticles.some(related => related.slug === article.slug))
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, limit - sortedArticles.length)
        
        sortedArticles.push(...recentArticles)
      }
      
      return sortedArticles
    } catch (error) {
      console.error('Error getting related articles:', error)
      return []
    }
  }

  const getArticlesByAuthor = async (authorSlug: string): Promise<Article[]> => {
    try {
      const allArticles = articles.value || []
      
      const authorArticles = allArticles.filter(article => {
        return article.author?.slug === authorSlug
      })
      
      return authorArticles
    } catch (error) {
      console.error('Error getting articles by author:', error)
      return []
    }
  }

  const getCategories = async (): Promise<Category[]> => {
    return await getCategoriesData()
  }

  const getAuthors = async (): Promise<Author[]> => {
    return await getAuthorsData()
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return {
    articles: computed(() => articles.value || []),
    getArticleBySlug,
    getArticlesByCategory,
    getRelatedArticles,
    getArticlesByAuthor,
    getCategories,
    getAuthors,
    formatDate
  }
} 