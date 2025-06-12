import { ServerPropsWithI18n } from '../../types/serverProps'
import { checkPlatformInitialization } from './checkPlatformInitialization'
import InitialMessage from './InitialMessage'
import { PleaseSetup } from './PleaseSetup'

export const AdminBeforeDashboard = async (props: ServerPropsWithI18n) => {
  const components: React.ReactNode[] = []
  const t = props.i18n.t

  const data = await checkPlatformInitialization(props)

  const { hasClassrooms, hasUsers, hasTeachers, hasParents } = data

  if (!hasClassrooms && !hasTeachers && !hasParents) {
    return <PleaseSetup {...props} platformInitializationStatus={data} />
  }

  if (!hasClassrooms) {
    components.push(<InitialMessage {...props} key="initial-message1" />)
  }

  if (!hasUsers) {
    components.push(<InitialMessage {...props} key="initial-message2" />)
  }

  if (!hasTeachers) {
    components.push(<InitialMessage {...props} key="initial-message3" />)
  }

  if (!hasParents) {
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
