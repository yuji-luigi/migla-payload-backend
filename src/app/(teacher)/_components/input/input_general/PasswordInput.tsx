'use client'
import React, { useState } from 'react'
import { InputGeneral, InputGeneralProps } from './InputGeneral'

export const PasswordInput = (props: InputGeneralProps & Omit<InputGeneralProps, 'type'>) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <InputGeneral
      type={showPassword ? 'text' : 'password'}
      trailingComponent={
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
          />
          show
        </label>
      }
      {...props}
    />
  )
}
