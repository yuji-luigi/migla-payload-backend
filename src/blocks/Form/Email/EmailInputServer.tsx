import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const EmailInputServer: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, errors, label, required, width }) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Input id={name} type="text" />

      {/* {errors[name] && <Error name={name} />} */}
    </Width>
  )
}
