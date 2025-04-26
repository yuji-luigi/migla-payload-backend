import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { InputError } from '../InputError'
import { Width } from '../Width'

export const InputGeneral: React.FC<TextField> = ({
  name,
  defaultValue,
  label,
  required,
  /** the percentage */
  width,
}) => {
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
      <Input defaultValue={defaultValue} id={name} type="text" name={name} />
      {/* {errors[name] && <InputError />} */}
    </Width>
  )
}
