import { Payload } from 'payload'
import React from 'react'
import { User } from '../../payload-types'

export const TeacherBeforeDashboard = async ({
  payload,
  user,
}: {
  payload: Payload
  user: User
}) => {
  const teacherPages = await payload.find({
    collection: 'teachers',
    where: { user: { equals: user.id } },
    select: {
      name: true,
      classroom: true,
      // user: true,
    },
    populate: {
      classrooms: { name: true },
    },
  })
  const teacher = teacherPages.docs[0]
  console.log(teacher)
  if (teacher && typeof teacher.classroom === 'object') {
    const classroomName =
      teacher.classroom?.name || "Admin must provide a classroom to your account's teacher"
    return (
      <>
        <h3 className="font-bold text-4xl pt-4">
          {teacher.name} {classroomName}
        </h3>
        {/* <pre>{JSON.stringify(teacher, null, 4)}</pre> */}
      </>
    )
  }
}
