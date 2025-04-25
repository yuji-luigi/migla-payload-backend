'use client'
import React from 'react'
import styles from './page.module.css'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import { TextField } from '@payloadcms/ui'
import { Email } from '../../../../blocks/Form/Email'
import { useForm } from 'react-hook-form'
import { Text } from '../../../../blocks/Form/Text'
const LoginTeacher = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  return (
    <section className={styles.loginSection}>
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
            width={100}
            register={register}
            errors={errors}
          />
          <Text
            blockType=""
            name="password"
            label="パスワード"
            required
            width={100}
            register={register}
            errors={errors}
          />
        </div>
        <Button className={styles.loginButton} variant="default">
          ログイン
        </Button>
      </div>
    </section>
  )
}

export default LoginTeacher
