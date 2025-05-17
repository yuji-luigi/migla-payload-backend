import { APIError, Payload } from 'payload'
import { User } from '../../payload-types'

/**
 * @description Find the teacher role of a user from 'teachers' collection
 */
export async function findTeacherRoleOfUser({
  user,
  payload,
}: {
  user: Partial<User>
  payload: Payload
}) {
  const teacher = await payload.find({
    collection: 'teachers',
    where: { user: { equals: user.id } },
  })
  if (teacher.docs.length === 0) {
    payload.logger.warn(
      'finding teacher that has no teacher role. function findTeacherRoleOfUser.\n',
      {
        userId: user.id,
      },
    )
    return null
  }
  if (teacher.docs.length > 1) {
    throw new APIError(
      'Multiple teachers found for user. please contact admin to fix this issue', // NOTE: the referenced user has more than one teacher associated need to be fixed(set only one teacher)
      400,
      null,
      true,
    )
  }
  return teacher.docs[0]
}
