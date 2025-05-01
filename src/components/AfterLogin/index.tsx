'use client'
import { I18n } from '@payloadcms/translations'
import { Button, Card } from '@payloadcms/ui'

import { Link, useTranslation } from '@payloadcms/ui'
import { User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Payload } from 'payload'

import type { CustomTranslations, CustomTranslationsKeys } from '../../lib/i18n/i18n_configs'
import CardIconAction from '../Card/CardIconAction'
import styles from './AfterLogin.module.css'

const AfterLogin = (props: { payload: Payload; i18n: I18n }) => {
  const searchParams = useSearchParams()
  const { t } = useTranslation<CustomTranslations, CustomTranslationsKeys>()
  const hasRoleInUrl = !!searchParams.get('role')
  const isTeacher = searchParams.get('role') === '3'
  return (
    <>
      <div
        data-login-role-present={hasRoleInUrl}
        className={`${styles.container} ${styles.selectRoleSection}`}
      >
        <h2>{t('authentication:Login as')}</h2>
        <div className={styles.roleCards}>
          <CardIconAction
            title={t('authentication:Admin')}
            href="/admin/login?role=2"
            Icon={<User size={16} />}
          />
          <CardIconAction
            title={t('authentication:Teacher')}
            href="/teacher/login"
            Icon={
              <Link className={styles.iconLink} href="/teacher/login">
                <User size={16} />
              </Link>
            }
          />
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
        <Link href="/admin/login?role=2">{t('authentication:If you are an admin')}</Link>
        <Link href="/teacher/login?role=3">{t('authentication:If you are an teacher')}</Link>
      </div>{' '}
    </>
  )
}

export default AfterLogin
