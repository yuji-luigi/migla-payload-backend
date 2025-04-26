// teacher/app/api/login/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log('login')
  console.log(request.formData)
  const formData = await request.formData()
  console.log(formData.get('email'))
  const data = Object.fromEntries(formData.entries())
  console.log(data)
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login?role=3`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: data.email, password: data.password }),
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(responseData.message || 'Login failed')
    return NextResponse.json({ error: responseData.message || 'Login failed' }, { status: 401 })
  }

  // Set cookies or redirect as needed
  const res = NextResponse.redirect(new URL('/teacher/dashboard', request.url))
  res.cookies.set('token', responseData.token, { httpOnly: true, path: '/' }) // Example setting token cookie
  return res
}
