import { APIError, BaseListFilter } from 'payload'

export const currentUserFilterNonAdmin: BaseListFilter = async ({ req }) => {
  if (!req.user) {
    throw new APIError('You must be logged in to access this page', 403, null, true)
  }
  const query = {
    createdBy: {
      equals: req.user?.id,
    },
  }
  if (req.user.currentRole == undefined || req.user.currentRole == null) {
    return query
  }
  const role = await req.payload.findByID({ collection: 'roles', id: req.user!.currentRole! })
  if (role?.name == 'admin' || role?.name == 'super_admin') {
    return null
  }
  return query
}
export const currentUserFilter =
  ({
    userKey,
    shouldSkipAdmin = true,
  }: {
    userKey: string
    shouldSkipAdmin?: boolean
  }): BaseListFilter =>
  async ({ req }) => {
    if (!req.user) {
      throw new APIError('You must be logged in to access this page', 403, null, true)
    }
    const query = {
      [userKey]: {
        equals: req.user?.id,
      },
    }
    if (shouldSkipAdmin) {
      const role = await req.payload.findByID({ collection: 'roles', id: req.user!.currentRole! })
      if (role?.name == 'admin' || role?.name == 'super_admin') {
        return null
      }
    }
    return query
  }
