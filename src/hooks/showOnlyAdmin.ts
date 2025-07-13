import { ClientUser } from 'payload'
import { Role, User } from '../payload-types'

/**
 * @description returns true if the user is an admin or super admin
 */
export function isAdmin(user: User | ClientUser | null): boolean {
  if (user?.currentRole?.isAdmin) {
    return true
  }
  return false
}
export function isSuperAdmin(user: ClientUser | User | null): boolean {
  if (user?.currentRole?.isSuperAdmin) {
    return true
  }
  return false
}

export function isAboveAdmin(user: ClientUser | User | null): boolean {
  if (user?.currentRole?.isSuperAdmin || user?.currentRole?.isAdmin) {
    return true
  }
  return false
}

function getIsAdmin(hydratedRoles: (Role | number)[]) {
  return hydratedRoles
    ?.map((role) => (typeof role === 'object' ? role.slug : null))
    .some((role) => role === 'admin' || role === 'super_admin')
}
