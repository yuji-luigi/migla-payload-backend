import { ServerPropsWithI18n } from '../../../types/serverProps'
import { checkPlatformInitialization } from '../checkPlatformInitialization'
import styles from './BeforeDashboardAdminRole.module.css'
import SettingsSection from './SettingsSection'
export const BeforeDashboardAdminRole = async (props: ServerPropsWithI18n) => {
  const components: React.ReactNode[] = []
  const t = props.i18n.t

  const data = await checkPlatformInitialization(props)

  const { hasClassrooms, hasUsers, hasTeachers, hasParents } = data
  return (
    <>
      <div className={`${styles.section} card`}>
        <h2 className={styles.title}>{props.i18n.t('dashboard:please_initialize')}</h2>
        <div className={`divider ${styles.fullWidth}`}></div>

        <SettingsSection platformInitializationStatus={data} />
      </div>
    </>
  )
}
export default BeforeDashboardAdminRole
