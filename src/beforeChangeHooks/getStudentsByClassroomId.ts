import { Payload } from 'payload'

export async function getStudentsByClassroomId({
  payload,
  classroomId,
}: {
  payload: Payload
  classroomId: number
}) {
  const studentsPag = await payload.find({
    collection: 'students',
    where: {
      classroom: {
        equals: classroomId,
      },
    },
  })
  return studentsPag.docs
}
