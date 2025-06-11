import { ServerPropsWithI18n } from '../../types/serverProps'

export const AdminBeforeDashboard = async (props: ServerPropsWithI18n) => {
  const components: React.ReactNode[] = []
  const t = props.i18n.t
  const pagClassrooms = await props.payload.find({
    collection: 'classrooms',
    limit: 1,
  })

  if (pagClassrooms.totalDocs === 0) {
    components.push(<div key="no-classrooms">There are no classrooms</div>)
  }
  return (
    <section className="admin-before-dashboard">
      <h2 className="dashboard__label">{t('dashboard:setup')}</h2>
      {components.map((component) => component)}
    </section>
  )
}
export default AdminBeforeDashboard
