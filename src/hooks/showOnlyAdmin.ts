import { Role, User } from '../payload-types'

/**
 * @description returns true if the user is an admin or super admin
 */
export function isAdmin(user: User | null): boolean {
  if (user?.roles && getIsAdmin(user.roles)) {
    return true
  }
  return false
}

function getIsAdmin(hydratedRoles: (Role | number)[]) {
  return hydratedRoles
    ?.map((role) => (typeof role === 'object' ? role.slug : null))
    .some((role) => role === 'admin' || role === 'super_admin')
}
