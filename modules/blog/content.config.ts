import { defineCollection, z } from '@nuxt/content'

export const contentConfig = {
  collections: {
    content: defineCollection({
      source: {
        include: '**',
        exclude: ['**/.*', '!**/.navigation.yml']
      },
      type: 'page',
      // Definir schema para validación de frontmatter del blog
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        publishedAt: z.string().optional(),
        categories: z.array(z.object({
          slug: z.string(),
          title: z.string().optional(),
          titleShort: z.string().optional(),
          description: z.string().optional()
        })).optional(),
        author: z.object({
          slug: z.string().optional(),
          name: z.string(),
          job: z.string().optional(),
          description: z.string().optional(),
          avatar: z.string().optional(),
          socials: z.array(z.object({
            name: z.string(),
            icon: z.string(),
            url: z.string()
          })).optional()
        }).optional(),
        image: z.object({
          src: z.string(),
          urlRelative: z.string().optional(),
          alt: z.string().optional()
        }).optional()
      }).passthrough() // Permite campos adicionales
    })
  }
} as const;