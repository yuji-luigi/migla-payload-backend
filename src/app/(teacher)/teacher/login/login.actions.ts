'use server'

import { redirect } from 'next/navigation'

export async function loginTeacher(prevState: any, formData: FormData) {
  const email = formData.get('email') as string | undefined
  const password = formData.get('password') as string | undefined
  console.log(email, password)
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
    // throw new Error(data.message || 'Login failed')
    console.log('data', data)
    return {
      error: data.message || 'ログインに失敗しました。ログイン情報を確認してください',
      values: { email, password },
    }
  }
  console.log('login successful')
  redirect('/teacher/dashboard')
}
