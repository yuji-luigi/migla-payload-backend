import { APIError, CollectionBeforeChangeHook } from 'payload'
import { findTeacherRoleOfUser } from '../access/filters/findTeacherRoleOfUser'
import { getStudentsByClassroomId } from './getStudentsByClassroomId'
import { ApiError } from 'next/dist/server/api-utils'

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
    throw new APIError('User not authenticated', 401, null, true)
  }
  if (req.user.currentRole?.isAdmin) {
    if (!data.teacher) {
      throw new APIError('Teacher is required', 400, null, true)
    }
    const paginatedClassroom = await payload.find({
      collection: 'classrooms',
      where: {
        teachers: {
          equals: data.teacher,
        },
      },
    })
    if (!paginatedClassroom.docs[0]) {
      throw new APIError('Classroom not found', 400, null, true)
    }
    const students = await getStudentsByClassroomId({
      payload,
      classroomId: paginatedClassroom.docs[0].id,
    })
    data.students = students.map((student) => student.id)
    return
  }

  //NOTE: in case of update do not set the createdBy, teacher, and students fields. it can be modified by the teacher
  if (operation === 'update') {
    return
  }
  data.createdBy = req.user.id

  const teacher = await findTeacherRoleOfUser({ payload, user: req.user })
  if (!teacher) {
    throw new Error('Teacher not found: teacherOperationBeforeChange')
  }
  const classroomId =
    typeof teacher.classroom == 'number' ? teacher.classroom : teacher.classroom.id

  // Step 2: Get all students in that classroom
  const students = await getStudentsByClassroomId({ payload, classroomId })
  data.teacher = teacher.id
  data.students = students.map((student) => student.id)
}
