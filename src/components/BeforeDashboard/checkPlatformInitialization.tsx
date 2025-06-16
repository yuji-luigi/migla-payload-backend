import { ServerPropsWithI18n } from '../../types/serverProps'

export const checkPlatformInitialization = async (props: ServerPropsWithI18n) => {
  const pagRoles = await props.payload.find({
    collection: 'roles',
  })
  const pagClassrooms = await props.payload.find({
    collection: 'classrooms',
    limit: 1,
  })
  const pagUsers = await props.payload.find({
    collection: 'users',
    limit: 1,
  })
  const pagTeachers = await props.payload.find({
    collection: 'users',
    limit: 1,
    where: {
      roles: { in: pagRoles.docs.filter((role) => role.isTeacher).map((role) => role.id) },
    },
  })
  const pagParents = await props.payload.find({
    collection: 'users',
    limit: 1,
    where: {
      roles: { in: pagRoles.docs.filter((role) => role.isParent).map((role) => role.id) },
    },
  })

  return {
    hasRoles: pagRoles.totalDocs > 0,
    hasClassrooms: pagClassrooms.totalDocs > 0,
    hasUsers: pagUsers.totalDocs > 1,
    hasTeachers: pagTeachers.totalDocs > 0,
    hasParents: pagParents.totalDocs > 0,
    roles: pagRoles.docs,
    classrooms: pagClassrooms.docs,
    users: pagUsers.docs,
    teachers: pagTeachers.docs,
    parents: pagParents.docs,
  }
}

export type PlatformInitializationStatus = Awaited<ReturnType<typeof checkPlatformInitialization>>
