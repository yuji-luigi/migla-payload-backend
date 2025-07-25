import { ServerPropsWithI18n } from '../../../types/serverProps'
import { checkPlatformInitialization } from '../checkPlatformInitialization'
import { SeedButton } from '../SeedButton'
import styles from './BeforeDashboardAdminRole.module.css'
import SettingsSection from './SettingsSection'
export const BeforeDashboardAdminRole = async (props: ServerPropsWithI18n) => {
  const data = await checkPlatformInitialization(props)
  return (
    <>
      <SeedButton />

      <div className={`${styles.section} card`}>
        <h2 className={styles.title}>{props.i18n.t('dashboard:please_initialize')}</h2>
        <div className={`divider ${styles.fullWidth}`}></div>

        <SettingsSection platformInitializationStatus={data} />
      </div>
    </>
  )
}
export default BeforeDashboardAdminRole
