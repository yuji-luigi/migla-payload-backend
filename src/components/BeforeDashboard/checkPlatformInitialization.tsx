import { ServerPropsWithI18n } from '../../types/serverProps'

export const checkPlatformInitialization = async (props: ServerPropsWithI18n) => {
  const pagRoles = await props.payload.find({
    collection: 'roles',
  })
  const pagClassrooms = await props.payload.find({
    collection: 'classrooms',
  })
  const pagUsers = await props.payload.find({
    collection: 'users',
  })
  const pagTeachers = await props.payload.find({
    collection: 'users',
    where: {
      roles: { in: pagRoles.docs.filter((role) => role.isTeacher).map((role) => role.id) },
    },
  })
  const pagParents = await props.payload.find({
    collection: 'users',
    where: {
      roles: { in: pagRoles.docs.filter((role) => role.isParent).map((role) => role.id) },
    },
  })
  const hasRoles = pagRoles.totalDocs > 0
  const hasClassrooms = pagClassrooms.totalDocs > 0
  const hasUsers = pagUsers.totalDocs > 1
  const hasTeachers = pagTeachers.totalDocs > 0
  const hasParents = pagParents.totalDocs > 0
  return {
    hasRoles,
    hasClassrooms,
    hasUsers,
    hasTeachers,
    hasParents,
    hasAll: hasRoles && hasClassrooms && hasUsers && hasTeachers && hasParents,
    roles: pagRoles.docs,
    classrooms: pagClassrooms.docs,
    users: pagUsers.docs,
    teachers: pagTeachers.docs,
    parents: pagParents.docs,
  }
}

export type PlatformInitializationStatus = Awaited<ReturnType<typeof checkPlatformInitialization>>
