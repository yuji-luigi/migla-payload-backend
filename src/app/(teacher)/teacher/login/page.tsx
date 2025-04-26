'use client'
import { FormProvider, useForm } from 'react-hook-form'
import { Email } from '../../../../blocks/Form/Email'
import { Text } from '../../../../blocks/Form/Text'
import { Button } from '../../../../components/ui/button'
import styles from './page.module.css'
const LoginTeacher = () => {
  const methods = useForm()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods
  const onSubmit = (data: any) => {
    console.log(data)
  }
  return (
    <section className={styles.loginSection}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>先生方のログイン</h2>
              <img src="/images/migla-logo-square.png" height={100} width={100} alt="logo" />
            </div>
            <div className={styles.inputSection}>
              <Email
                blockType="email"
                name="email"
                label="メールアドレス"
                required
                register={register}
                errors={errors}
                width={80}
              />
              <Text
                blockType="text"
                name="password"
                label="パスワード"
                required
                register={register}
                errors={errors}
                width={80}
              />
            </div>
            <Button className={styles.loginButton} variant="default" type="submit">
              ログイン
            </Button>
          </div>
        </FormProvider>
      </form>
    </section>
  )
}

export default LoginTeacher
