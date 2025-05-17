import { APIError, CollectionBeforeChangeHook } from 'payload'
import { findTeacherRoleOfUser } from '../access/filters/findTeacherRoleOfUser'
import { getStudents } from './getStudents'

/**
 * @description When teacher creates a report or homework, this hook will set the createdBy, teacher, and students fields.
 * TODO: need to configure when the createdBy is admin. need to pass the teacher id from the request to create the flexibility for admin. Now disable any create/update by admin
 */
export const teacherOperationBeforeChange: CollectionBeforeChangeHook = async ({
  req,
  operation,
  originalDoc,
  data,
}) => {
  const payload = req.payload
  if (!req.user) {
    throw new Error('User not authenticated')
  }
  if (req.user.currentRole?.isAdminLevel) {
    throw new APIError(
      'Now only user with teacher role can execute these operations.',
      403,
      null,
      true,
    )
  }
  if (operation === 'update') {
    // return
  }
  data.createdBy = req.user.id

  const teacher = await findTeacherRoleOfUser({ payload, user: req.user })

  const classroomId =
    typeof teacher.classroom == 'number' ? teacher.classroom : teacher.classroom.id

  // Step 2: Get all students in that classroom
  const students = await getStudents({ payload, classroomId })
  data.teacher = teacher.id
  data.students = students.map((student) => student.id)
}
