import { I18n } from '@payloadcms/translations'
import { Payload, ServerProps } from 'payload'
import styles from './actions.module.css'
const pika =
  'https://images.aeonmedia.co/images/dd0bf9c1-6a76-4416-895a-8f9d95367efb/sized-025pikachu.jpg?width=1920&quality=75&format=auto'
const AfterNavLinks = async ({ payload, searchParams, i18n, user, ...rest }: ServerProps) => {
  if (!user) {
    return null
  }
  return (
    <div className={styles.container}>
      <div className={styles.avatar} style={{ backgroundImage: `url(${pika})` }}></div>
      <div className={styles.column}>
        <p className={styles.name}>
          {user.name} {user.surname}
        </p>
        <p className={styles.description}>
          {user.currentRole?.name}: {user.email}
        </p>
      </div>
    </div>
  )
}
export default AfterNavLinks
