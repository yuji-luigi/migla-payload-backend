import { APIError, Payload } from 'payload'
import { Classroom, Teacher, User } from '../../payload-types'

/**
 * @description Find the teacher role of a user from 'teachers' collection
 */
export async function findTeacherRoleOfUser({
  user,
  payload,
}: {
  user: Partial<User>
  payload: Payload
}): Promise<(Teacher & { classroom: Classroom }) | null> {
  const teacherPag = await payload.find({
    collection: 'teachers',
    where: { user: { equals: user.id } },
  })

  // if (teacherPag.docs.length === 0) {
  //   payload.logger.warn(
  //     'finding teacherPag that has no teacher role. function findTeacherRoleOfUser.\n',
  //     {
  //       userId: user.id,
  //     },
  //   )
  // }
  if (teacherPag.docs.length > 1) {
    throw new APIError(
      'Multiple teachers found for user. please contact admin to fix this issue', // NOTE: the referenced user has more than one teacher associated need to be fixed(set only one teacherPag)
      400,
      null,
      true,
    )
  }

  if (!teacherPag.docs[0]) {
    throw new Error('Teacher not found')
  }

  // type guard to check if the classroom is present in the teacher document
  if (!teacherPag.docs[0] || !teacherPag.docs[0].classroom) {
    throw new APIError('Teacher or classroom not found', 400, null, true)
  }

  // I can assert the classroom is in the teacher document
  return teacherPag.docs[0] as Teacher & { classroom: Classroom }
}
