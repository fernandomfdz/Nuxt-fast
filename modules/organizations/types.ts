// Tipos centralizados para el módulo de organizaciones

export interface Organization {
  id: string
  name: string
  slug: string
  metadata?: {
    description?: string
    logo?: string
  }
  createdAt: string
  updatedAt?: string
}

export interface Member {
  id: string
  userId: string
  organizationId: string
  role: string
  createdAt: string | Date
  user?: {
    id: string
    name?: string
    email: string
    image?: string
  }
}

export interface Invitation {
  id: string
  organizationId: string
  email: string
  role: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  createdAt: string | Date
  expiresAt: string | Date
}

export interface Team {
  id: string
  name: string
  description?: string
  organizationId: string
  createdAt: string
  memberCount?: number
  members?: Member[]
}

// Input types para formularios
export interface CreateOrganizationInput {
  name: string
  slug: string
  logo?: string
  metadata?: Record<string, unknown>
}

export interface UpdateOrganizationInput {
  name?: string
  slug?: string
  description?: string
  logo?: string
  metadata?: Record<string, unknown>
}

export interface CreateTeamInput {
  name: string
  description?: string
}

export interface UpdateTeamInput {
  name?: string
  description?: string
}

// Response types para API
export interface OrganizationsResponse {
  organizations: Organization[]
}

export interface MembersResponse {
  members: Member[]
  invitations: Invitation[]
}

export interface TeamsResponse {
  teams: Team[]
}

// Estados de error comunes
export interface OrganizationError {
  message: string
  code?: string
  field?: string
}

// Roles de organización
export const OrganizationRoles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
} as const

export type OrganizationRole = typeof OrganizationRoles[keyof typeof OrganizationRoles]

// Estados de invitación
export const InvitationStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  EXPIRED: 'expired'
} as const

export type InvitationStatusType = typeof InvitationStatus[keyof typeof InvitationStatus] 