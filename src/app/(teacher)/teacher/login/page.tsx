'use client'
import { useActionState } from 'react'
import { Button } from '../../../../components/ui/button'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'
import { InputGeneral } from '../../_components/input/input_general/InputGeneral'
import { PasswordInput } from '../../_components/input/input_general/PasswordInput'
import { loginTeacher } from './login.actions'
import styles from './page.module.css'
import { useTFunc } from '../../i18n/useTFunc'
import Image from 'next/image'

const TeacherLoginPage = () => {
  const [state, formAction, pending] = useActionState(loginTeacher, {
    error: '',
    values: { email: '', password: '' },
  })
  const { t } = useTFunc()
  return (
    <section className={styles.loginSection}>
      <form method="POST" action={formAction}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>{t('先生方のログイン')}</h2>
            <Image src="/images/migla-logo-square.png" height={100} width={100} alt="logo" />
          </div>
          {state.error && <p className="text-red-500 text-center">{state.error}</p>}
          <div className={styles.inputSection}>
            <InputGeneral
              name="email"
              label="メールアドレス"
              required
              defaultValue={state.values.email}
              width={80}
              type="email"
            />
            <PasswordInput
              name="password"
              label="パスワード"
              required
              width={80}
              defaultValue={state.values.password}
            />
          </div>
          <Button disabled={pending} className={styles.loginButton} variant="default" type="submit">
            ログイン
          </Button>
        </div>
      </form>
    </section>
  )
}

export default TeacherLoginPage
