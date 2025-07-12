import { CollectionBeforeChangeHook, APIError } from 'payload'
import { findTeacherRoleOfUser } from '../../../access/filters/findTeacherRoleOfUser'
import { User } from '../../../payload-types'
import { extractID } from '../../../utilities/extractID'

export const setQueryBeforeChange: CollectionBeforeChangeHook = async ({
  req,
  operation,
  originalDoc,
  data,
}) => {
  if (req.context.isAdminOperation) {
    return
  }
  if (!req.user?.currentRole) {
    throw new APIError('You must logged in to complete the operation', 403, null, true)
  }
  if (req.user.currentRole.isAdmin) {
    return
  }
  if (req.user.currentRole.isSuperAdmin) {
    return
  }

  if (req.user.currentRole.isTeacher) {
    const foundTeacher = await findTeacherRoleOfUser({ user: req.user, payload: req.payload })
    data.classroom =
      typeof foundTeacher?.classroom === 'object'
        ? foundTeacher?.classroom?.id
        : foundTeacher?.classroom

    return
  }
  throw new APIError('not implemented for non admin, non teacher role. need to set up the logic')
}
