import { ClientUser } from 'payload'
import { Role, User } from '../payload-types'

/**
 * @description returns true if the user is an admin or super admin
 */
export function isAdmin(user: User | ClientUser | null): boolean {
  if (user?.currentRole.isAdminLevel) {
    return true
  }
  return false
}
export function isSuperAdmin(user: User | ClientUser | null): boolean {
  if (user?.roles && user.currentRole('super_admin')) {
    return true
  }
  return false
}

function getIsAdmin(hydratedRoles: (Role | number)[]) {
  return hydratedRoles
    ?.map((role) => (typeof role === 'object' ? role.slug : null))
    .some((role) => role === 'admin' || role === 'super_admin')
}
