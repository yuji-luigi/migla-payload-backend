import { TFunction } from '@payloadcms/translations'
import { ServerProps } from 'payload'
import { CustomTranslationsKeys } from '../../lib/i18n/i18n_configs'

export const AdminBeforeDashboard = async (props: ServerProps) => {
  const components: React.ReactNode[] = []
  const pagClassrooms = await props.payload.find({
    collection: 'classrooms',
    limit: 1,
  })

  if (pagClassrooms.totalDocs === 0) {
    components.push(<div key="no-classrooms">There are no classrooms</div>)
  }
  return (
    <section className="admin-before-dashboard">
      <h2 className="dashboard__label">
        {(props.i18n.t as unknown as TFunction<CustomTranslationsKeys>)('dashboard:setup')}
      </h2>
      {components.map((component) => component)}
    </section>
  )
}
export default AdminBeforeDashboard
