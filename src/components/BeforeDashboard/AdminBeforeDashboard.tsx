import { ServerProps } from 'payload'

export const AdminBeforeDashboard = async (props: ServerProps) => {
  const components: React.ReactNode[] = []
  const pagClassrooms = await props.payload.find({
    collection: 'classrooms',
    limit: 1,
  })

  if (pagClassrooms.totalDocs === 0) {
    components.push(<div key="no-classrooms"></div>)
  }
  return (
    <section className="admin-before-dashboard dashboard__group">
      <h2 className="dashboard__label">{props.i18n.t('dashboard:setup')}</h2>
      {components.map((component) => component)}
    </section>
  )
}
export default AdminBeforeDashboard
