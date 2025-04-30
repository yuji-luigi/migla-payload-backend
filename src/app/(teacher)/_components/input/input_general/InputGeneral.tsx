import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Width } from '../Width'
import { InputType } from '@/types/html/input_types'
import styles from './InputGeneral.module.css'
export interface InputGeneralProps {
  blockName?: string
  defaultValue?: string
  label?: string
  name: string
  required?: boolean
  /** the percentage */
  width?: number
  type?: InputType
  trailingComponent?: React.ReactNode
}

export const InputGeneral: React.FC<InputGeneralProps> = ({
  name,
  defaultValue,
  label,
  required,
  /** the percentage */
  width,
  type,
  trailingComponent,
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
      <div className="relative w-full h-full">
        {trailingComponent && <span className={styles.trailingComponent}>{trailingComponent}</span>}
        <Input
          defaultValue={defaultValue}
          id={name}
          type={type || 'text'}
          name={name}
          autoComplete="current-password"
        />

        {/* {errors[name] && <InputError />} */}
      </div>
    </Width>
  )
}
