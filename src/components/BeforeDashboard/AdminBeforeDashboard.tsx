import { ServerPropsWithI18n } from '../../types/serverProps'
import InitialMessage from './InitialMessage'

export const AdminBeforeDashboard = async (props: ServerPropsWithI18n) => {
  const components: React.ReactNode[] = []
  const t = props.i18n.t

  const data = await fetchData(props)

  const { pagClassrooms, pagUsers, pagTeachers, pagParents } = data

  if (pagClassrooms.totalDocs === 0) {
    components.push(<InitialMessage {...props} key="initial-message1" />)
  }

  if (pagUsers.totalDocs === 0) {
    components.push(<InitialMessage {...props} key="initial-message2" />)
  }

  if (pagTeachers.totalDocs === 0) {
    components.push(<InitialMessage {...props} key="initial-message3" />)
  }

  if (pagParents.totalDocs === 0) {
    components.push(<InitialMessage {...props} key="initial-message4" />)
  }

  return (
    <section className="admin-before-dashboard">
      <h2 className="dashboard__label">{t('dashboard:setup')}</h2>
      {components.map((component) => component)}
    </section>
  )
}
export default AdminBeforeDashboard

async function fetchData(props: ServerPropsWithI18n) {
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
    pagRoles,
    pagClassrooms,
    pagUsers,
    pagTeachers,
    pagParents,
  }
}
