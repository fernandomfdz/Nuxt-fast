export interface Organization {
  id: string
  name: string
  slug: string
  logo?: string
  metadata?: Record<string, unknown>
  createdAt: string
  activeOrganizationId?: string
  memberCount?: number
  teamCount?: number
}

export interface Member {
  id: string
  userId: string
  organizationId: string
  role: string
  createdAt: string
  user?: {
    id: string
    name?: string
    email: string
    image?: string
  }
}

export interface CreateOrganizationInput {
  name: string
  slug: string
  logo?: string
  metadata?: Record<string, unknown>
}

declare global {
  interface Organization {
    id: string
    name: string
    slug: string
    logo?: string
    metadata?: Record<string, unknown>
    createdAt: string
    activeOrganizationId?: string
    memberCount?: number
    teamCount?: number
  }
} 