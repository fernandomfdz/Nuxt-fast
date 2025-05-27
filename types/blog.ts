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
  publishedAt?: string
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