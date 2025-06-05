'use server'

import { redirect } from 'next/navigation'
import { getLocalI18n } from 'payload'

export async function loginTeacher(prevState: any, formData: FormData) {
  const email = formData.get('email') as string | undefined
  const password = formData.get('password') as string | undefined
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login?role=3`, {
    // server will impost cookie to the client.
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      error: data.errors[0].message || 'ログインに失敗しました。ログイン情報を確認してください',
      values: { email, password },
    }
  }
  redirect('/teacher/dashboard')
}
