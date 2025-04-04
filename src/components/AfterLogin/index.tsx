'use client'
import { Button, Link } from '@payloadcms/ui'
import { User } from 'lucide-react'
import { I18NConfig } from 'next/dist/server/config-shared'
import { Payload } from 'payload'
import CardIconAction from '../Card/CardIconAction'
import styles from './AfterLogin.module.css'
import { useSearchParams } from 'next/navigation'

// const styles = {}
const AfterLogin = (props: {
  payload: Payload
  i18n: I18NConfig
  searchParams: Record<string, string>
}) => {
  const searchParams = useSearchParams()
  const hasRoleInUrl = !!searchParams.get('role')
  return (
    <>
      <div
        data-login-role-present={hasRoleInUrl}
        className={`${styles.container} ${styles.selectRoleSection}`}
      >
        <h2>Login as</h2>
        <div className={styles.roleCards}>
          <CardIconAction title="Admin" href="/admin/login?role=2" Icon={<User size={16} />} />
          <CardIconAction title="Teacher" href="/admin/login?role=3" Icon={<User size={16} />} />
        </div>
      </div>
      <div
        data-login-role-present={hasRoleInUrl}
        className={`${styles.container} ${styles.roleLinks}`}
      >
        <Link href="/admin/login?role=3">If you are an teacher</Link>
        <Link href="/admin/login?role=2">If you are an admin</Link>
      </div>{' '}
    </>
  )
}

export default AfterLogin
