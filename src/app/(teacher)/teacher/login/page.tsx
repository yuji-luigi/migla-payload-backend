'use client'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { Button } from '../../../../components/ui/button'
import { InputGeneral } from '../../_components/input/input_general/InputGeneral'
import Error from './error'
import styles from './page.module.css'
import { loginTeacher } from './login.actions'
import { useActionState } from 'react'
import { PasswordInput } from '../../_components/input/input_general/PasswordInput'

const TeacherLoginPage = () => {
  const [state, formAction, pending] = useActionState(loginTeacher, {
    error: '',
    values: { email: '', password: '' },
  })

  return (
    <section className={styles.loginSection}>
      <form method="POST" action={formAction}>
        <div className={styles.card}>
          <ErrorBoundary errorComponent={Error}>
            <div className={styles.cardHeader}>
              <h2>先生方のログイン</h2>
              <img src="/images/migla-logo-square.png" height={100} width={100} alt="logo" />
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
          </ErrorBoundary>
          <Button disabled={pending} className={styles.loginButton} variant="default" type="submit">
            ログイン
          </Button>
        </div>
      </form>
    </section>
  )
}

export default TeacherLoginPage
