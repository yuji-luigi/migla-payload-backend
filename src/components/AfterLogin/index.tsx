'use client'
import { I18n } from '@payloadcms/translations'
import { Button, Link, useTranslation } from '@payloadcms/ui'
import { User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Payload } from 'payload'

import CardIconAction from '../Card/CardIconAction'
import styles from './AfterLogin.module.css'
import type { CustomTranslations, CustomTranslationsKeys } from '../../lib/i18n/i18n_configs'

// const styles = {}
const AfterLogin = (props: { payload: Payload; i18n: I18n }) => {
  const searchParams = useSearchParams()
  const { t } = useTranslation<CustomTranslations, CustomTranslationsKeys>()
  const hasRoleInUrl = !!searchParams.get('role')
  const isTeacher = searchParams.get('role') === '3'
  console.log(t)
  return (
    <>
      <div
        data-login-role-present={hasRoleInUrl}
        className={`${styles.container} ${styles.selectRoleSection}`}
      >
        <h2>{t('authentication:Login as')}</h2>
        <div className={styles.roleCards}>
          <CardIconAction title="Admin" href="/admin/login?role=2" Icon={<User size={16} />} />
          <CardIconAction title="Teacher" href="/teacher/login" Icon={<User size={16} />} />
        </div>
      </div>
      {isTeacher && (
        <Button
          onClick={() => {
            fetch('/api/users/login', {
              method: 'POST',
              body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
            })
          }}
          className={styles.loginButton}
        >
          Login
        </Button>
      )}
      <div
        data-login-role-present={hasRoleInUrl}
        data-login-role-id={searchParams.get('role')}
        className={`${styles.container} ${styles.roleLinks}`}
      >
        <Link href="/admin/login?role=2">If you are an admin</Link>
        <Link href="/teacher/login?role=3">If you are an teacher</Link>
      </div>{' '}
    </>
  )
}

export default AfterLogin
