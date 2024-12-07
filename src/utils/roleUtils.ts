export const ROLES = {
  ADMIN: 'ADMINISTRADOR',
  SELLER: 'VENDEDOR',
  CUSTOMER: 'CLIENTE',
} as const

export type RoleKey = keyof typeof ROLES
export type RoleValue = (typeof ROLES)[RoleKey]

export const getRoleLabel = (role: RoleKey): RoleValue => ROLES[role]

export const roleOptions = Object.entries(ROLES).map(([key, value]) => ({
  value: key,
  label: value,
}))
