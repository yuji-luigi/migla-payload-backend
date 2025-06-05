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
  if (req.user.currentRole?.isAdminLevel) {
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

    if (!req.user.currentRole) {
      req.payload.logger.warn('User has no current role', {
        userId: req.user.id,
      })
      return null
    }
    const query = {
      [userKey]: {
        equals: req.user?.id,
      },
    }
    if (shouldSkipAdmin) {
      if (req.user.currentRole?.isAdminLevel) {
        return null
      }
    }
    return query
  }
