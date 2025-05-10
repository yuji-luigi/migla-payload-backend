// 'use client'
// import { I18n } from '@payloadcms/translations'
// import { Button, Card } from '@payloadcms/ui'

import { Payload } from 'payload'
import styles from './AfterLogin.module.css'
import CardIconAction from '../Card/CardIconAction'
import { I18n } from '@payloadcms/translations'
import { CustomTranslations, CustomTranslationsKeys } from '../../lib/i18n/i18n_configs'
import { User } from 'lucide-react'
import Link from 'next/link'
// import { Link, useTranslation } from '@payloadcms/ui'
// import { User } from 'lucide-react'
// import { useSearchParams } from 'next/navigation'
// import { Payload } from 'payload'

// import type { CustomTranslations, CustomTranslationsKeys } from '../../lib/i18n/i18n_configs'
// import CardIconAction from '../Card/CardIconAction'
// import styles from './AfterLogin.module.css'
// import CircleBoxDecorationBG from '../decorations'

const AfterLogin = async ({
  payload,
  searchParams,
  i18n,
  ...rest
}: {
  payload: Payload
  searchParams: Record<string, string>
  i18n: I18n
}) => {
  // console.log(payload)
  const roleDocs = await payload.find({
    collection: 'roles',
    where: {
      name: {
        not_equals: 'super_admin',
      },
    },
  })
  const hasRoleInUrl = !!searchParams.role
  const { t } = i18n as unknown as I18n<CustomTranslations, CustomTranslationsKeys>
  return (
    <>
      <div
        data-login-role-present={hasRoleInUrl}
        className={`${styles.container} ${styles.selectRoleSection}`}
      >
        <h2>{t('authentication:Login as')}</h2>
        <div className={styles.roleCards}>
          {roleDocs.docs.map((role) => (
            <CardIconAction
              key={role.id}
              title={role.label}
              href={`/admin/login?role=${role.id}`}
              Icon={<User size={16} />}
            />
          ))}
        </div>
      </div>

      <div
        data-login-role-present={hasRoleInUrl}
        data-login-role-id={searchParams.role}
        className={`${styles.container} ${styles.roleLinks}`}
      >
        {roleDocs.docs
          .filter((role) => role.id != Number(searchParams.role))
          .map((role) => (
            <Link key={role.id} href={`/admin/login?role=${role.id}`}>
              {t(`authentication:If you are an`, { role: role.label })}
            </Link>
          ))}
      </div>
    </>
  )
}

// const AfterLogin = (props: { payload: Payload; i18n: I18n }) => {
//   const searchParams = useSearchParams()
//   const { t } = useTranslation<CustomTranslations, CustomTranslationsKeys>()
//   const hasRoleInUrl = !!searchParams.get('role')
//   const isTeacher = searchParams.get('role') === '3'
//   return (
//     <>
//       <div
//         data-login-role-present={hasRoleInUrl}
//         className={`${styles.container} ${styles.selectRoleSection}`}
//       >
//         <h2>{t('authentication:Login as')}</h2>
//         <div className={styles.roleCards}>
//           <CardIconAction
//             title={t('authentication:Admin')}
//             href="/admin/login?role=2"
//             Icon={<User size={16} />}
//           />
//           <CardIconAction
//             title={t('authentication:Admin')}
//             href="/admin/login?role=3"
//             Icon={<User size={16} />}
//           />
//           <CardIconAction
//             title={t('authentication:Teacher')}
//             href="/teacher/login"
//             Icon={<User size={16} />}
//           />
//         </div>
//       </div>
//       {/* {isTeacher && (
//         <Button
//           onClick={() => {
//             fetch('/api/users/login', {
//               method: 'POST',
//               body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
//             })
//           }}
//           className={styles.loginButton}
//         >
//           Login
//         </Button>
//       )} */}
//       <div
//         data-login-role-present={hasRoleInUrl}
//         data-login-role-id={searchParams.get('role')}
//         className={`${styles.container} ${styles.roleLinks}`}
//       >
//         <Link href="/admin/login?role=2">{t('authentication:If you are an admin')}</Link>
//         <Link href="/teacher/login?role=3">{t('authentication:If you are an teacher')}</Link>
//       </div>
//     </>
//   )
// }

export default AfterLogin
