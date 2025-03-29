import { I18NConfig } from 'next/dist/server/config-shared'
import { Payload } from 'payload'
import styles from './AfterLogin.module.css'
import { Button, Link, TextInput } from '@payloadcms/ui'
import { Divide } from 'lucide-react'
import { Card } from '../Card'

// const styles = {}
const AfterLogin = (props: {
  payload: Payload
  i18n: I18NConfig
  searchParams: Record<string, string>
}) => {
  const hasRoleInUrl: string = (!!props.searchParams.role).toString()
  return (
    <>
      <div
        data-login-role-present={hasRoleInUrl}
        className={`${styles.container} ${styles.roleNotPresentContainer}`}
      >
        <h2>Login as</h2>
        <div>
          <Card
            href="/admin/login?role=teacher"
            title={<div className={styles.cardTitle}>Teacher</div>}
          >
            children
          </Card>

          <Card title="Student">kjh</Card>

          <Card title="Admin"></Card>
        </div>
      </div>
      <div data-login-role-present={hasRoleInUrl} className={styles.container}>
        <Link href="/admin/login?role=teacher">If you are an teacher</Link>
        <Link href="/admin/login?role=student">If you are an student</Link>
        <Link href="/admin/login?role=admin">If you are an admin</Link>
      </div>
      <Button>Click me</Button>
      <TextInput label="Name" path="name" />
    </>
  )
}

export default AfterLogin
